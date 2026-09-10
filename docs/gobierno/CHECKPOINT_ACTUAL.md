# Checkpoint actual

## Proyecto
Dashboard Urgencias HCG

## Última actualización
2026-09-10, America/Mexico_City

## Rama
main

## HEAD base de la iteración
27a8b694090cfea143c8b7d2897b89568affa152

## HEAD actual
El commit que contiene este checkpoint se resuelve con `git log -1 --format=%H -- docs/gobierno/CHECKPOINT_ACTUAL.md`.

## Iteración actual
Validación funcional de Alta Médica y secuencia temporal a partir de evidencia AMED.

## Objetivo
Determinar, con evidencia, la semántica de `fechamed` y `altamed_fecha`, sus poblaciones evaluables y su cronología, sin implementar indicadores no aceptados.

## Estado de la iteración
EN PROCESO

## Fase actual
Recuperación de evidencia AMED y diseño de validación read-only.

## Completado
- [x] Iteración de reconciliación de los 14 SQL cerrada y publicada en `27a8b69`.
- [x] Continuidad confirmada: `main` limpio y sincronizado.
- [x] Evidencia/documentación local revisada sin redescubrir `vUrgencias`.
- [x] No se localizó un artefacto AMED versionado; existe sólo cobertura temporal agregada y los estados pendientes.
- [x] HCG Specs y CEX se mantienen fuera de alcance.

## Última acción completada
Recuperación de continuidad y localización de evidencia AMED.

## Próxima acción exacta
Ejecutar consultas read-only acotadas para medir cobertura, diferencias y secuencias de `fechamed`/`altamed_fecha` sin exponer identificadores.

## Decisiones nuevas
- No se asumirá equivalencia entre `altamed_fecha` y `fechamed` por nombre, tipo aparente o coincidencia parcial.
- Ningún campo faltante condicionará el universo general de Urgencias.
- Los extremos e inversiones se medirán y conservarán; no se filtrarán para obtener indicadores favorables.

## Pendientes
- Cobertura AMED global, por centro/servicio y ventanas 12/24/36 meses.
- Diferencias entre `fechamed` y `altamed_fecha`, incluidos ejemplos pseudonimizados.
- Pares `Fechaing→fechamed`, `fechaate→fechamed`, `fechamed→fechaegr` y secuencia completa.
- Propuesta de contratos sólo si la evidencia permite cerrarlos.
- Evidencia, decisiones, diccionario, estados, validaciones y commit local.

## Bloqueadores
Ninguno confirmado. Si el acceso DB falla, registrar el bloqueo y detener la validación numérica.

## NO REPETIR
- Auditoría transversal.
- Descubrimiento de `vUrgencias`.
- Inventario/análisis estático de los 14 SQL aceptados.
- Reconciliación ya cerrada de los indicadores implementados.

## Contexto mínimo para reanudación
Los indicadores implementados ya están reconciliados en la evidencia de 2026-09-09. Alta Médica sigue EN VALIDACIÓN y NO IMPLEMENTADA; su evidencia debe distinguir `fechamed` de `altamed_fecha` y no activar API/UI.

## Commit de cierre
Pendiente.
