# Estado de indicadores

Corte documental: 2026-09-08. Los estados describen el contrato funcional; la columna técnica indica el alcance efectivamente entregado.

| Indicador o bloque | Estado funcional | Implementación en esta fase | Evidencia o condición |
|---|---|---|---|
| Atenciones | ACEPTADO | API, KPI, tendencia y detalle | Evento único `id_urgencia`; eje `Fechaing` |
| Promedio diario | ACEPTADO | API y KPI | Días calendario completos; ceros en denominador; actual parcial visible |
| Pacientes únicos | ACEPTADO | API y KPI | `COUNT(DISTINCT codigo_cliente)`; no aditivo |
| Atenciones por paciente | ACEPTADO | API y contexto KPI | Mismo universo de atenciones y pacientes |
| Frecuentación | ACEPTADO | Contrato documentado; distribución pendiente | Bandas 1, 2, 3, 4-5, 6-10, 11+ |
| Permanencia registrada | ACEPTADO CON OBSERVACIONES | Promedio y detalle básicos | Completados interpretables; extremos conservados |
| Activos probables | ACEPTADO | Indicador operacional separado | Doble nulo; sin filtro de periodo |
| Reingresos <72 h | ACEPTADO | API y KPI | Antecedente válido más reciente, mismo paciente/servicio, corte estricto |
| Reingresos <48 h | ACEPTADO | API y contexto secundario | Corte estricto, sin redondeo para pertenencia |
| Resolución / destino | ACEPTADO | Destino nativo en detalle; módulo pendiente | `destino_urg_pk/destino_urgencias`; NULL y N.E. separados |
| Hospitalización | ACEPTADO | API y KPI | Sólo destino 5; denominador completados |
| Triage: cobertura | ACEPTADO | API y sección por servicio | Con Triage, universo total y porcentaje |
| Triage: clasificación | ACEPTADO | Contrato; visualización pendiente | Catálogo nativo 1–6 |
| Triage: tiempo registrado | ACEPTADO CON OBSERVACIONES | Resumen y señales de consistencia | `fechatri - Fechaing`; extremos visibles |
| Atención médica | EN PROCESO | Estructura preparada | `Fechaing -> fechaate`; KPI definitivo pendiente |
| Alta médica | POR DEFINIR | Estructura preparada | `fechamed`, desacoplado |
| Secuencias temporales | POR DEFINIR | Señales iniciales de Triage | Ingreso, Triage, atención, alta, egreso |
| Población | EN PROCESO | Módulo preparado | Edad al evento y soporte pediátrico por validar |
| Diagnósticos | POR DEFINIR | Módulo preparado | Contrato clínico pendiente |
| Motivo de urgencia | POR DEFINIR | Módulo preparado | Contrato pendiente |
| Localización / cama | DIFERIDO | Sin implementación | Fuera de la primera fase |
| Calidad de datos | EN PROCESO | Multiplicación, conflicto y Triage visibles | Capa adicional; no altera universo ni KPI |

## Regla de mantenimiento

Un cambio funcional debe actualizar esta matriz, [reglas](../REGLAS_NEGOCIO.md), [trazabilidad](TRAZABILIDAD.md), pruebas SQL y contrato API/UI afectado. No se promueve un indicador a ACEPTADO por existir código.
