# Estado vigente — Dashboard Urgencias

- Proyecto/rama: `juliuscvg/dashboard_urgencias` / `main`.
- HEAD base de ITER-009: `2e6b8148c6fe637a1af973a452879bfac5a539ea`.
- Corte documental: 2026-09-11, America/Mexico_City.
- Fase: validación funcional y reconciliación incremental.
- Estado: ITER-010 completada; homologación visual con CEX, perspectivas Operación/Población/Desempeño y paquete portable verificable. Sin cambios funcionales respecto de ITER-009.

## Capacidades disponibles

Aplicación read-only con universo central por `id_urgencia`, filtros dinámicos, resumen, demanda, Triage, Atención médica, resolución, frecuentación y detalle server-side sin PII. La interfaz se organiza en tres perspectivas sobre el mismo universo filtrado, con tooltip obligatorio por métrica agregada, drill-down bajo demanda desde la métrica clicable y reconciliación visible agregado ↔ detalle; ver [arquitectura de interfaz](../ARQUITECTURA_UI.md). La documentación separa contrato funcional, estado técnico, SQL, evidencia y código, y el paquete portable se verifica con `npm run docs:check-portability` a partir del [handoff](../HANDOFF_IA.md).

## Referencias vigentes

[Handoff para otro agente](../HANDOFF_IA.md) · [reconstrucción](../RECONSTRUIR_DASHBOARD.md) · [arquitectura de interfaz](../ARQUITECTURA_UI.md) · [manifiesto](../../config/dashboard-manifest.json) · [contratos aceptados](../indicadores/CONTRATOS_ACEPTADOS.md) · [contratos en validación](../indicadores/CONTRATOS_EN_VALIDACION.md) · [estados](ESTADO_INDICADORES.md) · [checkpoint](CHECKPOINT_ACTUAL.md).

## Pendientes

- Funcionales: decisión institucional sobre eventual KPI de Alta Médica, Población, Diagnósticos y Motivo de Urgencia; secuencia completa POR DEFINIR como KPI.
- Técnicos: bloques EN VALIDACIÓN permanecen sin SQL productivo, API o UI.
- Gobierno: `URG-CAL-01` cerrada sin pendiente UI, incluida la señal de Atención médica (ver [ITER-009](../iteraciones/ITER-009.md)).
