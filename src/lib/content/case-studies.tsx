import type { Bilingual } from "@/lib/i18n";

export type BentoCard = {
  label: Bilingual<string>;
  sublabel: Bilingual<string>;
  span?: "wide" | "tall";
  animation:
    | "layers"
    | "swap"
    | "nodes"
    | "moodboard"
    | "code-to-site"
    | "pulse"
    | "palette"
    | "rules"
    | "cursor"
    | "canvas"
    | "guideline"
    | "wordpress"
    | "logo-identity"
    | "journey-scene"
    | "affirmation-morph"
    | "organic-bundle"
    | "user-feedback"
    | "audience-pivot"
    | "hours-stat"
    | "leads-funnel"
    | "model-iteration"
    | "asset-portal";
};

export type CaseStudy = {
  tagline: Bilingual<string>;
  intro: Bilingual<string>;
  role: Bilingual<string>;
  contributions: Bilingual<string[]>;
  bento: BentoCard[];
  confidential?: Bilingual<string>;
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "afi-design-system": {
    confidential: {
      en: "Designs are not shown due to client confidentiality.",
      es: "Los diseños no se muestran por confidencialidad del cliente.",
    },
    tagline: {
      en: "Building design infrastructure for a fintech consultancy",
      es: "Construyendo la infraestructura de diseño para una consultora fintech",
    },
    intro: {
      en: "A design team of one, a high project rate, and never enough time to stop and organize. AFI ships white-labeled fintech products for banks and financial institutions — each surface has to feel consistent with the shared system but distinct for the client, which means we're remaking the same product over and over, one brand at a time. The result: scattered docs, inconsistent patterns across clients, and no rulebook keeping the system honest. I came in to change that — architecting a custom token system in Figma, building a unified platform with AI-assisted white-labeling and handoff workflows, and writing internal docs so the whole team can finally move together. The upside of constant remakes: every new client is another pass to sharpen the system. AI is what lets us take every one.",
      es: "Un equipo de diseño de una sola persona, un ritmo de proyectos alto y nunca tiempo suficiente para parar y ordenar. AFI lanza productos fintech white-label para bancos e instituciones financieras — cada superficie tiene que sentirse consistente con el sistema compartido pero distinta para el cliente, lo que significa que rehacemos el mismo producto una y otra vez, una marca tras otra. El resultado: documentación dispersa, patrones inconsistentes entre clientes y ningún manual de reglas que mantenga honesto al sistema. Entré para cambiar eso — arquitectando un sistema de tokens a medida en Figma, construyendo una plataforma unificada con white-labeling asistido por IA y flujos de entrega, y escribiendo la documentación interna para que todo el equipo pueda por fin avanzar a la vez. La ventaja de rehacer constantemente: cada nuevo cliente es otra pasada para afinar el sistema. La IA es lo que nos permite aprovechar todas.",
    },
    role: {
      en: "Design Systems Lead",
      es: "Líder de sistemas de diseño",
    },
    contributions: {
      en: [
        "Design systems",
        "Token architecture",
        "Component library",
        "AI tooling",
        "White-label strategy",
      ],
      es: [
        "Sistemas de diseño",
        "Arquitectura de tokens",
        "Librería de componentes",
        "Herramientas de IA",
        "Estrategia white-label",
      ],
    },
    bento: [
      {
        label: {
          en: "Unified Design Platform",
          es: "Plataforma de diseño unificada",
        },
        sublabel: {
          en: "Files, agents, and people — converging in one repo.",
          es: "Archivos, agentes y personas — convergiendo en un solo repositorio.",
        },
        animation: "nodes",
        span: "tall",
      },
      {
        label: {
          en: "Token Architecture",
          es: "Arquitectura de tokens",
        },
        sublabel: {
          en: "Primitive → semantic → component",
          es: "Primitivo → semántico → componente",
        },
        animation: "layers",
        span: "wide",
      },
      {
        label: {
          en: "Tokens → Brand → Product",
          es: "Tokens → Marca → Producto",
        },
        sublabel: {
          en: "The white-label pipeline: one system, any client. AI moves it faster every cycle.",
          es: "El pipeline white-label: un sistema, cualquier cliente. La IA lo acelera en cada ciclo.",
        },
        animation: "swap",
      },
      {
        label: {
          en: "White-label at Scale",
          es: "White-label a escala",
        },
        sublabel: {
          en: "One system, any brand — swap the tokens, ship the product.",
          es: "Un sistema, cualquier marca — intercambia los tokens, lanza el producto.",
        },
        animation: "palette",
      },
    ],
  },
  "story-architect": {
    tagline: {
      en: "Agency-quality design for a two-person brand consultancy",
      es: "Diseño de nivel de agencia para una consultora de marca de dos personas",
    },
    intro: {
      en: "Story Architect is a two-person brand consultancy in Canada — strong at tone of voice, zero visual infrastructure. They knew how to find the words; they didn't have someone to make it look like it cost what it did. I developed a visual strategy from their existing brand, used AI to build out the site with custom graphics and animations, then packaged it as a WordPress template so they could manage it themselves. A two-person shop with the design quality that used to require an agency.",
      es: "Story Architect es una consultora de marca de dos personas en Canadá — fuerte en tono de voz, infraestructura visual inexistente. Sabían encontrar las palabras; no tenían a nadie que hiciera que la imagen estuviera a la altura. Desarrollé una estrategia visual a partir de su marca existente, utilicé IA para construir la web con gráficos y animaciones a medida, y luego lo empaqueté como plantilla de WordPress para que pudieran gestionarla ellos mismos. Un estudio de dos personas con la calidad de diseño que antes requería una agencia.",
    },
    role: {
      en: "Freelance Designer",
      es: "Diseñador freelance",
    },
    contributions: {
      en: [
        "Visual strategy",
        "Web design",
        "Motion design",
        "WordPress development",
      ],
      es: [
        "Estrategia visual",
        "Diseño web",
        "Diseño de motion",
        "Desarrollo en WordPress",
      ],
    },
    bento: [
      {
        label: {
          en: "Visual Strategy",
          es: "Estrategia visual",
        },
        sublabel: {
          en: "From brand voice to visual language",
          es: "De la voz de marca al lenguaje visual",
        },
        animation: "moodboard",
        span: "wide",
      },
      {
        label: {
          en: "AI-Built Site",
          es: "Web construida con IA",
        },
        sublabel: {
          en: "Built fast, built right",
          es: "Construida rápido, construida bien",
        },
        animation: "code-to-site",
      },
      {
        label: {
          en: "Custom Animations",
          es: "Animaciones a medida",
        },
        sublabel: {
          en: "Motion that earns attention",
          es: "Movimiento que se gana la atención",
        },
        animation: "pulse",
      },
      {
        label: {
          en: "WordPress Template",
          es: "Plantilla de WordPress",
        },
        sublabel: {
          en: "Designed once, managed forever — no developer needed",
          es: "Diseñada una vez, gestionada para siempre — sin necesidad de desarrollador",
        },
        animation: "wordpress",
      },
    ],
  },
  kt360: {
    tagline: {
      en: "An AI environment built for a team that doesn't have a full design department",
      es: "Un entorno de IA construido para un equipo que no tiene un departamento de diseño completo",
    },
    intro: {
      en: "KT360 is an early-stage startup in a saturated AI market — so the brand strategy was to look nothing like AI. Playful, human, deliberately distinct. But the bigger challenge was operational: how does a small team stay on-brand when there's no designer in the room? The answer was to encode the brand into the environment itself. Design rules, component guidelines, and animation patterns all live as structured files — the kind of thing an AI can read, check against, and enforce. Agents review work before it ships. A shared system built on shadcn gives everyone a foundation to prototype and build from. The result: a marketer can write a blog post, a developer can add a new page, and the output looks like it came from the same hand — because the rules are doing the work.",
      es: "KT360 es una startup en fase inicial dentro de un mercado de IA saturado — así que la estrategia de marca fue no parecerse en nada a la IA. Juguetona, humana, deliberadamente distinta. Pero el reto mayor era operativo: ¿cómo mantiene un equipo pequeño la coherencia de marca cuando no hay diseñador en la sala? La respuesta fue codificar la marca en el propio entorno. Las reglas de diseño, las pautas de componentes y los patrones de animación viven como archivos estructurados — el tipo de cosa que una IA puede leer, comprobar y hacer cumplir. Los agentes revisan el trabajo antes de que salga. Un sistema compartido construido sobre shadcn da a todos una base para prototipar y construir. El resultado: una persona de marketing puede escribir un artículo, un desarrollador puede añadir una página nueva, y el resultado parece salido de la misma mano — porque las reglas están haciendo el trabajo.",
    },
    role: {
      en: "Freelance Designer & AI Builder",
      es: "Diseñador freelance y constructor de IA",
    },
    contributions: {
      en: [
        "Brand strategy",
        "Visual identity",
        "Design systems",
        "AI environment design",
        "Prototype infrastructure",
      ],
      es: [
        "Estrategia de marca",
        "Identidad visual",
        "Sistemas de diseño",
        "Diseño de entorno de IA",
        "Infraestructura de prototipado",
      ],
    },
    bento: [
      {
        label: {
          en: "Visual Identity",
          es: "Identidad visual",
        },
        sublabel: {
          en: "Playful and human — deliberately nothing like AI",
          es: "Juguetona y humana — deliberadamente nada parecida a la IA",
        },
        animation: "logo-identity",
      },
      {
        label: {
          en: "Rules as Files",
          es: "Reglas como archivos",
        },
        sublabel: {
          en: "Brand guidelines, component specs, and animation patterns written so AI can read and enforce them",
          es: "Pautas de marca, especificaciones de componentes y patrones de animación escritos para que la IA pueda leerlos y hacerlos cumplir",
        },
        animation: "rules",
      },
      {
        label: {
          en: "Shared Prototype Environment",
          es: "Entorno de prototipado compartido",
        },
        sublabel: {
          en: "One codebase the whole team can open, experiment in, and ship from",
          es: "Un único código base que todo el equipo puede abrir, experimentar y desde el que lanzar",
        },
        animation: "canvas",
      },
      {
        label: {
          en: "Design System Foundation",
          es: "Base del sistema de diseño",
        },
        sublabel: {
          en: "Tokens, typography, and components everyone builds on top of",
          es: "Tokens, tipografía y componentes sobre los que todos construyen",
        },
        animation: "guideline",
      },
      {
        label: {
          en: "Transparent Asset Portal",
          es: "Portal de recursos transparente",
        },
        sublabel: {
          en: "104 assets across 4 color variants, 3 categories, and 2 formats — so a marketer can grab the right logo without opening Figma.",
          es: "104 recursos entre 4 variantes de color, 3 categorías y 2 formatos — para que alguien de marketing pueda coger el logo correcto sin abrir Figma.",
        },
        animation: "asset-portal",
        span: "wide",
      },
    ],
  },
  "audemic-growth": {
    tagline: {
      en: "Pivoting a B2C research app to B2B enterprise",
      es: "Pivotando una app de investigación B2C hacia B2B enterprise",
    },
    intro: {
      en: "Audemic Scholar had built a loyal B2C user base at $8K/month — but students graduate, and investors were right to worry about where growth was coming from. We ran discovery interviews with UN analysts and vaccine researchers and found a bigger story: researchers lose 20 hours a month to information retrieval, costing organizations like NIH close to $10M monthly. We launched a Beta — a 24/7 junior analyst powered by AI — and captured 20 qualified leads in a single week through paid ads. From there, iteration: better summaries on OpenAI and Claude, an audio redesign built around how researchers actually work, and a prioritization framework that kept the roadmap honest.",
      es: "Audemic Scholar había construido una base de usuarios B2C fiel en torno a los 8 K $/mes — pero los estudiantes se gradúan, y los inversores hacían bien en preocuparse por de dónde vendría el crecimiento. Realizamos entrevistas de descubrimiento con analistas de la ONU e investigadores de vacunas y encontramos una historia mayor: los investigadores pierden 20 horas al mes en recuperar información, lo que cuesta a organizaciones como el NIH cerca de 10 M $ mensuales. Lanzamos una beta — un analista junior 24/7 impulsado por IA — y captamos 20 leads cualificados en una sola semana con anuncios de pago. A partir de ahí, iteración: mejores resúmenes en OpenAI y Claude, un rediseño del audio construido alrededor de cómo trabajan realmente los investigadores, y un marco de priorización que mantuvo honesta la hoja de ruta.",
    },
    role: {
      en: "Product Manager & UX Designer",
      es: "Product manager y diseñador UX",
    },
    contributions: {
      en: [
        "Product strategy",
        "User research",
        "AI prompting",
        "Growth experiments",
        "Prototype design",
      ],
      es: [
        "Estrategia de producto",
        "Investigación con usuarios",
        "Prompting de IA",
        "Experimentos de crecimiento",
        "Diseño de prototipos",
      ],
    },
    bento: [
      {
        label: {
          en: "B2C → B2B Pivot",
          es: "Pivote de B2C a B2B",
        },
        sublabel: {
          en: "Students were the loyal base. Professionals were the market.",
          es: "Los estudiantes eran la base fiel. Los profesionales eran el mercado.",
        },
        animation: "audience-pivot",
        span: "wide",
      },
      {
        label: {
          en: "20 Hours Lost a Month",
          es: "20 horas perdidas al mes",
        },
        sublabel: {
          en: "Per researcher. ~$10M monthly for NIH-sized orgs.",
          es: "Por investigador. ~10 M $ mensuales para organizaciones del tamaño del NIH.",
        },
        animation: "hours-stat",
      },
      {
        label: {
          en: "20 Leads in 7 Days",
          es: "20 leads en 7 días",
        },
        sublabel: {
          en: "Paid ads validated the new direction in a week.",
          es: "Los anuncios de pago validaron la nueva dirección en una semana.",
        },
        animation: "leads-funnel",
      },
      {
        label: {
          en: "AI Summary Refinement",
          es: "Refinamiento de resúmenes con IA",
        },
        sublabel: {
          en: "Iterating between OpenAI and Claude models based on user feedback.",
          es: "Iterando entre los modelos de OpenAI y Claude a partir del feedback de los usuarios.",
        },
        animation: "model-iteration",
        span: "wide",
      },
    ],
  },
  mindfulme: {
    tagline: {
      en: "A mindfulness MVP that treats each journey as unique",
      es: "Un MVP de mindfulness que trata cada camino como único",
    },
    intro: {
      en: "Young professionals keep bouncing off mindfulness apps because every one of them looks and sounds the same — calming greens, a meditation library, a timer. Mindfulme hired me to design the MVP's brand and experience from scratch: no brand yet, two ready-to-code developers, and user feedback as the rawest input we had. The work started with listening, turned into a hand-crafted visual language of organic shapes and script affirmations, and shipped as a tight MVP that the two devs could build alongside the design. The throughline: a mindfulness practice that echoes the person, not the industry.",
      es: "Los jóvenes profesionales siguen rebotando de las apps de mindfulness porque todas tienen la misma imagen y el mismo tono — verdes calmantes, una biblioteca de meditaciones, un temporizador. Mindfulme me contrató para diseñar desde cero la marca y la experiencia del MVP: sin marca todavía, dos desarrolladores listos para escribir código y el feedback de los usuarios como el insumo más en bruto que teníamos. El trabajo empezó escuchando, se convirtió en un lenguaje visual hecho a mano con formas orgánicas y afirmaciones caligráficas, y se lanzó como un MVP ajustado que los dos desarrolladores podían construir en paralelo al diseño. El hilo conductor: una práctica de mindfulness que refleja a la persona, no a la industria.",
    },
    role: {
      en: "Freelance Designer & Product Lead",
      es: "Diseñador freelance y responsable de producto",
    },
    contributions: {
      en: ["Brand identity", "Product design", "User research", "MVP delivery"],
      es: [
        "Identidad de marca",
        "Diseño de producto",
        "Investigación con usuarios",
        "Entrega del MVP",
      ],
    },
    bento: [
      {
        label: {
          en: "Every Journey is Different",
          es: "Cada camino es distinto",
        },
        sublabel: {
          en: "A brand built around the idea that no two mindfulness paths look alike",
          es: "Una marca construida sobre la idea de que no hay dos caminos de mindfulness iguales",
        },
        animation: "journey-scene",
        span: "wide",
      },
      {
        label: {
          en: "Affirmations that Evolve",
          es: "Afirmaciones que evolucionan",
        },
        sublabel: {
          en: "Hand-lettered words that change with the user",
          es: "Palabras caligrafiadas a mano que cambian con el usuario",
        },
        animation: "affirmation-morph",
      },
      {
        label: {
          en: "Organic Visual Language",
          es: "Lenguaje visual orgánico",
        },
        sublabel: {
          en: "Hand-drawn shapes over sterile iconography",
          es: "Formas dibujadas a mano frente a iconografía estéril",
        },
        animation: "organic-bundle",
      },
      {
        label: {
          en: "User-led iteration",
          es: "Iteración guiada por usuarios",
        },
        sublabel: {
          en: "Designed alongside two developers and early users — shipped an MVP that reflected them",
          es: "Diseñado junto a dos desarrolladores y los primeros usuarios — lanzamos un MVP que los reflejaba",
        },
        animation: "user-feedback",
        span: "wide",
      },
    ],
  },
};
