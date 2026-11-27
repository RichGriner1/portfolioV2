"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * `lead` says what the company is; `bullets` carry the evidence. The modal
 * mirrors the 2026-09-16 CV: five bullets on Afi, four on Audemic, fewer on
 * the rest. `lead` is optional, so the shorter roles go straight to bullets.
 */
type CvExperience = {
  role: Bilingual<string>;
  company: string;
  period: Bilingual<string>;
  lead?: Bilingual<string>;
  bullets: Bilingual<string[]>;
};

type CvSkillLine = {
  label: Bilingual<string>;
  text: Bilingual<string>;
};

const CV: {
  name: string;
  email: string;
  website: string;
  linkedin: string;
  profile: Bilingual<string>;
  experience: CvExperience[];
  skills: CvSkillLine[];
  /**
   * One line per qualification, as the CV sets them.
   *
   * No dates. The correct ones (BA 2016, master's 2021) left a visible
   * 2016–2022 gap next to a CV whose earliest listed role starts in 2021 —
   * Richard was teaching English through that period, and it isn't on here.
   * Degrees and schools stand on their own; add dates back only alongside
   * the roles that fill the gap, or the gap is the thing the reader notices.
   */
  education: Bilingual<string[]>;
} = {
  name: "Richard Griner",
  email: "richardgrinerdesigns@gmail.com",
  website: "richardgriner.com",
  linkedin: "linkedin.com/in/richardgriner",
  profile: {
    en: "Product designer with B2B and B2C experience, from research and prototyping to UI, design systems and working alongside engineering. I'm currently the only full-time designer at a financial consultancy, working with five engineering teams on products and experiences for financial institutions.",
    es: "Diseñador de producto con experiencia en B2B y B2C, desde research y prototipado hasta UI, sistemas de diseño y trabajo con ingeniería. Actualmente soy el único diseñador a tiempo completo en una consultora financiera y colaboro con cinco equipos de ingeniería en productos y experiencias para entidades financieras.",
  },
  /**
   * Content mirrors the one-page CV dated 2026-09-16 (the Garaje de Ideas
   * version). That CV was written in Spanish, so the Spanish here is Richard's
   * copy verbatim, with role titles in sentence case, and the English is a
   * translation of it. Both, plus the PDFs, live in applications/garaje-de-ideas/,
   * which is gitignored because the CV carries a phone number. The phone number
   * stays off this page for the same reason.
   *
   * Home Genius Exteriors is off, as it is on the CV. Story Architect stays off:
   * cited as delivered work, but the site never shipped. Don't re-add it without
   * a live link.
   */
  experience: [
    {
      role: {
        en: "Digital Product Designer",
        es: "Diseñador de producto digital",
      },
      company: "Afi",
      period: { en: "2025 – present", es: "2025 – actualidad" },
      lead: {
        en: "Spanish financial consultancy that builds digital products for banks and other financial institutions.",
        es: "Consultora financiera española que desarrolla productos digitales para bancos y otras entidades financieras.",
      },
      bullets: {
        en: [
          "Led the 2026 visual redesign of Wealth Planner, defining the interface, states, responsive behaviour and interaction patterns, and coordinating a second freelance designer.",
          "Designed financial simulators, many of them white-label, for institutions such as Santander, Unicaja and Bankinter, adapting each one to business, brand and user requirements and working with development through to implementation.",
          "Audited Wealth Planner's screens and components with engineering ahead of its migration to PrimeNG, identifying inconsistencies and defining reusable patterns.",
          "Created a token architecture and a Figma component library to keep products consistent and adapt the interface to different brands.",
          "Built an interactive component playground in Claude Code, used by five engineering teams; while testing it with them, spotted usability issues and added an inspector that links visual values to their tokens.",
        ],
        es: [
          "Lideré el rediseño visual 2026 de Wealth Planner, definiendo la interfaz, los estados, el comportamiento responsive y los patrones de interacción, y coordinando a una segunda diseñadora freelance.",
          "Diseñé simuladores financieros, muchos de ellos white-label, para entidades como Santander, Unicaja y Bankinter, adaptando cada solución a los requisitos de negocio, marca y usuario y trabajando con desarrollo hasta su implementación.",
          "Audité las pantallas y componentes de Wealth Planner junto con ingeniería antes de su migración a PrimeNG, detectando inconsistencias y definiendo patrones reutilizables.",
          "Creé una arquitectura de tokens y una librería de componentes en Figma para mantener la consistencia entre productos y adaptar la interfaz a distintas marcas.",
          "Construí en Claude Code un playground interactivo de componentes utilizado por cinco equipos de ingeniería; al probarlo con ellos, detecté problemas de uso y añadí un inspector que relaciona los valores visuales con sus tokens.",
        ],
      },
    },
    {
      role: {
        en: "Senior Product Manager & Product Designer",
        es: "Senior Product Manager & Product Designer",
      },
      company: "Audemic",
      period: { en: "2024 – 2025", es: "2024 – 2025" },
      lead: {
        en: "AI-powered research product. Combined product management and design in B2C, and later in exploring a B2B model.",
        es: "Producto de investigación basado en IA. Combiné product management y diseño en B2C y, más adelante, en la exploración de un modelo B2B.",
      },
      bullets: {
        en: [
          "Interviewed UN analysts and vaccine researchers and found they spent up to 20 hours a month tracking down relevant information.",
          "Analysed the onboarding funnel in Mixpanel and found that 38% of sign-ups skipped it; redesigned onboarding to show the product's value before asking for setup.",
          "Designed and iterated on AI-generated summaries, a reading experience that connects each summary to its source text, and an in-app feedback system.",
          "Used surveys, user tests, in-app feedback and RICE to prioritise opportunities; took part in an early B2B beta that generated 20 qualified leads in its first week of paid ads.",
        ],
        es: [
          "Entrevisté a analistas de la ONU e investigadores de vacunas e identifiqué hasta 20 horas mensuales dedicadas a localizar información relevante.",
          "Analicé el funnel de onboarding en Mixpanel y detecté que el 38 % de los registros se lo saltaba; rediseñé el onboarding para mostrar el valor del producto antes de pedir configuración.",
          "Diseñé e iteré resúmenes generados con IA, una experiencia de lectura que conecta cada resumen con su texto original y un sistema de feedback in-app.",
          "Utilicé encuestas, tests de usuario, feedback in-app y RICE para priorizar oportunidades; participé en una primera beta B2B que generó 20 leads cualificados en su primera semana de anuncios de pago.",
        ],
      },
    },
    {
      role: {
        en: "Product & Brand Designer",
        es: "Diseñador de producto y marca",
      },
      company: "RG Designs (freelance)",
      period: { en: "2021 – present", es: "2021 – actualidad" },
      bullets: {
        en: [
          "Built internal tools for KT360 with Claude Code, such as a brand playground where the team can browse and download logos as SVG and PNG in every colour and size, cutting repeat requests for assets and Figma links.",
          "Designed the identity, onboarding and MVP for the Mindfulme mobile app, as well as the visual identity and logo for Beetested.",
          "Redesigned a school's website, replacing a basic HTML page with an experience built for families and admissions; enrolments doubled in the month after launch.",
        ],
        es: [
          "Construí con Claude Code herramientas internas para KT360, como un playground de marca donde el equipo puede consultar y descargar logotipos en SVG y PNG con sus colores y tamaños, evitando peticiones repetitivas de assets y enlaces de Figma.",
          "Diseñé la identidad, el onboarding y el MVP de la app móvil Mindfulme, además de la identidad visual y el logotipo de Beetested.",
          "Rediseñé la web de un centro educativo, sustituyendo una página HTML básica por una experiencia orientada a familias y captación; tras el lanzamiento, las matriculaciones aumentaron un 100 % durante el mes siguiente.",
        ],
      },
    },
    {
      role: { en: "UX Designer", es: "Diseñador UX" },
      company: "Denteel Marketing",
      period: { en: "2023 – 2024", es: "2023 – 2024" },
      bullets: {
        en: [
          "Audited websites and combined user, market and SEO research to improve their structure and content; also segmented the experience by market and client location.",
        ],
        es: [
          "Audité webs y combiné research de usuarios, mercado y SEO para mejorar la arquitectura y el contenido; también segmenté las experiencias por mercado y ubicación del cliente.",
        ],
      },
    },
  ],
  skills: [
    {
      label: { en: "Product design", es: "Diseño de producto" },
      text: {
        en: "Research · interviews · user testing · information architecture · user flows · wireframes · prototyping · interaction · UI · responsive · accessibility · design systems",
        es: "Research · entrevistas · tests de usuario · arquitectura de información · user flows · wireframes · prototipado · interacción · UI · responsive · accesibilidad · design systems",
      },
    },
    {
      label: { en: "Product & analytics", es: "Producto y analítica" },
      text: {
        en: "Mixpanel · funnels · UX audits · experimentation · in-app feedback · RICE · agile teams",
        es: "Mixpanel · funnels · auditorías UX · experimentación · feedback in-app · RICE · equipos ágiles",
      },
    },
    {
      label: { en: "Tools", es: "Herramientas" },
      text: {
        en: "Figma · Claude Design · Claude Code · Codex · prototyping in React, Next.js and Angular",
        es: "Figma · Claude Design · Claude Code · Codex · prototipado en React, Next.js y Angular",
      },
    },
    {
      label: { en: "Languages", es: "Idiomas" },
      text: {
        en: "English, native. Spanish, professional working proficiency.",
        es: "Inglés nativo · Español profesional",
      },
    },
  ],
  education: {
    en: [
      "Master's in Digital Product & Service Design · IED Madrid",
      "AI Design Systems Certificate · Memorisely",
      "BA in Anthropology · University of Maryland",
    ],
    es: [
      "Máster en Diseño de Producto y Servicio Digital · IED Madrid",
      "Certificado AI Design Systems · Memorisely",
      "Grado en Antropología · University of Maryland",
    ],
  },
};

// Sentence case, like the CV it mirrors and every other label on the site.
const SECTION_HEADING =
  "text-muted-foreground border-border mt-6 mb-2 border-b pb-1 text-xs font-bold";

/**
 * Uncontrolled by default: renders its own "CV" trigger and owns `open`.
 *
 * The optional controlled form exists because the site menu can't contain this
 * component. The menu panel animates `max-width`/`height` with `overflow: hidden`,
 * and its rows animate `filter`, either of which makes an ancestor the containing
 * block for `position: fixed` descendants — so the modal stopped escaping the panel
 * and got clipped to its 304px width (measured: 488px of modal inside a 304px box).
 * Passing `open`/`onOpenChange` lets the trigger live inside the panel while the
 * modal itself renders as a sibling outside it, and `triggerless` drops the built-in
 * button for that case.
 */
export function CvModal({
  open: controlledOpen,
  onOpenChange,
  triggerless = false,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render only the dialog, no trigger — for the controlled form. */
  triggerless?: boolean;
} = {}) {
  const { lang } = useLang();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  // `useCallback` so the effects below can depend on it honestly — it's a real
  // function now, not a stable setState, so omitting it from a dep array would be a
  // stale-closure waiting to happen.
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

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
      {/* "CV" is two glyphs, so the bare text box was 19×20px — under the 24px
          WCAG 2.5.8 minimum in both directions, and the smallest target in the
          header. `px-1 py-1.5` gets it to roughly 27×32 for 8px of width, which
          the 320px row can afford where a larger pad could not. */}
      {triggerless ? null : (
        <button
          onClick={() => setOpen(true)}
          className="hover:text-foreground px-1 py-1.5 underline-offset-4 transition-colors hover:underline"
        >
          {t("nav.cv", lang)}
        </button>
      )}

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
              // Marks the panel itself, as opposed to the backdrop behind it. The
              // canvas's cursor reads this to decide whether to show its close
              // affordance: clicking the backdrop dismisses, clicking the panel does
              // not, so an "×" over the panel would be promising something false.
              data-cv-dialog
              className="bg-card border-border fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-3xl border p-6 pb-8 shadow-xl sm:p-8 sm:pb-10"
              style={{ maxHeight: "85vh" }}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-foreground text-xl font-bold tracking-tight">
                    {CV.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {t("cv.title", lang)}
                  </p>
                  <div className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-2.5 gap-y-0.5 text-xs">
                    <span>{t("cv.location", lang)}</span>
                    <span aria-hidden>·</span>
                    <span>{CV.email}</span>
                    <span aria-hidden>·</span>
                    <a
                      href={`https://${CV.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="decoration-muted-foreground/70 hover:decoration-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                    >
                      {CV.website}
                    </a>
                    <span aria-hidden>·</span>
                    <a
                      href={`https://www.${CV.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="decoration-muted-foreground/70 hover:decoration-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                    >
                      {CV.linkedin}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xl leading-none transition-colors"
                  aria-label={t("cv.close", lang)}
                >
                  ×
                </button>
              </div>

              <p className="text-foreground mt-3 text-sm leading-relaxed">
                {pick(CV.profile, lang)}
              </p>

              <h3 className={SECTION_HEADING}>
                {t("cv.experience_heading", lang)}
              </h3>
              <div className="flex flex-col gap-4">
                {CV.experience.map((e) => (
                  <div key={e.company}>
                    {/* Company name and period stay sans, not mono — the resume they
                        mirror sets them in the same typeface as everything else. */}
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-foreground text-sm font-semibold">
                        {pick(e.role, lang)}
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          · {e.company}
                        </span>
                      </span>
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {pick(e.period, lang)}
                      </span>
                    </div>
                    {e.lead && (
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {pick(e.lead, lang)}
                      </p>
                    )}
                    <ul className="marker:text-muted-foreground text-foreground mt-1.5 list-disc pl-4 text-xs leading-relaxed">
                      {pick(e.bullets, lang).map((b) => (
                        <li key={b} className="mb-1 last:mb-0">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <h3 className={SECTION_HEADING}>
                {t("cv.skills_heading", lang)}
              </h3>
              <div className="flex flex-col gap-1.5">
                {CV.skills.map((s) => (
                  <p key={s.label.en} className="text-xs leading-relaxed">
                    <span className="text-muted-foreground mr-1.5 text-xs font-bold">
                      {pick(s.label, lang)}
                    </span>
                    <span className="text-foreground">
                      {pick(s.text, lang)}
                    </span>
                  </p>
                ))}
              </div>

              <h3 className={SECTION_HEADING}>
                {t("cv.education_heading", lang)}
              </h3>
              <div className="flex flex-col gap-1">
                {pick(CV.education, lang).map((line) => (
                  <p
                    key={line}
                    className="text-foreground text-xs leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
