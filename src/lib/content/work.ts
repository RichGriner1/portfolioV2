import type { FigureKey } from "@/components/motion/figures";
import type { Bilingual } from "@/lib/i18n";

export type WorkType =
  | "design-system"
  | "brand-ds"
  | "brand"
  | "experiment"
  | "writing";

// "blog" is a piece written to be read on its own — research, an argument, a
// point of view. "process" is a note about how a specific piece of work got made.
// The distinction is the reader's, not the pillar taxonomy's: content/ still files
// everything under a pillar, and a post can be pillar `process` while reading as a
// blog. Both surface on /writing.
export type WorkKind =
  | "case-study"
  | "blog"
  | "process"
  | "lab"
  | "methodology";

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
  /** The year the work is dated to, and the one it sorts by. */
  year: number;
  /**
   * Set when the work spans more than one year — renders as "2025–2026". `year`
   * stays the END of the span, so sorting is unaffected.
   */
  yearStart?: number;
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
  /**
   * A still image for the card face, as a path under /public.
   *
   * Added 2026-08-25 for the two Audemic studies. They're product work whose
   * artefacts are screens and research boards, and the glyph set is abstract
   * diagrams — pointing two product studies at `visual-strategy` would have put
   * the same drawing on the board twice and said nothing about either.
   *
   * Precedence in CardMedia: video → image → figure → glyph. Unlike `video`, this
   * is a plain path with no `_lang_theme` suffix: these are documents of another
   * product, not brand assets that need a variant per language and theme.
   */
  image?: string;
  bento?: "square" | "tall" | "wide";
  bgColor?: string;
  featured?: boolean;
  revamp?: boolean;
  hidden?: boolean;
  /**
   * Kept off the home board only. `/projects` and `/writing` still list the
   * item — home curates, the index pages are the full record. Distinct from
   * `hidden`, which removes an item everywhere.
   */
  homeHidden?: boolean;
  /**
   * Pins an item to the front of its section on the home board, lowest first.
   *
   * The board takes the newest few of each kind, which is right for the tail and
   * wrong for the head: date order decides position, so the piece that argues the
   * portfolio best sits wherever it happens to have published. design.md is the
   * case in point — the strongest evidence for a design-engineer role and the
   * oldest thing in Blog, so pure date order buried it and would eventually drop
   * it off the board entirely.
   *
   * A rank, not a hand-written slug list, so the board stays self-maintaining:
   * everything unranked keeps sorting by date behind whatever is ranked, and
   * publishing something new still shows up without editing this file. Rank only
   * the two or three that have to hold a position.
   */
  homeRank?: number;
  ongoing?: boolean;
};

export const WORK: WorkItem[] = [
  {
    slug: "modern-ui-2026",
    title: {
      en: "Modern UI in 2026",
      es: "UI moderno en 2026",
    },
    // Trimmed to the question the post answers, at Richard's call. The card already
    // shows the title, the kind and the date above this line, so the earlier version
    // spent its three clamped lines re-establishing context the reader has.
    description: {
      en: "What modern UI means in 2026",
      es: "Qué significa UI moderno en 2026",
    },
    year: 2026,
    date: "2026-06-24",
    type: "writing",
    kind: "blog",
    href: "/writing/modern-ui-2026",
    // Richard's own kinetic-type clip, the same one Coherence uses for this post.
    // `video` wins over `figure` in CardMedia, so this is the thumbnail on both the
    // home and /writing; the `maturity-stages` figure still opens the post body.
    //
    // Four files, per the convention above: en/es × light/dark. Derived from two
    // source clips — letterboxed 1440×1080 → 1080² so nothing is cropped, and the
    // dark pair is the light frame inverted with its black point lifted to #222,
    // which is where process-stages_*_dark sits.
    video: "/writing/modern-ui-2026",
    bento: "square",
  },
  {
    slug: "loops-and-skills-are-components",
    title: {
      en: "Loops and skills are components, not folders",
      es: "Los loops y las skills son componentes, no carpetas",
    },
    description: {
      en: "Building a reusable, AI workflow for meeting design system standards",
      es: "Construyendo un flujo de trabajo de IA reutilizable para cumplir los estándares del sistema de diseño",
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
      en: "A methodology for a token-based color system: raw values → primitives → semantic roles → components",
      es: "Una metodología para un sistema de color basado en tokens: valores en bruto → primitivos → roles semánticos → componentes",
    },
    year: 2026,
    date: "2026-07-01",
    type: "design-system",
    kind: "methodology",
    href: "/methodology/color",
    glyph: "palette",
    // The coded figure, not the 1080² mp4. A video can only be cropped or shrunk to
    // fit a tile, and both broke this diagram — see token-levels.tsx. The methodology
    // page's hero runs the same figure now, so the eight mp4s in public/methodology/
    // are unreferenced.
    figure: "token-levels",
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
      en: "White label design system Figma plus vibe coding prototype environment for a full experience demo",
      es: "Sistema de diseño white-label en Figma más un entorno de prototipado con vibe coding para una demo de la experiencia completa",
    },
    year: 2026,
    yearStart: 2025,
    type: "design-system",
    kind: "case-study",
    href: "/work/afi-design-system",
    glyph: "palette",
    bento: "square",
    featured: true,
    // No `ongoing` — the coded rollout paused when Modern UI took priority, so the
    // live-pulse badge would be claiming active work. Visual Identity carries it.
  },
  {
    slug: "visual-identity",
    title: {
      en: "Afi Visual Identity",
      // TODO(afi-redaccion)
      es: "Identidad visual de Afi",
    },
    description: {
      en: "Modernizing a wealth planner's UI for live demos to sell to Spanish banks.",
      es: "Modernizar la UI de un wealth planner para venderlo a bancos españoles.",
    },
    year: 2026,
    type: "brand-ds",
    kind: "case-study",
    href: "/work/visual-identity",
    // Thumbnail: the six-stage process loop, rendered per lang × theme by
    // videos/process-stages-motion/gen.mjs (HyperFrames).
    video: "/work/visual-identity/process-stages",
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
    homeHidden: true,
  },
  /**
   * Two Audemic entries, not one.
   *
   * They're separate projects with separate methods and separate outcomes:
   * business growth is market expansion validated with discovery interviews, a
   * journey map and paid ads; onboarding is retention fixed off a Mixpanel funnel
   * and iterative usability testing. Folded into one study the onboarding work —
   * the more design-forward of the two — ends up as a subsection of a story whose
   * headline is revenue.
   *
   * Both sort to 2024-01-01, so their order on the board is this array's order,
   * which `Array.prototype.sort` preserves for ties. Onboarding sits first because
   * it came later: it's Insights retention work, and Insights is what the beta in
   * the business-growth study launched. Give them real `date` values if you want a
   * different order — don't reshuffle the array and hope.
   *
   * Both replaced a single `audemic-growth` entry, which was `hidden` and never
   * published, so no live URL broke.
   */
  {
    slug: "audemic-onboarding",
    title: {
      en: "Audemic Insights onboarding",
      // TODO(afi-redaccion)
      es: "Onboarding de Audemic Insights",
    },
    description: {
      en: "Mixpanel showed where the funnel leaked. Fewer onboarding steps, without giving up the personalization.",
      // TODO(afi-redaccion)
      es: "Mixpanel mostró por dónde se escapaba el embudo. Menos pasos en el onboarding, sin renunciar a la personalización.",
    },
    year: 2024,
    type: "experiment",
    kind: "case-study",
    href: "/work/audemic-onboarding",
    // The title slide's mockup, the teal "Personalize your experience" screen. A
    // real screen rather than a glyph — see WorkItem.image.
    image: "/work/audemic-onboarding/hero.webp",
    bento: "square",
    featured: true,
  },
  {
    slug: "audemic-business-growth",
    title: {
      en: "Audemic business growth",
      // TODO(afi-redaccion)
      es: "Crecimiento de negocio en Audemic",
    },
    description: {
      en: "A B2C research app at $8K/month, taken into the enterprise: discovery interviews, a beta, and 20 qualified leads in a week.",
      // TODO(afi-redaccion)
      es: "Una app de investigación B2C con 8.000 $/mes, llevada al mercado enterprise: entrevistas de descubrimiento, una beta y 20 leads cualificados en una semana.",
    },
    year: 2024,
    type: "experiment",
    kind: "case-study",
    href: "/work/audemic-business-growth",
    image: "/work/audemic-business-growth/hero.webp",
    bento: "square",
    featured: true,
    /**
     * Off the home board on 2026-08-26; still on /projects.
     *
     * Two of the five case-study slots were the same client. Of the pair, the
     * onboarding study is the one that carries a funnel number and an
     * intervention against it, and it ends in a shipped flow rather than a
     * market recommendation. This one is the stronger business story and the
     * weaker product-design one, which is the wrong half for the roles the
     * portfolio is aimed at.
     */
    homeHidden: true,
  },
  {
    slug: "mindfulme",
    title: { en: "Mindfulme", es: "Mindfulme" },
    description: {
      en: "Brand identity and MVP experience for a mindfulness app that treats each person's journey as unique",
      es: "Identidad de marca y experiencia MVP para una app de mindfulness que trata el camino de cada persona como único",
    },
    year: 2024,
    type: "brand-ds",
    kind: "case-study",
    href: "/work/mindfulme",
    glyph: "mindfulme",
    bento: "square",
    bgColor: "#e6f5f6",
    featured: true,
  },
  {
    slug: "design-md-primeng-wealth-manager",
    title: {
      en: "Creating a design.md",
      // TODO(afi-redaccion)
      es: "Creando un design.md",
    },
    description: {
      en: "Markdown rulebook AI agents read to generate Wealth Manager UI, minimizing Figma to code drift.",
      es: "Manual en markdown que los agentes de IA leen para generar la UI de Wealth Manager, minimizando el desfase entre Figma y código.",
    },
    year: 2026,
    date: "2026-04-23",
    type: "writing",
    kind: "process",
    href: "/writing/design-md-primeng-wealth-manager",
    glyph: "typo-trail",
    bento: "square",
    bgColor: "#ff7cba",
    /**
     * First in Blog, ahead of three newer posts.
     *
     * It's the piece the portfolio is being read for: a markdown rulebook AI
     * agents generate real product UI from, which is the design-engineer claim
     * stated as a shipped thing rather than a description of one. It's also the
     * oldest thing in the section, so date order put it last of four and would
     * have dropped it off the board on the next publish.
     */
    homeRank: 1,
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
  blog: { en: "Blog", es: "Blog" },
  process: { en: "Process", es: "Proceso" },
  lab: { en: "Lab", es: "Laboratorio" },
  methodology: { en: "Methodology", es: "Metodología" },
};

export function sortKey(item: WorkItem): string {
  return item.date ?? `${item.year}-01-01`;
}

/**
 * The year line for a work item: "2026", or "2025–2026" when it spans a range.
 *
 * Lives here rather than in a component because three surfaces render it — the card's
 * hover panel and both year slots on the case-study page — and they drifted apart
 * once already.
 *
 * En dash, not a hyphen: this is a range, and a hyphen reads as a compound.
 */
export function formatYears(item: WorkItem): string {
  return item.yearStart && item.yearStart !== item.year
    ? `${item.yearStart}\u2013${item.year}`
    : String(item.year);
}
