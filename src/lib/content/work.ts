/**
 * Homepage work index. Reverse-chronological.
 *
 * Range-weighted: mixes DS depth (afi wealth manager, afi simulators, Audemic)
 * with passion projects (SSPC, Beetested) to tell the "broad taste, focused
 * discipline" story. Portfolio landing page for jobs will come later.
 */

export type WorkType =
  | "design-system"
  | "brand-ds"
  | "brand"
  | "experiment"
  | "writing";

export type GlyphKey =
  | "migration"
  | "whitelabel"
  | "siblings"
  | "schedule"
  | "oscillation";

export type WorkItem = {
  slug: string;
  title: string;
  description: string;
  year: number;
  type: WorkType;
  href: string;
  glyph: GlyphKey;
  /** Set to true when the project is being revisited/refreshed. */
  revamp?: boolean;
};

export const WORK: WorkItem[] = [
  {
    slug: "afi-wealth-manager",
    title: "Afi Wealth Manager",
    description:
      "Migrating a wealth-management platform from Material to PrimeNG for more flexibility and efficiency. AI + fintech.",
    year: 2026,
    type: "design-system",
    href: "/work/afi-wealth-manager",
    glyph: "migration",
  },
  {
    slug: "afi-simulators",
    title: "Afi Simulators",
    description:
      "White-label design system for fintech simulator products — customized per client.",
    year: 2026,
    type: "design-system",
    href: "/work/afi-simulators",
    glyph: "whitelabel",
  },
  {
    slug: "audemic",
    title: "Audemic",
    description:
      "Sibling design systems across two products under one umbrella brand.",
    year: 2024,
    type: "brand-ds",
    href: "/work/audemic",
    glyph: "siblings",
  },
  {
    slug: "beetested",
    title: "Beetested",
    description:
      "Logo and brand for a gaming-AI studio — my first branding project, now getting the full system it deserved.",
    year: 2023,
    type: "brand",
    href: "/work/beetested",
    glyph: "oscillation",
    revamp: true,
  },
  {
    slug: "sspc-childrens-center",
    title: "SSPC Children's Center",
    description:
      "Brand, site, and admin automation (WhatsApp tour scheduling) for my mom's school.",
    year: 2022,
    type: "experiment",
    href: "/work/sspc-childrens-center",
    glyph: "schedule",
    revamp: true,
  },
];
