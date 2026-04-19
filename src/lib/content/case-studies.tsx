export type BentoCard = {
  label: string;
  sublabel: string;
  span?: "wide" | "tall";
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
    | "logo-identity"
    | "journey-scene"
    | "affirmation-morph"
    | "organic-bundle"
    | "user-feedback"
    | "audience-pivot"
    | "hours-stat"
    | "leads-funnel"
    | "model-iteration"
    | "asset-portal";
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
        label: "Unified Design Platform",
        sublabel: "Files, agents, and people — converging in one repo.",
        animation: "nodes",
        span: "tall",
      },
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
      {
        label: "Transparent Asset Portal",
        sublabel:
          "104 assets across 4 color variants, 3 categories, and 2 formats — so a marketer can grab the right logo without opening Figma.",
        animation: "asset-portal",
        span: "wide",
      },
    ],
  },
  "audemic-growth": {
    tagline: "Pivoting a B2C research app to B2B enterprise",
    intro:
      "Audemic Scholar had built a loyal B2C user base at $8K/month — but students graduate, and investors were right to worry about where growth was coming from. We ran discovery interviews with UN analysts and vaccine researchers and found a bigger story: researchers lose 20 hours a month to information retrieval, costing organizations like NIH close to $10M monthly. We launched a Beta — a 24/7 junior analyst powered by AI — and captured 20 qualified leads in a single week through paid ads. From there, iteration: better summaries on OpenAI and Claude, an audio redesign built around how researchers actually work, and a prioritization framework that kept the roadmap honest.",
    role: "Product Manager & UX Designer",
    contributions: [
      "Product strategy",
      "User research",
      "AI prompting",
      "Growth experiments",
      "Prototype design",
    ],
    bento: [
      {
        label: "B2C → B2B Pivot",
        sublabel: "Students were the loyal base. Professionals were the market.",
        animation: "audience-pivot",
        span: "wide",
      },
      {
        label: "20 Hours Lost a Month",
        sublabel: "Per researcher. ~$10M monthly for NIH-sized orgs.",
        animation: "hours-stat",
      },
      {
        label: "20 Leads in 7 Days",
        sublabel: "Paid ads validated the new direction in a week.",
        animation: "leads-funnel",
      },
      {
        label: "AI Summary Refinement",
        sublabel:
          "Iterating between OpenAI and Claude models based on user feedback.",
        animation: "model-iteration",
        span: "wide",
      },
    ],
  },
  mindfulme: {
    tagline: "A mindfulness MVP that treats each journey as unique",
    intro:
      "Young professionals keep bouncing off mindfulness apps because every one of them looks and sounds the same — calming greens, a meditation library, a timer. Mindfulme hired me to design the MVP's brand and experience from scratch: no brand yet, two ready-to-code developers, and user feedback as the rawest input we had. The work started with listening, turned into a hand-crafted visual language of organic shapes and script affirmations, and shipped as a tight MVP that the two devs could build alongside the design. The throughline: a mindfulness practice that echoes the person, not the industry.",
    role: "Freelance Designer & Product Lead",
    contributions: [
      "Brand identity",
      "Product design",
      "User research",
      "MVP delivery",
    ],
    bento: [
      {
        label: "Every Journey is Different",
        sublabel:
          "A brand built around the idea that no two mindfulness paths look alike",
        animation: "journey-scene",
        span: "wide",
      },
      {
        label: "Affirmations that Evolve",
        sublabel: "Hand-lettered words that change with the user",
        animation: "affirmation-morph",
      },
      {
        label: "Organic Visual Language",
        sublabel: "Hand-drawn shapes over sterile iconography",
        animation: "organic-bundle",
      },
      {
        label: "User-led iteration",
        sublabel:
          "Designed alongside two developers and early users — shipped an MVP that reflected them",
        animation: "user-feedback",
        span: "wide",
      },
    ],
  },
};
