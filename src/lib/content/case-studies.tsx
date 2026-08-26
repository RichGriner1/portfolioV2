import type { ReactNode } from "react";

import { IntroPreviewLink } from "@/components/intro-preview-link";
import type { Bilingual } from "@/lib/i18n";

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

export type CaseStudy = {
  tagline: Bilingual<string>;
  intro: Bilingual<string>;
  role: Bilingual<string>;
  contributions: Bilingual<string[]>;
  bento: BentoCard[];
  confidential?: Bilingual<string>;
  gallery?: boolean;
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "afi-design-system": {
    tagline: {
      en: "Building design infrastructure for a fintech consultancy",
      es: "Construyendo la infraestructura de diseño para una consultora fintech",
    },
    intro: {
      en: "Afi is a financial consultancy that added a digital team during the dot-com boom and grew it as engineers: 40 programmers hired for math and CS, no dedicated designers until 2021, and no design system. Afi runs three brands; this is the system for Afi web, the internal and client-facing sites that carry the Afi brand. It's what someone reaches for to mock up a concept before committing time to real UI and internal solutions.",
      // TODO(afi-redaccion)
      es: "Afi es una consultora financiera que montó su equipo digital durante la burbuja de las .com y lo hizo crecer como equipo de ingeniería: 40 programadores contratados por matemáticas e informática, sin diseñadores dedicados hasta 2021 y sin sistema de diseño. Afi maneja tres marcas; este es el sistema de Afi web, los sitios internos y de cliente que llevan la marca Afi. Es lo que alguien coge para maquetar un concepto antes de dedicarle tiempo a una UI de verdad y a soluciones internas.",
    },
    role: {
      en: "Design Systems Lead",
      es: "Líder de sistemas de diseño",
    },
    contributions: {
      en: [
        "Design systems",
        "Token architecture",
        "Component library",
        "AI tooling",
        "White-label strategy",
      ],
      es: [
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
        // TODO(afi-redaccion)
        sublabel: {
          en: "One page per component: every state, the tokens it uses and a brand picker. Nobody rebuilds the same thing in Figma to check how it behaves, and the token names on the page become the language the team uses for it.",
          // TODO(afi-redaccion)
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
                // TODO(afi-redaccion)
                es: "Los programadores tienen permisos distintos en Figma, así que las entregas eran inconsistentes porque cada uno veía cosas distintas. Tampoco usaban los componentes de Figma, solo los flujos, pero luego me hacían preguntas específicas de componentes. Era porque no habíamos tenido tiempo de documentarles bien el Figma.",
              },
            },
            {
              body: {
                en: "Now I made the component playground to look at states, interactions, tokens in an isolated place.",
                // TODO(afi-redaccion)
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
        // TODO(afi-redaccion)
        sublabel: {
          en: "Changing a client's brand meant editing colors across twenty files by hand. The values sit in three tiers now, primitive, semantic and component, so a new brand is a token swap and the components never change.",
          // TODO(afi-redaccion)
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
                // TODO(afi-redaccion)
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
                // TODO(afi-redaccion)
                es: (
                  <>
                    Empezamos con PrimeNG, pero con el objetivo white-label
                    acabaron siendo demasiadas capas como para construirlo sin
                    dolor de cabeza. Así que construimos una{" "}
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
                // TODO(afi-redaccion)
                es: "Cambiar los tokens va bien para cambios rápidos cuando un concepto tiene que salir hacia un cliente, pero los patrones y la esencia visual se pierden.",
              },
            },
            {
              body: {
                en: "We're working with some of our clients now on a more cohesive white-labeling in code.",
                // TODO(afi-redaccion)
                es: "Ahora estamos trabajando con algunos de nuestros clientes en un white-label más coherente en código.",
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
        // TODO(afi-redaccion)
        sublabel: {
          en: "Documented, with the brand assets and token sets downloadable. Five teams and one designer means the answer has to sit somewhere they can reach without me.",
          // TODO(afi-redaccion)
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
                // TODO(afi-redaccion)
                es: "Un diseñador toma un millón de decisiones a lo largo de un proyecto, grandes y pequeñas. Como único diseñador a tiempo completo, mi atención se reparte entre cuarenta programadores, así que una conclusión aterriza en un equipo y no llega al resto, y en una cultura donde manda la preferencia eso significa defender la misma decisión una y otra vez.",
              },
            },
            {
              body: {
                en: "A shared design language only exists if everyone has the same access to it. So, I documented everything and made assets like token sets and skills downloadable.",
                // TODO(afi-redaccion)
                es: "Un lenguaje de diseño compartido solo existe si todo el mundo tiene el mismo acceso a él. Así que lo documenté todo e hice descargables recursos como los sets de tokens y las skills.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "Designer Feedback Tool",
          // TODO(afi-redaccion)
          es: "Herramienta de feedback de diseño",
        },
        sublabel: {
          en: "Feedback arrived in chat threads and I couldn't tell which screen or component it was about. Now anyone can click the element and comment on it, and I export those comments as a file to work from.",
          // TODO(afi-redaccion)
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
                // TODO(afi-redaccion)
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
                // TODO(afi-redaccion)
                es: "Ahora el usuario puede fijar un componente o elemento concreto y dejar un comentario. Cuando el comentario aterriza, puedo generar un archivo MD con los cambios. Hacemos la iteración y la documentamos en nuestro registro de cambios.",
              },
            },
          ],
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
          // TODO(afi-redaccion)
          es: "En un test con usuarios vi a los programadores saltarse los primitivos e ir directos al valor en crudo. Por eso el inspector enseña los dos: el montaje de debajo sigue siendo buena práctica y lo que ellos leen encaja con cómo ya trabajan.",
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
                // TODO(afi-redaccion)
                es: "Los programadores no usan primitivos. Dicen color-main y el hex. Un compañero mid/senior, mirando el inspector: «Sabemos que lo estamos haciendo mal, pero el equipo no va a cambiar».",
              },
            },
            {
              body: {
                en: "So the inspector answers in their vocabulary, not mine. In Figma the team has different permissions, so some people had more features than others. Here everyone sees the same thing, which evens the playing field.",
                // TODO(afi-redaccion)
                es: "Así que el inspector responde en su vocabulario, no en el mío. En Figma el equipo tiene permisos distintos, así que unos tenían más funciones que otros. Aquí todo el mundo ve lo mismo, y eso iguala el terreno.",
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
      en: "Turning a brief into an identity",
      // TODO(afi-redaccion)
      es: "Convertir un encargo en una identidad",
    },
    intro: {
      /**
       * Cut to a context paragraph, not a summary of the whole project.
       *
       * The long version told the entire arc — strategy, personas, moodboards,
       * principles, tokens — before a visitor had seen a single card. That's the
       * cards' job now. What's left is the only thing they need to read the cards
       * at all: what the product is, what was actually wrong, and what came out.
       */
      en: "Afi's Wealth Planner runs white-label for Spanish banks. Its 2026 redesign arrived as a one-line brief: make it look more modern. The product was built from static Figma screens, developers worked screen by screen, and nobody shared a definition of the word. I'm leading the work with Miguel, a freelance designer working with us part-time. We wrote the definition first, then turned it into a token vocabulary, a typeface and a component library for the live product.",
      // TODO(afi-redaccion)
      es: "El Wealth Planner de Afi se ofrece en marca blanca a bancos españoles. Su rediseño de 2026 llegó como un encargo de una línea: que parezca más moderno. El producto estaba hecho de pantallas estáticas de Figma, los desarrolladores trabajaban pantalla a pantalla y nadie compartía una definición de esa palabra. Lidero el trabajo con Miguel, un diseñador freelance que colabora con nosotros a tiempo parcial. Primero escribimos la definición y después la convertimos en un vocabulario de tokens, una tipografía y una librería de componentes para el producto en vivo.",
    },
    role: {
      en: "Brand & Visual Identity Lead",
      // TODO(afi-redaccion)
      es: "Líder de marca e identidad visual",
    },
    contributions: {
      en: [
        "Brand strategy",
        "Persona definition",
        "Design principles",
        "Typography & tokens",
        "Micro-interaction design",
        "Component library",
      ],
      // TODO(afi-redaccion)
      es: [
        "Estrategia de marca",
        "Definición de personas",
        "Principios de diseño",
        "Tipografía y tokens",
        "Diseño de microinteracciones",
        "Librería de componentes",
      ],
    },
    /**
     * The same shape afi-design-system uses: context, then a demo, then cards.
     *
     * Distilled from the long-form article at src/app/work/visual-identity/, which
     * tells the story in nine sections and about 750 lines. Nothing here is new
     * material — each card is one of that article's sections compressed to the beat
     * a visitor needs at a glance, with the detail popup carrying the rest. The
     * article stays the deep version; this is the one that reads in thirty seconds.
     *
     * Card order follows the work, not the writing: define the word, find the
     * references, agree the rules, build the foundations, then what got made on top.
     */
    bento: [
      /**
       * The workbench, on its own, above everything else.
       *
       * Restored 2026-08-26 after being pulled in f5e5985 for a misbehaving
       * deployment. The deployment is healthy — verified by loading this route
       * against it.
       *
       * `?embed=1` strips the site's own nav so the frame doesn't open on
       * somebody else's navigation; same param the Afi design system card uses,
       * and it works on this route too (checked: without it the frame starts
       * with "Diseño en Afi / Workbench / Demos", with it the index is the first
       * thing in the box).
       *
       * It opens on Button, because the workbench is one long scroll whose side
       * index is a set of buttons and whose URL never changes. Richard's call —
       * the point of this card is the v2 primitives all in one place, and Button
       * is where that page starts.
       *
       * No `details`. This card is the artefact, and a modal explaining a page
       * you can already touch is a worse version of touching it.
       */
      {
        label: { en: "Component workbench", es: "Workbench de componentes" },
        sublabel: {
          en: "Every v2 primitive on one page, in each variant and size. The states worth arguing about only show on hover or hold, so they run here instead of being drawn.",
          // TODO(afi-redaccion)
          es: "Todas las primitivas de la v2 en una página, en cada variante y tamaño. Los estados que dan que hablar solo salen al pasar el cursor o al mantener pulsado, así que aquí funcionan en vez de estar dibujados.",
        },
        span: "full",
        iframe: "https://coherence-wealth-manager.vercel.app/workbench?embed=1",
      },
      {
        label: { en: "Defining modern", es: "Definir moderno" },
        sublabel: {
          en: "Four things you can see on a screen, so a review tests a choice instead of preferring one.",
          // TODO(afi-redaccion)
          es: "Cuatro cosas que se ven en pantalla, para que una revisión pruebe una decisión en vez de quedarse con la que más gusta.",
        },
        // The Modern UI in 2026 thumbnail — the kinetic-type clip for the very
        // post this card links to, so the card face and the piece it points at
        // are the same object. An abstract glyph for "we defined what modern
        // means" kept coming out as a diagram about something else.
        video: "/writing/modern-ui-2026",
        details: {
          heading: {
            en: "Defining what modern means",
            // TODO(afi-redaccion)
            es: "Definir qué significa moderno",
          },
          sections: [
            {
              body: {
                en: "The brief was one line: make it look more modern. My boss liked what the demo did and called how it looked dated, so interactivity was never the blocker. In one review the word meant a new typeface; in the next, more color or more motion. Wealth Planner was built from static Figma screens, so every reading of it could enter the product on its own.",
                // TODO(afi-redaccion)
                es: "El encargo era de una línea: que parezca más moderno. A mi jefe le gustaba lo que hacía la demo y le parecía anticuado cómo se veía, así que la interactividad nunca fue el problema. En una revisión la palabra era otra tipografía; en la siguiente, más color o más movimiento. El Wealth Planner estaba hecho de pantallas estáticas de Figma, así que cada lectura podía entrar en el producto por su cuenta.",
              },
            },
            {
              body: {
                en: "Wrote the definition as things you can see on a screen: easy to scan, detail on demand, feedback that makes a change obvious, and a visual system that stays quiet around the numbers.",
                // TODO(afi-redaccion)
                es: "Escribimos la definición como cosas que se ven en pantalla: fácil de escanear, detalle bajo demanda, feedback que deja claro el cambio y un sistema visual que no compite con las cifras.",
              },
            },
            {
              body: {
                en: "Now a review tests a choice instead of preferring one. A dashboard where every value competes fails the scan test, however current the styling. Color that decorates a card has a weaker case than color marking a negative number.",
                // TODO(afi-redaccion)
                es: "Ahora una revisión pone a prueba una decisión en vez de quedarse con la que más gusta. Un dashboard donde todos los valores compiten falla la prueba del escaneo, por actual que sea el estilo. El color que decora una tarjeta tiene menos argumento que el que marca un número negativo.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Moodboards", es: "Moodboards" },
        sublabel: {
          en: "The six we kept going back to: Wise, Cursor, Shopify, Clerk, Notion and Granola.",
          // TODO(afi-redaccion)
          es: "Las seis a las que volvíamos siempre: Wise, Cursor, Shopify, Clerk, Notion y Granola.",
        },
        animation: "vi-moodboard",
        details: {
          heading: {
            en: "Finding the visual direction",
            // TODO(afi-redaccion)
            es: "Encontrar la dirección visual",
          },
          sections: [
            {
              body: {
                en: "A wide reference set gives you plenty to react to and no direction. Worse, almost everything we liked was SaaS: a handful of common actions a whole team has scoped down. Wealth Planner accumulates options because it gets built to whatever a client needed that day.",
                // TODO(afi-redaccion)
                es: "Un conjunto amplio de referencias da mucho a lo que reaccionar y ninguna dirección. Peor: casi todo lo que nos gustaba era SaaS, un puñado de acciones comunes que un equipo entero ha acotado. El Wealth Planner acumula opciones porque se construye según lo que un cliente necesitaba ese día.",
              },
            },
            {
              body: {
                en: "Miguel noticed we kept going back to the same six: Wise, Cursor, Shopify, Clerk, Notion and Granola. We took the repetition as the signal.",
                // TODO(afi-redaccion)
                es: "Miguel se dio cuenta de que volvíamos siempre a las mismas seis: Wise, Cursor, Shopify, Clerk, Notion y Granola. Tomamos esa repetición como la señal.",
              },
            },
            {
              body: {
                en: "Wise was the only one from our domain and it settled color: a financial interface can stay mostly black and white and spend color on the data. The other five kept showing the same three things, which were clear hierarchy, restrained surfaces, and small interactions that explain state.",
                // TODO(afi-redaccion)
                es: "Wise era la única de nuestro sector y resolvió el color: una interfaz financiera puede ser casi toda blanco y negro y gastar el color en los datos. Las otras cinco repetían las mismas tres cosas: jerarquía clara, superficies contenidas e interacciones pequeñas que explican el estado.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Nine principles", es: "Nueve principios" },
        sublabel: {
          en: "Nine rules about roles, so a pro tag and a beta tag stop looking the same.",
          // TODO(afi-redaccion)
          es: "Nueve reglas sobre roles, para que una etiqueta de pro y una de beta dejen de verse igual.",
        },
        animation: "vi-nine-principles",
        details: {
          heading: {
            en: "Nine decisions the team can reuse",
            // TODO(afi-redaccion)
            es: "Nueve decisiones que el equipo puede reutilizar",
          },
          sections: [
            {
              body: {
                en: "A definition of modern tells you how the product should feel. It does not tell you whether editing opens a page or a drawer, or whether two controls that look alike can mean different things.",
                // TODO(afi-redaccion)
                es: "Una definición de moderno te dice cómo debería sentirse el producto. No te dice si editar abre una página o un panel lateral, ni si dos controles que se parecen pueden significar cosas distintas.",
              },
            },
            {
              body: {
                en: "Nine principles, each with a direction and the thing to avoid: essential information first, detail on demand, and context kept with drawers, inline editing and expandable cards.",
                // TODO(afi-redaccion)
                es: "Nueve principios, cada uno con una dirección y con lo que hay que evitar: primero la información esencial, el detalle bajo demanda y el contexto mantenido con paneles laterales, edición en línea y tarjetas desplegables.",
              },
            },
            {
              body: {
                en: "The ones that earn their place are about roles. An add-on tag and a beta tag describe what you are looking at; a pro tag is selling you something, so it cannot look the same. Page navigation is tabs, mutually exclusive options are a segmented control. That last rule fixed what we kept hitting: one component appearing twice on a page meaning two things.",
                // TODO(afi-redaccion)
                es: "Los que se ganan el sitio son los de roles. Una etiqueta de add-on y una de beta describen lo que estás viendo; una de pro te está vendiendo algo, así que no puede verse igual. La navegación de página son pestañas, las opciones excluyentes son un control segmentado. Esa última regla resolvió lo de siempre: un mismo componente apareciendo dos veces en una página con dos significados.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Foundations", es: "Fundamentos" },
        sublabel: {
          en: "Tokens named by role, and the typeface that keeps 0000 and 4444 the same width.",
          // TODO(afi-redaccion)
          es: "Tokens nombrados por su papel, y la tipografía que mantiene 0000 y 4444 al mismo ancho.",
        },
        animation: "vi-type-test",
        details: {
          heading: {
            en: "Decisions that carry across screens",
            // TODO(afi-redaccion)
            es: "Decisiones que se mantienen entre pantallas",
          },
          sections: [
            {
              body: {
                en: "Screen-by-screen design leaves the foundations open. A color gets picked for one screen with nobody naming the job it does elsewhere. Typography is worse in a financial product: when 0000 and 4444 take up different widths, columns stop lining up.",
                // TODO(afi-redaccion)
                es: "Diseñar pantalla a pantalla deja las bases abiertas. Se elige un color para una pantalla sin que nadie diga qué papel cumple en el resto. La tipografía es peor en un producto financiero: cuando 0000 y 4444 ocupan anchos distintos, las columnas dejan de alinearse.",
              },
            },
            {
              body: {
                en: "Named tokens by role first, background canvas and background elevated, and assigned values after. Compared Space Grotesk, Fira Sans, Geist and IBM Plex Sans on the same number patterns. Corner radius caps at 6px.",
                // TODO(afi-redaccion)
                es: "Primero nombramos los tokens por su papel, background canvas y background elevated, y asignamos valores después. Comparamos Space Grotesk, Fira Sans, Geist e IBM Plex Sans con los mismos patrones numéricos. El radio de esquina tiene un tope de 6px.",
              },
            },
            {
              body: {
                en: "A screen asks for a canvas, not a hex value, so the value can change without renaming anything. IBM Plex Sans won because its default figures held those patterns in line. The test did not turn on tabular numerals, so the claim stops there. Shadows and dimensions are the next two passes.",
                // TODO(afi-redaccion)
                es: "Una pantalla pide un canvas, no un hexadecimal, así que el valor puede cambiar sin renombrar nada. IBM Plex Sans ganó porque sus cifras por defecto mantenían esos patrones alineados. La prueba no activó numerales tabulares, así que la conclusión llega hasta ahí. Las sombras y las dimensiones son las dos pasadas siguientes.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Components", es: "Componentes" },
        sublabel: {
          en: "Chip, badge, card and table on my side; tag, dialog, navbar and tabs on Miguel's.",
          // TODO(afi-redaccion)
          es: "Chip, badge, card y table por mi parte; tag, dialog, navbar y tabs por la de Miguel.",
        },
        animation: "vi-components",
        details: {
          heading: {
            en: "Building from shared components",
            // TODO(afi-redaccion)
            es: "Construir desde componentes compartidos",
          },
          sections: [
            {
              body: {
                en: "Foundations do not give you an interface. Wealth Planner still needed buttons, inputs, tables and dialogs whose states behave the same everywhere, and building those inside each screen reopens every decision that just closed.",
                // TODO(afi-redaccion)
                es: "Las bases no te dan una interfaz. El Wealth Planner seguía necesitando botones, inputs, tablas y diálogos cuyos estados se comporten igual en todas partes, y construirlos dentro de cada pantalla reabre todas las decisiones que se acaban de cerrar.",
              },
            },
            {
              body: {
                en: "Split the primitives. I took chip, badge, card and table; Miguel took tag, dialog, navbar and tabs. Buttons, inputs, checkboxes and toggles we built together first. Everything is compact by default, which is a preference and not a finding.",
                // TODO(afi-redaccion)
                es: "Repartimos las primitivas. Yo cogí chip, badge, card y table; Miguel cogió tag, dialog, navbar y tabs. Botones, inputs, checkboxes y toggles los hicimos juntos primero. Todo es compacto por defecto, que es una preferencia y no un hallazgo.",
              },
            },
            {
              body: {
                en: "The card treatment is the one worth naming. Shopify nests a card inside a card, and moving the nested panel to the top gives it the double-layer depth a wallet has. Details like that carry more weight here, because underneath them the product is tables and graphs.",
                // TODO(afi-redaccion)
                es: "El tratamiento de las tarjetas es el que merece nombrarse. Shopify anida una tarjeta dentro de otra, y subir el panel anidado arriba le da la profundidad de doble capa que tiene un monedero. Detalles así pesan más aquí, porque debajo el producto son tablas y gráficas.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Micro-interactions", es: "Microinteracciones" },
        sublabel: {
          en: "The check that draws itself, and the press state that goes in.",
          // TODO(afi-redaccion)
          es: "La marca que se dibuja sola y el estado de pulsado que se hunde.",
        },
        animation: "vi-micro",
        details: {
          heading: {
            en: "Defining how the product responds",
            // TODO(afi-redaccion)
            es: "Definir cómo responde el producto",
          },
          sections: [
            {
              body: {
                en: "A component at rest does not tell you what happens when someone acts on it. Decide that inside each feature and the timing drifts even when the colors match. It matters more now: a generated interface arrives correct and generic, and small physical responses are one of the few things it does not hand you.",
                // TODO(afi-redaccion)
                es: "Un componente en reposo no te dice qué pasa cuando alguien actúa sobre él. Si eso se decide dentro de cada funcionalidad, los tiempos se desvían aunque los colores coincidan. Ahora importa más: una interfaz generada llega correcta y genérica, y las respuestas físicas pequeñas son de las pocas cosas que no te vienen dadas.",
              },
            },
            {
              body: {
                en: "Reverse-engineered the animations from the interfaces that set the direction. Where that failed, started from a React library and ported it to Angular. Press states go in, the way a physical button does.",
                // TODO(afi-redaccion)
                es: "Sacamos las animaciones por ingeniería inversa de las interfaces que marcaron la dirección. Donde eso no salió, partimos de una librería de React y la portamos a Angular. Los estados de pulsado se hunden, como un botón físico.",
              },
            },
            {
              body: {
                en: "A checkbox draws its check, a radio fills, a toggle carries its own movement, and a send button runs from action to sending to sent. Rules, not decoration, so a larger pattern reuses the response instead of inventing one.",
                // TODO(afi-redaccion)
                es: "Un checkbox dibuja su marca, un radio se rellena, un toggle lleva su propio movimiento y un botón de enviar recorre acción, enviando y enviado. Son reglas, no decoración, así que un patrón mayor reutiliza la respuesta en vez de inventarse otra.",
              },
            },
          ],
        },
      },
    ],
  },
  kt360: {
    tagline: {
      en: "An AI environment built for a team that doesn't have a full design department",
      es: "Un entorno de IA construido para un equipo que no tiene un departamento de diseño completo",
    },
    intro: {
      en: "KT360 is an early-stage AI startup. The brand had to look nothing like AI — playful, human, deliberately distinct. The harder problem: no designer on the team. We encoded the brand into the environment. Rules, component specs, and motion patterns live as files an AI can read, check, and enforce. Marketing writes a blog post, a developer ships a page — both come out looking like the same hand because the rules do the work.",
      // TODO(afi-redaccion)
      es: "KT360 es una startup de IA en fase inicial. La marca tenía que no parecerse en nada a la IA — juguetona, humana, deliberadamente distinta. El reto más complicado: no hay diseñador en el equipo. Codificamos la marca dentro del entorno. Las reglas, las specs de componentes y los patrones de movimiento viven como archivos que una IA puede leer, comprobar y hacer cumplir. Marketing escribe un artículo, un desarrollador lanza una página — ambos salen como de la misma mano porque las reglas hacen el trabajo.",
    },
    role: {
      en: "Freelance Designer & AI Builder",
      es: "Diseñador freelance y constructor de IA",
    },
    contributions: {
      en: [
        "Brand strategy",
        "Visual identity",
        "Design systems",
        "AI environment design",
        "Prototype infrastructure",
      ],
      es: [
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
  "audemic-business-growth": {
    tagline: {
      en: "A loyal B2C base, and nowhere to grow",
      // TODO(afi-redaccion)
      es: "Una base B2C fiel y ningún sitio donde crecer",
    },
    intro: {
      en: "A B2C product with a loyal base and a structural ceiling: students graduate, so the users you win you lose on a schedule. The question was never how to make Scholar better. It was who else reads research for a living, and whether they'd pay.",
      // TODO(afi-redaccion)
      es: "Un producto B2C con una base fiel y un techo estructural: los estudiantes se graduan, así que a los usuarios que ganas los pierdes con calendario. La pregunta nunca fue cómo mejorar Scholar, sino quién más lee investigación para ganarse la vida y si pagaría por ello.",
    },
    role: {
      en: "Senior Digital Product Manager",
      // TODO(afi-redaccion)
      es: "Senior digital product manager",
    },
    contributions: {
      en: [
        "Product strategy",
        "Discovery research",
        "Journey mapping",
        "Growth experiments",
        "Roadmap prioritization",
      ],
      // TODO(afi-redaccion)
      es: [
        "Estrategia de producto",
        "Investigación de descubrimiento",
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
          // TODO(afi-redaccion)
          es: "8.000 $ al mes desde 2022 y una base de usuarios con fecha de caducidad.",
        },
        // The Context slide's own photo. It stays on the Context card rather than
        // moving to the intro, which has no image slot — the deck pairs this text
        // with this picture and the pairing is the point.
        image: "/work/audemic-business-growth/context-workshop.webp",
        span: "wide",
        details: {
          heading: {
            en: "A ceiling, not a product problem",
            // TODO(afi-redaccion)
            es: "Un techo, no un problema de producto",
          },
          sections: [
            {
              body: {
                en: "Audemic Scholar is a web app that allows university students to listen to the full text research paper and reports. Since 2022, Scholar has established a loyal user base in the B2C market, generating $8,000 per month in revenue.",
                // TODO(afi-redaccion)
                es: "Audemic Scholar es una aplicación web que permite a los estudiantes universitarios escuchar artículos de investigación e informes completos. Desde 2022, Scholar había consolidado una base de usuarios fiel en el mercado B2C, con unos ingresos de 8.000 $ al mes.",
              },
            },
            {
              body: {
                en: "But investors raised concerns about the product's scalability due to the lifecycle of undergraduate and post graduate students.",
                // TODO(afi-redaccion)
                es: "Pero los inversores plantearon dudas sobre la escalabilidad del producto por el ciclo de vida de los estudiantes de grado y posgrado.",
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
          // TODO(afi-redaccion)
          es: "Una necesidad de usuario, una de negocio y una visión de producto. Lo que salió fue una vista de paper con resúmenes sobre el texto completo y feedback que no interrumpe.",
        },
        image: "/work/audemic-business-growth/solution-paper-view.webp",
        span: "wide",
        details: {
          heading: {
            en: "Three statements, then three changes",
            // TODO(afi-redaccion)
            es: "Tres afirmaciones, después tres cambios",
          },
          sections: [
            {
              body: {
                en: "The user need was tools that cut the workload of finding and organizing information. The business need was new markets from the insights we already had, and a clear ideal customer profile. Early hypotheses pointed at the social sciences, because 60% of Scholar users came from that field.",
                // TODO(afi-redaccion)
                es: "La necesidad de usuario eran herramientas que redujeran el trabajo de encontrar y organizar información. La de negocio, nuevos mercados a partir de las conclusiones que ya teníamos y un perfil de cliente ideal claro. Las primeras hipótesis apuntaban a las ciencias sociales, porque el 60 % de los usuarios de Scholar venía de ese campo.",
              },
            },
            {
              body: {
                en: "Both roll up into one product vision: streamline access to critical information for professionals in fast-paced industries, so they can spend their time on the work that has impact.",
                // TODO(afi-redaccion)
                es: "Ambas se resumen en una visión de producto: simplificar el acceso a la información crítica para profesionales de sectores acelerados, para que dediquen su tiempo al trabajo que tiene impacto.",
              },
            },
            {
              body: {
                en: "Three changes came out of it. Summaries iterated against OpenAI and Claude models with survey and interview feedback between rounds. A redesigned audio page that puts the summary on the full-text paper, so a researcher understands new work without reading all of it. And in-app feedback that collects insight passively instead of stopping someone mid-task to ask.",
                // TODO(afi-redaccion)
                es: "De ahí salieron tres cambios. Resúmenes iterados sobre modelos de OpenAI y Claude, con feedback de encuestas y entrevistas entre rondas. Una página de audio rediseñada que pone el resumen sobre el paper completo, para entender un trabajo nuevo sin leerlo entero. Y feedback dentro de la app que recoge información de forma pasiva en vez de parar a alguien a media tarea para preguntarle.",
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
          // TODO(afi-redaccion)
          es: "20 horas al mes por investigador, antes de empezar cualquier análisis.",
        },
        image:
          "/work/audemic-business-growth/process-01-interview-patterns.webp",
        details: {
          heading: {
            en: "Costing an NIH-sized organization $10M a month",
            // TODO(afi-redaccion)
            es: "Le cuesta 10 M $ al mes a una organización del tamaño del NIH",
          },
          sections: [
            {
              body: {
                en: "By interviewing UN analysts and vaccine researchers, we discovered researchers lose 20 hours a month searching for information, costing organizations like NIH nearly $10 million monthly in lost productivity.",
                // TODO(afi-redaccion)
                es: "Entrevistando a analistas de la ONU e investigadores de vacunas descubrimos que los investigadores pierden 20 horas al mes buscando información, lo que cuesta a organizaciones como el NIH cerca de 10 millones de dólares mensuales en productividad perdida.",
              },
            },
            {
              body: {
                en: "Every interview was cut into four columns: the job as it stands, pains, current solutions, and the motivation underneath. The pattern only shows up when you can read one column straight down.",
                // TODO(afi-redaccion)
                es: "Cada entrevista se repartió en cuatro columnas: el trabajo tal y como es, los dolores, las soluciones actuales y la motivación de fondo. El patrón solo aparece cuando puedes leer una columna de arriba abajo.",
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
          en: "Mapped the as-is journey, then launched a beta against it.",
          // TODO(afi-redaccion)
          es: "Mapeamos el recorrido tal cual y lanzamos una beta contra él.",
        },
        image: "/work/audemic-business-growth/process-02-journey-map.webp",
        details: {
          heading: {
            en: "20 quality leads in one week",
            // TODO(afi-redaccion)
            es: "20 leads de calidad en una semana",
          },
          sections: [
            {
              body: {
                en: "After mapping the as-is customer journey, we launched a Beta 24/7 junior analyst solution to help researchers stay informed. Within a week, we captured 20 quality leads through paid ads.",
                // TODO(afi-redaccion)
                es: "Después de mapear el recorrido de cliente tal y como era, lanzamos una beta de analista junior 24/7 para ayudar a los investigadores a estar al día. En una semana captamos 20 leads de calidad con publicidad de pago.",
              },
            },
            {
              body: {
                en: "Stage one is where the time goes. Scanning dozens of reports from 70+ analysts, reading external publications alongside their own research, skimming summaries selectively — across company databases, analyst reports, subscriptions like WSJ and Foreign Policy, and Ground News for bias checking.",
                // TODO(afi-redaccion)
                es: "La etapa uno es donde se va el tiempo. Revisar decenas de informes de más de 70 analistas, leer publicaciones externas junto a su propia investigación, repasar resúmenes de forma selectiva: entre bases de datos internas, informes de analistas, suscripciones como WSJ y Foreign Policy, y Ground News para contrastar sesgos.",
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
          // TODO(afi-redaccion)
          es: "A los resúmenes les faltaba el contexto que los hacía valer la pena.",
        },
        image: "/work/audemic-business-growth/process-03-user-interview.webp",
        details: {
          heading: {
            en: "The gist, and nothing past it",
            // TODO(afi-redaccion)
            es: "La idea general, y nada más allá",
          },
          sections: [
            {
              body: {
                en: "We learned from users that summaries lacked critical context, such as societal impact and effects on studied groups, limiting deeper understanding. Users struggled to move beyond a superficial understanding.",
                // TODO(afi-redaccion)
                es: "Los usuarios nos hicieron ver que a los resúmenes les faltaba contexto crítico, como el impacto social y los efectos sobre los grupos estudiados, lo que limitaba una comprensión más profunda. Les costaba pasar de un entendimiento superficial.",
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
          // TODO(afi-redaccion)
          es: "Alcance × Impacto × Confianza ÷ Esfuerzo, puntuado en la pared.",
        },
        image: "/work/audemic-business-growth/process-04-prioritization.webp",
        details: {
          heading: {
            en: "A number you can disagree with",
            // TODO(afi-redaccion)
            es: "Un número con el que se puede discrepar",
          },
          sections: [
            {
              body: {
                en: "We aligned beta-user feedback with our roadmap, prioritizing pain points to position the product for B2B clients. Equation for prioritization: Reach × Impact × Confidence ÷ Effort.",
                // TODO(afi-redaccion)
                es: "Alineamos el feedback de los usuarios beta con nuestra hoja de ruta, priorizando los puntos de dolor para posicionar el producto ante clientes B2B. Ecuación de priorización: Alcance × Impacto × Confianza ÷ Esfuerzo.",
              },
            },
            {
              body: {
                en: "Mark-read-on-papers scored 11160, renaming boards and files 7440, drag-and-drop upload 5115, the note-taking MVP 4133. Writing the arithmetic on the sticky note is the point: an argument about whether renaming matters more than uploading goes nowhere, an argument about whether its reach is really 620 goes somewhere.",
                // TODO(afi-redaccion)
                es: "Marcar como leído en la pestaña de papers puntuó 11160, renombrar tableros y archivos 7440, la subida por arrastre 5115 y el MVP de notas 4133. Escribir la aritmética en el post-it es justo el objetivo: discutir si renombrar importa más que subir archivos no lleva a ninguna parte; discutir si su alcance es de verdad 620, sí.",
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
      // TODO(afi-redaccion)
      es: "Enseñar el valor antes de pedir nada",
    },
    intro: {
      en: "Audemic Insights is a mobile app: a 24/7 junior analyst for the intellectually curious that finds and extracts key insights from research papers and reports, and turns them into audio summaries personalized to your goals. Retention was the problem. Users came for a seamless AI experience, met a form, and left before the app had shown them anything.",
      // TODO(afi-redaccion)
      es: "Audemic Insights es una app móvil: un analista junior 24/7 para gente intelectualmente curiosa que encuentra y extrae las ideas clave de artículos de investigación e informes, y las convierte en resúmenes de audio personalizados según tus objetivos. El problema era la retención. Los usuarios venían por una experiencia de IA fluida, se encontraban un formulario y se iban antes de que la app les hubiera enseñado nada.",
    },
    role: {
      en: "Senior Digital Product Manager",
      // TODO(afi-redaccion)
      es: "Senior digital product manager",
    },
    contributions: {
      en: [
        "Product design",
        "User interviews",
        "Funnel analysis",
        "Prototyping",
        "Usability testing",
      ],
      // TODO(afi-redaccion)
      es: [
        "Diseño de producto",
        "Entrevistas con usuarios",
        "Análisis del embudo",
        "Prototipado",
        "Test de usabilidad",
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
          // TODO(afi-redaccion)
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
            // TODO(afi-redaccion)
            es: "Tres formas de perder al mismo usuario",
          },
          sections: [
            {
              body: {
                en: "Users expected a seamless AI experience and met manual tasks instead. Search results lacked precision. And an excessive number of onboarding steps produced friction that led straight to drop-off.",
                // TODO(afi-redaccion)
                es: "Los usuarios esperaban una experiencia fluida con IA y se encontraban tareas manuales. Los resultados de búsqueda no eran precisos. Y un número excesivo de pasos en el onboarding generaba una fricción que llevaba directa al abandono.",
              },
            },
            {
              body: {
                en: "Linked the first search to topics worth engaging with, and added metadata that makes a result actionable rather than just present.",
                // TODO(afi-redaccion)
                es: "Ligamos la primera búsqueda a temas que engancharan y añadimos metadatos que hacen que un resultado sea accionable y no solo esté ahí.",
              },
            },
            {
              body: {
                en: "Onboarding leads with search, so someone explores a relevant topic before being asked for anything, and five personalized summaries show what the platform is for. Value first, then the ask.",
                // TODO(afi-redaccion)
                es: "El onboarding entra por la búsqueda, para que alguien explore un tema relevante antes de que se le pida nada, y cinco resúmenes personalizados enseñan para qué sirve la plataforma. Primero el valor, después la petición.",
              },
            },
          ],
        },
      },
      {
        label: {
          en: "01 — User interviews",
          // TODO(afi-redaccion)
          es: "01 — Entrevistas con usuarios",
        },
        sublabel: {
          en: "An Oxford AI professor, a White House Correspondent, and a vaccine researcher.",
          // TODO(afi-redaccion)
          es: "Un catedrático de IA de Oxford, un corresponsal de la Casa Blanca y un investigador de vacunas.",
        },
        image: "/work/audemic-onboarding/process-01-user-testing.webp",
        details: {
          heading: {
            en: "Showcase value before making an ask",
            // TODO(afi-redaccion)
            es: "Enseñar el valor antes de pedir algo",
          },
          sections: [
            {
              body: {
                en: "An Oxford AI professor, a White House Correspondent, and a vaccine researcher highlighted the importance of showcasing value before making an ask from the user, and revealed that Google Scholar lacked 'real world' search scenarios like learning methodologies.",
                // TODO(afi-redaccion)
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
          // TODO(afi-redaccion)
          es: "La selección de subtemas llegaba al 18,29 % de los registros. El 38,49 % se saltaba el onboarding directamente.",
        },
        image: "/work/audemic-onboarding/process-02-mixpanel.webp",
        details: {
          heading: {
            en: "The drop-off had a location",
            // TODO(afi-redaccion)
            es: "El abandono tenía una ubicación",
          },
          sections: [
            {
              body: {
                en: "Mix panel analysis revealed significant drop-offs during sub-topic searches, pointing to gaps in relevance and user alignment.",
                // TODO(afi-redaccion)
                es: "El análisis en Mixpanel reveló abandonos significativos durante las búsquedas de subtemas, lo que apuntaba a carencias de relevancia y de alineación con el usuario.",
              },
            },
            {
              body: {
                en: "Sign-up at 100%, the first interest question at 37.8%, continue-onboarding at 36.59%, sub-topic selection at 18.29%. Meanwhile 38.49% skipped onboarding entirely. More people skipping the flow than finishing it isn't a copy problem.",
                // TODO(afi-redaccion)
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
          // TODO(afi-redaccion)
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
            // TODO(afi-redaccion)
            es: "Formuladas como hipótesis para que pudieran fallar",
          },
          sections: [
            {
              body: {
                en: "We hypothesized that advanced filters, prioritizing search, and enriching metadata in summaries would better meet user needs. To validate, we used an iterative approach with cycles of testing and refinement.",
                // TODO(afi-redaccion)
                es: "Planteamos como hipótesis que unos filtros avanzados, dar prioridad a la búsqueda y enriquecer los metadatos de los resúmenes responderían mejor a las necesidades del usuario. Para validarlo usamos un enfoque iterativo con ciclos de prueba y refinamiento.",
              },
            },
          ],
        },
      },
    ],
  },
  mindfulme: {
    gallery: true,
    // TODO(afi-redaccion)
    tagline: {
      en: "An AI-powered meditation app personal to each user's journey",
      es: "Una app de meditación con IA personal para el camino de cada usuario",
    },
    // TODO(afi-redaccion)
    intro: {
      en: "Chinwuba had built a site where users could generate affirmations from their goals — audio guides with tips. Users liked it but wanted to edit, save, and build their own library. The problem with most mindfulness apps: generic categories, generic meditations, none of it shaped to the person using it. Mindfulme uses AI to craft meditations and affirmations that evolve with each user — so the next session knows what the last one taught.",
      es: "Chinwuba había construido una web donde los usuarios podían generar afirmaciones a partir de sus objetivos — guías de audio con consejos. Les gustaba, pero querían editar, guardar y construir su propia biblioteca. El problema con la mayoría de apps de mindfulness: categorías genéricas, meditaciones genéricas, nada moldeado a la persona que la usa. Mindfulme usa IA para crear meditaciones y afirmaciones que evolucionan con cada usuario — para que la próxima sesión sepa lo que enseñó la anterior.",
    },
    role: {
      en: "Freelance Designer & Product Lead",
      es: "Diseñador freelance y responsable de producto",
    },
    contributions: {
      en: ["Brand identity", "Product design", "User research", "MVP delivery"],
      es: [
        "Identidad de marca",
        "Diseño de producto",
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
        // TODO(afi-redaccion)
        sublabel: {
          en: "Built around personal journeys, not generic categories — AI personalizes meditation and affirmations for each user",
          es: "Construida alrededor de los caminos personales, no de categorías genéricas — la IA personaliza meditaciones y afirmaciones para cada persona",
        },
        image: "/mindfulme/screens/poster.jpg",
        span: "wide",
      },
      {
        label: { en: "Five focus areas", es: "Cinco áreas de enfoque" },
        // TODO(afi-redaccion)
        sublabel: {
          en: "Mental Health, Physical Health, Finance, Career — each with its own visual language",
          es: "Salud mental, salud física, finanzas, carrera — cada una con su propio lenguaje visual",
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
        // TODO(afi-redaccion)
        sublabel: {
          en: "Hand-drawn over sterile iconography — organic shapes, peaceful palette, genuine typography",
          es: "Dibujado a mano frente a la iconografía estéril — formas orgánicas, paleta apacible, tipografía genuina",
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
        // TODO(afi-redaccion)
        sublabel: {
          en: "Home, favorites, and personalized affirmations — every screen tuned to the user's selected focuses",
          es: "Inicio, favoritos y afirmaciones personalizadas — cada pantalla ajustada a los enfoques que la persona ha elegido",
        },
        image: "/mindfulme/screens/home-favorites-affirmation.png",
        span: "wide",
      },
      {
        label: {
          en: "Reminders, on their terms",
          es: "Recordatorios, en sus términos",
        },
        // TODO(afi-redaccion)
        sublabel: {
          en: "Customizable instead of standardized — users decide when the practice fits their day",
          es: "Personalizables, no estandarizados — la persona decide cuándo encaja la práctica en su día",
        },
        image: "/mindfulme/screens/reminders-goals-adjustment.png",
      },
      {
        label: { en: "Beyond the screen", es: "Más allá de la pantalla" },
        // TODO(afi-redaccion)
        sublabel: {
          en: "The visual language carries to merch and print — the brand has to live in three dimensions",
          es: "El lenguaje visual se traslada al merchandising y al impreso — la marca tiene que vivir en tres dimensiones",
        },
        image: "/mindfulme/screens/tote-bag-mockup.jpg",
      },
      {
        label: { en: "Color as meaning", es: "El color como significado" },
        // TODO(afi-redaccion)
        sublabel: {
          en: "Brand colors became functional indicators — orange is always the CTA, each category has its own hue",
          es: "Los colores de marca se convirtieron en indicadores funcionales — el naranja es siempre el CTA, cada categoría tiene su propio tono",
        },
        image: "/mindfulme/screens/visual-consistency.png",
        span: "wide",
      },
      {
        label: { en: "Technology that nurtures", es: "Tecnología que nutre" },
        // TODO(afi-redaccion)
        sublabel: {
          en: "Mindfulme isn't another meditation tool — it's an AI companion for self-awareness, evolving with each user",
          es: "Mindfulme no es otra herramienta de meditación más — es una compañera de IA para el autoconocimiento, que evoluciona con cada persona",
        },
        image: "/mindfulme/screens/conclusion.jpg",
        span: "wide",
      },
    ],
  },
};
