import type { Bilingual } from "@/lib/i18n";

export type WorkType =
  | "design-system"
  | "brand-ds"
  | "brand"
  | "experiment"
  | "writing";

export type WorkKind = "case-study" | "process";

export type GlyphKey =
  | "design-system"
  | "visual-strategy"
  | "brand-rules"
  | "migration";

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
];

export const KIND_LABELS: Record<WorkKind, Bilingual<string>> = {
  "case-study": { en: "Case study", es: "Caso de estudio" },
  process: { en: "Process", es: "Proceso" },
};

export function sortKey(item: WorkItem): string {
  return item.date ?? `${item.year}-01-01`;
}
