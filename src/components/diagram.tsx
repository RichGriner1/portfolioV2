import { cn } from "@/lib/utils";

/** What `renderDiagram` (src/lib/diagram.ts) returns. `narrow` is null when one layout fits both. */
export type DiagramSvgs = { wide: string; narrow: string | null };

/**
 * A Mermaid diagram, already rendered to SVG on the server.
 *
 * No hooks and no pele import, so it renders from a server or a client component
 * without pulling the renderer into the bundle. Colors come from `.pele-diagram`
 * in globals.css, which points pele's variables at the semantic tokens, so the
 * theme toggle restyles it with no re-render. `surface="card"` is for a diagram
 * sitting on a card, where edge labels have to mask the line in the card's color.
 *
 * The accessible name is the source's `accTitle` / `accDescr`, which pele writes
 * into the SVG as <title> and <desc>.
 */
export function Diagram({
  svgs,
  surface = "background",
  className,
}: {
  svgs: DiagramSvgs;
  surface?: "background" | "card";
  className?: string;
}) {
  return (
    <figure
      data-surface={surface}
      className={cn("pele-diagram flex justify-center", className)}
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
