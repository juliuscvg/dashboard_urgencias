# Estado vigente — Dashboard Urgencias

- Proyecto/rama: `juliuscvg/dashboard_urgencias` / `main`.
- HEAD base de ITER-006: `2fdae1c2b91936030cad448e27f37c66a64a5664`.
- Corte documental: 2026-09-11, America/Mexico_City.
- Fase: validación funcional y reconciliación incremental.
- Estado: ITER-006 completada y preparada para publicación autorizada.

## Capacidades disponibles

Aplicación read-only con universo central por `id_urgencia`, filtros dinámicos, resumen, demanda, Triage, resolución, frecuentación y detalle server-side sin PII. La documentación separa contrato funcional, estado técnico, SQL, evidencia y código.

## Referencias vigentes

[Reconstrucción](../RECONSTRUIR_DASHBOARD.md) · [manifiesto](../../config/dashboard-manifest.json) · [contratos aceptados](../indicadores/CONTRATOS_ACEPTADOS.md) · [contratos en validación](../indicadores/CONTRATOS_EN_VALIDACION.md) · [estados](ESTADO_INDICADORES.md) · [checkpoint](CHECKPOINT_ACTUAL.md).

## Pendientes

- Funcionales: decisión institucional sobre eventual KPI de Atención médica, Alta Médica, Población, Diagnósticos y Motivo de Urgencia; secuencia completa POR DEFINIR como KPI.
- Técnicos: bloques EN VALIDACIÓN permanecen sin SQL productivo, API o UI.
- Gobierno: definir consumidor de URG-CAL-01.
