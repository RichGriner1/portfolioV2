"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;

type CvExperience = {
  role: Bilingual<string>;
  company: string;
  period: Bilingual<string>;
  description: Bilingual<string>;
};

/**
 * No `year`. Dates came off on 2026-08-05: the correct ones (BA 2016, master's
 * 2021) left a visible 2016–2022 gap on a CV whose earliest listed role starts
 * in 2022. Richard was teaching English through that period — it just isn't on
 * here. Degrees and schools stand on their own; add dates back only alongside
 * the roles that fill the gap, or the gap is the thing the reader notices.
 */
type CvEducation = {
  degree: Bilingual<string>;
  school: string;
};

const CV: {
  name: string;
  email: string;
  experience: CvExperience[];
  skills: Bilingual<string>[];
  education: CvEducation[];
} = {
  name: "Richard Griner",
  email: "richardgrinerdesigns@gmail.com",
  experience: [
    {
      role: { en: "UX/UI Designer", es: "Diseñador UX/UI" },
      company: "Afi",
      period: { en: "2024 — present", es: "2024 — actualidad" },
      description: {
        en: "Designing fintech products for banks and financial institutions at a leading Spanish consultancy. Building a design system from the ground up — architecting a custom token system, building an AI-assisted platform for white-label products across banking clients, and turning every new client into another pass at sharpening the system.",
        es: "Diseñando productos fintech para bancos e instituciones financieras en una consultora española de referencia. Construyendo un sistema de diseño desde cero — arquitectando un sistema de tokens a medida, creando una plataforma asistida por IA para productos white-label entre clientes bancarios, y convirtiendo cada nuevo cliente en otra pasada para afinar el sistema.",
      },
    },
    {
      role: {
        en: "Product Manager & UX Designer",
        es: "Product manager y diseñador UX",
      },
      company: "Audemic",
      period: { en: "2023 — 2024", es: "2023 — 2024" },
      description: {
        en: "Led product and UX across two sister products under one brand. Defined the product roadmap, ran user research, and built sibling design systems that kept both products visually consistent while serving different user needs.",
        es: "Lideré producto y UX en dos productos hermanos bajo una misma marca. Definí la hoja de ruta de producto, realicé investigación con usuarios y construí sistemas de diseño hermanos que mantuvieron ambos productos visualmente consistentes mientras atendían necesidades distintas.",
      },
    },
    {
      role: {
        en: "Freelance Designer & AI Builder",
        es: "Diseñador freelance y constructor de IA",
      },
      company: "Independent",
      period: { en: "2022 — present", es: "2022 — actualidad" },
      // Story Architect was removed 2026-08-05: it was cited here as delivered
      // work, but the site never shipped and its URL 404s. Don't re-add it
      // without a live link.
      description: {
        en: "Visual strategy, design systems, and AI-assisted development for startups and small businesses. Projects include KT360 (brand identity + AI-powered team environment).",
        es: "Estrategia visual, sistemas de diseño y desarrollo asistido por IA para startups y pequeñas empresas. Los proyectos incluyen KT360 (identidad de marca + entorno de equipo impulsado por IA).",
      },
    },
  ],
  skills: [
    { en: "Design Systems", es: "Sistemas de diseño" },
    { en: "Token Architecture", es: "Arquitectura de tokens" },
    { en: "Figma", es: "Figma" },
    { en: "UX Research", es: "Investigación UX" },
    { en: "Product Design", es: "Diseño de producto" },
    { en: "Visual Strategy", es: "Estrategia visual" },
    { en: "Tailwind CSS", es: "Tailwind CSS" },
    { en: "AI Workflow Design", es: "Diseño de flujos de IA" },
    { en: "Brand Strategy", es: "Estrategia de marca" },
    { en: "White-label Products", es: "Productos white-label" },
    { en: "PrimeNG", es: "PrimeNG" },
    { en: "shadcn/ui", es: "shadcn/ui" },
  ],
  education: [
    {
      degree: {
        en: "Master's in UX & Service Design",
        es: "Máster en UX y diseño de servicios",
      },
      school: "IED Madrid",
    },
    {
      degree: {
        en: "BA Anthropology",
        es: "Grado en Antropología",
      },
      school: "University of Maryland, College Park",
    },
  ],
};

export function CvModal() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      // Clear any lingering state before locking (belt-and-suspenders against
      // stacked state from weird edge cases / previous unmounts).
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // On close OR unmount-while-open: fully restore body and scroll.
        const storedTop = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(storedTop || "0") * -1);
      };
    }

    // Closed state: ensure everything is clear.
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
      >
        {t("nav.cv", lang)}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="bg-card border-border fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-3xl border p-8 pb-10 shadow-xl"
              style={{ maxHeight: "85vh" }}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-foreground text-lg font-semibold">
                    {CV.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {t("cv.title", lang)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t("cv.location", lang)} · {CV.email}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none transition-colors"
                  aria-label={t("cv.close", lang)}
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 flex flex-col gap-6">
                  <div>
                    <h3 className="text-muted-foreground mb-3 font-mono text-xs tracking-wider uppercase">
                      {t("cv.experience_heading", lang)}
                    </h3>
                    <div className="flex flex-col gap-5">
                      {CV.experience.map((e) => (
                        <div key={e.company}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-foreground text-sm font-medium">
                              {pick(e.role, lang)}
                            </span>
                            <span className="text-muted-foreground shrink-0 font-mono text-xs">
                              {pick(e.period, lang)}
                            </span>
                          </div>
                          <div className="text-muted-foreground mb-1 font-mono text-xs">
                            {e.company}
                          </div>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {pick(e.description, lang)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-muted-foreground mb-3 font-mono text-xs tracking-wider uppercase">
                      {t("cv.education_heading", lang)}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {CV.education.map((e) => (
                        <div key={e.school}>
                          {/* No year. Degrees are listed without dates on
                              purpose — see the CvEducation type. */}
                          <div className="text-foreground text-sm">
                            {pick(e.degree, lang)}
                          </div>
                          <div className="text-muted-foreground font-mono text-xs">
                            {e.school}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-muted-foreground mb-3 font-mono text-xs tracking-wider uppercase">
                    {t("cv.skills_heading", lang)}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {CV.skills.map((s) => (
                      <span
                        key={s.en}
                        className="border-border text-muted-foreground rounded-full border px-2.5 py-1 font-mono text-xs"
                      >
                        {pick(s, lang)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
