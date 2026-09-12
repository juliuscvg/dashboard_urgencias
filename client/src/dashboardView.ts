import type { Filters } from './api';

// Estado de navegación de la vista (HCG-VIS-001..003). La perspectiva se
// persiste en la URL igual que cualquier otro filtro (HCG-VIS-002/HCG-FIL-003):
// recargar o compartir el enlace reconstruye perspectiva y contexto.
export type DashboardView = 'operation' | 'population' | 'performance';

export const DASHBOARD_VIEWS: readonly DashboardView[] = ['operation', 'population', 'performance'] as const;

export const isDashboardView = (value: string | null): value is DashboardView =>
  value !== null && (DASHBOARD_VIEWS as readonly string[]).includes(value);

export const readDashboardView = (search: string): DashboardView => {
  const value = new URLSearchParams(search).get('vista');
  return isDashboardView(value) ? value : 'operation';
};

export function readFilters(search: string, defaults: { desde: string; hasta: string }): Filters {
  const url = new URLSearchParams(search);
  const servicio = url.get('servicio');
  return {
    desde: url.get('desde') ?? defaults.desde,
    hasta: url.get('hasta') ?? defaults.hasta,
    centro: url.get('centro') || undefined,
    codigoServicio: servicio ? Number(servicio) : undefined,
  };
}

export function writeContext(filters: Filters, view: DashboardView): string {
  const params = new URLSearchParams({ desde: filters.desde, hasta: filters.hasta, vista: view });
  if (filters.centro) params.set('centro', filters.centro);
  if (filters.codigoServicio) params.set('servicio', String(filters.codigoServicio));
  return params.toString();
}

/** Etiqueta de contexto reutilizada por el detalle para evidenciar que conserva los filtros. */
export const contextLabel = (filters: Filters) =>
  [`${filters.desde} — ${filters.hasta}`, filters.centro ?? 'Todos los centros',
    filters.codigoServicio ? `Servicio ${filters.codigoServicio}` : 'Todos los servicios'].join(' · ');
