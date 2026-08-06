#!/usr/bin/env node
/**
 * Responsive check — loads every route at every breakpoint and fails on the
 * class of bug that keeps shipping here: a change lands on desktop and nobody
 * looks at 320px until it's live.
 *
 * Written after the site header shipped as `grid-cols-[1fr_auto_1fr]` with no
 * mobile variant. It looked right at 1280 and pushed the CV / language / theme
 * controls 17px off the right edge at 320. Nothing in lint, build, or a desktop
 * screenshot catches that — only geometry at a narrow width does.
 *
 * Once, up front:
 *   0. Every header nav link resolves (HTTP < 400). A link can lay out perfectly
 *      at all six widths and still 404 — which `/writing` did, because the
 *      `[slug]` route was committed and the index `page.tsx` was not.
 *
 * Then per route × width:
 *   1. The page does not scroll horizontally, and the layout viewport hasn't
 *      stretched past the device (the mobile tell for the same bug).
 *   2. No visible box is clipped by its own `overflow: hidden|clip`.
 *   3. No visible element extends past the left or right viewport edge.
 *   4. Every nav target is present, in-bounds, and — on touch widths — big
 *      enough to tap. The CV modal is opened and measured too.
 *
 * Findings are `error` (blocking) or `warn` (tap-target judgement calls).
 *
 * Usage:
 *   npm run check:responsive                          # starts its own dev server
 *   npm run check:responsive -- --url http://localhost:3000
 *   npm run check:responsive -- --shots               # also write screenshots
 *   npm run check:responsive -- --widths 320,375 --routes /,/writing
 *
 * Uses the system Chrome via Playwright's `channel: "chrome"`, so CI/dev boxes
 * don't need a 130MB browser download. Set CHROME_CHANNEL to override.
 */

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

/**
 * Widths, not device names. 320 is the floor (iPhone SE 1st gen, and the width
 * Chrome's smallest preset uses); 375 and 390 are the current iPhone bodies; 768
 * and 1024 straddle Tailwind's `md`/`lg`; 1440 is the desktop the work gets
 * designed at. The two that catch nearly everything are 320 and 768 — the floor
 * and the tablet seam where `sm:` variants have kicked in but the layout is
 * still narrow.
 */
const WIDTHS = [320, 375, 390, 768, 1024, 1440];

/**
 * Routes are listed rather than crawled: the crawl would have to render every
 * case study and post to find its links, and the layout shells are shared. One
 * of each shell is enough — home (bento), index (projects/writing), a case
 * study, and a post.
 */
const ROUTES = [
  "/",
  "/projects",
  "/writing",
  // Two different case-study shells, not one. /work/visual-identity is a bespoke
  // route with its own figures; /work/[slug] renders CaseStudyPage, which nothing
  // here covered until a change to its "More case studies" grid went unchecked.
  "/work/visual-identity",
  "/work/mindfulme",
  "/writing/loops-and-skills-are-components",
  // Same writing shell as the post above, but it carries six figures that exist
  // nowhere else — a side-by-side tree comparison, a 4-column bento, and a
  // three-layer token cascade, all of which are the kind of horizontal layout that
  // breaks at 320px. The shell is covered; these layouts weren't.
  "/writing/modern-ui-2026",
];

/**
 * Nav must survive every width. The header is the thing that broke, and a
 * header that overflows still "passes" an overflow check if the browser lets
 * the body scroll — so the targets get named and checked directly.
 *
 * 24px is the WCAG 2.2 AA minimum target size (2.5.8). The icon buttons in the
 * header are 32px, so this is a floor with headroom, not a tight fit.
 */
const MIN_TAP = 24;

/**
 * Selectors, not elements — each one is resolved to its FIRST VISIBLE match at
 * probe time, because the header renders two layouts and hides one.
 *
 * The crab is a menu button at every width and Home / Projects / Writing / CV live
 * inside the panel it opens, so the runner has to open the menu before these
 * resolve. First-visible still matters: the panel is mounted only while open, and
 * anything left hidden by a breakpoint must not be mistaken for the live instance.
 */
const NAV_TARGETS = [
  {
    name: "menu button (the crab)",
    selector: 'header button[aria-controls="site-menu"]',
  },
  { name: "home link", selector: 'header a[href="/"]' },
  { name: "projects link", selector: 'header a[href="/projects"]' },
  { name: "writing link", selector: 'header a[href="/writing"]' },
  { name: "CV button", selector: "header button", text: "CV" },
];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

// Matches the .gitignore entry — keep the two in step or the shots show up as
// untracked files after every run.
const SHOTS_DIR = "responsive-check-shots";

// Narrowing the sweep while chasing one bug: the full run is 5 routes × 6 widths
// and takes a few minutes, which is too slow to iterate against.
const widths = opt("widths", null)
  ? opt("widths", "").split(",").map(Number)
  : WIDTHS;
const routes = opt("routes", null) ? opt("routes", "").split(",") : ROUTES;

/**
 * Runs in the page. Returns findings, not booleans — a failure has to name the
 * element or it's not actionable.
 *
 * The ignore rules exist because a naive `scrollWidth > clientWidth` sweep is
 * pure noise: anything deliberately scrollable (a code block, an overflow-x
 * carousel) trips it, and so does every ancestor of a genuine offender. So:
 * skip elements opted into scrolling, and report only the outermost offender in
 * any subtree.
 */
function collectFindings({ minTap, navTargets, touch, deviceWidth }) {
  /**
   * The emulated device width, passed in from Node — NOT `window.innerWidth`.
   * Under mobile emulation Chrome widens the layout viewport to fit overflowing
   * content, exactly as a phone does when a page has no `width=device-width`
   * constraint on its overflow. So an overflowing page reports
   * `innerWidth === scrollWidth` and a naive comparison finds nothing wrong,
   * while the user sees a zoomed-out page. The device width can't lie.
   */
  const vw = deviceWidth;
  const findings = [];

  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls =
      typeof el.className === "string" && el.className
        ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
        : "";
    const text = (el.textContent || "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 40);
    return `${el.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ""}`;
  };

  const isHidden = (el, cs, rect) => {
    if (cs.display === "none" || cs.visibility === "hidden") return true;
    // Mid-animation elements are transparent but laid out; they still count for
    // geometry, so only treat a *permanently* hidden element as absent.
    if (el.closest("[aria-hidden='true']") && rect.width === 0) return true;
    // The sr-only pattern: 1px clipped box parked off-canvas on purpose.
    if (rect.width <= 1 && rect.height <= 1) return true;
    return false;
  };

  const scrollableX = (cs) => ["auto", "scroll"].includes(cs.overflowX);
  const scrollable = (cs) =>
    scrollableX(cs) || ["auto", "scroll"].includes(cs.overflowY);

  /**
   * A deliberate horizontal scroller makes its own children out-of-bounds by
   * design — the handoff-timeline figure is a `min-w-[560px]` row inside an
   * `overflow-x-auto` box, and reading it by swiping is the intent. Without this
   * exemption the check reported five findings for a figure that is correct.
   */
  const inScroller = (el) => {
    for (
      let p = el.parentElement;
      p && p !== document.body;
      p = p.parentElement
    ) {
      if (scrollableX(getComputedStyle(p))) return true;
    }
    return false;
  };

  // 1. Page-level horizontal scroll, and the mobile variant of it: the layout
  //    viewport quietly growing past the device so the whole page renders
  //    zoomed out.
  const docW = document.documentElement.scrollWidth;
  if (docW > vw + 1) {
    findings.push({
      severity: "error",
      kind: "page-scrolls-horizontally",
      detail: `document is ${docW}px wide on a ${vw}px device (+${docW - vw}px)`,
    });
  }
  if (window.innerWidth > vw + 1) {
    findings.push({
      severity: "error",
      kind: "layout-viewport-expanded",
      detail: `layout viewport stretched to ${window.innerWidth}px on a ${vw}px device — the page renders zoomed out`,
    });
  }

  // 2. Clipped containers + 3. out-of-bounds boxes.
  const clipped = [];
  const outOfBounds = [];
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (isHidden(el, cs, rect)) continue;

    /**
     * `hidden`/`clip` only. An `overflow: visible` box whose content is wider
     * than it reports the same `scrollWidth > clientWidth`, but nothing is lost
     * — the content simply paints outside, which several things here do on
     * purpose (the "Let's talk" video escapes its 13px word-slot to overlap the
     * line). If that overflow actually reaches off-screen, the page-scroll and
     * out-of-bounds checks catch it there, correctly described. Scrollable boxes
     * are exempt for the obvious reason.
     */
    const clips = ["hidden", "clip"].includes(cs.overflowX);
    if (clips && !scrollable(cs) && el.scrollWidth > el.clientWidth + 1) {
      clipped.push({
        el,
        detail: `content is ${el.scrollWidth}px inside a ${el.clientWidth}px box (+${el.scrollWidth - el.clientWidth}px), and overflow-x is ${cs.overflowX} — the excess is cut off`,
      });
    }

    // Only leaf-ish text/interactive nodes for bounds, or the check reports a
    // wrapper and all 12 of its children as separate findings.
    const interactive = el.matches("a, button, input, select, textarea");
    const hasOwnText = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim()
    );
    if (
      (interactive || hasOwnText) &&
      (rect.right > vw + 1 || rect.left < -1) &&
      !inScroller(el)
    ) {
      outOfBounds.push({
        el,
        detail: `spans ${Math.round(rect.left)}→${Math.round(rect.right)}px in a ${vw}px viewport`,
      });
    }
  }

  // Outermost offender only.
  const outermost = (list) =>
    list.filter((a) => !list.some((b) => b.el !== a.el && b.el.contains(a.el)));

  for (const { el, detail } of outermost(clipped)) {
    findings.push({
      severity: "error",
      kind: "clipped-content",
      detail,
      target: describe(el),
    });
  }
  for (const { el, detail } of outermost(outOfBounds)) {
    findings.push({
      severity: "error",
      kind: "outside-viewport",
      detail,
      target: describe(el),
    });
  }

  // 4. Nav reachability.
  const firstVisible = (selector, text) => {
    for (const el of document.querySelectorAll(selector)) {
      if (text !== undefined && el.textContent.trim() !== text) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (el.getBoundingClientRect().width === 0) continue;
      return el;
    }
    return null;
  };
  for (const { name, selector, text } of navTargets) {
    const el = firstVisible(selector, text);
    if (!el) {
      findings.push({
        severity: "error",
        kind: "nav-missing",
        detail: `${name} (${selector}) has no visible instance`,
      });
      continue;
    }
    const rect = el.getBoundingClientRect();
    if (rect.right > vw + 1 || rect.left < -1) {
      findings.push({
        severity: "error",
        kind: "nav-unreachable",
        detail: `${name} spans ${Math.round(rect.left)}→${Math.round(rect.right)}px in a ${vw}px viewport`,
      });
    }
    // Only where a finger is the pointer. Reported as a warning, not a failure:
    // it's a judgement call about hit area, where the geometry checks above are
    // unambiguous breakage. Running it at 1440px produced 60 findings about
    // mouse targets and buried the two real bugs.
    if (touch && (rect.width < minTap || rect.height < minTap)) {
      findings.push({
        severity: "warn",
        kind: "nav-tap-target",
        detail: `${name} is ${Math.round(rect.width)}×${Math.round(rect.height)}px, under the ${minTap}px minimum`,
      });
    }
  }

  return findings;
}

/** Kills the whole process group, not just the npm wrapper. */
function stopServer(server) {
  if (!server) return;
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    server.kill("SIGTERM");
  }
}

async function waitForServer(url, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok || res.status < 500) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function main() {
  let url = opt("url", null);
  let server = null;

  if (!url) {
    url = "http://localhost:3000";
    // Reuse a dev server if one is already listening — starting a second one
    // makes Next pick port 3001 and the check would test nothing.
    if (!(await waitForServer(url, 1200))) {
      console.log("· no server on :3000, starting `next dev`…");
      // `detached` so it gets its own process group: `npm run dev` forks `next
      // dev`, and killing only npm leaves Next holding :3000 — the next run then
      // "reuses" a server from a stale build.
      server = spawn("npm", ["run", "dev"], {
        stdio: "ignore",
        detached: true,
      });
      if (!(await waitForServer(url))) {
        stopServer(server);
        throw new Error("dev server never came up on :3000");
      }
    } else {
      console.log("· reusing the server already on :3000");
    }
  }

  const browser = await chromium.launch({
    channel: process.env.CHROME_CHANNEL || "chrome",
  });
  const failures = [];
  const warned = [];
  const deadLinks = [];
  const shots = flag("shots");
  if (shots) await mkdir(SHOTS_DIR, { recursive: true });

  try {
    /**
     * Before measuring anything: do the header's own links actually resolve?
     * A nav item can be laid out perfectly at all six widths and still be
     * broken, and the geometry sweep would pass it every time.
     *
     * This caught `/writing` — the header linked to it, `[slug]` was committed
     * but the index `page.tsx` was not, so the link rendered fine locally and
     * would have 404'd the moment it deployed.
     */
    const navHrefs = [
      ...new Set(
        NAV_TARGETS.map((t) => /href="([^"]+)"/.exec(t.selector)?.[1]).filter(
          Boolean
        )
      ),
    ];
    for (const href of navHrefs) {
      const res = await fetch(`${url}${href}`, { redirect: "follow" });
      if (!res.ok) {
        deadLinks.push({ href, status: res.status });
        console.log(`✗ nav link ${href} → HTTP ${res.status}`);
      } else {
        console.log(`✓ nav link ${href} → HTTP ${res.status}`);
      }
    }

    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        // Under 768 Playwright should behave like a phone, or hover-only styles
        // (`[@media(hover:hover)]`, which this repo leans on) resolve the
        // desktop way and the check measures a layout no phone renders.
        hasTouch: width < 768,
        isMobile: width < 768,
        deviceScaleFactor: width < 768 ? 2 : 1,
      });
      const page = await context.newPage();

      for (const route of routes) {
        await page.goto(`${url}${route}`, { waitUntil: "networkidle" });
        // Let entrance animations settle: they animate opacity, transform and
        // filter, and a transform mid-flight reports a rect the settled layout
        // never has.
        await page.waitForTimeout(700);
        // Scroll the whole page so every `useInView` block has resolved, then
        // return to the top before measuring.
        await page.evaluate(async () => {
          const step = window.innerHeight;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(400);

        const probe = () =>
          page.evaluate(collectFindings, {
            minTap: MIN_TAP,
            navTargets: NAV_TARGETS,
            touch: width < 768,
            deviceWidth: width,
          });

        /**
         * The nav lives behind the crab menu at EVERY width now, not just mobile,
         * so it has to be opened before the targets exist. Opened via the real
         * control rather than by forcing state — if the toggle is broken, this
         * check should fail rather than quietly skip the nav.
         */
        const menuBtn = page.locator(
          'header button[aria-controls="site-menu"]'
        );
        const usesMenu = await menuBtn.isVisible();
        if (usesMenu) {
          await menuBtn.click();
          await page.waitForTimeout(500);
        }

        const findings = await probe();

        /**
         * Overlays have to be opened to be measured. The CV modal shipped as an
         * unconditional `grid-cols-3` and no static sweep would ever have seen
         * it, because a closed modal isn't in the DOM at all.
         *
         * `:visible` matters: the header renders a desktop CV button and a mobile
         * menu one, and the hidden instance is the first in DOM order.
         */
        if (route === "/") {
          const cv = page
            .locator("header button:visible")
            .filter({ hasText: /^CV$/ });
          if (await cv.count()) {
            await cv.first().click();
            await page.waitForTimeout(600);
            for (const f of await probe()) {
              findings.push({ ...f, detail: `${f.detail} [CV modal open]` });
            }
            await page.keyboard.press("Escape");
            await page.waitForTimeout(300);
          }
        }

        if (usesMenu) {
          await page.keyboard.press("Escape");
          await page.waitForTimeout(250);
        }

        const errors = findings.filter((f) => f.severity !== "warn");
        const warnings = findings.filter((f) => f.severity === "warn");
        const label = `${route} @ ${width}px`;

        if (errors.length) {
          failures.push({ route, width, findings: errors });
          console.log(`✗ ${label} — ${errors.length} finding(s)`);
        } else {
          console.log(
            `✓ ${label}${warnings.length ? ` (${warnings.length} warning(s))` : ""}`
          );
        }
        for (const f of errors) {
          console.log(
            `    [${f.kind}] ${f.detail}${f.target ? `\n      ↳ ${f.target}` : ""}`
          );
        }
        for (const f of warnings) {
          warned.push({ route, width, ...f });
          console.log(`    ⚠ [${f.kind}] ${f.detail}`);
        }

        if (shots) {
          const name = `${route === "/" ? "home" : route.slice(1).replace(/\//g, "-")}-${width}.png`;
          // `fullPage: false` is deliberate — do not "fix" this. Under mobile
          // emulation a full-page capture resizes the viewport to the page
          // height, and Chrome widens the layout viewport with it: a 375px run
          // reported innerWidth 528 mid-capture. The resulting image shows a
          // layout no phone renders — a truncated header and tiles whose
          // inView graphics never fired — and reads as two bugs that aren't
          // there. Scroll and take viewport shots instead.
          await page.screenshot({
            path: `${SHOTS_DIR}/${name}`,
            fullPage: false,
          });
        }
      }

      await context.close();
    }
  } finally {
    await browser.close();
    stopServer(server);
  }

  if (shots) {
    console.log(`\n· screenshots in ${SHOTS_DIR}/`);
  }

  if (deadLinks.length || failures.length) {
    if (deadLinks.length) {
      console.error(
        `\n✗ ${deadLinks.length} nav link(s) do not resolve: ` +
          deadLinks.map((d) => `${d.href} (${d.status})`).join(", ")
      );
      console.error(
        "  A 404 here usually means the route's page file exists on disk but was\n" +
          "  never committed — check `git status` for untracked files under src/app."
      );
    }
    if (failures.length) {
      const total = failures.reduce((n, f) => n + f.findings.length, 0);
      console.error(
        `\n✗ responsive check failed: ${total} finding(s) across ${failures.length} route/width combination(s)`
      );
    }
    await writeFile(
      "responsive-check-report.json",
      JSON.stringify({ deadLinks, failures }, null, 2)
    );
    console.error("  full report: responsive-check-report.json");
    process.exit(1);
  }

  console.log(
    `\n✓ responsive check passed: ${routes.length} routes × ${widths.length} widths` +
      (warned.length ? ` (${warned.length} warning(s), not blocking)` : "")
  );
}

main().catch((err) => {
  console.error(`\n✗ responsive check errored: ${err.message}`);
  if (err.message.includes("channel") || err.message.includes("executable")) {
    console.error(
      "  This uses the system Chrome. Install Chrome, or set CHROME_CHANNEL=chromium\n" +
        "  after running `npx playwright install chromium`."
    );
  }
  process.exit(1);
});
