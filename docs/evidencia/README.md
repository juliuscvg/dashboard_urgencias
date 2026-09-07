# Evidencia — Urgencias

La evidencia inicial acredita requisitos y revisión documental, no resultados clínicos. No hay SQL, API o UI ejecutados.

- [Casos patrón diseñados](CASOS_PATRON_VIGENTES.md).
- [Benchmarks e histórico aportado](BENCHMARKS_VIGENTES.md).
- [Manifiesto](MANIFIESTO_VALIDACION.md).
- [Plan de validación](PLAN_VALIDACION.md).
- [Procedencia fijada a commits](../gobierno/PROCEDENCIA.md).

Toda validación posterior deberá registrar SHA completo, observación con zona, dataset no sensible, filtros, periodo, configuración, universo, esperado independiente, obtenido y reconciliación. Separar frío/caliente, repeticiones, concurrencia y plan si se mide rendimiento. No justificar índices, hints, caché ni timeout con un tiempo aislado. Nunca publicar datos personales ni credenciales.


## Reconciliación vigente

[Casos R2](CASOS_PATRON_VIGENTES.md):16 diseños, ninguno ejecutado. [Resultado documental nuevo](VALIDACION_FUNCIONAL_DOCUMENTAL_2026-09-07.json) separado del [original](VALIDACION_DOCUMENTAL.json), que sólo acredita el árbol del baseline 717f681. Definido funcionalmente no es validado por SQL. [Checkpoint](../historico/checkpoints/CHECKPOINT_FUNCIONAL_2026-09-07.md).
