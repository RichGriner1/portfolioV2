import type { Bilingual } from "@/lib/i18n";

/**
 * The "Things to try" checklist shown over a case study's demo.
 *
 * A visitor opens the demo with nobody beside them, so each list walks through the
 * product's core actions on its own sample data (see the Demo section of
 * content/references/case-studies/standard.md). The products are Spanish, so a step
 * quotes the control exactly as it reads on screen, in «», and glosses it in English.
 *
 * Every step was clicked through on the demo before it was written here. When a
 * demo's export changes, click them through again.
 *
 * `desktopOnly`: the product has no phone layout, so a phone gets a sheet saying so
 * before the demo, with the choice to look anyway.
 */
export type DemoGuide = { steps: Bilingual<string>[]; desktopOnly?: boolean };

export const DEMO_GUIDES: Record<string, DemoGuide> = {
  "third-party-compliance": {
    desktopOnly: true,
    steps: [
      {
        en: "Open «Revisión» (the review queue) and review DataCorp Iberia. Decide each answer, then approve it or send it back.",
        es: "Abre «Revisión» y revisa DataCorp Iberia. Decide cada respuesta y apruébala o devuélvela al proveedor.",
      },
      {
        en: "In «Proveedores», open Nube Segura S. L. and resend or revoke one of its questionnaires.",
        es: "En «Proveedores», abre Nube Segura S. L. y reenvía o revoca uno de sus cuestionarios.",
      },
      {
        en: "Add a provider with «Nuevo» → «Proveedor».",
        es: "Añade un proveedor con «Nuevo» → «Proveedor».",
      },
      {
        en: "In «Plantillas» (templates), open Seguridad TIC, add a question to its draft and publish it.",
        es: "En «Plantillas», abre Seguridad TIC, añade una pregunta al borrador y publícalo.",
      },
      {
        en: "Open «Auditoría». Everything you just did is in the log.",
        es: "Abre «Auditoría». Todo lo que acabas de hacer está en el registro.",
      },
    ],
  },
  "wealth-planner": {
    desktopOnly: true,
    steps: [
      {
        en: "Open Andrés Molina Vega's plan from the list.",
        es: "Abre el plan de Andrés Molina Vega desde el listado.",
      },
      {
        en: "Ask the plan a question. Try «¿Qué pasa si vendo la casa de Sotogrande en 2030?» (what if I sell the house in 2030?), then apply or discard the simulation.",
        es: "Pregúntale algo al plan. Prueba «¿Qué pasa si vendo la casa de Sotogrande en 2030?» y aplica o descarta la simulación.",
      },
      {
        en: "Change an amount in «Patrimonio» (assets) and watch the plan on the right recalculate.",
        es: "Cambia un importe en «Patrimonio» y mira cómo se recalcula el plan de la derecha.",
      },
      {
        en: "Switch the plan between «Amplio», «Mitad» and «Plegado» (wide, half, folded).",
        es: "Cambia el plan entre «Amplio», «Mitad» y «Plegado».",
      },
      {
        en: "Add an asset with «Nuevo activo».",
        es: "Añade un activo con «Nuevo activo».",
      },
    ],
  },
  sarevi: {
    steps: [
      {
        en: "Pick «Vivienda» (a single home) on the cover.",
        es: "Elige «Vivienda» en la portada.",
      },
      {
        en: "Choose the municipality, the type of home and the year, then press «Siguiente» (next).",
        es: "Elige el municipio, el tipo de vivienda y el año, y pulsa «Siguiente».",
      },
      {
        en: "In «Medidas» (the measures), tick SATE, exterior insulation, and watch the bill, consumption and emissions move.",
        es: "En «Medidas», marca SATE y mira cómo se mueven la factura, el consumo y las emisiones.",
      },
      {
        en: "Turn off «Cálculo automático» (automatic estimate) on a measure and type your own cost.",
        es: "Desactiva «Cálculo automático» en una medida y escribe tu propio coste.",
      },
      {
        en: "Copy your code. «Recupérala aquí» on the cover brings the estimate back later.",
        es: "Copia tu código. «Recupérala aquí», en la portada, recupera la estimación más tarde.",
      },
    ],
  },
};
