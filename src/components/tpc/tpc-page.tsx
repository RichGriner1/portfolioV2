"use client";

import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { BackLink } from "@/components/back-link";
import { HyperText } from "@/components/magicui/hyper-text";
import { MoreWork } from "@/components/more-work";
import { BackDemo } from "@/components/tpc/demos";
import * as C from "@/components/tpc/copy";
import { Reveal } from "@/components/tpc/reveal";
import { type DiagramSvgs } from "@/components/diagram";
import { FlowWalkthrough } from "@/components/tpc/flow-walkthrough";
import { ClipSlot, StillFrame } from "@/components/tpc/clip-slot";
import { TEMPLATES_AFTER, TEMPLATES_BEFORE } from "@/components/tpc/clips";
import { EmptyGallery } from "@/components/tpc/empty-gallery";
import { type WorkItem, formatYears } from "@/lib/content/work";
import { type Bilingual, pick, t, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Chapter order, so each section heading carries its number. */
const CHAPTERS = ["problem", "before", "did", "cleanup", "ds", "test"];

/**
 * A chapter opener: a rule across the page and the chapter number above the
 * heading, so the six sections read as separate parts rather than one run of
 * heading-plus-paragraph blocks.
 */
function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  const n = CHAPTERS.indexOf(id) + 1;
  return (
    <div className="flex flex-col gap-3">
      {n > 0 && (
        <span className="text-muted-foreground font-mono text-xs tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
      )}
      <h2
        id={id}
        className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
      >
        {children}
      </h2>
    </div>
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
    <div className="flex flex-col gap-4">
      <ul
        className="grid grid-cols-1 gap-2 lg:grid-cols-[repeat(var(--rules),minmax(0,1fr))]"
        style={{ "--rules": items.length } as CSSProperties}
      >
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
                  "h-full w-full cursor-pointer rounded-xl border px-4 py-3 text-left transition-colors duration-[var(--duration-base)]",
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
      <div>
        <div className="border-border bg-card rounded-xl border p-2 sm:p-3">
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
              className="font-display text-lg leading-tight font-bold tracking-tight sm:text-xl"
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

/**
 * The point first, then its screen at the full width of the page: the
 * recordings are of a whole desktop app, and anything narrower makes the
 * interface too small to read.
 */
function Split({ rule, screen }: { rule: C.Rule; screen: ReactNode }) {
  const { lang } = useLang();
  return (
    <Reveal>
      <div className="flex flex-col gap-5">
        <div className="flex max-w-prose flex-col gap-2">
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
        <div className="min-w-0">{screen}</div>
      </div>
    </Reveal>
  );
}

/* ----------------------------------------------------------------- page */

/** The rule as text, then v1.0 and v1.1 side by side (stacked on a phone). */
function BeforeAfter({ rule }: { rule: C.Rule }) {
  const { lang } = useLang();
  const shots = [
    { label: C.VERSION_LABELS.before, still: TEMPLATES_BEFORE },
    { label: C.VERSION_LABELS.after, still: TEMPLATES_AFTER },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div className="flex max-w-prose flex-col gap-2">
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
      </Reveal>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {shots.map((s, i) => (
          <Reveal key={s.still.src} index={i}>
            <figure className="flex flex-col gap-2">
              <StillFrame
                still={s.still}
                sizes="(min-width: 768px) 480px, 100vw"
              />
              <figcaption className="text-muted-foreground font-mono text-xs">
                {pick(s.label, lang)}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function TpcPage({
  item,
}: {
  item: WorkItem;
  /** The static user flow diagram. The page now shows the loop as FlowWalkthrough. */
  flow?: Bilingual<DiagramSvgs>;
}) {
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
      <section
        className="border-border flex flex-col gap-10 border-t pt-10"
        aria-labelledby="problem"
      >
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

      {/* Before: v1.0 */}
      <section
        className="border-border flex flex-col gap-10 border-t pt-10"
        aria-labelledby="before"
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeading id="before">
              {pick(C.BEFORE_HEADING, lang)}
            </SectionHeading>
            <p className="text-foreground max-w-prose text-lg leading-relaxed">
              {pick(C.BEFORE_LEAD, lang)}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {C.BEFORE_ISSUES.map((issue, i) => (
            <Reveal key={issue.id} index={i}>
              <div className="border-border bg-card flex h-full flex-col gap-1.5 rounded-xl border p-5">
                <h3 className="text-sm font-semibold">
                  {pick(issue.title, lang)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pick(issue.text, lang)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <BeforeAfter rule={C.BEFORE_EXAMPLE} />
      </section>

      {/* What we did */}
      <section
        className="border-border flex flex-col gap-16 border-t pt-10"
        aria-labelledby="did"
      >
        <Reveal>
          <SectionHeading id="did">{pick(C.DID_HEADING, lang)}</SectionHeading>
        </Reveal>

        <Step n={1} title={C.STEP_UX.title} body={C.STEP_UX.body}>
          <div className="flex flex-col gap-12">
            <Split
              rule={C.UX_RULES.overview}
              screen={<ClipSlot id="overview" />}
            />
            <Split
              rule={C.UX_RULES.assignment}
              screen={<ClipSlot id="assignment" />}
            />
          </div>
        </Step>

        <Step n={2} title={C.STEP_FLOWS.title} body={C.STEP_FLOWS.body}>
          <Reveal>
            <div className="flex flex-col gap-3">
              <FlowWalkthrough />
              <p className="text-muted-foreground text-sm">
                {pick(C.FLOW_CAPTION, lang)}
              </p>
            </div>
          </Reveal>
          <RuleExplorer
            items={[
              { rule: C.FLOW_RULES[0], demo: <ClipSlot id="back" /> },
              { rule: C.FLOW_RULES[1], demo: <ClipSlot id="preview" /> },
              { rule: C.FLOW_RULES[2], demo: <ClipSlot id="disabled" /> },
              { rule: C.FLOW_RULES[3], demo: <ClipSlot id="rows" /> },
            ]}
          />
        </Step>

        <Step n={3} title={C.STEP_BEHAVIOR.title} body={C.STEP_BEHAVIOR.body}>
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

        <Step n={4} title={C.STEP_REQS.title} body={C.STEP_REQS.body}>
          <ClipSlot id="requirements" />
        </Step>
      </section>

      {/* Cleanup */}
      <section
        className="border-border flex flex-col gap-10 border-t pt-10"
        aria-labelledby="cleanup"
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeading id="cleanup">
              {pick(C.CLEANUP_HEADING, lang)}
            </SectionHeading>
            <div className="flex max-w-prose flex-col gap-4">
              {C.CLEANUP_PARAS.map((p, i) => (
                <Para key={i} text={p} />
              ))}
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {C.CLEANUP_STATS.map((s, i) => (
            <Reveal key={s.id} index={i}>
              <div className="border-border bg-card flex h-full flex-col gap-2 rounded-xl border p-5">
                <p className="font-display text-4xl leading-none font-bold tracking-tight">
                  {pick(s.value, lang)}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pick(s.label, lang)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Design system */}
      <section
        className="border-border flex flex-col gap-8 border-t pt-10"
        aria-labelledby="ds"
      >
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

      {/* Test */}
      <section
        className="border-border flex flex-col gap-8 border-t pt-10"
        aria-labelledby="test"
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeading id="test">
              {pick(C.TEST_HEADING, lang)}
            </SectionHeading>
            <div className="flex max-w-prose flex-col gap-4">
              {C.TEST_PARAS.map((p, i) => (
                <Para key={i} text={p} />
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal>
          <p className="bg-muted max-w-3xl rounded-xl px-6 py-5 text-lg leading-snug font-semibold">
            {pick(C.TEST_MISS, lang)}
          </p>
        </Reveal>
      </section>

      <MoreWork excludeSlug={item.slug} limit={3} />
    </main>
  );
}
