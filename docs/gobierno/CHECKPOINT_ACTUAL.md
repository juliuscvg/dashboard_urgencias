# Checkpoint actual

## Proyecto
Dashboard Urgencias HCG

## Última actualización
2026-09-09, America/Mexico_City

## Rama
main

## HEAD base de la iteración
ba1e695b2201837db01deba7c5082312f90cdf3d

## HEAD actual
El commit que contiene este checkpoint se resuelve con `git log -1 --format=%H -- docs/gobierno/CHECKPOINT_ACTUAL.md`.

## Iteración actual
Reconciliación de los 14 SQL canónicos contra fuente, backend, API, UI y detalle.

## Objetivo
Ejecutar o dejar explícitamente bloqueada cada capa y registrar diferencias sin cambiar fórmulas ni contratos funcionales.

## Estado de la iteración
COMPLETADA

## Fase actual
Cierre — reconciliación estática validada; ejecución con fuente bloqueada.

## Completado
- [x] Continuidad y Git validados; iteración anterior COMPLETADA.
- [x] Rama `main`, HEAD `ba1e695`, working tree limpio y sincronizado.
- [x] Configuración DB revisada sin exponer secretos.
- [x] Ausencia de `.env` y de variables `DB_*` confirmada.
- [x] Ejecución DB y `/api/health/db` bloqueadas sin declarar reconciliación.
- [x] HCG Specs y CEX confirmados como referencias read-only.
- [x] Inventario y evidencia individual de los 14 SQL creados.
- [x] Repository/EventScope, Service, API, UI y detalle comparados estáticamente.
- [x] Tres correcciones técnicas acotadas aplicadas sin cambiar fórmulas.
- [x] Estados funcionales/técnicos preservados; 0 reconciliados con fuente.
- [x] Tests, builds, enlaces, JSON, baseline, SQL, audit y diff check aprobados.

## Última acción completada
Batería final aprobada y evidencia de los 14 indicadores cerrada con bloqueo DB explícito.

## Próxima acción exacta
Proveer configuración DB autorizada, validar `/api/health/db` y ejecutar los 14 SQL y cuatro rutas con un único periodo, filtros y cutoff.

## Archivos creados/modificados relevantes
- `docs/gobierno/CHECKPOINT_ACTUAL.md`
- `docs/evidencia/RECONCILIACION_14_SQL_2026-09-09.md`
- `docs/evidencia/RECONCILIACION_14_SQL_2026-09-09.json`
- `scripts/check-reconciliation.mjs`
- `server/src/repository/urgencias.repository.ts`
- `client/src/App.tsx`

## Decisiones nuevas
- La falta de DB bloquea resultados numéricos, tiempos y reconciliación completa, pero no la comparación estática de contratos y código.
- No se promoverá ningún estado técnico a RECONCILIADO CON FUENTE.

## Pendientes
- Ejecución numérica SQL/API/UI/detalle con conexión DB.
- Resolver cutoff API y capas runtime faltantes después de observar resultados reales.

## Bloqueadores
Faltan `DB_SERVER`, `DB_DATABASE`, `DB_USER` y `DB_PASSWORD`; no existe `.env` autorizado.

## Validaciones ya ejecutadas
- Tests backend/frontend: 7/7 PASS.
- Builds backend/frontend: PASS.
- Markdown/enlaces: 39 archivos, 0 rotos.
- Baseline HCG: 72 principios, PASS.
- Portabilidad/SQL: 14 read-only, compatibilidad 100, 0 hardcodes.
- Reconciliación estática: 14 indicadores, 0 errores.
- JSON: 8 archivos válidos.
- npm audit: 0 vulnerabilidades.
- git diff --check: PASS.

## Validaciones pendientes
SQL Server, `/api/health/db`, respuestas API/UI y agregado/detalle con datos.

## NO REPETIR
- Auditoría transversal.
- Descubrimiento de `vUrgencias`.
- Definición de contratos y fórmulas aceptadas.

## Contexto mínimo para reanudación
La iteración documental/técnica está completa. La fuente no pudo ejecutarse por ausencia de DB. Reanudar desde la evidencia JSON, completar sus campos nulos y no repetir la comparación estática.

## Commit de cierre
El commit que contiene este checkpoint se obtiene con `git log -1 --format=%H -- docs/gobierno/CHECKPOINT_ACTUAL.md`; no se incrusta su propio hash.
