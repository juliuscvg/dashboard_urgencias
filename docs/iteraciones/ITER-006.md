# ITER-006 — Cerrar funcionalmente Atención médica

## Estado

COMPLETADA el 2026-09-11.

## Objetivo

Determinar y documentar el contrato funcional final de `fechaate` como hito registrado de Atención médica, cerrando `URG-PEND-01` sin promover un KPI ni implementar capas productivas.

## Autoridad y alcance

- Fuente clínica exclusiva: `dbo.vUrgencias`; servicios y centros permanecen como dimensiones de soporte del U-ING vigente.
- Universo: U-ING, un evento por `id_urgencia`, anclado en `Fechaing`.
- Ventanas cerradas: 12, 24 y 36 meses con fin exclusivo `2026-09-01`.
- La evidencia AMED versionada se reutilizó para Atención→Alta Médica; sólo se ejecutaron consultas complementarias read-only de `fechaate`.
- No se abrieron fuentes, bloques ni indicadores.

## Resultado funcional

- `fechaate datetime NULL` queda como timestamp canónico actual del hito registrado de Atención médica.
- Población evaluable: U-ING con `fechaate` canónico no nulo.
- Cobertura 12/24/36: 94.1141% / 92.7560% / 88.0736%; cero conflictos por evento.
- `Fechaing→fechaate`: 150,415 / 303,683 / 426,418 pares evaluables y cero inversiones.
- La relación Triage→Atención tuvo 36,289 inversiones entre 44,983 pares de 36m; no define orden obligatorio ni tiempo de espera.
- Faltantes, mismo instante, inversiones con otros hitos y extremos de hasta 643,525 minutos permanecen visibles.
- `atencion_fecha` no completa ni sustituye `fechaate`; su equivalencia permanece POR DEFINIR.
- El contrato [URG-ATE-01](../indicadores/CONTRATOS_EN_VALIDACION.md) queda DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN, sin KPI, SQL productivo, API o UI.

## Evidencia

- [Informe funcional](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.md).
- [Artefacto agregado](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.json).
- `scripts/sql/08_validacion_atencion_medica.sql`.
- `scripts/run-atencion-medica-validation.mjs`.
- `scripts/check-atencion-medica-validation.mjs`.

## Validaciones

- [x] Evidencia: 3 ventanas, universos y particiones consistentes.
- [x] SQL de validación: read-only y compatible con el universo vigente.
- [x] Enlaces locales: 0 rotos.
- [x] Portabilidad: 0 errores.
- [x] Server: 9 pruebas PASS.
- [x] Client: 3 pruebas PASS.
- [x] Build server/client: PASS.
- [x] `git diff --check`: PASS.

## Restricciones cumplidas

- [x] Sin cambios en universos, reglas o contratos aceptados.
- [x] Sin SQL productivo, API o UI.
- [x] Sin fuentes clínicas o bloques adicionales.
- [x] Sin inferencia, corrección o exclusión de anomalías.

## Cierre

- [x] Evidencia, contrato, estados, diccionario, decisiones, trazabilidad y checkpoint actualizados.
- [x] Commit y push a `main`.
- [x] Working tree limpio.
