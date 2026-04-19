export type BentoCard = {
  label: string;
  sublabel: string;
  span?: "wide";
  animation:
    | "layers"
    | "swap"
    | "nodes"
    | "moodboard"
    | "code-to-site"
    | "pulse"
    | "palette"
    | "rules"
    | "cursor"
    | "canvas"
    | "guideline"
    | "wordpress"
    | "logo-identity";
};

export type CaseStudy = {
  tagline: string;
  intro: string;
  role: string;
  contributions: string[];
  bento: BentoCard[];
  confidential?: string;
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "afi-design-system": {
    confidential: "Designs are not shown due to client confidentiality.",
    tagline: "Building design infrastructure for a fintech consultancy",
    intro:
      "A design team of one, a high project rate, and never enough time to stop and organize. The result: scattered documents, inconsistent patterns across products, and one team stuck on Material UI — hacked and stretched to fit fintech workflows it was never built for. The problem wasn't talent or intention, it was that the pace never allowed for the kind of foundational work that makes everything else faster. I came in to change that — migrating the Angular product to PrimeNG for real flexibility, building a custom token system in Figma, and now turning it all into a unified platform with AI-assisted white-labeling, handoff workflows, and internal docs so the whole team can finally move together.",
    role: "Design Systems Lead",
    contributions: [
      "Design systems",
      "Token architecture",
      "Component library",
      "AI tooling",
      "White-label strategy",
    ],
    bento: [
      {
        label: "Token Architecture",
        sublabel: "Primitive → semantic → component",
        animation: "layers",
        span: "wide",
      },
      {
        label: "Material → PrimeNG → Custom",
        sublabel:
          "Each step unlocked more flexibility. AI made the last one possible.",
        animation: "swap",
      },
      {
        label: "White-label at Scale",
        sublabel: "One system, any brand — swap the tokens, ship the product.",
        animation: "palette",
      },
      {
        label: "Unified Design Platform",
        sublabel:
          "Design, docs, handoff, and agents — all in one repo. The system checks its own work.",
        animation: "nodes",
        span: "wide",
      },
    ],
  },
  "story-architect": {
    tagline: "Agency-quality design for a two-person brand consultancy",
    intro:
      "Story Architect is a two-person brand consultancy in Canada — strong at tone of voice, zero visual infrastructure. They knew how to find the words; they didn't have someone to make it look like it cost what it did. I developed a visual strategy from their existing brand, used AI to build out the site with custom graphics and animations, then packaged it as a WordPress template so they could manage it themselves. A two-person shop with the design quality that used to require an agency.",
    role: "Freelance Designer",
    contributions: [
      "Visual strategy",
      "Web design",
      "Motion design",
      "WordPress development",
    ],
    bento: [
      {
        label: "Visual Strategy",
        sublabel: "From brand voice to visual language",
        animation: "moodboard",
        span: "wide",
      },
      {
        label: "AI-Built Site",
        sublabel: "Built fast, built right",
        animation: "code-to-site",
      },
      {
        label: "Custom Animations",
        sublabel: "Motion that earns attention",
        animation: "pulse",
      },
      {
        label: "WordPress Template",
        sublabel: "Designed once, managed forever — no developer needed",
        animation: "wordpress",
      },
    ],
  },
  kt360: {
    tagline:
      "An AI environment built for a team that doesn't have a full design department",
    intro:
      "KT360 is an early-stage startup in a saturated AI market — so the brand strategy was to look nothing like AI. Playful, human, deliberately distinct. But the bigger challenge was operational: how does a small team stay on-brand when there's no designer in the room? The answer was to encode the brand into the environment itself. Design rules, component guidelines, and animation patterns all live as structured files — the kind of thing an AI can read, check against, and enforce. Agents review work before it ships. A shared system built on shadcn gives everyone a foundation to prototype and build from. The result: a marketer can write a blog post, a developer can add a new page, and the output looks like it came from the same hand — because the rules are doing the work.",
    role: "Freelance Designer & AI Builder",
    contributions: [
      "Brand strategy",
      "Visual identity",
      "Design systems",
      "AI environment design",
      "Prototype infrastructure",
    ],
    bento: [
      {
        label: "Visual Identity",
        sublabel: "Playful and human — deliberately nothing like AI",
        animation: "logo-identity",
      },
      {
        label: "Rules as Files",
        sublabel:
          "Brand guidelines, component specs, and animation patterns written so AI can read and enforce them",
        animation: "rules",
      },
      {
        label: "Shared Prototype Environment",
        sublabel:
          "One codebase the whole team can open, experiment in, and ship from",
        animation: "canvas",
      },
      {
        label: "Design System Foundation",
        sublabel:
          "Tokens, typography, and components everyone builds on top of",
        animation: "guideline",
      },
    ],
  },
};
