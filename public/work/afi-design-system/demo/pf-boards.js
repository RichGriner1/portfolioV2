/* Portfolio-only boards for the Afi Design System case study, built from the real
 * Afi apps components in ds/afi-apps, so a visitor can use them. Every name, figure
 * and comment on them is made up. <body data-board="…"> picks the board.
 * Token values are read from the page at run time, so they always match the skin. */
(function () {
  var DS = window.AfiModernDesignSystem_dc4c68;
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;

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

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // The token files say which primitive each semantic token points at. Parsing the
  // shipped CSS, rather than writing the chain out by hand, keeps the boards honest.
  var refs = {};
  // Read in document order, so a skin loaded later overrides the one before it.
  var refsReady = Promise.all(
    [].slice
      .call(document.querySelectorAll("link[data-tokens]"))
      .map(function (l) { return fetch(l.href).then(function (r) { return r.text(); }); })
  ).then(function (texts) {
    texts.forEach(function (t) {
      var re = /(--[a-z0-9-]+)\s*:\s*var\((--[a-z0-9-]+)\)/g;
      var m;
      while ((m = re.exec(t))) refs[m[1]] = m[2];
    });
  });
  function useRefs() {
    var _r = useState(false), ready = _r[0], setReady = _r[1];
    useEffect(function () { refsReady.then(function () { setReady(true); }); }, []);
    return ready;
  }
  function chain(token) {
    var out = [token];
    var t = token;
    for (var i = 0; i < 4 && refs[t]; i++) { t = refs[t]; out.push(t); }
    return out;
  }
  function hex(v) {
    var m = /rgba?\(([^)]+)\)/.exec(v);
    if (!m) return v;
    var p = m[1].split(",").map(function (s) { return parseFloat(s); });
    return "#" + p.slice(0, 3).map(function (n) { return ("0" + Math.round(n).toString(16)).slice(-2); }).join("");
  }

  function valueCell(v) {
    var isColor = /^(#|rgb)/.test(v);
    return h("span", { className: "pf-value" }, isColor && h("i", { style: { background: v } }), hex(v));
  }

  var RIESGO = [
    { value: "conservador", label: L("Conservative", "Conservador") },
    { value: "moderado", label: L("Moderate", "Moderado") },
    { value: "dinamico", label: L("Aggressive", "Dinámico") },
  ];

  /* Context: a handful of the system's components, as a product would use them. */
  function Sistema() {
    var _p = useState("moderado"), perfil = _p[0], setPerfil = _p[1];
    var _a = useState(true), aviso = _a[0], setAviso = _a[1];
    return h("div", { className: "pf pf-2" },
      h(DS.Card, { heading: L("New simulation", "Nueva simulación"), supporting: L("Sample client", "Cliente de ejemplo") },
        h("div", { className: "pf-stack" },
          h(DS.Input, { label: L("Net worth", "Patrimonio"), defaultValue: L("250,000", "250.000"), suffix: "€", size: "lg" }),
          h("div", { className: "pf-stack pf-stack--tight" },
            h("p", { className: "pf-label" }, L("Risk profile", "Perfil de riesgo")),
            h(DS.SegmentedControl, { options: RIESGO, value: perfil, onChange: setPerfil })
          ),
          h(DS.Toggle, { label: L("Notify the client", "Avisar al cliente"), active: aviso, onChange: setAviso }),
          h("div", { className: "pf-row pf-row--end" },
            h(DS.Button, { variant: "secondary", size: "lg" }, L("Save", "Guardar")),
            h(DS.Button, { variant: "primary", size: "lg" }, L("Calculate", "Calcular"))
          )
        )
      ),
      h("div", { className: "pf-stack" },
        h(DS.MetricCard, { variant: "tile", label: L("Capital in 10 years", "Capital a 10 años"), value: L("€312,400", "312.400 €"), trend: L("+4.2%", "+4,2 %"), trendTone: "success", lastUpdate: "" }),
        h(DS.Card, { heading: L("Status", "Estado") },
          h("div", { className: "pf-row pf-row--wrap" },
            h(DS.Badge, { tone: "success", dot: true }, L("Active", "Activo")),
            h(DS.Badge, { tone: "warning", dot: true }, L("Review", "Revisar")),
            h(DS.Badge, { tone: "info", dot: true }, L("Draft", "Borrador")),
            h(DS.Tag, null, L("Retirement", "Jubilación"))
          )
        )
      )
    );
  }

  /* The problem: three places an answer could be, none of them the same for everyone. */
  function Lugares() {
    return h("div", { className: "pf pf-3" },
      h(DS.Card, { heading: "Figma", supporting: L("Each permission sees something different", "Cada permiso ve una cosa distinta") },
        h("div", { className: "pf-stack pf-stack--tight" },
          h("div", { className: "pf-person" }, h(DS.Avatar, { initials: "AR", size: "sm" }), h("span", null, L("Developer", "Programador")), h(DS.Badge, { tone: "neutral" }, L("View", "Ver"))),
          h("div", { className: "pf-person" }, h(DS.Avatar, { initials: "MV", size: "sm" }), h("span", null, L("Lead developer", "Programadora jefe")), h(DS.Badge, { tone: "info" }, L("Edit", "Editar"))),
          h("div", { className: "pf-person" }, h(DS.Avatar, { initials: "JP", size: "sm" }), h("span", null, L("Analyst", "Analista")), h(DS.Badge, { tone: "neutral" }, L("View", "Ver")))
        )
      ),
      h(DS.Card, { heading: L("Flows", "Flujos"), supporting: L("Teams use the screens, not the components", "Se usan las pantallas, no los componentes") },
        h("div", { className: "pf-row pf-row--wrap" },
          h(DS.Tag, null, L("Client onboarding", "Alta de cliente")),
          h(DS.Tag, null, L("Simulation", "Simulación")),
          h(DS.Tag, null, L("Summary", "Resumen")),
          h(DS.Tag, { kind: "system" }, L("Components", "Componentes"))
        )
      ),
      h(DS.Card, { heading: L("The designer", "El diseñador"), supporting: L("Component questions go to one person", "Las dudas de componentes llegan a una persona") },
        h("div", { className: "pf-row pf-row--wrap" },
          h(DS.Badge, { tone: "warning", dot: true }, L("States", "Estados")),
          h(DS.Badge, { tone: "warning", dot: true }, L("Spacing", "Espaciado")),
          h(DS.Badge, { tone: "warning", dot: true }, "Tokens")
        )
      )
    );
  }

  /* The question: a component's own page, with the tokens it consumes. */
  var CONSUMED = [
    "--brand-background-default",
    "--background-surface",
    "--content-primary",
    "--borders-default",
  ];
  function Pagina() {
    var ready = useRefs();
    var _v = useState("moderado"), v = _v[0], setV = _v[1];
    return h("div", { className: "pf-panel pf-stack" },
      h(DS.Breadcrumb, { items: [{ label: L("Components", "Componentes") }, { label: "Segmented control" }] }),
      h("div", { className: "pf-preview" },
        h(DS.SegmentedControl, { options: RIESGO, value: v, onChange: setV })
      ),
      h("p", { className: "pf-label" }, L("Tokens consumed", "Tokens consumidos")),
      ready && h(DS.Table, {
        density: "compact",
        columns: [
          { key: "token", label: "Token", render: function (r) { return h("code", null, r.token); } },
          { key: "valor", label: L("Value", "Valor"), render: function (r) { return valueCell(r.valor); } },
        ],
        rows: CONSUMED.map(function (t, i) { return { id: i, token: t, valor: cssVar(t) }; }),
      })
    );
  }

  /* Three tiers: a primitive, the semantic role that points at it, the component that reads the role. */
  function Niveles() {
    var ready = useRefs();
    if (!ready) return null;
    var c = chain("--brand-background-default");
    var prim = c[c.length - 1];
    var val = cssVar(prim);
    return h("div", { className: "pf pf-3 pf-tiers" },
      h(DS.Card, { heading: L("Primitive", "Primitivo"), supporting: L("The value, named", "El valor, con nombre") },
        h("div", { className: "pf-swatch", style: { background: val } }),
        h("code", null, prim), h("p", { className: "pf-caption" }, hex(val))
      ),
      h(DS.Card, { heading: L("Semantic", "Semántico"), supporting: L("What it's for", "Para qué sirve") },
        h("div", { className: "pf-swatch", style: { background: "var(--brand-background-default)" } }),
        h("code", null, c[0]), h("p", { className: "pf-caption" }, "→ " + prim)
      ),
      h(DS.Card, { heading: L("Component", "Componente"), supporting: L("Who reads it", "Quién lo lee") },
        h("div", { className: "pf-preview pf-preview--small" }, h(DS.Button, { variant: "primary", size: "lg" }, L("Calculate", "Calcular"))),
        h("code", null, "Button primary"), h("p", { className: "pf-caption" }, "→ " + c[0])
      )
    );
  }

  /* One component, two brands: the same card, the skin set by the page. */
  function Marca() {
    var _p = useState("moderado"), perfil = _p[0], setPerfil = _p[1];
    var _a = useState(true), aviso = _a[0], setAviso = _a[1];
    return h(DS.Card, { heading: L("New simulation", "Nueva simulación"), supporting: L("Sample client", "Cliente de ejemplo") },
      h("div", { className: "pf-stack" },
        h(DS.Input, { label: L("Net worth", "Patrimonio"), defaultValue: L("250,000", "250.000"), suffix: "€", size: "lg" }),
        h(DS.SegmentedControl, { options: RIESGO, value: perfil, onChange: setPerfil }),
        h(DS.Toggle, { label: L("Notify the client", "Avisar al cliente"), active: aviso, onChange: setAviso }),
        h("div", { className: "pf-row pf-row--end" },
          h(DS.Button, { variant: "secondary", size: "lg" }, L("Save", "Guardar")),
          h(DS.Button, { variant: "primary", size: "lg" }, L("Calculate", "Calcular"))
        )
      )
    );
  }

  /* States: every state of a few components, side by side. */
  function Estados() {
    var _c = useState(true), c = _c[0], setC = _c[1];
    var _t = useState(true), t = _t[0], setT = _t[1];
    return h("div", { className: "pf-panel pf-stack" },
      h("div", { className: "pf-states" },
        h("p", { className: "pf-label" }, L("Button", "Botón")),
        h("div", { className: "pf-row pf-row--wrap" },
          h(DS.Button, { variant: "primary" }, L("Primary", "Primario")),
          h(DS.Button, { variant: "secondary" }, L("Secondary", "Secundario")),
          h(DS.Button, { variant: "ghost" }, L("Ghost", "Fantasma")),
          h(DS.Button, { variant: "primary", disabled: true }, L("Disabled", "Desactivado")),
          h(DS.Button, { variant: "primary", loading: true }, L("Loading", "Cargando"))
        )
      ),
      h("div", { className: "pf-states" },
        h("p", { className: "pf-label" }, L("Field", "Campo")),
        h("div", { className: "pf-grid-3" },
          h(DS.Input, { label: L("Default", "Por defecto"), placeholder: "0", suffix: "€" }),
          h(DS.Input, { label: L("With error", "Con error"), defaultValue: "-50", suffix: "€", error: L("Must be more than 0", "Debe ser mayor que 0") }),
          h(DS.Input, { label: L("Disabled", "Desactivado"), defaultValue: L("1,200", "1.200"), suffix: "€", disabled: true })
        )
      ),
      h("div", { className: "pf-states" },
        h("p", { className: "pf-label" }, L("Selection", "Selección")),
        h("div", { className: "pf-row pf-row--wrap pf-row--gap" },
          h(DS.Checkbox, { label: L("Checked", "Marcada"), checked: c, onChange: setC }),
          h(DS.Checkbox, { label: L("Disabled", "Desactivada"), checked: false, disabled: true }),
          h(DS.Toggle, { label: L("Active", "Activo"), active: t, onChange: setT }),
          h(DS.Toggle, { label: L("Disabled", "Desactivado"), active: false, disabled: true })
        )
      )
    );
  }

  /* Inspector: click a field, read what it is made of, in both vocabularies. */
  var INSPECT = [
    { prop: L("Background", "Fondo"), token: "--background-surface" },
    { prop: L("Text", "Texto"), token: "--content-primary" },
    { prop: L("Border", "Borde"), token: "--borders-default" },
    { prop: L("Corners", "Esquinas"), token: "--radius-lg" },
    { prop: L("Action", "Acción"), token: "--brand-background-default" },
  ];
  function Inspector() {
    var ready = useRefs();
    return h("div", { className: "pf pf-inspect" },
      h("div", { className: "pf-panel pf-target" },
        h(DS.Input, { label: L("Net worth", "Patrimonio"), defaultValue: L("250,000", "250.000"), suffix: "€", size: "lg" }),
        h("div", { className: "pf-row pf-row--end" }, h(DS.Button, { variant: "primary", size: "lg" }, L("Calculate", "Calcular")))
      ),
      h(DS.Card, { heading: L("Inspect", "Inspección"), supporting: L("Token, primitive and value", "Token, primitivo y valor") },
        ready && h(DS.Table, {
          density: "compact",
          columns: [
            { key: "prop", label: L("Property", "Propiedad") },
            { key: "token", label: "Token", render: function (r) { return h("code", null, r.token); } },
            { key: "prim", label: L("Primitive", "Primitivo"), render: function (r) { return h("code", null, r.prim); } },
            { key: "valor", label: L("Value", "Valor"), render: function (r) { return valueCell(r.valor); } },
          ],
          rows: INSPECT.map(function (r, i) {
            var c = chain(r.token);
            return { id: i, prop: r.prop, token: r.token, prim: c.length > 1 ? c[c.length - 1] : "—", valor: cssVar(r.token) };
          }),
        })
      )
    );
  }

  /* Downloads: the token sets and skills, where anyone can reach them. */
  var FILES = [
    { name: "afi-tokens.json", meta: L("Three tiers", "Tres niveles") },
    { name: "afi-tokens.css", meta: L("CSS variables", "Variables CSS") },
    { name: L("skill-components.md", "skill-componentes.md"), meta: L("AI skill", "Skill para IA") },
  ];
  function Descargas() {
    return h(DS.Card, { heading: L("Downloads", "Descargas"), supporting: L("Token sets and skills", "Sets de tokens y skills") },
      h("div", { className: "pf-stack pf-stack--tight" },
        FILES.map(function (f) {
          return h("div", { className: "pf-file", key: f.name },
            h(DS.FileChip, { name: f.name, meta: f.meta }),
            h(DS.Button, { variant: "ghost", iconStart: h(DS.Icon, { name: "download", size: 16 }) }, L("Download", "Descargar"))
          );
        })
      )
    );
  }

  /* Feedback: a comment pinned to a field, then exported to a file. */
  function Comentario() {
    return h("div", { className: "pf pf-comment" },
      h("div", { className: "pf-panel pf-target" },
        h("div", { className: "pf-pinned" },
          h(DS.Input, { label: L("Tax residence", "Residencia fiscal"), defaultValue: L("Spain", "España"), size: "lg" }),
          h("span", { className: "pf-pin", "aria-hidden": true }, "1")
        ),
        h(DS.Input, { label: L("Date of birth", "Fecha de nacimiento"), defaultValue: "12/03/1968", size: "lg" })
      ),
      h("div", { className: "pf-stack" },
        h(DS.Card, null,
          h("div", { className: "pf-stack pf-stack--tight" },
            h("div", { className: "pf-person" }, h(DS.Avatar, { initials: "LM", size: "sm" }), h("strong", null, "Lucía M."), h(DS.Badge, { tone: "info", dot: true }, L("Open", "Abierto"))),
            h("code", { className: "pf-caption" }, L("Field · Tax residence", "Field · Residencia fiscal")),
            h("p", { className: "pf-text" }, L("The help text doesn't say what happens if the client lives abroad.", "La ayuda de este campo no explica qué pasa si el cliente vive fuera."))
          )
        ),
        h(DS.FileChip, { name: L("comments.md", "comentarios.md"), meta: L("Exported · 1 comment", "Exportado · 1 comentario") })
      )
    );
  }

  var BOARDS = {
    sistema: Sistema,
    lugares: Lugares,
    pagina: Pagina,
    niveles: Niveles,
    marca: Marca,
    estados: Estados,
    inspector: Inspector,
    descargas: Descargas,
    comentario: Comentario,
  };
  var which = document.body.getAttribute("data-board");
  var root = document.getElementById("root");
  var el = h(BOARDS[which] || Sistema);
  if (ReactDOM.createRoot) ReactDOM.createRoot(root).render(el);
  else ReactDOM.render(el, root);
})();
