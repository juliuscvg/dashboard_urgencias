# Evidencia — Urgencias

La evidencia no se deduce del build ni de una respuesta HTTP. Toda corrida debe registrar commit, fecha/hora, periodo, filtros, cutoff, configuración no sensible, universo, resultado, método y reconciliación.

- [Benchmarks vigentes e históricos](BENCHMARKS_VIGENTES.md)
- [Validación SQL funcional 2026-09-08](VALIDACION_SQL_FUNCIONAL_2026-09-08.md)
- [Implementación fase 1](IMPLEMENTACION_FASE_1.md)
- [Casos patrón](CASOS_PATRON_VIGENTES.md)
- [Manifiesto de validación](MANIFIESTO_VALIDACION.md)
- [Plan de validación](PLAN_VALIDACION.md)
- [SQL verificable por indicador](../../scripts/sql/indicadores/README.md)
- [Validación de portabilidad 2026-09-09](VALIDACION_PORTABILIDAD_2026-09-09.json)

Los SQL de descubrimiento `01_validacion_estructura` y `02_validacion_funcional` no sustituyen las consultas canónicas por indicador. Sin conexión DB, se declara la capa no ejecutada y los benchmarks no se alteran.
