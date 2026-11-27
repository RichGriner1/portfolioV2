/* Portfolio-only boards for the SAREVI case study, built from the real Afi apps
 * components in ds/afi-modern (not screen recordings), so a visitor can use them.
 * <body data-board="controles"> renders the controls; "casas" the two landing cards. */
(function () {
  var DS = window.AfiModernDesignSystem_dc4c68;
  var h = React.createElement;
  var useState = React.useState;

  function Controles() {
    var _t = useState("adosado"), tipo = _t[0], setTipo = _t[1];
    var _m = useState(undefined), muni = _m[0], setMuni = _m[1];
    var _a = useState(true), a = _a[0], setA = _a[1];
    var _b = useState(false), b = _b[0], setB = _b[1];
    var _c = useState(true), c = _c[0], setC = _c[1];
    var _auto = useState(true), auto = _auto[0], setAuto = _auto[1];
    var media = function (t) { return h(DS.PropertyModel, { type: t, active: tipo === t }); };
    return h("div", { className: "pf" },
      h("section", { className: "pf-col" },
        h("p", { className: "pf-label" }, "¿De qué tipo es tu vivienda?"),
        h(DS.ChoiceCardGroup, {
          label: "¿De qué tipo es tu vivienda?",
          name: "tipo",
          value: tipo,
          onChange: setTipo,
          columns: 3,
          options: [
            { value: "piso", title: "Piso", media: media("piso") },
            { value: "adosado", title: "Chalet adosado", media: media("adosado") },
            { value: "chalet", title: "Chalet independiente", media: media("chalet") },
          ],
        }),
        h(DS.Select, {
          label: "¿En qué municipio se encuentra?",
          placeholder: "Selecciona el municipio",
          value: muni,
          onChange: setMuni,
          options: ["Alicante", "Barcelona", "Bilbao", "Córdoba", "Gijón", "Granada", "Madrid", "Málaga", "Sevilla", "Valencia"].map(function (v) { return { value: v, label: v }; }),
        })
      ),
      h("section", { className: "pf-col" },
        h("div", { className: "pf-card" },
        h("p", { className: "pf-label" }, "Medidas"),
        h(DS.Checkbox, { label: "SATE (aislamiento por el exterior)", checked: a, onChange: function () { setA(!a); } }),
        h(DS.Checkbox, { label: "Aislamiento de cubiertas", checked: b, onChange: function () { setB(!b); } }),
        h(DS.Checkbox, { label: "Aerotermia", checked: c, onChange: function () { setC(!c); } }),
        ),
        h("div", { className: "pf-switch" },
          h("div", null,
            h("p", { className: "pf-switch__t" }, "Cálculo automático"),
            h("p", { className: "pf-switch__d" }, auto ? "Usamos una estimación basada en proyectos de referencia." : "Escribe tu propio coste.")
          ),
          h(DS.Toggle, { active: auto, onChange: function () { setAuto(!auto); }, "aria-label": "Cálculo automático" })
        )
      )
    );
  }

  function Casas() {
    return h("div", { className: "pf-casas" },
      h(DS.MediaCard, { title: "Edificio completo", subtitle: "Comunidad de propietarios o bloque de viviendas", action: "Estimación para todo el edificio", actionStyle: "ghost", media: h(DS.PropertyModel, { type: "edificio" }), layout: "horizontal" }),
      h(DS.MediaCard, { title: "Vivienda", subtitle: "Piso o casa unifamiliar", action: "Estimación para tu vivienda", actionStyle: "ghost", media: h(DS.PropertyModel, { type: "vivienda" }), layout: "horizontal" })
    );
  }

  var which = document.body.getAttribute("data-board");
  var root = document.getElementById("root");
  var el = h(which === "casas" ? Casas : Controles);
  if (ReactDOM.createRoot) ReactDOM.createRoot(root).render(el);
  else ReactDOM.render(el, root);
})();
