import { render } from "pele";

import type { DiagramSvgs } from "@/components/diagram";

/**
 * Mermaid source to themeable SVG, on the server.
 *
 * Import this only from server components (page.tsx files). It is the one place
 * `pele` is loaded, so the renderer never reaches a client bundle: the page renders
 * on the server (at build time for /work, per request for /writing) and hands
 * <Diagram> finished SVG strings.
 *
 * Two layouts, because the SVG scales down to fit and does not reflow. `wide` gets
 * the article column; `narrow` gets a phone's, where pele wraps long rows into
 * columns instead of shrinking the type until it can't be read. When the wide
 * layout already fits a phone, there's no narrow one and the component renders one.
 *
 * A bad diagram throws, which fails the build instead of shipping an empty figure.
 */
export function renderDiagram(source: string, id: string): DiagramSvgs {
  const wide = render(source, {
    ...OPTIONS,
    idPrefix: `${id}-w`,
    maxWidth: 720,
  });
  if (wide.width <= PHONE_WIDTH) return { wide: wide.svg, narrow: null };
  const narrow = render(source, {
    ...OPTIONS,
    idPrefix: `${id}-n`,
    maxWidth: 300,
  });
  return { wide: wide.svg, narrow: narrow.svg };
}

/** 14px matches the figure chips; pele sizes boxes from it, so it's set here, not in CSS. */
const OPTIONS = { fontSize: 14 };

/** Widest SVG that still reads at 320px, where the article column is 272px before the frame's padding. */
const PHONE_WIDTH = 310;
