import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, type Attention, type DetailScope, type Filters, type Summary, type Triage } from './api';
import { contextLabel, readDashboardView, readFilters, writeContext, type DashboardView } from './dashboardView';
import DetailDrawer, { type DetailRequest } from './DetailDrawer';
import MetricTooltip from './MetricTooltip';
import { METRIC_HELP } from './metricDefinitions';
import { dateTime, defaultDates, integer, metric, percent, shortDate } from './format';

// Arquitectura de tres perspectivas (HCG-VIS-001..003) homologada visualmente
// con dashboard_cex (HCG-VIS-005). Sustituye la página vertical única: cada
// lente responde una pregunta distinta sobre el MISMO universo filtrado, sin
// cambiar fórmulas, universos ni contratos de Urgencias.

const PERSPECTIVES: Array<{ id: DashboardView; label: string; help: string }> = [
  { id: 'operation', label: 'Operación', help: 'Cómo funcionó Urgencias en el periodo, centro y servicio seleccionados: volumen, demanda diaria, estancia, eventos aún abiertos, registro de Triage y de Atención médica, y destino de los eventos.' },
  { id: 'population', label: 'Población', help: 'A quién atendió Urgencias dentro del mismo universo filtrado: personas distintas, cuántas veces acudieron y con qué frecuencia repiten.' },
  { id: 'performance', label: 'Indicadores de desempeño', help: 'Indicadores de resultado del periodo, distintos de los conteos de actividad. No incluye la cobertura de registro, que es calidad del dato.' },
];

type DetailOpener = (request: DetailRequest) => void;

export function App() {
  const defaults = useMemo(() => defaultDates(), []);
  const initial = useMemo(() => readFilters(location.search, defaults), [defaults]);
  const [draft, setDraft] = useState<Filters>(initial);
  const [filters, setFilters] = useState<Filters>(initial);
  const [view, setView] = useState<DashboardView>(() => readDashboardView(location.search));
  const [detail, setDetail] = useState<DetailRequest | null>(null);

  const operation = view === 'operation';
  const population = view === 'population';
  const performance = view === 'performance';

  const catalogs = useQuery({ queryKey: ['catalogs', draft.centro], queryFn: () => api.catalogs(draft.centro) });
  const summary = useQuery({ queryKey: ['summary', filters], queryFn: () => api.summary(filters) });
  // Los módulos exclusivos de una perspectiva sólo se consultan en ella; el
  // detalle de pacientes no se precarga en ningún caso (HCG-UX-007).
  const triage = useQuery({ queryKey: ['triage', filters], queryFn: () => api.triage(filters), enabled: operation });
  const attention = useQuery({ queryKey: ['attention', filters], queryFn: () => api.attention(filters), enabled: operation });
  const demand = useQuery({ queryKey: ['demand', filters], queryFn: () => api.demand(filters), enabled: operation });
  const resolution = useQuery({ queryKey: ['resolution', filters], queryFn: () => api.resolution(filters), enabled: operation });
  const frequentation = useQuery({ queryKey: ['frequentation', filters], queryFn: () => api.frequentation(filters), enabled: population });

  useEffect(() => { history.replaceState(null, '', '?' + writeContext(filters, view)); }, [filters, view]);

  const apply = (event: React.FormEvent) => { event.preventDefault(); setFilters(draft); };
  const openDetail: DetailOpener = (request) => setDetail(request);
  const active = [summary, ...(operation ? [triage, attention, demand, resolution] : []), ...(population ? [frequentation] : [])];
  const loading = active.some((query) => query.isLoading);
  const error = active.map((query) => query.error).find(Boolean) ?? catalogs.error;

  return <div className="app">
    <header className="topbar">
      <div className="brand-mark">HCG</div>
      <div><p>Hospital Civil de Guadalajara</p><h1>Dashboard de Urgencias</h1></div>
      <span className={error ? 'status offline' : 'status'}><i /> {error ? 'API con incidencia' : 'Datos operativos'}</span>
    </header>

    <main className="shell">
      <section className="context-bar">
        <div><span className="eyebrow">Contexto vigente</span><p>{contextLabel(filters)}</p></div>
        <div className="stamp">Actualización<b>{summary.data ? dateTime(summary.data.observadoEn) : 'Consultando…'}</b></div>
      </section>

      <form className="filters" onSubmit={apply}>
        <label>Desde<input type="date" required value={draft.desde} onChange={(event) => setDraft({ ...draft, desde: event.target.value })} /></label>
        <label>Hasta<input type="date" required value={draft.hasta} onChange={(event) => setDraft({ ...draft, hasta: event.target.value })} /></label>
        <label>Centro<select value={draft.centro ?? ''} onChange={(event) => setDraft({ ...draft, centro: event.target.value || undefined, codigoServicio: undefined })}><option value="">Todos los centros</option>{catalogs.data?.centros.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>Servicio<select value={draft.codigoServicio ?? ''} onChange={(event) => setDraft({ ...draft, codigoServicio: event.target.value ? Number(event.target.value) : undefined })}><option value="">Todos los servicios</option>{catalogs.data?.servicios.map((item) => <option key={item.value} value={item.value}>{item.centro} · {item.label}</option>)}</select></label>
        <button type="submit">Actualizar vista</button>
      </form>

      <nav className="perspective-nav" aria-label="Perspectiva de análisis">
        <span className="perspective-label">Perspectiva de análisis</span>
        <div className="perspective-options">
          {PERSPECTIVES.map((item) => <div key={item.id} className={view === item.id ? 'perspective-option active' : 'perspective-option'}>
            <button type="button" aria-current={view === item.id ? 'page' : undefined} onClick={() => setView(item.id)}>{item.label}</button>
            <MetricTooltip label={item.label} text={item.help} />
          </div>)}
        </div>
      </nav>

      {error ? <div className="notice error" role="alert">{(error as Error).message}<button onClick={() => active.forEach((query) => { void query.refetch(); })}>Reintentar</button></div> : null}
      {loading ? <div className="notice" role="status">Consultando el universo de urgencias…</div> : null}

      {operation && <OperationPerspective summary={summary.data} triage={triage.data} attention={attention.data} demand={demand.data} resolution={resolution.data} onDetail={openDetail} />}
      {population && <PopulationPerspective summary={summary.data} frequentation={frequentation.data} />}
      {performance && <PerformancePerspective summary={summary.data} onDetail={openDetail} />}
    </main>

    <footer>Uso institucional · Información operativa sin datos identificables de pacientes</footer>
    {detail && <DetailDrawer request={detail} filters={filters} onClose={() => setDetail(null)} />}
  </div>;
}

/* ------------------------------------------------------------------ piezas */

function Kpi({ label, value, note, help, accent, detail, onDetail }: {
  label: string; value: string; note: string; help: string; accent?: boolean;
  detail?: DetailRequest; onDetail?: DetailOpener;
}) {
  const body = <><span>{label} <MetricTooltip label={label} text={help} /></span><strong>{value}</strong><small>{note}</small></>;
  // Clicable sólo si existe un detalle correspondiente (HCG-UX-017).
  if (!detail || !onDetail) return <article className={accent ? 'kpi accent' : 'kpi'}>{body}</article>;
  return <button type="button" className={accent ? 'kpi accent clickable' : 'kpi clickable'} onClick={() => onDetail(detail)}>{body}<em>Ver detalle</em></button>;
}

function Panel({ eyebrow, title, help, aside, wide, children }: {
  eyebrow: string; title: string; help: string; aside?: React.ReactNode; wide?: boolean; children: React.ReactNode;
}) {
  return <article className={wide ? 'panel wide' : 'panel'}>
    <div className="panel-head"><div><span className="eyebrow">{eyebrow}</span><h3>{title} <MetricTooltip label={title} text={help} /></h3></div>{aside}</div>
    {children}
  </article>;
}

type Band = { label: string; value: number; scope?: DetailScope };

function BandGrid({ bands, indicator, onDetail }: { bands: Band[]; indicator: string; onDetail?: DetailOpener }) {
  return <div className="band-grid">{bands.map((band) => {
    const scope = band.scope;
    return scope && onDetail
      ? <button type="button" className="band clickable" key={band.label} onClick={() => onDetail({ scope, title: band.label, indicator, expectedTotal: band.value })}><b>{band.label}</b><strong>{integer.format(band.value)}</strong></button>
      : <div className="band" key={band.label}><b>{band.label}</b><strong>{integer.format(band.value)}</strong></div>;
  })}</div>;
}

function Trend({ points }: { points: Array<{ fecha: string; atenciones: number }> }) {
  if (!points.length) return <div className="empty">No hay atenciones para graficar en el periodo.</div>;
  const width = 900, height = 190, pad = 26;
  const max = Math.max(...points.map((point) => point.atenciones), 1);
  const coords = points.map((point, index) => ({
    ...point, x: pad + index * ((width - pad * 2) / Math.max(points.length - 1, 1)),
    y: height - pad - (point.atenciones / max) * (height - pad * 2),
  }));
  const area = 'M ' + coords[0].x + ' ' + (height - pad) + ' ' + coords.map((point) => 'L ' + point.x + ' ' + point.y).join(' ') + ' L ' + coords.at(-1)!.x + ' ' + (height - pad) + ' Z';
  return <div className="chart-wrap">
    <svg viewBox={'0 0 ' + width + ' ' + height} role="img" aria-label="Atenciones diarias">
      <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16a39a" stopOpacity=".3" /><stop offset="1" stopColor="#16a39a" stopOpacity=".02" /></linearGradient></defs>
      {[0, .5, 1].map((value) => <line key={value} x1={pad} x2={width - pad} y1={pad + value * (height - pad * 2)} y2={pad + value * (height - pad * 2)} className="gridline" />)}
      <path d={area} fill="url(#area)" /><polyline points={coords.map((point) => point.x + ',' + point.y).join(' ')} fill="none" className="trendline" />
      {coords.map((point) => <circle key={point.fecha} cx={point.x} cy={point.y} r="3"><title>{shortDate(point.fecha)}: {integer.format(point.atenciones)}</title></circle>)}
    </svg>
    <div className="chart-axis"><span>{shortDate(points[0].fecha)}</span><span>{shortDate(points.at(-1)!.fecha)}</span></div>
  </div>;
}

const CoverageList = ({ rows }: { rows: Array<{ key: string; title: string; note: string; pct: number | null }> }) =>
  <div className="coverage-list">{rows.map((row) => <div key={row.key}><span><b>{row.title}</b><small>{row.note}</small></span><meter min="0" max="100" value={row.pct ?? 0} /><strong>{percent(row.pct)}</strong></div>)}</div>;

/* ------------------------------------------------------------- perspectivas */

type DemandData = { tendencia: Array<{ fecha: string; atenciones: number }>; servicios: Array<{ centro: string; codigoServicio: number; servicio: string; atenciones: number }> };
type ResolutionData = { categorias: Array<{ destinoUrgPk: number | null; destino: string | null; eventos: number; porcentaje: number | null }> };

function OperationPerspective({ summary, triage, attention, demand, resolution, onDetail }: {
  summary?: Summary; triage?: Triage; attention?: Attention; demand?: DemandData; resolution?: ResolutionData; onDetail: DetailOpener;
}) {
  if (!summary) return null;
  return <>
    <section className="kpis">
      <Kpi accent label="Atenciones" value={integer.format(summary.atenciones)} note="Eventos únicos en el periodo" help={METRIC_HELP.atenciones}
        onDetail={onDetail} detail={{ scope: 'atenciones', title: 'Atenciones', indicator: 'URG-EJ-01', expectedTotal: summary.atenciones }} />
      <Kpi label="Promedio diario" value={metric(summary.promedioDiario)} note={summary.diasCompletos + ' días completos'} help={METRIC_HELP.promedioDiario} />
      <Kpi label="Estancia registrada" value={metric(summary.permanenciaPromedioHoras, ' h')} note={integer.format(summary.eventosCompletados) + ' eventos evaluables'} help={METRIC_HELP.permanencia}
        onDetail={onDetail} detail={{ scope: 'permanencia_evaluables', title: 'Estancia registrada evaluable', indicator: 'URG-EJ-03', expectedTotal: summary.eventosCompletados }} />
      <Kpi label="Activos probables" value={integer.format(summary.activosProbables)} note="Corte actual, fuera del periodo" help={METRIC_HELP.activos} />
    </section>

    {summary.periodoParcial && <div className="notice warning">El día actual es parcial y se excluye del promedio diario.</div>}

    <section className="grid two-one">
      <Panel wide eyebrow="Demanda" title="Atenciones por día" help={METRIC_HELP.demanda}><Trend points={demand?.tendencia ?? []} /></Panel>
      <Panel eyebrow="Cobertura" title="Servicios de urgencias" help={METRIC_HELP.servicios}>
        <div className="service-list">{demand?.servicios.map((item) => <div className="service" key={item.codigoServicio}><div><b>{item.servicio}</b><small>{item.centro} · {item.codigoServicio}</small></div><span className={item.atenciones ? '' : 'zero'}>{integer.format(item.atenciones)}</span></div>)}</div>
      </Panel>
    </section>

    <section className="grid two">
      <Panel eyebrow="Permanencia" title="Bandas de estancia registrada" help={METRIC_HELP.permanenciaBandas}>
        <p className="context">Bandas exclusivas sobre {integer.format(summary.eventosCompletados)} secuencias evaluables; se conservan {integer.format(summary.permanenciaInvertidos)} inversiones y {integer.format(summary.permanenciaSinEgreso)} eventos sin egreso.</p>
        <BandGrid indicator="URG-EJ-03" onDetail={onDetail} bands={[
          { label: '<12 h', value: summary.permanenciaMenor12h, scope: 'permanencia_menor12h' },
          { label: '12–<24 h', value: summary.permanencia12a24h, scope: 'permanencia_12a24h' },
          { label: '24–<48 h', value: summary.permanencia24a48h, scope: 'permanencia_24a48h' },
          { label: '48–72 h', value: summary.permanencia48a72h, scope: 'permanencia_48a72h' },
          { label: '>72 h', value: summary.permanenciaMayor72h, scope: 'permanencia_mayor72h' },
        ]} />
      </Panel>
      <Panel eyebrow="Activos probables" title="Antigüedad al corte" help={METRIC_HELP.activosAntiguedad}>
        <p className="context">Señales acumulativas al corte de observación; no representan bandas exclusivas.</p>
        <BandGrid indicator="URG-ACT-01" bands={[
          { label: '>24 h', value: summary.activosMayor24h }, { label: '>48 h', value: summary.activosMayor48h },
          { label: '>72 h', value: summary.activosMayor72h }, { label: 'No evaluable', value: summary.activosAntiguedadNoEvaluable },
          { label: 'Ingreso futuro', value: summary.activosFechaIngresoFutura },
        ]} />
      </Panel>
    </section>

    {triage && attention && <section className="grid two">
      <Panel eyebrow="Triage" title="Cobertura de registro" help={METRIC_HELP.triageCobertura} aside={<strong className="panel-figure">{percent(triage.resumen.coberturaPct)}</strong>}>
        <div className="mini-grid">
          <button type="button" className="mini clickable" onClick={() => onDetail({ scope: 'triage_registrado', title: 'Eventos con Triage registrado', indicator: 'URG-TRI-01', expectedTotal: triage.resumen.eventosConTriage })}><b>{integer.format(triage.resumen.eventosConTriage)}</b><span>con Triage</span></button>
          <div className="mini"><b>{integer.format(triage.resumen.universoTotal)}</b><span>universo total</span></div>
          <div className="mini"><b>{metric(triage.resumen.tiempoPromedioMinutos, ' min')}</b><span>tiempo registrado promedio <MetricTooltip label="Tiempo registrado a Triage" text={METRIC_HELP.triageTiempo} /></span></div>
          <div className="mini"><b>{integer.format(triage.resumen.secuenciasInvertidas)}</b><span>secuencias a revisar</span></div>
        </div>
        <p className="context">La ausencia de Triage no excluye atenciones. El tiempo usa sólo secuencias cronológicamente interpretables y conserva los extremos.</p>
        {(triage.resumen.tiemposMayorIgual24h > 0 || triage.resumen.tiemposMayorIgual7d > 0) && <div className="notice quality">Calidad visible: {integer.format(triage.resumen.tiemposMayorIgual24h)} casos ≥24 h y {integer.format(triage.resumen.tiemposMayorIgual7d)} casos ≥7 días entre Ingreso y Triage.</div>}
        <div className="distribution-head"><h4>Bandas de tiempo Ingreso → Triage</h4><small>Bandas exclusivas sobre secuencias evaluables</small></div>
        <BandGrid indicator="URG-TRI-03" bands={[
          { label: 'Mismo minuto', value: triage.resumen.mismoMinuto }, { label: '1–10 min', value: triage.resumen.de1a10 },
          { label: '11–30 min', value: triage.resumen.de11a30 }, { label: '31–60 min', value: triage.resumen.de31a60 },
          { label: '61–120 min', value: triage.resumen.de61a120 }, { label: '121–240 min', value: triage.resumen.de121a240 },
          { label: '>240 min', value: triage.resumen.mayor240 },
        ]} />
      </Panel>

      <Panel eyebrow="Atención médica" title="Cobertura del hito registrado" help={METRIC_HELP.atencionCobertura} aside={<strong className="panel-figure">{percent(attention.resumen.coberturaPct)}</strong>}>
        <div className="mini-grid">
          <button type="button" className="mini clickable" onClick={() => onDetail({ scope: 'atencion_registrada', title: 'Eventos con Atención médica registrada', indicator: 'URG-ATE-01', expectedTotal: attention.resumen.eventosConAtencion })}><b>{integer.format(attention.resumen.eventosConAtencion)}</b><span>con fechaate</span></button>
          <div className="mini"><b>{integer.format(attention.resumen.universoTotal)}</b><span>universo total</span></div>
          <div className="mini"><b>{metric(attention.resumen.promedioMinutos, ' min')}</b><span>tiempo registrado promedio <MetricTooltip label="Tiempo registrado a Atención médica" text={METRIC_HELP.atencionTiempo} /></span></div>
          <div className="mini"><b>{integer.format(attention.resumen.eventosSinAtencion)}</b><span>sin fechaate</span></div>
        </div>
        <p className="context"><code>fechaate</code> es el timestamp registrado del hito de Atención médica; no representa presencia física continua ni acredita por sí solo que la atención ocurrió en ese momento. Su ausencia no excluye el evento del universo. El intervalo desde Ingreso conserva los extremos y sólo usa secuencias cronológicamente interpretables.</p>
        {(attention.resumen.invertidos > 0 || attention.resumen.mayorIgual24h > 0 || attention.resumen.mayorIgual7d > 0) && <div className="notice quality">Calidad visible: {integer.format(attention.resumen.invertidos)} secuencias a revisar, {integer.format(attention.resumen.mayorIgual24h)} casos ≥24 h y {integer.format(attention.resumen.mayorIgual7d)} casos ≥7 días entre Ingreso y Atención médica.</div>}
        <div className="distribution-head"><h4>Bandas de tiempo Ingreso → Atención médica</h4><small>Bandas exclusivas sobre secuencias evaluables</small></div>
        <BandGrid indicator="URG-ATE-01" bands={[
          { label: 'Mismo minuto', value: attention.resumen.mismoMinuto }, { label: '0–30 min', value: attention.resumen.de0a30 },
          { label: '31–60 min', value: attention.resumen.de31a60 }, { label: '61–120 min', value: attention.resumen.de61a120 },
          { label: '121–240 min', value: attention.resumen.de121a240 }, { label: '>240 min', value: attention.resumen.mayor240 },
        ]} />
      </Panel>
    </section>}

    <section className="grid two">
      {triage && <Panel eyebrow="Triage" title="Clasificación nativa" help={METRIC_HELP.triageClasificacion}>
        <div className="distribution-list">{triage.clasificacion.map((item) => <div key={(item.triageCodigo ?? 'null') + '-' + (item.triageDescripcion ?? '')}><span><b>{item.triageCodigo ?? 'Sin código'} · {item.triageDescripcion ?? 'Sin descripción'}</b><small>{integer.format(item.eventos)} eventos</small></span><meter min="0" max="100" value={item.porcentajeSobreClasificados ?? 0} /><strong>{percent(item.porcentajeSobreClasificados)}</strong></div>)}</div>
      </Panel>}
      {resolution && <Panel eyebrow="Resolución" title="Destino de los eventos" help={METRIC_HELP.resolucion}>
        <p className="context">Categorías nativas; sin fusionar destino, motivo de alta, N.E. o ausencia.</p>
        <div className="distribution-list">{resolution.categorias.map((item) => <div key={(item.destinoUrgPk ?? 'null') + '-' + (item.destino ?? '')}><span><b>{item.destino ?? 'Sin registro'}</b><small>Clave {item.destinoUrgPk ?? 'sin dato'} · {integer.format(item.eventos)} eventos</small></span><meter min="0" max="100" value={item.porcentaje ?? 0} /><strong>{percent(item.porcentaje)}</strong></div>)}</div>
      </Panel>}
    </section>

    {triage && attention && <section className="grid two">
      <Panel eyebrow="Triage" title="Cobertura por servicio" help={METRIC_HELP.triageCobertura}>
        <CoverageList rows={triage.servicios.map((item) => ({ key: 't-' + item.codigoServicio, title: item.servicio, note: item.centro + ' · ' + integer.format(item.eventosConTriage) + ' de ' + integer.format(item.universoTotal), pct: item.coberturaPct }))} />
      </Panel>
      <Panel eyebrow="Atención médica" title="Cobertura por servicio" help={METRIC_HELP.atencionCobertura}>
        <CoverageList rows={attention.servicios.map((item) => ({ key: 'a-' + item.codigoServicio, title: item.servicio, note: item.centro + ' · ' + integer.format(item.eventosConAtencion) + ' de ' + integer.format(item.universoTotal), pct: item.coberturaPct }))} />
      </Panel>
    </section>}

    {(summary.eventosConConflicto > 0 || summary.filasMultiplicadas > 0) && <section className="quality-strip">
      <div><span className="eyebrow">Calidad del dato <MetricTooltip label="Calidad del dato" text={METRIC_HELP.calidad} /></span><p>Señales del registro que no modifican los indicadores; se muestran para que la cifra pueda auditarse.</p></div>
      <BandGrid indicator="URG-CAL-01" onDetail={onDetail} bands={[
        { label: 'Eventos con conflicto', value: summary.eventosConConflicto, scope: 'conflicto' },
        { label: 'Filas físicas adicionales', value: summary.filasMultiplicadas },
      ]} />
    </section>}
  </>;
}

function PopulationPerspective({ summary, frequentation }: {
  summary?: Summary; frequentation?: { bandas: Array<{ banda: string; pacientes: number }> };
}) {
  if (!summary) return null;
  return <>
    <section className="kpis three">
      <Kpi accent label="Pacientes únicos" value={integer.format(summary.pacientesUnicos)} note={'De ' + integer.format(summary.atenciones) + ' atenciones'} help={METRIC_HELP.pacientesUnicos} />
      <Kpi label="Atenciones por paciente" value={metric(summary.atencionesPorPaciente)} note="Promedio en el periodo" help={METRIC_HELP.atencionesPorPaciente} />
      <Kpi label="Atenciones" value={integer.format(summary.atenciones)} note="Mismo universo filtrado" help={METRIC_HELP.atenciones} />
    </section>
    <section className="grid two">
      <Panel eyebrow="Frecuentación" title="Eventos por paciente" help={METRIC_HELP.frecuentacion}>
        <p className="context">Distribución descriptiva de pacientes identificables; sin juicio de uso.</p>
        <BandGrid indicator="URG-MOD-09" bands={(frequentation?.bandas ?? []).map((item) => ({ label: item.banda, value: item.pacientes }))} />
      </Panel>
      {/* HCG-VIS-004: una perspectiva sin contrato aceptado se declara no
          implementada; no se rellena con datos aproximados ni de otra lente. */}
      <article className="panel pending">
        <div className="panel-head"><div><span className="eyebrow">Perfil demográfico</span><h3>No implementado</h3></div></div>
        <p className="context">El perfil por edad, sexo y residencia (<code>URG-PEND-04</code>) está <b>EN VALIDACIÓN</b>: la fuente fue verificada, pero no existe indicador aceptado ni API/UI autorizada. Esta sección permanece declarada y vacía hasta que exista decisión institucional; no se muestra una aproximación.</p>
      </article>
    </section>
  </>;
}

function PerformancePerspective({ summary, onDetail }: { summary?: Summary; onDetail: DetailOpener }) {
  if (!summary) return null;
  return <>
    <section className="kpis three">
      <Kpi accent label="Hospitalización" value={percent(summary.hospitalizacionPct)} note={integer.format(summary.hospitalizaciones) + ' destinos hospitalarios'} help={METRIC_HELP.hospitalizacion}
        onDetail={onDetail} detail={{ scope: 'hospitalizacion', title: 'Eventos con destino HOSP. PISO', indicator: 'URG-EJ-04', expectedTotal: summary.hospitalizaciones }} />
      <Kpi label="Reingreso <72 h" value={percent(summary.reingresoPct)} note={integer.format(summary.reingresosMenor72) + ' de ' + integer.format(summary.eventosEvaluablesReingreso) + ' evaluables'} help={METRIC_HELP.reingreso72} />
      <Kpi label="Reingreso <48 h" value={integer.format(summary.reingresosMenor48)} note="Indicador secundario" help={METRIC_HELP.reingreso48} />
    </section>
    <section className="panel methodology">
      <div className="panel-head"><div><span className="eyebrow">Lectura</span><h3>Alcance de esta perspectiva</h3></div></div>
      <p className="context">Sólo se presentan aquí los indicadores de resultado aceptados del dominio. La cobertura de registro de Triage y de Atención médica <b>no</b> se presenta como desempeño: mide la completitud del dato y vive en Operación (HCG-CAL-010). No existen metas ni semáforos institucionales aprobados para Urgencias, por lo que las cifras se muestran sin calificación de sentido.</p>
    </section>
  </>;
}
