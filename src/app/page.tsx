import { BentoHome } from "@/components/bento-home";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      {/* The crab mark is the home link here — the bento carries the identity in
          its intro tile, so the header doesn't need to repeat the wordmark. */}
      <SiteHeader brand="adaptive" />
      <BentoHome />
      <SiteFooter />
    </>
  );
}
