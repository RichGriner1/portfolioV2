import type { DiagramSvgs } from "@/components/diagram";
import type { Bilingual } from "@/lib/i18n";

/**
 * Mermaid sources for diagrams in case-study detail copy, one per language.
 *
 * Posts keep theirs inline as ```mermaid fences. Case studies can't: their copy is
 * client-side data, so a card names a key here (`details.diagram`) and the work
 * page renders the source on the server. Top-down, so a phone gets a column
 * instead of a row shrunk to fit. `accTitle` / `accDescr` are the accessible name.
 */
export const DIAGRAMS = {
  "feedback-round-trip": {
    en: `flowchart TD
  accTitle: Where a comment goes after it lands
  accDescr: A teammate pins a component and leaves a comment. The comment lands in the rail, gets exported as an .md file, the component is iterated, and the change is logged in the change log, which the next comment builds on.
  A[A teammate pins a component] --> B[Leaves a comment]
  B --> C[Comment lands in the rail]
  C --> D[Exported as an .md file]
  D --> E[We iterate on the component]
  E --> F[Logged in the change log]
  F -.-> A`,
    // TODO(afi-redaccion)
    es: `flowchart TD
  accTitle: Adónde va un comentario cuando llega
  accDescr: Un compañero fija un componente y deja un comentario. El comentario llega al panel, se exporta como archivo .md, iteramos el componente y el cambio queda en el registro de cambios, sobre el que se apoya el siguiente comentario.
  A[Un compañero fija un componente] --> B[Deja un comentario]
  B --> C[El comentario llega al panel]
  C --> D[Se exporta como archivo .md]
  D --> E[Iteramos el componente]
  E --> F[Queda en el registro de cambios]
  F -.-> A`,
  },
} satisfies Record<string, Bilingual<string>>;

export type DiagramKey = keyof typeof DIAGRAMS;

/** The work page's rendered SVGs for the keys a case study uses, both languages. */
export type RenderedDiagrams = Partial<
  Record<DiagramKey, Bilingual<DiagramSvgs>>
>;
