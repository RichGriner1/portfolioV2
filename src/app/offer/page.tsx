import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Design System Audit — Richard Griner",
  description:
    "A one-week, flat-fee design system audit for AI and fintech teams: a UI drift map, a token & component gap analysis, and a 90-day roadmap.",
};

const PROBLEMS = [
  {
    title: "Five versions of every button",
    body: "Each new feature ships its own variant. Nobody can say which one is canonical.",
  },
  {
    title: "Design → eng handoff is a debate",
    body: "Engineers rebuild what design already decided. Both sides think the other is drifting.",
  },
  {
    title: "New hires make it worse",
    body: "You just raised and you're hiring. Every new designer and engineer multiplies the entropy.",
  },
];

const DELIVERABLES = [
  {
    title: "UI drift map",
    body: "Every inconsistency across your product, screenshotted, clustered, and ranked by user-facing damage.",
    placeholder: "Drift map — screenshot grid with redline overlays",
  },
  {
    title: "Token & component gap analysis",
    body: "What you have, what's missing, and what's fake-systemized — hard-coded values wearing a component's name.",
    placeholder: "Token / component gap table (client sample)",
  },
  {
    title: "90-day roadmap",
    body: "A prioritized, sequenced plan your team can execute — with or without me.",
    placeholder: "90-day roadmap — cover / sequence sketch",
  },
];

const STEPS = [
  {
    title: "Day 1 — Access & kickoff (30 min)",
    body: "You give me read access to the product and Figma. One call, then I disappear and work.",
  },
  {
    title: "Days 2–5 — The teardown",
    body: "I audit every core flow: tokens, components, design→code parity. No meetings, no time from your team.",
  },
  {
    title: "Day 7 — Walkthrough (60 min)",
    body: "I present the drift map, gap analysis, and roadmap live to you and your leads. You keep everything.",
  },
];

const FAQS = [
  {
    q: "We don't have a design system yet — is an audit premature?",
    a: "That's the cheapest time to do it. The audit maps what's implicitly there already (every product has a de-facto system) and gives you the plan to make it real before the drift compounds.",
  },
  {
    q: "Can our own team just do this?",
    a: "Eventually, yes — and the roadmap is written so they can. But teams inside the product stop seeing the drift. A cold outside read in one week is the entire value.",
  },
  {
    q: "What happens after the audit?",
    a: "You own everything and can run the roadmap yourselves. If you want help executing, that's a separate conversation — I lead the build and bring in a designer and engineer I trust when the scope calls for it. About half of teams ask, half don't. Both are fine.",
  },
];

function Placeholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-muted text-muted-foreground flex items-center justify-center rounded-lg border px-4 py-6 text-center text-sm",
        className
      )}
    >
      {label}
    </div>
  );
}

export default function OfferPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 pb-24">
        {/* Hero */}
        <section className="flex flex-col gap-6 pt-12 sm:pt-20">
          <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Every screen your team ships drifts a little further from the last.
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            I find out how far — and hand you the 90-day plan to fix it. A
            design system audit for AI &amp; fintech teams. One week, flat fee.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<a href="#book" />}>
              Book the audit — $3,000
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href="#deliverables" />}
            >
              See what you get
            </Button>
          </div>
          <Placeholder
            label="Before / after: 5 drifted button styles collapsing into 1 component"
            className="mt-4 aspect-video w-full"
          />
        </section>

        {/* Problem */}
        <section className="border-border/60 flex flex-col gap-6 border-t pt-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            You already know the symptoms.
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PROBLEMS.map((problem) => (
              <Card key={problem.title}>
                <CardHeader>
                  <CardTitle>{problem.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {problem.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Deliverables */}
        <section
          id="deliverables"
          className="border-border/60 flex flex-col gap-6 border-t pt-12"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            One week. Three deliverables.
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {DELIVERABLES.map((deliverable) => (
              <Card key={deliverable.title}>
                <CardContent>
                  <Placeholder
                    label={deliverable.placeholder}
                    className="aspect-video"
                  />
                </CardContent>
                <CardHeader>
                  <CardTitle>{deliverable.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {deliverable.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            &ldquo;With or without me&rdquo; is the point: you own the roadmap
            and can execute it with your own team.
          </p>
        </section>

        {/* Process */}
        <section className="border-border/60 flex flex-col gap-6 border-t pt-12">
          <h2 className="text-3xl font-bold sm:text-4xl">How the week runs</h2>
          <ol className="flex flex-col">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="border-border/60 flex gap-4 border-t py-5 first:border-t-0 first:pt-0"
              >
                <span className="border-border text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Pricing */}
        <section className="border-border/60 flex flex-col gap-6 border-t pt-12">
          <Card>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  The audit is $3,000. Flat.
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No scoping call to find out the price — this is the price.
                  Delivered in one week, guaranteed.
                </p>
                <p className="text-sm leading-relaxed">
                  <strong className="font-semibold">
                    If I find nothing worth fixing, I&rsquo;ll tell you that too
                  </strong>{" "}
                  — and you&rsquo;ll know your system is clean. That report is
                  worth having either way.
                </p>
              </div>
              <Button size="lg" render={<a href="#book" />}>
                Book the audit
              </Button>
            </CardContent>
          </Card>
          <div className="border-primary bg-muted rounded-md border-l-4 p-4">
            <p className="text-sm leading-relaxed">
              <strong className="font-semibold">For scale:</strong> a founding
              product designer runs $140–180k/yr and takes three months to hire.
              This is one week, no headcount, and you&rsquo;ll know exactly what
              that hire should do on day one.
            </p>
          </div>
        </section>

        {/* About */}
        <section className="border-border/60 grid gap-8 border-t pt-12 sm:grid-cols-[200px_1fr] sm:items-start">
          <Placeholder
            label="Headshot — working, not posed"
            className="aspect-square w-full"
          />
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold sm:text-4xl">
              I do this inside a fintech company all day.
            </h2>
            <p className="text-base leading-relaxed">
              I&rsquo;m Richard Griner, a design system designer working in AI +
              fintech. Design systems aren&rsquo;t a service line I added —
              they&rsquo;re the entire job: tokens, component architecture, and
              the design→engineering handoff, in exactly the stack your team is
              probably using.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              The audit exists because most teams don&rsquo;t need a $50k agency
              engagement — they need one specialist to look hard at their
              product for a week and tell them the truth.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              For larger builds, I work with a small collective of designers and
              engineers I trust — I lead the work and own the quality; they let
              us move faster.
            </p>
            {/* TODO: link the most relevant case study once one is chosen */}
            <a
              href="#"
              className="text-primary w-fit text-sm underline-offset-4 hover:underline"
            >
              See a case study — link coming soon
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-border/60 flex flex-col gap-6 border-t pt-12">
          <h2 className="text-3xl font-bold sm:text-4xl">Fair questions</h2>
          <div className="flex flex-col">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group border-border/60 border-t py-4 first:border-t-0 first:pt-0"
              >
                <summary className="focus-visible:ring-ring/50 flex list-none items-center justify-between gap-4 rounded-sm font-medium outline-none focus-visible:ring-2 [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground shrink-0 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          id="book"
          className="border-border/60 flex flex-col items-center gap-4 border-t pt-12 pb-8 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Find out how far it&rsquo;s drifted.
          </h2>
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
            One week from kickoff to roadmap. $3,000 flat.
          </p>
          {/* TODO: swap href for the real cal.com / Calendly booking link */}
          <Button size="lg" render={<a href="#" />}>
            Book the audit — $3,000
          </Button>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
