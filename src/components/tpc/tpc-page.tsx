"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { BackLink } from "@/components/back-link";
import { HyperText } from "@/components/magicui/hyper-text";
import { MoreWork } from "@/components/more-work";
import { BackDemo } from "@/components/tpc/demos";
import * as C from "@/components/tpc/copy";
import { Reveal } from "@/components/tpc/reveal";
import { ClipSlot } from "@/components/tpc/clip-slot";
import { EmptyGallery } from "@/components/tpc/empty-gallery";
import { type WorkItem, formatYears } from "@/lib/content/work";
import { type Bilingual, pick, t, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
    >
      {children}
    </h2>
  );
}

function Para({ text }: { text: Bilingual<string> }) {
  const { lang } = useLang();
  return (
    <p className="text-foreground text-base leading-relaxed">
      {pick(text, lang)}
    </p>
  );
}

/* ----------------------------------------------------------- pain figures */

function PainFigure({ kind }: { kind: C.Pain["kind"] }) {
  const line = "bg-border h-1.5 rounded-full";
  if (kind === "list") {
    // Three people, three different lists for the same supplier.
    const lists = [2, 4, 3];
    return (
      <div className="flex gap-2" aria-hidden="true">
        {lists.map((n, i) => (
          <div
            key={i}
            className="border-border bg-background flex flex-1 flex-col gap-2 rounded-md border p-2.5"
          >
            {Array.from({ length: n }).map((_, j) => (
              <div key={j} className="flex items-center gap-1.5">
                <span className="border-muted-foreground size-2.5 shrink-0 rounded-sm border" />
                <span
                  className={cn(line, "flex-1")}
                  style={{ width: `${55 + ((i * 17 + j * 23) % 45)}%` }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (kind === "template") {
    // Three suppliers, three differently shaped answers.
    return (
      <div className="flex gap-2" aria-hidden="true">
        <div className="border-border bg-background flex flex-1 flex-col gap-2 rounded-md border p-2.5">
          <span className="text-muted-foreground text-[10px]">Sí</span>
        </div>
        <div className="border-border bg-background flex flex-1 flex-col gap-2 rounded-md border p-2.5">
          <span className="bg-muted text-muted-foreground w-fit rounded px-1.5 py-0.5 font-mono text-[10px]">
            .pdf
          </span>
          <span className="text-muted-foreground text-[10px]">AES-256</span>
        </div>
        <div className="border-border bg-background flex flex-1 flex-col gap-1.5 rounded-md border p-2.5">
          <span className={line} />
          <span className={cn(line, "w-3/4")} />
          <span className={cn(line, "w-1/2")} />
        </div>
      </div>
    );
  }
  // overview: suppliers with no status
  return (
    <div className="flex flex-col gap-1.5" aria-hidden="true">
      {["Nube Segura", "Logística Norte", "Datos Axis"].map((n) => (
        <div
          key={n}
          className="border-border bg-background flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
        >
          {n}
          <span className="border-border text-muted-foreground rounded-full border border-dashed px-2 py-0.5 text-[10px]">
            ¿?
          </span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------- rule explorer */

type ExplorerItem = { rule: C.Rule; demo: ReactNode };

/**
 * The rules are a list on the left; hovering or focusing one swaps the working copy
 * of that pattern in the panel on the right. The list is the reading, the panel is the
 * proof, and on a narrow screen the panel stacks under the list.
 */
function RuleExplorer({ items }: { items: ExplorerItem[] }) {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const current = items[active];
  // Hover selects, but only after the pointer rests: crossing the other rows on the
  // way to the panel must not swap the demo out from under it.
  const intent = useRef<number | undefined>(undefined);
  const hoverSelect = (i: number) => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => setActive(i), 140);
  };
  const cancelHover = () => window.clearTimeout(intent.current);
  useEffect(() => () => window.clearTimeout(intent.current), []);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <ul className="flex flex-col gap-1">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li key={it.rule.id}>
              <button
                type="button"
                aria-current={on}
                onMouseEnter={() => hoverSelect(i)}
                onMouseLeave={cancelHover}
                onFocus={() => setActive(i)}
                onClick={() => {
                  cancelHover();
                  setActive(i);
                }}
                className={cn(
                  "w-full cursor-pointer rounded-xl border px-4 py-3 text-left transition-colors duration-[var(--duration-base)]",
                  on
                    ? "border-border bg-muted"
                    : "hover:bg-muted/50 border-transparent"
                )}
              >
                <span className="block text-sm font-semibold">
                  {pick(it.rule.title, lang)}
                </span>
                <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                  {pick(it.rule.body, lang)}
                </span>
                {it.rule.why && (
                  <span className="text-muted-foreground/80 mt-2 block text-xs leading-relaxed">
                    {pick(it.rule.why, lang)}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="border-border bg-card rounded-xl border p-4 sm:p-5">
          <Reveal key={current.rule.id} tier="light" immediate>
            {current.demo}
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  body,
  children,
}: {
  n: number;
  title: Bilingual<string>;
  body: Bilingual<string>;
  children?: ReactNode;
}) {
  const { lang } = useLang();
  return (
    <section className="flex flex-col gap-6" aria-labelledby={`step-${n}`}>
      <Reveal>
        <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className="flex items-start gap-3">
            <span className="bg-foreground text-background flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium">
              {n}
            </span>
            <h3
              id={`step-${n}`}
              className="font-display text-xl leading-tight font-bold tracking-tight sm:text-2xl"
            >
              {pick(title, lang)}
            </h3>
          </div>
          <p className="text-foreground max-w-prose text-base leading-relaxed">
            {pick(body, lang)}
          </p>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function BackDemoCard() {
  return (
    <div className="border-border bg-card rounded-xl border p-4 sm:p-5">
      <BackDemo />
    </div>
  );
}

/** Text on one side, a screen on the other, swapping sides down the page. */
function Split({
  rule,
  reverse,
  screen,
}: {
  rule: C.Rule;
  reverse?: boolean;
  screen: ReactNode;
}) {
  const { lang } = useLang();
  return (
    <Reveal>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] md:gap-10">
        <div className={cn("flex flex-col gap-2", reverse && "md:order-2")}>
          <h4 className="text-base font-semibold">{pick(rule.title, lang)}</h4>
          <p className="text-foreground text-base leading-relaxed">
            {pick(rule.body, lang)}
          </p>
          {rule.why && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {pick(rule.why, lang)}
            </p>
          )}
        </div>
        <div className={cn("min-w-0", reverse && "md:order-1")}>{screen}</div>
      </div>
    </Reveal>
  );
}

/* ----------------------------------------------------------------- page */

export function TpcPage({ item }: { item: WorkItem }) {
  const { lang } = useLang();
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-24 px-6 pt-8 pb-24 sm:gap-28 sm:pt-12">
      <BackLink className="mb-0" />

      {/* Header */}
      <header className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
            {formatYears(item)}
          </div>
          <h1 className="font-display text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
            <HyperText>{pick(item.title, lang)}</HyperText>{" "}
            <span className="text-muted-foreground font-normal">
              — {pick(C.TAGLINE, lang)}
            </span>
          </h1>
        </div>
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            {C.INTRO[lang].map((p, i) => (
              <Reveal key={i} index={i}>
                <p className="text-foreground text-base leading-relaxed">{p}</p>
              </Reveal>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-base">
              <span className="text-muted-foreground">
                {t("work.role", lang)}:{" "}
              </span>
              {pick(C.ROLE, lang)}
            </p>
            <p className="text-base">
              <span className="text-muted-foreground">
                {t("work.contribution", lang)}:{" "}
              </span>
              {C.CONTRIBUTIONS[lang].join(", ")}
            </p>
          </div>
        </div>
      </header>

      {/* Problem */}
      <section className="flex flex-col gap-10" aria-labelledby="problem">
        <Reveal>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeading id="problem">
              {pick(C.PROBLEM_HEADING, lang)}
            </SectionHeading>
            <p className="text-foreground max-w-prose text-lg leading-relaxed">
              {pick(C.PROBLEM_LEAD, lang)}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {C.PAINS.map((p, i) => (
            <Reveal key={p.kind} index={i}>
              <div className="border-border bg-card flex h-full flex-col gap-4 rounded-xl border p-5">
                <PainFigure kind={p.kind} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold">
                    {pick(p.title, lang)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pick(p.text, lang)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="bg-muted max-w-3xl rounded-xl px-6 py-5 text-lg leading-snug font-semibold">
            {pick(C.OUTCOME, lang)}
          </p>
        </Reveal>
      </section>

      {/* What we did */}
      <section className="flex flex-col gap-16" aria-labelledby="did">
        <Reveal>
          <SectionHeading id="did">{pick(C.DID_HEADING, lang)}</SectionHeading>
        </Reveal>

        <Step n={1} title={C.STEP_START.title} body={C.STEP_START.body} />

        <Step n={2} title={C.STEP_UX.title} body={C.STEP_UX.body}>
          <div className="flex flex-col gap-12">
            <Split
              rule={C.UX_RULES.overview}
              screen={<ClipSlot id="overview" />}
            />
            <Split
              reverse
              rule={C.UX_RULES.assignment}
              screen={<ClipSlot id="assignment" />}
            />
          </div>
        </Step>

        <Step n={3} title={C.STEP_FLOWS.title} body={C.STEP_FLOWS.body}>
          <RuleExplorer
            items={[
              { rule: C.FLOW_RULES[0], demo: <ClipSlot id="back" /> },
              { rule: C.FLOW_RULES[1], demo: <ClipSlot id="preview" /> },
              { rule: C.FLOW_RULES[2], demo: <ClipSlot id="disabled" /> },
              { rule: C.FLOW_RULES[3], demo: <ClipSlot id="rows" /> },
            ]}
          />
        </Step>

        <Step n={4} title={C.STEP_BEHAVIOR.title} body={C.STEP_BEHAVIOR.body}>
          <RuleExplorer
            items={[
              { rule: C.BEHAVIOR_RULES[0], demo: <ClipSlot id="rows" /> },
              { rule: C.BEHAVIOR_RULES[1], demo: <ClipSlot id="terms" /> },
              { rule: C.EMPTY_RULE, demo: <ClipSlot id="empty" /> },
            ]}
          />
          <EmptyGallery
            heading={
              <h4 className="text-base font-semibold">
                {pick(C.EMPTY_GALLERY_HEADING, lang)}
              </h4>
            }
          />
        </Step>

        <Step n={5} title={C.STEP_REQS.title} body={C.STEP_REQS.body}>
          <ClipSlot id="requirements" />
        </Step>
      </section>

      {/* Design system */}
      <section className="flex flex-col gap-8" aria-labelledby="ds">
        <Reveal>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeading id="ds">{pick(C.DS_HEADING, lang)}</SectionHeading>
            <div className="flex max-w-prose flex-col gap-4">
              {C.DS_PARAS.map((p, i) => (
                <Para key={i} text={p} />
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal>
          <p className="bg-muted max-w-3xl rounded-xl px-6 py-5 text-lg leading-snug font-semibold">
            {pick(C.DS_QUOTE, lang)}
          </p>
        </Reveal>
        <Split rule={C.DS_RULE} screen={<BackDemoCard />} />
      </section>

      {/* Next */}
      <section className="flex flex-col gap-4" aria-labelledby="next">
        <Reveal>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeading id="next">
              {pick(C.NEXT_HEADING, lang)}
            </SectionHeading>
            <p className="text-foreground max-w-prose text-base leading-relaxed">
              {pick(C.NEXT_BODY, lang)}
            </p>
          </div>
        </Reveal>
      </section>

      <MoreWork excludeSlug={item.slug} limit={3} />
    </main>
  );
}
