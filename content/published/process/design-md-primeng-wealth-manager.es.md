---
title: "Escribir el manual que PrimeNG no trae de serie"
pillar: process
status: published
created: 2026-04-23
lang: es
mirror_of: design-md-primeng-wealth-manager
tags: [design-systems, tokens, primeng, design-md, ai-tools, fintech]
---

# Escribir el manual que PrimeNG no trae de serie

Soy el único diseñador de Afi, una consultora fintech. Uno de nuestros productos, **Wealth Manager**, es una plataforma B2B para asesores patrimoniales: densa en información, con tablas y formularios constantes, usada por gente de finanzas a la que le importa más la fidelidad de sus datos que el efecto sorpresa. El frontend es Angular sobre **PrimeNG**, una librería de componentes estándar.

Los equipos que usan una librería estándar suelen hacer una de estas dos cosas. O adoptan los valores por defecto tal cual, y el producto acaba pareciéndose a cualquier otra app hecha con PrimeNG. O la tematizan a fondo. Eso introduce deriva en el momento en que «tematizar» significa que un diseñador ajusta colores en Figma mientras el preset del código conserva sus valores por defecto.

Nosotros hacíamos lo segundo. Nadie había escrito las reglas.

Así que escribí un [design.md](https://getdesign.md): un archivo Markdown plano que codifica el sistema (tokens, reglas, uso de componentes, antipatrones) en un formato que tanto humanos como agentes de IA pueden leer como instrucciones. Lo dejas en el repositorio y cualquier agente de código (Claude, Cursor, Copilot) lo sigue al generar la interfaz. No es una librería de componentes. Es el manual que va *junto a* una.

La complicación con PrimeNG: su librería de Figma es mínima. Trae tokens a nivel de componente (colores de botón, tamaños de input) pero **ninguna capa de primitivos**: no hay escalas independientes de espaciado, radio o tamaño de fuente. Su sistema de color gira en torno a una rampa «surface» (usada tanto para texto como para fondos: de ahí el aspecto monocromo de las apps hechas con PrimeNG) y un único «primary» para las acciones. Tematizar PrimeNG implica inventarte tú las capas primitiva y semántica. Y como esa invención ocurre dentro de un archivo de Figma, rara vez vuelve al lado del código, que es justo donde empieza la deriva.

## Cómo lo hice con Claude

Lo trabajé con Claude durante un par de horas. No porque no pudiera escribirlo solo: hablarlo en voz alta sacó a la superficie decisiones que llevaba tiempo tomando de forma implícita.

Antes de escribir nada, miramos dos referencias: la documentación de tematización de PrimeNG y las convenciones de formato de [getdesign.md](https://getdesign.md). No para copiar ninguna de las dos, sino para no reinventar una convención que ya existía. Después Claude usó el MCP de Figma para extraer las definiciones de variables reales de nuestro archivo: no una suposición a partir de una captura, sino los nombres y valores de tokens de verdad. Tres niveles:

- **AFI Primitives** (87 variables): números, colores, fuentes.
- **Semantic numbers** (39 variables): alias como `spacing/md` que referencian primitivos.
- **AFI Custom Semantics** (22 variables): overrides de componentes de PrimeNG como `p-datatable/padding/normal`.

Esa estructura, de lo crudo a lo significativo a lo específico de cada componente, resultó ser la columna vertebral de todo el documento.

**Nivel 1: Primitivos.** Átomos en bruto. Un hexadecimal. Un número de píxeles. Una familia tipográfica. No tienen opinión sobre para qué sirven. `dimension-8` es simplemente el número 8.

**Nivel 2: Números semánticos.** Alias con significado. `spacing/md` *referencia* a `dimension-8`, pero ahora lleva intención: «este es el valor de espaciado medio». Quien busca un valor, sea diseñador o desarrollador, viene aquí, no a los primitivos.

**Nivel 3: AFI Custom Semantics.** Nivel de componente. `p-datatable/padding/normal` referencia a `spacing/lg`. Este nivel existe porque el Figma de PrimeNG no exponía esos huecos, así que cuando tematizaba la DataTable tuve que crear las variables yo mismo. Ahí vive el riesgo de deriva: si el preset del código no tiene también un `p-datatable/padding/normal` que apunte al mismo valor, Figma y el código discrepan en silencio.

Del nivel 3 esperaba lo peor. Cada semántico custom está hecho a mano en Figma, así que cada uno es un punto donde Figma y el preset del código pueden discrepar sin que nadie lo note. Cuando audité nuestras 22 variables, casi todas apuntaban limpiamente a un número semántico: menos deriva de la que había presupuestado. Aun así merece la pena revisarlas una a una, porque ahí es donde se esconde la deriva incluso cuando no salta a la vista.

Escribir el documento fue la auditoría. La primera pasada de Claude asignó las superficies a `grisafi`, nuestra paleta de grises de marca: plausible, pero incorrecto para un producto denso en datos. Los pasos de `grisafi` están demasiado juntos; una tabla de doce filas se lee como un borrón gris. Le señalé la rampa **Slate** de PrimeNG en su lugar: más contraste, más fácil de escanear. `grisafi` sigue en el sistema, pero para acentos (etiquetas, ilustraciones, gráficos), no para superficies. Cada afirmación de la IA sobre el sistema recibió el mismo trato: una hipótesis, contrastada con el panel de variables y corregida en el documento sobre la marcha.

La otra decisión fue el primario. PrimeNG usa un único hueco `primary` para el color de acción (botones, enlaces, estados con foco) y espera un solo color. Nuestra marca tiene dos azules, así que enruté `primary` a ambos: `AzulProfundo` (azul marino profundo) en modo claro y `azulafi` (azul brillante) en oscuro, con el cambio automático según el tema. El azul oscuro va en modo claro por accesibilidad: el `azulafi` brillante sobre blanco no pasa AA en texto pequeño. El brillante se gana el sitio en modo oscuro, donde las superficies oscuras le dan el contraste que necesita. Mismo rol, dos paletas; el modo elige la correcta.

Por eso el documento tampoco llama `primary` al rol. Lo llamo `AzulProfundo`. Si el documento dijera `primary` a secas, un agente de IA que leyera el archivo pegaría `azulafi` en un hueco de acción sin dudarlo, porque `primary` se desliza hacia «color principal de marca» en cualquier lectura razonable. Un compañero humano quizá se pararía a pensar; un agente de código no. Fijar la palabra a la paleta, `AzulProfundo`, elimina la ambigüedad en el único sitio donde importa: la fuente de verdad que la IA está leyendo.

Sobre la responsividad: esto no estaba en Figma. El equipo me había dicho al principio «no te preocupes por eso», y luego empezó a preocuparse. Para un producto patrimonial B2B, el soporte de móvil queda fuera de alcance; los asesores trabajan en portátiles y sobremesas. Nos comprometimos con tres puntos de ruptura (`md 768` tablet, `lg 1024` portátil, `xl 1440` sobremesa) y cinco reglas por superficie (tablas, navegación, formularios, rejillas de KPI, diálogos). Sin `sm` ni `2xl`: nombrarlos implicaría un soporte que no damos.

## Qué le diría a otro diseñador que trabaje con PrimeNG e IA

- **Empieza por el panel de variables, no por el lienzo.** El lienzo muestra lo que *hiciste*; las variables muestran lo que *decidiste*. Un diseño construido sobre «esta es la pantalla» se lee de forma completamente distinta a uno construido sobre «este es el sistema».
- **Tres niveles, siempre.** Primitivo → Semántico → Componente. PrimeNG te da el tercero; los dos primeros tienes que construirlos tú, y el documento existe para demostrar que los tres existen y concuerdan.
- **Nombra paletas, no roles.** «Primary» es ambiguo. El nombre de tu paleta no lo es, y los agentes de IA son quienes con más probabilidad se equivocarán si el nombre se queda en genérico.
- **Audita la primera pasada de la IA.** Un compañero de IA rellena los huecos con valores por defecto que suenan plausibles. Cada afirmación suya sobre tu sistema es una hipótesis: verifícala contra el panel de variables, no contra tu recuerdo de cómo funciona el sistema.
- **Escribe los antipatrones.** Una lista de prohibiciones suele ser más fácil de aplicar que una lista de recomendaciones. «No cambies el color primario a mano según el modo» es una regla más útil que «el color primario se enruta automáticamente».
- **Responsividad: elige el viewport mínimo que importa y descarta el resto.** Un producto B2B que nombra un punto de ruptura de móvil está a punto de cargar con expectativas de soporte móvil que nadie firmó.

---

*¿Trabajas en algo parecido? [Escríbeme](mailto:richardgrinerdesigns@gmail.com). Siempre me apetece hablar de sistemas de diseño o de herramientas de IA.*
