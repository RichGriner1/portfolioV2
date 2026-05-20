import type { Bilingual } from "@/lib/i18n";

export type BentoCard = {
  label: Bilingual<string>;
  sublabel: Bilingual<string>;
  span?: "wide" | "tall";
  details?: {
    heading: Bilingual<string>;
    body: Bilingual<string[]>;
  };
  animation:
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
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "afi-design-system": {
    confidential: {
      en: "Designs are not shown due to client confidentiality.",
      es: "Los diseños no se muestran por confidencialidad del cliente.",
    },
    tagline: {
      en: "Building design infrastructure for a fintech consultancy",
      es: "Construyendo la infraestructura de diseño para una consultora fintech",
    },
    intro: {
      en: "AFI ships white-labeled fintech products for banks and financial institutions — each surface has to feel consistent with the shared system but distinct for the client. The problem: a design team of one, a high project rate, design docs scattered across Microsoft Teams threads and email, no rulebook keeping the system honest across remakes. The fix: a custom token system in Figma, a unified platform where designers, developers, and AI agents share the same rules, and a designer↔dev handoff tool so feedback stops getting lost. The upside of constant remakes — each new client is another pass sharpening the system. AI is what lets us take every one.",
      es: "AFI lanza productos fintech white-label para bancos e instituciones financieras — cada superficie tiene que sentirse consistente con el sistema compartido pero distinta para el cliente. El problema: un equipo de diseño de una sola persona, un ritmo de proyectos alto, documentación dispersa en hilos de Microsoft Teams y correo, sin ningún manual de reglas que mantuviera honesto al sistema entre rehaceres. La solución: un sistema de tokens a medida en Figma, una plataforma unificada donde diseñadores, desarrolladores y agentes de IA comparten las mismas reglas, y una herramienta de entrega entre diseño y desarrollo para que el feedback deje de perderse. La ventaja de los rehaceres constantes: cada nuevo cliente es otra pasada para afinar el sistema. La IA es lo que nos permite aprovechar todas.",
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
          en: "Unified Design Platform",
          es: "Plataforma de diseño unificada",
        },
        sublabel: {
          en: "Files, agents, and people — converging in one repo.",
          es: "Archivos, agentes y personas — convergiendo en un solo repositorio.",
        },
        details: {
          heading: {
            en: "One repo, everyone on the same rulebook",
            es: "Un solo repositorio, todos con el mismo manual de reglas",
          },
          body: {
            en: [
              "Before the platform existed, there was no shared place. Design docs lived in Microsoft Teams threads and email attachments — design.md got sent over chat, Figma annotations emailed to developers who then lost the thread. When a developer had a question, the answer was buried in a DM. When a designer needed to know what was implemented, they had to ask. There was no single source a designer or developer could open and trust was current.",
              "The AWM Design Showcase is that shared place. A single repo that gives designers, developers, and AI agents a converged home to work from. Two main folders keep things from blurring: design/ for the rulebook, token snapshots, and writing rules; engineering/ for Angular conventions, code style, and test patterns.",
              "At the root sit AGENTS.md and CLAUDE.md. AGENTS.md is the canonical rulebook: current focus, mission, where things live, MCPs, anti-patterns. CLAUDE.md is a one-line redirect pointing at AGENTS.md so every AI tool — Claude Code, OpenCode — starts from the same page. The .claude/skills/ folder extends that: a Spanish-writing skill fires whenever an agent produces Spanish copy, keeping tone consistent without manual policing. Encode the decision once, let the system enforce it.",
              "The showcase/ app is the interactive layer: an Angular 21 prototype with real component behavior, not flat Figma approximations. Hover states, transitions, loading patterns — the parts that static screens can't pin down — are proven here before engineering picks them up.",
            ],
            es: [
              "Antes de que existiera la plataforma, no había ningún lugar compartido. La documentación de diseño vivía en hilos de Microsoft Teams y archivos adjuntos de correo — design.md se enviaba por chat, las anotaciones de Figma llegaban por email a desarrolladores que luego perdían el hilo. Cuando un desarrollador tenía una pregunta, la respuesta estaba enterrada en un mensaje privado. Cuando un diseñador necesitaba saber qué estaba implementado, tenía que preguntar. No existía una fuente única que diseñadores o desarrolladores pudieran abrir y confiar en que estaba actualizada.",
              "El AWM Design Showcase es ese lugar compartido. Un repositorio único que da a diseñadores, desarrolladores y agentes de IA un punto de convergencia desde el que trabajar. Dos carpetas principales evitan que todo se mezcle: design/ para el manual de reglas, instantáneas de tokens y normas de escritura; engineering/ para convenciones Angular, estilo de código y patrones de pruebas.",
              "En la raíz están AGENTS.md y CLAUDE.md. AGENTS.md es el manual de reglas canónico: foco actual, misión, dónde viven las cosas, MCPs, anti-patrones. CLAUDE.md es una redirección de una línea que apunta a AGENTS.md para que cada herramienta de IA — Claude Code, OpenCode — empiece desde la misma página. La carpeta .claude/skills/ amplía eso: una habilidad de escritura en español se activa cuando un agente produce texto en español, manteniendo el tono consistente sin supervisión manual. Codifica la decisión una vez, deja que el sistema la haga cumplir.",
              "La app showcase/ es la capa interactiva: un prototipo en Angular 21 con comportamiento de componente real, no aproximaciones planas de Figma. Estados hover, transiciones, patrones de carga — las partes que las pantallas estáticas no pueden fijar — se prueban aquí antes de que engineering las recoja.",
            ],
          },
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
          en: "Primitive → semantic → component",
          es: "Primitivo → semántico → componente",
        },
        details: {
          heading: {
            en: "Three tiers — and where drift hides",
            es: "Tres niveles — y dónde se esconde la deriva",
          },
          body: {
            en: [
              "The Figma variable panel gave us three tiers: 87 AFI Primitives (raw atoms — a hex, a pixel number, a font family), 39 Semantic numbers (aliases like spacing/md that reference primitives but carry intent), and 22 AFI Custom Semantics (component-level overrides like p-datatable/padding/normal that PrimeNG's Figma library didn't expose).",
              "Tier 1 is just numbers — dimension-8 is the number 8, nothing more. Tier 2 is where meaning enters: spacing/md references dimension-8 and says 'this is medium spacing.' A designer or developer reaching for a value goes here, not to primitives.",
              "Tier 3 is where drift hides — and it surfaces in conversation before it surfaces in the doc. PrimeNG uses a single primary slot for action color. AFI has two blues: AzulProfundo goes into light mode (it passes AA on small text where bright azulafi doesn't), azulafi takes dark mode where dark surfaces give it the contrast it needs. Same role, two palettes, the mode picks the right one. Alberto's meeting about neutral colors was another drift moment — a discussion about whether a gray was warm or cool exposed an undocumented assumption. Andres's naming-inconsistency catches were a third: small mismatches between what Figma called a token and what code called it, invisible until someone tried to hand off. Every custom semantic is hand-made, so every one is a place things can quietly disagree.",
              "That's also why the doc names the palette, not the role. If design.md said 'primary' generically, an AI agent reading the file would happily paste azulafi into an action slot — 'primary' slides toward 'main brand color' in any reasonable reading. A human teammate might pause and check; a coding agent won't. Pinning the word to the palette — AzulProfundo, not primary — removes the ambiguity in the one place it matters: the source of truth the AI is reading.",
              "Writing the doc was the audit. The structure — raw to meaningful to component-specific — became the spine of design.md. When we audited all 22 custom semantics, almost every one routed cleanly back to a semantic number. Less drift than expected. Still worth checking every single one.",
            ],
            es: [
              "El panel de variables de Figma nos dio tres niveles: 87 Primitivos AFI (átomos en bruto — un hex, un número en píxeles, una familia tipográfica), 39 números Semánticos (alias como spacing/md que referencian primitivos pero llevan intención), y 22 Semánticos Personalizados AFI (anulaciones a nivel de componente como p-datatable/padding/normal que la librería Figma de PrimeNG no exponía).",
              "El Nivel 1 son solo números — dimension-8 es el número 8, nada más. El Nivel 2 es donde entra el significado: spacing/md referencia dimension-8 y dice 'este es el espaciado medio'. Un diseñador o desarrollador que busca un valor va aquí, no a los primitivos.",
              "El Nivel 3 es donde se esconde la deriva — y aflora en conversación antes de aparecer en el documento. PrimeNG usa un único slot primary para el color de acción. AFI tiene dos azules: AzulProfundo va en modo claro (supera AA en texto pequeño donde el azulafi brillante no lo hace), azulafi toma el modo oscuro donde las superficies oscuras le dan el contraste que necesita. El mismo rol, dos paletas, el modo elige la correcta. La reunión de Alberto sobre colores neutros fue otro momento de deriva — una discusión sobre si un gris era cálido o frío sacó a la luz un supuesto no documentado. Los hallazgos de Andres sobre inconsistencias de nombres fueron un tercer ejemplo: pequeñas discrepancias entre cómo Figma llamaba a un token y cómo lo llamaba el código, invisibles hasta que alguien intentaba hacer una entrega. Cada semántico personalizado está hecho a mano, así que cada uno es un lugar donde las cosas pueden discrepar en silencio.",
              "Por eso el documento nombra la paleta, no el rol. Si design.md dijera 'primary' de forma genérica, un agente de IA leyendo el archivo pegaría azulafi en un slot de acción sin dudar — 'primary' se desliza hacia 'color principal de marca' en cualquier lectura razonable. Un compañero humano podría pausar y comprobar; un agente de código no. Fijar la palabra a la paleta — AzulProfundo, no primary — elimina la ambigüedad en el único lugar donde importa: la fuente de verdad que lee la IA.",
              "Escribir el documento fue la auditoría. La estructura — de bruto a significativo a específico de componente — se convirtió en la columna vertebral de design.md. Cuando auditamos los 22 semánticos personalizados, casi todos enrutaban limpiamente hacia un número semántico. Menos deriva de la esperada. Aun así merece la pena revisar cada uno.",
            ],
          },
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
          en: "One system, any brand — swap the tokens, ship the product.",
          es: "Un sistema, cualquier marca — intercambia los tokens, lanza el producto.",
        },
        details: {
          heading: {
            en: "Every client another pass at sharpening the system",
            es: "Cada cliente, otra pasada para afinar el sistema",
          },
          body: {
            en: [
              "AFI ships white-labeled fintech products for banks and financial institutions — each surface has to feel consistent with the shared system but distinct for the client. That means remaking the same product over and over, one brand at a time.",
              "The upside of constant remakes: every new client is another pass to sharpen the system. A pattern that worked for one bank gets tested against a second, then a third. Edge cases surface. The token structure gets tighter. The rulebook grows more honest.",
              "AI is what lets us take every one of those passes. What used to be a days-long manual re-skin is now a token swap with an agent doing the QA pass. The system earns its keep not on the first client, but on the fifth.",
              "Scattered docs and inconsistent patterns were the cost of not having a rulebook. Architecting the token system and writing design.md wasn't about tidying — it was about making the remakes compoundable. Each one builds on the last instead of starting from scratch.",
            ],
            es: [
              "AFI lanza productos fintech white-label para bancos e instituciones financieras — cada superficie tiene que sentirse consistente con el sistema compartido pero distinta para el cliente. Eso significa rehacer el mismo producto una y otra vez, una marca tras otra.",
              "La ventaja de los rehaceres constantes: cada nuevo cliente es otra pasada para afinar el sistema. Un patrón que funcionó para un banco se prueba contra un segundo, luego un tercero. Surgen casos límite. La estructura de tokens se vuelve más precisa. El manual de reglas crece más honesto.",
              "La IA es lo que nos permite aprovechar cada una de esas pasadas. Lo que antes era un reskinning manual de días es ahora un intercambio de tokens con un agente haciendo el pase de QA. El sistema se justifica no en el primer cliente, sino en el quinto.",
              "La documentación dispersa y los patrones inconsistentes eran el coste de no tener un manual de reglas. Arquitectar el sistema de tokens y escribir design.md no era ordenar — era hacer que los rehaceres fueran acumulables. Cada uno construye sobre el anterior en lugar de empezar desde cero.",
            ],
          },
        },
        animation: "palette",
      },
      {
        label: {
          en: "Designer Handoff & Feedback Tool",
          es: "Herramienta de entrega y feedback de diseño",
        },
        sublabel: {
          en: "Comments land on the design — not in Teams threads.",
          es: "Los comentarios llegan al diseño — no a hilos de Teams.",
        },
        details: {
          heading: {
            en: "Where feedback finally has somewhere to land",
            es: "Donde el feedback por fin tiene un lugar al que llegar",
          },
          body: {
            en: [
              "Before the tool existed, handoff looked like this: a design.md sent over Microsoft Teams, Figma annotations emailed to developers, and feedback scattered across threads that nobody could find later. Devs lost context the moment a comment left its attachment. Designers had no record of which notes were resolved and which were silently ignored.",
              "The tool is an internal designer↔dev surface where comments attach to specific parts of the UI. PMs and developers leave feedback in-place — on the component, the screen, the state. Each comment carries a status: open or resolved. Nothing gets lost between channels because there's only one channel.",
              "What this changes: the handoff is auditable. A designer can come back a week later and see exactly which feedback was acted on. A developer can close a comment when the code is in, and the designer sees it. The conversation lives next to the thing it's about — which is the only place it was ever useful anyway.",
              "This composes with the rest of the platform. Same repo, same rulebook, now plus a feedback surface so the loop closes. Designers, developers, and the AI agents working alongside them are all reading from the same file — and now writing back to it.",
            ],
            es: [
              "Antes de que existiera la herramienta, la entrega funcionaba así: un design.md enviado por Microsoft Teams, anotaciones de Figma por correo a los desarrolladores, y feedback disperso en hilos que nadie podía encontrar después. Los desarrolladores perdían el contexto en el momento en que un comentario abandonaba su punto de anclaje. Los diseñadores no tenían registro de qué notas estaban resueltas y cuáles simplemente ignoradas.",
              "La herramienta es una superficie interna entre diseñadores y desarrolladores donde los comentarios se anclan a partes específicas de la interfaz. Los PMs y los desarrolladores dejan el feedback en su sitio — sobre el componente, la pantalla, el estado. Cada comentario lleva un estado: abierto o resuelto. Nada se pierde entre canales porque solo hay un canal.",
              "Lo que esto cambia: la entrega es auditable. Un diseñador puede volver una semana después y ver exactamente qué feedback fue atendido. Un desarrollador puede cerrar un comentario cuando el código está listo, y el diseñador lo ve. La conversación vive junto a lo que trata — que es el único lugar donde siempre fue útil.",
              "Esto encaja con el resto de la plataforma. El mismo repositorio, el mismo manual de reglas, ahora más una superficie de feedback para que el ciclo se cierre. Diseñadores, desarrolladores y los agentes de IA que trabajan junto a ellos leen todos del mismo archivo — y ahora también escriben de vuelta a él.",
            ],
          },
        },
        animation: "comment-pins",
      },
      {
        label: {
          en: "Coded Logo, Token-Aware",
          es: "Logo en código, consciente de tokens",
        },
        sublabel: {
          en: "One SVG, four variants — the mode picks the right one",
          es: "Un SVG, cuatro variantes — el modo elige la correcta",
        },
        details: {
          heading: {
            en: "One component instead of a folder of files",
            es: "Un componente en vez de una carpeta de archivos",
          },
          body: {
            en: [
              "Before this, the logo lived in the assets folder as a stack of SVG exports. Six sizes for marketing, two for product, color and monochrome for each, light and dark for each — twenty-plus files for one brand mark. A new client meant another twenty exports. A brand refresh meant redoing the lot. Engineers imported the right file per surface and remembered to swap it on every theme change.",
              "The mark is one shape. The variants are decisions about color and size, and decisions are what the token system already encodes. The fix is to make the logo a component that takes those decisions from the semantic layer instead of from a filename.",
              "One SVG component. Two semantic-token slots — one for brand color, one for monochrome. The brand variant references `brand/primary`, which resolves to AzulProfundo in light mode and azulafi in dark. The monochrome variant references `fg/default`, which switches black or white with the mode. Size is a CSS variable, not another file. The component lives in `ui/src/` alongside the other primitives, and the docs are a playground that shows every variant against `base.white` and `base.black` so the contrast is provable, not assumed.",
              "For white-label this matters double. Every client's brand goes through the same swap mechanism — the next bank doesn't need a new asset folder, it needs new token values.",
            ],
            es: [
              "Antes de esto, el logo vivía en la carpeta de assets como una pila de SVGs exportados. Seis tamaños para marketing, dos para producto, color y monocromo de cada uno, modo claro y oscuro de cada uno — más de veinte archivos para una sola marca. Un cliente nuevo significaba otras veinte exportaciones. Un rediseño de marca significaba rehacerlo todo. Los desarrolladores importaban el archivo correcto en cada superficie y se acordaban de cambiarlo en cada cambio de tema.",
              "La marca es una sola forma. Las variantes son decisiones sobre color y tamaño, y las decisiones son justamente lo que el sistema de tokens ya codifica. La solución es convertir el logo en un componente que tome esas decisiones desde la capa semántica en lugar de desde un nombre de archivo.",
              "Un componente SVG. Dos espacios de token semántico — uno para el color de marca, otro para monocromo. La variante de color referencia `brand/primary`, que se resuelve a AzulProfundo en modo claro y azulafi en modo oscuro. La variante monocroma referencia `fg/default`, que cambia entre negro o blanco con el modo. El tamaño es una variable CSS, no otro archivo. El componente vive en `ui/src/` junto al resto de primitivos, y la documentación es un playground que muestra cada variante sobre `base.white` y `base.black` para que el contraste sea demostrable, no asumido.",
              "Para el white-label esto cuenta doble. La marca de cada cliente pasa por el mismo mecanismo de intercambio — el próximo banco no necesita una nueva carpeta de assets, necesita nuevos valores de token.",
            ],
          },
        },
        animation: "coded-logo",
      },
      {
        label: {
          en: "Component Playground",
          es: "Playground de componentes",
        },
        sublabel: {
          en: "A live surface for every component — toggles for state, mode, size, copyable code",
          es: "Una superficie en vivo para cada componente — interruptores para estado, modo, tamaño, código copiable",
        },
        details: {
          heading: {
            en: "Where designers and developers see the real thing",
            es: "Donde diseñadores y desarrolladores ven lo de verdad",
          },
          body: {
            en: [
              "Static design docs lie a little. A Figma frame can show a button at rest, but it can't show how it hovers, how it transitions between states, how it sits on a real background, or what the code it generates actually looks like. Engineers end up rebuilding from approximations and designers end up reviewing screenshots of code instead of code.",
              "A doc that is also a working component is a doc that can't lie. The same surface a designer uses to validate spacing is the surface a developer uses to grab the snippet they'll commit. The same surface an AI agent reads is the surface a teammate hovers over.",
              "Each component gets a playground page in the showcase app. The component renders for real, with the actual code path the app uses. Above it, toggles for the variants — icon vs icon+wordmark, brand vs monochrome, mode, size. Below it, a tokens-consumed panel that updates as the variant changes, and a copy button that yields the exact HTML, SCSS, and TypeScript a developer would paste. The page is built on the same primitives it documents, so it can't drift from itself.",
              "The playground is also the audit surface. When something breaks — a token rename, a missing variant, an animation that doesn't carry — it breaks here first, in public, before it ships into a screen.",
            ],
            es: [
              "La documentación de diseño estática miente un poco. Un frame de Figma puede mostrar un botón en reposo, pero no puede mostrar cómo hace hover, cómo transita entre estados, cómo se asienta sobre un fondo real, ni cómo se ve el código que genera. Los desarrolladores acaban reconstruyendo a partir de aproximaciones y los diseñadores acaban revisando capturas de código en lugar de código.",
              "Un documento que también es un componente que funciona es un documento que no puede mentir. La misma superficie que un diseñador usa para validar el espaciado es la superficie de la que un desarrollador coge el snippet que va a hacer commit. La misma superficie que un agente de IA lee es la que un compañero de equipo pasa por encima con el cursor.",
              "Cada componente tiene una página de playground en la app showcase. El componente se renderiza de verdad, con la misma ruta de código que usa la app. Arriba, interruptores para las variantes — icono o icono+wordmark, marca o monocromo, modo, tamaño. Abajo, un panel de tokens consumidos que se actualiza al cambiar la variante, y un botón de copia que devuelve el HTML, SCSS y TypeScript exactos que un desarrollador pegaría. La página está construida sobre los mismos primitivos que documenta, así que no puede desviarse de sí misma.",
              "El playground es también la superficie de auditoría. Cuando algo se rompe — un rename de token, una variante que falta, una animación que no llega — se rompe aquí primero, a la vista, antes de llegar a una pantalla.",
            ],
          },
        },
        animation: "playground",
      },
      {
        label: {
          en: "AI as a Teammate",
          es: "La IA como compañera de equipo",
        },
        sublabel: {
          en: "Same library, same docs, same review — just a new dev who reads faster",
          es: "La misma librería, las mismas docs, la misma revisión — solo una nueva dev que lee más rápido",
        },
        details: {
          heading: {
            en: "AI didn't change the rules — it forced us to write them down",
            es: "La IA no cambió las reglas — nos obligó a escribirlas",
          },
          body: {
            en: [
              "Early on I built primitives — button, input, select, checkbox, switch — and then asked the AI to build a screen with them. It built a clean screen and ignored every primitive I'd shipped. The rules existed in my head and in scattered Figma annotations. They didn't exist anywhere the agent could read.",
              "AI joining the team didn't change the rules — it changed who had to read them, which exposed how few of them were actually written down. The work of documenting what was always implicit was overdue. The agent is what forced the calendar.",
              "A rulebook at the repo root that every tool starts from. AGENTS.md carries the current focus, where things live, the anti-patterns, the components the team owns. CLAUDE.md is a one-line redirect so Claude Code, OpenCode, and any future tool open the same page. design.md sits next to them, naming the design-side decisions a coding agent can't infer from the code alone. The `.claude/skills/` folder extends that — small enforcement skills like the Spanish-writing one that fires when an agent produces Spanish copy, so tone stays consistent without anyone policing it.",
              "A human teammate might pause and check before pasting the wrong blue into an action slot. A coding agent won't. The rulebook is where the design system stops being a suggestion and becomes the floor.",
            ],
            es: [
              "Al principio construí primitivos — botón, input, select, checkbox, switch — y luego pedí a la IA que montara una pantalla con ellos. Construyó una pantalla limpia e ignoró todos los primitivos que había hecho. Las reglas existían en mi cabeza y en anotaciones de Figma dispersas. No existían en ningún sitio que el agente pudiera leer.",
              "Que la IA se sumara al equipo no cambió las reglas — cambió quién tenía que leerlas, lo que dejó al descubierto cuántas no estaban realmente escritas. El trabajo de documentar lo que siempre fue implícito iba con retraso. El agente fue lo que obligó al calendario.",
              "Un manual en la raíz del repo del que parte cada herramienta. AGENTS.md lleva el foco actual, dónde vive cada cosa, los anti-patrones, los componentes que mantiene el equipo. CLAUDE.md es una redirección de una línea para que Claude Code, OpenCode y cualquier herramienta futura abran la misma página. design.md vive junto a ellos, nombrando las decisiones de diseño que un agente de código no puede deducir solo del código base. La carpeta `.claude/skills/` amplía eso — pequeñas skills de cumplimiento como la de escritura en español que se activa cuando un agente produce texto en español, para que el tono se mantenga consistente sin que nadie tenga que vigilarlo.",
              "Un compañero humano puede pausar y comprobar antes de pegar el azul equivocado en un slot de acción. Un agente de código no lo hará. El manual es donde el sistema de diseño deja de ser una sugerencia y se convierte en el suelo.",
            ],
          },
        },
        animation: "ai-teammate",
      },
      {
        label: {
          en: "Cross-Stack Animation Port",
          es: "Puerto de animaciones entre stacks",
        },
        sublabel: {
          en: "React-only libraries, ported to Angular, wearing our motion tokens",
          es: "Librerías solo para React, portadas a Angular, vistiendo nuestros tokens de movimiento",
        },
        details: {
          heading: {
            en: "The Angular wall moved",
            es: "El muro de Angular se movió",
          },
          body: {
            en: [
              "Banks run on Angular or older. Most modern UI inspiration ships React-first — Animata, Aceternity, Magic UI. Angular teams used to watch the good interactions go past on Twitter and wait for someone to rebuild them, which mostly didn't happen. The pattern stayed React's.",
              'AI is good at translation jobs. The animation library that doesn\'t ship for Angular ships its source — and the source can be ported. The question stops being "should we wait for an Angular version" and becomes "what tokens will it wear when it lands."',
              "Take a target interaction — this week, a sliding-pill segmented control from an open-source React example. Hand the agent the actual snippet, the existing Angular component file structure, and the motion tokens. It refactors the React idioms into Angular's HTML/SCSS/TypeScript split, swaps every hard-coded easing for `motion.ease.out-soft`, every spacing for `spacing/sm`. The animation that everyone admires now belongs to the Afi system and inherits its brand cohesion automatically.",
              "The wall didn't move because Angular got cooler. It moved because the cost of crossing it dropped to zero. The team's menu of references is wider now, and the system absorbs each one.",
            ],
            es: [
              "Los bancos van con Angular o anteriores. La mayor parte de la inspiración moderna de UI llega primero a React — Animata, Aceternity, Magic UI. Los equipos de Angular solían ver pasar las interacciones buenas por Twitter y esperar a que alguien las reconstruyera, cosa que casi nunca pasaba. El patrón se quedaba en React.",
              'La IA es buena en trabajos de traducción. La librería de animaciones que no sale para Angular sí publica su código fuente — y el código fuente se puede portar. La pregunta deja de ser "esperamos una versión de Angular" y se convierte en "qué tokens va a vestir cuando aterrice".',
              "Toma una interacción objetivo — esta semana, un control segmentado con píldora deslizante de un ejemplo open source en React. Pasa al agente el snippet real, la estructura de archivos del componente Angular existente, y los tokens de movimiento. Refactoriza los modismos de React en el split HTML/SCSS/TypeScript de Angular, intercambia cada easing hard-coded por `motion.ease.out-soft`, cada espaciado por `spacing/sm`. La animación que todo el mundo admira ahora pertenece al sistema Afi y hereda su cohesión de marca automáticamente.",
              "El muro no se movió porque Angular se volviera más moderna. Se movió porque el coste de cruzarlo cayó a cero. El menú de referencias del equipo es más amplio ahora, y el sistema absorbe cada una.",
            ],
          },
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
      en: "KT360 is an early-stage startup in a saturated AI market — so the brand strategy was to look nothing like AI. Playful, human, deliberately distinct. But the bigger challenge was operational: how does a small team stay on-brand when there's no designer in the room? The answer was to encode the brand into the environment itself. Design rules, component guidelines, and animation patterns all live as structured files — the kind of thing an AI can read, check against, and enforce. Agents review work before it ships. A shared system built on shadcn gives everyone a foundation to prototype and build from. The result: a marketer can write a blog post, a developer can add a new page, and the output looks like it came from the same hand — because the rules are doing the work.",
      es: "KT360 es una startup en fase inicial dentro de un mercado de IA saturado — así que la estrategia de marca fue no parecerse en nada a la IA. Juguetona, humana, deliberadamente distinta. Pero el reto mayor era operativo: ¿cómo mantiene un equipo pequeño la coherencia de marca cuando no hay diseñador en la sala? La respuesta fue codificar la marca en el propio entorno. Las reglas de diseño, las pautas de componentes y los patrones de animación viven como archivos estructurados — el tipo de cosa que una IA puede leer, comprobar y hacer cumplir. Los agentes revisan el trabajo antes de que salga. Un sistema compartido construido sobre shadcn da a todos una base para prototipar y construir. El resultado: una persona de marketing puede escribir un artículo, un desarrollador puede añadir una página nueva, y el resultado parece salido de la misma mano — porque las reglas están haciendo el trabajo.",
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
          body: {
            en: [
              "On most teams, motion is the last thing the designer hands over and the first thing the developer simplifies. The brand has a font, a color, a spacing scale — and then every animation gets eyeballed in CSS at the end. Surfaces drift in feel even when they look identical at rest.",
              "Motion is just decisions about curves and times. Decisions are what the token system already encodes for everything else. If a marketer or a developer adding a new page reaches into the token registry instead of writing an `ease-in-out 200ms` from memory, the brand stops fraying at the edges.",
              "Two motion-token tables in the KT360 rulebook. Timing — values like `motion.duration.fast` (~160ms), `motion.duration.base` (~240ms), `motion.duration.slow` (~400ms). Easing — keys like `motion.ease.out-soft` for entrances, `motion.ease.in-firm` for exits, `motion.ease.spring-snap` for things that should feel alive. Every component reaches into these by name, and the rulebook tells the AI which token a given interaction belongs to. The same easing carries from a button hover to a modal entrance to a toast — because the token is what got copied, not the value.",
              "This is the part of the system that earns its keep on the long tail. Year one nobody notices. Year three, the brand still feels the way the founder remembers it feeling, because the motion didn't drift.",
            ],
            es: [
              "En la mayoría de los equipos, el movimiento es lo último que el diseñador entrega y lo primero que el desarrollador simplifica. La marca tiene una tipografía, un color, una escala de espaciado — y luego cada animación se calcula a ojo en CSS al final. Las superficies se desvían en sensación incluso cuando se ven idénticas en reposo.",
              "El movimiento son solo decisiones sobre curvas y tiempos. Las decisiones son lo que el sistema de tokens ya codifica para todo lo demás. Si una persona de marketing o un desarrollador que añade una página nueva mete la mano en el registro de tokens en lugar de escribir un `ease-in-out 200ms` de memoria, la marca deja de deshilacharse por los bordes.",
              "Dos tablas de tokens de movimiento en el manual de KT360. Tiempos — valores como `motion.duration.fast` (~160ms), `motion.duration.base` (~240ms), `motion.duration.slow` (~400ms). Easing — claves como `motion.ease.out-soft` para entradas, `motion.ease.in-firm` para salidas, `motion.ease.spring-snap` para cosas que deben sentirse vivas. Cada componente entra en estos por nombre, y el manual le dice a la IA qué token corresponde a una interacción dada. El mismo easing pasa de un hover de botón a la entrada de un modal a un toast — porque lo que se copió fue el token, no el valor.",
              "Esta es la parte del sistema que se justifica en el largo plazo. El año uno nadie se da cuenta. El año tres, la marca sigue sintiéndose como el fundador la recuerda sintiéndose, porque el movimiento no se ha desviado.",
            ],
          },
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
    tagline: {
      en: "A mindfulness MVP that treats each journey as unique",
      es: "Un MVP de mindfulness que trata cada camino como único",
    },
    intro: {
      en: "Young professionals keep bouncing off mindfulness apps because every one of them looks and sounds the same — calming greens, a meditation library, a timer. Mindfulme hired me to design the MVP's brand and experience from scratch: no brand yet, two ready-to-code developers, and user feedback as the rawest input we had. The work started with listening, turned into a hand-crafted visual language of organic shapes and script affirmations, and shipped as a tight MVP that the two devs could build alongside the design. The throughline: a mindfulness practice that echoes the person, not the industry.",
      es: "Los jóvenes profesionales siguen rebotando de las apps de mindfulness porque todas tienen la misma imagen y el mismo tono — verdes calmantes, una biblioteca de meditaciones, un temporizador. Mindfulme me contrató para diseñar desde cero la marca y la experiencia del MVP: sin marca todavía, dos desarrolladores listos para escribir código y el feedback de los usuarios como el insumo más en bruto que teníamos. El trabajo empezó escuchando, se convirtió en un lenguaje visual hecho a mano con formas orgánicas y afirmaciones caligráficas, y se lanzó como un MVP ajustado que los dos desarrolladores podían construir en paralelo al diseño. El hilo conductor: una práctica de mindfulness que refleja a la persona, no a la industria.",
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
          en: "Every Journey is Different",
          es: "Cada camino es distinto",
        },
        sublabel: {
          en: "A brand built around the idea that no two mindfulness paths look alike",
          es: "Una marca construida sobre la idea de que no hay dos caminos de mindfulness iguales",
        },
        animation: "journey-scene",
        span: "wide",
      },
      {
        label: {
          en: "Affirmations that Evolve",
          es: "Afirmaciones que evolucionan",
        },
        sublabel: {
          en: "Hand-lettered words that change with the user",
          es: "Palabras caligrafiadas a mano que cambian con el usuario",
        },
        animation: "affirmation-morph",
      },
      {
        label: {
          en: "Organic Visual Language",
          es: "Lenguaje visual orgánico",
        },
        sublabel: {
          en: "Hand-drawn shapes over sterile iconography",
          es: "Formas dibujadas a mano frente a iconografía estéril",
        },
        animation: "organic-bundle",
      },
      {
        label: {
          en: "User-led iteration",
          es: "Iteración guiada por usuarios",
        },
        sublabel: {
          en: "Designed alongside two developers and early users — shipped an MVP that reflected them",
          es: "Diseñado junto a dos desarrolladores y los primeros usuarios — lanzamos un MVP que los reflejaba",
        },
        animation: "user-feedback",
        span: "wide",
      },
    ],
  },
};
