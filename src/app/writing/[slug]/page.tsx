import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WORK } from "@/lib/content/work";
import { PostArticle, type PostFrontmatter } from "./post-article";

// Pillar subdirs under content/published/ — mirrors content/README.md.
const PILLARS = ["process", "authority", "breakdown", "experiment"] as const;

async function readPost(pillar: string, file: string) {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", "published", pillar, file),
      "utf8"
    );
    const { data, content } = matter(raw);
    // The H1 is dropped: the page header already renders the frontmatter title.
    return {
      data: data as PostFrontmatter,
      content: content.replace(/^\s*#\s[^\n]+\n+/, ""),
    };
  } catch {
    return null;
  }
}

/**
 * A post is `<slug>.md`, with an optional `<slug>.es.md` beside it.
 *
 * Both are read on the server and handed to the client, which picks by language.
 * The language lives in localStorage (see i18n.tsx), so the server can't know it —
 * and the alternative, a per-locale route, would mean two URLs for one piece plus a
 * redirect on every language toggle. A post body is a few KB; shipping both is
 * cheaper than that.
 *
 * No Spanish file means the English body serves both, which is the current state of
 * every post except modern-ui-2026.
 */
async function loadPost(slug: string) {
  // Guard against path traversal — slugs are simple kebab-case names.
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  for (const pillar of PILLARS) {
    const en = await readPost(pillar, `${slug}.md`);
    if (!en) continue;
    const es = await readPost(pillar, `${slug}.es.md`);
    return { en, es };
  }
  return null;
}

export default async function WritingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) notFound();

  const { en, es } = post;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 pt-8 pb-24 sm:pt-12">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground w-fit font-mono text-xs tracking-wider uppercase transition-colors"
        >
          ← Back
        </Link>

        <PostArticle en={en} es={es} />

        <section className="border-border/60 mt-8 flex flex-col gap-6 border-t pt-12">
          <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
            More work
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WORK.filter((w) => !w.hidden && w.kind === "case-study").map(
              (w) => (
                <Link
                  key={w.slug}
                  href={w.href}
                  className="group border-border bg-card hover:border-foreground/30 flex items-center justify-between gap-4 rounded-2xl border p-5 transition-all hover:shadow-md"
                  style={w.bgColor ? { backgroundColor: w.bgColor } : undefined}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground font-display text-lg font-bold tracking-tight">
                      {w.title.en}
                    </span>
                    <span className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      {w.description.en}
                    </span>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-foreground size-5 shrink-0 transition-colors" />
                </Link>
              )
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
