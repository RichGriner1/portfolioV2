import type { StoryClip } from "@/lib/content/case-studies";
import type { Bilingual } from "@/lib/i18n";

/**
 * Screen recordings of the real prototype, one per flow. A clip with no `clip` renders
 * as a dashed placeholder, so the page reads honestly until the file exists. Files live
 * in public/work/third-party-compliance/ as silent, looping mp4s with a jpg poster.
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

type ClipSpec = {
  label: Bilingual<string>;
  clip?: StoryClip;
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
  // Not recorded yet: the requirements sheet lives on the canvas, not in the prototype.
  requirements: {
    label: { en: "Requirements sheet", es: "Hoja de requisitos" },
  },
};
