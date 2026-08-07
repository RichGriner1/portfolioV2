"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";

import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

import { CanvasCursor } from "@/components/canvas/canvas-cursor";
import { DotTrail } from "@/components/canvas/dot-trail";

/**
 * A hero that behaves like a design file: a pannable canvas with the claim sitting
 * on it as a selected layer.
 *
 * The point is not that it pans. Pannable canvas heroes are a genre now, and a bare
 * infinite surface reads as a template. What makes this one Richard's is that the
 * canvas is a *design file* — selection frame, resize handles, a layer label — so
 * the hero demonstrates the thing the claim is about instead of decorating around
 * it. That's the brand guide's rule for motion: show the system working, or cut it.
 *
 * Constraints this has to respect, all of them learned from the earlier variants:
 *
 *   - The resting state is the finished composition. The claim is centred and fully
 *     legible before anyone touches anything, and stays that way with JS off or
 *     reduced motion on. Nobody should have to explore to find out what Richard does.
 *   - Panning is clamped. An unbounded canvas lets a visitor lose the claim off-screen,
 *     which fails the two-second test the whole rebuild exists to satisfy.
 *   - The wheel is never hijacked. Dragging pans; scrolling scrolls the page. Heroes
 *     that eat the scroll wheel are the reason this pattern has a bad name.
 *   - Drag is pointer-only. On touch, a drag handler on a full-bleed surface fights
 *     the page scroll, so coarse pointers get the static composition.
 */

/** How far the canvas can travel. Enough to feel loose, not enough to lose the claim. */
const CLAMP = { x: 180, y: 120 };

/** Dot grid cell. The pattern origin is taken modulo this, so it never runs away. */
const TILE = 22;

export function HeroCanvas({
  children,
  frames,
  className,
}: {
  children: React.ReactNode;
  /**
   * Optional content placed ON the canvas, behind the claim and moving with the
   * pan — the work frames in A5. Kept as a slot rather than baked in so the plain
   * canvas (A4) stays a plain canvas.
   */
  frames?: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [pannable, setPannable] = useState(false);
  const [moved, setMoved] = useState(false);
  const field = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Fine pointers only. `(hover: hover)` is the same split work-card.tsx uses to
  // decide between its hover panel and its touch caption.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setPannable(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /**
   * Move the dot field with the canvas by shifting the pattern's origin rather than
   * translating the element. Modulo the tile size, so the offset stays inside one
   * cell and the field is visually infinite without the SVG ever growing.
   *
   * Two attribute writes per frame, straight to the DOM — the same reasoning
   * dot-cursor.tsx gives for not routing per-frame position through React state.
   */
  useEffect(() => {
    const shift = () => {
      const pattern = field.current?.querySelector("pattern");
      if (!pattern) return;
      pattern.setAttribute("x", String(((x.get() % TILE) + TILE) % TILE));
      pattern.setAttribute("y", String(((y.get() % TILE) + TILE) % TILE));
    };
    shift();
    const stops = [x.on("change", shift), y.on("change", shift)];
    return () => stops.forEach((stop) => stop());
  }, [x, y]);

  const drag = pannable && !reduced;

  function recenter() {
    x.set(0);
    y.set(0);
    setMoved(false);
  }

  return (
    <div
      // `data-cursor-hide` suppresses the global dot inside this box (see
      // dot-cursor.tsx) — the hero has its own cursor, and running both means two
      // pointers chasing each other across the canvas.
      data-cursor-hide
      className={cn(
        "relative overflow-hidden",
        drag && "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <CanvasCursor />
      <motion.div
        drag={drag}
        dragConstraints={{
          left: -CLAMP.x,
          right: CLAMP.x,
          top: -CLAMP.y,
          bottom: CLAMP.y,
        }}
        // Momentum off: this is a canvas being positioned, not a thing being
        // flung. Elastic gives the edge of the clamp a little give so hitting the
        // limit feels like resistance rather than a wall.
        dragMomentum={false}
        dragElastic={0.12}
        onDragEnd={() => setMoved(x.get() !== 0 || y.get() !== 0)}
        style={{ x, y }}
        className="absolute inset-0"
      ></motion.div>

      {/* Magic UI's DotPattern, per Richard's reference.
       *
       * Note it is NOT inside the draggable layer, and is not oversized. An earlier
       * pass bled it 220px past every edge so panning couldn't reveal the SVG's
       * boundary — which worked, and added 220px to the canvas's scrollWidth, which
       * the responsive gate correctly called clipped content.
       *
       * An SVG `<pattern>` with `userSpaceOnUse` tiles infinitely inside its rect,
       * so the field never needs to be bigger than the box. Panning shifts the
       * pattern's ORIGIN instead of moving the element: same parallax, zero overflow.
       * See the subscription in the effect above.
       *
       * The radial mask is the demo's — dots strongest at the centre, gone at the
       * rim — so the field frames the claim instead of competing with it. */}
      {/* `pointer-events-none` on the wrapper, not just on the <svg> inside it.
          This layer paints after the drag surface, so without it the wrapper is
          what the pointer hits and the canvas silently stops panning. */}
      <div
        ref={field}
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        {/* `--border` is the right token for a hairline and far too pale for a 1px
            dot on a 22px grid — at 91% lightness on a white card the field was
            technically present and effectively invisible. `--muted-foreground` at
            35% is the same trick the repo uses elsewhere (`bg-background/60`,
            `border-primary/70`): a semantic token carrying its own alpha, so it
            still inverts with the theme.

            The mask also holds full strength further out (75% instead of 70%) —
            the previous falloff started fading almost immediately from centre. */}
        <DotPattern
          width={TILE}
          height={TILE}
          cr={1.15}
          className="fill-muted-foreground/35 [mask-image:radial-gradient(circle_at_center,white_35%,transparent_75%)]"
        />
        {/* The lit trail, sharing this layer's coordinate space and grid geometry
            so the bright dots land exactly on the dim ones. */}
        <DotTrail tile={TILE} />
      </div>

      {/* The work frames. Same motion values as everything else, so they're pinned
          to the canvas rather than to the viewport — pan and they move with it.
          The layer is `pointer-events-none` so dragging works over the gaps; each
          frame opts its own link back in. Sits under the claim in paint order,
          which is what keeps the sentence on top when a frame passes behind it. */}
      {frames ? (
        <motion.div
          style={{ x, y }}
          className="pointer-events-none absolute inset-0"
        >
          {frames}
        </motion.div>
      ) : null}

      {/* The content moves with the canvas but is NOT inside the draggable layer:
          the buttons are real links, and a drag surface wrapping them would swallow
          the click. Sharing the same motion values keeps them locked together. */}
      <motion.div
        style={{ x, y }}
        // `absolute inset-0`, not `h-full`: the container's height comes from
        // `min-height`, and a percentage height resolving against that collapses to
        // auto — which pinned the claim to the top edge and pushed the layer label
        // out of the frame. Filling the box explicitly is what centres it.
        // Wide horizontal padding on purpose: the selection frame overhangs the
        // copy by 20px on every side, so the gutter has to clear it or the frame
        // gets cut off by the card's own `overflow-hidden`.
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-10 py-16 sm:px-12 sm:py-24"
      >
        {/* The selection frame. This is the part that makes it Richard's file rather
            than a generic canvas — the claim reads as a layer someone has selected,
            which is the design-system argument made visually. */}
        {/* `w-full max-w-2xl` is load-bearing, not decoration. Without a width the
            block sizes to its content, and the headline's own `max-w-2xl` let it
            reach 544px inside a 324px card at 390px wide — clipped by the card's
            overflow, which the responsive gate caught. Bounding it here makes the
            copy shrink to the canvas instead of running past it. */}
        <div className="pointer-events-auto relative w-full max-w-2xl">
          <div className="border-primary/70 pointer-events-none absolute -inset-5 rounded-[2px] border" />
          {[
            "-top-5 -left-5",
            "-top-5 -right-5",
            "-bottom-5 -left-5",
            "-bottom-5 -right-5",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={cn(
                "border-primary bg-background absolute size-2 rounded-[1px] border",
                pos
              )}
            />
          ))}
          {/* Layer label, in the tab position Figma puts it. Mono because every
              other machine-facing label on this site is mono. */}
          <span
            aria-hidden
            className="bg-primary text-primary-foreground absolute -top-[30px] left-[-20px] rounded-[2px] px-1.5 py-0.5 font-mono text-[10px] leading-none"
          >
            hero / claim
          </span>
          {children}
        </div>
      </motion.div>

      {/* Only appears once the canvas has been moved, so the resting state carries
          no chrome it hasn't earned. */}
      {drag && moved ? (
        <button
          type="button"
          onClick={recenter}
          className="border-border bg-background/80 text-muted-foreground hover:text-foreground absolute right-3 bottom-3 z-20 rounded-md border px-2 py-1 font-mono text-[10px] backdrop-blur-sm"
        >
          recenter
        </button>
      ) : null}
    </div>
  );
}
