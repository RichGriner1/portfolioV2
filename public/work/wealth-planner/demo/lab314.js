/* 3.14 element lab: one element per board, replaying the «light pass» reverse-engineered from the reference.
   Reference anatomy (Pulse animation.mov, 60 fps):
   0.00–0.35 s  light rises from the bottom edge inside the surface (a big soft arc, like a horizon), content starts to blur
   0.35–0.55 s  the light peaks and fills most of the surface; content fully out of focus
   0.55–0.95 s  the light falls back to the edges; content pulls back into focus; the status icon scales in with a spring and its mark draws
   0.95–3.00 s  a rim light stays on the edges (one side warm, the other cool), fading slowly
   The pill version: the same light sweeps left → right through the pill while the icon morphs and the text cross-fades. */
(function () {
  const React = window.React, h = React.createElement;
  const NS = () => window.AfiModernDesignSystem_dc4c68 || {};
  const C = (n, p, ...k) => { const X = NS()[n]; return X ? h(X, p, ...k) : null; };
  const I = (name, size) => C('Icon', { name, size: size || 16 });
  const LOOP = 5200;
  /* a figure that changes counts from the old value to the new one, as the content comes back into focus (DS AnimatedNumber) */
  const mEur = (x) => (x / 1e6).toFixed(2).replace('.', ',') + ' M €';
  class Count extends React.Component {
    constructor(p) { super(p); this.state = { v: p.from }; }
    componentDidMount() { this._t = setTimeout(() => this.setState({ v: this.props.to }), this.props.delay || 620); }
    componentWillUnmount() { clearTimeout(this._t); }
    render() { return C('AnimatedNumber', { value: this.state.v, format: this.props.format || mEur, duration: 900 }) || (this.props.format || mEur)(this.state.v); }
  }

  class Lab extends React.Component {
    constructor(p) { super(p); this.state = { run: 0, loop: true }; this.play = this.play.bind(this); }
    componentDidMount() { this._t = setTimeout(this.play, 700); }
    componentWillUnmount() { clearTimeout(this._t); }
    play() { clearTimeout(this._t); this.setState((s) => ({ run: s.run + 1 })); if (this.state.loop) this._t = setTimeout(this.play, this.props.el === 'iconflow' ? 7600 : LOOP); }
    toggle() { const loop = !this.state.loop; this.setState({ loop }); clearTimeout(this._t); if (loop) this._t = setTimeout(this.play, 400); }
    spec() {
      const el = this.props.el || 'tab', k = 'r' + this.state.run;
      const tab = (icon, title, fig, sub, chip, on, hit) => h('div', { className: 'lab-tab' + (on ? ' is-on' : '') + (hit ? ' lab-hit' : '') },
        hit ? h('span', { className: 'lab-bloom', 'aria-hidden': true }) : null, hit ? h('span', { className: 'lab-rim', 'aria-hidden': true }) : null,
        h('div', { className: 'lab-in' }, h('span', { className: 'lab-tab__h' }, h('span', { className: 'lab-ic' + (hit ? ' lab-ic--hit' : '') }, I(icon, 14)), title),
          h('strong', null, fig), h('span', { className: 'lab-tab__s' }, sub), chip ? h('span', { className: 'lab-chip' + (hit ? ' lab-chip--hit' : '') }, I('flask-conical', 12), chip) : h('span', { className: 'lab-chip is-empty' }, ' ')));
      /* the plan switcher as it is now: a two-line segmented control; the change sits on the figure line */
      if (el === 'tab') return h('div', { key: k, className: 'lab-row lab-row--seg' },
        tab('landmark', 'Patrimonio y legado', h(React.Fragment, null, '3,6 M € ', h('em', null, '−47.000 €')), '', null, true, true),
        tab('droplets', 'Liquidez', h(React.Fragment, null, h('em', null, '→ sin déficit')), '', null, false, true),
        tab('percent', 'Rentabilidad', '4,6 %', '', null, false, false));
      if (el === 'section' || el === 'section2') return h('div', { key: k, className: 'lab-col' },
        h('div', { className: 'lab-sec lab-hit' + (el === 'section2' ? ' lab-v2' : '') }, h('span', { className: 'lab-bloom' + (el === 'section2' ? '' : ' lab-bloom--soft'), 'aria-hidden': true }), h('span', { className: 'lab-rim', 'aria-hidden': true }),
          h('div', { className: 'lab-in' }, h('h4', null, 'Evolución hasta los 100 años'), h('p', { className: 'lab-delta' }, I('flask-conical', 12), h('s', null, '2,10 M €'), I('arrow-right', 12), h('b', null, '5,40 M €'), h('em', null, '+3,30 M €')),
            h('div', { className: 'lab-fig' }, h(Count, { from: 2100000, to: 5400000 })), h('div', { className: 'lab-bars' }, Array.from({ length: 28 }, (_, i) => h('i', { key: i, style: { height: (40 + Math.sin(i / 4) * 18 + i) + 'px' } }))))));
      if (el === 'icon') return h('div', { key: k, className: 'lab-icons' },
        ['Reposo', 'Trabajando', 'Llega el cambio', 'Asentado'].map((t, i) => h('figure', { key: t, className: 'lab-icfig' },
          h('span', { className: 'lab-ic lab-ic--xl lab-ic--s' + i }, I(i === 3 ? 'check' : 'landmark', 22)), h('figcaption', null, t))));
      /* danger: the destructive buttons, every state side by side */
      if (el === 'danger') {
        const st = (label, cls, kids) => h('div', { className: 'lab-dg__cell' }, h('div', { className: 'lab-dg__btn' }, kids), h('small', null, label));
        const row = (title, note, cells) => h('div', { className: 'lab-dg__row' }, h('div', { className: 'lab-dg__h' }, h('strong', null, title), h('span', null, note)), h('div', { className: 'lab-dg__cells' }, cells));
        const B = (extra, label, icon, variant) => C('Button', { variant: variant || 'ghost', size: 'sm', className: extra, iconStart: icon ? I(icon, 14) : undefined }, label);
        return h('div', { key: k, className: 'lab-dg' },
          row('1 · Acción destructiva', 'Botón fantasma rojo, a la izquierda, lejos de la acción principal.', [
            st('Reposo', '', B('r4-danger', 'Eliminar', 'trash-2')), st('Al pasar el ratón', '', B('r4-danger is-hover', 'Eliminar', 'trash-2')), st('Foco', '', B('r4-danger is-focus', 'Eliminar', 'trash-2')), st('Sin icono', '', B('r4-danger', 'Descartar')), st('Desactivado', '', C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', disabled: true, iconStart: I('archive', 14) }, 'Archivar'))]),
          row('2 · Confirmación', 'Secundario rojo suave, en el mismo sitio, tras pulsar la acción.', [
            st('Reposo', '', B('r4-danger-soft', 'Sí, eliminar', 'trash-2', 'secondary')), st('Al pasar el ratón', '', B('r4-danger-soft is-hover', 'Sí, eliminar', 'trash-2', 'secondary'))]),
          row('3 · Diálogo', 'Solo cuando no se puede deshacer: el botón principal del diálogo.', [
            st('Reposo', '', C('Button', { variant: 'destructive', size: 'sm', iconStart: I('trash-2', 14) }, 'Eliminar la planificación'))]));
      }
      /* panel: the whole plan panel on «Aplicar» — the dots wave in behind, the light rises, holds and bursts out,
         the changed parts fill with the gradient and the figure counts */
      if (el === 'panel') return h('div', { key: k, className: 'lab-col lab-col--c lab-col--panel' },
        h('div', { className: 'lab-frame lab-hit lab-v2 lab-panel' }, h('div', { className: 'lab-grid', 'aria-hidden': true }),
          h('span', { className: 'lab-bloom', 'aria-hidden': true }), h('span', { className: 'lab-rim lab-rim--frame', 'aria-hidden': true }),
          h('div', { className: 'lab-in' }, h('div', { className: 'lab-frame__h' }, h('strong', null, 'El plan'), h('span', { className: 'lab-ok' }, I('check', 14))),
            h('p', null, 'El legado se cubre y la liquidez alcanza todos los años.'),
            h('div', { className: 'lab-row lab-row--seg' },
              tab('landmark', 'Patrimonio y legado', '3,65 M €', '', null, true, true),
              tab('droplets', 'Liquidez', 'Sin déficit', '', null, false, true),
              tab('percent', 'Rentabilidad', '4,6 %', '', null, false, false)),
            h('div', { className: 'lab-pcard' }, h('h4', null, 'Evolución hasta los 100 años'),
              h('div', { className: 'lab-fig' }, h(Count, { from: 2100000, to: 3650000, delay: 700 })),
              h('div', { className: 'lab-bars' }, Array.from({ length: 28 }, (_, i) => h('i', { key: i, style: { height: (26 + Math.sin(i / 4) * 12 + i * .7) + 'px' } })))))));
      /* iconflow: the icon inside the real switcher, through every state, each one growing out of the one before */
      if (el === 'iconflow') {
        const seg = (icon, name, a, b, c2, ai, on) => h('div', { className: 'lf-seg' + (on ? ' is-on' : '') + (ai ? ' is-ai' : '') },
          h('span', { className: 'lf-ic' }, I(icon, 16)),
          h('span', { className: 'lf-name' }, name),
          h('span', { className: 'lf-fig' }, h('span', { className: 'lf-a' }, a), h('span', { className: 'lf-b' }, b), h('span', { className: 'lf-c' }, c2)));
        return h('div', { key: k, className: 'lab-col lab-col--c lf' },
          h('div', { className: 'lf-track' },
            seg('landmark', 'Patrimonio y legado', '3,6 M €', h(React.Fragment, null, '3,6 M € ', h('em', null, '−47.000 €')), '3,55 M €', true, false),
            seg('droplets', 'Liquidez', '3 años de déficit', h(React.Fragment, null, h('em', null, '→ sin déficit')), 'Sin déficit', true, true),
            seg('percent', 'Rentabilidad', '4,6 %', '4,6 %', '4,6 %', false, false)),
          h('ol', { className: 'lf-steps' }, ['Reposo', 'Trabajando', 'Llega el cambio', 'Simulación', 'Aplicado'].map((x, i) => h('li', { key: x, className: 'lf-s' + i }, h('b', null, i + 1), x))),
          h('p', { className: 'lf-note' }, 'El icono es el de cada parte del plan, el mismo que se ve con el plan plegado. Cada estado nace del anterior: el contorno de la simulación se dibuja sobre el icono en reposo, y al aplicar el relleno sube desde ese contorno con la luz.'));
      }
      if (el === 'grid') return h('div', { key: k, className: 'lab-gridwrap' }, h('div', { className: 'lab-grid' }), h('div', { className: 'lab-gridcard' }, h('strong', null, 'Patrimonio hoy'), h('div', { className: 'lab-fig' }, '3,64 M €')), h('div', { className: 'lab-gridcard lab-gridcard--b' }, h('strong', null, 'Evolución hasta los 100 años'), h('div', { className: 'lab-fig' }, '3,65 M €')));
      if (el === 'toast') return h('div', { key: k, className: 'lab-col lab-col--c' },
        h('div', { className: 'lab-pill' }, h('span', { className: 'lab-sweep', 'aria-hidden': true }),
          h('span', { className: 'lab-pill__ic' }, h('span', { className: 'lab-pill__spin' }, I('loader-circle', 18)), h('span', { className: 'lab-pill__ok' }, I('check', 18))),
          h('span', { className: 'lab-pill__txt' }, h('span', { className: 'lab-pill__a' }, h('strong', null, 'Aplicando la simulación…'), h('small', null, 'Venta de Casa Sotogrande')),
            h('span', { className: 'lab-pill__b' }, h('strong', null, 'Cambios aplicados al plan'), h('small', null, 'Legado medio 3,65 M € · sin déficit'))),
          h('span', { className: 'lab-pill__btn' }, 'Ver')));
      /* apply: a small plan frame; apply2 = the reference's timing (rise, hold, recede) with a three-layer band */
      return h('div', { key: k, className: 'lab-col lab-col--c' },
        h('div', { className: 'lab-frame lab-hit' + (el === 'apply2' ? ' lab-v2' : '') }, h('span', { className: 'lab-bloom', 'aria-hidden': true }), h('span', { className: 'lab-rim lab-rim--frame', 'aria-hidden': true }),
          h('div', { className: 'lab-in' }, h('div', { className: 'lab-frame__h' }, h('strong', null, 'El plan'), h('span', { className: 'lab-ok' }, I('check', 14))),
            h('p', null, 'El legado se cubre y la liquidez alcanza todos los años.'),
            h('div', { className: 'lab-row lab-row--sm' }, tab('landmark', 'Patrimonio y legado', '3,6 M €', 'legado medio · 3 de 3', null, true, false), tab('droplets', 'Liquidez', 'Suficiente', 'todos los años', null, false, false)))));
    }
    render() {
      const T = { tab: 'Selector del plan · la luz sube por cada parte que cambia y deja el icono teñido', section: 'Sección que cambia · luz suave y borde, sin arco', icon: 'Icono · reposo, trabajando, llega el cambio, asentado', grid: 'Cuadrícula · los puntos se encienden en ola y quedan tenues', toast: 'Aviso al aplicar · barrido de luz, el icono cambia y el texto se funde', apply: 'Aplicar · la luz recorre todo el plan y deja el marco encendido', section2: 'Sección con gráfico · la misma luz que «Aplicar»: sube de un tirón y sale por los bordes', danger: 'Botones destructivos · rojo oscuro en el texto y el icono; el borde rojo claro aparece al pasar el ratón', panel: 'Panel completo · al aplicar: los puntos entran en ola, la luz recorre el plan y las partes que cambian se llenan', iconflow: 'Icono en la pestaña · todo el recorrido, de reposo a aplicado', apply2: 'Aplicar · la luz sube de un tirón y sale por los bordes; azul profundo, azul Afi y brillo' };
      return h('div', { className: 'lab' + (this.props.hue ? ' lab--' + this.props.hue : '') },
        h('header', { className: 'lab-head' }, h('span', null, T[this.props.el || 'tab']), this.props.hue ? h('span', { className: 'lab-hue' }, h('i'), { indigo: 'IA · azul → índigo', violet: 'IA · azul → violeta → rosa', hint: 'IA · azul Afi con un toque de violeta y rosa' }[this.props.hue]) : null, h('span', { className: 'lab-sp' }),
          C('Button', { variant: 'ghost', size: 'sm', onClick: () => this.toggle() }, this.state.loop ? 'Pausar bucle' : 'En bucle'),
          C('Button', { variant: 'primary', size: 'sm', iconStart: I('rotate-ccw', 14), onClick: this.play }, 'Repetir')),
        h('div', { className: 'lab-stage' }, this.spec()));
    }
  }
  window.WPLab = { Lab };
})();
