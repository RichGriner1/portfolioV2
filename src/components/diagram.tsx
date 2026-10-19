import { cn } from "@/lib/utils";

/** What `renderDiagram` (src/lib/diagram.ts) returns. `narrow` is null when one layout fits both. */
export type DiagramSvgs = { wide: string; narrow: string | null };

/**
 * A Mermaid diagram, already rendered to SVG on the server.
 *
 * No hooks and no pele import, so it renders from a server or a client component
 * without pulling the renderer into the bundle. The look comes from `.pele-diagram`
 * in globals.css, which points pele's variables at the semantic tokens, so the
 * theme toggle restyles it with no re-render.
 *
 * Framed by default, in the same card-and-dot-grid panel the motion figures use, so
 * a diagram in a post reads as one of them. `framed={false}` is for a diagram that
 * already sits on a card.
 *
 * The accessible name is the source's `accTitle` / `accDescr`, which pele writes
 * into the SVG as <title> and <desc>.
 */
export function Diagram({
  svgs,
  framed = true,
  className,
}: {
  svgs: DiagramSvgs;
  framed?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "pele-diagram flex justify-center",
        framed &&
          "bg-card border-border/60 rounded-xl border bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] px-3 py-8 sm:px-8",
        className
      )}
    >
      <div
        className={cn(
          "w-full [&_svg]:mx-auto",
          svgs.narrow && "hidden sm:block"
        )}
        dangerouslySetInnerHTML={{ __html: svgs.wide }}
      />
      {svgs.narrow ? (
        <div
          className="w-full sm:hidden [&_svg]:mx-auto"
          dangerouslySetInnerHTML={{ __html: svgs.narrow }}
        />
      ) : null}
    </figure>
  );
}
