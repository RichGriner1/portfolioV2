# Gap Analysis: Designing against the build system

- **Story:** `designing-against-the-build-2026-02-16` (Story Bank)
- **Pillar:** Blog — "Challenges faced as a non-technical designer shipping products" (AFI Simulators)
- **Rank:** #2
- **Run:** 2026-06-21
- **Already-published guard:** A LinkedIn post already tells this story's *arc* ("cut the inconsistencies… the code was awful… it wasn't scalable") plus the tip "audit your token layers." The blog must NOT re-run the arc — its fresh spine is the **one concrete moment it shipped wrong**, not the general lesson the post already gave.

---

## Gap list (by category)

### 1. Missing detail
- `[ASK]` **The spine of the blog:** one specific moment an undefined state (hover / pressed / disabled) shipped wrong. Which state, which screen, what the dev built instead, what it cost to fix.
- `[ASK]` Did connecting Figma tokens to the build (the plugin / preset idea to overwrite PrimeNG vars) actually work out? What happened?
- `[ASK]` A concrete design you had to compromise because of the Bootstrap 12-col grid / the 288px-impossible / "fill container at 100%" constraint.
- `[ASK]` The stepper (dots between steps) — how long did overriding those CSS classes actually take?

### 2. Missing reasoning
- `[ASK]` *Why* does "code written before the design system" cause the token mismatch — explained so a non-technical reader gets it.
- `[ASK]` *Why* are modals "annoying for programmers," really? The actual reason, not just that they are.

### 3. Missing evidence
- `[RESEARCH — optional, skip by default]` At most a one-line nod that Bootstrap-vs-Material / token mismatch are known industry handoff problems — only if it helps a reader place the pain. This is a lived story; it doesn't need a citation.

### 4. Missing counterpoint
- `[ASK]` Isn't "just learn the grid and define your states" obvious? Why do good designers *still* skip it?
- `[ASK]` The real tension: should a designer even *have* to know the framework? Where's the honest line between design responsibility and dev responsibility?

### 5. Missing stakes
- `[ASK]` What did all this cost in real terms — extra revision cycles, dev frustration, a delayed ship? Make the "invisible rework" visible.

---

## Interview seed (→ `04-interview/interview-prompt.md`)

Answer out loud in Granola. Don't perform — your exact wording is what we keep.

1. Tell me about a specific time an undefined state shipped wrong on the simulators. What did the developer build when the state wasn't in Figma, and what did it take to fix?
2. Explain, like I'm not technical: why did the code existing *before* your design system mean the tokens never matched?
3. The Bootstrap grid — give me one real design you had to change because 288px was impossible / everything wanted to fill the container.
4. You cut the modals because "dialogs are annoying for programmers." Why are they annoying, exactly?
5. Be honest: should a designer really have to know the framework, or is that the dev's job? Where do you land?
6. Add it up — what did fighting the build actually cost you on this project?

## Research seed (→ `03-research/research-brief-template.md`)

**No outside research needed — lived pain.** This is the deliberate counterweight to the "AI makes it easy" stories; keep it honest and specific. Don't dilute it with citations.

## Readiness

**Ready to produce after the interview**, with one caveat: because the LinkedIn arc is already published, this piece only works if the interview produces the **concrete "it shipped wrong" moment** to build around. If that moment doesn't surface, it's a re-run — hold it until it does. Format path: this one is meatier and more narrative → it leans **blog-first**, with standalone tweets pulled from the sharp lines ("if you don't define the states, the developers invent them").
