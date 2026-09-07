# Benchmarks — Urgencias

## Vigentes

Ninguno. No hubo consulta SQL ni medición de rendimiento. No existen esperados actuales.

## Históricos — HISTÓRICO / REQUIERE REVALIDACIÓN

Fuente: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt). Centro comunicado FAA. Periodo/filtros exactos, fecha/hora de observación, dataset, universo, deduplicación, configuración, método, rendimiento y commit de consulta: NO DOCUMENTADO. Totales comunicados como aproximados.

| ID | Servicio FAA | Total aproximado | Con atención | Con egreso |
|---|---|---|---|---|
| URG-HIST-01 | URG ADULTOS | 12,490 | 12,019 | 12,356 |
| URG-HIST-02 | URG PEDIATRIA | 5,320 | 5,292 | 5,307 |
| URG-HIST-03 | URG TOCO | 3,200 | 2,579 | 3,179 |

| ID | Atención URG ADULTOS FAA | Observado comunicado |
|---|---|---|
| URG-HIST-04a | 0–30 min | 3,607 |
| URG-HIST-04b | 31–60 min | 1,766 |
| URG-HIST-04c | 61–120 min | 2,531 |
| URG-HIST-04d | 121–240 min | 2,812 |
| URG-HIST-04e | >240 min | 1,305 |

Suma aritmética 12,021; difiere +2 de 12,019 con atención. No se conoce si comparten universo o momento de extracción.

| ID | Permanencia URG ADULTOS FAA | Observado comunicado |
|---|---|---|
| URG-HIST-05a | 0–2 h | 461 |
| URG-HIST-05b | 2–6 h | 997 |
| URG-HIST-05c | 6–12 h | 1,232 |
| URG-HIST-05d | 12–24 h | 2,510 |
| URG-HIST-05e | >24 h | 7,158 |

Suma aritmética 12,358; difiere +2 de 12,356 con egreso. No ajustar cifras ni fórmulas para forzar coincidencia. La aritmética no constituye validación de la fuente.

Uso permitido: orientar revalidación dirigida; nunca censo actual ni tests actuales. Motivo de no vigencia: falta contexto reproducible y reconciliación. Criterio anterior: NO DOCUMENTADO. Ningún benchmark sustituido todavía. Los futuros registros seguirán la plantilla HCG con observación, filtros, universo/configuración, resultado/reconciliación, método/rendimiento, commit y evidencia.


## Reconciliación 2026-09-07

Se conservan literalmente cifras y discrepancias del baseline 717f681. Los rangos antiguos aquí son HISTÓRICOS, reemplazados en el contrato vigente por URG-R05; no convertir sus cifras a rangos nuevos sin datos de origen. La ventana móvil no vuelve vigentes esos valores. No hubo nueva extracción, benchmark SQL ni medición. [Reglas vigentes](../REGLAS_NEGOCIO.md) · [Decisión URG-GOV-027](../gobierno/DECISIONES_Y_CAMBIOS.md).
