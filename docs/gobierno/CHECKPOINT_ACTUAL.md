# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-12, America/Mexico_City

## Rama

main

## HEAD base de la iteración

eae44004d7fff3891a8a50fca0478be02e5c481c (`[URG][EVID] Registrar capturas y medición vertical de ITER-010`)

## Iteración actual

Compactación visual/UX de la perspectiva Operación. Ver [ITER-011](../iteraciones/ITER-011.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] Decisión institucional registrada: `URG-GOV-058` (compactación visual/UX de Operación).
- [x] Estructura principal de Operación conservada: KPIs ejecutivos, Demanda + Servicios, Permanencia + Activos probables, Triage + Atención médica, Resolución resumida + Calidad del dato.
- [x] Clasificación nativa de Triage, cobertura de Triage y de Atención médica por servicio, y desglose con porcentaje del destino de los eventos movidos de bloque permanente a ficha bajo demanda, reutilizando el patrón del drawer de episodios (`InfoDrawer.tsx`, nuevo componente esencial de portabilidad).
- [x] "Ingreso futuro" retirado de la rejilla de bandas de Activos probables y presentado como advertencia de calidad condicional independiente (`URG-CAL-01`), nunca como KPI ni semáforo.
- [x] Permanencia (periodo filtrado) y Activos probables (fotografía al corte) diferenciados con insignia visual explícita.
- [x] KPIs superiores renombrados a "Estancia promedio registrada" y "Activos al corte", mismo cálculo y tooltip.
- [x] Servicios: código técnico movido a tooltip nativo (`title`), sin perder acceso.
- [x] Gráfico "Atenciones por día" reducido de 190 px a 138 px sin perder legibilidad.
- [x] `ARQUITECTURA_UI.md` y `config/dashboard-manifest.json` (`uiVersion` 2026-09-12.2) actualizados con el patrón de ficha secundaria bajo demanda.
- [x] Captura real de Operación y medición de longitud vertical antes/después.

## Evidencia preservada

- [ITER-011](../iteraciones/ITER-011.md).
- [Medición de longitud vertical](../evidencia/MEDICION_VERTICAL_ITER011.md) y [captura](../evidencia/capturas/ITER-011/) (1 archivo PNG).
- [ITER-010](../iteraciones/ITER-010.md) y su [medición](../evidencia/MEDICION_VERTICAL_ITER010.md) siguen vigentes para Población y Desempeño (sin cambios en esta iteración).

## Validaciones

- Server: 17 pruebas PASS. Client: 27 pruebas PASS.
- Build server: `tsc -p tsconfig.build.json` PASS. Build client: `tsc --noEmit && vite build` PASS.
- `npm run docs:check-portability`: sin errores.
- `npm run docs:check-links`: 0 enlaces rotos sobre 566 enlaces locales.
- Reconciliación agregado ↔ detalle: sin cambio respecto de ITER-010 (misma implementación, no tocada por esta iteración).
- Longitud vertical de Operación: 2 320 px (ITER-010) → 1 705 px (ITER-011), −26.5 % adicional (−66.3 % vs. baseline de 5 066 px).

## Limitación real de esta iteración

La base de datos (`10.2.1.9:1433`) no fue alcanzable desde el entorno de trabajo. No se ejecutó reconciliación SQL→API contra fuente y no era necesaria: la iteración no modificó ninguna consulta, tipo de dato ni cifra, sólo la presentación de `client/src/App.tsx`. La captura y la medición vertical se produjeron sirviendo el build real contra las cifras ya reconciliadas y versionadas (ITER-004, ITER-005, ITER-009), no contra datos inventados.

## Pendientes gobernados

- Corrida de confirmación, cuando haya acceso a fuente, de que cada recorte de detalle reconcilia con su agregado en datos reales (pendiente desde ITER-010).
- Decisión institucional sobre AMED, Población, Diagnósticos y Motivo de Urgencia.
- Actualización futura de `docs/BACKLOG_FUNCIONAL.md` (pendiente desde ITER-003, fuera de alcance de esta iteración).
- Drill-down de Activos probables no implementado a propósito: su universo es al corte y sin periodo; el KPI no se presenta como clicable.

## NO REPETIR

- La interpretación funcional de `fechaate`, `fechatri`, permanencia, activos, destino y frecuentación ya está cerrada (ITER-004 a ITER-009); ITER-010 los reubicó y ITER-011 sólo reorganizó su presentación dentro de Operación.
- El criterio de portabilidad y el handoff ya están formalizados en `dashboard_hcg_specs` (`HCG-POR-001..008`) y adoptados aquí; no se redefinen por iteración.
- La homologación visual con CEX y la arquitectura de tres perspectivas ya están decididas y versionadas (`URG-GOV-056`); no se reabren.

## Próxima acción exacta

Ninguna acción adicional en ITER-011. La siguiente iteración sustantiva depende de una decisión institucional de KPI para AMED, Población, Diagnósticos o Motivo de Urgencia, o puede avanzar de forma independiente actualizando `BACKLOG_FUNCIONAL.md` si se autoriza. Con acceso a fuente, la acción de bajo riesgo es la corrida de confirmación de los recortes de detalle (pendiente desde ITER-010).

## Commit de cierre

`[URG][UI] Compactar Operación con ficha bajo demanda` (ver `git log`).
