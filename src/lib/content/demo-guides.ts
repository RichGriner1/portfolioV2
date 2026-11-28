import type { Bilingual } from "@/lib/i18n";

/**
 * The task list shown over a case study's demo.
 *
 * A visitor opens the demo with nobody beside them, so each list walks through the
 * product's core actions on its own sample data (see the Demo section of
 * content/references/case-studies/standard.md). The products are Spanish, so a step
 * quotes the control exactly as it reads on screen, in «», and glosses it in English.
 *
 * Every step was clicked through on the demo before it was written here. When a
 * demo's export changes, click them through again.
 *
 * `when`: the events that complete a step. Each demo posts `{ demoEvent }` to this
 * page when the visitor does something (Compliance its audit-log actions and page
 * changes, Wealth Planner its toasts and edits, SAREVI its clicks). A step ticks when
 * an event matches one of its strings: from the start, with `*` standing for any
 * text. Search the demo's code for `demoEvent` to see what it sends.
 *
 * `hints`: where to click next, for the pulsing spotlight. Read in order; the first
 * one found on screen wins, so list the deepest control first (the dialog's confirm
 * button) and the way in last (the menu item). `on` limits a hint to a screen whose
 * h1 or h2 starts with that text. `click` finds the control:
 *   "Text"        a button, link, tab or label whose text starts with Text
 *   "=Text"       ... whose text is exactly Text
 *   "row:Text"    a table row or list item containing Text
 *   "row:Text>B"  the control B (text starts with B) inside that row
 *   "tab:Text"    a tab whose text starts with Text
 *   "dialog:Text" a button in the open dialog whose text starts with Text
 *   "css:sel"     the first visible match for a CSS selector
 *
 * `desktopOnly`: the product has no phone layout, so a phone gets a sheet saying so
 * before the demo, with the choice to look anyway.
 */
export type GuideHint = { on?: string; click: string };
export type GuideStep = Bilingual<string> & {
  when: string[];
  hints: GuideHint[];
};
export type DemoGuide = { steps: GuideStep[]; desktopOnly?: boolean };

export const DEMO_GUIDES: Record<string, DemoGuide> = {
  "third-party-compliance": {
    desktopOnly: true,
    steps: [
      {
        en: "Open «Revisión» (the review queue) and review DataCorp Iberia. Decide each answer, then approve it or send it back.",
        es: "Abre «Revisión» y revisa DataCorp Iberia. Decide cada respuesta y apruébala o devuélvela al proveedor.",
        when: ["Revisión aprobada", "Revisión devuelta"],
        hints: [
          { click: "dialog:Devolver" },
          { click: "dialog:Aprobar" },
          { on: "Revisión · ", click: "Devolver al proveedor" },
          { on: "Revisión · ", click: "Aprobar revisión" },
          { on: "Revisión · ", click: "Guardar y siguiente" },
          { on: "Revisión · ", click: "Conforme" },
          { on: "Revisión", click: "row:DataCorp Iberia" },
          { click: "Revisión" },
        ],
      },
      {
        en: "In «Proveedores», open Nube Segura S. L. and resend or revoke one of its questionnaires.",
        es: "En «Proveedores», abre Nube Segura S. L. y reenvía o revoca uno de sus cuestionarios.",
        when: ["Asignación reenviada", "Asignación revocada"],
        hints: [
          { click: "dialog:Revocar" },
          { click: "dialog:Reenviar" },
          { on: "Nube Segura", click: "=Reenviar" },
          { on: "Nube Segura", click: "=Revocar" },
          { on: "Nube Segura", click: "tab:Asignaciones" },
          { on: "Proveedores", click: "row:Nube Segura" },
          { click: "Proveedores" },
        ],
      },
      {
        en: "Still in Nube Segura S. L., open «Contactos» and remove Ana Pérez.",
        es: "En Nube Segura S. L., abre «Contactos» y quita a Ana Pérez.",
        when: ["Contacto quitado", "Contacto retirado"],
        hints: [
          { click: "dialog:Quitar" },
          { on: "Nube Segura", click: "=Quitar" },
          { on: "Nube Segura", click: "tab:Contactos" },
          { on: "Proveedores", click: "row:Nube Segura" },
          { click: "Proveedores" },
        ],
      },
      {
        en: "Add a provider with «Nuevo» → «Proveedor».",
        es: "Añade un proveedor con «Nuevo» → «Proveedor».",
        when: ["Proveedor creado"],
        hints: [
          { click: "dialog:Crear proveedor" },
          { click: "=Proveedor" },
          { click: "=Nuevo" },
          { click: "Panel" },
        ],
      },
      {
        en: "In «Plantillas» (templates), open Seguridad TIC and publish its draft.",
        es: "En «Plantillas», abre Seguridad TIC y publica su borrador.",
        when: ["Plantilla publicada"],
        hints: [
          { click: "dialog:Publicar" },
          { on: "Seguridad TIC", click: "Publicar versión" },
          { on: "Plantillas", click: "row:Seguridad TIC>Abrir" },
          { click: "Plantillas" },
        ],
      },
      {
        en: "Open «Auditoría». Everything you just did is in the log.",
        es: "Abre «Auditoría». Todo lo que acabas de hacer está en el registro.",
        when: ["view:aud"],
        hints: [{ click: "Auditoría" }],
      },
    ],
  },
  "wealth-planner": {
    desktopOnly: true,
    steps: [
      {
        en: "Archive Clara Ruiz Benítez's plan: hover her row and press «Archivar». «Deshacer» (undo) on the notice brings it back.",
        es: "Archiva el plan de Clara Ruiz Benítez: pasa el ratón por su fila y pulsa «Archivar». «Deshacer», en el aviso, lo recupera.",
        when: [
          "toast:Planificación «*» archivada",
          "toast:Planificación «*» eliminada",
        ],
        hints: [
          { on: "Planificaciones", click: "row:Clara Ruiz Benítez>Archivar" },
          { on: "Planificaciones", click: "row:Jubilación 2031>Archivar" },
          { click: "=Planificaciones" },
        ],
      },
      {
        en: "Open Andrés Molina Vega's plan.",
        es: "Abre el plan de Andrés Molina Vega.",
        when: ["open-plan"],
        hints: [
          { on: "Planificaciones", click: "row:Andrés Molina Vega" },
          { click: "=Planificaciones" },
        ],
      },
      {
        en: "Ask the plan a question. Try «¿Qué pasa si vendo la casa de Sotogrande en 2030?» (what if I sell the house in 2030?), then apply or discard the simulation.",
        es: "Pregúntale algo al plan. Prueba «¿Qué pasa si vendo la casa de Sotogrande en 2030?» y aplica o descarta la simulación.",
        when: ["sim:applied", "toast:Simulación descartada"],
        hints: [
          { click: "=Aplicar al plan" },
          { click: "¿Qué pasa si vendo" },
          { click: 'css:input[placeholder^="Pregunte"]' },
          { on: "Planificaciones", click: "row:Andrés Molina Vega" },
        ],
      },
      {
        en: "Open Letras del Tesoro in «Patrimonio» (assets), change its amount and watch the plan on the right recalculate.",
        es: "Abre Letras del Tesoro en «Patrimonio», cambia su importe y mira cómo se recalcula el plan de la derecha.",
        when: ["edit:valor", "edit:importe"],
        hints: [
          { click: "row:Letras del Tesoro" },
          { on: "Planificaciones", click: "row:Andrés Molina Vega" },
        ],
      },
      {
        en: "Fold or widen the plan with the arrows beside «Amplio», «Mitad» and «Plegado».",
        es: "Pliega o amplía el plan con las flechas junto a «Amplio», «Mitad» y «Plegado».",
        when: ["size:"],
        hints: [
          { click: 'css:[aria-label="Reducir el plan"]' },
          { click: 'css:[aria-label="Ampliar el plan"]' },
          { on: "Planificaciones", click: "row:Andrés Molina Vega" },
        ],
      },
      {
        en: "Add an asset with «Nuevo activo».",
        es: "Añade un activo con «Nuevo activo».",
        when: ["toast:Activo «"],
        hints: [
          { click: "=Crear" },
          { click: "Nuevo activo" },
          { on: "Planificaciones", click: "row:Andrés Molina Vega" },
        ],
      },
    ],
  },
  sarevi: {
    steps: [
      {
        en: "Pick «Vivienda» (a single home) on the cover.",
        es: "Elige «Vivienda» en la portada.",
        when: ["start:vivienda"],
        hints: [{ click: 'css:[data-a="start"][data-v="vivienda"]' }],
      },
      {
        en: "Choose the municipality, the type of home and the year, then press «Siguiente» (next).",
        es: "Elige el municipio, el tipo de vivienda y el año, y pulsa «Siguiente».",
        when: ["step:2"],
        hints: [
          { click: 'css:[data-a="go"][data-v="2"]' },
          { click: 'css:[data-a="selpick"]' },
          { click: 'css:[data-a="go"]' },
        ],
      },
      {
        en: "In «Medidas» (the measures), tick SATE, exterior insulation, and watch the bill, consumption and emissions move.",
        es: "En «Medidas», marca SATE y mira cómo se mueven la factura, el consumo y las emisiones.",
        when: ["tog:sate:on"],
        hints: [{ click: 'css:[data-a="tog"][data-id="sate"]' }],
      },
      {
        en: "Turn off «Cálculo automático» (automatic estimate) on a measure and type your own cost.",
        es: "Desactiva «Cálculo automático» en una medida y escribe tu propio coste.",
        when: ["auto:off"],
        hints: [
          { click: 'css:[data-a="auto"]' },
          { click: 'css:[data-a="pers"][data-id="sate"]' },
          { click: 'css:[data-a="pers"]' },
        ],
      },
      {
        en: "Copy your code. «Recupérala aquí» on the cover brings the estimate back later.",
        es: "Copia tu código. «Recupérala aquí», en la portada, recupera la estimación más tarde.",
        when: ["copied"],
        hints: [{ click: 'css:[data-a="copy"]' }],
      },
    ],
  },
};

/** Does a demo event match a `when` string? From the start, `*` standing for any text. */
export function eventMatches(ev: string, pattern: string): boolean {
  const parts = pattern.split("*");
  if (!ev.startsWith(parts[0])) return false;
  let at = parts[0].length;
  for (const p of parts.slice(1)) {
    const i = ev.indexOf(p, at);
    if (i < 0) return false;
    at = i + p.length;
  }
  return true;
}
