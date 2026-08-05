"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";

import { BlurFade } from "@/components/motion/blur-fade";
import { IntroParagraphs } from "@/components/home-intro";
import { WorkCard } from "@/components/work-card";
import { WORK } from "@/lib/content/work";
import { pick, t, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The home page composition. Started as a throwaway prototype under
 * /playground/bento-home and replaced the old stacked intro + work shelves on
 * 2026-08-05.
 *
 * Strict module: 4 columns, 8px gutters, 238px rows; variety comes from spans
 * (2×2 / 2×1 / 1×1), not bespoke layouts. Tiles are 16px-radius frames; the ones
 * holding a graphic inset it by 12px behind a 12px panel, which is where the
 * composition stops reading as an lfs.gd copy. Radii come from `.bento-frame` in
 * globals.css.
 *
 * The home deliberately carries only current, highest-value work — seven of the
 * fifteen WORK entries. Everything else is reachable from the footer index, so
 * /projects and /writing have something the home doesn't.
 */

const EMAIL = "richardgrinerdesigns@gmail.com";

// ES takes the inverted opening mark — RAE requires both, and "¿Hablamos?" is
// the natural Peninsular invitation where a bare "Hablamos" reads as a statement.
const TALK: Bilingual<string> = { en: "Let's talk", es: "¿Hablamos?" };

/**
 * The label split around the inline clip. EN splits cleanly between the two
 * words; "Hablamos" is a single word, so ES has no interior break and the clip
 * trails it instead. Second element optional for exactly that reason.
 */
const TALK_PARTS: Bilingual<readonly [string, string?]> = {
  en: ["Let's", "talk"],
  es: ["¿Hablamos?"],
};

/**
 * Renders inline between the words. Converted from Richard's source GIF with
 * ffmpeg — 4.5MB became 124KB for the same clip, which is why this is mp4 and
 * not a gif.
 *
 * Source is 480×480, so the slot below is square. If you swap in a landscape
 * clip, change the slot's aspect to match or object-cover will crop it.
 *
 * Any replacement must be exported SQUARE-CORNERED on a solid background: mp4
 * has no alpha channel, so corners rounded in the export render as black
 * corners. The rounding is CSS.
 */
const TALK_CLIP: string | null = "/video/talk-dog.mp4";

const COPIED: Bilingual<string> = {
  en: "Email copied",
  es: "Correo copiado",
};

/** animate-ui's flip-button spring, verbatim. The repo's own SPRING_SNAP is
 *  260/20 — near enough to be interchangeable, but this matches the source. */
const FLIP = { type: "spring", stiffness: 280, damping: 20 } as const;

// Pre-filled subject: the compose window opens prepared rather than blank, which
// is most of what makes a mailto feel abrupt. Also gives Richard something to
// filter on.
const SUBJECT: Bilingual<string> = {
  en: "Let's talk",
  es: "¿Hablamos?",
};

const COPY_LABEL: Bilingual<string> = {
  en: "Copy email address",
  es: "Copiar dirección de correo",
};

function bySlug(slug: string) {
  const item = WORK.find((w) => w.slug === slug);
  if (!item) throw new Error(`bento-home: unknown slug ${slug}`);
  return item;
}

/* The shared frame: 16px radius, one border, nothing nested inside. The
   12px-pad-plus-12px-inner-panel treatment belongs to tiles whose content is a
   graphic (WorkCard already renders it, in CardMedia); on a text tile the
   second border is a box around a box, so text tiles are frame + copy and set
   their own padding. */
const FRAME =
  "border-border bg-card relative overflow-hidden rounded-2xl border";

function Tile({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn(FRAME, className)}>{children}</div>;
}

/* "Let's talk" — the primary of the bottom three, so it carries the filled
   surface: it's the one action worth taking, where the other two are indexes
   you'd reach for after already being interested.
 *
 * Opens the visitor's mail client with the address and a subject already filled
 * in, rather than copying to the clipboard. Copying looks helpful but hands the
 * work back — the visitor still has to leave, open their mail, and paste.
 *
 * mailto's known failure: someone reading in a browser with no desktop mail
 * client configured gets nothing when they click. That's why the address stays
 * printed underneath as selectable text — it's the fallback, so the tile never
 * becomes a dead end. */
function TalkTile() {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  const parts = pick(TALK_PARTS, lang);
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(pick(SUBJECT, lang))}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is select-all, so it's still copyable.
    }
  }

  return (
    // The tile can't be one big <a> any more: a <button> inside an anchor is
    // invalid, and its click would bubble into the mailto. So the anchor is a
    // full-bleed overlay behind the content, and only the copy button opts back
    // into pointer events. Standard "card link with a secondary action" shape.
    <div
      className={cn(
        FRAME,
        "group bg-primary border-primary text-primary-foreground h-full w-full"
      )}
    >
      <a
        href={href}
        aria-label={`${pick(TALK, lang)} — ${EMAIL}`}
        className="absolute inset-0 z-0 transition-opacity group-hover:opacity-90"
      />
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center gap-3 p-6">
        {/* No flex gap between the words. The clip slot IS the word space: at
            rest it's 0.28em wide (about a space at this size) and empty, and on
            hover it grows to 0.95em with the clip fading in. So the words slide
            apart to make room rather than the clip appearing on top of them.
            Width has to be the animated property for that push to happen —
            scaling wouldn't move the words, since transforms don't affect
            layout. */}
        {/* The type scale steps with the tile, because the tile is narrower than
            the line wanted at both ends. `text-5xl sm:text-6xl` overflowed the
            frame by 41px at 320 and 14px at 375, and `overflow-hidden` on the
            tile meant it clipped rather than scrolled — the arrow and the tail of
            "¿Hablamos?" were simply gone. It also ran 2px over at 1024+, where ES
            is the long string ("¿Hablamos?" against "Let's talk"). Sizes are
            Tailwind scale steps, not a clamp, so they stay on the type ramp. */}
        <span className="flex items-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {/* Each word is its own element: adjacent bare text nodes collapse into
              one anonymous flex item, which is how this once read "Let'stalk". */}
          <span>{parts[0]}</span>
          {/* Touch devices have no hover, so the reveal would never fire and the
              clip would never be seen. There it just starts open — the same
              `[@media(hover:none)]` split WorkCard already uses.

              Bounce comes from ease-spring, whose curve overshoots past 1: the
              slot opens a hair wider than 0.95em and settles back. That's
              follow-through — a pure ease-out just glides to a stop. The 3px side
              margins only exist while open, so the clip gets air on both sides
              instead of the words butting against it; margin is in the transition
              too, or the gap would snap in. And the clip itself scales in on a
              60ms delay — secondary action, staged after the slot starts moving
              rather than everything travelling as one block. */}
          {TALK_CLIP ? (
            // No overflow-hidden, and z-10: the clip has to escape this slot to
            // read as rising from behind the line and landing on top of it. The
            // rounding moves onto the video itself for the same reason.
            <span className="ease-spring relative z-10 inline-block w-[0.28em] shrink-0 align-middle transition-[width,margin] duration-[var(--duration-base)] group-hover:mx-[3px] group-hover:w-[0.95em] [@media(hover:none)]:mx-[3px] [@media(hover:none)]:w-[0.95em]">
              <video
                // Starts tucked below the line and rises into place. A fixed size
                // rather than w-full, so it can overlap the words while the slot
                // underneath is still narrow.
                // max-w-none is load-bearing: Tailwind's preflight sets
                // `max-width:100%` on media, so the narrow slot was clamping the
                // clip to 16.8px wide and it rendered as a sliver.
                className="ease-spring size-[0.95em] max-w-none translate-y-[45%] scale-90 rounded-md object-cover opacity-0 shadow-lg transition-[opacity,transform] delay-[60ms] duration-[var(--duration-base)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
                src={TALK_CLIP}
                autoPlay
                muted
                loop
                playsInline
              />
            </span>
          ) : (
            <span className="w-[0.28em]" />
          )}
          <span>{parts[1]}</span>
          <ArrowUpRight className="ml-3 size-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <span className="text-primary-foreground/70 flex items-center gap-1.5 text-xs">
          {/* Flip + blur, from animate-ui's flip button: the two strings are
              stacked in one grid cell so they rotate past each other at the same
              time. That's also the fix for it feeling slow — the old version used
              AnimatePresence mode="wait", which ran exit and enter in sequence
              and doubled the duration. The spring lands quicker than the 250ms
              tween did, despite covering more distance. */}
          {/* Only the ACTIVE string is in flow; the outgoing one is taken out
              with `absolute`. Otherwise the grid stays as wide as the longest
              string (the address), so the shorter "Email copied" sat centred in
              an address-width box and the icon ended up ~40px away from it while
              sitting 6px from the address. Now the container hugs whichever
              string is showing and the gap is the same 6px either way. */}
          {/* pointer-events-auto is required, not cosmetic: this whole content
              layer is pointer-events-none so clicks reach the mailto anchor
              behind it. Without it the address can't be selected — the click
              falls through and opens mail instead, which defeats the one job the
              printed address has (the fallback when mailto does nothing). */}
          <motion.span
            layout
            transition={FLIP}
            className="pointer-events-auto relative grid [perspective:600px]"
          >
            <motion.span
              className={cn(
                "cursor-text whitespace-nowrap select-all [grid-area:1/1]",
                copied && "absolute top-0 left-0"
              )}
              animate={
                copied
                  ? { opacity: 0, rotateX: 90, y: "50%", filter: "blur(4px)" }
                  : { opacity: 1, rotateX: 0, y: "0%", filter: "blur(0px)" }
              }
              transition={FLIP}
            >
              {EMAIL}
            </motion.span>
            <motion.span
              aria-live="polite"
              className={cn(
                "whitespace-nowrap [grid-area:1/1]",
                !copied && "absolute top-0 left-0"
              )}
              animate={
                copied
                  ? { opacity: 1, rotateX: 0, y: "0%", filter: "blur(0px)" }
                  : { opacity: 0, rotateX: -90, y: "-50%", filter: "blur(4px)" }
              }
              transition={FLIP}
            >
              {pick(COPIED, lang)}
            </motion.span>
          </motion.span>
          <button
            type="button"
            onClick={copy}
            aria-label={pick(COPY_LABEL, lang)}
            className="text-primary-foreground/70 hover:text-primary-foreground pointer-events-auto cursor-pointer transition-colors"
          >
            {/* animate-ui's copy button, values taken from their source:
                scale 0 → 1, opacity 0.4 → 1, blur 4px → 0, 250ms. */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={copied ? "check" : "copy"}
                initial={{ scale: 0, opacity: 0.4, filter: "blur(4px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0, opacity: 0.4, filter: "blur(4px)" }}
                transition={{ duration: 0.25 }}
                className="block"
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </span>
      </div>
    </div>
  );
}

export function BentoHome() {
  const { lang } = useLang();

  return (
    <main className="bento-frame mx-auto w-full max-w-5xl flex-1 px-6 pt-10 pb-24">
      {/* Row height = cell width at the max-w-5xl content width (976 − 3×8
          gutters over 4 cols = 238), so 1×1 tiles are true squares and the
          spans align with the WorkCard's square media. */}
      <div className="grid auto-rows-[minmax(150px,1fr)] grid-cols-2 gap-2 sm:auto-rows-[238px] sm:grid-cols-4">
        {/* Rows 1–2 — locked: intro and flagship at equal 2×2 weight */}
        {/* Top-aligned, not centred: the copy fills ~300px of a 484px tile, and
            centring split the slack above and below. Slack under a text block
            reads as breathing room; slack above the first line reads as a
            mistake. pt is a step tighter than the sides so the first line sits
            near the media panel edge of the tile beside it. */}
        {/* Same load-in as the card beside it: WorkCard's own BlurFade with the
            identical props, and delay 0 to match the index={0} tile so the two
            2×2s arrive together rather than the copy simply being there while
            its neighbour animates. */}
        <div className="col-span-2 row-span-2">
          <BlurFade inView inViewMargin="-60px" className="h-full">
            <Tile className="flex h-full flex-col justify-start gap-3 p-6 pt-5 sm:p-8 sm:pt-6">
              {/* Colour and the type scale both come from the component now —
                  the sizes are Figma-specified, so they live next to the copy. */}
              <IntroParagraphs className="font-geist" />
              {/* The place line lives here, not in the footer — it's identity,
                  so it belongs with the intro. The footer took the socials.
                  mt-auto pins it as a signature under the prose.

                  13px, a step under the 14px copy: a caption, not prose, so it's
                  the one place a size step earns its keep. Same 1.25 ratio and
                  tracking as the body, and --muted-foreground puts it a tier
                  below --prose-body on the ink ramp too. */}
              <p className="text-muted-foreground mt-auto text-[13px] leading-[16.25px] tracking-[-0.0002em]">
                {t("footer.built", lang)}
              </p>
            </Tile>
          </BlurFade>
        </div>
        <div className="col-span-2 row-span-2">
          <WorkCard
            item={bySlug("visual-identity")}
            index={0}
            caption={false}
          />
        </div>

        {/* Row 3 — Afi DS takes the wide, the two brand/process squares follow */}
        <div className="col-span-2 row-span-1">
          <WorkCard
            item={bySlug("afi-design-system")}
            index={1}
            fill
            caption={false}
          />
        </div>
        <div className="col-span-1 row-span-1">
          <WorkCard item={bySlug("mindfulme")} index={2} caption={false} />
        </div>
        <div className="col-span-1 row-span-1">
          <WorkCard
            item={bySlug("design-md-primeng-wealth-manager")}
            index={3}
            caption={false}
          />
        </div>

        {/* Rows 4–5 — the three tiles whose media is a small layout rather than
            a single mark, each sized to what its content actually needs. The
            token video is 1080² and unreadable below ~400px, so it takes the
            2×2; the loop figure is authored on a 300×190 canvas and the KT360
            terminal is landscape, so both take wides on the right. A 1×1 gives
            the loop figure a 170px scene for 366px of fixed-width nodes — that
            was the smoosh. The second 2×2 also answers the two at the top. */}
        {/* Let's talk takes the 2×2 the token video used to hold. Two reasons:
            the tile wanted height more than the 976×238 strip gave it, and
            keeping "Building color in four layers" off the home leaves /writing
            something of its own. The home now carries only current, highest-value
            work; everything else is a click away from the footer index. */}
        <div className="col-span-2 row-span-2">
          <TalkTile />
        </div>
        <div className="col-span-2 row-span-1">
          <WorkCard
            item={bySlug("loops-and-skills-are-components")}
            index={4}
            fill
            caption={false}
          />
        </div>
        <div className="col-span-2 row-span-1">
          <WorkCard item={bySlug("kt360")} index={5} fill caption={false} />
        </div>
      </div>
    </main>
  );
}
