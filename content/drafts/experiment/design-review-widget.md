---
title: "A floating review tool, half-built on purpose"
pillar: experiment
status: draft
created: 2026-04-30
tags: [internal-tools, design-review, ai-tools, mvp, vibe-coding]
---

# A floating review tool, half-built on purpose

I was looking at the Patrimonio screen last week — the wealth-management page in our internal Coherence design system — and the Versión 1 / Versión 2 / Versión 3 picker was sitting in the page header, inside the design itself. Two pickers were fighting for attention: the user's actual content above the fold, and the designer's review scaffolding bolted on top. I had built it that way on purpose — the team's process is to keep variants side-by-side instead of overwriting them, so seniors can compare across reviews. But it's confusing inside the canvas. The picker is a meta-control about *which design you're looking at*, and it was living in the design.

The same week, comments about those screens were scattered across Slack threads, two Loom recordings, a Notion page somebody started, and my own head. None of them were attached to the pixel they referenced. Resolving a comment meant finding it again first.

So I sketched the obvious move: pull the Versión picker out of the design and into a floating overlay that hovers over the page — Loom-style, non-intrusive, the same on every project. While I was there, give it a "comment on this element" mode. Click any element to attach a comment. Group comments by version. Export them as markdown so I could paste them into a PR or feed them to an AI to plan the next sprint.

I built the MVP in a couple of evenings with Claude. Two days. It is, to be clear, an internal tool — not a product I plan to polish. The interesting part isn't the widget. The interesting part is the loops it unlocks.

## Pieces

**The widget.** Preact (3 KB) and a Shadow DOM. The widget renders into a shadow root attached to `document.body`, so the host page's CSS — Tailwind, PrimeNG, our custom token system — can't leak in or out. One `<script>` tag in the project's `index.html` and the floating bar appears, framework-agnostic. Final bundle is ~15 KB gzipped. Same script tag now lives in the Coherence design-system site and the AWM Showcase app.

**The bridge.** Inside Coherence, where the inline Versión picker used to live, each page that has alternate designs exposes a one-line helper:

```ts
afterNextRender(() => {
  bridgeDesignReviewVersion(this.version);
});
```

The widget reads `?version=` from the URL, fires a callback when the pill changes, and the page's signal updates. No cross-framework gymnastics. The inline toggle on every page got a one-line CSS rule (`site-version-toggle { display: none }`) and disappeared. Same control surface, no duplicate pickers.

**The anchors.** Each comment captures four locator strategies — `data-review-id` if the author added one, a CSS selector built from id / `data-testid` / class chain, an XPath fallback, and a bounding-box-plus-scroll-position last resort. On reload the resolver tries them in order. SPAs mutate the DOM constantly; this is the part most likely to break, and the part I most expected to babysit. So far it has held up.

**The export.** The drawer's Changelog tab dumps every comment to a markdown file with a date-stamped name (`iteration-coherence-novedades-v2-2026-04-30.md`). I drop the file into `design-review-iterations/` in the repo, commit it next to the design changes, and the iterations are now versioned alongside the code. When I want to plan the next round, I tell Claude to read the folder and group the open feedback by theme. It does, because the format is just bullets — author, status, page URL, body — exactly what an LLM is good at reading.

## What I broke (and learned from)

Two bugs were instructive.

**Shadow DOM retargets events at the boundary.** I wired keyboard shortcuts (`Alt+C` for comment, `Alt+D` for drawer, `Alt+H` for help) and gated them with "skip when the user is typing in an input." That worked for the host page's inputs. It failed for the widget's *own* comment textarea — because from `document.addEventListener('keydown', …)`, `e.target` is the shadow host, not the textarea inside. The shortcut fired while I was typing the comment, and weird things happened. The fix is `e.composedPath()` — it pierces the shadow boundary and returns the real path to the input. I had to apply the same fix to the version pill's outside-click detector, which was closing the dropdown before the click could register. Two bugs, same root cause; once you see it once you see it everywhere.

**CSS `right: 24px` plus a saved drag-position with `left: 1200px`.** When the user drags the bar, the JS sets `left` and `top` inline. The CSS still says `right: 24px`. With both anchors set, a `position: fixed` element fills the space between them — the bar stretched edge-to-edge across the viewport on the next reload. Fix: when applying a saved position, also set `right: auto` to override the CSS. Obvious in retrospect, invisible until someone with a saved position from a previous build hits the new CSS.

## What's still half-finished

No backend. Comments live in `localStorage` per device, so multi-device sync, notifications, and real-time collaboration don't exist. The plan, when team use justifies it, is a Cloudflare Worker plus a D1 SQLite database — `POST /comments`, `GET /comments`, no client SDK, just `fetch`. The widget swaps a storage adapter and the rest of the UI doesn't change. For now the "team collaboration" story is: download the markdown, commit it.

No identity beyond a typed name. Anyone with the URL can comment as anyone. For an internal tool with three teammates that's fine. For wider use it isn't.

No "convert to GitHub issue" button yet. That's the bridge from review to work, and it's the next thing worth building. Comment → issue → PR → resolved comment, all linked, would close the loop end-to-end.

## What it earns

The point isn't the widget. The point is the loop.

A senior leaves four comments on Versión 2 of the Patrimonio screen. I download the markdown, drop it in the iterations folder, commit. Next morning I ask Claude to read the latest iteration file and propose a fix for each open comment, ordered by impact. It does. I review, kick off the changes, push, ask the senior for another pass. The loop tightens because the feedback is in the same medium as the code — text in a repo — not five tools away.

That's the case for an internal MVP that isn't pretty. Comments anchored to pixels, exported as markdown, fed to an AI that already knows the codebase. Two days of vibe-coding to replace four review tools with one floating bar.

I'll add the backend when the lack of it actually hurts.

---

*Working on something similar? [Say hi](mailto:richardgrinerdesigns@gmail.com) — always up for a chat about internal tools and AI loops.*
