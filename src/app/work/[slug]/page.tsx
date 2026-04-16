import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WORK } from "@/lib/content/work";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return WORK.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = WORK.find((w) => w.slug === slug);
  if (!item) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 pt-8 pb-24">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-wider uppercase transition-colors"
        >
          ← back
        </Link>

        <header className="flex flex-col gap-3">
          <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
            <span>{item.year}</span>
            {item.revamp && <span> · revamping</span>}
          </div>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
            {item.title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {item.description}
          </p>
        </header>

        <section className="border-border/60 text-muted-foreground rounded-xl border border-dashed p-8 text-sm">
          Case study coming soon. This page is a placeholder so the index links
          resolve; the real write-up lands here once the story is drafted (via{" "}
          <code className="font-mono">/polish</code> or by hand).
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
