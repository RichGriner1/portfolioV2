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
      en: "Afi's Wealth Planner runs white-label for Spanish banks. Its 2026 redesign arrived as a one-line brief: make it look more modern. The product was built from static Figma screens, developers worked screen by screen, and nobody shared a definition of the word. I'm leading the work with Miguel, a freelance designer working with us part-time. We wrote the definition first, then turned it into a token vocabulary, a typeface and a layout system for the live product.",
      // TODO(afi-redaccion)
      es: "El Wealth Planner de Afi se ofrece en marca blanca a bancos españoles. Su rediseño de 2026 llegó como un encargo de una línea: que parezca más moderno. El producto estaba hecho de pantallas estáticas de Figma, los desarrolladores trabajaban pantalla a pantalla y nadie compartía una definición de esa palabra. Lidero el trabajo con Miguel, un diseñador freelance que colabora con nosotros a tiempo parcial. Primero escribimos la definición y después la convertimos en un vocabulario de tokens, una tipografía y un sistema de layout para el producto en vivo.",
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
      /* The "The product" card is pulled while the Coherence deployment is
         misbehaving. It was a full-width click-to-load embed of the identity-v2
         workbench and nothing else — no detail copy — so hiding the embed means
         removing the card rather than leaving an empty full-width frame above
         the real ones. To restore, put back:

           {
             label: { en: "The product", es: "El producto" },
             sublabel: {
               en: "Wealth Planner, running live",
               // TODO(afi-redaccion)
               es: "Wealth Planner, en vivo",
             },
             span: "full",
             iframe: "https://coherence-wealth-manager.vercel.app/workbench",
           },

         afi-design-system's first card embeds the same deployment on a different
         route, so check that one too before restoring this. */
      {
        label: { en: "Defining modern", es: "Definir moderno" },
        sublabel: {
          en: "A shared definition that guides design reviews",
          // TODO(afi-redaccion)
          es: "Una definición compartida que guía las revisiones de diseño",
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
              label: {
                en: "The problem",
                // TODO(afi-redaccion)
                es: "El problema",
              },
              body: {
                en: "The brief was one line: “Make it look more modern.” In one review, that could mean a different typeface; in another, more colour, more space or more motion. Wealth Planner was built from static Figma screens and developers worked screen by screen, so each interpretation could enter the product independently. We needed to turn the word into choices the team could see and discuss before those choices became another set of disconnected screens.",
                // TODO(afi-redaccion)
                es: "El encargo era una sola línea: «Que parezca más moderno». En una revisión podía significar otra tipografía; en otra, más color, más espacio o más movimiento. Wealth Planner estaba construido con pantallas estáticas de Figma y los desarrolladores trabajaban pantalla a pantalla, así que cada interpretación podía entrar en el producto por separado. Necesitábamos convertir esa palabra en decisiones que el equipo pudiera ver y debatir antes de que se convirtieran en otro conjunto de pantallas desconectadas.",
              },
            },
            {
              label: {
                en: "What we did",
                // TODO(afi-redaccion)
                es: "Lo que hicimos",
              },
              body: {
                en: (
                  <>
                    We compared current product interfaces and research on
                    trust, accessibility and AI-assisted UI. The same choices
                    kept appearing: essential information first, detail on
                    demand, restrained colour around dense data, visible system
                    feedback and motion tied to a state change. Those findings
                    gave us specific things to look for in Wealth Planner rather
                    than a collection of fashionable surfaces. The full research
                    became{" "}
                    <IntroPreviewLink slug="modern-ui-2026" newTab>
                      Modern UI in 2026
                    </IntroPreviewLink>
                    .
                  </>
                ),
                // TODO(afi-redaccion)
                es: (
                  <>
                    Comparamos interfaces de producto actuales e investigación
                    sobre confianza, accesibilidad y UI asistida por IA. Se
                    repetían las mismas decisiones: información esencial
                    primero, detalle bajo demanda, color contenido alrededor de
                    datos densos, feedback visible del sistema y movimiento
                    ligado a un cambio de estado. Esos hallazgos nos dieron
                    aspectos concretos que buscar en Wealth Planner, no una
                    colección de superficies de moda. La investigación completa
                    se convirtió en{" "}
                    <IntroPreviewLink slug="modern-ui-2026" newTab>
                      UI moderno en 2026
                    </IntroPreviewLink>
                    .
                  </>
                ),
              },
            },
            {
              label: {
                en: "The solution",
                // TODO(afi-redaccion)
                es: "La solución",
              },
              body: {
                en: "Our definition of modern became a short set of observable qualities: information is easy to scan, detail appears when it is useful, feedback makes state changes clear and the visual system remains restrained around financial data. Those qualities became the bridge from the brief to the nine principles. They also gave the foundations and components a purpose: typography supports scanning, colour carries meaning, and interaction explains what changed after a person acts.",
                // TODO(afi-redaccion)
                es: "Nuestra definición de moderno se convirtió en un conjunto breve de cualidades observables: la información se escanea con facilidad, el detalle aparece cuando resulta útil, el feedback aclara los cambios de estado y el sistema visual se mantiene contenido alrededor de los datos financieros. Esas cualidades conectaron el encargo con los nueve principios. También dieron un propósito a los fundamentos y componentes: la tipografía facilita la lectura, el color comunica significado y la interacción explica qué cambió después de una acción.",
              },
            },
            {
              label: {
                en: "Why it works",
                // TODO(afi-redaccion)
                es: "Por qué funciona",
              },
              body: {
                en: "A review can now test a choice against the intended experience. A dashboard with every value competing for attention fails the scan test, even if its styling feels current. A colour added to decorate a card has a weaker case than colour that marks negative data. A transition that delays the task has a weaker case than one that confirms a state change. The conversation stays tied to how Wealth Planner should work, not which reference someone prefers.",
                // TODO(afi-redaccion)
                es: "Una revisión puede comprobar una decisión frente a la experiencia buscada. Un dashboard donde todos los valores compiten por atención falla la prueba de lectura, aunque su estilo parezca actual. Un color añadido para decorar una tarjeta tiene menos sentido que uno que señala datos negativos. Una transición que retrasa la tarea tiene menos sentido que una que confirma un cambio de estado. La conversación se mantiene ligada a cómo debe funcionar Wealth Planner, no a qué referencia prefiere cada persona.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Moodboards", es: "Moodboards" },
        sublabel: {
          en: "A reference set for consistent design decisions",
          // TODO(afi-redaccion)
          es: "Un conjunto de referencias para tomar decisiones de diseño coherentes",
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
              label: {
                en: "The problem",
                // TODO(afi-redaccion)
                es: "El problema",
              },
              body: {
                en: "A broad set of references gave us plenty to react to, but it did not yet define a direction for Wealth Planner. A moodboard can collect attractive interfaces without explaining which qualities belong in the product or why. The references also came from different categories, so copying a complete visual treatment would ignore the fintech context. We needed to identify the repeated choices across the boards and separate useful commonality from details that belonged only to one reference.",
                // TODO(afi-redaccion)
                es: "Un conjunto amplio de referencias nos daba mucho que valorar, pero todavía no definía una dirección para Wealth Planner. Un moodboard puede reunir interfaces atractivas sin explicar qué cualidades pertenecen al producto ni por qué. Las referencias también procedían de categorías distintas, así que copiar un tratamiento visual completo habría ignorado el contexto fintech. Necesitábamos identificar las decisiones repetidas entre los tableros y separar los puntos comunes útiles de los detalles que solo pertenecían a una referencia.",
              },
            },
            {
              label: {
                en: "What we did",
                // TODO(afi-redaccion)
                es: "Lo que hicimos",
              },
              body: {
                en: "Miguel noticed that we kept choosing the same references: Wise, Cursor, Shopify, Clerk, Notion and Granola. We used that repetition as a signal and compared what we were responding to in each interface. The set included products outside finance as well as Wise, the only reference from our own domain. Looking across the group let us discuss recurring qualities rather than selecting one product to imitate. The boards remained reference material, not a specification for a finished screen.",
                // TODO(afi-redaccion)
                es: "Miguel vio que seguíamos eligiendo las mismas referencias: Wise, Cursor, Shopify, Clerk, Notion y Granola. Usamos esa repetición como señal y comparamos qué nos atraía de cada interfaz. El conjunto incluía productos ajenos a las finanzas y también Wise, la única referencia de nuestro sector. Mirar el grupo completo nos permitió hablar de cualidades recurrentes en lugar de elegir un producto para imitar. Los tableros siguieron siendo material de referencia, no una especificación de una pantalla terminada.",
              },
            },
            {
              label: {
                en: "The solution",
                // TODO(afi-redaccion)
                es: "La solución",
              },
              body: {
                en: "The recurring products became a focused reference set for the visual direction. Wise gave us the closest example from fintech: an interface that can remain mostly black and white while reserving colour for data that needs emphasis. Cursor, Shopify, Clerk, Notion and Granola showed how other product teams handled typography, hierarchy and interaction. We documented the specific qualities we wanted to discuss from each reference, giving the team examples to compare without treating any one product as a template.",
                // TODO(afi-redaccion)
                es: "Los productos recurrentes se convirtieron en un conjunto acotado de referencias para la dirección visual. Wise nos dio el ejemplo más cercano en fintech: una interfaz que puede mantenerse casi enteramente en blanco y negro y reservar el color para los datos que necesitan énfasis. Cursor, Shopify, Clerk, Notion y Granola mostraban cómo otros equipos resolvían la tipografía, la jerarquía y la interacción. Documentamos las cualidades concretas que queríamos debatir de cada referencia para poder compararlas sin convertir un producto en plantilla.",
              },
            },
            {
              label: {
                en: "Why it works",
                // TODO(afi-redaccion)
                es: "Por qué funciona",
              },
              body: {
                en: "The repeated references revealed a pattern we could use. Wise showed that a financial interface can stay mostly black and white and reserve colour for data. Across Cursor, Shopify, Clerk, Notion and Granola, we kept finding clear hierarchy, restrained surfaces and small interaction details that explain state. Seeing those choices recur gave each one more weight than a single screenshot. The principles then translated them for Wealth Planner, including when colour, disclosure or motion should earn a place.",
                // TODO(afi-redaccion)
                es: "Las referencias repetidas revelaron un patrón que podíamos usar. Wise mostró que una interfaz financiera puede mantenerse casi enteramente en blanco y negro y reservar el color para los datos. En Cursor, Shopify, Clerk, Notion y Granola seguíamos encontrando jerarquía clara, superficies contenidas y pequeños detalles de interacción que explican el estado. Ver esas decisiones repetirse les dio más peso que una sola captura. Después, los principios las tradujeron para Wealth Planner, incluido cuándo el color, la revelación o el movimiento se ganan un lugar.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Nine principles", es: "Nueve principios" },
        sublabel: {
          en: "Shared criteria for design and review",
          // TODO(afi-redaccion)
          es: "Criterios compartidos para diseñar y revisar",
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
              label: {
                en: "The problem",
                // TODO(afi-redaccion)
                es: "El problema",
              },
              body: {
                en: "A definition of modern could guide the visual direction, but it did not tell the team how to make repeated product decisions. Wealth Planner still needed rules for information density, disclosure, navigation and interaction. Without those rules, two screens could both look modern while handling the same situation differently. The gap was practical: a designer or developer reviewing a drawer, an expandable card or an editing flow needed criteria that went beyond resemblance to the moodboards.",
                // TODO(afi-redaccion)
                es: "Una definición de moderno podía orientar la dirección visual, pero no indicaba al equipo cómo tomar decisiones de producto recurrentes. Wealth Planner todavía necesitaba reglas para la densidad de información, la revelación progresiva, la navegación y la interacción. Sin esas reglas, dos pantallas podían parecer modernas y resolver de forma distinta la misma situación. La necesidad era práctica: quien revisara un drawer, una tarjeta expandible o un flujo de edición necesitaba criterios que fueran más allá del parecido con los moodboards.",
              },
            },
            {
              label: {
                en: "What we did",
                // TODO(afi-redaccion)
                es: "Lo que hicimos",
              },
              body: {
                en: "We wrote nine principles that translate the visual direction into product decisions. They cover choices such as showing essential information first, revealing detail on demand and preserving context with drawers, inline editing and expandable cards. We also wrote down what to avoid. Each principle therefore includes both a preferred direction and a boundary. The principles do not describe one page; they provide questions the team can apply while designing or reviewing different parts of the product.",
                // TODO(afi-redaccion)
                es: "Escribimos nueve principios que traducen la dirección visual en decisiones de producto. Cubren elecciones como mostrar primero la información esencial, revelar el detalle bajo demanda y conservar el contexto con drawers, edición en línea y tarjetas expandibles. También escribimos qué evitar. Así, cada principio incluye una dirección preferida y un límite. Los principios no describen una sola página; ofrecen preguntas que el equipo puede aplicar al diseñar o revisar distintas partes del producto.",
              },
            },
            {
              label: {
                en: "The solution",
                // TODO(afi-redaccion)
                es: "La solución",
              },
              body: {
                en: "The nine principles turn the direction into questions a reviewer can answer on a real screen. If a dashboard shows every detail at once, the principle of essential information first points toward a summary with detail on demand. If editing opens a separate page and breaks context, the team can compare that choice with inline editing or a drawer. The guidance on what to avoid marks the other edge, so each review can connect a component or flow to an agreed product behaviour.",
                // TODO(afi-redaccion)
                es: "Los nueve principios convierten la dirección en preguntas que se pueden responder sobre una pantalla real. Si un dashboard muestra todo el detalle a la vez, el principio de información esencial primero orienta hacia un resumen con detalle bajo demanda. Si la edición abre otra página y rompe el contexto, el equipo puede comparar esa opción con la edición en línea o un drawer. La guía sobre qué evitar marca el otro límite, para que cada revisión conecte un componente o flujo con un comportamiento acordado.",
              },
            },
            {
              label: {
                en: "Why it works",
                // TODO(afi-redaccion)
                es: "Por qué funciona",
              },
              body: {
                en: "The principles give designers and developers the same questions at different layers of the product. On a dashboard: can someone find the essential information first? On an expandable card: is the hidden detail available when it becomes useful? In an editing flow: can the person make the change without losing context? A principle earns its place by helping answer those decisions repeatedly. When an edge case produces a different answer, the team can discuss the rule itself instead of improvising inside one screen.",
                // TODO(afi-redaccion)
                es: "Los principios dan a diseño e ingeniería las mismas preguntas en distintas capas del producto. En un dashboard: ¿se encuentra primero la información esencial? En una tarjeta expandible: ¿aparece el detalle cuando resulta útil? En un flujo de edición: ¿se puede hacer el cambio sin perder el contexto? Un principio se gana su lugar cuando ayuda a responder esas decisiones repetidamente. Si un caso límite produce otra respuesta, el equipo puede debatir la regla en lugar de improvisar dentro de una sola pantalla.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Foundations", es: "Fundamentos" },
        sublabel: {
          en: "Tokens and typography that keep screens consistent",
          // TODO(afi-redaccion)
          es: "Tokens y tipografía que mantienen la consistencia",
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
              label: {
                en: "The problem",
                // TODO(afi-redaccion)
                es: "El problema",
              },
              body: {
                en: "Screen-by-screen design left foundational choices open to interpretation. A colour could be selected for one screen without naming the role it should play elsewhere. Typography created a separate issue for a financial product: when number patterns occupy visibly different widths, values and columns do not align as consistently. The 0000 and 4444 specimen makes that difference observable under each typeface's default figures. We needed foundations that constrained both colour usage and repeated numerical content before building larger components.",
                // TODO(afi-redaccion)
                es: "El diseño pantalla a pantalla dejaba abiertas a interpretación las decisiones fundamentales. Un color podía elegirse para una pantalla sin nombrar el rol que debía cumplir en las demás. La tipografía planteaba otro problema para un producto financiero: cuando los patrones numéricos ocupan anchos visiblemente distintos, los valores y las columnas no se alinean con la misma consistencia. La muestra de 0000 y 4444 hace observable esa diferencia con las cifras predeterminadas de cada tipografía. Necesitábamos fundamentos que limitaran el uso del color y del contenido numérico repetido antes de construir componentes mayores.",
              },
            },
            {
              label: {
                en: "What we did",
                // TODO(afi-redaccion)
                es: "Lo que hicimos",
              },
              body: {
                en: "We defined tokens by role, using names such as 'background canvas' and 'background elevated' before assigning final colour values. For typography, we compared Space Grotesk, Fira Sans, Geist and IBM Plex Sans with the same number patterns, including 0000 and 4444. The specimen used each font's default figures, so it records the behaviour a screen would receive without enabling a separate numeral feature. We compared the visible alignment rather than claiming a measured typographic property.",
                // TODO(afi-redaccion)
                es: "Definimos los tokens por rol, usando nombres como «background canvas» y «background elevated» antes de asignar valores de color finales. Para la tipografía, comparamos Space Grotesk, Fira Sans, Geist e IBM Plex Sans con los mismos patrones numéricos, incluidos 0000 y 4444. La muestra usó las cifras predeterminadas de cada fuente, por lo que registra el comportamiento que recibiría una pantalla sin activar una función numérica aparte. Comparamos la alineación visible sin afirmar una propiedad tipográfica medida.",
              },
            },
            {
              label: {
                en: "The solution",
                // TODO(afi-redaccion)
                es: "La solución",
              },
              body: {
                en: "The colour foundation is a role-based token vocabulary. A screen asks for a canvas or elevated background rather than selecting an isolated colour, and the assigned primitive can change without renaming the role. IBM Plex Sans became the type family because its default figures kept the tested number patterns most consistently aligned in the specimen. That choice is scoped to what the comparison showed; the test did not enable tabular numerals or measure every possible number, size and weight.",
                // TODO(afi-redaccion)
                es: "La base de color es un vocabulario de tokens basado en roles. Una pantalla pide un fondo canvas o elevado en lugar de elegir un color aislado, y la primitiva asignada puede cambiar sin renombrar el rol. IBM Plex Sans se convirtió en la familia tipográfica porque sus cifras predeterminadas mantuvieron los patrones probados alineados con mayor consistencia en la muestra. La elección se limita a lo observado: la prueba no activó cifras tabulares ni midió cada número, tamaño y peso posibles.",
              },
            },
            {
              label: {
                en: "Why it works",
                // TODO(afi-redaccion)
                es: "Por qué funciona",
              },
              body: {
                en: "Role-based tokens separate what a colour does from its raw value. Updating a primitive can therefore carry the change to every place that uses the semantic role, while the screen-level decision remains stable. The type specimen applies the same logic to repeated financial content: IBM Plex Sans kept the tested patterns more consistently aligned with its default figures, which supports scanning rows and columns. These foundations constrain future component choices; they do not remove the need to review real tables and states as the system grows.",
                // TODO(afi-redaccion)
                es: "Los tokens basados en roles separan lo que hace un color de su valor bruto. Actualizar una primitiva puede llevar el cambio a cada lugar que usa el rol semántico, mientras la decisión de pantalla permanece estable. La muestra tipográfica aplica la misma lógica al contenido financiero repetido: IBM Plex Sans mantuvo los patrones probados alineados con mayor consistencia usando sus cifras predeterminadas, lo que ayuda a leer filas y columnas. Estos fundamentos limitan futuras decisiones de componentes; no eliminan la necesidad de revisar tablas y estados reales a medida que crece el sistema.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Components", es: "Componentes" },
        sublabel: {
          en: "Reusable atoms for larger product patterns",
          // TODO(afi-redaccion)
          es: "Átomos reutilizables para patrones de producto",
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
              label: {
                en: "The problem",
                // TODO(afi-redaccion)
                es: "El problema",
              },
              body: {
                en: "The foundations defined colour and typography decisions, but they did not define a usable interface on their own. Wealth Planner still needed buttons, inputs, tables, dialogs and other parts with repeatable states and behaviours. Building those parts independently inside each screen would leave the same decisions open again: how a control changes state, how information is grouped and which visual rules it inherits. The next layer had to turn the foundations into reusable interface primitives before larger workflows were assembled.",
                // TODO(afi-redaccion)
                es: "Los fundamentos definían decisiones de color y tipografía, pero no creaban por sí solos una interfaz utilizable. Wealth Planner todavía necesitaba botones, inputs, tablas, diálogos y otras piezas con estados y comportamientos repetibles. Construirlas de manera independiente dentro de cada pantalla habría vuelto a dejar abiertas las mismas decisiones: cómo cambia de estado un control, cómo se agrupa la información y qué reglas visuales hereda. La siguiente capa debía convertir los fundamentos en primitivas de interfaz reutilizables antes de ensamblar flujos mayores.",
              },
            },
            {
              label: {
                en: "What we did",
                // TODO(afi-redaccion)
                es: "Lo que hicimos",
              },
              body: {
                en: "We listed the primitive components and divided the work. I took chip, badge, card and table; Miguel took tag, dialog, navbar and tabs. We built buttons, inputs, checkboxes and toggles together to establish a shared workflow and compare the output directly. The existing figure shows live components rather than screenshots, including their interactive states. This kept the work focused on components that can run in code while the corresponding documentation remains available in Figma for design and review.",
                // TODO(afi-redaccion)
                es: "Listamos los componentes primitivos y repartimos el trabajo. Yo cogí chip, badge, card y table; Miguel cogió tag, dialog, navbar y tabs. Construimos juntos botones, inputs, checkboxes y toggles para establecer un flujo compartido y comparar directamente el resultado. La figura existente muestra componentes en vivo, no capturas, incluidos sus estados interactivos. Así el trabajo se centra en componentes que funcionan en código mientras la documentación correspondiente permanece disponible en Figma para diseñar y revisar.",
              },
            },
            {
              label: {
                en: "The solution",
                // TODO(afi-redaccion)
                es: "La solución",
              },
              body: {
                en: "The resulting layer consists of reusable chips, badges, cards, tables, tags, dialogs, navigation, tabs and form controls. Each primitive carries the relevant foundation choices and defines the states or behaviours visible in the live component. Larger patterns can combine these parts when a product need appears instead of starting with a one-off screen. The current library covers the atoms we have designed and tested so far. Complex Wealth Planner patterns will be added as the redesign reaches them.",
                // TODO(afi-redaccion)
                es: "La capa resultante reúne chips, badges, cards, tablas, tags, diálogos, navegación, tabs y controles de formulario reutilizables. Cada primitiva lleva las decisiones de fundamentos que le corresponden y define los estados o comportamientos visibles en el componente en vivo. Los patrones mayores pueden combinar estas piezas cuando aparece una necesidad de producto, en lugar de empezar con una pantalla aislada. La librería actual cubre los átomos diseñados y probados hasta ahora. Los patrones complejos de Wealth Planner se añadirán a medida que el rediseño llegue a ellos.",
              },
            },
            {
              label: {
                en: "Why it works",
                // TODO(afi-redaccion)
                es: "Por qué funciona",
              },
              body: {
                en: "A larger pattern built from the shared primitives inherits decisions that have already been made in the buttons, inputs, tables and dialogs it contains. The states and behaviours travel with the component rather than being redefined for each workflow. That makes consistency concrete: the same checkbox state, dialog structure or table treatment can recur wherever the primitive is used. It also gives the team a smaller unit to review and adjust before that decision appears across several product patterns.",
                // TODO(afi-redaccion)
                es: "Un patrón mayor construido con las primitivas compartidas hereda decisiones ya tomadas en los botones, inputs, tablas y diálogos que contiene. Los estados y comportamientos viajan con el componente en lugar de redefinirse para cada flujo. Así la consistencia se vuelve concreta: el mismo estado de checkbox, la misma estructura de diálogo o el mismo tratamiento de tabla pueden repetirse donde se use la primitiva. También ofrece al equipo una unidad menor que revisar y ajustar antes de que la decisión aparezca en varios patrones de producto.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Micro-interactions", es: "Microinteracciones" },
        sublabel: {
          en: "Shared motion behaviours across the product",
          // TODO(afi-redaccion)
          es: "Comportamientos de movimiento compartidos",
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
              label: {
                en: "The problem",
                // TODO(afi-redaccion)
                es: "El problema",
              },
              body: {
                en: "A static component can show its resting appearance without explaining what happens when a user acts. It does not specify how a checkbox confirms selection, how a toggle moves between states or how a send action communicates progress and completion. If those responses are decided separately inside each feature, timing and feedback can drift even when the components share colour and typography. The interaction layer therefore needed rules for state changes as well as visual foundations for the states themselves.",
                // TODO(afi-redaccion)
                es: "Un componente estático puede mostrar su apariencia en reposo sin explicar qué ocurre cuando una persona actúa. No especifica cómo confirma la selección un checkbox, cómo cambia de estado un toggle ni cómo una acción de envío comunica progreso y finalización. Si esas respuestas se deciden por separado dentro de cada funcionalidad, los tiempos y el feedback pueden desviarse aunque los componentes compartan color y tipografía. La capa de interacción necesitaba reglas para los cambios de estado además de fundamentos visuales para los propios estados.",
              },
            },
            {
              label: {
                en: "What we did",
                // TODO(afi-redaccion)
                es: "Lo que hicimos",
              },
              body: {
                en: "We reverse-engineered animations from the interfaces that informed the visual direction. In other cases, we started with a React animation library, ported the code to Angular and iterated from there. The visible figure makes the resulting interaction cases inspectable: a checkbox draws its check, a radio fills, a toggle changes position and a send button moves through sending and sent. These examples let us discuss feedback, timing and state changes as product rules rather than decorative motion.",
                // TODO(afi-redaccion)
                es: "Analizamos las animaciones de las interfaces que orientaron la dirección visual. En otros casos partimos de una librería de animación de React, portamos el código a Angular e iteramos desde ahí. La figura visible permite inspeccionar los casos resultantes: un checkbox dibuja su marca, un radio se rellena, un toggle cambia de posición y un botón de envío pasa por enviando y enviado. Estos ejemplos permiten debatir el feedback, los tiempos y los cambios de estado como reglas de producto y no como movimiento decorativo.",
              },
            },
            {
              label: {
                en: "The solution",
                // TODO(afi-redaccion)
                es: "La solución",
              },
              body: {
                en: "The interaction layer documents reusable feedback, timing and state-change rules through concrete controls. Selection is shown by the checkbox draw and radio fill. A toggle links its movement to the change between off and on. The send action exposes a short sequence from the initial action to sending and then sent. These examples define how a component acknowledges input and communicates state. They establish the first interaction rules; transitions for larger workflows will be defined as those flows are built.",
                // TODO(afi-redaccion)
                es: "La capa de interacción documenta reglas reutilizables de feedback, tiempos y cambios de estado mediante controles concretos. La selección se muestra con el trazo del checkbox y el relleno del radio. Un toggle vincula su movimiento al cambio entre apagado y encendido. La acción de envío expone una secuencia breve desde la acción inicial hasta enviando y después enviado. Estos ejemplos definen cómo un componente reconoce una entrada y comunica su estado. Establecen las primeras reglas; las transiciones de flujos mayores se definirán al construirlos.",
              },
            },
            {
              label: {
                en: "Why it works",
                // TODO(afi-redaccion)
                es: "Por qué funciona",
              },
              body: {
                en: "When a larger pattern includes one of these controls, it can reuse the established response instead of inventing new feedback. A checkbox can draw its check in the same way across forms, a toggle can communicate its state with the same movement, and a send action can expose progress through the same sequence. The benefit is behavioural consistency at a visible level. Reuse also makes later review more focused because timing or feedback can be discussed at the interaction rule rather than rediscovered in each workflow.",
                // TODO(afi-redaccion)
                es: "Cuando un patrón mayor incluye uno de estos controles, puede reutilizar la respuesta establecida en lugar de inventar un feedback nuevo. Un checkbox puede dibujar su marca de la misma forma en distintos formularios, un toggle puede comunicar su estado con el mismo movimiento y una acción de envío puede mostrar el progreso mediante la misma secuencia. El beneficio es una consistencia de comportamiento visible. La reutilización también centra las revisiones posteriores: los tiempos o el feedback se debaten en la regla de interacción y no se redescubren en cada flujo.",
              },
            },
          ],
        },
      },
      {
        label: { en: "Structure", es: "Estructura" },
        sublabel: {
          en: "Product structure based on user value",
          // TODO(afi-redaccion)
          es: "Estructura de producto basada en el valor para el usuario",
        },
        span: "wide",
        animation: "canvas",
        details: {
          heading: {
            en: "Organising the product around user value",
            // TODO(afi-redaccion)
            es: "Organizar el producto en torno al valor para el usuario",
          },
          sections: [
            {
              label: {
                en: "The problem",
                // TODO(afi-redaccion)
                es: "El problema",
              },
              body: {
                en: "The existing structure followed the order in which a financial plan was built. That sequence separated Diagnóstico from Plan de acción even though both contribute to the user's understanding of their situation and what to do next. Organising around production order can make each page internally valid while leaving the relationship between pages implicit. The redesign needed a structure that named the value of each area and kept related information together without removing the ability to reveal deeper detail when required.",
                // TODO(afi-redaccion)
                es: "La estructura existente seguía el orden en el que se construía un plan financiero. Esa secuencia separaba Diagnóstico de Plan de acción aunque ambos contribuyen a que la persona entienda su situación y qué hacer después. Organizar por orden de producción puede hacer que cada página sea válida por separado y dejar implícita la relación entre ellas. El rediseño necesitaba una estructura que nombrara el valor de cada área y mantuviera junta la información relacionada sin eliminar la posibilidad de revelar más detalle cuando hiciera falta.",
              },
            },
            {
              label: {
                en: "What we did",
                // TODO(afi-redaccion)
                es: "Lo que hicimos",
              },
              body: {
                en: "During discovery we reviewed comparable financial products and found structures that support a quick read at a glance with deeper information available on demand. We then mapped all ~15 Wealth Planner screens to a statement describing the value each one gives the user. The exercise shifted the unit of discussion from the order used to build a plan to the question a person is trying to answer. It also made overlaps between existing pages visible before we proposed a new grouping.",
                // TODO(afi-redaccion)
                es: "Durante discovery revisamos productos financieros comparables y encontramos estructuras que permiten una lectura rápida de un vistazo con información más profunda disponible bajo demanda. Después mapeamos las ~15 pantallas de Wealth Planner a una declaración del valor que cada una aporta al usuario. El ejercicio cambió la unidad de debate: pasó del orden usado para construir un plan a la pregunta que una persona intenta responder. También hizo visibles los solapamientos entre páginas existentes antes de proponer una nueva agrupación.",
              },
            },
            {
              label: {
                en: "The solution",
                // TODO(afi-redaccion)
                es: "La solución",
              },
              body: {
                en: "We organised the proposed product structure around those value statements. Conclusiones brings Diagnóstico and Plan de acción into one dashboard because both contribute to the same user question: 'what's my situation and what do I do about it?' The dashboard provides the quick read identified during discovery, while the broader principle of revealing detail on demand leaves room for deeper information. This is the first proposed grouping from the map. The remaining screens still need the same content-level evaluation before their structure is settled.",
                // TODO(afi-redaccion)
                es: "Organizamos la estructura propuesta del producto en torno a esas declaraciones de valor. Conclusiones reúne Diagnóstico y Plan de acción en un único dashboard porque ambos contribuyen a responder la misma pregunta del usuario: «¿cuál es mi situación y qué hago con ella?». El dashboard ofrece la lectura rápida identificada durante discovery, mientras el principio de revelar detalle bajo demanda deja espacio para información más profunda. Esta es la primera agrupación propuesta a partir del mapa. Las pantallas restantes aún necesitan la misma evaluación de contenido antes de cerrar su estructura.",
              },
            },
            {
              label: {
                en: "Why it works",
                // TODO(afi-redaccion)
                es: "Por qué funciona",
              },
              body: {
                en: "A value statement gives each area a reason to exist that can be checked independently of the old build sequence. Related information can be grouped when it answers the same question, as with Diagnóstico and Plan de acción inside Conclusiones. The quick-read layer supports orientation, and detail on demand preserves access to the underlying information without putting everything on the first view. This reasoning can be applied to the remaining mapped screens while the work continues, but each grouping still needs to be evaluated against its specific content.",
                // TODO(afi-redaccion)
                es: "Una declaración de valor da a cada área una razón de existir que puede comprobarse al margen de la antigua secuencia de construcción. La información relacionada puede agruparse cuando responde a la misma pregunta, como Diagnóstico y Plan de acción dentro de Conclusiones. La capa de lectura rápida facilita la orientación y el detalle bajo demanda conserva el acceso a la información subyacente sin colocarlo todo en la primera vista. Este razonamiento puede aplicarse al resto de pantallas mapeadas mientras continúa el trabajo, pero cada agrupación debe evaluarse según su contenido específico.",
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
