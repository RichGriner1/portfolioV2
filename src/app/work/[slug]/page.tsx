import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyBento } from "@/components/case-study-bento";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CASE_STUDIES } from "@/lib/content/case-studies";
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

  const study = CASE_STUDIES[slug];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 pt-8 pb-24">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-wider uppercase transition-colors"
        >
          ← back
        </Link>

        {study ? (
          <>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  {item.year}
                </div>
                <h1 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                  {item.title}{" "}
                  <span className="text-muted-foreground font-normal">
                    — {study.tagline}
                  </span>
                </h1>
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-foreground text-base leading-relaxed">
                  {study.intro}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-base">
                    <span className="text-muted-foreground">Role: </span>
                    {study.role}
                  </p>
                  <p className="text-base">
                    <span className="text-muted-foreground">
                      Contribution:{" "}
                    </span>
                    {study.contributions.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {study.confidential && (
              <p className="text-muted-foreground border-border rounded-lg border border-dashed px-4 py-3 text-sm">
                {study.confidential}
              </p>
            )}

            <CaseStudyBento cards={study.bento} />
          </>
        ) : (
          <>
            <header className="flex flex-col gap-3">
              <div className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {item.year}
              </div>
              <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
                {item.title}
              </h1>
            </header>
            <section className="border-border/60 text-muted-foreground rounded-xl border border-dashed p-8 text-sm">
              Case study coming soon.
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
