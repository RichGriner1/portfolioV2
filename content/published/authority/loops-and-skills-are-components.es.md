---
title: "Crear skills de IA que aceleran las tareas rutinarias y mantienen la documentación al día"
pillar: authority
status: published
created: 2026-07-07
published_at: 2026-07-08
lang: es
mirror_of: loops-and-skills-are-components
tags: [ai-tools, claude-code, context-engineering, design-systems, workflow]
seed: journal/2026-07-07-loops-vs-skills-claude-library.md
---

# Crear skills de IA que aceleran las tareas rutinarias y mantienen la documentación al día

Le pregunté a ChatGPT cómo organizar una biblioteca de loops y skills de IA reutilizables para Claude Code. Me devolvió una estructura de carpetas con un directorio `loops/` arriba del todo. Parecía razonable.

También estaba mal. Fue la primera idea que probé y falló, pero resultó un buen punto de partida, porque el error es el habitual: la gente da por hecho que los «loops» son archivos concretos, como las skills. No lo son.

## Por qué quería esto

Escribía las mismas instrucciones una y otra vez. «Audita esto contra mi sistema de diseño». «Comprueba que este texto es claro de verdad, no solo que pasa el filtro de voz». El mismo prompt, reconstruido de memoria.

Un componente le da a un archivo de diseño algo que se construye una vez y se referencia en todas partes: un único sitio donde arreglarlo. Quería lo mismo para mi forma de trabajar con IA: una pequeña biblioteca de piezas con nombre, documentadas y reutilizables, en lugar de prompts sueltos que tarde o temprano acabaría perdiendo.

## Qué es un loop y qué es una skill

Dos piezas distintas, con dos trabajos distintos.

Una **skill es conocimiento.** Un documento o una carpeta con reglas, estándares y ejemplos: mis principios de diseño, mis reglas de voz y mi lista de revisión de código son cada uno una skill.

Un **loop es un proceso**: una serie de pasos que los agentes deben seguir. Un loop se arranca escribiendo un comando corto, como `/ds-cleanup`. Al ejecutarse, abre las skills que necesite, recorre sus pasos y se detiene en una línea de meta clara.

**El loop es el operario; las skills son los manuales que abre mientras trabaja.**

```figure
loop-vs-skill
```

## Sirve en cualquier sitio, no solo en este repo

Lo que no sabía al empezar: Claude Code lee de dos sitios, el proyecto en el que estás (`.claude/` dentro de ese repo) y tu propia máquina (`~/.claude/`, tu directorio de usuario). Todo lo que haya en esa carpeta de tu máquina está disponible en *todos* los proyectos que abras, no solo en el que se escribió.

Eso me dio el modelo que buscaba. Lo escribo todo en el repo de mi portfolio, el único sitio que mantengo como fuente de verdad, dentro de una carpeta neutra, `.claude/lib/`, que Claude no carga automáticamente. Después, un pequeño script de sincronización crea un enlace simbólico de cada skill y cada loop en `~/.claude/`. (Un enlace simbólico es un puntero vivo, no una copia. Sigue siendo un único archivo, en dos sitios a la vez.) Edito una sola vez, en la base, y el cambio está vivo en todas partes: mi portfolio, nuestro producto en Angular en Afi, otros proyectos freelance. Con un solo comando se reinstala todo en una máquina nueva.

Eso solo funciona si el loop no da por hecho que todos los proyectos están construidos igual. Mi portfolio, por ejemplo, es React. Pero el mismo loop tiene que correr también en un proyecto Angular, y hasta dos proyectos Angular pueden estar montados de forma completamente distinta: otro sistema de estilos, otras piezas base. Así que el loop no puede tener escrito de antemano qué aspecto tiene un proyecto. Cada vez que se ejecuta tiene que *mirar* el proyecto que tiene delante (qué framework, qué sistema de estilos, qué componentes) y adaptarse a lo que encuentre. Detectar, no dar por hecho.

```figure
use-anywhere
```

## Probarlo de verdad: la tabla que costó 100k tokens

Para empezar solo publiqué dos loops, `/ds-cleanup` y `/content-review`. Tengo una hoja de ruta con diez más, pero quería demostrar que la idea funcionaba con dos antes de construir nada más.

`/ds-cleanup` fue el primer loop. Como cualquier primera versión, sobre el papel parecía más limpio de lo que luego funcionó en la práctica.

Lo lancé sobre una página real de un producto de gestión patrimonial en Angular, un framework distinto de aquel en el que nació el loop. Quería ver si la corrección de «detectar, no dar por hecho» funcionaba.

El loop es el orquestador de dos ayudantes: un *revisor* que audita el código y lista lo que está roto, y un *corrector* que aplica los cambios. El revisor funcionó: leyó bien el proyecto como Angular, encontró la librería de componentes correcta y señaló problemas reales.

Después lancé la corrección sobre esa única tabla. La ejecución se comió unos 102.000 tokens, casi todos del revisor.

```figure
orchestrator
```

Mi primer instinto estaba equivocado: «se ha quedado dando vueltas, necesito un tope fijo de tokens». Así que le pregunté a Claude directamente si podía poner algo parecido al límite de 3 dólares que tienen algunas herramientas de investigación con IA. La respuesta fue no. Un tope de gasto que se detiene solo a mitad de ejecución es una funcionalidad propia de un **workflow**: un sistema más pesado y autocontenido que lleva la cuenta de su propio presupuesto de tokens mientras trabaja y puede pararse a sí mismo. Un loop es un guion de instrucciones que Claude sigue de principio a fin. No tiene ningún contador que vigilar. Así que la solución no podía ser «añade un tope». Tenía que ser estructural: un alcance más pequeño, menos pasos opcionales y una fase de corrección que se detiene tras una sola pasada acotada en vez de seguir hasta «terminar».

## Por qué salió caro: dos contadores, no uno

Sabía que los tokens cuestan dinero. Lo que no había tenido en cuenta es que el orquestador relee la conversación principal entera en cada turno, así que todo lo que se queda aparcado ahí se factura una y otra vez. La solución no era vigilar más de cerca el gasto, sino reducir al mínimo lo que se queda en ese hilo.

Hay dos contadores distintos, y yo los estaba leyendo como uno:

- **Dinero gastado.** Los tokens que quema un subagente son reales y se facturan. Cuando el revisor usó 102.000 tokens, ese coste se pagó de verdad.
- **Ventana de contexto.** Lo llena que está la conversación *principal*: lo que Claude relee completo, en cada mensaje, durante el resto de la sesión.

Un **subagente** es una instancia separada de Claude a la que delegas una tarea: el revisor y el corrector son cada uno un subagente. Trabaja en su propia habitación: lee archivos, piensa, hace el trabajo, y nada de eso entra en tu conversación principal. Cuando termina, solo vuelve su informe breve, normalmente de una página.

Esa distinción lo es todo, por cómo funciona la conversación principal: Claude la relee *entera* con cada mensaje que envías. Todo lo que esté en ese contexto principal se paga otra vez, en cada turno, durante el resto de la sesión. El coste se acumula. Los 102.000 tokens de un subagente, en cambio, se gastan una vez y desaparecen: nunca se releen, nunca se vuelven a facturar.

La analogía con la que por fin lo entendí: contratas a alguien para que se lea una pila de 500 páginas en otra habitación y te devuelva una sola. Esa lectura la pagas una vez. En tu mesa solo hay esa página. El error caro es volcar las 500 páginas en tu *propia* mesa. Ahora las revuelves en cada tarea, y la mesa (la ventana de contexto) acaba llena y ya no cabe nada nuevo.

Así que los 102k del revisor, gastados en su habitación, no costaron nada más allá de esa ejecución. El daño real lo hizo el orquestador al hinchar el hilo principal, la conversación en curso, por su cuenta y de tres maneras:

- **Releer código fuente que el revisor ya había resumido**: unas 1.500 líneas (un solo archivo tenía 536) para escribir desde cero una especificación de build que no necesitaba.
- **Volcar los logs completos de la build en el contexto**: cientos de avisos de deprecación de Sass idénticos, entre 8.000 y 12.000 tokens de puro ruido.
- **Escribir un prompt de 200 líneas para el corrector**: tan largo *solo porque* acababa de releerlo todo él mismo.

La unidad que te cuesta no es el total de tokens quemados en cualquier punto de la ejecución. Es lo que se queda en el hilo principal, porque esa es la parte que se relee y se vuelve a facturar en cada turno posterior.

## Qué cambió

Con el diagnóstico correcto, los arreglos siguieron una sola regla: mantener el loop ligero. Un trabajo, pocos pasos: un loop atiborrado de instrucciones solo consigue que la IA pierda el hilo.

- **Auditar por defecto; corregir es opcional y acotado.** `--fix` hace una pasada y se detiene. Si quieres más, lo vuelves a lanzar. No itera por su cuenta.
- **La build también es opcional**, detrás de `--verify`: ejecutarla era el mayor sumidero de tokens con diferencia, así que nunca corre si no lo pides.
- **La iteración tiene tope.** `--deep` repite la pasada de corrección, pero nunca más de dos rondas, así que ni siquiera la vía profunda puede desbocarse.
- **Las skills se cargan bajo demanda.** El revisor cargaba unos diez archivos de reglas en cada ejecución. Ahora carga siempre las comprobaciones básicas y solo tira de los principios de criterio cuando aparece una decisión que lo requiere.
- **El informe del revisor es autosuficiente**: hallazgos, la superficie de la API, el objetivo de la corrección. El orquestador actúa sobre ese informe y nunca relee el código fuente. La lectura a fondo, cuando hace falta, se delega hacia abajo, al corrector.
- **Los logs se filtran a errores**, no se vuelcan enteros.
- **El loop detecta el corrector propio del repo** en vez de dar por hecho un nombre de herramienta: mi portfolio tiene `code-writer`, otro proyecto tiene `builder`. La portabilidad vive en detalles como este.

```figure
bounded-loop
```

## Un modelo más barato, a propósito, pero no a ciegas

Los tokens de un subagente no se acumulan como los del hilo principal. Pero gastar una vez sigue siendo gastar, así que importa qué modelo ejecuta esos subagentes. Las partes del loop que revisan y corrigen corren sobre **Sonnet**, un modelo de Claude más rápido y más barato, en lugar de **Opus**, el más capaz y el más caro.

Hay un argumento serio en contra: un modelo más barato se equivoca más, así que gastas tokens extra en cazar los errores y repetir, mientras que un modelo más potente acierta en menos intentos, y *menos intentos pueden significar menos tokens en total.* Mejor modelo, menos idas y venidas, más barato al final. Para problemas difíciles y abiertos suele ser cierto, y ahí tirar del modelo barato es un falso ahorro.

Pero depende del trabajo. El revisor no está razonando en abierto: está cotejando un archivo con un reglamento explícito y listando lo que se salta las reglas. Es una tarea estrecha y bien definida, y comprobé que Sonnet la hace de forma fiable antes de apostar por él. Cuando el trabajo es «compara esto con estas reglas», el modelo barato acierta a la primera, así que la trampa de la revisión extra nunca salta. Reserva el modelo caro para el razonamiento abierto; no pagues tarifas de Opus por producir una lista de comprobación.

## La prueba de que funcionó

Volví a ejecutarlo todo sobre otra tabla, en una sesión nueva, una *conversación* nueva, mismo repo, misma rama de git, para deshinchar el contexto y recortar el alcance.

Esta vez, cuando dejé la ruta del archivo en blanco, preguntó qué tabla en vez de adivinar. La corrección se mantuvo acotada: unos 44.000 tokens tras la auditoría, unos 70.000 tras la corrección, frente a los 102.000 que antes costó solo la corrección. Luego se detuvo por sí solo. Los hallazgos de Sonnet fueron concretos: un bloque `@media` muerto, un import sin usar, una regla SCSS huérfana, un comentario obsoleto, cada uno con su archivo y su número de línea.

```figure
token-cost
```

También trazó una línea que yo no le había pedido trazar. Encontró código sobrante de un antiguo *layout* móvil (filas que antes se plegaban en tarjetas apiladas en el teléfono), pero ese *layout* ya no se usaba, así que el código era peso muerto, ahí sin hacer nada. Borrar código que nadie usa es seguro y mecánico, así que lo eliminó. Pero reconstruir ese *layout* móvil habría sido una decisión de diseño real, no una limpieza, así que, en vez de decidir por mí, lo señaló y dejó la decisión en mis manos.

Después lancé `--verify`. Detectó el comando de build del proyecto, lo ejecutó y filtró el log a solo errores: justo la corrección que acabábamos de añadir, funcionando ahora sobre la propia herramienta. También atribuyó correctamente el único aviso que quedaba a una página anterior sin relación, en vez de culpar al cambio que acababa de hacer. Listo para el commit.

La herramienta que provocó el derroche del volcado de logs ahora lo evita por defecto. Aplicó su propia lección antes de que tuviera que recordársela.

La conclusión no es «la IA puede auditar un sistema de diseño». Es esta: un loop solo merece construirse si entiendes cómo funciona el agente. Eso es lo que te permite ajustarlo. Los dos contadores son la prueba. Cuando entendí que el hilo principal se relee en cada turno, los arreglos dejaron de ser conjeturas: auditar por defecto, una pasada acotada, skills que se cargan bajo demanda. Construí el mío como un componente: una cosa, definida una vez, referenciada en todas partes. Entender el agente es lo que me permitió acertar con esa forma.
