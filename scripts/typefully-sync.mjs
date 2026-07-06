#!/usr/bin/env node
// scripts/typefully-sync.mjs
//
// The reconciler. Makes Typefully match content/social/backlog.md.
//
// The scheduler (typefully-schedule-backlog.mjs) is create-only: re-running it
// duplicates. This script closes the loop. It treats backlog.md as the single
// source of truth and brings the live Typefully queue into line with it:
//   - a row in the backlog with no live draft   -> CREATE (POST)
//   - a row whose time moved                     -> RESCHEDULE (PATCH publish_at)
//   - a row whose copy changed                   -> EDIT (PATCH platforms text)
//   - a live draft whose row was removed         -> ORPHAN (reported; DELETE only with --prune)
//
// Identity: each post is keyed by a stable CONTENT KEY
//   `${platform}|${batchPath}|${anchor}|${StandaloneLetter}`
// so a tweet keeps its identity when it slides to a different date. The
// key->draftId map is stored locally in content/social/.typefully-state.json
// and bootstrapped by --adopt (matching live drafts to backlog rows by their
// stable post text).
//
// SAFE BY DEFAULT: prints a dry-run diff and writes nothing unless --send.
// DELETE never happens without --prune. The API key is read from the
// environment at call time and never printed.
//
// Typefully API v2 (see scripts/typefully-push.mjs header + https://typefully.com/docs/api):
//   GET    /v2/social-sets/{id}/drafts?limit=50&offset=0   -> { results:[{id, scheduled_date, status, platforms}], count, next }
//   PATCH  /v2/social-sets/{id}/drafts/{draftId}           body: { publish_at?, platforms? } (partial)
//   DELETE /v2/social-sets/{id}/drafts/{draftId}           -> 204
//   POST   /v2/social-sets/{id}/drafts                     body: { platforms:{[p]:{enabled,posts:[{text}]}}, publish_at? }
// NOTE the read/write asymmetry: reads expose `scheduled_date`, writes take `publish_at`.
//
// Usage:
//   node scripts/typefully-sync.mjs --list                 # read-only: print live drafts (verify API shape)
//   node scripts/typefully-sync.mjs --list --json > live.json
//   node scripts/typefully-sync.mjs --adopt                # bootstrap the key->draftId map from live drafts
//   node scripts/typefully-sync.mjs                        # dry-run diff (default; no writes)
//   node scripts/typefully-sync.mjs --live-file live.json  # dry-run against a saved snapshot (no API call)
//   node scripts/typefully-sync.mjs --send                 # apply CREATE + PATCH (no deletes)
//   node scripts/typefully-sync.mjs --send --prune         # also DELETE orphaned drafts
//
// Scope flags (passed through to the emitter so `when` matches how rows were scheduled):
//   --platform x|linkedin  (default x)   --from / --to / --limit
//   --time1 HH:MM (09:00)  --time2 HH:MM (14:00)  --time3 HH:MM (11:30)  --tz ±HH:MM (+02:00)
//   --social-set <id>      (or env TYPEFULLY_SOCIAL_SET_ID)

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const SOCIAL = join(REPO, "content", "social");
const EMITTER = join(__dirname, "typefully-schedule-backlog.mjs");
const STATE_FILE = join(SOCIAL, ".typefully-state.json");
const BASE_URL = (process.env.TYPEFULLY_BASE_URL || "https://api.typefully.com").replace(/\/$/, "");

function parseArgs(argv) {
  const a = { platform: "x", from: null, to: null, limit: null,
              time1: "09:00", time2: "14:00", time3: "11:30", tz: "+02:00",
              socialSet: process.env.TYPEFULLY_SOCIAL_SET_ID || null,
              list: false, adopt: false, send: false, prune: false, json: false, liveFile: null };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--platform") a.platform = argv[++i];
    else if (t === "--from") a.from = argv[++i];
    else if (t === "--to") a.to = argv[++i];
    else if (t === "--limit") a.limit = argv[++i];
    else if (t === "--time1") a.time1 = argv[++i];
    else if (t === "--time2") a.time2 = argv[++i];
    else if (t === "--time3") a.time3 = argv[++i];
    else if (t === "--tz") a.tz = argv[++i];
    else if (t === "--social-set") a.socialSet = argv[++i];
    else if (t === "--list") a.list = true;
    else if (t === "--adopt") a.adopt = true;
    else if (t === "--send") a.send = true;
    else if (t === "--prune") a.prune = true;
    else if (t === "--json") a.json = true;
    else if (t === "--live-file") a.liveFile = argv[++i];
    else if (t === "-h" || t === "--help") { help(); process.exit(0); }
    else { process.stderr.write(`unknown arg: ${t}\n`); process.exit(2); }
  }
  return a;
}
function help() {
  process.stdout.write("See header comment in scripts/typefully-sync.mjs for usage.\n");
}

const norm = (s) => (s || "").replace(/\r\n/g, "\n").trim();
const eq = (isoA, isoB) => Date.parse(isoA) === Date.parse(isoB);

function requireKey() {
  const key = process.env.TYPEFULLY_API_KEY;
  if (!key) {
    process.stderr.write("TYPEFULLY_API_KEY is not set. Export it in this shell before running.\n");
    process.exit(1);
  }
  return key;
}

async function api(method, path, body) {
  const key = requireKey();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 429) {
    process.stderr.write(`rate limited (429). Retry after ${res.headers.get("X-RateLimit-User-Reset") || "a bit"}.\n`);
    process.exit(1);
  }
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
  return json;
}

// Resolve the social set: use the passed/env id, else ask Typefully. If the
// account has exactly one set we adopt it silently; more than one is ambiguous
// so we make the caller choose. Skipped when reading from a --live-file.
async function resolveSocialSet(args) {
  if (args.socialSet || args.liveFile) return;
  const data = await api("GET", "/v2/social-sets");
  const sets = data.results || [];
  if (sets.length === 1) {
    args.socialSet = sets[0].id;
    process.stderr.write(`social set: auto-selected ${sets[0].id} (${sets[0].username || "?"})\n`);
    return;
  }
  if (sets.length === 0) { process.stderr.write("no Typefully social sets found for this key.\n"); process.exit(2); }
  process.stderr.write(`multiple social sets — pass --social-set <id>:\n${sets.map((s) => `  ${s.id}  ${s.username || "?"}`).join("\n")}\n`);
  process.exit(2);
}

// --- desired state (from backlog.md, via the emitter) ---
function loadDesired(args) {
  const emitArgs = ["--emit"];
  if (args.platform === "linkedin") emitArgs.push("--linkedin");
  if (args.from) emitArgs.push("--from", args.from);
  if (args.to) emitArgs.push("--to", args.to);
  if (args.limit) emitArgs.push("--limit", String(args.limit));
  emitArgs.push("--time1", args.time1, "--time2", args.time2, "--time3", args.time3, "--tz", args.tz);
  let out;
  try {
    // stderr inherited so emit warnings are visible; non-zero exit throws below.
    out = execFileSync("node", [EMITTER, ...emitArgs], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  } catch (e) {
    process.stderr.write("aborting: could not build a complete desired state from backlog.md (see emit errors above).\n");
    process.exit(1);
  }
  return JSON.parse(out); // [{ contentKey, when, platform, text, ... }]
}

// --- live state (from Typefully, or a saved --live-file snapshot) ---
// The list endpoint returns a TRUNCATED `preview` (…-suffixed), flat
// `<platform>_post_enabled` flags, and `scheduled_date` — not the nested
// `platforms.<p>.posts[].text` that the WRITE endpoints take. So we identify
// drafts by scheduled time (a clean 1:1 key here) and use `preview` only as a
// best-effort text check.
async function loadLive(args) {
  if (args.liveFile) {
    const raw = JSON.parse(await readFile(args.liveFile, "utf8"));
    return (Array.isArray(raw) ? raw : raw.results || []);
  }
  const setId = args.socialSet;
  if (!setId) { process.stderr.write("no social set — pass --social-set <id> or set TYPEFULLY_SOCIAL_SET_ID\n"); process.exit(2); }
  const all = [];
  let offset = 0;
  for (;;) {
    const page = await api("GET", `/v2/social-sets/${setId}/drafts?limit=50&offset=${offset}`);
    const results = page.results || [];
    all.push(...results);
    if (!page.next || results.length < 50) break; // null next OR a short page = last page
    offset += results.length;
  }
  return all;
}
// keep only drafts on our platform that can still be changed (not already published)
function liveForPlatform(drafts, platform) {
  return drafts
    .filter((d) => d?.[`${platform}_post_enabled`])
    .filter((d) => d.status !== "published" && d.status !== "publishing")
    .map((d) => ({ id: d.id, when: d.scheduled_date ?? d.publish_at ?? null, status: d.status, preview: norm(d.preview || "") }));
}

// `preview` is the tweet text truncated with a trailing ellipsis. Treat a row as
// unchanged when the desired text starts with that stem. If the stem is empty we
// can't tell, so assume unchanged (never push an edit we can't verify).
function previewMatches(desiredText, preview) {
  const core = norm(preview).replace(/(\.\.\.|…)$/, "").trim();
  if (!core) return true;
  return norm(desiredText).startsWith(core);
}

async function loadState() {
  if (!existsSync(STATE_FILE)) return { socialSet: null, map: {} };
  return JSON.parse(await readFile(STATE_FILE, "utf8"));
}
async function saveState(state) {
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
}

// Index live drafts by their scheduled instant (epoch ms). Each backlog slot has
// a unique time and each live draft one scheduled_date, so this is a clean key.
function indexByInstant(live, claimed) {
  const m = new Map();
  for (const d of live) {
    if (claimed.has(d.id) || !d.when) continue;
    const k = Date.parse(d.when);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(d);
  }
  return m;
}

// Match backlog rows to live drafts by scheduled time; write the key->id map.
function adopt(desired, live, state) {
  const claimed = new Set(Object.values(state.map).map((v) => v.draftId));
  const byInstant = indexByInstant(live, claimed);
  let matched = 0; const unmatched = [];
  for (const row of desired) {
    if (state.map[row.contentKey]) { matched++; continue; }
    const cands = (byInstant.get(Date.parse(row.when)) || []).filter((x) => !claimed.has(x.id));
    if (cands.length === 1) {
      state.map[row.contentKey] = { draftId: cands[0].id, when: row.when };
      claimed.add(cands[0].id); matched++;
    } else if (cands.length > 1) {
      unmatched.push(`${row.contentKey}  (AMBIGUOUS: ${cands.length} live drafts at ${row.when})`);
    } else {
      unmatched.push(`${row.contentKey}  (no live draft at ${row.when} — will be CREATEd)`);
    }
  }
  return { matched, unmatched };
}

// Compute the actions needed to make Typefully match the backlog.
// Mutates state.map to record any live drafts adopted by text match (persisted only on --send).
function plan(desired, live, state) {
  const now = Date.now();
  const liveById = new Map(live.map((d) => [d.id, d]));
  const claimed = new Set(Object.values(state.map).map((v) => v.draftId));
  const unclaimedByInstant = indexByInstant(live, claimed);

  const usedIds = new Set();
  const creates = [], reschedules = [], edits = [], missing = [], skippedPast = [];
  for (const row of desired) {
    let link = state.map[row.contentKey];
    let d = link ? liveById.get(link.draftId) : null;

    // No stored link — try to adopt an unclaimed live draft at the same scheduled
    // time before deciding to create. This is what stops a forgotten --adopt (or
    // a renamed content key) from re-creating a post that already exists.
    if (!link) {
      const cands = (unclaimedByInstant.get(Date.parse(row.when)) || []).filter((x) => !claimed.has(x.id));
      if (cands.length === 1) {
        d = liveById.get(cands[0].id);
        state.map[row.contentKey] = { draftId: cands[0].id, when: row.when };
        claimed.add(cands[0].id);
        link = state.map[row.contentKey];
      }
    }

    // Known draft that has vanished from the live queue (published or deleted
    // externally). NEVER re-create it — that's the duplicate-post footgun.
    if (link && !d) { missing.push({ row, id: link.draftId }); continue; }

    if (!d) {
      if (Date.parse(row.when) < now) { skippedPast.push(row); continue; } // don't schedule into the past
      creates.push(row);
      continue;
    }

    usedIds.add(d.id);
    if (Date.parse(row.when) < now) { skippedPast.push(row); continue; } // already exists and in the past — leave it
    if (!d.when || !eq(d.when, row.when)) reschedules.push({ row, from: d.when, to: row.when, id: d.id });
    if (!previewMatches(row.text, d.preview)) edits.push({ row, id: d.id });
  }
  const orphans = live.filter((d) => !usedIds.has(d.id));
  return { creates, reschedules, edits, missing, skippedPast, orphans };
}

function printPlan(p, args) {
  const line = (s) => process.stdout.write(s + "\n");
  line("");
  line(`── sync plan (${args.platform}) ──`);
  line(`CREATE     ${p.creates.length}`);
  line(`RESCHEDULE ${p.reschedules.length}`);
  line(`EDIT       ${p.edits.length}`);
  line(`ORPHAN     ${p.orphans.length}${p.orphans.length && !args.prune ? "  (reported only — pass --prune to DELETE)" : ""}`);
  if (p.missing.length) line(`MISSING    ${p.missing.length}  (known drafts gone from live — published or deleted; NOT re-created)`);
  if (p.skippedPast.length) line(`SKIP-PAST  ${p.skippedPast.length}  (slot time already passed)`);
  line("");
  for (const r of p.creates) line(`  + CREATE      ${r.when}  ${r.tag} ${r.letter}  "${r.text.slice(0, 46).replace(/\n/g, " ")}…"`);
  for (const r of p.reschedules) line(`  ~ RESCHEDULE  ${r.from} -> ${r.to}  ${r.row.tag} ${r.row.letter}`);
  for (const r of p.edits) line(`  ~ EDIT text   ${r.row.when}  ${r.row.tag} ${r.row.letter}`);
  for (const d of p.orphans) line(`  ${args.prune ? "- DELETE" : "! ORPHAN"}      ${d.when || "(unscheduled)"}  #${d.id} [${d.status}]  "${d.preview.slice(0, 40).replace(/\n/g, " ")}…"`);
  for (const m of p.missing) line(`  ? MISSING     #${m.id}  ${m.row.tag} ${m.row.letter}  (run --adopt to reconcile if this is wrong)`);
  line("");
}

async function apply(p, state, args) {
  const setId = args.socialSet;
  let done = 0, failed = 0;
  for (const row of p.creates) {
    try {
      const body = { platforms: { [args.platform]: { enabled: true, posts: [{ text: row.text }] } }, publish_at: row.when };
      const res = await api("POST", `/v2/social-sets/${setId}/drafts`, body);
      const id = res?.id ?? res?.draft_id;
      if (id) state.map[row.contentKey] = { draftId: id, when: row.when };
      process.stdout.write(`  ✓ CREATE     ${row.when}  ${row.tag} ${row.letter}  #${id}\n`); done++;
    } catch (e) { failed++; process.stdout.write(`  ✗ CREATE     ${row.tag} ${row.letter} — ${e.message}\n`); }
  }
  for (const r of p.reschedules) {
    try {
      await api("PATCH", `/v2/social-sets/${setId}/drafts/${r.id}`, { publish_at: r.to });
      if (state.map[r.row.contentKey]) state.map[r.row.contentKey].when = r.to;
      process.stdout.write(`  ✓ RESCHEDULE #${r.id}  -> ${r.to}\n`); done++;
    } catch (e) { failed++; process.stdout.write(`  ✗ RESCHEDULE #${r.id} — ${e.message}\n`); }
  }
  for (const r of p.edits) {
    try {
      await api("PATCH", `/v2/social-sets/${setId}/drafts/${r.id}`, { platforms: { [args.platform]: { posts: [{ text: r.row.text }] } } });
      process.stdout.write(`  ✓ EDIT       #${r.id}  ${r.row.tag} ${r.row.letter}\n`); done++;
    } catch (e) { failed++; process.stdout.write(`  ✗ EDIT       #${r.id} — ${e.message}\n`); }
  }
  if (args.prune) {
    for (const d of p.orphans) {
      try {
        await api("DELETE", `/v2/social-sets/${setId}/drafts/${d.id}`);
        process.stdout.write(`  ✓ DELETE     #${d.id}\n`); done++;
      } catch (e) { failed++; process.stdout.write(`  ✗ DELETE     #${d.id} — ${e.message}\n`); }
    }
  }
  return { done, failed };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.send && !args.liveFile) requireKey(); // fail fast before any reads if we intend to write
  await resolveSocialSet(args); // auto-pick the set when there's exactly one

  // --list: read-only. Print the live queue so we can verify the API shape.
  if (args.list) {
    const drafts = await loadLive(args);
    if (args.json) { process.stdout.write(JSON.stringify(drafts, null, 2) + "\n"); return; }
    const rows = liveForPlatform(drafts, args.platform)
      .sort((a, b) => Date.parse(a.when || 0) - Date.parse(b.when || 0));
    process.stdout.write(`\n── live drafts (${args.platform}, editable) : ${rows.length} ──\n`);
    for (const r of rows) process.stdout.write(`  #${r.id}  ${r.when || "(unscheduled)"} [${r.status}]  "${r.preview.slice(0, 52).replace(/\n/g, " ")}…"\n`);
    process.stdout.write(`\n(${drafts.length} total drafts across all platforms/statuses)\n`);
    return;
  }

  const desired = loadDesired(args);
  const live = liveForPlatform(await loadLive(args), args.platform);
  const state = await loadState();
  if (!state.socialSet && args.socialSet) state.socialSet = args.socialSet;

  // --adopt: match live drafts to backlog rows by text, write the id map, stop.
  if (args.adopt) {
    const { matched, unmatched } = adopt(desired, live, state);
    await saveState(state);
    process.stdout.write(`\nadopt: ${matched} matched, ${unmatched.length} unmatched.\n`);
    for (const u of unmatched) process.stdout.write(`  · ${u}\n`);
    process.stdout.write(`\nwrote ${STATE_FILE}\n`);
    return;
  }

  const p = plan(desired, live, state);
  printPlan(p, args);

  if (!args.send) {
    process.stdout.write("DRY-RUN — nothing sent. Re-run with --send to apply (add --prune to delete orphans).\n");
    return;
  }
  const { done, failed } = await apply(p, state, args);
  await saveState(state);
  process.stdout.write(`\nAPPLIED: ${done} ok, ${failed} failed. State written to ${STATE_FILE}\n`);
}

main().catch((e) => { process.stderr.write(`unexpected: ${e.stack || e}\n`); process.exit(1); });
