# Validación funcional de Atención médica — 2026-09-11

**Estado:** evidencia completada; `fechaate` queda **DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN**, sin promoción a KPI y sin implementación productiva.

## Contexto y método

- Fuente clínica exclusiva: `dbo.vUrgencias`; los joins a `dbo.servicios` y `dbo.centros` son las dimensiones de soporte ya exigidas por U-ING.
- Cohortes U-ING cerradas por `Fechaing`: 12, 24 y 36 meses con fin exclusivo `2026-09-01`.
- Unidad: un evento por `id_urgencia`; conflictos de `fechaate` entre filas físicas se nulifican y cuantifican.
- Metadato confirmado: `fechaate datetime NULL`.
- Consultas agregadas read-only: [08_validacion_atencion_medica.sql](../../scripts/sql/08_validacion_atencion_medica.sql).
- Runner y control: `scripts/run-atencion-medica-validation.mjs` y `scripts/check-atencion-medica-validation.mjs`.
- No se consultaron otras fuentes clínicas, no se expusieron identificadores y no se recalculó la evidencia AMED ya cerrada.

## Cobertura 12/24/36 meses

| Ventana | U-ING | Con fechaate | Sin fechaate | Cobertura | Conflictos |
|---|---:|---:|---:|---:|---:|
| 12m | 159,822 | 150,415 | 9,407 | 94.1141% | 0 |
| 24m | 327,400 | 303,683 | 23,717 | 92.7560% | 0 |
| 36m | 484,161 | 426,418 | 57,743 | 88.0736% | 0 |

La cobertura aumenta en los periodos recientes: 76.1029% en la porción observada de 2023, 83.0489% en 2024, 93.2471% en 2025 y 93.7937% en 2026 hasta el corte. La ausencia de `fechaate` permanece dentro de U-ING.

Por centro, la cobertura fue 93.5354%–94.6174% en 12m. En 36m, FAA registró 93.2351% y JIM 82.1304%; HCO tuvo sólo dos eventos y no permite una comparación estable. Por servicio, la variación fue amplia y persistente: desde 43.7144% en URG GINE FAA hasta 97.6323% en URG PEDIATRIA FAA dentro de servicios con volumen material en 36m. Estas diferencias describen cobertura de registro y no desempeño clínico.

## Secuencia temporal

### Ingreso → Atención médica

| Ventana | Evaluables | Interpretables | Invertidos | Mismo instante | Promedio interpretable | Mínimo | Máximo |
|---|---:|---:|---:|---:|---:|---:|---:|
| 12m | 150,415 | 150,415 | 0 | 1,221 | 109.72 min | 0 min | 18,582 min |
| 24m | 303,683 | 303,683 | 0 | 3,322 | 176.12 min | 0 min | 265,573 min |
| 36m | 426,418 | 426,418 | 0 | 5,064 | 335.04 min | 0 min | 643,525 min |

Todos los pares disponibles fueron no negativos. Los extremos alcanzan aproximadamente 447 días y permanecen sin recorte; por ello el promedio es descriptivo del tiempo registrado y no acredita oportunidad, espera clínica ni presencia física continua.

### Relaciones con otros hitos

| Par | Ventana | Evaluables | Interpretables | Invertidos | Mismo instante |
|---|---|---:|---:|---:|---:|
| Triage → Atención | 12m | 18,290 | 3,244 | 15,046 | 86 |
| Triage → Atención | 24m | 38,256 | 7,589 | 30,667 | 156 |
| Triage → Atención | 36m | 44,983 | 8,694 | 36,289 | 169 |
| Atención → Egreso | 12m | 150,412 | 150,385 | 27 | 491 |
| Atención → Egreso | 24m | 303,680 | 303,577 | 103 | 6,386 |
| Atención → Egreso | 36m | 426,414 | 426,259 | 155 | 16,866 |
| Atención → Alta Médica | 12m | 146,088 | — | 25 | 2,461 |
| Atención → Alta Médica | 24m | 289,650 | — | 84 | 9,686 |
| Atención → Alta Médica | 36m | 393,541 | — | 126 | 20,323 |

Los valores de Atención → Alta Médica se reutilizan de la [evidencia AMED](VALIDACION_AMED_SECUENCIA_2026-09-10.md); no se repitió esa consulta. La predominancia de inversiones Triage → Atención impide imponer ese orden como regla de validez o interpretar el intervalo como espera. Las pocas inversiones respecto de Alta Médica y Egreso se preservan como señales de consistencia, sin excluir eventos ni atribuir causalidad.

## Cierre funcional

`fechaate` es el timestamp canónico actual del **hito registrado de Atención médica** dentro de `dbo.vUrgencias`.

- Población evaluable: eventos U-ING con `fechaate` canónico no nulo.
- Cobertura: población evaluable / U-ING del mismo periodo, centro y servicio.
- Cronología primaria: `Fechaing→fechaate`; sólo pares no negativos son interpretables para una duración.
- La ausencia, un conflicto o una inversión en cualquier par no invalida U-ING.
- `fechaate` es complementario: no requiere Triage, Alta Médica o Egreso y no sustituye esos hitos.
- No se infieren valores desde `atencion_fecha`; su equivalencia y origen base permanecen POR DEFINIR.
- El registro no demuestra por sí solo inicio clínico real, oportunidad asistencial ni presencia física.

Este cierre resuelve URG-PEND-01 como interpretación funcional, pero no acepta un KPI ni autoriza SQL productivo, API o UI. El contrato resultante es `URG-ATE-01`.
