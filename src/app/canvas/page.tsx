import type { Metadata } from "next";

import { CanvasSite } from "./canvas-site";

/**
 * The canvas-as-site concept, on its own route.
 *
 * No SiteHeader and no SiteFooter, deliberately: the whole idea is that the board
 * IS the site, so wrapping it in the conventional chrome would be arguing with
 * itself. The section rail at the bottom is the navigation.
 */
export const metadata: Metadata = {
  title: "Canvas",
  description:
    "The portfolio as one Figma-style board: labelled sections you pan between.",
};

export default function CanvasPage() {
  return <CanvasSite />;
}
