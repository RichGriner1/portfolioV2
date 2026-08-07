import { CanvasSite } from "./canvas/canvas-site";

/**
 * The canvas board is the home page.
 *
 * No SiteHeader and no SiteFooter, deliberately: the board IS the site's front
 * door, so wrapping it in the conventional chrome would argue with itself. The
 * rail at the bottom is the navigation, and theme/language live in the Settings
 * section rather than floating over the work.
 *
 * The bento composition that used to be here is still built and still reachable at
 * /playground/bento-home — Richard wants it kept as a composition to work from, so
 * it stays a real route rather than being deleted.
 */
export default function Home() {
  return <CanvasSite />;
}
