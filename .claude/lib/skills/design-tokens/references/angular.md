# Tell-sheet: Angular

Framework lens for Angular codebases. Components are three files — scan all three: `*.component.html`, `*.component.scss`, `*.component.ts`. The token source may be a PrimeNG preset, an Angular theme/SCSS map, or `:root` CSS custom properties (see discovery). For each hit, report `<file:line> — <hard-coded value> → <token/var it should use>`.

## `.scss` (the biggest offender)
- **Raw hex / rgb / hsl**: `color: #1a1a1a;`, `background: rgb(10,10,10);` → the theme's semantic CSS var / SCSS token (`color: var(--text-color);` or `$color-text`).
- **Non-token SCSS literals**: `$my-blue: #0057ff;` declared ad-hoc in a component instead of pulling from the theme map → reference the central token map.
- **Raw spacing / radius / shadow**: `padding: 13px;`, `border-radius: 7px;`, `box-shadow: 0 2px 8px rgba(0,0,0,.2);` → spacing/radius/shadow tokens. Over-heavy shadows also trip the Material-bloat anti-pattern (principle 04).
- **`::ng-deep` overrides**: `::ng-deep .p-button { background: #... }` — double violation: it both hard-codes a value **and** reaches into a component's internals to override the DS. Flag as a blocker; the fix is a token/preset change, not a deep override.
- **Raw transitions**: `transition: all .24s ease;` → motion tokens (duration/easing vars).

## `.html`
- **Inline styles**: `<div style="color:#111; padding:12px">` → move to class + tokened SCSS.
- **Hard-coded utility/color classes** not backed by the token system (if a utility layer exists, that's fine; ad-hoc color classes are not).

## `.ts`
- **Style/color bindings with literals**: `[style.background]="'#fff'"`, `[ngStyle]="{ color: '#111' }"` → bind to a token-derived value. (Data-driven values — a color coming from API/config — are allowed; flag only if undocumented.)
- **Hard-coded design values in component constants** used for styling.

## PrimeNG note
If the project uses PrimeNG, the design tokens live in the **preset** (`@primeng/themes` design tokens). Customization belongs in the preset, not in `::ng-deep` overrides or per-component hex. If the project does **not** use PrimeNG (most Afi teams don't), fall back to its own theme/SCSS token map — the `components` skill's discovery determines which.

## Not violations
- Values pulled from the theme map / CSS vars (`var(--…)`, `$token`).
- The token/theme definition files themselves (that's where raw values legitimately live).
