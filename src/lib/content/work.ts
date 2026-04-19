export type WorkType =
  | "design-system"
  | "brand-ds"
  | "brand"
  | "experiment"
  | "writing";

export type GlyphKey = "design-system" | "visual-strategy" | "brand-rules";

export type WorkItem = {
  slug: string;
  title: string;
  description: string;
  year: number;
  type: WorkType;
  href: string;
  glyph: GlyphKey;
  featured?: boolean;
  revamp?: boolean;
};

export const WORK: WorkItem[] = [
  {
    slug: "afi-design-system",
    title: "Afi Design System",
    description:
      "Building a unified design system and AI-powered platform for a fintech consultancy — from scattered docs to scalable white-label infrastructure.",
    year: 2026,
    type: "design-system",
    href: "/work/afi-design-system",
    glyph: "design-system",
    featured: true,
  },
  // story-architect: hidden until the case study is finished.
  // {
  //   slug: "story-architect",
  //   title: "Story Architect",
  //   description:
  //     "Visual strategy and an AI-built website for a two-person brand consultancy — giving a small team enterprise-quality design.",
  //   year: 2025,
  //   type: "brand",
  //   href: "/work/story-architect",
  //   glyph: "visual-strategy",
  // },
  {
    slug: "kt360",
    title: "KT360",
    description:
      "Brand strategy, design rules, and an AI-powered system that lets non-technical people ship consistent, high-quality work.",
    year: 2025,
    type: "brand-ds",
    href: "/work/kt360",
    glyph: "brand-rules",
  },
  {
    slug: "audemic-growth",
    title: "Audemic",
    description:
      "Pivoting a B2C research app to B2B enterprise — validated in a week with AI-driven interviews and 20 qualified leads.",
    year: 2024,
    type: "experiment",
    href: "/work/audemic-growth",
    glyph: "visual-strategy",
  },
  {
    slug: "mindfulme",
    title: "Mindfulme",
    description:
      "Brand identity and MVP experience for a mindfulness app that treats each person's journey as unique — no cookie-cutter meditations.",
    year: 2024,
    type: "brand-ds",
    href: "/work/mindfulme",
    glyph: "visual-strategy",
  },
];
