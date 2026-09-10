# Checkpoint actual

## Proyecto
Dashboard Urgencias HCG

## Última actualización
2026-09-10, America/Mexico_City

## Rama
main

## HEAD base de la iteración
3736af8a2ba47352693d39f0fa76802dd37838fa

## HEAD actual
El commit que contiene este checkpoint se resuelve con `git log -1 --format=%H -- docs/gobierno/CHECKPOINT_ACTUAL.md`.

## Iteración actual
Cierre funcional de Alta Médica y jerarquía de hitos temporales.

## Objetivo
Formalizar el anclaje de U-ING en ingreso, fijar el papel actual de Alta Médica y mantener la secuencia completa como análisis complementario, sin implementación.

## Estado de la iteración
COMPLETADA

## Fase actual
Decisión funcional, contratos en validación y documentación consolidados localmente; no se realizó push.

## Completado
- [x] Evidencia AMED 12/24/36 meses ya versionada y reutilizada sin repetir análisis completo.
- [x] Jerarquía formal: Ingreso, Triage y Egreso principales; Atención Médica y Alta Médica complementarios.
- [x] U-ING permanece anclado en `Fechaing`; la ausencia de hitos posteriores no excluye eventos.
- [x] `fechamed` definido como timestamp canónico actual del hito registrado de Alta Médica, sin equivaler a `fechaegr`.
- [x] `altamed_fecha` retenido como auxiliar; no completa ni sustituye `fechamed`.
- [x] URG-AMED-01..04 consolidados en contratos en validación, sin aceptar KPI ni modificar contratos aceptados.
- [x] Secuencia completa retenida como análisis complementario de consistencia y cobertura; faltantes, inversiones y extremos no se corrigen ni excluyen.
- [x] No se implementó API/UI ni SQL productivo.

## Última acción completada
Formalización de la decisión funcional y actualización de evidencia, gobierno, estados, trazabilidad y contratos en validación.

## Próxima acción exacta
No realizar acciones adicionales en esta iteración. Toda continuación parte de la evidencia y contratos versionados; no hacer push sin instrucción explícita.

## Decisiones vigentes
- Cada indicador específico declara su población evaluable y cobertura.
- `fechamed` es canónico sólo para el hito registrado de Alta Médica; no se infieren ni corrigen timestamps faltantes.
- La secuencia completa no es requisito de validez del episodio, de U-ING ni de KPI principal.

## Pendientes
- Aceptación institucional de cualquier indicador de Alta Médica.
- Semántica clínica u operativa que relacione Alta Médica registrada y egreso administrativo.
- Decisión posterior sobre si la secuencia completa merece un KPI independiente.
- API/UI, fuera de esta iteración.

## Bloqueadores
Ninguno para el cierre documental. Las decisiones pendientes son funcionales por diseño.

## NO REPETIR
- Auditoría transversal y descubrimiento de `vUrgencias`.
- Reconciliación de los 14 indicadores implementados.
- Medición AMED de cobertura, diferencias y secuencia en cohortes 12/24/36 meses ya registrada.
- Investigación exhaustiva de inversiones que no cambie el contrato vigente.

## Contexto mínimo para reanudación
Partir de `CONTRATOS_EN_VALIDACION.md` y la evidencia AMED. Alta Médica no es KPI aceptado ni tiene API/UI; la secuencia completa es análisis complementario y U-ING no exige hitos posteriores.

## Commit de cierre
Consolidado localmente en el commit que contiene este checkpoint; sin push.