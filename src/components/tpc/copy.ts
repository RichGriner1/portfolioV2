import type { Bilingual } from "@/lib/i18n";

/**
 * Copy for the Third-party compliance case study, EN first. The Spanish had its
 * afi-redaccion pass on 2026-11-27: Peninsular, first person singular (Richard's
 * voice, not Afi's house plural). ES strings edited after that date get a TODO(afi-redaccion).
 *
 * Source of truth for the story: the "Cumplimiento de terceros" design canvas (its
 * v1.0 page and pages 1–7), the design system's atomic-check baseline, the two
 * generation tests, and Richard's own account.
 *
 * Nothing here is a measured result for the tool. The design system numbers are counts
 * from the atomic check. Facts still to confirm are in the list at the bottom.
 */

type B = Bilingual<string>;

export const TAGLINE: B = {
  en: "From an AI prototype to a design system others can build on",
  es: "De un prototipo hecho con IA a un sistema de diseño sobre el que otros construyen",
};

export const INTRO: Bilingual<string[]> = {
  en: [
    "Third-party compliance is an internal B2B tool at Afi. Before anyone uses an outside product, its supplier has to show it meets our security requirements and regulations. With AI, that check comes up far more often.",
    "The developer building it generated the first version with AI from our design system. It used the system's parts. It still looked AI-made, wasn't usable, and its information architecture didn't hold. I rebuilt it as v1.1 and handed it back to him to build.",
    "The tool is the example. What I was testing is the design system: can someone busy, who won't stop to message a designer, build something usable and consistent from it?",
  ],
  es: [
    "Cumplimiento de terceros es una herramienta interna B2B de Afi. Antes de que nadie use un producto externo, su proveedor tiene que demostrar que cumple nuestros requisitos de seguridad y la normativa. Con la IA, esa comprobación es mucho más frecuente.",
    "El desarrollador que la construye generó la primera versión con IA a partir de nuestro sistema de diseño. Usaba las piezas del sistema. Aun así parecía hecha por una IA, no era usable y su arquitectura de la información no se sostenía. La rehíce como v1.1 y se la devolví para que la construyera.",
    "La herramienta es el ejemplo. Lo que ponía a prueba era el sistema de diseño: ¿puede alguien con prisa, que no va a pararse a escribir a un diseñador, construir con él algo usable y consistente?",
  ],
};

export const ROLE: B = {
  en: "Product and design system designer",
  es: "Diseñador de producto y del sistema de diseño",
};

export const CONTRIBUTIONS: Bilingual<string[]> = {
  en: [
    "UX flows",
    "Requirements sheet",
    "Prototype",
    "Design system cleanup",
    "3D empty states",
  ],
  es: [
    "Flujos de UX",
    "Hoja de requisitos",
    "Prototipo",
    "Limpieza del sistema de diseño",
    "Estados vacíos en 3D",
  ],
};

/* --------------------------------------------------------------- problem */

export const PROBLEM_HEADING: B = { en: "The problem", es: "El problema" };

export const PROBLEM_LEAD: B = {
  en: "We can't use a tool until someone confirms it complies. That wait is what slows us down, and it comes from three pains.",
  es: "No podemos usar una herramienta hasta que alguien confirme que cumple. Esa espera es lo que nos frena, y viene de tres problemas.",
};

export type Pain = {
  kind: "list" | "template" | "overview";
  title: B;
  text: B;
};

export const PAINS: Pain[] = [
  {
    kind: "list",
    title: { en: "No shared list", es: "Sin lista común" },
    text: {
      en: "Nobody knew exactly what to ask a supplier for. Each person decided on their own.",
      es: "Nadie sabía con exactitud qué pedir a un proveedor. Cada persona decidía por su cuenta.",
    },
  },
  {
    kind: "template",
    title: { en: "No template questions", es: "Sin preguntas de plantilla" },
    text: {
      en: "With no template questions, we couldn't count on getting the same information each time.",
      es: "Sin preguntas de plantilla, no podíamos contar con recibir la misma información cada vez.",
    },
  },
  {
    kind: "overview",
    title: { en: "No overview", es: "Sin visión de conjunto" },
    text: {
      en: "Nobody could see which suppliers were already being reviewed.",
      es: "Nadie veía qué proveedores se estaban revisando ya.",
    },
  },
];

export const OUTCOME: B = {
  en: "The outcome: one way of asking and one place to track it, so we stay aligned and compliant without losing time.",
  es: "El resultado: una sola forma de pedir y un solo sitio donde seguirlo, para estar alineados y cumplir sin perder tiempo.",
};

export type Rule = {
  id: string;
  title: B;
  body: B;
  why?: B;
};

/* ---------------------------------------------------------------- before */

export const BEFORE_HEADING: B = {
  en: "Where it started",
  es: "El punto de partida",
};

export const BEFORE_LEAD: B = {
  en: "v1.0 came out of the design system and still fell short in three ways.",
  es: "La v1.0 salió del sistema de diseño y aun así se quedaba corta en tres cosas.",
};

export const BEFORE_ISSUES: { id: string; title: B; text: B }[] = [
  {
    id: "look",
    title: { en: "It looked AI-made", es: "Parecía hecha por una IA" },
    text: {
      en: "Built from our parts, it still didn't look like our products.",
      es: "Hecha con nuestras piezas, seguía sin parecerse a nuestros productos.",
    },
  },
  {
    id: "usable",
    title: { en: "It wasn't usable", es: "No era usable" },
    text: {
      en: "Actions were missing, some parts were broken, and the flows weren't defined.",
      es: "Faltaban acciones, había partes rotas y los flujos no estaban definidos.",
    },
  },
  {
    id: "ia",
    title: {
      en: "The architecture didn't hold",
      es: "La arquitectura no se sostenía",
    },
    text: {
      en: "Whole jobs were crammed into single pages. «Assignments» sat in the sidebar with no screen of its own.",
      es: "Tareas completas se amontonaban en una sola página. «Asignaciones» estaba en la barra lateral sin pantalla propia.",
    },
  },
];

export const BEFORE_EXAMPLE: Rule = {
  id: "templates",
  title: {
    en: "Template editor: five drawers, then seven flows",
    es: "Editor de plantillas: de cinco cajones a siete flujos",
  },
  body: {
    en: "The v1.0 template editor was one page with five drawers: questionnaire, page, question, conditional question and file. Now each job is a flow of its own, seven in all: create, edit and publish, pages and questions, add a question, activation rules, reorder and delete, and discard a draft.",
    es: "El editor de plantillas de la v1.0 era una página con cinco cajones: cuestionario, página, pregunta, pregunta condicional y archivo. Ahora cada tarea es un flujo propio, siete en total: crear, editar y publicar, páginas y preguntas, añadir una pregunta, reglas de activación, reordenar y eliminar, y descartar un borrador.",
  },
  why: {
    en: "Each job gets its own steps, so nobody has to find it inside a drawer.",
    es: "Cada tarea tiene sus propios pasos, así que nadie tiene que buscarla dentro de un cajón.",
  },
};

/* ------------------------------------------------------------- what we did */

export const VERSION_LABELS: { before: B; after: B } = {
  before: { en: "v1.0, before", es: "v1.0, antes" },
  after: { en: "v1.1, after", es: "v1.1, después" },
};

export const FLOW_CAPTION: B = {
  en: "The whole loop, from template to approval, built from the flows on the canvas.",
  es: "El circuito completo, de la plantilla a la aprobación, construido con los flujos del lienzo.",
};

export const DID_HEADING: B = { en: "What we did", es: "Lo que hicimos" };

export const STEP_UX: { title: B; body: B } = {
  title: { en: "Basic UX first", es: "UX básica primero" },
  body: {
    en: "I wrote user stories from the prototype to understand what each screen had to do.",
    es: "Escribí historias de usuario a partir del prototipo para entender qué tenía que hacer cada pantalla.",
  },
};

export const UX_RULES: {
  overview: Rule;
  assignment: Rule;
} = {
  overview: {
    id: "overview",
    title: {
      en: "The overview is the base of operations",
      es: "El panel es la base de operaciones",
    },
    body: {
      en: "Open a drawer to see what's pending in each state. A global view shows our compliance. From here every page is accessible.",
      es: "Cada estado abre un cajón con lo pendiente. Una vista global muestra nuestro cumplimiento. Desde aquí se llega a cualquier página.",
    },
  },
  assignment: {
    id: "assignment",
    title: {
      en: "New assignment, one click from the overview",
      es: "Nueva asignación, a un clic del panel",
    },
    body: {
      en: "You create it from the overview, not the sidebar. If the supplier doesn't exist yet, you can create it right there. Only published templates are offered.",
      es: "Se crea desde el panel, no desde la barra lateral. Si el proveedor no existe, se puede crear desde ahí mismo. Solo se ofrecen plantillas publicadas.",
    },
    why: {
      en: "We expect it to be the most used action, so it sits where people start.",
      es: "Esperamos que sea la acción más usada, así que está donde se empieza.",
    },
  },
};

export const STEP_FLOWS: { title: B; body: B } = {
  title: {
    en: "Flows, every button wired",
    es: "Flujos, con cada botón conectado",
  },
  body: {
    en: "I defined one flow per row: 14 screens became 7 areas and 48 flows. Every button goes somewhere, and each screen is shown in the steps that lead to it. Main cases came first, then edge cases. Two of the first flows turned out to be states of one page, so flows and states got separate rows.",
    es: "Definí un flujo por fila: 14 pantallas se convirtieron en 7 áreas y 48 flujos. Cada botón lleva a algún sitio, y cada pantalla se ve en los pasos por los que se llega a ella. Primero los casos principales, después los casos límite. Dos de los primeros flujos resultaron ser estados de una misma página, así que flujos y estados pasaron a filas distintas.",
  },
};

export const FLOW_RULES: Rule[] = [
  {
    id: "back",
    title: {
      en: "Back goes where you came from",
      es: "Volver lleva a donde venías",
    },
    body: {
      en: "A supplier page opened from an overview card shows «← Overview». Opened from the sidebar, it has no such button: it only goes back to its own section.",
      es: "Una ficha abierta desde una tarjeta del panel muestra «← Panel». Abierta desde la barra lateral, no lleva ese botón: vuelve solo a su propia sección.",
    },
    why: {
      en: "Before, pressing a card jumped to another page with no clear way back.",
      es: "Antes, pulsar una tarjeta saltaba a otra página sin forma clara de volver.",
    },
  },
  {
    id: "preview",
    title: {
      en: "Preview returns to the draft",
      es: "La vista previa devuelve al borrador",
    },
    body: {
      en: "«Preview» opens the portal as the supplier will see it, with conditional questions appearing depending on what they answer. You can answer to test them, and nothing is saved. «Back to the template» returns to the draft exactly as it was.",
      es: "«Vista previa» abre el portal tal como lo verá el proveedor, donde las preguntas condicionales aparecen según lo que conteste. Se puede contestar para probarlas y no se guarda nada. «Volver a la plantilla» regresa al borrador con todo como estaba.",
    },
    why: {
      en: "The first version was a drawer showing a view the supplier never sees. It was pointless, so we replaced it with the real portal.",
      es: "La primera versión era un cajón con una vista que el proveedor nunca ve. No servía, y lo cambiamos por el portal real.",
    },
  },
  {
    id: "disabled",
    title: {
      en: "A disabled button says why",
      es: "Un botón desactivado dice por qué",
    },
    body: {
      en: "«Approve review» and «Return to supplier» show what is missing next to them.",
      es: "«Aprobar revisión» y «Devolver al proveedor» muestran, junto a ellos, qué falta para activarlos.",
    },
    why: {
      en: "Nobody has to guess what is missing.",
      es: "Nadie tiene que adivinar qué le falta.",
    },
  },
  {
    id: "destructive",
    title: {
      en: "Anything destructive asks first",
      es: "Lo destructivo pide confirmación",
    },
    body: {
      en: "Revoke, delete and remove are red, the destructive pattern, so it's clear you're deleting something. They also ask for confirmation. Revoking keeps the answers already sent.",
      es: "Revocar, eliminar y quitar van en rojo, el patrón destructivo, para que se note que se está borrando algo. Además piden confirmación. Revocar conserva las respuestas ya enviadas.",
    },
    why: {
      en: "A wrong click doesn't lose information.",
      es: "Un clic equivocado no pierde información.",
    },
  },
];

export const STEP_BEHAVIOR: { title: B; body: B } = {
  title: { en: "Layout and behavior", es: "Distribución y comportamiento" },
  body: {
    en: "I reviewed how tables, empty states and components behave.",
    es: "Revisé cómo se comportan las tablas, los estados vacíos y los componentes.",
  },
};

export const BEHAVIOR_RULES: Rule[] = [
  {
    id: "rows",
    title: {
      en: "Row actions appear on hover",
      es: "Las acciones de fila aparecen al pasar el ratón",
    },
    body: {
      en: "In a dense table, repeating the same icon or button on every row is noise and distracts. At rest the rows show nothing. On hover or keyboard focus all the actions appear together, as text only, and the ones that delete are red. On touch screens they are always visible.",
      es: "En una tabla densa, repetir el mismo icono o botón en cada fila es ruido y distrae. En reposo las filas no muestran nada. Al pasar el ratón o enfocar la fila aparecen todas las acciones juntas, solo con texto, y las que borran van en rojo. En pantallas táctiles siempre se ven.",
    },
    why: {
      en: "Each action is unique, so text saves people from hunting for icons. It's B2B, and people want to move fast.",
      es: "Cada acción es única, así que el texto evita buscar iconos. Es una herramienta B2B y la gente quiere ir rápido.",
    },
  },
  {
    id: "terms",
    title: {
      en: "Hard terms carry a definition",
      es: "Los términos difíciles llevan definición",
    },
    body: {
      en: "On the overview, «compliance» and «criticality» have a definition with a dotted underline. Statuses are written out, not shown by color alone.",
      es: "En el panel, «conformidad» y «criticidad» tienen una definición con subrayado punteado. Los estados se indican con texto, no solo con color.",
    },
    why: {
      en: "Not everyone starts with the same compliance vocabulary.",
      es: "No todo el mundo parte del mismo vocabulario de cumplimiento.",
    },
  },
];

export const EMPTY_RULE: Rule = {
  id: "empty",
  title: {
    en: "An empty place is never blank",
    es: "Un lugar vacío nunca queda en blanco",
  },
  body: {
    en: "It shows a title, one sentence and at most two actions. A search with no results repeats what was typed and offers one action to undo it.",
    es: "Muestra un título, una frase y como máximo dos acciones. Una búsqueda sin resultados repite lo escrito y ofrece una sola acción para deshacerla.",
  },
  why: {
    en: "I built 3D models from objects on a moodboard, in Afi's brand, to use across all our apps. The small moments internal B2B tools usually overlook now get a touch of brand and are quick to make.",
    es: "Construí modelos 3D a partir de objetos de un moodboard, con la marca de Afi, para usarlos en todas nuestras apps. Los momentos pequeños que las herramientas internas B2B suelen ignorar ahora llevan un toque de marca y se resuelven rápido.",
  },
};

export const STEP_REQS: { title: B; body: B } = {
  title: { en: "Requirements sheet", es: "Hoja de requisitos" },
  body: {
    en: "Functional requirements, user flows, edge cases, error flows and the open decisions, written in Claude Design. The programmer's AI reads it while building, so it doesn't decide the same things again and again. Documenting takes a fraction of the time it used to, and senior developers can spend theirs on more impactful changes.",
    es: "Requisitos funcionales, flujos de usuario, casos límite, flujos de error y las decisiones abiertas, escritos en Claude Design. La IA del desarrollador lee la hoja mientras construye, así que no vuelve a decidir lo mismo una y otra vez. Documentar lleva una fracción del tiempo de antes, y los desarrolladores senior pueden dedicar el suyo a cambios de más impacto.",
  },
};

export const EMPTY_GALLERY_HEADING: B = {
  en: "The empty-state objects",
  es: "Los objetos de los estados vacíos",
};

/* --------------------------------------------------------------- cleanup */

export const CLEANUP_HEADING: B = { en: "The cleanup", es: "La limpieza" };

export const CLEANUP_PARAS: B[] = [
  {
    en: "This was the biggest job. It was also the slowest. I was building SAREVI at the same time, setting patterns and rules for both. The AI kept telling me components used the design system. Many didn't.",
    es: "Fue el trabajo más grande. También el más lento. Estaba construyendo SAREVI a la vez, fijando patrones y reglas para los dos. La IA me decía una y otra vez que los componentes usaban el sistema de diseño. Muchos no lo hacían.",
  },
  {
    en: "They hand-built buttons, spinners and badges the system already had. Earlier audits checked tokens, not how each component was built, so several of them said it was fine.",
    es: "Construían a mano botones, indicadores de carga y etiquetas que el sistema ya tenía. Las auditorías anteriores revisaban los tokens, no cómo estaba construido cada componente, así que varias daban el visto bueno.",
  },
  {
    en: "So the check became code: a written pass or fail for every component, run after every change. I cleaned the system until it passed. Nothing goes live now without a check page I approve.",
    es: "Así que la comprobación pasó a ser código: un aprobado o suspenso escrito para cada componente, que se ejecuta tras cada cambio. Limpié el sistema hasta que lo pasó. Ahora nada se publica sin una página de comprobación que yo valido.",
  },
];

type Stat = { id: string; value: B; label: B };

export const CLEANUP_STATS: Stat[] = [
  {
    id: "share",
    value: { en: "44 of 96", es: "44 de 96" },
    label: {
      en: "components above the atoms rebuilt an atom's job",
      es: "componentes por encima de los átomos rehacían el trabajo de un átomo",
    },
  },
  {
    id: "pieces",
    value: { en: "107 → 0", es: "107 → 0" },
    label: {
      en: "hand-built pieces, cleared between 19 and 20 November",
      es: "piezas hechas a mano, eliminadas entre el 19 y el 20 de noviembre",
    },
  },
  {
    id: "atoms",
    value: { en: "8", es: "8" },
    label: {
      en: "new atoms, so the next component has the part it needs",
      es: "átomos nuevos, para que el siguiente componente tenga la pieza que necesita",
    },
  },
];

/* ---------------------------------------------------------- design system */

export const DS_HEADING: B = { en: "Design system", es: "Sistema de diseño" };

export const DS_PARAS: B[] = [
  {
    en: "I built this design system while building one of our other apps. This product has a different kind of layout, and that helped: it exposed gaps the last app never did.",
    es: "Creé este sistema de diseño mientras construía otra de nuestras apps. Este producto tiene una distribución distinta, y eso sirvió: dejó a la vista huecos que la app anterior nunca mostró.",
  },
  {
    en: "Shadows are one example. The last app had few cards and few shadows, so the system never had to say when a surface gets one. Here it did, so I could define it. That changed the first app a little, and together they are more consistent than before.",
    es: "Un ejemplo son las sombras. La app anterior tenía pocas tarjetas y pocas sombras, así que el sistema nunca tuvo que decir cuándo una superficie la lleva. Aquí sí, y pude definirlo. Eso cambió un poco la primera app, y juntas son más consistentes que antes.",
  },
];

export const DS_QUOTE: B = {
  en: "Consistency is looking the same every time. Coherence is adapting and still being recognizably us. This is a first step toward that.",
  es: "Consistencia es vernos igual siempre. Coherencia es adaptarnos y que se note que somos nosotros. Este es un primer paso en esa dirección.",
};

export const DS_RULE: Rule = {
  id: "align",
  title: {
    en: "Align what is always visible",
    es: "Se alinea lo que siempre se ve",
  },
  body: {
    en: "A back arrow aligns with the title as it looks at rest. If there is any misalignment, the hover state creates it.",
    es: "Una flecha de volver se alinea con el título tal como se ve en reposo. Si hay desajuste, lo crea el estado al pasar el ratón.",
  },
  why: {
    en: "The resting screen is the one people see most of the time.",
    es: "La pantalla en reposo es la que se ve casi siempre.",
  },
};

/* ------------------------------------------------------------------ test */

export const TEST_HEADING: B = { en: "The test", es: "La prueba" };

export const TEST_PARAS: B[] = [
  {
    en: "On 19 November, one-line prompts built two new products from the system: a retirement simulator and a treasury tool, 3 and 5 screens. The component and copy rules held. The Afi theme didn't load, because the README left out the folder that holds it, so 120 of its 614 variables never loaded.",
    es: "El 19 de noviembre, con instrucciones de una sola línea, el sistema generó dos productos nuevos: un simulador de jubilación y una herramienta de tesorería, de 3 y 5 pantallas. Las reglas de componentes y de texto se cumplieron. El tema de Afi no se aplicó: el README no mencionaba la carpeta que lo contiene, así que 120 de sus 614 variables nunca se cargaron.",
  },
  {
    en: "On 24 November I tested structure: the same content laid out different ways. I built a skill that audits a screen against my reference library and comes back with references and ideas. From those, the context and the shape of the questions, it proposes layouts. For this tool's supplier questionnaire, about 40 questions in 6 sections, it built three: a section rail, one question at a time, and summary first. Then it drew the illustrations flat, in the wrong blue, ignoring what the README says about them.",
    es: "El 24 de noviembre puse a prueba la estructura: el mismo contenido distribuido de formas distintas. Construí una skill que audita una pantalla contra mi biblioteca de referencias y devuelve referencias e ideas. A partir de ellas, del contexto y de la forma de las preguntas, propone distribuciones. Para el cuestionario del proveedor de esta herramienta, unas 40 preguntas en 6 secciones, construyó tres: un carril de secciones, una pregunta cada vez y el resumen primero. Después dibujó las ilustraciones planas, en el azul equivocado, sin seguir lo que dice el README sobre ellas.",
  },
];

export const TEST_MISS: B = {
  en: "There was no user test before the handoff. The three layouts were an experiment, not a proposal, so none went into the tool. The README is the next fix: it has to name the theme folder, so the next product loads the Afi theme without me.",
  es: "No hubo prueba con usuarios antes de la entrega. Las tres distribuciones eran un experimento, no una propuesta, así que ninguna pasó a la herramienta. El README es lo siguiente que hay que arreglar: tiene que nombrar la carpeta del tema, para que el próximo producto cargue el tema de Afi sin mí.",
};

/*
 * Still to supply before this ships. Written down here instead of filled with
 * plausible detail:
 *  - the developer is Moi. Richard sends him the finished page to check, then swaps
 *    "the developer" for his name (INTRO, both languages) if he's happy.
 */
