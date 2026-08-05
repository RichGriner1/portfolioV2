"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Bilingual, Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { useReducedMotion } from "./use-reduced-motion";

// Section 7 — micro-interactions. The Coherence demo auto-plays its send
// flow on page load; here it's click-triggered instead (no autoplay motion,
// and it composes better with prefers-reduced-motion, which just drops the
// transitions/spin below rather than needing a second no-motion code path).
type SendState = "idle" | "sending" | "sent";

const TRANSITION =
  "transition-all duration-[var(--duration-base)] ease-out-soft motion-reduce:transition-none";

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
      className="text-foreground flex items-center gap-2 text-sm"
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-xs border",
          TRANSITION,
          checked
            ? "border-foreground bg-foreground"
            : "border-input bg-background"
        )}
      >
        <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
          <path
            d="M3 8.5l3 3 7-7"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={checked ? 0 : 1}
            className={cn("text-background", TRANSITION)}
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
          onClick={() => setSelected(i)}
          className="text-foreground flex items-center gap-1.5 text-sm"
        >
          <span
            className={cn(
              "flex size-4 items-center justify-center rounded-full border",
              TRANSITION,
              selected === i ? "border-foreground" : "border-input"
            )}
          >
            <span
              className={cn(
                "bg-foreground size-2 rounded-full",
                TRANSITION,
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
      className="text-foreground flex items-center gap-2 text-sm"
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full border",
          TRANSITION,
          on ? "border-foreground bg-foreground" : "border-input bg-muted"
        )}
      >
        <span
          className={cn(
            "bg-background absolute top-0.5 left-0.5 size-3.5 rounded-full",
            TRANSITION,
            on && "translate-x-4"
          )}
        />
      </span>
      {label}
    </button>
  );
}

function DemoSendButton({ lang }: { lang: Lang }) {
  const [state, setState] = useState<SendState>("idle");
  const reducedMotion = useReducedMotion();

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
    >
      {state === "sending" ? (
        <>
          <Loader2
            className={cn(
              "size-3.5 animate-spin",
              reducedMotion && "animate-none"
            )}
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
