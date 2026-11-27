"use client";

import { Libre_Franklin } from "next/font/google";
import { LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { Droplets, Landmark, Percent, type LucideIcon } from "lucide-react";

import { type Bilingual, pick, useLang } from "@/lib/i18n";

/**
 * Hand-built artboards for case studies, drawn in code instead of screenshots.
 *
 * Made for the slot, the way rows.gg draws its beats: a few large elements, big type,
 * almost no chrome. They are not the real screens shrunk down; the live demo is for
 * that. They copy the product's look (Afi apps: Libre Franklin, azul profundo, Afi blue,
 * the AI gradient), stay sharp at any size, animate only while on screen, and hold still
 * with reduced motion.
 */

const libre = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const NAVY = "#062D3F";
const AFI = "#007CBC";
/** The AI gradient: Afi blue with a touch of violet and pink (chosen on the canvas, 3.14). */
const AI_GRADIENT =
  "linear-gradient(135deg, #007CBC 0%, #7C6EF0 62%, #A66AE0 100%)";

/** Ticks while the artboard is on screen and motion is allowed. */
function useTicker(ms: number, steps: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % steps), ms);
    return () => clearInterval(t);
  }, [inView, reduce, ms, steps]);
  return { ref, i, reduce: !!reduce };
}

/** The product's type on whatever the artboard draws. */
function Board({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${libre.className} text-[#1f2328] ${className}`}>
      {children}
    </div>
  );
}

/** A white product card, the one surface every artboard uses. */
function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[10px] bg-white shadow-[0_1px_2px_rgba(0,0,0,.05)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/** "3.61 / After" on top of an artboard. The one control an artboard may have. */
function BeforeAfter({
  value,
  onChange,
}: {
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
}) {
  const { lang } = useLang();
  const id = useId();
  const labels = ["3.61", lang === "es" ? "Después" : "After"];
  return (
    <div
      role="tablist"
      aria-label={lang === "es" ? "Antes y después" : "Before and after"}
      className="border-border bg-background/60 flex w-fit gap-1 rounded-lg border p-1"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          onChange(value === 0 ? 1 : 0);
        }
      }}
    >
      {labels.map((l, k) => (
        <button
          key={k}
          type="button"
          role="tab"
          id={`${id}-${k}`}
          aria-selected={value === k}
          tabIndex={value === k ? 0 : -1}
          onClick={() => onChange(k as 0 | 1)}
          className={`focus-visible:ring-ring rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
            value === k
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ map --- */

type Place = "menu" | "top" | "drawer" | "m" | "form" | "plan";

const PIECES: { id: string; label: string; before: Place; after: Place }[] = [
  { id: "pat", label: "Patrimonio", before: "menu", after: "m" },
  { id: "ing", label: "Ingresos", before: "menu", after: "m" },
  { id: "jub", label: "Jubilación", before: "menu", after: "m" },
  { id: "fam", label: "Familia", before: "menu", after: "plan" },
  { id: "obj", label: "Objetivos", before: "menu", after: "plan" },
  { id: "p1", label: "Legado", before: "top", after: "plan" },
  { id: "p2", label: "Liquidez", before: "top", after: "plan" },
  { id: "not", label: "Notas", before: "top", after: "plan" },
  { id: "imp", label: "Impacto en el plan", before: "drawer", after: "plan" },
  { id: "cfg", label: "Configuración", before: "drawer", after: "plan" },
  { id: "ia", label: "Asistente IA", before: "drawer", after: "form" },
];

const PLACE_NAME: Record<Place, Bilingual<string>> = {
  menu: { en: "Menu", es: "Menú" },
  top: { en: "Top bar", es: "Barra superior" },
  drawer: { en: "Drawers and buttons", es: "Paneles y botones" },
  m: { en: "Menu", es: "Menú" },
  form: { en: "Form", es: "Formulario" },
  plan: { en: "Plan", es: "Plan" },
};

/** The 3.61 pieces, scattered, fly into three columns: menu, form, plan. Then back. */
function ArtMap() {
  const { lang } = useLang();
  const { ref, i } = useTicker(3400, 2);
  const after = i === 1;
  const places: Place[] = after
    ? ["m", "form", "plan"]
    : ["menu", "top", "drawer"];
  return (
    <Board>
      <div ref={ref}>
        <LayoutGroup>
          <div className="grid grid-cols-3 gap-2.5">
            {places.map((pl) => (
              <motion.div
                layout
                key={pl}
                className="flex min-h-[150px] flex-col gap-2 rounded-[10px] p-3"
                style={{
                  background:
                    after && pl === "plan" ? "#fff" : "rgba(255,255,255,.55)",
                  boxShadow:
                    after && pl === "plan" ? `inset 0 0 0 3px ${NAVY}` : "none",
                }}
              >
                <span className="text-[12px] font-semibold text-[#4f5761]">
                  {pick(PLACE_NAME[pl], lang)}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PIECES.filter(
                    (p) => (after ? p.after : p.before) === pl
                  ).map((p) => (
                    <motion.span
                      layout
                      layoutId={`piece-${p.id}`}
                      key={p.id}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 28,
                      }}
                      className="rounded-md bg-white px-2 py-1 text-[13px] leading-tight shadow-[0_1px_2px_rgba(0,0,0,.08)]"
                    >
                      {p.label}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </Board>
  );
}

/* --------------------------------------------------------- decision 1 --- */

const PAGES = [
  { page: "Ingresos", tab: 1 },
  { page: "Patrimonio", tab: 0 },
  { page: "Asset allocation", tab: 2 },
];

const TABS = [
  { name: "Patrimonio y legado", fig: "3,6 M €" },
  { name: "Liquidez", fig: "−8.400 €" },
  { name: "Rentabilidad", fig: "4,6 %" },
];

/** 3.61: the page changes, the two pills don't. After: the plan's tab follows the page. */
function ArtFollows() {
  const [v, setV] = useState<0 | 1>(1);
  const { ref, i } = useTicker(1900, PAGES.length);
  const cur = PAGES[i];
  return (
    <Board className="flex flex-col gap-3">
      <BeforeAfter value={v} onChange={setV} />
      <div ref={ref}>
        {v === 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-end gap-2">
              <Card className="px-3 py-1.5 text-[14px] font-medium">
                <span className="text-[#b28704]">▲</span> Legado 1,0 M €
              </Card>
              <Card className="px-3 py-1.5 text-[14px] font-medium">
                <span className="text-[#b53030]">✕</span> Liquidez insuficiente
              </Card>
            </div>
            <Card className="flex min-h-[150px] flex-col justify-center gap-1 px-5 py-4">
              <span className="text-[12px] text-[#6b7480]">Página</span>
              <motion.span
                key={cur.page}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[24px] font-medium"
              >
                {cur.page}
              </motion.span>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3">
            <Card className="flex flex-col justify-center gap-1 px-5 py-4">
              <span className="text-[12px] text-[#6b7480]">Página</span>
              <motion.span
                key={cur.page}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[22px] leading-tight font-medium"
              >
                {cur.page}
              </motion.span>
            </Card>
            <div className="flex flex-col gap-2">
              {TABS.map((t, k) => {
                const on = k === cur.tab;
                return (
                  <motion.div
                    key={t.name}
                    animate={{ x: on ? -6 : 0, opacity: on ? 1 : 0.55 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  >
                    <Card
                      className="flex items-baseline justify-between gap-3 px-4 py-2.5"
                      style={
                        on
                          ? {
                              boxShadow: `inset 3px 0 0 ${NAVY}, 0 6px 16px rgba(0,0,0,.08)`,
                            }
                          : undefined
                      }
                    >
                      <span className="truncate text-[14px]">{t.name}</span>
                      <span className="text-[15px] font-semibold tabular-nums">
                        {t.fig}
                      </span>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Board>
  );
}

/* --------------------------------------------------------- decision 3 --- */

const AGES = [
  { age: 61, type: "Anticipada", pension: 41592 },
  { age: 63, type: "Anticipada", pension: 46924 },
  { age: 65, type: "Ordinaria", pension: 53323 },
  { age: 67, type: "Demorada", pension: 57589 },
  { age: 70, type: "Demorada", pension: 63454 },
];

const eur = (n: number) => n.toLocaleString("es-ES") + " €";

/** 3.61: one age at a time, from a dropdown. After: every age shows its pension first. */
function ArtAges() {
  const [v, setV] = useState<0 | 1>(1);
  const { ref, i } = useTicker(1500, AGES.length);
  return (
    <Board className="flex flex-col gap-3">
      <BeforeAfter value={v} onChange={setV} />
      <div ref={ref}>
        {v === 0 ? (
          <div className="flex flex-col gap-3">
            <Card className="flex items-center justify-between px-4 py-3 text-[15px]">
              <span>Noviembre de 2031 · 65 años</span>
              <span aria-hidden="true" className="text-[#6b7480]">
                ⌄
              </span>
            </Card>
            <Card className="flex flex-col gap-1 px-5 py-4">
              <span className="text-[12px] text-[#6b7480]">
                Pensión bruta anual
              </span>
              <span className="text-[26px] font-medium tabular-nums">
                53.323 €
              </span>
              <span className="text-[13px] font-semibold text-[#4f5761]">
                Ver otras opciones ⌄
              </span>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {AGES.map((a, k) => {
              const on = k === i;
              return (
                <motion.div
                  key={a.age}
                  animate={{ y: on ? -6 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <Card
                    className="flex flex-col gap-1 px-2.5 py-3"
                    style={
                      on
                        ? {
                            boxShadow: `inset 0 3px 0 ${NAVY}, 0 8px 20px rgba(0,0,0,.10)`,
                          }
                        : undefined
                    }
                  >
                    <span className="text-[17px] font-semibold">{a.age}</span>
                    <span className="text-[11px] text-[#6b7480]">{a.type}</span>
                    <span
                      className="text-[13px] font-medium tabular-nums"
                      style={on ? { color: NAVY } : undefined}
                    >
                      {eur(a.pension)}
                    </span>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Board>
  );
}

/* ------------------------------------------------- AI · icon in the tab --- */

const ICON_STEPS: Bilingual<string>[] = [
  { en: "Rest", es: "Reposo" },
  { en: "Working", es: "Trabajando" },
  { en: "Change arrives", es: "Llega el cambio" },
  { en: "Simulation", es: "Simulación" },
  { en: "Applied", es: "Aplicado" },
];

function TabIcon({ step, Icon }: { step: number; Icon: LucideIcon }) {
  const filled = step === 4;
  const outlined = step === 2 || step === 3;
  return (
    <span className="relative inline-flex size-10 items-center justify-center">
      {step === 1 && (
        <motion.span
          className="absolute inset-0 rounded-[10px]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0 55%, #7C6EF0 75%, ${AFI} 100%)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
        />
      )}
      <span
        className="absolute inset-0 rounded-[10px] transition-all duration-500"
        style={{
          background: filled ? AI_GRADIENT : outlined ? AI_GRADIENT : "#eef0f2",
          padding: outlined ? 2 : 0,
        }}
      />
      <span
        className="absolute rounded-[8px] bg-white transition-all duration-500"
        style={{
          inset: filled ? 40 : outlined ? 2 : step === 1 ? 2 : 0,
          opacity: filled ? 0 : 1,
        }}
      />
      <Icon
        aria-hidden="true"
        className="relative size-[18px] transition-colors duration-500"
        style={{ color: filled ? "#fff" : step >= 2 ? "#5b52d6" : "#4f5761" }}
      />
    </span>
  );
}

/** The icon in the plan's tab, through every state: rest, working, change, simulation, applied. */
function ArtIconFlow() {
  const { lang } = useLang();
  const { ref, i } = useTicker(1400, 5);
  const changed = i >= 2;
  return (
    <Board className="flex flex-col gap-4">
      <div ref={ref} className="grid grid-cols-3 gap-2">
        {[
          {
            name: "Patrimonio y legado",
            Icon: Landmark,
            before: "3,6 M €",
            after: "3,55 M €",
            ai: true,
          },
          {
            name: "Liquidez",
            Icon: Droplets,
            before: "3 años de déficit",
            after: "Sin déficit",
            ai: true,
          },
          {
            name: "Rentabilidad",
            Icon: Percent,
            before: "4,6 %",
            after: "4,6 %",
            ai: false,
          },
        ].map((t) => (
          <Card key={t.name} className="flex items-center gap-3 px-3 py-3">
            <TabIcon step={t.ai ? i : 0} Icon={t.Icon} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[12px] text-[#6b7480]">
                {t.name}
              </span>
              <motion.span
                key={changed && t.ai ? "a" : "b"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="truncate text-[15px] font-semibold"
                style={
                  changed && t.ai && i < 4 ? { color: "#5b52d6" } : undefined
                }
              >
                {changed && t.ai ? t.after : t.before}
              </motion.span>
            </span>
          </Card>
        ))}
      </div>
      <ol className="flex flex-wrap justify-center gap-1.5">
        {ICON_STEPS.map((s, k) => (
          <li
            key={k}
            className={`rounded-full px-3 py-1 text-[12px] transition-colors ${k === i ? "bg-white font-semibold shadow-sm" : "text-[#6b7480]"}`}
          >
            {k + 1} · {pick(s, lang)}
          </li>
        ))}
      </ol>
    </Board>
  );
}

/* ------------------------------------------------- AI · toast on apply --- */

/** The toast when a simulation is applied: a sweep of light, the spinner becomes a check. */
function ArtToast() {
  const { ref, i } = useTicker(2600, 2);
  const done = i === 1;
  return (
    <Board className="flex min-h-[220px] items-center justify-center">
      <div ref={ref}>
        <Card className="relative flex items-center gap-4 overflow-hidden rounded-full py-3 pr-3 pl-4 shadow-[0_10px_30px_rgba(0,0,0,.12)]">
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute inset-y-0 w-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,110,240,.28), rgba(0,124,188,.22), transparent)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "260%" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <span
            className="relative inline-flex size-8 items-center justify-center rounded-full"
            style={{ background: done ? AI_GRADIENT : "#eef0f2" }}
          >
            {done ? (
              <motion.span
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                className="text-[15px] text-white"
              >
                ✓
              </motion.span>
            ) : (
              <motion.span
                className="size-4 rounded-full border-2 border-[#c7cdd3] border-t-[#5b52d6]"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
            )}
          </span>
          <motion.span
            key={done ? "d" : "w"}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="relative flex flex-col"
          >
            <span className="text-[15px] font-semibold">
              {done ? "Cambios aplicados al plan" : "Aplicando la simulación…"}
            </span>
            <span className="text-[12px] text-[#6b7480]">
              {done
                ? "Legado medio 3,65 M € · sin déficit"
                : "Venta de la casa de Sotogrande"}
            </span>
          </motion.span>
          <span className="relative rounded-full bg-[#f1f3f5] px-3 py-1.5 text-[12px] font-medium">
            Ver
          </span>
        </Card>
      </div>
    </Board>
  );
}

const ARTBOARDS: Record<string, () => ReactNode> = {
  "wp-map": () => <ArtMap />,
  "wp-follows": () => <ArtFollows />,
  "wp-ages": () => <ArtAges />,
  "wp-ai-icon": () => <ArtIconFlow />,
  "wp-ai-toast": () => <ArtToast />,
};

export function Artboard({ name }: { name: string }) {
  const render = ARTBOARDS[name];
  return render ? <>{render()}</> : null;
}
