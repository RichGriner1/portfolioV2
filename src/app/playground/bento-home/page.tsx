import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BentoHome } from "@/components/bento-home";

/**
 * The bento composition, which used to be `/`.
 *
 * The canvas board took over the home page; Richard wants this kept as a
 * composition to work from rather than deleted, so it stays a real route. Still
 * noindex — it isn't a destination for visitors, and two indexed pages presenting
 * the same work would compete with each other.
 */
export const metadata = {
  title: "Bento home (prototype)",
  robots: { index: false },
};

export default function BentoHomePage() {
  return (
    <>
      <SiteHeader />
      <BentoHome />
      <SiteFooter />
    </>
  );
}
