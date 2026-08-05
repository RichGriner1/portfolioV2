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
  /**
   * Reconciled against LinkedIn on 2026-08-05. Titles, companies and dates are
   * LinkedIn's — the CV had drifted badly: Afi was listed as "UX/UI Designer"
   * from 2024 (actually Digital Product Designer from May 2025), Audemic as
   * "Product Manager & UX Designer, 2023—2024" (actually Senior Digital Product
   * Manager, Jan 2024—May 2025), and the freelance entry as "Independent" from
   * 2022 (actually RG Designs from Mar 2021).
   *
   * Descriptions are deliberately a fraction of LinkedIn's length — one short
   * paragraph each, keeping the concrete numbers and named artefacts and dropping
   * the bullet lists. Years only, no months, matching the existing format.
   *
   * Story Architect stays off: cited as delivered work, but the site never
   * shipped. Don't re-add it without a live link.
   */
  experience: [
    {
      role: {
        en: "Digital Product Designer",
        es: "Diseñador de producto digital",
      },
      company: "Afi",
      period: { en: "2025 – present", es: "2025 – actualidad" },
      description: {
        en: "Sole full-time designer on white-label financial products for leading Spanish institutions: wealth management tools, planning simulators, mortgage calculators. Built a three-tier token architecture across Figma and code, so a client rebrand is a token swap rather than twenty files, and wrote design.md, the rulebook AI agents read before generating product UI. Led brand and visual identity for the 2026 Wealth Planner redesign.",
        es: "Único diseñador a tiempo completo en productos financieros white-label para las principales entidades españolas: herramientas de gestión patrimonial, simuladores de planificación y calculadoras hipotecarias. Construí una arquitectura de tokens en tres niveles entre Figma y código, de modo que un cambio de marca de cliente es un cambio de tokens y no de veinte archivos, y escribí design.md, el manual que los agentes de IA leen antes de generar la UI del producto. Dirigí la marca y la identidad visual del rediseño de Wealth Planner 2026.",
      },
    },
    {
      role: {
        en: "Senior Digital Product Manager",
        es: "Senior digital product manager",
      },
      company: "Audemic",
      period: { en: "2024 – 2025", es: "2024 – 2025" },
      description: {
        en: "Led the pivot from a B2C research app to B2B enterprise. Ran discovery with UN analysts and vaccine researchers, then launched the B2B beta and the acquisition funnel behind it: 20 qualified leads in a single week from paid ads. Contributed to a 2× increase in revenue.",
        es: "Lideré el giro de una app de investigación B2C hacia B2B enterprise. Hice el discovery con analistas de la ONU e investigadores de vacunas y lancé la beta B2B y el embudo de captación que la sostenía: 20 leads cualificados en una sola semana con publicidad de pago. Contribuí a duplicar los ingresos.",
      },
    },
    {
      role: {
        en: "UX Designer & Brand Strategist",
        es: "Diseñador UX y estratega de marca",
      },
      company: "Home Genius Exteriors",
      period: { en: "2023", es: "2023" },
      // 0-to-1 applies to the content function, which didn't exist — not to the
      // follower count, which didn't start at zero. Said as "from nothing" rather
      // than the jargon. Leads with the starting follower count because "under
      // 1,000 to nearly four times that" is checkable where a bare +292.6% could
      // sit on any base.
      // "co-founder" rather than VP: he holds both, and it's the title LinkedIn
      // already uses publicly, so the two don't contradict each other.
      // $70M is what the company turned over that year, not growth attributed to
      // this work — the prior year's figure isn't known.
      description: {
        en: "Built the content function from nothing at a US exteriors company that turned over $70M the year I was there. Brand strategy, video production, and a personal brand for the co-founder. Took the company Instagram from under 1,000 followers to nearly four times that in a single summer: 292.6% follower growth, reach up 2,000% in two months.",
        es: "Creé la función de contenido desde cero en una empresa estadounidense de reformas exteriores que facturó 70 millones de dólares el año en que trabajé allí. Estrategia de marca, producción de vídeo y la marca personal del cofundador. Llevé el Instagram de la empresa de menos de 1.000 seguidores a casi el cuádruple en un solo verano: un 292,6 % más de seguidores y un alcance un 2.000 % mayor en dos meses.",
      },
    },
    {
      role: { en: "UX Designer", es: "Diseñador UX" },
      company: "Denteel Marketing",
      period: { en: "2023 – 2024", es: "2023 – 2024" },
      description: {
        en: "Design audits plus AI and SEO research for a dental marketing agency in Madrid. Organic traffic up 40%, and monthly revenue doubled from $15K to $30K by tailoring content to client geography.",
        es: "Auditorías de diseño e investigación de IA y SEO para una agencia de marketing dental en Madrid. El tráfico orgánico subió un 40 % y los ingresos mensuales se duplicaron, de 15.000 a 30.000 dólares, adaptando el contenido a la geografía de cada cliente.",
      },
    },
    {
      role: {
        en: "Product & Brand Designer",
        es: "Diseñador de producto y marca",
      },
      company: "RG Designs",
      period: { en: "2021 – present", es: "2021 – actualidad" },
      description: {
        en: "Brand, design system and build environment for startups with no designer, so they keep shipping after I leave. KT360: brand identity plus a no-code environment where an AI reads the brand rules and component specs. Mindfulme: brand identity, research and MVP delivery for a B2C app that personalises meditations per user.",
        es: "Marca, sistema de diseño y entorno de desarrollo para startups sin diseñador, para que sigan lanzando cuando yo ya no esté. KT360: identidad de marca y un entorno no-code donde una IA lee las reglas de marca y las especificaciones de componentes. Mindfulme: identidad de marca, investigación y entrega del MVP de una app B2C que personaliza las meditaciones para cada usuario.",
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
    { en: "Brand Strategy", es: "Estrategia de marca" },
    { en: "White-label Products", es: "Productos white-label" },
    // Tools named on LinkedIn's Afi entry. "AI Workflow Design" came off — a
    // capability claim, where these are things you either use or don't.
    { en: "TypeScript", es: "TypeScript" },
    { en: "Angular (PrimeNG)", es: "Angular (PrimeNG)" },
    { en: "shadcn/ui", es: "shadcn/ui" },
    { en: "Claude Code", es: "Claude Code" },
  ],
  education: [
    {
      degree: {
        en: "Master's in Digital Product & Service Design",
        es: "Máster en diseño de producto digital y de servicios",
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
