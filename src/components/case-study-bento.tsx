"use client";

import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { useEffect, useState, type JSX } from "react";

import type { BentoCard } from "@/lib/content/case-studies";

const EASE = [0.2, 0.8, 0.2, 1] as const;

const TOKEN_CHAIN = [
  { label: "blue/500", sub: "primitive" },
  { label: "--color-primary", sub: "semantic" },
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
      {/* Left-side connector line (behind rows) */}
      <div className="pointer-events-none absolute top-4 bottom-4 left-[1.75rem] w-px overflow-hidden">
        <motion.div
          className="bg-foreground/25 h-full w-full origin-top"
          initial={false}
          animate={{ scaleY: connectorDrawn ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>

      <div className="relative flex flex-col gap-1.5">
        {TOKEN_CHAIN.map((token, i) => {
          const isActive = step === i;
          const isVisible = step === -1 ? false : step >= i;
          const isButton = i === 2;

          return (
            <motion.div
              key={token.label}
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
                <motion.button
                  type="button"
                  tabIndex={-1}
                  className="bg-primary text-primary-foreground rounded-md px-2 py-1 font-mono text-[10px] font-medium"
                  animate={{ scale: isActive ? 1.06 : 1 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {token.label}
                </motion.button>
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
          );
        })}
      </div>
    </div>
  );
}

type SwapPhase =
  | "material"
  | "to-prime"
  | "prime-done"
  | "to-custom"
  | "custom-done";

function SwapAnimation({ active }: AnimationProps) {
  const [phase, setPhase] = useState<SwapPhase>("custom-done");

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setPhase("custom-done"), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) break;
        setPhase("to-prime");
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) break;
        setPhase("prime-done");
        await new Promise((r) => setTimeout(r, 1100));
        if (cancelled) break;
        setPhase("to-custom");
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) break;
        setPhase("custom-done");
        await new Promise((r) => setTimeout(r, 1600));
        if (cancelled) break;
        setPhase("material");
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const showCustom = phase === "to-custom" || phase === "custom-done";

  return (
    <div className="flex w-full flex-col items-center gap-3 px-2">
      <div className="flex w-full items-center justify-center gap-2">
        {/* Material */}
        <motion.div
          className="border-border bg-muted rounded-xl border px-3 py-2 font-mono text-xs"
          animate={{
            opacity: phase !== "material" ? 0.2 : 1,
            scale: phase !== "material" ? 0.9 : 1,
          }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          Material
        </motion.div>

        <motion.span
          className="text-muted-foreground text-xs"
          animate={{
            opacity: phase === "to-prime" || phase === "to-custom" ? 1 : 0.25,
          }}
          transition={{ duration: 0.3 }}
        >
          →
        </motion.span>

        {/* PrimeNG */}
        <div className="relative">
          <motion.div
            className="rounded-xl px-3 py-2 font-mono text-xs"
            animate={{
              backgroundColor: showCustom
                ? "hsl(var(--muted))"
                : "hsl(var(--primary))",
              color: showCustom
                ? "hsl(var(--foreground))"
                : "hsl(var(--primary-foreground))",
              opacity: showCustom ? 0.25 : phase === "material" ? 0.35 : 1,
              scale: phase === "prime-done" ? 1.08 : showCustom ? 0.9 : 1,
            }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            PrimeNG
          </motion.div>
          <motion.span
            className="text-primary absolute -top-2 -right-2 text-xs"
            animate={{
              opacity: phase === "prime-done" ? 1 : 0,
              scale: phase === "prime-done" ? 1 : 0.4,
            }}
            transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            ✓
          </motion.span>
        </div>

        <motion.span
          className="text-muted-foreground text-xs"
          animate={{
            opacity: phase === "to-custom" || phase === "custom-done" ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          →
        </motion.span>

        {/* Custom */}
        <div className="relative">
          <motion.div
            className="rounded-xl px-3 py-2 font-mono text-xs"
            animate={{
              backgroundColor: showCustom
                ? "hsl(var(--primary))"
                : "hsl(var(--muted))",
              color: showCustom
                ? "hsl(var(--primary-foreground))"
                : "hsl(var(--foreground))",
              opacity: showCustom ? 1 : 0,
              scale: phase === "custom-done" ? 1.08 : showCustom ? 1 : 0.8,
            }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            Custom
          </motion.div>
          <motion.span
            className="text-primary absolute -top-2 -right-2 text-xs"
            animate={{
              opacity: phase === "custom-done" ? 1 : 0,
              scale: phase === "custom-done" ? 1 : 0.4,
            }}
            transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            ✓
          </motion.span>
        </div>
      </div>

      <div className="bg-muted relative h-1 w-full overflow-hidden rounded-full">
        <motion.div
          className="bg-primary absolute inset-y-0 left-0 rounded-full"
          animate={{
            width:
              phase === "material"
                ? "0%"
                : phase === "to-prime"
                  ? "40%"
                  : phase === "prime-done"
                    ? "55%"
                    : phase === "to-custom"
                      ? "80%"
                      : "100%",
          }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>

      <motion.div
        className="flex items-center gap-1.5"
        animate={{
          opacity: phase === "custom-done" ? 1 : 0,
          y: phase === "custom-done" ? 0 : 4,
        }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <span className="text-primary font-mono text-[10px]">✓</span>
        <span className="text-muted-foreground font-mono text-[10px]">
          Design system complete
        </span>
      </motion.div>
    </div>
  );
}

const OUTER_NODES = [
  { id: 0, sx: 18, sy: 14 },
  { id: 1, sx: 102, sy: 10 },
  { id: 2, sx: 118, sy: 48 },
  { id: 3, sx: 95, sy: 82 },
  { id: 4, sx: 22, sy: 80 },
  { id: 5, sx: 8, sy: 46 },
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
    <svg viewBox="0 0 130 96" className="w-full" aria-hidden>
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
              transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
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
            transition={{ duration: 0.3, ease: EASE }}
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
                        duration: 0.25,
                        delay: i * 0.05 + j * 0.03,
                        ease: EASE,
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
            transition={{ duration: 0.3, ease: EASE }}
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
                transition={{ duration: 0.3, delay: 0.05, ease: EASE }}
              />
              <motion.div
                className="bg-muted h-1.5 w-full rounded-full"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: EASE }}
              />
              <motion.div
                className="bg-muted h-1.5 w-4/5 rounded-full"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15, ease: EASE }}
              />
              <motion.div
                className="bg-primary text-primary-foreground mt-0.5 inline-flex w-fit rounded px-1.5 py-0.5 font-mono text-[8px] font-medium"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: EASE }}
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

const BANKS = [
  { name: "Santander", color: "#EC0000" },
  { name: "BBVA", color: "#004481" },
  { name: "CaixaBank", color: "#007BC4" },
  { name: "Bankinter", color: "#FF6B35" },
];

function PaletteAnimation({ active: activeProp }: AnimationProps) {
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
        if (!cancelled) setActiveIdx((p) => (p + 1) % BANKS.length);
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [activeProp]);

  const bank = BANKS[activeIdx];

  return (
    <motion.div
      className="flex w-full flex-1 flex-col justify-center gap-1.5 rounded-xl px-3 py-3"
      animate={{ backgroundColor: bank.color + "20" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {BANKS.map((b, i) => (
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

type RulePhase = "wrong" | "catching" | "fixed";

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
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) break;
        setPhase("catching");
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) break;
        setPhase("fixed");
        await new Promise((r) => setTimeout(r, 900));
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
          const showFixed = rowPhase === "fixed";
          const showWrong = isActive && rowPhase === "wrong";
          const showCatching = isActive && rowPhase === "catching";

          return (
            <motion.div
              key={check.label}
              className="relative flex items-center gap-2 overflow-hidden rounded-md border px-2 py-1"
              animate={{
                opacity: isActive ? 1 : 0.35,
                borderColor: showCatching
                  ? "hsl(var(--primary))"
                  : showFixed
                    ? "hsl(var(--primary) / 0.5)"
                    : "hsl(var(--border))",
              }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {showCatching && (
                <motion.div
                  className="bg-primary/15 pointer-events-none absolute inset-y-0 w-1/3"
                  initial={{ x: "-100%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.55, ease: EASE }}
                />
              )}

              <span
                className={
                  showFixed
                    ? "text-primary"
                    : showWrong
                      ? "text-destructive"
                      : "text-muted-foreground"
                }
              >
                {showFixed ? "✓" : "⚠"}
              </span>
              <span className="text-foreground">{check.label}</span>
              <span className="text-muted-foreground">|</span>
              <AnimatePresence mode="wait" initial={false}>
                {showFixed ? (
                  <motion.span
                    key="fixed"
                    className="text-primary"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    {check.fix}
                  </motion.span>
                ) : (
                  <motion.span
                    key="wrong"
                    className={
                      isActive ? "text-destructive" : "text-muted-foreground"
                    }
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    {check.wrong}
                  </motion.span>
                )}
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

function CursorAnimation({ active }: AnimationProps) {
  const cursor = useAnimationControls();
  const [published, setPublished] = useState(true);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setPublished(true);
        setPressed(false);
        void cursor.start({ x: 0, y: 0, opacity: 0, transition: { duration: 0 } });
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
                transition={{ duration: 0.25, ease: EASE }}
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
                transition={{ duration: 0.12, ease: EASE }}
                initial={false}
                exit={{ opacity: 0 }}
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
          transition={{ duration: 0.3, ease: EASE }}
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
            transition={{ duration: 0.3, ease: EASE }}
          />
        ))}
      </div>
    </motion.div>
  );
}

type GitPhase = "clone" | "files" | "preview" | "published";
const GIT_CMD = "git clone kt360-env";
const FILE_TREE = ["src/", "components/", "globals.css", "README.md"];

function CanvasAnimation({ active }: AnimationProps) {
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
    <div className="w-full px-1">
      <AnimatePresence mode="wait">
        {phase === "clone" && (
          <motion.div
            key="clone"
            className="bg-foreground/5 border-border rounded-lg border px-3 py-2.5 font-mono text-[10px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <span className="text-muted-foreground">$ </span>
            <span className="text-foreground">{GIT_CMD.slice(0, chars)}</span>
            <motion.span
              className="bg-foreground inline-block h-[10px] w-[1px] align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </motion.div>
        )}

        {phase === "files" && (
          <motion.div
            key="files"
            className="flex flex-col gap-1 font-mono text-[10px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <span className="text-foreground font-medium">kt360-env/</span>
            {FILE_TREE.map((f, i) => (
              <motion.div
                key={f}
                className="text-muted-foreground flex items-center gap-1.5 pl-3"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.1, ease: EASE }}
              >
                <span className="text-border">├</span>
                <span>{f}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === "preview" && (
          <motion.div
            key="preview"
            className="border-border overflow-hidden rounded-lg border"
            style={{ height: 88 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="border-border flex items-center gap-1.5 border-b px-2 py-1.5">
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
            <div className="flex flex-col gap-1.5 p-2">
              <div
                className="h-2 w-16 rounded-full"
                style={{ backgroundColor: "#5e5eed", opacity: 0.8 }}
              />
              <div className="bg-muted h-1.5 w-full rounded-full opacity-40" />
              <div className="bg-muted h-1.5 w-4/5 rounded-full opacity-30" />
              <div
                className="mt-0.5 inline-flex rounded-md px-2 py-0.5 font-mono text-[8px] font-medium text-white"
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
            className="flex flex-col items-center justify-center gap-1.5 rounded-lg px-3 py-4"
            style={{ backgroundColor: "#5e5eed12", height: 88 }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span
              className="text-2xl leading-none"
              style={{ color: "#5e5eed" }}
            >
              ✓
            </span>
            <span
              className="font-mono text-[11px] font-medium"
              style={{ color: "#5e5eed" }}
            >
              Deployed
            </span>
            <span
              className="font-mono text-[8px]"
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
            transition={{ duration: 0.25, ease: EASE }}
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
            transition={{ duration: 0.25, ease: EASE }}
          >
            {KT_SWATCHES.map((s, i) => (
              <motion.div
                key={s.hex}
                className="flex flex-col items-center gap-0.5"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.04, ease: EASE }}
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
            transition={{ duration: 0.25, ease: EASE }}
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
                transition={{ duration: 0.2, delay: i * 0.07, ease: EASE }}
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
            transition={{ duration: 0.25, ease: EASE }}
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
            transition={{ duration: 0.3, ease: EASE }}
          />
        ))}
      </div>
    </div>
  );
}

// Mindfulme animations — abstract, metaphor-driven, semantic tokens only.

const JOURNEY_PATHS = [
  "M 8 32 C 40 32, 60 8, 120 12",
  "M 8 32 C 36 32, 56 52, 120 56",
  "M 8 32 C 28 32, 40 20, 60 40 S 96 24, 120 28",
  "M 8 32 C 50 32, 70 32, 120 40",
  "M 8 32 C 30 32, 46 44, 72 18 S 104 48, 120 46",
] as const;

const JOURNEY_END_POINTS = [
  { x: 120, y: 12 },
  { x: 120, y: 56 },
  { x: 120, y: 28 },
  { x: 120, y: 40 },
  { x: 120, y: 46 },
] as const;

function JourneySceneAnimation({ active }: AnimationProps) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setCycle((c) => c + 1), 3000);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="text-foreground flex w-full items-center justify-center px-2">
      <svg
        viewBox="0 0 128 64"
        className="h-full w-full max-w-[320px]"
        aria-hidden
      >
        {/* Start dot */}
        <circle cx="8" cy="32" r="3" fill="currentColor" opacity="0.9" />

        {JOURNEY_PATHS.map((d, i) => (
          <motion.path
            key={`${cycle}-${i}`}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.4}
            initial={active ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: active ? 1.8 : 0,
              delay: active ? i * 0.15 : 0,
              ease: EASE,
            }}
          />
        ))}

        {JOURNEY_END_POINTS.map((p, i) => (
          <motion.circle
            key={`${cycle}-end-${i}`}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill="currentColor"
            opacity={0.6}
            initial={active ? { opacity: 0 } : { opacity: 0.6 }}
            animate={{ opacity: 0.6 }}
            transition={{
              duration: 0.3,
              delay: active ? i * 0.15 + 1.6 : 0,
              ease: EASE,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const AFFIRMATION_PHRASES = [
  "You are enough.",
  "You — right now — are enough.",
  "Today, you did more than enough.",
  "Tomorrow belongs to you.",
] as const;

function AffirmationMorphAnimation({ active }: AnimationProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setIdx(0), 0);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % AFFIRMATION_PHRASES.length);
    }, 1800);
    return () => clearInterval(t);
  }, [active]);

  const activeIdx = active ? idx : 0;

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4">
      <div className="flex h-10 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIdx}
            className="text-foreground text-center font-serif text-base italic"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {AFFIRMATION_PHRASES[activeIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5">
        {AFFIRMATION_PHRASES.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === activeIdx ? 16 : 4,
              backgroundColor:
                i === activeIdx
                  ? "hsl(var(--foreground))"
                  : "hsl(var(--border))",
            }}
            style={{ height: 4 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        ))}
      </div>
    </div>
  );
}

const ORGANIC_SHAPES = [
  "8% 8% 8% 8% / 8% 8% 8% 8%",
  "30% 70% 70% 30% / 30% 30% 70% 70%",
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "40% 60% 70% 30% / 40% 70% 30% 60%",
] as const;

function OrganicBundleAnimation({ active }: AnimationProps) {
  const [idx, setIdx] = useState(2);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setIdx(2), 0);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % ORGANIC_SHAPES.length);
    }, 1400);
    return () => clearInterval(t);
  }, [active]);

  const rotations = [0, 3, -2, 1];

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <motion.div
        className="bg-primary h-20 w-20"
        animate={{
          borderRadius: ORGANIC_SHAPES[idx],
          rotate: rotations[idx],
        }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
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
  pulse,
}: {
  stage: FeedbackStage;
  highlight: boolean;
  pulse: boolean;
}) {
  return (
    <motion.div
      className="border-border bg-card flex h-16 w-10 flex-col gap-1 rounded-md border p-1.5"
      animate={{
        opacity: highlight ? 1 : 0.4,
        scale: pulse ? [1, 1.05, 1] : highlight ? 1 : 0.95,
      }}
      transition={{ duration: pulse ? 0.6 : 0.3, ease: EASE }}
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
          <div className="bg-primary mt-auto h-1 w-1 rounded-full" />
        </>
      )}
    </motion.div>
  );
}

function UserFeedbackAnimation({ active }: AnimationProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(3);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setStep(3), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        for (let i = 0; i < 4; i++) {
          if (cancelled) return;
          setStep(i as 0 | 1 | 2 | 3);
          await new Promise((r) => setTimeout(r, 400));
        }
        if (cancelled) return;
        setStep(4);
        await new Promise((r) => setTimeout(r, 600));
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
      <div className="flex w-full items-center justify-center gap-2 px-2">
        {stages.map((stage, i) => {
          const isHighlight = active ? step === i || step === 4 : true;
          const isPulse = active && step === 4 && i === 3;
          return (
            <div key={stage} className="flex items-center gap-2">
              <FeedbackScreen
                stage={stage}
                highlight={isHighlight}
                pulse={isPulse}
              />
              {i < stages.length - 1 && (
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-foreground/60 h-1 w-1 rounded-full" />
                  <span className="text-muted-foreground text-xs leading-none">
                    →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <motion.span
        className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        shaped by users
      </motion.span>
    </div>
  );
}

const PIVOT_DOTS = 5;

function AudiencePivotAnimation({ active }: AnimationProps) {
  // -1 = reset (right empty, arrow hidden). 0..PIVOT_DOTS = how many dots have migrated.
  const [step, setStep] = useState<number>(PIVOT_DOTS);
  const [arrow, setArrow] = useState(true);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => {
        setStep(PIVOT_DOTS);
        setArrow(true);
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setStep(-1);
        setArrow(false);
        await new Promise((r) => setTimeout(r, 450));
        if (cancelled) return;
        setArrow(true);
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) return;
        setStep(0);
        for (let i = 1; i <= PIVOT_DOTS; i++) {
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, 150));
          setStep(i);
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const started = step >= 0;

  return (
    <div className="flex w-full items-center justify-center gap-4 px-4">
      {/* Left column: B2C */}
      <div className="flex w-20 flex-col items-center gap-2">
        <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
          B2C
        </span>
        <div className="flex flex-col items-center gap-1.5">
          {Array.from({ length: PIVOT_DOTS }).map((_, i) => {
            const migrated = started && step > i;
            return (
              <motion.div
                key={i}
                className="bg-primary h-2 w-2 rounded-full"
                animate={{ opacity: migrated ? 0.25 : 1 }}
                transition={{ duration: 0.35, ease: EASE }}
              />
            );
          })}
        </div>
        <span className="text-foreground font-mono text-[10px]">$8K MRR</span>
      </div>

      {/* Connector */}
      <div className="relative flex h-8 w-20 items-center justify-center">
        <svg
          width="100%"
          height="12"
          viewBox="0 0 80 12"
          className="overflow-visible"
          aria-hidden="true"
        >
          <motion.line
            x1="0"
            y1="6"
            x2="72"
            y2="6"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeDasharray="3 3"
            initial={false}
            animate={{ pathLength: arrow ? 1 : 0, opacity: arrow ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          <motion.path
            d="M68 2 L76 6 L68 10"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ opacity: arrow ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
          />
        </svg>
      </div>

      {/* Right column: B2B */}
      <div className="flex w-20 flex-col items-center gap-2">
        <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
          B2B
        </span>
        <div className="flex flex-col items-center gap-1.5">
          {Array.from({ length: PIVOT_DOTS }).map((_, i) => {
            const arrived = started && step > i;
            return (
              <motion.div
                key={i}
                className="bg-primary h-2 w-2 rounded-full"
                initial={false}
                animate={{
                  opacity: arrived ? 1 : 0,
                  scale: arrived ? 1 : 0.5,
                }}
                transition={{ duration: 0.35, ease: EASE }}
              />
            );
          })}
        </div>
        <span className="text-foreground font-mono text-[10px]">
          Enterprise pipeline
        </span>
      </div>
    </div>
  );
}

const HOURS_STATS = [
  { value: 20, display: "20", label: "hrs/month lost" },
  { value: 10, display: "$10M", label: "monthly opportunity" },
] as const;

function CountingNumber({
  target,
  display,
  duration = 800,
}: {
  target: number;
  display: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  // For "$10M" we render the final display once counter reaches target,
  // and render a plain counting integer with the dollar prefix while animating.
  const hasDollar = display.startsWith("$");
  const hasSuffix = display.endsWith("M");
  const reachedTarget = value >= target;

  if (reachedTarget) return <>{display}</>;
  return (
    <>
      {hasDollar ? "$" : ""}
      {value}
      {hasSuffix ? "M" : ""}
    </>
  );
}

function HoursStatAnimation({ active }: AnimationProps) {
  const [idx, setIdx] = useState(1);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setIdx(1), 0);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % HOURS_STATS.length);
    }, 1800);
    return () => clearInterval(t);
  }, [active]);

  const stat = HOURS_STATS[idx];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <span className="text-foreground font-display text-5xl font-bold">
            <CountingNumber target={stat.value} display={stat.display} />
          </span>
          <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
            {stat.label}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const LEADS_PER_DAY = [2, 2, 3, 3, 4, 3, 3] as const;
const LEADS_MAX_HEIGHT = 28;
const LEADS_PEAK = Math.max(...LEADS_PER_DAY);

function LeadsFunnelAnimation({ active }: AnimationProps) {
  // -1 = reset, 0..LEADS_PER_DAY.length-1 = up through this day revealed.
  const [day, setDay] = useState(LEADS_PER_DAY.length - 1);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(() => setDay(LEADS_PER_DAY.length - 1), 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        setDay(-1);
        await new Promise((r) => setTimeout(r, 400));
        if (cancelled) return;
        for (let i = 0; i < LEADS_PER_DAY.length; i++) {
          if (cancelled) return;
          setDay(i);
          await new Promise((r) => setTimeout(r, 200));
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const revealedTotal =
    day < 0
      ? 0
      : LEADS_PER_DAY.slice(0, day + 1).reduce((a, b) => a + b, 0);

  return (
    <div className="flex w-full flex-col items-center gap-2 px-2">
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-foreground font-display text-3xl font-bold tabular-nums">
          {revealedTotal}
        </span>
        <span className="text-muted-foreground font-mono text-[9px] tracking-wider uppercase">
          qualified leads
        </span>
      </div>
      <div className="flex h-8 items-end gap-1.5">
        {LEADS_PER_DAY.map((count, i) => {
          const revealed = day >= i;
          const target = (count / LEADS_PEAK) * LEADS_MAX_HEIGHT;
          return (
            <motion.div
              key={i}
              className="bg-primary w-2 rounded-t-sm"
              initial={false}
              animate={{ height: revealed ? target : 4 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ height: 4 }}
            />
          );
        })}
      </div>
    </div>
  );
}

const MODEL_PILLS = ["OpenAI", "Claude"] as const;

const MODEL_SUMMARY_VARIANTS = [
  { line1: 28, line2: 22 },
  { line1: 34, line2: 18 },
  { line1: 24, line2: 30 },
] as const;

function ModelIterationAnimation({ active }: AnimationProps) {
  const [iter, setIter] = useState(MODEL_SUMMARY_VARIANTS.length - 1);

  useEffect(() => {
    if (!active) {
      const t = setTimeout(
        () => setIter(MODEL_SUMMARY_VARIANTS.length - 1),
        0,
      );
      return () => clearTimeout(t);
    }
    const t = setInterval(() => {
      setIter((p) => (p + 1) % MODEL_SUMMARY_VARIANTS.length);
    }, 1600);
    return () => clearInterval(t);
  }, [active]);

  const activeModel = iter % 2;
  const variant = MODEL_SUMMARY_VARIANTS[iter];

  return (
    <div className="flex w-full flex-col items-center gap-3 px-4">
      <div className="flex gap-2">
        {MODEL_PILLS.map((name, i) => {
          const isActive = i === activeModel;
          return (
            <motion.div
              key={name}
              className="border-border rounded-full border px-3 py-1 font-mono text-[10px]"
              animate={{
                backgroundColor: isActive
                  ? "hsl(var(--primary))"
                  : "hsl(var(--background) / 0)",
                color: isActive
                  ? "hsl(var(--primary-foreground))"
                  : "hsl(var(--muted-foreground))",
              }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {name}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-card/50 border-border/40 w-full max-w-[220px] rounded-lg border p-3">
        <div className="flex flex-col gap-1.5">
          <div className="bg-foreground/60 h-2 w-16 rounded-full" />
          <AnimatePresence mode="wait">
            <motion.div
              key={iter}
              className="flex flex-col gap-1.5"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <motion.div
                className="bg-foreground/25 h-1.5 rounded-full"
                animate={{ width: variant.line1 * 4 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ width: variant.line1 * 4 }}
              />
              <motion.div
                className="bg-foreground/25 h-1.5 rounded-full"
                animate={{ width: variant.line2 * 4 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ width: variant.line2 * 4 }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const ANIMATIONS: Record<
  BentoCard["animation"],
  (props: AnimationProps) => JSX.Element
> = {
  layers: LayersAnimation,
  swap: SwapAnimation,
  nodes: NodesAnimation,
  moodboard: MoodboardAnimation,
  "code-to-site": CodeToSiteAnimation,
  pulse: PulseAnimation,
  palette: PaletteAnimation,
  rules: RulesAnimation,
  cursor: CursorAnimation,
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
};

function BentoCardItem({ card }: { card: BentoCard }) {
  const Animation = ANIMATIONS[card.animation];
  const [active, setActive] = useState(false);
  return (
    <motion.div
      className="bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5"
      initial="rest"
      whileHover="hover"
      animate="rest"
      tabIndex={0}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onTouchStart={() => setActive(true)}
    >
      <div className="flex min-h-[120px] flex-1 items-center justify-center">
        <Animation active={active} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground text-sm font-medium">
          {card.label}
        </span>
        <span className="text-muted-foreground text-xs">{card.sublabel}</span>
      </div>
    </motion.div>
  );
}

export function CaseStudyBento({ cards }: { cards: BentoCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className={card.span === "wide" ? "col-span-2" : ""}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
        >
          <BentoCardItem card={card} />
        </motion.div>
      ))}
    </div>
  );
}
