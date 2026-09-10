# Checkpoint actual

## Proyecto
Dashboard Urgencias HCG

## Última actualización
2026-09-09, America/Mexico_City

## Rama
main

## HEAD base de la iteración
98aac20eed57002fe3a377c3f6239788bd7beff4

## HEAD actual
El commit que contiene este checkpoint se resuelve con `git log -1 --format=%H -- docs/gobierno/CHECKPOINT_ACTUAL.md`.

## Iteración actual
Reconciliación real de los 14 SQL canónicos contra SQL Server, runtime, API, UI y detalle.

## Objetivo
Completar evidencia numérica reproducible sin exponer secretos ni cambiar contratos funcionales.

## Estado de la iteración
COMPLETADA

## Fase actual
Cierre — fuente, capas disponibles, evidencia y validaciones completadas.

## Completado
- [x] Continuidad validada desde `98aac20`; rama `main` y árbol inicial limpio/sincronizado.
- [x] `.env` existente, ignorado, no tracked y nunca impreso ni documentado.
- [x] Backend de Urgencias aislado en 3002; health, health/db y rutas propias HTTP 200.
- [x] Contexto común: 2026-08-01, fin exclusivo 2026-08-02, todos los centros/servicios y corte `2026-09-09T21:03:28Z`.
- [x] Catorce SQL ejecutados contra fuente; dos incompatibilidades técnicas corregidas y reejecutadas.
- [x] Doce comparaciones runtime exactas; nueve reconciliaciones completas y tres en capas disponibles.
- [x] Frecuentación y Clasificación Triage validadas con fuente en SQL; runtime pendiente.
- [x] UI real validada con Chrome headless/CDP contra el backend aislado.
- [x] Detalle completo: 354/354 filas, 354 IDs únicos, 0 duplicados, cuatro páginas y orden determinista.
- [x] HCG Specs y CEX permanecieron fuera de alcance.

## Última acción completada
Tests, builds, enlaces, portabilidad SQL, baseline HCG, reconciliación, audit y seguridad de `.env` aprobados.

## Próxima acción exacta
Revisar el commit local de cierre. No hacer push hasta instrucción explícita.

## Archivos creados/modificados relevantes
- `.gitignore`
- `client/vite.config.ts`
- `docs/evidencia/RECONCILIACION_14_SQL_2026-09-09.json`
- `docs/evidencia/RECONCILIACION_14_SQL_2026-09-09.md`
- `docs/gobierno/CHECKPOINT_ACTUAL.md`
- `docs/gobierno/ESTADO_INDICADORES.md`
- `scripts/check-reconciliation.mjs`
- `scripts/run-source-reconciliation.mjs`
- `scripts/sql/indicadores/URG-MOD-05_RESOLUCION.sql`
- `scripts/sql/indicadores/URG-TRI-02_CLASIFICACION.sql`

## Decisiones nuevas
- El proceso preexistente de 3001 se descartó como evidencia y no se modificó; la validación usó puertos aislados.
- MOD-05 y TRI-02 calculan el mismo denominador mediante una CTE compatible con nivel 100.
- `API_PROXY_TARGET` habilita validación local aislada y conserva 3001 como predeterminado.
- `@Corte` no equivale a snapshot de la vista viva; la variación de Activos queda documentada y no se oculta.
- No se implementaron capas nuevas sólo para elevar estados; se registró la deuda por indicador.

## Pendientes
- Agregados runtime/API/UI para Resolución, Frecuentación y Clasificación Triage.
- Proyección de bandas completas de Permanencia, Activos y Tiempo Triage.
- Contrato explícito para Sin datos, No aplica y Datos insuficientes.
- Mecanismo de snapshot si se requiere reproducibilidad histórica de Activos.

## Bloqueadores
Ninguno para cerrar esta iteración. La deuda runtime está clasificada y no invalida la evidencia obtenida.

## Validaciones ejecutadas
- Fuente: 14/14 SQL PASS.
- API: summary, demand, triage y episodes HTTP 200.
- Reconciliación: 12/12 comparaciones exactas; diferencia absoluta/relativa 0.
- Detalle: 354/354, 354 IDs únicos, 0 duplicados, orden y distribuciones exactos.
- UI: valores implementados coinciden con API; sin error ni carga pendiente.
- Tests backend/frontend: 7/7 PASS.
- Builds backend/frontend: PASS.
- Markdown/enlaces: 39 archivos, 0 rotos.
- Baseline HCG: 72 principios, PASS.
- Portabilidad/SQL: 14 read-only, compatibilidad 100, 0 hardcodes.
- JSON versionado: PASS.
- `npm audit`: 0 vulnerabilidades.
- `git diff --check`: PASS.

## NO REPETIR
- Auditoría transversal.
- Descubrimiento de `vUrgencias`.
- Inventario/análisis estático de los 14 SQL.
- Ejecución de esta reconciliación salvo que cambien fuente, periodo, contrato o código.

## Contexto mínimo para reanudación
La evidencia real está en `docs/evidencia/RECONCILIACION_14_SQL_2026-09-09.*`. Los 14 SQL están validados; continuar sólo con la deuda runtime explícita o con una nueva corrida fechada y contextualizada. `.env` permanece local.

## Commit de cierre
El commit que contiene este checkpoint se obtiene con `git log -1 --format=%H -- docs/gobierno/CHECKPOINT_ACTUAL.md`; no se incrusta su propio hash.
