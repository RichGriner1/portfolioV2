# Discovery: framework, token source, component library

Detect these **three things independently** before reviewing. Never infer one from another (an Angular app may or may not use PrimeNG; a React app may use Tailwind, CSS Modules, or styled-components).

## (a) Framework
- **React / Next** — `package.json` has `react` / `next`. Files: `.tsx` / `.jsx`. → use [react-tailwind.md](react-tailwind.md).
- **Angular** — `package.json` has `@angular/core`; there's an `angular.json`. Files: `.component.html` / `.component.scss` / `.component.ts`. → use [angular.md](angular.md).
- **Neither / other** — apply the universal rule by hand; note the framework in the report so a tell-sheet can be added later.

## (b) Token source (the legal vocabulary)
Look for, in rough priority order:
- **Tailwind v4 `@theme`** block (e.g. `src/app/globals.css`) — semantic utilities (`bg-background`, `text-foreground`, `rounded-md`, `shadow-md`, `duration-base`) are the vocabulary. (This repo — see [example-portfoliov2.md](example-portfoliov2.md).)
- **W3C `tokens.json`** (+ a build script emitting CSS vars) — the JSON is the source; the emitted `--vars` are the vocabulary.
- **PrimeNG preset / theme** (`@primeng/themes`, a preset object, or `:root` design-token CSS vars) — the preset's design tokens are the vocabulary.
- **Angular SCSS maps / theme file** — a `_tokens.scss` / `_theme.scss` with `$maps` or CSS custom properties.
- **CSS custom properties** (`:root { --… }`) anywhere — the declared vars are the vocabulary.

Record: *where* the tokens are defined, and *what utility/variable form* a component is expected to use. Everything else that sets a color/spacing/radius/shadow/motion value is a candidate violation.

## (c) Component library
- **shadcn** — `components.json` present; `src/components/ui/*`.
- **PrimeNG** — `primeng` in `package.json`; `p-*` selectors in templates.
- **Project-custom DS** — a local components dir with no third-party lib.
- **None** — bespoke components are expected; the `components` skill relaxes accordingly.

Hand (c) to the `components` skill. Note all three findings at the top of any review so the reader knows which lens was applied.

## If nothing is found
If there's no discernible token source, say so plainly — the finding is "this project has no token system" (a bigger problem than any single hard-code). Don't invent one; flag it and ask.
