import type { ReactNode } from "react";

import type { DiagramKey } from "@/lib/content/diagrams";
import type { Bilingual } from "@/lib/i18n";
import { TPC_STUDY } from "./case-study-tpc";

/**
 * A beat of a card's detail copy.
 *
 * `label` is OPTIONAL, and usually absent. Every card used to carry the same four
 * labelled sections — problem / what we did / the solution / why it works — and the
 * frame turned out to be the problem: a card whose real story is three sentences got
 * padded to fill four headings, which is how invented detail got in. Richard's drafts
 * are unlabelled beats, so that's the default shape now. Add a label only when a
 * section genuinely needs naming.
 *
 * `body` is ReactNode, not string, so a beat can carry an inline IntroPreviewLink
 * (the hover-thumbnail link the home intro uses) when it points at another piece —
 * the token beat backlinks the color methodology this way.
 */
export type DetailSection = {
  label?: Bilingual<string>;
  body: Bilingual<ReactNode>;
};

export type BentoCard = {
  label: Bilingual<string>;
  sublabel: Bilingual<string>;
  span?: "wide" | "tall" | "full";
  details?: {
    heading: Bilingual<string>;
    sections: DetailSection[];
    /**
     * A screen recording of the feature, shown at the top of the popup above the
     * sections. Full path under /public, e.g. "/work/afi-design-system/feedback.mp4".
     *
     * Separate from the card face's `animation`/`image` on purpose. Six cards sit in
     * a grid, so a card face has to read at a glance — a short silent loop. Once
     * someone has clicked into "Feedback" they want to watch a comment actually get
     * attached, which is 10–20s and illegible at card size.
     *
     * A plain path, not the `_${lang}_${theme}` base the thumbnails use. These are
     * documents of the app rather than brand assets, and the variant convention
     * would mean four recordings per feature. It renders inside a bordered panel so
     * it reads as a recording of another surface, not as part of this page.
     */
    media?: string;
    /**
     * A diagram drawn after the sections, from src/lib/content/diagrams.ts. For the
     * part a recording can't show: what happens once the click is over.
     */
    diagram?: DiagramKey;
  };
  image?: string;
  images?: string[];
  iframe?: string;
  animation?:
    | "layers"
    | "nodes"
    | "moodboard"
    | "code-to-site"
    | "pulse"
    | "palette"
    | "rules"
    | "cursor"
    | "token-inspect"
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
    | "asset-portal"
    | "comment-pins"
    | "coded-logo"
    | "playground"
    | "ai-teammate"
    | "port-diff"
    | "motion-tokens"
    // visual-identity only — the real figures built for that case study
    // (src/components/motion/figures/visual-identity/), not the generic
    // looping animations the keys above render. Kept distinct from
    // "moodboard" / "code-to-site" / "token-inspect" / "motion-tokens",
    // which other case studies still use.
    | "vi-moodboard"
    | "vi-type-test"
    | "vi-components"
    | "vi-micro"
    | "vi-nine-principles";
  /**
   * A looping thumbnail video on the card face, given as the base path without
   * the variant suffix — `/work/visual-identity/process-stages` resolves to
   * `<base>_<lang>_<theme>_thumb.mp4`, the same four-variant convention
   * `WorkItem.video` uses so a card and its work tile can share one clip.
   *
   * A path that already ends in `.mp4` is used verbatim, no variants. That's for
   * captured footage rather than a rendered thumbnail: a screen recording of a
   * Spanish-only, light-only app has no four ways to be, and four copies of one
   * file would be four times the bytes for nothing.
   */
  video?: string;
};

/**
 * A scrolling case study, as an alternative to the bento.
 *
 * The bento suits work that is six separable artefacts. SAREVI's story is a sequence
 * of changes to one flow, and what proves each one is watching it happen — so it's
 * told as sections down the page, each with prose and a short silent clip, and
 * `compare` puts a before and an after side by side. A study sets `story` and
 * leaves `bento` empty; the page renders whichever is present.
 *
 * Clips are plain paths under /public (no language/theme variants): they're screen
 * recordings of a Spanish-only, light-only prototype, like `BentoCard.video` given
 * as a verbatim `.mp4`.
 */
export type StoryClip = {
  src: string;
  poster?: string;
  alt: Bilingual<string>;
};

/**
 * One version of a screen inside a step: "3.61" against "Round 10", or A / B / C.
 * `chosen` marks the one we kept; the segmented control shows it with a tag.
 */
export type StoryVariant = {
  label: Bilingual<string>;
  chosen?: boolean;
  note?: Bilingual<string>;
  clip: StoryClip;
};

/** One stop in a stepper: why we tried it, then its screens. */
export type StoryStep = {
  label: Bilingual<string>;
  title?: Bilingual<string>;
  body?: Bilingual<string>[];
  variants: StoryVariant[];
};

/** A two-column map: where things were, where they went. Static, so motion can replace it later. */
export type StoryMapColumn = {
  title: Bilingual<string>;
  groups: { name: Bilingual<string>; items: Bilingual<string>[] }[];
};

export type StoryMedia =
  | {
      kind: "clip";
      clip: StoryClip;
      caption?: Bilingual<string>;
    }
  | {
      /**
       * Screens that switch in place instead of stacking down the page. One step
       * shows only its segmented control; several get a row of step tabs on top.
       * `stepWord` prefixes the tab number ("Iteration 1").
       */
      kind: "steps";
      steps: StoryStep[];
      stepWord?: Bilingual<string>;
    }
  | {
      kind: "map";
      before: StoryMapColumn;
      after: StoryMapColumn;
      caption?: Bilingual<string>;
    }
  | {
      /** Two crops side by side, tagged Before / After. Crop to the part that changed. */
      kind: "pair";
      before: StoryClip;
      after: StoryClip;
      /** Toggle labels inside a beat; "Before" / "After" when absent. */
      beforeLabel?: Bilingual<string>;
      afterLabel?: Bilingual<string>;
      /** Show the after as a live crop of the real prototype instead of `after`'s image. */
      afterLive?: {
        src: string;
        title: Bilingual<string>;
        crop: { x: number; y: number; w: number; h: number };
        cropSmall?: { x: number; y: number; w: number; h: number };
      };
      caption?: Bilingual<string>;
    }
  | {
      /** A ladder from quiet to loud: one row per level, the bar shows how strong it is. */
      kind: "scale";
      levels: { name: Bilingual<string>; note: Bilingual<string> }[];
      caption?: Bilingual<string>;
    }
  | {
      /**
       * A live prototype in an iframe, drawn at desktop size (`width` × `height`, default
       * 1440 × 900) and scaled down to the column, so it shows the real layout instead of
       * its narrow one. `title` names it for screen readers.
       */
      kind: "embed";
      src: string;
      title: Bilingual<string>;
      width?: number;
      height?: number;
      caption?: Bilingual<string>;
    }
  | {
      /**
       * A live crop of a real prototype page: the page runs at `viewport` size (CSS px) in
       * an iframe and the box shows only `crop`, scaled to fit, so it stays sharp at any
       * size and plays the real animation. `cropSmall` is the tighter crop for a narrow
       * box (a phone). `frame` fixes the box's height-to-width ratio so a selector that
       * swaps crops doesn't make the page jump; the crop sits centred in it.
       */
      kind: "live";
      src: string;
      title: Bilingual<string>;
      crop: { x: number; y: number; w: number; h: number };
      cropSmall?: { x: number; y: number; w: number; h: number };
      viewport?: { w: number; h: number };
      frame?: number;
      caption?: Bilingual<string>;
    }
  | {
      /**
       * A composition made for its slot (see content/references/case-studies/visuals.md):
       * whole components placed on a quiet stage of fixed shape (`aspect`, width / height,
       * default 1.6) that scales as one, so nothing is ever cut. Each item is either a live
       * element of a real prototype page (`src` + the element's exact `rect` in that page's
       * CSS px) or an image. `x`, `y` are the item's centre and `w` its width, all in % of
       * the stage. `marks` are numbered markers, also in %.
       */
      kind: "composition";
      aspect?: number;
      title: Bilingual<string>;
      items: {
        src?: string;
        image?: string;
        rect?: { x: number; y: number; w: number; h: number };
        imageRatio?: number;
        viewport?: { w: number; h: number };
        x: number;
        y: number;
        w: number;
        label?: Bilingual<string>;
        fade?: "right" | "bottom";
        flat?: boolean;
        /**
         * The component's own corner radius, in its source CSS px (scaled with the item),
         * so the stage never cuts a corner the component doesn't have. For images,
         * `sourceW` is the image's width in those CSS px.
         */
        radius?: number;
        sourceW?: number;
        /** The board takes clicks (its own ▶ and step dots), like the canvas artboard. */
        interactive?: boolean;
        /** Follow this element inside the board: the piece takes its live box. */
        track?: string;
        /** Padding around a tracked element, in board px. */
        trackPad?: number;
      }[];
      marks?: { x: number; y: number; n: number }[];
      /**
       * How the composition's live items animate: "lab" presses the board's own «Repetir»,
       * "case" presses a use case's ▶, "reload" reloads the page. It plays once when the
       * stage is half on screen, and a Replay button plays it again.
       */
      play?: "lab" | "case" | "reload" | "click";
      /** With `play: "click"`: the exact text of the element the board clicks. */
      playClick?: string | string[];
      /** Clicks that bring the board to the right screen before it shows. */
      playSetup?: string[];
      /** Every item takes this item's corner radius, as drawn on the stage. */
      radiusFrom?: number;
      legend?: Bilingual<string>[];
      caption?: Bilingual<string>;
    }
  | {
      /** A hand-built artboard, drawn in code so it stays sharp at any size. `name` picks it from the registry in `case-study-artboards.tsx`. */
      kind: "artboard";
      name: string;
      caption?: Bilingual<string>;
    }
  | {
      /** A strip of figures, each with a short label. */
      kind: "stats";
      items: { value: string; label: Bilingual<string> }[];
    };

/**
 * One direction that was on the table for a decision, and what became of it.
 * `merged` means its useful part was folded into the chosen one.
 */
export type StoryOption = {
  outcome: "original" | "proposed" | "chosen" | "merged" | "dropped" | "open";
  name: Bilingual<string>;
  note: Bilingual<string>;
  /** When set, the row is selectable and the clip plays in the viewer under the list. */
  clip?: StoryClip;
};

export type StorySection = {
  /** Set on the few consequential decisions ("Decision 1"); they get more weight than the context sections. */
  kicker?: Bilingual<string>;
  heading: Bilingual<string>;
  /** Short name for the side menu (`CaseStudy.nav`); the heading when absent. */
  navLabel?: Bilingual<string>;
  /**
   * Beats layout only: several beats behind one selector. Picking one swaps the visual
   * and the text in place, so a run of related beats doesn't become a long scroll.
   */
  switch?: {
    label: Bilingual<string>;
    kicker?: Bilingual<string>;
    heading: Bilingual<string>;
    body: Bilingual<string>[];
    media: StoryMedia[];
  }[];
  /** One entry per paragraph. */
  body: Bilingual<string>[];
  /** The small heading above `options`; "Directions considered" when absent. */
  optionsLabel?: Bilingual<string>;
  /** Directions considered, shown between the first paragraph (the problem) and the clip. */
  options?: StoryOption[];
  media?: StoryMedia[];
};

export type CaseStudy = {
  story?: StorySection[];
  tagline: Bilingual<string>;
  intro: Bilingual<string>;
  role: Bilingual<string>;
  contributions: Bilingual<string[]>;
  bento: BentoCard[];
  confidential?: Bilingual<string>;
  gallery?: boolean;
  /** Story studies only: a sticky list of the sections in the left margin on wide screens. */
  nav?: boolean;
  /**
   * Story studies only. "beats" is the house standard (2026-11-27, after rows.gg): each
   * section is one claim, a small visual on the left and two short paragraphs on the right.
   */
  layout?: "beats";
  /** A live prototype. The header and the end of the story get an "Enjoy the demo" action. */
  demo?: { href: string };
  /** One sentence before the closing demo action. */
  closing?: Bilingual<string>;
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "third-party-compliance": TPC_STUDY,
  "afi-design-system": {
    tagline: {
      en: "A design language forty programmers can reach without asking",
      // TODO(afi-redaccion)
      es: "Un lenguaje de diseño al que cuarenta programadores llegan sin preguntar",
    },
    intro: {
      en: "Afi web is the design system behind the internal and client-facing sites that carry the Afi brand, one of three brands Afi runs. I built its tokens, its components and a coded playground, so the team can mock up a concept before committing time to real UI.",
      // TODO(afi-redaccion)
      es: "Afi web es el sistema de diseño de los sitios internos y de cliente que llevan la marca Afi, una de las tres marcas de Afi. Construí sus tokens, sus componentes y un playground en código, para que el equipo pueda maquetar un concepto antes de dedicar tiempo a la UI real.",
    },
    role: {
      en: "Design systems lead",
      es: "Líder de sistemas de diseño",
    },
    contributions: {
      en: [
        "UI design",
        "Design systems",
        "Token architecture",
        "Component library",
        "AI tooling",
        "White-label strategy",
      ],
      es: [
        "Diseño de interfaz",
        "Sistemas de diseño",
        "Arquitectura de tokens",
        "Librería de componentes",
        "Herramientas de IA",
        "Estrategia white-label",
      ],
    },
    bento: [],
    layout: "beats",
    // The boards are rebuilt from the Afi apps components (public/work/afi-design-system/demo/),
    // so every name and figure on them is made up. The coded playground itself is internal.
    story: [
      {
        kicker: { en: "Context", es: "Contexto" },
        heading: {
          en: "Forty programmers, one designer, no system.",
          // TODO(afi-redaccion)
          es: "Cuarenta programadores, un diseñador, ningún sistema.",
        },
        navLabel: { en: "Context", es: "Contexto" },
        body: [
          {
            en: "Afi is a financial consultancy that grew its digital team as an engineering team. It hired forty programmers for math and computer science, and had no dedicated designers until 2021.",
            // TODO(afi-redaccion)
            es: "Afi es una consultora financiera que hizo crecer su equipo digital como equipo de ingeniería. Contrató a cuarenta programadores por su perfil de matemáticas e informática y no tuvo diseñadores dedicados hasta 2021.",
          },
          {
            en: "Figmas were made one at a time. Designers were always rushed, so there was never time to define anything or build components. The workflow that came out of it was slow for everyone.",
            // TODO(afi-redaccion)
            es: "Los Figmas se hacían de uno en uno. A los diseñadores siempre se les metía prisa, así que nunca hubo tiempo de definir nada ni de construir componentes, y el flujo de trabajo que salió de ahí era lento para todos.",
          },
        ],
        media: [
          {
            kind: "embed",
            src: "/work/afi-design-system/demo/PF-Sistema.html",
            title: {
              en: "A simulation form, a figure and status badges, all live",
              es: "Un formulario de simulación, una cifra y etiquetas de estado, todo en vivo",
            },
            width: 760,
            height: 404,
          },
        ],
      },
      {
        kicker: { en: "The problem", es: "El problema" },
        heading: {
          en: "Everyone saw a different Figma.",
          // TODO(afi-redaccion)
          es: "Cada uno veía un Figma distinto.",
        },
        navLabel: { en: "The problem", es: "El problema" },
        body: [
          {
            en: "Programmers have different permissions in Figma, so handoffs were inconsistent because they saw different things. They used the flows, not the components, and then asked me component questions.",
            // TODO(afi-redaccion)
            es: "Los programadores tienen permisos distintos en Figma, así que las entregas eran inconsistentes porque cada uno veía cosas distintas. Usaban los flujos, no los componentes, y luego me hacían preguntas de componentes.",
          },
          {
            en: "As the only full-time designer, my attention splits across forty programmers. An insight lands with one team and never reaches the others, so the same call gets defended again and again.",
            // TODO(afi-redaccion)
            es: "Como único diseñador a tiempo completo, mi atención se reparte entre cuarenta programadores. Un hallazgo se queda en un equipo y no llega al resto, así que la misma decisión se defiende una y otra vez.",
          },
        ],
        media: [
          {
            kind: "embed",
            src: "/work/afi-design-system/demo/PF-Lugares.html",
            title: {
              en: "Where the answers lived, in Figma by permission, the flows and the designer",
              es: "Dónde estaban las respuestas, en Figma según el permiso, los flujos y el diseñador",
            },
            width: 880,
            height: 273,
          },
        ],
      },
      {
        kicker: { en: "The question", es: "La pregunta" },
        heading: {
          en: "What if the system answered instead of me?",
          // TODO(afi-redaccion)
          es: "¿Y si respondiera el sistema en vez de yo?",
        },
        navLabel: { en: "The question", es: "La pregunta" },
        body: [
          {
            en: "A shared design language only exists if everyone has the same access to it. So the answers had to live somewhere the team could reach without me.",
            // TODO(afi-redaccion)
            es: "Un lenguaje de diseño compartido solo existe si todo el mundo tiene el mismo acceso a él. Así que las respuestas tenían que estar en algún sitio al que el equipo llegara sin mí.",
          },
          {
            en: "So I made one page per component, with every state and the tokens it uses.",
            // TODO(afi-redaccion)
            es: "Así que hice una página por componente, con todos sus estados y los tokens que usa.",
          },
        ],
        media: [
          {
            kind: "embed",
            src: "/work/afi-design-system/demo/PF-Pagina.html",
            title: {
              en: "The live segmented control and the tokens it consumes, on one component page",
              es: "El segmented control en vivo y los tokens que consume, en una página de componente",
            },
            width: 560,
            height: 419,
          },
        ],
      },
      {
        kicker: { en: "Tokens", es: "Tokens" },
        heading: {
          en: "A new brand is one layer.",
          // TODO(afi-redaccion)
          es: "Una marca nueva es una sola capa.",
        },
        navLabel: { en: "Tokens", es: "Tokens" },
        body: [
          {
            en: "Changing a client's brand meant editing colors across twenty files by hand. We started on PrimeNG, but with the white-label goal it became too many layers to build without a headache.",
            // TODO(afi-redaccion)
            es: "Cambiar la marca de un cliente significaba editar los colores en veinte archivos a mano. Empezamos con PrimeNG, pero con el objetivo white-label eran demasiadas capas para construirlo sin dolores de cabeza.",
          },
        ],
        switch: [
          {
            label: { en: "Three tiers", es: "Tres niveles" },
            heading: {
              en: "Components read roles, not colors.",
              // TODO(afi-redaccion)
              es: "Los componentes leen funciones, no colores.",
            },
            body: [
              {
                en: "A primitive names the color. A semantic token says what it's for, and the component only ever reads the semantic one.",
                // TODO(afi-redaccion)
                es: "Un primitivo pone nombre al color. Un token semántico dice para qué sirve, y el componente solo lee el semántico.",
              },
              {
                en: "So a brand swap happens in the primitives, and nothing above them has to change.",
                // TODO(afi-redaccion)
                es: "Así, un cambio de marca ocurre en los primitivos y nada por encima tiene que cambiar.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/afi-design-system/demo/PF-Niveles.html",
                title: {
                  en: "The primary button's color traced from primitive to semantic token to component",
                  es: "El color del botón principal, del primitivo al token semántico y al componente",
                },
                width: 820,
                height: 312,
              },
            ],
          },
          {
            label: { en: "Two brands", es: "Dos marcas" },
            heading: {
              en: "Only the token files change.",
              // TODO(afi-redaccion)
              es: "Solo cambian los archivos de tokens.",
            },
            body: [
              {
                en: "On the left is the neutral white-label skin. On the right is Afi, with the same components.",
                // TODO(afi-redaccion)
                es: "A la izquierda, la piel white-label neutra. A la derecha, Afi, con los mismos componentes.",
              },
              {
                en: "Both are live. Try the controls in either one.",
                // TODO(afi-redaccion)
                es: "Las dos están en vivo. Prueba los controles en cualquiera.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The same simulation card in the neutral white-label skin and in the Afi skin",
                  es: "La misma tarjeta de simulación con la piel white-label neutra y con la piel de Afi",
                },
                items: [
                  {
                    src: "/work/afi-design-system/demo/PF-Marca-Neutral.html",
                    rect: { x: 20, y: 20, w: 380, h: 341 },
                    viewport: { w: 420, h: 381 },
                    x: 26,
                    y: 50,
                    w: 45,
                    flat: true,
                    interactive: true,
                    label: { en: "White-label", es: "White-label" },
                  },
                  {
                    src: "/work/afi-design-system/demo/PF-Marca.html",
                    rect: { x: 20, y: 20, w: 380, h: 341 },
                    viewport: { w: 420, h: 381 },
                    x: 74,
                    y: 50,
                    w: 45,
                    flat: true,
                    interactive: true,
                    label: { en: "Afi", es: "Afi" },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        kicker: { en: "Playground", es: "Playground" },
        heading: {
          en: "Every component, on its own page.",
          // TODO(afi-redaccion)
          es: "Cada componente, en su propia página.",
        },
        navLabel: { en: "Playground", es: "Playground" },
        body: [
          {
            en: "Nobody rebuilds the same thing in Figma to check how it behaves. The token names on the page become the language the team uses for it.",
            // TODO(afi-redaccion)
            es: "Nadie vuelve a montar lo mismo en Figma para ver cómo se comporta. Los nombres de los tokens de esa página pasan a ser el lenguaje con el que el equipo habla de él.",
          },
        ],
        switch: [
          {
            label: { en: "States", es: "Estados" },
            heading: {
              en: "Every state, side by side.",
              // TODO(afi-redaccion)
              es: "Todos los estados, uno al lado del otro.",
            },
            body: [
              {
                en: "The component questions that used to come to me now have a page each. Disabled, loading and error are all there, live.",
                // TODO(afi-redaccion)
                es: "Las preguntas de componentes que antes me llegaban a mí tienen ahora su página. Desactivado, cargando y error están todos ahí, en vivo.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/afi-design-system/demo/PF-Estados.html",
                title: {
                  en: "Buttons, fields, checkboxes and switches in every state",
                  es: "Botones, campos, casillas e interruptores en todos sus estados",
                },
                width: 720,
                height: 335,
              },
            ],
          },
          {
            label: { en: "Inspector", es: "Inspector" },
            heading: {
              en: "The inspector answers in their vocabulary.",
              // TODO(afi-redaccion)
              es: "El inspector responde en su vocabulario.",
            },
            body: [
              {
                en: "In a user test I watched programmers skip the primitives and go straight for the raw value. So the inspector shows the token, the primitive behind it and the raw value they already work with.",
                // TODO(afi-redaccion)
                es: "En un test con usuarios vi a los programadores saltarse los primitivos e ir directos al valor. Así que el inspector enseña el token, el primitivo que hay detrás y el valor con el que ya trabajan.",
              },
              {
                en: "In Figma some people had more features than others. Here everyone sees the same thing.",
                // TODO(afi-redaccion)
                es: "En Figma unos tenían más funciones que otros. Aquí todo el mundo ve lo mismo, y eso pone a todos al mismo nivel.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/afi-design-system/demo/PF-Inspector.html",
                title: {
                  en: "A field and the inspector listing each property's token, primitive and value",
                  es: "Un campo y el inspector con el token, el primitivo y el valor de cada propiedad",
                },
                width: 940,
                height: 396,
              },
            ],
          },
          {
            label: { en: "Downloads", es: "Descargas" },
            heading: {
              en: "Anyone can download the tokens and skills.",
              // TODO(afi-redaccion)
              es: "Cualquiera puede descargar los tokens y las skills.",
            },
            body: [
              {
                en: "Five teams and one designer means the answer has to sit somewhere they can reach without me. So the token sets and the skills are downloadable.",
                // TODO(afi-redaccion)
                es: "Cinco equipos y un diseñador obligan a que la respuesta esté en algún sitio al que lleguen sin mí. Por eso los sets de tokens y las skills se pueden descargar.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/afi-design-system/demo/PF-Descargas.html",
                title: {
                  en: "Downloadable token sets and an AI skill",
                  es: "Sets de tokens y una skill de IA descargables",
                },
                width: 500,
                height: 291,
              },
            ],
          },
        ],
      },
      {
        kicker: { en: "Feedback", es: "Feedback" },
        heading: {
          en: "The team asked how to give feedback.",
          // TODO(afi-redaccion)
          es: "El equipo preguntó cómo dar feedback.",
        },
        navLabel: { en: "Feedback", es: "Feedback" },
        body: [
          {
            en: "When I showed the team the first version, the feedback was “How do we give you feedback?” They liked Figma because comments keep everyone up to date.",
            // TODO(afi-redaccion)
            es: "Al enseñar al equipo la primera versión, el feedback fue «¿Cómo te damos feedback?». Les gustaba Figma porque los comentarios mantienen a todo el mundo al día.",
          },
          {
            en: "Now anyone can pin a comment to a component or element. I export the comments as an MD file, we make the iteration, and it goes in our change log.",
            // TODO(afi-redaccion)
            es: "Ahora cualquiera puede fijar un comentario en un componente o elemento. Exporto los comentarios a un archivo MD, hacemos la iteración y la apuntamos en nuestro registro de cambios.",
          },
        ],
        media: [
          {
            kind: "embed",
            src: "/work/afi-design-system/demo/PF-Comentario.html",
            title: {
              en: "A comment pinned to a field, and the exported comments file",
              es: "Un comentario fijado en un campo y el archivo de comentarios exportado",
            },
            width: 760,
            height: 237,
          },
        ],
      },
      {
        kicker: { en: "Result", es: "Resultado" },
        heading: {
          en: "The coded rollout is on pause.",
          // TODO(afi-redaccion)
          es: "El despliegue en código está en pausa.",
        },
        navLabel: { en: "Result", es: "Resultado" },
        body: [
          {
            en: "It paused when the Modern UI work took priority. Swapping tokens is good for quick changes when a concept has to go out to a client, but the patterns and the visual essence get lost.",
            // TODO(afi-redaccion)
            es: "Se pausó cuando el trabajo de UI moderna pasó a ser prioritario. Cambiar tokens sirve para cambios rápidos cuando un concepto tiene que salir a cliente, pero los patrones y la esencia visual se pierden.",
          },
          {
            en: "The primitives still get skipped. A mid-senior teammate said, looking at the inspector, “We know we are doing it wrong but the team won't change.” We're now working with some clients on a more cohesive white-label in code.",
            // TODO(afi-redaccion)
            es: "Los primitivos se siguen saltando. Un compañero mid/senior dijo, mirando el inspector: «Sabemos que lo estamos haciendo mal, pero el equipo no va a cambiar». Ahora trabajamos con algunos clientes en un white-label más coherente en código.",
          },
        ],
        media: [
          {
            kind: "stats",
            items: [
              {
                value: "1",
                label: {
                  en: "full-time designer",
                  es: "diseñador a tiempo completo",
                },
              },
              {
                value: "40",
                label: { en: "programmers", es: "programadores" },
              },
              { value: "5", label: { en: "teams", es: "equipos" } },
              {
                value: "3",
                label: { en: "token tiers", es: "niveles de tokens" },
              },
            ],
          },
        ],
      },
    ],
  },
  "visual-identity": {
    tagline: {
      en: "We wrote down what modern meant before designing anything",
      // TODO(afi-redaccion)
      es: "Escribimos qué significaba moderno antes de diseñar nada",
    },
    intro: {
      en: "Wealth Planner is Afi's white-label simulator for Spanish banks, built from static Figma screens. Miguel, a freelance designer, and I built its token system and component library ahead of a design system migration.",
      // TODO(afi-redaccion)
      es: "Wealth Planner es el simulador de marca blanca de Afi para bancos españoles, hecho a partir de pantallas estáticas de Figma. Miguel, un diseñador freelance, y yo construimos su sistema de tokens y su librería de componentes de cara a una migración de sistema de diseño.",
    },
    role: {
      en: "Design lead",
      // TODO(afi-redaccion)
      es: "Líder de diseño",
    },
    contributions: {
      en: [
        "UX/UI design",
        "Design research",
        "Design principles",
        "Token system",
        "Typography",
        "Component library",
        "Micro-interaction design",
      ],
      // TODO(afi-redaccion)
      es: [
        "Diseño UX/UI",
        "Investigación de diseño",
        "Principios de diseño",
        "Sistema de tokens",
        "Tipografía",
        "Librería de componentes",
        "Diseño de microinteracciones",
      ],
    },
    bento: [],
    layout: "beats",
    // The workbench is the Coherence site's, opened full screen. The boards in the
    // beats are rebuilt from the Afi apps components (public/work/visual-identity/demo/).
    demo: {
      href: "https://coherence-wealth-manager.vercel.app/workbench/actions/button?embed=1",
    },
    closing: {
      en: "Open the workbench and press a button.",
      // TODO(afi-redaccion)
      es: "Abre el workbench y pulsa un botón.",
    },
    story: [
      {
        kicker: { en: "Context", es: "Contexto" },
        heading: {
          en: "The brief was one line.",
          // TODO(afi-redaccion)
          es: "El encargo era una línea.",
        },
        navLabel: { en: "Context", es: "Contexto" },
        body: [
          {
            en: "Make Wealth Planner look more modern. The product worked. It just looked dated.",
            // TODO(afi-redaccion)
            es: "Que Wealth Planner parezca más moderno. El producto funcionaba. Solo parecía anticuado.",
          },
          {
            en: "The product was built from static Figma screens. Developers worked screen by screen, and nobody had written down what modern meant.",
            // TODO(afi-redaccion)
            es: "El producto estaba hecho de pantallas estáticas de Figma. Los desarrolladores trabajaban pantalla a pantalla, y nadie había escrito qué significaba moderno.",
          },
        ],
      },
      {
        kicker: { en: "The problem", es: "El problema" },
        heading: {
          en: "Without a definition, every review is taste.",
          // TODO(afi-redaccion)
          es: "Sin una definición, cada revisión es gusto.",
        },
        navLabel: { en: "The problem", es: "El problema" },
        body: [
          {
            en: "Every review came down to whose taste won. In a product built screen by screen, each person's version of modern landed on a different screen.",
            // TODO(afi-redaccion)
            es: "Cada revisión acababa en qué gusto ganaba. En un producto hecho pantalla a pantalla, la versión de moderno de cada persona acababa en una pantalla distinta.",
          },
          {
            en: "We kept hitting the same problem. One component showed up twice on a page, meaning two things.",
            // TODO(afi-redaccion)
            es: "Nos pasaba una y otra vez. Un mismo componente aparecía dos veces en una página con dos significados.",
          },
        ],
        media: [
          {
            kind: "embed",
            src: "/work/visual-identity/demo/PF-Dos.html",
            title: {
              en: "Tabs used for pages and for options, and a beta label drawn like a paid feature",
              es: "Pestañas para páginas y para opciones, y una etiqueta beta igual que una función de pago",
            },
            width: 460,
            height: 374,
          },
        ],
      },
      {
        kicker: { en: "The question", es: "La pregunta" },
        heading: {
          en: "What does modern mean in 2026?",
          // TODO(afi-redaccion)
          es: "¿Qué significa moderno en 2026?",
        },
        navLabel: { en: "The question", es: "La pregunta" },
        body: [
          {
            en: "Before opening Figma, I did the desk research and wrote it up as Modern UI in 2026. It ends on six checks the redesign gets reviewed against.",
            // TODO(afi-redaccion)
            es: "Antes de abrir Figma hice la investigación y la publiqué como UI moderno en 2026. Termina en seis puntos con los que se revisa el rediseño.",
          },
          {
            en: "Now a review tests a screen against the list instead of someone's taste. Decorative color on a card gets cut. Color on a negative number stays.",
            // TODO(afi-redaccion)
            es: "Ahora una revisión comprueba la pantalla contra la lista y no contra el gusto de alguien. El color decorativo de una tarjeta se quita. El color de un número negativo se queda.",
          },
        ],
        media: [
          {
            kind: "embed",
            src: "/work/visual-identity/demo/PF-Lista.html",
            title: {
              en: "The six checks every screen is reviewed against",
              es: "Los seis puntos con los que se revisa cada pantalla",
            },
            width: 460,
            height: 333,
          },
        ],
      },
      {
        kicker: { en: "References", es: "Referencias" },
        heading: {
          en: "Miguel noticed we kept picking the same apps.",
          // TODO(afi-redaccion)
          es: "Miguel se dio cuenta de que elegíamos las mismas apps.",
        },
        navLabel: { en: "References", es: "Referencias" },
        body: [
          {
            en: "Miguel and I each built a board in Mobbin, separately, by component: buttons, inputs, menus, cards and dialogs. Going through both, he noticed we kept landing on Wise, Cursor, Shopify, Clerk, Notion and Granola.",
            // TODO(afi-redaccion)
            es: "Miguel y yo hicimos cada uno un tablero en Mobbin, por separado y por componente: botones, inputs, menús, tarjetas y diálogos. Al repasar los dos, vio que siempre acabábamos en Wise, Cursor, Shopify, Clerk, Notion y Granola.",
          },
          {
            en: "We took the repetition as the signal. Wise, the only reference from our own domain, settled color. A financial interface can stay mostly black and white and spend color on the data.",
            // TODO(afi-redaccion)
            es: "Tomamos la repetición como la señal. Wise, la única referencia de nuestro sector, resolvió el color. Una interfaz financiera puede ser casi toda blanco y negro y gastar el color en los datos.",
          },
        ],
        media: [
          {
            kind: "composition",
            title: {
              en: "Screens from the moodboard, one per app",
              es: "Pantallas del moodboard, una por app",
            },
            items: [
              {
                image: "/assets/work/visual-identity/moodboard/moodboard-6.jpg",
                imageRatio: 0.69,
                x: 18,
                y: 22,
                w: 30,
                radius: 24,
                sourceW: 1440,
                label: { en: "Wise", es: "Wise" },
              },
              {
                image:
                  "/assets/work/visual-identity/moodboard/moodboard-87.jpg",
                imageRatio: 0.69,
                x: 50,
                y: 22,
                w: 30,
                radius: 24,
                sourceW: 1440,
                label: { en: "Cursor", es: "Cursor" },
              },
              {
                image:
                  "/assets/work/visual-identity/moodboard/moodboard-33.jpg",
                imageRatio: 0.69,
                x: 82,
                y: 22,
                w: 30,
                radius: 24,
                sourceW: 1440,
                label: { en: "Shopify", es: "Shopify" },
              },
              {
                image:
                  "/assets/work/visual-identity/moodboard/moodboard-20.jpg",
                imageRatio: 0.69,
                x: 34,
                y: 64,
                w: 30,
                radius: 24,
                sourceW: 1440,
                label: { en: "Clerk", es: "Clerk" },
              },
              {
                image:
                  "/assets/work/visual-identity/moodboard/moodboard-17.jpg",
                imageRatio: 0.69,
                x: 66,
                y: 64,
                w: 30,
                radius: 24,
                sourceW: 1440,
                label: { en: "Notion", es: "Notion" },
              },
            ],
          },
        ],
      },
      {
        kicker: { en: "Rules", es: "Reglas" },
        heading: {
          en: "One component, one meaning.",
          // TODO(afi-redaccion)
          es: "Un componente, un significado.",
        },
        navLabel: { en: "Rules", es: "Reglas" },
        body: [
          {
            en: "We tied the patterns we kept picking back to the research and wrote them down as nine principles. A second list names four things to avoid, starting with Material Design.",
            // TODO(afi-redaccion)
            es: "Relacionamos los patrones que elegíamos con la investigación y los escribimos como nueve principios. Una segunda lista nombra cuatro cosas que evitar, empezando por Material Design.",
          },
        ],
        switch: [
          {
            label: { en: "Principles", es: "Principios" },
            heading: {
              en: "Nine principles the team can reuse.",
              // TODO(afi-redaccion)
              es: "Nueve principios que el equipo puede reutilizar.",
            },
            body: [
              {
                en: "A definition of modern tells you how the product should feel. It doesn't tell you whether editing opens a page or a drawer.",
                // TODO(afi-redaccion)
                es: "Una definición de moderno dice cómo debe sentirse el producto. No dice si editar abre una página o un panel.",
              },
              {
                en: "The principles do. Context over pages means an edit happens in a drawer, inline or in an expandable card.",
                // TODO(afi-redaccion)
                es: "Los principios sí. Contexto antes que páginas significa que se edita en un panel, en línea o en una tarjeta desplegable.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/visual-identity/demo/PF-Principios.html",
                title: {
                  en: "Four of the nine principles, and Material Design on the avoid list",
                  es: "Cuatro de los nueve principios, y Material Design en la lista de lo que evitar",
                },
                width: 460,
                height: 433,
              },
            ],
          },
          {
            label: { en: "Roles", es: "Roles" },
            heading: {
              en: "The role picks the component.",
              // TODO(afi-redaccion)
              es: "El rol elige el componente.",
            },
            body: [
              {
                en: "Page navigation is tabs. Mutually exclusive options are a segmented control.",
                // TODO(afi-redaccion)
                es: "La navegación de página son pestañas. Las opciones excluyentes son un control segmentado.",
              },
              {
                en: "An add-on tag and a beta tag describe what you're looking at. A pro tag is selling you something, so it can't look like them.",
                // TODO(afi-redaccion)
                es: "Una etiqueta de add-on y una de beta describen lo que estás viendo. Una de pro te está vendiendo algo, así que no puede parecerse a ellas.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/visual-identity/demo/PF-Uno.html",
                title: {
                  en: "Tabs for pages, a segmented control for options, and a sale that looks like a sale",
                  es: "Pestañas para páginas, un control segmentado para opciones y una venta que parece una venta",
                },
                width: 460,
                height: 365,
              },
            ],
          },
        ],
      },
      {
        kicker: { en: "Foundations", es: "Fundamentos" },
        heading: {
          en: "Name the job before the color.",
          // TODO(afi-redaccion)
          es: "Nombra la función antes que el color.",
        },
        navLabel: { en: "Foundations", es: "Fundamentos" },
        body: [
          {
            en: "Screen-by-screen design leaves the foundations open. A color gets picked for one screen, and nobody names the job it does anywhere else.",
            // TODO(afi-redaccion)
            es: "Diseñar pantalla a pantalla deja los fundamentos abiertos. Se elige un color para una pantalla y nadie nombra la función que cumple en las demás.",
          },
        ],
        switch: [
          {
            label: { en: "Tokens by role", es: "Tokens por rol" },
            heading: {
              en: "Black and white came first, named by role.",
              // TODO(afi-redaccion)
              es: "Primero blanco y negro, con nombre de rol.",
            },
            body: [
              {
                en: "We set up the primitive and semantic tokens in black and white before picking a single color. Each one is named by its role, like background canvas or background elevated.",
                // TODO(afi-redaccion)
                es: "Configuramos los tokens primitivos y semánticos en blanco y negro antes de elegir un solo color. Cada uno lleva el nombre de su rol, como fondo lienzo o fondo elevado.",
              },
              {
                en: "A screen asks for a canvas, not a hex value. So the palette can change later without renaming anything.",
                // TODO(afi-redaccion)
                es: "Una pantalla pide un lienzo, no un valor hexadecimal. Así la paleta puede cambiar más adelante sin renombrar nada.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/visual-identity/demo/PF-Roles.html",
                title: {
                  en: "Black and white tokens, each named by its role",
                  es: "Tokens en blanco y negro, cada uno con el nombre de su rol",
                },
                width: 620,
                height: 388,
              },
            ],
          },
          {
            label: { en: "Type test", es: "Prueba tipográfica" },
            heading: {
              en: "IBM Plex Sans kept the columns straight.",
              // TODO(afi-redaccion)
              es: "IBM Plex Sans mantuvo las columnas rectas.",
            },
            body: [
              {
                en: "When 0000 and 4444 take up different widths, columns of figures stop lining up. We ran Space Grotesk, Fira Sans, Geist and IBM Plex Sans through the same number patterns.",
                // TODO(afi-redaccion)
                es: "Cuando 0000 y 4444 ocupan anchos distintos, las columnas de cifras dejan de alinearse. Pasamos Space Grotesk, Fira Sans, Geist e IBM Plex Sans por los mismos patrones de números.",
              },
              {
                en: "Three drifted and IBM Plex Sans held, so it became the type family. The board measures each font's default figures live.",
                // TODO(afi-redaccion)
                es: "Tres se desviaron e IBM Plex Sans aguantó, así que pasó a ser la familia tipográfica. El tablero mide en vivo las cifras por defecto de cada fuente.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/visual-identity/demo/PF-Tipos.html",
                title: {
                  en: "0000 and 4444 in four typefaces, with the width difference measured live",
                  es: "0000 y 4444 en cuatro tipografías, con la diferencia de ancho medida en vivo",
                },
                width: 620,
                height: 540,
              },
            ],
          },
        ],
      },
      {
        kicker: { en: "Components", es: "Componentes" },
        heading: {
          en: "Built in code, then mirrored in Figma.",
          // TODO(afi-redaccion)
          es: "Hechos en código y luego llevados a Figma.",
        },
        navLabel: { en: "Components", es: "Componentes" },
        body: [
          {
            en: "Each component starts in code, from the moodboard. An AI agent then builds it in Figma with the right variables and drafts the documentation. We adjust it and add it to the Afi library through the Figma MCP.",
            // TODO(afi-redaccion)
            es: "Cada componente empieza en código, a partir del moodboard. Después un agente de IA lo construye en Figma con las variables correctas y redacta la documentación. Lo ajustamos y lo llevamos a la librería de Afi con el MCP de Figma.",
          },
        ],
        switch: [
          {
            label: { en: "Primitives", es: "Primitivos" },
            heading: {
              en: "We split the primitives between us.",
              // TODO(afi-redaccion)
              es: "Nos repartimos los primitivos.",
            },
            body: [
              {
                en: "Chip, badge, card and table were mine. Tag, dialog, navbar and tabs were Miguel's. We built buttons, inputs, checkboxes and toggles together first, to agree on one workflow.",
                // TODO(afi-redaccion)
                es: "Chip, badge, tarjeta y tabla eran míos. Tag, diálogo, barra de navegación y pestañas, de Miguel. Botones, inputs, checkboxes y toggles los hicimos juntos primero, para acordar un solo flujo de trabajo.",
              },
              {
                en: "Two skills check the library. /ds-cleanup audits a component and fixes where it drifts. /ship hands back a Figma prompt for any variable that changed, so Figma and code don't drift apart.",
                // TODO(afi-redaccion)
                es: "Dos skills revisan la librería. /ds-cleanup audita un componente y corrige donde se desvía. /ship devuelve un prompt de Figma para cada variable que cambió, para que Figma y el código no se separen.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/visual-identity/demo/PF-Primitivos.html",
                title: {
                  en: "The primitives each designer built, and the ones built together",
                  es: "Los primitivos que hizo cada diseñador y los que hicimos juntos",
                },
                width: 900,
                height: 305,
              },
            ],
          },
          {
            label: { en: "Micro-interactions", es: "Microinteracciones" },
            heading: {
              en: "Motion that explains state.",
              // TODO(afi-redaccion)
              es: "Movimiento que explica el estado.",
            },
            body: [
              {
                en: "We didn't invent most of the animations. We reverse-engineered the ones that inspired us, or ported a React library like Magic UI to Angular and iterated.",
                // TODO(afi-redaccion)
                es: "No inventamos la mayoría de las animaciones. Copiamos el mecanismo de las que nos inspiraban, o portamos a Angular una librería de React como Magic UI e iteramos.",
              },
              {
                en: "The press state came out of the moodboard session. The button sinks in, the way a physical one does. Press anything on the board.",
                // TODO(afi-redaccion)
                es: "El estado de pulsado salió de la sesión de moodboard. El botón se hunde, como uno físico. Pulsa cualquier cosa del tablero.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/visual-identity/demo/PF-Micro.html",
                title: {
                  en: "A checkbox, radios, a toggle, a button that sinks and a send button",
                  es: "Una casilla, radios, un toggle, un botón que se hunde y un botón de enviar",
                },
                width: 720,
                height: 218,
              },
            ],
          },
        ],
      },
      {
        kicker: { en: "Result", es: "Resultado" },
        heading: {
          en: "Reviews now run against a checklist.",
          // TODO(afi-redaccion)
          es: "Las revisiones van ahora contra una lista.",
        },
        navLabel: { en: "Result", es: "Resultado" },
        body: [
          {
            en: "The token system and component library are ready for the design system migration. Shadows and dimensions are the next two passes.",
            // TODO(afi-redaccion)
            es: "El sistema de tokens y la librería de componentes están listos para la migración del sistema de diseño. Sombras y dimensiones son las dos próximas pasadas.",
          },
          {
            en: "Not every principle has earned its place yet. So far the ones that have are the role rules, one component and one meaning.",
            // TODO(afi-redaccion)
            es: "No todos los principios se han ganado su sitio todavía. Por ahora, los que sí son las reglas de roles, un componente y un significado.",
          },
        ],
        media: [
          {
            kind: "stats",
            items: [
              {
                value: "6",
                label: {
                  en: "checks in every review",
                  es: "puntos en cada revisión",
                },
              },
              {
                value: "6",
                label: { en: "reference apps", es: "apps de referencia" },
              },
              { value: "9", label: { en: "principles", es: "principios" } },
              {
                value: "4",
                label: { en: "typefaces tested", es: "tipografías probadas" },
              },
            ],
          },
        ],
      },
    ],
  },
  /**
   * SAREVI, in the beats format (content/references/case-studies/standard.md), told as
   * what it was: a redesign. The flow came from a client bank's version; the job was to
   * make it modern and appealing, which meant a new design system (Afi apps), motion
   * tokens on every control, animation on Medidas and Resumen, and 3D houses instead of
   * flat pictures (Richard's account, 2026-11-27).
   *
   * Visuals come from the v1.0 export in public/work/sarevi/demo: compositions frame a
   * whole component on a board, clips are recordings of the same boards (the motion-*
   * close-ups are slowed with CDP and retimed, so they play at the real speed), and the
   * "Try it" visuals are the live pages. PF-*.dc.html are portfolio-only copies of P-Prototipo
   * that open the prototype on one screen.
   *
   * Stats count things in the file or the sessions: 40 boards on the v1.0 page, 6
   * Resumen directions, 4 picture styles, 2 brands to 1. Known gaps: no outcome data, no
   * test with a bank customer. Spanish had an afi-redaccion pass on 2026-11-27.
   */
  sarevi: {
    tagline: {
      en: "Redesigning a bank simulator to look and move like a modern product",
      es: "Rediseñar un simulador bancario para que se vea y se mueva como un producto actual",
    },
    intro: {
      en: "SAREVI is Afi's energy-efficiency simulator for banks: a customer describes their home and sees what a reform costs, saves and how to pay for it. I'm its only full-time designer, and I redesigned it on a new design system so Afi can keep selling it.",
      es: "SAREVI es el simulador de eficiencia energética de Afi para bancos: el cliente describe su vivienda y ve cuánto cuesta una reforma, cuánto ahorra y cómo pagarla. Soy su único diseñador a tiempo completo y lo he rediseñado sobre un sistema de diseño nuevo para que Afi pueda seguir vendiéndolo.",
    },
    role: {
      en: "Only full-time designer",
      es: "Único diseñador a tiempo completo",
    },
    contributions: {
      en: [
        "Redesign",
        "Design system",
        "Motion tokens",
        "Interaction design",
        "3D picture style",
        "Prototype",
      ],
      es: [
        "Rediseño",
        "Sistema de diseño",
        "Tokens de movimiento",
        "Diseño de interacción",
        "Estilo de imagen 3D",
        "Prototipo",
      ],
    },
    bento: [],
    layout: "beats",
    demo: { href: "/work/sarevi/demo/P-Prototipo.dc.html" },
    closing: {
      en: "Pick a home, tick a few measures and see your grade.",
      es: "Elige una vivienda, marca unas medidas y mira tu letra.",
    },
    story: [
      {
        kicker: { en: "Context", es: "Contexto" },
        heading: {
          en: "The flow worked. It looked its age.",
          es: "El flujo funcionaba. Se le notaba la edad.",
        },
        navLabel: { en: "Context", es: "Contexto" },
        body: [
          {
            en: "Banks put our simulators on their sites as a free tool, and Afi sells the calculation. SAREVI's flow came from the version we built for one client bank, improved bit by bit for a year and a half.",
            es: "Los bancos ponen nuestros simuladores en sus webs como herramienta gratuita, y Afi vende el cálculo. El flujo de SAREVI venía de la versión que hicimos para un banco cliente, mejorada poco a poco durante año y medio.",
          },
          {
            en: "Next to the banks' own products it looked dated. One client stepped back and usage was below target. So the brief was a redesign: same calculation, modern look.",
            es: "Al lado de los productos de los propios bancos se veía anticuado. Un cliente se retiró y el uso estaba por debajo del objetivo. Así que el encargo fue un rediseño: el mismo cálculo, con un aspecto actual.",
          },
        ],
        media: [
          {
            kind: "composition",
            title: {
              en: "The SAREVI landing: the promise and the three steps",
              es: "La portada de SAREVI: la promesa y los tres pasos",
            },
            items: [
              {
                src: "/work/sarevi/demo/A-Inicio-Portada.dc.html",
                viewport: { w: 1440, h: 688 },
                rect: { x: 168, y: 83, w: 544, h: 484 },
                x: 50,
                y: 50,
                w: 56,
                radius: 16,
              },
            ],
            play: "reload",
          },
        ],
      },
      {
        kicker: { en: "The system", es: "El sistema" },
        heading: {
          en: "A new design system, not Wealth Planner's.",
          es: "Un sistema de diseño nuevo, no el de Wealth Planner.",
        },
        navLabel: { en: "The system", es: "El sistema" },
        body: [
          {
            en: "Wealth Planner's system is built for advisers at a desk. SAREVI faces a bank's customers, once, on a phone or a laptop, so it needed its own: Afi apps.",
            es: "El sistema de Wealth Planner está pensado para gestores que trabajan en su mesa. SAREVI lo usa el cliente de un banco, una vez, en el móvil o el portátil, así que necesitaba el suyo: Afi apps.",
          },
          {
            en: "It uses Libre Franklin, Afi's deep blue for actions, softer corners and its own tokens. Cumplimiento and the other simulators now build on it too.",
            es: "Usa Libre Franklin, el azul profundo de Afi para las acciones, esquinas más suaves y sus propios tokens. Cumplimiento y los demás simuladores ya se construyen sobre él.",
          },
        ],
        media: [
          {
            kind: "composition",
            title: {
              en: "Four Afi apps components from SAREVI: a landing card, the results panel, the Resumen hero and a measure row",
              es: "Cuatro componentes de Afi apps en SAREVI: una tarjeta de portada, el panel de resultados, la cabecera de Resumen y una fila de medida",
            },
            items: [
              {
                src: "/work/sarevi/demo/B-Viv-Resumen.dc.html",
                viewport: { w: 1440, h: 2184 },
                rect: { x: 60, y: 254, w: 552, h: 321 },
                x: 31,
                y: 30,
                w: 46,
                radius: 16,
              },
              {
                src: "/work/sarevi/demo/A-Inicio-Portada.dc.html",
                viewport: { w: 1440, h: 688 },
                rect: { x: 752, y: 345, w: 496, h: 183 },
                x: 31,
                y: 74,
                w: 46,
                radius: 16,
              },
              {
                src: "/work/sarevi/demo/B-Viv-Medidas-Basica.dc.html",
                viewport: { w: 1440, h: 1695 },
                rect: { x: 866, y: 186, w: 420, h: 584 },
                x: 76,
                y: 50,
                w: 36,
                radius: 16,
              },
            ],
            play: "reload",
          },
        ],
      },
      {
        kicker: { en: "Chapter 1 · Motion", es: "Capítulo 1 · Movimiento" },
        heading: {
          en: "Every control got the same motion.",
          es: "Todos los controles se mueven igual.",
        },
        navLabel: { en: "Motion", es: "Movimiento" },
        body: [
          {
            en: "I took Dive Club's easing curves and made them tokens, so every control moves the same way. A move reads as done in about 200 ms. Things that appear get a spring; things that close get a quicker ease.",
            es: "Tomé las curvas de Dive Club y las convertí en tokens, para que todos los controles se muevan igual. Un movimiento parece terminado en unos 200 ms. Lo que aparece lleva efecto muelle; lo que se cierra, una curva más rápida.",
          },
          {
            en: "Try them: pick a home, open the list, tick a measure, flip the switch.",
            es: "Pruébalos: elige una vivienda, abre la lista, marca una medida y cambia el interruptor.",
          },
        ],
        media: [
          {
            kind: "embed",
            src: "/work/sarevi/demo/PF-Controles.html",
            title: {
              en: "Live Afi apps controls: picture cards, a dropdown, checkboxes and a switch",
              es: "Controles de Afi apps en vivo: tarjetas con imagen, un desplegable, casillas y un interruptor",
            },
            width: 880,
            height: 408,
          },
        ],
      },
      {
        kicker: { en: "Chapter 2 · Medidas", es: "Capítulo 2 · Medidas" },
        heading: {
          en: "Tick a measure, watch the results move.",
          es: "Marca una medida y verás cómo se mueven los resultados.",
        },
        navLabel: { en: "Medidas", es: "Medidas" },
        body: [
          {
            en: "Medidas (the measures) is where the user decides. In the old flow the results sat below a long list. Now they sit beside it and animate with every tick, so you see what each choice does.",
            es: "Medidas es donde el usuario decide. En el flujo antiguo los resultados quedaban debajo de una lista larga. Ahora están al lado y se animan con cada marca, así que se ve el efecto de cada decisión.",
          },
          {
            en: "This is the real screen, cut to one measure. Tick SATE: the yearly bill drops from 627 € to 439 €, and consumption and emissions follow.",
            es: "Esta es la pantalla real, reducida a una medida. Marca SATE: la factura anual baja de 627 € a 439 €, y el consumo y las emisiones la siguen.",
          },
        ],
        media: [
          {
            kind: "embed",
            src: "/work/sarevi/demo/PF-Medida.dc.html",
            title: {
              en: "SATE beside the estimated results, live: tick it and the bill, consumption and emissions change",
              es: "SATE junto a los resultados estimados, en vivo: márcala y cambian la factura, el consumo y las emisiones",
            },
            width: 1180,
            height: 348,
          },
        ],
      },
      {
        kicker: { en: "Chapter 3 · Resumen", es: "Capítulo 3 · Resumen" },
        heading: {
          en: "The grade you'll get lands last.",
          es: "La letra que vas a conseguir llega la última.",
        },
        navLabel: { en: "Resumen", es: "Resumen" },
        body: [
          {
            en: "Resumen (the summary) listed the numbers and left you to work out what changed. I compared six directions with the team. The before and after bars won, so consumption and emissions each get their own.",
            es: "Resumen enumeraba los números y te dejaba deducir qué había cambiado. Comparé seis propuestas con el equipo. Ganaron las barras de antes y después, así que consumo y emisiones tienen cada uno las suyas.",
          },
          {
            en: "The order is on purpose. The context animates in first, the saving counts up, and the new energy grade is the last thing to land: the one thing you came for.",
            es: "El orden es intencionado. Primero entra el contexto, después sube la cifra de ahorro y la nueva letra energética es lo último en llegar: lo que venías a buscar.",
          },
        ],
        media: [
          {
            kind: "composition",
            title: {
              en: "Resumen: the saving and grade card, then consumption and emissions",
              es: "Resumen: la tarjeta de ahorro y letra, después consumo y emisiones",
            },
            items: [
              {
                src: "/work/sarevi/demo/B-Viv-Resumen.dc.html",
                viewport: { w: 1440, h: 2184 },
                rect: { x: 60, y: 254, w: 552, h: 321 },
                x: 27,
                y: 50,
                w: 46,
                radius: 16,
              },
              {
                src: "/work/sarevi/demo/B-Viv-Resumen.dc.html",
                viewport: { w: 1440, h: 2184 },
                rect: { x: 628, y: 254, w: 368, h: 321 },
                x: 63,
                y: 50,
                w: 23,
                radius: 16,
              },
              {
                src: "/work/sarevi/demo/B-Viv-Resumen.dc.html",
                viewport: { w: 1440, h: 2184 },
                rect: { x: 1012, y: 254, w: 368, h: 321 },
                x: 87.5,
                y: 50,
                w: 23,
                radius: 16,
              },
            ],
            play: "reload",
          },
        ],
      },
      {
        kicker: { en: "Chapter 4 · Pictures", es: "Capítulo 4 · Imagen" },
        heading: {
          en: "3D houses instead of flat pictures.",
          es: "Casas en 3D en lugar de imágenes planas.",
        },
        navLabel: { en: "Pictures", es: "Imagen" },
        body: [
          {
            en: "The landing asks one question: a home or a whole building. I wanted that choice to feel like an object, not an icon.",
            es: "La portada hace una sola pregunta: una vivienda o un edificio entero. Quería que esa elección pareciera un objeto, no un icono.",
          },
        ],
        switch: [
          {
            label: { en: "Try the hover", es: "Prueba el hover" },
            heading: {
              en: "Grey at rest, colour on hover.",
              es: "Gris en reposo, color al pasar el ratón.",
            },
            body: [
              {
                en: "Hover a card: the colour fades in and the trees grow, one after the other, with a bounce. These are the live cards.",
                es: "Pasa el ratón por una tarjeta: entra el color y crecen los árboles, uno tras otro, con rebote. Son las tarjetas en vivo.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/sarevi/demo/PF-Casas.html",
                title: {
                  en: "The two landing cards, live: hover them",
                  es: "Las dos tarjetas de la portada, en vivo: pasa el ratón",
                },
                width: 560,
                height: 460,
              },
            ],
          },
          {
            label: { en: "Four styles", es: "Cuatro estilos" },
            heading: {
              en: "Four styles before one stuck.",
              es: "Cuatro estilos antes de dar con uno.",
            },
            body: [
              {
                en: "A grid of digits was too psychedelic. Coloured dioramas came back too playful, and a line drawing didn't catch anyone's attention. Most of the feedback was a plain \"I don't like it\", so I kept going until the white model did.",
                es: "Una cuadrícula de dígitos resultó demasiado psicodélica. Los dioramas en color, demasiado infantiles, y un dibujo de línea no llamó la atención de nadie. Casi toda la respuesta era un «no me gusta», así que seguí hasta que funcionó el modelo blanco.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The four picture styles: digit grid, coloured dioramas, line drawing, white model",
                  es: "Los cuatro estilos de imagen: cuadrícula de dígitos, dioramas en color, dibujo de línea y modelo blanco",
                },
                aspect: 1.25,
                items: [
                  {
                    image: "/work/sarevi/morph-poster.webp",
                    imageRatio: 0.625,
                    x: 27,
                    y: 29,
                    w: 38,
                    label: {
                      en: "1 · Digit grid",
                      es: "1 · Cuadrícula de dígitos",
                    },
                  },
                  {
                    image: "/work/sarevi/style-dioramas-poster.webp",
                    imageRatio: 0.625,
                    x: 73,
                    y: 29,
                    w: 38,
                    label: {
                      en: "2 · Coloured dioramas",
                      es: "2 · Dioramas en color",
                    },
                  },
                  {
                    image: "/work/sarevi/style-linea-poster.webp",
                    imageRatio: 0.625,
                    x: 27,
                    y: 75,
                    w: 38,
                    label: {
                      en: "3 · Line drawing",
                      es: "3 · Dibujo de línea",
                    },
                  },
                  {
                    image: "/work/sarevi/style-model-poster.webp",
                    imageRatio: 0.625,
                    x: 73,
                    y: 75,
                    w: 38,
                    label: { en: "4 · White model", es: "4 · Modelo blanco" },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        kicker: { en: "Result", es: "Resultado" },
        heading: {
          en: "Not public yet. The system is.",
          es: "Aún no es público. El sistema sí.",
        },
        navLabel: { en: "Result", es: "Resultado" },
        body: [
          {
            en: "The redesign isn't public yet, so there are no outcomes. First checks: do more people start from the new landing, and does support still hear whether the figure is binding.",
            es: "El rediseño aún no es público, así que no hay resultados. Primeras comprobaciones: si más gente empieza desde la portada nueva y si atención al cliente sigue recibiendo preguntas sobre si la cifra es vinculante.",
          },
          {
            en: "What it left behind is Afi apps: the tokens, the motion and the house models, now under the other simulators too.",
            es: "Lo que deja es Afi apps: los tokens, el movimiento y los modelos de casa, que ya sirven de base a los demás simuladores.",
          },
        ],
        media: [
          {
            kind: "stats",
            items: [
              {
                value: "40",
                label: {
                  en: "boards in the v1.0 design file",
                  es: "tableros en el archivo de diseño v1.0",
                },
              },
              {
                value: "6",
                label: {
                  en: "Resumen directions compared",
                  es: "propuestas de Resumen comparadas",
                },
              },
              {
                value: "4",
                label: {
                  en: "picture styles tried",
                  es: "estilos de imagen probados",
                },
              },
              {
                value: "2 → 1",
                label: {
                  en: "brands, down to Afi's own",
                  es: "marcas, reducidas a la de Afi",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  kt360: {
    tagline: {
      en: "An AI environment built for a team that doesn't have a full design department",
      es: "Un entorno de IA construido para un equipo que no tiene un departamento de diseño completo",
    },
    intro: {
      en: "KT360 is an early-stage AI startup. The brand had to look nothing like AI, so it's playful, human, and deliberately distinct. The harder problem was that there was no designer on the team. We encoded the brand into the environment. Rules, component specs, and motion patterns live as files an AI can read, check, and enforce. When marketing writes a blog post and a developer ships a page, both come out looking like the same hand because the rules do the work.",
      es: "KT360 es una startup de IA en fase inicial. La marca no podía parecer de IA, así que es lúdica, humana y deliberadamente distinta. El problema de verdad era que no había diseñador en el equipo. Codificamos la marca dentro del entorno. Las reglas, las especificaciones de componentes y los patrones de movimiento viven como archivos que una IA puede leer, comprobar y hacer cumplir. Marketing escribe un artículo y un desarrollador publica una página, y los dos salen de la misma mano porque las reglas hacen el trabajo.",
    },
    role: {
      en: "Freelance Designer & AI Builder",
      es: "Diseñador freelance y constructor de IA",
    },
    contributions: {
      en: [
        "UX/UI design",
        "Brand strategy",
        "Visual identity",
        "Design systems",
        "AI environment design",
        "Prototype infrastructure",
      ],
      es: [
        "Diseño UX/UI",
        "Estrategia de marca",
        "Identidad visual",
        "Sistemas de diseño",
        "Diseño de entorno de IA",
        "Infraestructura de prototipado",
      ],
    },
    bento: [
      {
        label: {
          en: "Visual Identity",
          es: "Identidad visual",
        },
        sublabel: {
          en: "Playful, human, deliberately distinct — so the brand reads as a person, not as a model.",
          es: "Juguetona, humana, deliberadamente distinta — para que la marca se lea como una persona, no como un modelo.",
        },
        animation: "logo-identity",
      },
      {
        label: {
          en: "Rules as Files",
          es: "Reglas como archivos",
        },
        sublabel: {
          en: "Brand rules, component specs, and motion patterns written as files the AI reads — so an agent catches the off-brand button before a human has to.",
          es: "Reglas de marca, specs de componentes y patrones de movimiento escritos como archivos que la IA lee — para que un agente cace el botón fuera de marca antes que una persona.",
        },
        animation: "rules",
      },
      {
        label: {
          en: "Shared Prototype Environment",
          es: "Entorno de prototipado compartido",
        },
        sublabel: {
          en: "One codebase marketers, developers, and AI agents all open — so a blog post and a new page come out of the same place.",
          es: "Un único código base que marketing, desarrolladores y agentes de IA abren — para que un artículo y una página nueva salgan del mismo sitio.",
        },
        animation: "canvas",
      },
      {
        label: {
          en: "Design System Foundation",
          es: "Base del sistema de diseño",
        },
        sublabel: {
          en: "Tokens, typography, components — so every new page inherits the brand without anyone choosing it manually.",
          es: "Tokens, tipografía, componentes — para que cada página nueva herede la marca sin que nadie tenga que elegirla a mano.",
        },
        animation: "guideline",
      },
      {
        label: {
          en: "Motion as Tokens",
          es: "Movimiento como tokens",
        },
        sublabel: {
          en: "Easing and timing live as tokens like color and spacing — so motion doesn't drift between a button hover and a modal entrance.",
          es: "Los easings y los tiempos viven como tokens igual que el color y el espaciado — para que el movimiento no se desvíe entre el hover de un botón y la entrada de un modal.",
        },
        details: {
          heading: {
            en: "Treat motion the way you treat color",
            es: "Trata el movimiento como tratas el color",
          },
          sections: [
            {
              label: { en: "The problem", es: "El problema" },
              body: {
                en: "On most teams, motion is the last thing the designer hands over and the first thing the developer simplifies. The brand has a font, a color, a spacing scale — and then every animation gets eyeballed in CSS at the end. Surfaces drift in feel even when they look identical at rest.",
                es: "En la mayoría de equipos, el movimiento es lo último que entrega el diseñador y lo primero que simplifica el desarrollador. La marca tiene tipografía, color y escala de espaciado, y luego cada animación se ajusta a ojo en el CSS final. Las superficies acaban desviándose en sensación, aunque a primera vista parezcan idénticas en reposo.",
              },
            },
            {
              label: { en: "What we did", es: "Lo que hicimos" },
              body: {
                en: "Treated motion the way the system already treats color and spacing — as decisions about curves and times, not as decoration. Built two motion-token tables inside the KT360 rulebook.",
                es: "Hemos tratado el movimiento igual que el sistema trata el color y el espaciado: como decisiones sobre curvas y tiempos, no como decoración. Hemos creado dos tablas de tokens de movimiento dentro del manual de KT360.",
              },
            },
            {
              label: { en: "The solution", es: "La solución" },
              body: {
                en: "Timing tokens like `motion.duration.fast` (~160ms), `motion.duration.base` (~240ms), `motion.duration.slow` (~400ms). Easing tokens like `motion.ease.out-soft` for entrances, `motion.ease.in-firm` for exits, `motion.ease.spring-snap` for things that should feel alive. Every component reaches in by name, and the rulebook tells the AI which token a given interaction belongs to.",
                es: "Tokens de tiempo: `motion.duration.fast` (~160 ms), `motion.duration.base` (~240 ms), `motion.duration.slow` (~400 ms). Tokens de easing: `motion.ease.out-soft` para las entradas, `motion.ease.in-firm` para las salidas y `motion.ease.spring-snap` para lo que tiene que sentirse con vida propia. Cada componente accede a estos tokens por nombre, y el manual le indica a la IA qué token corresponde a cada tipo de interacción.",
              },
            },
            {
              label: { en: "Why it works", es: "Por qué funciona" },
              body: {
                en: "The same easing carries from a button hover to a modal entrance to a toast — because what got copied is the token, not the value. Year one nobody notices. Year three the brand still feels the way the founder remembers it feeling, because the motion didn't drift.",
                es: "El mismo easing pasa del hover de un botón a la entrada de un modal y, de ahí, a un toast: lo que se copia es el token, no el valor. El primer año nadie lo nota. El tercer año, la marca sigue transmitiendo la sensación que el fundador recuerda haber creado, porque el movimiento no se ha desviado.",
              },
            },
          ],
        },
        animation: "motion-tokens",
      },
    ],
  },
  /**
   * `hours-stat`, `leads-funnel` and `model-iteration` went unused when these
   * studies moved to the deck's structure on 2026-08-25. All three were built for
   * Audemic and they still render — the earlier version of this study used them as
   * card faces for the 20-hours figure, the 20-leads figure and the OpenAI/Claude
   * iteration. Each of those beats now lives on a Process card whose face is the
   * image the deck pairs it with, and a card can carry one or the other, not both.
   * They're in the registry in case-study-bento.tsx if you want them back.
   */
  "wealth-planner": {
    tagline: {
      en: "Showing advisers what a change does, while they make it",
      es: "Mostrar al gestor el efecto de cada cambio mientras lo hace",
    },
    intro: {
      en: "Wealth Planner is Afi's simulator for wealth advisers: they enter a client's family, assets, income and goals, and the plan shows what the client will have and leave behind. In three days and ten prototypes we reorganised where everything lives, so every change shows its effect while the adviser types.",
      es: "Wealth Planner es el simulador de Afi para gestores patrimoniales: introducen la familia, el patrimonio, los ingresos y los objetivos de un cliente, y el plan muestra lo que tendrá y lo que dejará. En tres días y diez prototipos reorganizamos dónde está cada cosa para que cada cambio muestre su efecto mientras el gestor escribe.",
    },
    role: {
      en: "Systems and UX/UI designer",
      es: "Diseñador de sistemas y UX/UI",
    },
    contributions: {
      en: [
        "Information architecture",
        "Interaction design",
        "AI states and motion",
        "Prototyping",
        "Design-system proposals",
      ],
      es: [
        "Arquitectura de la información",
        "Diseño de interacción",
        "Estados y movimiento de la IA",
        "Prototipado",
        "Propuestas al sistema de diseño",
      ],
    },
    bento: [],
    layout: "beats",
    demo: { href: "/work/wealth-planner/demo/P312-main.html" },
    closing: {
      en: "Change an income and watch the plan answer.",
      es: "Cambia un ingreso y mira cómo responde el plan.",
    },
    story: [
      {
        kicker: {
          en: "Context",
          es: "Contexto",
        },
        heading: {
          en: "The team wanted the plan in view.",
          es: "El equipo quería el plan a la vista.",
        },
        navLabel: { en: "Context", es: "Contexto" },
        body: [
          {
            en: "The live product had just been redesigned. The team's favourite addition was a drawer you could pin to watch the plan update.",
            es: "El producto en vivo acababa de rediseñarse. Lo que más gustó al equipo fue un panel que se podía fijar para ver cómo se actualizaba el plan.",
          },
          {
            en: "Then they asked for it beside the page, half and half. Advisers use the plan with the client in the room, so it has to stay in view.",
            es: "Después pidieron verlo a media pantalla, junto a la página. Los gestores usan el plan con el cliente delante, así que tiene que estar siempre a la vista.",
          },
        ],
        media: [
          {
            kind: "composition",
            title: {
              en: "The plan updating live after an edit",
              es: "El plan se actualiza en vivo tras una edición",
            },
            items: [
              {
                src: "/work/wealth-planner/demo/wp-ingresos-edit.html",
                rect: { x: 766, y: 64, w: 662, h: 824 },
                x: 50,
                y: 52,
                w: 46,
                fade: "bottom",
                radius: 18,
              },
            ],
            caption: {
              en: "The plan answering an edit, live.",
              es: "El plan responde a una edición, en vivo.",
            },
          },
        ],
      },
      {
        kicker: {
          en: "The problem",
          es: "El problema",
        },
        heading: {
          en: "The results lived in five places.",
          es: "Los resultados vivían en cinco sitios.",
        },
        navLabel: { en: "The problem", es: "El problema" },
        body: [
          {
            en: "It's a dense product: every page asks for a lot, and the plan answers with a lot. Drawers held the detail better than dialogs, but the results were still spread across five places, so you always had to go looking.",
            es: "Es un producto denso: cada página pide mucho y el plan responde con mucho. Los paneles contenían el detalle mejor que los diálogos, pero los resultados seguían repartidos en cinco sitios, así que siempre había que ir a buscarlos.",
          },
          {
            en: "A teammate wanted to show the AI generating the plan. With five places, there was nowhere to show it.",
            es: "Un compañero quería mostrar cómo la IA genera el plan. Con cinco sitios, no había dónde mostrarlo.",
          },
        ],
        media: [
          {
            kind: "composition",
            title: {
              en: "The live product: the five places the plan's results lived",
              es: "El producto en vivo: los cinco sitios donde estaban los resultados del plan",
            },
            aspect: 1,
            radiusFrom: 1,
            items: [
              {
                image: "/work/wealth-planner/live-ingresos.jpg",
                imageRatio: 0.625,
                x: 34,
                y: 21.75,
                w: 60,
                radius: 8,
              },
              {
                image: "/work/wealth-planner/live-drawer.png",
                imageRatio: 1.9644,
                x: 81,
                y: 30.5,
                w: 28,
                radius: 12,
                sourceW: 450,
              },
              {
                image: "/work/wealth-planner/live-gl.png",
                imageRatio: 0.1187,
                x: 34,
                y: 47.06,
                w: 60,
              },
              {
                image: "/work/wealth-planner/live-ren-card.png",
                imageRatio: 0.1444,
                x: 24,
                y: 56.49,
                w: 40,
              },
            ],
            marks: [
              { x: 48.4, y: 0.5, n: 1 },
              { x: 26.1, y: 13.2, n: 2 },
              { x: 81, y: 0.5, n: 3 },
              { x: 1.2, y: 47.06, n: 4 },
              { x: 1.2, y: 56.49, n: 5 },
            ],
            legend: [
              {
                en: "The verdict, in two pills at the top: Legado and Liquidez.",
                es: "El veredicto, en dos píldoras arriba: Legado y Liquidez.",
              },
              {
                en: "The page's own result cards, on Ingresos and Gastos.",
                es: "Las tarjetas de resultados de cada página, en Ingresos y Gastos.",
              },
              {
                en: "The detail, in the «Impacto en el plan» drawer.",
                es: "El detalle, en el panel «Impacto en el plan».",
              },
              {
                en: "The liquidity gap, inside Generación de liquidez.",
                es: "El déficit de liquidez, dentro de Generación de liquidez.",
              },
              {
                en: "The minimum return, inside each optimization's results.",
                es: "La rentabilidad mínima, dentro de los resultados de cada optimización.",
              },
            ],
          },
        ],
      },
      {
        kicker: {
          en: "The question",
          es: "La pregunta",
        },
        heading: {
          en: "What if you never left the page?",
          es: "¿Y si nunca salieras de la página?",
        },
        navLabel: { en: "The question", es: "La pregunta" },
        body: [
          {
            en: "The drawers weren't bad. People liked them, most of all pinned, with two views side by side. That was the hint.",
            es: "Los paneles no estaban mal. A la gente le gustaban, sobre todo fijados, con dos vistas una al lado de la otra. Esa fue la pista.",
          },
          {
            en: "So we asked: what if you never left the page, and nothing blurred?",
            es: "Así que nos preguntamos: ¿y si nunca salieras de la página y nada se emborronara?",
          },
        ],
        media: [
          {
            kind: "composition",
            title: {
              en: "The live product: the plan's drawer pinned over a blurred page",
              es: "El producto en vivo: el panel del plan fijado sobre una página desenfocada",
            },
            items: [
              {
                image: "/work/wealth-planner/d2-before.jpg",
                imageRatio: 0.625,
                x: 50,
                y: 50,
                w: 92,
                radius: 8,
              },
            ],
            marks: [
              { x: 80.4, y: 15.0, n: 1 },
              { x: 31.6, y: 45.4, n: 2 },
            ],
            legend: [
              {
                en: "The drawer, pinned: people liked keeping the plan in view.",
                es: "El panel, fijado: a la gente le gustaba tener el plan a la vista.",
              },
              {
                en: "The page, blurred: every check meant clicking out and back in.",
                es: "La página, desenfocada: cada comprobación obligaba a salir y volver a entrar.",
              },
            ],
          },
        ],
      },
      {
        kicker: {
          en: "Chapter 1 · Architecture",
          es: "Capítulo 1 · Arquitectura",
        },
        heading: {
          en: "One place for everything: menu, form, plan.",
          es: "Un solo sitio para todo: menú, formulario, plan.",
        },
        navLabel: { en: "Architecture", es: "Arquitectura" },
        body: [
          {
            en: "The 27 pieces the live product showed off the page each got one home, and the menu went from 13 pages to 7. Complexity can't be removed, only moved, so the product carries it, not the adviser.",
            es: "Cada una de las 27 piezas que el producto en vivo mostraba fuera de la página pasó a tener un solo sitio, y el menú bajó de 13 páginas a 7. La complejidad no se elimina, solo se traslada, así que la asume el producto y no el gestor.",
          },
        ],
        switch: [
          {
            label: { en: "Menu, form, plan", es: "Menú, formulario, plan" },
            heading: {
              en: "Left to right.",
              es: "De izquierda a derecha.",
            },
            body: [
              {
                en: "The menu says where you are, the form is the page you edit, and the plan answers it.",
                es: "El menú dice dónde estás, el formulario es la página que editas y el plan le responde.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The workstation pulled apart into menu, form and plan",
                  es: "La estación de trabajo separada en menú, formulario y plan",
                },
                items: [
                  {
                    src: "/work/wealth-planner/demo/wp-ingresos.html",
                    rect: { x: 0, y: 48, w: 64, h: 852 },
                    x: 9,
                    y: 52,
                    w: 4.2,
                  },
                  {
                    src: "/work/wealth-planner/demo/wp-ingresos-edit.html",
                    rect: { x: 72, y: 64, w: 682, h: 824 },
                    x: 37,
                    y: 52,
                    w: 41,
                    fade: "bottom",
                    radius: 10,
                  },
                  {
                    src: "/work/wealth-planner/demo/wp-ingresos-edit.html",
                    rect: { x: 766, y: 64, w: 662, h: 824 },
                    x: 79.5,
                    y: 52,
                    w: 39,
                    fade: "bottom",
                    radius: 18,
                  },
                ],
                marks: [
                  { x: 9, y: 8, n: 1 },
                  { x: 37, y: 8, n: 2 },
                  { x: 79.5, y: 8, n: 3 },
                ],
                legend: [
                  {
                    en: "Menu · where you are",
                    es: "Menú · dónde estás",
                  },
                  {
                    en: "Form · what you change",
                    es: "Formulario · lo que cambias",
                  },
                  {
                    en: "Plan · what it does",
                    es: "Plan · lo que hace",
                  },
                ],
              },
            ],
          },
          {
            label: { en: "Always in view", es: "Siempre a la vista" },
            heading: {
              en: "The plan stays in view, in three tabs.",
              es: "El plan queda a la vista, en tres pestañas.",
            },
            body: [
              {
                en: "In the live product the verdict was two pills, and the detail opened over the page. Now the plan sits beside the page and stays visible. As one long scroll it was too much to take in, so we split it into tabs: Patrimonio y legado, Liquidez and Rentabilidad.",
                es: "En el producto en vivo, el veredicto eran dos píldoras y el detalle se abría encima de la página. Ahora el plan está al lado de la página y siempre a la vista. En un solo desplazamiento era demasiado, así que lo dividimos en pestañas: Patrimonio y legado, Liquidez y Rentabilidad.",
              },
              {
                en: "Each page opens the tab it affects: Ingresos opens Liquidez. A switch to choose the tab came first. It was one more thing to manage, so it went.",
                es: "Cada página abre la pestaña a la que afecta: Ingresos abre Liquidez. Primero hubo un interruptor para elegir la pestaña. Era una cosa más que gestionar, así que lo quitamos.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The live product's two pills, and the plan's tabs in iteration 10",
                  es: "Las dos píldoras del producto en vivo y las pestañas del plan en la iteración 10",
                },
                items: [
                  {
                    image: "/work/wealth-planner/live-pills.png",
                    imageRatio: 0.1023,
                    x: 50,
                    y: 27,
                    w: 78,
                    label: {
                      en: "The live product",
                      es: "El producto en vivo",
                    },
                    radius: 8,
                  },
                  {
                    src: "/work/wealth-planner/demo/wp-ingresos.html",
                    rect: { x: 782, y: 163, w: 630, h: 90 },
                    x: 50,
                    y: 68,
                    w: 78,
                    label: { en: "Iteration 10", es: "Iteración 10" },
                    radius: 12,
                  },
                ],
              },
            ],
          },
          {
            label: { en: "Detail in place", es: "Detalle en su sitio" },
            heading: {
              en: "The detail never covers the page.",
              es: "El detalle nunca tapa la página.",
            },
            body: [
              {
                en: "The detail unfolds inside the plan, beside the page, instead of in a drawer over it. From 1680 px, page and plan split the screen in half: the double screen the team asked for.",
                es: "El detalle se despliega dentro del plan, al lado de la página, en lugar de en un panel superpuesto. A partir de 1.680 px, página y plan se reparten la pantalla a partes iguales: la pantalla doble que pidió el equipo.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The drawer over the page, and the detail beside it in iteration 1",
                  es: "El panel superpuesto a la página y, en la iteración 1, el detalle a su lado",
                },
                items: [
                  {
                    image: "/work/wealth-planner/d2-before.jpg",
                    imageRatio: 0.625,
                    x: 26,
                    y: 55,
                    w: 45,
                    label: {
                      en: "The live product",
                      es: "El producto en vivo",
                    },
                    radius: 8,
                  },
                  {
                    image: "/work/wealth-planner/d2-after.jpg",
                    imageRatio: 0.625,
                    x: 74,
                    y: 55,
                    w: 45,
                    label: { en: "Iteration 1", es: "Iteración 1" },
                    radius: 8,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        kicker: {
          en: "Chapter 2 · The UI",
          es: "Capítulo 2 · La interfaz",
        },
        heading: {
          en: "Calmer, and you edit where you read.",
          es: "Más tranquila: se edita donde se lee.",
        },
        navLabel: { en: "The UI", es: "La interfaz" },
        body: [
          {
            en: "The team liked the newer Afi apps design system, so we brought in its structure, tokens and micro-animations. Tables follow rows.gg: you edit a row where it sits. Stripe set the bar for calm density.",
            es: "Al equipo le gustaba Afi apps, el sistema de diseño más reciente, así que adoptamos su estructura, sus tokens y sus microanimaciones. Las tablas siguen el modelo de rows.gg: cada fila se edita donde está. Stripe fijó el listón de una densidad tranquila.",
          },
        ],
        switch: [
          {
            label: { en: "Tables in place", es: "Tablas en su sitio" },
            heading: {
              en: "Edit a row where it sits.",
              es: "Una fila se edita donde está.",
            },
            body: [
              {
                en: "No dialog to add or change an income: the row opens in the list, the plan beside it recalculates, and figures count up to their new value.",
                es: "Sin diálogo para añadir o cambiar un ingreso: la fila se abre en la lista, el plan contiguo se recalcula y las cifras suben hasta su nuevo valor.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "Ingresos as a list you edit in place",
                  es: "Ingresos como una lista que se edita en su sitio",
                },
                // Opens the first income in place, as the adviser would.
                play: "click",
                playClick: "Nómina Titular",
                items: [
                  {
                    src: "/work/wealth-planner/demo/wp-ingresos.html",
                    rect: { x: 72, y: 64, w: 682, h: 540 },
                    x: 50,
                    y: 52,
                    w: 80,
                    radius: 10,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        kicker: {
          en: "Jubilación",
          es: "Jubilación",
        },
        heading: {
          en: "Retirement needed an objective first.",
          es: "La jubilación necesitaba primero un objetivo.",
        },
        navLabel: { en: "Retirement", es: "Jubilación" },
        body: [
          {
            en: "Jubilación (retirement) had no pattern to follow and little information: a date in a dropdown and a few figures. Nobody had defined what the adviser came to do. In a team meeting we pinned it down: compare retirement ages and see how the pension changes.",
            es: "La página Jubilación no seguía ningún patrón y apenas tenía información: una fecha en un desplegable y unas cifras. Nadie había definido qué venía a hacer el gestor. En una reunión de equipo lo concretamos: comparar edades de jubilación y ver cómo cambia la pensión.",
          },
          {
            en: "So the age became a slider, with the date and type beside it. The ages to compare became stacked cards, each with its pension, instead of a table where the pension sat columns away from its age.",
            es: "Por eso la edad se convirtió en un control deslizante, con la fecha y el tipo al lado, y las edades que se comparan, en tarjetas apiladas con su pensión, en lugar de una tabla donde la pensión quedaba a varias columnas de su edad.",
          },
        ],
        switch: [
          {
            label: { en: "Before", es: "Antes" },
            heading: {
              en: "A date in a list, a table behind a link.",
              es: "Una fecha en una lista y una tabla tras un enlace.",
            },
            body: [
              {
                en: "In the live product you pick a date from a list. The other ages hide under «Ver otras opciones» (see other options), in a table where each pension sits four columns from its age.",
                es: "En el producto en vivo se elige una fecha de una lista. Las demás edades se esconden tras «Ver otras opciones», en una tabla donde cada pensión queda a cuatro columnas de su edad.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The live product's Jubilación page opening its table of other ages",
                  es: "La página Jubilación del producto en vivo abre su tabla de otras edades",
                },
                play: "click",
                playSetup: [
                  "Plan patrimonial",
                  "Jubilación/retiro",
                  "Siguiente",
                  "Siguiente",
                  "Omitir",
                ],
                // Open the table, then choose another age in it.
                playClick: ["Ver otras opciones", "Anticipada voluntaria"],
                items: [
                  {
                    src: "/work/wealth-planner/demo/wp361.html",
                    // Just the result card; the piece grows as its table opens.
                    rect: { x: 295, y: 292, w: 1040, h: 116 },
                    track: ".afi-summarypanel",
                    x: 50,
                    y: 50,
                    w: 90,
                    label: {
                      en: "The live product",
                      es: "El producto en vivo",
                    },
                    radius: 8,
                  },
                ],
              },
            ],
          },
          {
            label: { en: "After", es: "Después" },
            heading: {
              en: "Slide the age, see the pension.",
              es: "Mueve la edad y mira cómo cambia la pensión.",
            },
            body: [
              {
                en: "The age is a slider, with the date and the type of retirement as a tag beside it. Common ages are stacked cards: age, type and pension together. Press one and the figures below change.",
                es: "La edad es un control deslizante, con la fecha y el tipo de jubilación como etiqueta al lado. Las edades habituales son tarjetas apiladas: edad, tipo y pensión juntos. Al pulsar una, cambian las cifras de abajo.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The redesigned Jubilación in three pieces: the age with its slider, the age cards and the pension",
                  es: "Jubilación rediseñada: un control deslizante y tarjetas de edad",
                },
                play: "click",
                // Move the slider a few times, then press two of the age cards.
                playClick: [
                  "range:59",
                  "range:64",
                  "range:68",
                  "63 años",
                  "70 años",
                ],
                items: [
                  {
                    src: "/work/wealth-planner/demo/wp-jub-pieces.html",
                    rect: { x: 72, y: 338, w: 682, h: 118 },
                    x: 50,
                    y: 17.26,
                    w: 90,
                    label: { en: "Iteration 9", es: "Iteración 9" },
                    radius: 12,
                  },
                  {
                    src: "/work/wealth-planner/demo/wp-jub-pieces.html",
                    rect: { x: 72, y: 476, w: 682, h: 100 },
                    x: 50,
                    y: 46.67,
                    w: 90,
                    radius: 12,
                  },
                  {
                    src: "/work/wealth-planner/demo/wp-jub-pieces.html",
                    rect: { x: 72, y: 608, w: 682, h: 75 },
                    x: 50,
                    y: 71.55,
                    w: 90,
                    radius: 12,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        kicker: {
          en: "Chapter 3 · The AI, in front",
          es: "Capítulo 3 · La IA, delante",
        },
        heading: {
          en: "Say something happened, without the fireworks.",
          es: "Avisar de que algo ha pasado, sin fuegos artificiales.",
        },
        navLabel: { en: "The AI", es: "La IA" },
        body: [
          {
            en: "Afi is a traditional firm. Its advisers sit with clients deciding about their savings, so the AI had to feel capable, not like a toy: clear when something happened, never cheesy.",
            es: "Afi es una firma tradicional. Sus gestores se sientan con clientes que deciden sobre sus ahorros, así que la IA tenía que parecer capaz, no un juguete: clara cuando algo pasa y nunca hortera.",
          },
          {
            en: "A teammate's review ranked every moment from 1, quiet, to 4, loud. Editing a figure stays quiet; only «Aplicar al plan» (apply to the plan) is loud.",
            es: "La revisión de un compañero ordenó cada momento del 1, silencioso, al 4, llamativo. Editar una cifra sigue siendo silencioso; solo «Aplicar al plan» es llamativo.",
          },
        ],
        switch: [
          {
            label: { en: "The chat", es: "El chat" },
            heading: {
              en: "Ask anything, get a simulation.",
              es: "Pregunta lo que sea y recibe una simulación.",
            },
            body: [
              {
                en: "In the live product the AI was a button in the corner, and it felt like a canned assistant. Now «Preguntar» (ask) sits under the page: type anything, and the answer is a change you can apply to the plan.",
                es: "En el producto en vivo la IA era un botón en una esquina y parecía un asistente de respuestas enlatadas. Ahora «Preguntar» está debajo de la página: escribe lo que quieras y la respuesta es un cambio que puedes aplicar al plan.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The «Preguntar» bar",
                  es: "La barra «Preguntar»",
                },
                play: "case",
                aspect: 1.52,
                items: [
                  {
                    src: "/work/wealth-planner/demo/wp-dock-1.html",
                    rect: { x: 112, y: 240, w: 736, h: 158 },
                    x: 50,
                    y: 50,
                    w: 90,
                    viewport: { w: 960, h: 560 },
                    flat: true,
                  },
                ],
              },
            ],
          },
          {
            label: { en: "Editing", es: "Editar" },
            kicker: { en: "Level 1 · quiet", es: "Nivel 1 · silencioso" },
            heading: {
              en: "Editing is quiet.",
              es: "Editar es silencioso.",
            },
            body: [
              {
                en: "Figures dim while the plan recalculates, then count up. No light.",
                es: "Las cifras se atenúan mientras el plan recalcula y luego suben. Sin luz.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The plan panel recalculating quietly",
                  es: "El panel del plan recalculando en silencio",
                },
                items: [
                  {
                    src: "/work/wealth-planner/demo/wp-ingresos-edit.html",
                    rect: { x: 766, y: 64, w: 662, h: 824 },
                    x: 50,
                    y: 52,
                    w: 46,
                    fade: "bottom",
                    radius: 18,
                  },
                ],
              },
            ],
          },
          {
            label: { en: "Thinking", es: "Pensando" },
            kicker: { en: "Level 2", es: "Nivel 2" },
            heading: {
              en: "Only the thinking moves.",
              es: "Solo se mueve lo que piensa.",
            },
            body: [
              {
                en: "While the AI works, a spark moves beside «Pensando…» (thinking). It's the only motion that repeats, and it stops when the answer lands.",
                es: "Mientras la IA trabaja, una chispa se mueve junto a «Pensando…». Es el único movimiento que se repite, y se para cuando llega la respuesta.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The «Preguntar» bar",
                  es: "La barra «Preguntar»",
                },
                play: "case",
                aspect: 1.52,
                items: [
                  {
                    src: "/work/wealth-planner/demo/wp-dock-2.html",
                    rect: { x: 112, y: 120, w: 736, h: 397 },
                    x: 50,
                    y: 50,
                    w: 90,
                    viewport: { w: 960, h: 560 },
                    flat: true,
                  },
                ],
              },
            ],
          },
          {
            label: { en: "Icon in the tab", es: "Icono en la pestaña" },
            kicker: { en: "Level 3", es: "Nivel 3" },
            heading: {
              en: "The icon tells the story.",
              es: "El icono cuenta la historia.",
            },
            body: [
              {
                en: "Each part of the plan keeps its icon. When the AI works on it, the icon goes from rest to applied, each state born from the one before.",
                es: "Cada parte del plan tiene su icono. Cuando la IA trabaja en ella, el icono va de reposo a aplicado, y cada estado nace del anterior.",
              },
              {
                en: "Flat colour is Afi; the gradient, Afi blue with a touch of violet, is the AI. We tried indigo and violet first.",
                es: "El color plano es Afi; el degradado, azul Afi con un toque de violeta, es la IA. Antes probamos índigo y violeta.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "One plan tab, its icon going from rest to applied",
                  es: "Una pestaña del plan cuyo icono pasa de reposo a aplicado",
                },
                play: "lab",
                items: [
                  {
                    src: "/work/wealth-planner/demo/P314-hue-hint-iconflow.html",
                    rect: { x: 32, y: 216, w: 356, h: 75 },
                    x: 50,
                    y: 40,
                    w: 50,
                    flat: true,
                    viewport: { w: 960, h: 620 },
                  },
                  {
                    src: "/work/wealth-planner/demo/P314-hue-hint-iconflow.html",
                    rect: { x: 118, y: 327, w: 748, h: 38 },
                    x: 50,
                    y: 66,
                    w: 88,
                    flat: true,
                    viewport: { w: 960, h: 620 },
                  },
                ],
              },
            ],
          },
          {
            label: { en: "Toast on apply", es: "Aviso al aplicar" },
            kicker: { en: "Level 4 · loud", es: "Nivel 4 · llamativo" },
            heading: {
              en: "Applying says so, once.",
              es: "Al aplicar, un solo aviso.",
            },
            body: [
              {
                en: "One toast confirms it: the spinner becomes a check, and the text names the result, so nobody goes looking for it.",
                es: "Un aviso lo confirma: el indicador de carga se convierte en una marca de confirmación y el texto indica el resultado, así que nadie tiene que buscarlo.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The toast after applying a simulation",
                  es: "El aviso tras aplicar una simulación",
                },
                play: "lab",
                aspect: 1.7,
                items: [
                  {
                    src: "/work/wealth-planner/demo/P314-hue-hint-toast.html",
                    rect: { x: 161, y: 290, w: 639, h: 118 },
                    x: 50,
                    y: 50,
                    w: 100,
                    flat: true,
                    viewport: { w: 960, h: 620 },
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        kicker: {
          en: "Feedback",
          es: "Crítica",
        },
        heading: {
          en: "A teammate said it was too busy.",
          es: "Un compañero dijo que estaba demasiado cargado.",
        },
        navLabel: { en: "Feedback", es: "Crítica" },
        body: [
          {
            en: "Another designer reviewed it. The plan panel was busy, most of all on Patrimonio and Legado (assets and legacy), and nothing said where to look. We worked through it together and changed two things.",
            es: "Otro diseñador lo revisó. El panel del plan estaba recargado, sobre todo en Patrimonio y Legado, y nada indicaba dónde mirar. Lo trabajamos juntos y cambiamos dos cosas.",
          },
        ],
        switch: [
          {
            label: { en: "Tabs", es: "Pestañas" },
            kicker: { en: "Change 1", es: "Cambio 1" },
            heading: {
              en: "Tabs switch, cards choose.",
              es: "Las pestañas cambian de vista; las tarjetas eligen.",
            },
            body: [
              {
                en: "The plan tabs were cards with an icon, a sub-line and a chip, and they grew when a simulation landed. We tried thin cards and a segmented control, and kept a two-line one: name and figure, the same height in every state.",
                es: "Las pestañas del plan eran tarjetas con icono, subtítulo y etiqueta, y crecían al llegar una simulación. Probamos tarjetas finas y un control segmentado, y nos quedamos con uno de dos líneas: nombre y cifra, con la misma altura en todos los estados.",
              },
              {
                en: "The rule went to the design system: switching a view is a segmented control; choosing an option is a card.",
                es: "La regla pasó al sistema de diseño: cambiar de vista es un control segmentado; elegir una opción es una tarjeta.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The plan tabs as cards, then as a two-line segmented control",
                  es: "Las pestañas del plan como tarjetas y después como control segmentado de dos líneas",
                },
                aspect: 1.6,
                items: [
                  {
                    src: "/work/wealth-planner/demo/P314-cards-ref.html",
                    rect: { x: 782, y: 163, w: 630, h: 154 },
                    viewport: { w: 1440, h: 1000 },
                    x: 50,
                    y: 30,
                    w: 90,
                    label: {
                      en: "Before the review",
                      es: "Antes de la revisión",
                    },
                  },
                  {
                    src: "/work/wealth-planner/demo/wp-ingresos.html",
                    rect: { x: 782, y: 163, w: 630, h: 90 },
                    viewport: { w: 1440, h: 900 },
                    x: 50,
                    y: 72,
                    w: 90,
                    label: {
                      en: "After the review",
                      es: "Después de la revisión",
                    },
                    radius: 12,
                  },
                ],
              },
            ],
          },
          {
            label: { en: "Disclosures", es: "Desplegables" },
            kicker: { en: "Change 2", es: "Cambio 2" },
            heading: {
              en: "One chart open per tab.",
              es: "Un gráfico abierto por pestaña.",
            },
            body: [
              {
                en: "Every section had its chart open, so everything asked for attention at once. Now the verdict is the tab's title and its scenarios sit right under it.",
                es: "Cada sección tenía su gráfico abierto, así que todo pedía atención a la vez. Ahora el veredicto es el título de la pestaña y sus escenarios van justo debajo.",
              },
              {
                en: "One chart stays open; the rest wait behind «Ver escenarios» and «Ver desglose» (see the scenarios, see the breakdown). Titles are quieter and figures a step smaller.",
                es: "Un gráfico queda abierto; el resto espera tras «Ver escenarios» y «Ver desglose». Los títulos son más discretos y las cifras, un paso más pequeñas.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "The plan panel with every chart open, then with one",
                  es: "El panel del plan con todos los gráficos abiertos y después con uno",
                },
                aspect: 1.6,
                items: [
                  {
                    src: "/work/wealth-planner/demo/wp-before-pat.html",
                    rect: { x: 766, y: 64, w: 662, h: 706 },
                    viewport: { w: 1440, h: 1000 },
                    x: 26.5,
                    y: 50,
                    w: 48,
                    label: {
                      en: "Before the review",
                      es: "Antes de la revisión",
                    },
                    radius: 18,
                    fade: "bottom",
                  },
                  {
                    src: "/work/wealth-planner/demo/P314-dens-quiet.html",
                    rect: { x: 60, y: 54, w: 600, h: 640 },
                    viewport: { w: 720, h: 1900 },
                    x: 75.5,
                    y: 46.2,
                    w: 43.5,
                    label: {
                      en: "After the review",
                      es: "Después de la revisión",
                    },
                    radius: 18,
                    fade: "bottom",
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        kicker: {
          en: "Result",
          es: "Resultado",
        },
        heading: {
          en: "Ten prototypes in three days.",
          es: "Diez prototipos en tres días.",
        },
        navLabel: { en: "Result", es: "Resultado" },
        body: [
          {
            en: "Each idea was tested by using it, so the wrong ones were cheap to drop: a switch, a menu, five places for a sparkle, pulses on every keystroke.",
            es: "Probamos cada idea usándola, así que descartar las equivocadas costó poco: un interruptor, un menú, cinco sitios para un destello y pulsos con cada tecla.",
          },
          {
            en: "The rules that repeat went back to the Afi apps design system as proposals. The workstation is the base for 4.0.",
            es: "Las reglas que se repiten pasaron al sistema de diseño Afi apps como propuestas. La estación de trabajo es la base de la 4.0.",
          },
        ],
        media: [
          {
            kind: "stats",
            items: [
              {
                value: "27",
                label: {
                  en: "pieces given one home",
                  es: "piezas con un solo sitio",
                },
              },
              {
                value: "13 → 7",
                label: { en: "menu pages", es: "páginas en el menú" },
              },
              {
                value: "10",
                label: {
                  en: "prototypes in 3 days",
                  es: "prototipos en 3 días",
                },
              },
              {
                value: "9",
                label: {
                  en: "rules proposed to the design system",
                  es: "reglas propuestas al sistema de diseño",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  "audemic-business-growth": {
    tagline: {
      en: "A loyal B2C base, and nowhere to grow",
      es: "Una base B2C fiel y ningún sitio donde crecer",
    },
    intro: {
      en: "Heading into the next funding round, investors wanted to know how Scholar would scale. The problem was the customer lifecycle. Its loyal users were undergraduate and graduate students, so every user it won came with a leaving date. Growth had to come from someone else who reads research for a living, and who'd pay for it.",
      es: "De cara a la siguiente ronda de financiación, los inversores querían saber cómo iba a escalar Scholar. El problema era el ciclo de vida del cliente. Sus usuarios fieles eran estudiantes de grado y posgrado, así que cada usuario que ganaba llegaba con fecha de salida. El crecimiento tenía que venir de otra gente que lee investigación como parte de su trabajo y que estuviera dispuesta a pagar por ello.",
    },
    role: {
      en: "Senior Product Designer & Product Manager",
      es: "Diseñador de producto sénior y Product Manager",
    },
    contributions: {
      en: [
        "Product design",
        "Product strategy",
        "Discovery research",
        "Journey mapping",
        "Growth experiments",
        "Roadmap prioritization",
      ],
      es: [
        "Diseño de producto",
        "Estrategia de producto",
        "Investigación exploratoria",
        "Mapa de experiencia",
        "Experimentos de crecimiento",
        "Priorización de la hoja de ruta",
      ],
    },
    bento: [
      {
        label: { en: "Context", es: "Contexto" },
        sublabel: {
          en: "$8,000 a month since 2022, and a user base with an expiry date.",
          es: "8.000 $ al mes desde 2022 y una base de usuarios con fecha de caducidad.",
        },
        // No media, so the first image in the study is the product itself: the
        // paper view on the next card.
        span: "wide",
        details: {
          heading: {
            en: "A ceiling, not a product problem",
            es: "Un techo, no un problema de producto",
          },
          sections: [
            {
              body: {
                en: "Audemic Scholar is a web app that lets university students listen to full-text research papers and reports. Since 2022 it had built a loyal B2C user base and was making $8,000 a month.",
                es: "Audemic Scholar es una aplicación web que permite a los estudiantes universitarios escuchar artículos de investigación e informes completos. Desde 2022 había consolidado una base de usuarios B2C fiel y facturaba 8.000 $ al mes.",
              },
            },
            {
              body: {
                en: "Investors doubted it could scale, because undergraduate and graduate students only stay users until they graduate.",
                es: "Los inversores dudaban de que pudiera escalar, porque los estudiantes de grado y posgrado solo son usuarios hasta que se gradúan.",
              },
            },
          ],
        },
      },
      /**
       * Challenge and solution in one card, above the process, 2026-08-26.
       *
       * The Challenge card carried the `audience-pivot` animation and no photo,
       * and the Solution card sat at the far end of the study behind four
       * process cards. Putting them together at the top means the study opens on
       * what it was for and what came out, and the four numbered cards read as
       * the route between the two rather than as a list you get through first.
       *
       * The paper-view shot replaces the drawing: it is the desktop and the
       * phone in one frame, which is the product, where `audience-pivot` was a
       * diagram of a decision.
       */
      {
        label: { en: "Challenge and solution", es: "Reto y solución" },
        sublabel: {
          en: "A user need, a business need, one product vision. What shipped was a paper view with summaries on the full text and feedback that doesn't interrupt.",
          es: "Una necesidad de usuario, una de negocio y una visión de producto. Lo que salió fue una vista de paper con resúmenes sobre el texto completo y feedback que no interrumpe.",
        },
        image: "/work/audemic-business-growth/solution-paper-view.webp",
        span: "wide",
        details: {
          heading: {
            en: "Three statements, then three changes",
            es: "Tres afirmaciones, después tres cambios",
          },
          sections: [
            {
              body: {
                en: "The user need was tools that cut the workload of finding and organizing information. The business need was a new market, found from what we already knew about our users, and a clear ideal customer profile. Early hypotheses pointed at the social sciences, because 60% of Scholar users came from that field.",
                es: "La necesidad de usuario eran herramientas que redujeran el trabajo de encontrar y organizar información. La de negocio era un mercado nuevo, a partir de lo que ya sabíamos de nuestros usuarios, y un perfil de cliente ideal claro. Las primeras hipótesis apuntaban a las ciencias sociales, porque el 60 % de los usuarios de Scholar venía de ese campo.",
              },
            },
            {
              body: {
                en: "Both roll up into one product vision. Give professionals in fast-paced industries quicker access to critical information, so they spend their time on the work that has impact.",
                es: "Ambas se resumen en una visión de producto. Dar a los profesionales de sectores de ritmo rápido un acceso más ágil a la información crítica, para que dediquen su tiempo al trabajo que tiene impacto.",
              },
            },
            {
              body: {
                en: "Three changes came out of it. First, AI summaries, iterated across OpenAI and Claude models with survey and interview feedback between rounds. Second, a redesigned paper view that puts the summary on top of the full text, so a researcher can understand new work without reading all of it. Third, in-app feedback that collects insight quietly instead of stopping someone mid-task to ask.",
                es: "De ahí salieron tres cambios. Primero, resúmenes con IA, iterados sobre modelos de OpenAI y Claude, con feedback de encuestas y entrevistas entre rondas. Segundo, una vista de paper rediseñada que pone el resumen encima del texto completo, para que un investigador entienda un trabajo nuevo sin leerlo entero. Tercero, feedback dentro de la app que recoge información sin hacer ruido, en vez de parar a alguien a media tarea para preguntarle.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "01 — Discovery interviews",
          es: "01 — Entrevistas de descubrimiento",
        },
        sublabel: {
          en: "20 hours a month per researcher, before any analysis starts.",
          es: "20 horas al mes por investigador, antes de empezar cualquier análisis.",
        },
        image:
          "/work/audemic-business-growth/process-01-interview-patterns.webp",
        details: {
          heading: {
            en: "Costing an NIH-sized organization $10M a month",
            es: "Le cuesta 10 M$ al mes a una organización del tamaño del NIH",
          },
          sections: [
            {
              body: {
                en: "We interviewed UN analysts and vaccine researchers. Each of them loses about 20 hours a month just searching for information. At the scale of an organization like NIH, that's close to $10 million a month in lost productivity.",
                es: "Entrevistamos a analistas de la ONU y a investigadores de vacunas. Cada uno pierde unas 20 horas al mes solo buscando información. En una organización del tamaño del NIH, eso son cerca de 10 millones de dólares al mes en productividad perdida.",
              },
            },
            {
              body: {
                en: "We sorted every interview into four columns covering the job as it stands, the pains, the current workarounds, and the motivation underneath. The pattern only shows up when you read one column straight down.",
                es: "Repartimos cada entrevista en cuatro columnas, con el trabajo tal y como es, los problemas, las soluciones que usan hoy y la motivación de fondo. El patrón solo aparece cuando lees una columna de arriba abajo.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "02 — Co-creation & testing",
          es: "02 — Cocreación y testing",
        },
        sublabel: {
          en: "Mapped how researchers work today, then launched a beta against it.",
          es: "Mapeamos cómo trabajan hoy los investigadores y lanzamos una beta a partir de ahí.",
        },
        image: "/work/audemic-business-growth/process-02-journey-map.webp",
        details: {
          heading: {
            en: "20 quality leads in one week",
            es: "20 leads de calidad en una semana",
          },
          sections: [
            {
              body: {
                en: "Once we'd mapped how researchers work today, we launched a beta of a 24/7 junior analyst that keeps them up to date. Paid ads brought in 20 quality leads in the first week.",
                es: "Con el recorrido actual mapeado, lanzamos una beta de un analista junior 24/7 que mantiene a los investigadores al día. La publicidad de pago trajo 20 leads de calidad en la primera semana.",
              },
            },
            {
              body: {
                en: "The first stage of the journey is where the time goes. Researchers scan dozens of reports from more than 70 analysts, read outside publications alongside their own research, and skim summaries to decide what's worth reading. That work is spread across company databases, analyst reports, subscriptions like WSJ and Foreign Policy, and Ground News for bias checks.",
                es: "La primera etapa del recorrido es donde se va el tiempo. Los investigadores revisan decenas de informes de más de 70 analistas, leen publicaciones externas junto a su propia investigación y repasan resúmenes para decidir qué merece la pena leer. Todo eso ocurre entre bases de datos internas, informes de analistas, suscripciones como WSJ y Foreign Policy, y Ground News para contrastar sesgos.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "03 — Beta-user iterations",
          es: "03 — Iteraciones con usuarios beta",
        },
        sublabel: {
          en: "Summaries lacked the context that made them worth reading.",
          es: "A los resúmenes les faltaba el contexto que justificaba leerlos.",
        },
        image: "/work/audemic-business-growth/process-03-user-interview.webp",
        details: {
          heading: {
            en: "The gist, and nothing past it",
            es: "La idea general y nada más",
          },
          sections: [
            {
              body: {
                en: "Beta users told us the summaries left out critical context, like the societal impact of a study and its effects on the groups studied. Without it, they got the gist and couldn't go any deeper.",
                es: "Los usuarios beta nos dijeron que los resúmenes dejaban fuera contexto crítico, como el impacto social de un estudio y sus efectos sobre los grupos estudiados. Sin eso, captaban la idea general y no podían ir más allá.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "04 — Launch & roadmap",
          es: "04 — Lanzamiento y hoja de ruta",
        },
        sublabel: {
          en: "Reach × Impact × Confidence ÷ Effort, scored on the wall.",
          es: "Alcance × Impacto × Confianza ÷ Esfuerzo, puntuado en la pared.",
        },
        image: "/work/audemic-business-growth/process-04-prioritization.webp",
        details: {
          heading: {
            en: "A number you can disagree with",
            es: "Un número con el que se puede discrepar",
          },
          sections: [
            {
              body: {
                en: "We ranked the beta users' pain points against the roadmap to get the product ready for B2B clients. Each one got a score of Reach × Impact × Confidence ÷ Effort.",
                es: "Ordenamos los problemas de los usuarios beta frente a la hoja de ruta para preparar el producto para clientes B2B. Cada uno recibió una puntuación de Alcance × Impacto × Confianza ÷ Esfuerzo.",
              },
            },
            {
              body: {
                en: "Marking papers as read scored 11,160, renaming boards and files 7,440, drag-and-drop upload 5,115, and the note-taking MVP 4,133. Writing the arithmetic on the sticky note is the point. Discussing whether renaming matters more than uploading goes nowhere. Discussing whether renaming really reaches all 620 students goes somewhere.",
                es: "Marcar como leído en la pestaña de papers puntuó 11.160, renombrar tableros y archivos 7.440, la subida por arrastre 5.115 y el MVP de notas 4.133. Escribir la aritmética en el post-it es justo el objetivo. Hablar de si renombrar importa más que subir archivos no lleva a ninguna parte. Hablar de si renombrar llega de verdad a los 620 estudiantes, sí.",
              },
            },
          ],
        },
      },
    ],
  },
  "audemic-onboarding": {
    tagline: {
      en: "Show the value before making the ask",
      es: "Enseñar el valor antes de pedir nada",
    },
    intro: {
      en: "Audemic Insights is a mobile app that works like a 24/7 junior analyst for the intellectually curious. It finds and extracts key insights from research papers and reports, and turns them into audio summaries personalized to your goals. Retention was the problem. Users came for a seamless AI experience, met a form, and left before the app had shown them anything.",
      es: "Audemic Insights es una app móvil que funciona como un analista junior 24/7 para gente intelectualmente curiosa. Encuentra y extrae las ideas clave de artículos de investigación e informes, y las convierte en resúmenes de audio personalizados según tus objetivos. El problema era la retención. Los usuarios venían por una experiencia de IA fluida, se encontraban un formulario y se iban antes de que la app les hubiera enseñado nada.",
    },
    role: {
      en: "Senior Product Designer & Product Manager",
      es: "Diseñador de producto sénior y Product Manager",
    },
    contributions: {
      en: [
        "Product design",
        "User interviews",
        "Funnel analysis",
        "Prototyping",
        "Usability testing",
      ],
      es: [
        "Diseño de producto",
        "Entrevistas con usuarios",
        "Análisis del embudo",
        "Prototipado",
        "Pruebas de usabilidad",
      ],
    },
    bento: [
      /**
       * Problem and solution in one card, 2026-08-26.
       *
       * They were two full-width cards at opposite ends of the study with three
       * process cards between them, so the thing that was broken and the thing
       * that fixed it never appeared in the same eyeful. The `user-feedback`
       * animation came off with the merge: the two onboarding screens ARE the
       * answer, and a drawing of feedback arriving is a weaker opener than the
       * screens that came out of it.
       */
      {
        label: { en: "Problem and solution", es: "Problema y solución" },
        sublabel: {
          en: "Unmet expectations, frustrating onboarding, imprecise results. The fix was asking for less without giving up the personalization.",
          es: "Expectativas incumplidas, onboarding frustrante y resultados imprecisos. La solución fue pedir menos sin renunciar a la personalización.",
        },
        images: [
          "/work/audemic-onboarding/solution-subtopics.webp",
          "/work/audemic-onboarding/solution-recommendation.webp",
        ],
        span: "wide",
        details: {
          heading: {
            en: "Three ways to lose the same user",
            es: "Tres formas de perder al mismo usuario",
          },
          sections: [
            {
              body: {
                en: "Users expected a seamless AI experience and met manual tasks instead. Search results lacked precision. And an excessive number of onboarding steps produced friction that led straight to drop-off.",
                es: "Los usuarios esperaban una experiencia fluida con IA y se encontraban tareas manuales. Los resultados de búsqueda no eran precisos. Y un número excesivo de pasos en el onboarding generaba una fricción que llevaba directa al abandono.",
              },
            },
            {
              body: {
                en: "Linked the first search to topics worth engaging with, and added metadata that makes a result actionable rather than just present.",
                es: "Ligamos la primera búsqueda a temas que engancharan y añadimos metadatos que permiten actuar sobre un resultado en vez de solo mostrarlo.",
              },
            },
            {
              body: {
                en: "Onboarding leads with search, so someone explores a relevant topic before being asked for anything, and five personalized summaries show what the platform is for. Value first, then the ask.",
                es: "El onboarding entra por la búsqueda, para que alguien explore un tema relevante antes de que se le pida nada, y cinco resúmenes personalizados enseñan para qué sirve la plataforma. Primero el valor, después la petición.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "01 — User interviews",
          es: "01 — Entrevistas con usuarios",
        },
        sublabel: {
          en: "An Oxford AI professor, a White House Correspondent, and a vaccine researcher.",
          es: "Un catedrático de IA de Oxford, un corresponsal de la Casa Blanca y un investigador de vacunas.",
        },
        image: "/work/audemic-onboarding/process-01-user-testing.webp",
        details: {
          heading: {
            en: "Showcase value before making an ask",
            es: "Enseñar el valor antes de pedir nada",
          },
          sections: [
            {
              body: {
                en: "An Oxford AI professor, a White House Correspondent, and a vaccine researcher highlighted the importance of showcasing value before making an ask from the user, and revealed that Google Scholar lacked 'real world' search scenarios like learning methodologies.",
                es: "Un catedrático de IA de Oxford, un corresponsal de la Casa Blanca y un investigador de vacunas señalaron la importancia de enseñar el valor antes de pedirle algo al usuario, y revelaron que Google Scholar no cubría escenarios de búsqueda «del mundo real», como aprender una metodología.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "02 — Mixpanel analysis",
          es: "02 — Análisis en Mixpanel",
        },
        sublabel: {
          en: "Sub-topic selection reached 18.29% of sign-ups. 38.49% skipped onboarding outright.",
          es: "La selección de subtemas llegaba al 18,29 % de los registros. El 38,49 % se saltaba el onboarding directamente.",
        },
        image: "/work/audemic-onboarding/process-02-mixpanel.webp",
        details: {
          heading: {
            en: "The drop-off had a location",
            es: "El abandono tenía un sitio concreto",
          },
          sections: [
            {
              body: {
                en: "Mix panel analysis revealed significant drop-offs during sub-topic searches, pointing to gaps in relevance and user alignment.",
                es: "El análisis en Mixpanel reveló abandonos significativos durante las búsquedas de subtemas, lo que apuntaba a carencias de relevancia y de alineación con el usuario.",
              },
            },
            {
              body: {
                en: "Sign-up at 100%, the first interest question at 37.8%, continue-onboarding at 36.59%, sub-topic selection at 18.29%. Meanwhile 38.49% skipped onboarding entirely. More people skipping the flow than finishing it isn't a copy problem.",
                es: "Registro al 100 %, la primera pregunta de intereses al 37,8 %, continuar el onboarding al 36,59 % y la selección de subtemas al 18,29 %. Mientras tanto, el 38,49 % se saltaba el onboarding por completo. Que más gente se salte el flujo de la que lo termina no es un problema de textos.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "03 — Prototyping & testing",
          es: "03 — Prototipado y testing",
        },
        sublabel: {
          en: "Three hypotheses, then cycles of testing and refinement.",
          es: "Tres hipótesis y luego ciclos de prueba y refinamiento.",
        },
        image: "/work/audemic-onboarding/process-03-testing-screens.webp",
        // Its own row, matching the card above it. User interviews and
        // Mixpanel pair off into one row; left at a single column this one sat
        // alone beside a hole.
        span: "wide",
        details: {
          heading: {
            en: "Written as hypotheses so they could fail",
            es: "Formuladas como hipótesis para que pudieran fallar",
          },
          sections: [
            {
              body: {
                en: "We hypothesized that advanced filters, prioritizing search, and enriching metadata in summaries would better meet user needs. To validate, we used an iterative approach with cycles of testing and refinement.",
                es: "Planteamos como hipótesis que unos filtros avanzados, priorizar la búsqueda y enriquecer los metadatos de los resúmenes responderían mejor a las necesidades del usuario. Para validarlo usamos un enfoque iterativo con ciclos de prueba y refinamiento.",
              },
            },
          ],
        },
      },
    ],
  },
  mindfulme: {
    gallery: true,
    tagline: {
      en: "An AI-powered meditation app personal to each user's journey",
      es: "Una app de meditación con IA que se adapta al camino de cada persona",
    },
    intro: {
      en: "Chinwuba had built a site where users could generate affirmations from their goals, delivered as audio guides with tips. Users liked it but wanted to edit, save, and build their own library. Most mindfulness apps offer generic categories and generic meditations, none of it shaped to the person using it. Mindfulme uses AI to craft meditations and affirmations that evolve with each user, so the next session knows what the last one taught.",
      es: "Chinwuba había construido una web donde los usuarios generaban afirmaciones a partir de sus objetivos, en forma de guías de audio con consejos. Les gustaba, pero querían editar, guardar y construir su propia biblioteca. La mayoría de apps de mindfulness ofrecen categorías genéricas y meditaciones genéricas, nada hecho a la medida de quien las usa. Mindfulme usa IA para crear meditaciones y afirmaciones que evolucionan con cada usuario, de modo que cada sesión sabe lo que enseñó la anterior.",
    },
    role: {
      en: "Freelance Designer & Product Lead",
      es: "Diseñador freelance y responsable de producto",
    },
    contributions: {
      en: ["Product design", "Brand identity", "User research", "MVP delivery"],
      es: [
        "Diseño de producto",
        "Identidad de marca",
        "Investigación con usuarios",
        "Entrega del MVP",
      ],
    },
    bento: [
      {
        label: {
          en: "A mindfulness app that meets you where you are",
          es: "Una app de mindfulness que te encuentra donde estás",
        },
        sublabel: {
          en: "Built around personal journeys, not generic categories: AI personalizes meditation and affirmations for each user",
          es: "Construida sobre caminos personales, no sobre categorías genéricas: la IA personaliza meditaciones y afirmaciones para cada persona",
        },
        image: "/mindfulme/screens/poster.jpg",
        span: "wide",
      },
      {
        label: { en: "Five focus areas", es: "Cinco áreas de enfoque" },
        sublabel: {
          en: "Mental Health, Physical Health, Finance, Career: each with its own visual language",
          es: "Salud mental, salud física, finanzas, carrera profesional: cada una con su propio lenguaje visual",
        },
        images: [
          "/mindfulme/mental-health.svg",
          "/mindfulme/physical-health.svg",
          "/mindfulme/finance.svg",
          "/mindfulme/career.svg",
        ],
      },
      {
        label: { en: "Brand language", es: "Lenguaje de marca" },
        sublabel: {
          en: "Hand-drawn over sterile iconography: organic shapes, peaceful palette, genuine typography",
          es: "Trazo a mano frente a la iconografía estéril: formas orgánicas, paleta serena, tipografía con carácter",
        },
        images: [
          "/mindfulme/challenges.svg",
          "/mindfulme/focus.svg",
          "/mindfulme/notifications.svg",
          "/mindfulme/figuring-it-out.svg",
        ],
      },
      {
        label: { en: "The core experience", es: "La experiencia central" },
        sublabel: {
          en: "Home, favorites, and personalized affirmations: every screen tuned to the user's selected focuses",
          es: "Inicio, favoritos y afirmaciones personalizadas: cada pantalla ajustada a las áreas que la persona ha elegido",
        },
        image: "/mindfulme/screens/home-favorites-affirmation.png",
        span: "wide",
      },
      {
        label: {
          en: "Reminders, on their terms",
          es: "Recordatorios, en sus términos",
        },
        sublabel: {
          en: "Customizable instead of standardized: users decide when the practice fits their day",
          es: "Personalizables, no estandarizados: la persona decide cuándo encaja la práctica en su día",
        },
        image: "/mindfulme/screens/reminders-goals-adjustment.png",
      },
      {
        label: { en: "Beyond the screen", es: "Más allá de la pantalla" },
        sublabel: {
          en: "The visual language carries to merch and print: the brand has to live in three dimensions",
          es: "El lenguaje visual se traslada al merchandising y al papel: la marca tiene que vivir en tres dimensiones",
        },
        image: "/mindfulme/screens/tote-bag-mockup.jpg",
      },
      {
        label: { en: "Color as meaning", es: "El color como significado" },
        sublabel: {
          en: "Brand colors became functional indicators: orange is always the CTA, each category has its own hue",
          es: "Los colores de marca se convirtieron en indicadores funcionales: el naranja es siempre el CTA y cada categoría tiene su tono",
        },
        image: "/mindfulme/screens/visual-consistency.png",
        span: "wide",
      },
      {
        label: { en: "Technology that nurtures", es: "Tecnología que nutre" },
        sublabel: {
          en: "Mindfulme isn't another meditation tool. It's an AI companion for self-awareness, evolving with each user",
          es: "Mindfulme no es una herramienta de meditación más, sino una compañera de IA para el autoconocimiento que evoluciona con cada persona",
        },
        image: "/mindfulme/screens/conclusion.jpg",
        span: "wide",
      },
    ],
  },
};
