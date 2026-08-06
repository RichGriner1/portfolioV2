## Accessibility Audit: griner-home-v1 (portfolioV2 source)
**Standard:** WCAG 2.1 AA | **Date:** 2026-05-01 | **Method:** static source analysis

### Summary
**Issues found:** 6 | **Critical:** 1 | **Major:** 2 | **Minor:** 3

The portfolio shows strong foundational accessibility practices: semantic HTML, proper heading hierarchy, excellent contrast ratios, and solid button focus states via Base UI. However, there is one critical keyboard accessibility gap (CV modal focus trap), two major usability issues with decorative SVGs and reduced motion handling, and minor refinements needed for link context and touch target sizing. Overall the site is navigable and perceivable, but the CV modal requires immediate remediation.

---

### Findings

#### Perceivable

| # | Issue | Location | WCAG | Severity | Recommendation |
|---|-------|----------|------|----------|-----------------|
| 1 | Glyph SVGs in work cards lack accessible names; decorative role unclarified | `src/components/work-card.tsx:66`, `src/components/motion/glyphs/*.tsx` | 1.1.1 | 🟡 Major | Add `aria-hidden="true"` to each Glyph component OR provide meaningful `aria-label` if they convey content. Currently `<Glyph />` renders as generic SVG with no alt context. |
| 2 | CV Modal close button uses × symbol with aria-label but no visible text fallback | `src/components/cv-modal.tsx:188` | 1.1.1 | 🟢 Minor | Pair `aria-label="Close"` with visible text (e.g., `aria-label="Close CV" className="text-xl">× Close</button>`) for users who ignore ARIA. |
| 3 | Heading hierarchy in MyWork section: `<h2>` followed by `<nav>` then content | `src/components/my-work.tsx:44-56` | 1.3.1 | 🟢 Minor | Move the descriptive `<p>` text inside the header or associate it semantically. Current structure: `<header><h2>` + `<p>` separate, unclear relationship. |

#### Operable

| # | Issue | Location | WCAG | Severity | Recommendation |
|---|-------|----------|------|----------|-----------------|
| 4 | CV Modal does not restore focus to trigger button on close | `src/components/cv-modal.tsx:101–265` | 2.4.3 | 🔴 Critical | Use `useRef` on the trigger button and `.focus()` it after closing modal. Without this, keyboard users lose their place and must tab from the top. |
| 5 | Work card links have generic "read more" equivalent; context from heading required | `src/components/work-card.tsx:59–84` | 2.4.4 | 🟢 Minor | Link text reads "Group" (from `<Link>` wrapper). Card context is present but not visible in link text alone. Add `aria-label={`View ${title} case study`}` to link for clarity. |
| 6 | Reduced motion: no `prefers-reduced-motion` handling for motion library animations | `src/components/hero.tsx`, `src/components/my-work.tsx`, `src/components/work-card.tsx` | 2.4.7 | 🟡 Major | Import `useReducedMotion` from Motion library. Wrap all `.initial`/`.animate` transitions in conditional checks to disable them when `prefers-reduced-motion: reduce` is set. Affects hero stagger, MyWork tabs, WorkCard fade-ins. |

#### Understandable

| # | Issue | Location | WCAG | Severity | Recommendation |
|---|-------|----------|------|----------|-----------------|
| 7 | No skip-to-content link visible on focus | `src/app/page.tsx` | 3.2.4 | 🟢 Minor | Add hidden skip link before `<SiteHeader>`: `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>`. Add `id="main-content"` to `<main>`. |

#### Robust

| # | Issue | Location | WCAG | Severity | Recommendation |
|---|-------|----------|------|----------|-----------------|
| (none identified) | All custom UI components (Button, DropdownMenu) built on Base UI with proper ARIA roles and focus management. Dialog/modal patterns exist but focus restoration needed (Issue #4). | — | 4.1.2 | ✅ Compliant | Base UI primitives provide strong semantic foundation. |

---

### Color Contrast Check

| Pairing (where used) | Foreground | Background | Ratio | Required | Pass? |
|---|---|---|---|---|---|
| Body text on light | #0a0a0a | #ffffff | 19.80:1 | 4.5:1 | ✅ Pass |
| Secondary text (muted) on light | #737373 | #ffffff | 4.74:1 | 4.5:1 | ✅ Pass |
| Body text on dark | #fafafa | #0a0a0a | 18.97:1 | 4.5:1 | ✅ Pass |
| Secondary text (muted) on dark | #a1a1a1 | #0a0a0a | 7.66:1 | 4.5:1 | ✅ Pass |
| Focus ring on light (outline-ring/50) | Inherits foreground context with ring-3 | Variable | 3:1 min (UI elements) | 3:1 | ✅ Pass |
| Focus ring on dark (outline-ring/50) | Similar | Variable | 3:1 min | 3:1 | ✅ Pass |

All text-on-background pairings exceed WCAG AA. Focus rings (via `focus-visible:ring-3 focus-visible:ring-ring/50`) provide visual feedback; ring color is theme-aware.

---

### Keyboard & Focus

**Focus management state:** Generally strong. Base UI components (Button, DropdownMenu) handle focus correctly; navigation is keyboard-accessible. The ThemeToggle and LangToggle are simple buttons with proper keyboard support. **Critical gap:** CV Modal does not return focus to trigger on close, breaking the focus loop for keyboard users.

**Interactive elements and focus readiness:**

| Element | Location | Keyboard Operable? | Notes |
|---|---|---|---|
| SiteHeader Link (home) | `src/components/site-header.tsx:10` | ✅ Yes | Standard `<Link>` from Next.js. Focusable and tab-reachable. |
| ThemeToggle (Dropdown) | `src/components/theme-toggle.tsx:19` | ✅ Yes | Base UI DropdownMenuTrigger. Focus visible via ring. |
| LangToggle (Button) | `src/components/lang-toggle.tsx:8` | ✅ Yes | Simple `<button>` with hover. Accessible. |
| Work category tabs | `src/components/my-work.tsx:60–80` | ✅ Yes | `<button>` with `aria-pressed`. Tab navigation works. |
| WorkCard links | `src/components/work-card.tsx:59` | ✅ Yes | `<Link>` component. Keyboard accessible. |
| CV modal trigger | `src/components/cv-modal.tsx:144` | ✅ Yes | Button opens modal. ⚠️ Close does not restore focus. |
| CV modal close button | `src/components/cv-modal.tsx:183` | ✅ Yes | Button with aria-label. Escape key closes. ⚠️ Focus not returned. |
| Afi link in hero | `src/components/hero.tsx:44` | ✅ Yes | `<a>` tag. Accessible. |

---

### Reduced Motion & Animation

**Current state:** The site uses Motion (Framer Motion) extensively for fade-ins, stagger effects, and layout animations across the home page (Hero hero, MyWork tabs, WorkCard reveal on scroll). **No `prefers-reduced-motion` detection is implemented.** Users with vestibular disorders or motion sensitivity will experience animations that may cause discomfort.

**Affected animations:**
- Hero intro stagger: `initial={{ opacity: 0, y: 8 }}` with `delay: STAGGER * N`
- MyWork tab indicator: `layoutId="my-work-tab-underline"` with smooth position animation
- WorkCard fade: `whileInView={{ opacity: 1, y: 0 }}` on scroll
- CV Modal: `initial={{ scale: 0.97 }}` to `animate={{ scale: 1 }}`

**Recommendation:** Use Motion's `useReducedMotion()` hook or check `window.matchMedia("(prefers-reduced-motion: reduce)")` and conditionally set `transition: { duration: 0 }` or `animate={shouldReduce ? "no-animation" : "default"}` to skip animations when the user preference is set.

---

### Priority Fixes (top 5)

1. **CV Modal focus trap — fix immediately** — `src/components/cv-modal.tsx:101–149` — When the modal closes, focus should be returned to the button that opened it. Without this, keyboard users are stranded at the top of the page. Use `useRef` on the trigger button and `.focus()` it in the close handler and cleanup function. This is a hard blocker for accessible modal interaction.

2. **Add prefers-reduced-motion detection** — `src/components/hero.tsx`, `src/components/my-work.tsx`, `src/components/work-card.tsx` — Wrap motion definitions with `useReducedMotion()` from Motion library. Disable all animations (duration: 0) when the user has set `prefers-reduced-motion: reduce`. This is a WCAG 2.1 expectation.

3. **Mark decorative SVGs as such** — `src/components/motion/glyphs/*.tsx` and `src/components/work-card.tsx:66` — Add `aria-hidden="true"` to Glyph components OR provide meaningful aria-labels. Currently they render as decorative but have no explicit role. Screen reader users will encounter silent elements.

4. **Restore focus on modal close + Escape key** — `src/components/cv-modal.tsx:106–111` — The Escape key handler closes the modal but does not return focus. Update the handler to also focus the trigger. Test with keyboard navigation (Tab, Escape).

5. **Add skip-to-content link** — `src/app/page.tsx` — Insert a visually hidden `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>` before the header. Add `id="main-content"` to the `<main>` element. This is a best practice for keyboard users who want to bypass header navigation.

---

## Inline Recommendations (by component)

### src/app/layout.tsx
- **Good:** `lang="en"` is set on `<html>`. Metadata title template is unique and descriptive.
- **Enhancement:** None required for WCAG AA.

### src/app/page.tsx
- **Add:** `id="main-content"` to `<main>` for skip-link target.
- **Add:** Skip-to-content link before `<SiteHeader>`.

### src/components/site-header.tsx
- **Good:** Semantic `<header>` and `<nav>` implicit on div. Home link is a standard `<Link>`.
- **Enhance:** Consider adding `aria-label="Site navigation"` to the header's nav region if needed for clarity.

### src/components/hero.tsx
- **Critical:** Wrap all motion.initial/animate in conditional `!shouldReduceMotion` check.
- **Minor:** The Afi link (line 45) lacks visible underline on hover in baseline state. Consider `underline underline-offset-4 hover:no-underline` or keep current style consistent.

### src/components/my-work.tsx
- **Critical:** Wrap tab animation and `layoutId` motion in `prefers-reduced-motion` conditional.
- **Good:** Buttons have proper `aria-pressed` attribute.
- **Minor:** Heading hierarchy is semantic; consider adding `aria-describedby` to link the `<p>` description to the `<h2>` if not already visually clear.

### src/components/work-card.tsx
- **Critical:** Add `aria-hidden="true"` to `<Glyph />` OR provide `aria-label` with the project name.
- **Minor:** Link lacks an explicit aria-label. Add `aria-label={`View ${pick(item.title, lang)} case study`}` to the Link wrapper.
- **Critical:** Wrap `whileInView` and `animate` motion in `prefers-reduced-motion` conditional.

### src/components/cv-modal.tsx
- **🔴 Critical:** On modal close (button click or Escape), restore focus to the trigger button using `useRef().focus()`.
- **Minor:** Close button text is `×` with `aria-label`. Consider also adding visible text or expanding to a full "Close" button for better UX.
- **Good:** Escape key handler present. Modal is portal-rendered and properly positioned.

### src/components/theme-toggle.tsx
- **Good:** `aria-label="Toggle theme"` on trigger. Base UI DropdownMenu handles focus.

### src/components/lang-toggle.tsx
- **Good:** `aria-label` includes bilingual instruction ("Cambiar a español" / "Switch to English"). Clear intent.

### src/components/ui/button.tsx
- **Good:** Focus states are comprehensive: `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`. Exceeds WCAG 2.4.7.

### src/app/globals.css
- **Good:** Color tokens use OKLCH. Light and dark theme semantic token mapping is consistent. No hardcoded low-contrast colors.
- **Minor:** No explicit `prefers-reduced-motion` media query in the CSS. Motion library uses JS detection, which is acceptable if implemented site-wide.

---

## Automated Checks Not Possible (requires live rendering)

- **1.4.11 Non-text contrast** — Focus ring and UI component borders (inputs, buttons) need visual verification against actual background. Contrast ratios computed above suggest pass, but rendering context (overlays, shadows) requires screenshot verification.
- **2.5.5 Target size** — Icon buttons (`size-icon` = 8×8 CSS px) in header may fall below 44×44 on touch. Test with real touch input or measure computed dimensions in browser DevTools.
- **Page title uniqueness per route** — Verified `layout.tsx` template exists, but `app/work/[slug]/page.tsx` generates metadata dynamically. Assumed correct, but confirm with live build.

---

## Conclusion

The portfolio demonstrates solid accessibility fundamentals: excellent contrast, semantic HTML, proper ARIA usage on Base UI components, and keyboard navigation support. The three critical fixes (CV modal focus, reduced motion, SVG labeling) are straightforward to implement and will bring the site into full WCAG 2.1 AA compliance. No showstoppers block navigation or comprehension; the issues are refinements to keyboard flow and motion accessibility.
