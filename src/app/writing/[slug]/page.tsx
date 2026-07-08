import { promises as fs } from "node:fs";
import path from "node:path";
import { isValidElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { FIGURES, type FigureKey } from "@/components/motion/figures";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WORK } from "@/lib/content/work";

type PostFrontmatter = {
  title?: string;
  created?: string | Date;
  tags?: string[];
};

// Pillar subdirs under content/published/ — mirrors content/README.md.
const PILLARS = ["process", "authority", "breakdown", "experiment"] as const;

function formatPostDate(input: string | Date | undefined): string | null {
  if (!input) return null;
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

async function loadPost(slug: string) {
  // Guard against path traversal — slugs are simple kebab-case names.
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  for (const pillar of PILLARS) {
    const filePath = path.join(
      process.cwd(),
      "content",
      "published",
      pillar,
      `${slug}.md`
    );
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(raw);
      const bodyContent = content.replace(/^\s*#\s[^\n]+\n+/, "");
      return { data: data as PostFrontmatter, content: bodyContent };
    } catch {
      continue;
    }
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

        <header className="border-border flex flex-col gap-4 border-b pb-8">
          {formatPostDate(post.data.created) ? (
            <time className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {formatPostDate(post.data.created)}
            </time>
          ) : null}
          {post.data.title ? (
            <h1 className="text-foreground font-display text-4xl font-bold tracking-tight md:text-5xl">
              {post.data.title}
            </h1>
          ) : null}
        </header>

        <article className="flex flex-col gap-5 text-base leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-foreground font-display mt-8 text-3xl font-bold tracking-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-foreground font-display mt-10 text-2xl font-bold tracking-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-foreground mt-6 text-lg font-semibold tracking-tight">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-foreground leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="text-foreground ml-6 flex list-disc flex-col gap-2 leading-relaxed">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-foreground ml-6 flex list-decimal flex-col gap-2 leading-relaxed">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-primary underline underline-offset-4 hover:no-underline"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href?.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="text-foreground font-semibold">
                  {children}
                </strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => (
                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[0.9em]">
                  {children}
                </code>
              ),
              pre: ({ children }) => {
                const codeChild = Array.isArray(children)
                  ? children[0]
                  : children;

                if (
                  isValidElement<{ className?: string; children?: string }>(
                    codeChild
                  ) &&
                  codeChild.props.className?.includes("language-figure")
                ) {
                  const key = String(
                    codeChild.props.children
                  ).trim() as FigureKey;
                  const Figure = FIGURES[key];
                  if (Figure) {
                    return (
                      <div className="my-8">
                        <Figure />
                      </div>
                    );
                  }
                }

                return (
                  <pre className="bg-muted text-foreground overflow-x-auto rounded-lg p-4 font-mono text-sm">
                    {children}
                  </pre>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-border text-muted-foreground border-l-2 pl-4 italic">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="border-border my-4" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

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
