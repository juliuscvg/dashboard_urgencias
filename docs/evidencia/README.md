# Evidencia — Urgencias

La evidencia reúne revisión documental y una validación SQL real del dominio. API y UI no fueron ejecutadas ni implementadas.

- [Casos patrón diseñados](CASOS_PATRON_VIGENTES.md).
- [Benchmarks e histórico aportado](BENCHMARKS_VIGENTES.md).
- [Manifiesto](MANIFIESTO_VALIDACION.md).
- [Plan de validación](PLAN_VALIDACION.md).
- [Validación SQL funcional 2026-09-08](VALIDACION_SQL_FUNCIONAL_2026-09-08.md).
- [Procedencia fijada a commits](../gobierno/PROCEDENCIA.md).

Toda validación posterior deberá registrar SHA completo, observación con zona, dataset no sensible, filtros, periodo, configuración, universo, esperado independiente, obtenido y reconciliación. Separar frío/caliente, repeticiones, concurrencia y plan si se mide rendimiento. No justificar índices, hints, caché ni timeout con un tiempo aislado. Nunca publicar datos personales ni credenciales.


## Reconciliación vigente

[Casos R2/R3](CASOS_PATRON_VIGENTES.md): diseños sintéticos no automatizados; contratos de identidad, servicios, activos y reingreso cuentan con evidencia SQL. [Resultado documental nuevo](VALIDACION_FUNCIONAL_DOCUMENTAL_2026-09-07.json) separado del [original](VALIDACION_DOCUMENTAL.json), que sólo acredita el árbol del baseline 717f681. Definición funcional y validación SQL se registran como estados separados. [Checkpoint](../historico/checkpoints/CHECKPOINT_FUNCIONAL_2026-09-07.md).
