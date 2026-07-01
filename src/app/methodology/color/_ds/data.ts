// Shared data + helpers for the ported Color methodology page. Plain TS (no
// JSX) so it can be imported by the client page. Ported from the Design System
// Template showcase — SCAFFOLD, not part of the kit.
//
// Descriptive copy (overview + use cases) is bilingual. Token names, display
// labels, family headings, subtitles and color-family names stay English on
// purpose — they mirror code.

import primitivesJson from "./tokens/primitives.json";
import semanticLightJson from "./tokens/semantic-light.json";
import semanticDarkJson from "./tokens/semantic-dark.json";

export type Lang = "en" | "es";
export type Bi<T = string> = { en: T; es: T };

export const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
export const RAMPS = ["primary", "neutral", "control", "red", "green", "amber", "blue"] as const;

export type TokenNode = { $type: string; $value: string };
export type Resolved = { primitive: string; hex: string };

export function resolveSemantic(name: string, theme: "light" | "dark"): Resolved | null {
  const json = theme === "light" ? semanticLightJson : semanticDarkJson;
  const tokenObj = (json.semantic.color as Record<string, TokenNode>)[name];
  if (!tokenObj) return null;
  const match = tokenObj.$value.match(/^\{color\.([^.]+)\.([^}]+)\}$/);
  if (!match) {
    return { primitive: "(literal)", hex: tokenObj.$value };
  }
  const [, ramp, step] = match;
  const colorRoot = primitivesJson.color as unknown as Record<string, Record<string, TokenNode>>;
  const hex = colorRoot[ramp]?.[step]?.$value ?? "";
  return { primitive: `${ramp}-${step}`, hex };
}

export function primitiveHex(ramp: string, step: string): string {
  const colorRoot = primitivesJson.color as unknown as Record<string, Record<string, TokenNode>>;
  return colorRoot[ramp]?.[step]?.$value ?? "";
}

export function durationMs(d: "fast" | "base" | "slow" | "slower"): number {
  return { fast: 120, base: 200, slow: 320, slower: 500 }[d];
}

// WCAG relative luminance for a #rrggbb hex. null if unparseable.
function relLuminance(hex: string): number | null {
  const h = hex.replace("#", "");
  if (h.length < 6) return null;
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLin(parseInt(h.slice(0, 2), 16));
  const g = toLin(parseInt(h.slice(2, 4), 16));
  const b = toLin(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Pick a readable text token (light vs dark) for a given hex background.
// Returns a CSS var so it still tracks the theme.
export function readableOn(hex: string): string {
  const L = relLuminance(hex);
  if (L === null) return "var(--neutral-950)";
  return L > 0.45 ? "var(--neutral-950)" : "var(--neutral-50)";
}

// WCAG contrast ratio between two hex colors (1–21). null if unparseable.
export function contrastRatio(a: string, b: string): number | null {
  const La = relLuminance(a);
  const Lb = relLuminance(b);
  if (La === null || Lb === null) return null;
  return (Math.max(La, Lb) + 0.05) / (Math.min(La, Lb) + 0.05);
}

// Map a ratio to its WCAG level for normal text.
export function wcagLevel(ratio: number): { label: string; pass: boolean } {
  if (ratio >= 7) return { label: "AAA", pass: true };
  if (ratio >= 4.5) return { label: "AA", pass: true };
  if (ratio >= 3) return { label: "AA Large", pass: true };
  return { label: "Fail", pass: false };
}

// Split a usage string ("overview\nExamples:\n• a\n• b") into parts. The
// "Examples:" marker is a parse delimiter, not shown, so it stays literal in
// both languages.
export function parseUsage(usage: string): { overview: string; examples: string[] } {
  const [overview, rest] = usage.split(/\nExamples:\n/);
  const examples = rest
    ? rest.split("\n").map((l) => l.replace(/^•\s*/, "").trim()).filter(Boolean)
    : [];
  return { overview: overview.trim(), examples };
}

// Subtitle + overview + which step represents the ramp in the bento card.
export const PRIMITIVE_RAMP_INFO: Record<
  string,
  { subtitle: string; overview: Bi; base: string; uses: Bi<string[]> }
> = {
  primary: {
    subtitle: "Brand · actions",
    base: "800",
    overview: {
      en: "The white-label hook. Every primary action derives from this scale — swap it to rebrand the whole system.",
      es: "El punto de enganche de la marca blanca. Toda acción primary parte de esta escala; cámbiala para rehacer la marca de todo el sistema.",
    },
    uses: {
      en: ["Primary buttons & key CTAs (800)", "Links and active states (600)", "Hover / active steps (900 / 950)"],
      es: ["Botones primary y CTAs clave (800)", "Enlaces y estados activos (600)", "Pasos de hover / active (900 / 950)"],
    },
  },
  neutral: {
    subtitle: "Slate · text + surfaces",
    base: "50",
    overview: {
      en: "A cool blue-gray (slate) that does double duty — the surfaces you read on (page, cards, popovers) and the text on them (foreground, muted). Named neutral, not surface, because it's both.",
      es: "Un gris azulado frío (slate) que hace doble función: las superficies sobre las que lees (page, cards, popovers) y el texto que va encima (foreground, muted). Se llama neutral, no surface, porque es las dos cosas.",
    },
    uses: {
      en: ["Page, card & popover backgrounds (50)", "Foreground & muted text (600+ / 950)", "Muted / secondary surfaces (100)"],
      es: ["Fondos de page, card y popover (50)", "Texto foreground y muted (600+ / 950)", "Superficies muted / secundarias (100)"],
    },
  },
  control: {
    subtitle: "Zinc · inputs & controls",
    base: "100",
    overview: {
      en: "The grays for the lines and states around controls — input borders, dividers, the focus ring, disabled. Kept separate from the neutral ramp so a border never blends into the surface it sits on.",
      es: "Los grises de las líneas y los estados alrededor de los controles: bordes de campo, separadores, el anillo de foco y deshabilitado. Se mantiene aparte de la escala neutral para que un borde nunca se confunda con la superficie sobre la que se apoya.",
    },
    uses: {
      en: ["Input borders & dividers (200)", "Focus ring (400)", "Disabled surface & text (100 / 500)"],
      es: ["Bordes de campo y separadores (200)", "Anillo de foco (400)", "Superficie y texto deshabilitados (100 / 500)"],
    },
  },
  red: {
    subtitle: "Status · danger",
    base: "50",
    overview: {
      en: "Drives both error (a state) and destructive (an action).",
      es: "Alimenta tanto error (un estado) como destructive (una acción).",
    },
    uses: {
      en: ["Error & destructive surfaces (600)", "Subtle error tints (50)", "Destructive hover / active (700 / 800)"],
      es: ["Superficies de error y destructive (600)", "Tintes suaves de error (50)", "Hover / active de destructive (700 / 800)"],
    },
  },
  green: {
    subtitle: "Status · success",
    base: "50",
    overview: {
      en: "Positive outcomes — success states and confirmations.",
      es: "Resultados positivos: estados de éxito y confirmaciones.",
    },
    uses: {
      en: ["Success surfaces (700, AA on white)", "Subtle success tints (50)", "Success text on a tint (700)"],
      es: ["Superficies de success (700, AA sobre blanco)", "Tintes suaves de success (50)", "Texto de success sobre un tinte (700)"],
    },
  },
  amber: {
    subtitle: "Status · warning",
    base: "50",
    overview: {
      en: "Caution without alarm. Needs a dark foreground — amber can't carry white text.",
      es: "Precaución sin alarma. Necesita un texto oscuro: amber no puede llevar texto blanco.",
    },
    uses: {
      en: ["Warning surfaces (500, dark text)", "Subtle warning tints (50)", "Warning text on a tint (700)"],
      es: ["Superficies de warning (500, texto oscuro)", "Tintes suaves de warning (50)", "Texto de warning sobre un tinte (700)"],
    },
  },
  blue: {
    subtitle: "Status · info",
    base: "50",
    overview: {
      en: "Informational accents — tips, 'new' markers, info states.",
      es: "Acentos informativos: consejos, marcas de «nuevo», estados de info.",
    },
    uses: {
      en: ["Info surfaces (600)", "Subtle info tints (50)", "Info hover (700)"],
      es: ["Superficies de info (600)", "Tintes suaves de info (50)", "Hover de info (700)"],
    },
  },
};

export type SemanticPair = { bg: string; fg: string; label: string; usage: Bi; ghost?: boolean };

// Semantic tokens grouped by family — each group renders as its own row.
// Each group is a set of rows. A "variant" (filled / subtle / ghost) is one row
// of default · hover · active. Surfaces + status groups use a single row.
// `flat` groups (actions) render non-ghost cards with no border — a filled
// button is a solid surface, not an outlined one. Ghost keeps its border.
export const SEMANTIC_GROUPS: Array<{ label: string; flat?: boolean; rows: SemanticPair[][] }> = [
  {
    label: "Surfaces",
    rows: [
      [
        { bg: "canvas", fg: "foreground", label: "Canvas", usage: {
          en: "The outermost base layer the whole app sits on. Pure white in light, near-black slate in dark.\nExamples:\n• App shell / body background\n• The backdrop pages float on\n• Behind every surface",
          es: "La capa base más externa sobre la que se apoya toda la app. Blanco puro en claro, slate casi negro en oscuro.\nExamples:\n• Marco de la app / fondo del body\n• El telón sobre el que flotan las páginas\n• Detrás de cada superficie",
        } },
        { bg: "background", fg: "foreground", label: "Page", usage: {
          en: "The page surface that sits on the canvas.\nExamples:\n• Body background\n• Hero section background\n• Default layout color",
          es: "La superficie de página que se apoya sobre el canvas.\nExamples:\n• Fondo del body\n• Fondo de la sección hero\n• Color de layout por defecto",
        } },
        { bg: "card", fg: "card-foreground", label: "Card", usage: {
          en: "Surface color for cards sitting on the page background.\nExamples:\n• Article cards in a feed\n• Stat tiles\n• Profile boxes",
          es: "Color de superficie para las tarjetas que se apoyan sobre el fondo de página.\nExamples:\n• Tarjetas de artículo en un feed\n• Tarjetas de métricas\n• Cajas de perfil",
        } },
        { bg: "popover", fg: "popover-foreground", label: "Popover", usage: {
          en: "Surface for anything that floats above the page — small or large.\nExamples:\n• Dialogs & drawers / sheets\n• Dropdown menus & command palette\n• Tooltips & date pickers",
          es: "Superficie para cualquier cosa que flote sobre la página, grande o pequeña.\nExamples:\n• Diálogos y paneles / hojas\n• Menús desplegables y paleta de comandos\n• Tooltips y selectores de fecha",
        } },
        { bg: "muted", fg: "muted-foreground", label: "Muted", usage: {
          en: "Quieter surface for non-active areas.\nExamples:\n• Sidebar background\n• Table row hover\n• Code block background",
          es: "Superficie más discreta para zonas no activas.\nExamples:\n• Fondo de la barra lateral\n• Hover de fila de tabla\n• Fondo de bloque de código",
        } },
        { bg: "disabled", fg: "disabled-foreground", label: "Disabled", usage: {
          en: "The one surface + text combo used for anything non-interactive. Reach for it on any disabled control.\nExamples:\n• Greyed-out 'Submit' button\n• Disabled menu item\n• Read-only input field",
          es: "El único combo de superficie + texto para cualquier elemento no interactivo. Úsalo en cualquier control deshabilitado.\nExamples:\n• Botón «Enviar» en gris\n• Elemento de menú deshabilitado\n• Campo de solo lectura",
        } },
      ],
    ],
  },
  {
    label: "Primary action",
    flat: true,
    rows: [
      [
        { bg: "primary", fg: "primary-foreground", label: "Default", usage: {
          en: "Filled — the main affirmative action.\nExamples:\n• 'Save' / 'Continue' button\n• Primary CTA\n• Active tab indicator",
          es: "Relleno: la acción afirmativa principal.\nExamples:\n• Botón «Guardar» / «Continuar»\n• CTA principal\n• Indicador de pestaña activa",
        } },
        { bg: "primary-hover", fg: "primary-foreground", label: "Hover", usage: {
          en: "Filled primary under the cursor.\nExamples:\n• Button on hover",
          es: "Primary de relleno bajo el cursor.\nExamples:\n• Botón en hover",
        } },
        { bg: "primary-active", fg: "primary-foreground", label: "Active", usage: {
          en: "Filled primary while pressed.\nExamples:\n• Button mid-click",
          es: "Primary de relleno mientras se pulsa.\nExamples:\n• Botón a medio clic",
        } },
      ],
      [
        { bg: "primary-subtle", fg: "primary-subtle-foreground", label: "Subtle", usage: {
          en: "Low-emphasis filled — a light brand tint + brand text. (Looks grey until you rebrand primary.)\nExamples:\n• Low-emphasis primary action\n• Selected filter chip\n• Active nav item background",
          es: "Relleno de bajo énfasis: un tinte claro de marca + texto de marca. (Parece gris hasta que rehaces la marca de primary.)\nExamples:\n• Acción primary de bajo énfasis\n• Chip de filtro seleccionado\n• Fondo de ítem de navegación activo",
        } },
        { bg: "primary-subtle-hover", fg: "primary-subtle-foreground", label: "Hover", usage: {
          en: "Subtle primary under the cursor.\nExamples:\n• Subtle button on hover",
          es: "Primary subtle bajo el cursor.\nExamples:\n• Botón subtle en hover",
        } },
        { bg: "primary-subtle-active", fg: "primary-subtle-foreground", label: "Active", usage: {
          en: "Subtle primary while pressed.\nExamples:\n• Subtle button mid-click",
          es: "Primary subtle mientras se pulsa.\nExamples:\n• Botón subtle a medio clic",
        } },
      ],
      [
        { bg: "primary", fg: "primary", label: "Ghost", ghost: true, usage: {
          en: "No fill — primary text on the surface; faint tint on hover. Lowest-emphasis primary.\nExamples:\n• Tertiary toolbar action\n• 'Learn more' link-button",
          es: "Sin relleno: texto primary sobre la superficie; tinte tenue en hover. El primary de menor énfasis.\nExamples:\n• Acción terciaria de barra de herramientas\n• Botón-enlace «Saber más»",
        } },
        { bg: "primary-ghost-hover", fg: "primary", label: "Hover", usage: {
          en: "Ghost primary under the cursor — a faint brand tint appears.\nExamples:\n• Ghost button on hover",
          es: "Primary ghost bajo el cursor: aparece un tinte tenue de marca.\nExamples:\n• Botón ghost en hover",
        } },
        { bg: "primary-ghost-active", fg: "primary", label: "Active", usage: {
          en: "Ghost primary while pressed — a slightly stronger tint.\nExamples:\n• Ghost button mid-click",
          es: "Primary ghost mientras se pulsa: un tinte algo más fuerte.\nExamples:\n• Botón ghost a medio clic",
        } },
      ],
    ],
  },
  {
    label: "Neutral action · secondary",
    flat: true,
    rows: [
      [
        { bg: "secondary", fg: "secondary-foreground", label: "Default", usage: {
          en: "The neutral secondary action — quiet, color-free.\nExamples:\n• 'Cancel' button\n• Secondary toolbar action\n• Filter chips",
          es: "La acción secundaria neutra: discreta, sin color.\nExamples:\n• Botón «Cancelar»\n• Acción secundaria de barra de herramientas\n• Chips de filtro",
        } },
        { bg: "secondary-hover", fg: "secondary-foreground", label: "Hover", usage: {
          en: "Secondary under the cursor.\nExamples:\n• Cancel on hover",
          es: "Secondary bajo el cursor.\nExamples:\n• «Cancelar» en hover",
        } },
        { bg: "secondary-active", fg: "secondary-foreground", label: "Active", usage: {
          en: "Secondary while pressed.\nExamples:\n• Cancel mid-click",
          es: "Secondary mientras se pulsa.\nExamples:\n• «Cancelar» a medio clic",
        } },
      ],
      [
        { bg: "secondary", fg: "foreground", label: "Ghost", ghost: true, usage: {
          en: "No fill — plain text on the surface; neutral tint on hover. The tertiary text button.\nExamples:\n• 'Skip' / 'Maybe later'\n• Overflow-menu items\n• Icon-only toolbar buttons",
          es: "Sin relleno: texto plano sobre la superficie; tinte neutro en hover. El botón de texto terciario.\nExamples:\n• «Saltar» / «Quizá más tarde»\n• Elementos de menú de desbordamiento\n• Botones de barra solo con icono",
        } },
        { bg: "secondary", fg: "foreground", label: "Hover", usage: {
          en: "Ghost neutral under the cursor — a faint neutral tint.\nExamples:\n• Text button on hover",
          es: "Neutro ghost bajo el cursor: un tinte neutro tenue.\nExamples:\n• Botón de texto en hover",
        } },
        { bg: "secondary-hover", fg: "foreground", label: "Active", usage: {
          en: "Ghost neutral while pressed.\nExamples:\n• Text button mid-click",
          es: "Neutro ghost mientras se pulsa.\nExamples:\n• Botón de texto a medio clic",
        } },
      ],
    ],
  },
  {
    label: "Destructive action",
    flat: true,
    rows: [
      [
        { bg: "destructive", fg: "destructive-foreground", label: "Default", usage: {
          en: "Filled — highest-emphasis danger action.\nExamples:\n• 'Delete account' confirm\n• Primary danger CTA in a dialog",
          es: "Relleno: la acción de peligro de mayor énfasis.\nExamples:\n• Confirmar «Eliminar cuenta»\n• CTA de peligro principal en un diálogo",
        } },
        { bg: "destructive-hover", fg: "destructive-foreground", label: "Hover", usage: {
          en: "Filled destructive under the cursor.\nExamples:\n• Delete button on hover",
          es: "Destructive de relleno bajo el cursor.\nExamples:\n• Botón de eliminar en hover",
        } },
        { bg: "destructive-active", fg: "destructive-foreground", label: "Active", usage: {
          en: "Filled destructive while pressed.\nExamples:\n• Delete mid-click",
          es: "Destructive de relleno mientras se pulsa.\nExamples:\n• Eliminar a medio clic",
        } },
      ],
      [
        { bg: "destructive-subtle", fg: "destructive-subtle-foreground", label: "Subtle", usage: {
          en: "Low-emphasis filled — a quiet delete/remove.\nExamples:\n• 'Remove' in a list row\n• Secondary danger action",
          es: "Relleno de bajo énfasis: un eliminar/quitar discreto.\nExamples:\n• «Quitar» en una fila de lista\n• Acción de peligro secundaria",
        } },
        { bg: "destructive-subtle-hover", fg: "destructive-subtle-foreground", label: "Hover", usage: {
          en: "Subtle destructive under the cursor.\nExamples:\n• 'Remove' on hover",
          es: "Destructive subtle bajo el cursor.\nExamples:\n• «Quitar» en hover",
        } },
        { bg: "destructive-subtle-active", fg: "destructive-subtle-foreground", label: "Active", usage: {
          en: "Subtle destructive while pressed.\nExamples:\n• 'Remove' mid-click",
          es: "Destructive subtle mientras se pulsa.\nExamples:\n• «Quitar» a medio clic",
        } },
      ],
      [
        { bg: "destructive", fg: "destructive-subtle-foreground", label: "Ghost", ghost: true, usage: {
          en: "No fill — destructive text on the surface; tint on hover. Lowest-emphasis danger.\nExamples:\n• Tertiary 'Delete' in a menu\n• Icon-only remove",
          es: "Sin relleno: texto destructive sobre la superficie; tinte en hover. El peligro de menor énfasis.\nExamples:\n• «Eliminar» terciario en un menú\n• Quitar solo con icono",
        } },
        { bg: "destructive-ghost-hover", fg: "destructive-subtle-foreground", label: "Hover", usage: {
          en: "Ghost destructive under the cursor — a faint red tint.\nExamples:\n• Ghost delete on hover",
          es: "Destructive ghost bajo el cursor: un tinte rojo tenue.\nExamples:\n• Eliminar ghost en hover",
        } },
        { bg: "destructive-ghost-active", fg: "destructive-subtle-foreground", label: "Active", usage: {
          en: "Ghost destructive while pressed.\nExamples:\n• Ghost delete mid-click",
          es: "Destructive ghost mientras se pulsa.\nExamples:\n• Eliminar ghost a medio clic",
        } },
      ],
    ],
  },
  {
    label: "Control · form fields",
    rows: [
      [
        { bg: "control", fg: "control-foreground", label: "Default", usage: {
          en: "A form control at rest — the fill used for any input, select, checkbox or toggle.\nExamples:\n• Text field background\n• Checkbox / toggle track\n• Segmented control",
          es: "Un control de formulario en reposo: el relleno de cualquier campo, select, checkbox o toggle.\nExamples:\n• Fondo de campo de texto\n• Carril de checkbox / toggle\n• Control segmentado",
        } },
        { bg: "control-hover", fg: "control-foreground", label: "Hover", usage: {
          en: "A control under the cursor.\nExamples:\n• Field on hover\n• Hovered toggle\n• Hovered segment",
          es: "Un control bajo el cursor.\nExamples:\n• Campo en hover\n• Toggle en hover\n• Segmento en hover",
        } },
        { bg: "control-active", fg: "control-foreground", label: "Active", usage: {
          en: "A control while pressed or switched on.\nExamples:\n• Pressed segment\n• Checked toggle track\n• Active field",
          es: "Un control mientras se pulsa o se activa.\nExamples:\n• Segmento pulsado\n• Carril de toggle marcado\n• Campo activo",
        } },
      ],
    ],
  },
  {
    label: "Error",
    rows: [
      [
        { bg: "error", fg: "error-foreground", label: "Default", usage: {
          en: "State color signalling something went wrong.\nExamples:\n• Invalid form field border\n• System-error toast\n• Failed-validation icon",
          es: "Color de estado que indica que algo ha ido mal.\nExamples:\n• Borde de campo no válido\n• Notificación de error del sistema\n• Icono de validación fallida",
        } },
        { bg: "error-subtle", fg: "error-subtle-foreground", label: "Subtle", usage: {
          en: "Soft tint for inline error messages.\nExamples:\n• Inline alert banner\n• Validation hint background\n• Error callout bg",
          es: "Tinte suave para mensajes de error en línea.\nExamples:\n• Aviso de alerta en línea\n• Fondo de pista de validación\n• Fondo de destacado de error",
        } },
      ],
    ],
  },
  {
    label: "Success",
    rows: [
      [
        { bg: "success", fg: "success-foreground", label: "Default", usage: {
          en: "Affirmative color signaling a positive outcome.\nExamples:\n• 'Saved' toast\n• Success badge\n• Completed checkmark",
          es: "Color afirmativo que indica un resultado positivo.\nExamples:\n• Notificación de «Guardado»\n• Etiqueta de éxito\n• Marca de verificación completada",
        } },
        { bg: "success-subtle", fg: "success-subtle-foreground", label: "Subtle", usage: {
          en: "Soft tint for inline success messages.\nExamples:\n• 'Profile updated' banner\n• Confirmation note background",
          es: "Tinte suave para mensajes de éxito en línea.\nExamples:\n• Aviso de «Perfil actualizado»\n• Fondo de nota de confirmación",
        } },
      ],
    ],
  },
  {
    label: "Warning",
    rows: [
      [
        { bg: "warning", fg: "warning-foreground", label: "Default", usage: {
          en: "Cautionary color — 'pay attention but don't panic'.\nExamples:\n• Unsaved changes bar\n• Expiring-soon badge\n• Warning toast",
          es: "Color de precaución: «presta atención, pero sin alarmarte».\nExamples:\n• Barra de cambios sin guardar\n• Etiqueta de caducidad próxima\n• Notificación de aviso",
        } },
        { bg: "warning-subtle", fg: "warning-subtle-foreground", label: "Subtle", usage: {
          en: "Soft tint for inline warnings.\nExamples:\n• Caution callout background\n• Soft warning banner",
          es: "Tinte suave para avisos en línea.\nExamples:\n• Fondo de destacado de precaución\n• Aviso suave",
        } },
      ],
    ],
  },
  {
    label: "Info",
    rows: [
      [
        { bg: "info", fg: "info-foreground", label: "Default", usage: {
          en: "Neutral informational color.\nExamples:\n• 'New' badge\n• Info toast\n• Tip callout accent",
          es: "Color informativo neutro.\nExamples:\n• Etiqueta de «Nuevo»\n• Notificación de info\n• Acento de destacado de consejo",
        } },
        { bg: "info-subtle", fg: "info-subtle-foreground", label: "Subtle", usage: {
          en: "Soft tint for inline informational notes.\nExamples:\n• Tip callout background\n• 'Did you know' panel",
          es: "Tinte suave para notas informativas en línea.\nExamples:\n• Fondo de destacado de consejo\n• Panel de «¿Sabías que...?»",
        } },
      ],
    ],
  },
];

export const BORDERS: Array<{ name: string; usage: Bi }> = [
  { name: "border", usage: {
    en: "Default border for surfaces and dividers.\nExamples:\n• Card outline\n• Section divider line\n• Default input border",
    es: "Borde por defecto para superficies y separadores.\nExamples:\n• Contorno de tarjeta\n• Línea separadora de sección\n• Borde de campo por defecto",
  } },
  { name: "border-strong", usage: {
    en: "Emphasized border for higher-contrast outlines.\nExamples:\n• Selected card outline\n• Hovered card border\n• Important separator",
    es: "Borde enfatizado para contornos de mayor contraste.\nExamples:\n• Contorno de tarjeta seleccionada\n• Borde de tarjeta en hover\n• Separador importante",
  } },
  { name: "input-border", usage: {
    en: "Border color specifically for input fields.\nExamples:\n• Text field at rest\n• Select dropdown border\n• Textarea outline",
    es: "Color de borde específico para campos de formulario.\nExamples:\n• Campo de texto en reposo\n• Borde de select desplegable\n• Contorno de textarea",
  } },
  { name: "input-border-hover", usage: {
    en: "Input border on hover, signaling interactivity.\nExamples:\n• Text field under the mouse\n• Hovered combobox\n• Hovered date input",
    es: "Borde de campo en hover, que señala interactividad.\nExamples:\n• Campo de texto bajo el ratón\n• Combobox en hover\n• Campo de fecha en hover",
  } },
  { name: "ring", usage: {
    en: "Focus ring for keyboard navigation.\nExamples:\n• Focused button outline\n• Focused input ring\n• Focused link halo",
    es: "Anillo de foco para navegación con teclado.\nExamples:\n• Contorno de botón enfocado\n• Anillo de campo enfocado\n• Halo de enlace enfocado",
  } },
];
