"use client";

import Link from "next/link";

import { ArticleHeader } from "@/components/article-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLang, t } from "@/lib/i18n";

import {
  AccessibilityCard,
  BorderRingCard,
  PrimitiveRampCard,
  Section,
  SemanticCard,
  useDark,
} from "./_ds/ui";
import { BORDERS, RAMPS, SEMANTIC_GROUPS } from "./_ds/data";

const TITLE = {
  en: "Building color in four layers",
  es: "Construir el color en cuatro capas",
};
const TAGS = {
  en: ["Methodology", "Design systems", "Color"],
  es: ["Metodología", "Sistemas de diseño", "Color"],
};

/** Inline emphasis used throughout the body copy. */
function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}

function HeroVideo() {
  const { lang } = useLang();
  const { dark } = useDark();
  const mode = dark ? "dark" : "light";
  const src = `/methodology/token-levels_${lang}_${mode}_hero.mp4`;
  return (
    <div className="border-border w-full rounded-2xl border p-6 sm:p-8">
      <video
        key={src}
        className="block w-full rounded-lg"
        autoPlay
        muted
        loop
        playsInline
        onLoadedMetadata={(e) => {
          // Slow the token-levels animation a touch for a calmer read.
          e.currentTarget.playbackRate = 0.85;
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

export default function ColorMethodologyPage() {
  const { lang } = useLang();
  const { dark } = useDark();
  const es = lang === "es";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 pt-8 pb-24 sm:pt-12">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground w-fit font-mono text-xs tracking-wider uppercase transition-colors"
        >
          {t("work.back", lang)}
        </Link>

        <ArticleHeader dateISO="2026-07-01" title={TITLE} tags={TAGS} />

        <HeroVideo />

        {/* Ported Color page. Scoped so the Design System's own token layer and
            1px spacing scale live here without touching the rest of the site.
            Body copy is bilingual; the interactive card micro-copy in _ds/ stays
            English for now. TODO(afi-redaccion): translate the card strings. */}
        <div className="ds-scope space-y-64 pt-8 text-foreground">
          <div className="space-y-12 text-sm text-muted-foreground">
            {es ? (
              <>
                <p>
                  El color se construye en cuatro capas, de abajo arriba: las cuatro que
                  muestra la animación. Un <B>valor en bruto</B> es un simple hex como
                  #0085CA, sin nombre y sin función. Un <B>primitivo</B> le da un nombre y una
                  posición en una escala (<B>primary-800</B>, <B>blue-500</B>); nombrarlo es lo
                  que permite reutilizarlo y seguirle la pista en lugar de repetir el hex a
                  mano. Los <B>tokens semánticos</B> asignan los primitivos a roles como{" "}
                  <B>background</B>, <B>primary</B> o <B>error</B>: significado, no valor. Y los{" "}
                  <B>componentes</B> enlazan esos roles con la interfaz real (un botón usa{" "}
                  <B>primary</B>), que es de donde salen los patrones y la reutilización. Cada
                  capa apunta solo a la de debajo, así que un componente nunca fija un hex
                  directamente.
                </p>
                <p>
                  Trabajé con un equipo que tenía tres colores de marca: <B>brand</B>,{" "}
                  <B>brand-light</B> y <B>brand-lighter</B>. Un día alguien necesitó algo un
                  poco más claro que el claro. No había sitio donde colocarlo, así que
                  calcularon un valor a ojo y la paleta perdió coherencia. Si defines las
                  escalas completas desde el principio, eso no pasa: <B>«lighter» ya existe</B>,
                  y en lugar de inventarlo echas mano de <B>primary-200</B>. Al construir un
                  producto tomas mil decisiones pequeñas. Fijar la escala una vez elimina toda
                  una clase de ellas. Además, te permite cambiar un color de marca, o una escala
                  neutra entera, sin tocar un solo componente. Eso importa sobre todo cuando
                  lanzas varios productos o comercializas uno en marca blanca.
                </p>
              </>
            ) : (
              <>
                <p>
                  Color is built in four layers, bottom-up — the four levels in the animation
                  above. A <B>raw value</B> is a bare hex like #0085CA, with no name and no job.
                  A <B>primitive</B> gives it a name and a slot in a scale (<B>primary-800</B>,{" "}
                  <B>blue-500</B>) — naming it is what lets you track and reuse it instead of
                  pasting hexes. <B>Semantic tokens</B> map primitives to roles like{" "}
                  <B>background</B>, <B>primary</B>, or <B>error</B> — meaning, not value. And{" "}
                  <B>components</B> bind those roles to real UI (a button reads <B>primary</B>),
                  which is where patterns and reuse come from. Each layer points only at the one
                  beneath it, so a component never hard-codes a hex.
                </p>
                <p>
                  I worked with a team that had three brand colors: <B>brand</B>,{" "}
                  <B>brand-light</B>, and <B>brand-lighter</B>. Then someone needed something a
                  bit lighter than light. There was nowhere to put it, so they eyeballed a value
                  and the palette drifted. Define the full ramps first and that doesn&apos;t
                  happen &mdash; <B>&ldquo;lighter&rdquo; already exists</B>, so you reach for{" "}
                  <B>primary-200</B>{" "}instead of inventing it. You make a thousand small decisions
                  building a product. Settling the scale once removes a whole class of them. It
                  also lets you swap a brand color, or an entire neutral scale, without touching
                  a single component. That matters most when you&apos;re shipping several
                  products, or white-labeling one.
                </p>
              </>
            )}
          </div>

          <p className="rounded-lg border border-border bg-muted px-16 py-12 text-xs text-muted-foreground">
            {es ? (
              <>
                <B>Un apunte:</B> las tarjetas de abajo se despliegan para ver el detalle
                completo (casos de uso, el primitivo y el hex de cada token). En escritorio se
                abren al pasar el ratón; en pantalla táctil, pulsa una tarjeta para abrirla.
              </>
            ) : (
              <>
                <B>Heads up —</B> the cards below expand for the full details (use cases, the
                primitive step, and the hex behind each token). On desktop they open on hover;
                on a touch screen, tap a card to open it.
              </>
            )}
          </p>

          <Section
            title={es ? "Primitivos" : "Primitives"}
            description={
              es
                ? "Escalas de color con nombre. Un primitivo es un valor en bruto al que se le da un nombre y una posición en una escala (primary-800): eso es lo que permite reutilizarlo y seguirle la pista. Cada tarjeta muestra el color base de la escala, para qué sirve y sus 11 pasos."
                : "Named color scales. A primitive is a raw value given a name and a slot in a scale (primary-800) — that's what lets you reuse and track it. Each card shows the ramp's base color, what it's for, and all 11 steps."
            }
          >
            <p className="text-sm text-muted-foreground">
              {es ? (
                <>
                  Dos escalas neutras, a propósito. <B>Neutral</B> es para las superficies y el
                  texto que lees encima. <B>Control</B> es para las líneas y los estados que las
                  rodean: bordes, separadores, anillo de foco y deshabilitado. Separarlas evita
                  que los neutros se confundan entre sí: un botón deshabilitado no debería caer
                  en el mismo gris que la tarjeta que tiene detrás.
                </>
              ) : (
                <>
                  Two neutral ramps, on purpose. <B>Neutral</B> is for the surfaces and text you
                  read on. <B>Control</B> is for the lines and states around them: borders,
                  dividers, focus ring, disabled. Keeping them apart stops neutrals from
                  blending &mdash; a disabled button shouldn&apos;t land on the same gray as the
                  card behind it.
                </>
              )}
            </p>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
              {RAMPS.map((ramp) => (
                <PrimitiveRampCard key={ramp} ramp={ramp} span={ramp === "primary"} lang={lang} />
              ))}
              <AccessibilityCard lang={lang} />
            </div>
          </Section>

          <Section
            title={es ? "Tokens semánticos" : "Semantic tokens"}
            description={
              es
                ? "Roles con nombre que consumen los componentes, agrupados por familia. Pasa el ratón o pulsa una tarjeta para desplegar su descripción, casos de uso y el primitivo + hex detrás de bg/fg."
                : "Named roles components consume, grouped by family. Hover or tap a card to expand its overview, use cases, and the primitive + hex behind bg/fg."
            }
          >
            <p className="text-sm text-muted-foreground">
              {es ? (
                <>
                  <B>Canvas frente a superficies.</B>{" "}Con un único fondo plano no distingues el
                  marco de la aplicación del contenido, y las tarjetas flotan sin nada que las
                  asiente. El canvas lo resuelve: una capa base de verdad (blanco puro en claro,
                  casi negro en oscuro) sobre la que se apoya todo. Página, tarjeta y popover se
                  apilan encima, separados por un pequeño paso cada uno, de modo que el contenido
                  se lee como secciones elevadas y no como una lámina plana.
                </>
              ) : (
                <>
                  <B>Canvas vs. surfaces.</B>{" "}With one flat background you can&apos;t tell the
                  app frame from the content, and cards float with nothing grounding them. Canvas
                  is the fix: a true base layer (pure white in light, near-black in dark) that
                  everything sits on. Page, card, and popover stack on top of it, each a small
                  step apart, so content reads as raised sections instead of one flat sheet.
                </>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {es ? (
                <>
                  <B>Ghost = outline.</B>{" "}Cada nivel ghost usa los mismos tokens que un botón
                  outline: texto de color sobre la superficie y un tinte al pasar el ratón. La
                  única diferencia es si el componente dibuja un borde, así que un mismo conjunto
                  de tokens sirve para los dos. Los niveles filled y subtle no llevan borde: son
                  superficies sólidas, así que no se lo añadas.
                </>
              ) : (
                <>
                  <B>Ghost = outline.</B>{" "}Every ghost tier uses the same tokens as an outline
                  button — colored text on the surface, a tint on hover. The only difference is
                  whether the component draws a border, so one token set serves both. Filled and
                  subtle tiers have no border at all — they&apos;re solid surfaces, so
                  don&apos;t add one.
                </>
              )}
            </p>
            <div className="space-y-24">
              {SEMANTIC_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="mb-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </div>
                  <div className="space-y-12">
                    {group.rows.map((row, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 items-start gap-12 sm:grid-cols-2 lg:grid-cols-3"
                      >
                        {row.map((p) => (
                          <SemanticCard
                            key={`${p.bg}-${p.fg}-${p.label}`}
                            bg={p.bg}
                            fg={p.fg}
                            label={p.label}
                            usage={p.usage[lang]}
                            ghost={p.ghost}
                            flat={group.flat}
                            dark={dark}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title={es ? "Borde + anillo" : "Border + ring"}
            description={
              es
                ? "Pasa el ratón o pulsa una tarjeta para ver sus casos de uso y el primitivo + hex que hay detrás."
                : "Hover or tap a card to see its use cases and the primitive + hex behind it."
            }
          >
            <div className="grid grid-cols-1 items-start gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {BORDERS.map(({ name, usage }) => (
                <BorderRingCard key={name} name={name} usage={usage[lang]} dark={dark} />
              ))}
            </div>
          </Section>

          <Section
            title={es ? "Capa de componentes" : "Component layer"}
            description={
              es
                ? "La capa superior: donde los roles semánticos se enlazan con componentes reales. Aquí no hay nada que enseñar; los componentes viven en su propia página. Esto es solo el cableado."
                : "The top layer — where semantic roles get bound to real components. Nothing to show here; the components live on their own page. This is just the wiring."
            }
          >
            <div className="space-y-12 text-sm text-muted-foreground">
              {es ? (
                <>
                  <p>
                    Aquí es donde un rol se encuentra con un componente. <B>primary</B> +{" "}
                    <B>primary-foreground</B> forman el botón por defecto; <B>destructive</B>{" "}
                    forma el botón de eliminar; <B>card</B>{" "}forma la superficie de la tarjeta. El
                    componente pide el rol por su nombre: nunca ve un primitivo ni un hex.
                  </p>
                  <p>
                    De ahí salen dos cosas. <B>Reutilización:</B> cada botón que pide{" "}
                    <B>primary</B>{" "}comparte una única definición, así que se mantienen idénticos
                    sin que nadie los sincronice; cambia <B>primary</B> una vez y todos los
                    botones, enlaces y estados activos que lo usan se mueven con él, en una sola
                    edición. <B>Patrones:</B> como los componentes hablan en roles, uno nuevo
                    montado con esos mismos roles hereda el sistema gratis.
                  </p>
                  <p>
                    Cuando un componente necesita de verdad ser distinto, tienes dos palancas.
                    Reasigna el rol que usa —cambia su paleta— y se moverá junto con todo lo demás
                    que dependa de ese rol. O sobrescribe el token en ese único componente, cuando
                    la diferencia es realmente local. Deja la sobrescritura por componente para el
                    final: la mayoría de los «este debería ser distinto» resultan ser un rol que
                    falta o está mal asignado, no una excepción de verdad.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    This is where a role meets a component. <B>primary</B> +{" "}
                    <B>primary-foreground</B> become the default button; <B>destructive</B>{" "}
                    becomes the delete button; <B>card</B>{" "}becomes the card surface. The component
                    asks for the role by name &mdash; it never sees a primitive step or a hex.
                  </p>
                  <p>
                    Two things fall out of that. <B>Reuse:</B> every button that asks for{" "}
                    <B>primary</B>{" "}shares one definition, so they stay identical without anyone
                    keeping them in sync &mdash; change <B>primary</B> once and every primary
                    button, link and active state moves with it, in a single edit. <B>Patterns:</B>{" "}
                    because components speak in roles, a new one assembled from the same roles
                    inherits the system for free.
                  </p>
                  <p>
                    When one component genuinely needs to differ, you have two levers. Re-point the
                    role it uses &mdash; swap its palette &mdash; and it moves along with
                    everything else on that role. Or override the token on that single component,
                    when the difference really is local to it. Reach for the per-component override
                    last; most &ldquo;this one should be different&rdquo; requests turn out to be a
                    missing or mis-mapped role, not a true exception.
                  </p>
                </>
              )}
            </div>
          </Section>

          <Section
            title={es ? "Documentos y reglas para la IA" : "Documents & skills for the AI"}
            description={
              es
                ? "Los archivos que forman el kit: los tokens que lee la aplicación y las reglas que sigue una IA o un ingeniero para construir con coherencia."
                : "The files that make up the kit — the tokens the app reads, and the rules an AI or engineer follows to build consistently."
            }
          >
            {/* Desktop: table. Mobile: stacked cards (a table is too cramped). */}
            <div className="hidden overflow-hidden rounded-lg border border-border md:block">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-16 py-12 text-left font-medium">
                      {es ? "Archivo" : "File"}
                    </th>
                    <th className="px-16 py-12 text-left font-medium">
                      {es ? "¿Editar?" : "Edit?"}
                    </th>
                    <th className="px-16 py-12 text-left font-medium">
                      {es ? "Para qué" : "Purpose"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {KIT_FILES.map((f) => (
                    <tr key={f.file} className="border-t border-border align-top">
                      <td className="whitespace-nowrap px-16 py-12 font-mono text-xs">{f.file}</td>
                      <td className="px-16 py-12">
                        <span
                          className={`inline-block whitespace-nowrap rounded-full px-8 py-2 text-[10px] font-medium ${EDIT_BADGE[f.edit].className}`}
                        >
                          {EDIT_BADGE[f.edit].label[lang]}
                        </span>
                      </td>
                      <td className="max-w-md px-16 py-12 leading-relaxed text-muted-foreground">
                        {f.purpose[lang]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-12 md:hidden">
              {KIT_FILES.map((f) => (
                <div key={f.file} className="space-y-8 rounded-lg border border-border p-16">
                  <div className="flex items-center justify-between gap-8">
                    <code className="font-mono text-xs">{f.file}</code>
                    <span
                      className={`inline-block shrink-0 whitespace-nowrap rounded-full px-8 py-2 text-[10px] font-medium ${EDIT_BADGE[f.edit].className}`}
                    >
                      {EDIT_BADGE[f.edit].label[lang]}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{f.purpose[lang]}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4 rounded-lg border border-border bg-muted p-16 text-xs text-muted-foreground">
              {es ? (
                <>
                  <p>
                    <B>Cómo fluyen los cambios.</B> Los tres archivos JSON son la fuente.{" "}
                    <B>build-tokens.mjs</B> los lee y escribe <B>tokens.css</B>, que es lo que
                    importan los componentes.
                  </p>
                  <p>
                    Para cambiar un token: edita un archivo JSON, guárdalo y ejecuta{" "}
                    <code className="rounded bg-background px-4 py-1 font-mono text-foreground">pnpm tokens:build</code>{" "}
                    en la terminal. Eso regenera tokens.css. (Guardar el JSON no basta: el build
                    es un comando manual, y el servidor de desarrollo recarga en caliente en cuanto
                    se reescribe el CSS.)
                  </p>
                  <p>
                    La IA lee <B>Design.md</B> para las reglas; ahí no hace falta build.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <B>How edits flow.</B> The three JSON files are the source.{" "}
                    <B>build-tokens.mjs</B> reads them and writes <B>tokens.css</B> — that&apos;s
                    what components import.
                  </p>
                  <p>
                    To change a token: edit a JSON file, save it, then run{" "}
                    <code className="rounded bg-background px-4 py-1 font-mono text-foreground">pnpm tokens:build</code>{" "}
                    in the terminal. That regenerates tokens.css. (Saving the JSON alone
                    isn&apos;t enough — the build is a manual command, and the running dev server
                    hot-reloads once the CSS is rewritten.)
                  </p>
                  <p>
                    The AI reads <B>Design.md</B> for the rules — no build needed there.
                  </p>
                </>
              )}
            </div>

            <div className="pt-8">
              <div className="mb-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {es ? "Reglas de color" : "Color rules"}
              </div>
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {COLOR_RULES.map((r) => (
                  <div key={r.title.en} className="rounded-lg border border-border bg-card p-16">
                    <div className="text-sm font-medium">{r.title[lang]}</div>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{r.body[lang]}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

type Bi = { en: string; es: string };

const KIT_FILES: Array<{ file: string; edit: "edit" | "rarely" | "generated"; purpose: Bi }> = [
  {
    file: "tokens/primitives.json",
    edit: "edit",
    purpose: {
      en: "Raw ramps — every color, spacing and radius value. Change a hex or add a step here. Feeds the build.",
      es: "Escalas en bruto: todos los valores de color, espaciado y radio. Cambia un hex o añade un paso aquí. Alimenta el build.",
    },
  },
  {
    file: "tokens/semantic-light.json",
    edit: "edit",
    purpose: {
      en: "Wires primitives → roles (background, primary, control…) for light mode. Re-point a role here. Feeds the build.",
      es: "Conecta primitivos → roles (background, primary, control…) para el modo claro. Reasigna un rol aquí. Alimenta el build.",
    },
  },
  {
    file: "tokens/semantic-dark.json",
    edit: "edit",
    purpose: {
      en: "The same roles, dark-mode values. Feeds the build.",
      es: "Los mismos roles, con valores de modo oscuro. Alimenta el build.",
    },
  },
  {
    file: "scripts/build-tokens.mjs",
    edit: "rarely",
    purpose: {
      en: "The compiler. Reads the three JSON files above and writes tokens.css. You run it; you rarely change it.",
      es: "El compilador. Lee los tres archivos JSON de arriba y escribe tokens.css. Lo ejecutas tú; rara vez lo cambias.",
    },
  },
  {
    file: "tokens/tokens.css",
    edit: "generated",
    purpose: {
      en: "Written by the build — the CSS variables components and Tailwind actually read. Editing it by hand does nothing: the next build overwrites it, so change the JSON instead.",
      es: "Lo escribe el build: las variables CSS que leen de verdad los componentes y Tailwind. Editarlo a mano no sirve de nada; el siguiente build lo sobrescribe, así que cambia el JSON.",
    },
  },
  {
    file: "Design.md",
    edit: "edit",
    purpose: {
      en: "The written rules an AI or engineer follows. Prose, not code — update it as the system grows.",
      es: "Las reglas escritas que sigue una IA o un ingeniero. Prosa, no código: actualízalo a medida que crece el sistema.",
    },
  },
];

const EDIT_BADGE: Record<string, { label: Bi; className: string }> = {
  edit: {
    label: { en: "You edit", es: "Lo editas tú" },
    className: "bg-success-subtle text-success-subtle-foreground",
  },
  rarely: {
    label: { en: "Rarely", es: "Rara vez" },
    className: "bg-muted text-muted-foreground",
  },
  generated: {
    label: { en: "Generated · don't touch", es: "Generado · no tocar" },
    className: "bg-warning-subtle text-warning-subtle-foreground",
  },
};

const COLOR_RULES: Array<{ title: Bi; body: Bi }> = [
  {
    title: { en: "Never skip a layer", es: "Nunca te saltes una capa" },
    body: {
      en: "Components consume semantic tokens (background, primary, error) — never a primitive step or a raw hex.",
      es: "Los componentes consumen tokens semánticos (background, primary, error), nunca un primitivo ni un hex directo.",
    },
  },
  {
    title: { en: "Two neutrals, on purpose", es: "Dos neutros, a propósito" },
    body: {
      en: "neutral (slate) = surfaces + text you read on. control (zinc) = borders, dividers, ring, disabled. A border never matches its surface.",
      es: "neutral (slate) = superficies + texto que lees encima. control (zinc) = bordes, separadores, anillo, deshabilitado. Un borde nunca coincide con su superficie.",
    },
  },
  {
    title: { en: "Surface stack", es: "Pila de superficies" },
    body: {
      en: "canvas → background → card → popover. Dialogs, drawers and sheets are popover — there's no separate modal token.",
      es: "canvas → background → card → popover. Diálogos, paneles laterales y hojas son popover; no hay un token de modal aparte.",
    },
  },
  {
    title: { en: "Action emphasis tiers", es: "Niveles de énfasis de acción" },
    body: {
      en: "Each action carries default/hover/active. Primary & destructive: Filled → Subtle → Ghost. Neutral: Filled → Ghost. The secondary action is the neutral button, not a color.",
      es: "Cada acción lleva default/hover/active. Primary y destructive: Filled → Subtle → Ghost. Neutral: Filled → Ghost. La acción secundaria es el botón neutro, no un color.",
    },
  },
  {
    title: { en: "Ghost = outline", es: "Ghost = outline" },
    body: {
      en: "Ghost and outline share the same tokens — outline just draws a border. It's a component choice, not a new token.",
      es: "Ghost y outline comparten los mismos tokens; outline solo dibuja un borde. Es una decisión de componente, no un token nuevo.",
    },
  },
  {
    title: { en: "Destructive ≠ error", es: "Destructive ≠ error" },
    body: {
      en: "destructive is an action (a button that deletes). error is a state (a message or badge). Cancel is neutral — never red.",
      es: "destructive es una acción (un botón que elimina). error es un estado (un mensaje o una etiqueta). Cancelar es neutro, nunca rojo.",
    },
  },
  {
    title: { en: "Status colors are states", es: "Los colores de estado son estados" },
    body: {
      en: "error / success / warning / info are tonal chips for badges, banners and toasts. States get no hover/active — use primary/destructive for colored actions.",
      es: "error / success / warning / info son fichas tonales para etiquetas, avisos y notificaciones. Los estados no tienen hover/active; para acciones de color usa primary/destructive.",
    },
  },
  {
    title: { en: "One disabled combo", es: "Un único combo deshabilitado" },
    body: {
      en: "disabled + disabled-foreground on anything non-interactive. Don't invent a per-component gray.",
      es: "disabled + disabled-foreground en cualquier elemento no interactivo. No inventes un gris por componente.",
    },
  },
  {
    title: { en: "Keep pairs AA", es: "Mantén los pares en AA" },
    body: {
      en: "Every bg/fg pair is AA (≥4.5:1). accessibility white/black is a max-contrast fallback only.",
      es: "Cada par bg/fg cumple AA (≥4,5:1). accessibility white/black es solo un recurso de contraste máximo.",
    },
  },
  {
    title: { en: "Rebrand = one token", es: "Cambio de marca = un token" },
    body: {
      en: "Swap primary to rebrand; swap neutral to change temperature. Nothing else moves.",
      es: "Cambia primary para rehacer la marca; cambia neutral para ajustar la temperatura. Nada más se mueve.",
    },
  },
];
