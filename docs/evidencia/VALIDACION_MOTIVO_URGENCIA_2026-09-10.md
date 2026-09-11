# Validación de Motivo de Urgencia — 2026-09-10

**Estado:** evidencia funcional completada. Motivo de Urgencia permanece sin KPI aceptado, SQL productivo, API o UI.

## Universo y método

La validación usa U-ING: un evento por `id_urgencia`, `Fechaing >= desde AND Fechaing < hastaExclusivo` y servicios canónicos activos. Las ventanas cerradas terminan el 2026-09-01. La vista se deduplicó antes de contar y se comprobaron variantes por evento.

`motivo_urgencia` y `motivo_urg_libre` son `varchar(60)`, nullable. Los valores vacíos o sólo con espacios se contabilizan como ausentes para cobertura, sin corregir la fuente. El artefacto JSON conserva agregados y categorías nativas; no contiene texto libre, identificadores directos ni secretos.

## Cobertura 12/24/36 meses

| Ventana | U-ING | Con categoría | Con texto libre | Ambos | Sólo categoría | Sólo texto | Ninguno | Cobertura texto |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 12m | 159,822 | 159,822 | 21,754 | 21,754 | 138,068 | 0 | 0 | 13.61% |
| 24m | 327,400 | 327,400 | 40,268 | 40,268 | 287,132 | 0 | 0 | 12.30% |
| 36m | 484,161 | 484,161 | 65,181 | 65,181 | 418,980 | 0 | 0 | 13.46% |

La categoría tuvo cobertura de 100% y cero conflictos entre filas físicas del mismo evento en las tres ventanas. El texto libre tuvo cero conflictos; se observaron 164, 391 y 752 eventos con valor físico vacío en 12/24/36 meses, conservados como ausencia. No hubo eventos con texto libre sin categoría.

## Categorías nativas

En las tres ventanas aparecieron 15 categorías. En 36 meses:

| Categoría nativa | Eventos |
|---|---:|
| ENF. COMUN | 457,033 |
| ATENCION OBSTETRICA | 22,595 |
| ATENCION GINECOLOGICA | 2,405 |
| OTROS | 581 |
| ACCIDENTE EN EL HOGAR | 547 |
| ACCIDENTE VIA PUBLICA | 217 |
| TRABAJO DE PARTO | 155 |
| INTOXICACION | 130 |
| HECHOS DE VIOLENCIA | 125 |
| ACCIDENTE DE TRAFICO | 98 |
| PICADURA ALACRAN | 84 |
| ACCIDENTE ESCUELA | 66 |
| ACC.SITIO RECREACION | 46 |
| ACCIDENTE DE TRABAJO | 42 |
| AGRESION CANINA | 37 |

Se conservan exactamente como categorías nativas. La distribución no acredita gravedad, diagnóstico, calidad, causalidad ni una agrupación clínica institucional.

## Texto libre y relación con la categoría

En 36 meses hubo 21,443 valores distintos entre 65,181 eventos con texto. De esos valores, 18,009 fueron singletons; la longitud observada fue de 1 a 60 caracteres y la frecuencia máxima de un mismo valor fue 3,587. La alta cardinalidad y la presencia de valores únicos sustentan su tratamiento como información textual complementaria. El máximo coincide con la longitud física, por lo que no se presume que el campo conserve narrativas mayores de 60 caracteres.

La cobertura no es homogénea. En 36 meses fue 1.81% en el centro 1 y 23.59% en el centro 2. Entre servicios con volumen material varió desde 0.74% hasta 61.41%. Por año fue 16.25% en el tramo observado de 2023, 13.79% en 2024, 11.18% en 2025 y 15.01% en el tramo observado de 2026. Esta variación demuestra diferencias de captura y exige reportar cobertura; no permite sustituir `motivo_urgencia` por `motivo_urg_libre`.

El texto apareció principalmente con `ENF. COMUN` por volumen, pero la proporción dentro de una categoría varió: 14.04% para `ENF. COMUN`, 1.88% para `ATENCION OBSTETRICA` y 35.46% para `OTROS` en 36 meses. No se infieren categorías a partir del texto ni se versionan ejemplos por su carácter sensible.

## Interpretación funcional

- `motivo_urgencia`: dimensión categórica nativa del motivo registrado al evento. Es apta para distribución descriptiva con cobertura explícita.
- `motivo_urg_libre`: texto complementario sensible. Puede conservarse para búsqueda o detalle autorizado, pero no es catálogo, sustituto de la categoría ni dimensión para ranking ejecutivo.
- La ausencia de cualquiera de los campos no excluye U-ING. La cobertura se declara por campo, periodo, centro y servicio.
- Siguen pendientes la procedencia física anterior a la vista, la autoridad institucional del catálogo y cualquier política de acceso al texto libre en una futura implementación.

## Reproducibilidad

- SQL read-only: `scripts/sql/07_validacion_motivo_urgencia.sql`.
- Runner: `scripts/run-motivo-validation.mjs`.
- Resultado agregado: [JSON](VALIDACION_MOTIVO_URGENCIA_2026-09-10.json).
- Control: `scripts/check-motivo-validation.mjs`.

La única fuente de contenido funcional fue dbo.vUrgencias; dbo.servicios se usó sólo para aplicar el universo U-ING vigente. La ejecución no modificó datos y no generó API/UI.
