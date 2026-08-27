"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
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
import { sortKey, WORK, type WorkItem } from "@/lib/content/work";
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

/**
 * How far the board can travel from origin, at 100%. Sized to reach the outermost
 * section.
 *
 * Multiplied by the zoom everywhere it's used, because the offset is in SCREEN pixels
 * while the sections it has to reach are in BOARD pixels: bringing a section at board
 * x=-900 to the middle of the viewport takes 900px of travel at 100% and 1800 at
 * 200%. A fixed limit would be the same board extent only at one zoom level — it
 * would pin the far sections out of reach zoomed in, and let you drag the whole board
 * off into empty space zoomed out. See `panLimit`.
 */
const CLAMP = { x: 1250, y: 800 };

/**
 * Zoom range and step, as scale factors where 1 is 100%.
 *
 * Narrower than Figma's 2%–256%, deliberately: this board is a composition with a
 * known extent, not an open file. 25% is the point where all four sections and the
 * claim are on screen at once — the overview this exists to give — and past 200% the
 * frames are just large, since there's no fine detail under them to inspect. A range
 * you can't get lost in doesn't need a "zoom to fit" to rescue you from it.
 */
const ZOOM = { min: 0.25, max: 2 };

/** One press of the rail's + / −. 1.25 is four presses across the range. */
const ZOOM_STEP = 1.25;

/**
 * Screen px the board travels per arrow press, and the multiplier Shift adds.
 *
 * 32 reads as a deliberate nudge on a single tap, and at a held key's ~30 repeats a
 * second it glides at roughly 950px/s — near enough a comfortable drag. 10x on Shift
 * is Figma's own nudge ratio, which puts a neighbouring section two presses away
 * instead of thirty.
 */
const PAN_STEP = 32;
const PAN_BIG = 10;

/**
 * PageUp / PageDown travel, as a fraction of the viewport. Short of a full screen on
 * purpose: the sliver of overlap is what tells you the two views are the same board.
 */
const PAN_PAGE = 0.9;

/**
 * Scale change per pixel of wheel delta, as an exponent.
 *
 * Exponential rather than linear, so a notch is the same PROPORTIONAL change wherever
 * you already are — linear zoom crawls at 200% and lurches at 25%. At 0.002, a mouse
 * wheel's ±100 notch is a factor of 1.22, near enough Figma's step that ⌘-wheel and
 * the rail buttons feel like the same control; a trackpad pinch arrives in deltas of
 * a few px per frame and lands somewhere continuous.
 */
const ZOOM_RATE = 0.002;

const clampTo = (v: number, limit: number) =>
  Math.min(Math.max(v, -limit), limit);

/** The board's travel limit on an axis at a given zoom. See CLAMP. */
const panLimit = (axis: "x" | "y", zoom: number) => CLAMP[axis] * zoom;

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
 * Frames each content section carries. Per-section as of 2026-08-26, not shared.
 *
 * It was one number for both, raised 4 -> 5 on 2026-08-25 when Audemic became two
 * case studies. Case studies keeps four: the board is the only place a visitor sees
 * more than one client at once, and at three it showed work for two. Blog drops to
 * three, because three is a shortlist and four is an index — and the "See all" on
 * the header row is what the fourth would have been.
 *
 * Different counts mean different WIDTHS — sectionWidth(4) = 1360px against
 * sectionWidth(3) = 1025px — so the section POSITIONS below moved with them. A
 * lopsided composition at the old coordinates put the intro's bounding box 94px
 * left of the claim, which is the one thing the opening shot exists to centre.
 */
const CASE_STUDY_FRAMES = 4;
const WRITING_FRAMES = 3;

/**
 * The kinds /writing gathers. Duplicated from writing-list.tsx rather than imported
 * because that module is a page component — pulling it in here would drag the whole
 * route's tree into the board's bundle for the sake of a three-string array.
 */
const WRITING_KINDS: readonly string[] = ["blog", "process", "methodology"];

/**
 * The newest few of a kind, picked the way the index page behind them picks.
 *
 * Derived rather than listed by hand. A hand-written slug list is a second place to
 * remember: publish something and the board keeps showing last month's work until
 * someone edits this file, and the "See all" underneath is then lying about what it
 * leads to. Same filter as projects-list.tsx and writing-list.tsx.
 *
 * The sort is date order with one exception, `homeRank` — see its note in work.ts.
 * Date order is right for the tail and wrong for the head: it lets publication
 * timing decide which piece a visitor reads first. A rank pins the two or three
 * that have to hold a position and leaves everything else self-maintaining, which
 * is the part a hand-written list would have thrown away.
 */
const newest = (match: (item: WorkItem) => boolean, count: number) =>
  WORK.filter((item) => match(item) && !item.hidden && !item.homeHidden)
    .sort((a, b) => {
      // Ranked items lead, lowest first; everything else keeps date order behind
      // them. Infinity rather than a large number so an unranked item can never
      // tie with a ranked one and fall through to the date comparison — that
      // would let a recent post outrank a pin.
      const ra = a.homeRank ?? Infinity;
      const rb = b.homeRank ?? Infinity;
      if (ra !== rb) return ra - rb;
      return sortKey(b).localeCompare(sortKey(a));
    })
    .slice(0, count)
    .map((item) => item.slug);

/**
 * Sections placed around the claim rather than in a line: the board reads as a
 * workspace someone actually arranged, and each direction from centre leads
 * somewhere. Case studies sit closest, because they're what the positioning rests on.
 */
const SECTIONS: Section[] = [
  {
    id: "case-studies",
    label: { en: "Case studies", es: "Casos de estudio" },
    /**
     * Moved from -900 on 2026-08-26, with Blog and Contact, when the two content
     * sections stopped being the same width.
     *
     * The three coordinates are one decision, so they're derived rather than
     * nudged until they looked right. Contact and Case studies are the two boxes
     * on the left, so their LEFT edges are made to line up: Contact is 1025 wide
     * at x -870 (left edge -1382.5) and Case studies is 1360 wide at x -700 (left
     * edge -1380). Blog is then placed to mirror that edge — 870, right edge
     * +1382.5 — which is what puts the bounding box's centre exactly on the claim
     * instead of 94px to its left.
     *
     * Measured at 1440x900: the intro overview goes 0.408 -> 0.463, so a frame in
     * the opening shot goes 128px -> 146px, and the clearance between the two
     * grids is 175px against the old 171px. Furthest section from the origin drops
     * from 950 to 870, comfortably inside CLAMP.x.
     */
    x: -700,
    y: 520,
    href: "/projects",
    slugs: newest((item) => item.kind === "case-study", CASE_STUDY_FRAMES),
    cols: CASE_STUDY_FRAMES,
  },
  {
    id: "writing",
    label: { en: "Blog", es: "Blog" },
    x: 870,
    y: 520,
    href: "/writing",
    slugs: newest((item) => WRITING_KINDS.includes(item.kind), WRITING_FRAMES),
    cols: WRITING_FRAMES,
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
    x: -870,
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
  const count = section.slugs?.length ?? 0;
  const rows = Math.ceil(count / cols);
  /**
   * Width follows what's actually IN the section, not the column count it's allowed.
   *
   * `cols` is a ceiling now that the slugs are derived — Blog has three published
   * pieces against a four-frame allowance, and sizing to the allowance would draw a
   * 1360px surface with a 315px hole where the fourth frame isn't. A section should
   * look full, and this one widens by itself the day a fourth post lands.
   */
  const used = Math.max(1, Math.min(cols, count));
  return {
    w: section.contact ? CONTACT_W : sectionWidth(used),
    h: section.contact ? CONTACT_H : rows * FRAME + (rows - 1) * GAP + GAP * 2,
  };
}

/**
 * Padding, in screen px, held clear on every side when the intro frames the whole
 * composition — see `overviewFraming`. Big enough that the outermost section's
 * border isn't touching the viewport edge, small enough it doesn't eat into the fit.
 */
const OVERVIEW_PAD = 80;

/**
 * The camera position and scale that frames the entire composition — the shot the
 * intro opens on before flying in to home. See the intro effect in CanvasSite.
 *
 * Derived from SECTIONS rather than a hardcoded number (~0.42 was tried and is
 * wrong): sections get added and moved, and a fixed fit silently stops matching
 * the composition the day one of them does. The hero itself never widens the box
 * — it sits at the origin, enclosed by the sections that surround it, so the
 * box's extremes are always a section's corner, never the claim's.
 */
function overviewFraming(vw: number, vh: number) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const s of SECTIONS) {
    const { w, h } = sectionSize(s);
    minX = Math.min(minX, s.x - w / 2);
    maxX = Math.max(maxX, s.x + w / 2);
    minY = Math.min(minY, s.y - h / 2 - LABEL_ROW);
    maxY = Math.max(maxY, s.y + h / 2);
  }
  const bboxW = maxX - minX;
  const bboxH = maxY - minY;
  const fit = Math.min(
    (vw - OVERVIEW_PAD * 2) / bboxW,
    (vh - OVERVIEW_PAD * 2) / bboxH
  );
  const scale = Math.min(Math.max(fit, ZOOM.min), 1);
  // Centres the BBOX's centre, not the origin: Contact sits at y −520 and the two
  // grids sit at y +520, so the box isn't symmetric about the claim — centring on
  // the origin instead would leave the composition sitting low in the frame.
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  // Run through the same clamp every other camera path in the file respects.
  // The fit never overflows CLAMP at realistic viewports today, but nothing
  // stops a future SECTIONS edit from pushing it past that — this is the
  // invariant, not an optional extra.
  return {
    x: clampTo(-cx * scale, panLimit("x", scale)),
    y: clampTo(-cy * scale, panLimit("y", scale)),
    k: scale,
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
 *
 * The claim is in here too, as `home`. It's the one object on the board that
 * wasn't a snap target, which made it the one object you could pan away from and
 * not click your way back to — the rail's Start button was the only route, and
 * "click the thing to go to the thing" is the rule everything else follows.
 *
 * Its size is measured rather than derived, because unlike a section it has no
 * grid to compute from — the height falls out of a headline that rewraps per
 * language and breakpoint. `hero` is a ref value, read here rather than in
 * render, so this stays the pure arithmetic the note above insists on: one
 * measurement taken when the box changes, not a DOM read mid-pan.
 */
const HOME_STOP = { id: "home", x: 0, y: 0 } as const;

function sectionAt(
  px: number,
  py: number,
  bx: number,
  by: number,
  z: number,
  hero: { w: number; h: number } | null
) {
  const cx = window.innerWidth / 2 + bx;
  const cy = window.innerHeight / 2 + by;
  // Every board measurement below goes through the zoom, including the label row.
  // The row is a board object — it scales with the section it names — so a fixed
  // 32px reach above the box would be a generous margin at 25% and a dead strip at
  // 200%, where the name has moved further up than the test is looking.
  const pad = LABEL_ROW * z;
  const hit =
    SECTIONS.find((s) => {
      const box = sectionSize(s);
      const w = box.w * z;
      const h = box.h * z;
      const left = cx + (s.x - box.w / 2) * z;
      const top = cy + (s.y - box.h / 2) * z;
      return px >= left && px <= left + w && py >= top - pad && py <= top + h;
    }) ?? null;
  if (hit) return hit as { id: string; x: number; y: number };
  if (!hero) return null;
  // Grown at BOTH ends: the claim wears its name above and its apron below, and
  // both are part of the object rather than decoration beside it.
  const w = hero.w * z;
  const h = hero.h * z;
  const left = cx - w / 2;
  const top = cy - h / 2;
  return px >= left && px <= left + w && py >= top - pad && py <= top + h + pad
    ? (HOME_STOP as { id: string; x: number; y: number })
    : null;
}

const bySlug = (slug: string): WorkItem => {
  const item = WORK.find((w) => w.slug === slug);
  if (!item) throw new Error(`canvas-site: unknown slug ${slug}`);
  return item;
};

const HEADLINE: Bilingual<{ name: string; claim: string; altClaim: string }> = {
  en: {
    name: "I'm Richard.",
    claim: " I build design systems with AI.",
    altClaim: " I design cool shit with AI.",
  },
  es: {
    name: "Soy Richard.",
    claim: " Construyo sistemas de diseño con IA.",
    altClaim: " Diseño cosas que molan con IA.",
  },
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
 *
 * Hovering the headline swaps the claim half for a playful alternate and lets
 * `HyperText` scramble to it, the same mechanism the language toggle already
 * rides. `hovered` is an optional override rather than always reading a local
 * `onPointerEnter`: on the board, this element sits inside the hero frame,
 * which is `pointer-events-none` so a click on the claim falls through to the
 * drag layer underneath — the h1 itself never sees a pointer event there. The
 * board already tracks which section the pointer is over for its own hit
 * test (`hovered === "home"` is this same frame), so that's what drives it
 * instead. The mobile stack has no such layer, so it falls back to its own
 * `onPointerEnter`/`onPointerLeave` — a no-op on touch, which is fine, there's
 * no hover to swap on there anyway.
 */
function Claim({
  className,
  hovered,
}: {
  className: string;
  /** Board only — see above. Omitted on mobile, where the h1 tracks its own hover. */
  hovered?: boolean;
}) {
  const { lang } = useLang();
  const { name, claim, altClaim } = pick(HEADLINE, lang);
  const lead = name.length * CLAIM_STEP;

  const [selfHovered, setSelfHovered] = useState(false);
  const isHovered = hovered ?? selfHovered;

  /**
   * The opening `delay` only belongs to the FIRST resolve, where it holds the
   * claim half scrambled for the length of the name so the pair reads as one
   * continuous sweep. A later hover swap has no name sweeping in front of it —
   * with the same delay it would sit scrambled for `lead`ms every time the
   * pointer arrives, which reads as lag rather than a reaction. `ready` flips
   * once, after the opening pass has had time to land, and every swap after
   * that gets delay 0.
   */
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), lead);
    return () => clearTimeout(t);
  }, [lead]);

  const claimText = isHovered ? altClaim : claim;

  return (
    <h1
      className={className}
      onPointerEnter={
        hovered === undefined ? () => setSelfHovered(true) : undefined
      }
      onPointerLeave={
        hovered === undefined ? () => setSelfHovered(false) : undefined
      }
    >
      <HyperText className="text-muted-foreground" duration={lead}>
        {name}
      </HyperText>
      {/* `animateOnHover={false}` — the swap between `claim` and `altClaim` is
          already a scramble, driven by `children` changing. Left at its
          default, the pointer landing on this span would ALSO fire its own
          replay of whatever text is already showing, a second scramble
          racing the first one in. */}
      <HyperText
        className="text-foreground"
        delay={ready ? 0 : lead}
        duration={claimText.length * CLAIM_STEP}
        animateOnHover={false}
      >
        {claimText}
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
 * The bump is to the BOX, not the type. `text-base` set the labels at 16px, a
 * third larger than the 12px subtitle directly above them — so the loudest type
 * in the frame after the claim was two nav words, and a heavy 16px label on a
 * wide fill is the shape of a generic template CTA. Back to the button scale's
 * own 14px, which still reads as a control under a 48px headline without
 * out-ranking the sentence that explains it, and h-10 so the box follows the
 * label down instead of leaving it swimming.
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
const CTA = "h-10 px-5 text-sm";

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

/** How long the overview holds before the camera starts moving home. Sized for a
 *  first-time visitor to actually read the shot — four sections and the claim —
 *  not for pace; a hold tuned for rhythm rather than comprehension would be
 *  shorter than this. */
const INTRO_HOLD = 900;
/** The flight home, in seconds. Longer than `goTo`'s 0.75s: this trip covers the
 *  whole board rather than one section, and should read as a deliberate opening
 *  move rather than a snap. */
const INTRO_FLIGHT = 1.1;
/** The board's fade-in, in seconds — the numeric form of `--duration-base`
 *  (200ms) from globals.css. An animation script value, not a CSS variable
 *  reference: `animate()` can't read a custom property, which is why every
 *  camera move in this file (`goTo`, `zoomTo`, the intro flight above) already
 *  states its duration and ease as plain numbers rather than tokens. */
const REVEAL_DURATION = 0.2;

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
  /** The claim's frame, so the hit test knows how big the `home` target is. */
  const hero = useRef<HTMLDivElement>(null);
  const heroBox = useRef<{ w: number; h: number } | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  /**
   * The board's scale, and the whole model the zoom rests on.
   *
   * Motion composes `style={{ x, y, scale }}` as `translate(x, y) scale(k)` from a
   * centred origin, and the board fills the viewport — so a point `p` in board
   * coordinates lands at `viewportCentre + (x, y) + k · p`. Two things follow, and
   * every calculation below is one of them:
   *
   *   1. `x`/`y` stay in SCREEN pixels. A drag of 100px is 100px of offset at any
   *      zoom, which is why the drag gesture needed no arithmetic at all.
   *   2. Board coordinates go through `k`. Anything that converts between the two —
   *      the hit test, the on-screen test, the rail's snap — multiplies by it.
   */
  const k = useMotionValue(1);
  /**
   * The scale as React state, for the two things that can't read a motion value:
   * the rail's percentage, and the drag constraints, which are props rather than
   * a live subscription.
   *
   * A render per zoom frame, where the pan deliberately costs none. That's the right
   * trade here and not a slip: a pan is continuous and can run for seconds, while a
   * zoom is a short bounded gesture — and the two consumers are a number a visitor
   * reads and a limit that's only sampled when a drag starts. The transform itself
   * still comes off the motion value, so the board never waits for React.
   */
  const [zoom, setZoom] = useState(1);
  useEffect(() => k.on("change", setZoom), [k]);
  /**
   * Where the zoom is going, as opposed to where it is. Only the stepped controls
   * read it — see `zoomBy`. Every path through `zoomTo` writes it, including the
   * wheel, so a pinch immediately after a button press steps from the pinch.
   */
  const zoomAim = useRef(1);

  /**
   * Motion blur for the intro's flight home — see the intro effect below.
   *
   * A dedicated value and an explicit keyframe run, not `useVelocity(k)`. A
   * velocity subscription would stay alive for the life of the page, costing
   * work on every ordinary pan and pinch afterward, and it wouldn't guarantee
   * landing on exactly 0 — a blurred final frame is what would make this read
   * cheap instead of deliberate.
   */
  const blur = useMotionValue(0);
  /**
   * `"none"` at zero, not `"blur(0px)"`. `motion.div` applies `style` values
   * imperatively and never removes a key once it's been set, so a filter that
   * ever resolved to `blur(0px)` would stay in the inline style permanently —
   * paying the compositor's raster-layer cost for the rest of the session for
   * an effect nobody can see. `none` is the documented way to actually turn a
   * filter off, so this can stay bound to the style for good instead of being
   * conditionally applied — see the two call sites below, neither of which
   * gates it on `introRunning` any more.
   */
  const blurFilter = useTransform(blur, (b) =>
    b === 0 ? "none" : `blur(${b}px)`
  );
  /**
   * Whether the opening shot is currently running. Only gates the `onscreen`
   * prop that starts section video now — see the call site below and the note
   * on why the overview scale would otherwise start three clips at once. The
   * blur filter above no longer depends on it; see `blurFilter`.
   */
  const [introRunning, setIntroRunning] = useState(false);
  /**
   * The board layer's visibility — see the fade-in on its `motion.div` below.
   * Starts at 0 in server HTML on purpose, same as `blur` above.
   *
   * `useLayoutEffect` alone cannot stop the visitor seeing the home framing
   * before the overview: it runs at hydration, which is necessarily after
   * the browser's first paint of the server HTML, and the server has no way
   * to know the overview ahead of time. What it CAN do is keep that first
   * paint from being invisible — the board starts transparent, and this
   * animates to 1 in the same pre-paint pass that sets the overview framing,
   * so the first frame anyone actually sees is the overview fading in, never
   * the home position popping out to it.
   *
   * A motion value animated with `animate()`, not a CSS class toggle. A
   * class-based `opacity-0`/`opacity-100` swap looked like the obvious fit —
   * Tailwind's `transition-opacity` is what the rest of the file reaches for
   * — but measured on a real page load, the swap at the hydration boundary
   * never produced an animated frame: the class flips from one committed
   * style straight to the other with no rendering opportunity in between for
   * the browser to register a "before" state to transition from, so it reads
   * as an instant cut rather than a fade. `animate()` drives the value itself
   * frame by frame, the same way it already does for `blur`/`x`/`y`/`k`, so
   * it doesn't depend on that timing at all.
   *
   * The dot field is NOT gated by this — see its own note — so the surface
   * still reads as present while the composition arrives.
   */
  const opacity = useMotionValue(0);

  /**
   * The opening camera move: the board opens on an overview of the whole
   * composition, holds a beat, then flies in to home. This is the board's own
   * camera doing the same kind of move `goTo` does, at a longer duration and
   * on a bigger trip — not a load screen, and not an overlay; the board is
   * real and interactive from the first frame.
   *
   * Plays on every load, including a client-side navigation back to `/` —
   * there's deliberately no session flag gating it. Richard's call: the shot
   * is cheap to sit through (~2.0s hold + flight, and any input cancels it
   * instantly — see `onInput`), so replaying it is "cool", not a bug to be
   * fixed by remembering the visitor already saw it once. Don't reintroduce a
   * `sessionStorage`/localStorage claim here without that call changing.
   *
   * Every early return below still has to reveal the board — see `opacity`.
   * A visitor who skips the shot outright (reduced motion, or the board
   * hidden below `lg`) must not be left looking at a permanently transparent
   * board; only the camera choreography is conditional here, not the board's
   * visibility.
   */
  useLayoutEffect(() => {
    // Instant under `reduced`, matching every other transition in this file
    // (`zoomTo`, `goTo`, the focus pan, `goToStop`'s scroll) — this is the
    // only one that would otherwise still animate.
    const reveal = () =>
      animate(opacity, 1, {
        duration: reduced ? 0 : REVEAL_DURATION,
        ease: [0.2, 0.8, 0.2, 1] as const,
      });

    if (reduced) {
      reveal();
      return;
    }
    // Same test `goToStop` uses for the stacked layout — `offsetParent` is
    // null while the board is `hidden` below `lg`. A camera move on a
    // subtree nobody can see is wasted work, and revealing it anyway (rather
    // than leaving `opacity`/`introRunning` at their defaults) is what keeps
    // the board visible and its video playback working if the visitor later
    // resizes past `lg`.
    if (root.current?.offsetParent === null) {
      reveal();
      return;
    }

    const overview = overviewFraming(window.innerWidth, window.innerHeight);
    x.set(overview.x);
    y.set(overview.y);
    k.set(overview.k);
    // `zoom` state mirrors `k` through the PASSIVE effect below —
    // `useEffect(() => k.on("change", setZoom), [k])` — which hasn't
    // subscribed yet: layout effects on mount all run before any passive
    // effect does, so `k.set` above fires with nobody listening. Setting
    // `zoom` here by hand is what keeps the rail's readout, `DotPattern`'s
    // tile size, and the drag constraints from reporting scale 1 while the
    // board is actually sitting at the overview — don't drop this as
    // "redundant" with the subscription; the subscription is exactly what's
    // too late to cover this one frame.
    setZoom(overview.k);
    zoomAim.current = overview.k;
    setIntroRunning(true);
    // Same pass as the framing above, not a separate effect — see `opacity`.
    // Captured, not fire-and-forget: the cleanup below stops it alongside
    // `xCtrl`/`yCtrl`/`kCtrl`/`blurCtrl` so Strict Mode's pass 1 doesn't leave
    // a tween writing to `opacity` while pass 2 starts a second one on the
    // same value underneath it.
    const opacityCtrl = reveal();

    let xCtrl: ReturnType<typeof animate> | null = null;
    let yCtrl: ReturnType<typeof animate> | null = null;
    let kCtrl: ReturnType<typeof animate> | null = null;
    let blurCtrl: ReturnType<typeof animate> | null = null;
    let finishTimer: ReturnType<typeof setTimeout> | null = null;
    /**
     * Guards `onInput` and the finish callback below against running twice.
     * Not against running each OTHER: `onInput` clears `finishTimer` and the
     * finish callback calls `detach()`, so each already rules the other out
     * mechanically. This is cheap insurance so a future edit that loosens
     * either of those doesn't quietly reopen a double-run.
     */
    let done = false;

    const detach = () => {
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("pointerdown", onInput);
      window.removeEventListener("keydown", onInput);
    };

    const holdTimer = setTimeout(() => {
      const opts = {
        duration: INTRO_FLIGHT,
        ease: [0.2, 0.8, 0.2, 1] as const,
      };
      xCtrl = animate(x, 0, opts);
      yCtrl = animate(y, 0, opts);
      kCtrl = animate(k, 1, opts);
      blurCtrl = animate(blur, [0, 6, 0], {
        duration: INTRO_FLIGHT,
        times: [0, 0.35, 0.8],
        ease: "linear",
      });
      finishTimer = setTimeout(() => {
        if (done) return;
        done = true;
        zoomAim.current = 1;
        setIntroRunning(false);
        detach();
      }, INTRO_FLIGHT * 1000);
    }, INTRO_HOLD);

    /**
     * Any input takes over. Cancels in place rather than snapping to home:
     * someone reaching for the wheel wants to look around, and yanking the
     * camera to a destination they didn't ask for would fight the gesture
     * they just made. Stopping where the camera is hands them a working
     * board wherever the flight got to.
     */
    const onInput = () => {
      if (done) return;
      done = true;
      clearTimeout(holdTimer);
      if (finishTimer) clearTimeout(finishTimer);
      xCtrl?.stop();
      yCtrl?.stop();
      kCtrl?.stop();
      blurCtrl?.stop();
      blur.set(0);
      zoomAim.current = k.get();
      setIntroRunning(false);
      detach();
    };
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("pointerdown", onInput, { passive: true });
    window.addEventListener("keydown", onInput);

    // Unconditional, and safe whether or not `onInput`/the finish callback
    // above already ran: every line here is idempotent (clearing an
    // already-fired timer, stopping an already-stopped animation, removing an
    // already-removed listener are all no-ops). There's no state left to
    // restore on top of that — no session claim to release now, and every
    // motion value and `useState` this effect touches belongs to THIS
    // component instance and is discarded with it on a real unmount; a later
    // remount starts fresh regardless of what this cleanup does or doesn't
    // reset. In dev, Strict Mode's mount→cleanup→mount runs this cleanup
    // synchronously, before the 900ms hold can possibly have elapsed, so
    // `holdTimer` is always still pending here and gets cancelled before the
    // flight ever starts — pass 2 then re-runs the whole effect and
    // recomputes the overview itself, which is what makes restoring "home"
    // unnecessary rather than merely harmless.
    return () => {
      clearTimeout(holdTimer);
      if (finishTimer) clearTimeout(finishTimer);
      xCtrl?.stop();
      yCtrl?.stop();
      kCtrl?.stop();
      blurCtrl?.stop();
      opacityCtrl.stop();
      detach();
    };
    // Mount-only: this is a one-time opening move, not something that should
    // restart if `reduced` were to flip mid-session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Measure the claim once per size change rather than per pointer event.
   *
   * `offsetWidth`/`offsetHeight` and not `getBoundingClientRect`: the frame is
   * inside the transformed board, so the rect would come back scaled and
   * translated by whatever the pan is doing at that instant. The offset pair is
   * the untransformed layout box, which is the space the hit test works in.
   */
  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    const measure = () => {
      heroBox.current = { w: el.offsetWidth, h: el.offsetHeight };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lang]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setPannable(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /**
   * Dots move by shifting the pattern origin, not the element — see the same note
   * in hero-canvas.tsx. Modulo the tile, so nothing ever grows.
   *
   * The tile is the ZOOMED one, because the grid is the surface the board sits on
   * and a surface that didn't scale would read as the frames floating over a
   * fixed-size texture rather than the whole canvas moving toward you. Spacing and
   * ink both come off `zoom` in the render below; only the origin is set here,
   * because it changes on every frame of a pan and a prop would mean a render.
   *
   * `querySelectorAll`, not `querySelector`. The trail lays a second copy of this
   * grid over the first and its whole premise is that the lit dots land on the dim
   * ones — but only the first pattern in the field was ever being offset, so any pan
   * that wasn't a whole multiple of the tile slid the two grids apart. Zoom makes
   * that visible at a glance; the fix is the plural.
   */
  useEffect(() => {
    const shift = () => {
      const tile = TILE * k.get();
      const px = ((x.get() % tile) + tile) % tile;
      const py = ((y.get() % tile) + tile) % tile;
      field.current?.querySelectorAll("pattern").forEach((pattern) => {
        pattern.setAttribute("x", String(px));
        pattern.setAttribute("y", String(py));
      });
    };
    shift();
    const stops = [
      x.on("change", shift),
      y.on("change", shift),
      k.on("change", shift),
    ];
    return () => stops.forEach((stop) => stop());
  }, [x, y, k]);

  const drag = pannable && !reduced;

  /**
   * Zoom to `next`, holding the board point under (px, py) still.
   *
   * The anchor is the whole of it. A board point `p` sits at `centre + t + k · p`,
   * so keeping it under the same screen point across a scale change means solving
   * that equation twice and taking the difference:
   *
   *     u  = anchor, measured from the viewport centre
   *     t' = u − (k'/k) · (u − t)
   *
   * With `u = 0` — the viewport centre, which is what the rail's buttons use — it
   * collapses to `t' = (k'/k) · t`, so the same line serves both callers.
   *
   * Animating is exact rather than approximate, which is why the buttons can use it:
   * `t` is linear in `k'/k`, so easing all three values over the same duration keeps
   * the anchor pinned on every intermediate frame, not just at the ends.
   */
  const zoomTo = useCallback(
    (next: number, px: number, py: number, animated = false) => {
      const from = k.get();
      const to = Math.min(Math.max(next, ZOOM.min), ZOOM.max);
      if (to === from) return;
      zoomAim.current = to;
      const ratio = to / from;
      const ux = px - window.innerWidth / 2;
      const uy = py - window.innerHeight / 2;
      const nx = clampTo(ux - ratio * (ux - x.get()), panLimit("x", to));
      const ny = clampTo(uy - ratio * (uy - y.get()), panLimit("y", to));

      // The wheel is already continuous — easing each event would fight the next one
      // and lag the pointer. Only the discrete jumps get a transition.
      if (!animated || reduced) {
        k.set(to);
        x.set(nx);
        y.set(ny);
        return;
      }
      const opts = { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] as const };
      animate(k, to, opts);
      animate(x, nx, opts);
      animate(y, ny, opts);
    },
    [k, x, y, reduced]
  );

  /**
   * The menu's + / −, which zoom about the middle of the viewport.
   *
   * Stepped from where the zoom is HEADED, not from where it currently is. The step
   * animates over 0.28s, so two presses inside that window both read the same live
   * scale and compute the same destination — press + twice quickly and you get one
   * step, not two. Compounding off the last target makes a rapid press-press-press
   * land where the presses said, which is the only reading of that gesture.
   */
  const zoomBy = useCallback(
    (factor: number) =>
      zoomTo(
        zoomAim.current * factor,
        window.innerWidth / 2,
        window.innerHeight / 2,
        true
      ),
    [zoomTo]
  );

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
   * The guards are what the narrower scope used to give for free.
   *
   * `offsetParent` is null while the board is `hidden` below `lg`, where the stacked
   * layout is showing and scrolling is exactly what a wheel should do.
   *
   * `cvOpen` covers the CV, and it covers the whole viewport rather than the panel:
   * while a modal is up, nothing behind it should move, including the backdrop.
   *
   * The scrollable-ancestor walk is the general form of "an overlay owns its own
   * scrolling". This used to test `closest('[role="dialog"], [role="menu"]')`, which
   * matched nothing — the CV is a hand-rolled motion panel with no role, so the board
   * panned behind an open overlay while its content sat still. Asking whether the
   * pointer is over something that scrolls is the question that was actually being
   * asked, and no overlay has to be tagged for it: a menu, a code block, or anything
   * added later all answer for themselves.
   */
  useEffect(() => {
    const el = root.current;
    if (!el || !drag) return;

    /**
     * Overflow alone, not "has room left to scroll in this direction" — otherwise
     * hitting the end of the panel hands the wheel back to the board and the page
     * lurches out from under whatever you were reading. That's the chaining
     * `overscroll-contain` exists to stop.
     */
    const overScroller = (target: EventTarget | null) => {
      let node = target instanceof HTMLElement ? target : null;
      while (node && node !== document.body) {
        const s = getComputedStyle(node);
        if (
          (/auto|scroll/.test(s.overflowY) &&
            node.scrollHeight > node.clientHeight) ||
          (/auto|scroll/.test(s.overflowX) &&
            node.scrollWidth > node.clientWidth)
        )
          return true;
        node = node.parentElement;
      }
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!el.offsetParent || cvOpen) return;
      if (overScroller(e.target)) return;
      e.preventDefault();
      /**
       * ⌘-wheel zooms; a bare wheel pans. Figma's split exactly, and the modifier is
       * what keeps it from being a choice between the two — plain scroll still moves
       * the board, so nothing was taken away to add this.
       *
       * `ctrlKey` alongside `metaKey` is not a Windows courtesy, or not only that: a
       * TRACKPAD PINCH arrives as a wheel event with `ctrlKey` forced true, which is
       * how every browser reports one. Reading it here is what makes pinch-to-zoom
       * work on the hardware most likely to be looking at this board, and it comes
       * for free with the modifier the platform already wanted.
       *
       * Anchored on the POINTER, not the viewport centre. Zooming toward the cursor
       * is the difference between a canvas you steer and one you zoom-then-hunt: the
       * frame you were looking at is the frame that stays put.
       */
      if (e.metaKey || e.ctrlKey) {
        zoomTo(k.get() * Math.exp(-e.deltaY * ZOOM_RATE), e.clientX, e.clientY);
        return;
      }
      const dx = e.shiftKey ? e.deltaY : e.deltaX;
      const dy = e.shiftKey ? 0 : e.deltaY;
      x.set(clampTo(x.get() - dx, panLimit("x", k.get())));
      y.set(clampTo(y.get() - dy, panLimit("y", k.get())));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [drag, x, y, k, cvOpen, zoomTo]);

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
   * Keyboard navigation — arrows pan, +/- zoom. Figma's canvas shortcuts.
   *
   * The gap this closes is a MOUSE one. A trackpad's two-finger gesture arrives as a
   * wheel event carrying both deltas, so it already pans freely in two axes; a wheel
   * reports deltaY alone, which left side-to-side travel behind Shift+wheel or a drag
   * from the gaps between frames. Neither is discoverable. Arrows are the direct
   * control and the one a visitor tries first.
   *
   * Instant `set` rather than `animate`, for the same reason the wheel isn't eased: a
   * held arrow repeats around thirty times a second, so easing each press would fight
   * the next one and the board would swim behind the key. A tap is a nudge, a hold is
   * a glide. The zoom keys DO animate — those are discrete, one press is one step,
   * and that's the path `zoomTo`'s `animated` flag already serves.
   *
   * `pannable` is the gate, not `drag`. `drag` is off under reduced motion, but a
   * keyboard pan has no motion to reduce — it's the same instant `set` either way,
   * and taking navigation away from that visitor is the opposite of what the setting
   * asks for. The animated paths stay honest because `zoomTo` reads `reduced` itself.
   *
   * The digit shortcuts go through `e.code`, the rest through `e.key`, and the split
   * is not arbitrary. `e.key` for Shift+1 is "!" on a US layout and something else
   * again on the Spanish one half this site is written in, so a digit has to be read
   * as the physical key. "+" is the mirror image: Shift+= here, its own key on a
   * numpad, AltGr elsewhere — the character is the stable thing about it.
   *
   * Cmd+ / Cmd- are deliberately NOT taken, which is the one place this stops
   * matching Figma. Figma is an app you commit to; this is a page, and someone who
   * presses Cmd+ because they need things bigger should get the browser's zoom. Board
   * zoom would leave the rail and the toolbar exactly as they were — they're fixed to
   * the viewport, not on the board — so hijacking it would fail the request while
   * looking like it worked.
   *
   * Guards mirror the wheel handler: `offsetParent` for the stacked layout below `lg`,
   * `cvOpen` for the modal. The focus test is the one the wheel doesn't need, because
   * a key can be meant for whatever holds focus — a field owns its caret and a Base UI
   * menu walks its items with the arrows. Anything focused that reads these keys keeps
   * them.
   */
  useEffect(() => {
    if (!pannable) return;

    const onKey = (e: KeyboardEvent) => {
      const el = root.current;
      if (!el?.offsetParent || cvOpen) return;
      // Modified presses belong to the browser and the OS. See the Cmd+ note above.
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const focused = document.activeElement;
      if (
        focused instanceof HTMLElement &&
        (focused.isContentEditable ||
          focused.closest(
            'input, textarea, select, [role="menu"], [role="listbox"], [role="combobox"]'
          ))
      )
        return;

      // Zoom is anchored on the middle of the viewport rather than the pointer: a key
      // press has no position, and the wheel's "keep the frame under the cursor" trick
      // has nothing to hold on to.
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomBy(ZOOM_STEP);
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomBy(1 / ZOOM_STEP);
        return;
      }
      if (e.shiftKey && e.code === "Digit0") {
        e.preventDefault();
        zoomTo(1, window.innerWidth / 2, window.innerHeight / 2, true);
        return;
      }
      // Shift+1 is zoom-to-fit, and the shot it flies to is the one the intro opens
      // on — `overviewFraming` is already the file's answer to "frame everything", so
      // this is the same camera move on demand rather than a second definition of it.
      if (e.shiftKey && e.code === "Digit1") {
        e.preventDefault();
        const fit = overviewFraming(window.innerWidth, window.innerHeight);
        const opts = reduced
          ? { duration: 0 }
          : { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const };
        zoomAim.current = fit.k;
        animate(k, fit.k, opts);
        animate(x, fit.x, opts);
        animate(y, fit.y, opts);
        return;
      }

      /**
       * Screen-space deltas added straight to the offset — the wheel's convention, and
       * the reason neither handler contains any zoom arithmetic. A press moves the VIEW
       * a fixed visual distance, so at 25% it crosses four times the board it does at
       * 100%. That's the right reading of "nudge it left a bit" at that scale.
       */
      const step = PAN_STEP * (e.shiftKey ? PAN_BIG : 1);
      let dx = 0;
      let dy = 0;
      switch (e.key) {
        case "ArrowLeft":
          dx = step;
          break;
        case "ArrowRight":
          dx = -step;
          break;
        case "ArrowUp":
          dy = step;
          break;
        case "ArrowDown":
          dy = -step;
          break;
        case "PageUp":
          dy = window.innerHeight * PAN_PAGE;
          break;
        case "PageDown":
          dy = -window.innerHeight * PAN_PAGE;
          break;
        default:
          return;
      }
      e.preventDefault();
      x.set(clampTo(x.get() + dx, panLimit("x", k.get())));
      y.set(clampTo(y.get() + dy, panLimit("y", k.get())));
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pannable, cvOpen, reduced, x, y, k, zoomTo, zoomBy]);

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
      // The viewport centre in BOARD coordinates. Inverting the transform means
      // undoing the scale as well as the offset — without the divide, zooming out
      // makes every stop look further away than it is and the rail starts naming
      // whichever section happens to sit nearest the origin.
      const cx = -x.get() / k.get();
      const cy = -y.get() / k.get();
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
      const z = k.get();
      const live = SECTIONS.filter((s) => {
        // On screen is a question about pixels, so the box is measured in them: the
        // section's board size scaled, at its board position scaled. Half of a
        // section zoomed to 25% is a quarter of the area it was at 100%, and a clip
        // that starts when a thumbnail is 80px wide is a clip nobody can see.
        const box = sectionSize(s);
        const w = box.w * z;
        const h = box.h * z;
        const left = vw / 2 + x.get() + (s.x - box.w / 2) * z;
        const top = vh / 2 + y.get() + (s.y - box.h / 2) * z;
        const ox = Math.max(0, Math.min(left + w, vw) - Math.max(left, 0));
        const oy = Math.max(0, Math.min(top + h, vh) - Math.max(top, 0));
        return (ox * oy) / (w * h) >= 0.5;
      }).map((s) => s.id);
      // Joined, so React's own bail-out does the work: a pan that doesn't change
      // which sections are on screen costs a string compare, not a render.
      setOnscreen(live.join(","));
    };
    sync();
    const off = [
      x.on("change", sync),
      y.on("change", sync),
      k.on("change", sync),
    ];
    return () => off.forEach((f) => f());
  }, [x, y, k]);

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

    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest("[data-board]")) return;
      if (!t.matches(":focus-visible")) return;
      // No zoom arithmetic here, and that's the point of keeping the offset in
      // screen pixels: `getBoundingClientRect` already reports the scaled box, so
      // the correction it implies is a screen-space delta and `x`/`y` take it neat.
      const r = t.getBoundingClientRect();
      const dx = window.innerWidth / 2 - (r.left + r.width / 2);
      const dy = window.innerHeight / 2 - (r.top + r.height / 2);
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      const opts = reduced ? { duration: 0 } : { duration: 0.45 };
      animate(x, clampTo(x.get() + dx, panLimit("x", k.get())), opts);
      animate(y, clampTo(y.get() + dy, panLimit("y", k.get())), opts);
    };

    el.addEventListener("focusin", onFocus);
    return () => el.removeEventListener("focusin", onFocus);
  }, [x, y, k, reduced]);

  /**
   * Move the board so a section lands in the middle of the viewport, at 100%.
   *
   * Arriving is a composed move: the zoom goes home as the board travels, so a jump
   * from anywhere lands on the section at the size it was drawn. The alternative —
   * keeping whatever zoom you were on — meant a rail click could deposit you on a
   * section at 40%, where its frames are unreadable, and leave the correction as
   * homework. Choosing a destination is a request to LOOK at it, and 100% is what
   * looking at it means.
   *
   * It also makes the arithmetic disappear. The offset is in screen pixels and the
   * target is a board coordinate, so centring generally costs a `-tx * k`; with the
   * destination zoom fixed at 1, `k` is 1 and the offset is just `-tx`.
   *
   * `zoomAim` moves with it, so a `+` pressed straight after landing steps from
   * 100% rather than from wherever the visitor had been before the jump.
   */
  function goTo(id: string, tx: number, ty: number) {
    setActive(id);
    const opts = reduced
      ? { duration: 0 }
      : { duration: 0.75, ease: [0.2, 0.8, 0.2, 1] as const };
    zoomAim.current = 1;
    animate(k, 1, opts);
    animate(x, clampTo(-tx, panLimit("x", 1)), opts);
    animate(y, clampTo(-ty, panLimit("y", 1)), opts);
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
          const hit = sectionAt(
            e.clientX,
            e.clientY,
            x.get(),
            y.get(),
            k.get(),
            heroBox.current
          );
          setHovered(hit?.id ?? null);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        {/* The tutorial waits out the opening camera move — telling someone to
            drag while the board is flying somewhere on its own is instructing
            them to fight it — and it never runs where the gestures aren't
            available: `drag` is false below `lg` and under reduced motion, and
            teaching a gesture the board won't honour is worse than teaching
            nothing. The sequence, the device detection and the retirement all
            live in the cursor; this is only the gate. */}
        <CanvasCursor
          closeMode={cvOpen}
          teach={drag && !introRunning && !cvOpen}
        />

        {/* Without JS, `opacity` never leaves its default 0 — there's no hydration
          to animate it. The board is already inert with no JS (it can't pan or
          zoom), but it should still render as a static picture of the
          composition rather than nothing. `<noscript>` content is inert markup
          while scripting is enabled and live markup when it isn't, which is
          exactly the "only without JS" switch this needs. */}
        <noscript>
          <style>{`[data-board] { opacity: 1 !important; }`}</style>
        </noscript>

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
          // Constraints are the one place the zoom has to arrive as a PROP rather
          // than a motion value — Motion resolves them when a drag begins, not per
          // frame. `zoom` state is what makes them current by then, and a gesture
          // can't start mid-pinch, so a value that's a render behind is still the
          // value the drag needs.
          dragConstraints={{
            left: -panLimit("x", zoom),
            right: panLimit("x", zoom),
            top: -panLimit("y", zoom),
            bottom: panLimit("y", zoom),
          }}
          dragMomentum={false}
          dragElastic={0.05}
          style={{ x, y }}
          onPointerDown={(e) => {
            press.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerMove={(e) => {
            const hit = sectionAt(
              e.clientX,
              e.clientY,
              x.get(),
              y.get(),
              k.get(),
              heroBox.current
            );
            setHovered(hit?.id ?? null);
          }}
          onPointerLeave={() => setHovered(null)}
          onClick={(e) => {
            const start = press.current;
            press.current = null;
            if (!start) return;
            if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6)
              return;
            const hit = sectionAt(
              e.clientX,
              e.clientY,
              x.get(),
              y.get(),
              k.get(),
              heroBox.current
            );
            if (hit) goTo(hit.id, hit.x, hit.y);
          }}
          className={cn("absolute inset-0", hovered && "cursor-pointer")}
        />

        <motion.div
          ref={field}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          // The dot field carries the intro's motion blur alongside the board
          // layer below — see `blurFilter`. Bound permanently rather than
          // gated on `introRunning`, because it resolves to `"none"` at rest.
          style={{ filter: blurFilter }}
        >
          {/* Back to the quieter original weight. `--muted-foreground/35` was tuned to
            be findable on a small hero card; across a full viewport the same value
            reads as a busy texture competing with the type. `/16` gives the surface
            grain without asking to be looked at. */}
          {/* Tile and ink both scale, so the field is the same grid seen from
              closer or further away rather than a texture the board slides over.
              Scaling only the spacing would hold the dots at 1px while the gaps
              shrank, and at 25% that's a haze instead of a grid. The origin is set
              imperatively — see the shift effect. */}
          <DotPattern
            width={TILE * zoom}
            height={TILE * zoom}
            cr={zoom}
            className="fill-muted-foreground/16"
          />
          <DotTrail tile={TILE} scale={zoom} />
        </motion.div>

        {/* The board. One layer, everything on it, all sharing the pan and the zoom.
          The scale rides here, on the same element as the offset, which is what makes
          `translate(x, y) scale(k)` from a centred origin the one transform every
          calculation in this file inverts. `filter` carries the same permanently-bound
          blur as the dot field above — see `blurFilter`. Opacity fades in via
          `opacity` — see that value's own note for why the board starts invisible
          at all and why it's animated rather than a CSS class toggle. The dot
          field behind it is NOT gated the same way: hiding everything would read
          as a blank page, where this fade reads as the composition arriving on a
          surface that was already there. */}
        <motion.div
          style={{ x, y, scale: k, filter: blurFilter, opacity }}
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
              // The overview scale clears every section's on-screen threshold
              // at once, so unconditional `onscreen` would start three clips
              // during the most expensive frames of the flight. Suppressed
              // here rather than in the watcher, so the watcher stays the one
              // honest read of what's actually on screen.
              onscreen={
                !introRunning && onscreen.split(",").includes(section.id)
              }
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
            {/* `pointer-events-none`, matching a section's surface, so a click on
                the claim falls through to the drag layer underneath and the hit
                test snaps it home. It's the same trade a section makes: the
                surface gives up its own events so the board can be dragged from
                inside it, and the things you actually operate — here the CTA pair
                — opt back in individually. The cost is that the headline is no
                longer selectable, which is already true of every section label on
                the board. */}
            <div
              ref={hero}
              className="pointer-events-none relative w-[min(90vw,960px)] px-14 py-12 text-center"
            >
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
              {/* -7, not -5. The row used to be bare 11px type; the Dev Mode chip
                  is 19px tall, so the old offset left it sitting on the border and
                  fouling the top-right handle. Both aprons now clear the frame by
                  the same 9px. */}
              <div className="absolute -top-7 right-0 left-0 flex items-center justify-between gap-4 font-mono text-[11px] leading-none">
                <span className="text-canvas-component flex items-center gap-1.5 whitespace-nowrap">
                  <ComponentGlyph />
                  {pick(COMPONENT_NAME, lang)}
                </span>
                {/* Dev Mode, as its own filled chip. It's the green half of the
                    same idea the violet carries: the frame is a component, and
                    this is the toggle that says there's code behind it. As bare
                    muted type it read as a stray glyph in the corner; the fill is
                    what makes it the button Figma actually puts there. */}
                <span
                  aria-hidden
                  className="bg-canvas-devmode text-canvas-devmode-foreground rounded-[3px] px-1.5 py-1 leading-none"
                >
                  &lt;/&gt;
                </span>
              </div>
              {/* The apron — Figma's dimension badge, carrying the place line. A
                  filled violet pill rather than bare type, because that's what
                  distinguishes the slot: the name floats, the measurement sits in a
                  chip. Centred under the frame, same as the readout it's standing
                  in for. */}
              <span className="bg-canvas-component-fill text-canvas-component-foreground absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-[3px] px-2 py-1 font-mono text-[10px] leading-none whitespace-nowrap">
                {pick(PLACE, lang)}
              </span>
              <div className="flex flex-col items-center gap-6">
                <Claim
                  className="text-3xl sm:text-4xl lg:text-5xl"
                  hovered={hovered === "home"}
                />
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
              left: -panLimit("x", zoom),
              right: panLimit("x", zoom),
              top: -panLimit("y", zoom),
              bottom: panLimit("y", zoom),
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
        // Passed only when the board is actually pannable, which is the same gate
        // the wheel and the hand tool sit behind: no zoom controls on a device that
        // gets the stacked layout, and none under `prefers-reduced-motion`, where
        // the board doesn't move at all and a scale control would be offering a
        // journey the page has already declined to take.
        zoom={
          drag
            ? {
                value: zoom,
                onIn: () => zoomBy(ZOOM_STEP),
                onOut: () => zoomBy(1 / ZOOM_STEP),
                onSet: (v) =>
                  zoomTo(
                    v,
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    true
                  ),
              }
            : undefined
        }
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
  // Clamped to what's actually here, matching the width `sectionSize` computes from
  // the same figure. Laying out the full column allowance inside a box sized to
  // three items would push the grid past its own surface.
  const cols = Math.max(1, Math.min(section.cols ?? 1, items.length));
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
      className="border-border bg-card ease-out-soft pointer-events-auto relative flex size-full flex-col justify-between overflow-hidden rounded-2xl border p-6 text-left transition-shadow duration-[var(--duration-base)] hover:shadow-lg"
    >
      {/* The card was an empty rectangle with two lines of type in it. The photo
          fills the middle, where nothing was, and the gradient is opaque at both
          ends because that is where the type sits — the title at the top, "read
          more" at the bottom. It reads as a surface with something behind it,
          not as a picture with a caption. */}
      <img
        src="/cv-photo.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <span
        aria-hidden
        className="from-card via-card/55 to-card pointer-events-none absolute inset-0 bg-gradient-to-b"
      />
      {/* No mono eyebrow above the title. On a work card that slot carries the
          kind ("Process", "Methodology") — a different word from the title, which
          is what makes it worth the line. Here both strings were `nav.cv`, so the
          frame opened by saying CV twice and the second one looked like a bug. */}
      <span className="relative flex flex-col gap-2">
        <span className="text-foreground text-xl font-bold">
          {t("nav.cv", lang)}
        </span>
        <span className="text-prose-body text-xs leading-relaxed">
          {pick(CV_COPY, lang)}
        </span>
      </span>
      <span className="text-muted-foreground relative font-mono text-[11px]">
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
            <div className="flex flex-col gap-8">
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
