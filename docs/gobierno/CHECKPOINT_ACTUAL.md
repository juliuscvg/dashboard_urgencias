# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-12, America/Mexico_City

## Rama

main

## HEAD base de la iteración

267e7c447566b6a40b4f7538e220bc78cd2484a8 (`[URG][ATE] Aceptar e implementar Atención médica registrada`)

## Iteración actual

Homologación visual con CEX, perspectivas y portabilidad. Ver [ITER-010](../iteraciones/ITER-010.md).

## Estado de la iteración

COMPLETADA

## Trabajo previo recuperado

La sesión anterior quedó interrumpida con dos archivos sin seguimiento: `client/src/MetricTooltip.tsx` y `client/src/metricTooltipPosition.ts` (componente de tooltip portado de CEX conservando su contrato de comportamiento). Se conservaron íntegros y se integraron a esta iteración; no se reinició ni se descartó nada.

## Completado

- [x] Decisiones institucionales registradas: `URG-GOV-056` (homologación visual y perspectivas) y `URG-GOV-057` (portabilidad y handoff).
- [x] Página vertical única sustituida por tres perspectivas sobre el mismo universo filtrado: Operación, Población e Indicadores de desempeño, persistidas en la URL junto con los filtros.
- [x] Módulos aceptados reubicados sin cambiar fórmulas, universos, denominadores, ventanas, categorías nativas ni contratos, y sin añadir indicadores.
- [x] Perfil demográfico (`URG-PEND-04`) declarado NO IMPLEMENTADO en Población en lugar de aproximarse (`HCG-VIS-004`).
- [x] Cobertura de registro de Triage y Atención médica mantenida en Operación y fuera de desempeño (`HCG-CAL-010`).
- [x] Tooltip obligatorio por métrica agregada en lenguaje para perfil directivo y patrón clicable→drawer sólo donde existe detalle.
- [x] Drawer de detalle único y reutilizable: bajo demanda, sin precargar pacientes, paginado server-side, conserva y muestra filtros, reconcilia contra el agregado mostrando la discrepancia, y exporta la página cargada.
- [x] Recortes de detalle definidos en el servidor compartiendo la MISMA constante SQL que el agregado; `fetchSummaryBase` refactorizado para consumirla. SQL textualmente equivalente: ninguna cifra cambia.
- [x] Lenguaje visual homologado con CEX conservando la paleta institucional de Urgencias; sin trasladar reglas de negocio de CEX.
- [x] Paquete portable cerrado: handoff explícito, arquitectura UI vigente, manifiesto 1.1.0, referencia a specs actualizada `ab245b2`→`dab9a84` y verificador ampliado.
- [x] Capturas reales de las tres perspectivas y medición de longitud vertical antes/después.

## Evidencia preservada

- [ITER-010](../iteraciones/ITER-010.md).
- [Medición de longitud vertical](../evidencia/MEDICION_VERTICAL_ITER010.md) y [capturas](../evidencia/capturas/ITER-010/) (4 archivos PNG).
- [Handoff para otro agente](../HANDOFF_IA.md) y [arquitectura de interfaz vigente](../ARQUITECTURA_UI.md).
- `scripts/capture-perspectives.mjs` (medición y capturas reproducibles).

## Validaciones

- Server: 17 pruebas PASS. Client: 25 pruebas PASS.
- Build server: `tsc -p tsconfig.build.json` PASS. Build client: `tsc --noEmit && vite build` PASS.
- `npm run docs:check-portability`: sin errores; verificado también en negativo (detecta commit de specs obsoleto, componente esencial ausente, perspectiva no implementada y manifiesto sin bloque de portabilidad).
- `npm run docs:check-links`: 0 enlaces rotos sobre 564 enlaces locales.
- Reconciliación agregado ↔ detalle: garantizada por construcción (constante SQL compartida) y verificada por prueba unitaria.
- Longitud vertical: 5 066 px → 2 320 px en la perspectiva más larga (−54.2 %); Población y Desempeño en 849 px (−83.2 %).

## Limitación real de esta iteración

La base de datos (`10.2.1.9:1433`) no fue alcanzable desde el entorno de trabajo. No se ejecutó reconciliación SQL→API contra fuente y no era necesaria: la iteración no modificó ninguna consulta ni cifra. Las capturas se produjeron sirviendo el build real contra las cifras ya reconciliadas y versionadas (ITER-004, ITER-005, ITER-009), no contra datos inventados.

## Pendientes gobernados

- Corrida de confirmación, cuando haya acceso a fuente, de que cada recorte de detalle reconcilia con su agregado en datos reales.
- Decisión institucional sobre AMED, Población, Diagnósticos y Motivo de Urgencia.
- Actualización futura de `docs/BACKLOG_FUNCIONAL.md` (pendiente desde ITER-003, fuera de alcance de esta iteración).
- Recomendación no vinculante (ITER-007): distinguir visualmente en el panel de Activos probables las bandas de anomalía frente a las acumulativas normales.
- Drill-down de Activos probables no implementado a propósito: su universo es al corte y sin periodo; el KPI no se presenta como clicable.

## NO REPETIR

- La interpretación funcional de `fechaate`, `fechatri`, permanencia, activos, destino y frecuentación ya está cerrada (ITER-004 a ITER-009); ITER-010 sólo los reubicó.
- El criterio de portabilidad y el handoff ya están formalizados en `dashboard_hcg_specs` (`HCG-POR-001..008`) y adoptados aquí; no se redefinen por iteración.
- La homologación visual con CEX ya está decidida y versionada (`URG-GOV-056`); no se reabre.

## Próxima acción exacta

Ninguna acción adicional en ITER-010. La siguiente iteración sustantiva depende de una decisión institucional de KPI para AMED, Población, Diagnósticos o Motivo de Urgencia, o puede avanzar de forma independiente actualizando `BACKLOG_FUNCIONAL.md` si se autoriza. Con acceso a fuente, la acción de bajo riesgo es la corrida de confirmación de los recortes de detalle.

## Commit de cierre

`[URG][UI] Homologar con CEX en perspectivas y cerrar portabilidad` y `[URG][EVID] Registrar capturas y medición vertical de ITER-010` (ver `git log`). Contraparte transversal en `dashboard_hcg_specs`: `dab9a84`.
