# Validación AMED y secuencia temporal — 2026-09-10

**Estado:** evidencia funcional completada; Alta Médica permanece **EN VALIDACIÓN / NO IMPLEMENTADA**. Esta evidencia no acepta un KPI, no implementa API/UI y no convierte campos faltantes en requisito del universo general.

## Contexto y seguridad

- Cohortes cerradas por `Fechaing`: 12, 24 y 36 meses con fin exclusivo 2026-09-01.
- Universo: `id_urgencia` único, servicios con `codigo_area=2 AND serv_activo_sn=1`.
- Los seis campos son `datetime` anulables.
- Consultas read-only: [03_validacion_amed_secuencia.sql](../../scripts/sql/03_validacion_amed_secuencia.sql) y [04_validacion_amed_precision.sql](../../scripts/sql/04_validacion_amed_precision.sql), ejecutadas por [run-amed-validation.mjs](../../scripts/run-amed-validation.mjs).
- No se registraron secretos ni identificadores directos; los ejemplos usan hash truncado del evento.

## Cobertura de campos

| Ventana | Universo | fechamed | altamed_fecha | Ambos | Día distinto entre ambos |
|---|---:|---:|---:|---:|---:|
| 12m | 159822 | 154742 (96.82%) | 41462 (25.94%) | 41432 | 2858 (6.9%) |
| 24m | 327400 | 310725 (94.91%) | 73481 (22.44%) | 73422 | 6186 (8.43%) |
| 36m | 484161 | 442955 (91.49%) | 76914 (15.89%) | 76853 | 6665 (8.67%) |

La cobertura de `fechamed` es consistentemente mayor que la de `altamed_fecha`. En 36 meses, 366,102 eventos tienen sólo `fechamed`; sólo 61 tienen exclusivamente `altamed_fecha`.

### Cobertura por centro, 36 meses

| Centro | Universo | fechamed | altamed_fecha | Ambos con día distinto |
|---|---:|---:|---:|---:|
| FAA | 259118 | 225981 (87.21%) | 13 (0.01%) | 2 |
| HCO | 2 | 1 (50%) | 1 (50%) | 0 |
| JIM | 225041 | 216973 (96.41%) | 76900 (34.17%) | 6663 |

El detalle por servicio permanece en el [JSON de evidencia](VALIDACION_AMED_SECUENCIA_2026-09-10.json); no se usa una lista fija de servicios.

## Semántica determinada por evidencia

`fechamed` y `altamed_fecha` son ambos `datetime`, pero no son intercambiables:

- Los 76,914 valores no nulos de `altamed_fecha` en 36 meses están exactamente a medianoche.
- Sólo 3 de 76,853 eventos con ambos campos coincidieron de forma exacta.
- 6,665 de esos eventos cayeron en días calendario distintos; `altamed_fecha` nunca fue posterior a `fechamed` y llegó a antecederlo por 187,958 minutos.

Por tanto, **`fechamed` es el timestamp canónico propuesto para el hito registrado de Alta Médica**, con advertencias de calidad y sin sustituir `fechaegr`. **`altamed_fecha` es un campo auxiliar de fecha a medianoche**: no completa, normaliza ni sustituye `fechamed`.

Ejemplos pseudonimizados de diferencia de fecha existen en el JSON. El mayor de 36 meses muestra `altamed_fecha` 130 días y 12 h 38 min antes de `fechamed`; basta para descartar una equivalencia derivada simple.

## Pares temporales, 36 meses

| Par | Evaluables | Invertidos | Mismo instante | Mínimo min | Máximo min |
|---|---:|---:|---:|---:|---:|
| Fechaing→fechamed | 442955 | 0 | 539 | 0 | 654051 |
| fechaate→fechamed | 393541 | 126 | 20323 | -8803 | 640800 |
| fechamed→fechaegr | 442952 | 273 | 323437 | -180 | 260612 |

`Fechaing→fechamed` no tuvo inversiones en 442,955 pares evaluables, pero conserva extremos de hasta 654,051 minutos. `fechaate→fechamed` tuvo 126 inversiones y `fechamed→fechaegr`, 273; ambos pares se preservan como calidad observada, no como exclusión.

## Secuencia completa

La secuencia `Fechaing → fechatri → fechaate → fechamed → fechaegr` estuvo completa en 44,489 eventos de 36 meses: 8,607 ordenados y 35,882 con al menos una inversión. El desglose detectó 0 inversiones `Fechaing→fechatri`, 36,289 `fechatri→fechaate`, 126 `fechaate→fechamed` y 273 `fechamed→fechaegr`.

La secuencia completa es una prueba diagnóstica; no se exige para contar atenciones ni para calcular cobertura de Alta Médica. Los ejemplos pseudonimizados de inversión y los extremos se conservan en el JSON.

## Contratos propuestos, no aceptados

| ID | Propuesta | Estado |
|---|---|---|
| URG-AMED-01 | Hito Alta Médica registrada: `fechamed`, con U-ING y timestamp no nulo; no sustituye egreso. | PROPUESTO CON EVIDENCIA |
| URG-AMED-02 | `altamed_fecha` como auxiliar de fecha a medianoche, nunca sustituto de `fechamed`. | PROPUESTO CON EVIDENCIA |
| URG-AMED-03 | Cobertura por campo, centro, servicio y cohorte; faltantes no excluyen U-ING. | PROPUESTO CON EVIDENCIA |
| URG-AMED-04 | Diagnóstico de pares, inversiones, mismos instantes, extremos y secuencia completa. | PROPUESTO CON EVIDENCIA |

No se promueve ningún contrato a ACEPTADO ni se implementa API/UI. La semántica clínica/operativa que conecte Alta Médica registrada con egreso administrativo permanece POR DEFINIR.

## Validación

Los dos SQL son read-only y compatibles con nivel 100. La corrida final procesó las tres ventanas y el complemento de precisión; tardó 25,171 ms, 29,257 ms y 36,725 ms respectivamente, más 818 ms para el complemento de 36 meses. La evidencia no contiene credenciales, cadena de conexión ni identificadores directos.
