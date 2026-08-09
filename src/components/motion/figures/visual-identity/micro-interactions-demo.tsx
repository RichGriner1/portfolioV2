"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Bilingual, Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { useReducedMotion } from "./use-reduced-motion";

// Section 7 — micro-interactions. Each control follows the motion recipe of its
// afi-*-v2 counterpart in Coherence (libs/ui/src/{checkbox,radio,toggle,button}-v2),
// mapped onto this repo's tokens: brand fill → primary, content-inverse →
// primary-foreground, motion-easing-spring → ease-spring, motion-duration-slower →
// duration-slower. The earlier version of this figure only approximated the states;
// what makes the real components feel the way they do is the sequencing — the slow
// fill bloom, the check drawing AFTER the fill lands, the spring overshoot on the
// toggle thumb — so that's what's ported, not the pixels.
//
// The Coherence demo auto-plays its send flow on page load; here it's
// click-triggered instead (no autoplay motion, and it composes better with
// prefers-reduced-motion, which drops the transitions below rather than needing a
// second no-motion code path).
type SendState = "idle" | "sending" | "sent";

// Colour crossfades run at the checkbox-v2 "bloom" pace (500ms); the spring only
// ever drives transform-family properties (scale), never colour — a colour change
// can't overshoot.
const CONTROL_FILL =
  "[transition:background-color_var(--duration-slower)_var(--ease-in-out-soft),border-color_var(--duration-slower)_var(--ease-in-out-soft),scale_var(--duration-base)_var(--ease-spring)] motion-reduce:transition-none";

// Hover grow + press squish shared by checkbox-v2 and radio-v2 (Animate UI's
// whileHover 1.05 / whileTap 0.95). The row's hover/active drive both, so pressing
// the label squishes the control too. Press sits after hover so :active wins while
// both apply. Reduced motion drops the deformation entirely — a spatial move with
// no transition would just snap.
const CONTROL_SQUISH =
  "group-hover:scale-105 group-active:scale-95 motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100";

const COPY = {
  realEstate: { en: "Include real estate", es: "Incluir inmuebles" },
  period: { en: "Period", es: "Periodo" },
  monthly: { en: "Monthly", es: "Mensual" },
  annual: { en: "Annual", es: "Anual" },
  autoRebalance: { en: "Auto-rebalance", es: "Reajuste automático" },
  send: { en: "Send", es: "Enviar" },
  sending: { en: "Sending…", es: "Enviando…" },
  sent: { en: "Sent ✓", es: "Enviado ✓" },
  caption: {
    en: "Every state change explained by motion: the checkbox draw, the radio fill, the toggle flip, and a send flow that walks through send, sending, sent.",
    es: "Cada cambio de estado explicado con movimiento: el trazo del checkbox, el relleno del radio, el giro del toggle y un flujo de envío que recorre enviar, enviando, enviado.",
  },
} as const satisfies Record<string, Bilingual>;

function DemoCheckbox({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => setChecked((c) => !c)}
      className="group text-foreground flex items-center gap-2 text-sm"
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-xs border",
          CONTROL_FILL,
          CONTROL_SQUISH,
          // Active fill is foreground, not primary: primary resolves to grey
          // (oklch .205/.922) and washed out — Richard wants the checked state
          // reading black in light mode, white in dark.
          checked
            ? "border-foreground bg-foreground"
            : "border-input bg-background group-hover:border-foreground/40"
        )}
      >
        <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
          {/* checkbox-v2's signature sequencing: on check the draw waits one beat
              (delay = --duration-base) so the fill lands first and the check draws
              onto it; unchecking reverses immediately, no delay. */}
          <path
            d="M3 8.5l3 3 7-7"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={checked ? 0 : 1}
            className={cn(
              "text-background [transition:stroke-dashoffset_var(--duration-base)_var(--ease-in-out-soft),opacity_var(--duration-base)_var(--ease-in-out-soft)] motion-reduce:transition-none",
              checked
                ? "opacity-100 [transition-delay:var(--duration-base)] motion-reduce:[transition-delay:0s]"
                : "opacity-0"
            )}
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </button>
  );
}

function DemoRadioGroup({
  ariaLabel,
  options,
}: {
  ariaLabel: string;
  options: readonly [string, string];
}) {
  const [selected, setSelected] = useState(0);
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex items-center gap-3"
    >
      {options.map((label, i) => (
        <button
          key={label}
          type="button"
          role="radio"
          aria-checked={selected === i}
          // Roving tabindex per the APG radio-group pattern: the group is one tab
          // stop (the selected option) and arrows move the selection. With two
          // options every arrow key just means "the other one".
          tabIndex={selected === i ? 0 : -1}
          onKeyDown={(e) => {
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                e.key
              )
            ) {
              e.preventDefault();
              const next = (i + 1) % options.length;
              setSelected(next);
              (
                e.currentTarget.parentElement?.children[next] as HTMLElement
              )?.focus();
            }
          }}
          onClick={() => setSelected(i)}
          className="group text-foreground flex items-center gap-1.5 text-sm"
        >
          <span
            className={cn(
              "flex size-4 items-center justify-center rounded-full border",
              CONTROL_FILL,
              CONTROL_SQUISH,
              // radio-v2: the unselected fill is a grey control surface (not the
              // page background, unlike the checkbox); selected folds the border
              // into the brand fill.
              // Foreground, not primary — same visibility reason as the checkbox.
              selected === i
                ? "border-foreground bg-foreground"
                : "border-input bg-muted group-hover:border-foreground/40"
            )}
          >
            {/* Dot spring-scales in — the overshoot in --ease-spring is the pop. */}
            <span
              className={cn(
                "bg-background ease-spring size-2 rounded-full transition-[scale] duration-[var(--duration-base)] motion-reduce:transition-none",
                selected === i ? "scale-100" : "scale-0"
              )}
            />
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}

function DemoToggle({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className="group text-foreground flex items-center gap-2 text-sm"
    >
      {/* toggle-v2: borderless 36×20 pill, 16px thumb, 2px inset → 16px travel. */}
      <span
        className={cn(
          "ease-in-out-soft relative h-5 w-9 rounded-full transition-[background-color] duration-[var(--duration-fast)] motion-reduce:transition-none",
          // Foreground, not primary — the on-state track should be black in
          // light mode, white in dark, so the flip is unmissable.
          on ? "bg-foreground group-hover:bg-foreground/85" : "bg-muted"
        )}
      >
        {/* Spring slide — the overshoot carries the thumb a hair past its endpoint
            into the track wall before settling ("thunk"). Press squish is
            height-only: the thumb flattens under the finger while its width holds,
            composing with the slide (translate and scale are separate properties
            in Tailwind v4, so both apply at either end of the track). */}
        <span
          className={cn(
            "bg-background ease-spring absolute top-0.5 left-0.5 size-4 rounded-full shadow-sm transition-[translate,scale] duration-[var(--duration-fast)] motion-reduce:transition-none",
            on && "translate-x-4",
            "group-active:scale-y-[0.8] motion-reduce:group-active:scale-y-100"
          )}
        />
      </span>
      {label}
    </button>
  );
}

function DemoSendButton({ lang }: { lang: Lang }) {
  const [state, setState] = useState<SendState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const delay = state === "sending" ? 900 : 1500;
    const timeout = setTimeout(() => {
      setState((s) => (s === "sending" ? "sent" : "idle"));
    }, delay);
    return () => clearTimeout(timeout);
  }, [state]);

  return (
    <Button
      variant="default"
      disabled={state !== "idle"}
      onClick={() => setState("sending")}
      className="group"
    >
      {/* button-v2's press nudge: the CONTENT sinks one hairline step into the
          surface on press — deliberately not the whole box, which is what makes it
          read as depressed rather than moved. */}
      <span className="ease-in-out-soft pointer-events-none inline-flex items-center gap-1.5 transition-transform duration-[var(--duration-fast)] group-active:translate-y-px motion-reduce:transition-none motion-reduce:group-active:translate-y-0">
        {state === "sending" ? (
          <>
            <Loader2
              className="size-3.5 animate-spin motion-reduce:animate-none"
              aria-hidden
            />
            {COPY.sending[lang]}
          </>
        ) : state === "sent" ? (
          <>
            <Check className="size-3.5" aria-hidden />
            {COPY.sent[lang]}
          </>
        ) : (
          COPY.send[lang]
        )}
      </span>
    </Button>
  );
}

export function MicroInteractionsDemoFigure({ lang }: { lang: Lang }) {
  return (
    <div className="border-border bg-background flex flex-col gap-4 rounded-md border p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-6">
        <DemoCheckbox label={COPY.realEstate[lang]} />
        <DemoRadioGroup
          ariaLabel={COPY.period[lang]}
          options={[COPY.monthly[lang], COPY.annual[lang]]}
        />
        <DemoToggle label={COPY.autoRebalance[lang]} />
        <DemoSendButton lang={lang} />
      </div>
      <p className="text-muted-foreground text-xs italic">
        {COPY.caption[lang]}
      </p>
    </div>
  );
}
