import { Hero } from "@/components/hero";
import { MyWork } from "@/components/my-work";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 pb-24 sm:gap-20">
        <Hero />
        <MyWork />
      </main>
      <SiteFooter />
    </>
  );
}
