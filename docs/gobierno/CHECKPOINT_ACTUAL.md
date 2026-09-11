# Checkpoint actual

## Proyecto
Dashboard Urgencias HCG

## Última actualización
2026-09-10, America/Mexico_City

## Rama
main

## HEAD base de la iteración
1090e459777da4044ce3ddeb0175efaa579bf920

## Iteración actual
Validación funcional de Diagnósticos de Urgencias. Ver [ITER-001](../iteraciones/ITER-001.md).

## Estado de la iteración
COMPLETADA

## Completado
- [x] Diagnóstico de ingreso y de egreso tratados como dimensiones independientes; código y descripción nativos conservados.
- [x] Cobertura y cruce ingreso/egreso 12/24/36 meses (ambos códigos, mismo, diferente, sólo ingreso, sólo egreso, ninguno).
- [x] Cardinalidad código↔descripción por ventana: ingreso prácticamente 1:1; egreso con 507 códigos con 2–4 descripciones (verificado contra fuente).
- [x] Disponibilidad de código/descripción de egreso (COD_DESC/COD_SIN_DESC/DESC_SIN_COD/NINGUNO) y texto de egreso no codificado (6257 eventos, 2842 valores en 36m) preservados.
- [x] Contratos URG-DIAG-01..04, evidencia, estados, diccionario y decisiones actualizados.
- [x] No API/UI, no SQL productivo, no cambios CEX.

## Avance preservado
- `.tmp/diag.json`: cobertura, ingreso/egreso y cardinalidad 12/24/36m.
- `.tmp/diag-detail.json`: detalle de códigos de egreso con múltiples descripciones.
- `.tmp/diag-egr-disponibilidad.json`: disponibilidad código/descripción de egreso 12/24/36m.
- `.tmp/diag-egr-texto-valores.json`: valores de texto de egreso sin código.
- Evidencia consolidada en [VALIDACION_DIAGNOSTICOS_2026-09-10](../evidencia/VALIDACION_DIAGNOSTICOS_2026-09-10.md).

## Decisiones de inicio
- Diagnósticos conserva código y descripción nativos; ingreso y egreso son dimensiones independientes.
- No se infieren familias clínicas, severidad, calidad ni concordancia.

## Pendientes
- Aceptación institucional de KPI o visualizaciones de Diagnósticos y de Población.
- Semántica institucional de EdadMeses y EdadDias.
- Normalización geográfica sólo con decisión institucional.

## NO REPETIR
- Reconciliación Git/checkpoint, metadatos y corridas Población 12/24/36 ya registradas.
- Cobertura, cruce ingreso/egreso, cardinalidad y disponibilidad de Diagnósticos 12/24/36 ya registradas.
- AMED, reconciliación de indicadores implementados y auditoría transversal.

## Próxima acción exacta
Ninguna acción adicional en esta iteración; partir de la evidencia de Diagnósticos versionada para cualquier ampliación futura (patrones por centro-servicio, si se autoriza).

## Commit de cierre
Consolidado en el commit `[URG][DIAG] Cerrar validación funcional de Diagnósticos` (ver `git log`).