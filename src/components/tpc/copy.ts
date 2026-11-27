import type { Bilingual } from "@/lib/i18n";

/**
 * Copy for the Third-party compliance case study, EN first. The Spanish had its
 * afi-redaccion pass on 2026-11-27 (both revisions that day): Peninsular, first person singular (Richard's
 * voice, not Afi's house plural). ES strings edited after that date get a TODO(afi-redaccion).
 *
 * Source of truth for the story: the "Cumplimiento de terceros" design canvas (its
 * v1.0 page, pages 1–7 and the requirements sheet), the design system's atomic-check
 * baseline, the two generation tests, and Richard's own account.
 *
 * One count for the tool everywhere: 14 screens in v1.0, 7 areas and 48 flows in v1.1.
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
    "Third-party compliance is an internal tool at Afi. Before we use an outside product, its supplier has to prove it meets our security requirements and regulations. With AI, we check far more outside tools than we used to.",
    "The developer building it generated v1.0 with AI from our design system. I redesigned it as v1.1 and handed it back to him to build.",
    "What I cared about went past this tool. Can someone busy, who won't stop to message a designer, build something usable and consistent from our design system?",
  ],
  es: [
    "Cumplimiento de terceros es una herramienta interna de Afi. Antes de usar un producto externo, su proveedor tiene que demostrar que cumple nuestros requisitos de seguridad y la normativa. Con la IA, revisamos muchas más herramientas externas que antes.",
    "El desarrollador que la construye generó la v1.0 con IA a partir de nuestro sistema de diseño. La rediseñé como v1.1 y se la devolví para que la construyera.",
    "Lo que me importaba iba más allá de esta herramienta. ¿Puede alguien con prisa, que no va a pararse a escribir a un diseñador, construir algo usable y consistente con nuestro sistema de diseño?",
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
  en: "Checking a supplier had three gaps.",
  es: "Revisar a un proveedor tenía tres huecos.",
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
    title: { en: "No common format", es: "Sin formato común" },
    text: {
      en: "Each supplier answered in their own format, a yes here and a PDF there, so answers couldn't be compared.",
      es: "Cada proveedor respondía a su manera, un sí aquí y un PDF allá, así que las respuestas no se podían comparar.",
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
  en: "What the tool does: one set of questions for every supplier, and one place to see where each review stands.",
  es: "Lo que hace la herramienta: un mismo cuestionario para todos los proveedores y un solo sitio donde ver en qué punto está cada revisión.",
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
    en: "Template editor: from drawers to its own page",
    es: "Editor de plantillas: de cajones a una página propia",
  },
  body: {
    en: "v1.0 put the template library, the question editor and the activation rules on one page, with editing in five drawers. In v1.1 the editor has its own page. Each job is a flow of its own: create, publish, edit pages and questions, set activation rules, reorder, discard a draft.",
    es: "La v1.0 ponía la biblioteca de plantillas, el editor de preguntas y las reglas de activación en una página, con la edición en cinco cajones. En la v1.1 el editor tiene su propia página. Cada tarea es un flujo propio: crear, publicar, editar páginas y preguntas, definir reglas de activación, reordenar y descartar un borrador.",
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

export type FlowLane = "admin" | "supplier" | "review";

export type FlowStep = {
  id: string;
  lane: FlowLane;
  title: B;
  caption: B;
};

/**
 * The loop, one beat at a time, for the flow walkthrough. Every caption traces to a
 * row of the v1.1 requirements sheet (flows 2.3, 3.3, 3.4, 4.2–4.4, 7.1–7.5).
 */
export const FLOW_STEPS: FlowStep[] = [
  {
    id: "publish",
    lane: "admin",
    title: { en: "Publish a template", es: "Publicar una plantilla" },
    caption: {
      en: "Only published versions can be sent, so no supplier gets a half-finished questionnaire.",
      es: "Solo se pueden enviar versiones publicadas, así que ningún proveedor recibe un cuestionario a medias.",
    },
  },
  {
    id: "assign",
    lane: "admin",
    title: { en: "Create the assignment", es: "Crear la asignación" },
    caption: {
      en: "Pick the supplier, the template and a due date.",
      es: "Se elige proveedor, plantilla y fecha límite.",
    },
  },
  {
    id: "send",
    lane: "admin",
    title: { en: "Send to contacts", es: "Enviar a los contactos" },
    caption: {
      en: "It goes only to the supplier's authorized contacts, so the answers come from someone who can speak for them.",
      es: "Solo llega a los contactos autorizados del proveedor, para que responda alguien que puede hablar en su nombre.",
    },
  },
  {
    id: "sign-in",
    lane: "supplier",
    title: { en: "Sign in with a code", es: "Entrar con un código" },
    caption: {
      en: "The contact enters their email and gets a one-time code. There is no password to create or forget.",
      es: "El contacto escribe su correo y recibe un código de un solo uso. No hay contraseña que crear ni olvidar.",
    },
  },
  {
    id: "answer",
    lane: "supplier",
    title: { en: "Answer or save", es: "Responder o guardar" },
    caption: {
      en: "Some questions only appear after certain answers. Progress can be saved, so a long questionnaire doesn't have to be done in one go.",
      es: "Algunas preguntas solo aparecen tras ciertas respuestas. El avance se puede guardar, así que un cuestionario largo no hay que hacerlo de una vez.",
    },
  },
  {
    id: "submit",
    lane: "supplier",
    title: { en: "Check and send", es: "Revisar y enviar" },
    caption: {
      en: "A summary shows every answer. It can't be sent while a required question is empty.",
      es: "Un resumen muestra todas las respuestas. No se puede enviar con una pregunta obligatoria sin responder.",
    },
  },
  {
    id: "review",
    lane: "review",
    title: { en: "Review each answer", es: "Revisar cada respuesta" },
    caption: {
      en: "The reviewer marks each answer as compliant or as needing more information, with a comment for the supplier.",
      es: "Quien revisa marca cada respuesta como conforme o como que requiere más información, con un comentario para el proveedor.",
    },
  },
  {
    id: "return",
    lane: "review",
    title: { en: "Return with comments", es: "Devolver con comentarios" },
    caption: {
      en: "If any answer needs more information, the questionnaire goes back to the supplier with the comments attached.",
      es: "Si alguna respuesta necesita más información, el cuestionario vuelve al proveedor con los comentarios.",
    },
  },
  {
    id: "correct",
    lane: "supplier",
    title: { en: "Correct and resend", es: "Corregir y reenviar" },
    caption: {
      en: "Each flagged question shows Afi's comment, and a notice says how many there are, so the supplier knows what to fix before resending.",
      es: "Cada pregunta marcada muestra el comentario de Afi, y un aviso indica cuántas son, así que el proveedor sabe qué corregir antes de reenviar.",
    },
  },
  {
    id: "review-again",
    lane: "review",
    title: { en: "Review again", es: "Revisar de nuevo" },
    caption: {
      en: "The resent answers come back to the review queue for a new decision.",
      es: "Las respuestas reenviadas vuelven a la cola de revisión para una nueva decisión.",
    },
  },
  {
    id: "approve",
    lane: "review",
    title: { en: "Approve", es: "Aprobar" },
    caption: {
      en: "Only possible when every answer is compliant. It asks for confirmation, then closes the review.",
      es: "Solo es posible cuando todas las respuestas son conformes. Pide confirmación y cierra la revisión.",
    },
  },
];

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
      en: "Everything starts on the overview",
      es: "Todo empieza en el panel",
    },
    body: {
      en: "Each card opens a drawer with what's pending in that state. A summary shows our overall compliance.",
      es: "Cada tarjeta abre un cajón con lo pendiente de ese estado. Un resumen muestra nuestro cumplimiento general.",
    },
  },
  assignment: {
    id: "assignment",
    title: {
      en: "New assignment, one click from the overview",
      es: "Nueva asignación, a un clic del panel",
    },
    body: {
      en: "You create it from the overview, not the sidebar. If the supplier doesn't exist yet, you can add it right there.",
      es: "Se crea desde el panel, no desde la barra lateral. Si el proveedor no existe, se puede dar de alta ahí mismo.",
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
    en: "I defined one flow per row: v1.0's 14 screens became 7 areas and 48 flows. Every button goes somewhere. Each screen appears in the steps that lead to it. Main cases came first, then edge cases. Two of the first flows turned out to be states of one page, so flows and states got separate rows.",
    es: "Definí un flujo por fila: las 14 pantallas de la v1.0 se convirtieron en 7 áreas y 48 flujos. Cada botón lleva a algún sitio. Cada pantalla aparece en los pasos por los que se llega a ella. Primero los casos principales, después los casos límite. Dos de los primeros flujos resultaron ser estados de una misma página, así que flujos y estados pasaron a filas distintas.",
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
      en: "«Preview» opens the portal as the supplier will see it, and conditional questions appear depending on what you answer. You can answer to test them. Nothing is saved. «Back to the template» returns to the draft exactly as it was.",
      es: "«Vista previa» abre el portal tal como lo verá el proveedor, donde las preguntas condicionales aparecen según lo que se conteste. Se puede contestar para probarlas. No se guarda nada. «Volver a la plantilla» regresa al borrador con todo como estaba.",
    },
    why: {
      en: "The first version was a drawer showing a view the supplier never sees, so we replaced it with the real portal.",
      es: "La primera versión era un cajón con una vista que el proveedor nunca ve, así que la cambiamos por el portal real.",
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
  },
  {
    id: "destructive",
    title: {
      en: "Anything destructive asks first",
      es: "Lo destructivo pide confirmación",
    },
    body: {
      en: "Revoke, delete and remove are red, the destructive pattern. They also ask for confirmation. Revoking keeps the answers already sent.",
      es: "Revocar, eliminar y quitar van en rojo, el patrón destructivo. Además piden confirmación. Revocar conserva las respuestas ya enviadas.",
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
      en: "In a dense table, the same icon or button repeated on every row is noise. At rest the rows show nothing. On hover or keyboard focus, all the actions appear together as text. On touch screens they are always visible.",
      es: "En una tabla densa, el mismo icono o botón repetido en cada fila es ruido. En reposo las filas no muestran nada. Al pasar el ratón o enfocar la fila, aparecen todas las acciones juntas como texto. En pantallas táctiles siempre se ven.",
    },
    why: {
      en: "Each action is different, so a word is faster to read than an icon to decode.",
      es: "Cada acción es distinta, así que una palabra se lee antes que un icono.",
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
  // The 3D objects are explained once, in the gallery's "The set" step (empty-gallery.tsx).
  why: {
    en: "An empty table and a broken page look the same. A title and one next step tell them apart.",
    es: "Una tabla vacía y una página rota se parecen. Un título y un siguiente paso las distinguen.",
  },
};

export const STEP_REQS: { title: B; body: B } = {
  title: { en: "Requirements sheet", es: "Hoja de requisitos" },
  body: {
    en: "Functional requirements, user flows, edge cases, error flows and the open decisions, written in Claude Design. The developer's AI reads it while it builds, so it doesn't re-decide what the sheet already settles.",
    es: "Requisitos funcionales, flujos de usuario, casos límite, flujos de error y las decisiones abiertas, escritos en Claude Design. La IA del desarrollador lee la hoja mientras construye, así que no vuelve a decidir lo que la hoja ya resuelve.",
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
    en: "The cleanup took longer than anything else. The AI kept telling me components used the design system. Many didn't.",
    es: "La limpieza llevó más tiempo que nada. La IA me decía una y otra vez que los componentes usaban el sistema de diseño. Muchos no lo hacían.",
  },
  {
    en: "They hand-built buttons, spinners and badges the system already had. Earlier audits checked tokens, not how components were built, so several audits passed them.",
    es: "Construían a mano botones, indicadores de carga y etiquetas que el sistema ya tenía. Las auditorías anteriores revisaban los tokens, no cómo estaban construidos los componentes, así que varias los daban por buenos.",
  },
  {
    en: "So I turned the check into code: a written pass or fail for every component, run after every change. I cleaned the system until everything passed. Now nothing goes live until I've approved a page showing what changed.",
    es: "Así que convertí la comprobación en código: un aprobado o suspenso escrito para cada componente, que se ejecuta tras cada cambio. Limpié el sistema hasta que todo pasó. Ahora nada se publica hasta que apruebo una página que muestra qué ha cambiado.",
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
      en: "new atoms, including Separator and Pill",
      es: "átomos nuevos, entre ellos Separator y Pill",
    },
  },
];

/* ---------------------------------------------------------- design system */

export const DS_HEADING: B = { en: "Design system", es: "Sistema de diseño" };

export const DS_PARAS: B[] = [
  {
    en: "I built the design system alongside SAREVI, another of our apps, with patterns and rules shared by both. This tool's layout is different, which helped: it exposed gaps SAREVI never hit.",
    es: "Construí el sistema de diseño junto con SAREVI, otra de nuestras apps, con patrones y reglas comunes a las dos. La distribución de esta herramienta es distinta, y eso ayudó: dejó a la vista huecos que SAREVI nunca había tocado.",
  },
  {
    en: "Shadows are one example. SAREVI has few cards, so the system never had to say when a surface gets a shadow. This tool needed the rule, so I wrote it, and SAREVI changed a little to follow it.",
    es: "Un ejemplo son las sombras. SAREVI tiene pocas tarjetas, así que el sistema nunca tuvo que decir cuándo una superficie lleva sombra. Esta herramienta necesitaba la regla, así que la escribí, y SAREVI cambió un poco para seguirla.",
  },
];

export const DS_QUOTE: B = {
  en: "Each app keeps the layout its job needs, and both still look like Afi.",
  es: "Cada app mantiene la distribución que su tarea necesita, y las dos se reconocen como Afi.",
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
    en: "On 19 November, one-line prompts built two new products from the system: a retirement simulator and a treasury tool, 3 and 5 screens. The component and copy rules held. The README left out the theme folder, so 120 of the Afi theme's 614 variables never loaded.",
    es: "El 19 de noviembre, con instrucciones de una sola línea, el sistema generó dos productos nuevos: un simulador de jubilación y una herramienta de tesorería, de 3 y 5 pantallas. Las reglas de componentes y de texto se cumplieron. El README no mencionaba la carpeta del tema, así que 120 de las 614 variables del tema de Afi nunca se cargaron.",
  },
  {
    en: "On 24 November I tested structure: the same content laid out different ways. I built a skill that audits a screen against my reference library and comes back with references and ideas. It proposes layouts from those references, the screen's context and the shape of its questions. For this tool's supplier questionnaire, about 40 questions in 6 sections, it built three: a section rail, one question at a time, and summary first. Then it drew the questionnaire's illustrations flat, in the wrong blue, ignoring what the README says about them.",
    es: "El 24 de noviembre puse a prueba la estructura: el mismo contenido distribuido de formas distintas. Construí una skill que audita una pantalla contra mi biblioteca de referencias y devuelve referencias e ideas. Propone distribuciones a partir de esas referencias, del contexto de la pantalla y de la forma de sus preguntas. Para el cuestionario del proveedor de esta herramienta, unas 40 preguntas en 6 secciones, construyó tres: un carril de secciones, una pregunta cada vez y el resumen primero. Después dibujó las ilustraciones del cuestionario planas, en el azul equivocado, sin seguir lo que dice el README sobre ellas.",
  },
];

export const TEST_MISS: B = {
  en: "There was no user test before the handoff. The three layouts were an experiment, not a proposal, so none went into the tool. The README is the next fix: it has to name the theme folder, so the next product loads the Afi theme without me.",
  es: "No hubo prueba con usuarios antes de la entrega. Las tres distribuciones eran un experimento, no una propuesta, así que ninguna pasó a la herramienta. El README es lo siguiente que hay que arreglar: tiene que nombrar la carpeta del tema, para que el próximo producto cargue el tema de Afi sin mí.",
};

/* ------------------------------------------------------------ diagnostic */

export type DiagPinBefore =
  | "one-page"
  | "code-title"
  | "draft-state"
  | "type-palette"
  | "rules-buried";

export type DiagPinAfter =
  | "back-link"
  | "draft-actions"
  | "pages"
  | "add-question";

type DiagPin<Id> = { id: Id; title: B; note: B };

/**
 * The annotated before/after of the template editor. `before` pins sit on
 * plantillas-v10.webp, `after` pins on plantillas-v11.webp, each worded from what the
 * screen shows. `audit` counts come from the usability audit of the prototype
 * (~/Desktop/Code/cumplimiento-terceros-canvas/AUDIT-V11.md, a code read on 16 Nov):
 * 15 entries on its dead-controls list, 6 numbered flow gaps, 4 accessibility fixes
 * (the status-badge check passed, the focus line is a re-check). Whether every dead
 * control works now is not claimed.
 */
export const DIAGNOSTIC: {
  heading: B;
  before: DiagPin<DiagPinBefore>[];
  audit: { id: string; value: B; label: B }[];
  after: DiagPin<DiagPinAfter>[];
} = {
  heading: { en: "The usability audit", es: "La auditoría de usabilidad" },
  before: [
    {
      id: "one-page",
      title: { en: "Everything on one page", es: "Todo en una página" },
      note: {
        en: "The template list, the question editor and the activation rules stack on the same page.",
        es: "La lista de plantillas, el editor de preguntas y las reglas de activación se apilan en la misma página.",
      },
    },
    {
      id: "code-title",
      title: { en: "Titled by code", es: "Titulado con un código" },
      note: {
        en: "The editor says «SEG-01 v4», not the template's name.",
        es: "El editor dice «SEG-01 v4», no el nombre de la plantilla.",
      },
    },
    {
      id: "draft-state",
      title: { en: "No way out of a draft", es: "Un borrador sin salida" },
      note: {
        en: "A draft can be published, but nothing lets you throw it away.",
        es: "Un borrador se puede publicar, pero nada permite descartarlo.",
      },
    },
    {
      id: "type-palette",
      title: {
        en: "Five types, always open",
        es: "Cinco tipos, siempre abiertos",
      },
      note: {
        en: "The five question types stay listed in the left column, whether you're adding a question or not.",
        es: "Los cinco tipos de pregunta siguen en la columna izquierda, se esté añadiendo una pregunta o no.",
      },
    },
    {
      id: "rules-buried",
      title: { en: "Rules at the bottom", es: "Las reglas, al final" },
      note: {
        en: "The activation rules sit under everything, and they belong to TRI-01, not the template being edited.",
        es: "Las reglas de activación quedan debajo de todo y son de TRI-01, no de la plantilla que se edita.",
      },
    },
  ],
  audit: [
    {
      id: "dead",
      value: { en: "15", es: "15" },
      label: {
        en: "controls that did nothing",
        es: "controles que no hacían nada",
      },
    },
    {
      id: "gaps",
      value: { en: "6", es: "6" },
      label: {
        en: "gaps in the flows",
        es: "huecos en los flujos",
      },
    },
    {
      id: "a11y",
      value: { en: "4", es: "4" },
      label: {
        en: "accessibility fixes against WCAG 2.2 AA",
        es: "arreglos de accesibilidad según WCAG 2.2 AA",
      },
    },
  ],
  after: [
    {
      id: "back-link",
      title: { en: "Its own page", es: "Una página propia" },
      note: {
        en: "The editor opens as a page of its own, with «← Plantillas» to go back.",
        es: "El editor se abre como una página propia, con «← Plantillas» para volver.",
      },
    },
    {
      id: "draft-actions",
      title: {
        en: "Name first, then actions",
        es: "Primero el nombre, después las acciones",
      },
      note: {
        en: "The template's name and its draft badge come first, and «Descartar borrador» sits beside «Publicar versión».",
        es: "El nombre de la plantilla y su etiqueta de borrador van primero, y «Descartar borrador» está junto a «Publicar versión».",
      },
    },
    {
      id: "pages",
      title: { en: "Pages on the left", es: "Páginas a la izquierda" },
      note: {
        en: "The pages list on the left with «Añadir página» under it, and the chosen page's questions on the right.",
        es: "Las páginas a la izquierda con «Añadir página» debajo, y las preguntas de la página elegida a la derecha.",
      },
    },
    {
      id: "add-question",
      title: { en: "One add button", es: "Un solo botón para añadir" },
      note: {
        en: "One «Añadir pregunta» button replaces the open list, and the type is chosen after.",
        es: "Un único botón «Añadir pregunta» sustituye a la lista abierta, y el tipo se elige después.",
      },
    },
  ],
};

/*
 * Still to supply before this ships. Written down here instead of filled with
 * plausible detail:
 *  - the developer is Moi. Richard sends him the finished page to check, then swaps
 *    "the developer" for his name (INTRO, both languages) if he's happy.
 */
