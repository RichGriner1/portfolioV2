"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "es";
export type Bilingual<T = string> = { en: T; es: T };

// `toggle()` came off on 2026-08-06 with the two-state language button — the
// selector is a radio group now and sets a language outright, so nothing flipped
// between them any more. Add it back if a keyboard shortcut ever wants it.
type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  /**
   * English until someone asks for Spanish.
   *
   * This used to fall back to `navigator.language`, so a Spanish browser landed
   * on the Spanish site. That's the wrong default here: the portfolio is written
   * in English first, the Spanish is a translation that trails it, and half the
   * people opening it from Madrid are reading it in English anyway. Only an
   * explicit choice, stored by the toggle, switches it.
   */
  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "en" || stored === "es") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

export function pick<T>(bi: Bilingual<T>, lang: Lang): T {
  return bi[lang];
}

// Centralized UI strings (everything that isn't content-specific)
export const UI = {
  // Index links. They live in the footer rather than the home grid: the home
  // carries the current, highest-value work, and these are how you get to
  // everything else. Plain nouns — footer nav doesn't say "All".
  "nav.projects": { en: "Projects", es: "Proyectos" },
  // "Blog" in both languages. ES was "Textos", which reads wrong to a Peninsular
  // reader — it's the word for written texts, not for a body of posts, and it was
  // flagged on sight in the 2026-08-06 portfolio review. "Blog" is standard loaned
  // usage in Spain. EN moved off "Writing" to match, so the two languages name the
  // same destination the same way. The route stays /writing; this is the label only.
  "nav.writing": { en: "Blog", es: "Blog" },
  // "nav.linkedin" came off on 2026-08-06 with the footer's socials. It was the
  // same string in both languages anyway, which is why the nav panel's own list
  // hard-codes "LinkedIn" and "X" and only translates "Email".
  "nav.email": { en: "Email", es: "Correo" },
  "nav.cv": { en: "CV", es: "CV" },
  "nav.home": { en: "Home", es: "Inicio" },
  // The visible label on the canvas rail. `menu_open`/`menu_close` are the aria
  // labels for the toggle; this is the word a visitor actually reads next to it.
  "nav.menu": { en: "Menu", es: "Menú" },
  "nav.menu_open": { en: "Open menu", es: "Abrir menú" },
  "nav.menu_close": { en: "Close menu", es: "Cerrar menú" },
  // Spanish takes sentence case, not the English title case — only the first word
  // and proper nouns are capitalised. Keeps the loanword "portfolio", which is what
  // Spanish design practice uses; "portafolios" in Spain reads as a briefcase.
  // TODO(afi-redaccion): confirm the ES wording reads as Peninsular, not translated.
  "nav.wordmark": {
    en: "Richard Griner Design Portfolio",
    es: "Portfolio de diseño de Richard Griner",
  },
  "nav.socials": { en: "Socials", es: "Redes sociales" },
  // The canvas board's escape hatch out of a section and into the real index page.
  "nav.see_all": { en: "See all", es: "Ver todo" },
  // The board's zoom menu. `zoom` names the trigger for anyone who can't see it —
  // the visible label is the current percentage, so the aria label can't just repeat
  // it. Same split `LangToggle` makes between its code and "Select language".
  "canvas.zoom": { en: "Zoom", es: "Zoom" },
  "canvas.zoom_in": { en: "Zoom in", es: "Acercar" },
  "canvas.zoom_out": { en: "Zoom out", es: "Alejar" },
  // The bento card's header row. `card.live` marks the one card holding the real
  // running app rather than a drawing of it — the claim the page most needs to make
  // and the one a reader would otherwise have to guess at. `card.fullscreen` names
  // the control beside it for anyone who can't see the icon.
  // TODO(afi-redaccion)
  "card.live": { en: "Live", es: "En directo" },
  "card.fullscreen": { en: "Open fullscreen", es: "Abrir a pantalla completa" },
  "home.selected_work": { en: "Selected work", es: "Trabajo seleccionado" },
  "home.read_more": { en: "Read more", es: "Leer más" },
  "home.read_less": { en: "Show less", es: "Ver menos" },
  "kind.case_study": { en: "Case study", es: "Caso de estudio" },
  "kind.process": { en: "Process", es: "Proceso" },
  "cv.experience_heading": { en: "Experience", es: "Experiencia" },
  "cv.skills_heading": { en: "Skills", es: "Habilidades" },
  "cv.education_heading": { en: "Education", es: "Formación" },
  "cv.close": { en: "Close", es: "Cerrar" },
  // The two disciplines the CV demonstrates across Afi and RG Designs. The
  // current Afi role below keeps the exact LinkedIn title.
  "cv.title": {
    en: "Product Designer, Design Systems",
    es: "Diseñador de producto y sistemas de diseño",
  },
  "cv.location": { en: "Madrid, Spain", es: "Madrid, España" },
  "work.back": { en: "← back", es: "← volver" },
  "work.role": { en: "Role", es: "Rol" },
  "work.ongoing": { en: "Ongoing", es: "En curso" },
  "work.more": { en: "More case studies", es: "Más casos de estudio" },
  "work.contribution": { en: "Contribution", es: "Contribución" },
  "work.view_case_study": {
    en: "View case study →",
    es: "Ver caso de estudio →",
  },
  "work.coming_soon": {
    en: "Case study coming soon.",
    es: "Caso de estudio próximamente.",
  },
  "footer.rights": {
    en: "All rights reserved.",
    es: "Todos los derechos reservados.",
  },
  "footer.built": {
    en: "Born and raised in DC, based in Madrid.",
    es: "Nacido y criado en DC, basado en Madrid.",
  },
  "lang.toggle_aria_to_es": {
    en: "Cambiar a español",
    es: "Cambiar a español",
  },
  "lang.toggle_aria_to_en": {
    en: "Switch to English",
    es: "Switch to English",
  },
} as const satisfies Record<string, Bilingual>;

export type UIKey = keyof typeof UI;

export function t(key: UIKey, lang: Lang): string {
  return UI[key][lang];
}
