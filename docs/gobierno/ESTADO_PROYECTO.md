# Estado vigente — Dashboard Urgencias

- Proyecto/rama: `juliuscvg/dashboard_urgencias` / `main`.
- HEAD base de ITER-007: `f345c911ba7384f441ba9504239ea4eb167bc20c`.
- Corte documental: 2026-09-11, America/Mexico_City.
- Fase: validación funcional y reconciliación incremental.
- Estado: ITER-007 completada; URG-CAL-01 definida funcionalmente.

## Capacidades disponibles

Aplicación read-only con universo central por `id_urgencia`, filtros dinámicos, resumen, demanda, Triage, resolución, frecuentación y detalle server-side sin PII. La documentación separa contrato funcional, estado técnico, SQL, evidencia y código.

## Referencias vigentes

[Reconstrucción](../RECONSTRUIR_DASHBOARD.md) · [manifiesto](../../config/dashboard-manifest.json) · [contratos aceptados](../indicadores/CONTRATOS_ACEPTADOS.md) · [contratos en validación](../indicadores/CONTRATOS_EN_VALIDACION.md) · [estados](ESTADO_INDICADORES.md) · [checkpoint](CHECKPOINT_ACTUAL.md).

## Pendientes

- Funcionales: decisión institucional sobre eventual KPI de Atención médica, Alta Médica, Población, Diagnósticos y Motivo de Urgencia; secuencia completa POR DEFINIR como KPI.
- Técnicos: bloques EN VALIDACIÓN permanecen sin SQL productivo, API o UI.
- Gobierno: URG-CAL-01 ya definida funcionalmente (ver [ITER-007](../iteraciones/ITER-007.md)); pendiente de implementación futura exponer en UI `tiemposMayorIgual24h`/`tiemposMayorIgual7d` de TRI-03.
