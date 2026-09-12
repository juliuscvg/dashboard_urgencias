import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, type DetailScope, type Filters } from './api';
import { contextLabel } from './dashboardView';
import { hasReconciliationMismatch, lastPage, pageRangeLabel } from './detailReconciliation';
import { dateTime, integer, metric } from './format';

// Detalle bajo demanda (HCG-UX-007, HCG-UX-015, HCG-DET-*): se monta sólo al
// abrirse, pagina del lado servidor, conserva los filtros vigentes y reconcilia
// su total contra el agregado que lo abrió. Un único componente sirve a todos
// los recortes; no duplica reglas de universo, que viven en el servidor.
export type DetailRequest = { scope: DetailScope; title: string; indicator: string; expectedTotal: number | null };

export default function DetailDrawer({ request, filters, onClose }: { request: DetailRequest; filters: Filters; onClose: () => void }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const detail = useQuery({
    queryKey: ['detail', request.scope, filters, page, pageSize],
    queryFn: () => api.episodes(filters, page, pageSize, request.scope),
  });

  useEffect(() => { setPage(1); }, [request.scope, filters, pageSize]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const total = detail.data?.total ?? null;
  const mismatch = hasReconciliationMismatch(request.expectedTotal, total);

  const exportPage = () => {
    const columns = ['idUrgencia', 'fechaIngreso', 'fechaEgreso', 'centro', 'codigoServicio', 'servicio', 'destino', 'motivoAlta', 'permanenciaHoras', 'filasFisicas', 'conflicto'];
    const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csv = [columns.join(','), ...(detail.data?.rows ?? []).map((row) => columns.map((column) => escape(row[column as keyof typeof row])).join(','))].join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `detalle-${request.scope}-pagina-${page}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Detalle de ${request.title}`}>
      <div className="drawer-head">
        <div>
          <p className="eyebrow">Detalle auditable · {request.indicator}</p>
          <h2>{request.title}</h2>
          <strong>{detail.isPending ? 'Consultando…' : `${integer.format(total ?? 0)} eventos`}</strong>
        </div>
        <button className="close-button" aria-label="Cerrar detalle" onClick={onClose}>×</button>
      </div>
      <p className="drawer-context">{contextLabel(filters)}</p>
      {mismatch && <div className="notice error" role="alert">El total del detalle ({integer.format(total ?? 0)}) no coincide con el agregado mostrado ({integer.format(request.expectedTotal ?? 0)}).</div>}

      {detail.isError && <div className="drawer-state error">No fue posible cargar el detalle.<button onClick={() => { void detail.refetch(); }}>Reintentar</button></div>}
      {detail.isPending && <div className="drawer-state" role="status">Cargando detalle…</div>}
      {!detail.isPending && !detail.isError && <>
        <div className="drawer-actions">
          <button onClick={exportPage} disabled={!detail.data?.rows.length}>Exportar página CSV</button>
          {detail.isFetching && <span className="inline-loading">Consultando página…</span>}
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Evento</th><th>Ingreso</th><th>Egreso</th><th>Centro / servicio</th><th>Destino</th><th>Estancia</th><th>Calidad</th></tr></thead>
            <tbody>
              {detail.data?.rows.map((row) => <tr key={row.idUrgencia}>
                <td>#{row.idUrgencia}</td><td>{dateTime(row.fechaIngreso)}</td><td>{dateTime(row.fechaEgreso)}</td>
                <td><b>{row.centro}</b><small>{row.servicio}</small></td><td>{row.destino ?? 'Sin registro'}</td>
                <td>{metric(row.permanenciaHoras, ' h')}</td>
                <td><span className={row.conflicto ? 'pill alert' : 'pill'}>{row.conflicto ? 'Revisar' : 'Consistente'}</span></td>
              </tr>)}
            </tbody>
          </table>
          {!detail.data?.rows.length && <div className="empty">No hay eventos para este recorte con los filtros vigentes.</div>}
        </div>
        <div className="pager">
          <label>Filas<select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select></label>
          <span>{pageRangeLabel(page, pageSize, total ?? 0)}</span>
          <button disabled={page === 1 || detail.isFetching} onClick={() => setPage(page - 1)}>Anterior</button>
          <button disabled={page >= lastPage(total ?? 0, pageSize) || detail.isFetching} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      </>}
    </aside>
  </div>;
}
