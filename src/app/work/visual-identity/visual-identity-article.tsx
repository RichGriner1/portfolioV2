"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { pick, t, useLang, type Bilingual } from "@/lib/i18n";

import {
  ComponentsDemoFigure,
  HandoffTimelineFigure,
  MicroInteractionsDemoFigure,
  MoodboardGalleryFigure,
  TypeTestFigure,
} from "./_figures";

/**
 * A mirror of Coherence's published identidad-visual blog post, mounted at
 * /work/visual-identity. Structure and prose follow the source 1:1 — this
 * file only ports format (semantic tokens, the Bilingual/pick pattern, the
 * repo's figure components in place of the source's inline SVG/Angular
 * demos). Every paragraph and list item is rendered through a template
 * literal expression rather than raw JSX text, so quotes and apostrophes in
 * the ported copy don't need HTML-entity escaping.
 */

// Hero copy is the source post's own, verbatim — not the WORK/CASE_STUDIES
// framing, since this page is the mirrored article rather than a bento study.
const HERO_TITLE: Bilingual<string> = {
  en: "How we built the new visual identity",
  es: "Cómo construimos la nueva identidad visual",
};

const HERO_STANDFIRST: Bilingual<string> = {
  en: "From a vague brief to a system running in code. This is our design process: what we did and why, because reconstructing context is where teams lose the most time and end up with preference-based design.",
  es: "De un encargo difuso a un sistema funcionando en código. Este es nuestro proceso de diseño: qué hicimos y por qué, porque reconstruir el contexto es donde los equipos pierden más tiempo y acaban diseñando por preferencias.",
};

const WIP = {
  label: { en: "Work in progress", es: "En construcción" },
  text: {
    en: "From here down, this is the active edge of the project: it will keep changing as we move forward.",
    es: "De aquí hacia abajo está el frente activo del proyecto: irá cambiando a medida que avancemos.",
  },
} as const satisfies Record<string, Bilingual>;

const PART_ONE_LINK = {
  en: "Part 1 of this series",
  es: "primera parte de esta serie",
} as const satisfies Bilingual;

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-foreground text-2xl font-bold tracking-tight">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-foreground mt-2 text-lg font-semibold tracking-tight">
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-foreground leading-relaxed">{children}</p>;
}

function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="text-foreground ml-6 flex list-decimal flex-col gap-2 leading-relaxed">
      {children}
    </ol>
  );
}

function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="text-foreground ml-6 flex list-disc flex-col gap-2 leading-relaxed">
      {children}
    </ul>
  );
}

function LI({ children }: { children: ReactNode }) {
  return <li className="pl-1">{children}</li>;
}

function WipNote() {
  const { lang } = useLang();
  return (
    <div className="border-border flex flex-wrap items-center gap-3 border-t pt-6">
      <Badge
        variant="outline"
        className="bg-warning-subtle text-warning-subtle-foreground border-transparent"
      >
        {pick(WIP.label, lang)}
      </Badge>
      <p className="text-muted-foreground text-xs">{pick(WIP.text, lang)}</p>
    </div>
  );
}

export function VisualIdentityArticle() {
  const { lang } = useLang();
  const es = lang === "es";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 pt-8 pb-24 sm:pt-12">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground w-fit font-mono text-xs tracking-wider uppercase transition-colors"
      >
        {t("work.back", lang)}
      </Link>

      {/* Same hero as the source post: title + standfirst, nothing else. */}
      <header className="flex flex-col gap-4">
        <h1 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          {pick(HERO_TITLE, lang)}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {pick(HERO_STANDFIRST, lang)}
        </p>
      </header>

      <article className="flex flex-col gap-16">
        {/* 1. Context and objectives */}
        <section className="flex flex-col gap-4">
          <H2>
            {es ? `Contexto y objetivos` : `Context and objectives`}
          </H2>

          {es ? (
            <>
              <H3>{`El diseño en Afi es joven`}</H3>
              <P>{`Antes de que Miguel entrara en Afi, el equipo de programación recibía PNG de los diseños de un diseñador gráfico.`}</P>
              <P>{`Miguel se incorporó y trabajó al principio solo en Wealth Manager, un producto distinto. Introdujo flujos reales en Figma, pero la organización seguía sin sistemas de diseño. Diseño y desarrollo solo colaboraban cuando había una duda visual o una objeción; las pantallas se diseñaban a ojo y los programadores tomaban el relevo.`}</P>
              <P>{`No había colaboración, ni definición, ni estrategia.`}</P>
              <P>{`Mi primer proyecto al incorporarme fue Bankinter. Diseñamos un planificador financiero con la línea visual comercial, con muchas idas y venidas con el equipo de Bankinter.`}</P>
              <P>{`Después de todo ese trabajo resultó que el producto era para banca privada, una línea visual completamente distinta, lo que subraya la importancia de estar alineados como equipo.`}</P>
              <P>{`El Wealth Planner se topó con el mismo problema durante el proyecto de Renta 4. Proyectos nuevos con cero contexto.`}</P>
              <P>
                {`Cuando arrancó el proyecto de Renta 4, mi encargo fue: cambia el nombre y ponlo en rojo. Sin materiales de marca, sin contexto sobre el tamaño del proyecto, `}
                <strong className="font-semibold">{`sin plan`}</strong>
                {`. Y el producto se había construido sin componentes, así que cualquier iteración costaría un tiempo que no teníamos.`}
              </P>
              <P>{`Cuando llegó la primera ronda de iteraciones, pasé el equipo a componentes, con la librería de Material porque era lo que ya usaba el código del equipo. Fue un avance real y la iteración se aceleró bastante.`}</P>
              <P>{`Pero entonces aprendimos lo que se nos había escapado por no trabajar juntos y no dedicar tiempo al descubrimiento: Material tiene opiniones muy marcadas y tuvimos que forzarla para crear productos que encajaran con las marcas de nuestros clientes. Sistematizar el diseño fue la decisión correcta, pero hacerlo dentro de Material nos impuso más restricciones.`}</P>
              <P>{`Después, en lugar de mejorar el producto, mi tarea fue crear versiones distintas del Wealth Planner para Afi y Unicaja, cambiando solo tipografías, colores y logos, con el objetivo de vendérselo a otros clientes.`}</P>
              <P>{`El flujo de trabajo nunca dio a nadie tiempo para diseñar. Por eso acabamos con un producto estático y de aspecto anticuado.`}</P>

              <H3>{`Oportunidad`}</H3>
              <P>{`La IA cambió lo que es posible: ya no estamos limitados a librerías de Angular con opiniones ajenas; podemos construir la nuestra. Por eso hice el curso de sistemas de diseño con IA de Memorisely. Nos da la flexibilidad para crear los productos que queremos.`}</P>
              <P>
                {`Ese es el contexto de este rediseño. Queremos un efecto `}
                <em>{`wow`}</em>
                {`, algo que no tenemos desde hace tiempo.`}
              </P>
              <P>
                {`Para conseguirlo, lo estamos haciendo de otra manera. Trabajamos `}
                <em>{`juntos`}</em>
                {` como equipo de diseño, aplicamos un proceso de diseño y documentamos el trabajo, porque todos los proyectos anteriores empezaron igual: sin alineación previa.`}
              </P>
            </>
          ) : (
            <>
              <H3>{`Design at Afi is young`}</H3>
              <P>{`Before Miguel joined Afi, the programming team received PNGs of designs from a graphic designer.`}</P>
              <P>{`Then Miguel joined, working only on Wealth Manager, a different product, at first. He introduced real flows in Figma, but the org still had no design systems in place. Design and development only collaborated when there was a visual question or an objection; the screens were designed by feel and the programmers took it from there.`}</P>
              <P>{`There was no collaboration, definition, or strategy.`}</P>
              <P>{`My first project when I joined was Bankinter. We designed a financial planner using the commercial visual line, with a lot of back and forth with the Bankinter team.`}</P>
              <P>{`After all that work it turned out the product was for private banking, a different visual line entirely, highlighting the importance of being aligned as a team.`}</P>
              <P>{`The Wealth Planner ran into the same problem during the Renta 4 project. New projects with zero context.`}</P>
              <P>
                {`When the Renta 4 project started, my brief was: change the name and make it red. No brand materials, no context on the size of the project, `}
                <strong className="font-semibold">{`no plan`}</strong>
                {`. And the product itself had been built without components, meaning any iteration would take time that we didn't have.`}
              </P>
              <P>{`When the first round of iterations came in, I moved us onto components, using the Material library because that's what the team's code already used. It was a real step forward, and iteration got much faster.`}</P>
              <P>{`But then we learned what we'd missed by not working together and dedicating proper time to discovery: Material is deeply opinionated, and we had to hack it to create products that match our clients' brands. Systemizing the design was the right call, but doing it inside Material created more restrictions for us.`}</P>
              <P>{`After that, instead of improving the product my task was to create different versions of wealth planner for Afi and Unicaja, changing only fonts, colors, and logos with the goal of selling it to other clients.`}</P>
              <P>{`The workflow never gave anyone time to design. Because of this we ended up with an old-looking, static product.`}</P>

              <H3>{`Opportunity`}</H3>
              <P>{`AI changed what's possible: we aren't restricted to opinionated Angular libraries anymore; we can build our own. That's why I took the Memorisely AI design-system course. It gives us the flexibility to create the products we want.`}</P>
              <P>{`That's the context for this redesign. We want a wow factor, which we haven't had in a while.`}</P>
              <P>
                {`To get there, we're doing things a bit differently. We are working `}
                <em>{`together`}</em>
                {` as a design team, implementing a design process, and documenting the work, because every project above started the same way: no alignment upfront.`}
              </P>
            </>
          )}

          <HandoffTimelineFigure lang={lang} />

          {es ? (
            <>
              <H3>{`Wealth Planner`}</H3>
              <P>{`El Wealth Planner de Afi es una herramienta con la que los asesores financieros construyen, simulan y presentan planes patrimoniales a sus clientes. Tenemos nuestra versión, que usamos sobre todo para demos. También lo ofrecemos en marca blanca a bancos españoles, conectando sus bases de datos de clientes.`}</P>
              <P>{`El encargo fue una línea: que parezca más moderno.`}</P>
              <P>{`El problema de fondo es que todo funciona sobre pantallas estáticas de Figma. Los clientes se pierden durante las presentaciones por culpa de esas pantallas estáticas y de experiencias que nunca se pensaron a fondo. Los desarrolladores trabajan pantalla a pantalla sin entender las interacciones. Por mucho color que le pusiéramos, la interfaz parecía anticuada.`}</P>
              <P>{`Así que antes de tocar nada fijamos tres objetivos: una interfaz ligera y densa en información, pensada para profesionales; demos interactivas en código en lugar de documentación solo en Figma, para que los desarrolladores inspeccionen el producto real; y un sistema que escale.`}</P>
            </>
          ) : (
            <>
              <H3>{`Wealth Planner`}</H3>
              <P>{`The Afi Wealth Planner is a tool financial advisors use to build, simulate, and present wealth plans to clients. We have our version, mostly used for demos. We also white-label the product for Spanish banks, connecting their databases of client details.`}</P>
              <P>{`The brief was one line: make it look more modern.`}</P>
              <P>{`The real problem is we run everything on static Figma screens. Clients get lost during presentations because of those static screens and user experiences that were never thought through. Developers work screen by screen without understanding interactions. The UI looked dated no matter what color we put on it.`}</P>
              <P>{`So before touching anything we set three objectives: a lean, information-dense UI built for professionals; interactive code demos instead of Figma-only documentation, so developers inspect the real thing; and a system that scales.`}</P>
            </>
          )}
        </section>

        {/* 2. Defining "modern" */}
        <section className="flex flex-col gap-4">
          <H2>{es ? `Definir «moderno»` : `Defining "modern"`}</H2>
          {es ? (
            <>
              <P>{`Antes de abrir Figma quisimos definir qué significa «moderno». Si no, cada revisión se convierte en un debate sobre lo que gusta y lo que no; sin una definición compartida, el gusto discute con el gusto y no se decide nada.`}</P>
              <P>
                {`Sintetizamos la investigación en la `}
                <Link
                  href="/writing/2026-06-24-modern-ui-2026"
                  className="text-primary underline underline-offset-4 hover:no-underline"
                >
                  {pick(PART_ONE_LINK, lang)}
                </Link>
                {`. La versión corta:`}
              </P>
              <UL>
                <LI>
                  <strong className="font-semibold">{`Intención en lo visual.`}</strong>
                  {` Tonos neutros, profundidad funcional, retículas bento para la jerarquía. El color y la animación transmiten información.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Dinámico en lugar de lineal.`}</strong>
                  {` Los flujos lineales crean experiencias aburridas; lo que necesitamos es entender de verdad el objetivo del usuario y construir el layout a su alrededor.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Sistemas, sistemas, sistemas.`}</strong>
                  {` Tokens semánticos como única fuente de verdad, para que las decisiones sean legibles también por máquinas.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Evidencia por encima de opinión.`}</strong>
                  {` Como los layouts pueden ser dinámicos, cobra más peso medir y hablar con los usuarios. Las opiniones basadas solo en gustos, sin métricas ni usuarios detrás, frenan la creatividad.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Atención a los pequeños detalles.`}</strong>
                  {` Ahora que construir es mucho más rápido, la interfaz moderna deja espacio para los detalles que el usuario no sabría nombrar pero sí nota. Una flecha que gira o un botón que se ajusta a su texto eran antes un extra; hoy son la forma de demostrar que, incluso con IA, alguien prestó atención.`}
                </LI>
              </UL>
            </>
          ) : (
            <>
              <P>{`Before opening Figma, we wanted to define what "modern" meant. Otherwise every review turns into a debate about what people like versus what they don't; without a shared definition, taste argues with taste and nothing gets decided.`}</P>
              <P>
                {`We synthesized the research in `}
                <Link
                  href="/writing/2026-06-24-modern-ui-2026"
                  className="text-primary underline underline-offset-4 hover:no-underline"
                >
                  {pick(PART_ONE_LINK, lang)}
                </Link>
                {`. The short version:`}
              </P>
              <UL>
                <LI>
                  <strong className="font-semibold">{`Be intentional with visuals.`}</strong>
                  {` Neutral tones, functional depth, bento grids for hierarchy. Color and animation carry information.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Dynamic instead of linear.`}</strong>
                  {` Linear flows create boring experiences; what we need is to truly understand the user's objective and build the layout around it.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Systems, systems, systems.`}</strong>
                  {` Semantic tokens as one source of truth, so decisions stay machine-readable.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Evidence over opinion.`}</strong>
                  {` Because layouts can be dynamic there is more of an emphasis on tracking metrics and talking to users. Taste-only feedback, with no metrics or user input behind it, stunts creativity.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Pay attention to the small details.`}</strong>
                  {` Now that building is so much faster, modern UI gives space to the details users wouldn't name but do feel. An arrow twisting or a button hugging its text used to be a nice-to-have; now it's how you show that, even with AI, someone paid attention.`}
                </LI>
              </UL>
            </>
          )}
        </section>

        {/* 3. Moodboards, then a shortlist */}
        <section className="flex flex-col gap-4">
          <H2>
            {es
              ? `Moodboards y una lista corta`
              : `Moodboards, then a shortlist`}
          </H2>
          {es ? (
            <>
              <P>{`Después de la investigación, cada uno construyó su moodboard en Mobbin, por separado y organizado por componente: botones, inputs, menús, tarjetas, diálogos, barra lateral, filtros. Tres o cuatro pantallas guardadas por componente.`}</P>
              <P>{`Wise fue la única referencia de nuestro propio sector. Es la prueba de que una fintech puede funcionar casi entera en blanco y negro y poner color solo donde los datos lo necesitan.`}</P>
              <P>{`Después recorrimos las dos colecciones, componente a componente.`}</P>
              <P>{`Miguel detectó el patrón primero: «Elegíamos las mismas aplicaciones una y otra vez. Quizá esa es la dirección que buscamos». Los mismos nombres aparecían en ambos tableros, y esa fue la lista corta: Wise, Cursor, Shopify, Clerk, Notion y Granola, con Linear, OpenAI y Stack AI.`}</P>
              <P>{`La sesión produjo direcciones, no diseños finales.`}</P>
              <OL>
                <LI>{`Botones compactos como los de Cursor, con la sombra casi invisible que usa Stack AI.`}</LI>
                <LI>{`Inputs ajustados como los de OpenAI, en dos variantes de padding.`}</LI>
                <LI>{`Menús como los de Clerk: solo opciones, sin iconos, sombra marcada.`}</LI>
                <LI>{`Una barra de navegación con migas al estilo Clerk: espacio de trabajo, cliente, simulación.`}</LI>
                <LI>{`Shopify como referencia de gráficas sobre tarjetas.`}</LI>
                <LI>
                  {`Wise como `}
                  <strong className="font-semibold">{`punto de partida`}</strong>
                  {` en el uso del color.`}
                </LI>
              </OL>
            </>
          ) : (
            <>
              <P>{`After research, we each built a moodboard in Mobbin, separately, organized by component: buttons, inputs, menus, cards, dialogs, sidebar, filters. Three or four screens saved per component.`}</P>
              <P>{`Wise was the only reference from our own domain. It is the proof that a fintech can run almost entirely black and white and put color only where the data needs it.`}</P>
              <P>{`Then we went through both collections, one component at a time.`}</P>
              <P>{`Miguel noticed the pattern first: "We kept choosing the same apps over and over again. Maybe this is the vibe we want to go for." The same names surfaced in both boards, and that became the shortlist: Wise, Cursor, Shopify, Clerk, Notion, and Granola, with Linear, OpenAI, and Stack AI.`}</P>
              <P>{`The session produced directions, not final designs.`}</P>
              <OL>
                <LI>{`Buttons compact like Cursor's, with the barely-visible shadow Stack AI uses.`}</LI>
                <LI>{`Inputs tight like OpenAI's, in two padding variants.`}</LI>
                <LI>{`Menus like Clerk's: options only, no icons, strong shadow.`}</LI>
                <LI>{`A Clerk-style breadcrumb navbar: workspace, client, simulation.`}</LI>
                <LI>{`Shopify as the reference for graphs on cards.`}</LI>
                <LI>
                  {`Wise as the `}
                  <strong className="font-semibold">{`starting point`}</strong>
                  {` on color usage.`}
                </LI>
              </OL>
            </>
          )}

          <MoodboardGalleryFigure lang={lang} />

          {es ? (
            <P>{`De la propia sesión salió una idea: al pulsar, el botón se hunde y gana una respuesta más física. Parece pequeño, pero marcó el tono de cómo trataríamos las microinteracciones después.`}</P>
          ) : (
            <P>{`One idea came out of the session itself: on press, the button sinks inward creating more of a life-like action. It sounds small, but it set the tone for how we'd treat micro-interactions later.`}</P>
          )}
        </section>

        {/* 4. Principles for the team */}
        <section className="flex flex-col gap-4">
          <H2>
            {es ? `Principios para el equipo` : `Principles for the team`}
          </H2>
          {es ? (
            <>
              <P>{`Después de la sesión de moodboards cogimos los patrones que elegíamos una y otra vez, los conectamos con la investigación y los escribimos como nueve principios de diseño.`}</P>
              <OL>
                <LI>
                  <strong className="font-semibold">{`Densidad de información sin densidad visual.`}</strong>
                  {` Mostrar mucha información sin que la pantalla resulte recargada, para que los datos se lean con facilidad.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Controles compactos.`}</strong>
                  {` Botones, inputs y menús ocupan solo el espacio que necesitan. Todos los productos de nuestra lista corta (Cursor, OpenAI, Linear, Notion) funcionan así.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Minimalismo funcional.`}</strong>
                  {` Si un elemento no cumple una función, se va. La confianza nace de la ausencia de decoración y de destacar lo que de verdad importa.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Revelado progresivo.`}</strong>
                  {` Mostrar primero lo esencial y revelar el detalle cuando el usuario lo pide. Todo lo demás queda a un clic, no en la primera pantalla.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Consistencia por encima de novedad.`}</strong>
                  {` El usuario aprende un patrón una vez y lo reconoce en todas partes, así dedica menos esfuerzo a entender tareas nuevas.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`El movimiento explica estados.`}</strong>
                  {` La animación muestra que algo ha cambiado o dirige la atención. Todo lo demás se elimina.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`El color comunica significado.`}</strong>
                  {` Las superficies se mantienen neutras y el color siempre significa algo, así el usuario aprende a leerlo sin pensar. En las gráficas eso implica una serie destacada sobre gris, con el rojo y el verde para lo negativo y lo positivo.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Construir el sistema y el flujo, no pantallas.`}</strong>
                  {` Cada pantalla se monta con bloques reutilizables. Diseñar pantalla a pantalla es exactamente como se acaba en productos estáticos y aburridos.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Contexto por encima de páginas.`}</strong>
                  {` Mantener al usuario donde está: drawers, edición en línea y tarjetas expandibles en lugar de mandarlo a otra página.`}
                </LI>
              </OL>
              <P>{`También escribimos qué evitar, porque saber qué somos está incompleto sin saber qué no somos:`}</P>
              <OL>
                <LI>
                  <strong className="font-semibold">{`Material Design.`}</strong>
                  {` Vivimos dentro de sus opiniones y dedicamos el tiempo a sortearlas.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Glassmorphism pesado.`}</strong>
                  {` El desenfoque que crea profundidad vale; el cristal sobre datos densos perjudica la legibilidad. Cristal en las superficies, fondos sólidos detrás de los datos.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Dashboards corporativos llenos de color.`}</strong>
                  {` Cuando todo es colorido, nada destaca.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Estética de consumo lúdica.`}</strong>
                  {` No somos un producto B2C. Nuestros usuarios son profesionales que toman decisiones financieras. El efecto `}
                  <em>{`wow`}</em>
                  {` viene de los micromomentos de deleite, esos pequeños lugares donde podemos añadir estilo.`}
                </LI>
              </OL>
              <P>{`Los principios existen para que una revisión pueda discutir contra un principio y no contra una preferencia. Ahora viven junto a la estrategia de marca, para que cualquier diseñador futuro herede el razonamiento junto con los componentes.`}</P>
            </>
          ) : (
            <>
              <P>{`After the moodboard session we took the patterns we kept choosing, connected them back to the research, and wrote them down as nine design principles.`}</P>
              <OL>
                <LI>
                  <strong className="font-semibold">{`Information density without visual density.`}</strong>
                  {` Show a lot of information without the screen feeling busy, so the data is easy to read.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Compact controls.`}</strong>
                  {` Buttons, inputs, and menus take up only the space they need. Every product we shortlisted (Cursor, OpenAI, Linear, Notion) works this way.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Functional minimalism.`}</strong>
                  {` If an element doesn't do a job, it goes. Trust comes from the absence of decoration and highlighting what's actually important.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Progressive disclosure.`}</strong>
                  {` Show the essentials first and reveal detail when the user asks for it. Everything else is one click away, not on the first screen.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Consistency above novelty.`}</strong>
                  {` A user learns a pattern once and recognizes it everywhere, so they spend less effort figuring out new tasks.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Motion explains state.`}</strong>
                  {` Animation shows that something changed or directs attention. Anything else gets cut.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Color communicates meaning.`}</strong>
                  {` Surfaces stay neutral and color always means something, so users learn to read it without thinking. In charts that means one highlighted series against gray, with red and green for negative and positive.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Build the system and flow, not screens.`}</strong>
                  {` Every screen assembles from reusable blocks. Designing screen by screen is exactly how we end up with static, boring products.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Context over pages.`}</strong>
                  {` Keep the user where they are: drawers, inline editing, and expandable cards instead of sending them to a new page.`}
                </LI>
              </OL>
              <P>{`We also wrote down what to avoid, because knowing what we are is incomplete without knowing what we're not:`}</P>
              <OL>
                <LI>
                  <strong className="font-semibold">{`Material Design.`}</strong>
                  {` We lived inside its opinions and spent our time hacking around them.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Heavy glassmorphism.`}</strong>
                  {` Blur that creates depth is fine; glass on top of dense data hurts legibility. Glass on the surfaces, solid backgrounds behind data.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Colorful enterprise dashboards.`}</strong>
                  {` When everything is colorful, nothing stands out.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Playful consumer aesthetics.`}</strong>
                  {` We aren't a B2C product. Our users are professionals making financial decisions. The wow factor comes from micro-moments of delight, the small places where we can add some style.`}
                </LI>
              </OL>
              <P>{`The principles exist so a review can argue against a principle instead of a preference. They now live alongside the brand strategy, so any future designer inherits the reasoning along with the components.`}</P>
            </>
          )}
        </section>

        {/* 5. Foundations in black and white */}
        <section className="flex flex-col gap-4">
          <H2>
            {es
              ? `Fundamentos en blanco y negro`
              : `Foundations in black and white`}
          </H2>
          {es ? (
            <>
              <P>{`Montamos nuestros tokens primitivos y semánticos en blanco y negro.`}</P>
              <P>{`Un token es un rol, como «fondo lienzo» o «fondo elevado». Definir ese vocabulario antes que la paleta hace que elegir colores después sea un cambio rápido. Se actualiza el primitivo y todas las pantallas cambian con él. Igual con decisiones de espaciado como la distancia de la navegación al contenido o el padding del lienzo.`}</P>
              <P>{`En tipografía probamos Space Grotesk, Fira Sans y Geist, y ninguna superó la prueba de ancho entre patrones de cifras (0000 frente a 4444). IBM Plex Sans se mantuvo consistente, así que se convirtió en la familia tipográfica de la identidad moderna.`}</P>
            </>
          ) : (
            <>
              <P>{`We set up our primitive and semantic tokens in black and white.`}</P>
              <P>{`A token is a role, like "background canvas" or "background elevated." Defining that vocabulary before the palette means that choosing colors later is a quick change. Update the primitive, and every screen changes with it. Same for spacing decisions like nav-to-content or canvas padding.`}</P>
              <P>{`For typography we tested Space Grotesk, Fira Sans, and Geist, and none of them passed the width test across number patterns (0000 vs 4444). IBM Plex Sans held consistent, so it became the type family for the modern identity.`}</P>
            </>
          )}

          <TypeTestFigure lang={lang} />
        </section>

        {/* 6. Components in code, documentation in Figma */}
        <section className="flex flex-col gap-4">
          <H2>
            {es
              ? `Componentes en código, documentación en Figma`
              : `Components in code, documentation in Figma`}
          </H2>
          {es ? (
            <>
              <P>{`Con los fundamentos listos, hicimos la lista de componentes primitivos y nos la repartimos. Yo tomé chip, badge, tarjeta y tabla; Miguel, tag, diálogo, barra de navegación y pestañas.`}</P>
              <P>{`Botones, inputs, checkboxes y toggles los construimos juntos, para definir un flujo de trabajo eficiente y conseguir resultados parecidos.`}</P>
              <P>{`Empezamos por los componentes primitivos porque son los bloques con los que se monta todo lo demás; los patrones más complejos solo se construyen cuando de verdad hacen falta.`}</P>
              <P>{`Nuestro flujo de trabajo:`}</P>
              <OL>
                <LI>{`Área de trabajo en baja fidelidad: construimos el componente primitivo en código a partir del moodboard y escribimos un prompt para el agente de Figma.`}</LI>
                <LI>{`La IA construye el componente en Figma con las variables correctas, crea las que falten y redacta la documentación.`}</LI>
                <LI>{`Hacemos los ajustes pequeños.`}</LI>
                <LI>{`Cuando estamos satisfechos, usamos el MCP de Figma para construir el componente en nuestra librería de Afi.`}</LI>
              </OL>
              <P>{`Empezamos a construir una página de trabajo de componentes para enseñar al equipo las interacciones en un entorno aislado durante las revisiones.`}</P>
              <P>{`Para mantener la consistencia construimos dos skills:`}</P>
              <OL>
                <LI>{`La skill /ds-cleanup audita un componente o una página, señala dónde se desvía del sistema y, con un segundo prompt, lo corrige.`}</LI>
                <LI>{`La skill /ship hace commit y push; yo hago el merge; y devuelve un prompt de Figma con todo lo que cambió en las variables, para que Figma y el código nunca se separen.`}</LI>
              </OL>
            </>
          ) : (
            <>
              <P>{`With foundations set, we listed the primitive components and split them. I took chip, badge, card, and table; Miguel took tag, dialog, navbar, and tabs.`}</P>
              <P>{`We built buttons, inputs, checkboxes, and toggles together, so we could work out an efficient workflow and get similar outputs.`}</P>
              <P>{`We started with primitive components because they're the building blocks everything else assembles from; the more complex patterns only get built when we actually need them.`}</P>
              <P>{`Our workflow:`}</P>
              <OL>
                <LI>{`Lo-fi workarea: we build the primitive component in code based on our moodboard, then write a prompt for the Figma agent.`}</LI>
                <LI>{`The AI builds the component in Figma using the correct variables, creating new ones where needed, and writes the documentation.`}</LI>
                <LI>{`We make any small adjustments.`}</LI>
                <LI>{`Then, once we're satisfied, we use the Figma MCP to build the component in our Afi component library.`}</LI>
              </OL>
              <P>{`We started building a component workbench page so during review we can show the team the interactions in an isolated environment.`}</P>
              <P>{`To keep things consistent, we built two skills:`}</P>
              <OL>
                <LI>{`/ds-cleanup skill audits a component or page, tells me where it's drifting from the system, and then, on a second prompt, fixes it.`}</LI>
                <LI>{`/ship skill commits and pushes; I merge; then it hands back a Figma prompt for anything that changed in the variables, so Figma and code never drift apart.`}</LI>
              </OL>
            </>
          )}

          <ComponentsDemoFigure lang={lang} />

          {es ? (
            <P>{`Este flujo nos ahorró mucho tiempo. Todo está conectado a las variables base y tenemos salvaguardas para actualizar la documentación sobre la marcha. Eso hace que la IA siga produciendo resultados consistentes y da al equipo el contexto detrás de cada decisión de diseño.`}</P>
          ) : (
            <P>{`This workflow saved us a lot of time. Everything is connected to base variables and we have safeguards to update documentation as we go. That keeps the AI producing consistent outputs and gives the team the context behind each design decision.`}</P>
          )}
        </section>

        {/* 7. Micro-interactions */}
        <section className="flex flex-col gap-4">
          <H2>{es ? `Microinteracciones` : `Micro-interactions`}</H2>
          {es ? (
            <>
              <P>{`Con los componentes primitivos terminados, el movimiento pasó a ser la siguiente capa. El principio ya estaba fijado: el movimiento explica estados. Eso no significaba que no pudiéramos ser creativos.`}</P>
              <P>{`No inventamos la mayoría de las animaciones. Recreamos, aplicando ingeniería inversa, las que nos inspiraban, o cogimos una librería de animación de React, portamos el código a Angular e iteramos desde ahí. Algunas librerías que usamos:`}</P>
              <OL>
                <LI>{`Magic UI`}</LI>
                <LI>{`Animate UI`}</LI>
                <LI>{`Shadcn`}</LI>
              </OL>
            </>
          ) : (
            <>
              <P>{`With the primitive components done, motion became the next layer. The principle was already locked: motion explains state. That didn't mean we couldn't get creative.`}</P>
              <P>{`We didn't invent most of the animations. We reverse-engineered the ones that inspired us, or took a React animation library, ported the code to Angular, and iterated from there. Some libraries we used:`}</P>
              <OL>
                <LI>{`Magic UI`}</LI>
                <LI>{`Animate UI`}</LI>
                <LI>{`Shadcn`}</LI>
              </OL>
            </>
          )}

          <MicroInteractionsDemoFigure lang={lang} />
        </section>

        <WipNote />

        {/* 8. The structure */}
        <section className="flex flex-col gap-4">
          <H2>{es ? `La estructura` : `The structure`}</H2>
          {es ? (
            <>
              <P>{`Durante el descubrimiento vimos que la mayoría de los productos financieros no tienen una sola gráfica o tabla flotando en blanco, como nos pasa a nosotros. La mayoría van directos a la conclusión: una lectura rápida de un vistazo, con espacio para profundizar bajo demanda.`}</P>
              <P>{`Así que tomamos una decisión de diseño: organizar el producto en torno al valor que entrega cada página, no al orden en que se construye un plan. Menos pantallas y más orientadas a la conclusión. Para llegar ahí, mapeamos las ~15 pantallas a una declaración de valor: ¿a qué conclusión debería llegar el usuario en los cinco segundos siguientes a mirar esta página?`}</P>
              <P>{`Conclusiones es el caso más claro: hoy Diagnóstico y Plan de acción son dos páginas separadas, pero la declaración de valor es una sola pregunta, «¿cuál es mi situación y qué hago al respecto?», así que se convierte en un solo dashboard.`}</P>
            </>
          ) : (
            <>
              <P>{`During our discovery, we found that most financial products didn't just have a single chart or table floating in whitespace, like we do. Most were insight-driven: a quick read at a glance, with room to dig deeper on demand.`}</P>
              <P>{`So we made a design decision: organize the product around the value each page delivers, not the order a plan gets built. Fewer, insight-driven screens. To get there, we mapped all ~15 screens to a user-value statement: what insight should a user reach within five seconds of looking at this page?`}</P>
              <P>{`Conclusiones is the clearest case: today Diagnóstico and Plan de acción are two separate pages, but the value statement is one question, "what's my situation and what do I do about it?", so it becomes one dashboard.`}</P>
            </>
          )}
        </section>

        {/* 9. Where we are now: layout and charts */}
        <section className="flex flex-col gap-4">
          <H2>
            {es
              ? `Dónde estamos ahora: layout y gráficas`
              : `Where we are now: layout and charts`}
          </H2>
          {es ? (
            <>
              <P>
                {`En un producto fintech, la visualización de datos `}
                <em>{`es`}</em>
                {` la identidad visual. Las gráficas y las tarjetas son lo que el cliente mira de verdad.`}
              </P>
              <P>{`Así que repetimos el ejercicio del moodboard, y esta vez recogimos layouts en lugar de componentes: cómo se organiza la página, cómo se compone un dashboard, cómo se comporta una gráfica y cómo se usa el color.`}</P>
              <P>{`Lo que nos quedamos:`}</P>
              <OL>
                <LI>
                  <strong className="font-semibold">{`Un dashboard bento`}</strong>
                  {` como dirección de layout. Huecos ajustados, cajas de esquinas suaves, etiquetas sobre las cifras grandes.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Google Finance`}</strong>
                  {` para el comportamiento de las gráficas. Extremadamente simple, lo mínimo en pantalla y aun así suficiente. El control de comparación va sobre la gráfica y el tooltip actualiza una fila de valores en lugar de flotar sobre la línea, lo que resuelve un problema que tenemos hoy: mostramos tantos datos al pasar el cursor que el tooltip tapa justo lo que se quiere leer.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`La línea sombreada de Shadcn`}</strong>
                  {` como única variación sobre esa base, para tener dos opciones que comparar en lugar de una que defender.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Shopify`}</strong>
                  {` otra vez, por disciplina. Cajas dentro de cajas dentro de cajas, y un estilo de gráfica tan sencillo que resulta accesible por defecto.`}
                </LI>
              </OL>
              <P>{`Las decisiones que salieron de ahí:`}</P>
              <UL>
                <LI>
                  <strong className="font-semibold">{`Un sistema de layout, varios layouts.`}</strong>
                  {` Las páginas pueden verse distintas siempre que se monten con los mismos módulos y contenedores. Una plantilla quita partes; no inventa estructura nueva. Como lo dijo Miguel: «no parecen dos productos distintos».`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Las secciones se apoyan sobre un fondo gris`}</strong>
                  {`, cada una con un borde de un píxel y su padding. Ese borde hace más por la textura que cualquier decoración.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Las gráficas parten de la forma más básica y accesible y crecen desde ahí.`}</strong>
                  {` Mi instinto era elegir tres estilos visuales del moodboard. Miguel defendió empezar conservador y añadir solo lo que se gane su sitio, y tenía razón. Así que la gráfica de Google Finance es la base, la línea de Shadcn es la primera incorporación que se ganó su sitio, y cualquier cosa más allá de esas dos tiene que justificarse.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`El color deja de codificar categorías.`}</strong>
                  {` Las series van en gris con un color destacado, y el verde y el rojo quedan reservados para subidas y bajadas. La frase de Miguel: «deberíamos usar cosas completamente distintas del color para diferenciar».`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Jerarquía por página:`}</strong>
                  {` la conclusión grande arriba, una fila de cifras pequeñas debajo y la tabla detallada al final.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Las tarjetas de conclusión se expanden a pantalla completa.`}</strong>
                  {` Los filtros y la interacción pesada viven en la vista expandida, no en la tarjeta.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Nada más pesado que semibold`}</strong>
                  {`, y menos diferenciación en general: la misma tipografía y el mismo tamaño siempre que podamos.`}
                </LI>
              </UL>
              <P>{`El siguiente paso es que cada uno reconstruya la misma página de tres formas con los componentes reales, compararlas y elegir. Este es el capítulo actual. El siguiente artículo empieza con una gráfica.`}</P>
            </>
          ) : (
            <>
              <P>
                {`In a fintech product the data visualization `}
                <em>{`is`}</em>
                {` the visual identity. Charts and cards are what a client actually looks at.`}
              </P>
              <P>{`So we ran the moodboard exercise a second time, and this time we collected layouts instead of components: how the page is organized, how a dashboard is composed, how a chart behaves and how color is used.`}</P>
              <P>{`What we kept:`}</P>
              <OL>
                <LI>
                  <strong className="font-semibold">{`A bento dashboard`}</strong>
                  {` as the layout direction. Tight gaps, soft-rounded boxes, tags on the big numbers.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Google Finance`}</strong>
                  {` for chart behavior. Extremely simple, the bare minimum on screen, and still enough. The compare control sits on top of the chart, and the tooltip updates a row of values instead of floating over the line, which solves a problem we have today: we show so much data on hover that the tooltip covers what you're trying to read.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Shadcn's shaded line`}</strong>
                  {` as the one variation on that baseline, so we have two to compare rather than one to defend.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Shopify`}</strong>
                  {` again, for discipline. Boxes inside boxes inside boxes, and a chart style so plain it's accessible by default.`}
                </LI>
              </OL>
              <P>{`The decisions that came out of it:`}</P>
              <UL>
                <LI>
                  <strong className="font-semibold">{`One layout system, several layouts.`}</strong>
                  {` Pages can look different as long as they're assembled from the same modules and containers. A template removes parts; it doesn't invent new structure. As Miguel put it: "it doesn't feel like two different products."`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Sections sit on a gray ground`}</strong>
                  {`, each with a one-pixel border and padding. That single border does more for texture than any decoration would.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Charts start at the most basic accessible form and grow from there.`}</strong>
                  {` My instinct was to pick three visual styles off the moodboard. Miguel argued for starting conservative and adding only what earns its place, and he was right. So Google Finance's chart is the baseline, Shadcn's line is the first addition that earned its place, and anything beyond those two has to justify itself.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Color stops encoding categories.`}</strong>
                  {` Series go gray with one highlighted color, and green and red stay reserved for up and down. Miguel's line: "we should just use completely different things that are not colored to differentiate stuff."`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Hierarchy per page:`}</strong>
                  {` the big insight on top, a row of small stats under it, the detailed table below.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Insight cards expand to full screen.`}</strong>
                  {` Filters and heavy interaction live in the expanded view, not on the card.`}
                </LI>
                <LI>
                  <strong className="font-semibold">{`Nothing heavier than semibold`}</strong>
                  {`, and less differentiation overall: same font, same size, wherever we can get away with it.`}
                </LI>
              </UL>
              <P>{`Next we each rebuild the same page three ways from the real components, compare them, and pick. That's the current chapter. The next post starts with a chart.`}</P>
            </>
          )}
        </section>
      </article>
    </main>
  );
}
