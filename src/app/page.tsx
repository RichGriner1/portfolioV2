import { cookies } from "next/headers";

import { BentoHome } from "@/components/bento-home";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ViewSwitch } from "@/components/view-switch";
import { HOME_VIEW_COOKIE, parseHomeView } from "@/lib/home-view";
import { CanvasSite } from "./canvas/canvas-site";

/**
 * Two front doors onto the same work, picked by the visitor.
 *
 * The canvas board is the default and the one that shows taste, but hiring
 * managers and executives who don't live in Figma or Miro find a pannable board
 * hard to read. The list is the bento composition: a conventional scrolling page
 * with header and footer, built from the same `WORK` entries, so nothing is
 * written twice.
 *
 * The canvas gets no SiteHeader or SiteFooter, deliberately: the board IS the
 * site, so wrapping it in the conventional chrome would argue with itself. Its
 * switch floats top-right instead, the corner nothing else on the board uses.
 *
 * `?view=list` forces the list for that request, so a CV or a message to a
 * recruiter can link straight to it. Otherwise the cookie the switch writes
 * decides. Reading either makes `/` render per request, which is the price of the
 * server choosing the layout rather than the client swapping it after load.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const { view: param } = await searchParams;
  const view =
    param === "list" || param === "canvas"
      ? param
      : parseHomeView((await cookies()).get(HOME_VIEW_COOKIE)?.value);

  if (view === "list") {
    return (
      <>
        <SiteHeader homeView="list" />
        <BentoHome />
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      {/* Before the board in the DOM so it's the first tab stop: a keyboard user
          shouldn't have to cross the whole canvas to reach the way out of it. */}
      <ViewSwitch current="canvas" className="fixed top-4 right-4 z-30" />
      <CanvasSite />
    </>
  );
}
