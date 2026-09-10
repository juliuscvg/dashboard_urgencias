# Validación de Población — 2026-09-10

**Estado:** evidencia funcional completada. Población permanece sin API/UI y no se infiere desde servicio.

## Universo y variables

Cohortes cerradas por `Fechaing`, evento único `id_urgencia`, servicios canónicos activos. Se validaron `sexo`, `fecha_nac`, `edadaños`, `EdadMeses`, `EdadDias`, `estado_residencia`, `nombre_municipio_residencia` y `nombre_localidad_residencia`.

| Ventana | U-ING | Sexo | Fecha nac. | Edad evento evaluable | Estado | Municipio | Localidad |
|---|---:|---:|---:|---:|---:|---:|---:|
| 12m | 159822 | 100% | 100% | 159821 | 159821 | 159788 | 159450 |
| 24m | 327400 | 100% | 100% | 327399 | 327395 | 327322 | 326504 |
| 36m | 484161 | 100% | 100% | 484159 | 484154 | 484046 | 482856 |

La cobertura se conserva por centro, servicio y periodo en el [JSON](VALIDACION_POBLACION_2026-09-10.json). Centro y servicio son estratos de presentación, no sustitutos de población.

## Edad al evento

La edad canónica propuesta para caracterización es la edad completa calculada con `fecha_nac` respecto de `Fechaing`, sólo si nacimiento e ingreso existen y nacimiento no es posterior al ingreso. `edadaños` queda como campo de contraste: en 36 meses coincidió con el cálculo en 483800 de 484159 casos; 359 difirieron. Dos nacimientos posteriores al ingreso producen edad no evaluable. Dos edades mayores de 130 se conservan como anomalías y no se recortan.

`EdadMeses` y `EdadDias` no se usan como componentes de edad: sus rangos observados (-9 a 1901 y -284 a 57030) y sus valores fuera de 0–11/0–31 impiden interpretar esa composición sin regla institucional.

Los grupos `<1`, `1–5`, `6–12`, `13–17`, `18–29`, `30–44`, `45–59`, `60–74`, `75+` son técnicamente exhaustivos y sin solapamiento sobre la edad calculada. Se aceptan sólo como agrupación descriptiva de caracterización, en validación; no definen población clínica ni KPI.

## Categorías nativas y geografía

Sexo se conserva nativo: FEMENINO, MASCULINO, INDETERMINADO y NO ESPECIFICADO, sin recodificación. Estado, municipio y localidad se muestran como categorías nativas con cobertura explícita; valores como `[Sin Descripción]`, procedencias no locales y faltantes permanecen visibles. No se normalizan ni se infiere residencia.

## Contratos propuestos

- URG-POB-01: edad al evento por `fecha_nac` y `Fechaing`.
- URG-POB-02: grupos etarios descriptivos provisionales.
- URG-POB-03: sexo nativo y cobertura.
- URG-POB-04: residencia nativa y cobertura.

Todos quedan DEFINIDOS FUNCIONALMENTE / EN VALIDACIÓN, sin KPI aceptado ni API/UI. Consultas read-only: `scripts/sql/05_validacion_poblacion.sql` y `scripts/sql/06_validacion_poblacion_cobertura.sql`; runner: `scripts/run-poblacion-validation.mjs`.