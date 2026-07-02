#!/usr/bin/env node
// scripts/typefully-schedule-backlog.mjs
//
// The bridge between the schedule (content/social/backlog.md) and the copy
// (the batch files). It:
//   1. parses the "Daily posting schedule" table in backlog.md
//   2. for each tweet cell, resolves the actual tweet text from its batch file
//      (by source anchor + Standalone letter)
//   3. schedules each tweet into Typefully via scripts/typefully-push.mjs at a
//      specific date/time
//
// Copy lives in the batch files (single source of truth). This script never
// duplicates it — it reads it fresh each run. Safe by default: DRY-RUN unless
// you pass --send.
//
// Usage:
//   node scripts/typefully-schedule-backlog.mjs               # dry-run, all rows
//   node scripts/typefully-schedule-backlog.mjs --from 2026-07-02 --to 2026-07-11
//   node scripts/typefully-schedule-backlog.mjs --limit 4     # first 4 tweets only
//   node scripts/typefully-schedule-backlog.mjs --send        # REAL — creates drafts
//   node scripts/typefully-schedule-backlog.mjs --print       # just print resolved copy
//
// Options:
//   --from <YYYY-MM-DD>  only rows on/after this date
//   --to   <YYYY-MM-DD>  only rows on/before this date
//   --limit <n>          cap number of tweets processed
//   --send               actually POST to Typefully (needs TYPEFULLY_API_KEY)
//   --print              print resolved tweet text and exit (no Typefully call)
//   --time1 <HH:MM>      posting time for tweet 1 each day (default 09:00)
//   --time2 <HH:MM>      posting time for tweet 2 each day (default 14:00)
//   --tz <±HH:MM>        timezone offset for schedule (default +02:00, Madrid CEST)
//   --share              ask Typefully for a shareable draft URL

import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const SOCIAL = join(REPO, "content", "social");
const BACKLOG = join(SOCIAL, "backlog.md");
const PUSH = join(__dirname, "typefully-push.mjs");

function parseArgs(argv) {
  const a = { from: null, to: null, limit: Infinity, send: false, print: false,
              time1: "09:00", time2: "14:00", tz: "+02:00",
              socialSet: process.env.TYPEFULLY_SOCIAL_SET_ID || null, platform: "x", linkedin: false };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--from") a.from = argv[++i];
    else if (t === "--to") a.to = argv[++i];
    else if (t === "--limit") a.limit = parseInt(argv[++i], 10);
    else if (t === "--send") a.send = true;
    else if (t === "--print") a.print = true;
    else if (t === "--time1") a.time1 = argv[++i];
    else if (t === "--time2") a.time2 = argv[++i];
    else if (t === "--tz") a.tz = argv[++i];
    else if (t === "--social-set") a.socialSet = argv[++i];
    else if (t === "--platform") a.platform = argv[++i];
    else if (t === "--linkedin") { a.linkedin = true; a.platform = "linkedin"; }
    else if (t === "-h" || t === "--help") { help(); process.exit(0); }
    else { process.stderr.write(`unknown arg: ${t}\n`); process.exit(2); }
  }
  return a;
}
function help() {
  process.stdout.write("See header comment in scripts/typefully-schedule-backlog.mjs for usage.\n");
}

// GitHub-style heading slug (matches the anchors used in backlog links)
function slug(title) {
  return title.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

// Extract one Standalone's text from a batch file.
// If anchor is given, scope to that idea section first (MU/VI restart letters per idea).
function extractStandalone(fileText, letter, anchor) {
  let scope = fileText;
  if (anchor) {
    const lines = fileText.split("\n");
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^##\s+(.+?)\s*(\{#[\w-]+\})?\s*$/);
      if (m && (slug(m[1]) === anchor || (m[2] && m[2].slice(2, -1) === anchor))) { start = i; break; }
    }
    if (start === -1) throw new Error(`anchor #${anchor} not found`);
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) if (/^##\s+/.test(lines[i])) { end = i; break; }
    scope = lines.slice(start, end).join("\n");
  }
  // find "**Standalone X —" ... up to next Standalone / --- / ## / ### heading
  const re = new RegExp(`\\*\\*Standalone\\s+${letter}\\s+[—-][^\\n]*\\*\\*[^\\n]*\\n`, "");
  const m = scope.match(re);
  if (!m) throw new Error(`Standalone ${letter}${anchor ? " in #" + anchor : ""} not found`);
  const after = scope.slice(m.index + m[0].length);
  // stop at the next block boundary
  const stop = after.search(/\n(?:---|\*\*Standalone |###?\s|>\s*\*\*Scheduled)/);
  const body = (stop === -1 ? after : after.slice(0, stop)).trim();
  // drop any leading "> **Scheduled:** ..." status line if present
  return body.split("\n").filter(l => !/^>\s*\*\*(Scheduled|Status)/.test(l)).join("\n").trim();
}

// Parse a tweet cell like: **MU** research · stop/do [A](process/foo.md#anchor)
function parseCell(cell) {
  const link = cell.match(/\[([^\]]+)\]\(([^)#]+)(?:#([^)]+))?\)/);
  if (!link) return null;
  const letter = link[1].trim();
  if (!/^[A-Z]$/.test(letter)) return null; // skip legacy/blog/"published" links
  const tag = (cell.match(/\*\*([A-Z0-9]+)\*\*/) || [])[1] || "?";
  return { tag, letter, path: link[2].trim(), anchor: link[3] || null };
}

async function discoverSocialSet() {
  const key = process.env.TYPEFULLY_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.typefully.com/v2/social-sets", {
    headers: { Authorization: `Bearer ${key}` },
  });
  const data = await res.json();
  const sets = data.results || [];
  if (sets.length === 1) return sets[0].id;
  if (sets.length === 0) throw new Error("no Typefully social sets found for this key");
  throw new Error(`multiple social sets (${sets.map(s => `${s.id}:${s.username}`).join(", ")}) — pass --social-set <id>`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Resolve the social set (needed for send/dry-run, not for --print)
  let socialSetId = args.socialSet;
  if (!args.print && !socialSetId) {
    socialSetId = (await discoverSocialSet()) || "SOCIAL_SET_ID";
  }

  const md = await readFile(BACKLOG, "utf8");
  const allLines = md.split("\n");

  // Scope to one section so the tweet table and LinkedIn table never collide.
  const header = args.linkedin ? "## LinkedIn schedule" : "## Daily posting schedule";
  const start = allLines.findIndex(l => l.trim() === header);
  if (start === -1) throw new Error(`section "${header}" not found in backlog.md`);
  let end = allLines.length;
  for (let i = start + 1; i < allLines.length; i++) if (/^## /.test(allLines[i])) { end = i; break; }
  const lines = allLines.slice(start, end);

  const fileCache = new Map();
  const readBatch = async (rel) => {
    const p = join(SOCIAL, rel);
    if (!fileCache.has(p)) fileCache.set(p, await readFile(p, "utf8"));
    return fileCache.get(p);
  };

  // flatten to scheduled posts (LinkedIn: one per row, blog rows have no link and are skipped)
  const jobs = [];
  for (const line of lines) {
    const m = line.match(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|/);
    if (!m) continue;
    const date = m[1];
    if (args.from && date < args.from) continue;
    if (args.to && date > args.to) continue;
    const cols = line.split("|").map(c => c.trim());
    if (args.linkedin) {
      const c = parseCell(line);
      if (!c) continue;
      jobs.push({ ...c, date, when: `${date}T${args.time1}:00${args.tz}` });
    } else {
      for (const [cell, time] of [[cols[3], args.time1], [cols[4], args.time2]]) {
        const c = parseCell(cell || "");
        if (!c) continue;
        jobs.push({ ...c, date, when: `${date}T${time}:00${args.tz}` });
      }
    }
  }
  const limited = jobs.slice(0, args.limit);

  let ok = 0, fail = 0;
  for (const job of limited) {
    if (args.send && Date.parse(job.when) < Date.now()) {
      process.stdout.write(`⤼ skip (past slot)  ${job.date} ${job.when} · ${job.tag} ${job.letter}\n`);
      continue;
    }
    let text;
    try {
      const batch = await readBatch(job.path);
      text = extractStandalone(batch, job.letter, job.anchor);
    } catch (e) {
      fail++;
      process.stdout.write(`✗ ${job.date} ${job.tag} ${job.letter}  — RESOLVE FAILED: ${e.message}\n`);
      continue;
    }

    if (args.print) {
      process.stdout.write(`\n── ${job.date} ${job.when} · ${job.tag} ${job.letter} ──\n${text}\n`);
      ok++;
      continue;
    }

    const pushArgs = ["--stdin", "--social-set", String(socialSetId), "--platform", args.platform,
                      "--schedule", job.when, "--json"];
    if (!args.send) pushArgs.push("--dry-run");
    try {
      const out = execFileSync("node", [PUSH, ...pushArgs], { input: text, encoding: "utf8" });
      const res = JSON.parse(out);
      const mark = args.send ? (res.ok ? "✓ sent" : "✗ send-failed") : "· dry";
      process.stdout.write(`${mark}  ${job.date} ${job.when} · ${job.tag} ${job.letter} · "${text.slice(0, 48).replace(/\n/g, " ")}…"\n`);
      if (args.send && !res.ok) { fail++; process.stdout.write(`   ${JSON.stringify(res)}\n`); }
      else ok++;
    } catch (e) {
      fail++;
      process.stdout.write(`✗ ${job.date} ${job.tag} ${job.letter} — PUSH ERROR: ${e.message}\n`);
    }
  }

  process.stdout.write(`\n${args.send ? "SENT" : args.print ? "PRINTED" : "DRY-RUN"}: ${ok} ok, ${fail} failed, of ${limited.length} tweets ` +
    `(${jobs.length} total in range).\n`);
  if (!args.send && !args.print) process.stdout.write("Re-run with --send to actually create Typefully drafts.\n");
}

main().catch(e => { process.stderr.write(`unexpected: ${e.stack || e}\n`); process.exit(1); });
