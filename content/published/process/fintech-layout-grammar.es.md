---
title: "Igual pero distinto: una gramática de layout para fintech densa"
pillar: process
status: published
created: 2026-06-08
lang: es
mirror_of: fintech-layout-grammar
tags: [design-systems, fintech, layout-patterns, wealth-manager, wealth-planner, coherence]
---

# Igual pero distinto: una gramática de layout para fintech densa

Soy el único diseñador de Afi, una consultora fintech. Dos de nuestros productos, **Wealth Manager** y **Wealth Planner**, sirven al mismo tipo de usuario: un asesor financiero, portátil delante, que se pasa el día entre pantallas densas de tablas, gráficos y configuradores. El contenido es denso. Pero la sensación de densidad no viene del contenido. Viene de todo lo que hay alrededor.

Cada página de **Wealth Planner** tenía su propia cabecera. Sus acciones en un sitio distinto. Su propia manera de partir el cuerpo en secciones. Unas páginas tenían pestañas; otras apilaban un segundo título bajo el primero. Unas ponían los filtros encima de la tabla; otras, debajo. El mismo producto, quince versiones del mismo armazón.

Ahí está la trampa de los productos densos. El cuerpo de todas las pantallas se parece: cabecera y, debajo, *algo*. Así que das por bueno el armazón y vuelcas toda la atención en la tabla o en el gráfico. Llega la iteración 14. Una acción nueva tiene que ir a algún sitio. No tienes claro a cuál. La pones al lado de la última que añadiste. Un mes después nadie sabe dónde buscarla.

No había nada definido. Teníamos esbozos: el documento *Cambios de Wealth Planner en 2026*, las sesiones de trabajo semanales con Oscar y Manu, el hilo abierto en el Figma de *Coherence Wealth Planner*. Pero no una gramática. Así que escribí una.

## Los cuatro niveles

La columna vertebral es una sola regla: cada pieza de la interfaz vive en exactamente uno de cuatro niveles. Nombrar los niveles es la mitad del trabajo. La otra mitad es exigir que cada cosa esté donde le toca.

### Global

![Nivel global: logo y migas de pan a la izquierda, grupo de acciones intercambiable a la derecha, barra lateral con ICP y Nivel de Riesgo](/fintech-layout-grammar/01-global.svg)

La parte alta de la plataforma. Logo y migas de pan a la izquierda, buscador en el centro, acciones globales en el extremo derecho. La barra lateral guarda la configuración que condiciona *todas* las pantallas: en **Wealth Manager**, cosas como el *ICP*; en **Wealth Planner**, el *Nivel de Riesgo*. No son acciones de página. Tampoco son «ajustes». Son entradas que cambian cómo se lee la plataforma entera.

Lo global vive en la barra lateral porque no pertenece a ninguna página en concreto. Si hay tres páginas distintas que consultan el mismo valor, es global. El grupo de acciones de la derecha ocupa el mismo hueco en todas las pantallas, pero su contenido puede variar según el contexto del producto. Es la única parte del nivel global que admite variación.

### Página

![Nivel de página: maqueta a página completa con el armazón global atenuado arriba, cabecera de página con acciones en línea, fila de pestañas debajo y un hueco de contenido que alterna entre una tabla ancha, una tabla estrecha, un gráfico de líneas y un gráfico de dos puntos](/fintech-layout-grammar/02-page-header.svg)

Bajo el armazón global va la cabecera de página. Título de la página a la izquierda y, en la misma línea, las acciones de página a la derecha. **En línea, no apiladas.** La primera versión apilaba las acciones bajo el título. Parecía que había dos cabeceras, y todo el que la revisaba preguntaba «¿cuál de las dos es la página?».

La lección que sacamos con Oscar y Manu: si te ves echando mano de un segundo título para desambiguar, echa mano de pestañas. Dos páginas que se titularían «Wealth Planner: Resumen» y «Wealth Planner: *Situación actual*» no son dos páginas. Son una página con dos pestañas.

Bajo la cabecera de página va la fila de pestañas. Las pestañas llevan sus propias acciones igual que las páginas: las acciones de pestaña van en línea con la etiqueta de la pestaña activa y su alcance se limita a esa pestaña. El corolario es que una pestaña no es más que una página pequeña. Las reglas del nivel de pestaña son las del nivel de página, un peldaño más abajo.

Bajo la fila de pestañas va el cuerpo, y el cuerpo admite la forma que pida el trabajo: una tabla ancha de diez columnas, una estrecha de cuatro, un solo gráfico de líneas, un gráfico de dos puntos, un formulario. El armazón exterior no se mueve nunca. El hueco acepta cualquier cosa; el armazón no se dobla para encajarla.

### Sección

![Nivel de sección: dos variantes apiladas. A la izquierda, una página con H2 y tres subsecciones H3, como Situación actual. A la derecha, una página con solo el H1 y una única tabla, sin H2](/fintech-layout-grammar/03-section.svg)

Aquí es donde se pone interesante. Una sección es un trozo del cuerpo de la página. A veces una página tiene una. A veces tiene cinco. La gramática tiene que resolver ambos casos sin inventar un patrón nuevo para cada uno.

*Situación actual*, en **Wealth Planner**, tiene subsecciones: un bloque de resumen, luego un desglose por categoría, luego una comparativa. Cada una se gana un H3 bajo un único H2 («*Situación actual*»). Una página de gráfico es lo contrario: una sección, un gráfico y ningún H2, porque no hay nada que desambiguar. La cabecera de página ya es la sección.

La regla: un H2 solo se gana su hueco cuando la página tiene más de una sección. Si no, la cabecera de página hace de cabecera de sección. La primera vez que escribí esta regla me pareció que estaba siendo permisivo. Es al revés: es la versión estricta. Un H2 flotante en una página de una sola sección es consistencia inventada, y la consistencia inventada es ruido.

### Contenido

![Nivel de contenido: fila de pestañas con la pestaña activa resaltada, una fila de filtros tipo píldora debajo y, a continuación, la tabla. Una segunda pestaña muestra otra fila de filtros](/fintech-layout-grammar/04-content-filters.svg)

El nivel más bajo. Tablas, gráficos, formularios: aquello para lo que existe la página. Los filtros están aquí, con alcance limitado a la pestaña bajo la que están. Al cambiar de pestaña, cambia la fila de filtros. La cabecera de página no filtra. Las pestañas filtran el contenido; el contenido se filtra a sí mismo.

Las columnas de una tabla también pertenecen al nivel de contenido, y varían muchísimo. *Situación actual*, en **Wealth Planner**, tiene un desglose de diez columnas; una vista comparativa tiene cuatro; una tabla de posiciones, seis. La misma forma de trabajo con anchuras distintas. El armazón que hay encima de todas ellas es idéntico, y por eso el usuario sabe que sigue en el mismo producto.

## Las reglas que hago cumplir

Los nombres te dan un vocabulario. Las reglas te dan un sitio donde poner cada cosa nueva sin pensarlo dos veces.

- **Un H1 por página, siempre la cabecera de página.** Las acciones de página, en línea con él. Si quieres un segundo título, lo que quieres son pestañas.
- **Las pestañas sustituyen a la repetición de títulos.** Si dos rutas comparten título salvo por un sustantivo añadido al final, son pestañas. No son dos páginas.
- **Las secciones solo se ganan un H2 cuando hay más de una.** Una página de una sola sección es H1 + contenido, sin más. Nada de un H2 flotante para que el layout sea «consistente» con las páginas de varias secciones: eso es consistencia inventada, no coherencia real.
- **Los filtros actúan hacia abajo, nunca hacia arriba.** Los filtros de pestaña no llegan al armazón de la página. Las acciones de página no llegan a la barra global. Las flechas solo apuntan hacia dentro.
- **La configuración global nunca aparece entre las acciones de página.** El *ICP* y el *Nivel de Riesgo* pertenecen a la plataforma, no a la pantalla. Si están en la cabecera de página, has cambiado lo que significan.

Son reglas cortas y no párrafos por una razón: tienen que caber en la cabeza de un programador que está montando una pantalla nueva a las cuatro de la tarde de un jueves. *¿Dónde va esta acción?* se responde en una frase.

## Lo que se rompió y me enseñó cada regla

No me senté a diseñar la gramática de una tirada. Cada regla salió de una pantalla que no funcionaba, casi siempre señalada por uno de los desarrolladores principales mientras la montaba.

La regla de la cabecera de página salió de rehacer *Situación actual* en **Wealth Planner**. La página tenía un título, luego una subcabecera, luego una fila de pestañas, luego un título de sección: cuatro piezas de armazón apiladas antes de que apareciera contenido de verdad. Manu abrió la página un martes y preguntó cuál de las líneas era la página. No era capaz de adivinarlo. En ese momento las «acciones apiladas» pasaron a ser «acciones en línea» y la subcabecera se convirtió en una pestaña.

La regla de dónde van las acciones tiene su propia historia. Las acciones de página vivían *debajo* de la fila de pestañas, entre las pestañas y el cuerpo. En las maquetas quedaba limpio. En la práctica, hacía que las acciones se leyeran como de pestaña cuando eran de página, y los desarrolladores las conectaban siempre al handler equivocado. Subirlas a la cabecera de página, en línea con el título, dejó claro el alcance sin que nadie tuviera que pensarlo. La regla salió de arreglar un bug que no parábamos de reintroducir.

La regla de que las pestañas sustituyen a los títulos salió de un par de pantallas duplicadas que aguantó un mes sin que nadie se diera cuenta. Dos páginas, armazón casi idéntico, y solo cambiaba el hueco de contenido de debajo. Estuvimos a punto de añadir una tercera. Oscar señaló que habían sido pestañas desde el principio: habíamos construido tres páginas porque el andamiaje de rutas tenía forma de página, no de pestaña. El arreglo fue estructural: una ruta, tres pestañas y una fila de filtros que cambia con la pestaña.

La regla de las secciones solo en plural salió de una página de gráfico en la que yo había puesto un H2 que decía «Resumen» porque las páginas de varias secciones tenían H2. El H2 no le decía al lector nada que la cabecera de página no dijera ya. La cabecera de página *era* «Resumen». Al quitar el H2, la página ganó altura, el gráfico tuvo más sitio y no faltaba nada, porque nunca había habido nada.

No he terminado de encontrar reglas. Sigue abierta la pregunta de dónde encajan las anotaciones: cuando un analista deja un comentario en una sección, ¿el comentario es parte de la sección o de la página? Estoy esperando a ver por dónde se rompe.

## Cómo lo consume un programador

El trabajo de la gramática es responder preguntas en una frase. Un desarrollador que está montando una pantalla no debería leerse este artículo. Debería leerse las reglas.

- *¿Dónde va esta acción?* Si cambia una sola pantalla, acciones de página. Si cambia una sola pestaña, fila de pestañas. Si cambia toda la plataforma, barra global.
- *¿Esta página debería tener pestañas?* Si dos páginas comparten título salvo por un sustantivo añadido al final, sí.
- *¿Esta sección debería tener un H2?* Si la página tiene más de una sección, sí. Si no, no.
- *¿Dónde van los filtros?* Bajo la pestaña a la que pertenecen. Nunca en la página.

Cada hueco tiene nombre: `page-header`, `page-actions`, `tab-row`, `section-h2`, `tab-filters`, `global-rail`. Los nombres coinciden entre Figma y el código. Cuando los nombres coinciden, «esto chirría» deja de ser una sensación y pasa a ser una comprobación. *Esa acción no debería estar en `page-actions`; su sitio es `global-rail`.* La coherencia se puede exigir cuando hay un hueco correcto al que señalar.

## Lo que le diría al siguiente diseñador que entre en un producto denso

- **Nombra los niveles antes que los componentes.** Un botón es un botón. *Dónde* va el botón es el sistema. El nivel en el que está decide lo que significa.
- **Resiste la consistencia inventada.** Un H2 flotante en una página de una sola sección parece consistencia en la superficie. Es ruido. La consistencia real es que las páginas de una sección tienen una forma, las de varias tienen otra, y las dos son predecibles.
- **Escribe las reglas para que un programador pueda citarlas.** «Un H1 por página» gana a «las cabeceras deben ser jerárquicas». Una regla que un desarrollador puede entregar vale por diez principios que tiene que interpretar.
- **Vigila el armazón, que se va colando sin avisar.** Los productos densos no fallan porque la tabla sea mala. Fallan porque cada página atornilla encima una fila más de armazón y nadie lleva la cuenta.

La gramática no está terminada. Pestañas y secciones son estables; anotaciones, modales y configuración en línea siguen sin decidirse. La columna vertebral (global, página, sección, contenido) ha aguantado en **Wealth Manager** y en **Wealth Planner**. El mismo esqueleto, distinto contenido. Es la única clase de coherencia que merece la pena defender.

---

*¿Trabajas en un producto denso que ha ido a la deriva? [Escríbeme](mailto:richardgrinerdesigns@gmail.com). Siempre me apetece hablar de patrones de layout y de gramática de sistemas de diseño.*
