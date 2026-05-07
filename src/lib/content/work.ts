import type { Bilingual } from "@/lib/i18n";

export type WorkType =
  | "design-system"
  | "brand-ds"
  | "brand"
  | "experiment"
  | "writing";

export type WorkKind = "case-study" | "process" | "lab";

export type GlyphKey =
  | "design-system"
  | "visual-strategy"
  | "brand-rules"
  | "migration"
  | "wordpress-shell"
  | "breathing";

export type WorkItem = {
  slug: string;
  title: Bilingual<string>;
  description: Bilingual<string>;
  year: number;
  date?: string;
  type: WorkType;
  kind: WorkKind;
  href: string;
  glyph: GlyphKey;
  featured?: boolean;
  revamp?: boolean;
};

export const WORK: WorkItem[] = [
  {
    slug: "afi-design-system",
    title: {
      en: "Afi Design System",
      es: "Sistema de diseño de Afi",
    },
    description: {
      en: "Building a unified design system and AI-powered platform for a fintech consultancy — from scattered docs to scalable white-label infrastructure.",
      es: "Construyendo un sistema de diseño unificado y una plataforma impulsada por IA para una consultora fintech — de documentación dispersa a una infraestructura white-label escalable.",
    },
    year: 2026,
    type: "design-system",
    kind: "case-study",
    href: "/work/afi-design-system",
    glyph: "design-system",
    featured: true,
  },
  {
    slug: "kt360",
    title: { en: "KT360", es: "KT360" },
    description: {
      en: "Brand strategy, design rules, and an AI-powered system that lets non-technical people ship consistent, high-quality work.",
      es: "Estrategia de marca, reglas de diseño y un sistema impulsado por IA que permite a personas sin perfil técnico lanzar trabajo consistente y de calidad.",
    },
    year: 2025,
    type: "brand-ds",
    kind: "case-study",
    href: "/work/kt360",
    glyph: "brand-rules",
  },
  {
    slug: "audemic-growth",
    title: { en: "Audemic", es: "Audemic" },
    description: {
      en: "Pivoting a B2C research app to B2B enterprise — validated in a week with AI-driven interviews and 20 qualified leads.",
      es: "Pivotando una app de investigación B2C hacia B2B enterprise — validado en una semana con entrevistas impulsadas por IA y 20 leads cualificados.",
    },
    year: 2024,
    type: "experiment",
    kind: "case-study",
    href: "/work/audemic-growth",
    glyph: "visual-strategy",
  },
  {
    slug: "mindfulme",
    title: { en: "Mindfulme", es: "Mindfulme" },
    description: {
      en: "Brand identity and MVP experience for a mindfulness app that treats each person's journey as unique — no cookie-cutter meditations.",
      es: "Identidad de marca y experiencia MVP para una app de mindfulness que trata el camino de cada persona como único — nada de meditaciones en serie.",
    },
    year: 2024,
    type: "brand-ds",
    kind: "case-study",
    href: "/work/mindfulme",
    glyph: "visual-strategy",
  },
  {
    slug: "design-md-primeng-wealth-manager",
    title: {
      en: "Writing the rulebook PrimeNG doesn't ship with",
      es: "Escribiendo el manual de reglas que PrimeNG no incluye",
    },
    description: {
      en: "A design.md for our Wealth Manager product — how I closed the Figma/code drift and taught AI agents to generate correct UI.",
      es: "Un design.md para nuestro producto Wealth Manager — cómo cerré el desfase entre Figma y código y enseñé a los agentes de IA a generar la UI correcta.",
    },
    year: 2026,
    date: "2026-04-23",
    type: "writing",
    kind: "process",
    href: "/writing/design-md-primeng-wealth-manager",
    glyph: "migration",
  },
  {
    slug: "page-layout-template",
    title: {
      en: "One Template to Rule Every Page",
      es: "One Template to Rule Every Page",
    },
    description: {
      en: "Why consistency matters more than flexibility, and how a single page layout template replaced three copies of the same header.",
      es: "Why consistency matters more than flexibility, and how a single page layout template replaced three copies of the same header.",
    },
    year: 2026,
    date: "2026-04-30",
    type: "writing",
    kind: "process",
    href: "/writing/page-layout-template",
    glyph: "migration",
  },
  {
    slug: "from-static-to-code",
    title: {
      en: "From Static Screens to Code-First Design",
      es: "From Static Screens to Code-First Design",
    },
    description: {
      en: "How AWM design went code-first with AI — and why vibe coding is design.",
      es: "How AWM design went code-first with AI — and why vibe coding is design.",
    },
    year: 2026,
    date: "2026-04-29",
    type: "writing",
    kind: "process",
    href: "/writing/from-static-to-code",
    glyph: "design-system",
  },
  {
    slug: "bootstrapping-the-showcase",
    title: {
      en: "Bootstrapping the AWM Design Showcase",
      es: "Bootstrapping the AWM Design Showcase",
    },
    description: {
      en: "Setting up an internal design showcase on PrimeNG + Angular 21 — repo layout, agent rulebook, theme preset, page shell, all from a clean machine.",
      es: "Setting up an internal design showcase on PrimeNG + Angular 21 — repo layout, agent rulebook, theme preset, page shell, all from a clean machine.",
    },
    year: 2026,
    date: "2026-04-29",
    type: "writing",
    kind: "process",
    href: "/writing/bootstrapping-the-showcase",
    glyph: "wordpress-shell",
  },
  {
    slug: "wordpress-ai-front-end-shell",
    title: {
      en: "AI-built sites without leaving WordPress",
      es: "Sitios construidos con IA sin salir de WordPress",
    },
    description: {
      en: "How an Astro front-end shell on top of WordPress unlocks AI iteration for non-technical operators — without breaking SEO or the workflows their business already runs on.",
      es: "Cómo un shell de Astro sobre WordPress desbloquea la iteración con IA para operadores no técnicos — sin romper el SEO ni los flujos de trabajo en los que ya se apoya su negocio.",
    },
    year: 2026,
    date: "2026-04-26",
    type: "writing",
    kind: "process",
    href: "/writing/wordpress-ai-front-end-shell",
    glyph: "wordpress-shell",
  },
  {
    slug: "breathing-randomizer",
    title: {
      en: "Breathing Randomizer",
      es: "Generador de respiración",
    },
    description: {
      en: "A micro-break tool with five guided breathing exercises — Box, 4-7-8, Physiological Sigh, Coherent, and Triangle. Hit Randomize and follow the animated ball.",
      es: "Una herramienta de micro-pausa con cinco ejercicios de respiración guiada — Caja, 4-7-8, Suspiro fisiológico, Coherente y Triangular. Dale a Aleatorio y sigue la bola animada.",
    },
    year: 2026,
    date: "2026-05-01",
    type: "experiment",
    kind: "lab",
    href: "/playground/breathing",
    glyph: "breathing",
  },
];

export const KIND_LABELS: Record<WorkKind, Bilingual<string>> = {
  "case-study": { en: "Case study", es: "Caso de estudio" },
  process: { en: "Process", es: "Proceso" },
  lab: { en: "Lab", es: "Laboratorio" },
};

export function sortKey(item: WorkItem): string {
  return item.date ?? `${item.year}-01-01`;
}
