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
  // The whole loop of the third-party compliance tool, checked against the v1.1
  // requirements sheet (flows 2.3, 3.3, 4.2–4.4, 7.1–7.5). The ES had its afi-redaccion pass.
  "tpc-user-flow": {
    en: `flowchart TD
  accTitle: The compliance loop, from template to approval
  accDescr: Afi publishes a template and assigns it to a supplier. The supplier's contact signs in with a one-time code, answers and sends. Afi reviews each answer, then approves or returns it with comments, and the supplier corrects and resends.
  subgraph afi[Afi]
    T[Publish a template] --> N[New assignment: supplier, template, due date]
    N --> S[Send to the authorised contacts]
  end
  subgraph sup[Supplier]
    C[Email and one-time code, no password] --> Q[Answer, or save and continue later]
    Q --> R[Check the summary and send]
  end
  subgraph rev[Afi review]
    V[Review each answer]
    V -->|all compliant| A[Approve]
    V -->|any needs more info| D[Return with comments]
  end
  S --> C
  R --> V
  D --> F[Supplier corrects and resends]
  F --> V`,
    es: `flowchart TD
  accTitle: El circuito de cumplimiento, de la plantilla a la aprobación
  accDescr: Afi publica una plantilla y se la asigna a un proveedor. El contacto del proveedor entra con un código de un solo uso, responde y envía. Afi revisa cada respuesta y la aprueba o la devuelve con comentarios, y el proveedor corrige y reenvía.
  subgraph afi[Afi]
    T[Publicar una plantilla] --> N[Nueva asignación: proveedor, plantilla, fecha límite]
    N --> S[Enviar a los contactos autorizados]
  end
  subgraph sup[Proveedor]
    C[Correo y código de un solo uso, sin contraseña] --> Q[Responder, o guardar y seguir más tarde]
    Q --> R[Revisar el resumen y enviar]
  end
  subgraph rev[Revisión de Afi]
    V[Revisar cada respuesta]
    V -->|todo conforme| A[Aprobar]
    V -->|falta información| D[Devolver con comentarios]
  end
  S --> C
  R --> V
  D --> F[El proveedor corrige y reenvía]
  F --> V`,
  },
} satisfies Record<string, Bilingual<string>>;

export type DiagramKey = keyof typeof DIAGRAMS;

/** The work page's rendered SVGs for the keys a case study uses, both languages. */
export type RenderedDiagrams = Partial<
  Record<DiagramKey, Bilingual<DiagramSvgs>>
>;
