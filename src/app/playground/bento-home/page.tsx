import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BentoHome } from "@/components/bento-home";

/**
 * Kept as a noindex alias of `/` now that this composition IS the home page, so
 * any bookmark or link to the old prototype URL still resolves. Renders the same
 * component — there is no second copy to keep in sync. Safe to delete.
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
