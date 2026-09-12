# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-11, America/Mexico_City

## Rama

main

## HEAD base de la iteración

f345c911ba7384f441ba9504239ea4eb167bc20c

## Iteración actual

Definición funcional de URG-CAL-01, Calidad de datos. Ver [ITER-007](../iteraciones/ITER-007.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] Inventario de señales de calidad ya existentes en código (`eventosConConflicto`, `filasMultiplicadas`, `conflicto`, `permanenciaInvertidos`, `permanenciaSinEgreso`, `activosAntiguedadNoEvaluable`, `activosFechaIngresoFutura`, `secuenciasInvertidas`, `tiemposMayorIgual24h`, `tiemposMayorIgual7d`).
- [x] Cada señal asociada a su indicador dueño: EJ-01 (identidad/fan-out), EJ-03 (permanencia), ACT-01 (activos) y TRI-03 (Triage).
- [x] Principio rector fijado: sólo indicadores ACEPTADO/ACEPTADO CON OBSERVACIONES promueven señales a advertencia UI; el resto (AMED, secuencia completa, Atención médica, Población, Diagnósticos, Motivo) permanece como auditoría técnica.
- [x] Gap declarado: `tiemposMayorIgual24h`/`tiemposMayorIgual7d` calculados y expuestos por API, pendientes de UI.
- [x] Contrato URG-CAL-01, estado, trazabilidad y decisión actualizados.
- [x] Sin metas ni semáforos institucionales; sin cambios de universo, fórmula o regla clínica; sin fuentes, código, API o UI nuevos.

## Evidencia preservada

- [Definición funcional URG-CAL-01](../iteraciones/ITER-007.md).
- Contrato [URG-CAL-01](../indicadores/CONTRATOS_ACEPTADOS.md).
- No se generó evidencia SQL nueva: la iteración reutiliza contratos, evidencia y código ya versionados.

## Pendientes gobernados

- Decisión institucional sobre AMED, Atención médica, Población, Diagnósticos y Motivo de Urgencia.
- Implementación futura: exponer en UI `tiemposMayorIgual24h`/`tiemposMayorIgual7d` de TRI-03.
- Recomendación futura (no vinculante): distinguir visualmente en el panel de Activos probables las bandas de anomalía frente a las acumulativas normales.

## NO REPETIR

- Inventario y clasificación de señales de calidad de URG-CAL-01 ya preservados en ITER-007.
- Validaciones y cierres de MOD-05/MOD-09/TRI-02 (ITER-004), bandas EJ-03/ACT-01/TRI-03 (ITER-005) y Atención médica (ITER-006) ya registrados.

## Próxima acción exacta

Ninguna acción adicional en ITER-007. La siguiente iteración sustantiva depende de una decisión institucional de KPI para los bloques EN VALIDACIÓN, o puede avanzar de forma independiente exponiendo en UI el gap declarado de TRI-03.

## Commit de cierre

Consolidado en el commit `[URG][CAL] Definir funcionalmente Calidad de datos` (ver `git log`).
