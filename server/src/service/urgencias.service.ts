import type { DashboardFilters, DetailFilters, DemandPoint, EpisodeRow, ServiceDemand, Summary } from '../domain/types.js';
import { fetchCurrent, fetchDemand, fetchEpisodes, fetchReadmissions, fetchSummaryBase, fetchTriage } from '../repository/urgencias.repository.js';

const asNumber = (value: unknown): number => Number(value ?? 0);
const nullableNumber = (value: unknown): number | null => value === null || value === undefined ? null : Number(value);

export async function getSummary(filters: DashboardFilters): Promise<Summary> {
  const [base, readmissions, current] = await Promise.all([fetchSummaryBase(filters), fetchReadmissions(filters), fetchCurrent(filters)]);
  const evaluable = asNumber(readmissions.eventosEvaluables);
  const under72 = asNumber(readmissions.reingresosMenor72);
  return {
    atenciones: asNumber(base.atenciones), pacientesUnicos: asNumber(base.pacientesUnicos),
    atencionesPorPaciente: nullableNumber(base.atencionesPorPaciente), diasCompletos: asNumber(base.diasCompletos),
    atencionesDiasCompletos: asNumber(base.atencionesDiasCompletos), promedioDiario: nullableNumber(base.promedioDiario),
    periodoParcial: Boolean(base.periodoParcial), eventosCompletados: asNumber(base.eventosCompletados),
    permanenciaPromedioHoras: nullableNumber(base.permanenciaPromedioHoras),
    hospitalizaciones: asNumber(base.hospitalizaciones), hospitalizacionPct: nullableNumber(base.hospitalizacionPct),
    reingresosMenor48: asNumber(readmissions.reingresosMenor48), reingresosMenor72: under72,
    reingresoPct: evaluable ? Math.round((under72 * 10_000) / evaluable) / 100 : null,
    eventosEvaluablesReingreso: evaluable, activosProbables: asNumber(current.activosProbables),
    eventosConConflicto: asNumber(base.eventosConConflicto), filasMultiplicadas: asNumber(base.filasMultiplicadas),
    observadoEn: new Date(String(current.observadoEn ?? base.observadoEn)).toISOString(),
  };
}

export async function getDemand(filters: DashboardFilters): Promise<{ tendencia: DemandPoint[]; servicios: ServiceDemand[] }> {
  const data = await fetchDemand(filters);
  return {
    tendencia: data.tendencia.map((row: any) => ({ fecha: String(row.fecha), atenciones: asNumber(row.atenciones) })),
    servicios: data.servicios.map((row: any) => ({
      centro: String(row.centro), codigoServicio: asNumber(row.codigoServicio), servicio: String(row.servicio),
      atenciones: asNumber(row.atenciones), estado: row.estado,
    })),
  };
}

export async function getEpisodes(filters: DetailFilters): Promise<{ total: number; page: number; pageSize: number; rows: EpisodeRow[] }> {
  const result = await fetchEpisodes(filters);
  return { ...result, page: filters.page, pageSize: filters.pageSize };
}


export async function getTriage(filters: DashboardFilters) {
  const result = await fetchTriage(filters);
  const row = result.resumen;
  return {
    resumen: {
      universoTotal: asNumber(row.universoTotal),
      eventosConTriage: asNumber(row.eventosConTriage),
      coberturaPct: nullableNumber(row.coberturaPct),
      eventosEvaluablesTiempo: asNumber(row.eventosEvaluablesTiempo),
      tiempoPromedioMinutos: nullableNumber(row.tiempoPromedioMinutos),
      secuenciasInvertidas: asNumber(row.secuenciasInvertidas),
      tiemposMayorIgual24h: asNumber(row.tiemposMayorIgual24h),
      tiemposMayorIgual7d: asNumber(row.tiemposMayorIgual7d),
    },
    servicios: result.servicios.map((item: any) => ({
      centro: String(item.centro), codigoServicio: asNumber(item.codigoServicio), servicio: String(item.servicio),
      universoTotal: asNumber(item.universoTotal), eventosConTriage: asNumber(item.eventosConTriage),
      coberturaPct: nullableNumber(item.coberturaPct),
    })),
  };
}
