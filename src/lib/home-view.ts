/**
 * Which layout `/` renders: the canvas board or the plain scrolling list.
 *
 * A cookie rather than localStorage, because the server picks the layout. Reading it
 * on the client would render the canvas first and swap it out after hydration, and
 * the visitor who asked for the simple page would watch the complicated one flash
 * past every time they came back.
 */
export const HOME_VIEW_COOKIE = "home-view";

export type HomeView = "canvas" | "list";

export function parseHomeView(value: string | undefined): HomeView {
  return value === "list" ? "list" : "canvas";
}

/** A year: the choice should outlast a session, since the reason for it doesn't. */
const MAX_AGE = 60 * 60 * 24 * 365;

export function saveHomeView(view: HomeView) {
  document.cookie = `${HOME_VIEW_COOKIE}=${view}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}
