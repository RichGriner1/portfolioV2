/* Wealth Planner workstation v3.1 on the Afi apps DS (experiment, 2026-11-26). Extends WPRows3.App.
 * What changes from v3:
 *  - the page has a header like El plan's: title left, the page's action right;
 *  - collapsed menu icons have tooltips;
 *  - each plan section carries its status next to its title (icon + coloured text, 3.61 style), so a folded section still
 *    shows a change («Recalculando…», then «En riesgo» → «Cubre»);
 *  - Legado and Liquidez follow the 3.61 «Impacto en el plan» sections: verdict, figure, chart by age, table by scenario;
 *  - Rentabilidad uses the 3.61 ruler (required vs current, with the four bands);
 *  - a «Legado y colchón de liquidez» page sets the goals (first run: «Antes de continuar», 2 steps);
 *  - going to Asset allocation or Generación de liquidez scrolls the plan to that part.
 * Charts the Afi apps DS cannot draw yet (bars below zero, goal and retirement markers, the ruler) live in this page layer.
 * Props: estado (JSON patch), hold. */
(() => {
  if (!window.React || !window.WPRows3 || window.WPRows4) return;
  const HERE = ((document.currentScript && document.currentScript.src) || '').replace(/[^/]*$/, '');
  const DS = HERE + 'ds/afi-apps/';
  const RAIL = { open: 248, closed: 72 };
  /* one icon per plan section, the same in the open header and in the closed strip */
  const SEC_IC = { cfg: 'settings-2', leg: 'landmark', liq: 'droplets', opt: 'sparkles', notas: 'sticky-note' };
  const h = React.createElement;
  const NS = () => window.AfiModernDesignSystem_dc4c68 || {};
  /* every Tooltip uses the DS pop-in motion (opt-in prop) unless a call says otherwise */
  const C = (name, props, ...kids) => { const X = NS()[name]; if (name === 'Tooltip' && props && props.motion === undefined) props = Object.assign({ motion: true }, props); return X ? h(X, props, ...kids) : null; };
  const I = (name, size) => C('Icon', { name, size: size || 16 });
  const reduced = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  const fmt = (n) => Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const eur = (n) => (n < 0 ? '−' : '') + fmt(n) + ' €';
  const meur = (n) => (n / 1e6).toFixed(2).replace('.', ',') + ' M €';
  const m1 = (n) => (n / 1e6).toFixed(1).replace('.', ',') + ' M €';
  /* objectives keep a second decimal when it matters: 1.150.000 € → 1,15 M €, never 1,1 */
  const mGoal = (n) => { const x = Math.round(n / 1e4) / 100; return (Math.round(x * 100) % 10 ? x.toFixed(2) : x.toFixed(1)).replace('.', ',') + ' M €'; };
  const kfmt = (n) => (n < 0 ? '−' : '') + fmt(Math.abs(n) / 1000) + ' K €';
  const A = (value, f, d) => C('AnimatedNumber', { value, decimals: d || 0, format: f || ((x) => eur(x)) });
  const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
  const PER_YEAR = { Mensual: 12, Trimestral: 4, Anual: 1 }, BASE_YEAR = (1600 + 2600) * 12;
  const AGE0 = 55, RETIRE = 65, YEAR0 = 2026;
  const SHAPE = [1, 1.1, 1.18, 1.22, 1.12, 1.04, 1.0, 0.98, 0.96];
  const LIQ_BASE = [6200, 5800, 5400, 4900, 3100, -8400, -5200, -1300, 2400, 3600, 4100, 4800, 5200, 5600, 6000];
  const GROUPS = [{ value: 'inm', label: 'Inmobiliario' }, { value: 'inv', label: 'Inversiones' }, { value: 'pen', label: 'Planes de pensiones' }, { value: 'liq', label: 'Liquidez' }];
  const COL = { inm: 'var(--chart-primary-primary)', inv: 'var(--chart-primary-secondary)', pen: 'var(--color-info-300)', liq: 'var(--chart-primary-tertiary)' };
  const NOTES = [['Revisar la venta del piso de Marbella antes de 2029.', '24/11/2026'], ['El cliente quiere mantener el local de Castellana como renta.', '12/11/2026'], ['Pareja: jubilación prevista a los 63.', '03/11/2026'], ['Primera reunión: legado de 1,2 M € para los dos hijos.', '28/10/2026']];
  const KEEP = [{ value: 'patrimonio', label: 'Mantener el patrimonio' }, { value: 'vivienda', label: 'Mantener la vivienda' }, { value: 'manual', label: 'Definir manualmente' }];
  const PAGES = { gastos: 'Gastos', jubilacion: 'Jubilación', aa: 'Asset allocation', gl: 'Generación de liquidez' };
  /* which plan sections a page opens, and where the plan scrolls to */
  const CTX = { ingresos: [['liq'], null], gastos: [['liq'], null], patrimonio: [['leg'], null], legado: [['leg', 'liq'], null], jubilacion: [['leg', 'liq'], null], aa: [['opt'], 'aa'], gl: [['opt'], 'gl'] };
  const TIPO = [{ value: 'nomina', label: 'Nómina', icon: 'briefcase' }, { value: 'pension', label: 'Pensión', icon: 'armchair' }, { value: 'alquiler', label: 'Alquiler', icon: 'home' }, { value: 'otro', label: 'Otro ingreso', icon: 'circle-dot' }];
  const FREQ = [{ value: 'Mensual', label: 'Mensual' }, { value: 'Trimestral', label: 'Trimestral' }, { value: 'Anual', label: 'Anual' }];
  const PER = { Mensual: '/ mes', Trimestral: '/ trimestre', Anual: '/ año' };
  const HASTA = [{ value: 'Jubilación', label: 'Jubilación' }, { value: 'Indefinido', label: 'Indefinido' }, { value: '2030', label: '2030' }];
  /* the rest of an asset's fields: prefilled per asset so the example shows complete and pending folds */
  const MORE0 = {
    a1: { pctT: '50', pctP: '50', reval: 'IPC', tasa: '2,0', renta: '0', anio: '2008', coste: '310.000', hip: 'No', pend: '' },
    a2: { pctT: '100', pctP: '0', reval: 'IPC', tasa: '2,0', renta: '7.800', anio: '', coste: '', hip: 'No', pend: '' },
    a3: { pctT: '100', pctP: '0', reval: 'Manual', tasa: '4,5', renta: '0', anio: '2015', coste: '210.000', hip: 'No', pend: '' },
    a4: { pctT: '0', pctP: '100', reval: '', tasa: '', renta: '', anio: '', coste: '', hip: '', pend: '' },
    a5: { pctT: '50', pctP: '50', reval: 'IPC', tasa: '0,5', renta: '0', anio: '2010', coste: '0', hip: 'No', pend: '' } };
  /* v3.2: the full Patrimonio example from Wealth Planner 3.61 (19 items, 8 groups) */
  const PG8 = [{ value: 'liq', label: 'Liquidez', icon: 'wallet' }, { value: 'inv', label: 'Inversiones', icon: 'trending-up' }, { value: 'inm', label: 'Inmobiliario', icon: 'building-2' }, { value: 'pe', label: 'Private equity', icon: 'briefcase' }, { value: 'pen', label: 'Planes de pensiones', icon: 'piggy-bank' }, { value: 'emp', label: 'Participaciones empresariales', icon: 'building' }, { value: 'otr', label: 'Otros activos', icon: 'gem' }, { value: 'deu', label: 'Deuda', icon: 'landmark' }];
  const COL8 = { liq: 'var(--chart-primary-primary)', inv: 'var(--color-primary-600)', inm: 'var(--chart-primary-secondary)', pe: 'var(--color-info-300)', pen: 'var(--color-primary-500)', emp: 'var(--color-primary-400)', otr: 'var(--color-primary-300)', deu: 'var(--chart-negative-default)' };
  const T = (t, p) => [['Titular', t]].concat(p ? [['Pareja', p]] : []);
  const REAL = [
    { id: 'b1', nombre: 'Cuenta nómina', grupo: 'liq', detalle: 'Cuenta corriente', entidad: 'BBVA', ten: T(100), valor: 85000, done: 3 },
    { id: 'b2', nombre: 'Cuenta conjunta', grupo: 'liq', detalle: 'Cuenta corriente', entidad: 'CaixaBank', ten: T(50, 50), valor: 140000, done: 3 },
    { id: 'b3', nombre: 'Letras del Tesoro', grupo: 'liq', detalle: 'Depósito a plazo', entidad: 'Santander', ten: T(100), valor: 220000, done: 2 },
    { id: 'b4', nombre: 'Fondo indexado global', grupo: 'inv', detalle: 'Fondos de inversión', entidad: 'Indexa Capital', ten: T(60, 40), valor: 380000, done: 3 },
    { id: 'b5', nombre: 'ETF MSCI World', grupo: 'inv', detalle: 'ETF', entidad: 'Renta 4', ten: T(100), valor: 260000, done: 3 },
    { id: 'b6', nombre: 'Inditex', grupo: 'inv', detalle: 'Acciones cotizadas', entidad: 'BBVA', ten: T(100), valor: 175000, done: 2 },
    { id: 'a1', nombre: 'Vivienda Chamartín', grupo: 'inm', detalle: 'Vivienda habitual', entidad: 'Tenencia directa', ten: T(50, 50), valor: 1150000, done: 3 },
    { id: 'b8', nombre: 'Casa Sotogrande', grupo: 'inm', detalle: 'Segunda residencia', entidad: 'Tenencia directa', ten: T(50, 50), valor: 620000, done: 2 },
    { id: 'b9', nombre: 'Piso alquiler Chamberí', grupo: 'inm', detalle: 'Inversión', entidad: 'Tenencia directa', ten: T(100), valor: 480000, done: 1 },
    { id: 'b10', nombre: 'Fondo de private equity · 2022', grupo: 'pe', detalle: 'Private equity', entidad: 'Magnum Capital', ten: T(100), valor: 150000, done: 2 },
    { id: 'b11', nombre: 'Plan de pensiones BBVA', grupo: 'pen', detalle: 'Plan de pensiones individual', entidad: 'BBVA', ten: T(100), valor: 210000, done: 3 },
    { id: 'b12', nombre: 'Plan de empleo EY', grupo: 'pen', detalle: 'Plan de empleo', entidad: 'Fidelity', ten: T(100), valor: 95000, done: 1 },
    { id: 'b13', nombre: 'Sociedad patrimonial familiar', grupo: 'emp', detalle: 'Participación', entidad: '—', ten: T(50, 50), valor: 340000, done: 2 },
    { id: 'b14', nombre: 'Colección de arte', grupo: 'otr', detalle: 'Otro activo', entidad: '—', ten: T(100), valor: 90000, done: 1 },
    { id: 'b15', nombre: 'Vehículo', grupo: 'otr', detalle: 'Otro activo', entidad: '—', ten: T(100), valor: 55000, done: 3 },
    { id: 'b16', nombre: 'Hipoteca Chamartín', grupo: 'deu', detalle: 'Préstamo', entidad: 'Santander', ten: T(50, 50), valor: -520000, done: 3 },
    { id: 'b17', nombre: 'Hipoteca Sotogrande', grupo: 'deu', detalle: 'Préstamo', entidad: 'BBVA', ten: T(50, 50), valor: -290000, done: 2 }];
  const PLANS = [
    { id: 'p1', cliente: 'Andrés Molina Vega', plan: 'Plan patrimonial', tipo: 'Patrimonio', estado: 'Borrador', done: 3, gestor: 'GA', upd: 'Hace 2 h' },
    { id: 'p2', cliente: 'Clara Ruiz Benítez', plan: 'Jubilación 2031', tipo: 'Jubilación', estado: 'Cumplimentada', done: 5, gestor: 'GA', upd: 'Ayer' },
    { id: 'p3', cliente: 'Luis Herrero Campos', plan: 'Sucesión familiar', tipo: 'Sucesión', estado: 'Entregada', done: 5, gestor: 'MR', upd: '3 d' },
    { id: 'p4', cliente: 'Irene Castro Lozano', plan: 'Revisión anual', tipo: 'Patrimonio', estado: 'Borrador', done: 1, gestor: 'GA', upd: '4 d' },
    { id: 'p5', cliente: 'Pablo Serrano Díaz', plan: 'Venta de la empresa', tipo: 'Inversión', estado: 'Cumplimentada', done: 4, gestor: 'LS', upd: '1 sem' },
    { id: 'p6', cliente: 'Nuria Gómez Pardo', plan: 'Jubilación anticipada', tipo: 'Jubilación', estado: 'Borrador', done: 2, gestor: 'GA', upd: '1 sem' },
    { id: 'p7', cliente: 'Familia Vidal Romero', plan: 'Legado a los hijos', tipo: 'Sucesión', estado: 'Descargada', done: 5, gestor: 'MR', upd: '2 sem' },
    { id: 'p8', cliente: 'Sara Medina Ortiz', plan: 'Plan 2024', tipo: 'Patrimonio', estado: 'Entregada', done: 5, gestor: 'LS', upd: '8 meses', arch: true },
    { id: 'p9', cliente: 'Diego Fuentes Marín', plan: 'Jubilación 2025', tipo: 'Jubilación', estado: 'Descargada', done: 5, gestor: 'GA', upd: '1 año', arch: true }];
  const PAGE_TABS = { ingresos: ['liq'], gastos: ['liq'], patrimonio: ['pat', 'leg'], legado: ['leg', 'liq'], jubilacion: ['leg', 'liq'], aa: ['ren'], gl: ['liq', 'ren'] };
  const AA0 = { rv: 55, rf: 25, mon: 12, alt: 8 }, AAK = { rv: 0.06, rf: 0.02, mon: -0.01, alt: 0.04 };
  const AAL = [['rv', 'Renta variable'], ['rf', 'Renta fija'], ['mon', 'Monetario'], ['alt', 'Alternativos']];
  /* 3.12 optimisations: target profiles, acquisition cost (example data), tax on the switch (19 % of the gain; fund transfers and cash pay none) */
  const PERFILES = [['con', 'Conservador', 2.61], ['mod', 'Moderado', 3.80], ['equ', 'Equilibrado', 4.95], ['din', 'Dinámico', 6.10]];
  const ACQ = { b4: 0.72, b5: 0.8, b6: 0.55, b8: 0.6, b9: 0.5, b10: 0.85, b13: 0.6, b14: 0.7, b15: 1.2 };
  const isFund = (a) => a.detalle === 'Fondos de inversión';
  const gainOf = (a) => a.grupo === 'liq' ? 0 : Math.max(0, num(a.valor) * (1 - (ACQ[a.id] || 0.75)));
  const taxRate = (a) => (a.grupo === 'liq' || isFund(a) || !num(a.valor)) ? 0 : gainOf(a) * 0.19 / num(a.valor);
  const OA_OK = (a) => (a.grupo === 'liq' || a.grupo === 'inv' || a.grupo === 'inm') && a.detalle !== 'Vivienda habitual' && num(a.valor) > 0;
  const GL_OK = (a) => a.grupo !== 'deu' && a.detalle !== 'Vivienda habitual' && num(a.valor) > 0;
  /* expected return with optimisations: each one moves the net (after tax) amount of its assets to its profile's return */
  const oaRen = (pat, list) => { const F = pat.filter(OA_OK).reduce((t, a) => t + num(a.valor), 0) || 1; let r = 2.4;
    (list || []).forEach((o) => { const rate = (PERFILES.find((p) => p[0] === o.perfil) || PERFILES[1])[2]; Object.keys(o.sel || {}).forEach((id) => { const c = o.sel[id], a = pat.find((x) => x.id === id); if (!a || !c || !c.on) return; const amt = Math.min(num(c.amt != null ? c.amt : a.valor), num(a.valor)); r += (rate - 2.4) * amt * (1 - taxRate(a)) / F; }); });
    return r; };
  /* cash generation: manual sales land in their year; automatic ones fill the deficit years in order, cheapest tax first */
  const glAlloc = (pat, glp, net0) => {
    const sel = (glp && glp.sel) || {}, assets = pat.filter((a) => GL_OK(a) && sel[a.id] && sel[a.id].on).sort((x, y) => taxRate(x) - taxRate(y));
    const add = net0.map(() => 0), need = net0.map((v) => (v < 0 ? -v : 0)), left = need.slice(), used = {};
    const gross = (a) => { const c = sel[a.id]; return c.part ? Math.min(num(c.amt), num(a.valor)) : num(a.valor); };
    assets.filter((a) => sel[a.id].mode === 'manual').forEach((a) => { const g = gross(a), tax = g * taxRate(a), n = g - tax, i = num(sel[a.id].year) - (YEAR0 + 1); if (i >= 0 && i < add.length) { add[i] += n; left[i] = Math.max(0, left[i] - n); } used[a.id] = { gross: g, tax, net: n, years: i >= 0 ? [YEAR0 + 1 + i] : [] }; });
    assets.filter((a) => sel[a.id].mode !== 'manual').forEach((a) => { const r = taxRate(a); let avail = gross(a) * (1 - r), got = 0; const yrs = []; for (let i = 0; i < left.length && avail > 0.5; i++) { if (left[i] > 0.5) { const t = Math.min(left[i], avail); left[i] -= t; avail -= t; add[i] += t; got += t; yrs.push(YEAR0 + 1 + i); } } const g = r < 1 ? got / (1 - r) : 0; used[a.id] = { gross: g, tax: g - got, net: got, years: yrs }; });
    const needT = need.reduce((t, x) => t + x, 0), leftT = left.reduce((t, x) => t + x, 0);
    return { add, used, need, left, needT, covered: needT - leftT, uncovered: left.filter((x) => x > 0.5).length, assets };
  };
  const aaRetOf = (p) => 2.4 + AAL.reduce((t, [k]) => t + (num(p[k]) - AA0[k]) * AAK[k], 0);
  const pc1 = (x) => x.toFixed(1).replace('.', ',') + ' %';
  const blank = () => ({ pctT: '100', pctP: '0', reval: '', tasa: '', renta: '', anio: '', coste: '', hip: '', pend: '' });
  const SECS = [
    { key: 'tit', title: 'Titulares y porcentajes', text: 'Quién es dueño y en qué porcentaje. Sirve para el legado de cada persona.', fields: ['pctT', 'pctP'] },
    { key: 'rev', title: 'Revalorización y rentas', text: 'Cuánto se espera que crezca y qué renta da cada año.', fields: ['reval', 'tasa', 'renta'] },
    { key: 'fis', title: 'Fiscalidad y deuda asociada', text: 'Año y coste de compra para la plusvalía, e hipoteca si la hay.', fields: ['anio', 'coste', 'hip'] }];
  const secDone = (m, sec) => sec.key === 'tit' ? (num(m.pctT) + num(m.pctP) === 100) : sec.fields.every((f) => String(m[f] || '').trim() !== '') && (sec.key !== 'fis' || m.hip !== 'Sí' || String(m.pend).trim() !== '');

  /* status next to a section title: icon + coloured text, no tint */
  const St = ({ tone, text, busy }) => busy
    ? h('span', { className: 'r4-st r4-st--info' }, C('Spinner', { size: 'xs' }), 'Recalculando…')
    : h('span', { className: 'r4-st r4-st--' + tone }, I(tone === 'success' ? 'circle-check' : tone === 'neutral' ? 'circle-dashed' : 'triangle-alert', 14), text);

  /* bars by age (3.61 «Impacto en el plan»): grey bars, last one dark, negatives red, a goal line and the retirement mark */
  class Bars extends React.Component {
    constructor(p) { super(p); this.state = { at: null }; }
    render() {
      const { values, labels, goal, goalLabel, mark, markLabel, format, height, label, base, baseLabel } = this.props, at = this.state.at;
      const max = Math.max.apply(null, values.concat(goal || 0, 0, base || [])) * 1.08, min = Math.min.apply(null, values.concat(0, base || [])) * 1.08, range = (max - min) || 1;
      const y = (v) => (max - v) / range * 100, n = values.length, w = 100 / n, last = n - 1;
      const show = at == null ? -1 : at;
      return h('div', { className: 'r4-bars', role: 'img', 'aria-label': label },
        h('div', { className: 'r4-bars__plot', style: { height: (height || 120) + 'px' }, onMouseLeave: () => this.setState({ at: null }) },
          at != null ? h('span', { className: 'r4-bars__tip' + (values[at] < 0 ? ' is-neg' : ''), style: { left: Math.min(88, Math.max(12, at * w + w / 2)) + '%', top: (values[at] >= 0 ? y(values[at]) : y(0)) + '%' } }, h('small', null, labels[at]), h('strong', null, format(values[at]))) : null,
          values.map((v, i) => h('i', { key: i, className: 'r4-bar' + (v < 0 ? ' r4-bar--neg' : '') + (i === show ? ' is-on' : '') + (i === last ? ' is-last' : ''),
            onMouseEnter: () => this.setState({ at: i }),
            style: { left: (i * w + w * 0.12) + '%', width: (w * 0.76) + '%', top: (v >= 0 ? y(v) : y(0)) + '%', height: (Math.abs(v) / range * 100) + '%' } })),
          min < 0 ? h('b', { className: 'r4-bars__zero', style: { top: y(0) + '%' } }, h('span', null, '0 €')) : null,
          goal ? h('b', { className: 'r4-bars__goal', style: { top: y(goal) + '%' } }, h('span', null, goalLabel)) : null,
          mark != null ? h('b', { className: 'r4-bars__mark', style: { left: (mark * w + w / 2) + '%' } }, h('span', null, markLabel)) : null,
          base ? h('svg', { className: 'r4-bars__base', viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': true }, h('polyline', { points: base.map((b, i) => (i * w + w / 2).toFixed(2) + ',' + y(b).toFixed(2)).join(' '), vectorEffect: 'non-scaling-stroke' })) : null),
        base ? h('div', { className: 'r4-bars__leg' }, h('span', null, h('i', { className: 'r4-key' }), this.props.nowLabel || 'Con el cambio'), h('span', null, h('i', { className: 'r4-bars__legline' }), baseLabel || 'Sin el cambio')) : null,
        h('div', { className: 'r4-bars__axis' }, h('span', null, labels[0]), mark != null ? h('span', { style: { left: (mark * w + w / 2) + '%' } }, labels[mark]) : null, h('span', null, labels[last])));
    }
  }

  /* 3.61 ReturnRuler: 0–10 %, four bands, the current return (dashed) and the required one (handle), scenario spread */
  const BANDS = [{ from: 0, to: 2, label: 'Asumible' }, { from: 2, to: 4, label: 'Moderada' }, { from: 4, to: 7, label: 'Exigente' }, { from: 7, to: 10, label: 'Muy exigente' }];
  /* 3.12 ruler, built like Wealth Planner's ReturnRuler with our tokens: one bar in four graded bands, the band of the required return outlined, Actual dashed, Necesaria solid, a 1 % scale, band names below */
  const Ruler2 = ({ required, actual }) => {
    const x = (v) => Math.max(0, Math.min(100, v * 10)), band = BANDS.find((b) => required >= b.from && required < b.to) || BANDS[3], pc = (v) => v.toFixed(1).replace('.', ',') + ' %';
    const close = Math.abs(required - actual) < 1.4;
    return h('div', { className: 'r4-rr', role: 'img', 'aria-label': 'Rentabilidad necesaria ' + pc(required) + ', actual ' + pc(actual) + '. Exigencia: ' + band.label.toLowerCase() + '.' },
      h('div', { className: 'r4-rr__tags' },
        h('span', { className: 'r4-rr__tag' + (close && actual < required ? ' is-end' : ''), style: { left: x(actual) + '%' } }, 'Actual ', h('strong', null, pc(actual))),
        h('span', { className: 'r4-rr__tag' + (close && actual < required ? ' is-start' : ''), style: { left: x(required) + '%' } }, 'Necesaria ', h('strong', null, pc(required)))),
      h('div', { className: 'r4-rr__bar' },
        BANDS.map((b, i) => h('i', { key: b.label, className: 'r4-rr__band r4-rr__band--' + i + (b === band ? ' is-on' : ''), style: { left: x(b.from) + '%', width: (x(b.to) - x(b.from)) + '%' } })),
        h('i', { className: 'r4-rr__act', style: { left: x(actual) + '%' } }),
        h('i', { className: 'r4-rr__req', style: { left: x(required) + '%' } })),
      h('div', { className: 'r4-rr__ticks' }, Array.from({ length: 11 }, (_, t) => h('span', { key: t, style: { left: x(t) + '%' } }, t === 10 ? '10 %' : String(t)))),
      h('div', { className: 'r4-rr__bands' }, BANDS.map((b) => h('span', { key: b.label, className: b === band ? 'is-on' : '', style: { left: x(b.from) + '%' } }, b.label, h('small', null, b.from + '–' + b.to + ' %')))));
  };
  const Ruler = ({ required, actual, range }) => {
    const x = (v) => Math.max(0, Math.min(100, v * 10)) + '%', band = BANDS.find((b) => required >= b.from && required < b.to) || BANDS[3];
    const pc = (v) => v.toFixed(1).replace('.', ',') + ' %';
    return h('div', { className: 'r4-ruler', role: 'img', 'aria-label': 'Rentabilidad necesaria ' + pc(required) + ', actual ' + pc(actual) + ' en el escenario medio.' },
      h('div', { className: 'r4-ruler__tags' },
        h('span', { className: Math.abs(required - actual) < 2 ? 'is-end' : '', style: { left: x(actual) } }, 'Actual ', h('strong', null, pc(actual))),
        h('span', { className: 'is-req' + (Math.abs(required - actual) < 2 ? ' is-start' : ''), style: { left: x(required) } }, I('sparkles', 12), 'Necesaria ', h('strong', null, pc(required)))),
      h('div', { className: 'r4-ruler__track' },
        BANDS.map((b) => h('i', { key: b.label, className: 'r4-ruler__band' + (b === band ? ' is-on' : ''), style: { left: x(b.from), width: (b.to - b.from) * 10 + '%' } })),
        h('i', { className: 'r4-ruler__range', style: { left: x(range[0]), width: (range[1] - range[0]) * 10 + '%' } }),
        h('i', { className: 'r4-ruler__actual', style: { left: x(actual) } }),
        h('i', { className: 'r4-ruler__req', style: { left: x(required) } })),
      h('div', { className: 'r4-ruler__ticks' }, [0, 2, 4, 6, 8, 10].map((t) => h('span', { key: t, style: { left: x(t) } }, t))),
      h('div', { className: 'r4-ruler__bands' }, BANDS.map((b) => h('span', { key: b.label, className: b === band ? 'is-on' : '', style: { left: x(b.from), width: (b.to - b.from) * 10 + '%' } }, b.label, h('small', null, b.from + '–' + b.to + ' %')))));
  };

  class App extends window.WPRows3.App {
    constructor(props) {
      super(props);
      /* El plan starts at half the screen (the menu folds to icons on its own) */
      if (!(props.estado && /"size"|&quot;size/.test(typeof props.estado === 'string' ? props.estado : JSON.stringify(props.estado)))) this.state.size = 'wide';
      this.state = Object.assign({ keep: 'manual', keepIds: ['a1', 'a2'], extra: 580000, edad: 100, colchon: 30000, firstRun: false, obStep: 1, view: {} }, this.state);
      if ((this.state.screen === 'aa' || this.state.screen === 'gl') && !this.state.subs) this.state.subs = [this.state.screen];
      if (this.state.v32 && !this.state.patReal) { this.state.pat = this.state.v39 ? REAL.map((x) => x.id === 'b8' ? Object.assign({}, x, { ten: [['Titular', 40], ['Pareja', 40], ['Terceros', 20]] }) : x.id === 'b13' ? Object.assign({}, x, { ten: [['Titular', 40], ['Pareja', 30], ['Terceros', 30]] }) : x.id === 'b10' ? Object.assign({}, x, { ten: [['Titular', 75], ['Terceros', 25]] }) : (x.id === 'b2' && this.state.v311) ? Object.assign({}, x, { ten: [['Titular', 40], ['Pareja', 40], ['Terceros', 20]] }) : x) : REAL.slice(); this.state.patReal = true; this.state.keep = this.state.keep === 'manual' ? 'vivienda' : this.state.keep; }
      const mo = this.state.more || {};
      this.state.pat = this.state.pat.map((x) => { const m = mo[x.id] || MORE0[x.id]; return m ? Object.assign({}, x, { done: SECS.filter((sec) => secDone(m, sec)).length }) : x; });
    }
    actionInHead() { return true; }
    setSize(size) { clearTimeout(this._rz); this.setState({ size, drag: null, resizing: true }); this._rz = setTimeout(() => this.setState({ resizing: false }), reduced() ? 0 : 420); }
    /* five sizes: closed, narrow, medium, half, large (the page keeps 480 px) */
    railCollapsed() { const s = this.state; if (s.v312 && s.agent) return true; return s.railC != null ? s.railC : (s.size === 'wide' || s.size === 'large'); }
    sizes() { return this.state.v312 ? ['closed', 'wide', 'large'] : ['closed', 'narrow', 'medium', 'wide', 'large']; }
    step(d) { const L = this.sizes(), i = L.indexOf(this.state.size); this.setSize(L[Math.max(0, Math.min(L.length - 1, i + d))]); }
    onUp() {
      window.removeEventListener('pointermove', this.onMove); window.removeEventListener('pointerup', this.onUp);
      if (this.state.drag == null) return;
      const w = this.state.drag; let best = 'narrow', d = 1e9;
      this.sizes().forEach((k) => { const dd = Math.abs(this.px(k) - w); if (dd < d) { d = dd; best = k; } });
      this.setSize(best);
    }
    /* 3.13: clickable table rows join the Tab order (the DS TableRow drops tabIndex) */
    rowFocus() { if (!this.state.v312) return; try { document.querySelectorAll('tr.afi-table-v2__row--hoverable:not([tabindex]), tr.r4-pick:not([tabindex])').forEach((r) => r.setAttribute('tabindex', '0')); } catch (x) {} }
    componentWillUnmount() { (this._demoT || []).forEach(clearTimeout); if (this._numKeys) document.removeEventListener('keydown', this._numKeys, true); (this._rpT || []).forEach(clearTimeout); super.componentWillUnmount(); try { this._ro && this._ro.disconnect(); } catch (e) {} }
    px(size) {
      const rail = this.railCollapsed() ? RAIL.closed : RAIL.open, avail = this.boardW() - rail - 16 * 2 - 12 - (this.state.v312 && this.state.agent ? 352 : 0);
      /* half the screen, but the page always keeps at least 480 px */
      const half = Math.round(avail / 2), wide = avail - half >= 480 ? Math.max(half, 560) : Math.max(360, avail - 480);
      const large = Math.max(wide, avail - 480);
      return { closed: 64, narrow: 360, medium: Math.min(480, Math.max(360, avail - 480)), wide, large }[size];
    }
    narrowList() { return false; } /* the list now adapts with container queries (rows4.css) */
    /* this board's own width: on the canvas a board is not the browser window */
    boardW() { const sh = this._work && this._work.closest('.afi-shell'); return (sh && sh.getBoundingClientRect().width) || window.innerWidth || 1440; }
    /* 3.13: while dragging out of the folded plan, keep it folded until it is most of the way to «Mitad»; then the frame pops in */
    mode() { const s = this.state, w = this.width(); if (s.v312 && (s.look || '').indexOf('frame') >= 0 && s.drag != null && w < Math.max(360, this.px('wide') * 0.7)) return 'closed'; return super.mode(); }
    onMove(e) { this.setState({ drag: Math.max(64, Math.min(this._right - e.clientX - 6, this.boardW() * 0.62)) }); }
    plan$() { return this._plan || null; }
    /* scroll the plan to a section only if it is not already in sight */
    reveal(anchor) {
      setTimeout(() => {
        const box = this.plan$(), sc = box && box.querySelector(':scope > .r3-plan__scroll'), plan = sc || box, el = plan && plan.querySelector('[data-anchor="' + anchor + '"]'); if (!el) return;
        const pr = plan.getBoundingClientRect(), er = el.getBoundingClientRect(), head = sc ? 16 : 72;
        if (er.top >= pr.top + head && er.top <= pr.bottom - 120) return;
        plan.scrollTo({ top: er.top - pr.top + plan.scrollTop - head, behavior: reduced() ? 'auto' : 'smooth' });
      }, 420);
    }
    getSnapshotBeforeUpdate(pp, ps) {
      if (!this.state.v311) return null;
      const st = this.state, moved = ps.sort !== st.sort || ps.famView !== st.famView || ps.pf !== st.pf || ps.pf2 !== st.pf2 || ps.pst !== st.pst;
      if (!moved || ps.pgroup !== st.pgroup) return null;
      const m = {}; document.querySelectorAll('.r4-table2--real [data-row]').forEach((el) => { const tr = el.closest('tr'); if (tr) m[el.getAttribute('data-row')] = tr.getBoundingClientRect().top; });
      return { rows: m };
    }
    componentDidUpdate(pp, ps, snap) {
      this.rowFocus();
      /* 3.14: entering simulation and opening the conversation are moments; boards that load already in that state don't replay them */
      if (this.state.v312 && !ps.sim && this.state.sim) { clearTimeout(this._seT); this.setState({ simEnter: (this.state.simChanges || []).length || this.state.thinking || ps.thinking ? 'ai' : 'manual' }); this._seT = setTimeout(() => this.setState({ simEnter: false }), 3700); }
      if (this.state.v312 && !(ps.agentLog || []).length && (this.state.agentLog || []).length) { clearTimeout(this._deT); this.setState({ dockEnter: true }); this._deT = setTimeout(() => this.setState({ dockEnter: false }), 1400); }
      if (this.state.v312 && this._plan) { const md = this.mode(); if (this._lastMode === 'closed' && md !== 'closed') { const el = this._plan; el.classList.add('is-popping'); setTimeout(() => el.classList.remove('is-popping'), 620); } this._lastMode = md; }
      if (snap && snap.rows && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        const cs = getComputedStyle(document.documentElement), dur = parseFloat(cs.getPropertyValue('--mo-dur-out')) || 400, ease = (cs.getPropertyValue('--motion-easing-standard') || '').trim() || 'cubic-bezier(.16,1,.3,1)';
        if (ps.famView !== this.state.famView) document.querySelectorAll('.r4-table2--real [data-part]').forEach((el) => { const tr = el.closest('tr'); if (tr && tr.animate) tr.querySelectorAll('td').forEach((td) => td.animate([{ backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-info-50').trim() || '#e8f3fa' }, { backgroundColor: 'transparent' }], { duration: 1400, easing: 'ease-out' })); });
        document.querySelectorAll('.r4-table2--real [data-row]').forEach((el) => {
          const tr = el.closest('tr'), id = el.getAttribute('data-row'), was = snap.rows[id];
          if (!tr || !tr.animate) return;
          if (was == null) { tr.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: dur * 0.8, easing: ease }); return; }
          const dy = was - tr.getBoundingClientRect().top;
          if (Math.abs(dy) > 1) tr.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: dur, easing: ease });
        });
      }
      if (ps.screen !== this.state.screen && this.state.ia === 'tabs2') {
        const st = this.state, vm = st.viewMode || 'A', want = (PAGE_TABS[st.screen] || ['liq'])[0];
        if ((vm === 'A' && st.planView === 'pagina') || ((vm === 'C' || vm === 'D') && st.autoTab !== false) || vm === 'E') this.setState({ iaTab: want });
      }
      if (ps.screen !== this.state.screen) {
        const c = CTX[this.state.screen] || CTX.ingresos, to = c[1] || ('sec-' + c[0][0]);
        if (to && this.state.follow !== false) this.reveal(to);
      }
    }
    componentDidMount() {
      super.componentDidMount();
      /* 3.13: ↑/↓ step any numeric field (Shift: ×10). The unit sets the step: € → 1.000, % → 0,1, años or none → 1 */
      if (this.state.v312 && !this._numKeys) {
        this._numKeys = (e) => {
          const el = e.target;
          /* rows that open on click also open with Enter or Space */
          if ((e.key === 'Enter' || e.key === ' ') && el && el.tagName === 'TR' && el.closest('.r3-work, .r4-home, body')) { e.preventDefault(); el.click(); return; }
          if (!(e.key === 'ArrowUp' || e.key === 'ArrowDown') || !el || el.tagName !== 'INPUT' || !/^(decimal|numeric)$/.test(el.getAttribute('inputmode') || '') || !el.closest('.r3-work')) return;
          const box = el.closest('.afi-input-v2, .afi-input, .afi-field, label') || el.parentElement, unit = ((box && box.textContent) || '').match(/€|%|años/), u = unit ? unit[0] : '';
          const step = (u === '€' ? 1000 : u === '%' ? 0.1 : 1) * (e.shiftKey ? 10 : 1), cur = num(el.value), next = Math.max(0, Math.round((cur + (e.key === 'ArrowUp' ? step : -step)) * 10) / 10);
          const out = u === '%' ? String(next.toFixed(1)).replace('.', ',') : u === '€' ? fmt(next) : String(Math.round(next));
          e.preventDefault(); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(el, out); el.dispatchEvent(new Event('input', { bubbles: true }));
        };
        document.addEventListener('keydown', this._numKeys, true);
      }
      this.rowFocus();
      /* 3.14 demo boards: play the AI sequence on repeat (ask → thinking → lands → settles → reset, or edit → recalculating → count up). A click on the board stops it. */
      if (this.state.v312 && this.state.demoLoop && !reduced()) {
        const T = (fn, ms) => { this._demoT = (this._demoT || []).concat(setTimeout(fn, ms)); };
        const stop = () => { (this._demoT || []).forEach(clearTimeout); this._demoT = []; this._demoOff = true; };
        document.addEventListener('pointerdown', stop, { once: true, capture: true });
        const fold = this.state.dockOpen === false;
        const askCycle = () => { if (this._demoOff) return;
          this.setState({ agentLog: [], sim: false, simChanges: [], thinking: null, thought: {}, dockOpen: true });
          T(() => this.runAgent('sell'), 1400);
          if (fold) T(() => this.setState({ dockOpen: false }), 4400);
          T(askCycle, 13000); };
        const editCycle = () => { if (this._demoOff) return;
          this.setState((st) => ({ colchon: num(st.colchon) > 40000 ? 30000 : 60000, lastCause: 'Con el colchón cambiado' }));
          T(editCycle, 6000); };
        T(this.state.demoLoop === 'edit' ? editCycle : askCycle, 900);
      }
      /* replay (canvas example): the proposal is typed, «Aplicar al plan» is pressed, the plan recalculates, the AI moment lands */
      const rp = this.state.replay;
      if (rp && !this._rp) {
        this._rp = true; this.setState(rp.opts ? { replay: null } : { aaDraft: rp.aaApplied, replay: null });
        this._rpT = [setTimeout(() => { if (rp.opts) { this.setState({ opts: rp.opts, lastCause: 'Al aplicar la optimización «' + rp.opts[0].name + '»' }); this.toast('Optimización «' + rp.opts[0].name + '» aplicada al plan.'); return; } this.setState({ aaApplied: rp.aaApplied, aaDraft: null, lastCause: 'Al aplicar la propuesta de Asset allocation (renta variable ' + num(rp.aaApplied.rv) + ' %)' }); this.toast('Propuesta aplicada. El plan se ha recalculado.'); }, rp.at || 1800)];
        if (rp.pop) this._rpT.push(setTimeout(() => this.setState({ pop: 'ai' }), (rp.at || 1800) + 2400));
      }
      if ((CTX[this.state.screen] || [])[1] || this.state.arrive) this.componentDidUpdate(this.props, Object.assign({}, this.state, { screen: null })); /* first load: only the optimisation pages need a scroll */
    }

    /* ---------- goals ---------- */
    goal() {
      const s = this.state, val = (id) => num((s.pat.find((a) => a.id === id) || {}).valor);
      if (s.firstRun) return 0;
      if (s.keep === 'patrimonio') return s.pat.reduce((t, a) => t + num(a.valor), 0);
      if (s.keep === 'vivienda') return val('a1');
      return s.keepIds.reduce((t, id) => t + val(id), 0) + num(s.extra);
    }

    /* ---------- the plan's numbers ---------- */
    /* the plan's numbers for a state (no server wait); `over` replaces state keys, e.g. the state before a change */
    modelFor(over) { const keep = this.state; this.state = Object.assign({}, keep, over || {}); try { return this.compute(); } finally { this.state = keep; } }
    live() { const vals = this.compute(); const live = this.pvHold(vals); return { v: live.vals, busy: live.busy || !!this.props.hold }; }
    compute() {
      const e = this.effect(), s = this.state, goal = this.goal();
      const ch = s.v312 ? (s.applied || []).concat(s.sim ? (s.simChanges || []) : []) : [], has = (k) => ch.indexOf(k) >= 0; let legD = 0;
      let year = (has('import') ? 32600 : 0) + s.inc.filter((r) => !r.ended && r.desde !== 'Jubilación').reduce((t, r) => t + num(r.importe) * PER_YEAR[r.freq], 0);
      if (s.adding && s.screen === 'ingresos' && s.draft && num(s.draft.importe) > 0) year += num(s.draft.importe) * PER_YEAR[s.draft.freq || 'Mensual'];
      const K = (year - BASE_YEAR) / (900 * 12), col = num(s.colchon) - 30000;
      const net = LIQ_BASE.map((v) => Math.round((K >= 1 ? Math.max(v + 10500 * K, 2100) : v + 10500 * K) - col / 10));
      /* 3.13 Jubilación: the retirement age (page or a simulation «jub:NN») moves salary years against pension years */
      const jubSim = ch.find((k) => String(k).indexOf('jub:') === 0), ra = jubSim ? num(jubSim.slice(4)) : (num(s.retAge) || RETIRE), dr = ra - RETIRE;
      if (dr) { legD += dr * (dr < 0 ? 360000 : 60000); net.forEach((x, i) => { const age = AGE0 + 1 + i; if (dr < 0 && age >= ra && age < RETIRE) net[i] -= 15000; if (dr > 0 && age >= RETIRE && age < ra) net[i] += 15000; }); }
      /* the Pareja is 3 years younger and retires at 67 by default: their salary stops and their pension starts at their own age */
      const ra2 = num(s.retAge2) || 67, dp = ra2 - 67;
      if (dp) { legD += dp * (dp < 0 ? 200000 : 40000); net.forEach((x, i) => { const age2 = AGE0 + 1 + i - 3; if (dp < 0 && age2 >= ra2 && age2 < 67) net[i] -= 8000; if (dp > 0 && age2 >= 67 && age2 < ra2) net[i] += 8000; }); }
      const net0 = net.slice();
      if (s.v312) glAlloc(s.pat, s.glp, net0).add.forEach((x, i) => { net[i] += Math.round(x); });
      if (has('beca')) { for (let i = 0; i < 4; i++) net[i] += 12000; legD += 55000; }
      if (has('sell')) { const b8 = s.pat.find((a) => a.id === 'b8'); if (b8) { const tax = num(b8.valor) * taxRate(b8); let left = num(b8.valor) - tax; legD -= Math.round(tax); for (let i = 2030 - (YEAR0 + 1); i < net.length && left > 0; i++) if (net[i] < 0) { const t = Math.min(-net[i], left); net[i] += t; left -= t; } } }
      else Object.keys(s.gl || {}).forEach((id) => { const g = s.gl[id]; if (!g || !g.on) return; const i = num(g.year) - (YEAR0 + 1); if (i >= 0 && i < net.length) net[i] += num(g.amount); });
      const ren = s.v312 ? oaRen(s.pat, (s.opts || []).filter((o) => !s.oaEdit || o.id !== s.oaEdit.id).concat(s.oaEdit ? [s.oaEdit] : [])) : s.aaApplied ? aaRetOf(s.aaApplied) : 2.4, rf = 1 + (ren - 2.4) * 0.06;
      const edad = Math.max(80, Math.min(110, num(s.edad) || 100)), n = edad - AGE0 + 1;
      const medio = Array.from({ length: n }, (_, i) => { const t = i / (n - 1), f = t * 8, k = Math.min(7, Math.floor(f)), sh = SHAPE[k] + (SHAPE[k + 1] - SHAPE[k]) * (f - k); return Math.round((e.pat * sh + (e.legado - e.pat * SHAPE[8]) * t) * (1 + (rf - 1) * t)); });
      if (legD) for (let i = 0; i < n; i++) medio[i] += Math.round(legD * i / (n - 1));
      const end = medio[n - 1], sc = { opt: Math.round(end * 1.36), med: end, pes: Math.round(end * 0.76) };
      const cover = { opt: !goal || sc.opt >= goal, med: !goal || sc.med >= goal, pes: !goal || sc.pes >= goal };
      const def = net.filter((v) => v < 0).length, worstI = net.reduce((b, v, i) => v < net[b] ? i : b, 0);
      return { goal, edad, medio, sc, cover, net, def, worst: net[worstI], worstYear: YEAR0 + 1 + worstI, pat: e.pat, groups: e.groups, draft: e.draft, colchon: num(s.colchon), ren, net0, ra, ra2 };
    }

    /* ---------- El plan ---------- */
    /* ---------- 3.13 Jubilación (options A to E, state jubOpt) ---------- */
    jubPeople() { const s = this.state; return { tit: { name: 'Titular', nac: YEAR0 - AGE0, mes: 'noviembre', base: 53323, age: num(s.retAge) || RETIRE }, par: { name: 'Pareja', nac: YEAR0 - AGE0 + 3, mes: 'abril', base: 41860, age: num(s.retAge2) || 67 } }; }
    jubType(e) { return e >= 66 ? 'Demorada' : e === 65 ? 'Ordinaria' : e >= 63 ? 'Anticipada voluntaria' : e >= 61 ? 'Anticipada involuntaria' : 'Retiro anticipado'; }
    jubPension(p, e) { const F = { 57: 0.62, 58: 0.66, 59: 0.70, 60: 0.74, 61: 0.78, 62: 0.82, 63: 0.88, 64: 0.94, 65: 1, 66: 1.04, 67: 1.08, 68: 1.12, 69: 1.16, 70: 1.19 }; const s = this.state, cut = e <= 62 && (p && p.key === 'par' ? s.retCot2 : s.retCot) === 'No' ? Math.max(0.6, 1 - 0.03 * (63 - e)) : 1; return Math.round(p.base * (F[Math.max(57, Math.min(70, e))] || 1) * cut); }
    /* plan figures for a retirement age, and the earliest age that still covers the legacy goal per scenario */
    jubAt(a) { return this.modelFor({ retAge: a, sim: false }); }
    jubMin() {
      const out = {}; ['opt', 'med', 'pes'].forEach((k) => { out[k] = null; for (let a = 57; a <= 70; a++) { if (this.jubAt(a).cover[k]) { out[k] = a; break; } } });
      return out;
    }
    jubScripts() {
      const o = {}, p = this.jubPeople().tit, m0 = this.jubAt(RETIRE);
      for (let a = 57; a <= 70; a++) { const an = this.jubPension(p, a), m = this.jubAt(a);
        o['jub:' + a] = { prompt: '¿Y si se jubila a los ' + a + '?', reply: 'He creado una simulación con la jubilación a los ' + a + ' (' + this.jubType(a).toLowerCase() + '). La pensión bruta pasa a ' + eur(an) + ' al año; el legado medio pasa de ' + m1(m0.sc.med) + ' a ' + m1(m.sc.med) + (m.def !== m0.def ? ' y los años con déficit, de ' + m0.def + ' a ' + m.def : '') + '.', card: { icon: 'armchair', title: 'Jubilación a los ' + a, rows: [this.jubType(a), 'Pensión ' + eur(an) + ' al año'] }, go: 'jubilacion', tab: 'leg' }; }
      return o;
    }
    jubPage() {
      if (/^(F|G|H)/.test(this.state.jubOpt || (this.state.v312 ? 'H' : ''))) return this.jubPageF();
      const s = this.state, opt = s.jubOpt || 'A', P = this.jubPeople(), t = P.tit, par = P.par, v = this.compute(), ra = v.ra, mn = this.jubMin(), base = this.modelFor({ retAge: RETIRE, retAge2: 67, sim: false });
      const an = this.jubPension(t, ra), setAge = (a) => this.setState({ retAge: a, lastCause: 'Con la jubilación a los ' + a });
      const ok = v.cover.med, delta = (x, y, f) => { const d = x - y; return d ? h('span', { className: 'r4-st--' + (d > 0 ? 'success' : 'warning') + ' r4-jub__d' }, (d > 0 ? '+' : '−') + f(Math.abs(d))) : null; };
      const verdict = h('div', { className: 'r4-verdict r4-st--' + (ok ? 'success' : 'warning') },
        I(ok ? 'circle-check' : 'triangle-alert', 16),
        h('div', null, h('strong', null, ok ? 'Puede jubilarse a los ' + ra + ' y el plan se cumple' : 'A los ' + ra + ' no se cubre el legado en el escenario medio'),
          h('p', null, mn.med ? 'El plan se cumple desde los ' + mn.med + ' en el escenario medio (optimista ' + (mn.opt || '—') + ', pesimista ' + (mn.pes || '—') + ').' : 'Ninguna edad hasta los 70 cubre el legado en el escenario medio.')));
      const slider = (who, val, set) => C('Slider', { label: 'Edad de jubilación · ' + who, min: 57, max: 70, step: 1, value: val, onChange: set, format: (x) => x + ' años', minLabel: '57', maxLabel: '70' });
      const typeRow = (p, a) => h('div', { className: 'r4-jub__type' }, C('Badge', { tone: a < 63 ? 'warning' : a === 65 ? 'neutral' : 'info' }, this.jubType(a)), h('span', { className: 'r2-muted' }, p.mes + ' de ' + (p.nac + a)));
      const extras = ra <= 62 ? h('div', { className: 'r4-jub__extra' },
        ra >= 61 ? C('Select', { label: 'Tipo de salida', value: s.retSalida || 'inv', options: [{ value: 'inv', label: 'Jubilación anticipada involuntaria' }, { value: 'ret', label: 'Retiro anticipado' }], onChange: (x) => this.setState({ retSalida: x }) }) : null,
        h('div', { className: 'r4-jub__q' }, h('span', null, '¿Seguirá cotizando hasta la jubilación?'), C('SegmentedControl', { value: s.retCot || 'Sí', onChange: (x) => this.setState({ retCot: x }), options: [{ value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }] }))) : null;
      const stats = h('dl', { className: 'r4-stats r4-jub__stats' },
        h('div', { className: 'r4-stat' }, h('dt', null, 'Pensión bruta anual'), h('dd', null, A(an))),
        h('div', { className: 'r4-stat' }, h('dt', null, 'Al mes · 14 pagas'), h('dd', null, A(Math.round(an / 14)))),
        h('div', { className: 'r4-stat' }, h('dt', null, 'Legado medio a los ' + v.edad), h('dd', null, A(v.sc.med, m1, 1), delta(v.sc.med, base.sc.med, (x) => eur(Math.round(x / 1000) * 1000)))),
        h('div', { className: 'r4-stat' }, h('dt', null, 'Años con déficit'), h('dd', null, A(v.def, (x) => String(Math.round(x))), v.def !== base.def ? h('span', { className: 'r4-st--' + (v.def > base.def ? 'warning' : 'success') + ' r4-jub__d' }, (v.def > base.def ? '+' : '−') + Math.abs(v.def - base.def) + (Math.abs(v.def - base.def) === 1 ? ' año' : ' años')) : null)));
      const parLine = h('div', { className: 'r4-jub__par' },
        h('div', { className: 'r4-jub__parh' }, h('strong', null, 'Pareja · ' + par.age + ' años'), C('Badge', { tone: par.age < 63 ? 'warning' : par.age === 65 ? 'neutral' : 'info' }, this.jubType(par.age)), h('span', { className: 'r2-muted' }, eur(this.jubPension(par, par.age)) + ' al año'), par.age !== 67 ? (() => { const m = this.modelFor({ retAge2: 67, sim: false }), d = v.sc.med - m.sc.med; return h('span', { className: 'r4-st--' + (d >= 0 ? 'success' : 'warning') + ' r4-jub__d' }, 'Legado medio ' + (d >= 0 ? '+' : '−') + eur(Math.round(Math.abs(d) / 1000) * 1000)); })() : null, h('span', { className: 'r2-spacer' }),
          C('Button', { variant: 'ghost', size: 'sm', onClick: () => this.setState({ jubPar: !s.jubPar }) }, s.jubPar ? 'Hecho' : 'Cambiar')),
        C('Reveal', { open: !!s.jubPar }, h('div', { className: 'r4-jub__parb' }, slider('Pareja', par.age, (a) => this.setState({ retAge2: a })))));
      const titular = h('section', { className: 'r4-sec r4-sec--flush r4-jub__sec' }, h('h3', { className: 'r4-jub__h' }, 'Titular'), slider('Titular', ra, setAge), typeRow(t, ra), extras, stats);
      const ages = [61, 63, 65, 67, 70];
      const head = this.head('Jubilación', 'Cuándo se jubila cada uno y qué pensión cobra. El plan, a la derecha, usa estas edades en todos los escenarios.');
      let body;
      if (opt === 'A') body = [verdict, titular, parLine];
      else if (opt === 'B') {
        const uses = [
          ['Pensión Titular', 'Ingresos · desde los ' + ra, eur(Math.round(an / 14)) + ' al mes, 14 pagas', 'Calculada aquí'],
          ['Pensión Pareja', 'Ingresos · desde los ' + par.age, eur(Math.round(this.jubPension(par, par.age) / 14)) + ' al mes, 14 pagas', 'Calculada aquí'],
          ['Nómina Titular', 'Ingresos · hasta los ' + ra, '2.600 € al mes', 'Termina aquí'],
          ['Nómina Pareja', 'Ingresos · hasta los ' + par.age, '1.600 € al mes', 'Termina aquí'],
          ['Gráficos del plan', 'Marca «Jubilación · ' + ra + '»', 'Legado y liquidez', 'Sigue la edad']];
        body = [verdict, titular, parLine,
          h('section', { className: 'r4-sec r4-jub__sec' }, h('h3', { className: 'r4-jub__h' }, 'Dónde se usa'),
            h('p', { className: 'r2-hint' }, 'La pensión ya no se escribe a mano en Ingresos: se calcula aquí y aparece allí como una fila de solo lectura. Al cambiar la edad, cambian las nóminas que terminan y las pensiones que empiezan.'),
            h('ul', { className: 'r4-jub__uses' }, uses.map((u) => h('li', { key: u[0] }, h('span', { className: 'r4-jub__un' }, h('strong', null, u[0]), h('span', { className: 'r2-muted' }, u[1])), h('span', { className: 'r4-jub__uv' }, u[2]), C('Tag', null, u[3])))))];
      } else if (opt === 'C') {
        const row = (a) => { const m = this.jubAt(a), cur = a === ra; return h('tr', { key: a, className: cur ? 'is-cur' : '' },
          h('td', null, h('strong', null, a + ' años'), h('span', { className: 'r2-muted r4-jub__tt' }, this.jubType(a))), h('td', { className: 'r4-num' }, eur(this.jubPension(t, a))), h('td', { className: 'r4-num' }, m1(m.sc.med)), h('td', { className: 'r4-num' }, String(m.def)),
          h('td', { className: 'r4-num' }, cur ? h('span', { className: 'r2-muted' }, 'En el plan') : C('Button', { variant: 'secondary', size: 'sm', iconStart: I('flask-conical', 14), onClick: () => this.runAgent('jub:' + a) }, 'Simular'))); };
        body = [verdict, titular,
          h('section', { className: 'r4-sec r4-jub__sec' }, h('h3', { className: 'r4-jub__h' }, 'Otras edades'),
            h('p', { className: 'r2-hint' }, '«Simular» prueba la edad en una simulación: el plan muestra qué cambia y nada se guarda hasta que lo aplique.'),
            h('table', { className: 'r4-jub__tbl' }, h('thead', null, h('tr', null, h('th', null, 'Edad'), h('th', { className: 'r4-num' }, 'Pensión anual'), h('th', { className: 'r4-num' }, 'Legado medio'), h('th', { className: 'r4-num' }, 'Años con déficit'), h('th', null))), h('tbody', null, ages.map(row)))), parLine];
      } else if (opt === 'D') {
        const span = 100 - AGE0, pos = (a) => ((a - AGE0) / span * 100) + '%', lane = (p, a, off) => h('div', { className: 'r4-tl__lane' },
          h('span', { className: 'r4-tl__who' }, p.name),
          h('div', { className: 'r4-tl__track' },
            h('i', { className: 'r4-tl__bar r4-tl__bar--work', style: { left: 0, width: pos(a - off) } }, 'Nómina'),
            h('i', { className: 'r4-tl__bar r4-tl__bar--pen', style: { left: pos(a - off), right: 0 } }, 'Pensión desde los ' + a + ' (' + (p.nac + a) + ') · ' + eur(this.jubPension(p, a)) + ' al año')));
        body = [verdict,
          h('section', { className: 'r4-sec r4-sec--flush r4-jub__sec' }, h('h3', { className: 'r4-jub__h' }, 'Línea de vida'),
            h('div', { className: 'r4-tl' }, lane(t, ra, 0), lane(par, par.age, -3),
              h('div', { className: 'r4-tl__axis' }, h('span', { style: { left: '0%' } }, 'Hoy · ' + YEAR0), h('span', { style: { left: pos(65) } }, String(YEAR0 + 65 - AGE0)), h('span', { style: { left: '100%' } }, String(YEAR0 + 100 - AGE0)))),
            h('div', { className: 'r4-line2 r4-line2--two' }, slider('Titular', ra, setAge), slider('Pareja', par.age, (a) => this.setState({ retAge2: a }))),
            typeRow(t, ra), extras, stats)];
      } else {
        const opts = [63, 65, 67].map((a) => { const m = this.jubAt(a); return { value: a, title: a + ' años · ' + this.jubType(a), help: h('span', { className: 'r4-jub__cc' },
          h('span', null, 'Pensión ', h('strong', null, eur(this.jubPension(t, a))), ' al año'), h('span', null, 'Legado medio ', h('strong', null, m1(m.sc.med))), h('span', null, 'Déficit ', h('strong', null, m.def + (m.def === 1 ? ' año' : ' años'))),
          h('span', { className: 'r4-st--' + (m.cover.med ? 'success' : 'warning') }, m.cover.med ? 'El plan se cumple' : 'No cubre el legado')) }; });
        body = [verdict,
          h('section', { className: 'r4-sec r4-sec--flush r4-jub__sec' }, h('h3', { className: 'r4-jub__h' }, 'Titular'),
            C('ChoiceCardGroup', { label: 'Edad de jubilación del titular', name: 'jubage', columns: 3, options: opts, value: [63, 65, 67].indexOf(ra) >= 0 ? ra : undefined, onChange: setAge }),
            h('div', null, C('Button', { variant: 'ghost', size: 'sm', onClick: () => this.setState({ jubOther: !s.jubOther }) }, s.jubOther ? 'Ocultar otra edad' : 'Otra edad')),
            C('Reveal', { open: !!s.jubOther }, slider('Titular', ra, setAge)), extras), parLine];
      }
      return h('div', { className: 'r2-main ap-in', key: 'jub-' + opt }, head, ...body);
    }
    /* Jubilación F: everything the current WP page does, on one page. Inputs per person (Titular open, Pareja folded),
       the questions that only apply to early retirement inline beside the age, outputs (pension, life line, plan) live. */
    jubPageF() {
      const s = this.state, P = this.jubPeople(), v = this.compute(), mn = this.jubMin(), base = this.modelFor({ retAge: RETIRE, retAge2: 67, sim: false });
      const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const ppl = [Object.assign({ key: 'tit', sfx: '', set: (a) => this.setState({ retAge: a, lastCause: 'Con la jubilación del titular a los ' + a }) }, P.tit),
        Object.assign({ key: 'par', sfx: '2', set: (a) => this.setState({ retAge2: a, lastCause: 'Con la jubilación de la pareja a los ' + a }) }, P.par)];
      const pen = (p, a) => this.jubPension(p, a), ok = v.cover.med;
      const dLeg = v.sc.med - base.sc.med, dDef = v.def - base.def;
      const chip = (d, txt) => d ? h('span', { className: 'r4-st--' + (d > 0 ? 'success' : 'warning') + ' r4-jub__d' }, txt) : null;
      const verdict = h('div', { className: 'r4-verdict r4-st--' + (ok ? 'success' : 'warning') }, I(ok ? 'circle-check' : 'triangle-alert', 16),
        h('div', null, h('strong', null, ok ? 'Con estas edades el plan se cumple' : 'Con estas edades no se cubre el legado en el escenario medio'),
          h('p', null, 'El titular podría jubilarse desde los ' + (mn.med || '—') + ' en el escenario medio (optimista ' + (mn.opt || '—') + ', pesimista ' + (mn.pes || '—') + '), con la pareja a los ' + P.par.age + '.')));
      /* output: the life line moves with both ages */
      const span = 100 - AGE0, pos = (a) => ((a - AGE0) / span * 100) + '%';
      const lane = (p, a, off) => h('div', { className: 'r4-tl__lane' }, h('span', { className: 'r4-tl__who' }, p.name),
        h('div', { className: 'r4-tl__track' }, h('i', { className: 'r4-tl__bar r4-tl__bar--work', style: { left: 0, width: pos(a - off) } }, 'Nómina'),
          h('i', { className: 'r4-tl__bar r4-tl__bar--pen', style: { left: pos(a - off), right: 0 } }, 'Pensión desde los ' + a + ' (' + (p.nac + a) + ') · ' + eur(pen(p, a)) + ' al año')));
      const life = h('section', { className: 'r4-sec r4-sec--flush r4-jub__sec' },
        h('div', { className: 'r4-jub__lh' }, h('h3', { className: 'r4-jub__h' }, 'Línea de vida'), h('span', { className: 'r2-muted' }, 'Legado medio ', h('strong', null, m1(v.sc.med)), ' ', chip(dLeg, (dLeg > 0 ? '+' : '−') + eur(Math.round(Math.abs(dLeg) / 1000) * 1000)), ' · años con déficit ', h('strong', null, String(v.def)), ' ', chip(-dDef, (dDef > 0 ? '+' : '−') + Math.abs(dDef)))),
        h('div', { className: 'r4-tl' }, lane(ppl[0], ppl[0].age, 0), lane(ppl[1], ppl[1].age, -3),
          h('div', { className: 'r4-tl__axis' }, h('span', { style: { left: '0%' } }, 'Hoy · ' + YEAR0), h('span', { style: { left: pos(65) } }, String(YEAR0 + 65 - AGE0)), h('span', { style: { left: '100%' } }, String(YEAR0 + 100 - AGE0)))));
      /* inputs for one person: age (slider), month, and the two questions that only exist for early retirement */
      const person = (p) => {
        const a = p.age, sal = s['retSalida' + p.sfx] || 'inv', cot = s['retCot' + p.sfx] || 'Sí', mes = s['retMes' + p.sfx] || p.mes;
        const early = a <= 62, dual = a === 61 || a === 62;
        return h('div', { className: 'r4-jub__person' },
          h('div', { className: 'r4-jub__row' },
            h('div', { className: 'r4-jub__age' }, C('Slider', { label: 'Edad de jubilación', min: 57, max: 70, step: 1, value: a, onChange: p.set, format: (x) => x + ' años', minLabel: '57', maxLabel: '70' }),
              h('div', { className: 'r4-jub__type' }, C('Badge', { tone: a < 63 ? 'warning' : a === 65 ? 'neutral' : 'info' }, this.jubType(a)),
                C('Select', { className: 'r4-jub__mes', size: 'sm', 'aria-label': 'Mes de jubilación', value: mes, options: MESES.map((m) => ({ value: m, label: m + ' de ' + (p.nac + a) })), onChange: (x) => this.setState({ ['retMes' + p.sfx]: x }) }))),
            early ? h('div', { className: 'r4-jub__inline' },
              dual ? C('Select', { label: 'Tipo de salida', value: sal, options: [{ value: 'inv', label: 'Jubilación anticipada involuntaria' }, { value: 'ret', label: 'Retiro anticipado' }], onChange: (x) => this.setState({ ['retSalida' + p.sfx]: x }) }) : null,
              h('div', { className: 'r4-jub__q' }, h('span', null, '¿Seguirá cotizando hasta la jubilación?'), C('SegmentedControl', { value: cot, onChange: (x) => this.setState({ ['retCot' + p.sfx]: x }), options: [{ value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }] }))) : null),
          h('dl', { className: 'r4-stats r4-jub__stats r4-jub__stats--3' },
            h('div', { className: 'r4-stat' }, h('dt', null, 'Pensión bruta anual'), h('dd', null, A(pen(p, a)))),
            h('div', { className: 'r4-stat' }, h('dt', null, 'Al mes · 14 pagas'), h('dd', null, A(Math.round(pen(p, a) / 14)))),
            h('div', { className: 'r4-stat' }, h('dt', null, 'Frente a los 65'), h('dd', null, (() => { const d = pen(p, a) - pen(p, 65); return d ? h('span', { className: 'r4-st--' + (d > 0 ? 'success' : 'warning') }, (d > 0 ? '+' : '−') + eur(Math.abs(d))) : '—'; })()))));
      };
      /* G1–G3: the date rides with the age, the slider runs full width, and the other ages sit with the person they belong to */
      const gm = s.jubOpt || 'H', G = /^(G|H)/.test(gm);
      const shortT = (e) => ({ 'Retiro anticipado': 'Retiro antic.', 'Anticipada involuntaria': 'Antic. involunt.', 'Anticipada voluntaria': 'Antic. volunt.', Ordinaria: 'Ordinaria', Demorada: 'Demorada' })[this.jubType(e)];
      const personG = (p) => {
        const a = p.age, sal = s['retSalida' + p.sfx] || 'inv', cot = s['retCot' + p.sfx] || 'Sí', mes = s['retMes' + p.sfx] || p.mes, early = a <= 62, dual = a === 61 || a === 62, ck = 'jubCmp' + p.sfx;
        const ages = Array.from(new Set([61, 63, 65, 67, 70, a])).sort((x, y) => x - y);
        const table = h('table', { className: 'r4-jub__tbl r4-jub__tbl--pick' },
          h('thead', null, h('tr', null, h('th', null, 'Edad'), h('th', { className: 'r4-num' }, 'Pensión anual'), h('th', { className: 'r4-num' }, 'Al mes'), h('th', { className: 'r4-num' }, 'Legado medio'))),
          h('tbody', null, ages.map((e) => { const cur = e === a, m = this.modelFor(p.key === 'par' ? { retAge2: e, sim: false } : { retAge: e, sim: false });
            return h('tr', { key: e, className: cur ? 'is-cur' : '', tabIndex: cur ? -1 : 0, onClick: () => { if (!cur) { p.set(e); if (gm === 'G3') this.setState({ pop: null }); } }, onKeyDown: (ev) => { if (!cur && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); p.set(e); } } },
              h('td', null, h('strong', null, e + ' años · ' + (p.nac + e)), h('span', { className: 'r2-muted r4-jub__tt' }, cur ? 'Seleccionada · ' + this.jubType(e) : this.jubType(e))),
              h('td', { className: 'r4-num' }, eur(pen(p, e))), h('td', { className: 'r4-num' }, eur(Math.round(pen(p, e) / 14))), h('td', { className: 'r4-num' }, m1(m.sc.med))); })));
        const trigger = gm === 'G1' ? C('Button', { variant: 'ghost', size: 'sm', iconEnd: I(s[ck] ? 'chevron-up' : 'chevron-down', 14), 'aria-expanded': !!s[ck], onClick: () => this.setState({ [ck]: !s[ck] }) }, 'Comparar edades')
          : gm === 'G3' ? C('Popover', { align: 'end', width: '520px', title: 'Otras edades · ' + p.name, open: s.pop === ck, onOpenChange: (o) => this.setState({ pop: o ? ck : null }), trigger: C('Button', { variant: 'ghost', size: 'sm', iconEnd: I('chevron-down', 14) }, 'Otras edades') },
              h('div', { className: 'r4-jub__popin' }, table, h('p', { className: 'r2-hint' }, 'Pulse una fila para usar esa edad.'))) : null;
        return h('div', { className: 'r4-jub__person r4-jub__person--g' },
          C('Slider', { label: 'Edad de jubilación', min: 57, max: 70, step: 1, value: a, onChange: p.set, format: (x) => x + ' años · ' + (p.nac + x), minLabel: '57', maxLabel: '70' }),
          h('div', { className: 'r4-jub__meta' }, C('Badge', { tone: a < 63 ? 'warning' : a === 65 ? 'neutral' : 'info' }, this.jubType(a)),
            C('Select', { className: 'r4-jub__mes', size: 'sm', 'aria-label': 'Mes de jubilación', value: mes, options: MESES.map((m) => ({ value: m, label: 'Mes: ' + m })), onChange: (x) => this.setState({ ['retMes' + p.sfx]: x }) }),
            h('span', { className: 'r2-spacer' }), trigger),
          gm === 'G2' ? h('div', { className: 'r4-jub__stops', role: 'group', 'aria-label': 'Edades clave' }, [61, 63, 65, 67, 70].map((e) => h('button', { key: e, type: 'button', className: 'r4-jub__stop' + (e === a ? ' is-on' : ''), 'aria-pressed': e === a, onClick: () => p.set(e) },
              h('strong', null, e + ' años'), h('span', null, shortT(e)), h('span', { className: 'r4-jub__stopv' }, eur(pen(p, e)))))) : null,
          gm === 'G1' ? C('Reveal', { open: !!s[ck] }, h('div', { className: 'r4-jub__cmp' }, table, h('p', { className: 'r2-hint' }, 'Pulse una fila para usar esa edad.'))) : null,
          early ? h('div', { className: 'r4-jub__inline r4-jub__inline--row' },
            dual ? C('Select', { label: 'Tipo de salida', value: sal, options: [{ value: 'inv', label: 'Jubilación anticipada involuntaria' }, { value: 'ret', label: 'Retiro anticipado' }], onChange: (x) => this.setState({ ['retSalida' + p.sfx]: x }) }) : null,
            h('div', { className: 'r4-jub__q r4-jub__q--stack' }, h('span', null, '¿Seguirá cotizando hasta la jubilación?'), C('SegmentedControl', { value: cot, onChange: (x) => this.setState({ ['retCot' + p.sfx]: x }), options: [{ value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }] }))) : null,
          h('dl', { className: 'r4-stats r4-jub__stats r4-jub__stats--3' },
            h('div', { className: 'r4-stat' }, h('dt', null, 'Pensión bruta anual'), h('dd', null, A(pen(p, a)))),
            h('div', { className: 'r4-stat' }, h('dt', null, 'Al mes · 14 pagas'), h('dd', null, A(Math.round(pen(p, a) / 14)))),
            h('div', { className: 'r4-stat' }, h('dt', null, 'Frente a los 65'), h('dd', null, (() => { const d = pen(p, a) - pen(p, 65); return d ? h('span', { className: 'r4-st--' + (d > 0 ? 'success' : 'warning') }, (d > 0 ? '+' : '−') + eur(Math.abs(d))) : '—'; })()))));
      };
      /* H: G2's key ages + G3's full list in a popover (top right). The date (month and year) and the type sit with the age. */
      const H = gm === 'H';
      const hTable = (p) => { const a = p.age; return h('table', { className: 'r4-jub__tbl r4-jub__tbl--pick' },
        h('thead', null, h('tr', null, h('th', null, 'Edad'), h('th', { className: 'r4-num' }, 'Pensión anual'), h('th', { className: 'r4-num' }, 'Al mes'), h('th', { className: 'r4-num' }, 'Legado medio'))),
        h('tbody', null, Array.from({ length: 70 - (YEAR0 - p.nac) }, (_, i) => YEAR0 - p.nac + 1 + i).map((e) => { const cur = e === a, m = this.modelFor(p.key === 'par' ? { retAge2: e, sim: false } : { retAge: e, sim: false });
          return h('tr', { key: e, className: cur ? 'is-cur' : '', tabIndex: cur ? -1 : 0, onClick: () => { if (!cur) { p.set(e); this.setState({ pop: null }); } }, onKeyDown: (ev) => { if (!cur && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); p.set(e); this.setState({ pop: null }); } } },
            h('td', null, h('strong', null, e + ' años · ' + (p.nac + e)), h('span', { className: 'r2-muted r4-jub__tt' }, cur ? 'Seleccionada · ' + this.jubType(e) : this.jubType(e))),
            h('td', { className: 'r4-num' }, eur(pen(p, e))), h('td', { className: 'r4-num' }, eur(Math.round(pen(p, e) / 14))), h('td', { className: 'r4-num' }, m1(m.sc.med))); }))); };
      const hTrig = (p) => { const ck = 'jubAll' + p.sfx; return C('Popover', { align: 'end', width: '540px', title: 'Otras edades · ' + p.name, description: 'De ' + (YEAR0 - p.nac + 1) + ' a 70 años. Pulse una fila para usar esa edad.', open: s.pop === ck, onOpenChange: (o) => this.setState({ pop: o ? ck : null }),
        trigger: C('Button', { variant: 'ghost', size: 'sm', iconEnd: I('chevron-down', 14) }, 'Otras edades') }, s.pop === ck ? h('div', { className: 'r4-jub__popin r4-jub__popin--scroll' }, hTable(p)) : null); };
      const personH = (p, inAcc) => {
        const a = p.age, sal = s['retSalida' + p.sfx] || 'inv', cot = s['retCot' + p.sfx] || 'Sí', mes = s['retMes' + p.sfx] || p.mes, early = a <= 62, dual = a === 61 || a === 62, yr = p.nac + a;
        return h('div', { className: 'r4-jub__person r4-jub__person--g r4-jub__person--h' },
          inAcc ? h('div', { className: 'r4-jub__lh' }, h('span'), hTrig(p)) : null,
          h('div', { className: 'r4-jub__agehead' },
            h('span', { className: 'r4-jub__agelab', 'aria-hidden': true }, 'Edad de jubilación'),
            h('span', { className: 'r2-spacer' }),
            h('strong', { className: 'r4-jub__agev' }, A(a, (x) => Math.round(x) + ' años')),
            C('Select', { className: 'r4-jub__when', size: 'sm', 'aria-label': 'Fecha de jubilación', value: mes, options: MESES.map((m) => ({ value: m, label: m + ' de ' + yr })), onChange: (x) => this.setState({ ['retMes' + p.sfx]: x }) }),
            C('Badge', { tone: a < 63 ? 'warning' : a === 65 ? 'neutral' : 'info' }, this.jubType(a))),
          h('div', { className: 'r4-jub__slider' }, C('Slider', { label: 'Edad de jubilación · ' + p.name, min: YEAR0 - p.nac + 1, max: 70, step: 1, value: a, onChange: p.set, format: (x) => x + ' años', minLabel: String(YEAR0 - p.nac + 1), maxLabel: '70' })),
          h('div', { className: 'r4-jub__stops', role: 'group', 'aria-label': 'Edades habituales' }, [61, 63, 65, 67, 70].map((e) => h('button', { key: e, type: 'button', className: 'r4-jub__stop' + (e === a ? ' is-on' : ''), 'aria-pressed': e === a, onClick: () => p.set(e) },
            h('strong', null, e + ' años'), h('span', null, shortT(e)), h('span', { className: 'r4-jub__stopv' }, eur(pen(p, e)))))),
          early ? h('div', { className: 'r4-jub__inline r4-jub__inline--row' },
            dual ? C('Select', { label: 'Tipo de salida', value: sal, options: [{ value: 'inv', label: 'Jubilación anticipada involuntaria' }, { value: 'ret', label: 'Retiro anticipado' }], onChange: (x) => this.setState({ ['retSalida' + p.sfx]: x }) }) : null,
            h('div', { className: 'r4-jub__q r4-jub__q--stack' }, h('span', null, '¿Seguirá cotizando hasta la jubilación?'), C('SegmentedControl', { value: cot, onChange: (x) => this.setState({ ['retCot' + p.sfx]: x }), options: [{ value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }] }))) : null,
          h('dl', { className: 'r4-stats r4-jub__stats r4-jub__stats--3' },
            h('div', { className: 'r4-stat' }, h('dt', null, 'Pensión bruta anual'), h('dd', null, A(pen(p, a)))),
            h('div', { className: 'r4-stat' }, h('dt', null, 'Al mes · 14 pagas'), h('dd', null, A(Math.round(pen(p, a) / 14)))),
            h('div', { className: 'r4-stat' }, h('dt', null, 'Frente a los 65'), h('dd', null, (() => { const d = pen(p, a) - pen(p, 65); return d ? h('span', { className: 'r4-st--' + (d > 0 ? 'success' : 'warning') }, (d > 0 ? '+' : '−') + eur(Math.abs(d))) : '—'; })()))));
      };
      const titular = H ? h('section', { className: 'r4-sec r4-sec--flush r4-jub__sec' }, h('div', { className: 'r4-jub__lh' }, h('h3', { className: 'r4-jub__h' }, 'Titular'), hTrig(ppl[0])), personH(ppl[0]))
        : h('section', { className: 'r4-sec r4-sec--flush r4-jub__sec' }, h('h3', { className: 'r4-jub__h' }, 'Titular'), (G ? personG : person)(ppl[0]));
      const pareja = C('Accordion', { className: 'r4-fold r4-jub__fold', open: !!s.jubPar, onToggle: (o) => this.setState({ jubPar: o }),
        summary: h('span', { className: 'r4-fold__sum r4-jub__parsum' }, h('strong', null, 'Pareja'), h('span', { className: 'r2-muted' }, ppl[1].age + ' años'), C('Badge', { tone: ppl[1].age < 63 ? 'warning' : ppl[1].age === 65 ? 'neutral' : 'info' }, this.jubType(ppl[1].age)), h('span', { className: 'r2-muted' }, eur(pen(ppl[1], ppl[1].age)) + ' al año')) },
        H ? personH(ppl[1], true) : (G ? personG : person)(ppl[1]));
      /* other ages: the WP «Ver otras opciones» table, one person at a time; a row sets the age */
      const who = s.jubWho || 'tit', wp = ppl[who === 'par' ? 1 : 0];
      const ages = Array.from(new Set([61, 63, 65, 67, 70, wp.age])).sort((x, y) => x - y);
      const other = h('section', { className: 'r4-sec r4-jub__sec' },
        h('div', { className: 'r4-jub__lh' }, h('h3', { className: 'r4-jub__h' }, 'Otras edades'), C('SegmentedControl', { value: who, onChange: (x) => this.setState({ jubWho: x }), options: [{ value: 'tit', label: 'Titular' }, { value: 'par', label: 'Pareja' }] })),
        h('table', { className: 'r4-jub__tbl r4-jub__tbl--pick' },
          h('thead', null, h('tr', null, h('th', null, 'Edad'), h('th', null, 'Fecha'), h('th', { className: 'r4-num' }, 'Pensión anual'), h('th', { className: 'r4-num' }, 'Al mes'), h('th', { className: 'r4-num' }, 'Legado medio'))),
          h('tbody', null, ages.map((a) => { const cur = a === wp.age, m = this.modelFor(who === 'par' ? { retAge2: a, sim: false } : { retAge: a, sim: false });
            return h('tr', { key: a, className: cur ? 'is-cur' : '', tabIndex: cur ? -1 : 0, onClick: () => cur ? null : wp.set(a), onKeyDown: (e) => { if (!cur && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); wp.set(a); } } },
              h('td', null, h('strong', null, a + ' años'), h('span', { className: 'r2-muted r4-jub__tt' }, cur ? 'Seleccionada · ' + this.jubType(a) : this.jubType(a))), h('td', null, wp.mes + ' de ' + (wp.nac + a)),
              h('td', { className: 'r4-num' }, eur(pen(wp, a))), h('td', { className: 'r4-num' }, eur(Math.round(pen(wp, a) / 14))), h('td', { className: 'r4-num' }, m1(m.sc.med))); }))),
        h('p', { className: 'r2-hint' }, 'Pulse una fila para usar esa edad. Para probarla sin cambiar el plan, pregunte abajo: «¿Y si se jubila a los 63?».'));
      const an = pen(ppl[0], ppl[0].age), an2 = pen(ppl[1], ppl[1].age);
      const uses = [['Pensión Titular', 'Ingresos · desde los ' + ppl[0].age, eur(Math.round(an / 14)) + ' al mes, 14 pagas', 'Calculada aquí'], ['Pensión Pareja', 'Ingresos · desde los ' + ppl[1].age, eur(Math.round(an2 / 14)) + ' al mes, 14 pagas', 'Calculada aquí'],
        ['Nómina Titular', 'Ingresos · hasta los ' + ppl[0].age, '2.600 € al mes', 'Termina aquí'], ['Nómina Pareja', 'Ingresos · hasta los ' + ppl[1].age, '1.600 € al mes', 'Termina aquí'], ['Gráficos del plan', 'Marca «Jubilación · ' + ppl[0].age + '»', 'Legado y liquidez', 'Sigue la edad']];
      const usesSec = h('section', { className: 'r4-sec r4-jub__sec' }, h('h3', { className: 'r4-jub__h' }, 'Dónde se usa'),
        h('ul', { className: 'r4-jub__uses' }, uses.map((u) => h('li', { key: u[0] }, h('span', { className: 'r4-jub__un' }, h('strong', null, u[0]), h('span', { className: 'r2-muted' }, u[1])), h('span', { className: 'r4-jub__uv' }, u[2]), C('Tag', null, u[3])))));
      /* «Cálculo y origen de los datos»: where the figures come from, then what in the plan depends on these ages */
      const srcs = [
        ['Base reguladora', 'Titular ' + eur(ppl[0].base) + ' · Pareja ' + eur(ppl[1].base), 'Familia › Actividad y cotizaciones'],
        ['Edad y fecha de jubilación', 'Titular ' + ppl[0].age + ' años · Pareja ' + ppl[1].age + ' años', 'Esta página'],
        ['Coeficiente por edad', 'Reduce la pensión antes de los 65 y la aumenta después', 'Normativa de la Seguridad Social'],
        ['Valor de los importes', 'Euros de hoy, sin inflación', 'Supuestos de la planificación']];
      const row = (u, last) => h('li', { key: u[0] }, h('span', { className: 'r4-jub__un' }, h('strong', null, u[0]), h('span', { className: 'r2-muted' }, u[1])), h('span', { className: 'r4-jub__uv' }, u[2]), last ? C('Tag', null, last) : null);
      const dataSec = C('Accordion', { className: 'r4-fold r4-jub__fold', open: !!s.jubUses, onToggle: (o) => this.setState({ jubUses: o }), summary: h('span', { className: 'r4-fold__sum r4-jub__parsum' }, h('strong', null, 'Cálculo y origen de los datos'), h('span', { className: 'r2-muted' }, 'De dónde salen las pensiones y qué depende de estas edades')) },
        h('div', { className: 'r4-jub__data' },
          h('h4', { className: 'r4-jub__dh' }, 'Origen de los datos'),
          h('ul', { className: 'r4-jub__uses r4-jub__uses--src' }, srcs.map((u) => h('li', { key: u[0] }, h('span', { className: 'r4-jub__un' }, h('strong', null, u[0]), h('span', { className: 'r2-muted' }, u[1])), h('span', { className: 'r4-jub__uv r2-muted' }, u[2])))),
          h('h4', { className: 'r4-jub__dh' }, 'Dónde se usan'),
          h('ul', { className: 'r4-jub__uses' }, uses.map((u) => row(u.slice(0, 3), u[3])))));
      if (G) return h('div', { className: 'r2-main ap-in r4-jubf', key: 'jub-' + gm },
        this.head('Jubilación', 'Cuándo se jubila cada uno y qué pensión cobra. El plan, a la derecha, usa estas edades en todos los escenarios.'),
        ...(H ? [verdict, titular, h('section', { className: 'r4-sec r4-jub__sec' }, h('div', { className: 'r4-jub__lh' }, h('h3', { className: 'r4-jub__h' }, 'Pareja'), hTrig(ppl[1])), personH(ppl[1])), life] : [verdict, life, titular, pareja, dataSec]));
      return h('div', { className: 'r2-main ap-in r4-jubf', key: 'jub-F' },
        this.head('Jubilación', 'Cuándo se jubila cada uno y qué pensión cobra. El plan, a la derecha, usa estas edades en todos los escenarios.'),
        verdict, life, titular, pareja, other, usesSec, h('p', { className: 'r2-hint r4-jub__foot' }, 'Todos los importes se muestran en valor presente.'));
    }
    /* ---------- 3.14 demo boards: a control panel that plays one use case step by step ---------- */
    /* «Aplicar»: the simulation becomes the plan — a short celebration (fast beam lap, two rings outside the frame, icons pop) */
    /* 3.14 · deleting from an edit page asks first, in place — the same pattern as the planning list */
    actionsDel(id, label, right) {
      const s = this.state;
      if (s.v312 && s.delConf === id) return h('div', { className: 'r2-actions r4-delconfirm', role: 'alert' },
        h('span', { className: 'r4-delconfirm__t' }, I('trash-2', 16), h('strong', null, '¿Eliminar «' + label + '»?'), h('span', { className: 'r2-muted' }, ' Se quita del plan y el plan se recalcula.')),
        h('span', { className: 'r4-delconfirm__btns' },
          C('Button', { variant: 'ghost', size: 'sm', autoFocus: true, onClick: () => this.setState({ delConf: null }) }, 'Cancelar'),
          C('Button', { variant: 'secondary', size: 'sm', className: 'r4-danger-soft', iconStart: I('trash-2', 14), onClick: () => { this.setState({ delConf: null }); this.remove(id); } }, 'Sí, eliminar')));
      return this.actions(C('Button', { variant: 'ghost', size: 'sm', className: s.v312 ? 'r4-danger' : undefined, iconStart: I('trash-2'), onClick: () => (s.v312 ? this.setState({ delConf: id }) : this.remove(id)) }, 'Eliminar'), right);
    }
    applySim() {
      /* the figures are already the simulated ones, so no recalculation diff fires: record what the simulation changed against the real plan */
      if (this.state.sim && (this.state.simChanges || []).length) {
        const v = this.modelFor({}), o = this.modelFor({ sim: false }), d = [], secs = [];
        const dl = Math.round((v.sc.med - o.sc.med) / 1000) * 1000;
        if (Math.abs(dl) >= 1000) { d.push('Legado ' + (dl > 0 ? '+' : '−') + fmt(Math.abs(dl)) + ' €'); secs.push('leg'); }
        if (v.def !== o.def) { d.push(v.def ? 'Déficit en ' + v.def + (v.def === 1 ? ' año' : ' años') : 'Liquidez sin déficit'); secs.push('liq'); }
        if (v.ren != null && o.ren != null && Math.abs(v.ren - o.ren) > 0.04) { d.push('Rentabilidad esperada ' + pc1(v.ren)); secs.push('opt'); }
        if (d.length) this._diff = { items: d, secs, at: Date.now(), old: o, cause: 'Con la simulación aplicada' };
      }
      this.setState((st) => ({ applied: Array.from(new Set((st.applied || []).concat(st.simChanges || []))), sim: false, simChanges: [], justApplied: true }));
      if (this.state.aiHue === 'hint') { clearTimeout(this._pillT); this.setState({ applyPill: Date.now() }); this._pillT = setTimeout(() => this.setState({ applyPill: null }), 3700); } else this.toast('Cambios aplicados al plan.');
      clearTimeout(this._applT); this._applT = setTimeout(() => this.setState({ justApplied: false }), 3400);
    }
    demoCases() {
      return {
        ask: { title: 'Preguntar a la IA · plan abierto', steps: ['Se envía la pregunta: «¿Y si vendo la casa de Sotogrande en 2030?»', 'Nivel 2 · la IA piensa: «Pensando…» en la barra y el marco da vueltas', 'Nivel 1 · llega la simulación y el plan recalcula en silencio: las cifras se atenúan y cuentan', 'Nivel 3 · el arco se asienta en el marco y en cada sección que cambia; los iconos se tiñen y la segunda línea muestra el cambio', 'Simulación · todo queda quieto hasta «Aplicar al plan» o «Descartar»'], at: [0, 600, 3000, 4300, 7000] },
        askClosed: { title: 'Preguntar a la IA · plan plegado', steps: ['Se envía la pregunta con el plan plegado', 'Nivel 2 · la IA piensa: el borde del carril da vueltas', 'Nivel 1 · llega la simulación y el plan recalcula en silencio', 'Nivel 3 · el borde del carril se asienta y los iconos que cambian se tiñen', 'Simulación · el carril guarda la marca hasta «Aplicar al plan» o «Descartar»'], at: [0, 600, 3000, 4300, 7000] },
        edit: { title: 'Editar una cifra', steps: ['Se cambia una cifra: el colchón pasa de 30.000 € a 60.000 €', 'Nivel 1 · el plan recalcula en silencio: las cifras se atenúan, sin haz ni anillos', 'Las cifras cuentan hasta su nuevo valor', '«Ver los cambios» queda en la cabecera del plan'], at: [0, 400, 1700, 3000] },
        apply: { title: 'Aplicar una simulación', steps: ['Punto de partida: una simulación con la venta de la casa', 'Se pulsa «Aplicar al plan»', 'Nivel 4 · un anillo de luz recorre el plan de abajo arriba', 'Dos anillos salen del marco y los iconos se llenan uno tras otro', 'Listo · «Cambios aplicados al plan.» y «Ver los cambios» en la cabecera'], at: [0, 900, 2200, 2900, 4300] },
        answer: { title: 'La IA responde', steps: ['Se envía la pregunta: «¿Por qué hay déficit en 2032?»', 'Nivel 2 · la IA piensa: la chispa se mueve junto a «Pensando…»', 'La respuesta crece en la barra: primero su espacio, luego el texto'], at: [0, 600, 3000] },
        simOn: { title: 'Entrar en simulación', steps: ['Punto de partida: el plan real', 'Se activa «Simulación» en la barra de preguntar', 'Nivel 3 · el degradado recorre el marco una vez y se asienta en él', 'El plan queda en simulación: lo que pregunte o cambie no toca el plan real'], at: [0, 600, 900, 4200] },
        discard: { title: 'Descartar una simulación', steps: ['Punto de partida: una simulación con la venta de la casa', 'Se pulsa «Descartar»', 'Nivel 1 · el plan vuelve a sus cifras reales en silencio', 'Listo · arcos e iconos vuelven al reposo y aparece «Simulación descartada.»'], at: [0, 900, 1000, 2200] }
      };
    }
    demoReset() {
      const c = this.state.demoCase, sim = c === 'apply' || c === 'discard';
      (this._demoT || []).forEach(clearTimeout); this._demoT = []; clearTimeout(this._think);
      this.setState({ demoStep: -1, thinking: null, agentLog: sim ? ['sell'] : [], sim, simChanges: sim ? ['sell'] : [], thought: sim ? { sell: 2 } : {}, applied: [], colchon: 30000, dockOpen: true, toast: null });
    }
    demoPlay() {
      const c = this.state.demoCase, D = this.demoCases()[c]; if (!D) return;
      this.demoReset();
      const T = (fn, ms) => { this._demoT = (this._demoT || []).concat(setTimeout(fn, ms)); };
      D.at.forEach((ms, i) => T(() => this.setState({ demoStep: i }), ms + 50));
      if (c === 'ask' || c === 'askClosed') T(() => this.runAgent('sell'), 600);
      if (c === 'edit') T(() => this.setState({ colchon: 60000, lastCause: 'Con el colchón cambiado' }), 400);
      if (c === 'apply') { T(() => this.setState({ demoPress: 'apply' }), 450); T(() => { this.setState({ demoPress: null }); this.applySim(); }, 900); }
      if (c === 'simOn') T(() => this.setState({ sim: true }), 600);
      if (c === 'answer') { this.setState({ sim: true }); T(() => this.runAgent('why'), 600); }
      if (c === 'discard') { T(() => this.setState({ demoPress: 'discard' }), 450); T(() => { this.setState({ demoPress: null, sim: false, simChanges: [] }); this.toast('Simulación descartada.'); }, 900); }
    }
    demoPanel() {
      const s = this.state, D = this.demoCases()[s.demoCase]; if (!D) return null;
      const LOOK = { arc: 'A · Arco', canvas: 'B · Lienzo', edge: 'C · Borde', mix: 'D · Arco + cuadrícula' }[s.aiLook || 'mix'], st = s.demoStep == null ? -1 : s.demoStep;
      return h('aside', { className: 'r4-demo', 'aria-label': 'Panel de la demostración' },
        h('div', { className: 'r4-demo__txt' }, h('span', { className: 'r4-demo__eyebrow', title: LOOK }, D.title),
          h('span', { className: 'r4-demo__now', 'aria-live': 'polite' }, st < 0 ? 'Pulse ▶ para reproducir el caso.' : (st + 1) + '. ' + D.steps[st])),
        h('ol', { className: 'r4-demo__dots', 'aria-label': 'Pasos' }, D.steps.map((x, i) => h('li', { key: i, title: (i + 1) + '. ' + x, className: i === st ? 'is-now' : i < st ? 'is-done' : '' }, String(i + 1)))),
        C('Tooltip', { content: 'Reproducir', placement: 'bottom' }, C('IconButton', { variant: 'primary', size: 'sm', label: 'Reproducir', className: 'r4-demo__play', onClick: () => this.demoPlay() }, I('play'))),
        C('Tooltip', { content: 'Reiniciar', placement: 'bottom' }, C('IconButton', { variant: 'ghost', size: 'sm', label: 'Reiniciar', onClick: () => this.demoReset() }, I('rotate-ccw'))));
    }
    /* 3.13 standard: in the dock simulation the frame and the changed sections carry the beam (option C); boards can still pick 'beam' or 'hl' */
    simLook() { const s = this.state; return s.simLook || (s.v312 && s.agentUI === 'dock' ? 'both' : null); }
    /* 3.13: the «El plan» row stays put and only what is below it scrolls, so the scrollbar starts under the header */
    planScroll(node) {
      const s = this.state;
      if (!s.v312 || (s.look || '').indexOf('frame') < 0) return node;
      const flat = (n) => n == null || n === false ? [] : Array.isArray(n) ? n.flatMap(flat) : (n.type === React.Fragment ? flat(n.props.children) : [n]);
      const kids = flat(node);
      const i = kids.findIndex((k) => k && k.props && k.props.className === 'r3-plan__head');
      if (i < 0) return node;
      return [h(React.Fragment, { key: 'pre' }, kids.slice(0, i + 1)), h('div', { className: 'r3-plan__scroll', key: 'scroll' }, kids.slice(i + 1))];
    }
    plan() {
      const s = this.state, mode = this.mode(), { v, busy } = this.live();
      /* after a recalculation lands, remember what changed (legado, coverage, liquidity) for the header moment */
      const key = JSON.stringify([v.sc && v.sc.med, v.def, v.goal, v.cover, v.ren]);
      if (!busy && key !== this._shownKey) {
        if (this._shownV && !s.noDiff) {
          const o = this._shownV, d = [], secs = [];
          const dl = Math.round((v.sc.med - o.sc.med) / 1000) * 1000;
          if (Math.abs(dl) >= 1000) { d.push('Legado ' + (dl > 0 ? '+' : '−') + fmt(Math.abs(dl)) + ' €'); secs.push('leg'); }
          const nc = ['opt', 'med', 'pes'].filter((k) => v.cover[k]).length, oc = ['opt', 'med', 'pes'].filter((k) => o.cover[k]).length;
          if (nc !== oc) { d.push(nc + ' de 3 escenarios cubren'); if (secs.indexOf('leg') < 0) secs.push('leg'); }
          if (v.def !== o.def) { d.push(v.def ? 'Déficit en ' + v.def + (v.def === 1 ? ' año' : ' años') : 'Liquidez sin déficit'); secs.push('liq'); }
          if (v.ren != null && o.ren != null && Math.abs(v.ren - o.ren) > 0.04) { d.push('Rentabilidad esperada ' + pc1(v.ren)); secs.push('opt'); }
          this._diff = d.length ? { items: d, secs, at: Date.now(), old: o, cause: s.lastCause } : null;
        }
        this._shownV = v; this._shownKey = key;
      }
      let diff = s.recalc || (s.diffClosed ? null : this._diff);
      if (diff && !diff.old && diff.oldFrom) diff = Object.assign({}, diff, { old: this.modelFor(diff.oldFrom) });
      const chg = s.v312 && diff && diff.old ? this.chgLines(diff, v) : null;
      const changed = (k) => !!(diff && (diff.secs || []).indexOf(k) >= 0);
      const tip = (label, el) => C('Tooltip', { content: label, placement: 'bottom' }, el);
      const fol = s.follow !== false;
      /* the AI moment: a gradient button with the DS orb (AI sparkles), a border beam while it is new */
      const clearDiff = () => { this._diff = null; this.setState({ recalc: null, diffClosed: true, pop: null }, () => this.setState({ diffClosed: false })); };
      const SECN = { leg: s.v32 ? 'Evolución del patrimonio y legado' : 'Legado y patrimonio', liq: 'Liquidez', opt: 'Optimizaciones' };
      const ai = busy
        ? h('span', { className: 'r4-ai is-busy', role: 'status' }, C('OrbButton', { size: 'sm', disabled: true, icon: I('sparkles', 14), motion: 'spin' }, 'Recalculando…'))
        : diff && s.v312 && !s.sim ? h('button', { type: 'button', className: 'r4-chglink', onClick: () => this.setState({ chgOpen: true, pop: null }) }, I('sparkles', 12), 'Ver los cambios')
        : diff && !s.v312 ? h('span', { className: 'r4-ai is-new' }, C('Popover', { align: 'end', width: '340px', title: 'Plan recalculado', description: 'Esto es lo que ha cambiado con sus últimos datos.', open: s.pop === 'ai', onOpenChange: (o) => this.setState({ pop: o ? 'ai' : null }),
            trigger: C('OrbButton', { size: 'sm', icon: I('sparkles', 14), motion: 'spin', 'aria-label': 'Plan recalculado: ' + diff.items.join(', ') }, 'Plan recalculado'),
            footer: chg ? h('div', { className: 'r2-actions' }, C('Button', { variant: 'ghost', size: 'sm', onClick: clearDiff }, 'Entendido'), h('span', { className: 'r2-spacer' }), C('Button', { variant: 'primary', size: 'sm', iconEnd: I('arrow-right', 14), onClick: () => this.setState({ pop: null, chgOpen: true }) }, 'Ver los cambios')) : h('div', { className: 'r2-actions' }, h('span', { className: 'r2-spacer' }), C('Button', { variant: 'primary', size: 'sm', onClick: clearDiff }, 'Entendido')) },
            chg ? h('ul', { className: 'r4-chg r4-chg--ba' }, chg.map((c) => h('li', { key: c.k }, I('sparkles', 14), h('span', { className: 'r4-chg__b' }, h('span', { className: 'r4-chg__t' }, c.t), h('span', { className: 'r4-chg__v' }, h('span', { className: 'r4-was' }, c.from), I('arrow-right', 12), h('strong', null, c.to)), c.d ? h('span', { className: 'r4-chg__d r4-st--' + (c.good ? 'success' : 'warning') }, c.d) : null)))) :
            h('ul', { className: 'r4-chg' }, diff.items.map((t, i) => h('li', { key: i }, I('sparkles', 14), h('span', null, t)))),
            chg ? null : h('div', { className: 'r4-chg__go' }, (diff.secs || []).map((k0) => { const k = s.ia && k0 === 'opt' ? 'ren' : k0; return C('Button', { key: k, variant: 'secondary', size: 'sm', onClick: () => { if (s.ia) { this.setState({ pop: null, iaTab: k, seen: Array.from(new Set((s.seen || []).concat(k))) }); return; } this.setState({ pop: null, secs: Array.from(new Set((s.secs || []).concat(k))) }); this.reveal('sec-' + k); } }, 'Ver ' + (s.ia ? ({ leg: 'Legado', liq: 'Liquidez', ren: 'Rentabilidad', pat: 'Patrimonio' }[k] || k) : (SECN[k] || k))); })))) : null;
      const tools = h('span', { className: 'r3-tools' },
        ai,
        s.flow ? tip(fol ? 'Seguir la página: activado' : 'Seguir la página: desactivado', h('button', { type: 'button', className: 'r4-follow' + (fol ? ' is-on' : ''), 'aria-pressed': fol, 'aria-label': 'Seguir la página', onClick: () => this.setState({ follow: !fol }) }, I('locate-fixed', 16), fol ? 'Sigue la página' : 'Fijo')) : null,
        s.v312 ? this.sizer() : null,
        s.v312 ? null : tip('Reducir el plan', C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Reducir el plan', onClick: () => this.step(-1) }, I('chevrons-right'))),
        !s.v312 && s.size !== 'large' ? tip('Ampliar el plan', C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Ampliar el plan', onClick: () => this.step(1) }, I('chevrons-left'))) : null,
        s.v312 ? null : tip('Cerrar el plan', C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Cerrar el plan', onClick: () => this.setSize('closed') }, I('panel-right-close'))));
      const nCover = ['opt', 'med', 'pes'].filter((k) => v.cover[k]).length;
      const leg = !v.goal ? { tone: 'neutral', text: 'Sin objetivo', short: 'Sin objetivo', title: 'Falta el legado objetivo', body: 'Defina el legado objetivo en «Legado y colchón de liquidez» para comprobar si el plan lo cubre.' }
        : nCover === 3 ? { tone: 'success', text: 'Cubre el objetivo', short: 'Cubre', title: 'El legado se cubre en todos los escenarios', body: 'El patrimonio previsto supera el objetivo en los escenarios optimista, medio y pesimista.' }
        : nCover === 2 ? { tone: 'warning', text: 'En riesgo en pesimista', short: 'En riesgo', title: 'Legado en riesgo en el escenario pesimista', body: 'Se alcanza el objetivo en los escenarios optimista y medio, pero no en el pesimista.' }
        : nCover === 1 ? { tone: 'warning', text: 'En riesgo en pesimista y medio', short: 'En riesgo', title: 'Legado en riesgo en los escenarios pesimista y medio', body: 'Solo el escenario optimista llega al objetivo a los ' + v.edad + ' años.' }
        : { tone: 'critical', text: 'No cubre el objetivo', short: 'No cubre', title: 'El legado no se cubre en ningún escenario', body: 'Ningún escenario llega al objetivo a los ' + v.edad + ' años.' };
      const liq = v.def ? { tone: 'warning', text: 'Déficit en ' + v.worstYear, title: 'Déficit de liquidez en el escenario medio', body: 'Durante ' + v.def + ' años los ingresos y el ahorro no cubren los gastos. El peor año es ' + v.worstYear + ', con ' + eur(v.worst) + '.', act: ['Ver cómo cubrirlo', () => { this.setState((st) => ({ subs: Array.from(new Set((st.subs || []).concat('gl'))), secs: Array.from(new Set((st.secs || ['liq']).concat('opt'))) })); this.reveal('gl'); }] }
        : { tone: 'success', text: 'Suficiente', title: 'Liquidez suficiente', body: s.v312 && this.glActive() ? 'Con el plan de desinversión, la venta de activos cubre los años en que faltaba liquidez.' : 'Los ingresos y el ahorro acumulado cubren los gastos previstos en todos los años, sin vender activos.' };
      if (mode === 'closed') {
        /* every section stays in sight: icon, short figure, status colour; a click reopens the plan at that section */
        const simK = (() => { if (!(s.v312 && s.sim && (s.simChanges || []).length)) return []; const old = this.modelFor({ sim: false }), o = [];
          if (Math.abs(v.sc.med - old.sc.med) > 1000) o.push('leg'); if (v.def !== old.def || Math.abs(v.worst - old.worst) > 1) o.push('liq'); if (Math.abs(v.ren - old.ren) > 0.04) o.push('opt'); return o; })();
        const reopen = (k) => () => { this.setState((st) => ({ size: st.v312 ? 'wide' : 'narrow', iaTab: st.v312 ? (k === 'opt' ? 'ren' : k) : st.iaTab, drag: null, secs: Array.from(new Set((st.secs || (CTX[st.screen] || CTX.ingresos)[0]).concat(k))) }));
          this.reveal('sec-' + k); };
        const item = (k, icon, label, value, tone) => C('Tooltip', { key: k, content: label, placement: 'left' },
          h('button', { type: 'button', className: 'r4-strip__item' + (tone ? ' r4-st--' + tone : '') + (busy && (k === 'leg' || k === 'liq') ? ' is-busy' : ''), 'aria-label': label + ': ' + (typeof value === 'string' ? value : ''), onClick: reopen(k) },
            s.v312 ? h('span', { className: 'r4-strip__ic r4-ttab__ic r4-ttab__ic--lg' + (changed(k) ? ' is-ai' : '') + (busy ? ' is-busy' : '') + (simK.indexOf(k) >= 0 ? ' is-simt' : '') }, I(icon, 18)) : h('span', { className: 'r4-strip__ic' }, I(icon, 18), tone && tone !== 'neutral' ? h('i', { className: 'r4-strip__dot' }) : null),
            s.v312 ? h('strong', { className: 'r4-strip__v' }, tone && tone !== 'neutral' ? h('span', { className: 'r4-strip__st r4-st--' + tone }, I(tone === 'success' ? 'circle-check' : tone === 'critical' ? 'circle-x' : 'triangle-alert', 12)) : null, value) : h('strong', null, value)));
        return h('div', { className: 'r3-strip r4-strip' },
          C('IconButton', { variant: 'ghost', size: 'sm', label: 'Abrir el plan', onClick: () => this.setSize(this.state.v312 ? 'wide' : 'narrow') }, I('panel-right-open')),
          s.v32 ? null : item('cfg', SEC_IC.cfg, 'Configuración', 'Medio', null),
          item('leg', SEC_IC.leg, (s.v32 ? 'Evolución del patrimonio y legado · ' : 'Legado y patrimonio · ') + leg.text, A(v.sc.med, (x) => (x / 1e6).toFixed(1).replace('.', ',') + ' M', 1), leg.tone),
          item('liq', SEC_IC.liq, 'Liquidez · ' + liq.text, v.def ? v.def + ' años' : 'OK', liq.tone),
          s.v312 ? (() => { const gp = Math.max(0, 4.6 - v.ren); return item('opt', 'percent', 'Rentabilidad · ' + (gp > 0.05 ? 'faltan ' + gp.toFixed(1).replace('.', ',') + ' puntos' : 'cubierta'), '4,6 %', gp > 0.05 ? 'warning' : 'success'); })() : item('opt', SEC_IC.opt, 'Optimizaciones · faltan 2,2 puntos', '4,6 %', 'warning'),
          s.v32 ? null : item('notas', SEC_IC.notas, 'Notas', String(NOTES.length), null));
      }
      if (s.ia) return this.planIA(s.ia, { v, busy, leg, liq, tools, diff, big: mode === 'wide' });
      const big = mode === 'wide';
      const ctx = (CTX[s.screen] || CTX.ingresos)[0];
      const open = (k) => (s.secs || ctx).indexOf(k) >= 0;
      const toggle = (k) => (o) => this.setState((st) => { const cur = st.secs || ctx; return { secs: o ? Array.from(new Set(cur.concat(k))) : cur.filter((x) => x !== k) }; });
      /* sections can be reordered: drag the grip, or focus it and use the arrow keys */
      const ORDER0 = ['cfg', 'leg', 'liq', 'opt', 'notas'], order = s.order || ORDER0, ord = (k) => order.indexOf(k);
      const move = (k, to) => this.setState((st) => { const o = (st.order || ORDER0).filter((x) => x !== k); o.splice(Math.max(0, Math.min(o.length, to)), 0, k); return { order: o }; });
      const grip = (k, title) => h('span', { className: 'r4-grip', role: 'button', tabIndex: 0, draggable: true, 'aria-label': 'Mover ' + title + ' (flechas arriba y abajo)', title: undefined,
        onClick: (e) => { e.preventDefault(); e.stopPropagation(); },
        onKeyDown: (e) => { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); move(k, ord(k) + (e.key === 'ArrowUp' ? -1 : 1)); } },
        onDragStart: (e) => { this._drag = k; try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', k); } catch (x) {} setTimeout(() => this.setState({ sorting: true }), 0); },
        onDragEnd: () => { this._drag = null; this.setState({ sorting: false, dragOver: null }); } }, I('grip-vertical', 14));
      const sumOf = (k, title, status) => h('span', { className: 'r2-sec__sum r4-sum' }, grip(k, title), h('span', { className: 'r4-sum__t' }, h('span', { className: 'r4-sum__ic', 'aria-hidden': true }, I(SEC_IC[k], 18)), title), status, changed(k) ? h('span', { className: 'r4-upd' }, I('sparkles', 12), 'Actualizado') : null);
      const sec = (k, title, status, kids) => s.flow
        ? h('div', { key: k, 'data-anchor': 'sec-' + k, className: 'r4-anchor' + (s.dragOver === k ? ' is-over' : ''), style: { order: ord(k) }, onDragOver: (e) => { if (this._drag && this._drag !== k) { e.preventDefault(); if (s.dragOver !== k) this.setState({ dragOver: k }); } }, onDragLeave: () => s.dragOver === k && this.setState({ dragOver: null }), onDrop: (e) => { e.preventDefault(); const d = this._drag; this._drag = null; this.setState({ dragOver: null }); if (d && d !== k) move(d, ord(k)); this.setState({ sorting: false }); }, onDragEnd: () => { this._drag = null; this.setState({ dragOver: null, sorting: false }); } }, h('section', { className: 'r2-sec r4-flowsec', 'aria-label': title }, h('div', { className: 'afi-accordion-v2__summary r4-flowsum' }, sumOf(k, title, status)), kids))
        : h('div', { key: k, 'data-anchor': 'sec-' + k, className: 'r4-anchor' + (s.dragOver === k ? ' is-over' : ''), style: { order: ord(k) }, onDragOver: (e) => { if (this._drag && this._drag !== k) { e.preventDefault(); if (s.dragOver !== k) this.setState({ dragOver: k }); } }, onDragLeave: () => s.dragOver === k && this.setState({ dragOver: null }), onDrop: (e) => { e.preventDefault(); const d = this._drag; this._drag = null; this.setState({ dragOver: null }); if (d && d !== k) move(d, ord(k)); this.setState({ sorting: false }); }, onDragEnd: () => { this._drag = null; this.setState({ dragOver: null, sorting: false }); } }, C('Accordion', { open: open(k), onToggle: toggle(k), className: 'r2-sec', summary: sumOf(k, title, status) }, kids));
      /* detail inside a section folds away; at half the screen and wider it starts open */
      const subOpen = (k) => (s.subs ? s.subs.indexOf(k) >= 0 : big);
      const sub = (k, title, end, kids) => h('div', { key: k, 'data-anchor': k, className: 'r4-subwrap' }, C('Accordion', { className: 'r4-fold r4-fold--sub', open: subOpen(k), onToggle: (o) => this.setState((st) => { const cur = st.subs || (big ? ['leg-esc', 'leg-hoy', 'liq-esc', 'liq-col', 'aa', 'gl'] : []); return { subs: o ? Array.from(new Set(cur.concat(k))) : cur.filter((x) => x !== k) }; }),
        summary: h('span', { className: 'r4-fold__sum r4-fold__sum--sub' }, h('span', null, title), h('span', { className: 'r2-spacer' }), end) }, h('div', { className: 'r4-subin' }, kids)));
      const verdict = (o) => h('div', { className: 'r4-verdict r4-st--' + o.tone }, I(o.tone === 'success' ? 'circle-check' : o.tone === 'neutral' ? 'circle-dashed' : 'triangle-alert', 18), h('div', null, h('strong', null, o.title), h('p', null, o.body), o.act && !(this.state.v312 && o.act[0] === 'Ver cómo cubrirlo') ? h('button', { type: 'button', className: 'r4-verdict__act', onClick: o.act[1] }, o.act[0], I('arrow-right', 14)) : null));
      const view = (k) => (s.view[k] || 'g');
      const viewSwitch = (k) => big ? h('div', { className: 'r4-view' }, C('SegmentedControl', { value: view(k), onChange: (x) => this.setState((st) => ({ view: Object.assign({}, st.view, { [k]: x }) })), options: [{ value: 'g', label: 'Gráfico' }, { value: 't', label: 'Tabla' }] })) : null;
      const ages = v.medio.map((_, i) => (i === 0 ? 'Hoy' : String(AGE0 + i)));
      const scRow = (name, key, val) => C('TableRow', { key, hoverable: false }, C('TableCell', null, name), C('TableCell', { kind: 'monetary' }, val), C('TableCell', null, v.goal ? (v.cover[key] ? St({ tone: 'success', text: 'Cubre' }) : St({ tone: 'warning', text: 'No cubre' })) : '—'));
      const legTable = C('TableShell', { density: 'compact', quiet: true, className: 'r4-table' },
        h('thead', null, C('TableHeaderRow', null, C('TableHeaderCell', { label: 'Escenario' }), C('TableHeaderCell', { label: 'A los ' + v.edad, kind: 'monetary' }), C('TableHeaderCell', { label: 'Legado' }))),
        h('tbody', null, scRow('Optimista', 'opt', m1(v.sc.opt)), scRow('Medio', 'med', m1(v.sc.med)), scRow('Pesimista', 'pes', m1(v.sc.pes))));
      const every5 = v.medio.map((x, i) => [i, x]).filter(([i]) => i % 5 === 0 || i === v.medio.length - 1);
      const legYears = C('TableShell', { density: 'compact', quiet: true, className: 'r4-table' },
        h('thead', null, C('TableHeaderRow', null, C('TableHeaderCell', { label: 'Edad' }), C('TableHeaderCell', { label: 'Optimista', kind: 'monetary' }), C('TableHeaderCell', { label: 'Medio', kind: 'monetary' }), C('TableHeaderCell', { label: 'Pesimista', kind: 'monetary' }))),
        h('tbody', null, every5.map(([i, x]) => { const t = i / (v.medio.length - 1); return C('TableRow', { key: i, hoverable: false }, C('TableCell', null, i ? String(AGE0 + i) : 'Hoy'), C('TableCell', { kind: 'monetary' }, m1(x * (1 + 0.36 * t))), C('TableCell', { kind: 'monetary' }, m1(x)), C('TableCell', { kind: 'monetary' }, m1(x * (1 - 0.24 * t)))); })));
      const liqYears = C('TableShell', { density: 'compact', quiet: true, className: 'r4-table' },
        h('thead', null, C('TableHeaderRow', null, C('TableHeaderCell', { label: 'Año' }), C('TableHeaderCell', { label: 'Edad' }), C('TableHeaderCell', { label: 'Liquidez generada · medio', kind: 'monetary' }))),
        h('tbody', null, v.net.map((x, i) => C('TableRow', { key: i, hoverable: false }, C('TableCell', null, String(YEAR0 + 1 + i)), C('TableCell', null, String(AGE0 + 1 + i)), C('TableCell', { kind: 'monetary' }, h('span', { className: x < 0 ? 'r4-neg' : '' }, eur(x)))))));
      const liqRow = (name, ok) => C('TableRow', { key: name, hoverable: false }, C('TableCell', null, name), C('TableCell', null, ok ? St({ tone: 'success', text: 'Suficiente' }) : St({ tone: 'warning', text: 'Déficit' })));
      const required = 4.6, actual = 2.4;
      return h(React.Fragment, null,
        h('div', { className: 'r3-plan__head' }, h('h2', null, 'El plan'), v.draft && !busy ? h('span', { className: 'r2-muted' }, 'Sin guardar') : null, h('span', { className: 'r2-spacer' }), tools),

        h('div', { className: 'r3-plan__body' },
          s.v32 ? null : sec('cfg', 'Configuración', null, h('div', { className: 'r2-figs' }, C('SummaryList', { rows: [{ label: 'Escenario', value: 'Medio' }, { label: 'Edad de seguridad', value: v.edad + ' años' }, { label: 'IPC', value: '2,00 %' }, { label: 'Revalorización del ahorro', value: '2,00 %' }, { label: 'Coste de financiación', value: '7,50 %' }] }))),
          s.v32 ? this.evoSection(sec, St, leg, v, big, busy) :           sec('leg', 'Legado y patrimonio', St({ tone: leg.tone, text: big ? leg.text : leg.short, busy }), C('LoadingOverlay', { busy, label: 'Recalculando el plan…' }, h('div', { className: 'r2-figs' },
            verdict(leg),
            h('div', { className: 'r4-figline' }, h('h4', null, 'Legado previsto a los ' + v.edad + ' · escenario medio'),
              h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(v.sc.med, meur, 2)), v.goal ? (v.cover.med ? St({ tone: 'success', text: 'Cubre el legado' }) : St({ tone: 'warning', text: 'No cubre el legado' })) : null)),
            viewSwitch('leg'),
            view('leg') === 't' && big ? h('div', { className: 'r4-block' }, h('h4', null, 'Patrimonio previsto por escenario'), legYears)
              : h(Bars, { values: v.medio, labels: ages, goal: v.goal, goalLabel: 'Objetivo · ' + mGoal(v.goal), mark: (v.ra || RETIRE) - AGE0, markLabel: 'Jubilación · ' + (v.ra || RETIRE), format: eur, height: big ? 180 : 120, label: 'Patrimonio previsto por edad, escenario medio, de hoy a los ' + v.edad + ' años' }),
            sub('leg-esc', 'Legado por escenario', h('span', { className: 'r2-muted' }, nCover + ' de 3 cubren'), legTable),
            sub('leg-hoy', 'Patrimonio hoy', h('span', { className: 'r2-amount' }, A(v.pat)), h('div', { className: 'r4-block r4-block--flat' },
              h('div', { className: 'r2-split', role: 'img', 'aria-label': 'Reparto del patrimonio' }, GROUPS.map((g) => h('i', { key: g.value, style: { width: (v.groups[g.value] / v.pat * 100) + '%', background: COL[g.value] } }))),
              h('ul', { className: 'r2-legend' }, GROUPS.map((g) => h('li', { key: g.value }, C('Dot', { color: COL[g.value] }), h('span', null, g.label), h('span', { className: 'r2-legend__v' }, Math.round(v.groups[g.value] / v.pat * 100) + ' %'))))))))),
          sec('liq', 'Liquidez', St({ tone: liq.tone, text: liq.text, busy }), C('LoadingOverlay', { busy, label: 'Recalculando el plan…' }, h('div', { className: 'r2-figs' },
            verdict(liq),
            h('div', { className: 'r4-figline' }, h('h4', null, 'Liquidez generada año a año · escenario medio'),
              h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' + (v.worst < 0 ? ' r4-neg' : '') }, A(v.worst)), h('span', { className: 'r2-muted' }, v.worst < 0 ? 'peor año, ' + v.worstYear : 'el año más justo, ' + v.worstYear))),
            viewSwitch('liq'),
            view('liq') === 't' && big ? h('div', { className: 'r4-block' }, h('h4', null, 'Liquidez por año'), liqYears)
              : h(Bars, { values: v.net, labels: v.net.map((_, i) => String(YEAR0 + 1 + i)), mark: null, format: eur, height: big ? 160 : 110, label: 'Liquidez generada cada año en el escenario medio; en rojo, los años con déficit' }),
            h('ul', { className: 'r2-legend r4-legend' }, h('li', null, h('i', { className: 'r4-key' }), 'Ahorro'), h('li', null, h('i', { className: 'r4-key r4-key--neg' }), 'Necesidad de liquidez')),
            sub('liq-esc', 'Liquidez por escenario', h('span', { className: 'r2-muted' }, (v.def ? 1 : 2) + ' de 3 sin déficit'), C('TableShell', { density: 'compact', quiet: true, className: 'r4-table' },
              h('thead', null, C('TableHeaderRow', null, C('TableHeaderCell', { label: 'Escenario' }), C('TableHeaderCell', { label: 'Liquidez' }))),
              h('tbody', null, liqRow('Optimista', true), liqRow('Medio', !v.def), liqRow('Pesimista', false)))),
            sub('liq-col', 'Colchón de liquidez', h('span', { className: 'r2-amount' }, A(v.colchon)), C('SummaryList', { rows: [{ label: 'Colchón de liquidez inmediata', value: A(v.colchon) }, { label: 'Años con déficit · medio', value: A(v.def, (x) => String(Math.round(x))) }, { label: 'Peor año · medio', value: v.def ? A(v.worst) : '—' }] }))))),
          sec('opt', 'Optimizaciones', St({ tone: 'warning', text: 'Faltan ' + (required - actual).toFixed(1).replace('.', ',') + ' puntos' }), h('div', { className: 'r2-figs' },
            h('div', { className: 'r3-sub', 'data-anchor': 'rent' }, h('span', { className: 'r3-sub__t' }, 'Rentabilidad necesaria frente a la actual')),
            h('div', { className: 'r2-fig r2-fig--row' }, h('span', { className: 'r2-ai' }, I('sparkles', 14), 'Rentabilidad mínima necesaria'), h('strong', null, '4,6 %')),
            h(Ruler, { required, actual, range: [2.1, 2.6] }),
            h('p', { className: 'r2-hint' }, 'La cartera rinde un 2,4 % en el escenario medio (pesimista 2,1 % · optimista 2,6 %): 2,2 puntos menos de lo necesario.'),
            sub('aa', 'Asset allocation', St({ tone: 'neutral', text: 'Sin aplicar' }), h('div', { className: 'r3-chart' }, C('DonutChart', { size: 'sm', interactive: true, legend: true, look: 'ramp', formatValue: (x) => x + ' %', centerLabel: 'mil € hoy', centerValue: '290',
              data: [{ label: 'Renta variable', value: 55 }, { label: 'Renta fija', value: 25 }, { label: 'Monetario', value: 12 }, { label: 'Alternativos', value: 8 }], description: 'Reparto actual de la cartera financiera, ejemplo' }))),
            sub('gl', 'Generación de liquidez', St({ tone: 'neutral', text: 'Sin configurar' }), h('div', { className: 'r4-block r4-block--flat' },
              h('p', { className: 'r2-hint' }, 'Sin configurar no hay nada que mostrar. Al configurarla, aquí aparecen las ventas previstas año a año y cómo cubren el déficit de ' + (v.def ? v.worstYear : 'liquidez') + '.'),
              h('div', null, C('Button', { variant: 'secondary', size: 'sm', onClick: () => this.go('gl') }, 'Configurar')))))),
          s.v32 ? null : sec('notas', 'Notas', h('span', { className: 'r2-muted' }, String(NOTES.length)), h('div', { className: 'r2-notes' },
            NOTES.slice(0, 3).map((n, i) => h('div', { key: i, className: 'r2-note' }, n[0], h('small', null, n[1]))),
            h('div', { className: 'r2-actions' }, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('plus') }, 'Añadir nota'), C('Button', { variant: 'ghost', size: 'sm' }, 'Ver todas (' + NOTES.length + ')'))))));
    }

    /* ---------- Ingresos in two lines: name with type and frequency under it; amount with its period ---------- */
    incList() {
      const s = this.state, imp = s.v312 && s.sim && (s.simChanges || []).indexOf('import') >= 0;
      const base = imp ? s.inc.map((r) => r.concepto === 'Nómina Titular' ? Object.assign({}, r, { importe: 2750, sim: 'Simulado · antes 2.600 €' }) : r).concat([
        { id: 'si1', concepto: 'Alquiler piso Chamberí', tipo: 'alquiler', freq: 'Mensual', importe: 1400, desde: 'Hoy', hasta: 'Indefinido', sim: 'Simulado · nuevo' },
        { id: 'si2', concepto: 'Dividendos', tipo: 'otro', freq: 'Anual', importe: 6000, desde: 'Hoy', hasta: 'Indefinido', sim: 'Simulado · nuevo' },
        { id: 'si3', concepto: 'Bonus', tipo: 'nomina', freq: 'Anual', importe: 8000, desde: 'Hoy', hasta: 'Jubilación', sim: 'Simulado · nuevo' }]) : s.inc;
      const active = base.filter((r) => !r.ended), ended = base.filter((r) => r.ended), rows = this.sorted(s.tab === 'activos' ? active : ended), body = [];
      /* every control in the new row is the same height as the name and amount fields */
      const sel = (k, label, opts, d) => C('Select', { label, value: d[k], options: opts, onChange: (v) => this.setDraft(k, v) });
      if (s.adding && s.tab === 'activos') {
        const d = s.draft, t = TIPO.find((x) => x.value === d.tipo) || TIPO[0];
        body.push(C('TableRow', { key: 'new', hoverable: false, className: 'r2-new r4-two is-open' },
          C('TableCell', { colSpan: 2 }, h('span', { className: 'r2-name' }, this.ic(t.icon, 'new'), C('Input', { value: d.concepto, placeholder: 'Nombre del ingreso', 'aria-label': 'Concepto', onChange: (e) => this.setDraft('concepto', e.target.value) }))),
          C('TableCell', { kind: 'monetary' }, C('Input', { value: d.importe, placeholder: '0', inputMode: 'decimal', suffix: '€', 'aria-label': 'Importe', onChange: (e) => this.setDraft('importe', e.target.value) }))));
        body.push(this.detailRow('new-d', 3, [
          h('div', { key: 'g', className: 'r4-line2' }, sel('tipo', 'Tipo', TIPO, d), sel('freq', 'Frecuencia', FREQ, d), sel('hasta', 'Hasta', HASTA, d)),
          h('p', { key: 'p', className: 'r2-hint' }, 'Con nombre e importe basta para crearlo; desde hoy. El plan muestra el efecto mientras escribe.'),
          this.actions(C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', onClick: () => this.discard() }, 'Descartar'), h(React.Fragment, null, C('Tooltip', { content: 'Crear', shortcut: '⏎' }, C('Button', { variant: 'primary', size: 'sm', disabled: !this.canCreate(), onClick: () => this.create() }, 'Crear'))))]));
      }
      rows.forEach((r) => {
        const open = s.open === r.id, t = TIPO.find((x) => x.value === r.tipo) || TIPO[0];
        body.push(C('TableRow', { key: r.id, hoverable: true, className: 'r4-two ' + (open ? 'is-open ' : '') + (s.fresh === r.id ? 'r2-fresh' : ''), onClick: () => open ? this.closeRow() : this.setState({ open: r.id, adding: false, cell: null }) },
          C('TableCell', null, h('span', { className: 'r2-name' }, this.ic(t.icon), h('span', { className: 'r4-name2' },
            h('span', { className: 'r2-name__t' }, r.concepto, s.fresh === r.id ? C('Badge', { tone: 'info' }, 'Nuevo') : null, r.sim ? C('Badge', { tone: 'info' }, r.sim) : null),
            h('span', { className: 'r4-sub' }, t.label, ' · ', this.quiet(r)),
            h('span', { className: 'r4-sub r4-sub--period' }, r.desde + ' → ' + r.hasta)))),
          C('TableCell', null, h('span', { className: 'r2-muted' }, r.desde + ' → ' + r.hasta)),
          C('TableCell', { kind: 'monetary' }, h('span', { className: 'r4-name2 r4-name2--end' }, h('span', { className: 'r2-amount' }, eur(r.importe)), h('span', { className: 'r4-sub' }, PER[r.freq])))));
        if (open) body.push(this.detailRow(r.id + '-d', 3, [
          h('div', { key: 'g', className: 'r2-grid' },
            C('Input', { label: 'Concepto', size: 'sm', value: r.concepto, onChange: (e) => this.update(r.id, 'concepto', e.target.value) }),
            C('Input', { label: 'Importe', size: 'sm', value: fmt(r.importe), suffix: '€', inputMode: 'decimal', onChange: (e) => this.update(r.id, 'importe', e.target.value) }),
            C('Select', { label: 'Hasta', size: 'sm', value: r.hasta, options: HASTA.concat(HASTA.find((x) => x.value === r.hasta) ? [] : [{ value: r.hasta, label: r.hasta }]), onChange: (v) => this.update(r.id, 'hasta', v) })),
          this.actionsDel(r.id, r.nombre || r.concepto || r.label || 'este registro',
            h(React.Fragment, null, C('Button', { variant: 'secondary', size: 'sm', iconStart: I('check'), onClick: () => this.finish(r.id) }, 'Terminar'), C('Button', { variant: 'primary', size: 'sm', onClick: () => this.closeRow() }, 'Hecho')))]));
      });
      return h('section', { className: 'r2-list' },
        h('div', { className: 'r2-bar' }, C('Tabs', { items: [{ value: 'activos', label: 'Activos · ' + active.length }, { value: 'terminados', label: 'Terminados · ' + ended.length }], value: s.tab, onChange: (v) => this.setState({ tab: v, open: null }) }), s.btnBar || s.v38 ? h('span', { className: 'r2-spacer' }) : null, s.v38 && !s.v310 ? this.vista('inc') : null, s.btnBar ? this.newBtn('Nuevo ingreso') : null),
        rows.length || s.adding
          ? C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r4-table2' }, h('thead', null, C('TableHeaderRow', null, this.th('concepto', 'Concepto'), this.th(null, 'Periodo'), this.th('importe', 'Importe', 'monetary'))), h('tbody', null, body))
          : C('EmptyState', { size: 'compact', title: 'No hay ingresos terminados', actions: C('Button', { variant: 'secondary', size: 'sm', onClick: () => this.setState({ tab: 'activos', open: null }) }, 'Ver ingresos activos') }, 'Cuando un ingreso deja de cobrarse, «Terminar» lo trae aquí y deja de contar en el plan.'));
    }

    /* ---------- Patrimonio in two lines: name with its owner under it; status as icon + text; value never wraps ---------- */
    patList() {
      if (this.state.v32) return this.patListReal();
      const s = this.state, body = [], total = s.pat.reduce((t, a) => t + num(a.valor), 0);
      const PG = [{ value: 'inm', label: 'Inmobiliario', icon: 'building-2' }, { value: 'inv', label: 'Inversiones', icon: 'trending-up' }, { value: 'pen', label: 'Planes de pensiones', icon: 'piggy-bank' }, { value: 'liq', label: 'Liquidez', icon: 'wallet' }];
      const OWN = ['Titular', 'Pareja', 'Ambos'].map((x) => ({ value: x, label: x }));
      const status = (a) => a.done >= 3 ? St({ tone: 'success', text: 'Completo' }) : h('span', { className: 'r4-st r4-st--warning' }, I('circle-dashed', 14), (3 - a.done) + ' por completar');
      PG.forEach((g) => {
        const items = this.sorted(s.pat.filter((a) => a.grupo === g.value)), sum = items.reduce((t, a) => t + num(a.valor), 0);
        body.push(C('TableRow', { key: 'g-' + g.value, hoverable: false, className: 'r2-group' },
          C('TableCell', { colSpan: 2 }, h('span', { className: 'r2-group__t' }, C('Dot', { color: COL[g.value] }), g.label, h('span', { className: 'r2-muted' }, ' · ' + items.length))),
          C('TableCell', { kind: 'monetary' }, h('span', { className: 'r2-muted r4-nowrap' }, eur(sum)))));
        items.forEach((a) => {
          const open = s.open === a.id;
          body.push(C('TableRow', { key: a.id, hoverable: true, className: 'r4-two ' + (open ? 'is-open ' : '') + (s.fresh === a.id ? 'r2-fresh' : ''), onClick: () => open ? this.closeRow() : this.setState({ open: a.id, adding: false }) },
            C('TableCell', null, h('span', { className: 'r2-name' }, this.ic(g.icon), h('span', { className: 'r4-name2' },
              h('span', { className: 'r2-name__t' }, a.nombre, s.fresh === a.id ? C('Badge', { tone: 'info' }, 'Nuevo') : null),
              h('span', { className: 'r4-sub' }, a.titular),
              h('span', { className: 'r4-sub r4-sub--period' }, status(a))))),
            C('TableCell', null, status(a)),
            C('TableCell', { kind: 'monetary' }, h('span', { className: 'r2-amount r4-nowrap' }, eur(a.valor)))));
          if (open) body.push(this.detailRow(a.id + '-d', 3, [
            h('div', { key: 'g', className: 'r2-grid' },
              C('Input', { label: 'Nombre', value: a.nombre, onChange: (e) => this.update(a.id, 'nombre', e.target.value) }),
              C('Input', { label: 'Valor actual', value: fmt(a.valor), suffix: '€', onChange: (e) => this.update(a.id, 'valor', e.target.value) }),
              C('Select', { label: 'Titular', value: a.titular, options: OWN, onChange: (v) => this.update(a.id, 'titular', v) })),
            this.moreSections(a),
            this.actionsDel(a.id, a.nombre || a.concepto || 'este activo', C('Button', { variant: 'primary', size: 'sm', onClick: () => this.closeRow() }, 'Hecho'))]));
        });
        if (s.adding && s.draft && s.draft.grupo === g.value) {
          const d = s.draft;
          body.push(C('TableRow', { key: 'new', hoverable: false, className: 'r2-new r4-two is-open' },
            C('TableCell', { colSpan: 2 }, h('span', { className: 'r2-name' }, this.ic(g.icon, 'new'), C('Input', { value: d.nombre, placeholder: 'Nombre del activo', 'aria-label': 'Nombre', onChange: (e) => this.setDraft('nombre', e.target.value) }))),
            C('TableCell', { kind: 'monetary' }, C('Input', { value: d.valor, placeholder: '0', inputMode: 'decimal', suffix: '€', 'aria-label': 'Valor', onChange: (e) => this.setDraft('valor', e.target.value) }))));
          body.push(this.detailRow('new-d', 3, [
            h('div', { key: 'g', className: 'r4-line2 r4-line2--two' }, C('Select', { label: 'Titular', value: d.titular, options: OWN, onChange: (v) => this.setDraft('titular', v) }), C('Select', { label: 'Tipo de activo', value: d.grupo, options: PG, onChange: (v) => this.setDraft('grupo', v) })),
            h('p', { key: 'p', className: 'r2-hint' }, 'Con nombre y valor basta para crearlo. Titulares, revalorización y fiscalidad se completan después en la fila.'),
            this.actions(C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', onClick: () => this.discard() }, 'Descartar'), h(React.Fragment, null, C('Tooltip', { content: 'Crear', shortcut: '⏎' }, C('Button', { variant: 'primary', size: 'sm', disabled: !this.canCreate(), onClick: () => this.create() }, 'Crear'))))]));
        }
      });
      return h('section', { className: 'r2-list' },
        h('div', { className: 'r2-bar' }, h('span', { className: 'r2-total' }, 'Patrimonio neto ', h('strong', null, eur(total)))),
        C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r4-table2 r4-table2--pat' }, h('thead', null, C('TableHeaderRow', null, this.th('nombre', 'Activo'), this.th(null, 'Datos'), this.th('valor', 'Valor', 'monetary'))), h('tbody', null, body)));
    }

    /* ---------- v3.2 Patrimonio: the full example. Summary bars, search, groups that fold, ownership split ---------- */
    patListReal() {
      if (this.state.v38) return this.patList38();
      const s = this.state, q = (s.q || '').trim().toLowerCase(), body = [], folded = s.gfold || [];
      const assets = s.pat.filter((a) => a.grupo !== 'deu'), debts = s.pat.filter((a) => a.grupo === 'deu');
      const tA = assets.reduce((t, a) => t + num(a.valor), 0), tD = debts.reduce((t, a) => t + num(a.valor), 0);
      const OWN = ['Titular', 'Pareja', 'Ambos'].map((x) => ({ value: x, label: x }));
      const status = (a) => a.done >= 3 ? St({ tone: 'success', text: 'Completo' }) : h('span', { className: 'r4-st r4-st--warning' }, I('circle-dashed', 14), (3 - a.done) + ' por completar');
      const ten = (a) => h('span', { className: 'r4-ten' }, (a.ten || []).map(([who, p]) => h('span', { key: who, className: 'r4-tenchip' }, who, h('b', null, p + ' %'))));
      const amt = (v) => h('span', { className: 'r2-amount r4-nowrap' + (v < 0 ? ' r4-neg' : '') }, eur(v));
      PG8.forEach((g) => {
        const all = s.pat.filter((a) => a.grupo === g.value), items = this.sorted(all.filter((a) => !q || (a.nombre + ' ' + (a.entidad || '') + ' ' + (a.detalle || '')).toLowerCase().includes(q)));
        if (!items.length && !(s.adding && s.draft && s.draft.grupo === g.value)) return;
        const sum = all.reduce((t, a) => t + num(a.valor), 0), shut = folded.indexOf(g.value) >= 0;
        body.push(C('TableRow', { key: 'g-' + g.value, hoverable: false, className: 'r2-group r4-gfold' },
          C('TableCell', { colSpan: 3 }, h('button', { type: 'button', className: 'r4-gbtn', 'aria-expanded': !shut, onClick: () => this.setState((st) => { const f = st.gfold || []; return { gfold: shut ? f.filter((x) => x !== g.value) : f.concat(g.value) }; }) },
            C('Dot', { color: COL8[g.value] }), h('span', { className: 'r2-group__t' }, g.label), h('span', { className: 'r2-muted' }, ' · ' + all.length), h('span', { className: 'r4-gchev' + (shut ? ' is-shut' : '') }, I('chevron-down', 14)))),
          C('TableCell', { kind: 'monetary' }, h('span', { className: 'r4-nowrap r4-gsum' + (sum < 0 ? ' r4-neg' : '') }, eur(sum)))));
        if (shut) return;
        items.forEach((a) => {
          const open = s.open === a.id;
          body.push(C('TableRow', { key: a.id, hoverable: true, className: 'r4-two ' + (open ? 'is-open ' : '') + (s.fresh === a.id ? 'r2-fresh' : ''), onClick: () => open ? this.closeRow() : this.setState({ open: a.id, adding: false }) },
            C('TableCell', null, h('span', { className: 'r2-name' }, this.ic(g.icon), h('span', { className: 'r4-name2' },
              h('span', { className: 'r2-name__t' }, a.nombre, s.fresh === a.id ? C('Badge', { tone: 'info' }, 'Nuevo') : null),
              h('span', { className: 'r4-sub' }, a.detalle + (a.entidad && a.entidad !== '—' ? ' · ' + a.entidad : '')),
              h('span', { className: 'r4-sub r4-sub--period' }, ten(a))))),
            C('TableCell', null, ten(a)),
            C('TableCell', null, status(a)),
            C('TableCell', { kind: 'monetary' }, amt(a.valor))));
          if (open) body.push(this.detailRow(a.id + '-d', 4, [
            h('div', { key: 'g', className: 'r2-grid' },
              C('Input', { label: 'Nombre', value: a.nombre, onChange: (e) => this.update(a.id, 'nombre', e.target.value) }),
              C('Input', { label: g.value === 'deu' ? 'Importe pendiente' : 'Valor actual', value: fmt(a.valor), suffix: '€', onChange: (e) => this.update(a.id, 'valor', (a.valor < 0 ? '-' : '') + e.target.value) }),
              C('Input', { label: 'Entidad', value: a.entidad === '—' ? '' : a.entidad, onChange: (e) => this.update(a.id, 'entidad', e.target.value) })),
            this.moreSections(a),
            this.actionsDel(a.id, a.nombre || a.concepto || 'este activo', C('Button', { variant: 'primary', size: 'sm', onClick: () => this.closeRow() }, 'Hecho'))]));
        });
        if (s.adding && s.draft && s.draft.grupo === g.value) {
          const d = s.draft;
          body.push(C('TableRow', { key: 'new', hoverable: false, className: 'r2-new r4-two is-open' },
            C('TableCell', { colSpan: 3 }, h('span', { className: 'r2-name' }, this.ic(g.icon, 'new'), C('Input', { value: d.nombre, placeholder: 'Nombre del activo', 'aria-label': 'Nombre', onChange: (e) => this.setDraft('nombre', e.target.value) }))),
            C('TableCell', { kind: 'monetary' }, C('Input', { value: d.valor, placeholder: '0', inputMode: 'decimal', suffix: '€', 'aria-label': 'Valor', onChange: (e) => this.setDraft('valor', e.target.value) }))));
          body.push(this.detailRow('new-d', 4, [
            h('div', { key: 'g', className: 'r4-line2 r4-line2--two' }, C('Select', { label: 'Titular', value: d.titular, options: OWN, onChange: (v) => this.setDraft('titular', v) }), C('Select', { label: 'Tipo de activo', value: d.grupo, options: PG8, onChange: (v) => this.setDraft('grupo', v) })),
            h('p', { key: 'p', className: 'r2-hint' }, 'Con nombre y valor basta para crearlo. Titulares, revalorización y fiscalidad se completan después en la fila.'),
            this.actions(C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', onClick: () => this.discard() }, 'Descartar'), h(React.Fragment, null, C('Button', { variant: 'primary', size: 'sm', disabled: !this.canCreate(), onClick: () => this.create() }, 'Crear')))]));
        }
      });
      const bar = h('div', { className: 'r4-psum' },
        h('div', { className: 'r4-psum__a' }, h('div', { className: 'r4-psum__h' }, h('span', null, 'Activos · ', h('strong', null, eur(tA))), h('span', { className: 'r2-muted' }, 'Neto ' + eur(tA + tD))),
          h('div', { className: 'r4-psum__bar' }, PG8.filter((g) => g.value !== 'deu').map((g) => { const v = s.pat.filter((a) => a.grupo === g.value).reduce((t, a) => t + num(a.valor), 0); return v ? h('i', { key: g.value, title: g.label + ' · ' + eur(v), style: { flex: v + ' 1 0', background: COL8[g.value] } }) : null; })),
          h('ul', { className: 'r4-psum__leg' }, PG8.filter((g) => g.value !== 'deu').map((g) => { const v = s.pat.filter((a) => a.grupo === g.value).reduce((t, a) => t + num(a.valor), 0); return v ? h('li', { key: g.value }, C('Dot', { color: COL8[g.value] }), g.label + ' · ' + (v / tA * 100).toFixed(1).replace('.', ',') + ' %') : null; }))),
        h('div', { className: 'r4-psum__d' }, h('div', { className: 'r4-psum__h' }, h('span', null, 'Deudas · ', h('strong', { className: 'r4-neg' }, eur(tD)))),
          h('div', { className: 'r4-psum__bar' }, h('i', { style: { flex: '1 1 0', background: COL8.deu } })),
          h('p', { className: 'r2-muted' }, debts.map((a) => a.nombre).join(', '))));
      return h('section', { className: 'r2-list' },
        h('div', { className: 'r2-bar' }, h('span', { className: 'r4-search' }, C('Input', { size: 'sm', value: s.q || '', placeholder: 'Buscar en patrimonio…', 'aria-label': 'Buscar en patrimonio', iconStart: I('search', 16), onChange: (e) => this.setState({ q: e.target.value }) })), s.btnBar ? h('span', { className: 'r2-spacer' }) : null, s.btnBar ? this.newBtn('Nuevo activo') : null),
        C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r4-table2 r4-table2--real' }, h('thead', null, C('TableHeaderRow', null, this.th('nombre', 'Activo'), this.th(null, 'Tenencia'), this.th(null, 'Datos'), this.th('valor', 'Importe', 'monetary'))), h('tbody', null, body)));
    }

    sorted(rows) {
      if (this.state.v38 && !this.state.sort && rows[0] && rows[0].importe != null) return rows.slice().sort((x, y) => num(y.importe) * PER_YEAR[y.freq] - num(x.importe) * PER_YEAR[x.freq]);
      return super.sorted(rows);
    }
    th(key, label, kind) {
      const s = this.state;
      if (s.v310 && !s.sort && key && (key === 'valor' || key === 'importe')) return C('TableHeaderCell', { key: label, label, kind, sortable: true, sort: 'desc', onSort: () => this.setState({ sort: { key, dir: 'asc' } }) });
      return super.th(key, label, kind);
    }
    /* exits as well as entrances: an open row's detail folds back (DS Reveal, open=false) before it leaves */
    closeKey(key, done) { if (reduced()) { done(); return; } clearTimeout(this._ck); this.setState({ closingKey: key }); this._ck = setTimeout(() => { done(); this.setState({ closingKey: null }); }, 470); }
    closeRow() { const id = this.state.open; if (id == null) return; this.closeKey(id + '-d', () => this.setState({ open: null })); }
    detailRow(key, cols, kids) { return C('TableRow', { key, hoverable: false, className: 'r2-detail' }, C('TableCell', { colSpan: cols }, C('Reveal', { open: this.state.closingKey !== key }, h('div', { className: 'r2-detail__in' }, kids)))); }
    /* ---------- 3.12: plan width = three stops (amplio · mitad · plegado), dots between the arrows ---------- */
    sizer() {
      const s = this.state, L = ['large', 'wide', 'closed'], N = { large: 'Amplio', wide: 'Mitad', closed: 'Plegado' }, i = Math.max(0, L.indexOf(s.size));
      const tip = (t, el) => C('Tooltip', { content: t, placement: 'bottom' }, el);
      return h('span', { className: 'r4-sizer', role: 'group', 'aria-label': 'Ancho del plan' },
        tip('Ampliar el plan', C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Ampliar el plan', disabled: i <= 0, onClick: () => this.setSize(L[Math.max(0, i - 1)]) }, I('chevron-left'))),
        h('span', { className: 'r4-sizer__dots' }, L.map((k) => tip(N[k], h('button', { key: k, type: 'button', className: 'r4-sizer__dot' + (k === s.size ? ' is-on' : ''), 'aria-label': 'Plan ' + N[k].toLowerCase(), 'aria-pressed': k === s.size, onClick: () => this.setSize(k) })))),
        tip(i >= 1 ? 'Plegar el plan' : 'Reducir el plan', C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Reducir el plan', disabled: i >= 2, onClick: () => this.setSize(L[Math.min(2, i + 1)]) }, I('chevron-right'))));
    }
    flowBar(figs, why, secondary, primary) {
      const el = this.flowBarEl(figs, why, secondary, primary);
      if (this.state.v312 && this.state.agentUI === 'dock') { this._fb = el; return null; }
      return el;
    }
    flowBarEl(figs, why, secondary, primary) {
      return C('ActionBar', { variant: 'pill', className: 'afi-action-bar-v2--pill r4-flowbar', label: 'Acciones', secondary, primary },
        figs.map(([l, x], i) => h('span', { key: i, className: 'r4-flowbar__fig' }, h('small', null, l), h('strong', null, x))),
        why ? h('span', { className: 'r4-flowbar__why' }, why) : null);
    }
    glNeedView(v) {
      const s = this.state, need = v.net0.map((x, i) => ({ y: YEAR0 + 1 + i, n: x < 0 ? -x : 0 })).filter((r) => r.n > 0), tot = need.reduce((t, r) => t + r.n, 0);
      if (!need.length) return h('div', { className: 'r2-main ap-in', key: 'gl-none' }, this.head('Generación de liquidez', 'Venta de activos para cubrir los años en que los ingresos y el ahorro no alcanzan.'),
        C('EmptyState', { title: 'Sin necesidades de liquidez', actions: C('Button', { variant: 'secondary', onClick: () => this.go('ingresos') }, 'Ver ingresos') }, 'Los ingresos y el ahorro cubren los gastos todos los años. Si cambian, aquí aparecerá lo que falta.'));
      const startPlan = () => this.setState({ glEdit: 'new', glName: 'Plan de desinversión ' + (((s.glPlans || []).length) + 1), glp: { sel: {} }, glOpen: null });
      return h('div', { className: 'r2-main ap-in', key: 'gl-need' },
        this.head('Generación de liquidez', 'Venta de activos para cubrir los años en que los ingresos y el ahorro no alcanzan.', C('Button', { variant: 'primary', iconStart: I('plus', 16), onClick: startPlan }, 'Crear plan de desinversión')),
        h('section', { className: 'r4-sec r4-need' },
          C('EmptyState', { title: 'Faltan ' + eur(Math.round(tot)) + ' en ' + need.length + (need.length === 1 ? ' año' : ' años'), actions: C('Button', { variant: 'secondary', iconStart: I('plus', 16), onClick: startPlan }, 'Crear plan de desinversión') },
            h('span', { className: 'r4-need__body' }, 'En el escenario medio, entre ' + need[0].y + ' y ' + need[need.length - 1].y + ' los gastos superan a los ingresos y al ahorro. Un plan de desinversión decide qué activos se venden, cuándo y con qué impuestos, empezando por los que menos pagan.'),
            h('span', { className: 'r4-need__years' }, need.map((r) => h('span', { key: r.y, className: 'r4-need__yr' }, h('small', null, r.y + ' · ' + (r.y - YEAR0 + AGE0) + ' años'), h('strong', null, '−' + eur(Math.round(r.n)))))))));
    }
    glListView(v) {
      const s = this.state, PL = s.glPlans || [], need = v.net0.filter((x) => x < 0), needT = need.reduce((t, x) => t - x, 0);
      const ys = v.net0.map((x, i) => (x < 0 ? YEAR0 + 1 + i : null)).filter(Boolean);
      const setOn = (p, on) => this.setState({ glOn: on ? p.id : null, glp: on ? JSON.parse(JSON.stringify(p.glp)) : { sel: {} }, lastCause: on ? 'Con «' + p.name + '» en el plan' : 'Sin plan de desinversión' });
      const edit = (p) => this.setState({ glEdit: p.id, glName: p.name, glp: JSON.parse(JSON.stringify(p.glp)), glOpen: null });
      const neu = () => this.setState({ glEdit: 'new', glName: 'Plan de desinversión ' + (PL.length + 1), glp: { sel: {} }, glOpen: null });
      return h('div', { className: 'r2-main ap-in', key: 'gl-list' },
        this.head('Generación de liquidez', 'Planes de desinversión para cubrir los años en que los ingresos y el ahorro no alcanzan. Uno de ellos cuenta en el plan; cambie el activo para comparar.', C('Button', { variant: 'primary', iconStart: I('plus', 16), onClick: neu }, 'Nuevo plan de desinversión')),
        h('section', { className: 'r4-sec r4-sec--flush' },
          needT ? C('Callout', { className: 'r4-needcall', title: 'Faltan ' + eur(Math.round(needT)) + ' en ' + ys.length + (ys.length === 1 ? ' año' : ' años') + ' (' + ys[0] + (ys.length > 1 ? '–' + ys[ys.length - 1] : '') + ')' }, 'Sin ningún plan activo, ni el ahorro ni la liquidez cubren esos años.') : null,
          C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r4-table2 r4-gllist' },
            h('thead', null, C('TableHeaderRow', null, C('TableHeaderCell', { label: 'Plan' }), C('TableHeaderCell', { label: 'Cubre', kind: 'monetary' }), C('TableHeaderCell', { label: 'En el plan' }))),
            h('tbody', null, PL.map((p) => { const g = glAlloc(s.pat, p.glp, v.net0), n = Object.keys(p.glp.sel || {}).filter((k) => p.glp.sel[k].on).length, net = Object.keys(g.used).reduce((t, k) => t + g.used[k].net, 0), on = s.glOn === p.id;
              return C('TableRow', { key: p.id, hoverable: true, className: on ? 'is-on' : '', onClick: () => edit(p) },
                C('TableCell', null, h('span', { className: 'r4-name2' }, h('span', { className: 'r2-name__t' }, p.name, on ? C('Badge', { tone: 'info' }, 'En el plan') : null), h('span', { className: 'r4-sub' }, n + (n === 1 ? ' activo' : ' activos') + ' · ' + eur(Math.round(net)) + ' netos' + (g.uncovered ? ' · ' + g.uncovered + (g.uncovered === 1 ? ' año sin cubrir' : ' años sin cubrir') : ' · cubre todos los años')))),
                C('TableCell', { kind: 'monetary' }, h('span', { className: 'r2-amount' }, (g.needT ? Math.round(g.covered / g.needT * 100) : 100) + ' %')),
                C('TableCell', null, h('span', { onClick: (e) => e.stopPropagation() }, C('Toggle', { active: on, 'aria-label': 'Usar «' + p.name + '» en el plan', onChange: (x) => setOn(p, typeof x === 'boolean' ? x : !on) })))); })))),
        h('p', { className: 'r2-hint' }, 'Solo un plan cuenta a la vez: dos planes venderían para la misma necesidad.'));
    }
    glSavedView(v) {
      const s = this.state, g = glAlloc(s.pat, s.glp, v.net0), sel = s.glp.sel, used = g.assets.filter((a) => g.used[a.id]);
      const tot = (k) => used.reduce((t, a) => t + g.used[a.id][k], 0), yrs = (a) => g.used[a.id].years;
      return h('div', { className: 'r2-main ap-in', key: 'gl-saved' },
        this.head('Generación de liquidez', 'El plan de desinversión guardado. El plan, a la derecha, ya cuenta con estas ventas.', C('Button', { variant: 'primary', iconStart: I('pencil', 16), onClick: () => this.setState({ glEdit: true, glSnap: JSON.parse(JSON.stringify(s.glp)) }) }, 'Editar plan')),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Plan de desinversión'),
          h('p', null, 'Cubre ', h('strong', null, (g.needT ? Math.round(g.covered / g.needT * 100) : 100) + ' %'), ' de una necesidad de ' + eur(Math.round(g.needT)) + (g.uncovered ? '; quedan ' + g.uncovered + (g.uncovered === 1 ? ' año' : ' años') + ' sin cubrir. ' : '; cubre todos los años. ') + 'Se venden ' + eur(Math.round(tot('gross'))) + ', con ' + eur(Math.round(tot('tax'))) + ' de impuestos: ' + eur(Math.round(tot('net'))) + ' netos.'),
          C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r4-table2' },
            h('thead', null, C('TableHeaderRow', null, C('TableHeaderCell', { label: 'Activo' }), C('TableHeaderCell', { label: 'Años que cubre' }), C('TableHeaderCell', { label: 'Neto', kind: 'monetary' }))),
            h('tbody', null, used.map((a) => C('TableRow', { key: a.id, hoverable: true, onClick: () => this.setState({ glEdit: true, glOpen: a.id, glSnap: JSON.parse(JSON.stringify(s.glp)) }) },
              C('TableCell', null, h('span', { className: 'r4-name2' }, h('span', { className: 'r2-name__t' }, a.nombre), h('span', { className: 'r4-sub' }, (sel[a.id].mode === 'manual' ? 'Manual' : 'Automático') + ' · se venden ' + eur(Math.round(g.used[a.id].gross))))),
              C('TableCell', null, yrs(a).length ? yrs(a).join(', ') : '—'),
              C('TableCell', { kind: 'monetary' }, h('span', { className: 'r2-amount' }, eur(Math.round(g.used[a.id].net)))))).concat(C('TableRow', { key: 'tot', hoverable: false, className: 'r4-totrow' },
              C('TableCell', null, h('strong', null, 'Total')), C('TableCell', null, ''), C('TableCell', { kind: 'monetary' }, h('strong', null, eur(Math.round(tot('net'))))))))),
          h('div', null, C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', iconStart: I('trash-2', 16), onClick: () => { this.setState({ glp: { sel: {} }, glSaved: false, glSnap: null, glEdit: false, glOpen: null }); this.toast('Plan de desinversión eliminado.'); } }, 'Eliminar plan'))));
    }
    glActive() { const g = this.state.glp; return !!(g && Object.keys(g.sel || {}).some((k) => g.sel[k] && g.sel[k].on)); }
    /* ---------- 3.12: the Patrimonio table again, with checkboxes, to pick assets for an optimisation ---------- */
    pickTable(o) {
      const list = o.assets, on = (a) => !!(o.sel[a.id] && o.sel[a.id].on), allOn = list.length && list.every(on), someOn = list.some(on);
      const typeOf = (a) => PG8.find((g) => g.value === a.grupo) || PG8[0], body = [];
      const row = (a) => {
        const t = typeOf(a), sel = on(a), open = o.open === a.id && sel;
        body.push(C('TableRow', { key: a.id, hoverable: true, className: 'r4-two r4-pick' + (sel ? ' is-picked' : '') + (open ? ' is-open' : ''), onClick: () => o.onRow(a) },
          C('TableCell', null, h('span', { className: 'r4-pick__name' }, h('span', { onClick: (e) => e.stopPropagation() }, C('Checkbox', { checked: sel, onChange: () => o.toggle(a) })),
            h('span', { className: 'r2-name' }, this.ic(t.icon), h('span', { className: 'r4-name2' }, h('span', { className: 'r2-name__t' }, a.nombre), h('span', { className: 'r4-sub' }, (o.grouped ? '' : t.label + ' · ') + a.detalle + (a.entidad && a.entidad !== '—' ? ' · ' + a.entidad : '')))))),
          o.cols.map((c, j) => C('TableCell', { key: j, kind: c.kind }, h('span', { onClick: c.stop ? (e) => e.stopPropagation() : undefined }, c.cell(a, sel))))));
        if (open && o.detail) body.push(this.detailRow(a.id + '-cfg', o.cols.length + 1, [o.detail(a)]));
      };
      if (o.grouped) PG8.forEach((g) => { const items = list.filter((a) => a.grupo === g.value); if (!items.length) return;
        body.push(C('TableRow', { key: 'g-' + g.value, hoverable: false, className: 'r2-group' }, C('TableCell', { colSpan: o.cols.length + 1 }, h('span', { className: 'r4-gbtn r4-gbtn--static' }, C('Dot', { color: COL8[g.value] }), h('span', { className: 'r2-group__t' }, g.label), h('span', { className: 'r2-muted' }, ' · ' + items.filter(on).length + ' de ' + items.length)))));
        items.forEach(row); });
      else list.forEach(row);
      return C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r4-table2 r4-table2--real r4-table2--pick' },
        h('thead', null, C('TableHeaderRow', null, C('TableHeaderCell', { key: 'a', label: h('span', { className: 'r4-pick__name' }, h('span', null, C('Checkbox', { checked: !!allOn, indeterminate: someOn && !allOn, onChange: () => o.toggleAll(!allOn) })), o.title || 'Activo') }), o.cols.map((c, j) => C('TableHeaderCell', { key: j, label: c.h, kind: c.kind })))),
        h('tbody', null, body));
    }
    /* ---------- 3.12 Asset allocation: a list of optimisations; each reallocates some assets to a risk profile ---------- */
    aaPage312() {
      const s = this.state, e = s.oaEdit, opts = s.opts || [];
      const pf = (k) => PERFILES.find((p) => p[0] === k) || PERFILES[1];
      const stat = (rows, cls) => h('dl', { className: 'r4-stats r4-stats--page' + (cls || '') }, rows.map(([l, x], i) => h('div', { key: i, className: 'r4-stat' }, h('dt', null, l), h('dd', null, x))));
      if (!e) {
        const con = this.modelFor({ oaEdit: null }).ren;
        const startNew = () => this.setState({ oaEdit: { name: 'Nueva optimización', perfil: 'mod', sel: {} }, lastCause: 'Con la optimización en edición' });
        return h('div', { className: 'r2-main ap-in', key: 'oa-list' },
          this.head('Asset allocation', 'Cada optimización reasigna algunos activos a un perfil de riesgo. El plan, a la derecha, compara el resultado con y sin optimizaciones.', C('Button', { variant: 'primary', iconStart: I('plus'), onClick: startNew }, 'Nueva optimización')),
          opts.length ? h('section', { className: 'r4-sec' },
            C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r4-table2' },
              h('thead', null, C('TableHeaderRow', null, C('TableHeaderCell', { label: 'Optimización' }), C('TableHeaderCell', { label: 'Perfil de riesgo' }), C('TableHeaderCell', { label: 'Patrimonio afectado', kind: 'monetary' }))),
              h('tbody', null, opts.map((o) => { const ids = Object.keys(o.sel).filter((id) => o.sel[id].on), amt = ids.reduce((t, id) => { const a = s.pat.find((x) => x.id === id); return t + (a ? Math.min(num(o.sel[id].amt != null ? o.sel[id].amt : a.valor), num(a.valor)) : 0); }, 0);
                return C('TableRow', { key: o.id, hoverable: true, onClick: () => this.setState({ oaEdit: JSON.parse(JSON.stringify(o)), lastCause: 'Con la optimización «' + o.name + '» en edición' }) },
                  C('TableCell', null, h('span', { className: 'r4-name2' }, h('span', { className: 'r2-name__t' }, o.name), h('span', { className: 'r4-sub' }, ids.length + (ids.length === 1 ? ' activo' : ' activos')))),
                  C('TableCell', null, pf(o.perfil)[1] + ' · ' + pf(o.perfil)[2].toFixed(2).replace('.', ',') + ' %'),
                  C('TableCell', { kind: 'monetary' }, h('span', { className: 'r2-amount' }, eur(amt)))); }))))
          : C('EmptyState', { title: 'Aún no hay optimizaciones', actions: C('Button', { variant: 'primary', iconStart: I('plus'), onClick: startNew }, 'Nueva optimización') }, 'Una optimización reasigna parte de la cartera a un perfil de riesgo y muestra cuánto cambia el plan, con los impuestos del cambio.'));
      }
      const assets = s.pat.filter(OA_OK), on = (a) => !!(e.sel[a.id] && e.sel[a.id].on);
      const amtOf = (a) => Math.min(num(e.sel[a.id] && e.sel[a.id].amt != null ? e.sel[a.id].amt : a.valor), num(a.valor));
      const setE = (p) => this.setState((st) => ({ oaEdit: Object.assign({}, st.oaEdit, p), lastCause: 'Con la optimización en edición' }));
      const setSel = (a, p) => setE({ sel: Object.assign({}, e.sel, { [a.id]: Object.assign({ on: true, amt: num(a.valor) }, e.sel[a.id], p) }) });
      const picked = assets.filter(on), total = picked.reduce((t, a) => t + amtOf(a), 0), tax = picked.reduce((t, a) => t + amtOf(a) * taxRate(a), 0);
      const over = picked.filter((a) => num(e.sel[a.id].amt) > num(a.valor) || num(e.sel[a.id].amt) <= 0);
      const ren = oaRen(s.pat, [e]), ok = e.name.trim() && picked.length && !over.length;
      const why = !e.name.trim() ? 'Falta el nombre' : !picked.length ? 'Marque al menos un activo' : over.length ? 'Revise los importes' : null;
      const apply = () => { if (!ok) return; const o = Object.assign({}, e, { id: e.id || 'o' + Date.now() }); this.setState({ opts: (s.opts || []).filter((x) => x.id !== o.id).concat(o), oaEdit: null }); this.toast('Optimización «' + o.name + '» aplicada al plan.'); };
      const pct = (a) => { const r = taxRate(a); return r === 0 ? h('span', { className: 'r2-muted' }, a.grupo === 'liq' ? '0 %' : 'Traspaso · 0 %') : h('span', null, pc1(r * 100)); };
      return h('div', { className: 'r2-main ap-in', key: 'oa-edit' },
        h('div', null, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('arrow-left', 14), onClick: () => this.setState({ oaEdit: null }) }, 'Optimizaciones')),
        this.head(e.name.trim() || 'Nueva optimización', 'Marque los activos que se reasignan y elija el perfil de riesgo. El plan, a la derecha, se actualiza mientras edita.'),
        h('section', { className: 'r4-sec' }, h('div', { className: 'r4-form' }, C('Input', { label: 'Nombre de la optimización', value: e.name, error: e.name.trim() ? undefined : 'Escriba un nombre.', onChange: (x) => setE({ name: x.target.value }) }))),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Patrimonio a optimizar'), h('p', null, 'Al marcar un activo se reasigna su valor completo; puede reducir el importe. Los fondos se mueven por traspaso y no pagan impuestos.'),
          this.pickTable({ assets, grouped: true, sel: e.sel, toggle: (a) => setSel(a, { on: !on(a) }), toggleAll: (x) => setE({ sel: Object.assign({}, e.sel, ...assets.map((a) => ({ [a.id]: Object.assign({ amt: num(a.valor) }, e.sel[a.id], { on: x }) }))) }), onRow: (a) => setSel(a, { on: !on(a) }),
            cols: [{ h: 'Valor', kind: 'monetary', cell: (a) => h('span', { className: 'r2-amount' }, eur(num(a.valor))) },
              { h: 'Importe a optimizar', stop: true, cell: (a, x) => x ? C('Input', { size: 'sm', value: fmt(amtOf(a)), suffix: '€', inputMode: 'decimal', 'aria-label': 'Importe a optimizar de ' + a.nombre, error: (num(e.sel[a.id].amt) > num(a.valor)) ? 'Supera el valor.' : undefined, onChange: (ev) => setSel(a, { amt: ev.target.value }) }) : h('span', { className: 'r2-muted' }, '—') },
              { h: 'Coste fiscal', cell: (a) => pct(a) }] })),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Perfil de riesgo'), h('p', null, 'La parte optimizada se reparte según este perfil. Cuanto más dinámico, más rentabilidad esperada y más variación.'),
          C('ChoiceCardGroup', { label: 'Perfil de riesgo', name: 'perfil', columns: 4, value: e.perfil, onChange: (x) => setE({ perfil: x }), options: PERFILES.map(([k, l, r]) => ({ value: k, title: l, help: 'Rentabilidad esperada ' + r.toFixed(2).replace('.', ',') + ' %' })) })),
        e.id ? h('div', null, C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', iconStart: I('trash-2', 16), onClick: () => { this.setState({ opts: (s.opts || []).filter((x) => x.id !== e.id), oaEdit: null }); this.toast('Optimización eliminada.'); } }, 'Eliminar optimización')) : null,
        this.flowBar([['A optimizar', A(total)], ['Impuestos del cambio', A(Math.round(tax))]], why,
          C('Button', { variant: 'ghost', onClick: () => this.setState({ oaEdit: null }) }, 'Cancelar'),
          C('Button', { variant: 'primary', disabled: !ok, onClick: apply }, e.id ? 'Guardar cambios' : 'Aplicar al plan')));
    }
    /* ---------- 3.12 Generación de liquidez: the need, then the assets by tax cost (automatic or manual); the plan shows coverage ---------- */
    glPage312() {
      const s = this.state, v = this.compute(), glp = s.glp || { sel: {} }, sel = glp.sel || {};
      if (!s.glEdit) return (s.glPlans || []).length ? this.glListView(v) : this.glNeedView(v);
      const g = glAlloc(s.pat, glp, v.net0), years = v.net0.map((x, i) => ({ y: YEAR0 + 1 + i, need: x < 0 ? -x : 0, left: g.left[i] })), dy = years.filter((r) => r.need > 0);
      const assets = s.pat.filter(GL_OK).sort((x, y) => taxRate(x) - taxRate(y)), on = (a) => !!(sel[a.id] && sel[a.id].on);
      const base = { mode: 'auto', year: String(dy.length ? dy[0].y : YEAR0 + 6), part: false, amt: '' };
      const setG = (p) => this.setState((st) => ({ glp: Object.assign({ sel: {} }, st.glp, p), glDirty: true, lastCause: 'Con el plan de desinversión en edición' }));
      const setA = (a, p) => setG({ sel: Object.assign({}, sel, { [a.id]: Object.assign({ on: true }, base, sel[a.id], p) }) });
      const order = assets.filter((a) => on(a) && sel[a.id].mode !== 'manual');
      const yOpts = dy.map((r) => ({ value: String(r.y), label: r.y + ' · déficit' })).concat(years.filter((r) => !r.need).map((r) => ({ value: String(r.y), label: String(r.y) })));
      const used = (a) => g.used[a.id] || { gross: 0, tax: 0, net: 0, years: [] };
      const totG = Object.keys(g.used).reduce((t, k) => t + g.used[k].gross, 0), totT = Object.keys(g.used).reduce((t, k) => t + g.used[k].tax, 0);
      const pctCov = g.needT ? Math.round(g.covered / g.needT * 100) : 100;
      const stat = (rows) => h('dl', { className: 'r4-stats r4-stats--page r4-stats--4' }, rows.map(([l, x], i) => h('div', { key: i, className: 'r4-stat' }, h('dt', null, l), h('dd', null, x))));
      const row = (l, ctl) => h('div', { className: 'r4-glcfg__row' }, h('span', { className: 'r4-glcfg__l' }, l), ctl);
      const detail = (a) => { const c = sel[a.id] || {};
        return h('div', { key: 'cfg', className: 'r4-glcfg' },
          row('Cómo se usa', C('SegmentedControl', { className: 'r4-seg-quiet r4-seg-fill', value: c.mode || 'auto', onChange: (x) => setA(a, { mode: x }), options: [{ value: 'auto', label: 'Automático' }, { value: 'manual', label: 'Manual' }] })),
          c.mode === 'manual' ? row('Año de la venta', C('Select', { size: 'sm', value: c.year, options: yOpts, onChange: (x) => setA(a, { year: x }) })) : h('p', { className: 'r2-hint' }, 'Se vende cuando aparece una necesidad, después de los activos con menos coste fiscal.'),
          row('Importe a desinvertir', C('SegmentedControl', { className: 'r4-seg-quiet r4-seg-fill', value: c.part ? 'part' : 'all', onChange: (x) => setA(a, { part: x === 'part', amt: c.amt || String(Math.round(num(a.valor) / 2)) }), options: [{ value: 'all', label: 'Todo el activo' }, { value: 'part', label: 'Una parte' }] })),
          c.part ? row('Importe', C('Input', { size: 'sm', value: c.amt ? fmt(num(c.amt)) : '', suffix: '€', inputMode: 'decimal', error: num(c.amt) > num(a.valor) ? 'Supera el valor del activo.' : undefined, onChange: (x) => setA(a, { amt: x.target.value }) })) : null,
          row('Perfil de reinversión', C('Select', { size: 'sm', value: c.reinv || 'mantener', options: [{ value: 'mantener', label: 'Mantener el perfil' }].concat(PERFILES.map(([k, l]) => ({ value: k, label: l }))), onChange: (x) => setA(a, { reinv: x }) })),
          h('p', { className: 'r2-hint' }, 'Lo que sobre de la venta, una vez cubierta la necesidad, se reinvierte con este perfil.')); };
      const PL = s.glPlans || [], onP = PL.find((p) => p.id === s.glOn);
      const cancel = () => this.setState({ glp: onP ? JSON.parse(JSON.stringify(onP.glp)) : { sel: {} }, glEdit: null, glOpen: null });
      const name = (s.glName || '').trim() || 'Plan de desinversión';
      const save = () => { const id = s.glEdit === 'new' ? 'gp' + Date.now() : s.glEdit, p = { id, name, glp: JSON.parse(JSON.stringify(s.glp || { sel: {} })) };
        this.setState({ glPlans: PL.some((x) => x.id === id) ? PL.map((x) => x.id === id ? p : x) : PL.concat(p), glOn: id, glEdit: null, glOpen: null }); this.toast('Plan «' + name + '» guardado y activo en el plan.'); };
      const del = () => { const L = PL.filter((x) => x.id !== s.glEdit); this.setState({ glPlans: L, glOn: s.glOn === s.glEdit ? null : s.glOn, glp: s.glOn === s.glEdit ? { sel: {} } : (onP ? onP.glp : { sel: {} }), glEdit: null, glOpen: null }); this.toast('Plan eliminado.'); };
      return h('div', { className: 'r2-main ap-in', key: 'gl312' },
        h('div', null, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('arrow-left', 14), onClick: cancel }, 'Generación de liquidez')),
        this.head(s.glEdit === 'new' ? 'Nuevo plan de desinversión' : 'Editar «' + name + '»', 'Qué activos se venden para cubrir los años en que los ingresos y el ahorro no alcanzan. El plan, a la derecha, muestra la cobertura año a año.'),
        h('section', { className: 'r4-sec' }, h('div', { className: 'r4-form' }, C('Input', { label: 'Nombre del plan', value: s.glName || '', onChange: (e) => this.setState({ glName: e.target.value }) }))),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Activos para desinvertir'), h('p', null, 'Ordenados por coste fiscal: el plan usa primero los que menos impuestos pagan. Al marcar un activo se abre para configurarlo.'),
          dy.length ? C('Callout', { className: 'r4-needcall', title: 'Faltan ' + eur(Math.round(g.needT)) + ' en ' + dy.length + (dy.length === 1 ? ' año' : ' años') + ' (' + dy[0].y + (dy.length > 1 ? '–' + dy[dy.length - 1].y : '') + ')' }, 'Los ingresos y el ahorro no alcanzan esos años. El plan, a la derecha, muestra cuánto cubre cada venta.') : null,
          this.pickTable({ assets, grouped: false, sel, open: s.glOpen, detail,
            toggle: (a) => { const was = on(a); setA(a, { on: !was }); this.setState({ glOpen: was ? null : a.id }); },
            toggleAll: (x) => setG({ sel: Object.assign({}, sel, ...assets.map((a) => ({ [a.id]: Object.assign({}, base, sel[a.id], { on: x }) }))) }),
            onRow: (a) => { if (on(a)) { if (s.glOpen === a.id) this.closeKey(a.id + '-cfg', () => this.setState({ glOpen: null })); else this.setState({ glOpen: a.id }); } else { setA(a, { on: true }); this.setState({ glOpen: a.id }); } },
            cols: [{ h: 'Valor hoy', kind: 'monetary', cell: (a) => h('span', { className: 'r2-amount' }, eur(num(a.valor))) },
              { h: 'Uso', cell: (a, x) => !x ? h('span', { className: 'r2-muted' }, '—') : sel[a.id].mode === 'manual' ? C('Tag', null, 'Manual · ' + sel[a.id].year) : C('Tag', null, 'Automático · ' + (order.indexOf(a) + 1) + 'º') },
              { h: 'Coste fiscal', cell: (a) => taxRate(a) === 0 ? h('span', { className: 'r2-muted' }, '0 %') : h('span', null, pc1(taxRate(a) * 100)) },
              { h: 'Aporta (neto)', kind: 'monetary', cell: (a, x) => x ? h('span', { className: 'r2-amount' }, A(Math.round(used(a).net))) : h('span', { className: 'r2-muted' }, '—') }] })),
        this.flowBar([['A vender', A(Math.round(totG))], ['Impuestos', A(Math.round(totT))], ['Neto', A(Math.round(totG - totT))]], this.glActive() ? null : 'Marque al menos un activo',
          C('Button', { variant: 'ghost', onClick: cancel }, 'Cancelar'), C('Button', { variant: 'primary', disabled: !this.glActive(), onClick: save }, 'Guardar plan')),
        s.glEdit && s.glEdit !== 'new' ? h('div', null, C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', iconStart: I('trash-2', 16), onClick: del }, 'Eliminar este plan')) : null);
    }
    /* ---------- 3.12 AI questions: three placements (estado.chat A | B | C); answers are the plan's voice, not an assistant ---------- */
    chatQs(v) {
      const all = s => s;
      const dyn = oaRen(this.state.pat, [{ perfil: 'din', sel: Object.assign({}, ...this.state.pat.filter(OA_OK).map((a) => ({ [a.id]: { on: true, amt: num(a.valor) } }))) }]);
      return [
        v.def ? { k: 'def', q: '¿Por qué hay déficit en ' + v.worstYear + '?', paras: ['Entre ' + v.worstYear + ' y ' + (v.worstYear + v.def - 1) + ' los gastos superan a los ingresos: a los 65 años la nómina del titular pasa a ser una pensión más baja, y el colchón de ' + eur(v.colchon) + ' no cubre la diferencia.', 'El peor año es ' + v.worstYear + ', con ' + eur(v.worst) + '. Después, los ingresos de alquiler y la pensión de la pareja vuelven a cubrir los gastos.'], src: 'Ingresos, Gastos y colchón de liquidez · escenario medio', acts: [['Ver Liquidez', () => this.setState({ chatAsk: null, chatOpen: false, iaTab: 'liq' })], ['Generación de liquidez', () => { this.setState({ chatAsk: null, chatOpen: false }); this.go('gl'); }]] } : null,
        { k: 'ren', q: '¿Qué haría falta para llegar al 4,6 % de rentabilidad?', paras: ['Hoy la cartera rinde un ' + pc1(v.ren) + ' en el escenario medio; el plan necesita un 4,6 %.', 'Si toda la cartera financiera y los inmuebles de inversión pasaran a un perfil Dinámico, la rentabilidad esperada llegaría al ' + pc1(dyn) + ', después de pagar los impuestos del cambio. ' + (dyn >= 4.55 ? 'Eso cubriría lo necesario.' : 'Aun así faltarían ' + (4.6 - dyn).toFixed(1).replace('.', ',') + ' puntos: habría que combinarlo con un legado objetivo más bajo.')], src: 'Patrimonio y perfiles de riesgo · escenario medio', acts: [['Ver Rentabilidad', () => this.setState({ chatAsk: null, chatOpen: false, iaTab: 'ren' })], ['Asset allocation', () => { this.setState({ chatAsk: null, chatOpen: false }); this.go('aa'); }]] },
        { k: 'leg', q: '¿Cuánto podría bajar el patrimonio sin perder el legado?', paras: ['En el escenario pesimista el legado llega a ' + m1(v.sc.pes) + ' frente a un objetivo de ' + mGoal(v.goal) + '.', 'El margen es de ' + m1(Math.max(0, v.sc.pes - v.goal)) + ' en el peor caso: hasta esa cifra, un gasto extraordinario o una caída de mercado no comprometen el objetivo.'], src: 'Legado objetivo y escenarios', acts: [['Ver Patrimonio y legado', () => this.setState({ chatAsk: null, chatOpen: false, iaTab: 'leg' })]] }
      ].filter(Boolean);
    }
    chatField(kind) {
      const s = this.state, v = this.compute(), qs = this.chatQs(v);
      const ask = (k) => this.setState({ chatAsk: k, chatOpen: true });
      const field = h('div', { className: 'r4-ask__field' }, h('span', { className: 'r4-ttab__ic is-ai', 'aria-hidden': true }, I('sparkles', 14)),
        h('input', { className: 'r4-ask__input', placeholder: kind === 'C' ? 'Preguntar sobre el plan' : kind === 'B' ? 'Pregunte o pida algo sobre el plan' : 'Pregunte sobre este plan', 'aria-label': 'Pregunta sobre el plan', onFocus: kind === 'C' ? () => this.setState({ chatOpen: true }) : undefined }),
        kind === 'C' ? C('Kbd', null, '⌘K') : C('IconButton', { variant: 'primary', size: 'sm', title: undefined, label: 'Enviar', onClick: () => ask(qs[0].k) }, I('arrow-up', 16)));
      const chips = h('div', { className: 'r4-ask__chips' }, qs.map((x) => h('button', { key: x.k, type: 'button', className: 'r4-ask__chip', onClick: () => ask(x.k) }, x.q)));
      if (kind === 'A') return h('div', { className: 'r4-ask r4-ask--plan' }, s.chatAsk ? null : chips, field);
      if (kind === 'B') return h('div', { className: 'r4-ask r4-ask--float' }, s.chatAsk ? null : chips, field);
      const ans = s.chatAsk && qs.find((x) => x.k === s.chatAsk);
      return h('div', { className: 'r4-ask r4-ask--top' }, field,
        s.chatOpen ? h('div', { className: 'r4-ask__drop', role: 'dialog', 'aria-label': 'Preguntar sobre el plan' },
          ans ? this.chatAnswer(ans, () => this.setState({ chatAsk: null }), 'Volver a las preguntas') : h(React.Fragment, null, h('p', { className: 'r4-ask__hint' }, 'Preguntas sobre este plan'), qs.map((x) => h('button', { key: x.k, type: 'button', className: 'r4-ask__row', onClick: () => ask(x.k) }, I('sparkles', 14), x.q))),
          h('div', { className: 'r4-ask__dropfoot' }, C('Button', { variant: 'ghost', size: 'sm', onClick: () => this.setState({ chatOpen: false, chatAsk: null }) }, 'Cerrar'))) : null);
    }
    chatAnswer(a, back, backLabel) {
      return h('div', { className: 'r4-ans' },
        back ? h('div', null, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('arrow-left', 14), onClick: back }, backLabel || 'Volver al plan')) : null,
        h('span', { className: 'r4-chgv__eyebrow' }, I('sparkles', 14), 'Respuesta sobre este plan'),
        h('h3', { className: 'r4-ans__q' }, a.q),
        a.paras.map((p, i) => h('p', { key: i, className: 'r4-ans__p' }, p)),
        h('p', { className: 'r4-ans__src' }, I('file-text', 12), 'Basado en: ' + a.src),
        h('div', { className: 'r4-ans__acts' }, a.acts.map(([l, f], i) => C('Button', { key: i, variant: i ? 'ghost' : 'secondary', size: 'sm', iconEnd: I('arrow-right', 14), onClick: f }, l))));
    }
    /* ---------- 3.12 «Preguntar y simular»: a panel on the left that changes things; changes live in a simulation until applied ---------- */
    agentScripts() {
      const s = this.state, b8 = s.pat.find((a) => a.id === 'b8') || { valor: 620000 }, tax = Math.round(num(b8.valor) * taxRate(b8));
      return {
        sell: { prompt: '¿Qué pasa si vendo la casa de Sotogrande en 2030?', reply: 'He creado una simulación con la venta. Paga unos ' + eur(tax) + ' de impuestos y el neto cubre los años con déficit; el legado baja en lo que se paga de impuestos.', card: { icon: 'building-2', title: 'Venta de Casa Sotogrande', rows: ['2030 · ' + eur(num(b8.valor)), 'Impuestos ' + eur(tax)] }, go: 'patrimonio', tab: 'liq' },
        beca: { prompt: 'Mi hija tendrá beca: quita la universidad de los gastos', reply: 'Listo, en la simulación ya no hay gastos de universidad de 2027 a 2030. El ahorro de esos años hace crecer el legado; la liquidez de 2032 a 2034 no cambia.', card: { icon: 'graduation-cap', title: 'Sin gastos de universidad', rows: ['2027–2030 · −12.000 € al año', 'Gastos'] }, go: null, tab: 'leg' },
        import: { file: 'ingresos_2026.xlsx', prompt: 'Actualiza los ingresos con esta hoja', reply: 'He leído 5 filas: 3 ingresos nuevos y 1 que cambia; 1 ya estaba igual. Los he añadido a la simulación; revíselos en Ingresos.', card: { icon: 'file-spreadsheet', title: 'Ingresos importados', rows: ['+ Alquiler piso Chamberí · 1.400 €/mes', '+ Dividendos · 6.000 €/año', '+ Bonus · 8.000 €/año', 'Nómina Titular · 2.600 → 2.750 €/mes'] }, go: 'ingresos', tab: 'liq' },
        why: { prompt: '¿Por qué hay déficit en 2032?', reply: null, go: null, tab: 'liq' },
        ...this.jubScripts()
      };
    }
    runAgent(k) {
      const sc = this.agentScripts()[k], s0 = this.state;
      const act = (log) => (st) => Object.assign(log ? { agentLog: (st.agentLog || []).concat(k) } : {}, { sim: k === 'why' ? st.sim : true, simChanges: k === 'why' ? st.simChanges : Array.from(new Set((st.simChanges || []).concat(k))), iaTab: st.keepTab ? st.iaTab : (sc.tab || st.iaTab), lastCause: 'En la simulación' });
      if (!s0.v312) { this.setState(act(true)); if (sc.go) this.go(sc.go); return; }
      /* 3.14: «Trabajando» — the AI thinks first (status line in the bar, the frame loops), then the change lands */
      const t0 = Date.now();
      this.setState((st) => ({ agentLog: (st.agentLog || []).concat(k), thinking: k, dockOpen: true }));
      if (s0.thinkHold) return;
      clearTimeout(this._think);
      this._think = setTimeout(() => { this.setState((st) => Object.assign(act(false)(st), { thinking: null, thought: Object.assign({}, st.thought, { [k]: Math.max(1, Math.round((Date.now() - t0) / 1000)) }) })); if (sc.go) this.go(sc.go); }, reduced() ? 300 : 2400);
    }
    agentPanel() {
      const s = this.state, S = this.agentScripts(), log = s.agentLog || [], v = this.compute();
      const why = this.chatQs(v).find((x) => x.k === 'def');
      const undo = (k) => this.setState((st) => ({ simChanges: (st.simChanges || []).filter((x) => x !== k) }));
      const live = (k) => (s.simChanges || []).indexOf(k) >= 0, done = (k) => (s.applied || []).indexOf(k) >= 0;
      return h('aside', { className: 'r4-agent', 'aria-label': 'Preguntar y simular' },
        h('div', { className: 'r4-agent__head' }, h('span', { className: 'r4-ttab__ic is-ai', 'aria-hidden': true }, I('sparkles', 14)), h('h2', null, 'Preguntar y simular'), h('span', { className: 'r2-spacer' }),
          C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Cerrar el panel', onClick: () => this.setState({ agent: false }) }, I('panel-left-close'))),
        h('div', { className: 'r4-agent__body' },
          !log.length ? h('div', { className: 'r4-agent__intro' },
            h('p', null, 'Pida un cambio, haga una pregunta o suba una hoja. Los cambios se hacen en una ', h('strong', null, 'simulación'), ': la página y el plan los muestran, pero no se guardan hasta que los aplique.'),
            h('div', { className: 'r4-ask__chips r4-ask__chips--col' }, ['sell', 'beca', 'why'].map((k) => h('button', { key: k, type: 'button', className: 'r4-ask__chip', onClick: () => this.runAgent(k) }, S[k].prompt))),
            h('button', { type: 'button', className: 'r4-agent__drop', onClick: () => this.runAgent('import') }, I('file-spreadsheet', 20), h('span', null, h('strong', null, 'Suba una hoja de cálculo'), h('small', null, 'Ingresos, gastos o patrimonio: se comparan con lo que ya hay.')))) : null,
          log.map((k, i) => { const sc = S[k];
            return h('div', { key: k + i, className: 'r4-turn' },
              h('div', { className: 'r4-turn__you' }, sc.file ? h('span', { className: 'r4-file' }, I('file-spreadsheet', 14), sc.file) : null, h('span', null, sc.prompt)),
              h('div', { className: 'r4-turn__ai' },
                k === 'why' && why ? h(React.Fragment, null, why.paras.map((p, j) => h('p', { key: j }, p)), h('p', { className: 'r4-ans__src' }, I('file-text', 12), 'Basado en: ' + why.src)) : h('p', null, sc.reply),
                sc.card ? h('div', { className: 'r4-actcard' + (live(k) ? '' : done(k) ? ' is-done' : ' is-off') },
                  h('span', { className: 'r4-actcard__ic' }, I(sc.card.icon, 16)),
                  h('div', { className: 'r4-actcard__b' }, h('strong', null, sc.card.title), sc.card.rows.map((r, j) => h('small', { key: j }, r)),
                    h('span', { className: 'r4-actcard__st' }, live(k) ? 'En la simulación' : done(k) ? 'Aplicado al plan' : 'Deshecho')),
                  live(k) ? C('Tooltip', { content: 'Deshacer este cambio', placement: 'top' }, C('IconButton', { variant: 'ghost', size: 'sm', className: 'r4-danger', label: 'Deshacer este cambio', title: undefined, onClick: () => undo(k) }, I('undo-2', 16))) : null) : null)); })),
        h('div', { className: 'r4-agent__foot' },
          h('div', { className: 'r4-ask__field' },
            C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Adjuntar una hoja de cálculo', onClick: () => this.runAgent('import') }, I('paperclip', 16)),
            h('input', { className: 'r4-ask__input', placeholder: '¿Qué pasa si…?', 'aria-label': 'Pida un cambio o haga una pregunta' }),
            C('IconButton', { variant: 'primary', size: 'sm', title: undefined, label: 'Enviar', onClick: () => this.runAgent((s.simChanges || []).indexOf('sell') < 0 ? 'sell' : 'beca') }, I('arrow-up', 16)))));
    }
    /* ---------- 3.12 «Preguntar» docked at the bottom of the page: one field, a «Simulación» switch, the conversation grows upward ---------- */
    agentTurns() {
      const s = this.state, S = this.agentScripts(), log = s.agentLog || [], v = this.compute(), why = this.chatQs(v).find((x) => x.k === 'def');
      const undo = (k) => this.setState((st) => ({ simChanges: (st.simChanges || []).filter((x) => x !== k) }));
      const live = (k) => (s.simChanges || []).indexOf(k) >= 0, done = (k) => (s.applied || []).indexOf(k) >= 0;
      return log.map((k, i) => { const sc = S[k];
        if (s.v312 && s.thinking === k && i === log.length - 1) return h('div', { key: k + i, className: 'r4-turn' },
          h('div', { className: 'r4-turn__you' }, sc.file ? h('span', { className: 'r4-file' }, I('file-spreadsheet', 14), sc.file) : null, h('span', null, sc.prompt)),
          h('div', { className: 'r4-think', role: 'status', 'aria-live': 'polite' }, h('span', { className: 'r4-think__ic', 'aria-hidden': true }, I('sparkles', 14)), h('span', { className: 'r4-think__t' }, 'Pensando…'), h('small', null, k === 'why' ? 'Leyendo ingresos y gastos' : 'Leyendo el plan y preparando la simulación')));
        return h('div', { key: k + i, className: 'r4-turn' },
          h('div', { className: 'r4-turn__you' }, sc.file ? h('span', { className: 'r4-file' }, I('file-spreadsheet', 14), sc.file) : null, h('span', null, sc.prompt)),
          s.v312 && s.thought && s.thought[k] ? h('p', { className: 'r4-think r4-think--done' }, I('sparkles', 12), 'Pensó ' + s.thought[k] + ' s') : null,
          h('div', { className: 'r4-turn__ai' },
            k === 'why' && why ? h(React.Fragment, null, why.paras.map((p, j) => h('p', { key: j }, p)), h('p', { className: 'r4-ans__src' }, I('file-text', 12), 'Basado en: ' + why.src)) : h('p', null, sc.reply),
            sc.card ? h('div', { className: 'r4-actcard' + (live(k) ? '' : done(k) ? ' is-done' : ' is-off') },
              h('span', { className: 'r4-actcard__ic' }, I(sc.card.icon, 16)),
              h('div', { className: 'r4-actcard__b' }, h('strong', null, sc.card.title), sc.card.rows.map((r, j) => h('small', { key: j }, r)),
                h('span', { className: 'r4-actcard__st' + (done(k) ? ' is-done' : '') }, done(k) && !live(k) ? I('circle-check', 14) : null, live(k) ? (s.sim ? 'En la simulación' : 'En la simulación (en pausa)') : done(k) ? 'Aplicado al plan' : 'Deshecho')),
              live(k) ? C('Tooltip', { content: 'Deshacer este cambio', placement: 'top' }, C('IconButton', { variant: 'ghost', size: 'sm', className: 'r4-danger', label: 'Deshacer este cambio', title: undefined, onClick: () => undo(k) }, I('undo-2', 16))) : null) : null)); });
    }
    agentDock() {
      const fb = this._fb; this._fb = null;
      const s = this.state, S = this.agentScripts(), log = s.agentLog || [], n = (s.simChanges || []).length, open = log.length && s.dockOpen !== false;
      const run = (k) => { this.runAgent(k); this.setState({ dockOpen: true }); };
      const inFlow = (s.screen === 'aa' && !!s.oaEdit) || (s.screen === 'gl' && !!s.glEdit);
      const pill = s.applyPill ? h('div', { key: s.applyPill, className: 'r4-apill', role: 'status', 'aria-live': 'polite' },
        h('span', { className: 'r4-apill__sweep', 'aria-hidden': true }),
        h('span', { className: 'r4-apill__ic', 'aria-hidden': true }, h('span', { className: 'r4-apill__spin' }), h('span', { className: 'r4-apill__ok' }, I('check', 18))),
        h('span', { className: 'r4-apill__txt' }, h('span', { className: 'r4-apill__a' }, h('strong', null, 'Aplicando la simulación…'), h('small', null, 'El plan recalcula con los cambios')),
          h('span', { className: 'r4-apill__b' }, h('strong', null, 'Cambios aplicados al plan'), h('small', null, 'El plan real ya los incluye')))) : null;
      return h('div', { className: 'r4-dockwrap' + (s.sim || n ? ' has-sim' : '') + (open ? ' is-open' : '') }, pill, open ? null : fb, h('div', { className: 'r4-dock' + (s.sim ? ' is-sim' : '') + (open ? ' is-open' : '') + (s.sim || n ? ' has-sim' : '') + (inFlow ? ' in-flow' : ''), role: 'region', 'aria-label': 'Preguntar' },
        open ? h('div', { className: 'r4-dock__log' },
          h('div', { className: 'r4-dock__loghead' }, h('span', { className: 'r4-ttab__ic is-ai r4-ttab__ic--sm', 'aria-hidden': true }, I('sparkles', 12)), h('strong', null, 'Preguntar'), h('span', { className: 'r2-spacer' }),
            C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Plegar la conversación', onClick: () => this.setState({ dockOpen: false }) }, I('chevron-down', 16))),
          h('div', { className: 'r4-dock__turns' }, this.agentTurns())) : null,
        !open && log.length ? h('button', { type: 'button', className: 'r4-dock__reopen', onClick: () => this.setState({ dockOpen: true }) }, I('chevron-up', 14), 'Ver la conversación (' + log.length + ')') : null,
        !log.length && !inFlow ? h('div', { className: 'r4-ask__chips r4-dock__chips' }, ['sell', 'beca', 'why'].map((k) => h('button', { key: k, type: 'button', className: 'r4-ask__chip', onClick: () => run(k) }, S[k].prompt))) : null,
        s.sim || n || (s.thinking && !open) ? h('div', { className: 'r4-dock__sim' + (s.sim || s.thinking ? '' : ' is-paused') + (s.thinking && !open ? ' is-thinking' : '') }, h('span', { className: 'r4-simpill__dot', 'aria-hidden': true }),
          s.thinking && !open ? h('span', null, h('strong', null, 'Pensando…'), ' · la IA prepara la respuesta') : h('span', null, h('strong', null, s.sim ? 'Simulación' : 'Plan real'), ' · ' + (s.sim ? (n ? n + (n === 1 ? ' cambio sin aplicar' : ' cambios sin aplicar') : 'los cambios no se guardan en el plan') : n + (n === 1 ? ' cambio simulado en pausa' : ' cambios simulados en pausa'))),
          n ? C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger' + (s.demoPress === 'discard' ? ' is-pressing' : ''), onClick: () => { this.setState({ sim: false, simChanges: [] }); this.toast('Simulación descartada.'); } }, 'Descartar') : null,
          h('span', { className: 'r2-spacer' }),
          n ? C('Button', { variant: 'primary', size: 'sm', className: s.demoPress === 'apply' ? 'is-pressing' : undefined, onClick: () => { this.applySim(); } }, 'Aplicar al plan') : null) : null,
        h('div', { className: 'r4-ask__field r4-dock__field' },
          h('label', { className: 'r4-dock__switch' }, C('Toggle', { active: !!s.sim, 'aria-label': 'Simulación', onChange: (x) => this.setState({ sim: typeof x === 'boolean' ? x : !s.sim }) }), h('span', null, 'Simulación')),
          h('span', { className: 'r4-dock__sep', 'aria-hidden': true }),
          h('input', { className: 'r4-ask__input', placeholder: s.sim ? '¿Qué pasa si…?' : 'Pregunte o pida un cambio…', 'aria-label': 'Pregunte o pida un cambio' }),
          C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Adjuntar una hoja de cálculo', onClick: () => run('import') }, I('paperclip', 16)),
          C('IconButton', { variant: 'primary', size: 'sm', title: undefined, label: 'Enviar', onClick: () => run((s.simChanges || []).indexOf('sell') < 0 ? 'sell' : 'beca') }, I('arrow-up', 16)))));
    }
    simPill() {
      const s = this.state, n = (s.simChanges || []).length;
      if (!s.sim) return C('Button', { variant: 'ghost', size: 'sm', className: 'r4-simbtn' + (s.agent ? ' is-on' : ''), iconStart: h('span', { className: 'r4-ttab__ic is-ai r4-ttab__ic--sm', 'aria-hidden': true }, I('sparkles', 12)), onClick: () => this.setState({ agent: !s.agent }) }, 'Preguntar y simular');
      return h('span', { className: 'r4-simpill', role: 'status' }, h('span', { className: 'r4-simpill__dot', 'aria-hidden': true }), h('strong', null, 'Simulación'), h('span', null, n + (n === 1 ? ' cambio' : ' cambios') + ' sin aplicar'),
        C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', onClick: () => { this.setState({ sim: false, simChanges: [] }); this.toast('Simulación descartada.'); } }, 'Descartar'),
        C('Button', { variant: 'primary', size: 'sm', disabled: !n, onClick: () => { this.applySim(); } }, 'Aplicar al plan'));
    }
    /* 3.12: what changed after a recalculation, before → after */
    chgLines(diff, v) {
      const o = diff.old, out = [], sgn = (x) => (x > 0 ? '+' : '−') + fmt(Math.abs(x)) + ' €';
      const m2 = (n) => (n / 1e6).toFixed(2).replace('.', ',') + ' M €';
      (diff.secs || []).forEach((k) => {
        if (k === 'leg') { const d = Math.round((v.sc.med - o.sc.med) / 1000) * 1000; out.push({ k: 'leg', tab: 'leg', t: 'Legado · escenario medio', from: m2(o.sc.med), to: m2(v.sc.med), d: d ? sgn(d) : null, good: d >= 0, why: d >= 0 ? 'El patrimonio crece más deprisa y llega más alto a los ' + v.edad + ' años.' : 'El patrimonio llega más bajo a los ' + v.edad + ' años.' }); }
        if (k === 'liq') { const f = (x) => x.def ? 'déficit en ' + x.def + (x.def === 1 ? ' año' : ' años') : 'sin déficit'; out.push({ k: 'liq', tab: 'liq', t: 'Liquidez', from: f(o), to: f(v), d: v.def < o.def ? (o.def - v.def) + ' años menos con déficit' : v.def > o.def ? (v.def - o.def) + ' años más con déficit' : null, good: v.def <= o.def, why: v.def ? 'El peor año sigue siendo ' + v.worstYear + ', con ' + eur(v.worst) + '.' : 'Los ingresos y el ahorro cubren todos los años.' }); }
        if (k === 'opt') { const d = v.ren - o.ren; out.push({ k: 'opt', tab: 'ren', t: 'Rentabilidad esperada', from: pc1(o.ren), to: pc1(v.ren), d: (d > 0 ? '+' : '−') + Math.abs(d).toFixed(1).replace('.', ',') + ' puntos', good: d >= 0, why: 'La necesaria es 4,6 %: ' + (v.ren >= 4.55 ? 'queda cubierta.' : 'faltan ' + (4.6 - v.ren).toFixed(1).replace('.', ',') + ' puntos.') }); }
      });
      return out;
    }
    changesView(c, u, diff) {
      const { v, tools } = c, { legBars, liqBars } = u, s = this.state, lines = this.chgLines(diff, v), o = diff.old;
      const close = () => this.setState({ chgOpen: false });
      const done = () => { this._diff = null; this.setState({ recalc: null, chgOpen: false, diffClosed: true, pop: null }, () => this.setState({ diffClosed: false })); };
      const go = (tab) => this.setState((st) => ({ chgOpen: false, iaTab: tab, seen: Array.from(new Set((st.seen || []).concat(tab))), seenAt: Object.assign({}, st.seenAt, { [tab]: Date.now() }) }));
      const NAME = { leg: s.v312 ? 'Patrimonio y legado' : 'Legado', liq: 'Liquidez', ren: 'Rentabilidad' };
      const cmp = (from, to, fmtv) => { const mx = Math.max(from, to) || 1; return h('div', { className: 'r4-cmp' }, [['Antes', from, 'before'], ['Ahora', to, 'after']].map(([lab, val, tone]) => h('div', { key: lab, className: 'r4-cmp__row' },
          h('div', { className: 'r4-cmp__h' }, h('span', null, lab), h('strong', null, fmtv(val))),
          h('div', { className: 'r4-cmp__track' }, h('i', { className: 'r4-cmp__fill r4-cmp__fill--' + tone, style: { width: Math.max(2, val / mx * 100) + '%' } }))))); };
      const vis = (l) => l.k === 'leg' ? h('div', { className: 'r4-chgv__meters' }, legBars(110), cmp(o.sc.med, v.sc.med, (n) => (n / 1e6).toFixed(2).replace('.', ',') + ' M €'))
        : l.k === 'liq' ? liqBars(100)
        : h(Ruler2, { required: 4.6, actual: v.ren });
      return h(React.Fragment, null,
        h('div', { className: 'r3-plan__head' }, h('h2', null, 'El plan'), h('span', { className: 'r2-spacer' }), tools),
        h('div', { className: 'r3-plan__body r4-chgv', key: 'chg' },
          h('div', { className: 'r4-chgv__top' }, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('arrow-left', 14), onClick: close }, 'Volver al plan')),
          h('div', { className: 'r4-chgv__head' }, h('span', { className: 'r4-chgv__eyebrow' }, I('sparkles', 14), 'Plan recalculado'), h('h3', null, 'Qué ha cambiado'), h('p', null, (diff.cause || 'Con sus últimos datos') + ', cambian ' + lines.length + (lines.length === 1 ? ' cosa.' : ' cosas.'))),
          lines.map((l, i) => h('section', { key: l.k, className: 'r4-chgv__card', style: { '--i': i } },
            h('div', { className: 'r4-chgv__row' }, h('span', { className: 'r4-chgv__t' }, l.t), l.d ? h('span', { className: 'r4-chg__d r4-st--' + (l.good ? 'success' : 'warning') }, l.d) : null),
            h('div', { className: 'r4-chgv__fig' }, h('span', { className: 'r4-was' }, l.from), I('arrow-right', 16), h('strong', null, l.to)),
            vis(l),
            h('p', { className: 'r4-chgv__why' }, l.why),
            h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => go(l.tab) }, 'Ver ' + NAME[l.tab], I('arrow-right', 14)))),
          h('div', { className: 'r2-actions r4-chgv__end' }, h('span', { className: 'r2-spacer' }), C('Button', { variant: 'secondary', size: 'sm', onClick: done }, 'Entendido'))));
    }
    /* 3.11: the amount lens lives in the Importe header, the same way as grouping: «Importe · total ▾» */
    impHead() {
      const s = this.state, fam = !!s.famView, so = s.sort, on = !so || so.key === 'valor', dir = so ? so.dir : 'desc';
      const O = [['total', 'Valor total', 'El valor completo de cada activo.'], ['familia', 'Parte de la familia', 'Solo el porcentaje de tenencia de la familia: lo que tienen terceros no cuenta.']];
      return h('span', { className: 'r4-thx r4-thx--end' },
        h('button', { type: 'button', className: 'r4-thx__sort' + (on ? ' is-on' : ''), 'aria-label': 'Ordenar por importe', onClick: () => this.setState({ sort: { key: 'valor', dir: on && dir === 'desc' ? 'asc' : 'desc' } }) }, 'Importe', on ? I(dir === 'asc' ? 'arrow-up' : 'arrow-down', 12) : null),
        h('span', { className: 'r4-thx__sep', 'aria-hidden': true }, '·'),
        C('Popover', { align: 'end', width: '300px', title: 'Importe', open: s.pop === 'imp', onOpenChange: (o) => this.setState({ pop: o ? 'imp' : null }),
          trigger: h('button', { type: 'button', className: 'r4-thx__grp', 'aria-haspopup': 'dialog' }, h('span', { key: fam ? 'f' : 't', className: 'r4-swapin' }, fam ? 'familia' : 'total'), I('chevron-down', 12)) },
          h('div', { className: 'r4-menu r4-menu--flat', role: 'menu' }, O.map(([k, l, d]) => h('button', { key: k, type: 'button', role: 'menuitemradio', 'aria-checked': (k === 'familia') === fam, className: 'r4-menu__item r4-menu__item--two' + ((k === 'familia') === fam ? ' is-on' : ''), onClick: () => this.setState({ famView: k === 'familia', pop: null }) }, h('span', null, h('span', { className: 'r4-menu__t' }, l), h('small', null, d)), (k === 'familia') === fam ? I('check', 14) : null)))));
    }
    /* 3.10: grouping lives in the Activo header: «Activo» sorts, «por Tipo ▾» opens the grouping menu */
    groupHead() {
      const s = this.state, grp = s.pgroup || 'tipo', so = s.sort, on = so && so.key === 'nombre';
      const G = [['tipo', 'Tipo'], ['titular', 'Titular'], ['entidad', 'Entidad'], ['ninguno', 'Sin agrupar']];
      const keys = this.groupsOf(grp).map((g) => grp + ':' + g.value);
      return h('span', { className: 'r4-thx' },
        h('button', { type: 'button', className: 'r4-thx__sort' + (on ? ' is-on' : ''), 'aria-label': 'Ordenar por nombre', onClick: () => this.sortBy('nombre') }, 'Activo', on ? I(so.dir === 'asc' ? 'arrow-up' : 'arrow-down', 12) : null),
        h('span', { className: 'r4-thx__sep', 'aria-hidden': true }, '·'),
        C('Popover', { align: 'start', width: '240px', title: 'Agrupar por', open: s.pop === 'grp', onOpenChange: (o) => this.setState({ pop: o ? 'grp' : null }),
          trigger: h('button', { type: 'button', className: 'r4-thx__grp', 'aria-haspopup': 'dialog' }, h('span', { key: grp, className: 'r4-swapin' }, grp === 'ninguno' ? 'sin agrupar' : 'por ' + G.find((x) => x[0] === grp)[1].toLowerCase()), I('chevron-down', 12)) },
          h('div', { className: 'r4-menu r4-menu--flat', role: 'menu' }, G.map(([k, l]) => h('button', { key: k, type: 'button', role: 'menuitemradio', 'aria-checked': k === grp, className: 'r4-menu__item' + (k === grp ? ' is-on' : ''), onClick: () => this.setState({ pgroup: k, gfold: [], pop: null }) }, h('span', null, l), k === grp ? I('check', 14) : null))),
          grp !== 'ninguno' ? h('div', { className: 'r4-thx__fold' }, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('chevrons-up-down', 14), onClick: () => this.setState({ gfold: [], pop: null }) }, 'Expandir todos'), C('Button', { variant: 'ghost', size: 'sm', iconStart: I('chevrons-down-up', 14), onClick: () => this.setState({ gfold: keys, pop: null }) }, 'Plegar todos')) : null));
    }
    /* ---------- 3.8: «Vista» popover (group, sort, fold) shared by Patrimonio and Ingresos ---------- */
    vista(kind) {
      const s = this.state, pat = kind === 'pat', so = s.sort || (pat ? { key: 'valor', dir: 'desc' } : { key: 'importe', dir: 'desc' });
      const SORTS = pat ? [['valor', 'Importe'], ['nombre', 'Nombre'], ['done', 'Por completar']] : [['importe', 'Importe'], ['concepto', 'Nombre'], ['tipo', 'Tipo']];
      const setSort = (k) => this.setState({ sort: { key: k, dir: (k === 'valor' || k === 'importe') ? 'desc' : 'asc' } });
      const grp = s.pgroup || 'tipo', dirty = (pat && grp !== 'tipo') || (s.sort && s.sort.key !== (pat ? 'valor' : 'importe'));
      const row = (label, ctl) => h('div', { className: 'r4-vrow' }, h('span', { className: 'r4-vrow__l' }, label), ctl);
      const keys = pat ? this.groupsOf(grp).map((g) => grp + ':' + g.value) : [];
      return C('Popover', { align: 'end', width: '380px', title: 'Vista', description: 'Se recuerda para usted en esta página.', open: s.pop === 'vista-' + kind, onOpenChange: (o) => this.setState({ pop: o ? 'vista-' + kind : null }),
        trigger: C('Button', { variant: 'secondary', size: 'sm', iconStart: I('sliders-horizontal', 16), className: dirty ? 'r4-vbtn is-dirty' : 'r4-vbtn' }, 'Vista'),
        footer: h('div', { className: 'r2-actions' }, C('Button', { variant: 'ghost', size: 'sm', disabled: !dirty, onClick: () => this.setState({ pgroup: 'tipo', sort: null, gfold: [] }) }, 'Restablecer'), h('span', { className: 'r2-spacer' }), C('Button', { variant: 'primary', size: 'sm', onClick: () => this.setState({ pop: null }) }, 'Listo')) },
        h('div', { className: 'r4-vista' },
          pat ? row('Agrupar por', C('SegmentedControl', { className: 'r4-seg-quiet r4-seg-fill', value: grp, onChange: (v) => this.setState({ pgroup: v, gfold: [] }), options: [{ value: 'tipo', label: 'Tipo' }, { value: 'titular', label: 'Titular' }, { value: 'entidad', label: 'Entidad' }, { value: 'ninguno', label: 'Ninguno' }] })) : null,
          row('Ordenar por', C('SegmentedControl', { className: 'r4-seg-quiet r4-seg-fill', value: so.key, onChange: setSort, options: SORTS.map(([v, l]) => ({ value: v, label: l })) })),
          pat && grp !== 'ninguno' ? row('Grupos', h('div', { className: 'r4-vrow__btns' }, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('chevrons-up-down', 14), onClick: () => this.setState({ gfold: [] }) }, 'Expandir todos'), C('Button', { variant: 'ghost', size: 'sm', iconStart: I('chevrons-down-up', 14), onClick: () => this.setState({ gfold: keys }) }, 'Plegar todos'))) : null));
    }
    groupsOf(grp) {
      const s = this.state;
      if (grp === 'tipo') return PG8.filter((g) => s.pat.some((a) => a.grupo === g.value)).map((g) => ({ value: g.value, label: g.label, icon: g.icon, color: COL8[g.value], has: (a) => a.grupo === g.value }));
      if (grp === 'titular') {
        const who = (a) => (a.ten || []).length > 1 ? 'Compartido' : ((a.ten || [])[0] || ['Titular'])[0];
        return ['Titular', 'Pareja', 'Compartido'].filter((w) => s.pat.some((a) => who(a) === w)).map((w, i) => ({ value: w, label: w === 'Compartido' ? 'Titular y pareja' : w, icon: 'user', color: ['var(--color-primary-700)', 'var(--color-primary-400)', 'var(--brand-afi-blue)'][i], has: (a) => who(a) === w }));
      }
      if (grp === 'entidad') {
        const ent = (a) => (a.entidad && a.entidad !== '—') ? a.entidad : 'Sin entidad';
        const names = Array.from(new Set(s.pat.map(ent))).sort((x, y) => (x === 'Sin entidad') - (y === 'Sin entidad') || x.localeCompare(y));
        return names.map((n) => ({ value: n, label: n, icon: n === 'Tenencia directa' ? 'key-round' : 'landmark', color: 'var(--color-neutral-400)', has: (a) => ent(a) === n }));
      }
      return [{ value: 'all', label: 'Todos', icon: 'list', color: 'var(--color-neutral-400)', has: () => true }];
    }
    patList38() {
      const s = this.state, q = (s.q || '').trim().toLowerCase(), body = [], folded = s.gfold || [], grp = s.pgroup || 'tipo', types = s.pf || [], pst = s.pst || [], inc = !!pst.length;
      const so = s.sort || { key: 'valor', dir: 'desc' }, sv = (r) => so.key === 'valor' ? (s.v39 && s.famView ? num(r.valor) * (((r.ten || []).length ? (r.ten || []).filter(([w]) => w !== 'Terceros').reduce((x, [, p]) => x + num(p), 0) : 100) / 100) : num(r.valor)) : so.key === 'done' ? num(r.done) : String(r[so.key] || '');
      const srt = (rows) => rows.slice().sort((x, y) => (sv(x) > sv(y) ? 1 : sv(x) < sv(y) ? -1 : 0) * (so.dir === 'asc' ? 1 : -1));
      const status = (a) => a.done >= 3 ? St({ tone: 'success', text: 'Completo' }) : h('span', { className: 'r4-st r4-st--warning' }, I('circle-dashed', 14), (3 - a.done) + ' por completar');
      const ten = (a) => h('span', { className: 'r4-ten' }, (a.ten || []).map(([who, p]) => h('span', { key: who, className: 'r4-tenchip' }, who, h('b', null, p + ' %'))));
      const amt = (v) => h('span', { className: 'r2-amount r4-nowrap' + (v < 0 ? ' r4-neg' : '') }, s.v311 ? A(v) : eur(v));
      const match = (a) => (!q || (a.nombre + ' ' + (a.entidad || '') + ' ' + (a.detalle || '')).toLowerCase().includes(q)) && (!types.length || types.indexOf(a.grupo) >= 0) && (!(s.pf2 || []).length || (s.pf2 || []).indexOf((a.entidad && a.entidad !== '—') ? a.entidad : 'Sin entidad') >= 0) && (!inc || pst.indexOf(a.done >= 3 ? 'ok' : 'inc') >= 0);
      const shown = s.pat.filter(match), filtered = !!(q || types.length || (s.pf2 || []).length || inc);
      const clear = () => this.setState({ q: '', pf: [], pf2: [], pst: [] });
      const fam = !!(s.v39 && s.famView), share = (a) => { const t = a.ten || []; if (!t.length) return 1; return t.filter(([w]) => w !== 'Terceros').reduce((x, [, p]) => x + num(p), 0) / 100; }, val = (a) => fam ? Math.round(num(a.valor) * share(a)) : num(a.valor);
      const typeOf = (a) => PG8.find((g) => g.value === a.grupo) || PG8[0];
      /* new asset: a draft row at the top of the table, whatever the grouping */
      if (s.adding && s.draft && s.screen === 'patrimonio') {
        const d = s.draft, dt = typeOf(d), OWN = ['Titular', 'Pareja', 'Ambos'].map((x) => ({ value: x, label: x }));
        body.push(C('TableRow', { key: 'new', hoverable: false, className: 'r2-new r4-two is-open' },
          C('TableCell', { colSpan: 3 }, h('span', { className: 'r2-name' }, this.ic(dt.icon, 'new'), C('Input', { value: d.nombre, placeholder: 'Nombre del activo', 'aria-label': 'Nombre del activo', onChange: (e) => this.setDraft('nombre', e.target.value) }))),
          C('TableCell', { kind: 'monetary' }, C('Input', { value: d.valor, placeholder: '0', inputMode: 'decimal', suffix: '€', 'aria-label': 'Valor', onChange: (e) => this.setDraft('valor', e.target.value) }))));
        body.push(this.detailRow('new-d', 4, [
          h('div', { key: 'g', className: 'r4-line2 r4-line2--two' }, C('Select', { label: 'Titular', value: d.titular, options: OWN, onChange: (v) => this.setDraft('titular', v) }), C('Select', { label: 'Tipo de activo', value: d.grupo, options: PG8, onChange: (v) => this.setDraft('grupo', v) })),
          h('p', { key: 'p', className: 'r2-hint' }, 'Con nombre y valor basta para crearlo. Titulares, revalorización y fiscalidad se completan después en la fila.'),
          this.actions(C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', onClick: () => this.discard() }, 'Descartar'), h(React.Fragment, null, C('Button', { variant: 'primary', size: 'sm', disabled: !this.canCreate(), onClick: () => this.create() }, 'Crear')))]));
      }
      this.groupsOf(grp).forEach((g) => {
        const all = s.pat.filter(g.has), items = srt(all.filter(match));
        if (!items.length) return;
        const sum = items.reduce((t, a) => t + val(a), 0), key = grp + ':' + g.value, shut = folded.indexOf(key) >= 0;
        if (grp !== 'ninguno') body.push(C('TableRow', { key: 'g-' + key, hoverable: false, className: 'r2-group r4-gfold' },
          C('TableCell', { colSpan: 3 }, h('button', { type: 'button', className: 'r4-gbtn', 'aria-expanded': !shut, onClick: () => this.setState((st) => { const f = st.gfold || []; return { gfold: shut ? f.filter((x) => x !== key) : f.concat(key) }; }) },
            C('Dot', { color: g.color }), h('span', { className: 'r2-group__t' }, g.label), h('span', { className: 'r2-muted' }, ' · ' + items.length + (items.length < all.length ? ' de ' + all.length : '')), h('span', { className: 'r4-gchev' + (shut ? ' is-shut' : '') }, I('chevron-down', 14)))),
          C('TableCell', { kind: 'monetary' }, h('span', { className: 'r4-nowrap r4-gsum' + (sum < 0 ? ' r4-neg' : '') }, s.v311 ? A(sum) : eur(sum)))));
        if (shut) return;
        items.forEach((a) => {
          const open = s.open === a.id, t = typeOf(a);
          body.push(C('TableRow', { key: a.id, hoverable: true, style: s.v311 ? { '--i': Math.min(body.length, 12) } : undefined, className: 'r4-two ' + (open ? 'is-open ' : ''), onClick: () => open ? this.closeRow() : this.setState({ open: a.id, adding: false }) },
            C('TableCell', null, h('span', { className: 'r2-name', 'data-row': a.id, 'data-part': share(a) < 1 ? '1' : undefined }, this.ic(t.icon), h('span', { className: 'r4-name2' },
              h('span', { className: 'r2-name__t' }, a.nombre, s.v312 && s.sim && (s.simChanges || []).indexOf('sell') >= 0 && a.id === 'b8' ? C('Badge', { tone: 'info' }, 'Simulado · venta en 2030') : null),
              h('span', { className: 'r4-sub' }, [grp === 'tipo' ? null : t.label, a.detalle, grp !== 'entidad' && a.entidad && a.entidad !== '—' ? a.entidad : null].filter(Boolean).join(' · ')),
              s.v311 ? h('span', { className: 'r4-sub r4-sub--ten' }, ten(a), h('span', { className: 'r4-sub--st' }, status(a))) : null))),
            C('TableCell', null, ten(a)),
            C('TableCell', null, status(a)),
            C('TableCell', { kind: 'monetary' }, fam && share(a) < 1 ? h('span', { className: 'r4-name2 r4-name2--end' }, amt(val(a)), h('span', { className: 'r4-sub r4-nowrap', title: Math.round(share(a) * 100) + ' % de ' + eur(num(a.valor)) }, 'de ' + eur(num(a.valor)))) : amt(val(a)))));
          if (open) body.push(this.detailRow(a.id + '-d', 4, [
            h('div', { key: 'g', className: 'r2-grid' },
              C('Input', { label: 'Nombre', value: a.nombre, onChange: (e) => this.update(a.id, 'nombre', e.target.value) }),
              C('Input', { label: a.grupo === 'deu' ? 'Importe pendiente' : 'Valor actual', value: fmt(a.valor), suffix: '€', onChange: (e) => this.update(a.id, 'valor', (a.valor < 0 ? '-' : '') + e.target.value) }),
              C('Input', { label: 'Entidad', value: a.entidad === '—' ? '' : a.entidad, onChange: (e) => this.update(a.id, 'entidad', e.target.value) })),
            this.moreSections(a),
            this.actionsDel(a.id, a.nombre || a.concepto || 'este activo', C('Button', { variant: 'primary', size: 'sm', onClick: () => this.closeRow() }, 'Hecho'))]));
        });
      });
      const ents = s.pf2 || [], entOf = (a) => (a.entidad && a.entidad !== '—') ? a.entidad : 'Sin entidad';
      const nInc = s.pat.filter((a) => a.done < 3).length;
      /* WP pattern: one chip per dimension opens a multi-select (DS gap: no MultiSelect / FilterChip, so Chip + Popover + Checkbox) */
      const multi = (id, label, opts, sel, setSel) => {
        const n = sel.length, val = !n ? null : n === 1 ? (opts.find((o) => o.value === sel[0]) || {}).label : n + ' seleccionados';
        const all = n === opts.length;
        return C('Popover', { align: 'start', width: '300px', title: label, open: s.pop === id, onOpenChange: (o) => this.setState({ pop: o ? id : null }),
          trigger: h('span', { className: 'r4-chipw r4-chipw--dd' }, C('Chip', { label, value: val || undefined, selected: !!n, icon: I('chevron-down', 14), onSelect: () => {} })),
          footer: h('div', { className: 'r2-actions' }, C('Button', { variant: 'ghost', size: 'sm', disabled: !n, onClick: () => setSel([]) }, 'Quitar'), h('span', { className: 'r2-spacer' }), C('Button', { variant: 'primary', size: 'sm', onClick: () => this.setState({ pop: null }) }, 'Listo')) },
          h('div', { className: 'r4-mlist' },
            h('div', { className: 'r4-mopt r4-mopt--all' }, C('Checkbox', { label: 'Seleccionar todo', checked: all, indeterminate: !!n && !all, onChange: () => setSel(all ? [] : opts.map((o) => o.value)) })),
            opts.map((o) => h('div', { key: o.value, className: 'r4-mopt' }, C('Checkbox', { label: o.label, checked: sel.indexOf(o.value) >= 0, onChange: () => setSel(sel.indexOf(o.value) >= 0 ? sel.filter((x) => x !== o.value) : sel.concat(o.value)) }), h('span', { className: 'r2-muted' }, String(o.n))))));
      };
      const typeOpts = PG8.filter((g) => s.pat.some((a) => a.grupo === g.value)).map((g) => ({ value: g.value, label: g.label, n: s.pat.filter((a) => a.grupo === g.value).length }));
      const entNames = Array.from(new Set(s.pat.map(entOf))).sort((x, y) => (x === 'Sin entidad') - (y === 'Sin entidad') || x.localeCompare(y));
      const entOpts = entNames.map((e) => ({ value: e, label: e, n: s.pat.filter((a) => entOf(a) === e).length }));
      const chips = h('div', { className: 'r4-chips', role: 'group', 'aria-label': 'Filtrar patrimonio' },
        multi('f-tipo', 'Tipo', typeOpts, types, (v) => this.setState({ pf: v })),
        multi('f-ent', 'Entidad', entOpts, ents, (v) => this.setState({ pf2: v })),
        multi('pst', 'Estado', [{ value: 'inc', label: 'Por completar', n: nInc }, { value: 'ok', label: 'Completo', n: s.pat.length - nInc }], pst, (v) => this.setState({ pst: v })),
        filtered ? C('Button', { variant: 'ghost', size: 'sm', iconStart: I('x', 14), onClick: clear }, 'Limpiar filtros') : null,
        s.v39 && !s.v310 ? h('span', { className: 'r4-famsw' },
          C('Tooltip', { content: 'Elija si ver el valor total de cada activo o solo la parte que pertenece a la familia según su porcentaje de tenencia.', placement: 'top' }, C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Más información sobre el importe' }, I('circle-help', 16))),
          C('SegmentedControl', { className: 'r4-seg-quiet', value: fam ? 'familia' : 'total', onChange: (v) => this.setState({ famView: v === 'familia' }), options: [{ value: 'total', label: 'Valor total' }, { value: 'familia', label: 'Parte de la familia' }] })) : null);
      const lens = s.v39 ? h('span', { className: 'r4-famsw r4-famsw--lens', role: 'group', 'aria-label': 'Importe de los activos' },
        h('span', { className: 'r4-famsw__l' }, 'Importe'),
        C('SegmentedControl', { className: 'r4-seg-quiet', value: fam ? 'familia' : 'total', onChange: (v) => this.setState({ famView: v === 'familia' }), options: [{ value: 'total', label: 'Valor total' }, { value: 'familia', label: 'Parte de la familia' }] }),
        C('Tooltip', { content: 'Elija si ver el valor total de cada activo o solo la parte que pertenece a la familia según su porcentaje de tenencia.', placement: 'top' }, C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: 'Más información sobre el importe' }, I('circle-help', 16)))) : null;
      const partial = s.pat.filter((a) => num(a.valor) > 0 && share(a) < 1), allA = s.pat.filter((a) => num(a.valor) > 0);
      const famLine = s.v311 && fam ? h('p', { className: 'r4-famline', 'aria-live': 'polite' }, I('users', 14), h('span', null, 'Parte de la familia: ', h('strong', null, A(allA.reduce((t, a) => t + val(a), 0))), ' de ' + eur(allA.reduce((t, a) => t + num(a.valor), 0)) + ' en activos · ' + partial.length + ' activos con parte de terceros')) : null;
      const info = filtered ? h('p', { className: 'r4-fcount', 'aria-live': 'polite' }, 'Mostrando ' + shown.length + ' de ' + s.pat.length + ' · ' + eur(shown.reduce((t, a) => t + val(a), 0))) : null;
      return h('section', { className: 'r2-list' },
        h('div', { className: 'r2-bar' }, h('span', { className: 'r4-search' }, C('Input', { size: 'sm', value: s.q || '', placeholder: 'Buscar en patrimonio…', 'aria-label': 'Buscar en patrimonio', iconStart: I('search', 16), onChange: (e) => this.setState({ q: e.target.value }) })), s.v312 ? chips : null, h('span', { className: 'r2-spacer' }), s.v311 ? null : s.v310 ? lens : this.vista('pat'), s.btnBar ? this.newBtn('Nuevo activo') : null),
        s.v312 ? null : chips, info, famLine,
        shown.length
          ? C('TableShell', { density: 'comfortable', quiet: true, className: 'r2-table r4-table2 r4-table2--real' }, h('thead', null, C('TableHeaderRow', null, s.v310 ? C('TableHeaderCell', { key: 'Activo', label: this.groupHead() }) : this.th('nombre', 'Activo'), this.th(null, 'Tenencia'), this.th('done', 'Datos'), s.v311 ? C('TableHeaderCell', { key: 'Importe', kind: 'monetary', label: this.impHead() }) : this.th('valor', s.v310 && fam ? 'Importe · familia' : 'Importe', 'monetary'))), h('tbody', s.v311 ? { key: 'g-' + grp, className: 'r4-tb-in' } : null, body))
          : C('EmptyState', { size: 'compact', title: 'Ningún activo coincide', actions: C('Button', { variant: 'secondary', size: 'sm', iconStart: I('x', 14), onClick: clear }, 'Limpiar filtros') }, 'Pruebe con otro nombre o quite algún filtro.'));
    }

    /* ---------- an asset's folded forms: one field per row, label left, control right ---------- */
    more(a) { return (this.state.more || {})[a.id] || MORE0[a.id] || blank(); }
    setMore(a, k, v) {
      this.setState((st) => {
        const m = Object.assign({}, (st.more || {})[a.id] || MORE0[a.id] || blank(), { [k]: v });
        const done = SECS.filter((sec) => secDone(m, sec)).length;
        return { more: Object.assign({}, st.more, { [a.id]: m }), pat: st.pat.map((x) => x.id === a.id ? Object.assign({}, x, { done }) : x) };
      });
    }
    moreSections(a) {
      const m = this.more(a), folds = this.state.folds || [];
      const inp = (k, suffix, ph) => C('Input', { size: 'sm', value: m[k], suffix, placeholder: ph || '', inputMode: 'decimal', onChange: (e) => this.setMore(a, k, e.target.value) });
      const sel = (k, opts) => C('Select', { size: 'sm', value: m[k] || '', placeholder: 'Elegir', options: opts.map((x) => ({ value: x, label: x })), onChange: (v) => this.setMore(a, k, v) });
      const row = (label, control, help) => h('div', { className: 'r4-frow', key: label }, h('div', { className: 'r4-frow__l' }, h('span', null, label), help ? h('small', null, help) : null), h('div', { className: 'r4-frow__c' }, control));
      const body = {
        tit: [row('Titular', inp('pctT', '%')), row('Pareja', inp('pctP', '%')), row('Total', h('strong', { className: num(m.pctT) + num(m.pctP) === 100 ? '' : 'r4-warn' }, (num(m.pctT) + num(m.pctP)) + ' %'), num(m.pctT) + num(m.pctP) === 100 ? null : 'Los porcentajes tienen que sumar 100 %.')],
        rev: [row('Revalorización', sel('reval', ['IPC', 'Manual'])), row('Tasa anual', inp('tasa', '%', '0,0'), m.reval === 'IPC' ? 'Con IPC se usa el de la configuración.' : null), row('Renta anual', inp('renta', '€', '0'), 'Alquiler o dividendos que da cada año.')],
        fis: [row('Año de adquisición', inp('anio', null, 'AAAA')), row('Coste de adquisición', inp('coste', '€', '0')), row('Hipoteca asociada', sel('hip', ['No', 'Sí'])), m.hip === 'Sí' ? row('Importe pendiente', inp('pend', '€', '0')) : null] };
      return h('div', { key: 'more', className: 'r4-folds' }, SECS.map((sec) => {
        const ok = secDone(m, sec);
        return C('Accordion', { key: sec.key, className: 'r4-fold', defaultOpen: folds.indexOf(a.id + ':' + sec.key) >= 0,
          summary: h('span', { className: 'r4-fold__sum' }, h('span', null, sec.title), ok ? h('span', { className: 'r4-st r4-st--success' }, I('circle-check', 14), 'Completo') : h('span', { className: 'r4-st r4-st--warning' }, I('circle-dashed', 14), 'Pendiente')) },
          h('div', { className: 'r4-fold__in' }, h('p', { className: 'r2-hint' }, sec.text), body[sec.key]));
      }));
    }

    /* ---------- v3.2: «Evolución del patrimonio y legado»: verdict, today's split, evolution, legado by scenario ---------- */
    evoSection(sec, StF, leg, v, big, busy) {
      const s = this.state, assets = PG8.filter((g) => g.value !== 'deu');
      const sumOf = (g) => s.pat.filter((a) => a.grupo === g).reduce((t, a) => t + num(a.valor), 0);
      const tA = assets.reduce((t, g) => t + sumOf(g.value), 0), tD = sumOf('deu');
      const data = assets.map((g) => ({ label: g.label, value: sumOf(g.value) })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
      const ages = v.medio.map((_, i) => (i === 0 ? 'Hoy' : String(AGE0 + i)));
      const row = (name, key, val) => h('tr', { key }, h('td', null, name), h('td', { className: 'r4-num' }, val), h('td', null, v.goal ? (v.cover[key] ? StF({ tone: 'success', text: 'Cubre' }) : StF({ tone: 'warning', text: 'No cubre' })) : '—'));
      return sec('leg', 'Evolución del patrimonio y legado', StF({ tone: leg.tone, text: big ? leg.text : leg.short, busy }), C('LoadingOverlay', { busy, label: 'Recalculando el plan…' }, h('div', { className: 'r2-figs' },
        h('div', { className: 'r4-verdict r4-st--' + leg.tone }, I(leg.tone === 'success' ? 'circle-check' : leg.tone === 'neutral' ? 'circle-dashed' : 'triangle-alert', 18), h('div', null, h('strong', null, leg.title), h('p', null, leg.body))),
        h('div', { className: 'r4-figline' }, h('h4', null, 'Patrimonio hoy'),
          h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(tA + tD, meur, 2)), h('span', { className: 'r2-muted' }, 'neto · activos ' + m1(tA) + ' · deudas ' + m1(tD)))),
        this.hoy(data, tA, tD, big),
        h('div', { className: 'r4-figline' }, h('h4', null, 'Evolución hasta los ' + v.edad + ' · escenario medio'),
          h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(v.sc.med, meur, 2)), v.goal ? (v.cover.med ? StF({ tone: 'success', text: 'Cubre el legado' }) : StF({ tone: 'warning', text: 'No cubre el legado' })) : null)),
        h(Bars, { values: v.medio, labels: ages, goal: v.goal, goalLabel: 'Objetivo · ' + mGoal(v.goal), mark: (v.ra || RETIRE) - AGE0, markLabel: 'Jubilación · ' + (v.ra || RETIRE), format: eur, height: big ? 180 : 120, label: 'Patrimonio previsto por edad, escenario medio, de hoy a los ' + v.edad + ' años: lo que queda al final es el legado' }),
        h('div', { className: 'r4-block' }, h('h4', null, 'Legado por escenario'),
          h('table', { className: 'r4-plain' }, h('thead', null, h('tr', null, h('th', null, 'Escenario'), h('th', { className: 'r4-num' }, 'A los ' + v.edad), h('th', null, 'Legado'))),
            h('tbody', null, row('Optimista', 'opt', m1(v.sc.opt)), row('Medio', 'med', m1(v.sc.med)), row('Pesimista', 'pes', m1(v.sc.pes))))))));
    }

    /* «Patrimonio hoy» in four ways (estado.hoy): donut | hbar | vbar | cards; debts always visible */
    hoy(data, tA, tD, big) {
      const mode = this.state.hoy || 'donut', pc = (v) => (v / tA * 100).toFixed(1).replace('.', ',') + ' %';
      const colOf = (label) => { const g = PG8.find((x) => x.label === label); return g ? COL8[g.value] : 'var(--color-neutral-400)'; };
      const debts = this.state.pat.filter((a) => a.grupo === 'deu').sort((x, y) => Math.abs(y.valor) - Math.abs(x.valor));
      const DEBT_COL = ['var(--color-error-700,#B42318)', 'var(--color-error-500,#F04438)', 'var(--color-error-300,#FDA29B)', 'var(--color-error-200,#FECDCA)'];
      const debtBar = h('div', { className: 'r4-hd' }, h('div', { className: 'r4-hd__h' }, h('span', null, 'Deudas'), h('strong', { className: 'r4-neg' }, eur(tD))),
        this.state.v312 ? h('div', { className: 'r4-hbar r4-hbar--debt', style: { width: Math.min(100, Math.abs(tD) / tA * 100) + '%' } }, debts.map((a, i) => h('i', { key: a.id || a.nombre, title: a.nombre + ' · ' + eur(a.valor), style: { flex: Math.abs(a.valor) + ' 1 0', background: DEBT_COL[i % DEBT_COL.length] } })))
          : h('div', { className: 'r4-hbar' }, h('i', { style: { width: Math.min(100, Math.abs(tD) / tA * 100) + '%', background: COL8.deu } })),
        this.state.v312 ? h(React.Fragment, null,
          h('button', { type: 'button', className: 'r4-leglink', 'aria-expanded': !!this.state.debtLeg, onClick: () => this.setState((st) => ({ debtLeg: !st.debtLeg })) }, this.state.debtLeg ? 'Ocultar desglose' : 'Ver desglose · ' + debts.length + (debts.length === 1 ? ' deuda' : ' deudas'), I(this.state.debtLeg ? 'chevron-up' : 'chevron-down', 14)),
          C('Reveal', { open: !!this.state.debtLeg }, h('ul', { className: 'r4-psum__leg' }, debts.map((a, i) => h('li', { key: a.id || a.nombre }, C('Dot', { color: DEBT_COL[i % DEBT_COL.length] }), a.nombre + ' · ' + Math.round(Math.abs(a.valor) / Math.abs(tD) * 100) + ' %')))))
          : h('small', { className: 'r2-muted' }, debts.map((a) => a.nombre + ' ' + eur(a.valor)).join(' · ')));
      if (mode === 'donut') return h('div', { className: 'r4-hoy' },
        h('div', { className: 'r3-chart r4-donut' }, C('DonutChart', { size: big ? 'md' : 'sm', interactive: true, legend: true, look: 'ramp', groupBelow: 5, otherLabel: 'Otros', formatValue: (x) => eur(x), centerValue: (tA / 1e6).toFixed(2).replace('.', ','), centerLabel: 'M € en activos', data, description: 'Reparto del patrimonio de hoy por tipo de activo' })), debtBar);
      if (mode === 'hbar') return h('div', { className: 'r4-hoy' },
        h('div', { className: 'r4-hd' }, h('div', { className: 'r4-hd__h' }, h('span', null, 'Activos'), h('strong', null, eur(tA))),
          this.state.v312 ? h('div', { className: 'r4-hbar r4-hbar--stack r4-hbar--hover' }, data.map((d) => C('Tooltip', { key: d.label, content: h('span', null, h('strong', null, d.label), ' · ' + eur(d.value) + ' · ' + pc(d.value)), placement: 'top', style: { flex: d.value + ' 1 0', display: 'flex', minWidth: 0 } }, h('i', { tabIndex: 0, 'aria-label': d.label + ' · ' + eur(d.value) + ' · ' + pc(d.value), style: { flex: '1 1 auto', background: colOf(d.label) } }))))
            : h('div', { className: 'r4-hbar r4-hbar--stack' }, data.map((d) => h('i', { key: d.label, title: d.label + ' · ' + eur(d.value), style: { flex: d.value + ' 1 0', background: colOf(d.label) } }))),
          this.state.v312 ? h(React.Fragment, null,
              h('button', { type: 'button', className: 'r4-leglink', 'aria-expanded': !!this.state.hoyLeg, onClick: () => this.setState((st) => ({ hoyLeg: !st.hoyLeg })) }, this.state.hoyLeg ? 'Ocultar desglose' : 'Ver desglose · ' + data.length + ' tipos', I(this.state.hoyLeg ? 'chevron-up' : 'chevron-down', 14)),
              C('Reveal', { open: !!this.state.hoyLeg }, h('ul', { className: 'r4-psum__leg' }, data.map((d) => h('li', { key: d.label }, C('Dot', { color: colOf(d.label) }), d.label + ' · ' + pc(d.value))))))
            : h('ul', { className: 'r4-psum__leg' }, data.map((d) => h('li', { key: d.label }, C('Dot', { color: colOf(d.label) }), d.label + ' · ' + pc(d.value))))),
        debtBar);
      if (mode === 'vbar') { const max = Math.max.apply(null, data.map((d) => d.value)), all = data.concat([{ label: 'Deudas', value: tD }]), rng = max + Math.abs(tD);
        return h('div', { className: 'r4-hoy' }, h('div', { className: 'r4-vb', role: 'img', 'aria-label': 'Activos por tipo y deudas' },
          all.map((d) => h('div', { key: d.label, className: 'r4-vb__c', title: d.label + ' · ' + eur(d.value) },
            h('div', { className: 'r4-vb__plot' }, h('i', { style: { height: (Math.abs(d.value) / rng * 100) + '%', background: d.value < 0 ? COL8.deu : colOf(d.label), top: d.value < 0 ? (max / rng * 100) + '%' : 'auto', bottom: d.value < 0 ? 'auto' : (100 - max / rng * 100) + '%' } })),
            h('strong', { className: d.value < 0 ? 'r4-neg' : '' }, (d.value / 1e6).toFixed(2).replace('.', ',') + ' M'), h('small', null, d.label)))),
          h('b', { className: 'r4-vb__zero', style: { top: 'calc(' + (max / rng * 100) + '% )' } })); }
      return h('div', { className: 'r4-cards' },
        h('div', { className: 'r4-card' }, h('small', null, 'Activos'), h('strong', null, A(tA, meur, 2)), h('div', { className: 'r4-hbar r4-hbar--stack' }, data.map((d) => h('i', { key: d.label, style: { flex: d.value + ' 1 0', background: colOf(d.label) } }))), h('span', { className: 'r2-muted' }, data.length + ' tipos · ' + this.state.pat.filter((a) => a.grupo !== 'deu').length + ' activos')),
        h('div', { className: 'r4-card' }, h('small', null, 'Deudas'), h('strong', { className: 'r4-neg' }, A(tD, meur, 2)), h('div', { className: 'r4-hbar' }, h('i', { style: { width: Math.min(100, Math.abs(tD) / tA * 100) + '%', background: COL8.deu } })), h('span', { className: 'r2-muted' }, debts.length + ' préstamos · ' + (Math.abs(tD) / tA * 100).toFixed(0) + ' % de los activos')),
        h('div', { className: 'r4-card r4-card--net' }, h('small', null, 'Neto'), h('strong', null, A(tA + tD, meur, 2)), h('span', { className: 'r2-muted' }, 'Lo que hoy pasaría al legado')));
    }

    /* ---------- starting page: the gestor's planificaciones, rows.gg-quiet ---------- */
    homeDialog() {
      const s = this.state, p = s.hdel;
      return C('Dialog', { open: !!p, size: 'sm', title: 'Eliminar la planificación', onClose: () => this.setState({ hdel: null }),
        description: p ? 'Se eliminará «' + p.plan + '» de ' + p.cliente + ', con sus datos y sus optimizaciones. Esta acción no se puede deshacer.' : '',
        footer: h('div', { className: 'r2-actions' }, h('span', { className: 'r2-spacer' }), C('Button', { variant: 'ghost', onClick: () => this.setState({ hdel: null }) }, 'Cancelar'),
          C('Button', { variant: 'destructive', iconStart: I('trash-2', 16), onClick: () => { this.setState((st) => ({ plans: (st.plans || PLANS).filter((x) => x.id !== p.id), hdel: null })); this.toast('Planificación «' + p.plan + '» eliminada.'); } }, 'Eliminar')) });
    }
    undoLast() {
      const u = this.state.undo;
      if (u && u.type === 'arch') { this.setState((st) => ({ plans: (st.plans || PLANS).map((x) => x.id === u.id ? Object.assign({}, x, { arch: false }) : x), toast: '', undo: null })); return; }
      super.undoLast();
    }
    homePage() {
      const s = this.state, q = (s.hq || '').trim().toLowerCase(), tab = s.htab || 'activas';
      const PL = s.plans || PLANS, act = PL.filter((p) => !p.arch), arch = PL.filter((p) => p.arch);
      const rows = (tab === 'activas' ? act : arch).filter((p) => !q || (p.cliente + ' ' + p.plan + ' ' + p.tipo).toLowerCase().includes(q));
      const tone = { Borrador: 'neutral', Cumplimentada: 'info', Entregada: 'success', Descargada: 'neutral' };
      const dots = (n) => h('span', { className: 'r4-dots', 'aria-label': n + ' de 5 apartados completos' }, [0, 1, 2, 3, 4].map((i) => h('i', { key: i, className: i < n ? 'on' : '' })));
      const open = (p) => this.setState({ home: false, planName: p.plan, status: p.estado, screen: s.v312 ? 'patrimonio' : 'ingresos', open: null, adding: false });
      const body = [];
      if (s.hadding) {
        const d = s.hdraft || { cliente: '', plan: '', tipo: 'Jubilación' };
        const set = (k) => (e) => this.setState({ hdraft: Object.assign({}, d, { [k]: e && e.target ? e.target.value : e }) });
        const ok = d.cliente.trim() && d.plan.trim();
        const fold = (then) => { this.setState({ hclose: true }); clearTimeout(this._hf); this._hf = setTimeout(() => { this.setState({ hadding: false, hclose: false }); if (then) then(); }, 470); };
        const create = () => { if (!ok) return; const p = { id: 'n' + Date.now(), cliente: d.cliente.trim(), plan: d.plan.trim(), tipo: d.tipo, estado: 'Borrador', done: 0, gestor: 'GA', upd: 'Ahora', fresh: true }; this.setState({ plans: [p].concat(PL), hdraft: null }); fold(); this.toast('Planificación «' + p.plan + '» creada.'); };
        const G = (kid) => C('Reveal', { open: !s.hclose, outset: 4 }, h('div', { className: 'r4-cellpad' }, kid));
        body.push(h('tr', { key: 'new', className: 'r4-hrow r4-hrow--new' },
          h('td', { colSpan: 2 }, G(h('div', { className: 'r4-line2 r4-line2--three' }, C('Input', { label: 'Cliente', value: d.cliente, placeholder: 'Nombre y apellidos', autoFocus: true, onChange: set('cliente') }), C('Input', { label: 'Nombre de la planificación', value: d.plan, placeholder: 'Por ejemplo, Jubilación 2030', onChange: set('plan') }), C('Select', { label: 'Tipo', value: d.tipo, options: ['Jubilación', 'Sucesión', 'Patrimonio', 'Inversión'].map((x) => ({ value: x, label: x })), onChange: set('tipo') })))),
          h('td', { colSpan: 3, className: 'r4-hrow__act' }, G(h('div', { className: 'r2-actions' }, C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', onClick: () => fold() }, 'Descartar'), h('span', { className: 'r2-spacer' }), C('Button', { variant: 'primary', size: 'sm', disabled: !ok, onClick: create }, 'Crear'))))));
      }
      const F = (p, kid) => p.fresh ? C('Reveal', { outset: 4 }, h('div', { className: 'r4-cellpad' }, kid)) : kid;
      rows.forEach((p) => body.push(s.v312 && s.hconf === p.id ? (() => { const del = s.hconfKind === 'del';
        return h('tr', { key: p.id, className: 'r4-hrow r4-hrow--confirm' }, h('td', { colSpan: 5 }, h('div', { className: 'r4-hconfirm', role: 'alert' },
          h('span', null, I(del ? 'trash-2' : 'archive', 16), h('strong', null, del ? '¿Eliminar «' + p.plan + '» definitivamente?' : '¿Archivar «' + p.plan + '»?'), h('span', { className: 'r2-muted' }, del ? ' Se borran sus datos y sus optimizaciones. No se puede deshacer.' : ' Pasa a Archivadas; puede restaurarla cuando quiera.')), h('span', { className: 'r2-spacer' }),
          C('Button', { variant: 'ghost', size: 'sm', autoFocus: true, onClick: () => this.setState({ hconf: null }) }, 'Cancelar'),
          del ? C('Button', { variant: 'secondary', size: 'sm', className: 'r4-danger-soft', iconStart: I('trash-2', 14), onClick: () => { this.setState((st) => ({ plans: (st.plans || PLANS).filter((x) => x.id !== p.id), hconf: null })); this.toast('Planificación «' + p.plan + '» eliminada.'); } }, 'Eliminar')
            : C('Button', { variant: 'secondary', size: 'sm', className: 'r4-danger-soft', iconStart: I('archive', 14), onClick: () => { this.setState((st) => ({ plans: (st.plans || PLANS).map((x) => x.id === p.id ? Object.assign({}, x, { arch: true }) : x), hconf: null })); this.toast('Planificación «' + p.plan + '» archivada.', { type: 'arch', id: p.id }); } }, 'Archivar')))); })() : h('tr', { key: p.id, className: 'r4-hrow' + (p.fresh ? ' r4-hrow--fresh' : ''), tabIndex: 0, onClick: () => open(p), onKeyDown: (e) => { if (e.key === 'Enter') open(p); } },
        h('td', null, F(p, h('span', { className: 'r4-hname' }, h('span', { className: 'r4-avatar' }, p.cliente.split(' ').slice(0, 2).map((w) => w[0]).join('')), h('span', { className: 'r4-name2' }, h('span', { className: 'r2-name__t' }, p.cliente), h('span', { className: 'r4-sub' }, p.plan + ' · ' + p.tipo))))),
        h('td', null, F(p, h('span', { className: 'r4-status r4-status--static r4-st--' + tone[p.estado] }, h('i', { className: 'r4-status__dot' }), p.estado))),
        h('td', null, F(p, dots(p.done))),
        h('td', null, F(p, h('span', { className: 'r4-user r4-user--sm' }, p.gestor))),
        h('td', { className: 'r4-num' }, F(p, s.v312 ? h('span', { className: 'r4-hend' }, h('span', { className: 'r2-muted r4-hend__upd' }, p.upd),
          h('span', { className: 'r4-hacts', onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation() }, tab === 'activas'
            ? C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', iconStart: I('archive', 14), onClick: () => this.setState({ hconf: p.id, hconfKind: 'arch' }) }, 'Archivar')
            : h(React.Fragment, null, C('Button', { variant: 'ghost', size: 'sm', iconStart: I('archive-restore', 14), onClick: () => { this.setState((st) => ({ plans: (st.plans || PLANS).map((x) => x.id === p.id ? Object.assign({}, x, { arch: false }) : x) })); this.toast('Planificación «' + p.plan + '» restaurada.'); } }, 'Restaurar'),
              C('Button', { variant: 'ghost', size: 'sm', className: 'r4-danger', iconStart: I('trash-2', 14), onClick: () => this.setState({ hconf: p.id, hconfKind: 'del' }) }, 'Eliminar')))) : h('span', { className: 'r2-muted' }, p.upd))))));
      if (!rows.length && !s.hadding) body.push(h('tr', { key: 'empty' }, h('td', { colSpan: 5 }, C('EmptyState', { size: 'compact', title: q ? 'Ninguna planificación coincide' : 'No hay planificaciones archivadas', actions: q ? C('Button', { variant: 'secondary', size: 'sm', iconStart: I('x'), onClick: () => this.setState({ hq: '' }) }, 'Borrar la búsqueda') : C('Button', { variant: 'secondary', size: 'sm', onClick: () => this.setState({ htab: 'activas' }) }, 'Ver planificaciones activas') }, q ? 'Pruebe con otro nombre de cliente o de planificación.' : 'Al archivar una planificación, aparece aquí.'))));
      return h('div', { className: 'r4-home ap-in' },
        h('header', { className: 'r4-home__head' }, h('h1', null, 'Planificaciones'), h('span', { className: 'r2-spacer' }),
          (s.v312 ? C('Tooltip', { content: 'Nueva planificación', shortcut: 'N' }, C('Button', { variant: 'primary', size: 'sm', iconStart: I('plus'), onClick: () => this.setState({ hadding: true, hclose: false, htab: 'activas' }) }, 'Nueva planificación')) : h('span', { className: 'r4-search r4-search--home' }, C('Input', { size: 'sm', value: s.hq || '', placeholder: 'Buscar cliente o planificación…', 'aria-label': 'Buscar cliente o planificación', iconStart: I('search', 16), onChange: (e) => this.setState({ hq: e.target.value }) })))),
        h('div', { className: 'r2-bar' }, C('Tabs', { items: [{ value: 'activas', label: 'Activas · ' + act.length }, { value: 'archivadas', label: 'Archivadas · ' + arch.length }], value: tab, onChange: (v) => this.setState({ htab: v }) }), h('span', { className: 'r2-spacer' }),
          (s.v312 ? h('span', { className: 'r4-search r4-search--home' }, C('Input', { size: 'sm', value: s.hq || '', placeholder: 'Buscar cliente o planificación…', 'aria-label': 'Buscar cliente o planificación', iconStart: I('search', 16), onChange: (e) => this.setState({ hq: e.target.value }) })) : C('Tooltip', { content: 'Nueva planificación', shortcut: 'N' }, C('Button', { variant: 'primary', iconStart: I('plus'), onClick: () => this.setState({ hadding: true, hclose: false, htab: 'activas' }) }, 'Nueva planificación')))),
        h('table', { className: 'r4-htable' }, h('thead', null, h('tr', null, h('th', null, 'Cliente'), h('th', null, 'Estado'), h('th', null, 'Completado'), h('th', null, 'Gestor'), h('th', { className: 'r4-num' }, 'Actualizada'))), h('tbody', null, body)));
    }

    /* ---------- 3.5: tabs that are data cards; each tab holds its whole topic; AI beam on changed tabs; «Todo el plan | Esta página» ---------- */
    planTabs(c, u) {
      if (this.state.v312 && this.state.chat && this.state.chat !== 'C' && this.state.chatAsk) { const a = this.chatQs(c.v).find((x) => x.k === this.state.chatAsk);
        if (a) return h(React.Fragment, null, h('div', { className: 'r3-plan__head' }, h('h2', null, 'El plan'), h('span', { className: 'r2-spacer' }), c.tools), h('div', { className: 'r3-plan__body r4-chgv', key: 'ans' }, this.chatAnswer(a, () => this.setState({ chatAsk: null }))), this.state.chat === 'A' ? this.chatField('A') : null); }
      if (this.state.v312 && this.state.chgOpen) { const sd = this.state; let d0 = sd.recalc || this._diff; if (d0 && !d0.old && d0.oldFrom) d0 = Object.assign({}, d0, { old: this.modelFor(d0.oldFrom) }); if (d0 && d0.old) return this.changesView(c, u, d0); }
      const s = this.state, { v, busy, leg, liq, tools, diff, big } = c, { icon, legBars, liqBars, nCover } = u;
      const v36 = !!s.v36, vm = s.viewMode || 'A', act = v.ren != null ? v.ren : 2.4, gap = Math.max(0, 4.6 - act);
      const ruler = () => s.v312 ? h(Ruler2, { required: 4.6, actual: act }) : h(Ruler, { required: 4.6, actual: act, range: [act - 0.3, act + 0.2] });
      /* 3.12: short sets of figures read label-over-value, side by side (proximity); rows again when the plan is narrow */
      const list = (rows) => s.v312 ? h('dl', { className: 'r4-stats' }, rows.map((r, i) => h('div', { key: i, className: 'r4-stat' }, h('dt', null, r.label), h('dd', { className: typeof r.value === 'string' && !/\d/.test(r.value) ? 'is-text' : undefined }, r.value)))) : C('SummaryList', { rows });
      const verdict = (o) => h('div', { className: 'r4-verdict r4-st--' + o.tone }, icon(o.tone), h('div', null, h('strong', null, o.title), h('p', null, o.body), o.act && !(s.v312 && o.act[0] === 'Ver cómo cubrirlo') ? h('button', { type: 'button', className: 'r4-verdict__act', onClick: o.act[1] }, o.act[0], I('arrow-right', 14)) : null));
      const card = (eyebrow, ...kids) => h('div', { className: 'r4-ia__panel r4-tcard' }, eyebrow ? h('h4', { className: 'r4-ia__eyebrow' }, eyebrow) : null, ...kids);
      /* 3.14 · layout C rule: one chart per tab stays open; a second chart sits behind «Ver …», like «Ver desglose» (one level, opens in place) */
      const more = (key, label, node) => { if (s.planDensity !== 'quiet') return node; const o = !!(s.more || {})[key];
        return h(React.Fragment, null, h('button', { type: 'button', className: 'r4-leglink r4-more', 'aria-expanded': o, onClick: () => this.setState((st) => ({ more: Object.assign({}, st.more, { [key]: !o }) })) }, o ? 'Ocultar ' + label.toLowerCase() : 'Ver ' + label.toLowerCase(), I(o ? 'chevron-up' : 'chevron-down', 14)), o ? h('div', { className: 'r4-more__body' }, node) : null); };
      const plain = (cols, rows) => h('table', { className: 'r4-plain' }, h('thead', null, h('tr', null, cols.map((t, i) => h('th', { key: i, className: i === 1 ? 'r4-num' : '' }, t)))), h('tbody', null, rows.map((r, i) => h('tr', { key: i }, r.map((x, j) => h('td', { key: j, className: j === 1 ? 'r4-num' : '' }, x))))));
      const PGS = s.v32 ? PG8 : GROUPS, assets = PGS.filter((g) => g.value !== 'deu');
      const sumOf = (g) => s.pat.filter((a) => a.grupo === g).reduce((t, a) => t + num(a.valor), 0);
      const tA = assets.reduce((t, g) => t + sumOf(g.value), 0), tD = sumOf('deu');
      const data = assets.map((g) => ({ label: g.label, value: sumOf(g.value) })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
      const cov = (k) => v.goal ? (v.cover[k] ? St({ tone: 'success', text: 'Cubre' }) : St({ tone: 'warning', text: 'No cubre' })) : '—';
      const TABS = [
        { k: 'pat', icon: 'wallet', title: 'Patrimonio', fig: m1(tA + tD), sub: 'neto hoy', tone: 'neutral' },
        { k: 'liq', icon: 'droplets', title: 'Liquidez', fig: v.def ? eur(v.worst) : 'Suficiente', sub: v.def ? 'peor año, ' + v.worstYear : 'todos los años', tone: liq.tone },
        { k: 'leg', icon: 'landmark', title: 'Legado', fig: m1(v.sc.med), sub: nCover + ' de 3 cubren', tone: leg.tone },
        { k: 'ren', icon: s.v312 ? 'percent' : 'sparkles', title: 'Rentabilidad', fig: '4,6 %', sub: gap > 0.05 ? 'faltan ' + gap.toFixed(1).replace('.', ',') + ' puntos' : 'cubierta', tone: gap > 0.05 ? 'warning' : 'success' }];
      /* 3.12: Patrimonio and Legado are one story, so one tab: «Patrimonio y legado» (key 'leg'; 'pat' links land on it) */
      const merged = !!s.v312;
      if (merged) { TABS.splice(0, 1); const L = TABS.find((t) => t.k === 'leg'); L.title = 'Patrimonio y legado'; L.sub = 'legado medio · ' + nCover + ' de 3 cubren'; TABS.splice(TABS.indexOf(L), 1); TABS.unshift(L); }
      const PAGE = PAGE_TABS;
      const view = v36 && vm !== 'A' ? 'todo' : (s.planView || 'todo'), here = (PAGE[s.screen] || ['liq']).map((k) => (merged && k === 'pat' ? 'leg' : k)), shown = view === 'pagina' ? TABS.filter((t) => here.indexOf(t.k) >= 0) : TABS;
      const cur = shown.find((t) => t.k === (merged && s.iaTab === 'pat' ? 'leg' : s.iaTab)) || shown[0];
      const aiK = (diff && diff.secs || []).map((k) => (k === 'opt' ? 'ren' : k));
      const isNew = (k) => aiK.indexOf(k) >= 0 && (s.v312 ? !((s.seenAt || {})[k] > ((diff && diff.at) || 0)) : (s.seen || []).indexOf(k) < 0);
      const go = (k) => this.setState((st) => ({ iaTab: k, seen: Array.from(new Set((st.seen || []).concat(k))), seenAt: Object.assign({}, st.seenAt, { [k]: Date.now() }) }));
      const sentence = (nCover === 3 ? 'El legado se cubre' : nCover ? 'El legado está en riesgo' : 'El legado no se cubre') + (v.def ? ' y habrá déficit de liquidez en ' + v.worstYear + '.' : ' y la liquidez alcanza todos los años.');
      let body;
      const levers = () => card(v36 ? 'Cómo cerrar la diferencia' : null,
        h('ul', { className: 'r4-levers' },
          h('li', null, h('span', { className: 'r4-levers__ic' }, I('pie-chart', 16)), h('div', null, h('strong', null, s.v312 ? 'Optimizar parte de la cartera' : 'Más renta variable en la cartera'), h('small', null, s.v312 ? 'Pasar activos a un perfil Equilibrado o Dinámico sube la rentabilidad esperada; el cambio paga impuestos sobre la plusvalía.' : '+20 puntos de renta variable suben la rentabilidad esperada a ' + pc1(aaRetOf({ rv: 75, rf: 15, mon: 2, alt: 8 })) + '.')), h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => this.go('aa') }, 'Asset allocation', I('arrow-right', 14))),
          h('li', null, h('span', { className: 'r4-levers__ic' }, I('droplets', 16)), h('div', null, h('strong', null, 'Vender activos en los años con déficit'), h('small', null, 'Cubre la liquidez sin exigir tanta rentabilidad al resto.')), h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => this.go('gl') }, 'Generación de liquidez', I('arrow-right', 14))),
          h('li', null, h('span', { className: 'r4-levers__ic' }, I('landmark', 16)), h('div', null, h('strong', null, 'Revisar el legado objetivo'), h('small', null, 'Un objetivo más bajo reduce la rentabilidad necesaria.')), h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => this.go('legado') }, 'Objetivos', I('arrow-right', 14)))));
      const legList = () => list([['Optimista', 'opt'], ['Medio', 'med'], ['Pesimista', 'pes']].map(([l, k]) => ({ label: l, value: h('span', { className: 'r4-lv' }, h('span', null, m1(v.sc[k])), cov(k)) })));
      const liqList = () => list([{ label: 'Optimista', value: St({ tone: 'success', text: 'Suficiente' }) }, { label: 'Medio', value: v.def ? St({ tone: 'warning', text: 'Déficit' }) : St({ tone: 'success', text: 'Suficiente' }) }, { label: 'Pesimista', value: St({ tone: 'warning', text: 'Déficit' }) }]);
      if (merged && cur.k === 'leg') body = [
        verdict(leg),
        card('Patrimonio hoy', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(tA + tD, meur, 2)), h('span', { className: 'r2-muted' }, 'neto · activos ' + m1(tA) + ' · deudas ' + m1(tD))), this.hoy(data, tA, tD, big)),
        card('Evolución hasta los ' + v.edad + ' años', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(v.sc.med, meur, 2)), cov('med'), h('span', { className: 'r2-muted' }, 'escenario medio · lo que queda es el legado')), legBars(big ? 180 : 130)),
        card('Legado por escenario', legList()),
        card('Objetivo', list([{ label: 'Qué se conserva', value: (KEEP.find((x) => x.value === s.keep) || KEEP[0]).label }, { label: 'Legado objetivo', value: mGoal(v.goal) }, { label: 'Edad de seguridad', value: v.edad + ' años' }]),
          h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => this.go('legado') }, 'Editar objetivos', I('arrow-right', 14))),
        card('Por titular', list([{ label: 'Titular', value: m1((tA + tD) * 0.58) }, { label: 'Pareja', value: m1((tA + tD) * 0.42) }]))];
      else if (v36 && cur.k === 'pat') body = [
        card('Patrimonio hoy', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(tA + tD, meur, 2)), h('span', { className: 'r2-muted' }, 'neto · activos ' + m1(tA) + ' · deudas ' + m1(tD))), this.hoy(data, tA, tD, big)),
        card('Por titular', list([{ label: 'Titular', value: m1((tA + tD) * 0.58) }, { label: 'Pareja', value: m1((tA + tD) * 0.42) }])),
        h('button', { type: 'button', className: 'r4-verdict__act r4-tlink', onClick: () => this.setState({ iaTab: 'leg' }) }, 'Cómo evoluciona hasta el legado', I('arrow-right', 14))];
      else if (v36 && cur.k === 'leg') body = [
        verdict(leg),
        card('Evolución del patrimonio hasta los ' + v.edad, h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(v.sc.med, meur, 2)), cov('med'), h('span', { className: 'r2-muted' }, 'escenario medio · lo que queda es el legado')), legBars(big ? 180 : 130)),
        card('Legado por escenario', legList()),
        card('Objetivo', list([{ label: 'Qué se conserva', value: (KEEP.find((x) => x.value === s.keep) || KEEP[0]).label }, { label: 'Legado objetivo', value: mGoal(v.goal) }, { label: 'Edad de seguridad', value: v.edad + ' años' }]),
          h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => this.go('legado') }, 'Editar objetivos', I('arrow-right', 14)))];
      else if (v36 && cur.k === 'liq') body = [
        verdict(Object.assign({}, liq, liq.act && !s.v312 ? { act: ['Ver cómo cubrirlo', () => this.go('gl')] } : {})),
        card('Liquidez generada año a año · escenario medio', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' + (v.worst < 0 ? ' r4-neg' : '') }, A(v.worst)), h('span', { className: 'r2-muted' }, v.worst < 0 ? 'peor año, ' + v.worstYear : 'el año más justo, ' + v.worstYear)), liqBars(big ? 160 : 120),
          h('ul', { className: 'r2-legend r4-legend' }, h('li', null, h('i', { className: 'r4-key' }), 'Ahorro'), h('li', null, h('i', { className: 'r4-key r4-key--neg' }), 'Necesidad de liquidez'))),
        card('Liquidez por escenario', liqList()),
        card('Colchón de liquidez', list([{ label: 'Colchón inmediata', value: A(v.colchon) }, { label: 'Años con déficit · medio', value: String(v.def) }]))];
      else if (v36 && cur.k === 'ren') body = [
        card('Rentabilidad necesaria frente a la actual', h('div', { className: 'r2-fig r2-fig--row' }, h('span', { className: 'r2-ai' }, I('sparkles', 14), 'Rentabilidad mínima necesaria'), h('strong', null, '4,6 %')), ruler(),
          h('p', { className: 'r2-hint' }, 'La cartera ' + (s.aaApplied ? 'propuesta' : 'actual') + ' rinde un ' + pc1(act) + ' en el escenario medio' + (gap > 0.05 ? ': ' + gap.toFixed(1).replace('.', ',') + ' puntos menos de lo necesario.' : '; cubre lo necesario.'))),
        levers(),
        card('Asset allocation', more('aa', 'Gráfico', h('div', { className: 'r3-chart' }, C('DonutChart', { size: 'sm', interactive: true, legend: true, look: 'ramp', formatValue: (x) => x + ' %', centerLabel: s.aaApplied ? 'propuesta' : 'hoy', centerValue: '290', data: AAL.map(([k, l]) => ({ label: l, value: num((s.aaApplied || AA0)[k]) })), description: 'Reparto de la cartera financiera' }))), St({ tone: s.aaApplied ? 'success' : 'neutral', text: s.aaApplied ? 'Aplicada' : 'Sin aplicar' }))];
      else if (cur.k === 'pat') body = [
        card('Patrimonio hoy', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(tA + tD, meur, 2)), h('span', { className: 'r2-muted' }, 'neto · activos ' + m1(tA) + ' · deudas ' + m1(tD))), this.hoy(data, tA, tD, big)),
        card('Evolución hasta los ' + v.edad + ' · escenario medio', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(v.sc.med, meur, 2)), h('span', { className: 'r2-muted' }, 'lo que queda al final es el legado')), legBars(big ? 180 : 130))];
      else if (cur.k === 'liq') body = [
        verdict(liq),
        card('Liquidez generada año a año · escenario medio', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' + (v.worst < 0 ? ' r4-neg' : '') }, A(v.worst)), h('span', { className: 'r2-muted' }, v.worst < 0 ? 'peor año, ' + v.worstYear : 'el año más justo, ' + v.worstYear)), liqBars(big ? 160 : 120),
          h('ul', { className: 'r2-legend r4-legend' }, h('li', null, h('i', { className: 'r4-key' }), 'Ahorro'), h('li', null, h('i', { className: 'r4-key r4-key--neg' }), 'Necesidad de liquidez'))),
        card('Liquidez por escenario', plain(['Escenario', 'Liquidez'], [['Optimista', St({ tone: 'success', text: 'Suficiente' })], ['Medio', v.def ? St({ tone: 'warning', text: 'Déficit' }) : St({ tone: 'success', text: 'Suficiente' })], ['Pesimista', St({ tone: 'warning', text: 'Déficit' })]])),
        card('Colchón de liquidez', C('SummaryList', { rows: [{ label: 'Colchón inmediata', value: A(v.colchon) }, { label: 'Años con déficit · medio', value: String(v.def) }] }))];
      else if (cur.k === 'leg') body = [
        verdict(leg),
        card('Legado previsto a los ' + v.edad + ' · escenario medio', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(v.sc.med, meur, 2)), cov('med'))),
        card('Legado por escenario', plain(['Escenario', 'A los ' + v.edad, 'Legado'], [['Optimista', m1(v.sc.opt), cov('opt')], ['Medio', m1(v.sc.med), cov('med')], ['Pesimista', m1(v.sc.pes), cov('pes')]])),
        card('Objetivo', C('SummaryList', { rows: [{ label: 'Qué se conserva', value: (KEEP.find((x) => x.value === s.keep) || KEEP[0]).label }, { label: 'Legado objetivo', value: mGoal(v.goal) }, { label: 'Edad de seguridad', value: v.edad + ' años' }] }),
          h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => this.go('legado') }, 'Editar objetivos', I('arrow-right', 14)))];
      else body = [
        card('Rentabilidad necesaria frente a la actual', h('div', { className: 'r2-fig r2-fig--row' }, h('span', { className: 'r2-ai' }, I('sparkles', 14), 'Rentabilidad mínima necesaria'), h('strong', null, '4,6 %')), ruler(), h('p', { className: 'r2-hint' }, 'La cartera rinde un 2,4 % en el escenario medio (pesimista 2,1 % · optimista 2,6 %).')),
        card('Asset allocation', more('aa', 'Gráfico', h('div', { className: 'r3-chart' }, C('DonutChart', { size: 'sm', interactive: true, legend: true, look: 'ramp', formatValue: (x) => x + ' %', centerLabel: 'mil € hoy', centerValue: '290', data: [{ label: 'Renta variable', value: 55 }, { label: 'Renta fija', value: 25 }, { label: 'Monetario', value: 12 }, { label: 'Alternativos', value: 8 }], description: 'Reparto actual de la cartera financiera, ejemplo' }))), St({ tone: 'neutral', text: 'Sin aplicar' })),
        card('Generación de liquidez', h('p', { className: 'r2-hint' }, 'Sin configurar. Al configurarla, aquí aparecen las ventas previstas año a año y cómo cubren el déficit de ' + (v.def ? v.worstYear : 'liquidez') + '.'), h('div', null, C('Button', { variant: 'secondary', size: 'sm', onClick: () => this.go('gl') }, 'Configurar')))];
      /* 3.12: each optimisation flow shows its effect here, beside the page where it is edited */
      if (s.v312 && s.sim && (s.simChanges || []).length) {
        const old = this.modelFor({ sim: false }), secs = [];
        if (Math.abs(v.sc.med - old.sc.med) > 1000) secs.push('leg');
        if (v.def !== old.def || Math.abs(v.worst - old.worst) > 1) secs.push('liq');
        if (Math.abs(v.ren - old.ren) > 0.04) secs.push('opt');
        const ls = this.chgLines({ old, secs }, v);
        var simLs = ls;
        if (this.simLook()) {
          /* 3.13 options: no summary card; the sections that changed carry their own antes → ahora */
          if (this.simLook() !== 'beam') {
            this._simIx = 0;
            const RX = { leg: /Legado|Evolución/, liq: /Liquidez|Cobertura/, opt: /Rentabilidad|Optimizaciones/ }, done = {};
            body = body.map((el) => {
              if (!el || !el.props || String(el.props.className || '').indexOf('r4-ia__panel') < 0) return el;
              const kids = React.Children.toArray(el.props.children), hd = kids[0], txt = hd && hd.props ? String(hd.props.children) : '';
              const c = ls.find((x) => RX[x.k] && RX[x.k].test(txt)); if (!c) return el;
              const first = !done[c.k]; done[c.k] = true;
              const delta = first ? h('p', { key: 'simd', className: 'r4-simd' }, I('flask-conical', 14), h('span', { className: 'r4-was' }, c.from), I('arrow-right', 12), h('strong', null, c.to), c.d ? h('span', { className: 'r4-st--' + (c.good ? 'success' : 'warning') }, c.d) : null) : null;
              const ix = (this._simIx = (this._simIx || 0) + 1) - 1; return React.cloneElement(el, { className: el.props.className + ' is-simchg', style: Object.assign({}, el.props.style, { '--i': ix }) }, ...[hd, delta].concat(kids.slice(1)).filter(Boolean));
            });
          }
        } else body.unshift(h('div', { key: 'sim', className: 'r4-simcard' }, h('span', { className: 'r4-chgv__eyebrow' }, I('flask-conical', 14), 'Simulación frente al plan'),
          ls.length ? h('ul', { className: 'r4-chg r4-chg--ba' }, ls.map((c) => h('li', { key: c.k }, h('span', { className: 'r4-chg__b' }, h('span', { className: 'r4-chg__t' }, c.t), h('span', { className: 'r4-chg__v' }, h('span', { className: 'r4-was' }, c.from), I('arrow-right', 12), h('strong', null, c.to)), c.d ? h('span', { className: 'r4-chg__d r4-st--' + (c.good ? 'success' : 'warning') }, c.d) : null)))) : h('p', { className: 'r2-hint' }, 'La simulación todavía no cambia las cifras del plan.')));
      }
      if (s.v312 && cur.k === 'ren') {
        const sin = this.modelFor({ opts: [], oaEdit: null }).ren, n = (s.opts || []).length;
        body.splice(body.length - 2, 1); /* advisers know the levers; no «Cómo cerrar la diferencia» */
        body[body.length - 1] = card('Optimizaciones', list([{ label: 'Sin optimizaciones', value: pc1(sin) }, { label: s.oaEdit ? 'Con la que edita' : 'Con optimizaciones', value: pc1(v.ren) }, { label: 'Necesaria', value: '4,6 %' }]),
          h('p', { className: 'r2-hint' }, n ? n + (n === 1 ? ' optimización aplicada.' : ' optimizaciones aplicadas.') : 'Sin optimizaciones aplicadas.'),
          s.screen === 'aa' ? null : h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => this.go('aa') }, 'Asset allocation', I('arrow-right', 14)));
      }
      if (s.v312 && cur.k === 'liq' && v.net0.some((x) => x < 0) && (this.glActive() || v.def > 0)) {
        const ga = glAlloc(s.pat, s.glp, v.net0), rows = v.net0.map((x, i) => ({ y: YEAR0 + 1 + i, need: x < 0 ? -x : 0, left: ga.left[i] })).filter((r) => r.need > 0);
        body.splice(1, 0, card('Cobertura de la necesidad', h('div', { className: 'r4-figrow' }, h('strong', { className: 'r2-fig__v' }, A(ga.needT ? Math.round(ga.covered / ga.needT * 100) : 100, (x) => Math.round(x) + ' %')), h('span', { className: 'r2-muted' }, 'de ' + eur(Math.round(ga.needT)) + ' · ' + (this.glActive() ? 'con la desinversión · ' : 'sin plan de desinversión · ') + (ga.uncovered ? ga.uncovered + (ga.uncovered === 1 ? ' año sin cubrir' : ' años sin cubrir') : 'todos los años cubiertos'))),
          more('cov', 'Años', h('div', { className: 'r4-glyears r4-glyears--plan' }, rows.map((r) => h('div', { key: r.y, className: 'r4-glyear' + (r.left < 0.5 ? ' is-ok' : '') }, h('span', { className: 'r4-glyear__y' }, String(r.y)), h('div', { className: 'r4-cmp__track' }, h('i', { className: 'r4-cmp__fill r4-cmp__fill--after', style: { width: Math.max(0, (r.need - r.left) / r.need * 100) + '%' } })), h('span', { className: 'r4-glyear__t' }, r.left < 0.5 ? 'Cubierto' : 'Faltan ' + eur(Math.round(r.left)))))))));
      }
      return h(React.Fragment, null,
        h('div', { className: 'r3-plan__head' }, h('h2', null, 'El plan'), h('span', { className: 'r2-spacer' }), tools),
        h('div', { className: 'r4-tabsbar' }, h('p', { className: 'r4-sentence' }, busy && !s.v312 ? 'Recalculando el plan…' : sentence),
          v36 && vm === 'E' ? null : !v36 || vm === 'A' ? C('SegmentedControl', { className: v36 ? 'r4-seg-quiet' : undefined, value: view, onChange: (x) => this.setState((st) => ({ planView: x, iaTab: x === 'pagina' ? here[0] : st.iaTab })), options: [{ value: 'todo', label: 'Todo el plan' }, { value: 'pagina', label: 'Esta página' }] })
            : vm === 'D' ? C('Tooltip', { content: s.autoTab !== false ? 'Automático: al cambiar de página se abre su pestaña. Pulse para fijar la actual.' : 'Fijo: la pestaña no cambia al cambiar de página. Pulse para que la siga.', placement: 'bottom' },
                h('button', { type: 'button', className: 'r4-auto' + (s.autoTab !== false ? ' is-on' : ''), 'aria-pressed': s.autoTab !== false, onClick: () => this.setState((st) => { const on = !(st.autoTab !== false); return { autoTab: on, iaTab: on ? here[0] : st.iaTab }; }) },
                  h('span', { className: 'r4-auto__dot', 'aria-hidden': true }), 'Automático'))
            : vm === 'C' ? h('label', { className: 'r4-autotab' }, C('Toggle', { checked: s.autoTab !== false, onChange: (x) => this.setState({ autoTab: typeof x === 'boolean' ? x : !(s.autoTab !== false) }), 'aria-label': 'Abrir la pestaña de esta página' }), h('span', null, 'Abrir la de esta página')) : null),
        h('div', { className: 'r4-ttabs' + (v36 ? ' r4-ttabs--calm' : '') + (s.tabStyle === 'line' ? ' r4-ttabs--line' : s.tabStyle ? ' r4-ttabs--' + s.tabStyle : ''), role: 'tablist', 'aria-label': 'Partes del plan' }, shown.map((t) => h('button', { key: t.k, type: 'button', role: 'tab', 'aria-selected': cur.k === t.k, className: 'r4-ttab' + (cur.k === t.k ? ' is-on' : '') + (isNew(t.k) ? ' is-ai' : '') + (this.simLook() && simLs && simLs.find((x) => x.tab === t.k) ? ' is-simt' : ''), onClick: () => go(t.k) },
          v36 && vm === 'B' && here.indexOf(t.k) >= 0 ? h('span', { className: 'r4-ttab__here' }, 'Esta página') : null,
          h('span', { className: 'r4-ttab__h' }, s.v312 ? h('span', { className: 'r4-ttab__ic' + (isNew(t.k) ? ' is-ai' : '') + (isNew(t.k) && diff && diff.cause === 'Con la simulación aplicada' ? ' is-fill' : '') + (busy ? ' is-busy' : '') }, I(t.icon, 14)) : I(t.icon, 14), t.title, !s.v312 && isNew(t.k) ? h('span', { className: 'r4-ttab__ai', 'aria-label': 'Actualizado' }, I('sparkles', 12)) : null),
          h('strong', null, t.fig, (() => { const c = s.tabStyle === 'seg2' && this.simLook() && simLs && simLs.find((x) => x.tab === t.k); return c ? h('em', { className: 'r4-ttab__chg' }, c.k === 'liq' ? h(React.Fragment, null, I('arrow-right', 12), c.to) : (c.d || c.to)) : null; })()), h('span', { className: 'r4-ttab__s r4-st--' + t.tone }, icon(t.tone), t.sub),
          (() => { const c = this.simLook() && simLs && simLs.find((x) => x.tab === t.k); return c ? h('span', { className: 'r4-ttab__sim' }, I('flask-conical', 12), c.k === 'liq' ? c.to : (c.d || c.to)) : (s.v312 && /frame/.test(s.look || '') ? h('span', { className: 'r4-ttab__sim is-empty', 'aria-hidden': true }, I('flask-conical', 12), '\u00a0') : null); })()))),
        /* 3.14 · «less busy» layouts (planDensity): fold = one line per section, one open; one = one section at a time; quiet = smaller charts and titles */
        (() => { const d = s.planDensity; if (!d) return null;
          if (d === 'quiet') {
            const ttl = (el) => { const h4 = [].concat(el && el.props ? el.props.children : []).find((x) => x && x.type === 'h4'); return h4 ? String(h4.props.children) : ''; };
            const vi = body.findIndex((x) => x && x.props && /r4-verdict/.test(x.props.className || ''));
            const si = body.findIndex((x) => /por escenario$/.test(ttl(x)));
            if (vi >= 0 && si > vi) { const sc = body[si], kids = [].concat(sc.props.children).filter((x) => !(x && x.type === 'h4')), v0 = body[vi], vk = [].concat(v0.props.children), inner = vk[vk.length - 1], o = !!s.scenOpen, chg = /is-simchg/.test(sc.props.className || '');
              /* the verdict is a banner again; its scenarios open inside it with «Ver escenarios», like «Ver desglose» */
              const extra = h(React.Fragment, { key: 'scen' },
                h('button', { type: 'button', className: 'r4-leglink r4-scenlink', 'aria-expanded': o, onClick: () => this.setState((st) => ({ scenOpen: !st.scenOpen })) }, o ? 'Ocultar escenarios' : 'Ver escenarios', I(o ? 'chevron-up' : 'chevron-down', 14)),
                C('Reveal', { open: o }, h('div', { className: 'r4-scenin' + (chg ? ' is-simchg' : '') }, ...kids)));
              const v1 = React.cloneElement(v0, { className: v0.props.className + ' r4-verdict--banner' }, ...vk.slice(0, -1), React.cloneElement(inner, null, ...[].concat(inner.props.children), extra));
              body = body.map((x, i) => i === vi ? v1 : x).filter((x, i) => i !== si); }
            body = body.map((el) => ttl(el) === 'Objetivo' ? React.cloneElement(el, null, ...[].concat(el.props.children).filter((x) => !(x && x.props && /r4-verdict__act/.test(x.props.className || ''))) ) : el);
            return null; }
          const isCard = (el) => el && el.props && /r4-tcard/.test(el.props.className || '');
          const kidsOf = (el) => [].concat(el.props.children);
          const title = (el) => { const h4 = kidsOf(el).find((x) => x && x.type === 'h4'); return h4 ? String(h4.props.children) : ''; };
          const SHORT = { 'Patrimonio hoy': 'Hoy', 'Evolución hasta los 100 años': 'Evolución', 'Legado por escenario': 'Escenarios', 'Objetivo': 'Objetivo', 'Liquidez generada año a año · escenario medio': 'Año a año', 'Liquidez por escenario': 'Escenarios', 'Colchón de liquidez': 'Colchón', 'Por titular': 'Titulares' };
          const cards = body.filter(isCard), rest = body.filter((x) => !isCard(x));
          if (d === 'fold') { const open = s.foldOpen || (cards[0] && title(cards[0]));
            body = rest.concat(cards.map((el, i) => { const t = title(el), kids = kidsOf(el).filter((x) => !(x && x.type === 'h4')), fig = kids.find((x) => x && x.props && /fig/.test(x.props.className || ''));
              return C('Accordion', { key: 'f' + i, className: 'r4-fold r4-pfold' + (/is-simchg/.test(el.props.className || '') ? ' is-simchg' : ''), open: t === open, onToggle: (o) => this.setState({ foldOpen: o ? t : '—' }),
                summary: h('span', { className: 'r4-pfold__sum' }, h('strong', null, t), fig ? h('span', { className: 'r4-pfold__fig' }, fig) : null) }, ...kids); })); }
          if (d === 'one' && cards.length) { const sel = cards.some((c) => title(c) === s.oneSel) ? s.oneSel : title(cards[0]);
            body = rest.concat([h('div', { key: 'one', className: 'r4-pone' }, C('SegmentedControl', { value: sel, onChange: (x) => this.setState({ oneSel: x }), options: cards.map((c) => ({ value: title(c), label: SHORT[title(c)] || title(c).split(' ')[0] })) }))]).concat(cards.filter((c) => title(c) === sel)); }
          return null; })(),
        h('div', { className: 'r3-plan__body r4-ia r4-tbody' + (v36 ? ' r4-tbody--v36' : '') + (busy ? ' is-busy' : '') + (s.planDensity ? ' r4-dens--' + s.planDensity : ''), role: 'tabpanel', key: cur.k + view }, ...body), s.v312 && s.chat === 'A' ? this.chatField('A') : null);
    }

    /* ---------- Crazy 8s: eight ways to organise El plan (estado.ia = tabs|tiles|questions|score|timeline|attention|headline|context) ---------- */
    planIA(kind, c) {
      const s = this.state, { v, busy, leg, liq, tools, big } = c, nCover = ['opt', 'med', 'pes'].filter((k) => v.cover[k]).length;
      const ages = v.medio.map((_, i) => (i === 0 ? 'Hoy' : String(AGE0 + i))), years = v.net.map((_, i) => String(YEAR0 + 1 + i));
      const head = h('div', { className: 'r3-plan__head' }, h('h2', null, 'El plan'), h('span', { className: 'r2-spacer' }), tools);
      const icon = (t) => I(t === 'success' ? 'circle-check' : t === 'neutral' ? 'circle-dashed' : 'triangle-alert', 16);
      const oaOn = s.v312 && ((s.opts || []).length || s.oaEdit), glOn = s.v312 && this.glActive();
      const legBase = oaOn ? this.modelFor({ opts: [], oaEdit: null }).medio : null;
      const legBars = (hgt) => h(Bars, { base: legBase, baseLabel: 'Sin optimizaciones', nowLabel: 'Con optimizaciones', values: v.medio, labels: ages, goal: v.goal, goalLabel: 'Objetivo · ' + mGoal(v.goal), mark: (v.ra || RETIRE) - AGE0, markLabel: 'Jubilación · ' + (v.ra || RETIRE), format: eur, height: hgt || 120, label: 'Patrimonio previsto por edad' });
      const liqBars = (hgt) => h(Bars, { base: glOn ? v.net0 : null, baseLabel: 'Sin desinversión', nowLabel: 'Con desinversión', values: v.net, labels: years, mark: null, format: eur, height: hgt || 110, label: glOn ? 'Con desinversión' : 'Liquidez anual' });
      const ruler = () => h(Ruler, { required: 4.6, actual: 2.4, range: [2.1, 2.6] });
      const ITEMS = [
        { k: 'leg', icon: 'landmark', title: 'Legado', q: '¿Cubre el legado objetivo?', ans: nCover === 3 ? 'Sí, en los tres escenarios' : nCover ? 'Solo en ' + nCover + ' de 3 escenarios' : 'No, en ningún escenario', tone: leg.tone, fig: m1(v.sc.med), sub: 'previsto a los ' + v.edad, detail: () => legBars() },
        { k: 'liq', icon: 'droplets', title: 'Liquidez', q: '¿Hay liquidez todos los años?', ans: v.def ? 'No: déficit en ' + v.def + ' años, el peor en ' + v.worstYear : 'Sí, sin vender activos', tone: liq.tone, fig: v.def ? eur(v.worst) : 'OK', sub: v.def ? 'peor año, ' + v.worstYear : 'todos los años', detail: () => liqBars() },
        { k: 'opt', icon: 'sparkles', title: 'Rentabilidad', q: '¿Qué rentabilidad necesita el plan?', ans: '4,6 % al año; la cartera da 2,4 %', tone: 'warning', fig: '4,6 %', sub: 'mínima necesaria', detail: () => ruler() }];
      const pick = (k) => ITEMS.find((x) => x.k === k);
      const wrap = (cls, ...kids) => h(React.Fragment, null, head, h('div', { className: 'r3-plan__body r4-ia r4-ia--' + cls + (busy ? ' is-busy' : '') }, ...kids));
      if (kind === 'tabs2') return this.planTabs(c, { head, icon, legBars, liqBars, ruler, nCover });
      if (kind === 'tabs') {
        const t = s.iaTab || 'leg', it = pick(t);
        return wrap('tabs', C('SegmentedControl', { value: t, onChange: (x) => this.setState({ iaTab: x }), options: ITEMS.map((x) => ({ value: x.k, label: x.title })) }),
          h('div', { className: 'r4-ia__panel' }, h('div', { className: 'r4-ia__big' }, h('span', { className: 'r4-st r4-st--' + it.tone }, icon(it.tone), it.ans), h('strong', null, it.fig), h('small', null, it.sub)), it.detail()));
      }
      if (kind === 'tiles') {
        const sel = s.iaSel || null;
        return wrap('tiles', h('div', { className: 'r4-tiles' }, ITEMS.map((x) => h('button', { key: x.k, type: 'button', className: 'r4-tile r4-st--' + x.tone + (sel === x.k ? ' is-on' : ''), onClick: () => this.setState({ iaSel: sel === x.k ? null : x.k }) },
            h('span', { className: 'r4-tile__h' }, I(x.icon, 16), x.title), h('strong', null, x.fig), h('span', { className: 'r4-tile__s' }, icon(x.tone), x.sub)))),
          sel ? h('div', { className: 'r4-ia__panel' }, h('p', { className: 'r4-ia__ans' }, pick(sel).ans), pick(sel).detail()) : h('p', { className: 'r2-hint' }, 'Pulse una tarjeta para ver el detalle.'));
      }
      if (kind === 'questions') {
        return wrap('questions', ITEMS.map((x) => C('Accordion', { key: x.k, className: 'r4-qa', open: (s.iaQ || 'leg') === x.k, onToggle: (o) => this.setState({ iaQ: o ? x.k : null }),
          summary: h('span', { className: 'r4-qa__s' }, h('span', { className: 'r4-qa__q' }, x.q), h('span', { className: 'r4-st r4-st--' + x.tone }, icon(x.tone), x.ans)) }, h('div', { className: 'r4-ia__panel' }, x.detail()))));
      }
      if (kind === 'score') {
        const rows = [['Legado previsto a los ' + v.edad, m1(v.sc.med), leg.tone], ['Escenarios que cubren el objetivo', nCover + ' de 3', leg.tone], ['Años con déficit de liquidez', String(v.def), liq.tone], ['Peor año de liquidez', v.def ? eur(v.worst) : '—', liq.tone], ['Rentabilidad necesaria / actual', '4,6 % / 2,4 %', 'warning'], ['Patrimonio neto hoy', m1(v.pat), 'neutral']];
        return wrap('score', h('ul', { className: 'r4-score' }, rows.map(([l, val, t], i) => h('li', { key: i }, h('i', { className: 'r4-score__dot r4-st--' + t }), h('span', null, l), h('strong', null, val)))),
          h('button', { type: 'button', className: 'r4-verdict__act', onClick: () => this.setState({ iaQ: s.iaQ === 'charts' ? null : 'charts' }) }, s.iaQ === 'charts' ? 'Ocultar gráficos' : 'Ver gráficos', I('arrow-right', 14)),
          s.iaQ === 'charts' ? h('div', { className: 'r4-ia__panel' }, legBars(), liqBars()) : null);
      }
      if (kind === 'timeline') {
        const marks = [['Hoy', 'Patrimonio ' + m1(v.pat), 'neutral'], [String(v.ra || RETIRE), 'Jubilación', 'neutral'], v.def ? [String(v.worstYear), 'Peor año de liquidez · ' + eur(v.worst), 'warning'] : null, [String(v.edad), 'Legado ' + m1(v.sc.med) + (v.cover.med ? ' · cubre' : ' · no cubre'), leg.tone]].filter(Boolean);
        return wrap('timeline', h('p', { className: 'r4-ia__ans' }, 'Del patrimonio de hoy al legado, año a año.'), legBars(150),
          h('ol', { className: 'r4-tl' }, marks.map(([w, t, tone], i) => h('li', { key: i, className: 'r4-st--' + tone }, h('b', null, w), h('span', null, t)))));
      }
      if (kind === 'attention') {
        const bad = ITEMS.filter((x) => x.tone !== 'success'), good = ITEMS.filter((x) => x.tone === 'success');
        return wrap('attention', h('h4', { className: 'r4-ia__eyebrow' }, 'Necesita atención · ' + bad.length),
          bad.map((x) => h('div', { key: x.k, className: 'r4-att' }, h('div', { className: 'r4-att__h r4-st--' + x.tone }, icon(x.tone), h('strong', null, x.title), h('span', null, x.ans)), x.detail())),
          good.length ? h('div', { className: 'r4-ok' }, I('circle-check', 16), good.map((x) => x.title + ': ' + x.ans).join(' · ')) : null);
      }
      if (kind === 'headline') {
        const sentence = (nCover === 3 ? 'El legado se cubre' : 'El legado está en riesgo') + (v.def ? ', pero habrá déficit de liquidez en ' + v.worstYear + '.' : ' y la liquidez alcanza todos los años.');
        if (s.iaDetail) return wrap('headline', h('button', { type: 'button', className: 'r4-back', onClick: () => this.setState({ iaDetail: false }) }, I('chevron-left', 16), 'Resumen'), ITEMS.map((x) => h('div', { key: x.k, className: 'r4-ia__panel' }, h('h4', { className: 'r4-ia__eyebrow' }, x.title), x.detail())));
        return wrap('headline', h('p', { className: 'r4-headline' }, sentence),
          h('div', { className: 'r4-tiles r4-tiles--flat' }, ITEMS.map((x) => h('div', { key: x.k, className: 'r4-tile r4-st--' + x.tone }, h('span', { className: 'r4-tile__h' }, x.title), h('strong', null, x.fig), h('span', { className: 'r4-tile__s' }, icon(x.tone), x.sub)))),
          C('Button', { variant: 'secondary', size: 'sm', iconEnd: I('arrow-right', 14), onClick: () => this.setState({ iaDetail: true }) }, 'Ver el análisis completo'));
      }
      /* context: only what this page moves; the rest as chips */
      const main = s.screen === 'patrimonio' || s.screen === 'legado' ? 'leg' : s.screen === 'aa' || s.screen === 'gl' ? 'opt' : 'liq', it = pick(main);
      return wrap('context', h('h4', { className: 'r4-ia__eyebrow' }, 'Lo que mueve esta página'),
        h('div', { className: 'r4-ia__panel' }, h('div', { className: 'r4-ia__big' }, h('span', { className: 'r4-st r4-st--' + it.tone }, icon(it.tone), it.ans), h('strong', null, it.fig), h('small', null, it.sub)), it.detail(160)),
        h('h4', { className: 'r4-ia__eyebrow' }, 'El resto del plan'),
        h('div', { className: 'r4-chips' }, ITEMS.filter((x) => x.k !== main).map((x) => h('span', { key: x.k, className: 'r4-chip r4-st--' + x.tone }, icon(x.tone), x.title + ' · ' + x.fig))));
    }

    /* ---------- v3.2: the path in the top bar: Planificaciones › client › plan name (renamable) · status (menu) ---------- */
    topPath() {
      const s = this.state, name = s.planName || 'Plan patrimonial', st = s.status || 'Borrador';
      const STS = [['Borrador', 'neutral', 'Se puede editar todo.'], ['Cumplimentada', 'info', 'Datos completos; pendiente de revisar.'], ['Entregada', 'success', 'Enviada al cliente. Se edita creando una copia.'], ['Descargada', 'neutral', 'El informe se ha descargado.']];
      const tone = (STS.find((x) => x[0] === st) || STS[0])[1];
      const commit = (v) => { const t = (v || '').trim(); this.setState({ renaming: false, planName: t || name }); if (t && t !== name) this.toast('Planificación renombrada: «' + t + '».'); };
      const nameEl = s.renaming
        ? h('span', { className: 'r4-rename' }, C('Input', { size: 'sm', defaultValue: name, autoFocus: true, 'aria-label': 'Nombre de la planificación', onBlur: (e) => commit(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') commit(e.target.value); if (e.key === 'Escape') this.setState({ renaming: false }); } }))
        : C('Tooltip', { content: 'Cambiar el nombre', placement: 'bottom' }, h('button', { type: 'button', className: 'r4-crumb r4-crumb--current', onClick: () => this.setState({ renaming: true }) }, name, h('span', { className: 'r4-crumb__edit' }, I('pencil', 13))));
      const statusMenu = C('Popover', { align: 'start', width: '300px', title: 'Estado de la planificación', open: s.pop === 'status', onOpenChange: (o) => this.setState({ pop: o ? 'status' : null }),
        trigger: h('button', { type: 'button', className: 'r4-status r4-st--' + tone, 'aria-label': 'Estado: ' + st + '. Cambiar' }, h('i', { className: 'r4-status__dot' }), st, I('chevron-down', 14)) },
        h('div', { className: 'r4-menu', role: 'menu' }, STS.map(([k, t, d]) => h('button', { key: k, type: 'button', role: 'menuitemradio', 'aria-checked': k === st, className: 'r4-menu__item' + (k === st ? ' is-on' : ''), onClick: () => { this.setState({ status: k, pop: null }); if (k !== st) this.toast('Estado cambiado a «' + k + '».'); } },
          h('span', { className: 'r4-st--' + t + ' r4-menu__dot' }, h('i', { className: 'r4-status__dot' })), h('span', { className: 'r4-menu__t' }, h('strong', null, k), h('small', null, d)), k === st ? I('check', 16) : null))));
      return h('nav', { className: 'r4-path', 'aria-label': 'Ruta' },
        h('button', { type: 'button', className: 'r4-crumb', onClick: () => this.setState({ home: true, open: null, adding: false, pop: null }) }, I('chevron-left', 16), 'Planificaciones'),
        h('span', { className: 'r4-path__sep', 'aria-hidden': true }, '/'),
        h('span', { className: 'r4-crumb r4-crumb--muted' }, 'Andrés Molina Vega'),
        h('span', { className: 'r4-path__sep', 'aria-hidden': true }, '/'),
        nameEl, statusMenu);
    }

    /* ---------- v3.2: Configuración and Notas live in the top bar, as popovers ---------- */
    topEnd() {
      const s = this.state, notes = s.notes || NOTES, pop = (k) => ({ open: s.pop === k, onOpenChange: (o) => this.setState({ pop: o ? k : null }) });
      const field = (label, control, help) => h('div', { className: 'r4-frow', key: label }, h('div', { className: 'r4-frow__l' }, h('span', null, label), help ? h('small', null, help) : null), h('div', { className: 'r4-frow__c' }, control));
      const cfg = s.cfg || { esc: 'Medio', ipc: '2,00', rev: '2,00', fin: '7,50' };
      const setCfg = (k) => (e) => this.setState((st) => ({ cfg: Object.assign({}, st.cfg || cfg, { [k]: e && e.target ? e.target.value : e }) }));
      const cfgPop = C('Popover', Object.assign({ align: 'end', width: '380px', title: 'Configuración', description: 'Supuestos del plan. Al cambiarlos, el plan se recalcula.',
        trigger: C('IconButton', { variant: 'ghost', size: 'sm', label: 'Configuración' }, I('settings-2', 18)) }, pop('cfg')),
        h('div', { className: 'r4-pop' },
          field('Escenario', C('Select', { size: 'sm', value: cfg.esc, options: ['Pesimista', 'Medio', 'Optimista'].map((x) => ({ value: x, label: x })), onChange: setCfg('esc') })),
          field('Edad de seguridad', C('Input', { size: 'sm', value: String(s.edad), suffix: 'años', inputMode: 'numeric', onChange: (e) => this.setState({ edad: e.target.value }) })),
          field('IPC', C('Input', { size: 'sm', value: cfg.ipc, suffix: '%', inputMode: 'decimal', onChange: setCfg('ipc') })),
          field('Revalorización del ahorro', C('Input', { size: 'sm', value: cfg.rev, suffix: '%', inputMode: 'decimal', onChange: setCfg('rev') })),
          field('Coste de financiación', C('Input', { size: 'sm', value: cfg.fin, suffix: '%', inputMode: 'decimal', onChange: setCfg('fin') }))));
      const add = () => { const t = (s.noteDraft || '').trim(); if (!t) return; this.setState((st) => ({ notes: [[t, '26/11/2026']].concat(st.notes || NOTES), noteDraft: '' })); this.toast('Nota añadida.'); };
      const notesPop = C('Popover', Object.assign({ align: 'end', width: '380px', title: 'Notas', description: notes.length + ' notas de esta planificación',
        trigger: s.v311 ? C('Button', { variant: 'ghost', size: 'sm', className: 'r4-notesbtn', iconStart: I('notebook-pen', 16), 'aria-label': 'Notas, ' + notes.length }, h('span', { className: 'r4-notesbtn__n' }, String(notes.length))) : h('span', { className: 'r4-countwrap' }, C('IconButton', { variant: 'ghost', size: 'sm', label: 'Notas, ' + notes.length }, I('sticky-note', 18)), h('span', { className: 'r4-count', 'aria-hidden': true }, notes.length)) }, pop('notas')),
        h('div', { className: 'r4-pop' },
          h('div', { className: 'r4-notelist' }, notes.map((n, i) => h('div', { key: i, className: 'r2-note' }, n[0], h('small', null, n[1])))),
          C('Textarea', { label: 'Nueva nota', rows: 2, value: s.noteDraft || '', onChange: (e) => this.setState({ noteDraft: e.target.value }) }),
          h('div', { className: 'r2-actions' }, h('span', { className: 'r2-spacer' }), C('Button', { variant: 'primary', size: 'sm', disabled: !(s.noteDraft || '').trim(), onClick: add }, 'Añadir nota'))));
      return h('span', { className: 'r4-topend' }, s.v312 && s.chat === 'C' ? this.chatField('C') : null, s.v312 && s.agentUI === true ? this.simPill() : null, cfgPop, notesPop, h('span', { className: 'r4-topsep', 'aria-hidden': true }), h('span', { className: 'r4-user', title: 'Gestor Afi', 'aria-label': 'Gestor Afi' }, 'GA'));
    }

    /* ---------- pages ---------- */
    go(key) { this.setState((st) => ({ subs: (key === 'aa' || key === 'gl') ? Array.from(new Set((st.subs || []).concat(key))) : st.subs, screen: key, open: null, adding: false, draft: null, sort: null, cell: null, secs: Array.from(new Set((st.secs || (CTX[st.screen] || CTX.ingresos)[0]).concat((CTX[key] || CTX.ingresos)[0]))) })); }
    /* 3.12: page-header buttons use the DS small size (28 px); flow-finishing buttons keep 32 px */
    smBtn(el) {
      if (!this.state.v312 || !el || !el.props) return el;
      if (el.props.variant) return React.cloneElement(el, { size: 'sm' });
      const ch = el.props.children;
      if (ch && ch.props && ch.props.variant) return React.cloneElement(el, null, React.cloneElement(ch, { size: 'sm' }));
      return el;
    }
    head(title, text, action) {
      return h('header', { className: 'r4-head' },
        h('div', { className: 'r4-head__row' }, h('h1', null, title), h('span', { className: 'r2-spacer' }), this.smBtn(action) || null),
        text ? h('p', null, text) : null);
    }
    newBtn(label) { return C('Tooltip', { content: label, shortcut: 'N', placement: 'bottom' }, C('Button', { variant: 'primary', iconStart: I('plus'), 'aria-keyshortcuts': 'N', 'aria-label': this.state.v311 ? label : undefined, className: this.state.v311 ? 'r4-newbtn' : undefined, onClick: () => this.startNew() }, this.state.v311 ? h('span', { className: 'r4-btnl' }, label) : label)); }
    legadoPage() {
      const s = this.state, goal = this.goal();
      const set = (k) => (e) => this.setState({ [k]: e && e.target ? e.target.value : e });
      const edadF = C('Input', { label: 'Edad de seguridad', value: String(s.edad), suffix: 'años', inputMode: 'numeric', onChange: set('edad'), help: 'Edad actual del cliente: 55 años · esperanza de vida: 100.' });
      const keepF = h('div', { className: 'r4-form' },
        C('Select', { label: 'Qué se conserva', value: s.keep, options: KEEP, onChange: (x) => this.setState({ keep: x }) }),
        s.keep === 'manual' ? h('div', { className: 'r4-assets' }, h('span', { className: 'r4-label' }, 'Activos a conservar'),
          s.pat.map((a) => h('div', { key: a.id, className: 'r4-asset' }, C('Checkbox', { label: a.nombre, checked: s.keepIds.indexOf(a.id) >= 0, onChange: (c) => this.setState((st) => ({ keepIds: c ? st.keepIds.concat(a.id) : st.keepIds.filter((x) => x !== a.id) })) }), h('span', { className: 'r2-amount' }, eur(a.valor))))) : null,
        s.keep === 'manual' ? C('Input', { label: 'Patrimonio adicional', value: fmt(num(s.extra)), suffix: '€', inputMode: 'decimal', onChange: set('extra'), help: 'Un importe que se quiere dejar además de los activos.' }) : null,
        h('div', { className: 'r4-goal' }, h('span', { className: 'r2-fig__l' }, 'Legado objetivo'), h('strong', null, A(goal))));
      if (s.firstRun) {
        return h('div', { className: 'r2-main ap-in', key: 'legado-ob' + s.obStep },
          this.head('Antes de continuar', 'Complete estos dos pasos para definir los objetivos de la planificación. Podrá modificarlos más adelante desde «Legado y colchón de liquidez».'),
          C('Stepper', { steps: ['Edad de seguridad', 'Legado objetivo'], current: s.obStep - 1, label: 'Objetivos de la planificación' }),
          s.obStep === 1
            ? h('section', { className: 'r4-sec' }, h('h2', null, 'Edad de seguridad'), h('p', null, 'Es la edad hasta la que la planificación debe garantizar que el cliente mantiene su nivel de vida. Se recomienda un valor prudente, por encima de la esperanza de vida.'), h('div', { className: 'r4-form r4-form--narrow' }, edadF))
            : h('section', { className: 'r4-sec' }, h('h2', null, 'Legado objetivo'), h('p', null, 'Patrimonio que el cliente quiere conservar al llegar a la edad de seguridad, para transmitirlo o como reserva.'), keepF),
          h('div', { className: 'r2-actions r4-end' },
            s.obStep === 2 ? C('Button', { variant: 'ghost', onClick: () => this.setState({ obStep: 1 }) }, 'Atrás') : null,
            C('Button', { variant: 'primary', onClick: () => s.obStep === 1 ? this.setState({ obStep: 2 }) : (this.setState({ firstRun: false }), this.toast('Objetivos guardados. El plan se ha calculado.')) }, s.obStep === 1 ? 'Continuar' : 'Guardar objetivos')));
      }
      if (s.v312) {
        /* 3.13: verdict first; the legacy (age + what is kept, with its make-up) and the cash cushion as two sections */
        const v = this.compute(), ok = v.cover.opt && v.cover.med && v.cover.pes, n = ['opt', 'med', 'pes'].filter((k) => v.cover[k]).length, mg = v.sc.med - goal;
        const verdict = h('div', { className: 'r4-verdict r4-st--' + (ok ? 'success' : 'warning') }, I(ok ? 'circle-check' : 'triangle-alert', 16),
          h('div', null, h('strong', null, ok ? 'El legado se cubre en los tres escenarios' : 'El legado se cubre en ' + n + ' de 3 escenarios'),
            h('p', null, (mg >= 0 ? 'Margen de ' : 'Faltan ') + mGoal(Math.abs(mg)) + ' en el escenario medio, a los ' + v.edad + ' años.')));
        const parts = s.keep === 'patrimonio' ? [['Todo el patrimonio', s.pat.reduce((x, a) => x + num(a.valor), 0)]]
          : s.keep === 'vivienda' ? s.pat.filter((a) => a.id === 'a1').map((a) => [a.nombre, num(a.valor)])
          : s.pat.filter((a) => s.keepIds.indexOf(a.id) >= 0).map((a) => [a.nombre, num(a.valor)]).concat(num(s.extra) ? [['Patrimonio adicional', num(s.extra)]] : []);
        const edadF2 = C('Input', { label: 'Edad de seguridad', value: String(s.edad), suffix: 'años', inputMode: 'numeric', onChange: set('edad'), help: 'El cliente tiene ' + AGE0 + ' años.' });
        const amt = (n, d) => h('span', { className: 'r4-leg__cc' }, h('strong', null, n), h('span', null, d));
        const keepF2 = h('div', { className: 'r4-form r4-leg__form' },
          C('ChoiceCardGroup', { label: 'Qué se conserva', name: 'keep', columns: 3, value: s.keep, onChange: (x) => this.setState({ keep: x }), options: [
            { value: 'patrimonio', title: 'Mantener el patrimonio', help: amt(mGoal(s.pat.reduce((x, a) => x + num(a.valor), 0)), 'Todo, neto de deudas') },
            { value: 'vivienda', title: 'Mantener la vivienda', help: amt(mGoal(num((s.pat.find((a) => a.id === 'a1') || {}).valor)), 'Vivienda Chamartín') },
            { value: 'manual', title: 'Definir manualmente', help: s.keepIds.length || num(s.extra) ? amt(mGoal(s.pat.filter((a) => s.keepIds.indexOf(a.id) >= 0).reduce((x, a) => x + num(a.valor), 0) + num(s.extra)), s.keepIds.length + (s.keepIds.length === 1 ? ' activo' : ' activos') + (num(s.extra) ? ' y un importe' : '')) : amt('—', 'Elija los activos') }] }),
          h('div', { className: 'r4-form r4-form--two r4-leg__row' }, edadF2,
            C('Input', { label: C('Tooltip', { content: 'Liquidez disponible al momento (cuentas y depósitos) que se mantiene siempre y no se usa para cubrir gastos.' }, h('span', { className: 'afi-tooltip-v2__term', tabIndex: 0 }, 'Colchón de liquidez')), value: fmt(num(s.colchon)), suffix: '€', inputMode: 'decimal', onChange: set('colchon'), help: 'Siempre disponible, en todos los años.' })),
          C('Reveal', { open: s.keep === 'manual' }, h('div', { className: 'r4-leg__manual' },
          s.keep === 'manual' ? h('div', { className: 'r4-leg__pick' },
            (() => { const assets = s.pat.filter((a) => a.grupo !== 'deu'), sel = {}; s.keepIds.forEach((id) => { sel[id] = { on: true }; });
              const tog = (a) => this.setState((st) => ({ keepIds: st.keepIds.indexOf(a.id) >= 0 ? st.keepIds.filter((x) => x !== a.id) : st.keepIds.concat(a.id) }));
              return this.pickTable({ title: 'Activos a conservar', assets, grouped: true, sel, toggle: tog, onRow: tog, toggleAll: (x) => this.setState({ keepIds: x ? assets.map((a) => a.id) : [] }), cols: [{ h: 'Valor', kind: 'monetary', cell: (a) => h('span', { className: 'r2-amount r4-nowrap' }, A(num(a.valor))) }] }); })()) : null,
          s.keep === 'manual' ? C('Input', { label: 'Patrimonio adicional', value: fmt(num(s.extra)), suffix: '€', inputMode: 'decimal', onChange: set('extra'), help: 'Un importe que se quiere dejar además de los activos.' }) : null)),
          h('dl', { className: 'r4-stats r4-leg__stats' },
            h('div', { className: 'r4-stat' }, h('dt', null, 'Legado objetivo'), h('dd', null, A(goal))),
            parts.map(([k, x]) => h('div', { key: k, className: 'r4-stat' }, h('dt', null, k), h('dd', null, A(x))))));
        return h('div', { className: 'r2-main ap-in', key: 'legado' },
          this.head('Legado y colchón de liquidez', 'Los objetivos del plan. El plan, a la derecha, comprueba en cada escenario si se cumplen.'),
          verdict,
          h('section', { className: 'r4-sec' }, h('h2', null, 'Objetivos'), h('p', null, 'Qué quiere conservar el cliente al llegar a la edad de seguridad, y qué liquidez quiere tener siempre disponible. La edad de seguridad es también el horizonte de todos los cálculos.'), keepF2));
      }
      return h('div', { className: 'r2-main ap-in', key: 'legado' },
        this.head('Legado y colchón de liquidez', 'Los objetivos del plan. El plan, a la derecha, comprueba en cada escenario si se cumplen.'),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Datos generales'), h('p', null, 'La edad de seguridad es el horizonte de los cálculos: hasta ella se cubre el nivel de vida del cliente. El colchón es liquidez que se mantiene siempre disponible y no se usa para cubrir gastos.'),
          h('div', { className: 'r4-form r4-form--two' }, edadF, C('Input', { label: 'Colchón de liquidez inmediata', value: fmt(num(s.colchon)), suffix: '€', inputMode: 'decimal', onChange: set('colchon') }))),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Legado objetivo'), h('p', null, 'Patrimonio que el cliente quiere conservar al llegar a la edad de seguridad.'), keepF));
    }
    /* ---------- 3.6: Optimizaciones › Asset allocation ---------- */
    aaPage() {
      const s = this.state, d = s.aaDraft || s.aaApplied || AA0, applied = s.aaApplied || AA0;
      const total = AAL.reduce((t, [k]) => t + num(d[k]), 0), ok = Math.round(total) === 100;
      const now = aaRetOf(applied), next = aaRetOf(d), dirty = AAL.some(([k]) => num(d[k]) !== num(applied[k]));
      const set = (k) => (e) => { const x = e && e.target ? e.target.value : e; this.setState((st) => ({ aaDraft: Object.assign({}, st.aaDraft || st.aaApplied || AA0, { [k]: x }) })); };
      const delta = (k) => { const x = num(d[k]) - AA0[k]; return x === 0 ? h('span', { className: 'r2-muted' }, '—') : h('span', { className: 'r4-delta' + (x > 0 ? ' is-up' : ' is-down') }, (x > 0 ? '+' : '−') + Math.abs(x) + ' p.p.'); };
      const apply = () => { if (!ok) return; this.setState({ aaApplied: Object.assign({}, d), aaDraft: null, lastCause: 'Al aplicar la propuesta de Asset allocation (renta variable ' + num(d.rv) + ' %)' }); this.toast('Propuesta aplicada. El plan se ha recalculado.'); };
      return h('div', { className: 'r2-main ap-in', key: 'aa' },
        this.head('Asset allocation', 'Reparto de la cartera financiera por tipo de activo. La propuesta cambia la rentabilidad esperada y el plan, a la derecha, se recalcula al aplicarla.'),
        h('section', { className: 'r4-sec' },
          h('div', { className: 'r4-aa__figs' },
            h('div', null, h('span', { className: 'r2-fig__l' }, 'Rentabilidad esperada'), h('strong', { className: 'r2-fig__v' }, A(next, pc1, 1)), h('small', { className: 'r2-muted' }, dirty ? 'hoy ' + pc1(now) : 'escenario medio')),
            h('div', null, h('span', { className: 'r2-fig__l' }, 'Necesaria para el plan'), h('strong', { className: 'r2-fig__v' }, '4,6 %'), h('small', { className: 'r2-muted' }, next >= 4.55 ? 'cubierta' : 'faltan ' + pc1(Math.max(0, 4.6 - next)).replace(' %', ' puntos'))),
            h('div', { className: 'r4-aa__donut' }, C('DonutChart', { size: 'sm', legend: false, look: 'ramp', formatValue: (x) => x + ' %', centerLabel: 'propuesta', centerValue: String(Math.round(total)) + ' %', data: AAL.map(([k, l]) => ({ label: l, value: Math.max(0, num(d[k])) })), description: 'Reparto propuesto' })))),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Reparto por tipo de activo'),
          h('div', { className: 'r4-aa', role: 'table', 'aria-label': 'Reparto actual y propuesto' },
            h('div', { className: 'r4-aa__row r4-aa__row--head', role: 'row' }, h('span', { role: 'columnheader' }, 'Tipo de activo'), h('span', { role: 'columnheader', className: 'r4-num' }, 'Actual'), h('span', { role: 'columnheader' }, 'Propuesta'), h('span', { role: 'columnheader', className: 'r4-num' }, 'Cambio')),
            AAL.map(([k, l]) => h('div', { key: k, className: 'r4-aa__row', role: 'row' },
              h('span', { role: 'cell', className: 'r4-aa__name' }, l),
              h('span', { role: 'cell', className: 'r4-num' }, AA0[k] + ' %'),
              h('span', { role: 'cell' }, C('Input', { size: 'sm', value: String(d[k]), suffix: '%', inputMode: 'decimal', 'aria-label': l + ', propuesta', onChange: set(k) })),
              h('span', { role: 'cell', className: 'r4-num' }, delta(k)))),
            h('div', { className: 'r4-aa__row r4-aa__row--total' + (ok ? '' : ' is-error'), role: 'row' }, h('span', { role: 'cell' }, 'Total'), h('span', { role: 'cell', className: 'r4-num' }, '100 %'), h('span', { role: 'cell', className: 'r4-num r4-aa__tot' }, A(total, (x) => Math.round(x) + ' %')), h('span', { role: 'cell' }))),
          ok ? null : h('p', { className: 'r4-err', role: 'alert' }, 'El reparto suma ' + Math.round(total) + ' %. Ajuste la propuesta hasta que sume 100 %.')),
        h('div', { className: 'r2-actions r4-end' },
          C('Button', { variant: 'ghost', disabled: !s.aaDraft && !s.aaApplied, onClick: () => { this.setState({ aaDraft: null, aaApplied: null }); this.toast('Reparto restablecido al actual.'); } }, 'Restablecer'),
          !ok ? h('span', { className: 'r2-muted' }, 'El total debe sumar 100 %') : !dirty ? h('span', { className: 'r2-muted' }, s.aaApplied ? 'Propuesta aplicada al plan' : 'Cambie un porcentaje para aplicarlo') : null,
          C('Button', { variant: 'primary', disabled: !ok || !dirty, onClick: apply }, 'Aplicar al plan')));
    }
    /* ---------- 3.6: Optimizaciones › Generación de liquidez ---------- */
    glPage() {
      const s = this.state, { v } = this.live(), gl = s.gl || {};
      const years = (v.net0 || []).map((x, i) => ({ y: YEAR0 + 1 + i, x }));
      const defY = years.filter((r) => r.x < 0).map((r) => r.y), opts = defY.concat(years.map((r) => r.y).filter((y) => defY.indexOf(y) < 0)).map((y) => ({ value: String(y), label: String(y) + (defY.indexOf(y) >= 0 ? ' · déficit' : '') }));
      const after = (v.net || []).map((x, i) => ({ y: YEAR0 + 1 + i, x })), defAfter = after.filter((r) => r.x < 0);
      const sellable = s.pat.filter((a) => a.grupo !== 'deu' && a.detalle !== 'Vivienda habitual' && num(a.valor) > 0);
      const upd = (id, p) => this.setState((st) => ({ gl: Object.assign({}, st.gl, { [id]: Object.assign({ on: false, year: String(defY[0] || YEAR0 + 6), amount: '' }, (st.gl || {})[id], p) }) }));
      const sold = Object.keys(gl).filter((id) => gl[id] && gl[id].on).reduce((t, id) => t + num(gl[id].amount), 0);
      const tooMuch = (a) => gl[a.id] && gl[a.id].on && num(gl[a.id].amount) > num(a.valor);
      return h('div', { className: 'r2-main ap-in', key: 'gl' },
        this.head('Generación de liquidez', 'Qué activos se venden y en qué año para cubrir los años con déficit. El plan, a la derecha, se recalcula con cada venta.'),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Años con déficit · escenario medio'),
          h('div', { className: 'r4-gl__years' }, years.filter((r) => r.x < 0).map((r) => { const na = after.find((z) => z.y === r.y).x; return h('div', { key: r.y, className: 'r4-gl__year' + (na >= 0 ? ' is-ok' : '') },
            h('span', { className: 'r2-fig__l' }, String(r.y)), h('strong', { className: na < 0 ? 'r4-neg' : '' }, A(na)), h('small', { className: 'r2-muted' }, na >= 0 ? 'cubierto · antes ' + eur(r.x) : 'antes ' + eur(r.x))); })),
          h('p', { className: 'r2-hint', 'aria-live': 'polite' }, defAfter.length ? 'Quedan ' + defAfter.length + ' años con déficit. Ventas previstas: ' + eur(sold) + '.' : 'Las ventas cubren todos los años con déficit. Ventas previstas: ' + eur(sold) + '.')),
        h('section', { className: 'r4-sec' }, h('h2', null, 'Activos que se pueden vender'), h('p', null, 'Activos líquidos e inmuebles que no son la vivienda habitual. Marque los que se venden, el año y el importe.'),
          h('div', { className: 'r4-gl' },
            h('div', { className: 'r4-gl__row r4-gl__row--head' }, h('span', null, 'Activo'), h('span', { className: 'r4-num' }, 'Valor hoy'), h('span', null, 'Año de venta'), h('span', null, 'Importe')),
            sellable.map((a) => { const g = gl[a.id] || {}; return h('div', { key: a.id, className: 'r4-gl__row' + (g.on ? ' is-on' : '') },
              C('Checkbox', { label: a.nombre, checked: !!g.on, onChange: (c) => upd(a.id, { on: !!c, amount: g.amount || String(Math.min(num(a.valor), Math.abs((v.net0 || [])[num(g.year || defY[0]) - YEAR0 - 1] || 10000))) }) }),
              h('span', { className: 'r4-num' }, eur(num(a.valor))),
              C('Select', { size: 'sm', value: g.year || String(defY[0] || YEAR0 + 6), options: opts, disabled: !g.on, 'aria-label': 'Año de venta de ' + a.nombre, onChange: (x) => upd(a.id, { year: x }) }),
              h('div', null, C('Input', { size: 'sm', value: g.amount ? fmt(num(g.amount)) : '', suffix: '€', inputMode: 'decimal', disabled: !g.on, 'aria-label': 'Importe de venta de ' + a.nombre, error: tooMuch(a) ? 'Supera el valor del activo.' : undefined, onChange: (e) => upd(a.id, { amount: e.target.value }) }))); }))),
        h('div', { className: 'r2-actions r4-end' },
          C('Button', { variant: 'ghost', className: 'r4-danger', disabled: !Object.keys(gl).length, onClick: () => { this.setState({ gl: {} }); this.toast('Ventas borradas. El plan se ha recalculado.'); } }, 'Borrar ventas'),
          C('Button', { variant: 'primary', disabled: !sold, onClick: () => this.toast('Ventas guardadas en la planificación.') }, 'Guardar ventas')));
    }
    page() {
      const s = this.state;
      if (s.v312 && s.screen === 'aa') return this.aaPage312();
      if (s.v312 && s.screen === 'gl') return this.glPage312();
      if (s.v36 && s.screen === 'aa') return this.aaPage();
      if (s.v36 && s.screen === 'gl') return this.glPage();
      if (s.screen === 'ingresos' || s.screen === 'patrimonio') {
        const ing = s.screen === 'ingresos';
        return h('div', { className: 'r2-main ap-in', key: s.screen },
          this.head(ing ? 'Ingresos' : 'Patrimonio', ing ? 'Los ingresos del cliente, de hoy y previstos. Se añaden y se editan en la propia lista.' : 'Activos y pasivos por tipo. Se crean con lo mínimo y se completan en la propia fila.', s.btnBar ? null : this.newBtn(ing ? 'Nuevo ingreso' : 'Nuevo activo')),
          ing ? this.incList() : this.patList());
      }
      if (s.screen === 'legado') return this.legadoPage();
      if (s.screen === 'jubilacion' && s.v312) return this.jubPage();
      const plan = s.screen === 'aa' ? 'El plan se ha movido a Optimizaciones › Asset allocation.' : s.screen === 'gl' ? 'El plan se ha movido a Optimizaciones › Generación de liquidez.' : 'El plan sigue a la derecha, igual que en las demás.';
      return h('div', { className: 'r2-main ap-in', key: s.screen },
        this.head(PAGES[s.screen], 'Página fuera de este ejemplo. ' + plan),
        C('EmptyState', { size: 'compact', title: 'Esta página no está en el ejemplo', actions: h(React.Fragment, null, C('Button', { variant: 'primary', size: 'sm', onClick: () => this.go('ingresos') }, 'Ir a Ingresos'), C('Button', { variant: 'secondary', size: 'sm', onClick: () => this.go(s.v36 ? 'aa' : 'patrimonio') }, s.v36 ? 'Ir a Asset allocation' : 'Ir a Patrimonio')) }, s.v36 ? 'El ejemplo cubre Ingresos, Patrimonio, Legado y colchón de liquidez, Asset allocation y Generación de liquidez.' : 'El ejemplo cubre Ingresos, Patrimonio y Legado y colchón de liquidez.'));
    }

    render() {
      const s = this.state, rc = this.railCollapsed(), mode = this.mode(), logo = h('span', { className: 'r4-logo', role: 'img', 'aria-label': 'Afi' });
      const nav = (icon, label, key) => { const item = C('NavItem', { key: label, icon: I(icon, 20), label, collapsed: rc, title: undefined, selected: s.screen === key, onClick: () => this.go(key) }); return rc ? C('Tooltip', { key: label, content: label, placement: 'right' }, item) : item; };
      const group = (label, ...items) => C('SidebarGroup', { label: rc ? undefined : label }, ...items);
      const fold = C('Tooltip', { content: rc ? 'Expandir el menú' : 'Contraer el menú', placement: rc ? 'right' : 'bottom' }, C('IconButton', { variant: 'ghost', size: 'sm', title: undefined, label: rc ? 'Expandir el menú' : 'Contraer el menú', onClick: () => this.setState({ railC: !rc }) }, I(rc ? 'panel-left-open' : 'panel-left-close', 18)));
      /* the first group's label shares the row with the fold button (same DS label style); folded, only the button stays */
      const railHead = h('div', { className: 'r4-railhead' }, rc ? null : h('span', { className: 'afi-sidebar-group__label r4-railhead__label' }, 'Situación actual'), rc ? null : h('span', { className: 'r2-spacer' }), fold);
      const rail = C('Sidebar', { collapsed: rc, className: 'r3-rail r4-rail', header: railHead },
        group(null, nav('wallet', 'Patrimonio', 'patrimonio'), nav('banknote', 'Ingresos', 'ingresos'), nav('receipt', 'Gastos', 'gastos')),
        group('Objetivos', nav('landmark', 'Legado y colchón de liquidez', 'legado'), nav('armchair', 'Jubilación', 'jubilacion')),
        group('Optimizaciones', nav('pie-chart', 'Asset allocation', 'aa'), nav('droplets', 'Generación de liquidez', 'gl')));
      const bar = ({ menuButton }) => C('AppHeader', { middle: this.state.v32 ? this.topPath() : undefined, middleAlign: 'start', lead: h('span', { className: 'r2-lead' }, menuButton,
        logo, h('span', { className: 'r2-prod' }, 'Wealth Planner')), end: this.state.v32 ? this.topEnd() : h('span', { className: 'r2-muted r2-client' }, 'Andrés Molina Vega · Plan patrimonial') });
      if (s.home) {
        const homeBar = () => C('AppHeader', { lead: h('span', { className: 'r2-lead' }, logo, h('span', { className: 'r2-prod' }, 'Wealth Planner')), end: h('span', { className: 'r4-user', title: 'Gestor Afi', 'aria-label': 'Gestor Afi' }, 'GA') });
        return h('div', { className: 'r4-homeshell r4-look--' + (s.look || 'fill') }, homeBar(), this.homePage(), s.v312 ? this.homeDialog() : null, C('Toast', { show: !!s.toast, action: s.undo ? 'Deshacer' : undefined, onAction: () => this.undoLast() }, s.toast));
      }
      return C('ShellFrame', { bar, rail, railTitle: 'Menú', menuOpen: s.nav, onMenuOpenChange: (o) => this.setState({ nav: o }) },
        h('div', { className: 'r3-work r4-look--' + (s.look || 'fill') + (s.v312 && s.sim ? ' is-sim' + (this.simLook() ? ' r4-simlook--' + this.simLook() : '') : '') + (s.v312 && (s.thinking || this.live().busy) ? ' is-working' : '') + (s.v312 && s.thinking ? ' is-thinking' : '') + (s.v312 ? ' r4-ailook--' + (s.aiLook || 'mix') : '') + (s.v312 && s.aiHue ? ' r4-aihue--' + s.aiHue : '') + (s.v312 && s.dockLook ? ' r4-docklook--' + s.dockLook : '') + (s.simEnter ? ' is-simenter' + (s.simEnter === 'ai' ? ' is-simenter-ai' : '') : '') + (s.dockEnter ? ' is-dockenter' : '') + (s.v312 && s.secMark ? ' r4-secmark--' + s.secMark : '') + (s.v312 && s.justApplied ? ' is-applied' : '') + (s.tone === 25 ? ' r4-tone--25' : '') + (s.drag != null ? ' is-dragging' : ''), ref: (el) => { if (el && el !== this._work) { this._work = el; try { (this._ro = this._ro || new ResizeObserver(() => this.forceUpdate())).observe(el.closest('.afi-shell') || el); } catch (e) {} } } },
          this.state.v312 && this.state.agent ? this.agentPanel() : null,
          h('div', { className: 'r3-page' }, this.page(), this.state.v312 && this.state.chat === 'B' ? this.chatField('B') : null, this.state.v312 && this.state.agentUI === 'dock' ? this.agentDock() : null),
          h('div', { className: 'r3-handle', role: 'separator', tabIndex: 0, 'aria-orientation': 'vertical', 'aria-label': 'Cambiar el ancho del plan', onPointerDown: (e) => this.onDown(e), onKeyDown: (e) => this.onHandleKey(e), onDoubleClick: () => this.setSize(s.size === 'wide' ? 'narrow' : 'wide') }, h('span', null)),
          h('aside', { className: 'r3-plan r3-plan--' + mode + (s.sorting ? ' is-sorting' : '') + (s.resizing ? ' is-resizing' : ''), ref: (el) => { this._plan = el; }, style: { width: this.width() + 'px' }, 'aria-label': 'El plan', 'aria-live': 'polite' }, this.planScroll(this.plan()))),
        s.v312 && s.demoCase ? this.demoPanel() : null,
        C('Toast', { show: !!s.toast, action: s.undo ? 'Deshacer' : undefined, onAction: () => this.undoLast() }, s.toast));
    }
  }
  window.WPRows4 = { App };
})();
