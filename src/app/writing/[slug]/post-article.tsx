"use client";

import { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { FIGURES, type FigureKey } from "@/components/motion/figures";
import { useLang } from "@/lib/i18n";

export type PostFrontmatter = {
  title?: string;
  created?: string | Date;
  tags?: string[];
};

export type PostContent = { data: PostFrontmatter; content: string };

function formatPostDate(
  input: string | Date | undefined,
  locale: string
): string | null {
  if (!input) return null;
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The post title, date and body, in the reader's language.
 *
 * A client component because the language is client state (localStorage), so the
 * server can't resolve it. It receives BOTH bodies and picks; `es` is null for every
 * post that has no Spanish file, and then English serves both.
 */
export function PostArticle({
  en,
  es,
}: {
  en: PostContent;
  es: PostContent | null;
}) {
  const { lang } = useLang();
  const { data, content } = lang === "es" && es ? es : en;
  const locale = lang === "es" ? "es-ES" : "en-US";

  return (
    <>
      <header className="border-border flex flex-col gap-4 border-b pb-8">
        {formatPostDate(data.created, locale) ? (
          <time className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
            {formatPostDate(data.created, locale)}
          </time>
        ) : null}
        {data.title ? (
          <h1 className="text-foreground font-display text-4xl font-bold tracking-tight md:text-5xl">
            {data.title}
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
          {content}
        </ReactMarkdown>
      </article>
    </>
  );
}
