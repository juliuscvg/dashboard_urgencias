# Dashboard Urgencias

Aplicación institucional del Hospital Civil de Guadalajara para analizar Urgencias con una granularidad canónica de un evento por `id_urgencia`. La fuente principal es `dbo.vUrgencias`; centros y servicios se obtienen de catálogos activos del área 2.

La primera fase entrega Resumen, Demanda, cobertura de Triage y detalle paginado. Implementa una API Express/MSSQL y una interfaz React/Vite. Las consultas son read-only, parametrizadas y compatibles con SQL Server 2012 en nivel 100. No hay ETL, escrituras ni listas codificadas de centros o servicios.

## Inicio local

1. Copie `.env.example` a `.env` y complete las variables `DB_*` con una cuenta de sólo lectura.
2. Ejecute `npm install`.
3. Use `npm run dev` para API y frontend, o `npm run build` seguido de los comandos de cada workspace.

La interfaz queda en `http://localhost:5173` y la API en `http://localhost:3001`. Las credenciales no se versionan.

## Verificación

- `npm test`
- `npm run build`
- `npm run docs:check-links`
- `node scripts/check-baseline.mjs`

La reconstrucción semántica comienza en [RECONSTRUIR_DASHBOARD.md](docs/RECONSTRUIR_DASHBOARD.md) y su índice machine-readable es [dashboard-manifest.json](config/dashboard-manifest.json).

Consulte el [índice documental](docs/00_LEEME_PRIMERO.md), el [estado](docs/gobierno/ESTADO_PROYECTO.md), la [matriz de indicadores](docs/gobierno/ESTADO_INDICADORES.md), la [arquitectura](docs/ARQUITECTURA_FUTURA.md) y la [evidencia de implementación](docs/evidencia/IMPLEMENTACION_FASE_1.md).

Dashboard CEX es únicamente una referencia transversal de arquitectura, UX y gobierno. Las reglas funcionales de Urgencias están definidas en este repositorio.
