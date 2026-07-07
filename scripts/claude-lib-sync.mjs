#!/usr/bin/env node
// claude-lib-sync.mjs — publish the portable Claude library from this repo
// (.claude/lib/{skills,commands,agents}) into user scope (~/.claude/…) via
// per-entry symlinks, so the skills/loops are available in every project.
//
// Usage:
//   node scripts/claude-lib-sync.mjs            # dry-run: print the plan (default)
//   node scripts/claude-lib-sync.mjs --apply    # create/repair the symlinks
//   node scripts/claude-lib-sync.mjs --check     # report drift; exit 1 if any
//
// Idempotent and additive: it only touches entries that exist in .claude/lib.
// Existing user-scope items are left alone. It never clobbers a real file/dir —
// only symlinks it owns (ones already pointing into this repo's lib) are repaired.

import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const libRoot = path.join(repoRoot, ".claude", "lib");
const userRoot = path.join(os.homedir(), ".claude");
const CATEGORIES = ["skills", "commands", "agents"];

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const CHECK = args.has("--check");
const MODE = APPLY ? "apply" : CHECK ? "check" : "dry-run";

const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};
const paint = (s, col) => `${c[col]}${s}${c.reset}`;

async function exists(p) {
  try {
    await fs.lstat(p);
    return true;
  } catch {
    return false;
  }
}

// Classify what should happen for one src → dest pair.
async function plan(src, dest) {
  let st;
  try {
    st = await fs.lstat(dest);
  } catch {
    return { action: "create" };
  }

  if (st.isSymbolicLink()) {
    const target = path.resolve(path.dirname(dest), await fs.readlink(dest));
    if (target === src) return { action: "ok" };
    return { action: "relink", detail: `symlink → ${target}` };
  }
  return {
    action: "conflict",
    detail: st.isDirectory() ? "real directory" : "real file",
  };
}

async function run() {
  if (!(await exists(libRoot))) {
    console.error(paint(`No library found at ${libRoot}`, "red"));
    process.exit(1);
  }

  console.log(paint(`claude-lib-sync — ${MODE}`, "cyan"));
  console.log(paint(`  from ${libRoot}`, "dim"));
  console.log(paint(`  into ${userRoot}`, "dim"));
  console.log("");

  let created = 0,
    relinked = 0,
    ok = 0,
    conflicts = 0,
    drift = 0;

  for (const category of CATEGORIES) {
    const srcDir = path.join(libRoot, category);
    if (!(await exists(srcDir))) continue;

    const destDir = path.join(userRoot, category);
    if (APPLY) await fs.mkdir(destDir, { recursive: true });

    const entries = (await fs.readdir(srcDir, { withFileTypes: true })).filter(
      (e) => !e.name.startsWith(".")
    ); // skip .DS_Store etc.

    for (const entry of entries) {
      const src = path.join(srcDir, entry.name);
      const dest = path.join(destDir, entry.name);
      const rel = `${category}/${entry.name}`;
      const { action, detail } = await plan(src, dest);

      switch (action) {
        case "ok":
          ok++;
          console.log(
            `  ${paint("✓", "green")} ${rel} ${paint("(linked)", "dim")}`
          );
          break;
        case "create":
        case "relink":
          drift++;
          if (APPLY) {
            if (action === "relink") await fs.unlink(dest);
            await fs.symlink(src, dest);
            action === "relink" ? relinked++ : created++;
            console.log(
              `  ${paint("+", "green")} ${rel} ${paint("→ linked", "dim")}`
            );
          } else {
            console.log(
              `  ${paint(action === "relink" ? "~" : "+", "yellow")} ${rel} ${paint(`would ${action}` + (detail ? ` (was ${detail})` : ""), "dim")}`
            );
          }
          break;
        case "conflict":
          conflicts++;
          console.log(
            `  ${paint("✗", "red")} ${rel} ${paint(`CONFLICT: ${detail} exists — not touching it`, "red")}`
          );
          break;
      }
    }
  }

  console.log("");
  if (MODE === "apply") {
    console.log(
      paint(
        `Done. ${created} created, ${relinked} relinked, ${ok} already correct, ${conflicts} conflicts.`,
        "cyan"
      )
    );
    if (conflicts) {
      console.log(
        paint(
          "Resolve conflicts by removing the real files, then re-run.",
          "yellow"
        )
      );
      process.exit(1);
    }
  } else if (MODE === "check") {
    console.log(
      paint(`${drift} to sync, ${ok} correct, ${conflicts} conflicts.`, "cyan")
    );
    if (drift || conflicts) {
      console.log(
        paint("Out of sync — run: npm run claude:sync:apply", "yellow")
      );
      process.exit(1);
    }
    console.log(paint("Everything in sync.", "green"));
  } else {
    console.log(
      paint(
        `Dry run: ${drift} would sync, ${ok} already correct, ${conflicts} conflicts.`,
        "cyan"
      )
    );
    console.log(paint("Apply with: npm run claude:sync:apply", "dim"));
  }
}

run().catch((err) => {
  console.error(paint(String(err?.stack || err), "red"));
  process.exit(1);
});
