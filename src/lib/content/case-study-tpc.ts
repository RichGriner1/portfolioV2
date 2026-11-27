import * as C from "@/components/tpc/copy";
import type { Bilingual } from "@/lib/i18n";

import type { CaseStudy, StoryMedia } from "./case-studies";

/**
 * Third-party compliance in the beats layout (content/references/case-studies/
 * standard.md). The words live in components/tpc/copy.ts so the copy pass has one
 * file to edit; this module only arranges them into beats and adds the visuals.
 *
 * Live items are boards in public/work/third-party-compliance/demo/cs-*.html: the
 * v1.1 prototype on DS v164, each opened on one screen and state. Rects are the
 * measured boxes of whole components in those boards (1440 px wide).
 */

const DEMO = "/work/third-party-compliance/demo";
const BASE = "/work/third-party-compliance";

/** A title and its sentence as one line: "Title. Sentence." (`sep` ": " for legends). */
const both = (
  a: Bilingual<string>,
  b: Bilingual<string>,
  sep = ". "
): Bilingual<string> => ({
  en: `${a.en}${sep}${b.en}`,
  es: `${a.es}${sep}${b.es}`,
});

const ruleBody = (r: C.Rule): Bilingual<string>[] =>
  r.why ? [r.body, r.why] : [r.body];

/** The v1.0 Templates page on a 1.6 stage: 66 % wide, so 82 % tall, top-left at 17 / 9. */
const V10_AT = { left: 17, top: 9, w: 66, h: 82.1 };
const BEFORE_PINS: Record<C.DiagPinBefore, [number, number]> = {
  "one-page": [0.9, 0.205],
  "code-title": [0.388, 0.367],
  "draft-state": [0.585, 0.367],
  "type-palette": [0.385, 0.643],
  "rules-buried": [0.428, 0.808],
};

const V10: StoryMedia = {
  kind: "composition",
  title: {
    en: "The live product before: the v1.0 Templates page",
    es: "El producto antes: la página Plantillas de la v1.0",
  },
  items: [
    {
      image: `${BASE}/plantillas-v10.webp`,
      imageRatio: 1120 / 1440,
      x: 50,
      y: 50,
      w: V10_AT.w,
      radius: 12,
      sourceW: 1440,
    },
  ],
};

const flowItems = C.FLOW_RULES.filter(
  (r) => r.id === "back" || r.id === "preview"
);
const backRule = flowItems.find((r) => r.id === "back")!;
const previewRule = flowItems.find((r) => r.id === "preview")!;
const disabledRule = C.FLOW_RULES.find((r) => r.id === "disabled")!;
const destructiveRule = C.FLOW_RULES.find((r) => r.id === "destructive")!;
const rowsRule = C.BEHAVIOR_RULES.find((r) => r.id === "rows")!;
const termsRule = C.BEHAVIOR_RULES.find((r) => r.id === "terms")!;

export const TPC_STUDY: CaseStudy = {
  tagline: C.TAGLINE,
  intro: {
    en: C.INTRO.en.slice(0, 2).join(" "),
    es: C.INTRO.es.slice(0, 2).join(" "),
  },
  role: C.ROLE,
  contributions: C.CONTRIBUTIONS,
  bento: [],
  layout: "beats",
  demo: { href: `${DEMO}/V164-Prototipo.dc.html` },
  closing: {
    en: "That's the whole tool: one way of asking, one place to track it.",
    // TODO(afi-redaccion)
    es: "Esa es toda la herramienta: una forma de preguntar y un sitio para seguirlo.",
  },
  story: [
    {
      kicker: { en: "Context", es: "Contexto" },
      heading: {
        en: "A developer built it with AI, from our system.",
        // TODO(afi-redaccion)
        es: "Un desarrollador lo construyó con IA, desde nuestro sistema.",
      },
      navLabel: { en: "Context", es: "Contexto" },
      body: [
        C.BEFORE_LEAD,
        ...C.BEFORE_ISSUES.slice(0, 1).map((i) => both(i.title, i.text)),
      ],
      media: [V10],
    },
    {
      kicker: { en: "The problem", es: "El problema" },
      heading: {
        en: "Three things slowed every supplier check.",
        // TODO(afi-redaccion)
        es: "Tres cosas frenaban cada revisión de un proveedor.",
      },
      navLabel: { en: "The problem", es: "El problema" },
      body: [
        C.PROBLEM_LEAD,
        both(C.BEFORE_ISSUES[1].title, C.BEFORE_ISSUES[1].text),
      ],
      media: [
        {
          ...V10,
          marks: C.DIAGNOSTIC.before.map((pin, i) => ({
            x: +(V10_AT.left + BEFORE_PINS[pin.id][0] * V10_AT.w).toFixed(1),
            y: +(V10_AT.top + BEFORE_PINS[pin.id][1] * V10_AT.h).toFixed(1),
            n: i + 1,
          })),
          legend: C.DIAGNOSTIC.before.map((pin) =>
            both(pin.title, pin.note, ": ")
          ),
        } as StoryMedia,
      ],
    },
    {
      kicker: { en: "The question", es: "La pregunta" },
      heading: {
        en: "Can someone busy build something usable from it?",
        // TODO(afi-redaccion)
        es: "¿Puede alguien con prisa construir algo usable con él?",
      },
      navLabel: { en: "The question", es: "La pregunta" },
      body: [
        { en: C.INTRO.en[2] ?? "", es: C.INTRO.es[2] ?? "" },
        {
          en: "A usability audit of the prototype as it was handed over put numbers on it.",
          // TODO(afi-redaccion)
          es: "Una auditoría de usabilidad del prototipo tal como se entregó le puso cifras.",
        },
      ],
      media: [
        {
          kind: "composition",
          title: {
            en: "What the system gave back: the v1.1 overview",
            es: "Lo que devolvió el sistema: el panel de la v1.1",
          },
          items: [
            {
              src: `${DEMO}/cs-panel.html`,
              rect: { x: 280, y: 64, w: 1136, h: 600 },
              x: 50,
              y: 50,
              w: 84,
              radius: 16,
              fade: "bottom",
            },
          ],
        },
      ],
    },
    {
      kicker: { en: "Chapter 1 · Flows", es: "Capítulo 1 · Flujos" },
      heading: C.STEP_FLOWS.title,
      navLabel: { en: "Flows", es: "Flujos" },
      body: [C.STEP_FLOWS.body],
      switch: [
        {
          label: { en: "The loop", es: "El ciclo" },
          heading: C.FLOW_CAPTION,
          body: [
            {
              en: "Afi publishes a template and assigns it; the supplier answers; Afi reviews, returns or approves. Step through it, or let it play.",
              // TODO(afi-redaccion)
              es: "Afi publica una plantilla y la asigna; el proveedor responde; Afi revisa, devuelve o aprueba. Recórrelo paso a paso o déjalo correr.",
            },
          ],
          media: [{ kind: "artboard", name: "tpc-flow" }],
        },
        {
          label: C.UX_RULES.assignment.title,
          heading: C.UX_RULES.assignment.title,
          body: ruleBody(C.UX_RULES.assignment),
          media: [
            {
              kind: "composition",
              title: {
                en: "A new assignment as a row in the list, saved as a draft",
                es: "Una asignación nueva como fila de la lista, guardada como borrador",
              },
              items: [
                {
                  src: `${DEMO}/cs-new.html`,
                  rect: { x: 313, y: 275, w: 1070, h: 328 },
                  x: 50,
                  y: 50,
                  w: 92,
                  radius: 12,
                },
              ],
            },
          ],
        },
        {
          label: backRule.title,
          heading: backRule.title,
          body: ruleBody(backRule),
          media: [
            {
              kind: "composition",
              title: {
                en: "The same supplier page opened from the overview and from the sidebar",
                es: "La misma ficha abierta desde el panel y desde la barra lateral",
              },
              items: [
                {
                  src: `${DEMO}/cs-ficha-panel.html`,
                  rect: { x: 296, y: 80, w: 340, h: 104 },
                  x: 27,
                  y: 50,
                  w: 42,
                  flat: true,
                  label: {
                    en: "From an overview card",
                    es: "Desde una tarjeta del panel",
                  },
                },
                {
                  src: `${DEMO}/cs-ficha.html`,
                  rect: { x: 296, y: 80, w: 340, h: 104 },
                  x: 73,
                  y: 50,
                  w: 42,
                  flat: true,
                  label: {
                    en: "From the sidebar",
                    es: "Desde la barra lateral",
                  },
                },
              ],
            },
          ],
        },
        {
          label: previewRule.title,
          heading: previewRule.title,
          body: ruleBody(previewRule),
          media: [
            {
              kind: "composition",
              title: {
                en: "The template preview: the portal as the supplier sees it",
                es: "La vista previa de la plantilla: el portal como lo ve el proveedor",
              },
              items: [
                {
                  src: `${DEMO}/cs-preview.html`,
                  viewport: { w: 1440, h: 1120 },
                  rect: { x: 360, y: 173, w: 720, h: 637 },
                  x: 50,
                  y: 50,
                  w: 52,
                  radius: 12,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      kicker: {
        en: "Chapter 2 · Behaviour",
        es: "Capítulo 2 · Comportamiento",
      },
      heading: C.STEP_BEHAVIOR.title,
      navLabel: { en: "Behaviour", es: "Comportamiento" },
      body: [C.STEP_BEHAVIOR.body],
      switch: [
        {
          label: rowsRule.title,
          heading: rowsRule.title,
          body: ruleBody(rowsRule),
          media: [
            {
              kind: "composition",
              title: {
                en: "A supplier's assignments with one row's actions showing",
                es: "Las asignaciones de un proveedor con las acciones de una fila a la vista",
              },
              items: [
                {
                  src: `${DEMO}/cs-ficha-actions.html`,
                  rect: { x: 313, y: 276, w: 1070, h: 184 },
                  x: 50,
                  y: 50,
                  w: 92,
                  radius: 12,
                },
              ],
            },
          ],
        },
        {
          label: termsRule.title,
          heading: termsRule.title,
          body: ruleBody(termsRule),
          media: [
            {
              kind: "composition",
              title: {
                en: "The portfolio summary with a term's definition open",
                es: "El resumen de la cartera con la definición de un término abierta",
              },
              items: [
                {
                  image: `${BASE}/terms-tooltip.png`,
                  imageRatio: 487 / 372,
                  x: 50,
                  y: 50,
                  w: 34,
                  flat: true,
                  sourceW: 372,
                },
              ],
            },
          ],
        },
        {
          label: disabledRule.title,
          heading: disabledRule.title,
          body: ruleBody(disabledRule),
          media: [
            {
              kind: "composition",
              title: {
                en: "A review with questions still undecided: the buttons wait and say why",
                es: "Una revisión con preguntas sin decidir: los botones esperan y dicen por qué",
              },
              items: [
                {
                  src: `${DEMO}/cs-rev.html`,
                  viewport: { w: 1440, h: 1000 },
                  rect: { x: 905, y: 80, w: 487, h: 48 },
                  x: 50,
                  y: 18,
                  w: 60,
                  flat: true,
                },
                {
                  src: `${DEMO}/cs-rev.html`,
                  viewport: { w: 1440, h: 1000 },
                  rect: { x: 576, y: 202, w: 808, h: 404 },
                  x: 50,
                  y: 60,
                  w: 60,
                  radius: 12,
                },
              ],
            },
          ],
        },
        {
          label: destructiveRule.title,
          heading: destructiveRule.title,
          body: ruleBody(destructiveRule),
          media: [
            {
              kind: "composition",
              title: {
                en: "Revoking an assignment asks first, in red",
                es: "Revocar una asignación pide confirmación, en rojo",
              },
              items: [
                {
                  src: `${DEMO}/cs-revocar.html`,
                  rect: { x: 520, y: 357, w: 400, h: 186 },
                  x: 50,
                  y: 50,
                  w: 50,
                  radius: 16,
                },
              ],
            },
          ],
        },
        {
          label: C.EMPTY_RULE.title,
          heading: C.EMPTY_RULE.title,
          body: ruleBody(C.EMPTY_RULE),
          media: [
            {
              kind: "composition",
              title: {
                en: "A search with no results: the 3D magnifier, a sentence and two actions",
                es: "Una búsqueda sin resultados: la lupa 3D, una frase y dos acciones",
              },
              items: [
                {
                  src: `${DEMO}/cs-empty.html`,
                  rect: { x: 312, y: 270, w: 1072, h: 296 },
                  x: 50,
                  y: 50,
                  w: 86,
                  flat: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      kicker: { en: "Chapter 3 · The system", es: "Capítulo 3 · El sistema" },
      heading: C.CLEANUP_HEADING,
      navLabel: { en: "The system", es: "El sistema" },
      body: [C.CLEANUP_PARAS[0]],
      switch: [
        {
          label: C.CLEANUP_HEADING,
          heading: C.CLEANUP_HEADING,
          body: C.CLEANUP_PARAS.slice(1),
          media: [
            {
              kind: "stats",
              items: [
                ...C.CLEANUP_STATS.map((s) => ({
                  value: s.value.en,
                  label: s.label,
                })),
                {
                  value: "96",
                  label: {
                    en: "components checked, pass or fail, after every change",
                    // TODO(afi-redaccion)
                    es: "componentes comprobados, pasa o no pasa, tras cada cambio",
                  },
                },
              ],
            },
          ],
        },
        {
          label: C.DS_HEADING,
          heading: C.DS_HEADING,
          body: C.DS_PARAS,
          media: [
            {
              kind: "composition",
              title: {
                en: "The overview's figure cards: one shadow rule for every surface",
                es: "Las tarjetas de cifras del panel: una sola regla de sombra para cada superficie",
              },
              items: [
                {
                  src: `${DEMO}/cs-panel.html`,
                  rect: { x: 304, y: 158, w: 752, h: 140 },
                  x: 50,
                  y: 50,
                  w: 86,
                  flat: true,
                },
              ],
            },
          ],
        },
        {
          label: { en: "The empty-state set", es: "Los estados vacíos" },
          heading: C.EMPTY_GALLERY_HEADING,
          body: [
            {
              en: "Ten 3D objects in Blender: one light, matte materials, the Afi blue and the Afi symbol, so the small moments internal tools skip get a touch of brand.",
              // TODO(afi-redaccion)
              es: "Diez objetos 3D en Blender: una sola luz, materiales mates, el azul y el símbolo de Afi, para que los momentos pequeños que las herramientas internas se saltan tengan un toque de marca.",
            },
          ],
          media: [
            {
              kind: "composition",
              title: {
                en: "Four of the ten empty-state objects",
                es: "Cuatro de los diez objetos de estado vacío",
              },
              items: ["escudo", "lupa", "registro", "sello"].map((o, i) => ({
                image: `${BASE}/3d/${o}.webp`,
                imageRatio: 480 / 560,
                x: 14 + i * 24,
                y: 50,
                w: 22,
                flat: true,
              })),
            },
          ],
        },
        {
          label: { en: "Requirements sheet", es: "Hoja de requisitos" },
          heading: C.STEP_REQS.title,
          body: [C.STEP_REQS.body],
          media: [
            {
              kind: "composition",
              title: {
                en: "The top of the requirements sheet",
                es: "La parte superior de la hoja de requisitos",
              },
              items: [
                {
                  image: `${BASE}/requirements.webp`,
                  imageRatio: 1150 / 1440,
                  x: 50,
                  y: 56,
                  w: 62,
                  radius: 12,
                  fade: "bottom",
                  sourceW: 1440,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      kicker: { en: "Feedback", es: "Revisión" },
      heading: C.DIAGNOSTIC.heading,
      navLabel: { en: "The audit", es: "La auditoría" },
      body: [
        {
          en: "The audit read the prototype as it was handed over and found what looked fine: controls with nothing behind them, gaps in the flows, and accessibility fixes.",
          // TODO(afi-redaccion)
          es: "La auditoría leyó el prototipo tal como se entregó y encontró lo que parecía estar bien: controles sin nada detrás, huecos en los flujos y arreglos de accesibilidad.",
        },
        {
          en: "Play it through: the problems pinned on v1.0, the audit's counts, then what changed in v1.1.",
          // TODO(afi-redaccion)
          es: "Reprodúcelo: los problemas marcados en la v1.0, las cifras de la auditoría y lo que cambió en la v1.1.",
        },
      ],
      media: [{ kind: "artboard", name: "tpc-diagnostic" }],
    },
    {
      kicker: { en: "Result", es: "Resultado" },
      heading: C.TEST_HEADING,
      navLabel: { en: "Result", es: "Resultado" },
      body: [...C.TEST_PARAS, C.TEST_MISS],
      media: [
        {
          kind: "stats",
          items: [
            {
              value: "14 → 48",
              label: {
                en: "screens became flows",
                es: "pantallas pasaron a flujos",
              },
            },
            ...C.CLEANUP_STATS.slice(1).map((s) => ({
              value: s.value.en,
              label: s.label,
            })),
            {
              value: C.DIAGNOSTIC.audit[0].value.en,
              label: C.DIAGNOSTIC.audit[0].label,
            },
          ],
        },
      ],
    },
  ],
};
