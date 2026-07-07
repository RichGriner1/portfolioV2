---
title: "Loops and skills are components, not folders"
pillar: authority
status: draft
created: 2026-07-07
tags: [ai-tools, claude-code, context-engineering, design-systems, workflow]
seed: journal/2026-07-07-loops-vs-skills-claude-library.md
---

# Loops and skills are components, not folders

I asked ChatGPT how to organize a library of reusable AI prompts for Claude Code — the terminal-based coding assistant I use daily. It gave me a tidy folder structure with a `loops/` directory at the top. It looked reasonable.

It was also wrong. Claude Code has no `loops/` folder — nothing reads it, nothing runs it, it simply isn't a thing the tool knows about. That was the first idea I tried that failed, and it turned out to be a good place to start, because the mistake is the common one: people assume "loops" are files you organize on disk. They aren't.

## Why I wanted this at all

I kept re-typing the same instructions. "Audit this against my design system." "Check this copy is actually clear, not just voice-clean." Same prompt, rebuilt from memory, slightly different every time depending on whether it was Monday-me or Friday-me typing it.

That's the exact moment in design work where you stop re-drawing a button and turn it into a component. Reusable, consistent, one place to fix it. I wanted the same thing for how I work with AI: a small library of named, documented, reusable assets instead of a pile of one-off prompts I'd inevitably lose track of.

## What a loop and a skill actually are

Two separate pieces, with two separate jobs.

A **skill is knowledge.** It's a document — rules, standards, examples — with nothing to run. My design principles are a skill. My voice rules are a skill. My checklist for what makes a code review "done" is a skill. Reference material, written down once.

A **loop is a process** — a set of steps I run over and over. I *start* a loop by typing a short command, like `/ds-cleanup`. (That command is the "slash command." It's not the loop itself; it's just the button that launches it — the way a keyboard shortcut launches an action.) When the loop runs, it opens whatever skills it needs, works through its steps, and stops at a clear finish line.

So the two fit together like this: **the loop is the worker; the skills are the manuals it opens while it works.** And the rule that makes the whole thing worth building: **a loop references a skill, it doesn't copy it.** I write my design-system rules once, in one skill. Every loop that needs those rules opens that same skill — I never paste the rules into each loop. Change the rule in that one place, and every loop that uses it is instantly current. (This is exactly why components work in design: define the button once, and every screen using it updates when you change the original.)

That's why the `loops/` folder was the wrong answer. ChatGPT heard "organize my AI workflows" and answered "here's where to put the files" — a filing question. But a loop isn't a file you file away. It's a command that reads files.

## Use it anywhere, not just this repo

The part I didn't know going in: Claude Code reads two places — the project you're standing in (`.claude/` in that repo) and your own machine (`~/.claude/`, your home directory). Anything sitting in your home-level folder is live in *every* project you open, not just the one it was written in.

That gave me the model I actually wanted. I author everything in one home-base repo — my portfolio, the one place I keep as source of truth — inside a neutral `.claude/lib/` folder that Claude doesn't auto-load. A small sync script then symlinks each skill and loop out into `~/.claude/`. Edit once at home base, it's live everywhere: my portfolio, our Angular product at Afi, a side project, my brother's repo. One command re-installs the whole thing on a new machine.

That only works if the loop doesn't assume every project is built like the one it was written in. Mine was written in my portfolio, which is React. But the same loop has to run on an Angular project too — and even two Angular projects can be set up completely differently, with different styling systems and different building blocks. So the loop can't hard-code "this is what a project looks like." Every time it runs, it has to *look* at the project in front of it — which framework, which styling system, which components — and adapt to what it finds. Detect, don't assume.

I shipped exactly two loops to start, `/ds-cleanup` and `/content-review`, on purpose. I have a roadmap of ten more. I built two and hammered on them in a real repo before adding a third, because building a pile of loops I'd lose track of was the original problem I was trying to solve.

## Running it for real: the table that cost 100k tokens

I pointed `/ds-cleanup` at a real page in Coherence, our Angular wealth-management product — a framework the loop wasn't originally built in, to see if the "detect, don't assume" fix actually held. The audit phase worked. Correctly read the project as Angular, found the right component library, flagged real issues. Then I ran the fix phase on a single table, and it burned roughly 100,000 tokens.

My first instinct was wrong: "it's spinning, I need a hard token cap." So I asked Claude directly whether I could set something like the $3 limit some AI research tools have. The answer was no, and the reason matters more than the no. A hard spending cap that stops itself mid-run is a feature of a **workflow** — a heavier, self-contained system that tracks its own token budget while it works and can halt itself. My `/ds-cleanup` is just a slash command: a script of instructions Claude follows start to finish. It has no meter to watch. It can't stop itself at a number it isn't tracking. So the fix couldn't be "add a cap." It had to be structural — smaller scope, fewer optional steps, a fix phase that stops after one bounded pass instead of running until "done."

## The real lesson: two meters, not one

Here's the part I got slightly wrong myself before I understood it properly, and it's the most useful thing in this whole exercise.

There are two separate meters, and I'd been reading them as one:

- **Money spent.** Tokens a subagent burns are real and billed. When the reviewer used 102,000 tokens, that cost actually happened.
- **Context window.** How full the *main* conversation is — the thing Claude re-reads in full, every single message, for the rest of the session.

A **subagent** is a separate Claude instance you delegate a task to. It runs in its own room: it reads files, thinks, does the work — and none of that enters your main conversation. When it's done, only its short report comes back, usually about a page.

That distinction is everything, because of how the main conversation works: Claude re-reads the *entire* thing on every message you send. Anything sitting in that main context gets paid for again, every turn, for the rest of the session. It compounds. A subagent's 100,000 tokens, by contrast, get spent once and then they're gone — never re-read, never billed again.

The analogy that finally made it click for me: hiring someone to read a 500-page pile in another room and hand you back one page. You pay for that read once. Your own desk only ever holds the one page. The expensive mistake is dumping all 500 pages onto your *own* desk instead — now you're shuffling through them on every task, and your desk (the context window) eventually fills up and you can't fit anything new.

So the reviewer's 102k, spent in its own room, cost nothing beyond that one run. What actually caused the damage was the *orchestrator*, the part of the loop coordinating the whole run, bloating the main thread on its own: re-reading roughly 1,500 lines of source the reviewer had already summarized (one file alone was 536 lines), to write a build spec it didn't need to write from scratch; dumping full build logs into context, including hundreds of identical Sass deprecation warnings that added up to 8,000–12,000 tokens of pure noise; and writing a 200-line prompt for the fixer that was that long *because* it had just re-read everything itself.

The unit that actually costs you isn't total tokens burned anywhere in the run. It's what stays in the main thread, because that's the part that gets re-read and re-billed on every subsequent turn.

## What changed

Once I had the right diagnosis, the fixes were mechanical:

- **Audit by default, fix is opt-in and bounded.** `--fix` runs one pass and stops. Run it again for more — it doesn't loop on its own.
- **Build is opt-in too**, behind `--verify`, since running the build was the single biggest token sink.
- **Looping is capped.** `--deep` will repeat, but only up to two rounds — the default can never run away.
- **Skills load lazily.** The reviewer used to load around ten rulebook files every run. Now it loads baseline checks always, and pulls in judgment-call principles only when a judgment call actually comes up.
- **The reviewer's report is self-sufficient** — findings, the API surface, the fix target. The orchestrator acts on that report and never re-reads the source itself. Deep reading, when it's needed, is delegated back down to the fixer, whose context gets thrown away when it's done.
- **Logs get filtered to errors**, not dumped in full.
- **The loop detects the repo's own fixer** instead of assuming one tool name — my portfolio has `code-writer`, Coherence has `builder`. Portability lives in details like this.

## Cheaper model, on purpose — but not blindly

The parts of the loop that do the reviewing and the fixing run on **Sonnet** — a faster, cheaper Claude model — instead of **Opus**, the most capable and most expensive one.

There's a real argument against that, and it's worth taking seriously. A cheaper model makes more mistakes, so you spend extra tokens catching and re-running them — whereas a stronger model gets it right in fewer tries, and *fewer tries can mean fewer tokens overall.* Better model, less back-and-forth, cheaper in the end. For hard, open-ended problems, that's often true, and reaching for the cheap model there is a false economy.

But it depends on the job. The reviewer isn't doing open-ended thinking — it's checking a file against an explicit rulebook and listing what breaks the rules. That's a narrow, well-defined task, and I tested that Sonnet does it reliably before committing to it. When the job is "match this against these rules," the cheaper model gets it right the first time, so the extra-review trap never kicks in. Save the expensive model for the open-ended reasoning; don't pay Opus rates to produce a checklist.

## Proof it worked

I re-ran the whole thing on a different table, `listado-planificaciones`, in a fresh session — a new *conversation*, same repo, same git branch. (Worth being precise about that: a fresh session resets the bloated context; a new git branch resets nothing about context at all — they're unrelated things that happen to sound similar.)

This time, when I left the file path blank, it asked which table instead of guessing. The fix stayed bounded: about 44,000 tokens after the audit, roughly 70,000 after the fix — against 102,000 for the fix alone, before. Then it stopped, on its own. Sonnet's findings were specific: a dead `@media` block, an unused import, an orphan SCSS rule, a stale comment, each with a file and line number.

It also drew a line I hadn't explicitly told it to draw. The table had leftover styling code for an old mobile layout — the kind where, on a phone, each table row collapses into its own stacked card. That layout wasn't in use anymore; the styling was just dead weight sitting in the file, doing nothing. Deleting dead code like that is safe and mechanical — nothing on screen changes, there's no judgment call — so it removed it. But actually *rebuilding* that stacked-card layout for phones would be a real design decision, not a cleanup. Instead of quietly making that call for me, it flagged it and left the decision in my hands. Then I ran `--verify`: it detected the project's build command, ran it, filtered the log down to errors only — the exact fix we'd just added, working on itself — and correctly attributed the one remaining warning to a pre-existing, unrelated page instead of blaming the change it had just made. Commit-clean.

The tool that caused the log-dump waste in the first place now avoids it by default. It applied its own lesson before I had to remind it.

That's the actual takeaway, not "AI can audit a design system": build your AI tooling the way you build a design system — reusable, named, documented, one gate with lenses on top instead of a pile of one-offs. And when you're pricing out whether something is expensive, don't count total tokens burned anywhere. Count what's still sitting in your main conversation, because that's the only part that gets billed to you twice.
