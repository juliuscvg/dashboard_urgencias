export interface DashboardFilters {
  desde: string;
  hasta: string;
  centro?: string;
  codigoServicio?: number;
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
  hospitalizaciones: number;
  hospitalizacionPct: number | null;
  reingresosMenor48: number;
  reingresosMenor72: number;
  reingresoPct: number | null;
  eventosEvaluablesReingreso: number;
  activosProbables: number;
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