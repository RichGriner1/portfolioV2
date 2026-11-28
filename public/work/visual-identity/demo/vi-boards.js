/* Portfolio-only boards for the Visual Identity case study, built from the real Afi
 * apps components in ds/afi-apps, so a visitor can use them. Every figure on them is
 * made up. <body data-board="…"> picks the board. */
(function () {
  var DS = window.AfiModernDesignSystem_dc4c68;
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;

  // The boards speak the page's language: the site keeps it in localStorage, and a
  // change there fires `storage` in this frame, so the board reloads in the new one.
  // `?lang=` overrides it, for checking a board on its own.
  var LANG = (function () {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "es") return q;
    try {
      var s = localStorage.getItem("lang");
      if (s === "en" || s === "es") return s;
    } catch (e) {}
    return "en";
  })();
  document.documentElement.lang = LANG;
  window.addEventListener("storage", function (e) {
    if (e.key === "lang" && e.newValue !== LANG) location.reload();
  });
  function L(en, es) { return LANG === "es" ? es : en; }

  /* The question: modern, as six checks the redesign is reviewed against. */
  var CHECKS = [
    L("A shared design language", "Un lenguaje de diseño compartido"),
    L("Screens built around user intent", "Pantallas en torno a la intención del usuario"),
    L("Motion that explains state", "Movimiento que explica estados"),
    L("Neutral surfaces, color kept for meaning", "Superficies neutras, color para el significado"),
    L("Semantic tokens an AI can build on", "Tokens semánticos sobre los que una IA construye"),
    L("Transparent, consistent, responsive interactions", "Interacciones transparentes, consistentes y con respuesta"),
  ];
  function Lista() {
    var _c = useState(CHECKS.map(function () { return true; })), c = _c[0], setC = _c[1];
    return h(DS.Card, { heading: L("Modern, in six checks", "Moderno, en seis puntos"), supporting: L("What every screen is reviewed against", "Con lo que se revisa cada pantalla") },
      h("div", { className: "pf-stack pf-stack--tight" },
        CHECKS.map(function (t, i) {
          return h(DS.Checkbox, {
            key: i,
            label: t,
            checked: c[i],
            onChange: function () { var n = c.slice(); n[i] = !n[i]; setC(n); },
          });
        })
      )
    );
  }

  /* The problem: one look, two meanings. */
  function DosSignificados() {
    var _t = useState("resumen"), t = _t[0], setT = _t[1];
    return h(DS.Card, { heading: L("One look, two meanings", "Un aspecto, dos significados"), supporting: L("Screen by screen, the same component drifts", "Pantalla a pantalla, el mismo componente se desvía") },
      h("div", { className: "pf-stack" },
        h("div", { className: "pf-states" },
          h("p", { className: "pf-caption" }, L("Tabs that move between pages", "Pestañas que cambian de página")),
          h(DS.Tabs, { items: [{ value: "resumen", label: L("Summary", "Resumen") }, { value: "activos", label: L("Assets", "Activos") }, { value: "objetivos", label: L("Goals", "Objetivos") }], value: t, onChange: setT })
        ),
        h("div", { className: "pf-states" },
          h("p", { className: "pf-caption" }, L("The same tabs, picking one option", "Las mismas pestañas, eligiendo una opción")),
          h(DS.Tabs, { items: [{ value: "m", label: L("Monthly", "Mensual") }, { value: "a", label: L("Yearly", "Anual") }], value: "m" })
        ),
        h("div", { className: "pf-states" },
          h("p", { className: "pf-caption" }, L("A beta label and a paid feature, drawn alike", "Una etiqueta beta y una función de pago, iguales")),
          h("div", { className: "pf-row" }, h(DS.Tag, null, "Beta"), h(DS.Tag, null, "Pro"))
        )
      )
    );
  }

  /* Rules, one meaning: each role gets its own component. */
  function UnSignificado() {
    var _t = useState("resumen"), t = _t[0], setT = _t[1];
    var _p = useState("m"), p = _p[0], setP = _p[1];
    return h(DS.Card, { heading: L("One component, one meaning", "Un componente, un significado"), supporting: L("The role picks the component", "El rol elige el componente") },
      h("div", { className: "pf-stack" },
        h("div", { className: "pf-states" },
          h("p", { className: "pf-caption" }, L("Page navigation is tabs", "La navegación de página son pestañas")),
          h(DS.Tabs, { items: [{ value: "resumen", label: L("Summary", "Resumen") }, { value: "activos", label: L("Assets", "Activos") }, { value: "objetivos", label: L("Goals", "Objetivos") }], value: t, onChange: setT })
        ),
        h("div", { className: "pf-states" },
          h("p", { className: "pf-caption" }, L("Exclusive options are a segmented control", "Las opciones excluyentes son un control segmentado")),
          h("div", { className: "pf-row" }, h(DS.SegmentedControl, { options: [{ value: "m", label: L("Monthly", "Mensual") }, { value: "a", label: L("Yearly", "Anual") }], value: p, onChange: setP }))
        ),
        h("div", { className: "pf-states" },
          h("p", { className: "pf-caption" }, L("Labels describe, a sale asks", "Las etiquetas describen, la venta pide")),
          h("div", { className: "pf-row" },
            h(DS.Tag, null, L("Add-on", "Complemento")),
            h(DS.Tag, null, "Beta"),
            h(DS.Button, { variant: "primary", size: "xs" }, L("Upgrade to Pro", "Pasar a Pro"))
          )
        )
      )
    );
  }

  /* Rules, principles: the four the study names, and the one thing to avoid first. */
  function Principios() {
    var items = [
      [L("Information density without visual density", "Densidad de información sin densidad visual"), L("Lots of data, a quiet screen", "Muchos datos, una pantalla tranquila")],
      [L("Progressive disclosure", "Revelación progresiva"), L("The detail appears when it's asked for", "El detalle aparece cuando se pide")],
      [L("Consistency above novelty", "Consistencia antes que novedad"), L("A known pattern beats a new one", "Un patrón conocido gana a uno nuevo")],
      [L("Context over pages", "Contexto antes que páginas"), L("Edit in a drawer, inline or in a card", "Se edita en un panel, en línea o en una tarjeta")],
    ];
    return h(DS.Card, { heading: L("Principles", "Principios"), supporting: L("Four of the nine", "Cuatro de los nueve") },
      h("div", { className: "pf-stack pf-stack--tight" },
        items.map(function (it, i) {
          return h("div", { className: "pf-principle", key: i },
            h("span", { className: "pf-num" }, String(i + 1)),
            h("div", null, h("p", { className: "pf-text pf-strong" }, it[0]), h("p", { className: "pf-caption" }, it[1]))
          );
        }),
        h("div", { className: "pf-row pf-avoid" }, h(DS.Badge, { tone: "critical", dot: true }, L("Avoid", "Evitar")), h("span", { className: "pf-text" }, "Material Design"))
      )
    );
  }

  /* Foundations, tokens by role: black and white first, each named by its job. */
  var ROLES = [
    ["--background-canvas", L("Canvas", "Lienzo")],
    ["--background-elevated", L("Elevated", "Elevado")],
    ["--background-subtle", L("Subtle", "Sutil")],
    ["--background-inverse", L("Inverse", "Inverso")],
    ["--content-primary", L("Text", "Texto")],
    ["--borders-default", L("Border", "Borde")],
  ];
  function Roles() {
    return h(DS.Card, { heading: L("Named by role", "Con nombre de rol"), supporting: L("Black and white, before any color", "Blanco y negro, antes de cualquier color") },
      h("div", { className: "pf-roles" },
        ROLES.map(function (r) {
          return h("div", { className: "pf-role", key: r[0] },
            h("div", { className: "pf-role__swatch", style: { background: "var(" + r[0] + ")" } }),
            h("p", { className: "pf-text pf-strong" }, r[1]),
            h("code", null, r[0])
          );
        })
      )
    );
  }

  /* Foundations, type test: the same figures in four families, measured here, live. */
  var FONTS = ["Space Grotesk", "Fira Sans", "Geist", "IBM Plex Sans"];
  function Tipos() {
    var _w = useState(null), w = _w[0], setW = _w[1];
    var refs = useRef({});
    useEffect(function () {
      // Load each family before measuring, or the widths are the fallback font's.
      // A family that fails to load gets no verdict rather than a wrong one.
      Promise.all(FONTS.map(function (f) {
        return document.fonts.load("32px '" + f + "'", "04").then(
          function (faces) { return faces.length > 0; },
          function () { return false; }
        );
      })).then(function (ok) {
        var out = {};
        FONTS.forEach(function (f, i) {
          var a = refs.current[f + "0"], b = refs.current[f + "4"];
          if (ok[i] && a && b) out[f] = [a.getBoundingClientRect().width, b.getBoundingClientRect().width];
        });
        setW(out);
      });
    }, []);
    return h(DS.Card, { heading: L("Same figures, four families", "Las mismas cifras, cuatro familias"), supporting: L("Default figures, measured live", "Cifras por defecto, medidas en vivo") },
      h("div", { className: "pf-stack pf-stack--tight" },
        FONTS.map(function (f) {
          var m = w && w[f];
          var diff = m ? Math.abs(m[0] - m[1]) : 0;
          var held = m && diff < 0.5;
          return h("div", { className: "pf-type", key: f },
            h("span", { className: "pf-text pf-strong" }, f),
            h("span", { className: "pf-figures", style: { fontFamily: "'" + f + "', sans-serif" } },
              h("span", { ref: function (el) { refs.current[f + "0"] = el; } }, "0000"),
              h("span", { ref: function (el) { refs.current[f + "4"] = el; } }, "4444")
            ),
            m ? h(DS.Badge, { tone: held ? "success" : "warning", dot: true },
              held ? L("Same width", "Mismo ancho") : L("Off by ", "Difiere ") + L(diff.toFixed(1), diff.toFixed(1).replace(".", ",")) + " px") : h("span", null)
          );
        })
      )
    );
  }

  /* Components: the shared core kit every product flow starts from. */
  function Primitivos() {
    var _c = useState(true), c = _c[0], setC = _c[1];
    var _t = useState(true), t = _t[0], setT = _t[1];
    return h("div", { className: "pf pf-3" },
      h(DS.Card, { heading: L("Actions", "Acciones"), supporting: L("The few ways to move forward", "Las pocas formas de avanzar") },
        h("div", { className: "pf-stack pf-stack--tight" },
          h(DS.Button, { variant: "primary" }, L("Continue", "Continuar")),
          h(DS.Button, { variant: "secondary" }, L("Save draft", "Guardar borrador")),
          h(DS.Button, { variant: "ghost" }, L("Cancel", "Cancelar"))
        )
      ),
      h(DS.Card, { heading: L("Forms", "Formularios"), supporting: L("The controls used every day", "Los controles de cada día") },
        h("div", { className: "pf-stack pf-stack--tight" },
          h(DS.Input, { label: L("Client", "Cliente"), defaultValue: "Ana García" }),
          h(DS.Input, { label: L("Amount", "Importe"), defaultValue: L("250,000", "250.000"), suffix: "€" })
        )
      ),
      h(DS.Card, { heading: L("Selection", "Selección"), supporting: L("Clear states, with motion", "Estados claros, con movimiento") },
        h("div", { className: "pf-stack pf-stack--tight" },
          h(DS.Checkbox, { label: L("Include property", "Incluir inmueble"), checked: c, onChange: setC }),
          h(DS.Toggle, { label: L("Automatic updates", "Actualizaciones automáticas"), active: t, onChange: setT })
        )
      )
    );
  }

  /* Micro-interactions: motion that explains state. Press anything. */
  function Micro() {
    var _c = useState(false), c = _c[0], setC = _c[1];
    var _r = useState("a"), r = _r[0], setR = _r[1];
    var _t = useState(false), t = _t[0], setT = _t[1];
    var _s = useState("idle"), s = _s[0], setS = _s[1];
    useEffect(function () {
      if (s === "sending") { var a = setTimeout(function () { setS("sent"); }, 1200); return function () { clearTimeout(a); }; }
      if (s === "sent") { var b = setTimeout(function () { setS("idle"); }, 1800); return function () { clearTimeout(b); }; }
    }, [s]);
    return h("div", { className: "pf-panel pf-micro" },
      h("div", { className: "pf-states" }, h("p", { className: "pf-caption" }, L("A check that draws itself", "Un check que se dibuja")), h(DS.Checkbox, { label: L("Accept the plan", "Aceptar el plan"), checked: c, onChange: setC })),
      h("div", { className: "pf-states" }, h("p", { className: "pf-caption" }, L("A radio that fills", "Un radio que se llena")),
        h("div", { className: "pf-row pf-row--gap" },
          h(DS.Radio, { label: "A", name: "r", value: "a", selected: r === "a", onChange: function () { setR("a"); } }),
          h(DS.Radio, { label: "B", name: "r", value: "b", selected: r === "b", onChange: function () { setR("b"); } })
        )
      ),
      h("div", { className: "pf-states" }, h("p", { className: "pf-caption" }, L("A toggle that flips", "Un toggle que cambia")), h(DS.Toggle, { label: L("Alerts", "Avisos"), active: t, onChange: setT })),
      h("div", { className: "pf-states" }, h("p", { className: "pf-caption" }, L("A button that sinks", "Un botón que se hunde")), h("div", { className: "pf-row" }, h(DS.Button, { variant: "secondary" }, L("Press me", "Púlsame")))),
      h("div", { className: "pf-states" }, h("p", { className: "pf-caption" }, L("Send, sending, sent", "Enviar, enviando, enviado")),
        h("div", { className: "pf-row" },
          h(DS.Button, {
            variant: "primary",
            loading: s === "sending",
            iconStart: s === "sent" ? h(DS.Icon, { name: "check", size: 16 }) : s === "idle" ? h(DS.Icon, { name: "send", size: 16 }) : undefined,
            onClick: function () { if (s === "idle") setS("sending"); },
          }, s === "idle" ? L("Send", "Enviar") : s === "sending" ? L("Sending", "Enviando") : L("Sent", "Enviado"))
        )
      )
    );
  }

  var BOARDS = {
    lista: Lista,
    dos: DosSignificados,
    uno: UnSignificado,
    principios: Principios,
    roles: Roles,
    tipos: Tipos,
    primitivos: Primitivos,
    micro: Micro,
  };
  var which = document.body.getAttribute("data-board");
  var root = document.getElementById("root");
  var el = h(BOARDS[which] || Lista);
  if (ReactDOM.createRoot) ReactDOM.createRoot(root).render(el);
  else ReactDOM.render(el, root);
})();
