import type { StoryClip } from "@/lib/content/case-studies";
import type { Bilingual } from "@/lib/i18n";

/**
 * Screen recordings of the real prototype, one per flow. A clip with no `clip` renders
 * as a dashed placeholder, so the page reads honestly until the file exists. Files live
 * in public/work/third-party-compliance/ as silent, looping mp4s with a jpg poster.
 * `still` is for a board captured from the canvas rather than recorded from the prototype.
 */
export type ClipId =
  | "overview"
  | "assignment"
  | "back"
  | "preview"
  | "rows"
  | "terms"
  | "empty"
  | "disabled"
  | "requirements";

export type Still = {
  src: string;
  width: number;
  height: number;
  alt: Bilingual<string>;
};

type ClipSpec = {
  label: Bilingual<string>;
  clip?: StoryClip;
  still?: Still;
};

const BASE = "/work/third-party-compliance";

const rec = (id: string, en: string, es: string): StoryClip => ({
  src: `${BASE}/${id}.mp4`,
  poster: `${BASE}/${id}-poster.jpg`,
  alt: { en, es },
});

export const CLIPS: Record<ClipId, ClipSpec> = {
  overview: {
    label: { en: "Overview and drawer", es: "Panel y cajón" },
    clip: rec(
      "overview",
      "Screen recording of the overview: two cards open a drawer beside the page, which stays where it was.",
      "Grabación del panel: dos tarjetas abren un cajón junto a la página, que se queda donde estaba."
    ),
  },
  assignment: {
    label: { en: "New assignment", es: "Nueva asignación" },
    clip: rec(
      "assignment",
      "Screen recording of creating an assignment from the overview: pick a supplier and a template, then create it.",
      "Grabación de la creación de una asignación desde el panel: elegir proveedor y plantilla, y crearla."
    ),
  },
  back: {
    label: {
      en: "Back from card and from sidebar",
      es: "Volver desde tarjeta y desde barra lateral",
    },
    clip: rec(
      "back",
      "Screen recording: a supplier page opened from the overview shows a back button to it; opened from the sidebar it does not.",
      "Grabación: una ficha abierta desde el panel muestra un botón para volver a él; abierta desde la barra lateral, no."
    ),
  },
  preview: {
    label: { en: "Template preview", es: "Vista previa de la plantilla" },
    clip: rec(
      "preview",
      "Screen recording of the template preview: the portal as the supplier sees it, a conditional question appearing, then back to the draft.",
      "Grabación de la vista previa de la plantilla: el portal tal como lo ve el proveedor, una pregunta condicional que aparece y la vuelta al borrador."
    ),
  },
  rows: {
    label: {
      en: "Row actions on hover",
      es: "Acciones de fila al pasar el ratón",
    },
    clip: rec(
      "rows",
      "Screen recording: row actions appear on hover, the one that revokes is red and opens a confirmation.",
      "Grabación: las acciones de fila aparecen al pasar el ratón, la que revoca va en rojo y abre una confirmación."
    ),
  },
  terms: {
    label: { en: "Hard-term definitions", es: "Definiciones de términos" },
    clip: rec(
      "terms",
      "Screen recording: hovering a dotted term shows its definition.",
      "Grabación: al pasar el ratón por un término punteado aparece su definición."
    ),
  },
  empty: {
    label: { en: "Empty states", es: "Estados vacíos" },
    clip: rec(
      "empty",
      "Screen recording: a search with no results shows an empty state with a 3D illustration and two actions.",
      "Grabación: una búsqueda sin resultados muestra un estado vacío con una ilustración 3D y dos acciones."
    ),
  },
  disabled: {
    label: {
      en: "Disabled buttons say why",
      es: "Botones desactivados",
    },
    clip: rec(
      "disabled",
      "Screen recording: the two review buttons are disabled and the text beside them says how many questions are left to decide.",
      "Grabación: los dos botones de revisión están desactivados y el texto junto a ellos dice cuántas preguntas faltan por decidir."
    ),
  },
  // The sheet lives on the canvas, not in the prototype: the top of page 1 of 3.
  requirements: {
    label: { en: "Requirements sheet", es: "Hoja de requisitos" },
    still: {
      src: `${BASE}/requirements.webp`,
      width: 1440,
      height: 1150,
      alt: {
        en: "The top of the requirements sheet: a product summary (what it is, who uses it, what it replaces, what this version leaves out), then the user flows table, one story per row with the canvas flow that shows it.",
        es: "La parte superior de la hoja de requisitos: un resumen del producto (qué es, quién lo usa, qué sustituye, qué deja fuera esta versión) y la tabla de flujos de usuario, una historia por fila con el flujo del lienzo donde se ve.",
      },
    },
  },
};

/** The template editor before and after, captured from the canvas's v1.0 page and page 5. */
export const TEMPLATES_BEFORE: Still = {
  src: `${BASE}/plantillas-v10.webp`,
  width: 1440,
  height: 1120,
  alt: {
    en: "v1.0 Templates page: the template library table, the full question designer and the activation rules, all stacked on one page.",
    es: "Página Plantillas de la v1.0: la tabla de la biblioteca, el diseñador de preguntas completo y las reglas de activación, todo apilado en una sola página.",
  },
};

export const TEMPLATES_AFTER: Still = {
  src: `${BASE}/plantillas-v11.webp`,
  width: 1440,
  height: 1120,
  alt: {
    en: "v1.1 template editor on its own page: a back link to Templates, the draft's name and status, pages on the left and that page's questions on the right.",
    es: "Editor de plantillas de la v1.1 en su propia página: enlace para volver a Plantillas, nombre y estado del borrador, páginas a la izquierda y las preguntas de la página a la derecha.",
  },
};
