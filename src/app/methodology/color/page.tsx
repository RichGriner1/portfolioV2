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

// Header strings are bilingual from day one; the body copy below is English
// with a Spanish pass still to come. TODO(afi-redaccion): translate the body.
const TITLE = {
  en: "Building color in three layers",
  // TODO(afi-redaccion)
  es: "Construyendo el color en tres capas",
};
const TAGS = {
  en: ["Methodology", "Design systems", "Color"],
  es: ["Metodología", "Sistemas de diseño", "Color"],
};

function HeroVideo() {
  const { lang } = useLang();
  const src = `/methodology/token-levels_${lang}_hero.mp4`;
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
            1px spacing scale live here without touching the rest of the site. */}
        <div className="ds-scope space-y-64 pt-8 text-foreground">
          <div className="space-y-12 text-sm text-muted-foreground">
            <p>
              Color is built in three layers.{" "}
              <strong className="font-medium text-foreground">Primitives</strong>{" "}
              are the raw scales — complete ramps of every hue, with no meaning attached.{" "}
              <strong className="font-medium text-foreground">Semantic tokens</strong>{" "}
              map those primitives to roles like{" "}
              <strong className="font-medium text-foreground">background</strong>,{" "}
              <strong className="font-medium text-foreground">primary</strong>, or{" "}
              <strong className="font-medium text-foreground">error</strong>. Components only ever touch the semantic
              layer, so they never hard-code a hex.
            </p>
            <p>
              I worked with a team that had three brand colors:{" "}
              <strong className="font-medium text-foreground">brand</strong>,{" "}
              <strong className="font-medium text-foreground">brand-light</strong>, and{" "}
              <strong className="font-medium text-foreground">brand-lighter</strong>. Then someone needed something a bit
              lighter than light. There was nowhere to put it, so they eyeballed a value and the palette drifted. Define
              the full ramps first and that doesn&apos;t happen &mdash;{" "}
              <strong className="font-medium text-foreground">&ldquo;lighter&rdquo; already exists</strong>, so you reach
              for <strong className="font-medium text-foreground">primary-200</strong>{" "}
              instead of inventing it. You make a thousand small decisions building a product. Settling the scale once
              removes a whole class of them. It also lets you swap a brand color, or an entire neutral scale, without
              touching a single component. That matters most when you&apos;re shipping several products, or
              white-labeling one.
            </p>
          </div>

          <Section
            title="Primitives"
            description="Raw color scales — the bottom layer, with no meaning attached. Each card shows the ramp's base color, what it's for, and all 11 steps."
          >
            <p className="text-sm text-muted-foreground">
              Two neutral ramps, on purpose.{" "}
              <strong className="font-medium text-foreground">Neutral</strong>{" "}
              is for the surfaces and text you read on.{" "}
              <strong className="font-medium text-foreground">Control</strong>{" "}
              is for the lines and states around them: borders, dividers, focus ring, disabled. Keeping them apart stops
              neutrals from blending &mdash; a disabled button shouldn&apos;t land on the same gray as the card behind it.
            </p>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
              {RAMPS.map((ramp) => (
                <PrimitiveRampCard key={ramp} ramp={ramp} span={ramp === "primary"} />
              ))}
              <AccessibilityCard />
            </div>
          </Section>

          <Section
            title="Semantic tokens"
            description="Named roles components consume, grouped by family. Hover a card to expand its overview, use cases, and the primitive + hex behind bg/fg."
          >
            <p className="text-sm text-muted-foreground">
              <strong className="font-medium text-foreground">Canvas vs. surfaces.</strong>{" "}
              With one flat background you can&apos;t tell the app frame from the content, and cards float with nothing
              grounding them. Canvas is the fix: a true base layer (pure white in light, near-black in dark) that
              everything sits on. Page, card, and popover stack on top of it, each a small step apart, so content reads
              as raised sections instead of one flat sheet.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="font-medium text-foreground">Ghost = outline.</strong>{" "}
              Every ghost tier uses the same tokens as an outline button — colored text on the surface, a tint on hover.
              The only difference is whether the component draws a border, so one token set serves both. Filled and subtle
              tiers have no border at all — they&apos;re solid surfaces, so don&apos;t add one.
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
                            usage={p.usage}
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
            title="Border + ring"
            description="Hover a card to see its use cases and the primitive + hex behind it."
          >
            <div className="grid grid-cols-2 items-start gap-12 md:grid-cols-3 lg:grid-cols-4">
              {BORDERS.map(({ name, usage }) => (
                <BorderRingCard key={name} name={name} usage={usage} dark={dark} />
              ))}
            </div>
          </Section>

          <Section
            title="Component layer"
            description="The top layer — where semantic roles get bound to real components. Nothing to show here; the components live on their own page. This is just the wiring."
          >
            <div className="space-y-12 text-sm text-muted-foreground">
              <p>
                This is where a role meets a component.{" "}
                <strong className="font-medium text-foreground">primary</strong> +{" "}
                <strong className="font-medium text-foreground">primary-foreground</strong>{" "}
                become the default button;{" "}
                <strong className="font-medium text-foreground">destructive</strong>{" "}
                becomes the delete button;{" "}
                <strong className="font-medium text-foreground">card</strong>{" "}
                becomes the card surface. The component asks for the role by name &mdash; it
                never sees a primitive step or a hex.
              </p>
              <p>
                Two things fall out of that.{" "}
                <strong className="font-medium text-foreground">Reuse:</strong> every button that
                asks for <strong className="font-medium text-foreground">primary</strong> shares one
                definition, so they stay identical without anyone keeping them in sync &mdash; change{" "}
                <strong className="font-medium text-foreground">primary</strong> once and every
                primary button, link and active state moves with it, in a single edit.{" "}
                <strong className="font-medium text-foreground">Patterns:</strong> because components
                speak in roles, a new one assembled from the same roles inherits the system for free.
              </p>
              <p>
                When one component genuinely needs to differ, you have two levers. Re-point the role
                it uses &mdash; swap its palette &mdash; and it moves along with everything else on
                that role. Or override the token on that single component, when the difference really
                is local to it. Reach for the per-component override last; most &ldquo;this one should
                be different&rdquo; requests turn out to be a missing or mis-mapped role, not a true
                exception.
              </p>
            </div>
          </Section>

          <Section
            title="Documents & skills for the AI"
            description="The files that make up the kit — the tokens the app reads, and the rules an AI or engineer follows to build consistently."
          >
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-16 py-12 text-left font-medium">File</th>
                    <th className="px-16 py-12 text-left font-medium">Edit?</th>
                    <th className="px-16 py-12 text-left font-medium">Purpose</th>
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
                          {EDIT_BADGE[f.edit].label}
                        </span>
                      </td>
                      <td className="max-w-md px-16 py-12 leading-relaxed text-muted-foreground">{f.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-4 rounded-lg border border-border bg-muted p-16 text-xs text-muted-foreground">
              <p>
                <strong className="font-medium text-foreground">How edits flow.</strong> The three JSON files are the
                source. <strong className="font-medium text-foreground">build-tokens.mjs</strong> reads them and writes{" "}
                <strong className="font-medium text-foreground">tokens.css</strong> — that&apos;s what components import.
              </p>
              <p>
                To change a token: edit a JSON file, save it, then run{" "}
                <code className="rounded bg-background px-4 py-1 font-mono text-foreground">pnpm tokens:build</code> in the
                terminal. That regenerates tokens.css. (Saving the JSON alone isn&apos;t enough — the build is a manual
                command, and the running dev server hot-reloads once the CSS is rewritten.)
              </p>
              <p>
                The AI reads <strong className="font-medium text-foreground">Design.md</strong> for the rules — no build
                needed there.
              </p>
            </div>

            <div className="pt-8">
              <div className="mb-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Color rules
              </div>
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {COLOR_RULES.map((r) => (
                  <div key={r.title} className="rounded-lg border border-border bg-card p-16">
                    <div className="text-sm font-medium">{r.title}</div>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{r.body}</p>
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

const KIT_FILES: Array<{ file: string; edit: "edit" | "rarely" | "generated"; purpose: string }> = [
  { file: "tokens/primitives.json", edit: "edit", purpose: "Raw ramps — every color, spacing and radius value. Change a hex or add a step here. Feeds the build." },
  { file: "tokens/semantic-light.json", edit: "edit", purpose: "Wires primitives → roles (background, primary, control…) for light mode. Re-point a role here. Feeds the build." },
  { file: "tokens/semantic-dark.json", edit: "edit", purpose: "The same roles, dark-mode values. Feeds the build." },
  { file: "scripts/build-tokens.mjs", edit: "rarely", purpose: "The compiler. Reads the three JSON files above and writes tokens.css. You run it; you rarely change it." },
  { file: "tokens/tokens.css", edit: "generated", purpose: "Written by the build — the CSS variables components and Tailwind actually read. Editing it by hand does nothing: the next build overwrites it, so change the JSON instead." },
  { file: "Design.md", edit: "edit", purpose: "The written rules an AI or engineer follows. Prose, not code — update it as the system grows." },
];

const EDIT_BADGE: Record<string, { label: string; className: string }> = {
  edit: { label: "You edit", className: "bg-success-subtle text-success-subtle-foreground" },
  rarely: { label: "Rarely", className: "bg-muted text-muted-foreground" },
  generated: { label: "Generated · don't touch", className: "bg-warning-subtle text-warning-subtle-foreground" },
};

const COLOR_RULES: Array<{ title: string; body: string }> = [
  { title: "Never skip a layer", body: "Components consume semantic tokens (background, primary, error) — never a primitive step or a raw hex." },
  { title: "Two neutrals, on purpose", body: "neutral (slate) = surfaces + text you read on. control (zinc) = borders, dividers, ring, disabled. A border never matches its surface." },
  { title: "Surface stack", body: "canvas → background → card → popover. Dialogs, drawers and sheets are popover — there's no separate modal token." },
  { title: "Action emphasis tiers", body: "Each action carries default/hover/active. Primary & destructive: Filled → Subtle → Ghost. Neutral: Filled → Ghost. The secondary action is the neutral button, not a color." },
  { title: "Ghost = outline", body: "Ghost and outline share the same tokens — outline just draws a border. It's a component choice, not a new token." },
  { title: "Destructive ≠ error", body: "destructive is an action (a button that deletes). error is a state (a message or badge). Cancel is neutral — never red." },
  { title: "Status colors are states", body: "error / success / warning / info are tonal chips for badges, banners and toasts. States get no hover/active — use primary/destructive for colored actions." },
  { title: "One disabled combo", body: "disabled + disabled-foreground on anything non-interactive. Don't invent a per-component gray." },
  { title: "Keep pairs AA", body: "Every bg/fg pair is AA (≥4.5:1). accessibility white/black is a max-contrast escape hatch only." },
  { title: "Rebrand = one token", body: "Swap primary to rebrand; swap neutral to change temperature. Nothing else moves." },
];
