# Estado vigente — Dashboard Urgencias

- Proyecto/rama: `juliuscvg/dashboard_urgencias` / `main`.
- HEAD base de iteración: `c89787ba35379b0a02aaabdaea8ca9bc96f771ed`.
- Corte documental: 2026-09-09, America/Mexico_City.
- Fase: consolidación portable, adopción HCG y SQL verificable.
- Estado: COMPLETADA; validaciones técnicas/documentales aprobadas y cierre local preparado.
- Publicación: no autorizada.

## Capacidades disponibles

Aplicación read-only con universo central por `id_urgencia`, filtros dinámicos, resumen, demanda, cobertura de Triage y detalle server-side sin PII. La documentación ahora separa contrato funcional, estado técnico, SQL canónico, evidencia y código.

## Referencias vigentes

[Reconstrucción](../RECONSTRUIR_DASHBOARD.md) · [manifiesto](../../config/dashboard-manifest.json) · [contratos](../indicadores/CONTRATOS_ACEPTADOS.md) · [estados](ESTADO_INDICADORES.md) · [checkpoint](CHECKPOINT_ACTUAL.md).

## Pendientes

- Funcionales: Atención Médica EN PROCESO; Alta Médica EN VALIDACIÓN; población y clínica sin cierre.
- Técnicos: API/UI de frecuentación, resolución agregada y clasificación Triage.
- QA: ejecución de SQL canónico y reconciliación de aplicación contra fuente cuando exista configuración DB.
