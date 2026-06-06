import type { Bilingual } from "@/lib/i18n";

export type DetailSection = {
  label: Bilingual<string>;
  body: Bilingual<string>;
};

export type BentoCard = {
  label: Bilingual<string>;
  sublabel: Bilingual<string>;
  span?: "wide" | "tall" | "full";
  details?: {
    heading: Bilingual<string>;
    sections: DetailSection[];
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
    | "motion-tokens";
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
      en: "Afi ships white-label fintech products to banks. I'm the only designer. The brief: build a system that gets sharper with every client, not slower. So we built it — three-tier tokens in Figma, one repo where designers, developers, and AI agents read the same files, and a feedback tool that pins comments to the design instead of losing them in chat. Each rollout teaches the system. AI is how the next rollout starts where the last one ended.",
      // TODO(afi-redaccion)
      es: "Afi desarrolla productos fintech white-label para bancos. Yo soy el único diseñador. El brief: construir un sistema que gane precisión con cada cliente, no que pierda. Y lo construimos — tokens en tres niveles dentro de Figma, un único repositorio del que leen diseñadores, desarrolladores y agentes de IA, y una herramienta que fija los comentarios sobre el diseño en lugar de perderlos en el chat. Cada proyecto le enseña algo al sistema. La IA es lo que hace que el siguiente arranque donde terminó el anterior.",
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
          en: "Playground — try the live component",
          es: "Playground — prueba el componente en vivo",
        },
        // TODO(afi-redaccion)
        sublabel: {
          en: "v1, live with our first banks. Click around to see how the tokens drive every state. The full app is password-protected — email richardgrinerdesigns@gmail.com for a walkthrough.",
          es: "v1, en producción con nuestros primeros bancos. Haz clic por aquí para ver cómo los tokens mueven cada estado. La app entera está protegida por contraseña — escríbeme a richardgrinerdesigns@gmail.com para un recorrido.",
        },
        iframe:
          "https://coherence-wealth-manager.vercel.app/componentes/segmented-control",
        span: "full",
      },
      {
        label: {
          en: "Unified Design Platform",
          es: "Plataforma de diseño unificada",
        },
        sublabel: {
          en: "One repo for designers, developers, and AI agents — so everyone opens the same files instead of chasing different versions.",
          es: "Un solo repositorio para diseñadores, desarrolladores y agentes de IA — para que todos abran los mismos archivos en lugar de perseguir versiones distintas.",
        },
        details: {
          heading: {
            en: "One repo, everyone on the same rulebook",
            es: "Un solo repositorio, todos con el mismo manual de reglas",
          },
          sections: [
            {
              label: { en: "The problem", es: "El problema" },
              body: {
                en: "Design docs lived in Microsoft Teams threads and email attachments. `design.md` sent over chat. Figma annotations emailed to developers who lost the thread. When a designer needed to know what shipped, they had to ask. There was no single source a designer or developer could open with the certainty that it was current.",
                es: "La documentación de diseño se repartía entre hilos de Microsoft Teams y archivos adjuntos del correo. Un `design.md` enviado por chat, las anotaciones de Figma reenviadas a los desarrolladores y, a partir de ahí, todos terminaban perdiendo el hilo. Si un diseñador quería saber qué se había implementado, no le quedaba más remedio que preguntar. No había una fuente única que el equipo pudiera abrir con la confianza de que estaba al día.",
              },
            },
            {
              label: { en: "What we did", es: "Lo que hicimos" },
              body: {
                en: "Built one repo with two clear folders — `design/` for the rulebook and token snapshots, `engineering/` for Angular conventions and test patterns. Put `AGENTS.md` at the root as the canonical brief and `CLAUDE.md` as a one-line redirect so every AI tool opens the same page.",
                es: "Hemos montado un único repositorio con dos carpetas bien delimitadas: `design/` para el manual de reglas y las instantáneas de tokens, y `engineering/` para las convenciones de Angular y los patrones de pruebas. En la raíz, `AGENTS.md` hace las veces de guía maestra y `CLAUDE.md` actúa como redirección de una sola línea, para que cualquier herramienta de IA parta de la misma página.",
              },
            },
            {
              label: { en: "The solution", es: "La solución" },
              body: {
                en: "A converged home where designers, developers, and AI agents read from the same files. The `showcase/` app sits on top — an Angular 21 prototype where hover states, transitions, and loading patterns are proven before engineering picks them up.",
                es: "Un punto de convergencia en el que diseñadores, desarrolladores y agentes de IA leen los mismos archivos. La app `showcase/` se asienta sobre esa base: un prototipo en Angular 21 en el que los estados hover, las transiciones y los patrones de carga quedan probados antes de que ingeniería los integre.",
              },
            },
            {
              label: { en: "Why it works", es: "Por qué funciona" },
              body: {
                en: "The decision is encoded once and the system enforces it, not a person. The `.claude/skills/` folder extends the idea — small skills like the Spanish-writing one fire automatically when an agent produces Spanish copy, keeping tone consistent without manual policing.",
                es: "La decisión queda codificada una sola vez, y es el sistema —no una persona— quien la hace cumplir. La carpeta `.claude/skills/` extiende esa lógica: skills concretas como la de redacción en español saltan automáticamente cuando un agente produce texto en castellano y mantienen el tono coherente sin necesidad de supervisión manual.",
              },
            },
          ],
        },
        animation: "nodes",
        span: "tall",
      },
      {
        label: {
          en: "Token Architecture",
          es: "Arquitectura de tokens",
        },
        sublabel: {
          en: "Three tiers — primitive, semantic, component — so a brand change happens at the token, not in twenty files.",
          es: "Tres niveles — primitivo, semántico, componente — para que un cambio de marca ocurra en el token, no en veinte archivos.",
        },
        details: {
          heading: {
            en: "Three tiers — and where drift hides",
            es: "Tres niveles — y dónde se esconde la deriva",
          },
          sections: [
            {
              label: { en: "The problem", es: "El problema" },
              body: {
                en: "PrimeNG's library exposed a single `primary` slot, but Afi runs two blues. AzulProfundo passes AA on small text in light mode where bright `azulafi` doesn't; `azulafi` takes dark mode, where dark surfaces give it the contrast it needs. Same role, two palettes — and PrimeNG had no place to encode that. Naming inconsistencies piled up between Figma and code. Each custom semantic was a place things could quietly disagree.",
                es: "La librería de PrimeNG ofrecía un único slot, `primary`, pero en Afi manejamos dos azules. AzulProfundo supera el contraste AA en texto pequeño en modo claro, donde el `azulafi` brillante se queda corto; en cambio, `azulafi` se reserva para el modo oscuro, ya que las superficies oscuras le aportan el contraste que necesita. El mismo rol, dos paletas: PrimeNG no tenía dónde codificar esa distinción. Las inconsistencias de nomenclatura entre Figma y código se iban acumulando, y cada semántico personalizado se convertía en un punto en el que las cosas podían discrepar en silencio.",
              },
            },
            {
              label: { en: "What we did", es: "Lo que hicimos" },
              body: {
                en: "Sorted every variable into three tiers. Tier 1: 87 primitives — raw atoms like a hex or a pixel number. Tier 2: 39 semantic numbers — aliases like `spacing/md` that reference primitives but carry intent. Tier 3: 22 Afi custom semantics — component-level overrides PrimeNG didn't expose, like `p-datatable/padding/normal`. Then audited all 22 against the semantic layer.",
                es: "Hemos ordenado cada variable en tres niveles. Nivel 1: 87 primitivos, átomos en bruto como un hex o un número en píxeles. Nivel 2: 39 números semánticos, alias del tipo `spacing/md` que apuntan a primitivos pero ya cargan intención. Nivel 3: 22 semánticos personalizados de Afi, sobreescrituras a nivel de componente que PrimeNG no exponía, como `p-datatable/padding/normal`. A continuación, hemos auditado los 22 contra la capa semántica.",
              },
            },
            {
              label: { en: "The solution", es: "La solución" },
              body: {
                en: "A token doc that names the palette, not the role. The rulebook reaches for `AzulProfundo` and `azulafi` directly — not a generic `primary` slot — so the agent reading the file pastes the right blue into the right surface.",
                es: "Un documento de tokens que nombra la paleta, no el rol. El manual apunta directamente a `AzulProfundo` y a `azulafi`, no a un slot genérico llamado `primary`, de modo que el agente que lee el archivo coloca el azul adecuado en la superficie adecuada.",
              },
            },
            {
              label: { en: "Why it works", es: "Por qué funciona" },
              body: {
                en: "A human teammate might pause before pasting the wrong blue. A coding agent won't. Pinning the word to the palette removes the ambiguity in the one place it matters: the source of truth the AI reads. The audit also showed that nearly every custom semantic routed cleanly back to the semantic layer — less drift than expected, but worth checking each one.",
                es: "Un compañero humano puede pararse a comprobarlo antes de pegar el azul equivocado. Un agente de código, no. Anclar la palabra a la paleta elimina la ambigüedad en el único sitio en el que importa: la referencia única que lee la IA. La auditoría también mostró que casi todos los semánticos personalizados encajaban limpiamente con la capa semántica: menos deriva de la esperada, aunque merece la pena revisar cada uno.",
              },
            },
          ],
        },
        animation: "layers",
        span: "wide",
      },
      {
        label: {
          en: "White-label at Scale",
          es: "White-label a escala",
        },
        sublabel: {
          en: "Swap the tokens, ship the next bank — the components don't change, the brand does.",
          es: "Intercambia los tokens, lanza el siguiente banco — los componentes no cambian, la marca sí.",
        },
        details: {
          heading: {
            en: "Every client another pass at sharpening the system",
            es: "Cada cliente, otra pasada para afinar el sistema",
          },
          sections: [
            {
              label: { en: "The problem", es: "El problema" },
              body: {
                en: "Afi ships white-label fintech products to banks and financial institutions. Each surface has to feel consistent with the shared system but distinct for the client — which means rebuilding the same product, brand by brand. Scattered docs and inconsistent patterns made every rebuild start from a slightly different place.",
                es: "Afi desarrolla productos fintech white-label para bancos e instituciones financieras. Cada producto debe transmitir coherencia con el sistema compartido y, a la vez, ser distinto para el cliente, lo que se traduce en rehacer el mismo producto una y otra vez, marca a marca. La documentación dispersa y los patrones inconsistentes hacían que cada nuevo proyecto arrancara desde un punto ligeramente distinto.",
              },
            },
            {
              label: { en: "What we did", es: "Lo que hicimos" },
              body: {
                en: "Architected a token system that absorbs brand differences as values, not as code. Wrote `design.md` so the rulebook travels across rebuilds instead of getting locked into a single client's surface.",
                es: "Hemos construido la arquitectura de un sistema de tokens que absorbe las diferencias de marca como valores, no como código. Y hemos redactado `design.md` con la idea de que el manual viaje de un proyecto al siguiente, en lugar de quedarse anclado al producto de un cliente concreto.",
              },
            },
            {
              label: { en: "The solution", es: "La solución" },
              body: {
                en: "A re-skin is now a token swap with an AI agent doing the QA pass. The next bank inherits the same component library, the same conventions, the same motion tokens. What changes is the values inside the slots, not the slots themselves.",
                es: "Hacer un reskin se ha convertido en un intercambio de tokens, con un agente de IA encargado del pase de QA. El siguiente banco hereda la misma librería de componentes, las mismas convenciones y los mismos tokens de movimiento. Lo que cambia son los valores dentro de los slots, no los slots en sí.",
              },
            },
            {
              label: { en: "Why it works", es: "Por qué funciona" },
              body: {
                en: "The system earns its keep on the fifth client, not the first. Each rebuild is another pass for edge cases to surface and the rulebook to grow more honest. AI is what makes that pass take a day instead of a week — so we take it every time.",
                es: "El sistema da sus frutos a partir del quinto cliente, no en el primero. Cada nuevo proyecto sirve para que afloren casos límite y para que el manual gane fiabilidad. Y es la IA la que reduce ese ejercicio a un día en lugar de una semana, por eso nos compensa hacerlo siempre.",
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
          es: "Fija el feedback sobre el diseño donde está el trabajo — para que nada se quede atrapado en un hilo de chat.",
        },
        details: {
          heading: {
            en: "Where feedback finally has somewhere to land",
            es: "Donde el feedback por fin tiene un lugar al que llegar",
          },
          sections: [
            {
              label: { en: "The problem", es: "El problema" },
              body: {
                en: "Handoff happened in Microsoft Teams threads and email attachments. A `design.md` over chat, Figma annotations forwarded by email, feedback scattered across channels nobody could find a week later. Developers lost context the moment a comment left its attachment. Designers had no record of which notes were resolved and which were silently ignored.",
                es: "La entrega entre diseño y desarrollo se hacía a través de hilos de Microsoft Teams y archivos adjuntos del correo. Un `design.md` por chat, anotaciones de Figma reenviadas por email y comentarios sueltos repartidos por canales que nadie era capaz de encontrar una semana más tarde. Los desarrolladores se quedaban sin contexto en cuanto un comentario salía de su punto de anclaje. Los diseñadores tampoco tenían registro de qué notas se habían resuelto y cuáles se habían ignorado en silencio.",
              },
            },
            {
              label: { en: "What we did", es: "Lo que hicimos" },
              body: {
                en: "Built an internal designer↔dev surface where comments anchor to specific parts of the UI — the component, the screen, the state. Every comment carries an open or resolved status.",
                es: "Hemos creado una superficie interna entre diseñadores y desarrolladores en la que los comentarios se anclan a partes concretas de la interfaz: el componente, la pantalla, el estado. Cada comentario lleva asociado un estado: abierto o resuelto.",
              },
            },
            {
              label: { en: "The solution", es: "La solución" },
              body: {
                en: "One channel for feedback. PMs and developers leave notes in place. A designer can return a week later and see exactly which feedback was acted on; a developer can close a comment when the code is in, and the designer sees it.",
                es: "Un único canal para los comentarios. Los PMs y los desarrolladores dejan las notas en el sitio que les corresponde. Un diseñador puede volver una semana más tarde y ver con exactitud qué comentarios se han atendido; un desarrollador puede cerrar un comentario cuando el código ya está integrado, y el diseñador lo ve en ese mismo momento.",
              },
            },
            {
              label: { en: "Why it works", es: "Por qué funciona" },
              body: {
                en: "Feedback lives next to the thing it's about — the only place it was ever useful. Same repo, same rulebook, plus a feedback surface that closes the loop. Designers, developers, and the AI agents working alongside them are all reading from the same file, and now writing back to it.",
                es: "Los comentarios viven junto a aquello a lo que se refieren, que es el único sitio en el que alguna vez tuvieron utilidad. El mismo repositorio, el mismo manual y, ahora, una superficie de comentarios que cierra el ciclo. Diseñadores, desarrolladores y los agentes de IA que trabajan con ellos leen del mismo archivo, y ahora también lo actualizan.",
              },
            },
          ],
        },
        animation: "comment-pins",
      },
      {
        label: {
          en: "Coded Logo, Token-Aware",
          es: "Logo en código, consciente de tokens",
        },
        sublabel: {
          en: "One SVG that adapts to the mode — so light, dark, and brand variants ship without four separate exports.",
          es: "Un SVG que se adapta al modo — para que las variantes light, dark y de marca se entreguen sin cuatro exportaciones distintas.",
        },
        details: {
          heading: {
            en: "One component instead of a folder of files",
            es: "Un componente en vez de una carpeta de archivos",
          },
          sections: [
            {
              label: { en: "The problem", es: "El problema" },
              body: {
                en: "The logo lived in the assets folder as a stack of SVG exports — six sizes for marketing, two for product, color and monochrome for each, light and dark for each. More than twenty files for a single brand mark. A new client meant another twenty exports. A refresh meant redoing the lot. Developers imported the right file per surface and remembered to swap it on every theme change.",
                es: "El logo residía en la carpeta de assets como una pila de SVG exportados: seis tamaños para marketing, dos para producto, una versión a color y otra monocroma de cada uno, y una para modo claro y otra para modo oscuro. Más de veinte archivos para una sola marca. Cada cliente nuevo suponía otras veinte exportaciones, y un rediseño implicaba rehacerlo todo. Los desarrolladores tenían que importar el archivo correcto en cada superficie y acordarse de cambiarlo en cada cambio de tema.",
              },
            },
            {
              label: { en: "What we did", es: "Lo que hicimos" },
              body: {
                en: "Recognized that the mark is one shape and the variants are decisions about color and size — and decisions are what the token system already encodes. Built the logo as a single SVG component that reads its values from the semantic layer.",
                es: "Asumimos que la marca es una sola forma y que las variantes son decisiones sobre color y tamaño, decisiones que el sistema de tokens ya codifica. Hemos construido el logo como un único componente SVG que recoge sus valores directamente de la capa semántica.",
              },
            },
            {
              label: { en: "The solution", es: "La solución" },
              body: {
                en: "One component, two semantic-token slots. The brand variant references `brand/primary`, which resolves to AzulProfundo in light mode and `azulafi` in dark. The monochrome variant references `fg/default`, which switches black or white with the mode. Size is a CSS variable. The component lives in `ui/src/` next to the other primitives, and the docs page proves contrast against `base.white` and `base.black`.",
                es: "Un componente y dos espacios de token semántico. La variante de color apunta a `brand/primary`, que se resuelve a AzulProfundo en modo claro y a `azulafi` en modo oscuro. La variante monocroma apunta a `fg/default`, que alterna entre negro y blanco según el modo. El tamaño se controla con una variable CSS. El componente reside en `ui/src/` junto al resto de primitivos, y la página de documentación verifica el contraste sobre `base.white` y `base.black`.",
              },
            },
            {
              label: { en: "Why it works", es: "Por qué funciona" },
              body: {
                en: "For white-label this counts double. The next bank doesn't need a new asset folder, it needs new token values. A refresh means editing the token, not regenerating twenty exports.",
                es: "En un contexto white-label el ahorro es doble. El siguiente banco no necesita una carpeta de assets nueva, sino unos cuantos valores de token nuevos. Un rediseño se traduce en editar el token, no en regenerar veinte exportaciones.",
              },
            },
          ],
        },
        animation: "coded-logo",
      },
      {
        label: {
          en: "Component Playground",
          es: "Playground de componentes",
        },
        sublabel: {
          en: "Every component, every state, with copyable code — so a developer grabs the snippet and ships.",
          es: "Cada componente, cada estado, con código copiable — para que un desarrollador coja el snippet y lo lance.",
        },
        details: {
          heading: {
            en: "Where designers and developers see the real thing",
            es: "Donde diseñadores y desarrolladores ven lo de verdad",
          },
          sections: [
            {
              label: { en: "The problem", es: "El problema" },
              body: {
                en: "Static design docs lie a little. A Figma frame shows a button at rest but can't show how it hovers, how it transitions between states, how it sits on a real background, or what the generated code looks like. Developers end up rebuilding from approximations. Designers end up reviewing screenshots of code instead of code.",
                es: "La documentación de diseño estática miente un poco. Un frame de Figma muestra un botón en reposo, pero no puede mostrar cómo se comporta en hover, cómo transita entre estados, cómo se asienta sobre un fondo real ni qué aspecto tiene el código que genera. Los desarrolladores acaban reconstruyendo a partir de aproximaciones, y los diseñadores acaban revisando capturas de código en lugar del código en sí.",
              },
            },
            {
              label: { en: "What we did", es: "Lo que hicimos" },
              body: {
                en: "Built a playground page per component inside the showcase app. The component renders for real, with the same code path the production app uses.",
                es: "Hemos creado una página de playground por componente dentro de la app showcase. El componente se renderiza tal cual, siguiendo la misma ruta de código que utiliza la app en producción.",
              },
            },
            {
              label: { en: "The solution", es: "La solución" },
              body: {
                en: "Each page carries toggles for the variants — icon vs icon+wordmark, brand vs monochrome, mode, size — a tokens-consumed panel that updates as the variant changes, and a copy button that yields the exact HTML, SCSS, and TypeScript a developer would paste. The page is built on the primitives it documents, so it can't drift from itself.",
                es: "Cada página incluye selectores para las variantes (icono o icono+wordmark, marca o monocromo, modo, tamaño), un panel de tokens consumidos que se actualiza al cambiar de variante y un botón de copia que devuelve el HTML, el SCSS y el TypeScript exactos que pegaría un desarrollador. La página está construida sobre los mismos primitivos que documenta, de modo que no puede desviarse de sí misma.",
              },
            },
            {
              label: { en: "Why it works", es: "Por qué funciona" },
              body: {
                en: "A doc that is also a working component is a doc that can't lie. When something breaks — a token rename, a missing variant, an animation that doesn't carry — it breaks here first, in public, before it ships into a screen.",
                es: "Un documento que al mismo tiempo funciona como componente es un documento que no puede mentir. Cuando algo se rompe (un renombrado de token, una variante que falta, una animación que no llega), se rompe aquí primero, a la vista, antes de llegar a una pantalla de producto.",
              },
            },
          ],
        },
        animation: "playground",
      },
      {
        label: {
          en: "Cross-Stack Animation Port",
          es: "Puerto de animaciones entre stacks",
        },
        sublabel: {
          en: "Best-in-class React animations, ported to Angular and wearing our motion tokens — so the bank stack inherits the same polish.",
          es: "Las mejores animaciones de React, portadas a Angular con nuestros tokens de movimiento — para que el stack del banco herede la misma calidad.",
        },
        details: {
          heading: {
            en: "The Angular wall moved",
            es: "El muro de Angular se movió",
          },
          sections: [
            {
              label: { en: "The problem", es: "El problema" },
              body: {
                en: "Banks run on Angular or older. Most modern UI inspiration ships React-first — Animata, Aceternity, Magic UI. Angular teams watched the good interactions go past on Twitter and waited for someone to rebuild them, which mostly didn't happen. The pattern stayed React's.",
                es: "Los bancos funcionan con Angular o con stacks aún anteriores. Casi toda la inspiración moderna de UI llega primero a React: Animata, Aceternity, Magic UI. Los equipos de Angular veían pasar las interacciones buenas por Twitter y se quedaban esperando a que alguien las reconstruyera, cosa que casi nunca terminaba ocurriendo. El patrón se quedaba en React.",
              },
            },
            {
              label: { en: "What we did", es: "Lo que hicimos" },
              body: {
                en: "Treated cross-stack porting as a translation problem AI handles well. Pulled the React source for a target interaction, handed the agent the existing Angular component structure plus our motion tokens, and let it refactor across the stack split.",
                es: "Hemos tratado el porting entre stacks como un problema de traducción, algo que la IA resuelve bien. Le pasamos al agente el código fuente en React de la interacción objetivo, la estructura de componentes Angular que ya teníamos y nuestros tokens de movimiento, y le dejamos refactorizar entre los dos lenguajes.",
              },
            },
            {
              label: { en: "The solution", es: "La solución" },
              body: {
                en: "This week's port — a sliding-pill segmented control from an open-source React example. The agent rewrote the React idioms into Angular's HTML/SCSS/TypeScript split, swapped every hard-coded easing for `motion.ease.out-soft`, every spacing for `spacing/sm`. The animation everyone admired now belongs to Afi's system and inherits its brand cohesion automatically.",
                es: "El porting de esta semana: un control segmentado con píldora deslizante, tomado de un ejemplo open source en React. El agente ha reescrito los modismos de React siguiendo la separación HTML/SCSS/TypeScript de Angular, ha intercambiado cada easing escrito a mano por `motion.ease.out-soft` y cada espaciado por `spacing/sm`. La animación que tanto admiraba el equipo ahora pertenece al sistema Afi y hereda automáticamente su cohesión de marca.",
              },
            },
            {
              label: { en: "Why it works", es: "Por qué funciona" },
              body: {
                en: "The Angular wall didn't move because Angular got cooler. It moved because the cost of crossing it dropped to zero. The team's menu of references is wider now, and the system absorbs each one through the token layer.",
                es: "El muro de Angular no ha caído porque Angular se haya vuelto más moderna, sino porque el coste de saltárselo se ha reducido a cero. El catálogo de referencias del equipo es ahora mucho más amplio, y el sistema absorbe cada nueva pieza a través de la capa de tokens.",
              },
            },
          ],
        },
        animation: "port-diff",
      },
    ],
  },
  "story-architect": {
    tagline: {
      en: "Agency-quality design for a two-person brand consultancy",
      es: "Diseño de nivel de agencia para una consultora de marca de dos personas",
    },
    intro: {
      en: "Story Architect is a two-person brand consultancy in Canada — strong at tone of voice, zero visual infrastructure. They knew how to find the words; they didn't have someone to make it look like it cost what it did. I developed a visual strategy from their existing brand, used AI to build out the site with custom graphics and animations, then packaged it as a WordPress template so they could manage it themselves. A two-person shop with the design quality that used to require an agency.",
      es: "Story Architect es una consultora de marca de dos personas en Canadá — fuerte en tono de voz, infraestructura visual inexistente. Sabían encontrar las palabras; no tenían a nadie que hiciera que la imagen estuviera a la altura. Desarrollé una estrategia visual a partir de su marca existente, utilicé IA para construir la web con gráficos y animaciones a medida, y luego lo empaqueté como plantilla de WordPress para que pudieran gestionarla ellos mismos. Un estudio de dos personas con la calidad de diseño que antes requería una agencia.",
    },
    role: {
      en: "Freelance Designer",
      es: "Diseñador freelance",
    },
    contributions: {
      en: [
        "Visual strategy",
        "Web design",
        "Motion design",
        "WordPress development",
      ],
      es: [
        "Estrategia visual",
        "Diseño web",
        "Diseño de motion",
        "Desarrollo en WordPress",
      ],
    },
    bento: [
      {
        label: {
          en: "Visual Strategy",
          es: "Estrategia visual",
        },
        sublabel: {
          en: "From brand voice to visual language",
          es: "De la voz de marca al lenguaje visual",
        },
        animation: "moodboard",
        span: "wide",
      },
      {
        label: {
          en: "AI-Built Site",
          es: "Web construida con IA",
        },
        sublabel: {
          en: "Built fast, built right",
          es: "Construida rápido, construida bien",
        },
        animation: "code-to-site",
      },
      {
        label: {
          en: "Custom Animations",
          es: "Animaciones a medida",
        },
        sublabel: {
          en: "Motion that earns attention",
          es: "Movimiento que se gana la atención",
        },
        animation: "pulse",
      },
      {
        label: {
          en: "WordPress Template",
          es: "Plantilla de WordPress",
        },
        sublabel: {
          en: "Designed once, managed forever — no developer needed",
          es: "Diseñada una vez, gestionada para siempre — sin necesidad de desarrollador",
        },
        animation: "wordpress",
      },
    ],
  },
  kt360: {
    tagline: {
      en: "An AI environment built for a team that doesn't have a full design department",
      es: "Un entorno de IA construido para un equipo que no tiene un departamento de diseño completo",
    },
    intro: {
      en: "KT360 is an early-stage startup in a saturated AI market. The brand strategy: look nothing like AI. Playful, human, deliberately distinct. The harder problem was operational — how does a small team stay on-brand when no designer sits in the room? We encoded the brand into the environment itself. Design rules, component guidelines, and animation patterns live as structured files an AI can read, check against, and enforce; agents review work before it ships. A shared system built on shadcn gives everyone a foundation to prototype and build from. The result: a marketer can write a blog post, a developer can ship a new page, and the output looks like it came from the same hand — because the rules are doing the work.",
      es: "KT360 es una startup en fase inicial dentro de un mercado de IA saturado. La estrategia de marca: no parecerse en nada a la IA. Juguetona, humana, deliberadamente distinta. El reto más complicado era operativo: ¿cómo mantiene la coherencia de marca un equipo pequeño cuando no hay ningún diseñador en la sala? Hemos codificado la marca dentro del propio entorno. Las reglas de diseño, las pautas de componentes y los patrones de animación viven como archivos estructurados que una IA puede leer, comprobar y hacer cumplir; los agentes revisan el trabajo antes de que se publique. Un sistema compartido construido sobre shadcn ofrece al equipo una base sobre la que prototipar y construir. El resultado: una persona de marketing puede escribir un artículo, un desarrollador puede sacar al aire una página nueva, y el resultado parece salido de la misma mano, porque son las reglas las que están haciendo el trabajo.",
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
          en: "Playful and human — deliberately nothing like AI",
          es: "Juguetona y humana — deliberadamente nada parecida a la IA",
        },
        animation: "logo-identity",
      },
      {
        label: {
          en: "Rules as Files",
          es: "Reglas como archivos",
        },
        sublabel: {
          en: "Brand guidelines, component specs, and animation patterns written so AI can read and enforce them",
          es: "Pautas de marca, especificaciones de componentes y patrones de animación escritos para que la IA pueda leerlos y hacerlos cumplir",
        },
        animation: "rules",
      },
      {
        label: {
          en: "Shared Prototype Environment",
          es: "Entorno de prototipado compartido",
        },
        sublabel: {
          en: "One codebase the whole team can open, experiment in, and ship from",
          es: "Un único código base que todo el equipo puede abrir, experimentar y desde el que lanzar",
        },
        animation: "canvas",
      },
      {
        label: {
          en: "Design System Foundation",
          es: "Base del sistema de diseño",
        },
        sublabel: {
          en: "Tokens, typography, and components everyone builds on top of",
          es: "Tokens, tipografía y componentes sobre los que todos construyen",
        },
        animation: "guideline",
      },
      {
        label: {
          en: "Motion as Tokens",
          es: "Movimiento como tokens",
        },
        sublabel: {
          en: "Easing curves and timing as rules — not decoration handed to a developer",
          es: "Curvas de easing y tiempos como reglas — no decoración entregada a un desarrollador",
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
      en: "An AI-powered meditation app, personal to each user's journey",
      es: "Una app de meditación con IA, personal para el camino de cada usuario",
    },
    // TODO(afi-redaccion)
    intro: {
      en: "Chinwuba brought the idea to life through a website where users could generate affirmations aligned with their goals — delivered as audio guides with actionable tips. Early users found value but craved more: editing, saving, building their own libraries. The challenge: people bounce off mindfulness apps because every solution looks the same — generic categories, generic meditations, none of which echo the unique journey of the individual. Mindfulme uses AI to craft personalized meditations and affirmations that evolve with each user, refining its understanding with every interaction.",
      es: "Chinwuba dio vida a la idea con una web donde los usuarios podían generar afirmaciones alineadas con sus objetivos — entregadas como guías de audio con consejos accionables. Los primeros usuarios veían valor pero querían más: editar, guardar, construir su propia biblioteca. El reto: la gente rebota de las apps de mindfulness porque todas las soluciones se parecen — categorías genéricas, meditaciones genéricas, ninguna refleja el camino único de la persona. Mindfulme usa IA para crear meditaciones y afirmaciones personalizadas que evolucionan con cada usuario, refinando su comprensión con cada interacción.",
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
