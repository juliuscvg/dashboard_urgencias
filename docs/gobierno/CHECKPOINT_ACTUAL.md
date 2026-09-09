# Checkpoint actual

## Proyecto
Dashboard Urgencias HCG

## Última actualización
2026-09-09, America/Mexico_City

## Rama
main

## HEAD base de la iteración
c89787ba35379b0a02aaabdaea8ca9bc96f771ed

## HEAD actual
Se resolverá con `git rev-parse HEAD` al cerrar; el hash no se incrusta en el commit que se identifica a sí mismo.

## Iteración actual
Consolidación funcional, homologación transversal HCG y portabilidad semántica.

## Objetivo
Adoptar estándares de dashboard_hcg_specs, consolidar contratos y SQL verificable de Urgencias, y dejar continuidad reproducible sin cambiar reglas de CEX.

## Estado de la iteración
COMPLETADA

## Fase actual
Cierre — consolidación portable validada y lista en commit local.

## Completado
- [x] Estado Git y continuidad previa validados.
- [x] Auditoría transversal acotada completada.
- [x] CEX preservado read-only y su deuda registrada.
- [x] Contratos, estados, portabilidad, plantillas y matriz creados en HCG Specs.
- [x] HCG Specs validado y cerrado en `ab245b2`.
- [x] Contratos completos y estados separados adoptados en Urgencias.
- [x] Catorce SQL canónicos de solo lectura creados.
- [x] Diccionario, manifiesto, reconstrucción, trazabilidad y adopción normalizados.
- [x] Alta Médica conservada EN VALIDACIÓN / NO IMPLEMENTADO.
- [x] Evidencia técnica y limitación de conexión DB registradas.

## Última acción completada
Batería final aprobada: enlaces, baseline, portabilidad, JSON, 7/7 tests, build, audit y diff check.

## Próxima acción exacta
Configurar acceso DB autorizado y ejecutar los 14 SQL canónicos para reconciliar SQL/API/UI sin cambiar benchmarks antes de obtener evidencia.

## Archivos creados/modificados relevantes
- `docs/indicadores/CONTRATOS_ACEPTADOS.md`
- `scripts/sql/indicadores/`
- `docs/diccionarios/`
- `docs/RECONSTRUIR_DASHBOARD.md`
- `config/dashboard-manifest.json`
- `docs/gobierno/ADOPCION_HCG.md`
- `docs/evidencia/VALIDACION_PORTABILIDAD_2026-09-09.json`
- `server/src/repository/event-scope.sql.ts`

## Decisiones nuevas
- HCG Specs es la autoridad transversal en `ab245b2`.
- Estado funcional y técnico se registran de forma independiente.
- Anómalo no equivale a incorrecto; no se ocultan ni corrigen anomalías.
- SQL canónico y SQL de descubrimiento cumplen propósitos distintos.
- El checkpoint operativo es único y mutable.

## Pendientes
- Ejecutar SQL canónico y reconciliar SQL/API/UI cuando exista conexión DB.
- Continuar Atención Médica, población y clínica en iteraciones posteriores.
- Mantener Alta Médica EN VALIDACIÓN hasta aprobación documental explícita.

## Bloqueadores
No existe configuración DB. CEX contiene cambios locales ajenos y se mantiene read-only.

## Validaciones ya ejecutadas
- Enlaces Markdown: PASS.
- Baseline/adopción HCG: PASS.
- Portabilidad/SQL estático: PASS.
- JSON: PASS.
- Tests: 7/7 PASS.
- Build servidor/cliente: PASS.
- npm audit: 0 vulnerabilidades.
- HCG Specs: PASS, working tree limpio.

## Validaciones pendientes
Ejecución contra DB y reconciliación SQL/API/UI en una iteración posterior con conexión autorizada.

## NO REPETIR
- Auditoría funcional del checkpoint `c89787b`.
- Descubrimiento inicial de `vUrgencias`.
- Auditoría transversal de estructura ya consolidada.

## Contexto mínimo para reanudación
La consolidación portable está completa y validada. No hay autorización de push. HCG Specs quedó un commit local delante en `ab245b2`; CEX no fue editado. La siguiente iteración comienza por la conexión DB y la reconciliación.

## Commit de cierre
El commit que contiene este checkpoint se obtiene con `git log -1 --format=%H -- docs/gobierno/CHECKPOINT_ACTUAL.md`; no se incrusta su propio hash para evitar autorreferencia.
