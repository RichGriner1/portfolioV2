"use client";

/**
 * Snapping and alignment guides, shared by the two things on the board that
 * drag like a Figma object rather than panning the canvas: the gesture
 * legend (canvas-help.tsx) and a section's own name-tag handle
 * (canvas-site.tsx). Both need the same "does this box line up with
 * anything else on the board" arithmetic and the same red-line overlay to
 * show it, so it lives here once instead of twice.
 */

export type Box = { left: number; top: number; right: number; bottom: number };
export type Guide = { axis: "x" | "y"; at: number; from: number; to: number };

/** How close, in screen px, a dragged box's line has to come to a target's to snap. */
export const SNAP = 6;

type Line = { at: number; kind: "start" | "centre" | "end" };

/** A box's lines on one axis: left, centre, right (or top, middle, bottom). */
export const linesOf = (b: Box, axis: Guide["axis"]): Line[] => {
  const [start, end] = axis === "x" ? [b.left, b.right] : [b.top, b.bottom];
  return [
    { at: start, kind: "start" },
    { at: (start + end) / 2, kind: "centre" },
    { at: end, kind: "end" },
  ];
};

/**
 * Which lines may align. A centre only meets a centre; an edge meets any
 * edge, which covers flush edges and objects set side by side.
 */
export const pairs = (a: Line, b: Line) =>
  (a.kind === "centre") === (b.kind === "centre");

/**
 * The pixel a 1px guide fills to sit ON a line: an edge's outermost pixel,
 * inside the box, so the guide lands on the border rather than beside it, and
 * a centre's middle pixel.
 */
export const pixelOf = (l: Line) =>
  l.kind === "end"
    ? Math.round(l.at) - 1
    : l.kind === "centre"
      ? Math.round(l.at - 0.5)
      : Math.round(l.at);

/**
 * Everything on the board a dragged box can line up with, as it sits on
 * screen.
 *
 * `skip` leaves out the box being dragged itself, or anything inside it: a
 * section being dragged is `[data-snap]` too, and without this it would
 * snap to wherever it was rendered last frame and stick there.
 */
export function snapTargets(skip?: Element | null): Box[] {
  return [...document.querySelectorAll("[data-snap]")]
    .filter((el) => !skip?.contains(el))
    .map((el) => el.getBoundingClientRect())
    .filter(
      (r) =>
        r.width > 0 &&
        r.right > 0 &&
        r.bottom > 0 &&
        r.left < window.innerWidth &&
        r.top < window.innerHeight
    );
}

/** The smallest shift, within SNAP, that lands one of the box's lines on a target's. */
export function nudge(box: Box, targets: Box[], axis: Guide["axis"]) {
  let best = Infinity;
  for (const t of targets)
    for (const p of linesOf(box, axis))
      for (const q of linesOf(t, axis))
        if (pairs(p, q) && Math.abs(q.at - p.at) < Math.abs(best))
          best = q.at - p.at;
  return Math.abs(best) <= SNAP ? best : 0;
}

/**
 * One guide per line the box shares with a target, spanning both objects, as
 * a design tool draws them. Targets on the same line merge into one segment.
 */
export function guidesFor(box: Box, targets: Box[]) {
  const found = new Map<string, Guide>();
  for (const axis of ["x", "y"] as const)
    for (const t of targets)
      for (const p of linesOf(box, axis))
        for (const q of linesOf(t, axis)) {
          if (!pairs(p, q) || Math.abs(q.at - p.at) > 0.5) continue;
          // On the target's pixel: it's the object that stays put.
          const at = pixelOf(q);
          const from = Math.round(
            axis === "x" ? Math.min(box.top, t.top) : Math.min(box.left, t.left)
          );
          const to = Math.round(
            axis === "x"
              ? Math.max(box.bottom, t.bottom)
              : Math.max(box.right, t.right)
          );
          const key = `${axis}${at}`;
          const seen = found.get(key);
          found.set(
            key,
            seen
              ? {
                  ...seen,
                  from: Math.min(seen.from, from),
                  to: Math.max(seen.to, to),
                }
              : { axis, at, from, to }
          );
        }
  return [...found.values()];
}

/**
 * The guides layer. Rendered after whatever is being dragged, on the same
 * z-index band, so it draws over the object being moved the way a design
 * tool draws its snap lines. A guide spans every object on its line,
 * including ones partly off-screen, so the layer clips to the viewport.
 */
export function SnapGuides({ guides }: { guides: Guide[] }) {
  if (guides.length === 0) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {guides.map((g) => (
        <span
          key={`${g.axis}${g.at}`}
          className="bg-canvas-guide absolute"
          style={
            g.axis === "x"
              ? { left: g.at, top: g.from, width: 1, height: g.to - g.from }
              : { top: g.at, left: g.from, height: 1, width: g.to - g.from }
          }
        />
      ))}
    </div>
  );
}
