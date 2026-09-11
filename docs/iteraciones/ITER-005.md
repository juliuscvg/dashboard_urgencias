# ITER-005 — Cerrar bandas API/UI pendientes

## Estado

COMPLETADA el 2026-09-10.

## Objetivo

Implementar exclusivamente las bandas pendientes de `URG-EJ-03`, `URG-ACT-01` y `URG-TRI-03`, usando contratos y SQL aceptados como autoridad.

## Implementación

- `URG-EJ-03`: `fetchSummaryBase` y `/api/urgencias/summary` exponen faltantes, inversiones y las cinco bandas exclusivas; la UI las presenta sobre la población evaluable.
- `URG-ACT-01`: `fetchCurrent` acepta un `corte` ISO opcional, usa `@Corte` y expone no evaluables, futuros y señales acumulativas `>24`, `>48`, `>72 h`; la UI declara que no son bandas exclusivas.
- `URG-TRI-03`: `fetchTriage` y `/api/urgencias/triage` exponen las siete bandas exclusivas, junto con cobertura, inversiones y extremos ya vigentes.
- El flujo ordinario conserva el corte actual del servidor; el parámetro `corte` permite reconciliación reproducible.

## Contratos preservados

- U-ING, filtros, deduplicación por evento, poblaciones evaluables y fórmulas permanecen sin cambios.
- EJ-03 conserva límites `<12`, `[12,24)`, `[24,48)`, `[48,72]` y `>72 h`.
- ACT-01 conserva su universo sin periodo y comparaciones estrictas a `@Corte`; faltantes y futuros permanecen visibles.
- TRI-03 conserva límites mismo minuto, `(0,10]`, `(10,30]`, `(30,60]`, `(60,120]`, `(120,240]` y `>240 min`.
- Los tres SQL canónicos permanecen sin cambios. No se abrieron fuentes ni se añadieron indicadores.

## Reconciliación

La [evidencia](../evidencia/RECONCILIACION_ITER005_2026-09-10.md) y su [JSON](../evidencia/RECONCILIACION_ITER005_2026-09-10.json) acreditan tres comparaciones SQL→API exactas. Las pruebas de UI usan las proyecciones API preservadas para verificar las tres estructuras.

## Validaciones

- [x] Server tests: 9 PASS.
- [x] Client tests: 3 PASS.
- [x] Build server y client: PASS.
- [x] SQL→API: 3/3 comparaciones exactas.
- [x] Invariantes: bandas EJ-03 y TRI-03 cubren sus evaluables; ACT-01 conserva orden acumulativo.
- [x] UI: renderizado React/jsdom con datos reconciliados PASS.
- [x] SQL canónico sin cambios y sin fuentes adicionales.

## Limitaciones preservadas

- ACT-01 describe activos probables en una fuente viva; no confirma presencia física y no cuenta con snapshot.
- Permanencia es tiempo registrado y Triage es tiempo registrado a Triage; no se amplía su interpretación clínica.

## Cierre

- [x] Evidencia, estados, trazabilidad, decisión y checkpoint actualizados.
- [x] Implementación y pruebas completas.
- [x] Commit y push a `main`.
- [x] Working tree limpio.
