# Auditoría transversal acotada — 2026-09-08

Alcance read-only inicial: `dashboard_hcg_specs@3c6ed9c`, `dashboard_cex@0ea6678` y `dashboard_urgencias@c89787b`. El análisis se limita a necesidades de Urgencias.

| Hallazgo | Clasificación | Acción |
|---|---|---|
| HCG Specs ya define unidad/universo, fuentes, temporalidad, calidad, UX, filtros, detalle, evidencia y trazabilidad | ESTÁNDAR TRANSVERSAL EXISTENTE | Adoptar por referencia; no duplicar convenciones |
| Falta contrato completo y portable por indicador | MEJORA TRANSVERSAL PROPUESTA | Añadir contrato y plantilla en HCG Specs |
| Falta separar estados funcionales, técnicos y de adopción | MEJORA TRANSVERSAL PROPUESTA | Formalizar vocabularios independientes |
| Falta checkpoint único, índice de reconstrucción y manifiesto ligero | MEJORA TRANSVERSAL PROPUESTA | Añadir convenciones y plantillas |
| `id_urgencia`, servicio área 2, Triage, destino 5 y reingreso son propios de Urgencias | DIVERGENCIA LEGÍTIMA DE DOMINIO | Mantener sólo en Urgencias |
| Urgencias tiene catálogo/estado previos a la implementación y no tiene SQL canónico individual | DEUDA DE ADOPCIÓN URGENCIAS | Normalizar documentos y crear SQL verificable |
| CEX usa checkpoints múltiples y aún no adopta contrato/manifiesto/matriz nuevos | DEUDA DE ADOPCIÓN CEX | Registrar para su conversación; no modificar funcionalmente CEX |
| El working tree de CEX contiene cambios ajenos sin confirmar | RESTRICCIÓN OPERATIVA | Mantener CEX completamente read-only |

## Límites

No se compararon fórmulas de CEX para trasladarlas. No se editaron archivos ni reglas de negocio de CEX. Los cambios en HCG Specs sólo pueden contener estructura y criterios reutilizables.
