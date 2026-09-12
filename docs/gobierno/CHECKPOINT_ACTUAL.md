# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-11, America/Mexico_City

## Rama

main

## HEAD base de la iteración

2fdae1c2b91936030cad448e27f37c66a64a5664

## Iteración actual

Cierre funcional de URG-PEND-01, Atención médica registrada mediante `fechaate`. Ver [ITER-006](../iteraciones/ITER-006.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] `fechaate datetime NULL` validado como timestamp canónico actual del hito registrado de Atención médica.
- [x] Población evaluable y cobertura U-ING definidas para 12/24/36 meses.
- [x] Cronología Ingreso→Atención validada sin inversiones; mismo instante y extremos preservados.
- [x] Relaciones con Triage, Alta Médica y Egreso documentadas como contexto, sin imponer secuencia completa.
- [x] URG-ATE-01 definido funcionalmente y mantenido EN VALIDACIÓN / NO IMPLEMENTADO.
- [x] Sin fuentes, indicadores, SQL productivo, API o UI adicionales.

## Evidencia preservada

- [Validación Atención médica](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.md).
- [Artefacto agregado 12/24/36](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.json).
- [Antecedente AMED](../evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.md).
- `scripts/sql/08_validacion_atencion_medica.sql`, runner y checker asociados.

## Validaciones

- Validador ITER-006: PASS.
- Enlaces y portabilidad: PASS.
- Server: 9 pruebas PASS.
- Client: 3 pruebas PASS.
- Build server/client: PASS.
- Diff: PASS.

## Limitaciones vigentes

- `fechaate` acredita un hito registrado; no inicio clínico real, oportunidad, espera ni presencia física.
- `fechatri→fechaate` no define orden obligatorio por la alta frecuencia de inversiones.
- `atencion_fecha` permanece auxiliar; origen y equivalencia con `fechaate`, POR DEFINIR.
- Atención médica no es KPI aceptado y no autoriza implementación productiva.

## Pendientes gobernados

- Decisión institucional sobre AMED, Población, Diagnósticos y Motivo de Urgencia.
- Definición de consumidor de URG-CAL-01.

## NO REPETIR

- Validación de cobertura y cronología de `fechaate` para ventanas con fin exclusivo 2026-09-01.
- Validación integral AMED y reconciliaciones ITER-004/005 ya preservadas.

## Próxima acción exacta

Ninguna acción adicional en ITER-006. Los pendientes restantes requieren otra iteración con alcance explícito.

## Commit de cierre

Consolidado en el commit `[URG][ATE] Cerrar hito registrado de Atención médica` (ver `git log`).
