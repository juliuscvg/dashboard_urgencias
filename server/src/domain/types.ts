export interface DashboardFilters {
  desde: string;
  hasta: string;
  centro?: string;
  codigoServicio?: number;
  corte?: string;
}

export interface DetailFilters extends DashboardFilters {
  page: number;
  pageSize: number;
}

export interface Summary {
  atenciones: number;
  pacientesUnicos: number;
  atencionesPorPaciente: number | null;
  diasCompletos: number;
  atencionesDiasCompletos: number;
  promedioDiario: number | null;
  periodoParcial: boolean;
  eventosCompletados: number;
  permanenciaPromedioHoras: number | null;
  permanenciaInvertidos: number;
  permanenciaSinEgreso: number;
  permanenciaMenor12h: number;
  permanencia12a24h: number;
  permanencia24a48h: number;
  permanencia48a72h: number;
  permanenciaMayor72h: number;
  hospitalizaciones: number;
  hospitalizacionPct: number | null;
  reingresosMenor48: number;
  reingresosMenor72: number;
  reingresoPct: number | null;
  eventosEvaluablesReingreso: number;
  activosProbables: number;
  activosAntiguedadNoEvaluable: number;
  activosFechaIngresoFutura: number;
  activosMayor24h: number;
  activosMayor48h: number;
  activosMayor72h: number;
  eventosConConflicto: number;
  filasMultiplicadas: number;
  observadoEn: string;
}

export interface FilterOption {
  value: string | number;
  label: string;
  centro?: string;
}

export interface DemandPoint {
  fecha: string;
  atenciones: number;
}

export interface ServiceDemand {
  centro: string;
  codigoServicio: number;
  servicio: string;
  atenciones: number;
  estado: 'CON_ACTIVIDAD' | 'SIN_ACTIVIDAD_EN_EL_PERIODO';
}

export interface ResolutionItem {
  destinoUrgPk: number | null;
  destino: string | null;
  eventos: number;
  porcentaje: number | null;
}

export interface FrequentationBand {
  banda: '1' | '2' | '3' | '4-5' | '6-10' | '11+';
  pacientes: number;
}

export interface TriageCategory {
  triageCodigo: number | null;
  triageDescripcion: string | null;
  eventos: number;
  porcentajeSobreClasificados: number | null;
}

export interface AttentionSummary {
  universoTotal: number;
  eventosConAtencion: number;
  eventosSinAtencion: number;
  coberturaPct: number | null;
  evaluables: number;
  invertidos: number;
  promedioMinutos: number | null;
  mismoMinuto: number;
  de0a30: number;
  de31a60: number;
  de61a120: number;
  de121a240: number;
  mayor240: number;
  mayorIgual24h: number;
  mayorIgual7d: number;
}

export interface AttentionServiceCoverage {
  centro: string;
  codigoServicio: number;
  servicio: string;
  universoTotal: number;
  eventosConAtencion: number;
  coberturaPct: number | null;
}

export interface EpisodeRow {
  idUrgencia: number;
  fechaIngreso: string | null;
  fechaEgreso: string | null;
  centro: string | null;
  codigoServicio: number | null;
  servicio: string | null;
  destino: string | null;
  motivoAlta: string | null;
  permanenciaHoras: number | null;
  filasFisicas: number;
  conflicto: boolean;
}