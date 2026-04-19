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

export type CaseStudyContext = {
  credits?: { name: string; role: string }[];
  headline: string;
  paragraph: string;
  blocks: { label: string; body: string }[];
};

export type CaseStudyProblem = {
  summary: string;
  cards: { title: string; body: string }[];
};

export type CaseStudyProcess = {
  steps: { title: string; body: string }[];
};

export type CaseStudySolution = {
  pillars: { title: string; body: string }[];
};

export type CaseStudy = {
  tagline: string;
  intro: string;
  role: string;
  contributions: string[];
  bento: BentoCard[];
  confidential?: string;
  context?: CaseStudyContext;
  problem?: CaseStudyProblem;
  process?: CaseStudyProcess;
  solution?: CaseStudySolution;
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
    context: {
      credits: [
        { name: "Afi Consultores", role: "Fintech consultancy" },
        { name: "Banking clients", role: "End users" },
      ],
      headline: "A design team of one, shipping for every bank on the roster.",
      paragraph:
        "Afi is a Spanish fintech consultancy with a high project rate and a single designer holding the line. Documentation lived in scattered decks and Figma files. The Angular product was hacked on top of Material UI — a framework built for Google, stretched thin to fit banking workflows it was never meant to carry.",
      blocks: [
        {
          label: "Problem",
          body: "Inconsistent patterns across products, no single source of truth, and a component library fighting its own framework.",
        },
        {
          label: "Business need",
          body: "A system that scales across banking clients without rebuilding from scratch every engagement.",
        },
        {
          label: "User need",
          body: "Interfaces that feel coherent — same logic, same behavior, same quality — regardless of which product they open.",
        },
      ],
    },
    problem: {
      summary:
        "The pace never allowed for foundational work, so every project paid the tax.",
      cards: [
        {
          title: "Scattered documentation",
          body: "Specs lived in decks, Figma files, and tribal memory. Nobody could find the current version.",
        },
        {
          title: "Framework fighting itself",
          body: "Material UI bent into shapes it wasn't designed for. Every override added more debt.",
        },
        {
          title: "No path to white-label",
          body: "Each banking client needed its own look. Without token architecture, that meant forking everything.",
        },
      ],
    },
    process: {
      steps: [
        {
          title: "Audit the surface",
          body: "Mapped every product, every component, every divergence. Named the debt out loud.",
        },
        {
          title: "Pick the migration",
          body: "Material to PrimeNG — a component set built for data-dense enterprise work, with the flexibility Material refused.",
        },
        {
          title: "Build the token architecture",
          body: "Primitive, semantic, and component layers in Figma. One source of truth, theme-able per client.",
        },
        {
          title: "Ship with AI handoff",
          body: "Unified platform for design, docs, and review. Agents check work against the system before it merges.",
        },
      ],
    },
    solution: {
      pillars: [
        {
          title: "Token architecture",
          body: "Three layers — primitives, semantics, components — that let the system white-label cleanly across banking brands.",
        },
        {
          title: "Component library migration",
          body: "Material to PrimeNG, then a custom layer on top. Each step unlocked flexibility the last one blocked.",
        },
        {
          title: "AI-assisted platform",
          body: "Documentation, handoff, and review agents live in the same repo as the code. The system audits itself.",
        },
      ],
    },
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
    context: {
      credits: [
        { name: "KT360", role: "Early-stage AI startup" },
        { name: "Two founders", role: "No in-house designer" },
      ],
      headline:
        "A two-founder AI startup that needed to look nothing like AI.",
      paragraph:
        "KT360 launched into a saturated market where every product looked the same — same gradients, same SaaS chrome, same generic confidence. The founders wanted playful, human, distinct. The harder problem: keeping it that way without a designer in the room. Marketers write blog posts. Developers ship new pages. The brand has to survive both.",
      blocks: [
        {
          label: "Problem",
          body: "Brand consistency without a designer is usually impossible. AI tooling defaults to the generic SaaS aesthetic. Rules lived in people's heads.",
        },
        {
          label: "Business need",
          body: "Non-technical contributors shipping on-brand work without blocking on design review.",
        },
        {
          label: "User need",
          body: "An experience that feels coherent across every touchpoint — site, docs, product — so the brand earns trust in a crowded category.",
        },
      ],
    },
    problem: {
      summary:
        "The brand had to live in files an AI could read, not in a designer's head.",
      cards: [
        {
          title: "No designer in the loop",
          body: "Two founders, high ship rate, no one whose job is to catch drift.",
        },
        {
          title: "Generic by default",
          body: "AI tooling pulls work toward the mean. Left alone, everything converges on the same SaaS look.",
        },
        {
          title: "Rules in people's heads",
          body: "Tribal knowledge doesn't scale. If a new contributor joins, the brand is one Slack thread away from breaking.",
        },
      ],
    },
    process: {
      steps: [
        {
          title: "Define the voice",
          body: "Playful, human, deliberately distinct. Wrote it down so the tone was auditable, not vibes-based.",
        },
        {
          title: "Encode it as files",
          body: "Brand rules, component specs, and motion patterns written in markdown and JSON — the kind of thing an agent can read.",
        },
        {
          title: "Build the environment",
          body: "A shadcn-based prototype repo the whole team runs locally. One codebase, many surfaces.",
        },
        {
          title: "Wire in review agents",
          body: "AI agents check work against the rule files before it ships. The system enforces itself.",
        },
      ],
    },
    solution: {
      pillars: [
        {
          title: "Visual identity",
          body: "Logo, color, and typography that read as human first — a brand that stands out in a category trying to look identical.",
        },
        {
          title: "Rules as files",
          body: "Markdown and JSON rule files that encode the brand. AI agents read them, enforce them, and flag drift on every change.",
        },
        {
          title: "Shared prototype environment",
          body: "One shadcn-based codebase the whole team runs locally. Marketer, developer, founder — same foundation, same output quality.",
        },
      ],
    },
  },
};
