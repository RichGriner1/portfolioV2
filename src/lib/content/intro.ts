import type { Bilingual } from "@/lib/i18n";

/**
 * The home page's introduction, shared by both layouts: the canvas hero and the
 * traditional page's intro tile. One source so the two front doors can't start
 * telling different stories.
 */

// The ` ` ties keep "the systems" and "productos digitales" on one line, so
// no line ends on an article and the Spanish noun never leaves its adjective.
// HyperText leaves non-letters alone, so the tie survives the scramble.
export const HEADLINE: Bilingual<{
  name: string;
  claim: string;
  altClaim: string;
}> = {
  en: {
    name: "I'm Richard.",
    claim: " I design digital products and the systems behind them.",
    altClaim: " I make cool shit with AI.",
  },
  es: {
    name: "Soy Richard.",
    // TODO(afi-redaccion)
    claim: " Diseño productos digitales y los sistemas que hay detrás.",
    // TODO(afi-redaccion)
    altClaim: " Hago cosas que molan con IA.",
  },
};

// Two levels: the professional read first, the personal point of view quieter
// underneath it.
export const SUBTITLE: Bilingual<{ positioning: string; perspective: string }> =
  {
    en: {
      positioning:
        "UX/UI, design systems and AI-assisted workflows for complex products.",
      perspective:
        "Anthropology taught me to understand behavior. Design gave me the tools to create experiences that fit it.",
    },
    es: {
      // TODO(afi-redaccion)
      positioning:
        "UX/UI, sistemas de diseño y flujos de trabajo asistidos por IA para productos complejos.",
      perspective:
        "La antropología me enseñó a entender el comportamiento. El diseño me dio las herramientas para crear experiencias que encajen con él.",
    },
  };

export const PLACE: Bilingual<string> = {
  en: "Born and raised in DC, based in Madrid",
  es: "Nacido y criado en DC, basado en Madrid",
};
