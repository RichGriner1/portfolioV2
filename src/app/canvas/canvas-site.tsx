"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { CanvasCursor } from "@/components/canvas/canvas-cursor";
import { CanvasRail } from "@/components/canvas/canvas-rail";
import { DotTrail } from "@/components/canvas/dot-trail";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { HyperText } from "@/components/magicui/hyper-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { buttonVariants } from "@/components/ui/button";
import { CvModal } from "@/components/cv-modal";
import { TalkTile } from "@/components/talk-tile";
import { WorkCard } from "@/components/work-card";
import { WORK, type WorkItem } from "@/lib/content/work";
import { pick, t, useLang, type Bilingual } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The canvas-as-site concept: one Figma-style board where the whole portfolio lives
 * as named sections, and navigating means moving around the board.
 *
 * Modelled on Richard's own working file — labelled sections holding frames, dark
 * board, everything on one surface.
 *
 * The thing this has to survive is the two-second test. A canvas you have to explore
 * is exactly the failure his reviewer described ("I don't know what I'm looking at"),
 * so three rules hold it together:
 *
 *   1. The claim is at the origin and the board opens there. Nobody has to move to
 *      find out what Richard does.
 *   2. Every section is reachable in one click from the rail, which is fixed to the
 *      viewport and never moves with the board. Exploration is a bonus path, never
 *      the only one.
 *   3. Sections are LABELLED, in Figma's own idiom. A visitor always knows the name
 *      of what they're looking at, even mid-pan.
 */

const TILE = 24;

/** How far the board can travel from origin. Sized to reach the outermost section. */
const CLAMP = { x: 1250, y: 800 };

type Section = {
  id: string;
  label: Bilingual<string>;
  /** Section origin, px from board centre. */
  x: number;
  y: number;
  /** Work frames, for a section that holds work. */
  slugs?: string[];
  /** Frames per row inside the section. */
  cols?: number;
  /**
   * The index page this section is a preview of.
   *
   * The board only carries a curated few of each kind, so without this a section is
   * a dead end — you see three case studies and there's nothing telling you the rest
   * exist or how to reach them. Panels (settings, contact) have no index behind
   * them, which is why it's optional rather than required.
   */
  href?: string;
  /** Set for the contact section. */
  contact?: boolean;
};

/**
 * Sections placed around the claim rather than in a line: the board reads as a
 * workspace someone actually arranged, and each direction from centre leads
 * somewhere. Case studies sit closest, because they're what the positioning rests on.
 */
const SECTIONS: Section[] = [
  {
    id: "case-studies",
    label: { en: "Case studies", es: "Casos de estudio" },
    x: -900,
    y: 520,
    href: "/projects",
    slugs: ["visual-identity", "afi-design-system", "mindfulme"],
    cols: 3,
  },
  {
    id: "writing",
    label: { en: "Blog", es: "Blog" },
    x: 880,
    y: 520,
    href: "/writing",
    slugs: [
      "modern-ui-2026",
      "color-methodology",
      "loops-and-skills-are-components",
    ],
    cols: 3,
  },
  /**
   * Contact sits top-left, opposite Settings, so the two utility destinations
   * balance the board instead of stacking on one side. It's also the section a
   * visitor is most likely to want after the work, and the shortest hop back to the
   * claim.
   */
  {
    id: "contact",
    label: { en: "Contact", es: "Contacto" },
    x: -950,
    y: -520,
    contact: true,
  },
];

/**
 * Frame size, matched to the index pages rather than picked.
 *
 * /projects and /writing run WorkGrid at `max-w-5xl` in three columns with gap-4:
 * (1024 − 48 padding − 32 gaps) / 3 ≈ 315px. A board has no width constraint, so
 * there was never a reason to shrink them to 240 — the cards should be the same
 * object here as they are everywhere else.
 */
const FRAME = 315;
const GAP = 20;

/** A section's width for a given column count. Its own function because Contact,
 *  which has no columns, is sized FROM it — see below. */
const sectionWidth = (cols: number) =>
  cols * FRAME + (cols - 1) * GAP + GAP * 2;

/**
 * Contact holds two panels side by side — the talk tile and the CV. They share a
 * section rather than each getting their own because they answer the same question
 * at the same moment: someone who wants to reach Richard also wants to know what
 * he's done, and splitting them across the board would make one of the two a thing
 * you have to go looking for.
 *
 * One three-column section wide, split in two, rather than a width of its own. At
 * 860×420 the panels came to 400×377 and the talk tile didn't fit inside them: the
 * headline is 48px, and hovering it opens the inline clip slot from 0.28em to 1.7em
 * — about 80px of push — which took the line to ~406px in a 351px content box. The
 * tile is `overflow-hidden`, so the arrow and the tail of "¿Hablamos?" were simply
 * cut off at the frame edge. Taking the width from `sectionWidth(3)` gives 482px
 * panels, which clears the hovered line with room, and it puts Contact on the same
 * measure as Case studies and Blog instead of a third size nobody chose.
 */
const CONTACT_W = sectionWidth(3);
/** Square-ish panels, so the tile is a tile rather than a letterbox. */
const CONTACT_H = 520;

/** Height of the header row above a section — its name and "See all". */
const LABEL_ROW = 32;

/**
 * A section's box on the board.
 *
 * Lifted out of SectionBlock because two things now need it: the block, to size
 * itself, and the click hit test, which has to know where a section is without a
 * DOM read. Measuring the rendered node instead would work, but it would be
 * measuring a surface mid-pan — the board is transformed, so every read lands
 * during an animation frame and the numbers move under you. The layout is
 * arithmetic; do the arithmetic.
 */
function sectionSize(section: Section) {
  const cols = section.cols ?? 1;
  const rows = Math.ceil((section.slugs?.length ?? 0) / cols);
  return {
    w: section.contact ? CONTACT_W : sectionWidth(cols),
    h: section.contact ? CONTACT_H : rows * FRAME + (rows - 1) * GAP + GAP * 2,
  };
}

/**
 * The section under a viewport point, if any.
 *
 * `bx`/`by` are the board's current offset. A section's centre in viewport space
 * is the viewport centre plus the board offset plus the section's own board
 * coordinates — the same composition the render does with `translate`, run
 * backwards.
 *
 * The box is grown upward by the label row so clicking a section's NAME does the
 * same thing as clicking its surface. That's the part a visitor reads first.
 */
function sectionAt(px: number, py: number, bx: number, by: number) {
  const cx = window.innerWidth / 2 + bx;
  const cy = window.innerHeight / 2 + by;
  return (
    SECTIONS.find((s) => {
      const { w, h } = sectionSize(s);
      const left = cx + s.x - w / 2;
      const top = cy + s.y - h / 2;
      return (
        px >= left && px <= left + w && py >= top - LABEL_ROW && py <= top + h
      );
    }) ?? null
  );
}

const bySlug = (slug: string): WorkItem => {
  const item = WORK.find((w) => w.slug === slug);
  if (!item) throw new Error(`canvas-site: unknown slug ${slug}`);
  return item;
};

const HEADLINE: Bilingual<{ name: string; claim: string }> = {
  en: { name: "I'm Richard.", claim: " I build design systems with AI." },
  es: { name: "Soy Richard.", claim: " Construyo sistemas de diseño con IA." },
};

const SUBTITLE: Bilingual<string> = {
  en: "Anthropology taught me to understand behavior. Design gave me the tools to create experiences that fit it.",
  es: "La antropología me enseñó a entender el comportamiento. El diseño me dio las herramientas para crear experiencias que encajen con él.",
};

const NAV: Bilingual<readonly [string, string]> = {
  en: ["Projects", "Blog"],
  es: ["Proyectos", "Blog"],
};

/**
 * Figma's component mark — the four-pointed diamond that tells you a thing on the
 * canvas is a component and not just a frame. Drawn rather than imported: it's
 * eight points, and the icon set here has no equivalent.
 */
function ComponentGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="text-canvas-component size-3 shrink-0 fill-current"
    >
      <path d="M12 1.5 14.6 9.4 22.5 12 14.6 14.6 12 22.5 9.4 14.6 1.5 12 9.4 9.4Z" />
    </svg>
  );
}

/**
 * The component's name, in the slash idiom a design file actually uses.
 *
 * It names what the frame HOLDS rather than restating that it's a hero, which is
 * the only thing a layer name is good for. Translated because everything else a
 * visitor can read here is — a layer name is private in a real file, but this one
 * is on a page.
 */
const COMPONENT_NAME: Bilingual<string> = {
  en: "hero / what I do",
  es: "hero / lo que hago",
};

/**
 * The place line, moved to the apron under the frame — Figma's dimension slot.
 *
 * It spent a version as the component's name and never sat right, because it isn't
 * one: a name says what the object IS, and this says something about the person who
 * made it. The apron is the slot for a fact ABOUT a selection rather than a label
 * for it, which is exactly the register this line wants. It also explains why forty
 * characters read wrong in the name position and read fine here — the apron badge
 * is sized by its content, the way `963 × 345` is.
 */
const PLACE: Bilingual<string> = {
  en: "Born and raised in DC, based in Madrid",
  es: "Nacido y criado en DC, basado en Madrid",
};

/**
 * Per-character pace for the claim's scramble. 16ms is one frame, the floor
 * `HyperText` clamps to anyway; across the 44-odd characters of either language it
 * lands at roughly `--duration-sweep`.
 */
const CLAIM_STEP = 16;

/**
 * The claim, as one scramble across both halves.
 *
 * It's two `HyperText`s because the halves are different ink, and left to
 * themselves they'd both start resolving at once — two waves, one of them opening
 * mid-sentence. Pricing the run per character rather than per element, and holding
 * the claim for the length of the name, makes it a single pass that starts on the
 * first letter of the first word and runs to the end of the line.
 *
 * Shared by the board and the mobile stack so the two can't drift; the only thing
 * that differs between them is the type scale.
 */
function Claim({ className }: { className: string }) {
  const { lang } = useLang();
  const { name, claim } = pick(HEADLINE, lang);
  const lead = name.length * CLAIM_STEP;

  return (
    <h1 className={className}>
      <HyperText className="text-muted-foreground" duration={lead}>
        {name}
      </HyperText>
      <HyperText
        className="text-foreground"
        delay={lead}
        duration={claim.length * CLAIM_STEP}
      >
        {claim}
      </HyperText>
    </h1>
  );
}

const HOME_LABEL: Bilingual<string> = { en: "Start", es: "Inicio" };

/**
 * The hero pair, in one place because the board and the stacked mobile layout
 * both render it and they were drifting apart a class at a time.
 *
 * Sizing is an override rather than a variant: the button scale tops out at `lg`
 * (h-9), which is a toolbar height — correct in a header, undersized under a
 * 48px headline. Both CTAs take the same bump so the pair stays matched.
 *
 * Only the primary carries motion now. The secondary used to run a light sweep
 * across its own label and rim, and two animated buttons side by side left
 * nothing for the eye to land on: the shimmer stopped reading as emphasis because
 * its neighbour was doing the same thing. Plain `secondary` is the site's own
 * button, and it's what makes the primary the primary.
 *
 * They move the board rather than leave it. As links they were the fastest way OFF
 * a page whose whole argument is that everything is already here — a visitor who
 * takes the most prominent control never finds out the board exists. Snapping to
 * the section instead makes the primary action a demonstration of the concept, and
 * the section's own "See all" is what carries you through to /projects and
 * /writing. That split is the rule the rail already follows: the board moves you
 * around itself, the header row is the way out.
 */
const CTA = "h-11 px-6 text-base";

/** Which section each half of the hero pair lands on, in NAV's order. */
const HERO_TARGETS = ["case-studies", "writing"] as const;

function HeroActions({
  lang,
  onGo,
}: {
  lang: ReturnType<typeof useLang>["lang"];
  onGo: (id: string) => void;
}) {
  return (
    <>
      <ShimmerButton className={CTA} onClick={() => onGo(HERO_TARGETS[0])}>
        {pick(NAV, lang)[0]}
      </ShimmerButton>
      <button
        type="button"
        onClick={() => onGo(HERO_TARGETS[1])}
        className={cn(buttonVariants({ variant: "secondary" }), CTA)}
      >
        {pick(NAV, lang)[1]}
      </button>
    </>
  );
}

/**
 * Rail destinations as bare coordinates, outside the component.
 *
 * The labelled version is built per render because it needs `lang`; this one is
 * stable, which matters because the position watcher below reads it on every frame
 * of a pan and must not depend on anything that re-renders.
 */
const STOPS = [
  { id: "home", x: 0, y: 0 },
  ...SECTIONS.map((s) => ({ id: s.id, x: s.x, y: s.y })),
];

export function CanvasSite() {
  const { lang } = useLang();
  const reduced = useReducedMotion();
  const [pannable, setPannable] = useState(false);
  const [active, setActive] = useState("home");
  const [grabbing, setGrabbing] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  /** Section the pointer is over, so the click target is visible before it's used. */
  const [hovered, setHovered] = useState<string | null>(null);
  /** Comma-joined ids of the sections currently on screen. Drives video playback. */
  const [onscreen, setOnscreen] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  /** Where the pointer went down, to tell a click from the end of a pan. */
  const press = useRef<{ x: number; y: number } | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setPannable(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Dots move by shifting the pattern origin, not the element — see the same note
  // in hero-canvas.tsx. Modulo the tile, so nothing ever grows.
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

  /**
   * Wheel and trackpad panning — Figma's primary navigation, and the thing that was
   * missing when the only way to move was click-and-drag.
   *
   * A two-finger trackpad gesture arrives as a wheel event with both deltas, so
   * handling deltaX and deltaY together gives free two-axis panning for nothing.
   * Shift+wheel maps vertical to horizontal, which is what a one-axis mouse wheel
   * needs and what Figma does.
   *
   * `preventDefault` is safe here in a way it would NOT be on the hero: this route
   * is a fixed 100dvh board with nothing behind it to scroll, so nothing is being
   * taken away from the visitor. It needs `passive: false` to be allowed at all.
   *
   * On the WINDOW, not on the board. The rail is fixed to the viewport and sits
   * outside the board's subtree, so a listener scoped to the board went deaf the
   * moment the pointer was over the toolbar — pick a theme or a language and the
   * canvas stopped responding until you moved back onto it and clicked. The board
   * is the whole page here; the wheel should move it from anywhere on that page.
   *
   * The two guards are what the narrower scope used to give for free. `offsetParent`
   * is null while the board is `hidden` below `lg`, where the stacked layout is
   * showing and scrolling is exactly what a wheel should do. And an overlay owns its
   * own scrolling — the CV dialog scrolls its content, a menu scrolls its list —
   * so neither gets stolen and turned into a pan behind it.
   */
  useEffect(() => {
    const el = root.current;
    if (!el || !drag) return;

    const clamp = (v: number, limit: number) =>
      Math.min(Math.max(v, -limit), limit);

    const onWheel = (e: WheelEvent) => {
      if (!el.offsetParent) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('[role="dialog"], [role="menu"]')) return;
      e.preventDefault();
      const dx = e.shiftKey ? e.deltaY : e.deltaX;
      const dy = e.shiftKey ? 0 : e.deltaY;
      x.set(clamp(x.get() - dx, CLAMP.x));
      y.set(clamp(y.get() - dy, CLAMP.y));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [drag, x, y]);

  /**
   * Space-to-grab, Figma's hand tool.
   *
   * Without it the board can only be dragged from the gaps between frames, because
   * the drag surface sits underneath them. Holding space puts a full-bleed grab
   * layer ON TOP, so you can pan from anywhere including over a frame — which is
   * exactly the problem the hand tool exists to solve in every canvas app.
   *
   * The keydown is swallowed so space doesn't also try to scroll or re-fire the
   * focused button, and the repeat guard keeps held-space from thrashing state.
   *
   * "Actually using" is `:focus-visible`, not focus. Clicking the theme or language
   * menu leaves focus parked on its trigger when the menu closes, and the plain
   * focus test read that as a control in use — so the hand tool was dead until you
   * clicked the canvas to blur a button you had finished with. A control reached by
   * pointer still has the space bar; one you tabbed to keeps it.
   */
  useEffect(() => {
    if (!drag) return;
    const down = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      const el = document.activeElement;
      // Let space do its normal job inside a control the visitor is actually using.
      if (
        el instanceof HTMLElement &&
        el.closest("button, a, input, textarea") &&
        el.matches(":focus-visible")
      )
        return;
      e.preventDefault();
      setGrabbing(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") setGrabbing(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [drag]);

  /**
   * Keep the rail honest.
   *
   * `active` was only ever set by clicking a rail button, so panning away from a
   * section left it still highlighted — the rail claimed you were somewhere you had
   * just left. Deriving it from the board position instead means dragging and
   * wheeling update it too, and landing near a section lights it up without a click.
   *
   * React bails out when `setActive` is handed the value it already holds, so this
   * firing on every frame of a pan costs a comparison, not a render.
   */
  useEffect(() => {
    const sync = () => {
      const cx = -x.get();
      const cy = -y.get();
      /**
       * Nearest stop, always — no proximity threshold.
       *
       * The first version only lit a button within 160px of its section, so the
       * whole middle of the board highlighted nothing and the rail just went blank
       * while you panned. Something is always the closest thing, and saying so is
       * more useful than saying nothing: the rail becomes a running answer to
       * "where am I" rather than a label that appears when you happen to arrive.
       */
      let best = STOPS[0];
      let bestD = Infinity;
      for (const s of STOPS) {
        const d = Math.hypot(s.x - cx, s.y - cy);
        if (d < bestD) {
          bestD = d;
          best = s;
        }
      }
      setActive(best.id);

      /**
       * Which sections are on screen — the same watcher, because it already runs
       * on every frame of every pan, whatever caused it.
       *
       * This is what starts the video thumbnails, and it's derived rather than
       * observed on purpose. IntersectionObserver is the obvious instrument and
       * the wrong one here: it reports during the rendering steps, so playback
       * would be a step behind the pan and would stall outright whenever the page
       * stops being rendered. The board's position is a number this component
       * already owns — intersecting two rectangles with it is exact, synchronous,
       * and true during a drag as well as an animated jump.
       *
       * Half the section's area, not a sliver of it. At the origin, a corner of
       * Case studies is already poking into a 1440-wide viewport; a bare-overlap
       * test would have the clips running before anyone has gone anywhere.
       */
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const live = SECTIONS.filter((s) => {
        const { w, h } = sectionSize(s);
        const left = vw / 2 + x.get() + s.x - w / 2;
        const top = vh / 2 + y.get() + s.y - h / 2;
        const ox = Math.max(0, Math.min(left + w, vw) - Math.max(left, 0));
        const oy = Math.max(0, Math.min(top + h, vh) - Math.max(top, 0));
        return (ox * oy) / (w * h) >= 0.5;
      }).map((s) => s.id);
      // Joined, so React's own bail-out does the work: a pan that doesn't change
      // which sections are on screen costs a string compare, not a render.
      setOnscreen(live.join(","));
    };
    sync();
    const off = [x.on("change", sync), y.on("change", sync)];
    return () => off.forEach((f) => f());
  }, [x, y]);

  /**
   * Bring keyboard focus into view.
   *
   * Everything on the board is in the DOM and tabbable, including the sections
   * currently off-screen — so tabbing moved focus onto frames nobody could see, with
   * no way to reach them, because a canvas doesn't scroll the way `scrollIntoView`
   * expects. Centring the board on whatever just took focus is the canvas equivalent,
   * and it makes the whole board keyboard-navigable rather than mouse-only.
   *
   * `:focus-visible`, not focus, is what makes that keyboard-only. Clicking a card
   * focuses its link too, so the unguarded version panned the board to centre the
   * frame you had just clicked — a snap you didn't ask for, landing on top of the
   * navigation you did. Clicking a thing should open the thing; only the keyboard
   * needs the board moved for it, because only the keyboard can put focus somewhere
   * you can't see.
   */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const clamp = (v: number, limit: number) =>
      Math.min(Math.max(v, -limit), limit);

    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest("[data-board]")) return;
      if (!t.matches(":focus-visible")) return;
      const r = t.getBoundingClientRect();
      const dx = window.innerWidth / 2 - (r.left + r.width / 2);
      const dy = window.innerHeight / 2 - (r.top + r.height / 2);
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      const opts = reduced ? { duration: 0 } : { duration: 0.45 };
      animate(x, clamp(x.get() + dx, CLAMP.x), opts);
      animate(y, clamp(y.get() + dy, CLAMP.y), opts);
    };

    el.addEventListener("focusin", onFocus);
    return () => el.removeEventListener("focusin", onFocus);
  }, [x, y, reduced]);

  /** Move the board so a section lands in the middle of the viewport. */
  function goTo(id: string, tx: number, ty: number) {
    setActive(id);
    const opts = reduced
      ? { duration: 0 }
      : { duration: 0.75, ease: [0.2, 0.8, 0.2, 1] as const };
    animate(x, -tx, opts);
    animate(y, -ty, opts);
  }

  const stops = [
    { id: "home", label: pick(HOME_LABEL, lang), x: 0, y: 0 },
    ...SECTIONS.map((s) => ({
      id: s.id,
      label: pick(s.label, lang),
      x: s.x,
      y: s.y,
    })),
  ];

  /**
   * One rail, two layouts.
   *
   * `offsetParent` is null for a `display: none` element, so asking the stacked
   * section whether it's laid out is a direct read of which layout the browser is
   * currently showing — no width state, no media-query hook, nothing to keep in sync
   * with the CSS that actually does the switching.
   */
  function goToStop(id: string) {
    const stacked = document.getElementById(`stack-${id}`);
    if (stacked && stacked.offsetParent !== null) {
      stacked.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
      setActive(id);
      return;
    }
    const s = STOPS.find((v) => v.id === id);
    if (s) goTo(s.id, s.x, s.y);
  }

  return (
    <>
      <div
        ref={root}
        // Marks this subtree as a pannable canvas. The responsive check exempts it
        // from the "nothing past the viewport edge" rules — a board larger than the
        // screen is the feature, not a bug. See scripts/responsive-check.mjs.
        data-canvas
        data-cursor-hide
        className={cn(
          // The board is a desktop composition. Below `lg` the stacked layout below
          // takes over — see CanvasStack for why that's a layout change and not a
          // second site.
          "bg-background relative hidden h-[100dvh] w-full overflow-hidden lg:block",
          drag && "cursor-grab active:cursor-grabbing"
        )}
        // The snap preview is read here, at the root, rather than on the drag
        // surface that owns the snap — because the surface stops receiving moves
        // the moment the pointer is over a frame sitting on top of it. The
        // highlight then stayed lit on the section you were crossing while you
        // hovered a card, promising a snap that clicking the card will not do.
        // Everything bubbles to the root, so this is the one place that can see
        // both cases and tell them apart.
        onPointerMove={(e) => {
          // Board content is its own target: a card is a link, the CV frame is a
          // button. Only the bare surface between them snaps, so only the bare
          // surface lights the section.
          if ((e.target as HTMLElement).closest("[data-board]")) {
            setHovered(null);
            return;
          }
          const hit = sectionAt(e.clientX, e.clientY, x.get(), y.get());
          setHovered(hit?.id ?? null);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        <CanvasCursor closeMode={cvOpen} />

        {/* Drag surface. Empty and full-bleed, underneath everything, so the board can
          be grabbed from any gap between frames.
         *
         * It's also where click-to-snap lives, and it has to be here rather than on
         * the sections themselves. A section's surface is `pointer-events-none` —
         * that's what lets the board be dragged from inside one — and an element
         * that ignores pointer events cannot be given a click handler. So the click
         * lands here, on the layer underneath, and the section is found by hit test
         * instead. Frames keep their own events, so clicking a case study still
         * opens the case study; only the surface around them snaps.
         *
         * The distance check is what separates a click from the end of a pan.
         * Without it, every drag that started over a section ended by yanking the
         * board back to that section's centre. */}
        <motion.div
          drag={drag}
          dragConstraints={{
            left: -CLAMP.x,
            right: CLAMP.x,
            top: -CLAMP.y,
            bottom: CLAMP.y,
          }}
          dragMomentum={false}
          dragElastic={0.05}
          style={{ x, y }}
          onPointerDown={(e) => {
            press.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerMove={(e) => {
            const hit = sectionAt(e.clientX, e.clientY, x.get(), y.get());
            setHovered(hit?.id ?? null);
          }}
          onPointerLeave={() => setHovered(null)}
          onClick={(e) => {
            const start = press.current;
            press.current = null;
            if (!start) return;
            if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6)
              return;
            const hit = sectionAt(e.clientX, e.clientY, x.get(), y.get());
            if (hit) goTo(hit.id, hit.x, hit.y);
          }}
          className={cn("absolute inset-0", hovered && "cursor-pointer")}
        />

        <div
          ref={field}
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          {/* Back to the quieter original weight. `--muted-foreground/35` was tuned to
            be findable on a small hero card; across a full viewport the same value
            reads as a busy texture competing with the type. `/16` gives the surface
            grain without asking to be looked at. */}
          <DotPattern
            width={TILE}
            height={TILE}
            cr={1}
            className="fill-muted-foreground/16"
          />
          <DotTrail tile={TILE} />
        </div>

        {/* The board. One layer, everything on it, all sharing the pan. */}
        <motion.div
          style={{ x, y }}
          // `data-board` marks everything pinned to the canvas, so the focus watcher
          // can tell board content from viewport-fixed chrome like the rail.
          data-board
          className="pointer-events-none absolute inset-0"
        >
          {SECTIONS.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              lang={lang}
              hovered={hovered === section.id}
              onscreen={onscreen.split(",").includes(section.id)}
              onOpenCv={() => setCvOpen(true)}
            />
          ))}

          {/* The claim, at the origin, as the selected layer. */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* The frame is the padded box itself rather than a border drawn at a
                negative inset around tight content. Same picture, but the breathing
                room is real padding the type sits inside — which is what a frame in
                a design file is — so widening it is one number instead of four
                offsets and a label position that all have to agree.
             *
             * 960 is set by the claim, not chosen: Spanish runs long, and at 720 it
             * broke to three lines while English kept two — the same frame reading
             * as two different compositions depending on the toggle. Measured on the
             * board, ES clears two lines at a 888px frame; 960 is that plus enough
             * headroom that a font swap or a copy edit doesn't push it back. It
             * stays under a section's 1025px so the claim is still the smaller
             * object on the board. */}
            <div className="pointer-events-auto relative w-[min(90vw,960px)] px-14 py-12 text-center">
              <div className="border-canvas-component pointer-events-none absolute inset-0 rounded-[2px] border" />
              {[
                "-top-1 -left-1",
                "-top-1 -right-1",
                "-bottom-1 -left-1",
                "-bottom-1 -right-1",
              ].map((pos) => (
                <span
                  key={pos}
                  aria-hidden
                  className={cn(
                    "border-canvas-component bg-background absolute size-2 rounded-[1px] border",
                    pos
                  )}
                />
              ))}
              {/* The selection header: glyph and component name on the left, the
                  dev-mode affordance on the right, both riding above the border
                  rather than inside a box.
               *
               * Name and glyph share the violet, which is how a design file marks a
               * component — the colour IS the statement that this is one, so
               * splitting it (violet mark, neutral name) said half of it. Four words
               * is short enough that the accent stays chrome. */}
              <div className="absolute -top-5 right-0 left-0 flex items-center justify-between gap-4 font-mono text-[11px] leading-none">
                <span className="text-canvas-component flex items-center gap-1.5 whitespace-nowrap">
                  <ComponentGlyph />
                  {pick(COMPONENT_NAME, lang)}
                </span>
                <span aria-hidden className="text-muted-foreground">
                  &lt;/&gt;
                </span>
              </div>
              {/* The apron — Figma's dimension badge, carrying the place line. A
                  filled violet pill rather than bare type, because that's what
                  distinguishes the slot: the name floats, the measurement sits in a
                  chip. Centred under the frame, same as the readout it's standing
                  in for. */}
              <span className="bg-canvas-component-fill text-canvas-component-foreground absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-[3px] px-2 py-1 font-mono text-[10px] leading-none whitespace-nowrap">
                {pick(PLACE, lang)}
              </span>
              <div className="flex flex-col items-center gap-6">
                <Claim className="text-3xl sm:text-4xl lg:text-5xl" />
                <p className="text-prose-body max-w-md text-xs">
                  {pick(SUBTITLE, lang)}
                </p>
                {/* `pointer-events-auto` because the board layer is
                    `pointer-events-none`; see the note on TalkTile. */}
                <div className="pointer-events-auto flex items-center gap-3 pt-2">
                  <HeroActions lang={lang} onGo={goToStop} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The hand tool. Mounted only while space is held, above the frames, so the
          board can be grabbed from anywhere rather than only from the gaps. z-10
          keeps it under the rail — the section buttons stay clickable mid-grab. */}
        {drag && grabbing ? (
          <motion.div
            drag
            dragConstraints={{
              left: -CLAMP.x,
              right: CLAMP.x,
              top: -CLAMP.y,
              bottom: CLAMP.y,
            }}
            dragMomentum={false}
            dragElastic={0.05}
            style={{ x, y }}
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
          />
        ) : null}

        {/* Navigation, using the site header's own grow-sideways move. Fixed to the
          viewport, never to the board — the guarantee that the site is navigable
          without anyone discovering that it pans. On touch, where the board can't be
          dragged at all, it's the ONLY way through, so it is never hover-gated.
          See components/canvas/canvas-rail.tsx. */}
      </div>

      <CanvasStack onOpenCv={() => setCvOpen(true)} onGo={goToStop} />

      {/* The dialog renders here, outside the board — it's a fixed overlay and has
          no business being pinned to a surface that pans. Same split site-header.tsx
          makes: the trigger lives in the layout, the dialog lives where there's room. */}
      <CvModal open={cvOpen} onOpenChange={setCvOpen} triggerless />

      <CanvasRail
        stops={stops.map((s) => ({ id: s.id, label: s.label }))}
        active={active}
        onSelect={goToStop}
      />
    </>
  );
}

/** A labelled region of the board holding its frames — Figma's section, essentially. */
function SectionBlock({
  section,
  lang,
  hovered,
  onscreen,
  onOpenCv,
}: {
  section: Section;
  lang: ReturnType<typeof useLang>["lang"];
  /** Pointer is over this section's box — see the hit test on the drag surface. */
  hovered: boolean;
  /** The board has brought this section into view; its clips should run. */
  onscreen: boolean;
  onOpenCv: () => void;
}) {
  const items = (section.slugs ?? []).map(bySlug);
  const cols = section.cols ?? 1;
  // Panels are authored at a fixed size rather than derived from a frame grid —
  // they hold controls and copy, not a row of work. Contact is square so the tile
  // inside keeps its own proportions rather than being squashed into a letterbox.
  const { w, h } = sectionSize(section);

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{ translate: `${section.x - w / 2}px ${section.y - h / 2}px` }}
    >
      {/* Section name, in Figma's position and idiom. This is what keeps a visitor
          oriented: wherever the board is, whatever is on screen is named. */}
      {/* The section header row: name on the left, the way out on the right.
       *
       * "See all" sits here rather than inside the section because the board only
       * carries a curated few of each kind — three case studies out of eight — so
       * without it a section quietly implies that's everything there is. Putting it
       * on the header line means it's found at the same moment the section is,
       * instead of after scanning the frames.
       *
       * Always visible, not hover-revealed. It's the only route from the board to
       * the real index pages, and a primary path shouldn't be something you have to
       * discover by hovering the right patch of canvas. */}
      {/* Both sit at the LEFT, together, rather than pushed to opposite ends.
       *
       * Right-aligning "See all" put it at x=839 inside an 820px viewport: a section
       * is 1025px wide, so on any screen narrower than that the one route out of the
       * board was off the edge. Anchoring it to the label means it's visible whenever
       * the section's name is, at every width. */}
      <div className="absolute -top-8 left-0 flex items-end gap-2">
        <span
          aria-hidden
          className="bg-muted text-foreground rounded-md px-2.5 py-1 font-mono text-[11px] whitespace-nowrap"
        >
          {pick(section.label, lang)}
        </span>
        {section.href ? (
          <Link
            href={section.href}
            className="text-muted-foreground hover:text-foreground pointer-events-auto rounded-md px-2 py-1 font-mono text-[11px] whitespace-nowrap transition-colors"
          >
            {t("nav.see_all", lang)} →
          </Link>
        ) : null}
      </div>
      {/* A real surface, not an outline. `--muted` is the site's step above the page
          — near-white on light, and in dark a genuine grey sitting above the almost
          black `--background`, which is the relationship Richard wanted. It also
          gives the frames something to sit ON, so a section reads as a region of the
          board rather than a dotted rectangle drawn around some cards. */}
      {/* The border carries the click affordance. The whole surface is a snap
          target, but nothing said so — an invisible target is a target nobody uses,
          and on a board where dragging is also a thing you do with the same pointer
          it just reads as dead space. Lifting the border to `--primary` on hover is
          the selection colour this board already uses for the claim frame, so it
          says "this is a thing" in the vocabulary that's here. */}
      <div
        className={cn(
          "ease-out-soft rounded-xl border transition-colors duration-[var(--duration-base)]",
          hovered ? "border-primary/70 bg-muted" : "border-border bg-muted"
        )}
        style={{
          width: w,
          height: h,
          padding: GAP,
          display: "grid",
          gap: GAP,
          ...(section.contact
            ? {}
            : { gridTemplateColumns: `repeat(${cols}, ${FRAME}px)` }),
        }}
      >
        {section.contact ? (
          // The site's own contact tile, not a canvas-specific one. It carries the
          // clip, copy-to-clipboard, the mailto fallback and the live region
          // already — see components/talk-tile.tsx.
          <div className="grid size-full grid-cols-2 gap-5">
            {/* `pointer-events-auto` is load-bearing: the board layer is
                `pointer-events-none` so the canvas can be dragged through the gaps,
                and without opting back in the tile got no events at all — no hover,
                so no clip, and a dead mailto and copy button. */}
            <TalkTile className="pointer-events-auto size-full" />
            <CvFrame onOpen={onOpenCv} />
          </div>
        ) : (
          items.map((item) => (
            <SectionFrame key={item.slug} item={item} play={onscreen} />
          ))
        )}
      </div>
    </div>
  );
}

const CV_COPY: Bilingual<string> = {
  en: "Roles, tools and the shape of the last few years.",
  es: "Puestos, herramientas y la forma de los últimos años.",
};

/**
 * The CV, as a frame beside the contact tile.
 *
 * It opens the site's existing `CvModal` rather than a canvas-specific version —
 * the dialog is controlled, and `site-header.tsx` already drives it exactly this
 * way: a trigger in one place, the dialog rendered somewhere with room. The board
 * has no header, so this is the only place a visitor could otherwise reach it.
 */
function CvFrame({ onOpen }: { onOpen: () => void }) {
  const { lang } = useLang();
  return (
    <button
      type="button"
      onClick={onOpen}
      // Marks this as the CV entry point. The header's CV button is found by its
      // text; this one carries a blurb, so it needs a marker the check can match.
      data-cv-open
      className="border-border bg-card ease-out-soft pointer-events-auto flex size-full flex-col justify-between rounded-2xl border p-6 text-left transition-shadow duration-[var(--duration-base)] hover:shadow-lg"
    >
      {/* No mono eyebrow above the title. On a work card that slot carries the
          kind ("Process", "Methodology") — a different word from the title, which
          is what makes it worth the line. Here both strings were `nav.cv`, so the
          frame opened by saying CV twice and the second one looked like a bug. */}
      <span className="flex flex-col gap-2">
        <span className="text-foreground text-xl font-bold">
          {t("nav.cv", lang)}
        </span>
        <span className="text-prose-body text-xs leading-relaxed">
          {pick(CV_COPY, lang)}
        </span>
      </span>
      <span className="text-muted-foreground font-mono text-[11px]">
        {t("home.read_more", lang)} →
      </span>
    </button>
  );
}

/**
 * A work frame on the board.
 *
 * `play` is the section arriving on screen — see the position watcher in
 * CanvasSite, which computes it from the board offset.
 *
 * Playing on arrival rather than only on hover is the point. The board opens on
 * the claim with every section off-screen, so unconditional autoplay meant a
 * dozen clips running the whole time nobody was looking at them — which is why
 * the veto below exists at all. Hover was the first answer and it's the wrong
 * one: someone who pans to Case studies is looking straight at the work, and
 * making them hover each card to discover it moves means most people never find
 * out that it does. Hover is kept on top, for the frames that are on screen
 * while the pointer is somewhere else.
 */
function SectionFrame({ item, play }: { item: WorkItem; play: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  /** Pointer is on the frame. */
  const hovering = useRef(false);
  /**
   * Mirror of `play`, in a ref, because the observers below run outside React's
   * render and need the current answer rather than the one they closed over.
   *
   * Reduced motion opts out of the automatic half: a looping clip that started
   * itself is exactly what that setting is about. Hover still plays, because
   * that one is a deliberate act.
   */
  const onscreen = useRef(false);

  useEffect(() => {
    onscreen.current = play && !reduced;
    box.current?.querySelectorAll("video").forEach((v) => {
      if (hovering.current || onscreen.current) void v.play().catch(() => {});
      else v.pause();
    });
  }, [play, reduced]);

  /**
   * Veto playback instead of pausing once.
   *
   * A one-shot pause on mount isn't enough: `CardMedia` keys its <video> on
   * `${video}_${lang}_${mode}_thumb.mp4`, and `mode` resolves in an effect after
   * first render — so the element that was paused gets thrown away and replaced by
   * a fresh autoplaying one. Same thing happens on any theme or language change.
   * Measured two clips running at rest before this.
   *
   * Listening for `play` catches every element, whenever it appears. Capture phase
   * is required: `play` does not bubble.
   */
  useEffect(() => {
    const el = box.current;
    if (!el) return;

    /**
     * Disarm at insertion rather than pausing after the fact.
     *
     * Letting a clip start and then calling `pause()` works, but it rejects the
     * browser's pending autoplay promise — "The play() request was interrupted by
     * a call to pause()" — which lands in the console as an uncaught rejection and
     * trips the dev overlay. Clearing `autoplay` on the element as soon as it
     * appears means the attempt is never made.
     *
     * A MutationObserver rather than a one-shot pass, because CardMedia replaces
     * its <video> whenever the resolved theme or language changes.
     *
     * A replacement that lands while the frame is on screen is started rather than
     * disarmed — otherwise switching theme mid-section silently kills the clip that
     * was already playing.
     */
    const disarm = (scope: ParentNode) => {
      scope.querySelectorAll("video").forEach((v) => {
        if (hovering.current || onscreen.current) {
          void v.play().catch(() => {});
          return;
        }
        v.autoplay = false;
        v.pause();
      });
    };

    disarm(el);
    const mo = new MutationObserver(() => disarm(el));
    mo.observe(el, { childList: true, subtree: true });

    // Backstop for anything that still manages to start.
    const veto = (e: Event) => {
      if (!hovering.current && !onscreen.current)
        (e.target as HTMLVideoElement).pause();
    };
    el.addEventListener("play", veto, true);

    return () => {
      mo.disconnect();
      el.removeEventListener("play", veto, true);
    };
  }, []);

  const setHovering = (on: boolean) => {
    hovering.current = on;
    box.current?.querySelectorAll("video").forEach((v) => {
      if (hovering.current || onscreen.current) void v.play().catch(() => {});
      else v.pause();
    });
  };

  return (
    <div
      ref={box}
      className="pointer-events-auto"
      style={{ width: FRAME }}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <WorkCard item={item} index={0} caption={false} />
    </div>
  );
}

/**
 * The mobile layout: the same board, with the spatial layer removed.
 *
 * Not a second site and not a redirect. The board's information architecture is
 * already right for a phone — claim, then case studies, then blog, then contact and
 * CV — so mobile is that same order rendered as an ordinary scrolling page. It reads
 * the same `SECTIONS` array and renders the same `WorkCard`, `TalkTile` and
 * `CvFrame`, which means there is exactly one content model to keep true.
 *
 * What's dropped is dropped honestly. No pan, no space-grab, no dot trail, no custom
 * cursor: touch has no hover and no pointer to replace, and a 1025px section has
 * nowhere to go in a 390px column. The board's own guard already hid most of that;
 * this is the layout that replaces it rather than leaving a gap.
 *
 * It also removes the responsive gate's complaint at mobile widths, because there is
 * no off-viewport board here to measure — the exemption that remains is scoped to the
 * desktop board alone.
 */
function CanvasStack({
  onOpenCv,
  onGo,
}: {
  onOpenCv: () => void;
  /** Same handler the board uses — here it scrolls to the section instead of panning. */
  onGo: (id: string) => void;
}) {
  const { lang } = useLang();

  return (
    <main className="bg-background flex w-full flex-col gap-16 px-5 pt-16 pb-32 lg:hidden">
      {/* The claim, without the selection chrome. The frame and handles are a
          design-file metaphor for a surface you can move; nothing here moves, so
          they'd be decoration making a promise the page doesn't keep. */}
      <section id="stack-home" className="flex scroll-mt-6 flex-col gap-5">
        <Claim className="text-3xl sm:text-4xl" />
        <p className="text-prose-body text-sm">{pick(SUBTITLE, lang)}</p>
        <div className="flex items-center gap-3">
          <HeroActions lang={lang} onGo={onGo} />
        </div>
        {/* The place line, kept as copy and dropped to the end of the block — the
            same position it holds on the board, minus the chip. The chip is a
            readout for a selected object, and there's no selection here; the words
            are what matter and they still land last, after the claim has been
            made. The component name doesn't come across at all: it labels a frame,
            and this layout has none. */}
        <span className="text-muted-foreground font-mono text-[11px] leading-none">
          {pick(PLACE, lang)}
        </span>
      </section>

      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={`stack-${section.id}`}
          className="flex scroll-mt-6 flex-col gap-4"
        >
          {/* Same header row as the board — name, and the way out to the real
              index. "See all" matters MORE here: the stack shows the same curated
              few, so without it the section still implies that's everything. */}
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-foreground font-mono text-[11px]">
              {pick(section.label, lang)}
            </h2>
            {section.href ? (
              <Link
                href={section.href}
                className="text-muted-foreground hover:text-foreground font-mono text-[11px] whitespace-nowrap"
              >
                {t("nav.see_all", lang)} →
              </Link>
            ) : null}
          </div>

          {section.contact ? (
            <div className="flex flex-col gap-4">
              <TalkTile className="aspect-square w-full" />
              <CvFrame onOpen={onOpenCv} />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(section.slugs ?? []).map(bySlug).map((item) => (
                <WorkCard key={item.slug} item={item} index={0} />
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
