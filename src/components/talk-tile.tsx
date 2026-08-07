"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";

import { pick, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The contact tile, lifted out of bento-home.tsx so it has one implementation.
 *
 * It was defined privately inside the bento, which meant the canvas route grew a
 * second, thinner contact card that drifted immediately — different copy, no clip,
 * no copy-to-clipboard, no live region. Extracting it was the fix: this is now the
 * contact card, and both surfaces render the same one.
 *
 * The only thing the move added is `className`, so a caller can size it. The bento
 * needs a square that fills its grid cell; the canvas needs a fixed panel. Every
 * other decision below is unchanged and its reasoning is preserved verbatim.
 */

/* The shared frame: 16px radius, one border, nothing nested inside. */
const FRAME =
  "border-border bg-card relative overflow-hidden rounded-2xl border";

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
export function TalkTile({ className }: { className?: string }) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  const parts = pick(TALK_PARTS, lang);
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(pick(SUBJECT, lang))}`;

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      // Clipboard blocked: the address is select-all, so it's still copyable.
    }
  }

  return (
    // The tile can't be one big <a> any more: a <button> inside an anchor is
    // invalid, and its click would bubble into the mailto. So the anchor is a
    // full-bleed overlay behind the content, and only the copy button opts back
    // into pointer events. Standard "card link with a secondary action" shape.
    // `data-cursor-invert`: this tile is `bg-primary`, so the dot cursor's default
    // `--foreground` ink would be black on black here. See dot-cursor.tsx.
    <div
      data-cursor-invert
      className={cn(
        FRAME,
        "group bg-primary border-primary text-primary-foreground",
        className ?? "aspect-square w-full sm:aspect-auto sm:h-full"
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
            hover it grows to 1.7em with the clip fading in. So the words slide
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
            Tailwind scale steps, not a clamp, so they stay on the type ramp.

            The last step is `lg`, not `md`, because the tile is NARROWER at 768
            than at 1024: the bento goes 4-col at `sm`, so a 2-col span is 354px on
            a 768 viewport but 482px on a 1024 one. Stepping the type at `md` put
            48px text in the narrowest tile the layout ever produces, and ES ran
            37px past the frame. */}
        <span className="flex items-center text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {/* Each word is its own element: adjacent bare text nodes collapse into
              one anonymous flex item, which is how this once read "Let'stalk". */}
          <span>{parts[0]}</span>
          {/* Touch devices have no hover, so the reveal would never fire and the
              clip would never be seen. There it just starts open — the same
              `[@media(hover:none)]` split WorkCard already uses.

              Bounce comes from ease-spring, whose curve overshoots past 1: the
              slot opens a hair wider than 1.7em and settles back. That's
              follow-through — a pure ease-out just glides to a stop. The 6px side
              margins only exist while open, so the clip gets air on both sides
              instead of the words butting against it; margin is in the transition
              too, or the gap would snap in. 6px, not the original 3px — the clip
              is 1.7em now rather than 0.95em, and at 82px a 3px gap read as the
              type touching the image.

              The clip's own transition lists `translate` and `scale`, NOT
              `transform`. Tailwind v4 compiles the translate-y and scale
              utilities to the separate `translate` and `scale` CSS properties, so
              `transition-[opacity,transform]` matched nothing and this animation
              never ran: the clip snapped 41px into place while only the opacity
              faded, and on mouse-out it dropped 41px at full opacity before
              fading — a visible dip that got worse when the clip grew to 1.7em.
              site-header.tsx uses the same `transition-[opacity,translate,...]`
              form for the same reason. And the clip itself scales in on a
              60ms delay — secondary action, staged after the slot starts moving
              rather than everything travelling as one block. */}
          {TALK_CLIP ? (
            // No overflow-hidden, and z-10: the clip has to escape this slot to
            // read as rising from behind the line and landing on top of it. The
            // rounding moves onto the video itself for the same reason.
            <span className="ease-spring relative z-10 inline-block w-[0.28em] shrink-0 align-middle transition-[width,margin] duration-[var(--duration-base)] group-hover:mx-[6px] group-hover:w-[1.7em] [@media(hover:none)]:mx-[6px] [@media(hover:none)]:w-[1.7em]">
              <video
                // Starts tucked below the line and rises into place. A fixed size
                // rather than w-full, so it can overlap the words while the slot
                // underneath is still narrow.
                // max-w-none is load-bearing: Tailwind's preflight sets
                // `max-width:100%` on media, so the narrow slot was clamping the
                // clip to 16.8px wide and it rendered as a sliver.
                className="ease-spring size-[1.7em] max-w-none translate-y-[45%] scale-90 rounded-md object-cover opacity-0 shadow-lg transition-[opacity,translate,scale] delay-[60ms] duration-[var(--duration-base)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
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
        {/* The address never leaves, and the only thing that changes on copy is
            the icon. Two earlier attempts swapped it for a "Correo copiado"
            string and both broke on the same geometry.

            Hugging whichever string showed (`motion.span layout` + an `absolute`
            toggle) meant `perspective: 600px` with `rotateX` inflated the measured
            box — the 180px address reported 387px mid-flip — so the projection
            sprang at a distorted target, landing in steps with a ~300ms plateau,
            and since the row is centered, shrinking to the shorter string dragged
            the whole label 48px sideways.

            Pinning both strings in one grid cell held the width still, but the
            cell stays address-width, so the checkmark sat stranded ~90px right of
            the short confirmation.

            No arrangement lets a centered row swap two different-width strings
            without moving either the text or the icon. So it doesn't swap: the
            address stays (it's the mailto fallback, its whole job), brightens to
            full opacity for the 2s window, and the icon flips Copy→Check. Nothing
            reflows, the checkmark stays tight against the address, and the
            confirmation reaches screen readers via the live region below. */}
        <span className="text-primary-foreground/70 flex items-center gap-1.5 text-xs">
          <motion.span
            className="pointer-events-auto cursor-text whitespace-nowrap select-all"
            animate={{ opacity: copied ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {EMAIL}
          </motion.span>
          {/* `p-1.5 -m-1.5` takes the 14px icon to a 26px hit area for the WCAG
              2.5.8 floor the header now holds, with the negative margin cancelling
              the padding's effect on layout so the row's metrics don't move.
              Without it this was the smallest target on the page at 14×14. */}
          <button
            type="button"
            onClick={copy}
            aria-label={pick(COPY_LABEL, lang)}
            className="text-primary-foreground/70 hover:text-primary-foreground pointer-events-auto -m-1.5 cursor-pointer p-1.5 transition-colors"
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
          {/* The confirmation the copy button owes a screen reader. Empty until the
              copy lands, so it actually announces — an aria-live region on the
              address itself never fires, since its content never changes. */}
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? pick(COPIED, lang) : ""}
          </span>
        </span>
      </div>
    </div>
  );
}
