import { HomeIntro } from "@/components/home-intro";
import { MyWork } from "@/components/my-work";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 pb-24 sm:gap-16">
        <HomeIntro />
        <MyWork />
      </main>
      <SiteFooter />
    </>
  );
}
