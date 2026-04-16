import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WorkIndex } from "@/components/work-index";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 pb-24 sm:gap-20">
        <Hero />
        <WorkIndex />
      </main>
      <SiteFooter />
    </>
  );
}
