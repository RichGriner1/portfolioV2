#!/usr/bin/env node
// scripts/typefully-push.mjs
//
// Thin Typefully API client for the /push workflow. It does ONE job: take a
// block of post text and create a Typefully draft (optionally scheduled). It
// does not parse markdown — the /push command extracts clean text and pipes it
// here. Keeps the fragile/judgment part in the LLM and the deterministic part
// in code, matching how /syndicate is structured.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  TODO-VERIFY — these defaults could NOT be checked against Typefully's docs
//     at build time: this environment's egress policy blocks typefully.com AND
//     api.typefully.com (proxy returns 403 on CONNECT). Confirm each item below
//     against https://typefully.com/ai-agents + the Typefully API reference
//     before the first real (non --dry-run) send. Everything questionable is in
//     the CONFIG block so a fix is one line.
//
//     1. Base URL + path     → assumed POST https://api.typefully.com/v1/drafts/
//     2. Auth header         → assumed header "X-API-KEY", value "Bearer <key>"
//     3. Body fields         → assumed { content, threadify, share, "schedule-date" }
//     4. Thread delimiter    → assumed 4 newlines between tweets marks a thread
//     5. schedule-date value → assumed ISO-8601 string, or literal "next-free-slot"
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  baseUrl: process.env.TYPEFULLY_BASE_URL || "https://api.typefully.com/v1",
  draftsPath: "/drafts/",
  authHeaderName: "X-API-KEY",
  // Typefully documents the value as "Bearer <key>". If your key is meant to be
  // sent raw, set TYPEFULLY_AUTH_SCHEME="" (empty) in the environment.
  authScheme: process.env.TYPEFULLY_AUTH_SCHEME ?? "Bearer ",
  // The string the API expects to schedule into the next open queue slot.
  nextSlotLiteral: "next-free-slot",
};

function usage(msg) {
  if (msg) process.stderr.write(`\nerror: ${msg}\n`);
  process.stderr.write(`
Usage:
  node scripts/typefully-push.mjs --content-file <path> [options]
  cat post.txt | node scripts/typefully-push.mjs --stdin [options]

Options:
  --content-file <path>   Read post text from a file (UTF-8).
  --stdin                 Read post text from stdin instead.
  --threadify             Ask Typefully to auto-split long text into a thread.
                          (Omit if your text already uses 4-newline breaks.)
  --schedule <when>       ISO-8601 datetime (e.g. 2026-06-29T09:00:00Z) or the
                          literal "next" to use Typefully's next free queue slot.
  --share                 Return a shareable draft URL in the response.
  --dry-run               Print the exact request without sending. DEFAULT-SAFE:
                          use this until the TODO-VERIFY items are confirmed.
  --json                  Emit machine-readable JSON (for the /push command to
                          capture the draft id). Implies quiet.
  -h, --help              Show this help.

Auth:
  Requires TYPEFULLY_API_KEY in the environment (Typefully → Settings →
  Integrations/API; paid plans). Never commit the key. --dry-run does not need it.
`);
  process.exit(msg ? 2 : 0);
}

function parseArgs(argv) {
  const a = {
    contentFile: null, stdin: false, threadify: false, schedule: null,
    share: false, dryRun: false, json: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    switch (t) {
      case "-h": case "--help": usage(); break;
      case "--content-file": a.contentFile = argv[++i]; break;
      case "--stdin": a.stdin = true; break;
      case "--threadify": a.threadify = true; break;
      case "--schedule": a.schedule = argv[++i]; break;
      case "--share": a.share = true; break;
      case "--dry-run": a.dryRun = true; break;
      case "--json": a.json = true; break;
      default: usage(`unknown argument: ${t}`);
    }
  }
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

function resolveSchedule(when) {
  if (!when) return undefined;
  if (when.toLowerCase() === "next") return CONFIG.nextSlotLiteral;
  // Light sanity check; the API is the source of truth on format.
  if (Number.isNaN(Date.parse(when))) {
    usage(`--schedule must be an ISO-8601 datetime or "next" (got: ${when})`);
  }
  return when;
}

function buildRequest(content, args) {
  const url = CONFIG.baseUrl.replace(/\/$/, "") + CONFIG.draftsPath;
  const body = { content };
  if (args.threadify) body.threadify = true;
  if (args.share) body.share = true;
  const sched = resolveSchedule(args.schedule);
  if (sched) body["schedule-date"] = sched;
  const headers = { "Content-Type": "application/json" };
  const key = process.env.TYPEFULLY_API_KEY;
  headers[CONFIG.authHeaderName] = key ? `${CONFIG.authScheme}${key}` : "<TYPEFULLY_API_KEY missing>";
  return { url, headers, body };
}

function redact(headers) {
  const h = { ...headers };
  if (h[CONFIG.authHeaderName] && process.env.TYPEFULLY_API_KEY) {
    h[CONFIG.authHeaderName] = `${CONFIG.authScheme}***redacted***`;
  }
  return h;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const content = await readContent(args);
  if (!content) usage("post content is empty");

  const req = buildRequest(content, args);

  if (args.dryRun) {
    const preview = {
      method: "POST", url: req.url, headers: redact(req.headers), body: req.body,
    };
    if (args.json) process.stdout.write(JSON.stringify({ dryRun: true, request: preview }, null, 2) + "\n");
    else {
      process.stdout.write("\n── DRY RUN (nothing sent) ──\n");
      process.stdout.write(`POST ${preview.url}\n`);
      process.stdout.write(`headers: ${JSON.stringify(preview.headers)}\n`);
      process.stdout.write(`body:\n${JSON.stringify(preview.body, null, 2)}\n\n`);
    }
    return;
  }

  if (!process.env.TYPEFULLY_API_KEY) {
    usage("TYPEFULLY_API_KEY is not set (required for a real send; use --dry-run to preview)");
  }

  let res, text;
  try {
    res = await fetch(req.url, { method: "POST", headers: req.headers, body: JSON.stringify(req.body) });
    text = await res.text();
  } catch (e) {
    process.stderr.write(`\nnetwork error calling Typefully: ${e.message}\n` +
      `(if this is a 403/blocked host, your environment's egress policy may not allow api.typefully.com)\n`);
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
    const share = parsed && typeof parsed === "object" ? (parsed.share_url ?? parsed.url) : undefined;
    if (share) process.stdout.write(`  url: ${share}\n`);
  }
}

main().catch((e) => { process.stderr.write(`\nunexpected: ${e.stack || e}\n`); process.exit(1); });
