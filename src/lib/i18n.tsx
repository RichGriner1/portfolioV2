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

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "en" || stored === "es") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(stored);
      return;
    }
    const browser = navigator.language?.toLowerCase().startsWith("es")
      ? "es"
      : "en";
    setLangState(browser);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "en" ? "es" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, toggle }),
    [lang, setLang, toggle],
  );

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
  "nav.linkedin": { en: "LinkedIn", es: "LinkedIn" },
  "nav.email": { en: "Email", es: "Correo" },
  "nav.cv": { en: "CV", es: "CV" },
  "home.selected_work": { en: "Selected work", es: "Trabajo seleccionado" },
  "home.my_work": { en: "My work", es: "Mi trabajo" },
  "home.my_work_intro": {
    en: "A mix of projects, case studies, and process notes — what I've been shipping and thinking about as a design-systems designer in AI and fintech.",
    es: "Una mezcla de proyectos, casos de estudio y notas de proceso — lo que he estado lanzando y pensando como diseñador de sistemas de diseño en IA y fintech.",
  },
  "tabs.new_releases": { en: "New releases", es: "Novedades" },
  "tabs.all": { en: "All", es: "Todos" },
  "tabs.case_studies": { en: "Case studies", es: "Casos de estudio" },
  "tabs.processes": { en: "Processes", es: "Procesos" },
  "kind.case_study": { en: "Case study", es: "Caso de estudio" },
  "kind.process": { en: "Process", es: "Proceso" },
  "cv.experience_heading": { en: "Experience", es: "Experiencia" },
  "cv.skills_heading": { en: "Skills", es: "Habilidades" },
  "cv.education_heading": { en: "Education", es: "Formación" },
  "cv.close": { en: "Close", es: "Cerrar" },
  "cv.title": {
    en: "UX/UI Designer · AI Builder",
    es: "Diseñador UX/UI · Constructor de IA",
  },
  "cv.location": { en: "Madrid, Spain", es: "Madrid, España" },
  "hero.updated": { en: "Updated Apr 2026", es: "Actualizado abr. 2026" },
  "work.back": { en: "← back", es: "← volver" },
  "work.role": { en: "Role", es: "Rol" },
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
    en: "Designed & built by hand.",
    es: "Diseñado y construido a mano.",
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
