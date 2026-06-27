# Interview: Designing against the build system

- **Story:** `designing-against-the-build-2026-02-16`
- **Gap analysis:** `03-research/gap-analysis-designing-against-the-build.md`
- **Rank:** #2
- **Target output:** blog-first (more narrative) → standalone tweets from the sharp lines

> **How to do this:** Open Granola, talk through the questions in order. Don't perform — your exact wording ("if you don't define the states, the developers invent them") is what we keep. Name the real screen, the real state, the real number.
>
> **⚠️ Read before you start:** The *arc* of this story is already on your LinkedIn (cut the inconsistencies → the code was awful → it wasn't scalable → audit your token layers). The blog only works if you give it something the post didn't: **the one concrete moment something shipped wrong.** Q1 is that moment. If you can't land a real one, this piece isn't ready yet — and that's fine, better to know now.

---

## The moment (start here — this is the spine)

1. Tell me about a specific time an undefined state shipped wrong on the simulators. The hover, pressed, or disabled state wasn't in Figma — so what did the developer build instead? What did it look like, who noticed, and what did it take to fix?
   - *Follow-up:* How many back-and-forth rounds did that one thing cost?

2. Now the flip side: was there a moment you sat with the programmers, looked at the code, and realised how bad the mismatch had gotten? What did you see?

## Set the scene (the why, for a non-technical reader)

3. Explain it like I'm not technical: the code existed *before* your Figma design system. Why does that mean the tokens never matched — and why did every handoff need manual translation?

4. The Bootstrap 12-column grid — give me one real design you had to change because an exact width like 288px was impossible and everything wanted to "fill the container at 100%." What did you want, and what did you have to settle for?

5. The custom stepper — the little dots between steps that didn't exist in the base components. How long did overriding all those CSS classes actually take, and what did that teach you?

## The decisions + reasoning

6. On the energy-efficiency simulator you cut the modals — "dialogs are annoying for programmers." Why are they annoying, *really*? What did you replace them with?

7. Did you ever get the Figma tokens to actually connect to the build (the idea of a preset that overwrites the PrimeNG variables)? Did it work, or is it still a someday?

## The stance + the counterpoint

8. Be honest: should a designer even *have* to know the grid, the states, the framework — or is that the dev's job? Where do you actually land on that line?

9. "Just learn the grid and define your states" sounds obvious. So why do good designers — including you, before this — still skip it? What makes it easy to skip?

## Stakes

10. Add it all up. What did fighting the build system actually cost on this project — revision cycles, dev frustration, a delayed ship? Make the invisible rework visible.

11. And what's the one thing you do differently now, before any handoff, because of all this?

---

## When you're done

- Stop the Granola note. The transcript goes into `04-interview/granola-processing-prompt.md`.
- **Gut check:** did Q1 produce a real, concrete "it shipped wrong" moment? If yes → this is ready to draft as a blog. If no → park it and pick another story; don't let the draft re-run the LinkedIn arc.
- Sharp lines to listen for and keep verbatim: "if you don't define the states, the developers invent them," "the code was written before the design system," "dialogs are annoying for programmers."
