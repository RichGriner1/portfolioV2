// One-off: generate X + LinkedIn banners as PNGs from an inline SVG.
// Brand: neutral (ink #242424 on #f3f3f3) + lime accent #c9f24e.
// Concept (Matt Gray "Go from this → to this"): inconsistent UI → a design system.
import sharp from "sharp";
import { join } from "node:path";
import { homedir } from "node:os";

const OUT = join(homedir(), "Code", "RichGriner1", "banners-output");

const INK = "#242424";
const SOFT = "#6b6b6b";
const BG = "#f3f3f3";
const LIME = "#c9f24e";
const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";

function chaos(cx, cy) {
  const rects = [
    {
      dx: -90,
      dy: -58,
      w: 118,
      h: 32,
      rot: -8,
      fill: "#e8e8e8",
      stroke: "#b4b4b4",
    },
    {
      dx: -35,
      dy: -14,
      w: 148,
      h: 30,
      rot: 6,
      fill: "none",
      stroke: "#a8a8a8",
    },
    {
      dx: -96,
      dy: 26,
      w: 92,
      h: 40,
      rot: -4,
      fill: "#ededed",
      stroke: "#cccccc",
    },
    {
      dx: -16,
      dy: 52,
      w: 128,
      h: 28,
      rot: 11,
      fill: "none",
      stroke: "#a8a8a8",
    },
    {
      dx: 46,
      dy: -40,
      w: 72,
      h: 48,
      rot: -13,
      fill: "#e8e8e8",
      stroke: "#c0c0c0",
    },
    { dx: 30, dy: 16, w: 60, h: 30, rot: 16, fill: "none", stroke: "#b4b4b4" },
  ];
  return rects
    .map((r) => {
      const x = cx + r.dx,
        y = cy + r.dy;
      const ccx = x + r.w / 2,
        ccy = y + r.h / 2;
      return `<rect x="${x}" y="${y}" width="${r.w}" height="${r.h}" rx="7" fill="${r.fill}" stroke="${r.stroke}" stroke-width="2.5" transform="rotate(${r.rot} ${ccx} ${ccy})"/>`;
    })
    .join("");
}

function grid(cx, cy) {
  const cols = 4,
    rows = 3,
    cw = 64,
    ch = 36,
    gap = 16,
    accent = 6;
  const gw = cols * cw + (cols - 1) * gap;
  const gh = rows * ch + (rows - 1) * gap;
  const sx = cx - gw / 2,
    sy = cy - gh / 2;
  let out = "";
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = sx + c * (cw + gap),
        y = sy + r * (ch + gap);
      const fill = i === accent ? LIME : "#ffffff";
      out += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="8" fill="${fill}" stroke="${INK}" stroke-width="2.5"/>`;
      i++;
    }
  }
  return out;
}

function arrow(x1, x2, y) {
  return `<line x1="${x1}" y1="${y}" x2="${x2 - 12}" y2="${y}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <polygon points="${x2},${y} ${x2 - 14},${y - 8} ${x2 - 14},${y + 8}" fill="${INK}"/>`;
}

function banner({
  W,
  H,
  cy,
  lblSize,
  chaosCx,
  arrowX1,
  arrowX2,
  toLblX,
  gridCx,
  goLblX,
  tag,
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <text x="${goLblX}" y="${cy + 10}" text-anchor="end" font-family="${FONT}" font-size="${lblSize}" font-weight="700" fill="${INK}">Go from this:</text>
  ${chaos(chaosCx, cy)}
  ${arrow(arrowX1, arrowX2, cy)}
  <text x="${toLblX}" y="${cy + 10}" text-anchor="end" font-family="${FONT}" font-size="${lblSize}" font-weight="700" fill="${INK}">to this:</text>
  ${grid(gridCx, cy)}
  <text x="${W - 60}" y="${H - 40}" text-anchor="end" font-family="${FONT}" font-size="24" font-weight="600" fill="${SOFT}">${tag}<tspan fill="${LIME}">.</tspan></text>
</svg>`;
}

const xSvg = banner({
  W: 1500,
  H: 500,
  cy: 205,
  lblSize: 36,
  goLblX: 330,
  chaosCx: 490,
  arrowX1: 650,
  arrowX2: 740,
  toLblX: 940,
  gridCx: 1165,
  tag: "Design systems that scale",
});

const liSvg = banner({
  W: 1584,
  H: 396,
  cy: 150,
  lblSize: 34,
  goLblX: 380,
  chaosCx: 540,
  arrowX1: 700,
  arrowX2: 790,
  toLblX: 995,
  gridCx: 1220,
  tag: "Design systems that scale",
});

await sharp(Buffer.from(xSvg)).png().toFile(join(OUT, "x-banner-1500x500.png"));
await sharp(Buffer.from(liSvg))
  .png()
  .toFile(join(OUT, "linkedin-banner-1584x396.png"));
console.log(
  "wrote x-banner-1500x500.png and linkedin-banner-1584x396.png to",
  OUT
);
