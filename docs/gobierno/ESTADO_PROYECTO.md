# Estado vigente — Dashboard Urgencias

- Proyecto/rama: `juliuscvg/dashboard_urgencias` / `main`.
- Corte: 2026-09-08, America/Mexico_City.
- Fase: primera implementación técnica de Resumen, Demanda, cobertura de Triage y detalle reconciliable.
- Baseline funcional previo: `b7ecc2c9b3d2ea6e14d7c78b04bb87a3bc44682f`.
- Publicación: no autorizada; esta iteración queda local.

La aplicación implementa SQL read-only, Repository con universo canónico por `id_urgencia`, servicio, API y frontend institucional. Los filtros de centro y servicio provienen de catálogos activos; no hay listas institucionales codificadas. La interfaz no recibe identidad longitudinal ni PII de paciente.

Consulte la [matriz de indicadores](ESTADO_INDICADORES.md), la [arquitectura](../ARQUITECTURA_FUTURA.md), la [evidencia de fase](../evidencia/IMPLEMENTACION_FASE_1.md) y el [backlog](../BACKLOG_FUNCIONAL.md).
