import type { AttentionServiceCoverage, AttentionSummary, DashboardFilters, DetailFilters, DemandPoint, EpisodeRow, FrequentationBand, ResolutionItem, ServiceDemand, Summary, TriageCategory } from '../domain/types.js';
import { fetchAttention, fetchCurrent, fetchDemand, fetchEpisodes, fetchFrequentation, fetchReadmissions, fetchResolution, fetchSummaryBase, fetchTriage } from '../repository/urgencias.repository.js';

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
    permanenciaInvertidos: asNumber(base.permanenciaInvertidos), permanenciaSinEgreso: asNumber(base.permanenciaSinEgreso),
    permanenciaMenor12h: asNumber(base.permanenciaMenor12h), permanencia12a24h: asNumber(base.permanencia12a24h),
    permanencia24a48h: asNumber(base.permanencia24a48h), permanencia48a72h: asNumber(base.permanencia48a72h),
    permanenciaMayor72h: asNumber(base.permanenciaMayor72h),
    hospitalizaciones: asNumber(base.hospitalizaciones), hospitalizacionPct: nullableNumber(base.hospitalizacionPct),
    reingresosMenor48: asNumber(readmissions.reingresosMenor48), reingresosMenor72: under72,
    reingresoPct: evaluable ? Math.round((under72 * 10_000) / evaluable) / 100 : null,
    eventosEvaluablesReingreso: evaluable, activosProbables: asNumber(current.activosProbables),
    activosAntiguedadNoEvaluable: asNumber(current.activosAntiguedadNoEvaluable),
    activosFechaIngresoFutura: asNumber(current.activosFechaIngresoFutura),
    activosMayor24h: asNumber(current.activosMayor24h), activosMayor48h: asNumber(current.activosMayor48h),
    activosMayor72h: asNumber(current.activosMayor72h),
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

export async function getResolution(filters: DashboardFilters): Promise<{ categorias: ResolutionItem[] }> {
  const rows = await fetchResolution(filters) as Record<string, unknown>[];
  return { categorias: rows.map((row) => ({
    destinoUrgPk: nullableNumber(row.destinoUrgPk),
    destino: row.destino === null || row.destino === undefined ? null : String(row.destino),
    eventos: asNumber(row.eventos),
    porcentaje: nullableNumber(row.porcentaje),
  })) };
}

export async function getFrequentation(filters: DashboardFilters): Promise<{ bandas: FrequentationBand[] }> {
  const rows = await fetchFrequentation(filters) as Record<string, unknown>[];
  return { bandas: rows.map((row) => ({
    banda: String(row.banda) as FrequentationBand['banda'],
    pacientes: asNumber(row.pacientes),
  })) };
}

export async function getEpisodes(filters: DetailFilters): Promise<{ total: number; page: number; pageSize: number; rows: EpisodeRow[] }> {
  const result = await fetchEpisodes(filters);
  return { ...result, page: filters.page, pageSize: filters.pageSize };
}


export async function getAttention(filters: DashboardFilters): Promise<{ resumen: AttentionSummary; servicios: AttentionServiceCoverage[] }> {
  const result = await fetchAttention(filters);
  const row = result.resumen;
  return {
    resumen: {
      universoTotal: asNumber(row.universoTotal),
      eventosConAtencion: asNumber(row.eventosConAtencion),
      eventosSinAtencion: asNumber(row.eventosSinAtencion),
      coberturaPct: nullableNumber(row.coberturaPct),
      evaluables: asNumber(row.evaluables),
      invertidos: asNumber(row.invertidos),
      promedioMinutos: nullableNumber(row.promedioMinutos),
      mismoMinuto: asNumber(row.mismoMinuto),
      de0a30: asNumber(row.de0a30), de31a60: asNumber(row.de31a60),
      de61a120: asNumber(row.de61a120), de121a240: asNumber(row.de121a240),
      mayor240: asNumber(row.mayor240),
      mayorIgual24h: asNumber(row.mayorIgual24h), mayorIgual7d: asNumber(row.mayorIgual7d),
    },
    servicios: result.servicios.map((item: any): AttentionServiceCoverage => ({
      centro: String(item.centro), codigoServicio: asNumber(item.codigoServicio), servicio: String(item.servicio),
      universoTotal: asNumber(item.universoTotal), eventosConAtencion: asNumber(item.eventosConAtencion),
      coberturaPct: nullableNumber(item.coberturaPct),
    })),
  };
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
      mismoMinuto: asNumber(row.mismoMinuto), de1a10: asNumber(row.de1a10),
      de11a30: asNumber(row.de11a30), de31a60: asNumber(row.de31a60),
      de61a120: asNumber(row.de61a120), de121a240: asNumber(row.de121a240),
      mayor240: asNumber(row.mayor240),
    },
    servicios: result.servicios.map((item: any) => ({
      centro: String(item.centro), codigoServicio: asNumber(item.codigoServicio), servicio: String(item.servicio),
      universoTotal: asNumber(item.universoTotal), eventosConTriage: asNumber(item.eventosConTriage),
      coberturaPct: nullableNumber(item.coberturaPct),
    })),
    clasificacion: result.clasificacion.map((item: any): TriageCategory => ({
      triageCodigo: nullableNumber(item.triageCodigo),
      triageDescripcion: item.triageDescripcion === null || item.triageDescripcion === undefined ? null : String(item.triageDescripcion),
      eventos: asNumber(item.eventos), porcentajeSobreClasificados: nullableNumber(item.porcentajeSobreClasificados),
    })),
  };
}
