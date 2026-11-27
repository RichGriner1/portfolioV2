/* Wealth Planner workstation v3 on the Afi apps DS (experiment, 2026-11-26).
 * Same lists as v2 (extends WPRows2.App). What changes: «El plan» is its own surface beside the page, not a card in it,
 * so it stays on every page; it is resizable (drag its edge, or the buttons): cerrado (a strip), estrecho (figures),
 * medio (figures + small charts), mitad (full charts with Gráfico | Tabla). At «mitad» the menu folds to icons on its own;
 * the menu also folds by hand. Props: estado (JSON patch: size, railC, screen…), hold. */
(() => {
  if (!window.React || !window.WPRows2 || window.WPRows3) return;
  document.documentElement.setAttribute('data-r3', '');
  const h = React.createElement;
  const NS = () => window.AfiModernDesignSystem_dc4c68 || {};
  const C = (name, props, ...kids) => { const X = NS()[name]; return X ? h(X, props, ...kids) : null; };
  const I = (name, size) => C('Icon', { name, size: size || 16 });
  const fmt = (n) => Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const eur = (n) => (n < 0 ? '−' : '') + fmt(n) + ' €';
  const meur = (n) => (n / 1e6).toFixed(2).replace('.', ',') + ' M €';
  const mshort = (n) => (n / 1e6).toFixed(1).replace('.', ',') + ' M';
  const A = (value, f, d) => C('AnimatedNumber', { value, decimals: d || 0, format: f || ((x) => eur(x)) });
  const GOAL = 1200000, BASE_YEAR = (1600 + 2600) * 12;
  const PER_YEAR = { Mensual: 12, Trimestral: 4, Anual: 1 };
  const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
  const GROUPS = [{ value: 'inm', label: 'Inmobiliario' }, { value: 'inv', label: 'Inversiones' }, { value: 'pen', label: 'Planes de pensiones' }, { value: 'liq', label: 'Liquidez' }];
  const COL = { inm: 'var(--chart-primary-primary)', inv: 'var(--chart-primary-secondary)', pen: 'var(--color-info-300)', liq: 'var(--chart-primary-tertiary)' };
  const NOTES = [['Revisar la venta del piso de Marbella antes de 2029.', '24/11/2026'], ['El cliente quiere mantener el local de Castellana como renta.', '12/11/2026'], ['Pareja: jubilación prevista a los 63.', '03/11/2026'], ['Primera reunión: legado de 1,2 M € para los dos hijos.', '28/10/2026']];
  const AGES = ['2026', '2031', '2036', '2041', '2046', '2051', '2056', '2061', '2066'];
  const SHAPE = [1, 1.1, 1.18, 1.22, 1.12, 1.04, 1.0, 0.98, 0.96];
  const LIQ_BASE = [6200, 5800, 5400, 4900, 3100, -8400, -5200, -1300, 2400, 3600, 4100, 4800, 5200, 5600, 6000];
  const LIQ_YEARS = LIQ_BASE.map((_, i) => String(2027 + i));
  const SIZES = ['closed', 'narrow', 'medium', 'wide'];
  const NAMES = { closed: 'cerrado', narrow: 'estrecho', medium: 'medio', wide: 'mitad de la pantalla' };
  const PAGES = { gastos: 'Gastos', legado: 'Legado y liquidez', jubilacion: 'Jubilación', aa: 'Asset allocation', gl: 'Generación de liquidez' };

  class App extends window.WPRows2.App {
    constructor(props) {
      super(props);
      this.state = Object.assign({ size: 'medium', railC: null, drag: null }, this.state);
      this.onMove = this.onMove.bind(this); this.onUp = this.onUp.bind(this); this.onResize = () => this.forceUpdate();
    }
    componentDidMount() { super.componentDidMount(); window.addEventListener('resize', this.onResize); }
    componentWillUnmount() { super.componentWillUnmount(); window.removeEventListener('resize', this.onResize); this.onUp(); }

    /* ---------- sizes ---------- */
    railCollapsed() { const s = this.state; return s.railC != null ? s.railC : s.size === 'wide'; }
    px(size) {
      const rail = this.railCollapsed() ? 72 : 264, avail = (window.innerWidth || 1440) - rail - 16 * 2 - 12;
      return { closed: 64, narrow: 360, medium: 480, wide: Math.max(560, Math.round(avail / 2)) }[size];
    }
    width() { return this.state.drag != null ? this.state.drag : this.px(this.state.size); }
    mode() { const w = this.width(); return w < 160 ? 'closed' : w < 420 ? 'narrow' : w < 540 ? 'medium' : 'wide'; }
    setSize(size) { this.setState({ size, drag: null }); }
    step(d) { const i = SIZES.indexOf(this.state.size); this.setSize(SIZES[Math.max(0, Math.min(SIZES.length - 1, i + d))]); }
    onDown(e) { e.preventDefault(); this._right = e.currentTarget.parentElement.getBoundingClientRect().right; this.setState({ drag: this.width() }); window.addEventListener('pointermove', this.onMove); window.addEventListener('pointerup', this.onUp); }
    onMove(e) { this.setState({ drag: Math.max(64, Math.min(this._right - e.clientX - 6, (window.innerWidth || 1440) * 0.62)) }); }
    onUp() {
      window.removeEventListener('pointermove', this.onMove); window.removeEventListener('pointerup', this.onUp);
      if (this.state.drag == null) return;
      const w = this.state.drag; let best = 'narrow', d = 1e9;
      SIZES.forEach((k) => { const dd = Math.abs(this.px(k) - w); if (dd < d) { d = dd; best = k; } });
      this.setSize(best);
    }
    onHandleKey(e) { if (e.key === 'ArrowLeft') { e.preventDefault(); this.step(1); } if (e.key === 'ArrowRight') { e.preventDefault(); this.step(-1); } }

    /* the list drops a column when the page surface gets narrow */
    narrowList() { const rail = this.railCollapsed() ? 72 : 264; return (window.innerWidth || 1440) - rail - this.width() - 16 * 2 - 12 - 64 < 720; }

    /* ---------- the plan's numbers, with the yearly series for the charts ---------- */
    series(v) {
      const medio = SHAPE.map((s, i) => Math.round(v.pat * s + (v.legado - v.pat * SHAPE[8]) * (i / 8)));
      return {
        legado: [
          { name: 'Optimista', values: medio.map((x, i) => Math.round(x * (1 + 0.045 * i))) },
          { name: 'Medio', values: medio },
          { name: 'Pesimista', values: medio.map((x, i) => Math.round(x * (1 - 0.03 * i))) },
          { name: 'Objetivo', values: AGES.map(() => GOAL), dashed: true, reference: true }],
        liq: v.net.map((value, i) => ({ label: LIQ_YEARS[i], value }))
      };
    }
    live() {
      const e = this.effect(), s = this.state;
      let year = s.inc.filter((r) => !r.ended && r.desde !== 'Jubilación').reduce((t, r) => t + num(r.importe) * PER_YEAR[r.freq], 0);
      if (s.adding && s.screen === 'ingresos' && s.draft && num(s.draft.importe) > 0) year += num(s.draft.importe) * PER_YEAR[s.draft.freq || 'Mensual'];
      const K = (year - BASE_YEAR) / (900 * 12);
      const net = LIQ_BASE.map((v) => K >= 1 ? Math.max(v + Math.round(10500 * K), 2100) : Math.round(v + 10500 * K));
      const live = this.pvHold({ legado: e.legado, def: e.def, worst: e.worst, cubren: e.cubren, sinDef: e.sinDef, pat: e.pat, groups: e.groups, draft: e.draft, net });
      return { v: live.vals, busy: live.busy || !!this.props.hold };
    }

    /* ---------- El plan ---------- */
    plan() {
      const s = this.state, mode = this.mode(), { v, busy } = this.live();
      const head = (kids) => h('div', { className: 'r3-plan__head' }, kids);
      const tools = h('span', { className: 'r3-tools' },
        C('IconButton', { variant: 'ghost', size: 'sm', label: 'Reducir el plan', onClick: () => this.step(-1) }, I('chevrons-right')),
        mode !== 'wide' ? C('IconButton', { variant: 'ghost', size: 'sm', label: 'Ampliar el plan', onClick: () => this.step(1) }, I('chevrons-left')) : null,
        C('IconButton', { variant: 'ghost', size: 'sm', label: 'Cerrar el plan', onClick: () => this.setSize('closed') }, I('panel-right-close')));
      if (mode === 'closed') {
        return h('div', { className: 'r3-strip' },
          C('IconButton', { variant: 'ghost', size: 'sm', label: 'Abrir el plan', onClick: () => this.setSize('narrow') }, I('panel-right-open')),
          h('div', { className: 'r3-strip__fig' + (busy ? ' is-busy' : '') }, h('small', null, 'Legado'), h('strong', null, A(v.legado, mshort, 1))),
          h('div', { className: 'r3-strip__fig' + (busy ? ' is-busy' : '') }, h('small', null, 'Liquidez'), C('Dot', { color: v.def ? 'var(--warning-foreground, var(--color-warning-500))' : 'var(--success-foreground, var(--color-success-500))' }), h('strong', null, v.def ? v.def + ' años' : 'OK')));
      }
      const sr = this.series(v), big = mode === 'wide', charts = true;
      const def = s.screen === 'patrimonio' ? ['leg'] : ['leg', 'liq'];
      const open = (k) => (s.secs || def).indexOf(k) >= 0;
      const toggle = (k) => (o) => this.setState((st) => { const cur = st.secs || def; return { secs: o ? Array.from(new Set(cur.concat(k))) : cur.filter((x) => x !== k) }; });
      const flag = busy ? C('Badge', { tone: 'info' }, 'Recalculando…') : v.draft ? C('Badge', { tone: 'neutral', dot: true }, 'Vista previa') : null;
      const sec = (k, title, end, kids) => C('Accordion', { key: k, open: open(k), onToggle: toggle(k), className: 'r2-sec', summary: h('span', { className: 'r2-sec__sum' }, h('span', null, title), end) }, kids);
      const leg = v.legado >= GOAL ? C('Badge', { tone: 'success', dot: true }, 'Cubre el objetivo') : C('Badge', { tone: 'warning', dot: true }, 'En riesgo en pesimista y medio');
      const legChart = charts ? h('div', { className: 'r3-chart' }, C('LineChart', { key: mode, series: sr.legado, labels: AGES, size: big ? 'md' : 'sm', formatValue: meur, formatTick: mshort, formatEnd: mshort, endValues: true, endLabels: true, interactive: true, panel: 'off', dataTable: big, maxLabels: big ? 9 : 4, chartLabel: 'Legado previsto por escenario, de 2026 a 2066', yAxis: true })) : null;
      const liqChart = charts ? h('div', { className: 'r3-chart' }, C('LineChart', { key: 'l' + mode, series: [{ name: 'Liquidez · medio', values: sr.liq.map((d) => d.value) }, { name: 'Cero', values: sr.liq.map(() => 0), dashed: true, reference: true }], labels: LIQ_YEARS, size: big ? 'md' : 'sm', formatValue: eur, formatTick: (x) => (x < 0 ? '−' : '') + fmt(x / 1000) + ' mil', formatEnd: (x) => eur(x), endValues: false, endLabels: false, interactive: true, panel: 'off', dataTable: big, yAxis: true, grid: big, maxLabels: big ? 8 : 5, chartLabel: 'Liquidez anual en el escenario medio; por debajo de cero hay déficit' })) : null;
      return h(React.Fragment, null,
        head([h('h2', { key: 't' }, 'El plan'), v.draft && !busy ? h('span', { key: 'u', className: 'r2-muted' }, 'Sin guardar') : null, h('span', { key: 's', className: 'r2-spacer' }), h(React.Fragment, { key: 'k' }, tools)]),
        h('div', { className: 'r3-plan__body' + (big ? ' r3-plan__body--wide' : '') },
          sec('cfg', 'Configuración', null, C('SummaryList', { rows: [{ label: 'Escenario', value: 'Medio' }, { label: 'Esperanza de vida', value: '100 años' }, { label: 'IPC', value: '2,00 %' }, { label: 'Revalorización del ahorro', value: '2,00 %' }, { label: 'Coste de financiación', value: '7,50 %' }] })),
          sec('leg', 'Legado y patrimonio', flag, C('LoadingOverlay', { busy, label: 'Recalculando el plan…' }, h('div', { className: 'r2-figs' },
            h('div', { className: 'r2-fig' }, h('span', { className: 'r2-fig__l' }, 'Previsto a los 100 · medio'), h('strong', { className: 'r2-fig__v' }, A(v.legado, meur, 2))),
            leg, legChart,
            C('SummaryList', { rows: [{ label: 'Objetivo', value: '1,2 M €' }, { label: 'Escenarios que cubren', value: v.cubren + ' de 3' }, { label: 'Patrimonio hoy', value: A(v.pat), total: true }] }),
            h('div', { className: 'r2-split', role: 'img', 'aria-label': 'Reparto del patrimonio' }, GROUPS.map((g) => h('i', { key: g.value, style: { width: (v.groups[g.value] / v.pat * 100) + '%', background: COL[g.value] } }))),
            h('ul', { className: 'r2-legend' }, GROUPS.map((g) => h('li', { key: g.value }, C('Dot', { color: COL[g.value] }), h('span', null, g.label), h('span', { className: 'r2-legend__v' }, Math.round(v.groups[g.value] / v.pat * 100) + ' %'))))))),
          sec('liq', 'Liquidez', s.screen === 'ingresos' ? flag : null, C('LoadingOverlay', { busy, label: 'Recalculando el plan…' }, h('div', { className: 'r2-figs' },
            v.def ? C('Badge', { tone: 'warning', dot: true }, 'Déficit de liquidez en 2031') : C('Badge', { tone: 'success', dot: true }, 'Liquidez suficiente'),
            liqChart,
            C('SummaryList', { rows: [{ label: 'Años con déficit · medio', value: A(v.def, (x) => String(Math.round(x))) }, { label: 'Peor año · medio', value: v.def ? A(v.worst) : '—' }, { label: 'Escenarios sin déficit', value: v.sinDef + ' de 3' }] })))),
          sec('opt', 'Optimizaciones', null, h('div', { className: 'r2-figs' },
            h('div', { className: 'r3-sub' }, h('span', { className: 'r3-sub__t' }, 'Rentabilidad'), C('Badge', { tone: 'warning', dot: true }, 'Faltan 2,2 puntos')),
            h('div', { className: 'r3-chart' }, C('ComparisonMeter', { shape: 'pill',
              before: { label: 'Actual · medio', value: '2,4', unit: '%', amount: 2.4 },
              after: { label: h('span', { className: 'r2-ai' }, I('sparkles', 14), 'Mínima necesaria'), value: '4,6', unit: '%', amount: 4.6 } })),
            h('div', { className: 'r3-sub' }, h('span', { className: 'r3-sub__t' }, 'Asset allocation'), C('Badge', { tone: 'neutral' }, 'Sin aplicar')),
            h('div', { className: 'r3-chart' }, C('DonutChart', { size: 'sm', interactive: true, legend: true, look: 'ramp', formatValue: (x) => x + ' %', centerLabel: 'mil € hoy', centerValue: '290',
              data: [{ label: 'Renta variable', value: 55 }, { label: 'Renta fija', value: 25 }, { label: 'Monetario', value: 12 }, { label: 'Alternativos', value: 8 }], description: 'Reparto actual de la cartera financiera, ejemplo' })),
            h('div', { className: 'r3-sub' }, h('span', { className: 'r3-sub__t' }, 'Generación de liquidez'), C('Badge', { tone: 'neutral' }, 'Sin configurar')),
            h('p', { className: 'r2-hint' }, 'Sin configurar no hay nada que mostrar. Al configurarla, aquí aparecen las ventas previstas año a año.'),
            C('Button', { variant: 'secondary', size: 'sm' }, 'Configurar'))),
          sec('notas', 'Notas', h('span', { className: 'r2-muted' }, String(NOTES.length)), h('div', { className: 'r2-notes' },
            NOTES.slice(0, 3).map((n, i) => h('div', { key: i, className: 'r2-note' }, n[0], h('small', null, n[1]))),
            h('div', { className: 'r2-actions' }, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('plus') }, 'Añadir nota'), C('Button', { variant: 'ghost', size: 'sm' }, 'Ver todas (' + NOTES.length + ')'))))));
    }

    page() {
      const s = this.state;
      if (s.screen === 'ingresos' || s.screen === 'patrimonio') {
        const ing = s.screen === 'ingresos';
        return h('div', { className: 'r2-main ap-in', key: s.screen },
          h('header', { className: 'r2-head' }, h('h1', null, ing ? 'Ingresos' : 'Patrimonio'),
            h('p', null, ing ? 'Los ingresos del cliente, de hoy y previstos. Se añaden y se editan en la propia lista.' : 'Activos y pasivos por tipo. Se crean con lo mínimo y se completan en la propia fila.')),
          ing ? this.incList() : this.patList());
      }
      return h('div', { className: 'r2-main ap-in', key: s.screen },
        h('header', { className: 'r2-head' }, h('h1', null, PAGES[s.screen]), h('p', null, 'Página fuera de este ejemplo. El plan sigue a la derecha, igual que en las demás.')),
        C('EmptyState', { size: 'compact', title: 'Esta página no está en el ejemplo' }, 'El ejemplo cubre Ingresos y Patrimonio. Lo que importa aquí es que el plan no cambia de sitio al cambiar de página.'));
    }

    render() {
      const s = this.state, rc = this.railCollapsed(), mode = this.mode(), logo = h('img', { src: 'ds/afi-apps/assets/logos/afi-color.svg', alt: '' });
      const go = (key) => () => this.setState({ screen: key, open: null, adding: false, draft: null, secs: null, sort: null, cell: null });
      const nav = (icon, label, key) => C('NavItem', { key: label, icon: I(icon, 20), label, collapsed: rc, selected: s.screen === key, onClick: go(key) });
      const group = (label, ...items) => C('SidebarGroup', { label: rc ? undefined : label }, ...items);
      const rail = C('Sidebar', { collapsed: rc, className: 'r3-rail' },
        group('Situación actual', nav('wallet', 'Patrimonio', 'patrimonio'), nav('banknote', 'Ingresos', 'ingresos'), nav('receipt', 'Gastos', 'gastos')),
        group('Objetivos', nav('landmark', 'Legado y liquidez', 'legado'), nav('armchair', 'Jubilación', 'jubilacion')),
        group('Optimizaciones', nav('pie-chart', 'Asset allocation', 'aa'), nav('droplets', 'Generación de liquidez', 'gl')));
      const bar = ({ menuButton }) => C('AppHeader', { lead: h('span', { className: 'r2-lead' }, menuButton, h('span', { className: 'r3-railbtn' }, C('IconButton', { variant: 'ghost', size: 'sm', label: rc ? 'Expandir el menú' : 'Contraer el menú', onClick: () => this.setState({ railC: !rc }) }, I(rc ? 'panel-left-open' : 'panel-left-close', 18))), logo, h('span', { className: 'r2-prod' }, 'Wealth Planner')), end: h('span', { className: 'r2-muted r2-client' }, 'Andrés Molina Vega · Plan patrimonial') });
      const w = this.width();
      return C('ShellFrame', { bar, rail, railTitle: 'Menú', menuOpen: s.nav, onMenuOpenChange: (o) => this.setState({ nav: o }) },
        h('div', { className: 'r3-work' + (s.drag != null ? ' is-dragging' : '') },
          h('div', { className: 'r3-page' }, this.page()),
          h('div', { className: 'r3-handle', role: 'separator', tabIndex: 0, 'aria-orientation': 'vertical', 'aria-label': 'Cambiar el ancho del plan', 'aria-valuetext': NAMES[mode], onPointerDown: (e) => this.onDown(e), onKeyDown: (e) => this.onHandleKey(e), onDoubleClick: () => this.setSize(s.size === 'wide' ? 'narrow' : 'wide') }, h('span', null)),
          h('aside', { className: 'r3-plan r3-plan--' + mode, style: { width: w + 'px' }, 'aria-label': 'El plan', 'aria-live': 'polite' }, this.plan())),
        C('Toast', { show: !!s.toast, action: s.undo ? 'Deshacer' : undefined, onAction: () => this.undoLast() }, s.toast));
    }
  }
  window.WPRows3 = { App };
})();
