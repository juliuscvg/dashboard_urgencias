import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, type Filters } from './api';
import { dateTime, defaultDates, integer, metric, percent, shortDate } from './format';

function Trend({ points }: { points: Array<{ fecha: string; atenciones: number }> }) {
  if (!points.length) return <div className="empty">No hay atenciones para graficar en el periodo.</div>;
  const width = 900, height = 230, pad = 28;
  const max = Math.max(...points.map((point) => point.atenciones), 1);
  const coords = points.map((point, index) => ({
    ...point, x: pad + index * ((width - pad * 2) / Math.max(points.length - 1, 1)),
    y: height - pad - (point.atenciones / max) * (height - pad * 2),
  }));
  const area = `M ${coords[0].x} ${height - pad} ${coords.map((p) => `L ${p.x} ${p.y}`).join(' ')} L ${coords.at(-1)!.x} ${height - pad} Z`;
  return <div className="chart-wrap">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Atenciones diarias">
      <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16a39a" stopOpacity=".32"/><stop offset="1" stopColor="#16a39a" stopOpacity=".02"/></linearGradient></defs>
      {[0, .5, 1].map((v) => <line key={v} x1={pad} x2={width-pad} y1={pad + v*(height-pad*2)} y2={pad + v*(height-pad*2)} className="gridline"/>)}
      <path d={area} fill="url(#area)"/><polyline points={coords.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" className="trendline"/>
      {coords.map((p) => <circle key={p.fecha} cx={p.x} cy={p.y} r="3"><title>{shortDate(p.fecha)}: {integer.format(p.atenciones)}</title></circle>)}
    </svg>
    <div className="chart-axis"><span>{shortDate(points[0].fecha)}</span><span>{shortDate(points.at(-1)!.fecha)}</span></div>
  </div>;
}

const Kpi = ({ label, value, note, accent }: { label: string; value: string; note: string; accent?: boolean }) =>
  <article className={`kpi ${accent ? 'accent' : ''}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;

export function App() {
  const initial = useMemo(() => {
    const defaults = defaultDates(); const url = new URLSearchParams(location.search);
    return { desde: url.get('desde') ?? defaults.desde, hasta: url.get('hasta') ?? defaults.hasta,
      centro: url.get('centro') || undefined, codigoServicio: url.get('servicio') ? Number(url.get('servicio')) : undefined };
  }, []);
  const [draft, setDraft] = useState<Filters>(initial);
  const [filters, setFilters] = useState<Filters>(initial);
  const [page, setPage] = useState(1);
  const catalogs = useQuery({ queryKey: ['catalogs', draft.centro], queryFn: () => api.catalogs(draft.centro) });
  const summary = useQuery({ queryKey: ['summary', filters], queryFn: () => api.summary(filters) });
  const triage = useQuery({ queryKey: ['triage', filters], queryFn: () => api.triage(filters) });
  const demand = useQuery({ queryKey: ['demand', filters], queryFn: () => api.demand(filters) });
  const resolution = useQuery({ queryKey: ['resolution', filters], queryFn: () => api.resolution(filters) });
  const frequentation = useQuery({ queryKey: ['frequentation', filters], queryFn: () => api.frequentation(filters) });
  const episodes = useQuery({ queryKey: ['episodes', filters, page], queryFn: () => api.episodes(filters, page) });
  useEffect(() => {
    const p = new URLSearchParams({ desde: filters.desde, hasta: filters.hasta });
    if (filters.centro) p.set('centro', filters.centro);
    if (filters.codigoServicio) p.set('servicio', String(filters.codigoServicio));
    history.replaceState(null, '', `?${p}`);
  }, [filters]);
  const apply = (event: React.FormEvent) => { event.preventDefault(); setPage(1); setFilters(draft); };
  const loading = summary.isLoading || demand.isLoading || triage.isLoading || resolution.isLoading || frequentation.isLoading;
  const error = summary.error || demand.error || triage.error || resolution.error || frequentation.error || episodes.error || catalogs.error;

  return <div className="app">
    <header className="topbar"><div className="brand-mark">HCG</div><div><p>Hospital Civil de Guadalajara</p><h1>Dashboard de Urgencias</h1></div><span className="status"><i/> Datos operativos</span></header>
    <main>
      <section className="intro"><div><span className="eyebrow">Vista ejecutiva</span><h2>Actividad y demanda asistencial</h2><p>Lectura consolidada por evento de urgencia, con trazabilidad del universo consultado.</p></div><div className="stamp">Actualización<br/><b>{summary.data ? dateTime(summary.data.observadoEn) : 'Consultando…'}</b></div></section>
      <form className="filters" onSubmit={apply}>
        <label>Desde<input type="date" required value={draft.desde} onChange={(e) => setDraft({ ...draft, desde: e.target.value })}/></label>
        <label>Hasta<input type="date" required value={draft.hasta} onChange={(e) => setDraft({ ...draft, hasta: e.target.value })}/></label>
        <label>Centro<select value={draft.centro ?? ''} onChange={(e) => setDraft({ ...draft, centro: e.target.value || undefined, codigoServicio: undefined })}><option value="">Todos los centros</option>{catalogs.data?.centros.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
        <label>Servicio<select value={draft.codigoServicio ?? ''} onChange={(e) => setDraft({ ...draft, codigoServicio: e.target.value ? Number(e.target.value) : undefined })}><option value="">Todos los servicios</option>{catalogs.data?.servicios.map((x) => <option key={x.value} value={x.value}>{x.centro} · {x.label}</option>)}</select></label>
        <button type="submit">Actualizar vista</button>
      </form>
      {error && <div className="notice error">{(error as Error).message}</div>}
      {loading && <div className="notice">Consultando el universo de urgencias…</div>}
      {summary.data && <><section className="kpis">
        <Kpi label="Atenciones" value={integer.format(summary.data.atenciones)} note="Eventos únicos en el periodo" accent/>
        <Kpi label="Promedio diario" value={metric(summary.data.promedioDiario)} note={`${summary.data.diasCompletos} días completos`}/>
        <Kpi label="Pacientes únicos" value={integer.format(summary.data.pacientesUnicos)} note={`${metric(summary.data.atencionesPorPaciente)} atenciones por paciente`}/>
        <Kpi label="Estancia registrada" value={metric(summary.data.permanenciaPromedioHoras, ' h')} note={`${integer.format(summary.data.eventosCompletados)} eventos evaluables`}/>
        <Kpi label="Hospitalización" value={percent(summary.data.hospitalizacionPct)} note={`${integer.format(summary.data.hospitalizaciones)} destinos hospitalarios`}/>
        <Kpi label="Reingreso <72 h" value={percent(summary.data.reingresoPct)} note={`${integer.format(summary.data.reingresosMenor72)} de ${integer.format(summary.data.eventosEvaluablesReingreso)} evaluables`}/>
        <Kpi label="Reingreso <48 h" value={integer.format(summary.data.reingresosMenor48)} note="Indicador secundario"/>
        <Kpi label="Activos probables" value={integer.format(summary.data.activosProbables)} note="Corte actual, fuera del periodo"/>
      </section>
      {summary.data.periodoParcial && <div className="notice warning">El día actual es parcial y se excluye del promedio diario.</div>}
      {(summary.data.eventosConConflicto > 0 || summary.data.filasMultiplicadas > 0) && <div className="notice quality">Calidad visible: {integer.format(summary.data.eventosConConflicto)} eventos con conflicto y {integer.format(summary.data.filasMultiplicadas)} filas físicas adicionales.</div>}</>}
      {demand.data && <section className="grid">
        <article className="panel wide"><div className="panel-head"><div><span className="eyebrow">Demanda</span><h3>Atenciones por día</h3></div><span className="legend"><i/> Eventos</span></div><Trend points={demand.data?.tendencia ?? []}/></article>
        <article className="panel"><div className="panel-head"><div><span className="eyebrow">Cobertura</span><h3>Servicios de urgencias</h3></div></div>
          <div className="service-list">{demand.data?.servicios.map((item) => <div className="service" key={item.codigoServicio}><div><b>{item.servicio}</b><small>{item.centro} · {item.codigoServicio}</small></div><span className={item.atenciones ? '' : 'zero'}>{integer.format(item.atenciones)}</span></div>)}</div>
        </article>
      </section>}
      {triage.data && <section className="panel triage"><div className="panel-head"><div><span className="eyebrow">Triage</span><h3>Cobertura de registro</h3></div><strong>{percent(triage.data?.resumen.coberturaPct ?? null)}</strong></div>
        <div className="triage-grid"><div><b>{integer.format(triage.data?.resumen.eventosConTriage ?? 0)}</b><span>con Triage</span></div><div><b>{integer.format(triage.data?.resumen.universoTotal ?? 0)}</b><span>universo total</span></div><div><b>{metric(triage.data?.resumen.tiempoPromedioMinutos ?? null, ' min')}</b><span>tiempo registrado promedio</span></div><div><b>{integer.format(triage.data?.resumen.secuenciasInvertidas ?? 0)}</b><span>secuencias a revisar</span></div></div>
        <p className="context">La ausencia de Triage no excluye atenciones. El tiempo usa sólo secuencias cronológicamente interpretables y conserva los extremos; {integer.format(triage.data?.resumen.tiemposMayorIgual24h ?? 0)} casos son ≥24 h y {integer.format(triage.data?.resumen.tiemposMayorIgual7d ?? 0)} son ≥7 días.</p>
        <div className="coverage-list">{triage.data?.servicios.map((item) => <div key={item.codigoServicio}><span><b>{item.servicio}</b><small>{item.centro} · {integer.format(item.eventosConTriage)} de {integer.format(item.universoTotal)}</small></span><meter min="0" max="100" value={item.coberturaPct ?? 0}/><strong>{percent(item.coberturaPct)}</strong></div>)}</div>
        <div className="distribution-head"><h4>Clasificación nativa</h4><small>Porcentaje sobre eventos clasificados</small></div>
        <div className="distribution-list">{triage.data.clasificacion.map((item) => <div key={`${item.triageCodigo ?? 'null'}-${item.triageDescripcion ?? ''}`}><span><b>{item.triageCodigo ?? 'Sin código'} · {item.triageDescripcion ?? 'Sin descripción'}</b><small>{integer.format(item.eventos)} eventos</small></span><meter min="0" max="100" value={item.porcentajeSobreClasificados ?? 0}/><strong>{percent(item.porcentajeSobreClasificados)}</strong></div>)}</div>
      </section>}
      {(resolution.data || frequentation.data) && <section className="analytics-grid">
        {resolution.data && <article className="panel"><div className="panel-head"><div><span className="eyebrow">Resolución</span><h3>Destino de los eventos</h3></div></div><p className="context">Categorías nativas; sin fusionar destino, motivo de alta, N.E. o ausencia.</p><div className="distribution-list">{resolution.data.categorias.map((item) => <div key={`${item.destinoUrgPk ?? 'null'}-${item.destino ?? ''}`}><span><b>{item.destino ?? 'Sin registro'}</b><small>Clave {item.destinoUrgPk ?? 'sin dato'} · {integer.format(item.eventos)} eventos</small></span><meter min="0" max="100" value={item.porcentaje ?? 0}/><strong>{percent(item.porcentaje)}</strong></div>)}</div></article>}
        {frequentation.data && <article className="panel"><div className="panel-head"><div><span className="eyebrow">Frecuentación</span><h3>Eventos por paciente</h3></div></div><p className="context">Distribución descriptiva de pacientes identificables; sin juicio de uso.</p><div className="band-grid">{frequentation.data.bandas.map((item) => <div key={item.banda}><b>{item.banda}</b><span>eventos</span><strong>{integer.format(item.pacientes)}</strong><small>pacientes</small></div>)}</div></article>}
      </section>}
      <section className="panel detail"><div className="panel-head"><div><span className="eyebrow">Trazabilidad</span><h3>Detalle de eventos</h3></div><span>{integer.format(episodes.data?.total ?? 0)} registros</span></div>
        <div className="table-wrap"><table><thead><tr><th>Evento</th><th>Ingreso</th><th>Centro / servicio</th><th>Destino</th><th>Estancia</th><th>Calidad</th></tr></thead><tbody>
          {episodes.data?.rows.map((row) => <tr key={row.idUrgencia}><td>#{row.idUrgencia}</td><td>{dateTime(row.fechaIngreso)}</td><td><b>{row.centro}</b><small>{row.servicio}</small></td><td>{row.destino ?? 'Sin registro'}</td><td>{metric(row.permanenciaHoras, ' h')}</td><td><span className={row.conflicto ? 'pill alert' : 'pill'}>{row.conflicto ? 'Revisar' : 'Consistente'}</span></td></tr>)}
          {!episodes.isLoading && !episodes.isError && !episodes.data?.rows.length && <tr><td colSpan={6} className="empty">No hay eventos para los filtros seleccionados.</td></tr>}
        </tbody></table></div>
        <div className="pager"><button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button><span>Página {page}</span><button disabled={!episodes.data || page * episodes.data.pageSize >= episodes.data.total} onClick={() => setPage(page + 1)}>Siguiente</button></div>
      </section>
      <section className="roadmap"><div><span className="eyebrow">Siguientes módulos</span><h3>Evolución funcional</h3></div>{['Permanencia avanzada','Población','Calidad de datos'].map((name) => <article key={name}><i/> <span>{name}<small>Contrato validado · implementación pendiente</small></span></article>)}</section>
    </main>
    <footer>Uso institucional · Información operativa sin datos identificables de pacientes</footer>
  </div>;
}
