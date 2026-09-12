// Recortes canónicos de detalle sobre EventScope.
//
// Cada predicado es la ÚNICA definición del recorte: el agregado del KPI y el
// detalle paginado lo consumen desde aquí, de modo que agregado y detalle no
// pueden divergir por edición parcial (reconciliación obligatoria
// agregado ↔ detalle, HCG-DET-*). No introduce indicadores, fórmulas,
// universos ni fuentes nuevas: reproduce literalmente los predicados ya
// aceptados en los contratos de Urgencias.

/** URG-EJ-03: secuencia cronológicamente interpretable con egreso registrado. */
export const COMPLETADO = 'Fechaing IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr >= Fechaing';
/** URG-EJ-04: destino nativo HOSP. PISO sobre eventos completados. */
export const HOSPITALIZACION = `${COMPLETADO} AND destino_urg_pk = 5`;
/** URG-EJ-03: bandas exclusivas de permanencia registrada. */
export const PERMANENCIA_MENOR_12H = 'fechaegr >= Fechaing AND DATEDIFF(MINUTE, Fechaing, fechaegr) < 720';
export const PERMANENCIA_12A24H = 'fechaegr >= DATEADD(HOUR, 12, Fechaing) AND fechaegr < DATEADD(HOUR, 24, Fechaing)';
export const PERMANENCIA_24A48H = 'fechaegr >= DATEADD(HOUR, 24, Fechaing) AND fechaegr < DATEADD(HOUR, 48, Fechaing)';
export const PERMANENCIA_48A72H = 'fechaegr >= DATEADD(HOUR, 48, Fechaing) AND fechaegr <= DATEADD(HOUR, 72, Fechaing)';
export const PERMANENCIA_MAYOR_72H = 'fechaegr > DATEADD(HOUR, 72, Fechaing)';
/** URG-TRI-01 y URG-ATE-01: cobertura del hito registrado. */
export const TRIAGE_REGISTRADO = 'fechatri IS NOT NULL';
export const ATENCION_REGISTRADA = 'fechaate IS NOT NULL';
/** URG-CAL-01: conflicto de identidad del núcleo del evento. */
export const CONFLICTO_NUCLEO = 'conflicto_nucleo = 1';

/**
 * Recortes expuestos al detalle. `predicate === null` significa el universo
 * U-ING completo del periodo filtrado (URG-EJ-01), sin recorte adicional.
 */
export const DETAIL_SCOPES = {
  atenciones: { indicador: 'URG-EJ-01', titulo: 'Atenciones', predicate: null },
  permanencia_evaluables: { indicador: 'URG-EJ-03', titulo: 'Estancia registrada evaluable', predicate: COMPLETADO },
  permanencia_menor12h: { indicador: 'URG-EJ-03', titulo: 'Estancia registrada <12 h', predicate: PERMANENCIA_MENOR_12H },
  permanencia_12a24h: { indicador: 'URG-EJ-03', titulo: 'Estancia registrada 12–<24 h', predicate: PERMANENCIA_12A24H },
  permanencia_24a48h: { indicador: 'URG-EJ-03', titulo: 'Estancia registrada 24–<48 h', predicate: PERMANENCIA_24A48H },
  permanencia_48a72h: { indicador: 'URG-EJ-03', titulo: 'Estancia registrada 48–72 h', predicate: PERMANENCIA_48A72H },
  permanencia_mayor72h: { indicador: 'URG-EJ-03', titulo: 'Estancia registrada >72 h', predicate: PERMANENCIA_MAYOR_72H },
  hospitalizacion: { indicador: 'URG-EJ-04', titulo: 'Eventos con destino HOSP. PISO', predicate: HOSPITALIZACION },
  triage_registrado: { indicador: 'URG-TRI-01', titulo: 'Eventos con Triage registrado', predicate: TRIAGE_REGISTRADO },
  atencion_registrada: { indicador: 'URG-ATE-01', titulo: 'Eventos con Atención médica registrada', predicate: ATENCION_REGISTRADA },
  conflicto: { indicador: 'URG-CAL-01', titulo: 'Eventos con conflicto de identidad', predicate: CONFLICTO_NUCLEO },
} as const;

export type DetailScope = keyof typeof DETAIL_SCOPES;
export const DETAIL_SCOPE_KEYS = Object.keys(DETAIL_SCOPES) as [DetailScope, ...DetailScope[]];

/** Cláusula WHERE del recorte, ya lista para concatenarse sobre EventScope. */
export function detailScopeWhere(scope: DetailScope): string {
  const predicate = DETAIL_SCOPES[scope].predicate;
  return predicate ? `WHERE ${predicate}` : '';
}
