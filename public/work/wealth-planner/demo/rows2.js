/* Wealth Planner workstation v2 on the Afi apps DS (experiment, 2026-11-26).
 * Left: menu. Middle: Ingresos or Patrimonio as a rows.gg-style list (rows are separate, airy, open in place,
 * a cell edits itself, new row in place, delete with «Deshacer»). Right: the «Panel del plan», pinned, its
 * sections fold (DS Accordion) and open by what the page changes; figures wait under the DS loader, then count.
 * References: WP assets grouped into tables (ours), Mercury dense transactions, Revolut list + panel (drafts).
 * Props: estado (JSON patch), hold (keep the panel waiting, for a board). */
(() => {
  if (!window.React || window.WPRows2) return;
  document.documentElement.setAttribute('data-ds-v2', '');
  const h = React.createElement;
  const NS = () => window.AfiModernDesignSystem_dc4c68 || {};
  const C = (name, props, ...kids) => { const X = NS()[name]; return X ? h(X, props, ...kids) : null; };
  const I = (name, size) => C('Icon', { name, size: size || 16 });
  const reduced = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  const fmt = (n) => Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const eur = (n) => (n < 0 ? '−' : '') + fmt(n) + ' €';
  const meur = (n) => n >= 1e6 ? (n / 1e6).toFixed(2).replace('.', ',') + ' M €' : fmt(n / 1000) + ' mil €';
  const A = (value, f, d) => C('AnimatedNumber', { value, decimals: d || 0, format: f || ((x) => eur(x)) });
  const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
  const GOAL = 1200000;

  const TIPO = [{ value: 'nomina', label: 'Nómina', icon: 'briefcase' }, { value: 'pension', label: 'Pensión', icon: 'armchair' }, { value: 'alquiler', label: 'Alquiler', icon: 'home' }, { value: 'otro', label: 'Otro ingreso', icon: 'circle-dot' }];
  const FREQ = [{ value: 'Mensual', label: 'Mensual' }, { value: 'Trimestral', label: 'Trimestral' }, { value: 'Anual', label: 'Anual' }];
  const HASTA = [{ value: 'Jubilación', label: 'Jubilación' }, { value: 'Indefinido', label: 'Indefinido' }, { value: '2030', label: '2030' }];
  const PER_YEAR = { Mensual: 12, Trimestral: 4, Anual: 1 };
  const INC = [
    { id: 'r1', concepto: 'Nómina Pareja', tipo: 'nomina', freq: 'Mensual', desde: 'Hoy', hasta: 'Jubilación', importe: 1600 },
    { id: 'r2', concepto: 'Nómina Titular', tipo: 'nomina', freq: 'Mensual', desde: 'Hoy', hasta: 'Jubilación', importe: 2600 },
    { id: 'r3', concepto: 'Pensión Titular', tipo: 'pension', freq: 'Mensual', desde: 'Jubilación', hasta: 'Indefinido', importe: 2100 },
    { id: 'r4', concepto: 'Alquiler local Castellana', tipo: 'alquiler', freq: 'Mensual', desde: '2019', hasta: '2025', importe: 650, ended: true }];
  const GROUPS = [{ value: 'inm', label: 'Inmobiliario', icon: 'building-2' }, { value: 'inv', label: 'Inversiones', icon: 'trending-up' }, { value: 'pen', label: 'Planes de pensiones', icon: 'piggy-bank' }, { value: 'liq', label: 'Liquidez', icon: 'wallet' }];
  const COL = { inm: 'var(--chart-primary-primary)', inv: 'var(--chart-primary-secondary)', pen: 'var(--color-info-300)', liq: 'var(--chart-primary-tertiary)' };
  const PAT = [
    { id: 'a1', nombre: 'Vivienda habitual Madrid', grupo: 'inm', titular: 'Ambos', valor: 450000, done: 3 },
    { id: 'a2', nombre: 'Local Castellana', grupo: 'inm', titular: 'Titular', valor: 170000, done: 2 },
    { id: 'a3', nombre: 'Cartera Afi Renta Variable', grupo: 'inv', titular: 'Titular', valor: 290000, done: 3 },
    { id: 'a4', nombre: 'Plan de pensiones', grupo: 'pen', titular: 'Pareja', valor: 60000, done: 1 },
    { id: 'a5', nombre: 'Cuenta corriente', grupo: 'liq', titular: 'Ambos', valor: 30000, done: 3 }];
  const BASE_YEAR = (1600 + 2600) * 12, BASE_PAT = 1000000;
  const NOTES = [['Revisar la venta del piso de Marbella antes de 2029.', '24/11/2026'], ['El cliente quiere mantener el local de Castellana como renta.', '12/11/2026'], ['Pareja: jubilación prevista a los 63.', '03/11/2026'], ['Primera reunión: legado de 1,2 M € para los dos hijos.', '28/10/2026']];

  class App extends React.Component {
    constructor(props) {
      super(props);
      let patch = {}; try { patch = props.estado ? (typeof props.estado === 'object' ? props.estado : JSON.parse(props.estado)) : {}; } catch (e) {}
      this.state = Object.assign({ screen: 'ingresos', inc: INC, pat: PAT, tab: 'activos', sort: null, open: null, adding: false, draft: null, cell: null, toast: '', undo: null, fresh: null, secs: null, nav: false }, patch);
      if (patch.incExtra) this.state.inc = patch.incExtra.concat(INC);
      if (patch.patExtra) this.state.pat = PAT.concat(patch.patExtra);
      this.onKey = this.onKey.bind(this);
    }
    componentDidMount() { window.addEventListener('keydown', this.onKey); }
    componentWillUnmount() { window.removeEventListener('keydown', this.onKey); clearTimeout(this._pvt); clearTimeout(this._tt); }
    onKey(e) {
      const t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === 'Escape') { if (this.state.adding) this.discard(); else if (this.state.cell) this.setState({ cell: null }); else if (this.state.open) this.setState({ open: null }); return; }
      if (e.key === 'Enter' && this.state.adding && this.canCreate()) { e.preventDefault(); this.create(); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); this.startNew(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.state.open) { e.preventDefault(); this.remove(this.state.open); }
    }

    /* ---------- the plan (example model) ---------- */
    effect() {
      const s = this.state, d = s.adding ? s.draft : null;
      let year = s.inc.filter((r) => !r.ended && r.desde !== 'Jubilación').reduce((t, r) => t + num(r.importe) * PER_YEAR[r.freq], 0);
      let pat = s.pat.reduce((t, a) => t + num(a.valor), 0);
      const draft = !!(d && ((s.screen === 'ingresos' && num(d.importe) > 0) || (s.screen === 'patrimonio' && num(d.valor) > 0)));
      if (draft && s.screen === 'ingresos') year += num(d.importe) * PER_YEAR[d.freq || 'Mensual'];
      if (draft && s.screen === 'patrimonio') pat += num(d.valor);
      const K = (year - BASE_YEAR) / (900 * 12);
      const base = [6200, 5800, 5400, 4900, 3100, -8400, -5200, -1300, 2400, 3600, 4100, 4800, 5200, 5600, 6000];
      const net = base.map((v) => K >= 1 ? Math.max(v + Math.round(10500 * K), 2100) : Math.round(v + 10500 * K));
      const def = net.filter((v) => v < 0).length, worst = Math.min.apply(null, net);
      const legado = Math.round(pat + 60000 * K);
      const groups = {}; GROUPS.forEach((g) => { groups[g.value] = s.pat.filter((a) => a.grupo === g.value).reduce((t, a) => t + num(a.valor), 0); });
      if (draft && s.screen === 'patrimonio') groups[d.grupo] += num(d.valor);
      return { year, pat, legado, def, worst, cubren: legado >= GOAL ? (legado >= GOAL * 1.15 ? 3 : 2) : 1, sinDef: def ? 1 : 2, draft, groups };
    }
    pvHold(vals) {
      const key = JSON.stringify(vals), p = this._pv;
      if (!p || reduced()) { this._pv = { key, vals, busy: false }; return { vals, busy: false }; }
      if (key !== (p.busy ? p.nextKey : p.key)) {
        p.busy = true; p.nextKey = key; p.nextVals = vals; clearTimeout(this._pvt);
        this._pvt = setTimeout(() => { this._pv = { key: p.nextKey, vals: p.nextVals, busy: false }; this.forceUpdate(); }, 1200);
      }
      return { vals: p.vals, busy: p.busy };
    }

    /* ---------- actions ---------- */
    list() { return this.state.screen === 'ingresos' ? 'inc' : 'pat'; }
    toast(text, undo) { this.setState({ toast: text, undo: undo || null }); clearTimeout(this._tt); this._tt = setTimeout(() => this.setState({ toast: '', undo: null }), 6000); }
    startNew() {
      if (this.state.adding) return;
      const draft = this.state.screen === 'ingresos' ? { concepto: '', tipo: 'alquiler', freq: 'Mensual', hasta: 'Indefinido', importe: '' } : { nombre: '', grupo: 'inm', titular: 'Ambos', valor: '' };
      this.setState({ adding: true, open: null, tab: 'activos', draft });
      setTimeout(() => { const el = document.querySelector('.r2-new input'); if (el) el.focus(); }, 60);
    }
    setDraft(k, v) { this.setState((st) => ({ draft: Object.assign({}, st.draft, { [k]: v }) })); }
    canCreate() { const d = this.state.draft; if (!d) return false; return this.state.screen === 'ingresos' ? !!(d.concepto.trim() && num(d.importe) > 0) : !!(d.nombre.trim() && num(d.valor) > 0); }
    discard() { this.setState({ adding: false, draft: null }); }
    create() {
      const d = this.state.draft, id = 'n' + Date.now(), L = this.list();
      const row = L === 'inc' ? { id, concepto: d.concepto.trim(), tipo: d.tipo, freq: d.freq, desde: 'Hoy', hasta: d.hasta, importe: num(d.importe) } : { id, nombre: d.nombre.trim(), grupo: d.grupo, titular: d.titular, valor: num(d.valor), done: 1 };
      this.setState((st) => ({ [L]: L === 'inc' ? [row].concat(st[L]) : st[L].concat([row]), adding: false, draft: null, fresh: id, open: L === 'pat' ? id : null }));
      this.toast((L === 'inc' ? 'Ingreso «' + row.concepto : 'Activo «' + row.nombre) + '» creado. El plan se ha recalculado.');
    }
    update(id, k, v) { const L = this.list(); this.setState((st) => ({ [L]: st[L].map((r) => r.id === id ? Object.assign({}, r, { [k]: (k === 'importe' || k === 'valor') ? num(v) : v }) : r) })); }
    finish(id) { const r = this.state.inc.find((x) => x.id === id); this.setState((st) => ({ inc: st.inc.map((x) => x.id === id ? Object.assign({}, x, { ended: true }) : x), open: null })); this.toast('«' + r.concepto + '» pasa a Terminados.', { type: 'finish', id }); }
    remove(id) { const L = this.list(), st = this.state, i = st[L].findIndex((x) => x.id === id), r = st[L][i]; this.setState({ [L]: st[L].filter((x) => x.id !== id), open: null }); this.toast('«' + (r.concepto || r.nombre) + '» eliminado.', { type: 'remove', L, row: r, index: i }); }
    undoLast() {
      const u = this.state.undo; if (!u) return;
      if (u.type === 'remove') this.setState((st) => { const rows = st[u.L].slice(); rows.splice(u.index, 0, u.row); return { [u.L]: rows, toast: '', undo: null }; });
      if (u.type === 'finish') this.setState((st) => ({ inc: st.inc.map((x) => x.id === u.id ? Object.assign({}, x, { ended: false }) : x), toast: '', undo: null }));
    }
    sortBy(key) { this.setState((st) => ({ sort: !st.sort || st.sort.key !== key ? { key, dir: (key === 'importe' || key === 'valor') ? 'desc' : 'asc' } : { key, dir: st.sort.dir === 'asc' ? 'desc' : 'asc' } })); }
    sorted(rows) {
      const s = this.state.sort; if (!s) return rows;
      const v = (r) => s.key === 'importe' ? num(r.importe) * PER_YEAR[r.freq] : s.key === 'valor' ? num(r.valor) : String(r[s.key] || '');
      return rows.slice().sort((a, b) => (v(a) > v(b) ? 1 : v(a) < v(b) ? -1 : 0) * (s.dir === 'asc' ? 1 : -1));
    }

    /* ---------- list parts ---------- */
    narrowList() { return false; }
    actionInHead() { return false; }
    /* the rest of an asset's fields, folded by topic (v3.1 puts real forms here) */
    moreSections(a) {
      return h('div', { key: 'more', className: 'r2-more' },
              C('Accordion', { summary: h('span', { className: 'r2-acc' }, 'Titulares y porcentajes', a.done >= 2 ? C('Badge', { tone: 'success' }, 'Completo') : C('Badge', { tone: 'warning' }, 'Pendiente')) }, h('p', { className: 'r2-hint' }, 'Quién es dueño y en qué porcentaje. Sirve para el legado de cada persona.')),
              C('Accordion', { summary: h('span', { className: 'r2-acc' }, 'Revalorización y rentas', a.done >= 3 ? C('Badge', { tone: 'success' }, 'Completo') : C('Badge', { tone: 'warning' }, 'Pendiente')) }, h('p', { className: 'r2-hint' }, 'Cuánto se espera que crezca y qué renta da cada año.')),
              C('Accordion', { summary: h('span', { className: 'r2-acc' }, 'Fiscalidad y deuda asociada', a.done >= 3 ? C('Badge', { tone: 'success' }, 'Completo') : C('Badge', { tone: 'warning' }, 'Pendiente')) }, h('p', { className: 'r2-hint' }, 'Año y precio de compra para la plusvalía, e hipoteca si la hay.')));
    }
    ic(icon, tone) { return h('span', { className: 'r2-ic' + (tone ? ' r2-ic--' + tone : '') }, I(icon, 14)); }
    th(key, label, kind) { const s = this.state.sort; return C('TableHeaderCell', { key: label, label, kind, sortable: !!key, sort: key && s && s.key === key ? s.dir : undefined, onSort: key ? () => this.sortBy(key) : undefined }); }
    /* the quiet cell: text until pressed, then the DS Select (DS gap: a quiet Select for cells) */
    quiet(r) {
      const editing = this.state.cell === r.id;
      if (editing) return h('span', { onClick: (e) => e.stopPropagation(), className: 'r2-cellsel' }, C('Select', { size: 'sm', value: r.freq, options: FREQ, onChange: (v) => { this.update(r.id, 'freq', v); this.setState({ cell: null }); }, 'aria-label': 'Frecuencia de ' + r.concepto }));
      return C('PlainButton', { className: 'r2-quiet', onClick: (e) => { e.stopPropagation(); this.setState({ cell: r.id }); }, 'aria-label': 'Cambiar frecuencia: ' + r.freq }, r.freq, h('span', { className: 'r2-quiet__chev' }, I('chevron-down', 14)));
    }
    detailRow(key, cols, kids) { return C('TableRow', { key, hoverable: false, className: 'r2-detail' }, C('TableCell', { colSpan: cols }, C('Reveal', null, h('div', { className: 'r2-detail__in' }, kids)))); }
    actions(left, right) { return h('div', { className: 'r2-actions' }, left, h('span', { className: 'r2-spacer' }), right); }

    incList() {
      const s = this.state, active = s.inc.filter((r) => !r.ended), ended = s.inc.filter((r) => r.ended), rows = this.sorted(s.tab === 'activos' ? active : ended);
      const body = [], cmp = this.narrowList(), NC = cmp ? 4 : 5;
      const hastaSel = (d) => C('Select', { size: 'sm', label: cmp ? 'Hasta' : undefined, value: d.hasta, options: HASTA, onChange: (v) => this.setDraft('hasta', v), 'aria-label': 'Hasta' });
      if (s.adding && s.tab === 'activos') {
        const d = s.draft;
        body.push(C('TableRow', { key: 'new', hoverable: false, className: 'r2-new is-open', 'data-new-row': '' },
          C('TableCell', null, h('span', { className: 'r2-name' }, this.ic((TIPO.find((t) => t.value === d.tipo) || TIPO[0]).icon, 'new'), C('Input', { size: 'sm', value: d.concepto, placeholder: 'Nombre del ingreso', 'aria-label': 'Concepto', onChange: (e) => this.setDraft('concepto', e.target.value) }))),
          C('TableCell', null, C('Select', { size: 'sm', value: d.tipo, options: TIPO, onChange: (v) => this.setDraft('tipo', v), 'aria-label': 'Tipo' })),
          C('TableCell', null, C('Select', { size: 'sm', value: d.freq, options: FREQ, onChange: (v) => this.setDraft('freq', v), 'aria-label': 'Frecuencia' })),
          cmp ? null : C('TableCell', null, hastaSel(d)),
          C('TableCell', { kind: 'monetary' }, C('Input', { size: 'sm', value: d.importe, placeholder: '0', inputMode: 'decimal', suffix: '€', 'aria-label': 'Importe', onChange: (e) => this.setDraft('importe', e.target.value) }))));
        body.push(this.detailRow('new-d', NC, [cmp ? h('div', { key: 'hs', className: 'r2-one' }, hastaSel(d)) : null, h('p', { key: 'p', className: 'r2-hint' }, 'Con nombre e importe basta para crearlo; desde hoy. El plan muestra el efecto mientras escribe.'),
          this.actions(null, h(React.Fragment, null, C('Button', { variant: 'ghost', size: 'sm', onClick: () => this.discard() }, 'Descartar ', C('Kbd', null, 'Esc')), C('Button', { variant: 'primary', size: 'sm', title: 'Atajo: Intro', 'aria-keyshortcuts': 'Enter', disabled: !this.canCreate(), onClick: () => this.create() }, 'Crear')))]));
      }
      rows.forEach((r) => {
        const open = s.open === r.id, t = TIPO.find((x) => x.value === r.tipo) || TIPO[0];
        body.push(C('TableRow', { key: r.id, hoverable: true, className: (open ? 'is-open ' : '') + (s.fresh === r.id ? 'r2-fresh' : ''), onClick: () => this.setState({ open: open ? null : r.id, adding: false, cell: null }) },
          C('TableCell', null, h('span', { className: 'r2-name' }, this.ic(t.icon), h('span', { className: 'r2-name__t' }, r.concepto), s.fresh === r.id ? C('Badge', { tone: 'info' }, 'Nuevo') : null)),
          C('TableCell', null, C('Tag', null, t.label)),
          C('TableCell', null, this.quiet(r)),
          cmp ? null : C('TableCell', null, h('span', { className: 'r2-muted' }, r.desde + ' → ' + r.hasta)),
          C('TableCell', { kind: 'monetary' }, h('span', { className: 'r2-amount' }, eur(r.importe)))));
        if (open) body.push(this.detailRow(r.id + '-d', NC, [
          h('div', { key: 'g', className: 'r2-grid' },
            C('Input', { label: 'Concepto', size: 'sm', value: r.concepto, onChange: (e) => this.update(r.id, 'concepto', e.target.value) }),
            C('Input', { label: 'Importe', size: 'sm', value: fmt(r.importe), suffix: '€', inputMode: 'decimal', onChange: (e) => this.update(r.id, 'importe', e.target.value) }),
            C('Select', { label: 'Hasta', size: 'sm', value: r.hasta, options: HASTA.concat(HASTA.find((x) => x.value === r.hasta) ? [] : [{ value: r.hasta, label: r.hasta }]), onChange: (v) => this.update(r.id, 'hasta', v) })),
          this.actions(h(React.Fragment, null, C('Button', { variant: 'secondary', size: 'sm', iconStart: I('check'), onClick: () => this.finish(r.id) }, 'Terminar'), C('Button', { variant: 'ghost', size: 'sm', iconStart: I('trash-2'), onClick: () => this.remove(r.id) }, 'Eliminar ', C('Kbd', null, 'Supr'))),
            C('Button', { variant: 'primary', size: 'sm', onClick: () => this.setState({ open: null }) }, 'Hecho'))]));
      });
      return h('section', { className: 'r2-list' },
        h('div', { className: 'r2-bar' },
          C('Tabs', { items: [{ value: 'activos', label: 'Activos · ' + active.length }, { value: 'terminados', label: 'Terminados · ' + ended.length }], value: s.tab, onChange: (v) => this.setState({ tab: v, open: null }) }),
          h('span', { className: 'r2-spacer' }),
          this.actionInHead() ? null : C('Button', { variant: 'primary', iconStart: I('plus'), title: 'Atajo: N', 'aria-keyshortcuts': 'N', onClick: () => this.startNew() }, 'Nuevo ingreso')),
        rows.length || s.adding
          ? C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r2-table--inc' + (cmp ? ' r2-table--cmp' : '') }, h('thead', null, C('TableHeaderRow', null, this.th('concepto', 'Concepto'), this.th(null, 'Tipo'), this.th(null, 'Frecuencia'), cmp ? null : this.th(null, 'Periodo'), this.th('importe', 'Importe', 'monetary'))), h('tbody', null, body))
          : C('EmptyState', { size: 'compact', illustration: 'historico', assetBase: 'ds/afi-apps/assets/empty-states/', title: 'No hay ingresos terminados' }, 'Cuando un ingreso deja de cobrarse, «Terminar» lo trae aquí y deja de contar en el plan.'));
    }

    patList() {
      const s = this.state, body = [], cmp = this.narrowList(), NC = cmp ? 3 : 4;
      const total = s.pat.reduce((t, a) => t + num(a.valor), 0);
      const titSel = (d) => C('Select', { size: 'sm', label: cmp ? 'Titular' : undefined, value: d.titular, options: ['Titular', 'Pareja', 'Ambos'].map((x) => ({ value: x, label: x })), onChange: (v) => this.setDraft('titular', v), 'aria-label': 'Titular' });
      GROUPS.forEach((g) => {
        const items = this.sorted(s.pat.filter((a) => a.grupo === g.value));
        const sum = items.reduce((t, a) => t + num(a.valor), 0);
        body.push(C('TableRow', { key: 'g-' + g.value, hoverable: false, className: 'r2-group' },
          C('TableCell', { colSpan: NC - 1 }, h('span', { className: 'r2-group__t' }, C('Dot', { color: COL[g.value] }), g.label, h('span', { className: 'r2-muted' }, ' · ' + items.length))),
          C('TableCell', { kind: 'monetary' }, h('span', { className: 'r2-muted' }, eur(sum)))));
        items.forEach((a) => {
          const open = s.open === a.id;
          body.push(C('TableRow', { key: a.id, hoverable: true, className: (open ? 'is-open ' : '') + (s.fresh === a.id ? 'r2-fresh' : ''), onClick: () => this.setState({ open: open ? null : a.id, adding: false }) },
            C('TableCell', null, h('span', { className: 'r2-name' }, this.ic(g.icon), h('span', { className: 'r2-name__t' }, a.nombre), s.fresh === a.id ? C('Badge', { tone: 'info' }, 'Nuevo') : null)),
            cmp ? null : C('TableCell', null, h('span', { className: 'r2-muted' }, a.titular)),
            C('TableCell', null, a.done >= 3 ? C('Badge', { tone: 'success', dot: true }, 'Completo') : C('Badge', { tone: 'warning', dot: true }, (3 - a.done) + ' por completar')),
            C('TableCell', { kind: 'monetary' }, h('span', { className: 'r2-amount' }, eur(a.valor)))));
          if (open) body.push(this.detailRow(a.id + '-d', NC, [
            h('div', { key: 'g', className: 'r2-grid' },
              C('Input', { label: 'Nombre', size: 'sm', value: a.nombre, onChange: (e) => this.update(a.id, 'nombre', e.target.value) }),
              C('Input', { label: 'Valor actual', size: 'sm', value: fmt(a.valor), suffix: '€', onChange: (e) => this.update(a.id, 'valor', e.target.value) }),
              C('Select', { label: 'Titular', size: 'sm', value: a.titular, options: ['Titular', 'Pareja', 'Ambos'].map((x) => ({ value: x, label: x })), onChange: (v) => this.update(a.id, 'titular', v) })),
            /* the rest of the fields, folded by topic, each saying whether it is complete (R4: ask for the least first) */
            this.moreSections(a),
            this.actions(C('Button', { variant: 'ghost', size: 'sm', iconStart: I('trash-2'), onClick: () => this.remove(a.id) }, 'Eliminar ', C('Kbd', null, 'Supr')), C('Button', { variant: 'primary', size: 'sm', onClick: () => this.setState({ open: null }) }, 'Hecho'))]));
        });
        if (s.adding && s.draft && s.draft.grupo === g.value) {
          const d = s.draft;
          body.push(C('TableRow', { key: 'new', hoverable: false, className: 'r2-new is-open', 'data-new-row': '' },
            C('TableCell', null, h('span', { className: 'r2-name' }, this.ic(g.icon, 'new'), C('Input', { size: 'sm', value: d.nombre, placeholder: 'Nombre del activo', 'aria-label': 'Nombre', onChange: (e) => this.setDraft('nombre', e.target.value) }))),
            cmp ? null : C('TableCell', null, titSel(d)),
            C('TableCell', null, C('Select', { size: 'sm', value: d.grupo, options: GROUPS, onChange: (v) => this.setDraft('grupo', v), 'aria-label': 'Tipo de activo' })),
            C('TableCell', { kind: 'monetary' }, C('Input', { size: 'sm', value: d.valor, placeholder: '0', suffix: '€', 'aria-label': 'Valor', onChange: (e) => this.setDraft('valor', e.target.value) }))));
          body.push(this.detailRow('new-d', NC, [cmp ? h('div', { key: 'ts', className: 'r2-one' }, titSel(d)) : null, h('p', { key: 'p', className: 'r2-hint' }, 'Nombre, titular, tipo y valor bastan para crearlo. El resto (titulares, revalorización, fiscalidad) se completa después en la fila.'),
            this.actions(null, h(React.Fragment, null, C('Button', { variant: 'ghost', size: 'sm', onClick: () => this.discard() }, 'Descartar ', C('Kbd', null, 'Esc')), C('Button', { variant: 'primary', size: 'sm', title: 'Atajo: Intro', 'aria-keyshortcuts': 'Enter', disabled: !this.canCreate(), onClick: () => this.create() }, 'Crear')))]));
        }
      });
      return h('section', { className: 'r2-list' },
        h('div', { className: 'r2-bar' }, h('span', { className: 'r2-total' }, 'Patrimonio neto ', h('strong', null, eur(total))), h('span', { className: 'r2-spacer' }),
          this.actionInHead() ? null : C('Button', { variant: 'primary', iconStart: I('plus'), title: 'Atajo: N', 'aria-keyshortcuts': 'N', onClick: () => this.startNew() }, 'Nuevo activo')),
        C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r2-table--pat' + (cmp ? ' r2-table--cmp' : '') }, h('thead', null, C('TableHeaderRow', null, this.th('nombre', 'Activo'), cmp ? null : this.th(null, 'Titular'), this.th(null, 'Datos'), this.th('valor', 'Valor', 'monetary'))), h('tbody', null, body)));
    }

    /* ---------- Panel del plan (pinned) ---------- */
    panel() {
      const s = this.state, e = this.effect();
      const live = this.pvHold({ legado: e.legado, def: e.def, worst: e.worst, cubren: e.cubren, sinDef: e.sinDef, pat: e.pat, groups: e.groups, draft: e.draft });
      const v = live.vals, busy = live.busy || !!this.props.hold;
      const def = s.screen === 'patrimonio' ? ['leg'] : ['leg', 'liq'];
      const open = (k) => (s.secs || def).indexOf(k) >= 0;
      const toggle = (k) => (o) => this.setState((st) => { const cur = st.secs || def; return { secs: o ? Array.from(new Set(cur.concat(k))) : cur.filter((x) => x !== k) }; });
      const flag = busy ? C('Badge', { tone: 'info' }, 'Recalculando…') : v.draft ? C('Badge', { tone: 'neutral', dot: true }, 'Vista previa') : null;
      const sec = (k, title, end, kids) => C('Accordion', { key: k, open: open(k), onToggle: toggle(k), className: 'r2-sec', summary: h('span', { className: 'r2-sec__sum' }, h('span', null, title), end) }, kids);
      const leg = v.legado >= GOAL ? C('Badge', { tone: 'success', dot: true }, 'Cubre el objetivo') : C('Badge', { tone: 'warning', dot: true }, 'En riesgo en pesimista y medio');
      return h('aside', { className: 'r2-panel', 'aria-label': 'Panel del plan', 'aria-live': 'polite' },
        h('div', { className: 'r2-panel__head' }, h('h2', null, 'Panel del plan'), v.draft && !busy ? h('span', { className: 'r2-muted' }, 'Sin guardar') : null),
        sec('cfg', 'Configuración', null, C('SummaryList', { rows: [{ label: 'Escenario', value: 'Medio' }, { label: 'Esperanza de vida', value: '100 años' }, { label: 'IPC', value: '2,00 %' }, { label: 'Revalorización del ahorro', value: '2,00 %' }, { label: 'Coste de financiación', value: '7,50 %' }] })),
        sec('leg', 'Legado y patrimonio', flag,
          C('LoadingOverlay', { busy, label: 'Recalculando el plan…' },
            h('div', { className: 'r2-figs' },
              h('div', { className: 'r2-fig' }, h('span', { className: 'r2-fig__l' }, 'Previsto a los 100 · medio'), h('strong', { className: 'r2-fig__v' }, A(v.legado, (x) => meur(x), 2))),
              leg,
              C('SummaryList', { rows: [{ label: 'Objetivo', value: '1,2 M €' }, { label: 'Escenarios que cubren', value: v.cubren + ' de 3' }, { label: 'Patrimonio hoy', value: A(v.pat), total: true }] }),
              h('div', { className: 'r2-split', role: 'img', 'aria-label': 'Reparto del patrimonio' }, GROUPS.map((g) => h('i', { key: g.value, style: { width: (v.groups[g.value] / v.pat * 100) + '%', background: COL[g.value] } }))),
              h('ul', { className: 'r2-legend' }, GROUPS.map((g) => h('li', { key: g.value }, C('Dot', { color: COL[g.value] }), h('span', null, g.label), h('span', { className: 'r2-legend__v' }, Math.round(v.groups[g.value] / v.pat * 100) + ' %'))))))),
        sec('liq', 'Liquidez', s.screen === 'ingresos' ? flag : null,
          C('LoadingOverlay', { busy, label: 'Recalculando el plan…' },
            h('div', { className: 'r2-figs' },
              v.def ? C('Badge', { tone: 'warning', dot: true }, 'Déficit de liquidez en 2031') : C('Badge', { tone: 'success', dot: true }, 'Liquidez suficiente'),
              C('SummaryList', { rows: [{ label: 'Años con déficit · medio', value: A(v.def, (x) => String(Math.round(x))) }, { label: 'Peor año · medio', value: v.def ? A(v.worst) : '—' }, { label: 'Escenarios sin déficit', value: v.sinDef + ' de 3' }] })))),
        sec('opt', 'Optimizaciones', null, h('div', { className: 'r2-figs' },
          h('div', { className: 'r2-fig r2-fig--row' }, h('span', { className: 'r2-ai' }, I('sparkles', 14), 'Rentabilidad mínima necesaria'), h('strong', null, '4,6 %')),
          C('SummaryList', { rows: [{ label: 'Rentabilidad actual · medio', value: '2,4 %' }, { label: 'Asset allocation', value: C('Badge', { tone: 'neutral' }, 'Sin aplicar') }, { label: 'Generación de liquidez', value: C('Badge', { tone: 'neutral' }, 'Sin configurar') }] }))),
        sec('notas', 'Notas', h('span', { className: 'r2-muted' }, String(NOTES.length)), h('div', { className: 'r2-notes' },
          NOTES.slice(0, 3).map((n, i) => h('div', { key: i, className: 'r2-note' }, n[0], h('small', null, n[1]))),
          h('div', { className: 'r2-actions' }, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('plus') }, 'Añadir nota'), C('Button', { variant: 'ghost', size: 'sm' }, 'Ver todas (' + NOTES.length + ')')))));
    }

    render() {
      const s = this.state, logo = h('img', { src: 'ds/afi-apps/assets/logos/afi-color.svg', alt: '' });
      const nav = (icon, label, key) => C('NavItem', { key: label, icon: I(icon, 20), label, selected: s.screen === key, onClick: key ? () => this.setState({ screen: key, open: null, adding: false, draft: null, secs: null, sort: null }) : () => {} });
      const rail = C('Sidebar', null,
        C('SidebarGroup', { label: 'Situación actual' }, nav('wallet', 'Patrimonio', 'patrimonio'), nav('banknote', 'Ingresos', 'ingresos'), nav('receipt', 'Gastos')),
        C('SidebarGroup', { label: 'Objetivos' }, nav('landmark', 'Legado y liquidez'), nav('armchair', 'Jubilación')),
        C('SidebarGroup', { label: 'Optimizaciones' }, nav('pie-chart', 'Asset allocation'), nav('droplets', 'Generación de liquidez')));
      const bar = ({ menuButton }) => C('AppHeader', { lead: h('span', { className: 'r2-lead' }, menuButton, logo, h('span', { className: 'r2-prod' }, 'Wealth Planner')), end: h('span', { className: 'r2-muted r2-client' }, 'Andrés Molina Vega · Plan patrimonial') });
      const ing = s.screen === 'ingresos';
      return C('ShellFrame', { bar, rail, railTitle: 'Menú', menuOpen: s.nav, onMenuOpenChange: (o) => this.setState({ nav: o }) },
        h('div', { className: 'r2-work' },
          h('div', { className: 'r2-main ap-in', key: s.screen },
            h('header', { className: 'r2-head' }, h('h1', null, ing ? 'Ingresos' : 'Patrimonio'),
              h('p', null, ing ? 'Los ingresos del cliente, de hoy y previstos. Se añaden y se editan en la propia lista.' : 'Activos y pasivos por tipo. Se crean con lo mínimo y se completan en la propia fila.')),
            ing ? this.incList() : this.patList()),
          this.panel()),
        C('Toast', { show: !!s.toast, action: s.undo ? 'Deshacer' : undefined, onAction: () => this.undoLast() }, s.toast));
    }
  }
  window.WPRows2 = { App };
})();
