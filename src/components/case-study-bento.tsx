"use client";

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { useEffect, useRef, useState, type JSX } from "react";
import { ArrowRight, Maximize2, X } from "lucide-react";
import { useTheme } from "next-themes";

import {
  ComponentsDemoFigure,
  MicroInteractionsDemoFigure,
  MoodboardGalleryFigure,
  TypeTestFigure,
} from "@/components/motion/figures/visual-identity";
import type { BentoCard } from "@/lib/content/case-studies";
import { useIsMobile } from "@/lib/hooks";
import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const EASE_SOFT = [0.32, 0.72, 0.18, 1] as const;
// The other two named easing curves from globals.css, bridged into Motion's array
// form the same way EASE/EASE_SOFT above already bridge --ease-out-soft.
// vi-nine-principles (travel, its one confirm-pulse) and vi-defining-modern
// (bar tweens, the guideline's confirm snap) are the only two using these so far.
const EASE_IN_OUT_SOFT = [0.45, 0.05, 0.15, 1] as const;
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 22,
};
const SPRING_SNAP: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

/**
 * The three tiers, named the way the color methodology names them.
 *
 * Straight off that page's own worked example: a primitive is "a raw value given a
 * name and a slot in a scale (primary-800)", the semantic layer binds it to a role,
 * and "primary + primary-foreground become the default button". So the chain the
 * card draws is the chain the blog describes.
 *
 * It used to read blue/500 → --color-primary → Button, which got both conventions
 * wrong: the methodology writes steps with a hyphen (primary-800, blue-500), never a
 * slash, and it never names a role as a CSS custom property. The primary ramp isn't
 * blue either — in semantic-light.json `primary` resolves to {color.primary.800}.
 */
const TOKEN_CHAIN = [
  { label: "primary-800", sub: "primitive" },
  { label: "primary", sub: "semantic" },
  { label: "Button", sub: "component" },
];

type AnimationProps = { active: boolean };

function LayersAnimation({ active }: AnimationProps) {
  // -1 = reset (rows dim, connector not drawn); 0..2 = row highlighted.
  // Idle state (active=false) shows a fully-drawn, fully-visible frame.
  const [step, setStep] = useState<number>(2);
  const [connectorDrawn, setConnectorDrawn] = useState(true);

  useEffect(() => {
    if (!active) {
      setStep(2);
      setConnectorDrawn(true);
      return;
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        // Reset: dim rows, erase connector.
        setStep(-1);
        setConnectorDrawn(false);
        await new Promise((r) => setTimeout(r, 450));
        if (cancelled) return;
        // Draw connector.
        setConnectorDrawn(true);
        await new Promise((r) => setTimeout(r, 500));
        // Highlight rows in sequence.
        for (let i = 0; i < TOKEN_CHAIN.length; i++) {
          if (cancelled) return;
          setStep(i);
          await new Promise((r) => setTimeout(r, i === 2 ? 900 : 700));
        }
        // Pause before loop.
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="border-border/40 bg-card/50 relative w-full rounded-lg border p-3">
      <div className="relative flex flex-col">
        {TOKEN_CHAIN.map((token, i) => {
          const isActive = step === i;
          const isVisible = step === -1 ? false : step >= i;
          const isButton = i === 2;
          const showConnector = i < TOKEN_CHAIN.length - 1;

          return (
            <div key={token.label} className="flex flex-col">
              <motion.div
                className="relative grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md px-1.5 py-1"
                animate={{
                  opacity: isVisible ? 1 : 0.3,
                  backgroundColor: isActive
                    ? "hsl(var(--muted) / 0.4)"
                    : "hsl(var(--muted) / 0)",
                }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {isButton ? (
                  // Decorative button mock, not interactive — a <span> so it can
                  // legally render inside the bento card, which is itself a <button>.
                  <motion.span
                    className="bg-primary text-primary-foreground inline-block rounded-md px-2 py-1 font-mono text-[10px] font-medium"
                    animate={{ scale: isActive ? 1.06 : 1 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {token.label}
                  </motion.span>
                ) : (
                  <>
                    <div className="flex h-5 w-5 items-center justify-center">
                      <motion.div
                        className={
                          i === 0
                            ? "bg-primary h-4 w-4 shrink-0 rounded-full"
                            : "bg-primary h-3 w-3 shrink-0 rounded-sm"
                        }
                        animate={{ scale: isActive ? 1.2 : 1 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      />
                    </div>
                    <span className="text-foreground font-mono text-[10px]">
                      {token.label}
                    </span>
                  </>
                )}
                {isButton && <span />}
                <span className="text-muted-foreground font-mono text-[8px] tracking-wider uppercase">
                  {token.sub}
                </span>
              </motion.div>
              {showConnector && (
                <div className="flex h-2 items-center pl-[0.875rem]">
                  <motion.div
                    className="bg-border h-full w-px origin-top"
                    initial={false}
                    animate={{ scaleY: connectorDrawn ? 1 : 0 }}
                    transition={{
                      duration: 0.3,
                      delay: connectorDrawn ? i * 0.15 : 0,
                      ease: EASE,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type CommentPinsPhase = "idle" | "pinning" | "resolving" | "collapsed";

const COMMENT_PINS = [
  { pinX: "20%", pinY: "22%", chipLabel: "..." },
  { pinX: "50%", pinY: "55%", chipLabel: "..." },
  { pinX: "75%", pinY: "72%", chipLabel: "..." },
] as const;

function CommentPinsAnimation({ active }: AnimationProps) {
  const [phase, setPhase] = useState<CommentPinsPhase>("collapsed");
  const [visiblePins, setVisiblePins] = useState(3);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setPhase("collapsed");
        setVisiblePins(3);
        setResolved(true);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        // idle — canvas visible, no pins
        setPhase("idle");
        setVisiblePins(0);
        setResolved(false);
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;

        // pinning — pins fade in one by one
        setPhase("pinning");
        for (let i = 1; i <= COMMENT_PINS.length; i++) {
          if (cancelled) return;
          setVisiblePins(i);
          await new Promise((r) => setTimeout(r, 250));
        }
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) return;

        // resolving — numerals become checkmarks, chips fade
        setPhase("resolving");
        setResolved(true);
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) return;

        // collapsed — pins fade out, resolved pill appears
        setPhase("collapsed");
        setVisiblePins(3);
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) return;

        // reset for next loop
        setPhase("idle");
        setVisiblePins(0);
        setResolved(false);
        await new Promise((r) => setTimeout(r, 200));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const showPins = phase === "pinning" || phase === "resolving";
  const showCollapsed = phase === "collapsed";

  return (
    <div className="flex w-full flex-col items-center gap-3 px-2">
      {/* Canvas with abstract UI shapes */}
      <div className="border-border/40 bg-card/50 relative w-full rounded-lg border p-3">
        {/* Abstract shape 1: button-like rounded rect */}
        <div className="bg-primary absolute top-[18%] left-[12%] h-3 w-9 rounded-md" />
        {/* Abstract shape 2: label rule */}
        <div className="bg-muted absolute top-[50%] left-[20%] h-0.5 w-12 rounded-full" />
        {/* Abstract shape 3: icon square */}
        <div className="bg-foreground/20 absolute right-[14%] bottom-[18%] h-2.5 w-2.5 rounded-sm" />

        {/* Spacer to give the canvas height */}
        <div className="h-14" />

        {/* Comment pins */}
        {COMMENT_PINS.map((pin, i) => {
          const visible = showPins && i < visiblePins;
          return (
            <motion.div
              key={i}
              className="pointer-events-none absolute flex items-center gap-1"
              style={{ left: pin.pinX, top: pin.pinY }}
              initial={false}
              animate={{
                opacity: visible ? 1 : 0,
                scale: visible ? 1 : 0.5,
              }}
              transition={{
                duration: 0.25,
                delay: visible ? i * 0.05 : 0,
                ease: EASE,
              }}
            >
              {/* Pin circle */}
              <div className="bg-primary text-primary-foreground ring-background flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full font-mono text-[7px] font-bold ring-1">
                {resolved ? "✓" : String(i + 1)}
              </div>
              {/* Connector line */}
              <div className="bg-border/40 h-px w-4" />
              {/* Comment chip */}
              <motion.div
                className="border-border/40 bg-muted rounded-sm border px-1 font-mono text-[7px] text-transparent"
                animate={{ opacity: resolved ? 0 : 0.7 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {pin.chipLabel}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Resolved pill */}
      <motion.div
        className="bg-foreground/10 text-muted-foreground rounded-full px-3 py-0.5 font-mono text-[9px] tracking-wider uppercase"
        animate={{ opacity: showCollapsed ? 1 : 0, y: showCollapsed ? 0 : 4 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        ✓ resolved
      </motion.div>
    </div>
  );
}

type NodeAnchor = "start" | "middle" | "end";
const OUTER_NODES: {
  id: number;
  sx: number;
  sy: number;
  label: string;
  lx: number;
  ly: number;
  anchor: NodeAnchor;
}[] = [
  // Every label clears its circle by ≥2px in the scattered phase. The side labels
  // (dev, .svg) used to sit BESIDE their circles at the same y, and the r=4 circle
  // landed on the text when the nodes flew out; they live above their circles now,
  // like the top row's.
  { id: 0, sx: 18, sy: 14, label: ".md", lx: 18, ly: 5, anchor: "middle" },
  { id: 1, sx: 102, sy: 14, label: "design", lx: 102, ly: 4, anchor: "middle" },
  { id: 2, sx: 118, sy: 48, label: ".svg", lx: 118, ly: 38, anchor: "middle" },
  { id: 3, sx: 95, sy: 82, label: "ai", lx: 95, ly: 92, anchor: "middle" },
  { id: 4, sx: 22, sy: 80, label: ".tokens", lx: 22, ly: 92, anchor: "middle" },
  { id: 5, sx: 8, sy: 46, label: "dev", lx: 8, ly: 36, anchor: "middle" },
];
const HUB = { x: 63, y: 48 };

function NodesAnimation({ active }: AnimationProps) {
  const [phase, setPhase] = useState<"scattered" | "connecting" | "unified">(
    "unified"
  );

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setPhase("unified"), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) break;
        setPhase("connecting");
        await new Promise((r) => setTimeout(r, 900));
        if (cancelled) break;
        setPhase("unified");
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) break;
        setPhase("scattered");
        await new Promise((r) => setTimeout(r, 400));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    /* Capped: the viewBox is square-ish, so an uncapped w-full made the figure as
       tall as the card was wide — a wide card turned it into a 1000px hub. */
    <svg viewBox="0 0 130 110" className="w-full max-w-[280px]" aria-hidden>
      {OUTER_NODES.map((n) => (
        <motion.line
          key={`line-${n.id}`}
          x1={phase === "scattered" ? n.sx : HUB.x}
          y1={phase === "scattered" ? n.sy : HUB.y}
          x2={HUB.x}
          y2={HUB.y}
          stroke="currentColor"
          strokeWidth="1"
          animate={{
            opacity:
              phase === "scattered" ? 0 : phase === "connecting" ? 0.5 : 0.25,
          }}
          transition={{ duration: 0.5, delay: n.id * 0.07, ease: EASE }}
        />
      ))}

      {OUTER_NODES.map((n) => (
        <motion.circle
          key={`node-${n.id}`}
          r={4}
          fill="currentColor"
          animate={{
            cx:
              phase === "unified"
                ? HUB.x + (n.sx - HUB.x) * 0.15
                : phase === "connecting"
                  ? HUB.x + (n.sx - HUB.x) * 0.5
                  : n.sx,
            cy:
              phase === "unified"
                ? HUB.y + (n.sy - HUB.y) * 0.15
                : phase === "connecting"
                  ? HUB.y + (n.sy - HUB.y) * 0.5
                  : n.sy,
            opacity: phase === "unified" ? 0 : 0.55,
            scale: phase === "connecting" ? 0.8 : 1,
          }}
          transition={{ duration: 0.7, delay: n.id * 0.06, ease: EASE }}
        />
      ))}

      {OUTER_NODES.map((n) => (
        <motion.text
          key={`label-${n.id}`}
          x={n.lx}
          y={n.ly}
          textAnchor={n.anchor}
          dominantBaseline="middle"
          className="fill-muted-foreground font-mono"
          style={{ fontSize: 6, letterSpacing: 0.4 }}
          animate={{ opacity: phase === "unified" ? 0 : 0.85 }}
          transition={{ duration: 0.5, delay: n.id * 0.05, ease: EASE }}
        >
          {n.label}
        </motion.text>
      ))}

      <motion.circle
        cx={HUB.x}
        cy={HUB.y}
        fill="currentColor"
        animate={{
          r: phase === "unified" ? 8 : phase === "connecting" ? 6 : 4,
          opacity:
            phase === "scattered" ? 0.3 : phase === "connecting" ? 0.7 : 1,
        }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      <motion.circle
        cx={HUB.x}
        cy={HUB.y}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        animate={{
          r: phase === "unified" ? 14 : 0,
          opacity: phase === "unified" ? 0.25 : 0,
        }}
        transition={{ duration: 0.5, ease: EASE }}
      />

      <motion.text
        x={HUB.x}
        y={HUB.y + 22}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-muted-foreground font-mono"
        style={{ fontSize: 6, letterSpacing: 0.4 }}
        animate={{ opacity: phase === "unified" ? 0.85 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        platform
      </motion.text>
    </svg>
  );
}

// Each cell: { col-span, row-span, tone }
// tone: 0 = bg-muted, 1 = bg-foreground/10, 2 = bg-primary/20, 3 = bg-foreground/20
type MoodCell = { cs: number; rs: number; tone: 0 | 1 | 2 | 3 };
const MOODBOARD_COMPOSITIONS: MoodCell[][] = [
  [
    { cs: 2, rs: 2, tone: 2 },
    { cs: 2, rs: 1, tone: 0 },
    { cs: 1, rs: 1, tone: 3 },
    { cs: 1, rs: 1, tone: 1 },
    { cs: 2, rs: 1, tone: 0 },
  ],
  [
    { cs: 1, rs: 2, tone: 3 },
    { cs: 3, rs: 1, tone: 2 },
    { cs: 2, rs: 1, tone: 0 },
    { cs: 1, rs: 1, tone: 1 },
    { cs: 1, rs: 1, tone: 0 },
    { cs: 3, rs: 1, tone: 1 },
  ],
  [
    { cs: 2, rs: 1, tone: 1 },
    { cs: 2, rs: 2, tone: 2 },
    { cs: 2, rs: 1, tone: 3 },
    { cs: 1, rs: 1, tone: 0 },
    { cs: 1, rs: 1, tone: 0 },
  ],
];

const TONE_CLASSES = [
  "bg-muted",
  "bg-foreground/10",
  "bg-primary/20",
  "bg-foreground/20",
] as const;

function MoodboardAnimation({ active }: AnimationProps) {
  const [comp, setComp] = useState(0);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setComp(0), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1800));
        if (!cancelled) setComp((p) => (p + 1) % MOODBOARD_COMPOSITIONS.length);
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const cells = MOODBOARD_COMPOSITIONS[comp];

  return (
    <div className="w-full px-2">
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "22px",
        }}
      >
        <AnimatePresence mode="popLayout">
          {cells.map((cell, i) => (
            <motion.div
              key={`${comp}-${i}`}
              className={`${TONE_CLASSES[cell.tone]} rounded-sm`}
              style={{
                gridColumn: `span ${cell.cs}`,
                gridRow: `span ${cell.rs}`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: EASE_SOFT }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CodeToSiteAnimation({ active }: AnimationProps) {
  const [phase, setPhase] = useState<"code" | "site">("site");

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setPhase("site"), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) break;
        setPhase("site");
        await new Promise((r) => setTimeout(r, 1800));
        if (cancelled) break;
        setPhase("code");
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  // Code editor view: dark bg, syntax-colored bars with indent
  // Site preview: light bg, browser chrome, content
  return (
    <div className="relative w-full px-3">
      <AnimatePresence mode="wait">
        {phase === "code" ? (
          <motion.div
            key="code"
            className="bg-foreground/90 overflow-hidden rounded-md"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            <div className="border-background/10 flex items-center gap-1 border-b px-2 py-1">
              <div className="bg-background/20 h-1.5 w-1.5 rounded-full" />
              <div className="bg-background/30 h-1.5 w-1.5 rounded-full" />
              <div className="bg-background/20 h-1.5 w-1.5 rounded-full" />
              <div className="text-background/40 ml-1 font-mono text-[8px]">
                index.tsx
              </div>
            </div>
            <div className="flex flex-col gap-1 p-2.5">
              {[
                {
                  indent: 0,
                  bars: [
                    { w: 24, tone: "primary" },
                    { w: 18, tone: "muted" },
                  ],
                },
                {
                  indent: 1,
                  bars: [
                    { w: 16, tone: "accent" },
                    { w: 30, tone: "soft" },
                  ],
                },
                {
                  indent: 1,
                  bars: [
                    { w: 22, tone: "primary" },
                    { w: 20, tone: "muted" },
                    { w: 14, tone: "accent" },
                  ],
                },
                {
                  indent: 2,
                  bars: [
                    { w: 18, tone: "soft" },
                    { w: 24, tone: "muted" },
                  ],
                },
                { indent: 0, bars: [{ w: 14, tone: "primary" }] },
              ].map((line, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1"
                  style={{ paddingLeft: line.indent * 8 }}
                >
                  {line.bars.map((b, j) => (
                    <motion.div
                      key={j}
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${b.w}%`,
                        backgroundColor:
                          b.tone === "primary"
                            ? "hsl(var(--primary) / 0.9)"
                            : b.tone === "accent"
                              ? "hsl(var(--primary) / 0.5)"
                              : b.tone === "soft"
                                ? "hsl(var(--background) / 0.5)"
                                : "hsl(var(--background) / 0.25)",
                      }}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.05 + j * 0.03,
                        ease: EASE_SOFT,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="site"
            className="bg-background border-border overflow-hidden rounded-md border"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            <div className="border-border flex items-center gap-1 border-b px-2 py-1">
              <div className="bg-muted h-1.5 w-1.5 rounded-full" />
              <div className="bg-muted h-1.5 w-1.5 rounded-full" />
              <div className="bg-muted h-1.5 w-1.5 rounded-full" />
              <div className="bg-muted text-muted-foreground ml-1 rounded px-1.5 font-mono text-[8px]">
                preview
              </div>
            </div>
            <div className="flex flex-col gap-1.5 p-2.5">
              <motion.div
                className="bg-foreground h-2 w-20 rounded-sm"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05, ease: EASE_SOFT }}
              />
              <motion.div
                className="bg-muted h-1.5 w-full rounded-full"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: EASE_SOFT }}
              />
              <motion.div
                className="bg-muted h-1.5 w-4/5 rounded-full"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: EASE_SOFT }}
              />
              <motion.div
                className="bg-primary text-primary-foreground mt-0.5 inline-flex w-fit rounded px-1.5 py-0.5 font-mono text-[8px] font-medium"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: EASE_SOFT }}
              >
                Launch
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PulseAnimation({ active }: AnimationProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setTick((t) => t + 1);
        await new Promise((r) => setTimeout(r, 1800));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      {active &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={`${tick}-${i}`}
            className="border-primary absolute inset-0 rounded-full border"
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 1.6,
              delay: i * 0.35,
              ease: EASE,
            }}
          />
        ))}
      <motion.div
        className="bg-primary relative h-6 w-6 rounded-full"
        animate={
          active
            ? {
                scale: [1, 1.15, 1],
                borderRadius: ["50%", "30%", "50%"],
              }
            : { scale: 1, borderRadius: "50%" }
        }
        transition={
          active
            ? {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : { duration: 0.3, ease: EASE }
        }
      />
    </div>
  );
}

/**
 * Default brand list for the palette animation.
 *
 * Afi's own brand plus the two client brands the MVP actually runs — nothing more.
 *
 * It used to hardcode Santander / BBVA / CaixaBank / Bankinter. Those are real Afi
 * clients, but they were never added to THIS system: the rollout paused when the
 * Modern UI project took priority. On a public page a white-label figure naming them
 * would be claiming work that doesn't exist, so the list stays at what shipped.
 * Anything asserting a client relationship gets checked with Richard first.
 *
 * `visual-identity` reuses this animation and may want a different list, which is
 * why it's a prop with a default rather than a module constant.
 */
const BANKS = [
  { name: "Afi", color: "#004481" },
  { name: "Laboral Kutxa", color: "#D52B1E" },
  { name: "Unicaja", color: "#0F8C4C" },
];

export function PaletteAnimation({
  active: activeProp,
  banks = BANKS,
}: AnimationProps & { banks?: { name: string; color: string }[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!activeProp) {
      const t = setTimeout(() => setActiveIdx(0), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1400));
        if (!cancelled) setActiveIdx((p) => (p + 1) % banks.length);
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
    // `banks.length` and not `banks`: a caller passing an inline array would give a
    // new reference every render and restart the cycle on each one.
  }, [activeProp, banks.length]);

  // Guard the index — a shorter list than the one the cycle started on would read
  // past the end and render undefined.
  const bank = banks[activeIdx % banks.length];

  return (
    <motion.div
      className="flex w-full flex-1 flex-col justify-center gap-1.5 rounded-xl px-3 py-3"
      animate={{ backgroundColor: bank.color + "20" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {banks.map((b, i) => (
        <motion.div
          key={b.name}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2"
          animate={{
            backgroundColor: i === activeIdx ? b.color + "30" : "transparent",
            scale: i === activeIdx ? 1 : 0.97,
            opacity: i === activeIdx ? 1 : 0.45,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          style={
            i === activeIdx
              ? { border: `1px solid ${b.color}55` }
              : { border: "1px solid transparent" }
          }
        >
          <motion.div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: b.color }}
          />
          <span className="text-foreground font-mono text-xs">{b.name}</span>
          {i === activeIdx && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-auto font-mono text-[10px]"
              style={{ color: b.color }}
            >
              active
            </motion.span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

const RULE_CHECKS = [
  {
    label: "Button color",
    wrong: "#ff6b35",
    fix: "--color-primary",
    rule: "colors.md",
  },
  {
    label: "Font size",
    wrong: "font-size: 9",
    fix: "text-xs token",
    rule: "typography.md",
  },
  {
    label: "Corner radius",
    wrong: "border-r: 3px",
    fix: "rounded-md token",
    rule: "components.md",
  },
];

type RulePhase = "wrong" | "fixed";

function RulesAnimation({ active }: AnimationProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [phase, setPhase] = useState<RulePhase>("fixed");

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setActiveIdx(0);
        setPhase("fixed");
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setPhase("wrong");
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) break;
        setPhase("fixed");
        await new Promise((r) => setTimeout(r, 1100));
        if (cancelled) break;
        setActiveIdx((p) => (p + 1) % RULE_CHECKS.length);
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="flex w-full flex-col gap-1.5 px-2 font-mono text-[10px]">
      <div className="flex flex-col gap-1">
        {RULE_CHECKS.map((check, i) => {
          const isActive = i === activeIdx;
          const rowPhase: RulePhase = isActive ? phase : "fixed";
          const isWrong = isActive && rowPhase === "wrong";
          const isFixed = isActive && rowPhase === "fixed";
          const tone = isWrong
            ? "text-destructive"
            : isFixed
              ? "text-primary"
              : "text-muted-foreground";

          return (
            <motion.div
              key={check.label}
              className="relative flex items-center gap-2 overflow-hidden rounded-md border px-2 py-1"
              animate={{
                opacity: isActive ? 1 : 0.35,
                borderColor: isWrong
                  ? "hsl(var(--destructive) / 0.5)"
                  : isActive
                    ? "hsl(var(--primary) / 0.5)"
                    : "hsl(var(--border))",
              }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <motion.span
                animate={{
                  color: isWrong
                    ? "hsl(var(--destructive))"
                    : isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))",
                }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {isWrong ? "⚠" : "✓"}
              </motion.span>
              <span className="text-foreground">{check.label}</span>
              <span className="text-muted-foreground">|</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={rowPhase}
                  className={tone}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.35, ease: EASE_SOFT }}
                >
                  {isWrong ? check.wrong : check.fix}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="text-muted-foreground font-mono text-[9px]">
        rules/ enforcing consistency
      </div>
    </div>
  );
}

type NinePrinciplesPhase = "hidden" | "enter" | "travel" | "cross";

/**
 * Three real research inputs (the Modern UI benchmarks, competitor notes,
 * reference PDFs), one scan pass each. Tilt (degrees) holds for a paper's whole
 * trip — it never straightens. Strokes are relative widths of dense, uneven
 * notes. Hand-set per the brief, not randomized.
 */
const NP_PAPERS = [
  { tilt: -6, strokes: [85, 60, 90, 40] },
  { tilt: 5, strokes: [70, 95, 50] },
  { tilt: -4, strokes: [55, 80, 35, 75] },
] as const;

/**
 * Every chip travels out from the same crossing point, so only the vertical fan
 * changes between rows: up-right for row 1, straight for row 2, down-right for
 * row 3 — the pixel offset a chip starts from before travelling into its slot.
 */
const NP_CHIP_ORIGIN = [
  { x: -30, y: 10 },
  { x: -30, y: 0 },
  { x: -30, y: -10 },
] as const;

const NP_LANE_PERCENT = 37; // input lane width == the beam's `left` — keep in sync
const NP_PAPER_TRAVEL = 36; // px, resting spot in the lane to the beam

// Motion's `transition.duration` takes seconds, not a CSS custom property, so
// these mirror globals.css's --duration-fast/base/slow by value — the same
// bridge EASE/EASE_SOFT above already do for easing.
const NP_FAST = 0.12;
const NP_BASE = 0.2;
const NP_SLOW = 0.32;
const NP_STAGGER = 0.08; // ~80ms between a pass's 3 chips, per the brief

/**
 * "Nine principles" card — research papers scan through a fixed beam and
 * dissolve into findings. Detached from RulesAnimation (above): that one is
 * kt360's "off-brand caught, then fixed" story, this one is "raw research in,
 * nine principles out." Brief at
 * src/components/motion/glyphs/vi-nine-principles.brief.md.
 */
function VINinePrinciplesAnimation({ active }: AnimationProps) {
  const reduced = useReducedMotion();
  const running = active && !reduced;

  const [pass, setPass] = useState(0);
  const [paperPhase, setPaperPhase] = useState<NinePrinciplesPhase>("hidden");
  const [passesLanded, setPassesLanded] = useState([true, true, true]);
  const [resetting, setResetting] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (!running) {
      const t = setTimeout(() => {
        setPass(0);
        setPaperPhase("hidden");
        setPassesLanded([true, true, true]);
        setResetting(false);
        setPulsing(false);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setPassesLanded([false, false, false]);
        setResetting(false);

        for (let p = 0; p < 3; p++) {
          if (cancelled) return;
          setPass(p);
          setPaperPhase("enter");
          await new Promise((r) => setTimeout(r, 200)); // --duration-base

          if (cancelled) return;
          setPaperPhase("travel");
          await new Promise((r) => setTimeout(r, 320)); // --duration-slow

          if (cancelled) return;
          setPaperPhase("cross");
          setPassesLanded((prev) => {
            const next = [...prev];
            next[p] = true;
            return next;
          });
          await new Promise((r) => setTimeout(r, 200)); // paper dissolves, beam holds bright

          if (cancelled) return;
          setPaperPhase("hidden");
          // This pass's last chip lands: 2 staggers (~80ms) + its own travel
          // (320ms), minus the 200ms already waited above for the dissolve.
          await new Promise((r) => setTimeout(r, 280));

          if (cancelled) return;
          if (p === 2) {
            setPulsing(true);
            await new Promise((r) => setTimeout(r, 120)); // --duration-fast
            if (cancelled) return;
            setPulsing(false);
          }

          await new Promise((r) => setTimeout(r, 200)); // beat before the next pass
        }

        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 1100)); // hold, full grid visible

        if (cancelled) return;
        setResetting(true);
        await new Promise((r) => setTimeout(r, 200)); // all 9 chips fade out together
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [running]);

  const crossing = paperPhase === "cross";

  return (
    <div
      className="pointer-events-none mx-auto flex w-full max-w-[140px] items-center justify-center"
      aria-hidden
    >
      <div className="relative aspect-[4/3] w-full">
        {/* The beam — stationary; brightens only while a paper crosses it.
            Color rides a CSS class transition, not Motion's
            `animate.backgroundColor`. This project's tokens are OKLCH, and
            `hsl()` can't wrap another color function, so the
            `"hsl(var(--foreground))"` string other animations in this file
            pass to Motion computes to `transparent` — the beam was invisible.
            Only `opacity` (a plain number) stays on Motion. */}
        <motion.div
          className={`ease-out-soft absolute inset-y-0 w-px transition-colors ${
            running ? "duration-[var(--duration-fast)]" : "duration-0"
          } ${crossing ? "bg-foreground" : "bg-muted-foreground"}`}
          style={{ left: `${NP_LANE_PERCENT}%` }}
          animate={{ opacity: crossing ? 1 : 0.3 }}
          transition={
            running ? { duration: NP_FAST, ease: EASE } : { duration: 0 }
          }
        />

        <div className="flex h-full w-full items-center">
          {/* Input lane — one paper at a time travels here, left to right. */}
          <div
            className="relative h-full shrink-0"
            style={{ width: `${NP_LANE_PERCENT}%` }}
          >
            {paperPhase !== "hidden" && (
              <motion.div
                key={pass}
                // rounded-[2px]: deliberately below the token scale's smallest
                // radius (rounded-xs, 4px) — a raw cut sheet, crisper-cornered
                // than the "finished token" chips it produces. See the brief's
                // Visual vocabulary section.
                className="border-muted-foreground/50 absolute top-1/2 left-1.5 h-4 w-3 -translate-y-1/2 rounded-[2px] border p-px"
                style={{ rotate: NP_PAPERS[pass].tilt }}
                initial={{ opacity: 0, x: -6 }}
                animate={
                  crossing
                    ? { opacity: 0, x: NP_PAPER_TRAVEL, scale: 0.85 }
                    : paperPhase === "travel"
                      ? { opacity: 1, x: NP_PAPER_TRAVEL, scale: 1 }
                      : { opacity: 1, x: 0, scale: 1 }
                }
                transition={
                  crossing
                    ? { duration: NP_BASE, ease: EASE }
                    : paperPhase === "travel"
                      ? { duration: NP_SLOW, ease: EASE_IN_OUT_SOFT }
                      : { duration: NP_BASE, ease: EASE }
                }
              >
                <div className="flex h-full flex-col justify-center gap-px">
                  {NP_PAPERS[pass].strokes.map((w, i) => (
                    <div
                      key={i}
                      className="bg-muted-foreground/50 h-px rounded-full"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Output grid — 3×3, one row per pass: 2 filled + 1 hollow each. */}
          <div className="relative flex h-full flex-1 items-center justify-center">
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }, (_, i) => {
                const chipPass = Math.floor(i / 3);
                const isAvoid = i % 3 === 2;
                const isLastChip = i === 8;
                const origin = NP_CHIP_ORIGIN[chipPass];
                const state = resetting
                  ? "leaving"
                  : passesLanded[chipPass]
                    ? "landed"
                    : "pending";

                return (
                  <motion.div
                    key={i}
                    className={
                      isAvoid
                        ? "border-foreground h-3.5 w-3.5 rounded-xs border"
                        : "bg-primary h-3.5 w-3.5 rounded-xs"
                    }
                    animate={
                      state === "landed"
                        ? {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            scale: isLastChip && pulsing ? [1, 1.03, 1] : 1,
                          }
                        : state === "leaving"
                          ? { opacity: 0, x: 0, y: 0, scale: 1 }
                          : { opacity: 0, x: origin.x, y: origin.y, scale: 1 }
                    }
                    transition={
                      !running
                        ? { duration: 0 }
                        : state === "leaving"
                          ? { duration: NP_BASE, ease: EASE }
                          : state === "landed"
                            ? isLastChip && pulsing
                              ? { duration: NP_FAST, ease: EASE_SPRING }
                              : {
                                  duration: NP_SLOW,
                                  ease: EASE_IN_OUT_SOFT,
                                  delay: (i % 3) * NP_STAGGER,
                                }
                            : { duration: 0 }
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CursorAnimation({ active }: AnimationProps) {
  const cursor = useAnimationControls();
  const [published, setPublished] = useState(true);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setPublished(true);
        setPressed(false);
        void cursor.start({
          x: 0,
          y: 0,
          opacity: 0,
          transition: { duration: 0 },
        });
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setPublished(false);
        setPressed(false);
        await cursor.start({
          x: -40,
          y: -22,
          opacity: 1,
          transition: { duration: 0 },
        });
        await new Promise((r) => setTimeout(r, 400));
        if (cancelled) break;
        await cursor.start({
          x: 28,
          y: 18,
          opacity: 1,
          transition: { duration: 0.7, ease: EASE },
        });
        if (cancelled) break;
        setPressed(true);
        await new Promise((r) => setTimeout(r, 180));
        if (cancelled) break;
        setPressed(false);
        setPublished(true);
        await new Promise((r) => setTimeout(r, 1400));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active, cursor]);

  return (
    <div className="relative w-full px-3">
      <div className="border-border bg-card overflow-hidden rounded-md border">
        {/* page header */}
        <div className="border-border flex items-center justify-between gap-2 border-b px-2 py-1.5">
          <div className="bg-foreground h-1.5 w-8 rounded-full opacity-70" />
          <div className="flex gap-1">
            <div className="bg-muted h-1 w-3 rounded-full" />
            <div className="bg-muted h-1 w-3 rounded-full" />
          </div>
        </div>
        {/* content blocks */}
        <div className="flex flex-col gap-1 px-2 py-2">
          <div className="bg-muted h-1.5 w-3/4 rounded-full" />
          <div className="bg-muted h-1.5 w-full rounded-full opacity-60" />
          <div className="bg-muted h-1.5 w-1/2 rounded-full opacity-60" />
        </div>
        {/* action row */}
        <div className="flex items-center justify-end gap-1.5 px-2 pb-2">
          <AnimatePresence mode="wait">
            {published ? (
              <motion.div
                key="ok"
                className="bg-primary/15 text-primary flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[9px] font-medium"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={SPRING_SOFT}
              >
                <span>✓</span>
                <span>Published</span>
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                type="button"
                className="bg-primary text-primary-foreground rounded-md px-2 py-1 font-mono text-[9px] font-medium"
                animate={{ scale: pressed ? 0.92 : 1 }}
                transition={{ duration: 0.18, ease: EASE_SOFT }}
                initial={false}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3, ease: EASE_SOFT },
                }}
              >
                Publish
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        animate={cursor}
        className="text-foreground pointer-events-none absolute top-1/2 left-1/2"
        style={{ originX: 0, originY: 0, opacity: 0 }}
      >
        <svg
          viewBox="0 0 12 18"
          className="h-4 w-4 drop-shadow-sm"
          fill="currentColor"
          aria-hidden
        >
          <path d="M0 0 L0 14 L3.5 10.5 L6 16 L7.5 15.5 L5 10 L9 10 Z" />
        </svg>
      </motion.div>
    </div>
  );
}

const KT_THEMES = [
  { label: "Dark", bg: "#0f0f1a", dot: "#5e5eed" },
  { label: "Light", bg: "#f0f0fd", dot: "#5e5eed" },
  { label: "Black", bg: "#000000", dot: "#ffffff" },
  { label: "White", bg: "#ffffff", dot: "#020817" },
] as const;

const KT_DOT_PATHS = [
  "M48.5224 15.6308C50.7376 15.6308 52.5334 13.836 52.5334 11.622C52.5334 9.40804 50.7376 7.61328 48.5224 7.61328C46.3071 7.61328 44.5112 9.40804 44.5112 11.622C44.5112 13.836 46.3071 15.6308 48.5224 15.6308Z",
  "M55.9886 30.0615C58.2038 30.0615 59.9996 28.2667 59.9996 26.0527C59.9996 23.8387 58.2038 22.0439 55.9886 22.0439C53.7733 22.0439 51.9775 23.8387 51.9775 26.0527C51.9775 28.2667 53.7733 30.0615 55.9886 30.0615Z",
  "M37.5394 12.1768C39.7546 12.1768 41.5505 10.382 41.5505 8.16797C41.5505 5.95398 39.7546 4.15918 37.5394 4.15918C35.3241 4.15918 33.5283 5.95398 33.5283 8.16797C33.5283 10.382 35.3241 12.1768 37.5394 12.1768Z",
  "M26.0455 7.77843C27.5192 7.77843 28.7138 6.58383 28.7138 5.11018C28.7138 3.63653 27.5192 2.44189 26.0455 2.44189C24.5719 2.44189 23.3772 3.63653 23.3772 5.11018C23.3772 6.58383 24.5719 7.77843 26.0455 7.77843Z",
  "M11.8892 14.5099C12.8716 14.5099 13.6681 13.7134 13.6681 12.731C13.6681 11.7486 12.8716 10.9521 11.8892 10.9521C10.9067 10.9521 10.1104 11.7486 10.1104 12.731C10.1104 13.7134 10.9067 14.5099 11.8892 14.5099Z",
  "M22.3775 17.347C23.3599 17.347 24.1564 16.5506 24.1564 15.5682C24.1564 14.5857 23.3599 13.7893 22.3775 13.7893C21.3951 13.7893 20.5986 14.5857 20.5986 15.5682C20.5986 16.5506 21.3951 17.347 22.3775 17.347Z",
  "M34.3599 22.5078C35.9958 22.5078 37.322 21.1825 37.322 19.5475C37.322 17.9126 35.9958 16.5872 34.3599 16.5872C32.7241 16.5872 31.3979 17.9126 31.3979 19.5475C31.3979 21.1825 32.7241 22.5078 34.3599 22.5078Z",
  "M45.3146 25.7761C47.1379 25.7761 48.6161 24.2988 48.6161 22.4765C48.6161 20.6542 47.1379 19.177 45.3146 19.177C43.4913 19.177 42.0132 20.6542 42.0132 22.4765C42.0132 24.2988 43.4913 25.7761 45.3146 25.7761Z",
  "M8.60346 24.6612C9.34029 24.6612 9.93758 24.0639 9.93758 23.3271C9.93758 22.5902 9.34029 21.9929 8.60346 21.9929C7.86663 21.9929 7.26929 22.5902 7.26929 23.3271C7.26929 24.0639 7.86663 24.6612 8.60346 24.6612Z",
  "M5.33411 36.0408C6.07093 36.0408 6.66829 35.4435 6.66829 34.7067C6.66829 33.9699 6.07093 33.3726 5.33411 33.3726C4.5973 33.3726 4 33.9699 4 34.7067C4 35.4435 4.5973 36.0408 5.33411 36.0408Z",
  "M13.2314 48.6612C13.9682 48.6612 14.5655 48.0639 14.5655 47.3271C14.5655 46.5902 13.9682 45.9929 13.2314 45.9929C12.4945 45.9929 11.8972 46.5902 11.8972 47.3271C11.8972 48.0639 12.4945 48.6612 13.2314 48.6612Z",
  "M24.2615 53.7667C25.244 53.7667 26.0404 52.9703 26.0404 51.9878C26.0404 51.0054 25.244 50.209 24.2615 50.209C23.2791 50.209 22.4827 51.0054 22.4827 51.9878C22.4827 52.9703 23.2791 53.7667 24.2615 53.7667Z",
  "M35.0596 57.2511C36.0421 57.2511 36.8385 56.4547 36.8385 55.4723C36.8385 54.4898 36.0421 53.6934 35.0596 53.6934C34.0772 53.6934 33.2808 54.4898 33.2808 55.4723C33.2808 56.4547 34.0772 57.2511 35.0596 57.2511Z",
  "M16.3798 38.9715C17.1166 38.9715 17.7139 38.3742 17.7139 37.6374C17.7139 36.9005 17.1166 36.3032 16.3798 36.3032C15.6429 36.3032 15.0457 36.9005 15.0457 37.6374C15.0457 38.3742 15.6429 38.9715 16.3798 38.9715Z",
  "M27.1295 42.7872C28.1119 42.7872 28.9083 41.9908 28.9083 41.0084C28.9083 40.0259 28.1119 39.2295 27.1295 39.2295C26.147 39.2295 25.3506 40.0259 25.3506 41.0084C25.3506 41.9908 26.147 42.7872 27.1295 42.7872Z",
  "M38.6794 47.2978C40.2812 47.2978 41.5797 46 41.5797 44.3992C41.5797 42.7983 40.2812 41.5005 38.6794 41.5005C37.0776 41.5005 35.7791 42.7983 35.7791 44.3992C35.7791 46 37.0776 47.2978 38.6794 47.2978Z",
  "M49.1228 50.3954C50.5965 50.3954 51.7912 49.2007 51.7912 47.7271C51.7912 46.2534 50.5965 45.0588 49.1228 45.0588C47.6492 45.0588 46.4546 46.2534 46.4546 47.7271C46.4546 49.2007 47.6492 50.3954 49.1228 50.3954Z",
  "M52.9978 40.2994C55.0257 40.2994 56.6695 38.6564 56.6695 36.6298C56.6695 34.6031 55.0257 32.9602 52.9978 32.9602C50.97 32.9602 49.3262 34.6031 49.3262 36.6298C49.3262 38.6564 50.97 40.2994 52.9978 40.2994Z",
  "M42.0128 36.4436C43.5635 36.4436 44.8206 35.1872 44.8206 33.6374C44.8206 32.0876 43.5635 30.8313 42.0128 30.8313C40.4622 30.8313 39.2051 32.0876 39.2051 33.6374C39.2051 35.1872 40.4622 36.4436 42.0128 36.4436Z",
  "M30.9988 32.62C32.3109 32.62 33.3746 31.5569 33.3746 30.2455C33.3746 28.9342 32.3109 27.8711 30.9988 27.8711C29.6867 27.8711 28.623 28.9342 28.623 30.2455C28.623 31.5569 29.6867 32.62 30.9988 32.62Z",
  "M19.3417 27.992C20.0786 27.992 20.6759 27.3947 20.6759 26.6579C20.6759 25.921 20.0786 25.3237 19.3417 25.3237C18.6049 25.3237 18.0076 25.921 18.0076 26.6579C18.0076 27.3947 18.6049 27.992 19.3417 27.992Z",
];

function LogoIdentityAnimation({ active }: AnimationProps) {
  const [themeIdx, setThemeIdx] = useState(0);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setThemeIdx(0), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1100));
        if (!cancelled) setThemeIdx((p) => (p + 1) % KT_THEMES.length);
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const current = KT_THEMES[themeIdx];

  return (
    <motion.div
      className="relative flex w-full items-center justify-center overflow-hidden rounded-xl"
      style={{ height: 130 }}
      animate={{ backgroundColor: current.bg }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {/* Theme label — top right */}
      <AnimatePresence mode="wait">
        <motion.span
          key={current.label}
          className="absolute top-2.5 right-3 font-mono text-[9px] tracking-wider uppercase"
          style={{ color: current.dot + "aa" }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.4, ease: EASE_SOFT }}
        >
          {current.label}
        </motion.span>
      </AnimatePresence>

      {/* Dot constellation — fills card */}
      <motion.svg
        viewBox="2 2 60 60"
        width={108}
        height={108}
        animate={{ color: current.dot }}
        transition={{ duration: 0.55, ease: EASE }}
        aria-hidden
      >
        {KT_DOT_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="currentColor"
            animate={{ opacity: 1 }}
            transition={
              active
                ? { duration: 0.35, delay: i * 0.048, ease: EASE }
                : { duration: 0 }
            }
          />
        ))}
      </motion.svg>

      {/* Theme dots indicator — bottom */}
      <div className="absolute bottom-2.5 flex gap-1">
        {KT_THEMES.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ height: 4, backgroundColor: current.dot }}
            animate={{
              width: i === themeIdx ? 14 : 4,
              opacity: i === themeIdx ? 1 : 0.35,
            }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const ASSET_TILES = [
  { themeIdx: 0, format: "svg" },
  { themeIdx: 1, format: "svg" },
  { themeIdx: 2, format: "svg" },
  { themeIdx: 3, format: "svg" },
  { themeIdx: 0, format: "png" },
  { themeIdx: 1, format: "png" },
  { themeIdx: 2, format: "png" },
  { themeIdx: 3, format: "png" },
] as const;

// Deterministic pseudo-random sequence of tile indices (4 picks per cycle).
const ASSET_SEQUENCE = [2, 5, 0, 7, 3, 6, 1, 4] as const;

function AssetPortalAnimation({ active }: AnimationProps) {
  const cursor = useAnimationControls();
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const [downloadedIdx, setDownloadedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setTargetIdx(null);
        setDownloadedIdx(null);
        void cursor.start({ opacity: 0, transition: { duration: 0 } });
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      // Tile layout is 4 columns × 2 rows. Tile size ~28px with 6px gap.
      // Cursor coords are relative to the grid's top-left (approximate).
      const cols = 4;
      const tileW = 30;
      const tileH = 30;
      const gap = 6;
      let seqPos = 0;
      while (!cancelled) {
        const idx = ASSET_SEQUENCE[seqPos % ASSET_SEQUENCE.length];
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = col * (tileW + gap) + tileW / 2;
        const y = row * (tileH + gap) + tileH / 2;

        setDownloadedIdx(null);
        setTargetIdx(idx);
        await cursor.start({
          x,
          y,
          opacity: 1,
          transition: { duration: 0.4, ease: EASE },
        });
        if (cancelled) break;
        await new Promise((r) => setTimeout(r, 200));
        if (cancelled) break;
        setDownloadedIdx(idx);
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) break;
        seqPos += 1;
        if (seqPos % 4 === 0) {
          // brief reset pause before continuing
          await cursor.start({
            opacity: 0,
            transition: { duration: 0.25, ease: EASE },
          });
          setTargetIdx(null);
          setDownloadedIdx(null);
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active, cursor]);

  const downloaded = downloadedIdx !== null ? ASSET_TILES[downloadedIdx] : null;
  const downloadedTheme =
    downloaded !== null ? KT_THEMES[downloaded.themeIdx] : null;

  return (
    <div className="flex w-full flex-col gap-2 px-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
          Design portal
        </span>
        <span className="text-muted-foreground font-mono text-[9px]">
          104 assets
        </span>
      </div>
      <div className="relative">
        <div className="grid grid-cols-4 gap-1.5">
          {ASSET_TILES.map((tile, i) => {
            const theme = KT_THEMES[tile.themeIdx];
            const isTarget = targetIdx === i;
            const isDownloaded = downloadedIdx === i;
            return (
              <motion.div
                key={`${tile.themeIdx}-${tile.format}`}
                className="border-border/60 relative flex aspect-square items-center justify-center rounded-md border p-1"
                style={{ backgroundColor: theme.bg }}
                animate={{
                  scale: isDownloaded ? [1, 1.08, 1] : 1,
                }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <motion.div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.dot }}
                  animate={{
                    opacity: isDownloaded
                      ? [0.6, 1, 0.85]
                      : isTarget
                        ? 0.9
                        : 0.6,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
                <span
                  className="absolute right-0.5 bottom-0.5 font-mono text-[6px] tracking-wider uppercase"
                  style={{ color: theme.dot, opacity: 0.5 }}
                >
                  {tile.format}
                </span>
                <AnimatePresence>
                  {isDownloaded && (
                    <motion.span
                      key="check"
                      className="absolute top-0.5 left-0.5 font-mono text-[8px]"
                      style={{ color: theme.dot }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={SPRING_SNAP}
                    >
                      ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          animate={cursor}
          className="text-foreground pointer-events-none absolute top-0 left-0"
          style={{ originX: 0, originY: 0, opacity: 0 }}
        >
          <svg
            viewBox="0 0 12 18"
            className="h-3.5 w-3.5 drop-shadow-sm"
            fill="currentColor"
            aria-hidden
          >
            <path d="M0 0 L0 14 L3.5 10.5 L6 16 L7.5 15.5 L5 10 L9 10 Z" />
          </svg>
        </motion.div>

        <AnimatePresence>
          {downloaded && downloadedTheme && (
            <motion.div
              key={`${downloadedIdx}-label`}
              className="bg-card border-border/60 absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md border px-1.5 py-0.5 font-mono text-[8px] whitespace-nowrap shadow-sm"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: EASE_SOFT }}
            >
              <span className="text-foreground">
                logo-{downloadedTheme.label.toLowerCase()}.{downloaded.format}
              </span>
              <span className="text-muted-foreground ml-1">↓</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

type GitPhase = "clone" | "files" | "preview" | "published";
const GIT_CMD = "git clone kt360-env";
const FILE_TREE = ["src/", "components/", "globals.css", "README.md"];

export function CanvasAnimation({
  active,
  tall = false,
}: AnimationProps & { tall?: boolean }) {
  const [phase, setPhase] = useState<GitPhase>("published");
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setPhase("published");
        setChars(0);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setPhase("clone");
        setChars(0);
        for (let i = 0; i <= GIT_CMD.length; i++) {
          if (cancelled) return;
          setChars(i);
          await new Promise((r) => setTimeout(r, 52));
        }
        await new Promise((r) => setTimeout(r, 500));
        if (cancelled) break;
        setPhase("files");
        await new Promise((r) => setTimeout(r, 1600));
        if (cancelled) break;
        setPhase("preview");
        await new Promise((r) => setTimeout(r, 1600));
        if (cancelled) break;
        setPhase("published");
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) break;
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="flex w-full flex-1 flex-col px-1">
      <AnimatePresence mode="wait">
        {phase === "clone" &&
          (tall ? (
            <motion.div
              key="clone"
              className="border-border flex flex-1 flex-col overflow-hidden rounded-lg border"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE_SOFT }}
            >
              <div className="border-border bg-foreground/5 relative flex items-center border-b px-2 py-1.5">
                <div className="flex gap-1.5">
                  {["bg-red-400", "bg-yellow-400", "bg-green-400"].map(
                    (c, i) => (
                      <div
                        key={i}
                        className={`${c} h-2 w-2 rounded-full opacity-60`}
                      />
                    )
                  )}
                </div>
                <div className="text-muted-foreground absolute left-1/2 -translate-x-1/2 font-mono text-[8px]">
                  kt360-env — bash
                </div>
              </div>
              <div
                className="flex flex-1 items-center px-3 font-mono text-[10px]"
                style={{ backgroundColor: "#1e1e1e", color: "#e0e0e0" }}
              >
                <span style={{ color: "#7ec699" }}>$ </span>
                <span>{GIT_CMD.slice(0, chars)}</span>
                <motion.span
                  className="ml-[1px] inline-block h-[10px] w-[1px] align-middle"
                  style={{ backgroundColor: "#e0e0e0" }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="clone"
              className="bg-foreground/5 border-border rounded-lg border px-3 py-2.5 font-mono text-[10px]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE_SOFT }}
            >
              <span className="text-muted-foreground">$ </span>
              <span className="text-foreground">{GIT_CMD.slice(0, chars)}</span>
              <motion.span
                className="bg-foreground inline-block h-[10px] w-[1px] align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </motion.div>
          ))}

        {phase === "files" &&
          (tall ? (
            <motion.div
              key="files"
              className="border-border flex flex-1 flex-col overflow-hidden rounded-lg border"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE_SOFT }}
            >
              <div className="border-border bg-foreground/5 relative flex items-center border-b px-2 py-1.5">
                <div className="flex gap-1.5">
                  {["bg-red-400", "bg-yellow-400", "bg-green-400"].map(
                    (c, i) => (
                      <div
                        key={i}
                        className={`${c} h-2 w-2 rounded-full opacity-60`}
                      />
                    )
                  )}
                </div>
                <div className="text-muted-foreground absolute left-1/2 -translate-x-1/2 font-mono text-[8px]">
                  kt360-env — bash
                </div>
              </div>
              <div
                className="flex flex-1 flex-col justify-center px-3 font-mono text-[10px]"
                style={{ backgroundColor: "#1e1e1e", color: "#e0e0e0" }}
              >
                <span style={{ color: "#e0e0e0" }} className="font-medium">
                  kt360-env/
                </span>
                {FILE_TREE.map((f, i) => (
                  <motion.div
                    key={f}
                    className="flex items-center gap-1.5 pl-3"
                    style={{ color: "#a0a0a0" }}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.1,
                      ease: EASE_SOFT,
                    }}
                  >
                    <span style={{ color: "#666" }}>├</span>
                    <span>{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="files"
              className="flex flex-col gap-1 font-mono text-[10px]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE_SOFT }}
            >
              <span className="text-foreground font-medium">kt360-env/</span>
              {FILE_TREE.map((f, i) => (
                <motion.div
                  key={f}
                  className="text-muted-foreground flex items-center gap-1.5 pl-3"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.1,
                    ease: EASE_SOFT,
                  }}
                >
                  <span className="text-border">├</span>
                  <span>{f}</span>
                </motion.div>
              ))}
            </motion.div>
          ))}

        {phase === "preview" && (
          <motion.div
            key="preview"
            className={`border-border overflow-hidden rounded-lg border ${tall ? "flex-1" : ""}`}
            style={tall ? undefined : { height: 88 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            <div className="border-border flex shrink-0 items-center gap-1.5 border-b px-2 py-1.5">
              {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c, i) => (
                <div
                  key={i}
                  className={`${c} h-2 w-2 rounded-full opacity-60`}
                />
              ))}
              <div className="bg-muted text-muted-foreground ml-1 flex-1 rounded px-2 font-mono text-[8px]">
                localhost:3000
              </div>
            </div>
            <div
              className={`flex flex-col ${tall ? "flex-1 gap-3 p-3" : "gap-1.5 p-2"}`}
            >
              <div
                className={`${tall ? "h-3" : "h-2"} w-16 rounded-full`}
                style={{ backgroundColor: "#5e5eed", opacity: 0.8 }}
              />
              <div
                className={`bg-muted ${tall ? "h-2" : "h-1.5"} w-full rounded-full opacity-40`}
              />
              <div
                className={`bg-muted ${tall ? "h-2" : "h-1.5"} w-4/5 rounded-full opacity-30`}
              />
              <div
                className={`mt-0.5 inline-flex rounded-md px-2 py-0.5 font-mono text-[8px] font-medium text-white ${tall ? "h-3" : "h-2"} items-center`}
                style={{ backgroundColor: "#5e5eed" }}
              >
                Get started
              </div>
            </div>
          </motion.div>
        )}

        {phase === "published" && (
          <motion.div
            key="published"
            className={`flex flex-col items-center justify-center gap-1.5 rounded-lg px-3 ${tall ? "flex-1 py-6" : "py-4"}`}
            style={
              tall
                ? { backgroundColor: "#5e5eed12" }
                : { backgroundColor: "#5e5eed12", height: 88 }
            }
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={SPRING_SOFT}
          >
            <span
              className={`${tall ? "text-5xl" : "text-2xl"} leading-none`}
              style={{ color: "#5e5eed" }}
            >
              ✓
            </span>
            <span
              className={`font-mono ${tall ? "text-sm" : "text-[11px]"} font-medium`}
              style={{ color: "#5e5eed" }}
            >
              Deployed
            </span>
            <span
              className={`font-mono ${tall ? "text-xs" : "text-[8px]"}`}
              style={{ color: "#5e5eed", opacity: 0.7 }}
            >
              kt360-env → production
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FOUND_PAGES = ["Colors", "Type", "Components"] as const;
type FoundPage = (typeof FOUND_PAGES)[number];

const KT_SWATCHES = [
  { hex: "#5e5eed", name: "Primary" },
  { hex: "#8b8af2", name: "Light" },
  { hex: "#c4c3f8", name: "Lighter" },
  { hex: "#020817", name: "Text" },
  { hex: "#64748b", name: "Muted" },
  { hex: "#fcfcfd", name: "BG" },
];

function GuidelineAnimation({ active }: AnimationProps) {
  const [page, setPage] = useState<FoundPage>("Colors");

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setPage("Colors"), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1500));
        if (!cancelled)
          setPage((p) => {
            const i = FOUND_PAGES.indexOf(p);
            return FOUND_PAGES[(i + 1) % FOUND_PAGES.length];
          });
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="flex w-full flex-col gap-2 px-1">
      <div className="flex gap-1">
        {FOUND_PAGES.map((p) => (
          <motion.span
            key={p}
            className="rounded-md px-2 py-0.5 font-mono text-[9px]"
            animate={{
              backgroundColor: p === page ? "#5e5eed22" : "transparent",
              color: p === page ? "#5e5eed" : "hsl(var(--muted-foreground))",
              fontWeight: p === page ? 600 : 400,
            }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            {p}
          </motion.span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {page === "Colors" && (
          <motion.div
            key="colors"
            className="grid grid-cols-6 gap-1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            {KT_SWATCHES.map((s, i) => (
              <motion.div
                key={s.hex}
                className="flex flex-col items-center gap-0.5"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.04,
                  ease: EASE_SOFT,
                }}
              >
                <div
                  className="h-7 w-full rounded-md border"
                  style={{
                    backgroundColor: s.hex,
                    borderColor:
                      s.hex === "#fcfcfd"
                        ? "hsl(var(--border))"
                        : "transparent",
                  }}
                />
                <span className="text-muted-foreground font-mono text-[7px]">
                  {s.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {page === "Type" && (
          <motion.div
            key="type"
            className="flex flex-col gap-1.5"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            {[
              { size: "text-xl", weight: "font-bold", label: "Display — Bold" },
              {
                size: "text-sm",
                weight: "font-medium",
                label: "Body — Medium",
              },
              {
                size: "text-xs",
                weight: "font-normal",
                label: "Caption — Regular",
              },
            ].map((t, i) => (
              <motion.div
                key={t.label}
                className={`text-foreground font-sans ${t.size} ${t.weight} leading-none`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.07,
                  ease: EASE_SOFT,
                }}
              >
                {t.label}
              </motion.div>
            ))}
          </motion.div>
        )}

        {page === "Components" && (
          <motion.div
            key="components"
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            <div className="flex flex-wrap gap-1.5">
              <div
                className="rounded-lg px-3 py-1.5 font-mono text-[10px] font-medium text-white"
                style={{ backgroundColor: "#5e5eed" }}
              >
                Primary
              </div>
              <div
                className="rounded-lg border px-3 py-1.5 font-mono text-[10px] font-medium"
                style={{ borderColor: "#5e5eed", color: "#5e5eed" }}
              >
                Outline
              </div>
            </div>
            <div className="flex gap-1">
              {["Tag", "Label", "Badge"].map((l) => (
                <div
                  key={l}
                  className="rounded-full px-2 py-0.5 font-mono text-[9px]"
                  style={{ backgroundColor: "#5e5eed18", color: "#5e5eed" }}
                >
                  {l}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const WP_STEPS = [
  { label: "Design", icon: "✦", detail: "Figma" },
  { label: "Build", icon: "◈", detail: "AI + code" },
  { label: "Template", icon: "⊞", detail: ".zip export" },
  { label: "Live", icon: "◉", detail: "WordPress" },
];

function WordpressAnimation({ active }: AnimationProps) {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setStep(0);
        setTransitioning(false);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) break;
        setTransitioning(true);
        await new Promise((r) => setTimeout(r, 350));
        if (cancelled) break;
        setStep((p) => (p + 1) % WP_STEPS.length);
        setTransitioning(false);
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const s = WP_STEPS[step];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 py-1">
      <motion.div
        key={step}
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: transitioning ? 0 : 1, x: transitioning ? -24 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div className="border-border bg-card flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl border">
          <span className="text-foreground text-2xl leading-none">
            {s.icon}
          </span>
          <span className="text-muted-foreground font-mono text-[9px]">
            {s.detail}
          </span>
        </div>
        <span className="text-foreground font-mono text-xs font-medium">
          {s.label}
        </span>
      </motion.div>

      <div className="flex gap-1.5">
        {WP_STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === step ? 16 : 4,
              backgroundColor:
                i === step ? "hsl(var(--foreground))" : "hsl(var(--border))",
            }}
            style={{ height: 4 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          />
        ))}
      </div>
    </div>
  );
}

// Mindfulme animations — abstract, metaphor-driven, semantic tokens only.

// Start positions: 5 avatars clustered near the left.
const JOURNEY_START_POINTS = [
  { x: 14, y: 18 },
  { x: 10, y: 32 },
  { x: 14, y: 46 },
  { x: 18, y: 26 },
  { x: 18, y: 38 },
] as const;

// Each path is a series of waypoints (x,y) sampled from a hand-drawn-ish curve.
// The avatar's cx / cy animates through these waypoints. Last waypoint = destination.
const JOURNEY_WAYPOINTS: readonly (readonly { x: number; y: number }[])[] = [
  [
    { x: 14, y: 18 },
    { x: 40, y: 14 },
    { x: 70, y: 10 },
    { x: 100, y: 12 },
    { x: 120, y: 12 },
  ],
  [
    { x: 10, y: 32 },
    { x: 38, y: 48 },
    { x: 68, y: 54 },
    { x: 98, y: 56 },
    { x: 120, y: 56 },
  ],
  [
    { x: 14, y: 46 },
    { x: 34, y: 34 },
    { x: 60, y: 40 },
    { x: 90, y: 30 },
    { x: 120, y: 28 },
  ],
  [
    { x: 18, y: 26 },
    { x: 46, y: 32 },
    { x: 76, y: 36 },
    { x: 102, y: 40 },
    { x: 120, y: 40 },
  ],
  [
    { x: 18, y: 38 },
    { x: 40, y: 44 },
    { x: 70, y: 22 },
    { x: 100, y: 44 },
    { x: 120, y: 46 },
  ],
];

// Pre-computed SVG path strings (smooth cubic through the waypoints).
const JOURNEY_PATH_STRINGS = [
  "M 14 18 C 30 14, 58 10, 120 12",
  "M 10 32 C 32 48, 70 56, 120 56",
  "M 14 46 C 30 34, 70 44, 120 28",
  "M 18 26 C 46 32, 88 38, 120 40",
  "M 18 38 C 46 46, 82 22, 120 46",
] as const;

const JOURNEY_DURATIONS = [2.0, 2.2, 1.9, 2.3, 2.1] as const;

function JourneySceneAnimation({ active }: AnimationProps) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setCycle(0), 0);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => setCycle((c) => c + 1), 3400);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="text-foreground flex w-full items-center justify-center px-2">
      <svg
        viewBox="0 0 128 64"
        className="h-full w-full max-w-[320px]"
        aria-hidden
      >
        {/* Paths — drawn behind avatars */}
        {JOURNEY_PATH_STRINGS.map((d, i) => (
          <motion.path
            key={`${cycle}-path-${i}`}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.3}
            initial={active ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: active ? JOURNEY_DURATIONS[i] * 0.9 : 0,
              delay: active ? 0.15 + i * 0.08 : 0,
              ease: EASE_SOFT,
            }}
          />
        ))}

        {/* End dots */}
        {JOURNEY_WAYPOINTS.map((wp, i) => {
          const end = wp[wp.length - 1];
          return (
            <motion.circle
              key={`${cycle}-end-${i}`}
              cx={end.x}
              cy={end.y}
              r="3"
              fill="currentColor"
              initial={
                active ? { opacity: 0, scale: 0.5 } : { opacity: 0.7, scale: 1 }
              }
              animate={
                active
                  ? { opacity: [0, 0.7, 0.9, 0.7], scale: [0.5, 1.2, 1, 1] }
                  : { opacity: 0.7, scale: 1 }
              }
              transition={{
                duration: 0.8,
                delay: active ? JOURNEY_DURATIONS[i] + 0.1 : 0,
                ease: EASE_SOFT,
              }}
              style={{ transformOrigin: `${end.x}px ${end.y}px` }}
            />
          );
        })}

        {/* Avatars — travel along sampled waypoints */}
        {JOURNEY_WAYPOINTS.map((wp, i) => {
          const start = JOURNEY_START_POINTS[i];
          const xs = wp.map((p) => p.x);
          const ys = wp.map((p) => p.y);
          return (
            <motion.circle
              key={`${cycle}-avatar-${i}`}
              r="2.8"
              fill="currentColor"
              opacity={0.85}
              initial={
                active
                  ? { cx: start.x, cy: start.y, scale: 0 }
                  : {
                      cx: wp[wp.length - 1].x,
                      cy: wp[wp.length - 1].y,
                      scale: 1,
                    }
              }
              animate={
                active
                  ? { cx: xs, cy: ys, scale: [0, 1, 1, 1, 1] }
                  : {
                      cx: wp[wp.length - 1].x,
                      cy: wp[wp.length - 1].y,
                      scale: 1,
                    }
              }
              transition={
                active
                  ? {
                      duration: JOURNEY_DURATIONS[i],
                      delay: 0.1 + i * 0.08,
                      ease: EASE_SOFT,
                      times: [0, 0.15, 0.5, 0.8, 1],
                    }
                  : { duration: 0 }
              }
            />
          );
        })}
      </svg>
    </div>
  );
}

const AFFIRMATION_PHRASES: Bilingual<string>[] = [
  { en: "You are enough.", es: "Eres suficiente." },
  {
    en: "You — right now — are enough.",
    es: "Tú — ahora mismo — eres suficiente.",
  },
  {
    en: "Today, you did more than enough.",
    es: "Hoy hiciste más que suficiente.",
  },
  { en: "Tomorrow belongs to you.", es: "El mañana es tuyo." },
];

const AFFIRMATION_SHAPES = [
  "50% 50% 50% 50%",
  "40% 60% 55% 45%",
  "60% 40% 45% 55%",
  "50% 50% 50% 50%",
] as const;

function AffirmationMorphAnimation({ active }: AnimationProps) {
  const { lang } = useLang();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setIdx(0), 0);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % AFFIRMATION_PHRASES.length);
    }, 2200);
    return () => clearInterval(t);
  }, [active]);

  const activeIdx = active ? idx : 0;
  const words = pick(AFFIRMATION_PHRASES[activeIdx], lang).split(" ");

  return (
    <div className="flex w-full flex-col items-center gap-3 px-4">
      <div className="relative flex h-12 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className="relative flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: EASE_SOFT }}
          >
            <p className="text-foreground text-center font-serif text-base italic">
              {words.map((w, i) => (
                <motion.span
                  key={`${activeIdx}-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 + i * 0.08,
                    ease: EASE_SOFT,
                  }}
                >
                  {w}
                  {i < words.length - 1 ? "\u00A0" : ""}
                </motion.span>
              ))}
            </p>
            {/* Pen stroke underline */}
            <motion.span
              className="bg-foreground/40 mt-1 block h-px origin-left"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 1, 1],
                opacity: [0, 0.9, 0.9, 0],
                width: [24, 48, 48, 48],
              }}
              transition={{
                duration: 1.6,
                delay: 0.2,
                ease: EASE_SOFT,
                times: [0, 0.3, 0.7, 1],
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        {/* Evolution indicator: shape that morphs with each phrase */}
        <motion.div
          className="bg-primary h-2 w-2"
          animate={{
            borderRadius: AFFIRMATION_SHAPES[activeIdx],
            rotate: activeIdx * 30,
          }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
        />

        <div className="flex gap-1.5">
          {AFFIRMATION_PHRASES.map((_, i) => (
            <div key={i} className="relative h-1 w-4">
              {i === activeIdx && (
                <motion.div
                  layoutId="affirmation-active-dot"
                  className="bg-foreground absolute inset-0 rounded-full"
                  transition={SPRING_SOFT}
                />
              )}
              {i !== activeIdx && (
                <div className="bg-border absolute inset-y-0 left-0 h-1 w-1 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ORGANIC_BLOB_SHAPES = [
  "30% 70% 70% 30% / 30% 30% 70% 70%",
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "40% 60% 70% 30% / 40% 70% 30% 60%",
  "55% 45% 60% 40% / 50% 60% 40% 50%",
] as const;

function OrganicBundleAnimation({ active }: AnimationProps) {
  // Each blob has its own loop. When inactive, they settle to a calm resolved state.
  const blobs = [
    {
      cls: "bg-primary",
      size: 50,
      left: 50,
      top: 50,
      duration: 6.8,
      restShape: "40% 60% 55% 45% / 45% 55% 45% 55%",
    },
    {
      cls: "bg-primary/60",
      size: 32,
      left: 28,
      top: 26,
      duration: 5.5,
      restShape: "60% 40% 45% 55% / 50% 55% 45% 50%",
    },
    {
      cls: "bg-primary/40",
      size: 28,
      left: 74,
      top: 76,
      duration: 4,
      restShape: "45% 55% 40% 60% / 55% 45% 55% 45%",
    },
  ] as const;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="relative h-24 w-24">
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className={`${b.cls} absolute`}
            style={{
              width: b.size,
              height: b.size,
              left: `${b.left}%`,
              top: `${b.top}%`,
              x: "-50%",
              y: "-50%",
            }}
            animate={
              active
                ? {
                    borderRadius: [
                      ORGANIC_BLOB_SHAPES[i % ORGANIC_BLOB_SHAPES.length],
                      ORGANIC_BLOB_SHAPES[(i + 1) % ORGANIC_BLOB_SHAPES.length],
                      ORGANIC_BLOB_SHAPES[(i + 2) % ORGANIC_BLOB_SHAPES.length],
                      ORGANIC_BLOB_SHAPES[i % ORGANIC_BLOB_SHAPES.length],
                    ],
                    rotate: [0, 6, -4, 0],
                    translateX: [
                      "-50%",
                      "calc(-50% + 3px)",
                      "calc(-50% - 2px)",
                      "-50%",
                    ],
                    translateY: [
                      "-50%",
                      "calc(-50% - 2px)",
                      "calc(-50% + 3px)",
                      "-50%",
                    ],
                  }
                : {
                    borderRadius: b.restShape,
                    rotate: 0,
                    translateX: "-50%",
                    translateY: "-50%",
                  }
            }
            transition={
              active
                ? {
                    duration: b.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 0.8, ease: EASE_SOFT }
            }
          />
        ))}
      </div>
      <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
        organic by design
      </span>
    </div>
  );
}

type FeedbackStage = 1 | 2 | 3 | 4;

function FeedbackScreen({
  stage,
  highlight,
  shipped,
}: {
  stage: FeedbackStage;
  highlight: boolean;
  shipped: boolean;
}) {
  const isStage4 = stage === 4;
  return (
    <motion.div
      className="border-border bg-card relative flex h-16 w-10 flex-col gap-1 rounded-md border p-1.5"
      animate={{
        opacity: highlight ? 1 : 0.35,
        scale: highlight ? 1 : 0.94,
        boxShadow:
          shipped && isStage4
            ? "0 0 0 2px hsl(var(--primary) / 0.25)"
            : "0 0 0 0 hsl(var(--primary) / 0)",
      }}
      transition={{ duration: 0.45, ease: EASE_SOFT }}
    >
      {stage === 1 && <div className="bg-muted h-0.5 w-full rounded-full" />}
      {stage === 2 && (
        <>
          <div className="bg-muted h-0.5 w-full rounded-full" />
          <div className="bg-muted h-0.5 w-3/4 rounded-full" />
        </>
      )}
      {stage === 3 && (
        <>
          <div className="bg-muted-foreground/40 h-1 w-full rounded-sm" />
          <div className="bg-muted h-0.5 w-full rounded-full" />
          <div className="bg-muted h-0.5 w-2/3 rounded-full" />
        </>
      )}
      {stage === 4 && (
        <>
          <div className="bg-foreground h-1 w-full rounded-sm" />
          <div className="bg-muted h-0.5 w-full rounded-full" />
          <div className="bg-muted h-0.5 w-full rounded-full" />
          <div className="bg-muted h-0.5 w-2/3 rounded-full" />
          <div className="bg-primary mt-auto h-1 w-3 rounded-full" />
        </>
      )}
      {/* Shipped status dot */}
      {isStage4 && (
        <motion.div
          className="bg-primary absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full"
          animate={{
            opacity: shipped ? 1 : 0,
            scale: shipped ? 1 : 0.4,
          }}
          transition={SPRING_SNAP}
        />
      )}
    </motion.div>
  );
}

function UserIcon({ pulse }: { pulse: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 10 12"
      className="text-muted-foreground h-3 w-2.5"
      aria-hidden
      animate={{
        opacity: pulse ? 1 : 0.35,
        scale: pulse ? [1, 1.3, 1] : 1,
      }}
      transition={{ duration: 0.45, ease: EASE_SOFT }}
      style={{ color: "currentColor" }}
    >
      <circle cx="5" cy="3" r="2" fill="currentColor" />
      <path d="M1 12 C 1 8, 9 8, 9 12 Z" fill="currentColor" />
    </motion.svg>
  );
}

function UserFeedbackAnimation({ active }: AnimationProps) {
  // step: 0..3 = highlight a phone; 4 = shipped state (stage 4 glowing).
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(4);
  const [pulseIdx, setPulseIdx] = useState<number>(-1);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setStep(4);
        setPulseIdx(-1);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        for (let i = 0; i < 4; i++) {
          if (cancelled) return;
          setStep(i as 0 | 1 | 2 | 3);
          setPulseIdx(-1);
          await new Promise((r) => setTimeout(r, 400));
          if (cancelled) return;
          // Pulse the user icon between this phone and the next one.
          if (i < 3) {
            setPulseIdx(i);
            await new Promise((r) => setTimeout(r, 220));
          }
        }
        if (cancelled) return;
        setPulseIdx(-1);
        setStep(4);
        await new Promise((r) => setTimeout(r, 900));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const stages: FeedbackStage[] = [1, 2, 3, 4];

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full items-end justify-center gap-3 px-3">
        {stages.map((stage, i) => {
          const isHighlight = active ? step === i || step === 4 : true;
          const shipped = step === 4;
          return (
            <div key={stage} className="flex items-center gap-2">
              <FeedbackScreen
                stage={stage}
                highlight={isHighlight}
                shipped={shipped}
              />
              {i < stages.length - 1 && (
                <UserIcon pulse={active && pulseIdx === i} />
              )}
            </div>
          );
        })}
      </div>
      <motion.span
        className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase"
        animate={{ opacity: active ? 1 : 0.6 }}
        transition={{ duration: 0.4, ease: EASE_SOFT }}
      >
        shaped by users
      </motion.span>
    </div>
  );
}

// B2C avatar body: trapezoid approximating a grad cap silhouette (below the head).
const PIVOT_BODY_B2C = "M -3 5 L -5 1 L 5 1 L 3 5 Z";
// B2B avatar body: rectangle briefcase.
const PIVOT_BODY_B2B = "M -4 1 L 4 1 L 4 6 L -4 6 Z";

const PIVOT_AUDIENCES = [
  {
    id: "b2c" as const,
    tag: "B2C · Students",
    metric: "$8K MRR",
    body: PIVOT_BODY_B2C,
    tagClass: "bg-muted text-muted-foreground",
  },
  {
    id: "b2b" as const,
    tag: "B2B · Professionals",
    metric: "Enterprise pipeline",
    body: PIVOT_BODY_B2B,
    tagClass: "bg-primary text-primary-foreground",
  },
] as const;

function AudiencePivotAnimation({ active }: AnimationProps) {
  const [audIdx, setAudIdx] = useState(1);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setAudIdx(1), 0);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => {
      setAudIdx((p) => (p + 1) % PIVOT_AUDIENCES.length);
    }, 2200);
    return () => clearInterval(t);
  }, [active]);

  const aud = PIVOT_AUDIENCES[audIdx];

  return (
    <div className="flex w-full items-center justify-center px-2">
      <div className="bg-card border-border/60 flex w-full max-w-[280px] flex-col items-center gap-3 rounded-xl border p-4">
        {/* Tag pill */}
        <div className="flex h-5 items-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={aud.id}
              layout
              className={`${aud.tagClass} rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={SPRING_SOFT}
            >
              {aud.tag}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Avatar row — 5 people morphing body shape */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              viewBox="-6 -6 12 14"
              className="text-foreground h-5 w-3"
              aria-hidden
            >
              <circle cx="0" cy="-3" r="2" fill="currentColor" />
              <motion.path
                fill="currentColor"
                animate={{ d: aud.body }}
                transition={{
                  ...SPRING_SOFT,
                  delay: i * 0.04,
                }}
                initial={false}
              />
            </svg>
          ))}
        </div>

        {/* Metric readout */}
        <div className="flex h-4 items-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={aud.id}
              className="text-foreground font-mono text-[11px] font-medium"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4, ease: EASE_SOFT }}
            >
              {aud.metric}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const HOURS_DOT_COUNT = 20;
const HOURS_DOTS = Array.from({ length: HOURS_DOT_COUNT }, (_, i) => {
  const angle = (i / HOURS_DOT_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + Math.cos(angle) * 42,
    y: 50 + Math.sin(angle) * 42,
  };
});

type HoursPhase = "counting" | "hours-done" | "money" | "money-done";

function CountingNumberAnim({
  target,
  prefix = "",
  suffix = "",
  running,
  duration = 1200,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  running: boolean;
  duration?: number;
}) {
  const [display, setDisplay] = useState(running ? 0 : target);

  useEffect(() => {
    if (!running) {
      const t = setTimeout(() => setDisplay(target), 0);
      return () => clearTimeout(t);
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, running, duration]);

  return (
    <>
      {prefix}
      {display}
      {suffix}
    </>
  );
}

function HoursStatAnimation({ active }: AnimationProps) {
  const [phase, setPhase] = useState<HoursPhase>("money-done");

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setPhase("money-done"), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setPhase("counting");
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) return;
        setPhase("hours-done");
        await new Promise((r) => setTimeout(r, 900));
        if (cancelled) return;
        setPhase("money");
        await new Promise((r) => setTimeout(r, 100));
        if (cancelled) return;
        setPhase("money-done");
        await new Promise((r) => setTimeout(r, 1400));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const isMoney = phase === "money" || phase === "money-done";
  const isHours = phase === "counting" || phase === "hours-done";
  const countingHours = phase === "counting";
  const moneyDone = phase === "money-done";

  // For the ring: lit count based on phase.
  const litCount = isMoney
    ? HOURS_DOT_COUNT
    : countingHours
      ? HOURS_DOT_COUNT
      : phase === "hours-done"
        ? HOURS_DOT_COUNT
        : 0;

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-2 px-2">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="bg-primary/10 relative flex h-24 w-24 items-center justify-center rounded-full"
          animate={{
            boxShadow: moneyDone
              ? "0 0 0 6px hsl(var(--primary) / 0.15)"
              : "0 0 0 0 hsl(var(--primary) / 0)",
          }}
          transition={{ duration: 0.6, ease: EASE_SOFT }}
        >
          {/* Ring of 20 dots */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            {HOURS_DOTS.map((d, i) => {
              const lit = i < litCount;
              return (
                <motion.circle
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  r="2"
                  initial={false}
                  animate={{
                    fill: lit ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    scale: countingHours && i < litCount ? [1, 1.6, 1] : 1,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: countingHours ? i * 0.05 : 0,
                    ease: EASE_SOFT,
                  }}
                  style={{ transformOrigin: `${d.x}px ${d.y}px` }}
                />
              );
            })}
          </svg>

          {/* Number */}
          <AnimatePresence mode="wait">
            {isHours ? (
              <motion.span
                key="hrs"
                className="text-foreground font-display text-4xl font-black tabular-nums"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={SPRING_SOFT}
              >
                <CountingNumberAnim
                  target={20}
                  running={countingHours}
                  duration={1100}
                />
              </motion.span>
            ) : (
              <motion.span
                key="money"
                className="text-foreground font-display text-3xl font-black tabular-nums"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={SPRING_SOFT}
              >
                <CountingNumberAnim
                  target={10}
                  prefix="$"
                  suffix="M"
                  running={phase === "money"}
                  duration={700}
                />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={isMoney ? "label-money" : "label-hours"}
          className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.35, ease: EASE_SOFT }}
        >
          {isMoney ? "monthly opportunity" : "hrs/month lost"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const LEAD_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const LEAD_PER_DAY = [3, 3, 3, 3, 3, 3, 2] as const; // sums to 20
const LEAD_TOTAL_TARGET = 20;
const LEAD_VISIBLE = 3;

type LeadNotification = { id: number; day: string };

const LEAD_IDLE_FEED: LeadNotification[] = [
  { id: 18, day: "Sun" },
  { id: 19, day: "Sun" },
  { id: 20, day: "Sun" },
];

function LeadsFunnelAnimation({ active }: AnimationProps) {
  const [feed, setFeed] = useState<LeadNotification[]>(LEAD_IDLE_FEED);
  const [total, setTotal] = useState(LEAD_TOTAL_TARGET);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setFeed(LEAD_IDLE_FEED);
        setTotal(LEAD_TOTAL_TARGET);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    let seq = 0;
    async function loop() {
      while (!cancelled) {
        setFeed([]);
        setTotal(0);
        await new Promise((r) => setTimeout(r, 500));
        if (cancelled) return;
        for (let d = 0; d < LEAD_DAYS.length; d++) {
          for (let k = 0; k < LEAD_PER_DAY[d]; k++) {
            if (cancelled) return;
            seq += 1;
            const id = seq;
            setFeed((prev) => {
              const next: LeadNotification[] = [
                { id, day: LEAD_DAYS[d] },
                ...prev,
              ];
              return next.slice(0, LEAD_VISIBLE);
            });
            setTotal((t) => t + 1);
            await new Promise((r) => setTimeout(r, 160));
          }
        }
        await new Promise((r) => setTimeout(r, 1200));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="flex w-full flex-col items-center gap-2 px-2">
      <div className="flex flex-col items-center">
        <motion.span
          key={total}
          className="text-foreground font-display text-3xl font-black tabular-nums"
          initial={{ opacity: 0.7, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING_SNAP}
        >
          {total}
        </motion.span>
        <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
          qualified leads · 7 days
        </span>
      </div>

      <div className="flex w-full max-w-[180px] flex-col gap-1">
        <AnimatePresence initial={false}>
          {feed.map((n) => (
            <motion.div
              key={n.id}
              layout
              className="border-primary/20 bg-primary/10 flex items-center gap-2 rounded-md border px-2 py-1"
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={SPRING_SOFT}
            >
              <motion.span
                className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.55, ease: EASE_SOFT }}
              />
              <span className="text-foreground flex-1 font-mono text-[10px]">
                New lead · {n.day}
              </span>
              <span className="bg-primary/20 text-primary rounded-sm px-1 font-mono text-[9px]">
                +1
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const MODEL_NAMES = ["OpenAI", "Claude"] as const;

// Each model has a set of "summary variants" — arrays of line widths (as % of
// the card's content width). When the model is active, its lines re-animate.
const MODEL_LINE_VARIANTS: readonly (readonly number[])[][] = [
  // OpenAI variants
  [
    [85, 60, 70],
    [78, 90, 55],
    [65, 80, 72],
  ],
  // Claude variants
  [
    [70, 88, 60, 45],
    [82, 65, 75, 50],
    [58, 78, 68, 80],
  ],
];

function ModelIterationAnimation({ active }: AnimationProps) {
  // activeModel: 0 = OpenAI, 1 = Claude. iter advances per model independently.
  const [activeModel, setActiveModel] = useState<0 | 1>(1);
  const [iters, setIters] = useState<[number, number]>([2, 2]);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setActiveModel(1);
        setIters([2, 2]);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1800));
        if (cancelled) return;
        // Swap active model and advance the newly-active model's iteration.
        setActiveModel((prev) => {
          const next = ((prev + 1) % 2) as 0 | 1;
          setIters((its) => {
            const updated: [number, number] = [its[0], its[1]];
            updated[next] = (its[next] + 1) % MODEL_LINE_VARIANTS[next].length;
            return updated;
          });
          return next;
        });
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="flex w-full items-stretch justify-center gap-3 px-2">
      {/* Source doc chip */}
      <div className="flex items-center">
        <div className="bg-foreground/85 text-background rounded-md px-2 py-1 font-mono text-[10px]">
          paper.pdf
        </div>
        <motion.span
          className="text-muted-foreground ml-1 font-mono text-[12px]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </div>

      {/* Two model cards */}
      <div className="flex flex-1 gap-2">
        {MODEL_NAMES.map((name, i) => {
          const isActive = i === activeModel;
          const lines = MODEL_LINE_VARIANTS[i][iters[i]];
          return (
            <motion.div
              key={name}
              className="bg-card border-border/60 relative flex flex-1 flex-col gap-1.5 rounded-lg border p-2.5"
              animate={{ opacity: isActive ? 1 : 0.5 }}
              transition={{ duration: 0.45, ease: EASE_SOFT }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <span className="text-foreground font-mono text-[9px] font-medium">
                  {name}
                </span>
                <div className="relative h-1.5 w-1.5">
                  {isActive && (
                    <motion.div
                      layoutId="model-active-dot"
                      className="bg-primary absolute inset-0 rounded-full"
                      transition={SPRING_SOFT}
                    />
                  )}
                </div>
              </div>

              {/* Animated summary lines */}
              <div className="flex flex-col gap-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${i}-${iters[i]}-${isActive}`}
                    className="flex flex-col gap-1"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.35, ease: EASE_SOFT }}
                  >
                    {lines.map((w, li) => (
                      <motion.div
                        key={li}
                        className="bg-muted h-1.5 rounded-full"
                        initial={
                          isActive && li === 0
                            ? { width: 0 }
                            : { width: `${w}%` }
                        }
                        animate={{ width: `${w}%` }}
                        transition={{
                          duration: isActive && li === 0 ? 0.6 : 0.45,
                          delay: isActive ? li * 0.08 : 0,
                          ease: EASE_SOFT,
                        }}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// coded-logo — one SVG mark cycling through 4 token-aware variants
// ---------------------------------------------------------------------------

type LogoVariant = "brand-light" | "brand-dark" | "mono-light" | "mono-dark";

const LOGO_VARIANTS: LogoVariant[] = [
  "brand-light",
  "brand-dark",
  "mono-light",
  "mono-dark",
];

const LOGO_VARIANT_LABELS: Record<
  LogoVariant,
  { swatch: string; label: string }
> = {
  "brand-light": { swatch: "brand/primary", label: "AzulProfundo" },
  "brand-dark": { swatch: "brand/primary", label: "azulafi" },
  "mono-light": { swatch: "fg/default", label: "base.black" },
  "mono-dark": { swatch: "fg/default", label: "base.white" },
};

function CodedLogoAnimation({ active }: AnimationProps) {
  const [variantIdx, setVariantIdx] = useState(0);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setVariantIdx(0), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        for (let i = 0; i < LOGO_VARIANTS.length; i++) {
          if (cancelled) return;
          setVariantIdx(i);
          await new Promise((r) => setTimeout(r, 1300));
        }
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const variant = LOGO_VARIANTS[variantIdx % LOGO_VARIANTS.length]!;
  const meta = LOGO_VARIANT_LABELS[variant];
  const isDark = variant === "brand-dark" || variant === "mono-dark";
  const isMono = variant === "mono-light" || variant === "mono-dark";

  return (
    <div className="flex w-full flex-col items-center gap-3 px-3">
      {/* Swatch background showing the surface the mark sits on */}
      <motion.div
        className="relative flex h-[72px] w-[72px] items-center justify-center rounded-xl"
        animate={{
          backgroundColor: isDark
            ? "hsl(var(--foreground))"
            : "hsl(var(--card))",
          boxShadow: "0 0 0 1px hsl(var(--border))",
        }}
        transition={{ duration: 0.7, ease: EASE_SOFT }}
      >
        {/* Simplified geometric "A" mark — circle with internal crossbar */}
        <motion.svg
          viewBox="0 0 32 32"
          width={36}
          height={36}
          aria-hidden
          animate={{
            color: isMono
              ? isDark
                ? "hsl(var(--background))"
                : "hsl(var(--foreground))"
              : "hsl(var(--primary))",
          }}
          transition={{ duration: 0.6, ease: EASE_SOFT }}
        >
          {/* Outer circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          {/* Triangle peak to bottom-left and bottom-right */}
          <path
            d="M16 6 L7 26 L25 26 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Crossbar */}
          <line
            x1="10"
            y1="20"
            x2="22"
            y2="20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>

      {/* Token label row */}
      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          className="flex flex-col items-center gap-0.5"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: EASE_SOFT }}
        >
          <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
            {meta.swatch}
          </span>
          <span className="text-foreground font-mono text-[10px] font-medium">
            {meta.label}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Variant dots */}
      <div className="flex gap-1">
        {LOGO_VARIANTS.map((_, i) => (
          <motion.div
            key={i}
            className="bg-foreground rounded-full"
            animate={{
              width: i === variantIdx ? 14 : 4,
              opacity: i === variantIdx ? 1 : 0.25,
            }}
            style={{ height: 4 }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// token-inspect — hover a component, popup reveals the tokens behind it
// ---------------------------------------------------------------------------

function TokenInspectAnimation({ active }: AnimationProps) {
  const [stage, setStage] = useState<"idle" | "hover" | "popup">("idle");

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setStage("idle");
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setStage("idle");
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) return;
        setStage("hover");
        await new Promise((r) => setTimeout(r, 450));
        if (cancelled) return;
        setStage("popup");
        await new Promise((r) => setTimeout(r, 2400));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const tokens: Array<{ prop: string; value: string }> = [
    { prop: "padding", value: "spacing/md" },
    { prop: "color", value: "action/primary" },
    { prop: "radius", value: "radius/md" },
  ];

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-3 px-3 py-2">
      <motion.div
        className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-[11px] font-medium shadow-sm"
        animate={{
          scale: stage === "hover" || stage === "popup" ? 1.04 : 1,
          y: stage === "hover" || stage === "popup" ? -1 : 0,
        }}
        transition={{ duration: 0.25, ease: EASE_SOFT }}
      >
        Save changes
      </motion.div>

      <AnimatePresence>
        {stage === "popup" && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: EASE_SOFT }}
            style={{ backgroundColor: "#1e1e1e", color: "#e0e0e0" }}
            className="flex flex-col gap-0.5 rounded-md px-2.5 py-1.5 font-mono text-[9px] shadow-lg"
          >
            {tokens.map((t, i) => (
              <motion.div
                key={t.prop}
                initial={{ opacity: 0, x: -3 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: 0.08 + i * 0.07,
                  ease: EASE_SOFT,
                }}
              >
                <span style={{ color: "#7ec699" }}>{t.prop}</span>
                <span style={{ color: "#666" }}>: </span>
                <span style={{ color: "#e0e0e0" }}>{t.value}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// playground — mock playground UI with toggle, token panel, copy pulse
// ---------------------------------------------------------------------------

function PlaygroundAnimation({ active }: AnimationProps) {
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setToggle1(false);
        setToggle2(false);
        setShowCopy(false);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        // click toggle 1
        setToggle1((v) => !v);
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) return;
        // click toggle 2
        setToggle2((v) => !v);
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) return;
        // copy pulse
        setShowCopy(true);
        await new Promise((r) => setTimeout(r, 900));
        if (cancelled) return;
        setShowCopy(false);
        await new Promise((r) => setTimeout(r, 1100));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  // Token labels update based on toggles
  const paddingToken = toggle1 ? "spacing/lg" : "spacing/md";
  const colorToken = toggle2 ? "brand/secondary" : "brand/primary";

  return (
    <div className="flex w-full flex-col gap-2 px-2 font-mono">
      {/* Rendered component preview */}
      <div className="flex items-center justify-center py-1">
        <motion.div
          className="bg-primary text-primary-foreground rounded-md font-mono text-[10px] font-medium"
          animate={{
            paddingLeft: toggle1 ? 14 : 10,
            paddingRight: toggle1 ? 14 : 10,
          }}
          style={{ paddingTop: 5, paddingBottom: 5 }}
          transition={{ duration: 0.4, ease: EASE_SOFT }}
        >
          Button
        </motion.div>
      </div>

      {/* Toggle row */}
      <div className="flex items-center gap-2">
        {/* Toggle 1 */}
        <motion.div
          className="relative h-3 w-6 cursor-pointer rounded-full"
          animate={{
            backgroundColor: toggle1
              ? "hsl(var(--primary))"
              : "hsl(var(--muted))",
          }}
          transition={{ duration: 0.45, ease: EASE_SOFT }}
        >
          <motion.div
            className="bg-primary-foreground absolute top-0.5 h-2 w-2 rounded-full"
            animate={{ x: toggle1 ? 12 : 2 }}
            transition={{ duration: 0.45, ease: EASE_SOFT }}
          />
        </motion.div>
        <span className="text-muted-foreground text-[9px]">size</span>

        {/* Toggle 2 */}
        <motion.div
          className="relative h-3 w-6 cursor-pointer rounded-full"
          animate={{
            backgroundColor: toggle2
              ? "hsl(var(--primary))"
              : "hsl(var(--muted))",
          }}
          transition={{ duration: 0.45, ease: EASE_SOFT }}
        >
          <motion.div
            className="bg-primary-foreground absolute top-0.5 h-2 w-2 rounded-full"
            animate={{ x: toggle2 ? 12 : 2 }}
            transition={{ duration: 0.45, ease: EASE_SOFT }}
          />
        </motion.div>
        <span className="text-muted-foreground text-[9px]">variant</span>
      </div>

      {/* Token chips */}
      <div className="flex gap-1.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={paddingToken}
            className="border-border/50 bg-muted text-foreground rounded-sm border px-1.5 py-0.5 text-[8px]"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.3, ease: EASE_SOFT }}
          >
            {paddingToken}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={colorToken}
            className="border-border/50 bg-muted text-foreground rounded-sm border px-1.5 py-0.5 text-[8px]"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.3, ease: EASE_SOFT }}
          >
            {colorToken}
          </motion.span>
        </AnimatePresence>

        {/* Copy indicator */}
        <AnimatePresence>
          {showCopy && (
            <motion.span
              key="copy"
              className="bg-primary/15 text-primary rounded-sm px-1.5 py-0.5 text-[8px] font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={SPRING_SNAP}
            >
              ✓ copied
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ai-teammate — 4 avatar circles + rule-shelf, AI references rules sequentially
// ---------------------------------------------------------------------------

const RULE_FILES = ["AGENTS.md", "CLAUDE.md", "design.md"] as const;
const TEAM_LABELS = ["DES", "DEV1", "DEV2", "AI"] as const;

type AITeammateStep = "idle" | "ref-0" | "ref-1" | "ref-2" | "produce";

function AITeammateAnimation({ active }: AnimationProps) {
  const [step, setStep] = useState<AITeammateStep>("idle");
  const [showTile, setShowTile] = useState(false);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setStep("idle");
        setShowTile(false);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setStep("idle");
        setShowTile(false);
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;

        for (let i = 0; i < RULE_FILES.length; i++) {
          if (cancelled) return;
          setStep(`ref-${i}` as AITeammateStep);
          await new Promise((r) => setTimeout(r, 950));
        }

        if (cancelled) return;
        setStep("produce");
        setShowTile(true);
        await new Promise((r) => setTimeout(r, 1500));
        if (cancelled) return;

        setShowTile(false);
        await new Promise((r) => setTimeout(r, 600));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const activeRuleIdx =
    step === "ref-0" ? 0 : step === "ref-1" ? 1 : step === "ref-2" ? 2 : -1;

  return (
    <div className="flex w-full flex-col items-center gap-3 px-2">
      {/* Rule shelf */}
      <div className="flex gap-1.5">
        {RULE_FILES.map((f, i) => (
          <motion.div
            key={f}
            className="border-border/50 rounded-sm border px-2 py-0.5 font-mono text-[8px]"
            animate={{
              backgroundColor:
                activeRuleIdx === i
                  ? "hsl(var(--primary) / 0.15)"
                  : "transparent",
              borderColor:
                activeRuleIdx === i
                  ? "hsl(var(--primary) / 0.5)"
                  : "hsl(var(--border) / 0.5)",
              color:
                activeRuleIdx === i
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))",
            }}
            transition={{ duration: 0.5, ease: EASE_SOFT }}
          >
            {f}
          </motion.div>
        ))}
      </div>

      {/* Connecting line from AI to active rule */}
      <div className="relative flex h-5 w-full items-center justify-center">
        <AnimatePresence>
          {activeRuleIdx >= 0 && (
            <motion.div
              key={activeRuleIdx}
              className="bg-primary/50 absolute h-px"
              style={{ width: "60%" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_SOFT }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Avatar row */}
      <div className="flex items-center gap-3">
        {TEAM_LABELS.map((label, i) => {
          const isAI = i === 3;
          const isActive = isAI && (activeRuleIdx >= 0 || step === "produce");
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <motion.div
                className="border-border/50 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[8px]"
                animate={{
                  backgroundColor: isActive
                    ? "hsl(var(--primary) / 0.15)"
                    : "hsl(var(--muted) / 0.4)",
                  borderColor: isActive
                    ? "hsl(var(--primary) / 0.6)"
                    : "hsl(var(--border) / 0.5)",
                  color: isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted-foreground))",
                }}
                transition={{ duration: 0.5, ease: EASE_SOFT }}
              >
                {label}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Produced tile */}
      <AnimatePresence>
        {showTile && (
          <motion.div
            key="tile"
            className="bg-primary/10 border-primary/30 text-primary rounded-md border px-3 py-1 font-mono text-[9px]"
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.92 }}
            transition={SPRING_SOFT}
          >
            component ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// port-diff — split frame: React pill animation → arrows → Angular pill builds
// ---------------------------------------------------------------------------

const PORT_DIFF_ARROW_LABELS = ["HTML", "SCSS", "TS"] as const;
const PORT_DIFF_SEGMENT_LABELS = ["A", "B", "C"] as const;

function PillSegments({ pos, dim }: { pos: number; dim?: boolean }) {
  return (
    <div className="border-border/50 relative flex overflow-hidden rounded-full border">
      {PORT_DIFF_SEGMENT_LABELS.map((l, i) => (
        <div
          key={l}
          className="relative px-2 py-0.5 font-mono text-[8px]"
          style={{ opacity: dim ? 0.4 : 1 }}
        >
          <span className="text-muted-foreground relative z-10">{l}</span>
          {i === pos && (
            <motion.div
              layoutId={dim ? "ang-pill" : "react-pill"}
              className="bg-primary/20 border-primary/50 absolute inset-0 rounded-full border"
              transition={{ duration: 0.4, ease: EASE_SOFT }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PortDiffAnimation({ active }: AnimationProps) {
  const [reactPillPos, setReactPillPos] = useState(0); // 0 | 1 | 2
  const [angularPillPos, setAngularPillPos] = useState(0);
  const [angularLines, setAngularLines] = useState(0); // 0..3
  const [arrowIdx, setArrowIdx] = useState(-1);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setReactPillPos(0);
        setAngularPillPos(0);
        setAngularLines(0);
        setArrowIdx(-1);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        // React plays
        for (let i = 1; i <= 2; i++) {
          if (cancelled) return;
          setReactPillPos(i);
          await new Promise((r) => setTimeout(r, 700));
        }
        if (cancelled) return;
        setReactPillPos(0);
        await new Promise((r) => setTimeout(r, 500));

        // Arrows pulse
        for (let i = 0; i < 3; i++) {
          if (cancelled) return;
          setArrowIdx(i);
          await new Promise((r) => setTimeout(r, 500));
        }
        setArrowIdx(-1);

        // Angular lines build
        setAngularLines(0);
        for (let i = 1; i <= 3; i++) {
          if (cancelled) return;
          setAngularLines(i);
          await new Promise((r) => setTimeout(r, 420));
        }
        await new Promise((r) => setTimeout(r, 500));

        // Angular plays
        if (cancelled) return;
        for (let i = 1; i <= 2; i++) {
          if (cancelled) return;
          setAngularPillPos(i);
          await new Promise((r) => setTimeout(r, 700));
        }
        if (cancelled) return;
        setAngularPillPos(0);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="flex w-full items-center gap-2 px-1">
      {/* React side */}
      <div className="flex flex-1 flex-col items-center gap-2">
        <span className="text-muted-foreground font-mono text-[8px] tracking-wider">
          React
        </span>
        {/* Code silhouette */}
        <div className="flex w-full flex-col gap-1 px-1">
          {[70, 90, 55].map((w, i) => (
            <div
              key={i}
              className="bg-foreground/15 h-1.5 rounded-full"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <PillSegments pos={reactPillPos} />
      </div>

      {/* Arrows column */}
      <div className="flex flex-col items-center gap-1">
        {PORT_DIFF_ARROW_LABELS.map((lbl, i) => (
          <motion.div
            key={lbl}
            className="flex items-center gap-0.5"
            animate={{
              opacity: arrowIdx === i ? 1 : 0.25,
            }}
            transition={{ duration: 0.4, ease: EASE_SOFT }}
          >
            <span className="text-muted-foreground font-mono text-[7px]">
              {lbl}
            </span>
            <span className="text-primary font-mono text-[8px]">→</span>
          </motion.div>
        ))}
      </div>

      {/* Angular side */}
      <div className="flex flex-1 flex-col items-center gap-2">
        <span className="text-muted-foreground font-mono text-[8px] tracking-wider">
          Angular
        </span>
        {/* Building code silhouette */}
        <div className="flex w-full flex-col gap-1 px-1">
          {[70, 90, 55].map((w, i) => (
            <motion.div
              key={i}
              className="bg-foreground/15 h-1.5 rounded-full"
              animate={{ width: angularLines > i ? `${w}%` : "0%" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: EASE_SOFT,
              }}
            />
          ))}
        </div>
        <PillSegments pos={angularPillPos} dim={angularLines < 3} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// motion-tokens — 3 shapes animate IN with out-soft, pause, OUT with in-firm
// ---------------------------------------------------------------------------

type MotionTokensPhase = "in" | "hold-in" | "out" | "hold-out";

const MOTION_SHAPES = [
  { label: "Button", cls: "bg-primary h-4 w-14 rounded-md" },
  { label: "Card", cls: "border-border/60 h-8 w-20 rounded-lg border" },
  { label: "Toast", cls: "bg-muted h-5 w-16 rounded-md" },
] as const;

function MotionTokensAnimation({ active }: AnimationProps) {
  const [phase, setPhase] = useState<MotionTokensPhase>("hold-in");

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setPhase("hold-in"), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        // Animate IN
        setPhase("in");
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;
        setPhase("hold-in");
        await new Promise((r) => setTimeout(r, 1600));
        if (cancelled) return;
        // Animate OUT
        setPhase("out");
        await new Promise((r) => setTimeout(r, 500));
        if (cancelled) return;
        setPhase("hold-out");
        await new Promise((r) => setTimeout(r, 900));
        if (cancelled) return;
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const isIn = phase === "in" || phase === "hold-in";
  const labelText =
    phase === "out" || phase === "hold-out"
      ? "kt360 / motion.ease.in-firm · ~160ms"
      : "kt360 / motion.ease.out-soft · ~240ms";

  return (
    <div className="flex w-full flex-col items-center gap-3 px-3">
      {/* Component shapes */}
      <div className="flex w-full flex-col items-center gap-2">
        {MOTION_SHAPES.map((shape, i) => (
          <motion.div
            key={shape.label}
            className={shape.cls}
            animate={{
              opacity: isIn ? 1 : 0,
              y: isIn ? 0 : phase === "out" ? -8 : 8,
            }}
            transition={{
              duration: phase === "in" ? 0.24 : phase === "out" ? 0.16 : 0,
              delay:
                phase === "in"
                  ? i * 0.09
                  : (MOTION_SHAPES.length - 1 - i) * 0.06,
              ease: phase === "in" ? EASE_SOFT : EASE,
            }}
          />
        ))}
      </div>

      {/* Token label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={labelText}
          className="text-muted-foreground font-mono text-[9px]"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.3, ease: EASE_SOFT }}
        >
          {labelText}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// vi-* — visual-identity's own figures, not generic loops. Each was built for
// a specific beat of that case study (the Mobbin moodboard, the digit-width
// test, the live component demo, the micro-interaction demo) and is fully
// interactive on its own, so these adapters just read `lang` and render it —
// no `active`-driven loop like the animations above. `w-full` matches how
// every animation above sizes itself to the card; these figures don't set it
// on their own root because they were authored for article width, not a card
// face.
// ---------------------------------------------------------------------------

function VIMoodboardAnimation() {
  const { lang } = useLang();
  return (
    <div className="w-full p-3">
      <MoodboardGalleryFigure lang={lang} />
    </div>
  );
}

function VITypeTestAnimation({ active }: AnimationProps) {
  const { lang } = useLang();
  return (
    <div className="w-full p-3">
      <TypeTestFigure lang={lang} active={active} />
    </div>
  );
}

function VIComponentsAnimation() {
  const { lang } = useLang();
  return (
    <div className="w-full p-3">
      <ComponentsDemoFigure lang={lang} />
    </div>
  );
}

function VIMicroAnimation() {
  const { lang } = useLang();
  return (
    <div className="w-full p-3">
      <MicroInteractionsDemoFigure lang={lang} />
    </div>
  );
}

const ANIMATIONS: Record<
  NonNullable<BentoCard["animation"]>,
  (props: AnimationProps) => JSX.Element
> = {
  layers: LayersAnimation,
  nodes: NodesAnimation,
  moodboard: MoodboardAnimation,
  "code-to-site": CodeToSiteAnimation,
  pulse: PulseAnimation,
  palette: PaletteAnimation,
  rules: RulesAnimation,
  cursor: CursorAnimation,
  "token-inspect": TokenInspectAnimation,
  canvas: CanvasAnimation,
  guideline: GuidelineAnimation,
  wordpress: WordpressAnimation,
  "logo-identity": LogoIdentityAnimation,
  "journey-scene": JourneySceneAnimation,
  "affirmation-morph": AffirmationMorphAnimation,
  "organic-bundle": OrganicBundleAnimation,
  "user-feedback": UserFeedbackAnimation,
  "audience-pivot": AudiencePivotAnimation,
  "hours-stat": HoursStatAnimation,
  "leads-funnel": LeadsFunnelAnimation,
  "model-iteration": ModelIterationAnimation,
  "asset-portal": AssetPortalAnimation,
  "comment-pins": CommentPinsAnimation,
  "coded-logo": CodedLogoAnimation,
  playground: PlaygroundAnimation,
  "ai-teammate": AITeammateAnimation,
  "port-diff": PortDiffAnimation,
  "motion-tokens": MotionTokensAnimation,
  "vi-moodboard": VIMoodboardAnimation,
  "vi-type-test": VITypeTestAnimation,
  "vi-components": VIComponentsAnimation,
  "vi-micro": VIMicroAnimation,
  "vi-nine-principles": VINinePrinciplesAnimation,
};

function BentoCardItem({
  card,
  gallery,
}: {
  card: BentoCard;
  gallery?: boolean;
}) {
  const { lang } = useLang();
  const Animation = card.animation ? ANIMATIONS[card.animation] : null;
  const [active, setActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Theme for `card.video`'s variant suffix. Light until mounted, matching
  // CardMedia — the resolved theme isn't known on the server, and guessing
  // dark would flash the wrong clip on a light page.
  const { resolvedTheme } = useTheme();
  const [videoMounted, setVideoMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setVideoMounted(true), []);
  const mode = videoMounted && resolvedTheme === "dark" ? "dark" : "light";
  const isMobile = useIsMobile();
  const [mobileVariant, setMobileVariant] = useState<"idle" | "hover">("idle");
  const [iframeOpen, setIframeOpen] = useState(false);
  /**
   * The live demo mounts on click, not on page load.
   *
   * The embedded app focuses an element when it routes, and a focused element inside
   * an iframe scrolls the PARENT document to bring it into view — so arriving at the
   * case study jumped you straight past the context to the demo. `loading="lazy"`
   * doesn't help; the scroll comes from focus, not from fetch. Deferring the mount
   * also means a third-party Angular app isn't booted for every visitor who never
   * clicks it.
   */
  const [iframeMounted, setIframeMounted] = useState(false);

  useEffect(() => {
    if (!iframeOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIframeOpen(false);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [iframeOpen]);

  const openIframeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIframeOpen(true);
  };

  useEffect(() => {
    if (!isMobile) return;
    const SHOW = 2200;
    const HIDE = 1200;
    let timer: ReturnType<typeof setTimeout>;
    function cycle(current: "idle" | "hover") {
      const next = current === "idle" ? "hover" : "idle";
      const delay = current === "idle" ? SHOW : HIDE;
      setMobileVariant(next);
      timer = setTimeout(() => cycle(next), delay);
    }
    timer = setTimeout(() => cycle("idle"), 600);
    return () => clearTimeout(timer);
  }, [isMobile]);

  const inner = (
    <>
      <div className="bg-card flex min-h-[120px] flex-1 items-center justify-center overflow-hidden rounded-xl">
        {card.iframe ? (
          <div className="relative h-[640px] w-full bg-white">
            {iframeMounted ? (
              <iframe
                src={card.iframe}
                title={pick(card.label, lang)}
                sandbox="allow-scripts allow-same-origin allow-forms"
                className="h-full w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIframeMounted(true);
                }}
                className="bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground absolute inset-0 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <span className="text-foreground text-sm font-medium">
                  {lang === "es"
                    ? "Cargar la demo en vivo"
                    : "Load the live demo"}
                </span>
                <span className="max-w-[38ch] text-center text-xs">
                  {lang === "es"
                    ? "Se abre la app real dentro de la página."
                    : "Loads the real app inside this page."}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={openIframeModal}
              aria-label="Open demo in fullscreen"
              className="bg-foreground/80 text-background hover:bg-foreground absolute top-3 right-3 z-10 rounded-md p-2 backdrop-blur-sm transition-colors"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
        ) : card.images && card.images.length > 0 ? (
          <div className="grid h-full w-full grid-cols-2 gap-1.5 p-1.5">
            {card.images.map((src, i) => (
              <div
                key={i}
                className="bg-muted/40 flex items-center justify-center overflow-hidden rounded-lg"
              >
                <img
                  src={src}
                  alt=""
                  className="ease-out-soft h-full w-full object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.05]"
                />
              </div>
            ))}
          </div>
        ) : card.video ? (
          <video
            // Keyed on the resolved src so a language or theme change swaps the
            // file — React reuses a <video> element across prop changes and a
            // <source> swap alone doesn't reload it.
            key={`${card.video}_${lang}_${mode}`}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            ref={(el) => {
              if (el) el.muted = true;
            }}
          >
            <source
              src={`${card.video}_${lang}_${mode}_thumb.mp4`}
              type="video/mp4"
            />
          </video>
        ) : card.image ? (
          <img
            src={card.image}
            alt={pick(card.label, lang)}
            className="ease-out-soft h-full w-full object-contain transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
          />
        ) : Animation ? (
          <Animation active={isMobile ? mobileVariant === "hover" : active} />
        ) : null}
      </div>
      {gallery ? null : (
        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-foreground text-sm font-medium">
            {pick(card.label, lang)}
          </span>
          <span className="text-muted-foreground text-xs">
            {pick(card.sublabel, lang)}
          </span>
        </div>
      )}
    </>
  );

  const baseClass =
    "group bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5";

  if (card.details) {
    return (
      <>
        {/* A detail card is clickable and has to look it. The home page's WorkCard
            makes that obvious by swapping its media for a glass panel on hover, but
            the same treatment here would cover the animation the reader is hovering
            to watch. So it borrows the chrome instead of the panel: the same ring and
            shadow lift.

            The detail copy expands IN the card — it used to open a dialog. Only the
            playground demo opens one now, so a click means one thing everywhere: this
            card grows, that card launches the live app. Collapsed, the first beat is
            clipped under a gradient so there's visibly more to read.

            The card is a DIV, not a <button>, because detail copy can carry an inline
            IntroPreviewLink (the token beat backlinks the color methodology) and a
            link inside a button is invalid HTML — browsers won't reliably fire it.
            The whole card still toggles on click for pointer users (skipping clicks
            that land on a link or a form control — the visual-identity components
            demo has a real text input on its face); the "read more" row below is the
            real <button>, so keyboard and screen-reader users get a proper
            disclosure control. */}
        <motion.div
          className={`${baseClass} hover:ring-border group relative w-full cursor-pointer text-left transition-all hover:shadow-md hover:ring-1`}
          initial="rest"
          whileHover={!isMobile ? "hover" : undefined}
          animate={isMobile ? mobileVariant : "rest"}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onTouchStart={() => setActive(true)}
          onClick={(e) => {
            if (
              (e.target as HTMLElement).closest(
                "a, button, input, textarea, select, label"
              )
            )
              return;
            setExpanded((v) => !v);
          }}
        >
          {inner}

          <div className="relative">
            <motion.div
              initial={false}
              animate={{ height: expanded ? "auto" : 44 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3">
                {card.details.sections.map((section, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {section.label ? (
                      <h3 className="text-foreground text-[10px] font-semibold tracking-wider uppercase">
                        {pick(section.label, lang)}
                      </h3>
                    ) : null}
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {pick(section.body, lang)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* from-card, so the fade lands on the card's own surface in both themes. */}
            <motion.div
              aria-hidden
              initial={false}
              animate={{ opacity: expanded ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent"
            />
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            aria-expanded={expanded}
            aria-label={pick(card.label, lang)}
            className="text-muted-foreground group-hover:text-foreground focus-visible:ring-border flex w-fit cursor-pointer items-center gap-1 rounded-sm font-mono text-[10px] tracking-wider transition-colors duration-[var(--duration-base)] focus-visible:ring-1 focus-visible:outline-none"
          >
            {expanded ? t("home.read_less", lang) : t("home.read_more", lang)}
            <ArrowRight
              className={`size-3 transition-transform duration-[var(--duration-base)] ${
                expanded ? "-rotate-90" : "rotate-90"
              }`}
            />
          </button>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <motion.div
        className={baseClass}
        initial="rest"
        whileHover={!isMobile ? "hover" : undefined}
        animate={isMobile ? mobileVariant : "rest"}
        tabIndex={0}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onTouchStart={() => setActive(true)}
      >
        {inner}
      </motion.div>
      {card.iframe && iframeOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={pick(card.label, lang)}
          onClick={() => setIframeOpen(false)}
          className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-border relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
          >
            <div className="border-border bg-card flex shrink-0 items-center justify-between border-b px-4 py-3">
              <span className="text-foreground text-sm font-medium">
                {pick(card.label, lang)}
              </span>
              <button
                type="button"
                onClick={() => setIframeOpen(false)}
                aria-label="Close demo"
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1.5 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <iframe
              src={card.iframe}
              title={pick(card.label, lang)}
              sandbox="allow-scripts allow-same-origin allow-forms"
              className="flex-1 border-0 bg-white"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CaseStudyBento({
  cards,
  gallery,
}: {
  cards: BentoCard[];
  gallery?: boolean;
}) {
  const hasTall = cards.some((c) => c.span === "tall");

  if (hasTall) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((card, i) => {
          const spanClass =
            card.span === "tall"
              ? "sm:col-span-1 sm:row-span-2"
              : card.span === "wide"
                ? "sm:col-span-2 sm:row-span-1"
                : card.span === "full"
                  ? "sm:col-span-3 sm:row-span-1"
                  : "sm:col-span-1 sm:row-span-1";
          return (
            <motion.div
              key={card.label.en}
              className={spanClass}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
            >
              <BentoCardItem card={card} gallery={gallery} />
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((card, i) => (
        <motion.div
          key={card.label.en}
          className={
            card.span === "wide" || card.span === "full" ? "sm:col-span-2" : ""
          }
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
        >
          <BentoCardItem card={card} gallery={gallery} />
        </motion.div>
      ))}
    </div>
  );
}
