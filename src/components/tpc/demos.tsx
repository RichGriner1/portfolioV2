"use client";

import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { type Bilingual, pick, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Small working copies of the product's patterns. The product UI is Spanish-only, so
 * the strings inside the mock screens stay Spanish in both languages: they are the
 * product, not this page. Captions and hints around them are bilingual.
 */

function Frame({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-background flex min-w-0 flex-col gap-3 rounded-lg border p-4",
        className
      )}
    >
      {label && (
        <span className="text-muted-foreground font-mono text-[10px] font-medium tracking-wider uppercase">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

function Hint({ text }: { text: Bilingual<string> }) {
  const { lang } = useLang();
  return (
    <p className="text-muted-foreground text-xs leading-relaxed">
      {pick(text, lang)}
    </p>
  );
}

/* ------------------------------------------------------------------ back */

/**
 * The arrow and the title share one edge when nothing is hovered. The hover surface
 * is what sticks out to the left, so the resting screen is the aligned one.
 */
function Back({ hover }: { hover?: boolean }) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="border-primary absolute -top-2 -bottom-2 left-0 border-l border-dashed"
      />
      <button
        type="button"
        className={cn(
          "text-foreground relative isolate mb-1 inline-flex items-center gap-1.5 py-1 pr-3 text-sm font-medium",
          "before:bg-muted before:absolute before:inset-y-0 before:right-0 before:-left-2 before:-z-10 before:rounded-md before:opacity-0 before:transition-opacity before:duration-[var(--duration-base)] hover:before:opacity-100",
          hover && "before:opacity-100"
        )}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Panel
      </button>
      <p className="font-display text-xl font-bold tracking-tight">
        Nube Segura S. L.
      </p>
    </div>
  );
}

export function BackDemo() {
  const { lang } = useLang();
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Frame label={lang === "es" ? "En reposo" : "At rest"}>
          <Back />
        </Frame>
        <Frame label={lang === "es" ? "Al pasar el ratón" : "On hover"}>
          <Back hover />
        </Frame>
      </div>
      <Hint
        text={{
          en: "The dashed line is the content edge. At rest the arrow and the title sit on it. Hover is what sticks out.",
          es: "La línea discontinua es el borde del contenido. En reposo, la flecha y el título están sobre ella. El hover es lo que sobresale.",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------ placeholder */

/**
 * A slot for a prototype screenshot or clip that isn't captured yet. Dashed so it
 * can't be mistaken for finished work.
 */
export function ScreenSlot({
  label,
  className,
}: {
  label: Bilingual<string>;
  className?: string;
}) {
  const { lang } = useLang();
  return (
    <div
      className={cn(
        "border-border text-muted-foreground flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm",
        className
      )}
    >
      {lang === "es" ? "Pantalla por añadir · " : "Screen to add · "}
      {pick(label, lang)}
    </div>
  );
}
