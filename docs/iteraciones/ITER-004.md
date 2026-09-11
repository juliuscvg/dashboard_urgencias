# ITER-004 — Cerrar brecha API/UI de indicadores aceptados

## Estado

COMPLETADA el 2026-09-10.

## Objetivo

Implementar exclusivamente las capas API/UI pendientes de `URG-MOD-05`, `URG-MOD-09` y `URG-TRI-02`, usando sus contratos y SQL aceptados como autoridad.

## Implementación

- `URG-MOD-05`: `fetchResolution` → `getResolution` → `/api/urgencias/resolution` → panel Destino de los eventos.
- `URG-MOD-09`: `fetchFrequentation` → `getFrequentation` → `/api/urgencias/frequentation` → panel Eventos por paciente.
- `URG-TRI-02`: tercera salida de `fetchTriage` → `getTriage` → `/api/urgencias/triage` → Clasificación nativa.
- Tipos compartidos por capa, carga y error integrados al flujo de filtros existente.

## Contratos preservados

- U-ING, periodo semiabierto, centro y servicio permanecen idénticos.
- MOD-05 conserva clave/descripción nativas, NULL y N.E. 99 separados; no fusiona motivo de alta.
- MOD-09 conserva las bandas 1, 2, 3, 4–5, 6–10 y 11+; excluye pacientes no identificables de la clasificación.
- TRI-02 conserva código/descripción nativos y porcentaje sobre clasificados; cobertura permanece sobre U-ING.
- Los tres SQL canónicos permanecen sin cambios. No se abrieron fuentes ni indicadores adicionales.

## Reconciliación

La [evidencia](../evidencia/RECONCILIACION_ITER004_2026-09-10.md) y su [JSON](../evidencia/RECONCILIACION_ITER004_2026-09-10.json) acreditan tres comparaciones SQL→API exactas en una cohorte cerrada. El test de UI usa las filas API preservadas para verificar la representación de los tres módulos.

## Validaciones

- [x] Server tests: 8 PASS.
- [x] Client tests: 3 PASS, incluida representación con evidencia API.
- [x] Build server y client: PASS.
- [x] SQL→API: 3/3 comparaciones exactas.
- [x] UI: renderizado React/jsdom con datos reconciliados PASS.
- [x] Enlaces, portabilidad, reconciliación estática y diff: PASS.
- [x] Sin cambios en `scripts/sql/indicadores/`.

## Limitación de entorno

El auxiliar de navegador terminó con `helper_unknown_error` y los ejecutables headless no devolvieron DOM. No bloquea la reconciliación: HTTP se validó contra fuente y la UI se comprobó mediante renderizado automatizado con las filas API reales preservadas.

## Cierre

- [x] Documentación, estado y checkpoint actualizados.
- [x] Commit y push a `main`.
- [x] Working tree limpio.
