"use client";

import { motion, useAnimationControls } from "motion/react";
import { useEffect, useState, type JSX } from "react";

import type { BentoCard } from "@/lib/content/case-studies";

const EASE = [0.2, 0.8, 0.2, 1] as const;

const TOKEN_CHAIN = [
  { label: "afi-blue-600", sub: "primitive", dot: true },
  { label: "--color-primary", sub: "semantic" },
  { label: "Button", sub: "component", isComponent: true },
];

function LayersAnimation() {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      setStep(-1);
      await new Promise((r) => setTimeout(r, 400));
      for (let i = 0; i < TOKEN_CHAIN.length; i++) {
        if (cancelled) return;
        setStep(i);
        await new Promise((r) => setTimeout(r, 650));
      }
      await new Promise((r) => setTimeout(r, 1400));
      if (!cancelled) loop();
    }
    void loop();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex w-full items-center justify-center gap-0 px-2">
      {TOKEN_CHAIN.map((token, i) => (
        <div key={i} className="flex items-center">
          <motion.div
            className="flex flex-col items-center gap-1"
            animate={{ opacity: step >= i ? 1 : 0.15, y: step === i ? -1 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {token.isComponent ? (
              <motion.div
                className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 font-mono text-xs font-medium"
                animate={{ scale: step === i ? 1.05 : 1 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {token.label}
              </motion.div>
            ) : (
              <div className="flex items-center gap-1.5">
                {token.dot && (
                  <motion.div
                    className="bg-primary h-3 w-3 shrink-0 rounded-full"
                    animate={{ scale: step === i ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <motion.span
                  className="border-border bg-card rounded-md border px-2.5 py-1 font-mono text-xs"
                  animate={{
                    borderColor: step === i ? "hsl(var(--foreground)/0.4)" : "hsl(var(--border))",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {token.label}
                </motion.span>
              </div>
            )}
            <motion.span
              className="text-muted-foreground font-mono text-[9px] uppercase tracking-wider"
              animate={{ opacity: step >= i ? 0.6 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {token.sub}
            </motion.span>
          </motion.div>

          {i < TOKEN_CHAIN.length - 1 && (
            <motion.span
              className="text-muted-foreground mx-2 mb-4 font-mono text-xs"
              animate={{ opacity: step > i ? 0.5 : 0.1 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}

type SwapPhase = "material" | "to-prime" | "prime-done" | "to-custom" | "custom-done";

function SwapAnimation() {
  const [phase, setPhase] = useState<SwapPhase>("material");

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) break;
        setPhase("to-prime");
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) break;
        setPhase("prime-done");
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) break;
        setPhase("to-custom");
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) break;
        setPhase("custom-done");
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) break;
        setPhase("material");
      }
    }
    void loop();
    return () => { cancelled = true; };
  }, []);

  const showCustom = phase === "to-custom" || phase === "custom-done";
  const showCheck = phase === "prime-done" || phase === "custom-done";
  const checkColor = phase === "custom-done" ? "#22c55e" : "#22c55e";

  return (
    <div className="flex w-full flex-col items-center gap-4 px-2">
      <div className="flex w-full items-center justify-center gap-2">
        {/* Material */}
        <motion.div
          className="border-border bg-muted rounded-xl border px-4 py-2.5 font-mono text-sm"
          animate={{
            opacity: phase !== "material" ? 0.18 : 1,
            scale: phase !== "material" ? 0.9 : 1,
          }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          Material
        </motion.div>

        <motion.span
          className="text-muted-foreground text-sm"
          animate={{ opacity: phase === "to-prime" || phase === "to-custom" ? 1 : 0.25 }}
          transition={{ duration: 0.3 }}
        >→</motion.span>

        {/* PrimeNG */}
        <div className="relative">
          <motion.div
            className="rounded-xl px-4 py-2.5 font-mono text-sm"
            animate={{
              backgroundColor: showCustom ? "hsl(var(--muted))" : "hsl(var(--primary))",
              color: showCustom ? "hsl(var(--foreground))" : "hsl(var(--primary-foreground))",
              opacity: showCustom ? 0.25 : phase === "material" ? 0.35 : 1,
              scale: phase === "prime-done" ? 1.08 : showCustom ? 0.9 : 1,
            }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            PrimeNG
          </motion.div>
          <motion.span
            className="absolute -top-2 -right-2 text-sm"
            animate={{ opacity: phase === "prime-done" ? 1 : 0, scale: phase === "prime-done" ? 1 : 0.4 }}
            transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
            style={{ color: checkColor }}
          >✓</motion.span>
        </div>

        {/* Arrow to custom */}
        <motion.span
          className="text-muted-foreground text-sm"
          animate={{ opacity: phase === "to-custom" || phase === "custom-done" ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >→</motion.span>

        {/* Custom */}
        <div className="relative">
          <motion.div
            className="rounded-xl px-4 py-2.5 font-mono text-sm"
            animate={{
              backgroundColor: showCustom ? "hsl(var(--primary))" : "hsl(var(--muted))",
              color: showCustom ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
              opacity: showCustom ? 1 : 0,
              scale: phase === "custom-done" ? 1.08 : showCustom ? 1 : 0.8,
            }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            Custom
          </motion.div>
          <motion.span
            className="absolute -top-2 -right-2 text-sm"
            animate={{ opacity: phase === "custom-done" ? 1 : 0, scale: phase === "custom-done" ? 1 : 0.4 }}
            transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
            style={{ color: checkColor }}
          >✓</motion.span>
        </div>
      </div>

      <motion.div
        className="h-1 rounded-full"
        style={{ backgroundColor: "hsl(var(--primary)/0.25)" }}
        animate={{
          width: phase === "material" ? "0%" : phase === "to-prime" ? "40%" : phase === "prime-done" ? "55%" : phase === "to-custom" ? "80%" : "100%",
        }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      <motion.p
        className="text-muted-foreground text-center font-mono text-[10px]"
        animate={{ opacity: phase === "custom-done" ? 1 : 0, y: phase === "custom-done" ? 0 : 4 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        AI made this possible
      </motion.p>
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

function NodesAnimation() {
  const [phase, setPhase] = useState<"scattered" | "connecting" | "unified">("scattered");

  useEffect(() => {
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
    return () => { cancelled = true; };
  }, []);

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
            opacity: phase === "scattered" ? 0 : phase === "connecting" ? 0.5 : 0.25,
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
            cx: phase === "unified" ? HUB.x + (n.sx - HUB.x) * 0.15 : phase === "connecting" ? HUB.x + (n.sx - HUB.x) * 0.5 : n.sx,
            cy: phase === "unified" ? HUB.y + (n.sy - HUB.y) * 0.15 : phase === "connecting" ? HUB.y + (n.sy - HUB.y) * 0.5 : n.sy,
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
          opacity: phase === "scattered" ? 0.3 : phase === "connecting" ? 0.7 : 1,
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

const MOODBOARD_SETS = [
  [1, 5, 6],
  [0, 3, 8],
  [2, 4, 7],
];

function MoodboardAnimation() {
  const [set, setSet] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1200));
        if (!cancelled) setSet((p) => (p + 1) % MOODBOARD_SETS.length);
      }
    }
    void loop();
    return () => { cancelled = true; };
  }, []);

  const highlights = MOODBOARD_SETS[set];
  return (
    <div className="grid grid-cols-3 gap-1.5 px-2">
      {Array.from({ length: 9 }, (_, i) => (
        <motion.div
          key={i}
          className="bg-muted aspect-square rounded-sm"
          animate={{
            opacity: highlights.includes(i) ? 0.9 : 0.18,
            scale: highlights.includes(i) ? 1.05 : 0.97,
          }}
          transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
        />
      ))}
    </div>
  );
}

function CodeToSiteAnimation() {
  const [phase, setPhase] = useState<"code" | "site">("code");

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) break;
        setPhase("site");
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) break;
        setPhase("code");
      }
    }
    void loop();
    return () => { cancelled = true; };
  }, []);

  const CODE_WIDTHS = [55, 80, 45, 70, 35];
  const SITE_WIDTHS = [100, 100, 100, 65, 45];

  return (
    <div className="flex w-full flex-col gap-2 px-3">
      <motion.div
        className="bg-muted h-5 w-full rounded-md"
        animate={{ opacity: phase === "site" ? 0.7 : 0.2, scaleY: phase === "site" ? 1 : 0.6 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
      <div className="flex flex-col gap-1.5">
        {CODE_WIDTHS.map((cw, i) => (
          <motion.div
            key={i}
            className="bg-muted rounded-full"
            style={{ height: 5 }}
            animate={{
              width: phase === "site" ? `${SITE_WIDTHS[i]}%` : `${cw}%`,
              opacity: phase === "site" ? (i < 3 ? 0.6 : 0.3) : 0.35,
              borderRadius: phase === "site" ? 99 : 2,
            }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
          />
        ))}
      </div>
    </div>
  );
}

function PulseAnimation() {
  const controls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await controls.start({ scale: 1.25, opacity: 0.6 });
        await controls.start({ scale: 1, opacity: 1 });
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [controls]);

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={controls}
        className="bg-primary h-10 w-10 rounded-full"
        transition={{ duration: 0.6, ease: "easeInOut" }}
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

function PaletteAnimation() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1400));
        if (!cancelled) setActive((p) => (p + 1) % BANKS.length);
      }
    }
    void loop();
    return () => { cancelled = true; };
  }, []);

  const bank = BANKS[active];

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
            backgroundColor: i === active ? b.color + "30" : "transparent",
            scale: i === active ? 1 : 0.97,
            opacity: i === active ? 1 : 0.45,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          style={i === active ? { border: `1px solid ${b.color}55` } : { border: "1px solid transparent" }}
        >
          <motion.div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: b.color }}
          />
          <span className="text-foreground font-mono text-xs">{b.name}</span>
          {i === active && (
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

function RulesAnimation() {
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      setChecked(0);
      await new Promise((r) => setTimeout(r, 600));
      for (let n = 1; n <= 3; n++) {
        if (cancelled) return;
        setChecked(n);
        await new Promise((r) => setTimeout(r, 500));
      }
      await new Promise((r) => setTimeout(r, 1000));
      if (!cancelled) loop();
    }
    void loop();
    return () => { cancelled = true; };
  }, []);

  const LABELS = ["Color tokens", "Typography scale", "Component rules"];

  return (
    <div className="flex w-full flex-col gap-2.5 px-2">
      {LABELS.map((label, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden>
            <motion.circle
              cx="8" cy="8" r="6.5"
              stroke="currentColor" strokeWidth="1.5" fill="none"
              animate={{ opacity: checked > i ? 1 : 0.3 }}
              transition={{ duration: 0.2 }}
            />
            <motion.path
              d="M5 8l2 2 4-4"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              animate={{ pathLength: checked > i ? 1 : 0, opacity: checked > i ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </svg>
          <motion.span
            className="font-mono text-xs"
            animate={{ opacity: checked > i ? 0.8 : 0.3 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function CursorAnimation() {
  const controls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await controls.start({ x: 0, y: 0 });
        await new Promise((r) => setTimeout(r, 400));
        await controls.start({
          x: 20,
          y: -8,
          transition: { duration: 0.5, ease: EASE },
        });
        await controls.start({ scale: 0.85, transition: { duration: 0.12 } });
        await controls.start({ scale: 1, transition: { duration: 0.12 } });
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    void loop();
    return () => {
      cancelled = true;
    };
  }, [controls]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="bg-muted border-border rounded-md border px-4 py-2 text-xs font-medium opacity-60">
        Publish
      </div>
      <motion.div
        animate={controls}
        className="pointer-events-none absolute"
        style={{ originX: 0, originY: 0 }}
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

function BlocksAnimation() {
  const order = [0, 1, 2, 3];
  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      {order.map((i) => (
        <motion.div
          key={i}
          className="bg-muted aspect-square rounded-md"
          variants={{
            rest: { opacity: 0.3 + i * 0.15, scale: 1 },
            hover: { opacity: 0.3 + ((i + 2) % 4) * 0.15, scale: 0.96 },
          }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
        />
      ))}
    </div>
  );
}

const DS_NAV = ["Foundations", "Colors", "Typography", "Components"];
const DS_CONTENT: Record<string, { rows: number[]; accent?: boolean }> = {
  Foundations: { rows: [70, 50, 85] },
  Colors: { rows: [30, 30, 30, 30], accent: true },
  Typography: { rows: [90, 60, 75] },
  Components: { rows: [45, 45, 45, 45] },
};

function CanvasAnimation() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loop() {
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, 1300));
        if (!cancelled) setActive((p) => (p + 1) % DS_NAV.length);
      }
    }
    void loop();
    return () => { cancelled = true; };
  }, []);

  const page = DS_NAV[active];
  const content = DS_CONTENT[page];

  return (
    <div className="border-border bg-card flex w-full overflow-hidden rounded-xl border" style={{ height: 110 }}>
      <div className="border-border flex w-[88px] shrink-0 flex-col gap-0.5 border-r p-2">
        {DS_NAV.map((item, i) => (
          <motion.div
            key={item}
            className="rounded-md px-2 py-1 font-mono text-[9px]"
            animate={{
              backgroundColor: i === active ? "hsl(var(--primary)/0.12)" : "transparent",
              color: i === active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              fontWeight: i === active ? 600 : 400,
            }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {item}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex flex-col gap-1.5"
        >
          <div className="bg-muted h-2 w-20 rounded-full opacity-60" />
          {content.accent ? (
            <div className="mt-1 flex gap-1.5">
              {["bg-foreground", "bg-primary", "bg-muted-foreground", "bg-border"].map((cls, i) => (
                <motion.div
                  key={i}
                  className={`${cls} h-7 flex-1 rounded-md`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
                />
              ))}
            </div>
          ) : (
            content.rows.map((w, i) => (
              <motion.div
                key={i}
                className="bg-muted rounded-full"
                style={{ width: `${w}%`, height: 6 }}
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 0.5 + i * 0.1, scaleX: 1 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: EASE }}
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}

function GuidelineAnimation() {
  return (
    <div className="flex w-full flex-col gap-3 px-1">
      <div className="flex gap-1.5">
        {["bg-foreground", "bg-primary", "bg-muted-foreground", "bg-muted"].map((cls, i) => (
          <motion.div
            key={i}
            className={`${cls} h-7 flex-1 rounded-md`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            variants={{ rest: { scale: 1 }, hover: { scale: 1.06, y: -2 } }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <motion.div
          className="bg-foreground h-4 w-16 rounded-sm"
          style={{ opacity: 0.9 }}
          variants={{ rest: { opacity: 0.9 }, hover: { opacity: 1 } }}
        />
        <motion.div
          className="bg-muted h-2.5 w-full rounded-full"
          variants={{ rest: { opacity: 0.4 }, hover: { opacity: 0.6 } }}
        />
        <motion.div
          className="bg-muted h-2.5 w-4/5 rounded-full"
          variants={{ rest: { opacity: 0.3 }, hover: { opacity: 0.5 } }}
        />
      </div>
    </div>
  );
}

const WP_STEPS = [
  { label: "Design", icon: "✦", detail: "Figma" },
  { label: "Build", icon: "◈", detail: "AI + code" },
  { label: "Template", icon: "⊞", detail: ".zip export" },
  { label: "Live", icon: "◉", detail: "WordPress" },
];

function WordpressAnimation() {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
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
    return () => { cancelled = true; };
  }, []);

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
          <span className="text-foreground text-2xl leading-none">{s.icon}</span>
          <span className="text-muted-foreground font-mono text-[9px]">{s.detail}</span>
        </div>
        <span className="text-foreground font-mono text-xs font-medium">{s.label}</span>
      </motion.div>

      <div className="flex gap-1.5">
        {WP_STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === step ? 16 : 4,
              backgroundColor: i === step ? "hsl(var(--foreground))" : "hsl(var(--border))",
            }}
            style={{ height: 4 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        ))}
      </div>
    </div>
  );
}

const ANIMATIONS: Record<BentoCard["animation"], () => JSX.Element> = {
  layers: LayersAnimation,
  swap: SwapAnimation,
  nodes: NodesAnimation,
  moodboard: MoodboardAnimation,
  "code-to-site": CodeToSiteAnimation,
  pulse: PulseAnimation,
  palette: PaletteAnimation,
  rules: RulesAnimation,
  cursor: CursorAnimation,
  blocks: BlocksAnimation,
  canvas: CanvasAnimation,
  guideline: GuidelineAnimation,
  wordpress: WordpressAnimation,
};

function BentoCardItem({ card }: { card: BentoCard }) {
  const Animation = ANIMATIONS[card.animation];

  return (
    <motion.div
      className="bg-card border-border/60 flex h-full flex-col gap-4 rounded-2xl border p-5"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="flex min-h-[120px] flex-1 items-center justify-center">
        <Animation />
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
