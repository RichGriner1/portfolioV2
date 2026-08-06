"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE_SOFT } from "@/components/motion/constants";
import { pick, useLang, type Bilingual } from "@/lib/i18n";

/**
 * The four levels of a token: raw value → primitive → semantic → component.
 *
 * The coded figure that replaced `token-levels_*.mp4` — first in the work bento tile,
 * now on /methodology/color itself. The video was 1080² and could only be fitted or
 * cropped: `object-cover` sliced the top and bottom rows off in a 484×238 tile, and
 * `object-contain` shrank the whole diagram until the token names were unreadable.
 * Neither is fixable in CSS, because the type inside a video scales with the frame. In
 * code the layout reflows instead, so the same figure reads in a wide bento tile and at
 * hero size on the methodology page.
 */
const LEVEL_NAMES: Bilingual<string[]> = {
  en: ["Raw value", "Primitive", "Semantic", "Component"],
  es: ["Valor bruto", "Primitivo", "Semántico", "Componente"],
};

const LEVEL_LABEL: Bilingual<string> = { en: "Level", es: "Nivel" };

type Chain = {
  /** Level 3 — the semantic role. */
  role: string;
  /**
   * Level 4 — the component that binds the role. Angle brackets because this level is a
   * component, not a token: the DS has no component-token file, which is the point the
   * page's "Component layer" section makes.
   */
  component: string;
  /** Levels 1 and 2 — the bare hex, and the primitive step it sits on. */
  value: { hex: string; primitive: string };
  /** The same two when the role re-points in dark mode. Omitted when it doesn't. */
  valueDark?: { hex: string; primitive: string };
  /** The pill: the role's own bg/fg pair. */
  pill: string;
};

/**
 * Hexes are literal here, which is the one exception to the no-hard-coded-colors rule,
 * for two reasons.
 *
 * First, a hex traveling up four levels of naming is this figure's entire subject — the
 * value at level 1 is the thing being named, not a theme decision, so it has to render as
 * itself. Second, the figure also sits in a work bento tile, outside `.ds-scope`, where
 * `var(--red-400)` and friends don't exist; a token reference would resolve to nothing
 * there and the pills would go transparent.
 *
 * Every value below is copied from `.ds-scope` in globals.css — the color page's own
 * palette, so the hero teaches the system the page documents. Themes are handled with
 * `dark:` classes rather than a `useTheme()` read so the pills never flash the light
 * value on mount. `primary` is the only role here that re-points between themes
 * (`primary-800` → `primary-200`); the status roles are the same in both, which is why
 * only it carries `valueDark`.
 */
const CHAINS: Chain[] = [
  {
    role: "primary",
    component: "<Button>",
    value: { hex: "#363636", primitive: "primary-800" },
    valueDark: { hex: "#e6e6e6", primitive: "primary-200" },
    pill: "bg-[#363636] text-[#fafafa] dark:bg-[#e6e6e6] dark:text-[#242424]",
  },
  {
    role: "error",
    component: "<Badge>",
    value: { hex: "#f87171", primitive: "red-400" },
    pill: "bg-[#f87171] text-[#450a0a]",
  },
  {
    role: "success",
    component: "<Toast>",
    value: { hex: "#4ade80", primitive: "green-400" },
    pill: "bg-[#4ade80] text-[#052e16]",
  },
  {
    role: "info",
    component: "<Banner>",
    value: { hex: "#60a5fa", primitive: "blue-400" },
    pill: "bg-[#60a5fa] text-[#172554]",
  },
];

/**
 * A token name that changes with the theme. Both are rendered and CSS picks one — a
 * `useTheme()` read would need a mount guard, and the guard is what causes the flash.
 */
function ThemedToken({ light, dark }: { light: string; dark?: string }) {
  if (!dark || dark === light) return <>{light}</>;
  return (
    <>
      <span className="dark:hidden">{light}</span>
      <span className="hidden dark:inline">{dark}</span>
    </>
  );
}

export function TokenLevelsFigure() {
  const { lang } = useLang();
  const names = pick(LEVEL_NAMES, lang);
  const levelLabel = pick(LEVEL_LABEL, lang);

  const [shown, setShown] = useState(0);
  const [chainIndex, setChainIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      let i = 0;
      while (!cancelled) {
        // A different role each pass — same four levels, so the loop shows that the
        // chain is the system, not one lucky color.
        setChainIndex(i % CHAINS.length);
        setShown(0);
        await wait(600);
        for (let n = 1; n <= names.length; n++) {
          if (cancelled) return;
          setShown(n);
          await wait(420);
        }
        await wait(2400);
        i++;
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, [names.length]);

  const chain = CHAINS[chainIndex];
  const tokens = [
    { light: chain.value.hex, dark: chain.valueDark?.hex },
    { light: chain.value.primitive, dark: chain.valueDark?.primitive },
    { light: chain.role },
    { light: chain.component },
  ];

  return (
    // `@container`, and every breakpoint below is the FIGURE's width, not the
    // viewport's. Viewport breakpoints were wrong here in a way the responsive gate
    // caught: at `sm` the work grid also goes three-column, so the tile gets NARROWER
    // exactly when `sm:flex-row` turned rows side by side, and the content overflowed
    // its own card by 26px. A tile's width doesn't track the window's.
    //
    // The `@[36rem]` tier is the methodology page's hero, where the figure gets the full
    // measure and the bento tile's type would read as a caption.
    //
    // `@container` is its own element, not the card. An element can't query its own
    // size, so the card's `@[24rem]:p-5` did nothing while the two were merged — only
    // the rows' variants, being descendants, ever fired.
    <div className="@container h-full w-full">
      <div className="bg-card border-border/60 flex h-full w-full flex-col justify-center gap-1 rounded-2xl border p-3 @[24rem]:gap-2 @[24rem]:p-5 @[36rem]:gap-3 @[36rem]:p-8">
        {names.map((name, i) => {
          const on = i < shown;
          const token = tokens[i];
          return (
            <motion.div
              key={name}
              // The row divider is a border rather than a gap so the four levels read as
              // one stack. Last row has none, or the figure ends on a line.
              // Stacked until the figure itself is 24rem wide. Side by side needs ~270px
              // for the longest row ("Level – 3 Semantic" plus the
              // `primary-default-background` pill); below that the pill either overflows
              // or gets truncated, and a cut token name is the one thing this figure
              // can't afford — reading the name is the whole point.
              className={
                i < names.length - 1
                  ? "border-border/40 flex flex-col items-start gap-0.5 border-b pb-1 @[24rem]:flex-row @[24rem]:items-center @[24rem]:justify-between @[24rem]:gap-2 @[24rem]:pb-2 @[36rem]:pb-3"
                  : "flex flex-col items-start gap-0.5 @[24rem]:flex-row @[24rem]:items-center @[24rem]:justify-between @[24rem]:gap-2"
              }
              initial={false}
              animate={{ opacity: on ? 1 : 0.25 }}
              transition={{ duration: 0.3, ease: EASE_SOFT }}
            >
              <span className="flex shrink-0 items-baseline gap-1.5">
                <span className="text-foreground text-[10px] font-semibold whitespace-nowrap @[24rem]:text-xs @[36rem]:text-sm">
                  {levelLabel} – {i + 1}
                </span>
                <span className="text-muted-foreground text-[9px] whitespace-nowrap @[24rem]:text-[11px] @[36rem]:text-xs">
                  {name}
                </span>
              </span>

              {/* The pill carries the role's real bg/fg pair, and it's the same color on
                all four rows: one value, four names. */}
              <motion.span
                className={`${chain.pill} flex max-w-full shrink-0 items-center gap-1.5 rounded-full px-1.5 py-0.5 @[24rem]:px-2 @[24rem]:py-1 @[36rem]:px-3 @[36rem]:py-1.5`}
                initial={false}
                animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.94 }}
                transition={{
                  duration: 0.28,
                  delay: on ? 0.06 : 0,
                  ease: EASE_SOFT,
                }}
              >
                <span className="font-mono text-[8px] whitespace-nowrap @[24rem]:text-[10px] @[36rem]:text-xs">
                  <ThemedToken light={token.light} dark={token.dark} />
                </span>
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
