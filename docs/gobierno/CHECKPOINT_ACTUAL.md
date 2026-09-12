# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-11, America/Mexico_City

## Rama

main

## HEAD base de la iteración

2e6b8148c6fe637a1af973a452879bfac5a539ea

## Iteración actual

Aceptación e implementación de Atención médica registrada (URG-ATE-01). Ver [ITER-009](../iteraciones/ITER-009.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] Decisión institucional registrada (`URG-GOV-055`): `URG-ATE-01` pasa de EN VALIDACIÓN a ACEPTADO CON OBSERVACIONES.
- [x] Módulo implementado SQL→API→UI: cobertura de `fechaate` sobre U-ING, tiempo registrado `Fechaing→fechaate`, promedio, bandas (mismo minuto, 0–30, 31–60, 61–120, 121–240, >240 min), faltantes y anomalías/extremos (invertidos, ≥24h, ≥7d) integrados a `URG-CAL-01`.
- [x] `fechaate` incorporado al `EventScope` canónico compartido de forma aditiva; sin alterar `conflicto_nucleo` ni ningún otro indicador.
- [x] Filtros (periodo, centro, servicio) y drill-down (cobertura por servicio) reutilizan la arquitectura existente.
- [x] No se usó `atencion_fecha` para completar `fechaate`; no se denomina el intervalo "tiempo de espera" ni "oportunidad"; no se afirma inicio clínico real; sin metas ni semáforos institucionales.
- [x] Reconciliación SQL→API exacta; cruce con ventana cerrada de 12 meses reproduce las cifras ya validadas en ITER-006.
- [x] Aplicación real levantada localmente (backend + Vite dev server) y capturada: dashboard completo y las 7 secciones principales, incluido el nuevo panel, sin errores de consola.
- [x] Contrato, estados, decisiones, trazabilidad, catálogo, diccionario y checkpoint actualizados.

## Evidencia preservada

- [ITER-009](../iteraciones/ITER-009.md).
- [Reconciliación e informe funcional](../evidencia/RECONCILIACION_ITER009_2026-09-11.md) y [artefacto JSON](../evidencia/RECONCILIACION_ITER009_2026-09-11.json).
- Capturas de revisión visual en [docs/evidencia/capturas/ITER-009/](../evidencia/capturas/ITER-009/) (8 archivos PNG).
- `scripts/sql/indicadores/URG-ATE-01_ATENCION_MEDICA.sql`, `scripts/run-iter009-reconciliation.mjs`, `scripts/check-iter009-reconciliation.mjs`.

## Validaciones

- Reconciliación SQL→API exacta (resumen y cobertura por servicio) PASS.
- `scripts/check-iter009-reconciliation.mjs`: sin errores.
- Server: 10 pruebas PASS. Client: 5 pruebas PASS.
- Build server: `tsc -p tsconfig.build.json` PASS. Build client: `tsc --noEmit && vite build` PASS.
- Revisión visual: sin errores de consola durante la captura.

## Pendientes gobernados

- Decisión institucional sobre AMED, Población, Diagnósticos y Motivo de Urgencia.
- Actualización futura de `docs/BACKLOG_FUNCIONAL.md` (pendiente desde ITER-003, fuera de alcance de esta iteración).
- Recomendación no vinculante (ITER-007): distinguir visualmente en el panel de Activos probables las bandas de anomalía frente a las acumulativas normales.

## NO REPETIR

- Interpretación funcional de `fechaate` (cobertura, cronología, relaciones con otros hitos) ya cerrada en ITER-006; no repetida aquí.
- Implementación y reconciliación SQL→API→UI de Atención médica ya preservadas en ITER-009.
- Definición e inventario de señales de `URG-CAL-01` (ITER-007) y cierre del gap de Triage (ITER-008) ya registrados.

## Próxima acción exacta

Ninguna acción adicional en ITER-009. La siguiente iteración sustantiva depende de una decisión institucional de KPI para AMED, Población, Diagnósticos o Motivo de Urgencia, o puede avanzar de forma independiente actualizando `BACKLOG_FUNCIONAL.md` si se autoriza.

## Commit de cierre

Consolidado en el commit `[URG][ATE] Aceptar e implementar Atención médica registrada` (ver `git log`).
