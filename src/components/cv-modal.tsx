"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * `lead` sets the scope in one sentence; `bullets` carry the evidence. The
 * modal mirrors the 2026-09-09 resume: four bullets on the two main roles
 * (Afi, Audemic), one or two on the rest, and `lead` is optional — the
 * shorter roles skip it and go straight to bullets.
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
   * No dates. The correct ones (BA 2016, master's 2021) left a visible
   * 2016–2022 gap next to a CV whose earliest listed role starts in 2021 —
   * Richard was teaching English through that period, and it isn't on here.
   * Degrees and schools stand on their own; add dates back only alongside
   * the roles that fill the gap, or the gap is the thing the reader notices.
   */
  education: Bilingual<string>;
} = {
  name: "Richard Griner",
  email: "richardgrinerdesigns@gmail.com",
  website: "richardgriner.com",
  linkedin: "linkedin.com/in/richardgriner",
  profile: {
    en: "Product designer working between Figma and production code. Sole designer at a financial consultancy, for five engineering teams. Before that, product manager on a research app taken from B2C into the enterprise. Prototypes in Claude Code daily.",
    es: "Diseñador de producto que trabaja entre Figma y el código en producción. Único diseñador en una consultora financiera, para cinco equipos de ingeniería. Antes, product manager en una app de investigación reconvertida de B2C a enterprise. Prototipa a diario con Claude Code.",
  },
  /**
   * Content mirrors the one-page resume master in ~/Documents/CV, dated
   * 2026-09-09. Home Genius
   * Exteriors is off — the resume dropped it. Titles, companies, dates and
   * bullets are the resume's, verbatim in English; Spanish is a Peninsular
   * translation of the same copy.
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
      lead: {
        en: "Sole designer on two white-label financial products, working in agile sprints with forty engineers across five teams, from product flows through to the live interface.",
        es: "Único diseñador en dos productos financieros de marca blanca; trabajo en sprints ágiles con cuarenta ingenieros de cinco equipos, desde los flujos de producto hasta la interfaz en producción.",
      },
      bullets: {
        en: [
          "Lead the 2026 Wealth Planner redesign, directing a second freelance designer. The design definition, typeface, token vocabulary and component library are now published in Claude Design for product owners to build with.",
          "Built and maintain a three-tier token architecture in Figma and Angular, so a white-label client is rebranded with a single token swap instead of edits across twenty component files.",
          "Designed and documented an Angular component playground covering every state, token and brand variant, so five engineering teams implement components from one source.",
          "Tested the playground with engineers, who read raw values over token names, and added an inspector showing both; built a feedback tool that pins comments to components and exports them to the change log.",
        ],
        es: [
          "Lidero el rediseño del Wealth Planner 2026 y dirijo a un segundo diseñador freelance. La definición de diseño, la tipografía, el vocabulario de tokens y la librería de componentes ya están publicados en Claude Design para que los product owners construyan con ellos.",
          "Construí y mantengo una arquitectura de tokens en tres niveles en Figma y Angular, de modo que un cliente de marca blanca actualiza su marca con un solo cambio de tokens en lugar de ediciones en veinte archivos de componentes.",
          "Diseñé y documenté un playground de componentes en Angular que cubre cada estado, token y variante de marca, para que cinco equipos de ingeniería implementen los componentes desde una única fuente.",
          "Probé el playground con ingenieros, que leen los valores en bruto antes que los nombres de los tokens, y añadí un inspector que muestra ambos; construí una herramienta de feedback que fija comentarios a los componentes y los exporta al changelog.",
        ],
      },
    },
    {
      role: {
        en: "Senior Digital Product Manager",
        es: "Product manager digital sénior",
      },
      company: "Audemic",
      period: { en: "2024 – 2025", es: "2024 – 2025" },
      lead: {
        en: "Product manager and sole designer for a B2C research app at $6K/month; led its pivot to B2B enterprise after investors flagged the built-in churn of a student user base.",
        es: "Product manager y único diseñador de una app de investigación B2C con 6.000 $/mes de ingresos; lideré su giro hacia el segmento B2B empresarial después de que los inversores señalaran el abandono estructural de una base de usuarios estudiantil.",
      },
      bullets: {
        en: [
          "Interviewed UN analysts and vaccine researchers, found they lost 20 hours a month searching for information, and launched a B2B beta that produced 20 qualified leads in its first week of paid ads.",
          "Analysed the onboarding funnel in Mixpanel, where 38% of sign-ups skipped onboarding and 18% reached topic selection, and redesigned it to lead with search and five personalised summaries before asking for anything.",
          "Shipped AI summaries iterated against OpenAI and Claude models, a paper view that puts each summary on its source text, and in-app feedback that never interrupts a task, growing revenue from $6K to $10K a month.",
          "Prioritised the backlog with Reach × Impact × Confidence ÷ Effort, so user feedback entered the roadmap in order of business value.",
        ],
        es: [
          "Entrevisté a analistas de la ONU e investigadores de vacunas, descubrí que perdían 20 horas al mes buscando información, y lancé una beta B2B que generó 20 leads cualificados en su primera semana de publicidad de pago.",
          "Analicé el embudo de onboarding en Mixpanel, donde el 38 % de los registros se saltaba el onboarding y solo el 18 % llegaba a la selección de temas, y lo rediseñé para empezar con la búsqueda y cinco resúmenes personalizados antes de pedir nada.",
          "Lancé resúmenes de IA iterados sobre modelos de OpenAI y Claude, una vista de artículo que sitúa cada resumen sobre su texto original, y feedback dentro de la app que nunca interrumpe una tarea; los ingresos crecieron de 6.000 $ a 10.000 $ al mes.",
          "Prioricé el backlog con la fórmula RICE (Reach × Impact × Confidence ÷ Effort), de modo que el feedback de los usuarios entraba en el roadmap por orden de valor de negocio.",
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
          "Encoded KT360's brand rules, component specs and motion tokens as files AI agents read and enforce, so a team with no in-house designer ships on-brand pages.",
          "Delivered Mindfulme's brand, onboarding and mobile MVP, a B2C affirmation product shaped by beta feedback.",
        ],
        es: [
          "Codifiqué las reglas de marca, especificaciones de componentes y tokens de movimiento de KT360 en archivos que los agentes de IA leen y aplican, para que un equipo sin diseñador interno publique páginas coherentes con la marca.",
          "Entregué la marca, el onboarding y el MVP móvil de Mindfulme, un producto B2C de afirmaciones moldeado por el feedback de la beta.",
        ],
      },
    },
    {
      role: { en: "UX Designer", es: "Diseñador UX" },
      company: "Denteel Marketing",
      period: { en: "2023 – 2024", es: "2023 – 2024" },
      bullets: {
        en: [
          "Audited the agency's sites, researched AI and SEO, and segmented content by client geography, doubling monthly revenue from $15K to $30K.",
        ],
        es: [
          "Audité los sitios de la agencia, investigué IA y SEO, y segmenté el contenido según la geografía de cada cliente, duplicando los ingresos mensuales de 15.000 $ a 30.000 $.",
        ],
      },
    },
  ],
  skills: [
    {
      label: { en: "Product", es: "Producto" },
      text: {
        en: "Discovery interviews · user testing · Mixpanel funnels · beta launches · RICE prioritisation · LLM-drafted specs",
        es: "Entrevistas de descubrimiento · testing con usuarios · embudos en Mixpanel · lanzamientos de beta · priorización RICE · especificaciones redactadas con LLM",
      },
    },
    {
      label: { en: "Design", es: "Diseño" },
      text: {
        en: "Figma · design systems and tokens · component specs · typography and layout · motion · accessibility",
        es: "Figma · sistemas de diseño y tokens · especificaciones de componentes · tipografía y maquetación · movimiento · accesibilidad",
      },
    },
    {
      label: { en: "Build", es: "Desarrollo" },
      text: {
        en: "Prototyping and production code with Claude Code, daily: React · TypeScript · Next.js · Tailwind CSS · Angular (PrimeNG) · shadcn/ui · open-source portfolio at github.com/RichGriner1",
        es: "Prototipado y código de producción con Claude Code, a diario: React · TypeScript · Next.js · Tailwind CSS · Angular (PrimeNG) · shadcn/ui · portfolio de código abierto en github.com/RichGriner1",
      },
    },
  ],
  education: {
    en: "Master's in Digital Product & Service Design, IED Madrid · BA Anthropology, University of Maryland",
    es: "Máster en diseño de producto digital y de servicios, IED Madrid · Grado en Antropología, University of Maryland",
  },
};

const SECTION_HEADING =
  "text-muted-foreground border-border mt-6 mb-2 border-b pb-1 text-xs font-bold tracking-wider uppercase";

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
                    <span className="text-muted-foreground mr-1.5 text-xs font-bold tracking-wider uppercase">
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
              <p className="text-foreground text-xs leading-relaxed">
                {pick(CV.education, lang)}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
