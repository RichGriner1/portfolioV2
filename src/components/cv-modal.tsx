"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * `lead` sets the scope in one sentence; `bullets` carry the evidence. Exactly
 * two bullets per role, each holding one number or one named artefact.
 *
 * Two, not four: a CV is scanned rather than read, and a bullet puts a figure at
 * a line start where a paragraph buries it mid-sentence. But five roles at four
 * bullets each is twenty fragments, which stops being scannable, and voice.md
 * treats same-shape-every-time as its own tell.
 */
type CvExperience = {
  role: Bilingual<string>;
  company: string;
  period: Bilingual<string>;
  lead: Bilingual<string>;
  bullets: Bilingual<string[]>;
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
      lead: {
        en: "Sole full-time designer across two white-label financial products, working with engineers from product flows and visual direction through to the live interface.",
        es: "Único diseñador a tiempo completo en dos productos financieros white-label, trabajando con ingeniería desde los flujos de producto y la dirección visual hasta la interfaz en vivo.",
      },
      bullets: {
        en: [
          "Built a three-tier token architecture in Figma and Angular, then a live playground where engineers can inspect component states and copy code.",
          "Documented tokens, responsive rules and component usage in design.md, and prototyped motion patterns for controls and state changes.",
        ],
        es: [
          "Construí una arquitectura de tokens en tres niveles en Figma y Angular, y después un playground en vivo donde ingeniería puede inspeccionar estados y copiar código.",
          "Documenté tokens, reglas responsive y uso de componentes en design.md, y prototipé patrones de movimiento para controles y cambios de estado.",
        ],
      },
    },
    {
      role: {
        en: "Senior Digital Product Manager",
        es: "Senior digital product manager",
      },
      company: "Audemic",
      period: { en: "2024 – 2025", es: "2024 – 2025" },
      lead: {
        en: "Led the pivot from a B2C research app to B2B enterprise, after discovery with UN analysts and vaccine researchers.",
        es: "Lideré el giro de una app de investigación B2C hacia B2B enterprise, tras el discovery con analistas de la ONU e investigadores de vacunas.",
      },
      bullets: {
        en: [
          "Launched the B2B beta and the acquisition funnel behind it: 20 qualified leads in a single week from paid ads.",
          "Contributed to a 2× increase in revenue through product and UX work across the platform.",
        ],
        es: [
          "Lancé la beta B2B y el embudo de captación que la sostenía: 20 leads cualificados en una sola semana con publicidad de pago.",
          "Contribuí a duplicar los ingresos con trabajo de producto y UX en toda la plataforma.",
        ],
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
      lead: {
        en: "Built the content function from nothing at a US exteriors company that turned over $70M the year I was there.",
        es: "Creé la función de contenido desde cero en una empresa estadounidense de reformas exteriores que facturó 70 millones de dólares el año en que trabajé allí.",
      },
      bullets: {
        en: [
          "Took the company Instagram from under 1,000 followers to nearly four times that in a single summer: 292.6% follower growth, reach up 2,000% in two months.",
          "Built a personal brand for the co-founder alongside the company's own, running strategy and video production for both.",
        ],
        es: [
          "Llevé el Instagram de la empresa de menos de 1.000 seguidores a casi el cuádruple en un solo verano: un 292,6 % más de seguidores y un alcance un 2.000 % mayor en dos meses.",
          "Construí la marca personal del cofundador junto a la de la empresa, con la estrategia y la producción de vídeo de las dos.",
        ],
      },
    },
    {
      role: { en: "UX Designer", es: "Diseñador UX" },
      company: "Denteel Marketing",
      period: { en: "2023 – 2024", es: "2023 – 2024" },
      lead: {
        en: "Design audits plus AI and SEO research for a dental marketing agency in Madrid.",
        es: "Auditorías de diseño e investigación de IA y SEO para una agencia de marketing dental en Madrid.",
      },
      bullets: {
        en: [
          "Doubled monthly revenue from $15K to $30K by tailoring content to client geography.",
          "Grew organic traffic 40% and the Instagram following 345% through content and video optimization.",
        ],
        es: [
          "Dupliqué los ingresos mensuales, de 15.000 a 30.000 dólares, adaptando el contenido a la geografía de cada cliente.",
          "Aumenté el tráfico orgánico un 40 % y los seguidores de Instagram un 345 % con optimización de contenido y vídeo.",
        ],
      },
    },
    {
      role: {
        en: "Product & Brand Designer",
        es: "Diseñador de producto y marca",
      },
      company: "RG Designs",
      period: { en: "2021 – present", es: "2021 – actualidad" },
      lead: {
        en: "Brand identities, component specifications and build environments for early-stage teams without a full-time designer.",
        es: "Identidades de marca, especificaciones de componentes y entornos de desarrollo para equipos en fase inicial sin diseñador a tiempo completo.",
      },
      bullets: {
        en: [
          "KT360: encoded brand rules, component specs and motion tokens in a build environment that AI agents can read and enforce.",
          "Mindfulme: brand identity, research and MVP delivery for a B2C app that personalises meditations per user.",
        ],
        es: [
          "KT360: codifiqué reglas de marca, especificaciones de componentes y tokens de movimiento en un entorno de desarrollo que los agentes de IA pueden leer y aplicar.",
          "Mindfulme: identidad de marca, investigación y entrega del MVP de una app B2C que personaliza las meditaciones para cada usuario.",
        ],
      },
    },
  ],
  skills: [
    { en: "Design Systems", es: "Sistemas de diseño" },
    { en: "Token Architecture", es: "Arquitectura de tokens" },
    { en: "Component Systems", es: "Sistemas de componentes" },
    { en: "Figma", es: "Figma" },
    { en: "Prototyping in Code", es: "Prototipado en código" },
    { en: "Product Design", es: "Diseño de producto" },
    { en: "Motion & Interaction", es: "Movimiento e interacción" },
    { en: "Accessibility", es: "Accesibilidad" },
    { en: "React", es: "React" },
    { en: "TypeScript", es: "TypeScript" },
    { en: "Tailwind CSS", es: "Tailwind CSS" },
    // Additional technologies and product-design capabilities used in the Afi work.
    { en: "Angular (PrimeNG)", es: "Angular (PrimeNG)" },
    { en: "shadcn/ui", es: "shadcn/ui" },
    { en: "Claude Code", es: "Claude Code" },
    { en: "UX Research", es: "Investigación UX" },
    { en: "White-label Products", es: "Productos white-label" },
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
              className="bg-card border-border fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-3xl border p-6 pb-8 shadow-xl sm:p-8 sm:pb-10"
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

              {/* One column on phones, three from `sm` up. `grid-cols-3` was
                  unconditional: at 375px the panel is 343px wide and `p-8` takes
                  64 of it, so the three tracks plus two 32px gaps left the skills
                  rail 72px wide — every pill ("White-label Products", "Token
                  Architecture") wrapped to three or four lines, and experience
                  read in a 143px gutter. Stacked, skills sit under experience at
                  full width. */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="flex flex-col gap-6 sm:col-span-2">
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
                            {pick(e.lead, lang)}
                          </p>
                          {/* Two bullets per role. A hiring manager scans for
                              numbers, and a paragraph buries them mid-sentence
                              where a bullet puts them at a line start. Capped at
                              two so five roles don't become twenty fragments. */}
                          <ul className="text-muted-foreground mt-1.5 flex flex-col gap-1 text-xs leading-relaxed">
                            {pick(e.bullets, lang).map((b) => (
                              <li key={b} className="flex gap-2">
                                <span aria-hidden className="shrink-0">
                                  ·
                                </span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
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
