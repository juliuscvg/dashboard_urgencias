# Contratos de indicadores aceptados — Urgencias

- Dominio: Urgencias HCG
- Versión contractual: 2026-09-08.1
- Fuente primaria: `dbo.vUrgencias`
- Fuentes complementarias: `dbo.servicios` y `dbo.centros`
- Universo común U-ING: eventos con `id_urgencia` y `Fechaing` en `[@Desde, DATEADD(DAY,1,@Hasta))`, asociados a servicios `codigo_area=2 AND serv_activo_sn=1`.
- Granularidad común: un evento por `id_urgencia`, con conflictos de atributos y multiplicación física visibles.
- Filtros comunes: periodo, centro y servicio; centro/servicio provienen de catálogos.
- Exclusión común: ninguna por antigüedad, duración o apariencia anómala. Sólo exclusiones expresas de cada contrato.
- Decisiones rectoras: URG-GOV-035..037 en [decisiones](../gobierno/DECISIONES_Y_CAMBIOS.md).

Los estados técnicos siguen [la convención HCG](https://github.com/juliuscvg/dashboard_hcg_specs/blob/main/transversal/ESTADOS_FUNCIONALES_TECNICOS.md). Ningún contrato está `RECONCILIADO CON FUENTE` en la aplicación mientras falte configuración DB local.

## URG-EJ-01 — Atenciones

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición/propósito: número de eventos únicos de Urgencias; mide demanda registrada.
- Unidad/granularidad: evento / `id_urgencia`.
- Numerador/denominador/fórmula: NO APLICA / NO APLICA / conteo de EventScope.
- NULL/exclusiones: `id_urgencia` nulo no puede formar evento; otros faltantes no excluyen.
- Temporalidad: `Fechaing`; periodo común.
- SQL: [URG-EJ-01_ATENCIONES.sql](../../scripts/sql/indicadores/URG-EJ-01_ATENCIONES.sql).
- Benchmark/evidencia: 484,190 aproximado para ventana Triage comunicada; requiere periodo exacto. [Benchmarks](../evidencia/BENCHMARKS_VIGENTES.md).
- Anomalías/cobertura: filas físicas adicionales y conflictos se reportan; cobertura NO APLICA.
- Drill-down/reconciliación: tendencia y total del detalle deben sumar el mismo universo.
- Implementación: `fetchSummaryBase`, `/api/urgencias/summary`, KPI Atenciones.

## URG-EJ-02 — Promedio diario

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición/propósito: atenciones de días calendario completos por número de días completos.
- Unidad: eventos/día. Numerador: atenciones antes de `@FinCompleto`. Denominador: días calendario, incluidos días con cero actividad.
- NULL/exclusiones: denominador cero produce no calculable; día actual parcial no entra y se etiqueta.
- Temporalidad/cutoff: `Fechaing`, `@Corte`; comparaciones usan periodos homólogos cerrados.
- SQL: [URG-EJ-02_PROMEDIO_DIARIO.sql](../../scripts/sql/indicadores/URG-EJ-02_PROMEDIO_DIARIO.sql).
- Benchmark: NO DOCUMENTADO. Anomalías: no cambian el numerador.
- Drill-down/reconciliación: numerador reconcilia con Atenciones restringidas a días completos.
- Implementación: `fetchSummaryBase`, `/summary`, KPI Promedio diario.

## URG-EJ-03 — Permanencia registrada

- Estado funcional: ACEPTADO CON OBSERVACIONES. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición/propósito: tiempo registrado entre ingreso y egreso para completados cronológicamente interpretables.
- Unidad: horas por evento. Numerador: suma de minutos/60. Denominador: eventos con ambas fechas y `fechaegr>=Fechaing`.
- NULL/exclusiones: faltantes e invertidos no integran el promedio y se cuantifican; ningún extremo válido se recorta.
- Temporalidad: cohorte U-ING; bandas <12, 12–24, 24–48, 48–72 y >72 h.
- SQL: [URG-EJ-03_PERMANENCIA_REGISTRADA.sql](../../scripts/sql/indicadores/URG-EJ-03_PERMANENCIA_REGISTRADA.sql).
- Benchmark: NO DOCUMENTADO. Limitación: registro histórico no garantiza presencia física continua.
- Cobertura: evaluables/universo; drill-down conserva duración original.
- Implementación: `fetchSummaryBase`, `fetchEpisodes`, `/summary`, `/episodes`.

## URG-EJ-04 — Hospitalización

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición/propósito: eventos completados cuyo destino es HOSP. PISO.
- Unidad: evento. Numerador: completados con `destino_urg_pk=5`. Denominador: completados del mismo universo.
- NULL/exclusiones: destino nulo permanece en denominador si el evento es completado; no ampliar a otros destinos.
- Temporalidad/dimensiones: U-ING; periodo, centro, servicio.
- SQL: [URG-EJ-04_HOSPITALIZACION.sql](../../scripts/sql/indicadores/URG-EJ-04_HOSPITALIZACION.sql).
- Benchmark: NO DOCUMENTADO. Cobertura: completados/universo.
- Reconciliación: numerador es categoría exacta del destino nativo.
- Implementación: `fetchSummaryBase`, `/summary`, KPI Hospitalización.

## URG-EJ-05 — Reingresos <72 h y referencia <48 h

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición: evento actual con egreso previo válido más reciente del mismo `codigo_cliente` y `codigo_servicio_ingreso`.
- Unidad: evento actual, máximo una vez.
- Numeradores: diferencia estricta <72 h; referencia estricta <48 h. Denominador: eventos evaluables U-ING.
- Fórmula: numerador / evaluables ×100. Exactamente 72 o 48 h queda fuera del corte respectivo.
- NULL/exclusiones: evaluabilidad requiere evento, paciente, servicio e ingreso; antecedente puede estar fuera del periodo.
- Temporalidad: `prior.fechaegr < actual.Fechaing`; previo completado y orden determinista.
- SQL: [URG-EJ-05_REINGRESOS.sql](../../scripts/sql/indicadores/URG-EJ-05_REINGRESOS.sql).
- Benchmark/evidencia: corrida R07B v2 en [evidencia SQL](../evidencia/VALIDACION_SQL_FUNCIONAL_2026-09-08.md).
- Anomalías: no usar LAG ingenuo ni redondeo para pertenencia.
- Implementación: `READMISSION_PRIOR_SQL`, `fetchReadmissions`, `/summary`.

## URG-EJ-06 — Pacientes únicos

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición: identidades longitudinales distintas en U-ING.
- Unidad: paciente / `codigo_cliente`. Fórmula: `COUNT(DISTINCT codigo_cliente)`.
- NULL: eventos sin paciente siguen en Atenciones y no crean identidad ficticia.
- Temporalidad/dimensiones: periodo, centro, servicio; subtotales no son aditivos.
- SQL: [URG-EJ-06_PACIENTES_UNICOS.sql](../../scripts/sql/indicadores/URG-EJ-06_PACIENTES_UNICOS.sql).
- Benchmark: aproximadamente 1,272,239 históricos, no vigente como censo.
- Reconciliación: detalle identificable requiere autorización; agregado no expone PII.
- Implementación: `fetchSummaryBase`, `/summary`, KPI Pacientes únicos.

## URG-EJ-07 — Atenciones por paciente

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición/fórmula: atenciones / pacientes únicos del mismo universo.
- Unidad: eventos por paciente. NULL: cero pacientes produce no calculable.
- Temporalidad/dimensiones: iguales a Atenciones y Pacientes únicos; no agregar cocientes.
- SQL: [URG-EJ-07_ATENCIONES_POR_PACIENTE.sql](../../scripts/sql/indicadores/URG-EJ-07_ATENCIONES_POR_PACIENTE.sql).
- Benchmark: NO DOCUMENTADO. Cobertura: pacientes identificables.
- Reconciliación: ambos operandos se devuelven junto con el cociente.
- Implementación: `fetchSummaryBase`, `/summary`, contexto de Pacientes únicos.

## URG-ACT-01 — Activos probables

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición: `fechaegr IS NULL AND motivo_alta_pk IS NULL`; contexto operacional, no confirmación de presencia.
- Unidad: evento. Numerador/denominador: conteo / NO APLICA.
- Temporalidad: sin periodo histórico; `@Corte` explícito para antigüedad.
- NULL/anomalías: ingreso nulo o futuro permanece y se clasifica no evaluable/inconsistente; extremos visibles.
- SQL: [URG-ACT-01_ACTIVOS_PROBABLES.sql](../../scripts/sql/indicadores/URG-ACT-01_ACTIVOS_PROBABLES.sql).
- Benchmark: 349 observados en corrida fechada; mutable.
- Implementación: `fetchCurrent`, `/summary`, tarjeta operacional separada.

## URG-MOD-01 — Demanda diaria

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición: Atenciones agrupadas por fecha calendario de `Fechaing`.
- Unidad: evento/día. Numerador: eventos por fecha. Denominador: NO APLICA.
- NULL/exclusiones: las fechas pertenecen al universo; servicios aplicables sin eventos se muestran aparte como sin actividad.
- SQL: [URG-MOD-01_DEMANDA.sql](../../scripts/sql/indicadores/URG-MOD-01_DEMANDA.sql).
- Benchmark: NO DOCUMENTADO. Reconciliación: suma diaria = Atenciones.
- Implementación: `fetchDemand`, `/demand`, gráfica y catálogo con ceros.

## URG-MOD-05 — Resolución y destino

- Estado funcional: ACEPTADO. Estado técnico: RECONCILIADO CON FUENTE.
- Definición: distribución por `destino_urg_pk/destino_urgencias` nativos.
- Unidad: evento. Numerador: eventos de categoría. Denominador: EventScope.
- NULL: NULL y N.E. pk 99 separados. No se fusiona motivo de alta.
- Temporalidad/dimensiones: U-ING; categorías originales. Top N + Otros sólo presentación reversible.
- SQL: [URG-MOD-05_RESOLUCION.sql](../../scripts/sql/indicadores/URG-MOD-05_RESOLUCION.sql).
- Benchmark: NO DOCUMENTADO. Anomalías: variantes contradictorias visibles.
- Implementación: `fetchResolution`, `/urgencias/resolution`, módulo agregado UI y destino en detalle; reconciliada con fuente.

## URG-MOD-09 — Frecuentación

- Estado funcional: ACEPTADO. Estado técnico: RECONCILIADO CON FUENTE.
- Definición: número de eventos por paciente durante el periodo.
- Unidad: paciente. Bandas: 1, 2, 3, 4–5, 6–10, 11+.
- NULL: pacientes no identificables no se clasifican; se reportan por separado en Pacientes únicos.
- Temporalidad/dimensiones: U-ING; descriptivo, sin juicio de uso inapropiado.
- SQL: [URG-MOD-09_FRECUENTACION.sql](../../scripts/sql/indicadores/URG-MOD-09_FRECUENTACION.sql).
- Benchmark: outlier histórico de 1,493 eventos conservado, no meta.
- Drill-down: Top N sólo exploración autorizada.
- Implementación: `fetchFrequentation`, `/urgencias/frequentation` y bandas completas en UI; reconciliada con fuente.

## URG-TRI-01 — Cobertura de Triage

- Estado funcional: ACEPTADO. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición: eventos con `fechatri` / universo total ×100.
- Unidad: evento. NULL: ausencia permanece dentro del universo.
- Temporalidad/dimensiones: U-ING por centro, servicio y periodo.
- SQL: [URG-TRI-01_COBERTURA.sql](../../scripts/sql/indicadores/URG-TRI-01_COBERTURA.sql).
- Benchmark: 45,577 de 484,190, 9.41%, ventana aproximada; heterogeneidad documentada.
- Limitación: cobertura no equivale a validez ni madurez clínica.
- Implementación: `fetchTriage`, `/triage`, sección de cobertura.

## URG-TRI-02 — Clasificación de Triage

- Estado funcional: ACEPTADO. Estado técnico: RECONCILIADO CON FUENTE.
- Definición: distribución nativa 1 Crítico, 2 Emergencia, 3 Urgencia, 4 Estándar, 5 No Urgente, 6 Sin Evaluar.
- Unidad: evento con clasificación. Denominador: clasificados; cobertura se presenta junto al resultado.
- NULL: sin clasificación permanece fuera del denominador y visible en cobertura.
- Temporalidad/dimensiones: U-ING, centro, servicio, periodo.
- SQL: [URG-TRI-02_CLASIFICACION.sql](../../scripts/sql/indicadores/URG-TRI-02_CLASIFICACION.sql).
- Benchmark: NO DOCUMENTADO. No crear homologaciones, metas o semáforos.
- Implementación: clasificación en `fetchTriage`, `/urgencias/triage` y UI junto a cobertura; reconciliada con fuente.

## URG-TRI-03 — Tiempo registrado a Triage

- Estado funcional: ACEPTADO CON OBSERVACIONES. Estado técnico: VALIDADO TÉCNICAMENTE.
- Definición: `fechatri - Fechaing`; no se denomina automáticamente tiempo de espera.
- Unidad: minutos por evento. Numerador/denominador: suma de minutos / secuencias no negativas.
- NULL/exclusiones: faltantes e invertidos no integran promedio, pero se cuantifican; extremos no se recortan.
- Bandas: mismo minuto, 1–10, 11–30, 31–60, 61–120, 121–240, >240 min.
- SQL: [URG-TRI-03_TIEMPO_REGISTRADO.sql](../../scripts/sql/indicadores/URG-TRI-03_TIEMPO_REGISTRADO.sql).
- Benchmark: NO DOCUMENTADO; señales >24 h y >7 días visibles.
- Cobertura: con Triage, universo y evaluables acompañan el promedio.
- Implementación: `fetchTriage`, `/triage`, resumen contextual.

## URG-ATE-01 — Atención médica registrada

- Estado funcional: ACEPTADO CON OBSERVACIONES (decisión institucional, ITER-009). Estado técnico: RECONCILIADO CON FUENTE.
- Definición/propósito: cobertura y tiempo registrado del hito de Atención médica dentro de U-ING, usando el timestamp canónico `fechaate` (`datetime`, nullable).
- Unidad/granularidad: evento / `id_urgencia`. Numerador: eventos con `fechaate` no nulo. Denominador: U-ING del mismo periodo, centro y servicio.
- NULL/exclusiones: la ausencia de `fechaate` no excluye el evento del universo; se cuantifica como `eventosSinAtencion`. No se usa `atencion_fecha` para completar valores; su equivalencia permanece POR DEFINIR y no forma parte de este contrato.
- Temporalidad: `Fechaing→fechaate`; sólo pares no negativos (`fechaate>=Fechaing`) son evaluables para duración. Los pares negativos se cuentan como `invertidos` y no integran el promedio ni las bandas, pero tampoco se excluyen del universo.
- Bandas: mismo minuto, 0–30, 31–60, 61–120, 121–240 y >240 min, exclusivas sobre secuencias evaluables. Señales adicionales de calidad (`invertidos`, `mayorIgual24h`, `mayorIgual7d`) siguen `URG-CAL-01`.
- Limitaciones: `fechaate` acredita un timestamp registrado, no presencia física continua ni que la atención ocurrió exactamente en ese instante; no se denomina "tiempo de espera" ni "oportunidad asistencial", y no se afirma inicio clínico real. Es complementario: no requiere Triage, Alta Médica o Egreso y no sustituye esos hitos.
- SQL: [URG-ATE-01_ATENCION_MEDICA.sql](../../scripts/sql/indicadores/URG-ATE-01_ATENCION_MEDICA.sql).
- Benchmark/evidencia: cobertura 12/24/36 meses 94.1141% / 92.7560% / 88.0736% (validación funcional previa, [ITER-006](../iteraciones/ITER-006.md)); reconciliación SQL→API exacta sobre ventana operativa en [ITER-009](../iteraciones/ITER-009.md).
- Implementación: `fetchAttention`, `getAttention`, `/api/urgencias/attention`, panel "Atención médica" con cobertura, bandas, cobertura por servicio y advertencia de calidad URG-CAL-01 en UI.

## URG-CAL-01 — Calidad de datos (capa transversal)

- Estado funcional: DEFINIDO FUNCIONALMENTE. Estado técnico: RECONCILIADO CON FUENTE.
- Definición/propósito: capa transversal que asocia las señales de calidad ya
  existentes en los indicadores aceptados a su indicador dueño; no introduce
  campo, fuente, fórmula ni universo propio.
- Regla de promoción a UI: una señal sólo es advertencia visible si su
  indicador está `ACEPTADO` o `ACEPTADO CON OBSERVACIONES`; el resto queda
  como auditoría técnica en evidencia/SQL hasta decisión institucional de KPI
  del bloque correspondiente.
- Inventario vigente:
  - Conflicto de identidad/multiplicación física (`eventosConConflicto`,
    `filasMultiplicadas`, `conflicto`) → URG-EJ-01, transversal a EventScope.
  - Inversión de permanencia y evento sin egreso (`permanenciaInvertidos`,
    `permanenciaSinEgreso`) → URG-EJ-03.
  - Antigüedad no evaluable e ingreso futuro (`activosAntiguedadNoEvaluable`,
    `activosFechaIngresoFutura`) → URG-ACT-01.
  - Secuencia Triage invertida (`secuenciasInvertidas`) y tiempos ≥24h/≥7d
    (`tiemposMayorIgual24h`, `tiemposMayorIgual7d`) → URG-TRI-03.
  - Secuencia Ingreso→Atención invertida y tiempos ≥24h/≥7d (`invertidos`,
    `mayorIgual24h`, `mayorIgual7d` de Atención médica) → URG-ATE-01 (ITER-009).
- NULL/exclusiones: NO APLICA; cada señal conserva las exclusiones de su
  indicador dueño, declaradas en su propio contrato.
- Gap cerrado en ITER-008: `tiemposMayorIgual24h`/`tiemposMayorIgual7d` se
  exponían por `/urgencias/triage` y ya se mostraban como texto contextual;
  ahora se presentan como advertencia de calidad condicional
  (`notice quality`), visible sólo cuando alguno es mayor a cero, con el
  mismo tratamiento visual que la señal de EJ-01. Sin campo, fórmula, umbral
  ni SQL nuevos.
- SQL: NO APLICA (reutiliza los SQL de cada indicador dueño, sin SQL propio).
- Implementación: avisos y bandas ya presentes en `client/src/App.tsx` para
  cada indicador dueño listado arriba; sin endpoint ni tabla propios.
- Evidencia: [ITER-007](../iteraciones/ITER-007.md) (definición e inventario);
  [ITER-008](../iteraciones/ITER-008.md) (cierre del gap UI de TRI-03).
