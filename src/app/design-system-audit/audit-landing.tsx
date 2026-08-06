"use client";

import { useState } from "react";

import { AuditDriftMapGlyph } from "@/components/motion/glyphs/design-system-audit-drift-map";
import { AuditGapTableGlyph } from "@/components/motion/glyphs/design-system-audit-gap-table";
import { AuditRoadmapGlyph } from "@/components/motion/glyphs/design-system-audit-roadmap";
import { DesignSystemAuditHeroGlyph } from "@/components/motion/glyphs/design-system-audit-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// TODO: swap for cal.com booking link once created
const BOOKING_URL =
  "mailto:richardgrinerdesigns@gmail.com?subject=Design%20System%20Audit";

type Bi = Bilingual<string>;

function PlaceholderFrame({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-muted/50 flex min-h-40 items-center justify-center rounded-lg border border-dashed p-6",
        className
      )}
    >
      <span className="border-border bg-background text-muted-foreground rounded-md border px-3 py-1 text-center font-mono text-xs">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Copy — EN authored fully, ES first pass. Every ES value is annotated with
// // TODO(afi-redaccion) per the repo convention (see src/components/hero.tsx).
// ---------------------------------------------------------------------------

const HERO_HEADLINE: Bi = {
  en: "Every screen your team ships drifts a little further from the last.",
  // TODO(afi-redaccion)
  es: "Cada pantalla que tu equipo lanza se aleja un poco más de la anterior.",
};

const HERO_SUBHEAD: Bi = {
  en: "I find out how far — and hand you the 90-day plan to fix it. A design system audit for AI and fintech teams. One week, flat fee.",
  // TODO(afi-redaccion)
  es: "Averiguo cuánto — y te entrego el plan de 90 días para arreglarlo. Una auditoría de sistema de diseño para equipos de IA y fintech. Una semana, tarifa fija.",
};

const CTA_PRIMARY: Bi = {
  en: "Book the audit — $3,000",
  // TODO(afi-redaccion)
  es: "Reserva la auditoría — 3000 $",
};

const CTA_SECONDARY: Bi = {
  en: "See what you get",
  // TODO(afi-redaccion)
  es: "Ve qué incluye",
};

const CTA_BOOK: Bi = {
  en: "Book the audit",
  // TODO(afi-redaccion)
  es: "Reserva la auditoría",
};

const PROBLEM_HEADING: Bi = {
  en: "You already know the symptoms.",
  // TODO(afi-redaccion)
  es: "Ya conoces los síntomas.",
};

const PROBLEM_CARDS: Array<{ title: Bi; body: Bi }> = [
  {
    title: {
      en: "Five versions of every button",
      // TODO(afi-redaccion)
      es: "Cinco versiones de cada botón",
    },
    body: {
      en: "Each new feature ships its own variant. Nobody can say which one is canonical.",
      // TODO(afi-redaccion)
      es: "Cada nueva función lanza su propia variante. Nadie sabe cuál es la canónica.",
    },
  },
  {
    title: {
      en: "Design → eng handoff is a debate",
      // TODO(afi-redaccion)
      es: "El traspaso de diseño a desarrollo es un debate",
    },
    body: {
      en: "Engineers rebuild what design already decided. Both sides think the other is drifting.",
      // TODO(afi-redaccion)
      es: "Los desarrolladores reconstruyen lo que diseño ya decidió. Cada lado cree que el otro se está desviando.",
    },
  },
  {
    title: {
      en: "New hires make it worse",
      // TODO(afi-redaccion)
      es: "Las nuevas contrataciones lo empeoran",
    },
    body: {
      en: "You just raised and you're hiring. Every new designer and engineer multiplies the entropy.",
      // TODO(afi-redaccion)
      es: "Acabas de levantar una ronda y estás contratando. Cada nuevo diseñador o ingeniero multiplica la entropía.",
    },
  },
];

const DELIVERABLES_HEADING: Bi = {
  en: "One week. Three deliverables.",
  // TODO(afi-redaccion)
  es: "Una semana. Tres entregables.",
};

const DELIVERABLES: Array<{ title: Bi; body: Bi }> = [
  {
    title: {
      en: "UI drift map",
      // TODO(afi-redaccion)
      es: "Mapa de desviación de la UI",
    },
    body: {
      en: "Every inconsistency across your product, screenshotted, clustered, and ranked by user-facing damage.",
      // TODO(afi-redaccion)
      es: "Cada inconsistencia de tu producto, capturada, agrupada y priorizada según el daño que causa al usuario.",
    },
  },
  {
    title: {
      en: "Token & component gap analysis",
      // TODO(afi-redaccion)
      es: "Análisis de brechas de tokens y componentes",
    },
    body: {
      en: "What you have, what's missing, and what's fake-systemized — hard-coded values wearing a component's name.",
      // TODO(afi-redaccion)
      es: "Lo que tienes, lo que falta y lo que está falsamente sistematizado: valores fijos disfrazados de componente.",
    },
  },
  {
    title: {
      en: "90-day roadmap",
      // TODO(afi-redaccion)
      es: "Hoja de ruta de 90 días",
    },
    body: {
      en: "A prioritized, sequenced plan your team can execute — with or without me.",
      // TODO(afi-redaccion)
      es: "Un plan priorizado y secuenciado que tu equipo puede ejecutar, conmigo o sin mí.",
    },
  },
];

// Index-aligned with DELIVERABLES — the card glyphs from the motion brief
// (src/components/motion/glyphs/design-system-audit.brief.md), hover-driven
// via each card's rest/hover motion wrapper.
const DELIVERABLE_GLYPHS = [
  AuditDriftMapGlyph,
  AuditGapTableGlyph,
  AuditRoadmapGlyph,
] as const;

const PROCESS_HEADING: Bi = {
  en: "How the week runs",
  // TODO(afi-redaccion)
  es: "Cómo transcurre la semana",
};

const PROCESS_STEPS: Array<{ title: Bi; body: Bi }> = [
  {
    title: {
      en: "Day 1 — Access & kickoff (30 min)",
      // TODO(afi-redaccion)
      es: "Día 1 — Acceso y arranque (30 min)",
    },
    body: {
      en: "You give me read access to the product and Figma. One call, then I disappear and work.",
      // TODO(afi-redaccion)
      es: "Me das acceso de lectura al producto y a Figma. Una llamada, y luego desaparezco a trabajar.",
    },
  },
  {
    title: {
      en: "Days 2–5 — The teardown",
      // TODO(afi-redaccion)
      es: "Días 2–5 — El análisis",
    },
    body: {
      en: "I audit every core flow: tokens, components, design-to-code parity. No meetings, no time from your team.",
      // TODO(afi-redaccion)
      es: "Audito cada flujo principal: tokens, componentes, paridad entre diseño y código. Sin reuniones, sin tiempo de tu equipo.",
    },
  },
  {
    title: {
      en: "Day 7 — Walkthrough (60 min)",
      // TODO(afi-redaccion)
      es: "Día 7 — Presentación (60 min)",
    },
    body: {
      en: "I present the drift map, gap analysis, and roadmap live to you and your leads. You keep everything.",
      // TODO(afi-redaccion)
      es: "Presento en vivo el mapa de desviación, el análisis de brechas y la hoja de ruta a ti y a tus líderes. Todo se queda contigo.",
    },
  },
];

const PRICE_HEADING: Bi = {
  en: "The audit is $3,000. Flat.",
  // TODO(afi-redaccion)
  es: "La auditoría cuesta 3000 $. Fijo.",
};

const PRICE_BODY: Bi = {
  en: "No scoping call to find out the price — this is the price. Delivered in one week, guaranteed.",
  // TODO(afi-redaccion)
  es: "Sin llamada de alcance para saber el precio — este es el precio. Entregado en una semana, garantizado.",
};

const PRICE_GUARANTEE_LEAD: Bi = {
  en: "If I find nothing worth fixing, I'll tell you that too",
  // TODO(afi-redaccion)
  es: "Si no encuentro nada que valga la pena arreglar, también te lo diré",
};

const PRICE_GUARANTEE_REST: Bi = {
  en: "— and you'll know your system is clean. That report is worth having either way.",
  // TODO(afi-redaccion)
  es: "— y sabrás que tu sistema está limpio. Ese informe merece la pena de cualquier forma.",
};

const PRICE_ANCHOR_LEAD: Bi = {
  en: "For scale:",
  // TODO(afi-redaccion)
  es: "Para dar contexto:",
};

const PRICE_ANCHOR_REST: Bi = {
  en: "a founding product designer runs $140–180k/yr and takes three months to hire. This is one week, no headcount, and you'll know exactly what that hire should do on day one.",
  // TODO(afi-redaccion)
  es: "un diseñador de producto fundador cuesta entre 140.000 y 180.000 $/año y tarda tres meses en contratarse. Esto es una semana, sin contratación, y sabrás exactamente qué debería hacer esa persona desde el primer día.",
};

const WHO_HEADING: Bi = {
  en: "I do this inside a fintech company all day.",
  // TODO(afi-redaccion)
  es: "Hago esto dentro de una empresa fintech todos los días.",
};

const WHO_PARA_1: Bi = {
  en: "I'm Richard Griner, a design system designer working in AI and fintech. Design systems aren't a service line I added — they're the entire job: tokens, component architecture, and the design-to-engineering handoff, in exactly the stack your team is probably using.",
  // TODO(afi-redaccion)
  es: "Soy Richard Griner, diseñador de sistemas de diseño en IA y fintech. Los sistemas de diseño no son una línea de servicio que añadí — son el trabajo entero: tokens, arquitectura de componentes y el traspaso entre diseño e ingeniería, en exactamente el stack que probablemente usa tu equipo.",
};

const WHO_PARA_2: Bi = {
  en: "The audit exists because most teams don't need a $50k agency engagement — they need one specialist to look hard at their product for a week and tell them the truth. For larger builds, I work with a small collective of designers and engineers I trust — I lead the work and own the quality; they let us move faster.",
  // TODO(afi-redaccion)
  es: "La auditoría existe porque la mayoría de los equipos no necesitan una agencia de 50.000 $ — necesitan que un especialista mire su producto de cerca durante una semana y les diga la verdad. Para construcciones más grandes, trabajo con un pequeño colectivo de diseñadores e ingenieros de confianza — yo lidero el trabajo y respondo por la calidad; ellos nos permiten movernos más rápido.",
};

const WHO_VISUAL: Bi = {
  en: "IMG: headshot — working, not posed",
  // TODO(afi-redaccion)
  es: "IMG: foto — trabajando, no posada",
};

const OBJECTIONS_HEADING: Bi = {
  en: "Fair questions",
  // TODO(afi-redaccion)
  es: "Preguntas razonables",
};

const OBJECTIONS: Array<{ q: Bi; a: Bi }> = [
  {
    q: {
      en: "We don't have a design system yet — is an audit premature?",
      // TODO(afi-redaccion)
      es: "Todavía no tenemos un sistema de diseño — ¿no es prematura una auditoría?",
    },
    a: {
      en: "That's the cheapest time to do it. The audit maps what's already there implicitly — every product has a de-facto system — and gives you the plan to make it real before the drift compounds.",
      // TODO(afi-redaccion)
      es: "Ese es el momento más barato para hacerlo. La auditoría mapea lo que ya existe implícitamente — todo producto tiene un sistema de facto — y te da el plan para hacerlo real antes de que la desviación se acumule.",
    },
  },
  {
    q: {
      en: "Can our own team just do this?",
      // TODO(afi-redaccion)
      es: "¿Puede hacerlo nuestro propio equipo?",
    },
    a: {
      en: "Eventually, yes — and the roadmap is written so they can. But teams inside the product stop seeing the drift. A cold outside read in one week is the entire value.",
      // TODO(afi-redaccion)
      es: "Con el tiempo, sí — y la hoja de ruta está escrita para que puedan hacerlo. Pero los equipos dentro del producto dejan de ver la desviación. Una mirada externa y objetiva en una semana es todo el valor.",
    },
  },
  {
    q: {
      en: "What happens after the audit?",
      // TODO(afi-redaccion)
      es: "¿Qué pasa después de la auditoría?",
    },
    a: {
      en: "You own everything and can run the roadmap yourselves. If you want help executing it, that's a separate conversation. About half of teams ask, half don't — both are fine.",
      // TODO(afi-redaccion)
      es: "Todo te pertenece y puedes ejecutar la hoja de ruta vosotros mismos. Si quieres ayuda para ejecutarla, esa es otra conversación aparte. Cerca de la mitad de los equipos lo piden, la otra mitad no — ambas opciones están bien.",
    },
  },
];

const CLOSE_HEADING: Bi = {
  en: "Find out how far it's drifted.",
  // TODO(afi-redaccion)
  es: "Descubre cuánto se ha desviado.",
};

const CLOSE_SUBHEAD: Bi = {
  en: "One week from kickoff to roadmap. $3,000 flat.",
  // TODO(afi-redaccion)
  es: "Una semana desde el arranque hasta la hoja de ruta. 3000 $ fijos.",
};

/**
 * One deliverable card. Hover state is tracked explicitly and passed to the
 * glyph as `active` (each glyph drives its own variants) — variant-label
 * propagation from a parent wrapper can't reach these glyphs, since their
 * svg roots control their own variants for the reduced-motion pin.
 */
function DeliverableCard({
  item,
  Glyph,
  lang,
}: {
  item: { title: Bi; body: Bi };
  Glyph: (typeof DELIVERABLE_GLYPHS)[number];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const [active, setActive] = useState(false);

  return (
    <Card
      className="h-full"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <CardContent>
        <div className="border-border bg-muted/30 flex min-h-40 items-center justify-center rounded-lg border">
          <Glyph active={active} />
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle>{pick(item.title, lang)}</CardTitle>
        <CardDescription>{pick(item.body, lang)}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function AuditLanding() {
  const { lang } = useLang();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-6 pt-8 pb-24 sm:gap-28 sm:pt-12">
        {/* 01 · Hero */}
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
              {pick(HERO_HEADLINE, lang)}
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
              {pick(HERO_SUBHEAD, lang)}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                nativeButton={false}
                render={<a href={BOOKING_URL} />}
              >
                {pick(CTA_PRIMARY, lang)}
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<a href="#deliverables" />}
              >
                {pick(CTA_SECONDARY, lang)}
              </Button>
            </div>
          </div>
          <div className="border-border bg-muted/30 flex min-h-56 items-center justify-center rounded-xl border p-6 sm:min-h-64">
            <DesignSystemAuditHeroGlyph />
          </div>
        </section>

        {/* 02 · Proof strip intentionally cut — the wireframe's own note says
            skip it without 3+ real client logos, and we don't have those yet. */}

        {/* 03 · The problem */}
        <section className="flex flex-col gap-8">
          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            {pick(PROBLEM_HEADING, lang)}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {PROBLEM_CARDS.map((card) => (
              <Card key={card.title.en}>
                <CardContent>
                  <CardTitle>{pick(card.title, lang)}</CardTitle>
                  <CardDescription className="mt-2">
                    {pick(card.body, lang)}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 04 · What you get */}
        <section id="deliverables" className="flex flex-col gap-8">
          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            {pick(DELIVERABLES_HEADING, lang)}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {DELIVERABLES.map((item, i) => (
              <DeliverableCard
                key={item.title.en}
                item={item}
                Glyph={DELIVERABLE_GLYPHS[i]}
                lang={lang}
              />
            ))}
          </div>
        </section>

        {/* 05 · Process */}
        <section className="flex flex-col gap-8">
          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            {pick(PROCESS_HEADING, lang)}
          </h2>
          <div className="divide-border flex flex-col divide-y">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.title.en}
                className="flex gap-4 py-5 first:pt-0 last:pb-0"
              >
                <span className="border-border text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-foreground font-medium">
                    {pick(step.title, lang)}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {pick(step.body, lang)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 06 · Price — this palette is grayscale (no hue anywhere), so there's
            no accent color to reserve. This section is the visual emphasis
            surface instead: weight and contrast (bg-muted + a heavier border),
            not color. Primary CTAs keep the site's normal near-black accent
            throughout the page. */}
        <section className="flex flex-col gap-6">
          <div className="bg-muted border-foreground/20 rounded-xl border-2 p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex flex-col gap-3">
                <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
                  {pick(PRICE_HEADING, lang)}
                </h2>
                <p className="text-muted-foreground">
                  {pick(PRICE_BODY, lang)}
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground font-medium">
                    {pick(PRICE_GUARANTEE_LEAD, lang)}
                  </strong>{" "}
                  {pick(PRICE_GUARANTEE_REST, lang)}
                </p>
              </div>
              <Button
                size="lg"
                nativeButton={false}
                render={<a href={BOOKING_URL} />}
              >
                {pick(CTA_BOOK, lang)}
              </Button>
            </div>
          </div>
          <p className="border-border text-muted-foreground max-w-2xl border-l-2 pl-4 text-sm leading-relaxed">
            <strong className="text-foreground font-medium">
              {pick(PRICE_ANCHOR_LEAD, lang)}
            </strong>{" "}
            {pick(PRICE_ANCHOR_REST, lang)}
          </p>
        </section>

        {/* 07 · Who */}
        <section className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
          <PlaceholderFrame
            label={pick(WHO_VISUAL, lang)}
            className="min-h-52"
          />
          <div className="flex flex-col gap-4">
            <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
              {pick(WHO_HEADING, lang)}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {pick(WHO_PARA_1, lang)}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {pick(WHO_PARA_2, lang)}
            </p>
          </div>
        </section>

        {/* 08 · Objections */}
        <section className="flex flex-col gap-6">
          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            {pick(OBJECTIONS_HEADING, lang)}
          </h2>
          <div className="divide-border border-border divide-y border-t border-b">
            {OBJECTIONS.map((item) => (
              <details key={item.q.en} className="group py-4">
                <summary className="text-foreground focus-visible:ring-ring/50 flex cursor-pointer list-none items-center justify-between gap-4 font-medium outline-none focus-visible:ring-2">
                  {pick(item.q, lang)}
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground duration-base shrink-0 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {pick(item.a, lang)}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 09 · Close */}
        <section className="flex flex-col items-center gap-4 py-12 text-center">
          <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
            {pick(CLOSE_HEADING, lang)}
          </h2>
          <p className="text-muted-foreground max-w-md text-lg">
            {pick(CLOSE_SUBHEAD, lang)}
          </p>
          <Button
            size="lg"
            nativeButton={false}
            render={<a href={BOOKING_URL} />}
          >
            {pick(CTA_BOOK, lang)}
          </Button>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
