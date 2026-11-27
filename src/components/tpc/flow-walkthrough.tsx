"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DURATION, EASE, EASE_CLOSE, EASE_IN_OUT } from "@/lib/motion";
import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ data */

type Lane = "admin" | "supplier" | "review";

export type FlowStep = {
  id: string;
  lane: Lane;
  title: Bilingual<string>;
  caption: Bilingual<string>;
};

const LANES: Record<Lane, Bilingual<string>> = {
  admin: { en: "Afi admin", es: "Administración Afi" },
  supplier: { en: "Supplier", es: "Proveedor" },
  review: { en: "Afi review", es: "Revisión Afi" },
};
const LANE_ROW: Record<Lane, number> = { admin: 1, supplier: 2, review: 3 };

/**
 * Placeholder copy in the shape copy.ts will export as FLOW_STEPS. The beats
 * play in this order; "review-again" lands on the same node as "review".
 */
export const FLOW_STEPS_DRAFT: FlowStep[] = [
  {
    id: "publish",
    lane: "admin",
    title: { en: "Publish a template", es: "Publicar una plantilla" },
    caption: {
      en: "Afi publishes the questionnaire. Only published templates can be sent, so nobody gets a draft.",
      es: "Afi publica el cuestionario. Solo se envían plantillas publicadas, así nadie recibe un borrador.",
    },
  },
  {
    id: "assign",
    lane: "admin",
    title: { en: "New assignment", es: "Nueva asignación" },
    caption: {
      en: "From the overview, pick the supplier, the template and a due date. A new supplier can be created right there.",
      es: "Desde el panel se elige proveedor, plantilla y fecha límite. Un proveedor nuevo se crea en el mismo sitio.",
    },
  },
  {
    id: "send",
    lane: "admin",
    title: { en: "Send to contacts", es: "Enviar a los contactos" },
    caption: {
      en: "It goes to the supplier's authorised contacts, the people allowed to answer for the company.",
      es: "Llega a los contactos autorizados del proveedor, quienes pueden responder por la empresa.",
    },
  },
  {
    id: "signin",
    lane: "supplier",
    title: { en: "Sign in with a code", es: "Entrar con un código" },
    caption: {
      en: "The contact opens the email and enters a one-time code. No account, no password to forget.",
      es: "El contacto abre el correo e introduce un código de un solo uso. Sin cuenta ni contraseña.",
    },
  },
  {
    id: "answer",
    lane: "supplier",
    title: { en: "Answer or save", es: "Responder o guardar" },
    caption: {
      en: "They answer page by page and can save and come back. Follow-up questions appear only when they apply.",
      es: "Responde página a página y puede guardar y volver. Las preguntas de seguimiento solo salen cuando aplican.",
    },
  },
  {
    id: "check",
    lane: "supplier",
    title: { en: "Check and send", es: "Revisar y enviar" },
    caption: {
      en: "A summary shows every answer before sending, so nothing goes out by mistake.",
      es: "Un resumen muestra todas las respuestas antes de enviar, para que nada salga por error.",
    },
  },
  {
    id: "review",
    lane: "review",
    title: { en: "Review each answer", es: "Revisar cada respuesta" },
    caption: {
      en: "Afi decides answer by answer. The approve and return buttons say what is still undecided.",
      es: "Afi decide respuesta a respuesta. Los botones de aprobar y devolver dicen qué queda por decidir.",
    },
  },
  {
    id: "return",
    lane: "review",
    title: { en: "Return with comments", es: "Devolver con comentarios" },
    caption: {
      en: "If anything needs more information, it goes back with a comment on that answer.",
      es: "Si algo necesita más información, vuelve con un comentario en esa respuesta.",
    },
  },
  {
    id: "correct",
    lane: "supplier",
    title: { en: "Correct and resend", es: "Corregir y reenviar" },
    caption: {
      en: "The supplier sees only what was returned, fixes it and sends again.",
      es: "El proveedor ve solo lo devuelto, lo corrige y lo vuelve a enviar.",
    },
  },
  {
    id: "review-again",
    lane: "review",
    title: { en: "Review again", es: "Revisar de nuevo" },
    caption: {
      en: "Back in review. The loop runs until every answer is compliant.",
      es: "De vuelta a revisión. El ciclo sigue hasta que todas las respuestas cumplen.",
    },
  },
  {
    id: "approve",
    lane: "review",
    title: { en: "Approve", es: "Aprobar" },
    caption: {
      en: "All compliant: the supplier is approved and every step stays on record.",
      es: "Todo cumple: el proveedor queda aprobado y cada paso queda registrado.",
    },
  },
];

/** Where each node sits: column across, lane down. Beats that revisit a node point at it. */
type Node = { id: string; col: number; lane: Lane };
const NODES: Node[] = [
  { id: "publish", col: 1, lane: "admin" },
  { id: "assign", col: 2, lane: "admin" },
  { id: "send", col: 3, lane: "admin" },
  { id: "signin", col: 4, lane: "supplier" },
  { id: "answer", col: 5, lane: "supplier" },
  { id: "check", col: 6, lane: "supplier" },
  { id: "review", col: 7, lane: "review" },
  { id: "return", col: 8, lane: "review" },
  { id: "correct", col: 8, lane: "supplier" },
  { id: "approve", col: 9, lane: "review" },
];
const NODE_OF: Record<string, string> = { "review-again": "review" };
const nodeFor = (stepId: string) => NODE_OF[stepId] ?? stepId;

/** Time on each beat, and the hold on the last one before it loops. */
const DWELL_MS = 3400;
const END_HOLD_MS = 2600;

/* ------------------------------------------------------------ component */

export function FlowWalkthrough({
  steps = FLOW_STEPS_DRAFT,
}: {
  steps?: FlowStep[];
}) {
  const { lang } = useLang();
  const reduced = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);

  // Play only while on screen, and never against the reader's choice.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaying(inView && !userPaused && !reduced);
  }, [inView, userPaused, reduced]);

  useEffect(() => {
    if (!playing) return;
    const last = beat === steps.length - 1;
    const id = window.setTimeout(
      () => setBeat((b) => (b + 1) % steps.length),
      last ? DWELL_MS + END_HOLD_MS : DWELL_MS
    );
    return () => window.clearTimeout(id);
  }, [playing, beat, steps.length]);

  const toggle = () => setUserPaused((p) => !p);
  const replay = () => {
    setBeat(0);
    setUserPaused(false);
  };
  const jump = (i: number) => {
    setBeat(i);
    setUserPaused(true);
  };

  const step = steps[beat];
  const visited = new Set(steps.slice(0, beat + 1).map((s) => nodeFor(s.id)));
  const edges = edgesUpTo(steps, beat);

  return (
    <div
      ref={rootRef}
      className="border-border/60 bg-card overflow-hidden rounded-xl border"
      role="group"
      aria-roledescription={
        lang === "es" ? "recorrido animado" : "animated walkthrough"
      }
      aria-label={lang === "es" ? "El ciclo completo" : "The whole loop"}
    >
      {/* Header: where we are, and the controls */}
      <div className="border-border/60 flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <span className="text-muted-foreground font-mono text-xs tabular-nums">
          {String(beat + 1).padStart(2, "0")} /{" "}
          {String(steps.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            aria-pressed={!playing}
          >
            {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
            {playing
              ? lang === "es"
                ? "Pausa"
                : "Pause"
              : lang === "es"
                ? "Reproducir"
                : "Play"}
          </Button>
          <Button variant="ghost" size="sm" onClick={replay}>
            <RotateCcw aria-hidden />
            {lang === "es" ? "Repetir" : "Replay"}
          </Button>
        </div>
      </div>

      {/* Desktop: swimlanes, steps travelling left to right */}
      <Board
        steps={steps}
        beat={beat}
        visited={visited}
        edges={edges}
        reduced={reduced}
        className="hidden lg:block"
      />

      {/* Phone: the same beats as a vertical stepper */}
      <ol className="flex flex-col gap-1 px-4 pt-4 lg:hidden">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => jump(i)}
              className={cn(
                "ease-out-soft flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors duration-[var(--duration-base)]",
                i === beat
                  ? "bg-foreground text-background"
                  : i < beat
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}
            >
              <span className="w-16 shrink-0 font-mono text-[10px] uppercase opacity-70">
                {pick(LANES[s.lane], lang)}
              </span>
              {pick(s.title, lang)}
            </button>
          </li>
        ))}
      </ol>

      {/* Caption: what is happening on this beat */}
      <div className="flex flex-col gap-4 px-4 pt-4 pb-4 sm:px-6">
        <div className="min-h-[5.5rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.id}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: DURATION.base, ease: EASE },
              }}
              exit={{
                opacity: 0,
                y: -4,
                transition: { duration: DURATION.enter, ease: EASE_CLOSE },
              }}
              className="flex flex-col gap-1.5"
            >
              <span className="text-muted-foreground font-mono text-[11px] tracking-wide uppercase">
                {pick(LANES[step.lane], lang)}
              </span>
              <p className="text-base font-semibold">
                {pick(step.title, lang)}
              </p>
              <p className="text-foreground max-w-prose text-sm leading-relaxed sm:text-base">
                {pick(step.caption, lang)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress: one segment per beat, each one jumps there */}
        <div
          className="flex gap-1"
          role="tablist"
          aria-label={lang === "es" ? "Pasos" : "Steps"}
        >
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === beat}
              aria-label={pick(s.title, lang)}
              onClick={() => jump(i)}
              className="group flex h-6 flex-1 items-center"
            >
              <span className="bg-border relative block h-1 w-full overflow-hidden rounded-full">
                {i < beat && (
                  <span className="bg-foreground/50 absolute inset-0 rounded-full" />
                )}
                {i === beat && (
                  // The current segment fills over its dwell, so the bar doubles
                  // as a timer; paused, it shows full.
                  <motion.span
                    key={`${beat}-${playing}`}
                    className="bg-foreground absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: playing ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: playing
                        ? (beat === steps.length - 1
                            ? DWELL_MS + END_HOLD_MS
                            : DWELL_MS) / 1000
                        : 0,
                      ease: "linear",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- the board */

type Edge = { from: string; to: string; key: string };

/** Every transition walked so far, in order; the last one is the one drawing now. */
function edgesUpTo(steps: FlowStep[], beat: number): Edge[] {
  const out: Edge[] = [];
  for (let i = 1; i <= beat; i++) {
    const from = nodeFor(steps[i - 1].id);
    const to = nodeFor(steps[i].id);
    out.push({ from, to, key: `${from}-${to}` });
  }
  return out;
}

/** All connections the loop can take, drawn faintly so the map is visible up front. */
const ALL_EDGES: Edge[] = [
  ["publish", "assign"],
  ["assign", "send"],
  ["send", "signin"],
  ["signin", "answer"],
  ["answer", "check"],
  ["check", "review"],
  ["review", "return"],
  ["return", "correct"],
  ["correct", "review"],
  ["review", "approve"],
].map(([from, to]) => ({ from, to, key: `${from}-${to}` }));

type Rect = { x: number; y: number; w: number; h: number };

function Board({
  steps,
  beat,
  visited,
  edges,
  reduced,
  className,
}: {
  steps: FlowStep[];
  beat: number;
  visited: Set<string>;
  edges: Edge[];
  reduced: boolean;
  className?: string;
}) {
  const { lang } = useLang();
  const gridRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const g = grid.getBoundingClientRect();
    const next: Record<string, Rect> = {};
    for (const n of NODES) {
      const el = nodeRefs.current[n.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next[n.id] = {
        x: r.left - g.left,
        y: r.top - g.top,
        w: r.width,
        h: r.height,
      };
    }
    setRects(next);
    setSize({ w: g.width, h: g.height });
  }, []);

  // ResizeObserver reports once on observe, which is the first measure.
  useLayoutEffect(() => {
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const current = nodeFor(steps[beat].id);
  const walked = new Set(edges.map((e) => e.key));
  const drawing = edges[edges.length - 1]?.key;

  return (
    <div
      className={cn(
        "bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] px-4 py-6",
        className
      )}
    >
      <div
        ref={gridRef}
        className="relative grid grid-cols-[5.5rem_repeat(9,minmax(0,1fr))] grid-rows-3 gap-x-3 gap-y-5"
      >
        {/* Lane labels and bands */}
        {(Object.keys(LANES) as Lane[]).map((lane) => (
          <div
            key={lane}
            className="text-muted-foreground border-border/60 col-span-full col-start-1 flex items-center border-t border-dashed pt-0 font-mono text-[10px] tracking-wide uppercase first:border-t-0"
            style={{ gridRow: LANE_ROW[lane] }}
          >
            {pick(LANES[lane], lang)}
          </div>
        ))}

        {/* Connections */}
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={size.w}
          height={size.h}
          aria-hidden
        >
          {ALL_EDGES.map((e) => {
            const a = rects[e.from];
            const b = rects[e.to];
            if (!a || !b) return null;
            const d = pathBetween(a, b);
            const isWalked = walked.has(e.key);
            const isDrawing = e.key === drawing;
            return (
              <g key={e.key}>
                <path
                  d={d}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth={1}
                  strokeDasharray="3 4"
                />
                {isWalked && (
                  <motion.path
                    // Re-mount on every draw so a revisited edge draws again.
                    key={isDrawing ? `${e.key}-${beat}` : e.key}
                    d={d}
                    fill="none"
                    stroke="var(--foreground)"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    initial={
                      isDrawing && !reduced
                        ? { pathLength: 0, opacity: 1 }
                        : false
                    }
                    animate={{ pathLength: 1, opacity: isDrawing ? 1 : 0.35 }}
                    transition={{
                      pathLength: {
                        duration: DURATION.move,
                        ease: EASE_IN_OUT,
                      },
                      opacity: { duration: DURATION.base, ease: EASE },
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Steps */}
        {NODES.map((n) => {
          const isCurrent = n.id === current;
          const isVisited = visited.has(n.id);
          const label = steps.find((s) => nodeFor(s.id) === n.id)?.title;
          return (
            <div
              key={n.id}
              ref={(el) => {
                nodeRefs.current[n.id] = el;
              }}
              className={cn(
                "relative z-10 flex min-h-12 items-center justify-center rounded-lg border px-2 py-2 text-center text-xs leading-snug",
                "ease-out-soft transition-[background-color,color,border-color,box-shadow] duration-[var(--duration-base)]",
                isCurrent
                  ? "bg-foreground text-background border-foreground shadow-md"
                  : isVisited
                    ? "bg-card text-foreground border-border"
                    : "bg-card text-muted-foreground border-border/60"
              )}
              style={{ gridColumn: n.col + 1, gridRow: LANE_ROW[n.lane] }}
            >
              {label ? pick(label, lang) : n.id}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** A soft S-curve between two boxes, leaving from the side that faces the other. */
function pathBetween(a: Rect, b: Rect): string {
  const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
  const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const dx = bc.x - ac.x;
  const dy = bc.y - ac.y;
  if (Math.abs(dx) >= Math.abs(dy) * 0.6 && Math.abs(dx) > 4) {
    const s = { x: dx > 0 ? a.x + a.w : a.x, y: ac.y };
    const t = { x: dx > 0 ? b.x : b.x + b.w, y: bc.y };
    const k = Math.max(16, Math.abs(t.x - s.x) / 2);
    const dir = dx > 0 ? 1 : -1;
    return `M${s.x},${s.y} C${s.x + k * dir},${s.y} ${t.x - k * dir},${t.y} ${t.x},${t.y}`;
  }
  const s = { x: ac.x, y: dy > 0 ? a.y + a.h : a.y };
  const t = { x: bc.x, y: dy > 0 ? b.y : b.y + b.h };
  const k = Math.max(10, Math.abs(t.y - s.y) / 2);
  const dir = dy > 0 ? 1 : -1;
  return `M${s.x},${s.y} C${s.x},${s.y + k * dir} ${t.x},${t.y - k * dir} ${t.x},${t.y}`;
}
