# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-10, America/Mexico_City

## Rama

main

## HEAD base de la iteración

079c28677687dc0ad1cf7a9bc3985650e350ff15

## Iteración actual

Validación funcional de Motivo de Urgencia. Ver [ITER-002](../iteraciones/ITER-002.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] Validación read-only de `motivo_urgencia` y `motivo_urg_libre` sobre U-ING en ventanas 12/24/36 meses.
- [x] Cobertura, cardinalidad, categorías nativas, relación entre campos y patrones por periodo, centro y servicio.
- [x] `motivo_urgencia` definido como dimensión categórica nativa; cobertura de 100% y 15 categorías en las tres ventanas.
- [x] `motivo_urg_libre` definido como información textual complementaria sensible; cobertura propia y sin inferencia de categorías.
- [x] Contratos URG-MOT-01..03, evidencia, estados, diccionario, decisión y trazabilidad actualizados.
- [x] Sin valores de texto libre ni identificadores directos en evidencia versionada.
- [x] Sin fuentes clínicas adicionales; dbo.servicios se usó sólo para aplicar el universo U-ING vigente. Sin API/UI, SQL productivo ni cambios en otros dashboards.

## Evidencia preservada

- [Validación de Motivo de Urgencia](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md).
- [Resultado agregado](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.json).
- `scripts/sql/07_validacion_motivo_urgencia.sql` y `scripts/run-motivo-validation.mjs`.

## Pendientes gobernados

- Aceptación institucional de KPI o visualizaciones para Motivo de Urgencia.
- Autoridad institucional y procedencia física anterior a la vista para el catálogo de `motivo_urgencia`.
- Política de acceso y exposición autorizada de `motivo_urg_libre` antes de cualquier implementación.
- Reconciliación progresiva del diccionario completo de `vUrgencias` conforme se validen otros bloques.

## NO REPETIR

- Validación 12/24/36 de Motivo: cobertura, categorías, cardinalidad del texto, relación entre campos y patrones ya preservados.
- Análisis previos de Diagnósticos, Población, AMED y reconciliación de indicadores implementados.

## Próxima acción exacta

Ninguna acción adicional en ITER-002. Cualquier KPI, visualización o acceso a texto libre requiere una iteración y autorización funcional posteriores.

## Commit de cierre

Consolidado en el commit `[URG][MOT] Validar Motivo de Urgencia` (ver `git log`).
