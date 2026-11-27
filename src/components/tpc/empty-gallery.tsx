"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Reveal } from "@/components/tpc/reveal";
import { type Bilingual, pick, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The empty-state objects: how they got made, then the set itself.
 *
 * Source: Richard's own account plus the Blender renders in the Cumplimiento de
 * terceros canvas folder (empty-states/). Stage text is his order of events:
 * references, a first flat pass, 3D in Blender, then brand. The moodboard slot stays a
 * placeholder until the board itself is added; nothing is drawn to stand in for it.
 */

const BASE = "/work/third-party-compliance/3d";

type Stage = {
  id: string;
  title: Bilingual<string>;
  body: Bilingual<string>;
};

// TODO(afi-redaccion)
const STAGES: Stage[] = [
  {
    id: "flat",
    title: { en: "A first pass", es: "Una primera versión" },
    body: {
      en: "I started building. The first pass was flat vector, and it looked flat.",
      es: "Empecé a construir. La primera versión era vectorial y plana, y se veía plana.",
    },
  },
  {
    id: "3d",
    title: { en: "3D, with the brand", es: "3D, con la marca" },
    body: {
      en: "So I made them 3D in Blender: one light, matte materials. Then the Afi blue and the Afi symbol, so they don't look like stock.",
      es: "Así que los hice en 3D con Blender: una sola luz y materiales mates. Después, el azul de Afi y el símbolo de Afi, para que no parezcan de banco de imágenes.",
    },
  },
  {
    id: "set",
    title: { en: "The set", es: "El conjunto" },
    body: {
      en: "Ten objects to use across all our apps. The small moments internal B2B tools usually overlook now get a touch of brand, and they are quick to make.",
      es: "Diez objetos para usar en todas nuestras apps. Los momentos pequeños que las herramientas internas B2B suelen ignorar ahora llevan un toque de marca, y se resuelven rápido.",
    },
  },
];

/** The flat first pass, drawn from semantic tokens so it follows the theme. */
function FlatSketch() {
  return (
    <svg
      viewBox="0 0 150 130"
      className="mx-auto h-auto w-full max-w-[16rem]"
      aria-hidden="true"
    >
      <ellipse cx="75" cy="118" rx="48" ry="7" className="fill-foreground/10" />
      <rect
        x="28"
        y="30"
        width="94"
        height="78"
        rx="14"
        className="fill-muted-foreground"
      />
      <rect
        x="40"
        y="56"
        width="70"
        height="8"
        rx="4"
        className="fill-background/25"
      />
      <rect
        x="40"
        y="72"
        width="46"
        height="8"
        rx="4"
        className="fill-background/15"
      />
      <circle cx="108" cy="86" r="15" className="fill-primary" />
      <path
        d="M101 86l5 5 9-10"
        fill="none"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground"
      />
    </svg>
  );
}

type Obj = {
  id: string;
  name: Bilingual<string>;
  /** The empty state that uses it in the prototype, in the product's Spanish. */
  used?: string;
};

// `used` comes from the prototype's own empty states; the last three are spare.
const OBJECTS: Obj[] = [
  {
    id: "sello",
    name: { en: "Seal", es: "Sello" },
    used: "Aún no hay cuestionarios",
  },
  {
    id: "lupa",
    name: { en: "Magnifier", es: "Lupa" },
    used: "Ningún proveedor coincide",
  },
  {
    id: "contactos",
    name: { en: "Contacts", es: "Contactos" },
    used: "Sin contactos autorizados",
  },
  {
    id: "historico",
    name: { en: "History", es: "Histórico" },
    used: "Aún no hay actividad",
  },
  {
    id: "nuevo",
    name: { en: "New", es: "Nuevo" },
    used: "Aún no hay preguntas",
  },
  { id: "escudo", name: { en: "Shield", es: "Escudo" }, used: "Todo al día" },
  {
    id: "error",
    name: { en: "Error", es: "Error" },
    used: "No se han podido cargar…",
  },
  { id: "bandeja", name: { en: "Tray", es: "Bandeja" } },
  { id: "plantillas", name: { en: "Templates", es: "Plantillas" } },
  { id: "registro", name: { en: "Log", es: "Registro" } },
];

/**
 * One object. Hover lifts and tilts it on the spring token; touch screens get no hover
 * and reduced motion gets none either.
 */
function ObjectTile({ o }: { o: Obj }) {
  const { lang } = useLang();
  return (
    <figure className="group border-border bg-card flex flex-col items-center gap-1 rounded-xl border p-3 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/${o.id}.webp`}
        alt=""
        width={560}
        height={480}
        loading="lazy"
        className="ease-spring h-auto w-full transition-transform duration-[var(--duration-slow)] motion-safe:[@media(hover:hover)]:group-hover:-translate-y-1 motion-safe:[@media(hover:hover)]:group-hover:-rotate-[1.5deg]"
      />
      <figcaption className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{pick(o.name, lang)}</span>
        <span className="text-muted-foreground min-h-8 text-[11px] leading-snug">
          {o.used ?? (lang === "es" ? "Sin usar todavía" : "Not used yet")}
        </span>
      </figcaption>
    </figure>
  );
}

function StageView({ id }: { id: string }) {
  const { lang } = useLang();
  if (id === "flat") {
    return (
      <div className="border-border bg-background flex aspect-[16/10] items-center justify-center rounded-xl border p-8">
        <FlatSketch />
      </div>
    );
  }
  if (id === "3d") {
    return (
      <div className="flex flex-col gap-3">
        <div className="border-border overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/process-3d.jpg`}
            alt={
              lang === "es"
                ? "Cuatro objetos 3D mates en gris pizarra con acento azul de Afi: un documento con sello, una lista con línea de tiempo, una lupa y un escudo con una marca."
                : "Four matte 3D objects in slate grey with an Afi blue accent: a document with a seal, a list with a timeline, a magnifier and a shield with a check."
            }
            width={1100}
            height={953}
            loading="lazy"
            className="h-auto w-full"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {OBJECTS.map((o, i) => (
        <Reveal key={o.id} tier="light" index={i % 4} immediate>
          <ObjectTile o={o} />
        </Reveal>
      ))}
    </div>
  );
}

export function EmptyGallery({ heading }: { heading: ReactNode }) {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const intent = useRef<number | undefined>(undefined);
  const hoverSelect = (i: number) => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => setActive(i), 140);
  };
  const cancelHover = () => window.clearTimeout(intent.current);
  useEffect(() => () => window.clearTimeout(intent.current), []);
  const stage = STAGES[active];
  const wide = stage.id === "set";
  return (
    <div className="flex flex-col gap-6">
      {heading}
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          wide
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"
        )}
      >
        <ol className="flex flex-col gap-1">
          {STAGES.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-current={on}
                  onMouseEnter={() => hoverSelect(i)}
                  onMouseLeave={cancelHover}
                  onFocus={() => setActive(i)}
                  onClick={() => {
                    cancelHover();
                    setActive(i);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-[var(--duration-base)]",
                    on
                      ? "border-border bg-muted"
                      : "hover:bg-muted/50 border-transparent"
                  )}
                >
                  <span className="bg-foreground text-background mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {pick(s.title, lang)}
                    </span>
                    <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                      {pick(s.body, lang)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-border bg-card rounded-xl border p-4 sm:p-5">
            <Reveal key={stage.id} tier="light" immediate>
              <StageView id={stage.id} />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
