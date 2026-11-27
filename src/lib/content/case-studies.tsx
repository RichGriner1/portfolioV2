import type { ReactNode } from "react";

import { IntroPreviewLink } from "@/components/intro-preview-link";
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
      en: "Building design infrastructure for a fintech consultancy",
      es: "Construyendo la infraestructura de diseño para una consultora fintech",
    },
    intro: {
      en: "Afi is a financial consultancy that added a digital team during the dot-com boom and grew it as an engineering team. It hired 40 programmers for math and CS, had no dedicated designers until 2021, and had no design system. Afi runs three brands. This is the system for Afi web, the internal and client-facing sites that carry the Afi brand. It's what someone reaches for to mock up a concept before committing time to real UI and internal solutions.",
      es: "Afi es una consultora financiera que montó su equipo digital durante la burbuja de las .com y lo hizo crecer como equipo de ingeniería. Contrató a 40 programadores por su perfil de matemáticas e informática, no tuvo diseñadores dedicados hasta 2021 y no tenía sistema de diseño. Afi tiene tres marcas. Este es el sistema de Afi web, los sitios internos y de cliente que llevan la marca Afi. Es a lo que se recurre para maquetar un concepto antes de dedicar tiempo a la UI real y a las soluciones internas.",
    },
    role: {
      en: "Design Systems Lead",
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
    bento: [
      {
        label: {
          en: "Component Playground",
          es: "Playground de componentes",
        },
        sublabel: {
          en: "One page per component: every state, the tokens it uses and a brand picker. Nobody rebuilds the same thing in Figma to check how it behaves, and the token names on the page become the language the team uses for it.",
          es: "Una página por componente: todos sus estados, los tokens que usa y un selector de marca. Nadie vuelve a montar lo mismo en Figma para ver cómo se comporta, y los nombres de los tokens de esa página pasan a ser el lenguaje con el que el equipo habla de él.",
        },
        /**
         * The segmented control, not the button: it carries a `Marca` picker, an
         * appearance and size row and an options count, so one card demonstrates
         * both halves of the system — a component in isolation, and the same
         * component re-skinned by a brand swap.
         *
         * `?embed=1` strips the docs chrome — breadcrumb, title, description,
         * use-cases, accessibility, dos-and-donts — leaving the controls row, the
         * live preview and the `Tokens consumidos` table. Without it the first
         * screenful of a 640px card is a docs header, so the brand picker and the
         * token table both sit below a fold a cross-origin frame cannot be scrolled
         * past from here. See EmbedService in the Coherence repo.
         *
         * Both the route and the param are live as of 2026-08-26 — verified
         * against the deployment: without `?embed=1` the frame opens on
         * "Components/Segmented Control" and its description, with it the first
         * thing in the frame is the Marca picker. The note that used to sit here
         * saying the build was behind main is no longer true; it has caught up.
         */
        iframe:
          "https://coherence-wealth-manager.vercel.app/componentes/segmented-control?embed=1",
        span: "full",
        details: {
          heading: {
            en: "Components on their own",
            es: "Componentes por separado",
          },
          sections: [
            {
              body: {
                en: "Programmers have different permissions to Figma, so handoffs were inconsistent because they saw different things. They also wouldn't use the components in Figma, just the flows, but then would ask me component-specific questions. It was because we didn't have time to properly document the Figma for them.",
                es: "Los programadores tienen permisos distintos en Figma, así que las entregas eran inconsistentes porque cada uno veía cosas distintas. Tampoco usaban los componentes de Figma, solo los flujos, pero luego me hacían preguntas específicas de componentes. Era porque no habíamos tenido tiempo de documentarles bien el Figma.",
              },
            },
            {
              body: {
                en: "Now I made the component playground to look at states, interactions, tokens in an isolated place.",
                es: "Ahora he montado el playground de componentes para ver estados, interacciones y tokens en un sitio aislado.",
              },
            },
          ],
        },
      },
      /**
       * Token architecture and white-label were two cards until 2026-08-25. They
       * read as one: the tokens are tiered the way they are so that a brand swap
       * happens in a single layer, and the white-label card's argument depends on
       * the architecture the other card described. Merged, the four beats run in
       * order — how the Figmas used to be made, what we built instead, what that
       * buys, and where it still falls short. The `palette` animation comes from
       * the white-label half; `layers`, the token half's, is now unused here.
       */
      {
        label: {
          en: "Token Architecture & White-label",
          es: "Arquitectura de tokens y white-label",
        },
        sublabel: {
          en: "Changing a client's brand meant editing colors across twenty files by hand. The values sit in three tiers now, primitive, semantic and component, so a new brand is a token swap and the components never change.",
          es: "Cambiar la marca de un cliente significaba editar los colores en veinte archivos a mano. Ahora los valores están en tres niveles, primitivo, semántico y componente, así que una marca nueva es un cambio de tokens y los componentes no se tocan.",
        },
        details: {
          heading: {
            en: "Own the tokens, don't skin someone else's",
            es: "Tokens propios, no el skin de otro",
          },
          sections: [
            {
              body: {
                en: "Figmas were made one at a time. Designers were always being rushed, so there was never time to define anything or build components, and the workflow that came out of it was inefficient for everyone.",
                es: "Los Figmas se hacían de uno en uno. A los diseñadores siempre se les metía prisa, así que nunca hubo tiempo de definir nada ni de construir componentes, y el flujo de trabajo que salió de ahí era ineficiente para todos.",
              },
            },
            {
              body: {
                en: (
                  <>
                    We started on PrimeNG but with the white-label objective it
                    became too many layers to build without a headache. So we
                    built a{" "}
                    <IntroPreviewLink slug="color-methodology" newTab>
                      color token strategy
                    </IntroPreviewLink>
                    .
                  </>
                ),
                es: (
                  <>
                    Empezamos con PrimeNG, pero con el objetivo white-label eran
                    demasiadas capas para construirlo sin dolores de cabeza. Así
                    que construimos una{" "}
                    <IntroPreviewLink slug="color-methodology" newTab>
                      estrategia de tokens de color
                    </IntroPreviewLink>
                    .
                  </>
                ),
              },
            },
            {
              body: {
                en: "Swapping tokens is good for quick changes when a concept has to go out to a client, but the patterns and the visual essence get lost.",
                es: "Cambiar tokens sirve para cambios rápidos cuando un concepto tiene que salir a cliente, pero los patrones y la esencia visual se pierden.",
              },
            },
            {
              body: {
                en: "We're working with some of our clients now on a more cohesive white-labeling in code.",
                es: "Ahora trabajamos con algunos clientes en un white-label más coherente en código.",
              },
            },
          ],
        },
        animation: "palette",
      },
      {
        label: {
          en: "Documentation & Downloadable Brand Assets",
          es: "Documentación y recursos de marca descargables",
        },
        sublabel: {
          en: "Documented, with the brand assets and token sets downloadable. Five teams and one designer means the answer has to sit somewhere they can reach without me.",
          es: "Documentado, con los recursos de marca y los sets de tokens descargables. Cinco equipos y un diseñador obligan a que la respuesta esté en algún sitio al que lleguen sin mí.",
        },
        // `nodes` — the one-repo-everyone-reads-from animation, which came free when
        // the Unified Design Platform card was cut. It's the better fit: this card is
        // about one shared source reaching every team, which is what that figure draws.
        // `asset-portal` was a download tray, and drew the mechanism rather than the point.
        animation: "nodes",
        // The one row of two on this page: the two drawn figures sit together,
        // and the three cards carrying real footage — the live playground above,
        // the two recordings below — each take a full row so the app inside them
        // is big enough to follow. Nothing is `wide`: two wide cards stack
        // instead of sitting next to each other.
        details: {
          heading: {
            en: "One designer, forty programmers, five teams",
            es: "Un diseñador, cuarenta programadores, cinco equipos",
          },
          // Richard's own beats, verbatim. No section labels: this is how he writes
          // it, and the four-heading frame is what invited invented filler. His
          // 2026-08-06 rewrite of the closing paragraph absorbed the old standalone
          // "Documented everything..." beat word for word, so that beat went — its
          // sentence now lives inside the closer.
          sections: [
            {
              body: {
                en: "A designer makes a million decisions across a project, big and small. As the only full-time designer, my attention splits across forty programmers, so insights land with one team and never reach the others, and in a preference-first culture that means defending the same call repeatedly.",
                es: "Un diseñador toma un millón de decisiones a lo largo de un proyecto, grandes y pequeñas. Como único diseñador a tiempo completo, mi atención se reparte entre cuarenta programadores, así que un hallazgo se queda en un equipo y no llega al resto, y en una cultura donde manda la preferencia eso significa defender la misma decisión una y otra vez.",
              },
            },
            {
              body: {
                en: "A shared design language only exists if everyone has the same access to it. So, I documented everything and made assets like token sets and skills downloadable.",
                es: "Un lenguaje de diseño compartido solo existe si todo el mundo tiene el mismo acceso a él. Así que lo documenté todo e hice descargables recursos como los sets de tokens y las skills.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "Designer Feedback Tool",
          es: "Herramienta de feedback de diseño",
        },
        sublabel: {
          en: "Feedback arrived in chat threads and I couldn't tell which screen or component it was about. Now anyone can click the element and comment on it, and I export those comments as a file to work from.",
          es: "El feedback llegaba en hilos de chat y yo no sabía de qué pantalla o componente hablaba. Ahora cualquiera puede hacer clic en el elemento y comentarlo, y yo exporto esos comentarios a un archivo con el que trabajar.",
        },
        details: {
          heading: {
            en: "Where feedback finally has somewhere to land",
            es: "Donde el feedback por fin tiene un lugar al que llegar",
          },
          // Quote convention: English quotes get italics + double quotes; Spanish
          // keeps «guillemets», no italics.
          sections: [
            {
              body: {
                en: (
                  <>
                    When showing the team the first version the feedback was:{" "}
                    <em>&ldquo;How do we give you feedback?&rdquo;</em> They
                    mentioned they liked Figma because of how they can stay up
                    to date with comments.
                  </>
                ),
                es: (
                  <>
                    Al enseñar al equipo la primera versión, el feedback fue:
                    «¿Cómo te damos feedback?». Comentaron que les gustaba Figma
                    porque les permite estar al día con los comentarios.
                  </>
                ),
              },
            },
            {
              body: {
                en: "Now the user can pin a specific component or element and leave a comment. Once the comment lands I can generate an MD file for the changes. We make the iteration and document it in our change log.",
                es: "Ahora el usuario puede fijar un componente o elemento concreto y dejar un comentario. Cuando llega el comentario, genero un archivo MD con los cambios. Hacemos la iteración y la documentamos en nuestro registro de cambios.",
              },
            },
          ],
          // The recording stops when the comment lands. This is the rest of the trip.
          diagram: "feedback-round-trip",
        },
        // Captured from the demo shell on 2026-08-25, on Familia: comment mode
        // on, click the `Residencia fiscal` select, type, publish, hold on the
        // comment landing in the rail with the selector it pinned to and the .md
        // export beside it.
        //
        // Recorded with the panel docked right. `PanelMode` defaults to
        // `floating`, which puts the comments panel in a box over the top-left of
        // the canvas; the shell remembers the choice in localStorage, so the
        // capture script sets `coherence-demo-panel-mode` before the app boots.
        // Docked, it reads as the same rail Inspección uses.
        video: "/work/afi-design-system/handoff-comment.mp4",
        // Full width, like the inspector below it. A screen recording in a
        // half-width card is a thumbnail of an app — legible as a shape, not as
        // a thing anyone can follow. Across the full row the composer, the
        // selector it pinned to and the typed comment are all readable.
        span: "full",
      },
      {
        label: {
          en: "Token Inspector",
          es: "Inspector de tokens",
        },
        sublabel: {
          en: "In a user test I watched programmers skip the primitives and go straight for the raw value. So the inspector shows both, which means the set-up underneath stays best practice while what they read matches how they already work.",
          es: "En un test con usuarios vi a los programadores saltarse los primitivos e ir directos al valor. Por eso el inspector enseña los dos: la base de debajo sigue siendo la buena práctica y lo que leen encaja con cómo trabajan ya.",
        },
        details: {
          heading: {
            en: "Designers and developers reading the same variable",
            es: "Diseñadores y desarrolladores leyendo la misma variable",
          },
          // Straight from the draft, and nothing beyond it. The previous version opened
          // with developers "eyeballing colors from screenshots and approximating
          // spacing" — Richard never said that, and it was there to fill a heading.
          sections: [
            {
              body: {
                en: (
                  <>
                    Programmers don&rsquo;t use primitives. They say color-main
                    and the hex. A mid/senior teammate, looking at the
                    inspector:{" "}
                    <em>
                      &ldquo;We know we are doing it wrong but the team
                      won&rsquo;t change.&rdquo;
                    </em>
                  </>
                ),
                es: "Los programadores no usan primitivos. Dicen color-main y el hex. Un compañero mid/senior, mirando el inspector: «Sabemos que lo estamos haciendo mal, pero el equipo no va a cambiar».",
              },
            },
            {
              body: {
                en: "So the inspector answers in their vocabulary, not mine. In Figma the team has different permissions, so some people had more features than others. Here everyone sees the same thing, which evens the playing field.",
                es: "Así que el inspector responde en su vocabulario, no en el mío. En Figma el equipo tiene permisos distintos, así que unos tenían más funciones que otros. Aquí todo el mundo ve lo mismo, y eso pone a todos al mismo nivel.",
              },
            },
          ],
        },
        // Shot on Familia rather than Patrimonio, and on components rather than
        // on text. The inspector reads the exact node under the cursor, so
        // clicking a figure returns the single type token that figure consumes
        // and reads as though the tool only knows about fonts. The text input
        // returns what a real control is made of — height, radius, transition,
        // background, border, border width, type — and the tabs beside it return
        // a different six, which is the point the card is making.
        video: "/work/afi-design-system/token-inspector.mp4",
        span: "full",
      },
    ],
  },
  "visual-identity": {
    tagline: {
      en: "Redesigning a white-label wealth planner from the tokens up",
      // TODO(afi-redaccion)
      es: "Rediseñar un wealth planner de marca blanca empezando por los tokens",
    },
    intro: {
      /**
       * A context paragraph, not a summary of the project: what the product is,
       * what was wrong, and what came out. The arc is the cards' job.
       *
       * Richard's wording. The last line names the deliverable, a token system
       * and component library ahead of a design system migration, and the
       * tagline, role and contributions all describe that same work.
       */
      en: "Afi's Wealth Planner runs white-label for Spanish banks. Its 2026 redesign arrived as a one-line brief: make it look more modern. The product was built from static Figma screens, and developers worked screen by screen. I'm leading the work with Miguel, a freelance designer working with us part-time. We created the token system and component library in preparation for a design system migration.",
      // TODO(afi-redaccion)
      es: "El Wealth Planner de Afi se ofrece en marca blanca a bancos españoles. Su rediseño de 2026 llegó como un encargo de una línea: que parezca más moderno. El producto estaba hecho de pantallas estáticas de Figma y los desarrolladores trabajaban pantalla a pantalla. Lidero el trabajo con Miguel, un diseñador freelance que colabora con nosotros a tiempo parcial. Creamos el sistema de tokens y la librería de componentes de cara a una migración de sistema de diseño.",
    },
    role: {
      en: "Design Lead",
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
    /**
     * The same shape afi-design-system uses: context, then a demo, then cards.
     *
     * Distilled from the long-form post on the Coherence site
     * (coherence-wealth-manager.vercel.app/blog/identidad-visual), which tells
     * the story in nine sections. Nothing here is new material: each card is one
     * of that post's sections compressed to the beat a visitor needs at a
     * glance, with the detail popup carrying the rest.
     *
     * Card order follows the work, not the writing: define the word, find the
     * references, agree the rules, build the foundations, then what got made on top.
     */
    bento: [
      /**
       * The workbench, on its own, above everything else.
       *
       * The Vercel site builds from the GitHub mirror's `main`, not Azure. When
       * this frame looks behind Coherence, the mirror needs a push.
       *
       * `?embed=1` strips the site's own nav so the frame doesn't open on
       * somebody else's navigation; same param the Afi design system card uses.
       *
       * It opens on the Button page rather than the /workbench landing, so the
       * first thing in the box is a live component, with the grouped side index
       * one click away for the rest.
       *
       * No `details`. This card is the artefact, and a modal explaining a page
       * you can already touch is a worse version of touching it.
       */
      {
        label: { en: "Component workbench", es: "Workbench de componentes" },
        sublabel: {
          en: "Each primitive component has its own page, grouped by what it does. Here we see every micro interaction on its own before building bigger patterns.",
          // TODO(afi-redaccion)
          es: "Cada componente primitivo tiene su propia página, agrupada por función. Aquí vemos cada microinteracción por separado antes de construir patrones más grandes.",
        },
        span: "full",
        iframe:
          "https://coherence-wealth-manager.vercel.app/workbench/actions/button?embed=1",
      },
      {
        label: { en: "Defining modern", es: "Definir moderno" },
        sublabel: {
          en: "Desk research that turned “more modern” into a six-point checklist the redesign is reviewed against.",
          // TODO(afi-redaccion)
          es: "Investigación que convirtió «más moderno» en una lista de control de seis puntos con la que se revisa el rediseño.",
        },
        // The Modern UI in 2026 thumbnail — the kinetic-type clip for the very
        // post this card links to, so the card face and the piece it points at
        // are the same object. An abstract glyph for "we defined what modern
        // means" kept coming out as a diagram about something else.
        video: "/writing/modern-ui-2026",
        details: {
          heading: {
            en: "Defining what modern means",
            es: "Definir qué significa moderno",
          },
          sections: [
            {
              body: {
                en: "The brief was one line: make it look more modern. My boss had no complaint about what the product did, only about how dated it looked. Without a shared definition of modern, every review turns into taste arguing with taste. In a product designed screen by screen, each person's version of the word could land on a different screen.",
                // TODO(afi-redaccion)
                es: "El encargo era de una línea: que parezca más moderno. A mi jefe no le molestaba lo que hacía el producto, solo lo anticuado que se veía. Sin una definición compartida de moderno, cada revisión se convierte en un gusto discutiendo con otro. En un producto diseñado pantalla a pantalla, la versión de cada persona podía acabar en una pantalla distinta.",
              },
            },
            {
              body: {
                en: (
                  <>
                    Before opening Figma, I did the desk research and wrote it
                    up as{" "}
                    <IntroPreviewLink slug="modern-ui-2026" newTab>
                      Modern UI in 2026
                    </IntroPreviewLink>
                    . It ends on six checks the redesign gets reviewed against:
                    a shared design language, screens built around user intent,
                    motion that explains state, neutral surfaces with color kept
                    for meaning, semantic tokens an AI can build on, and
                    interactions that stay transparent, consistent and
                    responsive.
                  </>
                ),
                // TODO(afi-redaccion)
                es: (
                  <>
                    Antes de abrir Figma hice la investigación y la publiqué
                    como{" "}
                    <IntroPreviewLink slug="modern-ui-2026" newTab>
                      UI moderno en 2026
                    </IntroPreviewLink>
                    . Termina en una lista de control de seis puntos con la que
                    se revisa el rediseño: un lenguaje de diseño compartido,
                    pantallas construidas en torno a la intención del usuario,
                    movimiento que explica estados, superficies neutras con el
                    color reservado para el significado, tokens semánticos sobre
                    los que una IA puede construir, e interacciones con
                    transparencia, consistencia y capacidad de respuesta.
                  </>
                ),
              },
            },
            {
              body: {
                en: "Now a review tests a screen against the checklist instead of someone's taste. Color that decorates a card loses to color that marks a negative number, because the checklist keeps color for meaning.",
                // TODO(afi-redaccion)
                es: "Ahora una revisión contrasta una pantalla con la lista de control, no con el gusto de alguien. El color que decora una tarjeta pierde frente al que marca un número negativo, porque la lista reserva el color para el significado.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Moodboards", es: "Moodboards" },
        sublabel: {
          en: "Two boards built separately kept landing on Wise, Cursor, Shopify, Clerk, Notion and Granola, so those six set the direction.",
          // TODO(afi-redaccion)
          es: "Dos moodboards hechos por separado acababan en Wise, Cursor, Shopify, Clerk, Notion y Granola, así que esas seis marcaron la dirección.",
        },
        animation: "vi-moodboard",
        details: {
          heading: {
            en: "Finding the visual direction",
            es: "Encontrar la dirección visual",
          },
          sections: [
            {
              body: {
                en: "A wide reference set gives you plenty to react to and no direction. And almost everything we liked was SaaS, built around a few common actions. Wealth Planner keeps adding options because it gets built to whatever a client needed that day, so no single product was going to fit it whole.",
                // TODO(afi-redaccion)
                es: "Un conjunto amplio de referencias da mucho material y ninguna dirección. Además, casi todo lo que nos gustaba era SaaS, construido en torno a unas pocas acciones comunes. El Wealth Planner no para de sumar opciones porque se construye según lo que un cliente necesitaba ese día, así que ningún producto iba a encajar entero.",
              },
            },
            {
              body: {
                en: "So we collected by component, not by product. Miguel and I each built a board in Mobbin, separately: buttons, inputs, menus, cards, dialogs, sidebar and filters, three or four screens each. Going through both boards one component at a time, Miguel noticed we kept picking the same six apps. We took the repetition as the signal.",
                // TODO(afi-redaccion)
                es: "Así que recopilamos por componente, no por producto. Miguel y yo construimos cada uno un moodboard en Mobbin, por separado: botones, inputs, menús, tarjetas, diálogos, barra lateral y filtros, tres o cuatro pantallas por componente. Al recorrer los dos componente a componente, Miguel se dio cuenta de que elegíamos siempre las mismas seis aplicaciones. Tomamos esa repetición como la señal.",
              },
            },
            {
              body: {
                en: "The session gave us directions, not designs: buttons compact like Cursor's, menus like Clerk's with options only and no icons, Shopify for charts on cards. Wise, the only reference from our own domain, settled color: a financial interface can stay mostly black and white and spend color on the data.",
                // TODO(afi-redaccion)
                es: "La sesión nos dio direcciones, no diseños: botones compactos como los de Cursor, menús como los de Clerk, solo opciones y sin iconos, y Shopify para las gráficas sobre tarjetas. Wise, la única referencia de nuestro sector, resolvió el color: una interfaz financiera puede ser casi toda blanco y negro y gastar el color en los datos.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Nine principles", es: "Nueve principios" },
        sublabel: {
          en: "The patterns we kept picking, written down as nine principles, so the same question gets one answer on every screen.",
          // TODO(afi-redaccion)
          es: "Los patrones que elegíamos una y otra vez, escritos como nueve principios, para que la misma pregunta tenga una sola respuesta en cada pantalla.",
        },
        animation: "vi-nine-principles",
        details: {
          heading: {
            en: "Nine decisions the team can reuse",
            es: "Nueve decisiones que el equipo puede reutilizar",
          },
          sections: [
            {
              body: {
                en: "A definition of modern tells you how the product should feel. It does not tell you whether editing opens a page or a drawer, or whether two controls that look alike can mean different things.",
                es: "Una definición de moderno te dice qué sensación debe dar el producto. No te dice si editar abre una página o un panel lateral, ni si dos controles que se parecen pueden significar cosas distintas.",
              },
            },
            {
              body: {
                en: "We tied the patterns we kept picking back to the research and wrote them down as nine principles. Among them: information density without visual density, progressive disclosure, consistency above novelty, and context over pages, so an edit happens in a drawer, inline or in an expandable card instead of on a new page. A second list names four things to avoid, starting with Material Design, whose opinions we had spent our time working around.",
                // TODO(afi-redaccion)
                es: "Conectamos los patrones que elegíamos una y otra vez con la investigación y los escribimos como nueve principios. Entre ellos: densidad de información sin densidad visual, revelado progresivo, consistencia por encima de novedad y contexto por encima de páginas, para que una edición ocurra en un panel lateral, en línea o en una tarjeta desplegable y no en otra página. Una segunda lista recoge cuatro cosas que evitar, empezando por Material Design, cuyas opiniones nos habíamos pasado el tiempo sorteando.",
              },
            },
            {
              body: {
                en: "The rules that earn their place are about roles: one component, one meaning. Page navigation is tabs; mutually exclusive options are a segmented control. An add-on tag and a beta tag describe what you're looking at, but a pro tag is selling you something, so it can't look like them. That fixed the problem we kept hitting: one component appearing twice on a page, meaning two things.",
                // TODO(afi-redaccion)
                es: "Las reglas que se ganan el sitio son las de roles: un componente, un significado. La navegación de página son pestañas; las opciones excluyentes son un control segmentado. Una etiqueta de add-on y una de beta describen lo que estás viendo, pero una de pro te está vendiendo algo, así que no puede parecerse a ellas. Eso resolvió lo que nos pasaba una y otra vez: un mismo componente que aparece dos veces en una página con dos significados.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Foundations", es: "Fundamentos" },
        sublabel: {
          en: "Tokens named by role, and a typeface that keeps 0000 and 4444 the same width so columns line up.",
          // TODO(afi-redaccion)
          es: "Tokens nombrados por su papel y una tipografía que mantiene 0000 y 4444 al mismo ancho para que las columnas se alineen.",
        },
        animation: "vi-type-test",
        details: {
          heading: {
            en: "Decisions that carry across screens",
            es: "Decisiones que se mantienen entre pantallas",
          },
          sections: [
            {
              body: {
                en: "Screen-by-screen design leaves the foundations open. A color gets picked for one screen with nobody naming the job it does elsewhere. Typography is worse in a financial product: when 0000 and 4444 take up different widths, columns stop lining up.",
                es: "Diseñar pantalla a pantalla deja las bases abiertas. Se elige un color para una pantalla sin que nadie diga qué papel cumple en el resto. La tipografía es peor en un producto financiero: cuando 0000 y 4444 ocupan anchos distintos, las columnas dejan de alinearse.",
              },
            },
            {
              body: {
                en: "We set up the primitive and semantic tokens in black and white and named each by its role, background canvas or background elevated, before picking a single color. Spacing got the same treatment, like nav-to-content and canvas padding, and no corner is rounder than 6px. For type, we ran Space Grotesk, Fira Sans, Geist and IBM Plex Sans through the same number patterns.",
                // TODO(afi-redaccion)
                es: "Montamos los tokens primitivos y semánticos en blanco y negro y nombramos cada uno por su papel, background canvas o background elevated, antes de elegir un solo color. El espaciado recibió el mismo trato, como la distancia de la navegación al contenido o el padding del lienzo, y ninguna esquina pasa de 6 px de radio. En tipografía, pasamos Space Grotesk, Fira Sans, Geist e IBM Plex Sans por los mismos patrones de cifras.",
              },
            },
            {
              body: {
                en: "A screen asks for a canvas, not a hex value, so the palette can change later without renaming anything. Space Grotesk, Fira Sans and Geist drifted; IBM Plex Sans held, so it became the type family. The test used each font's default figures, which is what a screen gets unless someone turns on tabular numerals. Shadows and dimensions are the next two passes.",
                // TODO(afi-redaccion)
                es: "Una pantalla pide un canvas, no un hexadecimal, así que la paleta puede cambiar después sin renombrar nada. Space Grotesk, Fira Sans y Geist variaban; IBM Plex Sans se mantuvo, así que se convirtió en la familia tipográfica. La prueba usó las cifras por defecto de cada fuente, que es lo que recibe una pantalla si nadie activa los numerales tabulares. Las sombras y las dimensiones son las dos pasadas siguientes.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Components", es: "Componentes" },
        sublabel: {
          en: "Primitives built in code first, then rebuilt in Figma by AI on the same variables, so both stay in sync.",
          // TODO(afi-redaccion)
          es: "Primitivos hechos primero en código y llevados a Figma por la IA con las mismas variables, para que Figma y el código no se separen.",
        },
        animation: "vi-components",
        details: {
          heading: {
            en: "Components in code, documentation in Figma",
            // TODO(afi-redaccion)
            es: "Componentes en código, documentación en Figma",
          },
          sections: [
            {
              body: {
                en: "Foundations do not give you an interface. Wealth Planner still needed buttons, inputs, tables and dialogs whose states behave the same everywhere, and building those inside each screen reopens every decision that just closed.",
                es: "Las bases no te dan una interfaz. El Wealth Planner seguía necesitando botones, inputs, tablas y diálogos cuyos estados se comporten igual en todas partes, y construirlos dentro de cada pantalla reabre todas las decisiones que se acaban de cerrar.",
              },
            },
            {
              body: {
                en: "We split the primitives: chip, badge, card and table for me; tag, dialog, navbar and tabs for Miguel. Buttons, inputs, checkboxes and toggles we built together first, to agree on one workflow. Each component starts in code, from the moodboard. An AI agent then builds it in Figma with the correct variables, adds any that are missing and drafts the documentation. We adjust it, then build it into the Afi library through the Figma MCP.",
                // TODO(afi-redaccion)
                es: "Nos repartimos los primitivos: chip, badge, tarjeta y tabla para mí; tag, diálogo, barra de navegación y pestañas para Miguel. Botones, inputs, checkboxes y toggles los hicimos juntos primero, para acordar un solo flujo de trabajo. Cada componente empieza en código, a partir del moodboard. Después un agente de IA lo construye en Figma con las variables correctas, crea las que falten y redacta la documentación. Lo ajustamos y lo llevamos a la librería de Afi con el MCP de Figma.",
              },
            },
            {
              body: {
                en: "Two skills keep the library consistent. /ds-cleanup audits a component or page, flags where it drifts from the system and fixes it on a second prompt. /ship commits and pushes, then hands back a Figma prompt for any variable that changed, so Figma and code don't drift apart. The workbench at the top of this page is where the team reviews each component on its own.",
                // TODO(afi-redaccion)
                es: "Dos skills mantienen la librería coherente. /ds-cleanup audita un componente o una página, señala dónde se desvía del sistema y lo corrige con un segundo prompt. /ship hace commit y push, y devuelve un prompt de Figma con cada variable que cambió, para que Figma y el código no se separen. El workbench del principio de esta página es donde el equipo revisa cada componente por separado.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Micro-interactions", es: "Microinteracciones" },
        sublabel: {
          en: "Motion that explains state: a check that draws itself, a button that sinks when you press it.",
          // TODO(afi-redaccion)
          es: "Movimiento que explica estados: una marca que se dibuja sola y un botón que se hunde al pulsarlo.",
        },
        animation: "vi-micro",
        details: {
          heading: {
            en: "Defining how the product responds",
            es: "Definir cómo responde el producto",
          },
          sections: [
            {
              body: {
                en: "A component at rest does not tell you what happens when someone acts on it. Decide that inside each feature and the timing drifts even when the colors match. It matters more now: a generated interface arrives correct and generic, and small physical responses are one of the few things it does not hand you.",
                es: "Un componente en reposo no te dice qué pasa cuando alguien actúa sobre él. Si eso se decide dentro de cada funcionalidad, los tiempos se desvían aunque los colores coincidan. Ahora importa más: una interfaz generada llega correcta y genérica, y las respuestas físicas pequeñas son de las pocas cosas que no te vienen dadas.",
              },
            },
            {
              body: {
                en: "We didn't invent most of the animations. We reverse-engineered the ones that inspired us, or took a React library like Magic UI or Animate UI, ported it to Angular and iterated. The press state came out of the moodboard session: the button sinks in, the way a physical one does.",
                // TODO(afi-redaccion)
                es: "La mayoría de las animaciones no las inventamos. Recreamos por ingeniería inversa las que nos inspiraban, o cogimos una librería de React como Magic UI o Animate UI, la portamos a Angular e iteramos. El estado de pulsado salió de la sesión de moodboards: el botón se hunde, como uno físico.",
              },
            },
            {
              body: {
                en: "A checkbox draws its check, a radio fills, a toggle flips, and a send button runs from send to sending to sent. They're rules, not decoration, so a larger pattern reuses the response instead of inventing its own.",
                // TODO(afi-redaccion)
                es: "Un checkbox dibuja su marca, un radio se rellena, un toggle gira y un botón de enviar recorre enviar, enviando y enviado. Son reglas, no decoración, así que un patrón mayor reutiliza la respuesta en vez de inventarse otra.",
              },
            },
          ],
        },
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
      en: "Same calculation, same three steps. It just looks and moves like something a bank would want on its site.",
      es: "El mismo cálculo y los mismos tres pasos. Solo que ahora se ve y se mueve como algo que un banco querría en su web.",
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
        ],
        switch: [
          {
            label: { en: "Results beside", es: "Resultados al lado" },
            heading: {
              en: "The numbers answer every tick.",
              es: "Los números responden a cada marca.",
            },
            body: [
              {
                en: "The panel blurs for a beat while it recalculates, then the new figures count in. No spinner.",
                es: "El panel se difumina un instante mientras recalcula y después entran las cifras nuevas. Sin indicador de carga.",
              },
            ],
            media: [
              {
                kind: "composition",
                title: {
                  en: "Two measures beside the results they change",
                  es: "Dos medidas junto a los resultados que cambian",
                },
                items: [
                  {
                    src: "/work/sarevi/demo/B-Viv-Medidas-Basica.dc.html",
                    viewport: { w: 1440, h: 1695 },
                    rect: { x: 154, y: 367, w: 680, h: 84 },
                    x: 33,
                    y: 36,
                    w: 52,
                    radius: 16,
                  },
                  {
                    src: "/work/sarevi/demo/B-Viv-Medidas-Basica.dc.html",
                    viewport: { w: 1440, h: 1695 },
                    rect: { x: 154, y: 577, w: 680, h: 84 },
                    x: 33,
                    y: 62,
                    w: 52,
                    radius: 16,
                  },
                  {
                    src: "/work/sarevi/demo/B-Viv-Medidas-Basica.dc.html",
                    viewport: { w: 1440, h: 1695 },
                    rect: { x: 866, y: 186, w: 420, h: 584 },
                    x: 79,
                    y: 50,
                    w: 34,
                    radius: 16,
                  },
                ],
                play: "reload",
              },
            ],
          },
          {
            label: { en: "Try it", es: "Pruébalo" },
            heading: {
              en: "Tick something.",
              es: "Marca algo.",
            },
            body: [
              {
                en: "This is the prototype itself, cut to one measure. Tick it and watch the results change, or open Detalles.",
                es: "Este es el propio prototipo, reducido a una medida. Márcala y mira cómo cambian los resultados, o abre Detalles.",
              },
            ],
            media: [
              {
                kind: "embed",
                src: "/work/sarevi/demo/PF-Medida.dc.html",
                title: {
                  en: "SAREVI Medidas, live",
                  es: "Medidas de SAREVI, en vivo",
                },
                width: 1180,
                height: 656,
              },
            ],
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
      en: "That's the whole idea: the plan beside the page, answering as you type.",
      es: "Toda la idea cabe aquí: el plan al lado de la página, que responde mientras escribes.",
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
            es: "Las 27 piezas que el producto en vivo enseñaba fuera de la página tuvieron un solo sitio cada una, y el menú pasó de 13 páginas a 7. La complejidad no se elimina, solo se mueve, así que la carga el producto, no el gestor.",
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
            label: { en: "Follows the page", es: "Sigue a la página" },
            heading: {
              en: "The plan opens on what the page affects.",
              es: "El plan abre lo que la página afecta.",
            },
            body: [
              {
                en: "The live product's two pills were the same on every page. Now each page opens the plan tab it affects: Ingresos opens Liquidez.",
                es: "Las dos píldoras del producto en vivo eran iguales en todas las páginas. Ahora cada página abre la pestaña del plan a la que afecta: Ingresos abre Liquidez.",
              },
              {
                en: "A switch to choose the tab came first. It was one more thing to manage, so it went.",
                es: "Primero hubo un interruptor para elegir la pestaña. Era una cosa más que gestionar, así que lo quitamos.",
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
