import type { Bilingual } from "@/lib/i18n";

/**
 * Copy for the Third-party compliance case study, EN first. The Spanish is Richard's
 * own wording from the canvas page, lightly trimmed, and has had no
 * afi-redaccion pass yet.
 *
 * Source of truth for the story: the "Cumplimiento de terceros v1.1" design canvas and
 * Richard's own account. Nothing here is a measured result; the outcome line says what
 * the tool is for, not what it achieved. The facts still to add are listed in
 * TODO_FACTS at the bottom, so they don't get invented.
 */

type B = Bilingual<string>;

// TODO(afi-redaccion)
export const TAGLINE: B = {
  en: "One way of asking suppliers, so teams get answers sooner",
  es: "Una sola forma de pedir a los proveedores, para tener respuesta antes",
};

// TODO(afi-redaccion)
export const INTRO: Bilingual<string[]> = {
  en: [
    "We want to go faster, and tools exist to do so. But every outside product must meet our security requirements and regulations before anyone uses it. With AI, that check comes up far more often.",
    "Third-party compliance is an internal B2B tool used at Afi. It's how we systemize, collect, track and review supplier compliance.",
  ],
  es: [
    "Queremos ir más rápido, y existen herramientas para lograrlo. Pero todo producto externo debe cumplir nuestros requisitos de seguridad y la normativa antes de que nadie lo use. Con la IA, esta comprobación se repite mucho más.",
    "Cumplimiento de terceros es una herramienta interna B2B que se usa en Afi. Con ella sistematizamos, recogemos, seguimos y revisamos el cumplimiento de los proveedores.",
  ],
};

export const ROLE: B = { en: "Product designer", es: "Diseñador de producto" };

export const CONTRIBUTIONS: Bilingual<string[]> = {
  en: [
    "UX flows",
    "Requirements sheet",
    "Prototype",
    "Design system",
    "3D empty states",
  ],
  es: [
    "Flujos de UX",
    "Hoja de requisitos",
    "Prototipo",
    "Sistema de diseño",
    "Estados vacíos en 3D",
  ],
};

/* --------------------------------------------------------------- problem */

export const PROBLEM_HEADING: B = { en: "The problem", es: "El problema" };

// TODO(afi-redaccion)
export const PROBLEM_LEAD: B = {
  en: "We can't use a tool until someone confirms it complies. That wait is what slows us down, and it comes from three pains.",
  es: "No podemos usar una herramienta hasta que alguien confirma que cumple. Esa espera es lo que nos frena, y viene de tres problemas.",
};

export type Pain = {
  kind: "list" | "template" | "overview";
  title: B;
  text: B;
};

// TODO(afi-redaccion)
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
    title: { en: "No template questions", es: "Sin preguntas plantilla" },
    text: {
      en: "With no template questions, we couldn't count on getting the same information each time.",
      es: "Sin preguntas plantilla, no podíamos contar con recibir la misma información cada vez.",
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

// TODO(afi-redaccion)
export const OUTCOME: B = {
  en: "The outcome: one way of asking and one place to track it, so we stay aligned and compliant without losing time.",
  es: "El resultado: una sola forma de pedir y un solo sitio donde seguirlo, para estar alineados y cumplir sin perder tiempo.",
};

/* ------------------------------------------------------------- what we did */

export const DID_HEADING: B = { en: "What we did", es: "Lo que hicimos" };

export type Rule = {
  id: string;
  title: B;
  body: B;
  why?: B;
};

// TODO(afi-redaccion)
export const STEP_START: { title: B; body: B } = {
  title: { en: "Starting point", es: "El punto de partida" },
  body: {
    en: "The v1.0 prototype I was given was missing actions, had a layout that made little sense, and had broken parts. The flows weren't defined but the base of the project was there so I could begin to understand.",
    es: "El prototipo v1.0 que recibí no tenía todas las acciones, tenía una distribución que no tenía mucho sentido y partes rotas. Los flujos no estaban definidos, pero la base del proyecto estaba ahí y me permitió empezar a entender.",
  },
};

// TODO(afi-redaccion)
export const STEP_UX: { title: B; body: B } = {
  title: { en: "Basic UX first", es: "UX básica primero" },
  body: {
    en: "I wrote user stories from the prototype to understand what each screen had to do.",
    es: "Escribí historias de usuario a partir del prototipo para entender qué tenía que hacer cada pantalla.",
  },
};

// TODO(afi-redaccion)
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
      es: "Abre un cajón para ver lo pendiente de cada estado. Una vista global muestra nuestro cumplimiento. Desde aquí se llega a cualquier página.",
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

// TODO(afi-redaccion)
export const STEP_FLOWS: { title: B; body: B } = {
  title: {
    en: "Flows, every button wired",
    es: "Flujos, con cada botón conectado",
  },
  body: {
    en: "I defined one flow per row. Every button goes somewhere, and each screen is shown in the steps that lead to it. I mapped the main cases first, then the edge cases and what those flows look like.",
    es: "Definí un flujo por fila. Cada botón lleva a algún sitio, y cada pantalla se ve en los pasos por los que se llega a ella. Tracé primero los casos principales y después los casos límite, con el aspecto de sus flujos.",
  },
};

// TODO(afi-redaccion)
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
      es: "«Vista previa» abre el portal tal como lo verá el proveedor, con las preguntas condicionales apareciendo según lo que conteste. Se puede contestar para probarlas y no se guarda nada. «Volver a la plantilla» regresa al borrador con todo como estaba.",
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

// TODO(afi-redaccion)
export const STEP_BEHAVIOR: { title: B; body: B } = {
  title: { en: "Layout and behavior", es: "Distribución y comportamiento" },
  body: {
    en: "I reviewed how tables, empty states and components behave.",
    es: "Revisé cómo se comportan las tablas, los estados vacíos y los componentes.",
  },
};

// TODO(afi-redaccion)
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
      es: "En el panel, «conformidad» y «criticidad» tienen una definición con subrayado punteado. Los estados se dicen con texto, no solo con color.",
    },
    why: {
      en: "Not everyone starts with the same compliance vocabulary.",
      es: "No todo el mundo parte del mismo vocabulario de cumplimiento.",
    },
  },
];

// TODO(afi-redaccion)
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

// TODO(afi-redaccion)
export const STEP_REQS: { title: B; body: B } = {
  title: { en: "Requirements sheet", es: "Hoja de requisitos" },
  body: {
    en: "Functional requirements, user flows, edge cases, error flows and the open decisions, written in Claude Design. The programmer's AI reads it while building, so it doesn't decide the same things again and again. Documenting takes a fraction of the time it used to, and senior developers can spend theirs on more impactful changes.",
    es: "Requisitos funcionales, flujos de usuario, casos límite, flujos de error y las decisiones abiertas, escritos en Claude Design. La IA de quien programa lo lee mientras construye, así que no decide lo mismo una y otra vez. Documentar lleva una fracción del tiempo de antes, y los desarrolladores senior pueden dedicar el suyo a cambios de más impacto.",
  },
};

// TODO(afi-redaccion)
export const EMPTY_GALLERY_HEADING: B = {
  en: "The empty-state objects",
  es: "Los objetos de los estados vacíos",
};

/* ---------------------------------------------------------- design system */

export const DS_HEADING: B = { en: "Design system", es: "Sistema de diseño" };

// TODO(afi-redaccion)
export const DS_PARAS: B[] = [
  {
    en: "I built this design system while building one of our other apps. This product has a different kind of layout, and that helped: it exposed gaps the last app never did.",
    es: "Construí este sistema de diseño mientras construía otra de nuestras apps. Este producto tiene una distribución distinta, y eso sirvió: dejó a la vista huecos que la app anterior nunca mostró.",
  },
  {
    en: "Shadows are one example. The last app had few cards and few shadows, so the system never had to say when a surface gets one. Here it did, so I could define it. That changed the first app a little, and together they are more consistent than before.",
    es: "Un ejemplo son las sombras. La app anterior tenía pocas tarjetas y pocas sombras, así que el sistema nunca tuvo que decir cuándo una superficie la lleva. Aquí sí, y pude definirlo. Eso cambió un poco la primera app, y juntas son más consistentes que antes.",
  },
  {
    en: "I also cleaned it up. Earlier we were experimenting, and moving to code left some things that had to be removed or adjusted.",
    es: "También limpié el sistema. Antes estábamos experimentando, y al pasarlo a código quedaron cosas que había que quitar o ajustar.",
  },
];

// TODO(afi-redaccion)
export const DS_QUOTE: B = {
  en: "Consistency is looking the same every time. Coherence is adapting and still being recognizably us. This is a first step toward that.",
  es: "Consistencia es vernos igual siempre. Coherencia es adaptarnos y que se note que somos nosotros. Esto es un primer paso hacia eso.",
};

// TODO(afi-redaccion)
export const DS_RULE: Rule = {
  id: "align",
  title: {
    en: "Align what is always visible",
    es: "Se alinea lo que siempre se ve",
  },
  body: {
    en: "A back arrow aligns with the title as it looks at rest. If there is any misalignment, the hover state creates it.",
    es: "Una flecha de volver se alinea con el título tal como se ve en reposo. Si hay desajuste, lo crea el estado hover.",
  },
  why: {
    en: "The resting screen is the one people see most of the time.",
    es: "La pantalla en reposo es la que se ve casi siempre.",
  },
};

/* ----------------------------------------------------------------- next */

export const NEXT_HEADING: B = { en: "What's next", es: "Lo que sigue" };

// TODO(afi-redaccion)
export const NEXT_BODY: B = {
  en: "The first user test is on 18 November, and its feedback will decide the next changes. Before then, a teammate reviews it. I expect a short list of changes, not a rebuild.",
  es: "La primera prueba con usuarios es el 18 de noviembre, y su feedback decidirá los próximos cambios. Antes, un compañero lo revisa. Espero una lista corta de cambios, no una reconstrucción.",
};

/*
 * Still to supply before this ships. Written down here instead of filled with
 * plausible detail:
 *  - number of suppliers or tools waiting on a check, or requests per month
 *  - how long a check took before (an estimate is fine)
 *  - the regulations and requirements asked for, by name
 *  - one real example of a product that could not be used (unnamed if confidential)
 *  - real prototype screens or clips for the sections still showing placeholders
 *  - confirm the role line and the contribution list
 */
