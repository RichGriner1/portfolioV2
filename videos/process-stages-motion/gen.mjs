// Generator for videos/process-stages-motion/index.html
// Deterministic: no randomness, all geometry computed from constants below.
// Usage: node gen.mjs index.html && cp index.html compositions/index.html
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = process.argv[2];
const LANG = process.argv[3] || "en";
const THEME = process.argv[4] || "light";
if (!OUT) {
  console.error("usage: node gen.mjs <out.html> [en|es] [light|dark]");
  process.exit(1);
}

/* ------------------------------------------------------------------ theme */
// Same six-role palette, two luminance ramps. Only luminance changes.
const THEMES = {
  light: { ground: "#ffffff", panel: "#f7f7f7", quiet: "#e5e5e5", mid: "#8e8e8e", primary: "#343434", ink: "#242424" },
  dark: { ground: "#212121", panel: "#2a2a2a", quiet: "#3d3d3d", mid: "#8e8e8e", primary: "#d6d6d6", ink: "#ededed" },
};
const C = THEMES[THEME];

/* ------------------------------------------------------------------- i18n */
const L10N = {
  en: {
    titles: ["Brand Strategy", "Mood Boards", "Design Principles", "Design Tokens", "Components in Code", "Layout &amp; Charts"],
    pairs: [["Brand", "Strategy"], ["Mood", "Boards"], ["Design", "Principles"], ["Design", "Tokens"], ["Components", "in Code"], ["Layout", "& Charts"]],
    query: "buttons",
  },
  es: {
    titles: ["Estrategia de marca", "Moodboards", "Principios de diseño", "Tokens de diseño", "Componentes en código", "Layout y gráficas"],
    pairs: [["Marca", "Estrategia"], ["Mood", "Boards"], ["Principios", "de diseño"], ["Tokens", "de diseño"], ["Componentes", "en código"], ["Layout", "y gráficas"]],
    query: "botones",
  },
};
const T = L10N[LANG];

/* ---------------------------------------------------------------- geometry */
const W = 1080,
  H = 1080;
const SLOT = 260; // rail pitch
const CARD_W = 300,
  CARD_H = 220; // unfocused card
const FOC = 560; // focused card (square)
const RAIL_W = 360;
const RAIL_LEFT = (W - RAIL_W) / 2; // 360
const CENTER_Y = H / 2; // 540

const SLOT_MIN = -4,
  SLOT_MAX = 8; // small cards
const FOCUS_MIN = -1,
  FOCUS_MAX = 5; // focused overlays (-1 = wrap duplicate of stage 06)

const smallTop = (i) => CENTER_Y + i * SLOT - CARD_H / 2; // 430 + 260i
const focusTop = (i) => CENTER_Y + i * SLOT - FOC / 2; // 260 + 260i

/* ------------------------------------------------------------------ stages */
const MINIS = ["brief", "search", "rules", "cascade", "codepair", "reflow"];
const BARS = [96, 74, 108, 88, 118, 84];
const STAGES = MINIS.map((m, i) => ({
  n: "0" + (i + 1),
  l: T.pairs[i][0],
  r: T.pairs[i][1],
  title: T.titles[i],
  mini: m,
  bar: BARS[i],
}));
const stageOf = (i) => STAGES[((i % 6) + 6) % 6];

/* ------------------------------------------------------------- mini markup */
// Every mini is authored at its FINAL (rest) pose in CSS. GSAP fromTo()
// supplies the start pose, so the untweened wrap-duplicate (#fc-p) renders
// the rest state for free.

// 01 — one-line brief unfolds into four fields + a five-persona strip
const BRIEF_FIELDS = [
  { left: 8, top: 52 },
  { left: 224, top: 52 },
  { left: 8, top: 130 },
  { left: 224, top: 130 },
];

// 02 — Mobbin search: "buttons" types, result tiles cascade, two get saved
const QUERY = T.query.split("");
const SR_TILES = [
  { left: 8, top: 78, r: 15, fill: 1 },
  { left: 152, top: 78, r: 6, fill: 1 },
  { left: 296, top: 78, r: 1, fill: 1 },
  { left: 8, top: 168, r: 15, fill: 0 },
  { left: 152, top: 168, r: 6, fill: 0 },
  { left: 296, top: 168, r: 1, fill: 0 },
];
const SR_ORDER = [1, 4, 0, 3, 5, 2]; // cascade order (deterministic scatter)
const SR_SAVED = [1, 4]; // both rounded-6 — the two boards converged on one shape

// 03 — three rules + a demo card; the pin cites a rule, the demo applies it
const RULE_W = [214, 178, 196];
const CITED = 1; // rule index the pin lands on (row 2)
const RULE_TOP = (i) => 34 + 52 * i;
const DEMO_BARS = [
  { left: 22, h: 52 },
  { left: 52, h: 84 },
  { left: 82, h: 64 },
  { left: 112, h: 100 },
];
const DEMO_HI = 3; // the one series that stays ink after the rule applies

// 04 — token cascade: primitive -> semantic -> component, value ripples down
const CAS_PILLS = [
  { top: 20 },
  { top: 106 },
  { top: 192 },
];

// 05 — a base component and its variant set, Figma-style tree
const VARIANTS = [
  { left: 16, kind: "filled" },
  { left: 152, kind: "outline" },
  { left: 288, kind: "muted" },
];

// 06 — adaptive reflow: uniform 2x2 re-packs into the bento, chart draws
// Final (CSS) pose = the bento; the tween starts from the uniform grid.
const BN_CELLS = [
  { left: 0, top: 0, w: 264, h: 288 },
  { left: 276, top: 0, w: 156, h: 136 },
  { left: 276, top: 148, w: 74, h: 140 },
  { left: 358, top: 148, w: 74, h: 140 },
];
const BN_FROM = [
  { left: 0, top: 0, w: 208, h: 140 },
  { left: 224, top: 0, w: 208, h: 140 },
  { left: 0, top: 148, w: 208, h: 140 },
  { left: 224, top: 148, w: 208, h: 140 },
];
const BN_BARS = [
  { left: 30, h: 96 },
  { left: 98, h: 152 },
  { left: 166, h: 118 },
  { left: 234, h: 204 },
];

function mini(kind) {
  switch (kind) {
    case "brief":
      return `<div class="mini"><i class="br-line"></i>${BRIEF_FIELDS.map(
        (f, i) =>
          `<i class="br-field bf${i}" style="left:${f.left}px;top:${f.top}px"><i class="br-lab"></i><i class="br-val"></i></i>`,
      ).join("")}<i class="br-personas">${[0, 1, 2, 3, 4]
        .map((i) => `<i class="br-p p${i}" style="left:${30 + i * 76}px"></i>`)
        .join("")}</i></div>`;
    case "search":
      return `<div class="mini"><i class="srch"><i class="srch-ico"></i><span class="srch-q">${QUERY.map(
        (ch, i) => `<span class="q q${i}">${ch}</span>`,
      ).join("")}</span><i class="caret caret-a"></i><i class="caret caret-b"></i></i>${SR_TILES.map(
        (t, i) =>
          `<i class="grid-tile g${i}" style="left:${t.left}px;top:${t.top}px"><i class="btn-spec ${
            t.fill ? "spec-fill" : "spec-line"
          }" style="border-radius:${t.r}px"></i>${
            SR_SAVED.includes(i) ? `<i class="grid-hi"></i>` : ""
          }</i>`,
      ).join("")}</div>`;
    case "rules":
      return `<div class="mini">${RULE_W.map(
        (w, i) =>
          `<i class="rule-row" style="top:${RULE_TOP(i)}px"><i class="rule-tick"></i><i class="rule-line" style="width:${w}px"></i></i>`,
      ).join("")}<i class="cite-hi"></i><i class="cite-pin"><i class="cite-dot"></i></i><i class="demo-card">${DEMO_BARS.map(
        (b, i) =>
          `<i class="demo-bar db${i}" style="left:${b.left}px;height:${b.h}px"></i>`,
      ).join("")}</i></div>`;
    case "cascade":
      return `<div class="mini">${CAS_PILLS.map(
        (p, i) =>
          `<i class="cas-pill cp${i}" style="top:${p.top}px"><i class="cas-dim"><i class="dt dt-l"></i><i class="dt dt-r"></i></i><i class="cas-lab"></i></i>`,
      ).join("")}<i class="cas-link" style="top:74px"></i><i class="cas-link" style="top:160px"></i><i class="cas-wire"></i><i class="cas-btn"><i class="cas-bpill"></i></i></div>`;
    case "codepair":
      return `<div class="mini"><i class="vt-base"><i class="vt-icon"></i><i class="vt-pill"></i></i><i class="vt-stem"></i><i class="vt-spine"></i>${VARIANTS.map(
        (v, i) =>
          `<i class="vt-drop" style="left:${v.left + 63}px"></i>`,
      ).join("")}${VARIANTS.map(
        (v, i) =>
          `<i class="vt-var vv${i} vt-${v.kind}" style="left:${v.left}px"><i class="vt-vpill"></i></i>`,
      ).join("")}</div>`;
    case "reflow":
      return `<div class="mini">${BN_CELLS.map(
        (c, i) =>
          `<i class="bn-cell bn-cell-${i}" style="left:${c.left}px;top:${c.top}px;width:${c.w}px;height:${c.h}px">${
            i === 0
              ? BN_BARS.map((b) => `<i class="bn-bar" style="left:${b.left}px;height:${b.h}px"></i>`).join("")
              : ""
          }</i>`,
      ).join("")}</div>`;
  }
  return "";
}

/* ------------------------------------------------------------ card markup */
function smallCard(i) {
  const s = stageOf(i);
  return `<div class="scard" data-layout-allow-overflow="true" style="top:${smallTop(i)}px"><i class="sc-bar" style="width:${s.bar}px"></i><i class="sc-preview"></i><span class="sc-num" data-layout-allow-occlusion="true" data-layout-allow-overflow="true">${s.n}</span></div>`;
}

function focusCard(i, id) {
  const s = stageOf(i);
  return `<div class="fwrap" id="${id}" data-layout-allow-overflow="true" style="top:${focusTop(i)}px">
        <div class="fcard">
          <span class="fc-title">${s.title}</span>
          <i class="fc-sub"></i>
          <div class="fc-panel">
            ${mini(s.mini)}
            <span class="fc-num">${s.n}</span>
          </div>
        </div>
        <div class="sel"><i class="h h-tl"></i><i class="h h-tr"></i><i class="h h-bl"></i><i class="h h-br"></i></div>
      </div>`;
}

/* ---------------------------------------------------------------- washes */
const WASH = [
  `radial-gradient(150% 130% at 30% 16%, ${C.ground} 0%, ${C.panel} 55%, ${C.quiet} 110%)`,
  `radial-gradient(145% 125% at 80% 24%, ${C.ground} 0%, ${C.panel} 42%, ${C.quiet} 92%, ${C.mid} 190%)`,
  `radial-gradient(140% 120% at 20% 84%, ${C.ground} 0%, ${C.panel} 34%, ${C.quiet} 78%, ${C.mid} 165%)`,
  `radial-gradient(130% 115% at 50% 26%, ${C.ground} 0%, ${C.panel} 26%, ${C.quiet} 62%, ${C.mid} 140%)`,
  `radial-gradient(145% 125% at 82% 80%, ${C.ground} 0%, ${C.panel} 40%, ${C.quiet} 88%, ${C.mid} 185%)`,
  `radial-gradient(155% 135% at 46% 94%, ${C.ground} 0%, ${C.panel} 52%, ${C.quiet} 108%)`,
];

/* --------------------------------------------------------------- assemble */
const slots = [];
for (let i = SLOT_MIN; i <= SLOT_MAX; i++) slots.push(smallCard(i));

const focuses = [];
focuses.push(focusCard(FOCUS_MIN, "fc-p")); // wrap duplicate of stage 06
for (let i = 0; i <= FOCUS_MAX; i++) focuses.push(focusCard(i, `fc-${i}`));

const labels = (side) =>
  STAGES.map(
    (s, i) => `<span class="lab" id="lab-${side}-${i}">${side === "l" ? s.l : s.r}</span>`,
  ).join("\n        ");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>Process Stages</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: ${W}px; height: ${H}px; overflow: hidden; background: ${C.ground};
        font-family: Inter, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      /* --- root: square corners, no inset (mp4 has no alpha) --- */
      #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; border-radius: 0; }

      /* --- ground + ambient washes (the only soft thing in the piece) --- */
      #wash { position: absolute; inset: 0; }
      #ground { position: absolute; inset: 0; background: ${C.ground}; }
      .wash { position: absolute; inset: 0; opacity: 1; }

      /* --- rail --- */
      #rail-layer { position: absolute; inset: 0; }
      #rail { position: absolute; left: ${RAIL_LEFT}px; top: 0; width: ${RAIL_W}px; height: ${H}px; }
      #rail-col {
        position: absolute; left: 0; top: -1600px; width: ${RAIL_W}px; height: 4400px;
        background: ${C.ground}; border-left: 1px solid ${C.quiet}; border-right: 1px solid ${C.quiet};
        z-index: 0;
      }

      /* --- unfocused cards --- */
      .scard {
        position: absolute; left: ${(RAIL_W - CARD_W) / 2}px; width: ${CARD_W}px; height: ${CARD_H}px;
        background: ${C.ground}; border: 1px solid ${C.quiet}; border-radius: 3px; z-index: 1;
      }
      .sc-bar { position: absolute; left: 16px; top: 16px; height: 7px; background: ${C.mid}; border-radius: 2px; }
      .sc-preview {
        position: absolute; left: 16px; top: 34px; width: 268px; height: 124px;
        background: ${C.quiet}; border-radius: 2px;
      }
      .sc-num {
        position: absolute; right: 16px; bottom: 10px; font-size: 36px; font-weight: 700;
        color: ${C.mid}; line-height: 1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
      }

      /* --- focused card --- */
      .fwrap {
        position: absolute; left: ${(RAIL_W - FOC) / 2}px; width: ${FOC}px; height: ${FOC}px;
        z-index: 5; opacity: 1;
      }
      .fcard {
        position: absolute; inset: 0; background: ${C.ground};
        border: 1px solid ${C.quiet}; border-radius: 4px; overflow: hidden;
      }
      .fc-title {
        position: absolute; left: 36px; top: 34px; font-size: 21px; font-weight: 600;
        color: ${C.primary}; letter-spacing: 0.01em; line-height: 1; white-space: nowrap;
      }
      .fc-sub { position: absolute; left: 36px; top: 66px; width: 94px; height: 6px; background: ${C.quiet}; border-radius: 3px; }
      .fc-panel {
        position: absolute; left: 36px; top: 96px; width: 488px; height: 428px;
        background: ${C.panel}; border: 1px solid ${C.quiet}; border-radius: 3px; overflow: hidden;
      }
      .fc-num {
        position: absolute; right: 26px; bottom: 8px; font-size: 112px; font-weight: 700;
        color: ${C.ink}; line-height: 1; letter-spacing: -0.04em; font-variant-numeric: tabular-nums;
      }
      .mini { position: absolute; left: 28px; top: 30px; width: 432px; height: 288px; }
      .mini i { display: block; }

      /* --- Figma-style selection --- */
      .sel { position: absolute; inset: 0; opacity: 1; }
      .sel::before { content: ""; position: absolute; inset: 0; border: 1px solid ${C.primary}; }
      .h { position: absolute; width: 14px; height: 14px; background: ${C.ground}; border: 2px solid ${C.primary}; }
      .h-tl { left: -7px; top: -7px; }
      .h-tr { right: -7px; top: -7px; }
      .h-bl { left: -7px; bottom: -7px; }
      .h-br { right: -7px; bottom: -7px; }

      /* --- flanking labels --- */
      #labels { position: absolute; inset: 0; }
      .lab-col { position: absolute; top: 480px; height: 120px; width: 254px; }
      .lab-left { left: 0; }
      .lab-right { left: 826px; }
      .lab {
        position: absolute; inset: 0; display: flex; align-items: center;
        font-size: 36px; font-weight: 500; color: ${C.ink}; letter-spacing: -0.005em;
        white-space: nowrap; opacity: 1;
      }
      .lab-left .lab { justify-content: flex-end; padding-right: 20px; }
      .lab-right .lab { justify-content: flex-start; padding-left: 20px; }

      /* --- mini 01: one-line brief unfolds into six fields --- */
      .br-line { position: absolute; left: 116px; top: 18px; width: 200px; height: 10px; background: ${C.mid}; border-radius: 3px; }
      .br-field {
        position: absolute; width: 200px; height: 64px;
        background: ${C.ground}; border: 1px solid ${C.quiet}; border-radius: 3px;
      }
      .br-lab { position: absolute; left: 12px; top: 12px; width: 46px; height: 6px; background: ${C.mid}; border-radius: 3px; }
      .br-val { position: absolute; left: 12px; top: 32px; width: 148px; height: 9px; background: ${C.primary}; border-radius: 3px; transform-origin: left center; }
      .br-personas {
        position: absolute; left: 8px; top: 208px; width: 416px; height: 64px;
        background: ${C.ground}; border: 1px solid ${C.quiet}; border-radius: 3px;
      }
      .br-p { position: absolute; top: 17px; width: 30px; height: 30px; background: ${C.mid}; border-radius: 50%; }
      .br-p.p2 { background: ${C.primary}; }

      /* --- mini 02: Mobbin search --- */
      .srch {
        position: absolute; left: 8px; top: 12px; width: 416px; height: 46px;
        background: ${C.ground}; border: 1px solid ${C.quiet}; border-radius: 23px;
      }
      .srch-ico { position: absolute; left: 16px; top: 14px; width: 16px; height: 16px; border: 2px solid ${C.mid}; border-radius: 50%; }
      .srch-q { position: absolute; left: 46px; top: 0; height: 46px; display: flex; align-items: center; font-size: 20px; font-weight: 500; color: ${C.ink}; letter-spacing: 0.01em; }
      .q { display: inline-block; }
      .caret { position: absolute; top: 12px; width: 2px; height: 22px; background: ${C.ink}; }
      .caret-a { left: 46px; opacity: 0; }
      .caret-b { left: 130px; opacity: 1; }
      .grid-tile { position: absolute; width: 128px; height: 80px; background: ${C.ground}; border: 1px solid ${C.quiet}; border-radius: 3px; }
      .btn-spec { position: absolute; left: 22px; top: 25px; width: 84px; height: 30px; }
      .spec-fill { background: ${C.primary}; }
      .spec-line { border: 2px solid ${C.mid}; }
      .grid-hi { position: absolute; inset: 0; border: 2px solid ${C.primary}; border-radius: 3px; opacity: 1; }

      /* --- mini 03: rules + a comment pin citing rule 4 --- */
      .rule-row { position: absolute; left: 16px; width: 240px; height: 12px; opacity: 1; z-index: 1; }
      .rule-tick { position: absolute; left: 0; top: 0; width: 14px; height: 12px; background: ${C.primary}; border-radius: 2px; }
      .rule-line { position: absolute; left: 26px; top: 4px; height: 4px; background: ${C.mid}; border-radius: 2px; transform-origin: left center; }
      .cite-hi {
        position: absolute; left: 8px; top: ${RULE_TOP(CITED) - 10}px; width: 256px; height: 32px;
        background: ${C.ground}; border: 1px solid ${C.primary}; border-radius: 3px; z-index: 0;
      }
      .cite-pin {
        position: absolute; left: 236px; top: ${RULE_TOP(CITED) - 34}px; width: 26px; height: 26px;
        background: ${C.primary}; border-radius: 50% 50% 50% 3px; z-index: 2;
      }
      .cite-dot { position: absolute; left: 9px; top: 9px; width: 8px; height: 8px; background: ${C.ground}; border-radius: 50%; }
      .demo-card {
        position: absolute; left: 276px; top: 26px; width: 148px; height: 152px;
        background: ${C.ground}; border: 1px solid ${C.quiet}; border-radius: 3px;
      }
      .demo-bar { position: absolute; bottom: 18px; width: 16px; border-radius: 2px; background: ${C.quiet}; transform-origin: bottom center; }
      .demo-bar.db${DEMO_HI} { background: ${C.ink}; }

      /* --- mini 04: token cascade --- */
      .cas-pill {
        position: absolute; left: 30px; width: 240px; height: 54px;
        background: ${C.ground}; border: 1px solid ${C.quiet}; border-radius: 27px;
      }
      .cas-dim { position: absolute; left: 14px; top: 25px; width: 40px; height: 4px; background: ${C.primary}; border-radius: 1px; }
      .dt { position: absolute; top: -4px; width: 2px; height: 12px; background: ${C.primary}; }
      .dt-l { left: 0; }
      .dt-r { right: 0; }
      .cas-lab { position: absolute; left: 76px; top: 23px; width: 110px; height: 8px; background: ${C.quiet}; border-radius: 3px; }
      .cas-link { position: absolute; left: 148px; width: 2px; height: 32px; background: ${C.quiet}; transform-origin: top center; }
      .cas-wire { position: absolute; left: 270px; top: 218px; width: 30px; height: 2px; background: ${C.quiet}; transform-origin: left center; }
      .cas-btn {
        position: absolute; left: 300px; top: 192px; width: 124px; height: 54px;
        background: ${C.primary}; border-radius: 8px;
      }
      .cas-bpill { position: absolute; left: 32px; top: 23px; width: 60px; height: 8px; background: ${C.ground}; border-radius: 4px; }

      /* --- mini 05: a base component and its variant set --- */
      .vt-base {
        position: absolute; left: 128px; top: 18px; width: 176px; height: 56px;
        background: ${C.primary}; border-radius: 8px;
      }
      .vt-icon { position: absolute; left: 28px; top: 18px; width: 20px; height: 20px; background: ${C.ground}; border-radius: 4px; }
      .vt-pill { position: absolute; left: 62px; top: 24px; width: 84px; height: 8px; background: ${C.ground}; border-radius: 4px; }
      .vt-stem { position: absolute; left: 215px; top: 78px; width: 2px; height: 22px; background: ${C.quiet}; transform-origin: top center; }
      .vt-spine { position: absolute; left: 79px; top: 100px; width: 274px; height: 2px; background: ${C.quiet}; transform-origin: center center; }
      .vt-drop { position: absolute; top: 102px; width: 2px; height: 18px; background: ${C.quiet}; transform-origin: top center; }
      .vt-var { position: absolute; top: 124px; width: 128px; height: 48px; border-radius: 8px; }
      .vt-filled { background: ${C.primary}; }
      .vt-filled .vt-vpill { background: ${C.ground}; }
      .vt-outline { background: ${C.ground}; border: 2px solid ${C.primary}; }
      .vt-outline .vt-vpill { background: ${C.primary}; }
      .vt-muted { background: ${C.quiet}; }
      .vt-muted .vt-vpill { background: ${C.mid}; }
      .vt-vpill { position: absolute; left: 34px; top: 20px; width: 60px; height: 8px; border-radius: 4px; }

      /* --- mini 06: adaptive reflow, bars draw up --- */
      .bn-cell { position: absolute; background: ${C.ground}; border: 1px solid ${C.quiet}; border-radius: 4px; opacity: 1; }
      .bn-bar { position: absolute; bottom: 26px; width: 28px; background: ${C.primary}; border-radius: 3px; transform-origin: bottom center; }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="12"
      data-width="${W}"
      data-height="${H}"
    >
      <div id="wash" class="clip" data-start="0" data-duration="12" data-track-index="0">
        <div id="ground"></div>
        ${WASH.map((w, i) => `<div class="wash" id="wash-${i}" style="background:${w}"></div>`).join("\n        ")}
      </div>

      <div
        id="rail-layer"
        class="clip"
        data-start="0"
        data-duration="12"
        data-track-index="1"
      >
        <div id="rail" data-layout-allow-overflow="true">
          <div id="rail-col" data-layout-allow-overflow="true"></div>
          ${slots.join("\n          ")}
          ${focuses.join("\n          ")}
        </div>
      </div>

      <div id="labels" class="clip" data-start="0" data-duration="12" data-track-index="2">
        <div class="lab-col lab-left">
          ${labels("l")}
        </div>
        <div class="lab-col lab-right">
          ${labels("r")}
        </div>
      </div>
    </div>

    <script>
      /* Spec ease: cubic-bezier(0.45, 0.05, 0.15, 1) — solved analytically,
         no plugin, fully deterministic. Zero spring, zero overshoot. */
      function bezierEase(x1, y1, x2, y2) {
        var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
        var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
        function sx(t) { return ((ax * t + bx) * t + cx) * t; }
        function sy(t) { return ((ay * t + by) * t + cy) * t; }
        function dx(t) { return (3 * ax * t + 2 * bx) * t + cx; }
        return function (p) {
          if (p <= 0) return 0;
          if (p >= 1) return 1;
          var t = p, i, d, x;
          for (i = 0; i < 8; i++) {
            x = sx(t) - p;
            if (x < 0 ? -x < 1e-7 : x < 1e-7) return sy(t);
            d = dx(t);
            if (d < 0 ? -d < 1e-7 : d < 1e-7) break;
            t -= x / d;
          }
          var lo = 0, hi = 1;
          t = p;
          for (i = 0; i < 30; i++) {
            x = sx(t);
            if (x > p) hi = t; else lo = t;
            t = (lo + hi) / 2;
          }
          return sy(t);
        };
      }
      gsap.registerEase("stage", bezierEase(0.45, 0.05, 0.15, 1));
      var E = "stage";

      var STAGE_DUR = 2.0;
      var ARRIVE = 0.45;
      var PLAY = 0.45;
      var SLOT = ${SLOT};
      var MIN_SCALE = 0.42;

      window.__timelines = window.__timelines || {};
      var tl = gsap.timeline({ paused: true });

      /* First tween added for a given target+property owns immediateRender;
         every later tween on the same channel must not re-assert its start. */
      var seen = Object.create(null);
      function ft(target, from, to, at, key) {
        if (seen[key]) to.immediateRender = false;
        seen[key] = 1;
        to.ease = to.ease || E;
        tl.fromTo(target, from, to, at);
        return tl;
      }

      var SR_ORDER = [${SR_ORDER.join(", ")}];
      var SR_SAVED = [${SR_SAVED.join(", ")}];
      /* caret x offsets per typed glyph, from .caret-a's 46px base */
      var CARET_X = [0, 12, 24, 32, 40, 52, 64, 76];
      var BN_FROM = ${JSON.stringify(BN_FROM)};
      var BN_TO = ${JSON.stringify(BN_CELLS)};

      /* Each mini plays once inside its ~1.10s "play" beat, then rests. */
      function buildMini(k, t0) {
        var s = "#fc-" + k + " ", i, a;

        // 01 — the one-line brief unfolds into four fields + five personas
        if (k === 0) {
          ft(s + ".br-line", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, t0, "brl");
          for (i = 0; i < 4; i++) {
            a = s + ".bf" + i;
            ft(a, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 }, t0 + 0.2 + i * 0.09, "bf" + i);
            ft(a + " .br-val", { scaleX: 0 }, { scaleX: 1, duration: 0.3 }, t0 + 0.3 + i * 0.09, "bv" + i);
          }
          ft(s + ".br-personas", { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 }, t0 + 0.58, "brp");
          for (i = 0; i < 5; i++) {
            ft(s + ".br-p.p" + i, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22 }, t0 + 0.72 + i * 0.06, "pp" + i);
          }
        }

        // 02 — search field, "buttons" types, results cascade, two saved
        if (k === 1) {
          ft(s + ".srch", { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }, t0, "srch");
          /* caret-a blinks at the left, then hands off to the typed word */
          ft(s + ".caret-a", { opacity: 0 }, { opacity: 1, duration: 0.02 }, t0 + 0.08, "ca");
          ft(s + ".caret-a", { opacity: 1 }, { opacity: 0, duration: 0.02 }, t0 + 0.24, "ca");
          /* letters pop in typed order; caret-a's x steps along with them */
          for (i = 0; i < 7; i++) {
            ft(s + ".q" + i, { opacity: 0 }, { opacity: 1, duration: 0.02 }, t0 + 0.28 + i * 0.07, "q" + i);
          }
          /* caret-b appears at the word's end and blinks to rest visible */
          ft(s + ".caret-b", { opacity: 0 }, { opacity: 1, duration: 0.02 }, t0 + 0.77, "cb");
          ft(s + ".caret-b", { opacity: 1 }, { opacity: 0, duration: 0.02 }, t0 + 0.92, "cb");
          ft(s + ".caret-b", { opacity: 0 }, { opacity: 1, duration: 0.02 }, t0 + 1.04, "cb");
          for (i = 0; i < 6; i++) {
            ft(
              s + ".g" + SR_ORDER[i],
              { y: 10, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3 },
              t0 + 0.42 + i * 0.07,
              "gt" + i,
            );
          }
          for (i = 0; i < 2; i++) {
            ft(s + ".g" + SR_SAVED[i] + " .grid-hi", { opacity: 0 }, { opacity: 1, duration: 0.2 }, t0 + 0.92 + i * 0.08, "gh" + i);
          }
        }

        // 03 — rules stack; the pin cites rule 2; the demo card applies it
        if (k === 2) {
          for (i = 0; i < 3; i++) {
            a = s + ".rule-row:nth-of-type(" + (i + 1) + ")";
            ft(a, { opacity: 0 }, { opacity: 1, duration: 0.18 }, t0 + i * 0.08, "rr" + i);
            ft(a + " .rule-line", { scaleX: 0 }, { scaleX: 1, duration: 0.28 }, t0 + i * 0.08, "rl" + i);
          }
          ft(s + ".demo-card", { opacity: 0 }, { opacity: 1, duration: 0.24 }, t0 + 0.1, "dmc");
          for (i = 0; i < 4; i++) {
            ft(s + ".db" + i, { scaleY: 0 }, { scaleY: 1, duration: 0.26 }, t0 + 0.2 + i * 0.05, "db" + i);
          }
          ft(s + ".cite-pin", { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22 }, t0 + 0.5, "pin");
          ft(s + ".cite-hi", { opacity: 0 }, { opacity: 1, duration: 0.22 }, t0 + 0.6, "chi");
          ft(s + ".cite-dot", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.12 }, t0 + 0.74, "cdot");
          /* the cited rule applies: series drop to quiet grey, one stays ink */
          for (i = 0; i < 4; i++) {
            if (i === ${DEMO_HI}) {
              ft(s + ".db" + i, { backgroundColor: "${C.quiet}" }, { backgroundColor: "${C.ink}", duration: 0.22 }, t0 + 0.86, "dbc" + i);
            } else {
              ft(s + ".db" + i, { backgroundColor: "${C.mid}" }, { backgroundColor: "${C.quiet}", duration: 0.22 }, t0 + 0.86, "dbc" + i);
            }
          }
        }

        // 04 — cascade: pills land, then the value ripples primitive->semantic->component
        if (k === 3) {
          for (i = 0; i < 3; i++) {
            ft(s + ".cp" + i, { opacity: 0 }, { opacity: 1, duration: 0.22 }, t0 + i * 0.08, "cp" + i);
          }
          ft(s + ".cas-link:nth-of-type(4)", { scaleY: 0 }, { scaleY: 1, duration: 0.2 }, t0 + 0.12, "lk0");
          ft(s + ".cas-link:nth-of-type(5)", { scaleY: 0 }, { scaleY: 1, duration: 0.2 }, t0 + 0.2, "lk1");
          ft(s + ".cas-wire", { scaleX: 0 }, { scaleX: 1, duration: 0.2 }, t0 + 0.28, "wire");
          ft(s + ".cas-btn", { opacity: 0 }, { opacity: 1, duration: 0.22 }, t0 + 0.3, "comp");
          /* the ripple: the DIMENSION widens at the primitive and flows down,
             and the component's padding visibly grows with it */
          for (i = 0; i < 3; i++) {
            ft(
              s + ".cp" + i + " .cas-dim",
              { width: 24 },
              { width: 40, duration: 0.22 },
              t0 + 0.52 + i * 0.16,
              "dim" + i,
            );
          }
          ft(s + ".cas-btn", { width: 96 }, { width: 124, duration: 0.24 }, t0 + 1.0, "cbw");
          ft(s + ".cas-bpill", { x: -14 }, { x: 0, duration: 0.24 }, t0 + 1.0, "cbp");
        }

        // 05 — the base component lands, the tree draws, three variants pop in
        if (k === 4) {
          ft(s + ".vt-base", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }, t0, "vb");
          ft(s + ".vt-icon", { opacity: 0 }, { opacity: 1, duration: 0.16 }, t0 + 0.16, "vi");
          ft(s + ".vt-pill", { opacity: 0 }, { opacity: 1, duration: 0.16 }, t0 + 0.24, "vp");
          ft(s + ".vt-stem", { scaleY: 0 }, { scaleY: 1, duration: 0.16 }, t0 + 0.34, "vs");
          ft(s + ".vt-spine", { scaleX: 0 }, { scaleX: 1, duration: 0.22 }, t0 + 0.46, "vsp");
          for (i = 0; i < 3; i++) {
            ft(s + ".vt-drop:nth-of-type(" + (i + 4) + ")", { scaleY: 0 }, { scaleY: 1, duration: 0.14 }, t0 + 0.62 + i * 0.05, "vd" + i);
            ft(s + ".vv" + i, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }, t0 + 0.72 + i * 0.09, "vv" + i);
          }
        }

        // 06 — uniform grid re-packs into the bento, then the series draws
        if (k === 5) {
          for (i = 0; i < 4; i++) {
            a = s + ".bn-cell-" + i;
            ft(a, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t0 + i * 0.05, "bo" + i);
            ft(
              a,
              { left: BN_FROM[i].left, top: BN_FROM[i].top, width: BN_FROM[i].w, height: BN_FROM[i].h },
              { left: BN_TO[i].left, top: BN_TO[i].top, width: BN_TO[i].w, height: BN_TO[i].h, duration: 0.5 },
              t0 + 0.35 + i * 0.05,
              "bg" + i,
            );
          }
          for (i = 0; i < 4; i++) {
            ft(s + ".bn-bar:nth-of-type(" + (i + 1) + ")", { scaleY: 0 }, { scaleY: 1, duration: 0.3 }, t0 + 0.78 + i * 0.05, "bb" + i);
          }
        }
      }

      /* Rail advances exactly one slot per stage burst; stack is periodic
         mod 6, so the rest state at the tail draws the same pixels as t=0. */
      ${[0, 1, 2, 3, 4, 5]
        .map(
          (k) =>
            `ft("#rail", { y: ${(1 - k) * SLOT} }, { y: ${-k * SLOT}, duration: 0.45 }, ${k * 2}, "rail");`,
        )
        .join("\n      ")}

      for (var k = 0; k < 6; k++) {
        var T = k * STAGE_DUR;

        var prev = k === 0 ? "#fc-p" : "#fc-" + (k - 1);
        ft(prev, { scale: 1, opacity: 1 }, { scale: MIN_SCALE, opacity: 0, duration: ARRIVE }, T, "f" + prev);

        ft("#fc-" + k, { scale: MIN_SCALE, opacity: 0 }, { scale: 1, opacity: 1, duration: ARRIVE }, T, "f#fc-" + k);
        ft("#fc-" + k + " .sel", { opacity: 0 }, { opacity: 1, duration: 0.27 }, T + 0.18, "sel" + k);

        var out = (k + 5) % 6;
        ft("#lab-l-" + out + ", #lab-r-" + out, { opacity: 1 }, { opacity: 0, duration: ARRIVE }, T, "lab" + out);
        ft("#lab-l-" + k + ", #lab-r-" + k, { opacity: 0 }, { opacity: 1, duration: ARRIVE }, T, "lab" + k);
        ft("#wash-" + out, { opacity: 1 }, { opacity: 0, duration: ARRIVE }, T, "wash" + out);
        ft("#wash-" + k, { opacity: 0 }, { opacity: 1, duration: ARRIVE }, T, "wash" + k);

        buildMini(k, T + PLAY);
      }

      tl.seek(0);
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

mkdirSync(dirname(OUT) || ".", { recursive: true });
writeFileSync(OUT, html);
console.log("wrote", OUT, html.length, "bytes");
