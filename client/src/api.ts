export type Filters = { desde: string; hasta: string; centro?: string; codigoServicio?: number; corte?: string };
export type Summary = {
  atenciones: number; pacientesUnicos: number; atencionesPorPaciente: number | null; diasCompletos: number;
  atencionesDiasCompletos: number; promedioDiario: number | null; periodoParcial: boolean;
  eventosCompletados: number; permanenciaPromedioHoras: number | null; permanenciaInvertidos: number;
  permanenciaSinEgreso: number; permanenciaMenor12h: number; permanencia12a24h: number;
  permanencia24a48h: number; permanencia48a72h: number; permanenciaMayor72h: number; hospitalizaciones: number;
  hospitalizacionPct: number | null; reingresosMenor48: number; reingresosMenor72: number;
  reingresoPct: number | null; eventosEvaluablesReingreso: number; activosProbables: number;
  activosAntiguedadNoEvaluable: number; activosFechaIngresoFutura: number;
  activosMayor24h: number; activosMayor48h: number; activosMayor72h: number;
  eventosConConflicto: number; filasMultiplicadas: number; observadoEn: string;
};
export type Demand = {
  tendencia: Array<{ fecha: string; atenciones: number }>;
  servicios: Array<{ centro: string; codigoServicio: number; servicio: string; atenciones: number; estado: string }>;
};

export type Triage = {
  resumen: { universoTotal: number; eventosConTriage: number; coberturaPct: number | null;
    eventosEvaluablesTiempo: number; tiempoPromedioMinutos: number | null; secuenciasInvertidas: number;
    tiemposMayorIgual24h: number; tiemposMayorIgual7d: number; mismoMinuto: number;
    de1a10: number; de11a30: number; de31a60: number; de61a120: number; de121a240: number; mayor240: number };
  servicios: Array<{ centro: string; codigoServicio: number; servicio: string; universoTotal: number;
    eventosConTriage: number; coberturaPct: number | null }>;
  clasificacion: Array<{ triageCodigo: number | null; triageDescripcion: string | null; eventos: number;
    porcentajeSobreClasificados: number | null }>;
};

export type Resolution = {
  categorias: Array<{ destinoUrgPk: number | null; destino: string | null; eventos: number; porcentaje: number | null }>;
};

export type Frequentation = {
  bandas: Array<{ banda: '1' | '2' | '3' | '4-5' | '6-10' | '11+'; pacientes: number }>;
};

export type Catalogs = {
  centros: Array<{ value: string; label: string }>;
  servicios: Array<{ value: number; label: string; centro: string }>;
};
export type Episodes = {
  total: number; page: number; pageSize: number;
  rows: Array<{ idUrgencia: number; fechaIngreso: string | null; fechaEgreso: string | null; centro: string | null;
    codigoServicio: number | null; servicio: string | null; destino: string | null; motivoAlta: string | null;
    permanenciaHoras: number | null; filasFisicas: number; conflicto: boolean }>;
};

const params = (values: Record<string, string | number | undefined>) => {
  const result = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== '') result.set(key, String(value)); });
  return result.toString();
};

async function get<T>(path: string): Promise<T> {
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(response.status === 400 ? 'Revisa los filtros seleccionados.' : 'No fue posible consultar la información.');
  return (await response.json()).data as T;
}

export const api = {
  catalogs: (centro?: string) => get<Catalogs>(`/api/urgencias/filters?${params({ centro })}`),
  summary: (filters: Filters) => get<Summary>(`/api/urgencias/summary?${params(filters)}`),
  triage: (filters: Filters) => get<Triage>(`/api/urgencias/triage?${params(filters)}`),
  demand: (filters: Filters) => get<Demand>(`/api/urgencias/demand?${params(filters)}`),
  resolution: (filters: Filters) => get<Resolution>(`/api/urgencias/resolution?${params(filters)}`),
  frequentation: (filters: Filters) => get<Frequentation>(`/api/urgencias/frequentation?${params(filters)}`),
  episodes: (filters: Filters, page: number) => get<Episodes>(`/api/urgencias/episodes?${params({ ...filters, page, pageSize: 20 })}`),
};
