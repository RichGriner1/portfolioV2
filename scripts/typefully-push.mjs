#!/usr/bin/env node
// scripts/typefully-push.mjs
//
// Thin Typefully API v2 client for the /push workflow. One job: take a block of
// post text and create a Typefully draft (optionally scheduled, on a chosen
// platform). It does not parse markdown — the caller (the /push command or
// typefully-schedule-backlog.mjs) extracts clean text and pipes it here.
//
// API v2 (v1 was disabled by Typefully mid-2026):
//   POST https://api.typefully.com/v2/social-sets/{social_set_id}/drafts
//   Authorization: Bearer <key>
//   body: { platforms: { <platform>: { enabled: true, posts: [{ text }] } }, publish_at? }
//   publish_at: ISO-8601 datetime | "now" | "next-free-slot" | (omit = plain draft)
//   threads: multiple {text} objects in the posts array
//   docs: https://typefully.com/docs/api

const CONFIG = {
  baseUrl: process.env.TYPEFULLY_BASE_URL || "https://api.typefully.com",
  nextSlotLiteral: "next-free-slot",
  defaultPlatform: "x",
  validPlatforms: ["x", "linkedin", "mastodon", "threads", "bluesky"],
};

function usage(msg) {
  if (msg) process.stderr.write(`\nerror: ${msg}\n`);
  process.stderr.write(`
Usage:
  node scripts/typefully-push.mjs --content-file <path> --social-set <id> [options]
  cat post.txt | node scripts/typefully-push.mjs --stdin --social-set <id> [options]

Options:
  --content-file <path>   Read post text from a file (UTF-8).
  --stdin                 Read post text from stdin instead.
  --social-set <id>       Typefully social set id (or env TYPEFULLY_SOCIAL_SET_ID).
  --platform <name>       x | linkedin | mastodon | threads | bluesky (default: x).
  --threadify             Split text on blank-line runs (4+ newlines) into a thread.
  --schedule <when>       ISO-8601 datetime, "now", or "next" (Typefully next slot).
                          Omit to save as a plain unscheduled draft.
  --dry-run               Print the exact request without sending. DEFAULT-SAFE.
  --json                  Emit machine-readable JSON.
  -h, --help              Show this help.

Auth:
  Requires TYPEFULLY_API_KEY in the environment (Typefully → Settings → API).
  --dry-run does not need it.
`);
  process.exit(msg ? 2 : 0);
}

function parseArgs(argv) {
  const a = {
    contentFile: null, stdin: false, socialSet: process.env.TYPEFULLY_SOCIAL_SET_ID || null,
    platform: CONFIG.defaultPlatform, threadify: false, schedule: null, dryRun: false, json: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    switch (t) {
      case "-h": case "--help": usage(); break;
      case "--content-file": a.contentFile = argv[++i]; break;
      case "--stdin": a.stdin = true; break;
      case "--social-set": a.socialSet = argv[++i]; break;
      case "--platform": a.platform = argv[++i]; break;
      case "--threadify": a.threadify = true; break;
      case "--schedule": a.schedule = argv[++i]; break;
      case "--dry-run": a.dryRun = true; break;
      case "--json": a.json = true; break;
      default: usage(`unknown argument: ${t}`);
    }
  }
  if (!CONFIG.validPlatforms.includes(a.platform)) usage(`--platform must be one of: ${CONFIG.validPlatforms.join(", ")}`);
  return a;
}

async function readContent(args) {
  const { readFile } = await import("node:fs/promises");
  if (args.contentFile) return (await readFile(args.contentFile, "utf8")).trim();
  if (args.stdin) {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    return Buffer.concat(chunks).toString("utf8").trim();
  }
  usage("provide --content-file <path> or --stdin");
}

function resolvePublishAt(when) {
  if (!when) return undefined;
  const w = when.toLowerCase();
  if (w === "next") return CONFIG.nextSlotLiteral;
  if (w === "now") return "now";
  if (Number.isNaN(Date.parse(when))) usage(`--schedule must be ISO-8601, "now", or "next" (got: ${when})`);
  return when;
}

function buildRequest(content, args) {
  if (!args.socialSet) usage("provide --social-set <id> or set TYPEFULLY_SOCIAL_SET_ID");
  const url = `${CONFIG.baseUrl.replace(/\/$/, "")}/v2/social-sets/${args.socialSet}/drafts`;
  const posts = args.threadify
    ? content.split(/\n{4,}/).map(t => ({ text: t.trim() })).filter(p => p.text)
    : [{ text: content }];
  const body = { platforms: { [args.platform]: { enabled: true, posts } } };
  const publishAt = resolvePublishAt(args.schedule);
  if (publishAt) body.publish_at = publishAt;
  const headers = { "Content-Type": "application/json" };
  const key = process.env.TYPEFULLY_API_KEY;
  headers.Authorization = key ? `Bearer ${key}` : "Bearer <TYPEFULLY_API_KEY missing>";
  return { url, headers, body };
}

function redact(headers) {
  const h = { ...headers };
  if (h.Authorization && process.env.TYPEFULLY_API_KEY) h.Authorization = "Bearer ***redacted***";
  return h;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const content = await readContent(args);
  if (!content) usage("post content is empty");

  const req = buildRequest(content, args);

  if (args.dryRun) {
    const preview = { method: "POST", url: req.url, headers: redact(req.headers), body: req.body };
    if (args.json) process.stdout.write(JSON.stringify({ dryRun: true, request: preview }, null, 2) + "\n");
    else {
      process.stdout.write("\n── DRY RUN (nothing sent) ──\n");
      process.stdout.write(`POST ${preview.url}\n`);
      process.stdout.write(`headers: ${JSON.stringify(preview.headers)}\n`);
      process.stdout.write(`body:\n${JSON.stringify(preview.body, null, 2)}\n\n`);
    }
    return;
  }

  if (!process.env.TYPEFULLY_API_KEY) usage("TYPEFULLY_API_KEY is not set (use --dry-run to preview)");

  let res, text;
  try {
    res = await fetch(req.url, { method: "POST", headers: req.headers, body: JSON.stringify(req.body) });
    text = await res.text();
  } catch (e) {
    process.stderr.write(`\nnetwork error calling Typefully: ${e.message}\n`);
    process.exit(1);
  }

  let parsed; try { parsed = JSON.parse(text); } catch { parsed = text; }
  if (!res.ok) {
    if (args.json) process.stdout.write(JSON.stringify({ ok: false, status: res.status, response: parsed }) + "\n");
    else process.stderr.write(`\nTypefully returned ${res.status}:\n${text}\n`);
    process.exit(1);
  }

  if (args.json) process.stdout.write(JSON.stringify({ ok: true, status: res.status, response: parsed }) + "\n");
  else {
    process.stdout.write(`\n✓ Draft created (HTTP ${res.status}).\n`);
    const id = parsed && typeof parsed === "object" ? (parsed.id ?? parsed.draft_id) : undefined;
    if (id) process.stdout.write(`  id: ${id}\n`);
  }
}

main().catch((e) => { process.stderr.write(`\nunexpected: ${e.stack || e}\n`); process.exit(1); });
