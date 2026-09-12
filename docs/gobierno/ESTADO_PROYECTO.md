# Estado vigente — Dashboard Urgencias

- Proyecto/rama: `juliuscvg/dashboard_urgencias` / `main`.
- HEAD base de ITER-008: `bf44792609153615ed61bae9b096de85063fe58e`.
- Corte documental: 2026-09-11, America/Mexico_City.
- Fase: validación funcional y reconciliación incremental.
- Estado: ITER-008 completada; URG-CAL-01 con todas sus señales visibles en UI.

## Capacidades disponibles

Aplicación read-only con universo central por `id_urgencia`, filtros dinámicos, resumen, demanda, Triage, resolución, frecuentación y detalle server-side sin PII. La documentación separa contrato funcional, estado técnico, SQL, evidencia y código.

## Referencias vigentes

[Reconstrucción](../RECONSTRUIR_DASHBOARD.md) · [manifiesto](../../config/dashboard-manifest.json) · [contratos aceptados](../indicadores/CONTRATOS_ACEPTADOS.md) · [contratos en validación](../indicadores/CONTRATOS_EN_VALIDACION.md) · [estados](ESTADO_INDICADORES.md) · [checkpoint](CHECKPOINT_ACTUAL.md).

## Pendientes

- Funcionales: decisión institucional sobre eventual KPI de Atención médica, Alta Médica, Población, Diagnósticos y Motivo de Urgencia; secuencia completa POR DEFINIR como KPI.
- Técnicos: bloques EN VALIDACIÓN permanecen sin SQL productivo, API o UI.
- Gobierno: `URG-CAL-01` cerrada sin pendiente UI (ver [ITER-008](../iteraciones/ITER-008.md)).
