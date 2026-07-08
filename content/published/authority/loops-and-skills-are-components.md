---
title: "Loops and skills are components, not folders"
pillar: authority
status: published
created: 2026-07-07
published_at: 2026-07-08
tags: [ai-tools, claude-code, context-engineering, design-systems, workflow]
seed: journal/2026-07-07-loops-vs-skills-claude-library.md
---

# Loops and skills are components, not folders

I asked ChatGPT how to organize a library of reusable AI loops and skills for Claude Code. It gave me a folder structure with a `loops/` directory at the top. It looked reasonable.

It was also wrong. That was the first idea I tried that failed, but it turned out to be a good place to start, because the mistake is the common one: people assume "loops" are specific files, like skills. They aren't.

## Why I wanted this at all

I kept re-typing the same instructions. "Audit this against my design system." "Check this copy is actually clear, not just voice-clean." Same prompt, rebuilt from memory.

A component gives a design file one thing built once and referenced everywhere — one place to fix it. I wanted the same thing for how I work with AI: a small library of named, documented, reusable assets, instead of one-off prompts I'd inevitably lose track of.

## What a loop and a skill are

Two separate pieces, with two separate jobs.

A **skill is knowledge.** It's a document or folder of rules, standards, and examples — my design principles, my voice rules, my code-review checklist are each a skill.

A **loop is a process** — a set of steps for the agents to follow. You start a loop by typing a short command, like `/ds-cleanup`. When the loop runs, it opens whatever skills it needs, works through its steps, and stops at a clear finish line.

**The loop is the worker; the skills are the manuals it opens while it works.**

## Use it anywhere, not just this repo

The part I didn't know going in: Claude Code reads two places — the project you're standing in (`.claude/` in that repo) and your own machine (`~/.claude/`, your home directory). Anything sitting in your home-level folder is available in *every* project you open, not just the one it was written in.

That gave me the model I wanted. I author everything in my portfolio repo, the one place I keep as source of truth, inside a neutral `.claude/lib/` folder Claude doesn't auto-load. A small sync script then symlinks each skill and loop out into `~/.claude/`. (A symlink is a live pointer, not a copy. It stays the same single file, in two places at once.) Edit once at home base, it's live everywhere: my portfolio, our Angular product at Afi, other freelance projects. One command re-installs the whole thing on a new machine.

That only works if the loop doesn't assume every project is built the same. For example, my portfolio is React. But the same loop has to run on an Angular project too, and even two Angular projects can be set up completely differently: different styling systems, different building blocks. So the loop can't hard-code "this is what a project looks like." Every time it runs, it has to *look* at the project in front of it: which framework, which styling system, which components, and adapt to what it finds. Detect, don't assume.

```figure
use-anywhere
```

## Running it for real: the table that cost 100k tokens

I only shipped two loops to start, `/ds-cleanup` and `/content-review`. I have a roadmap of ten more, but I wanted to prove the idea worked on two before building anything else.

`/ds-cleanup` was the first loop. Like any first build, it looked cleaner on paper than it ran in practice.

I pointed it at a real page in an Angular wealth-management product — a framework the loop wasn't originally built in. I wanted to see if the "detect, don't assume" fix worked.

The loop is the orchestrator of two helpers: a *reviewer* that audits the code and lists what's broken, and a *fixer* that applies the changes. The reviewer worked: it correctly read the project as Angular, found the right component library, flagged real issues.

Then I ran the fix on that single table. The run burned roughly 102,000 tokens, nearly all of it the reviewer.

My first instinct was wrong: "it's spinning, I need a hard token cap." So I asked Claude directly whether I could set something like the $3 limit some AI research tools have. The answer was no. A hard spending cap that stops itself mid-run is a feature of a **workflow** — a heavier, self-contained system that tracks its own token budget while it works and can halt itself. A loop is a script of instructions Claude follows start to finish. It has no meter to watch. So the fix couldn't be "add a cap." It had to be structural — smaller scope, fewer optional steps, a fix phase that stops after one bounded pass instead of running until "done."

## Why it got expensive: two meters, not one

I knew tokens cost money. What I hadn't accounted for was that the orchestrator re-reads the entire main conversation on every single turn, so whatever stays parked there gets billed again and again — the fix wasn't a tighter spending watch, it was minimizing what stays in that thread.

There are two separate meters, and I'd been reading them as one:

- **Money spent.** Tokens a subagent burns are real and billed. When the reviewer used 102,000 tokens, that cost happened.
- **Context window.** How full the *main* conversation is — the thing Claude re-reads in full, every single message, for the rest of the session.

A **subagent** is a separate Claude instance you delegate a task to — the reviewer and the fixer are each one. It runs in its own room: it reads files, thinks, does the work, and none of that enters your main conversation. When it's done, only its short report comes back, usually about a page.

That distinction is everything, because of how the main conversation works: Claude re-reads the *entire* thing on every message you send. Anything sitting in that main context gets paid for again, every turn, for the rest of the session. It compounds. A subagent's 102,000 tokens, by contrast, get spent once and then they're gone — never re-read, never billed again.

The analogy that finally made it click for me: hiring someone to read a 500-page pile in another room and hand you back one page. You pay for that read once. Your own desk only ever holds the one page. The expensive mistake is dumping all 500 pages onto your *own* desk instead — now you're shuffling through them on every task, and your desk (the context window) eventually fills up and you can't fit anything new.

So the reviewer's 102k, spent in its own room, cost nothing beyond that one run. What actually caused the damage was the orchestrator bloating the main thread — the running conversation itself — on its own, in three ways:

- **Re-reading source the reviewer had already summarized** — roughly 1,500 lines (one file alone was 536), to write a build spec from scratch it didn't need.
- **Dumping full build logs into context** — hundreds of identical Sass deprecation warnings, 8,000–12,000 tokens of pure noise.
- **Writing a 200-line prompt for the fixer** — that long *only because* it had just re-read everything itself.

The unit that costs you isn't total tokens burned anywhere in the run. It's what stays in the main thread, because that's the part that gets re-read and re-billed on every subsequent turn.

## What changed

Once I had the right diagnosis, the fixes followed one rule: keep the loop lean. One job, few steps — a loop stuffed with instructions just makes the AI lose the thread.

- **Audit by default, fix is opt-in and bounded.** `--fix` runs one pass and stops. Run it again for more — it doesn't loop on its own.
- **Build is opt-in too**, behind `--verify` — running the build was the single biggest token sink, so it never runs unless you ask.
- **Looping is capped.** `--deep` repeats the fix pass, but never more than two rounds — so even the deep path can't run away.
- **Skills load lazily.** The reviewer used to load around ten rulebook files every run. Now it loads baseline checks always, and pulls in judgment-call principles only when a judgment call comes up.
- **The reviewer's report is self-sufficient** — findings, the API surface, the fix target. The orchestrator acts on that report and never re-reads the source itself. Deep reading, when it's needed, is delegated back down to the fixer.
- **Logs get filtered to errors**, not dumped in full.
- **The loop detects the repo's own fixer** instead of assuming a tool name — my portfolio has `code-writer`, another project has `builder`. Portability lives in details like this.

## Cheaper model, on purpose — but not blindly

Subagent tokens don't compound the way main-thread tokens do. But spent-once is still money spent, so which model runs those subagents still matters. The parts of the loop that do the reviewing and the fixing run on **Sonnet**, a faster, cheaper Claude model, instead of **Opus**, the most capable and most expensive one.

There's a real argument against that: a cheaper model makes more mistakes, so you spend extra tokens catching and re-running them, whereas a stronger model gets it right in fewer tries, and *fewer tries can mean fewer tokens overall.* Better model, less back-and-forth, cheaper in the end. For hard, open-ended problems, that's often true, and reaching for the cheap model there is a false economy.

But it depends on the job. The reviewer isn't doing open-ended thinking — it's checking a file against an explicit rulebook and listing what breaks the rules. That's a narrow, well-defined task, and I tested that Sonnet does it reliably before committing to it. When the job is "match this against these rules," the cheaper model gets it right the first time, so the extra-review trap never kicks in. Save the expensive model for the open-ended reasoning; don't pay Opus rates to produce a checklist.

## Proof it worked

I re-ran the whole thing on a different table, in a brand-new session — a new *conversation*, same repo, same git branch — to debloat the context and shrink the scope.

This time, when I left the file path blank, it asked which table instead of guessing. The fix stayed bounded: about 44,000 tokens after the audit, roughly 70,000 after the fix — against 102,000 for the fix alone, before. Then it stopped, on its own. Sonnet's findings were specific: a dead `@media` block, an unused import, an orphan SCSS rule, a stale comment, each with a file and line number.

```figure
token-cost
```

It also drew a line I hadn't told it to draw. It found leftover code for an old mobile layout — rows that used to collapse into stacked cards on a phone — but that layout wasn't used anymore, so the code was just dead weight, sitting there doing nothing. Deleting code nobody uses is safe and mechanical, so it removed it. But rebuilding that mobile layout would have been a real design decision, not a cleanup, so instead of deciding for me, it flagged it and left the call in my hands.

Then I ran `--verify`. It detected the project's build command, ran it, and filtered the log down to errors only, the exact fix we'd just added, now working on itself. It also correctly attributed the one remaining warning to a pre-existing, unrelated page instead of blaming the change it had just made. Commit-clean.

The tool that caused the log-dump waste in the first place now avoids it by default. It applied its own lesson before I had to remind it.

The takeaway isn't "AI can audit a design system." It's this: a loop is only worth building if you understand how the agent works — that's what lets you adjust it. The two meters are the proof. Once I understood that the main thread gets re-read on every turn, the fixes stopped being guesses: audit by default, one bounded pass, skills that load lazily. I built mine like a component — one thing, defined once, referenced everywhere. Understanding the agent is what let me get that shape right.
