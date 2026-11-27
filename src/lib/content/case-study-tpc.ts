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
    en: "Try the loop yourself: send a questionnaire, answer it as the supplier, then review it.",
    es: "Prueba el circuito: envía un cuestionario, respóndelo como proveedor y revísalo.",
  },
  story: [
    {
      kicker: { en: "Context", es: "Contexto" },
      heading: {
        en: "A developer built v1.0 with AI, from our system.",
        es: "Un desarrollador hizo la v1.0 con IA, a partir de nuestro sistema.",
      },
      navLabel: { en: "Context", es: "Contexto" },
      body: [
        {
          en: "Three people use it: an Afi admin who sends questionnaires, a supplier contact who answers them, and an Afi reviewer who decides. Before, those questionnaires traveled by email and spreadsheets.",
          es: "La usan tres personas: un administrador de Afi que envía cuestionarios, un contacto del proveedor que los responde y un revisor de Afi que decide. Antes, esos cuestionarios iban y venían por correo y hojas de cálculo.",
        },
        {
          en: "v1.0 used our components, so it looked close. It still read as AI-made, not like our other products.",
          es: "La v1.0 usaba nuestros componentes, así que el aspecto se acercaba. Aun así, se notaba que la había hecho una IA y no se parecía a nuestros otros productos.",
        },
      ],
      media: [V10],
    },
    {
      kicker: { en: "The problem", es: "El problema" },
      heading: {
        en: "The template editor alone showed five problems.",
        es: "Solo el editor de plantillas tenía cinco problemas.",
      },
      navLabel: { en: "The problem", es: "El problema" },
      body: [
        {
          en: "v1.0 stacked the template list, the question editor and the activation rules on one page, and editing happened in five drawers.",
          es: "La v1.0 apilaba la lista de plantillas, el editor de preguntas y las reglas de activación en una página, y la edición se hacía en cinco paneles laterales.",
        },
        {
          en: "Across the rest of the tool, actions were missing, some parts were broken and the flows weren't defined.",
          es: "En el resto de la herramienta faltaban acciones, había partes rotas y los flujos no estaban definidos.",
        },
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
        en: "What if nobody had to ask a designer first?",
        es: "¿Y si nadie tuviera que preguntar antes a un diseñador?",
      },
      navLabel: { en: "The question", es: "La pregunta" },
      body: [
        {
          en: "The developer is busy, and every question he sends me means waiting. The rules had to live in the system and a requirements sheet, where his AI can follow them without asking.",
          es: "El desarrollador está ocupado y cada pregunta que me hace supone una espera. Las reglas tenían que estar en el sistema y en una hoja de requisitos, donde su IA puede seguirlas sin preguntar.",
        },
        {
          en: "So v1.1 had two jobs: fix the tool, and find the rules the system was missing.",
          es: "Así que la v1.1 tenía dos tareas: arreglar la herramienta y encontrar las reglas que le faltaban al sistema.",
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
      heading: {
        en: "Every button in v1.1 opens a defined flow.",
        es: "Cada botón de la v1.1 abre un flujo definido.",
      },
      navLabel: { en: "Flows", es: "Flujos" },
      body: [
        {
          en: "I defined one flow per row: v1.0's 14 screens became 7 areas and 48 flows.",
          es: "Definí un flujo por fila: las 14 pantallas de la v1.0 se convirtieron en 7 áreas y 48 flujos.",
        },
        {
          en: "Main cases came first, then edge cases. Two of the first flows turned out to be states of one page, so flows and states got separate rows.",
          es: "Primero los casos principales, después los casos límite. Dos de los primeros flujos resultaron ser estados de una misma página, así que flujos y estados pasaron a filas distintas.",
        },
      ],
      switch: [
        {
          label: { en: "The loop", es: "El ciclo" },
          heading: {
            en: "One loop runs from template to approval.",
            es: "Un solo circuito va de la plantilla a la aprobación.",
          },
          body: [
            {
              en: "Afi publishes a template and assigns it; the supplier answers; Afi reviews, returns or approves. Step through it, or let it play.",
              es: "Afi publica una plantilla y la asigna; el proveedor responde; Afi revisa, devuelve o aprueba. Recórrelo paso a paso o deja que avance solo.",
            },
          ],
          media: [{ kind: "artboard", name: "tpc-flow" }],
        },
        {
          label: {
            en: "New assignment",
            es: "Nueva asignación",
          },
          heading: {
            en: "The most used action starts on the overview.",
            es: "La acción más usada empieza en el panel.",
          },
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
          label: {
            en: "Back",
            es: "Volver",
          },
          heading: {
            en: "Back returns to the screen you came from.",
            es: "Volver regresa a la pantalla de la que vienes.",
          },
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
                  rect: { x: 288, y: 72, w: 388, h: 124 },
                  x: 27,
                  y: 52,
                  w: 42,
                  radius: 12,
                  label: {
                    en: "From an overview card",
                    es: "Desde una tarjeta del panel",
                  },
                },
                {
                  src: `${DEMO}/cs-ficha.html`,
                  rect: { x: 288, y: 72, w: 388, h: 124 },
                  x: 73,
                  y: 52,
                  w: 42,
                  radius: 12,
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
          label: {
            en: "Preview",
            es: "Vista previa",
          },
          heading: {
            en: "Preview shows the supplier's real portal.",
            es: "La vista previa muestra el portal real del proveedor.",
          },
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
      heading: {
        en: "Each pattern got one rule the AI can follow.",
        es: "Cada patrón tiene una regla que la IA puede seguir.",
      },
      navLabel: { en: "Behaviour", es: "Comportamiento" },
      body: [
        {
          en: "In v1.0, every row repeated its own buttons, and a disabled button gave no reason.",
          es: "En la v1.0, cada fila repetía sus propios botones, y un botón desactivado no explicaba por qué.",
        },
        {
          en: "I set one rule per pattern, so the developer's AI applies it the same way on every screen.",
          es: "Fijé una regla por patrón, para que la IA del desarrollador la aplique igual en todas las pantallas.",
        },
      ],
      switch: [
        {
          label: {
            en: "Row actions",
            es: "Acciones de fila",
          },
          heading: {
            en: "Row actions wait until you point at the row.",
            es: "Las acciones de fila solo aparecen al pasar el ratón por encima.",
          },
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
          label: {
            en: "Definitions",
            es: "Definiciones",
          },
          heading: {
            en: "«Compliance» and «criticality» carry their own definition.",
            es: "«Conformidad» y «criticidad» llevan su propia definición.",
          },
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
          label: {
            en: "Disabled buttons",
            es: "Botones desactivados",
          },
          heading: {
            en: "A disabled button says what's missing.",
            es: "Un botón desactivado dice qué falta.",
          },
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
                  rect: { x: 893, y: 72, w: 507, h: 64 },
                  x: 50,
                  y: 17,
                  w: 62,
                  radius: 12,
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
          label: {
            en: "Deleting",
            es: "Borrar",
          },
          heading: {
            en: "Anything that deletes is red and asks first.",
            es: "Todo lo que borra va en rojo y pide confirmación.",
          },
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
          label: {
            en: "Empty states",
            es: "Estados vacíos",
          },
          heading: {
            en: "An empty screen always says what to do next.",
            es: "Una pantalla vacía siempre dice qué hacer después.",
          },
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
                  radius: 12,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      kicker: { en: "Chapter 3 · The system", es: "Capítulo 3 · El sistema" },
      heading: {
        en: "Nearly half the components hand-built their own parts.",
        es: "Casi la mitad de los componentes construían sus piezas a mano.",
      },
      navLabel: { en: "The system", es: "El sistema" },
      body: [C.CLEANUP_PARAS[0]],
      switch: [
        {
          label: {
            en: "The check",
            es: "La comprobación",
          },
          heading: {
            en: "A check in code now passes or fails each component.",
            es: "Ahora una comprobación en código aprueba o suspende cada componente.",
          },
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
                  // The latest atomic-check run (2026-11-20, v107): 143 components, 0 failing.
                  value: "143",
                  label: {
                    en: "components checked, pass or fail, after every change",
                    es: "componentes comprobados, pasa o no pasa, tras cada cambio",
                  },
                },
              ],
            },
          ],
        },
        {
          label: {
            en: "Shadows",
            es: "Sombras",
          },
          heading: {
            en: "This tool exposed gaps SAREVI never hit.",
            es: "Esta herramienta destapó huecos que SAREVI nunca tocó.",
          },
          body: C.DS_PARAS,
          media: [
            {
              kind: "composition",
              title: {
                en: "The overview's figure cards: one shadow rule for every surface",
                es: "Las tarjetas de cifras del panel: una sola regla de sombra para cada superficie",
              },
              items: [
                ...[312, 562, 813].map((x, i) => ({
                  src: `${DEMO}/cs-panel.html`,
                  rect: { x, y: 166, w: 235, h: 124 },
                  x: 19 + i * 31,
                  y: 50,
                  w: 29,
                  flat: true,
                  radius: 12,
                })),
              ],
            },
          ],
        },
        {
          label: {
            en: "3D objects",
            es: "Objetos 3D",
          },
          heading: {
            en: "Ten 3D objects in Afi blue fill the empty screens.",
            es: "Diez objetos 3D en azul Afi llenan las pantallas vacías.",
          },
          body: [
            {
              en: "Ten 3D objects in Blender: one light, matte materials, the Afi blue and the Afi symbol, so the small moments internal tools skip get a touch of brand.",
              es: "Diez objetos 3D en Blender: una sola luz, materiales mates, el azul y el símbolo de Afi, para que los pequeños momentos que las herramientas internas suelen descuidar tengan un toque de marca.",
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
          heading: {
            en: "The requirements sheet is written for the developer's AI.",
            es: "La hoja de requisitos está escrita para la IA del desarrollador.",
          },
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
      heading: {
        en: "An audit counted 15 controls that did nothing.",
        es: "Una auditoría contó 15 controles que no hacían nada.",
      },
      navLabel: { en: "The audit", es: "La auditoría" },
      body: [
        {
          en: "The audit checked the prototype as it was handed over and found problems that looked fine: controls with nothing behind them, gaps in the flows, accessibility fixes.",
          es: "La auditoría revisó el prototipo tal como se entregó y encontró problemas que parecían estar bien: controles sin nada detrás, huecos en los flujos y arreglos pendientes de accesibilidad.",
        },
        {
          en: "Play it through: the problems pinned on v1.0, the audit's counts, then what changed in v1.1.",
          es: "Reprodúcelo: los problemas marcados en la v1.0, las cifras de la auditoría y lo que cambió en la v1.1.",
        },
      ],
      media: [{ kind: "artboard", name: "tpc-diagnostic" }],
    },
    {
      kicker: { en: "Result", es: "Resultado" },
      heading: {
        en: "The rules held, but the theme didn't load.",
        es: "Las reglas se cumplieron, pero el tema no cargó.",
      },
      navLabel: { en: "Result", es: "Resultado" },
      body: [
        {
          en: "On 19 November, one-line prompts built two new products from the system. The component and copy rules held. The theme didn't load, because the README left out its folder.",
          es: "El 19 de noviembre, instrucciones de una sola línea generaron dos productos nuevos con el sistema. Las reglas de componentes y de texto se cumplieron. El tema no cargó, porque el README no mencionaba su carpeta.",
        },
        {
          en: "A second run laid out the supplier questionnaire three ways, as an experiment. There was no user test before the handoff. Next is the README, so the next product loads the theme without me.",
          es: "Una segunda prueba distribuyó el cuestionario del proveedor de tres formas, como experimento. No hubo prueba con usuarios antes de la entrega. Lo siguiente es el README, para que el próximo producto cargue el tema sin mí.",
        },
      ],
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
