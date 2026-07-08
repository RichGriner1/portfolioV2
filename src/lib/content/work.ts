import type { FigureKey } from "@/components/motion/figures";
import type { Bilingual } from "@/lib/i18n";

export type WorkType =
  | "design-system"
  | "brand-ds"
  | "brand"
  | "experiment"
  | "writing";

export type WorkKind = "case-study" | "process" | "lab" | "methodology";

export type GlyphKey =
  | "design-system"
  | "visual-strategy"
  | "brand-rules"
  | "migration"
  | "wordpress-shell"
  | "breathing"
  | "palette"
  | "canvas"
  | "mindfulme"
  | "typo-trail"
  | "layout-grammar";

export type WorkItem = {
  slug: string;
  title: Bilingual<string>;
  description: Bilingual<string>;
  year: number;
  date?: string;
  type: WorkType;
  kind: WorkKind;
  href: string;
  glyph?: GlyphKey;
  /** Optional thumbnail-video base path. Full src is built per language + theme:
      `${video}_${lang}_${light|dark}_thumb.mp4`. Shown in place of the glyph. */
  video?: string;
  /** Optional animated figure (from blog posts) shown in place of the glyph. */
  figure?: FigureKey;
  bento?: "square" | "tall" | "wide";
  bgColor?: string;
  featured?: boolean;
  revamp?: boolean;
  hidden?: boolean;
  ongoing?: boolean;
};

export const WORK: WorkItem[] = [
  {
    slug: "loops-and-skills-are-components",
    title: {
      en: "Loops and skills are components, not folders",
      es: "Los loops y las skills son componentes, no carpetas",
    },
    description: {
      en: "Building a reusable, portable AI workflow — and what it cost me to learn how it spends while it runs.",
      es: "Construir un flujo de trabajo de IA reutilizable y portable, y lo que me costó entender cómo gasta mientras se ejecuta.",
    },
    year: 2026,
    date: "2026-07-08",
    type: "writing",
    kind: "process",
    href: "/writing/loops-and-skills-are-components",
    figure: "loop-vs-skill",
    bento: "square",
  },
  {
    slug: "color-methodology",
    title: {
      en: "Building color in four layers",
      es: "Construir el color en cuatro capas",
    },
    description: {
      en: "A methodology for a token-based color system: raw values → primitives → semantic roles → components, so a rebrand is one token, not a hunt.",
      // TODO(afi-redaccion)
      es: "Una metodología para un sistema de color basado en tokens: valores en bruto → primitivos → roles semánticos → componentes, para que un cambio de marca sea un token, no una búsqueda.",
    },
    year: 2026,
    date: "2026-07-01",
    type: "design-system",
    kind: "methodology",
    href: "/methodology/color",
    glyph: "palette",
    video: "/methodology/token-levels",
    bento: "square",
    featured: true,
  },
  {
    slug: "afi-design-system",
    title: {
      en: "Afi Design System",
      es: "Sistema de diseño de Afi",
    },
    description: {
      en: "White label design system Figma plus vibe coding prototype environment, brand changes via tokens.",
      // TODO(afi-redaccion)
      es: "Sistema de diseño white-label de Figma más entorno de prototipado vibe-coded, cambios de marca a través de tokens.",
    },
    year: 2026,
    type: "design-system",
    kind: "case-study",
    href: "/work/afi-design-system",
    glyph: "palette",
    bento: "square",
    featured: true,
    ongoing: true,
  },
  {
    slug: "kt360",
    title: { en: "KnowThyself360", es: "KnowThyself360" },
    description: {
      en: "A shared environment for non-technical people to push changes and ship live.",
      // TODO(afi-redaccion)
      es: "Un entorno compartido para personas no técnicas para subir cambios y lanzar en vivo.",
    },
    year: 2025,
    type: "brand-ds",
    kind: "case-study",
    href: "/work/kt360",
    glyph: "canvas",
    bento: "square",
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
    hidden: true,
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
    glyph: "mindfulme",
    bento: "square",
    bgColor: "#e6f5f6",
  },
  {
    slug: "design-md-primeng-wealth-manager",
    title: {
      en: "Creating a design.md",
      // TODO(afi-redaccion)
      es: "Creando un design.md",
    },
    description: {
      en: "Markdown rulebook AI agents read to generate Wealth Manager UI, closing Figma to code drift.",
      // TODO(afi-redaccion)
      es: "Manual en markdown que los agentes de IA leen para generar la UI de Wealth Manager, cerrando el desfase entre Figma y código.",
    },
    year: 2026,
    date: "2026-04-23",
    type: "writing",
    kind: "process",
    href: "/writing/design-md-primeng-wealth-manager",
    glyph: "typo-trail",
    bento: "square",
    bgColor: "#ff7cba",
  },
  {
    slug: "fintech-layout-grammar",
    title: {
      en: "A layout grammar for dense fin-tech",
      // TODO(afi-redaccion)
      es: "Una gramática de layout para fin-tech denso",
    },
    description: {
      en: "Defining the global → page → section → content stack that keeps Wealth Manager and Wealth Planner coherent.",
      // TODO(afi-redaccion)
      es: "Definiendo la pila global → página → sección → contenido que mantiene Wealth Manager y Wealth Planner coherentes.",
    },
    year: 2026,
    date: "2026-06-08",
    type: "writing",
    kind: "process",
    href: "/writing/fintech-layout-grammar",
    glyph: "layout-grammar",
    bento: "square",
    // Kept in the data but pulled from the site until the piece is refined.
    hidden: true,
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
    hidden: true,
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
    hidden: true,
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
    hidden: true,
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
    hidden: true,
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
    hidden: true,
  },
];

export const KIND_LABELS: Record<WorkKind, Bilingual<string>> = {
  "case-study": { en: "Case study", es: "Caso de estudio" },
  process: { en: "Process", es: "Proceso" },
  lab: { en: "Lab", es: "Laboratorio" },
  methodology: { en: "Methodology", es: "Metodología" },
};

export function sortKey(item: WorkItem): string {
  return item.date ?? `${item.year}-01-01`;
}
