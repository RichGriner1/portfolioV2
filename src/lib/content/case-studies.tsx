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
          en: "Playground: try the live component",
          es: "Playground: prueba el componente en vivo",
        },
        // TODO(afi-redaccion)
        sublabel: {
          en: "This page is the v1 MVP: built to put the concept in front of the teams and collect the first round of feedback. A more developed version exists internally and isn't public, so it isn't shown here. The full app is password-protected. Email richardgrinerdesigns@gmail.com for a walkthrough.",
          // TODO(afi-redaccion)
          es: "Esta página es el MVP v1: se construyó para poner el concepto delante de los equipos y recoger las primeras reacciones. Existe una versión más desarrollada de uso interno que no es pública, así que no se muestra aquí. La app entera está protegida por contraseña: escríbeme a richardgrinerdesigns@gmail.com para un recorrido.",
        },
        iframe:
          "https://coherence-wealth-manager.vercel.app/componentes/segmented-control",
        span: "full",
      },
      {
        label: {
          en: "Token Architecture",
          es: "Arquitectura de tokens",
        },
        sublabel: {
          en: "Three tiers: primitive, semantic, component. A brand change happens at the token, not in twenty files.",
          es: "Tres niveles: primitivo, semántico y componente. Un cambio de marca ocurre en el token, no en veinte archivos.",
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
          ],
        },
        animation: "layers",
      },
      {
        label: {
          en: "White-label at Scale",
          es: "White-label a escala",
        },
        sublabel: {
          en: "Swap the tokens, ship the next bank. The components don't change, the brand does.",
          es: "Intercambia los tokens, lanza el siguiente banco. Los componentes no cambian, la marca sí.",
        },
        details: {
          heading: {
            en: "Quick to re-skin, but the patterns get lost",
            es: "Rápido de cambiar de skin, pero los patrones se pierden",
          },
          sections: [
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
          en: "Designer Handoff & Feedback Tool",
          es: "Herramienta de entrega y feedback de diseño",
        },
        sublabel: {
          en: "Pin feedback to the design where the work is, so nothing lives in a chat thread anymore.",
          es: "Fija el feedback sobre el diseño donde está el trabajo, para que nada se quede atrapado en un hilo de chat.",
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
        animation: "comment-pins",
      },
      {
        label: {
          en: "Documentation & Downloadable Brand Assets",
          es: "Documentación y recursos de marca descargables",
        },
        // TODO(afi-redaccion)
        sublabel: {
          en: "Brand assets and token sets anyone can download, so a decision made once doesn't get re-litigated with the next team.",
          es: "Recursos de marca y sets de tokens que cualquiera puede descargar, para que una decisión tomada una vez no se vuelva a discutir con el siguiente equipo.",
        },
        // `nodes` — the one-repo-everyone-reads-from animation, which came free when
        // the Unified Design Platform card was cut. It's the better fit: this card is
        // about one shared source reaching every team, which is what that figure draws.
        // `asset-portal` was a download tray, and drew the mechanism rather than the point.
        animation: "nodes",
        // Pairs with the handoff card on the same row — the two halves of the same
        // idea, feedback coming back and the artifact going out. Neither is `wide`:
        // two wide cards stack instead of sitting side by side, and dropping both
        // spans leaves six single columns, which is three clean rows of two.
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
          en: "Token Inspector",
          es: "Inspector de tokens",
        },
        sublabel: {
          en: "Hover any component on the demo to reveal the tokens behind it, so developers code against the same variables the system enforces.",
          es: "Pasa el cursor sobre cualquier componente en la demo para revelar los tokens que hay detrás, para que los desarrolladores codifiquen contra las mismas variables que el sistema impone.",
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
        animation: "token-inspect",
      },
      {
        label: {
          en: "Component Playground",
          es: "Playground de componentes",
        },
        sublabel: {
          en: "Every component, every state, with copyable code, so a developer grabs the snippet and ships.",
          es: "Cada componente, cada estado, con código copiable, para que un desarrollador coja el snippet y lo lance.",
        },
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
        animation: "playground",
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
      en: "Afi's Wealth Planner runs white-label for Spanish banks. Its 2026 redesign arrived as a one-line brief: make it look more modern. The product underneath was static Figma screens, developers working screen by screen, and nobody sharing a definition of the word. So we wrote the definition first. What started as one line is now a token vocabulary, a typeface and a layout system running in the live product.",
      // TODO(afi-redaccion)
      es: "El Wealth Planner de Afi se ofrece en marca blanca a bancos españoles. Su rediseño de 2026 llegó como un encargo de una línea: que parezca más moderno. Debajo había un producto hecho de pantallas estáticas de Figma, donde los desarrolladores trabajaban pantalla a pantalla y nadie compartía una definición de esa palabra. Así que escribimos la definición primero. Lo que empezó como una línea es hoy un vocabulario de tokens, una tipografía y un sistema de layout que corre en el producto en vivo.",
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
        "Layout & charts",
      ],
      // TODO(afi-redaccion)
      es: [
        "Estrategia de marca",
        "Definición de personas",
        "Principios de diseño",
        "Tipografía y tokens",
        "Diseño de microinteracciones",
        "Layout y gráficas",
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
      {
        label: { en: "The product", es: "El producto" },
        sublabel: {
          en: "Wealth Planner, running live",
          // TODO(afi-redaccion)
          es: "Wealth Planner, en vivo",
        },
        span: "full",
        // The identity-v2 workbench on the live Coherence deployment: tokens,
        // type and components from this case study, running as real code. Same
        // click-to-load embed treatment as afi-design-system's first card.
        iframe: "https://coherence-wealth-manager.vercel.app/workbench",
      },
      {
        label: { en: "Defining modern", es: "Definir moderno" },
        sublabel: {
          en: "A shared definition, before Figma",
          // TODO(afi-redaccion)
          es: "Una definición compartida, antes de Figma",
        },
        // The process-stages clip the work tile already uses. An abstract
        // glyph for "we defined what modern means" kept coming out as a
        // diagram about something else; the real design work reads better
        // than a metaphor for it.
        video: "/work/visual-identity/process-stages",
        details: {
          heading: {
            en: "Taste arguing with taste decides nothing",
            // TODO(afi-redaccion)
            es: "El gusto discutiendo con el gusto no decide nada",
          },
          sections: [
            {
              body: {
                en: "Before opening Figma we wanted to define what 'modern' meant. Otherwise every review turns into a debate about what people like versus what they don't. Without a shared definition, taste argues with taste and nothing gets decided.",
                // TODO(afi-redaccion)
                es: "Antes de abrir Figma queríamos definir qué significaba «moderno». Si no, cada revisión se convierte en un debate sobre lo que gusta y lo que no. Sin una definición compartida, el gusto discute con el gusto y no se decide nada.",
              },
            },
            {
              body: {
                en: (
                  <>
                    The research behind that definition became its own piece:{" "}
                    <IntroPreviewLink slug="modern-ui-2026" newTab>
                      Modern UI in 2026
                    </IntroPreviewLink>
                    .
                  </>
                ),
                // TODO(afi-redaccion)
                es: (
                  <>
                    La investigación detrás de esa definición acabó siendo su
                    propia pieza:{" "}
                    <IntroPreviewLink slug="modern-ui-2026" newTab>
                      UI moderno en 2026
                    </IntroPreviewLink>
                    .
                  </>
                ),
              },
            },
          ],
        },
      },
      {
        label: { en: "Moodboards", es: "Moodboards" },
        sublabel: {
          en: "Two boards, one shortlist",
          // TODO(afi-redaccion)
          es: "Dos tableros, una lista corta",
        },
        animation: "vi-moodboard",
        details: {
          heading: {
            en: "The same names kept surfacing",
            // TODO(afi-redaccion)
            es: "Los mismos nombres aparecían una y otra vez",
          },
          sections: [
            {
              body: {
                en: 'Miguel noticed the pattern first: "We kept choosing the same apps over and over again. Maybe this is the vibe we want to go for." The same names surfaced in both boards, and that became the shortlist: Wise, Cursor, Shopify, Clerk, Notion, Granola.',
                // TODO(afi-redaccion)
                es: "Miguel vio el patrón primero: «Elegíamos las mismas apps una y otra vez. Quizá este es el rollo que buscamos». Los mismos nombres salían en ambos tableros, y esa fue la lista corta: Wise, Cursor, Shopify, Clerk, Notion, Granola.",
              },
            },
            {
              body: {
                en: "Wise was the only reference from our own domain. It's proof that a fintech can run almost entirely black and white and put colour only where the data needs it.",
                // TODO(afi-redaccion)
                es: "Wise era la única referencia de nuestro propio sector. Es la prueba de que una fintech puede funcionar casi entera en blanco y negro y poner color solo donde los datos lo piden.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Nine principles", es: "Nueve principios" },
        sublabel: {
          en: "Something a team can cite in review",
          // TODO(afi-redaccion)
          es: "Algo que el equipo puede citar en una revisión",
        },
        animation: "vi-nine-principles",
        details: {
          heading: {
            en: "Principles for the team",
            // TODO(afi-redaccion)
            es: "Principios para el equipo",
          },
          sections: [
            {
              body: {
                en: "Show the essential first and reveal detail when the user asks for it. Everything else is one click away, not on the first screen. Keep the user where they are: drawers, inline editing and expandable cards instead of sending them to another page.",
                // TODO(afi-redaccion)
                es: "Mostrar primero lo esencial y revelar el detalle cuando el usuario lo pide: todo lo demás queda a un clic, no en la primera pantalla. Mantener al usuario donde está: drawers, edición en línea y tarjetas expandibles en lugar de mandarlo a otra página.",
              },
            },
            {
              body: {
                en: "We also wrote down what to avoid, because knowing what you are is incomplete without knowing what you are not.",
                // TODO(afi-redaccion)
                es: "También escribimos qué evitar, porque saber qué somos está incompleto sin saber qué no somos.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Foundations", es: "Fundamentos" },
        sublabel: {
          en: "Tokens as roles, and a typeface that held",
          // TODO(afi-redaccion)
          es: "Tokens como roles, y una tipografía que aguantó",
        },
        animation: "vi-type-test",
        details: {
          heading: {
            en: "Black and white first",
            // TODO(afi-redaccion)
            es: "Primero blanco y negro",
          },
          sections: [
            {
              body: {
                en: "A token is a role: 'background canvas', 'background elevated'. Defining that vocabulary before the palette means choosing colours later is a quick change. Update the primitive and every screen moves with it.",
                // TODO(afi-redaccion)
                es: "Un token es un rol: «background canvas», «background elevated». Definir ese vocabulario antes que la paleta hace que elegir colores después sea un cambio rápido: actualizas la primitiva y todas las pantallas se mueven con ella.",
              },
            },
            {
              body: {
                en: "For typography we tested Space Grotesk, Fira Sans and Geist, and none passed the width test across number patterns (0000 vs 4444). IBM Plex Sans held the same widths, so it became the type family.",
                // TODO(afi-redaccion)
                es: "En tipografía probamos Space Grotesk, Fira Sans y Geist, y ninguna pasó la prueba de ancho entre patrones numéricos (0000 vs 4444). IBM Plex Sans se mantuvo constante, así que fue la familia elegida.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Components", es: "Componentes" },
        sublabel: {
          en: "Built in code, documented in Figma",
          // TODO(afi-redaccion)
          es: "Construidos en código, documentados en Figma",
        },
        animation: "vi-components",
        details: {
          heading: {
            en: "Primitives first, patterns on demand",
            // TODO(afi-redaccion)
            es: "Primero primitivas, patrones bajo demanda",
          },
          sections: [
            {
              body: {
                en: "With foundations set we listed the primitive components and split them: I took chip, badge, card and table; Miguel took tag, dialog, navbar and tabs. Buttons, inputs, checkboxes and toggles we built together, to work out a shared workflow and get similar output.",
                // TODO(afi-redaccion)
                es: "Con los fundamentos fijados listamos los componentes primitivos y los repartimos: yo cogí chip, badge, card y table; Miguel tag, dialog, navbar y tabs. Botones, inputs, checkboxes y toggles los hicimos juntos, para afinar un flujo compartido y obtener resultados parecidos.",
              },
            },
            {
              body: {
                en: "Primitives first because they're what everything else assembles from. The complex patterns only get built when we need them.",
                // TODO(afi-redaccion)
                es: "Primitivas primero porque son de lo que se ensambla todo lo demás. Los patrones complejos solo se construyen cuando hacen falta.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Micro-interactions", es: "Microinteracciones" },
        sublabel: {
          en: "Reverse-engineered, then ported",
          // TODO(afi-redaccion)
          es: "Analizadas y luego portadas",
        },
        animation: "vi-micro",
        details: {
          heading: {
            en: "We didn't invent most of the motion",
            // TODO(afi-redaccion)
            es: "No inventamos casi ningún movimiento",
          },
          sections: [
            {
              body: {
                en: "We reverse-engineered the animations that inspired us, or took a React animation library, ported the code to Angular and iterated from there.",
                // TODO(afi-redaccion)
                es: "Analizamos las animaciones que nos inspiraban, o cogimos una librería de animación de React, portamos el código a Angular e iteramos desde ahí.",
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
  "audemic-growth": {
    tagline: {
      en: "Pivoting a B2C research app to B2B enterprise",
      es: "Pivotando una app de investigación B2C hacia B2B enterprise",
    },
    intro: {
      en: "Audemic Scholar had built a loyal B2C user base at $8K/month — but students graduate, and investors were right to worry about where growth was coming from. We ran discovery interviews with UN analysts and vaccine researchers and found a bigger story: researchers lose 20 hours a month to information retrieval, costing organizations like NIH close to $10M monthly. We launched a Beta — a 24/7 junior analyst powered by AI — and captured 20 qualified leads in a single week through paid ads. From there, iteration: better summaries on OpenAI and Claude, an audio redesign built around how researchers actually work, and a prioritization framework that kept the roadmap honest.",
      es: "Audemic Scholar había construido una base de usuarios B2C fiel en torno a los 8 K $/mes — pero los estudiantes se gradúan, y los inversores hacían bien en preocuparse por de dónde vendría el crecimiento. Realizamos entrevistas de descubrimiento con analistas de la ONU e investigadores de vacunas y encontramos una historia mayor: los investigadores pierden 20 horas al mes en recuperar información, lo que cuesta a organizaciones como el NIH cerca de 10 M $ mensuales. Lanzamos una beta — un analista junior 24/7 impulsado por IA — y captamos 20 leads cualificados en una sola semana con anuncios de pago. A partir de ahí, iteración: mejores resúmenes en OpenAI y Claude, un rediseño del audio construido alrededor de cómo trabajan realmente los investigadores, y un marco de priorización que mantuvo honesta la hoja de ruta.",
    },
    role: {
      en: "Product Manager & UX Designer",
      es: "Product manager y diseñador UX",
    },
    contributions: {
      en: [
        "Product strategy",
        "User research",
        "AI prompting",
        "Growth experiments",
        "Prototype design",
      ],
      es: [
        "Estrategia de producto",
        "Investigación con usuarios",
        "Prompting de IA",
        "Experimentos de crecimiento",
        "Diseño de prototipos",
      ],
    },
    bento: [
      {
        label: {
          en: "B2C → B2B Pivot",
          es: "Pivote de B2C a B2B",
        },
        sublabel: {
          en: "Students were the loyal base. Professionals were the market.",
          es: "Los estudiantes eran la base fiel. Los profesionales eran el mercado.",
        },
        animation: "audience-pivot",
        span: "wide",
      },
      {
        label: {
          en: "20 Hours Lost a Month",
          es: "20 horas perdidas al mes",
        },
        sublabel: {
          en: "Per researcher. ~$10M monthly for NIH-sized orgs.",
          es: "Por investigador. ~10 M $ mensuales para organizaciones del tamaño del NIH.",
        },
        animation: "hours-stat",
      },
      {
        label: {
          en: "20 Leads in 7 Days",
          es: "20 leads en 7 días",
        },
        sublabel: {
          en: "Paid ads validated the new direction in a week.",
          es: "Los anuncios de pago validaron la nueva dirección en una semana.",
        },
        animation: "leads-funnel",
      },
      {
        label: {
          en: "AI Summary Refinement",
          es: "Refinamiento de resúmenes con IA",
        },
        sublabel: {
          en: "Iterating between OpenAI and Claude models based on user feedback.",
          es: "Iterando entre los modelos de OpenAI y Claude a partir del feedback de los usuarios.",
        },
        animation: "model-iteration",
        span: "wide",
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
