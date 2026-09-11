# Estado vigente de indicadores

Corte: 2026-09-10. Fuente canónica de estados; las fórmulas residen en [contratos](../indicadores/CONTRATOS_ACEPTADOS.md).

| ID | Indicador | Estado funcional | Estado técnico | Alcance técnico |
|---|---|---|---|---|
| URG-EJ-01 | Atenciones | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API, UI y detalle exactos |
| URG-EJ-02 | Promedio diario | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y UI exactos |
| URG-EJ-03 | Permanencia registrada | ACEPTADO CON OBSERVACIONES | RECONCILIADO EN CAPAS DISPONIBLES | SQL, promedio API/UI y bandas de detalle exactos; bandas API pendientes |
| URG-EJ-04 | Hospitalización | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API, UI y destino de detalle exactos |
| URG-EJ-05 | Reingresos <72 h / <48 h | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y UI exactos |
| URG-EJ-06 | Pacientes únicos | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y UI exactos |
| URG-EJ-07 | Atenciones por paciente | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y contexto UI exactos antes de formato |
| URG-ACT-01 | Activos probables | ACEPTADO | RECONCILIADO CON FUENTE CON LIMITACIÓN | Conteo SQL/API/UI exacto; fuente viva sin snapshot y bandas API pendientes |
| URG-MOD-01 | Demanda diaria | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API, tendencia UI y total de detalle exactos |
| URG-MOD-05 | Resolución / destino | ACEPTADO | RECONCILIADO EN CAPAS DISPONIBLES | SQL y distribución de detalle exactos; agregado API/UI pendiente |
| URG-MOD-09 | Frecuentación | ACEPTADO | SQL VALIDADO CON FUENTE | SQL ejecutado; API/UI pendientes |
| URG-TRI-01 | Cobertura de Triage | ACEPTADO | RECONCILIADO CON FUENTE | SQL, servicios API y UI exactos |
| URG-TRI-02 | Clasificación de Triage | ACEPTADO | SQL VALIDADO CON FUENTE | SQL ejecutado; API/UI pendientes |
| URG-TRI-03 | Tiempo registrado a Triage | ACEPTADO CON OBSERVACIONES | RECONCILIADO EN CAPAS DISPONIBLES | Resumen SQL/API/UI exacto; bandas API/UI pendientes |
| URG-PEND-01 | Atención médica | EN PROCESO | NO IMPLEMENTADO | `Fechaing→fechaate`; contrato final pendiente |
| URG-PEND-02 | Alta médica | EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | `fechamed` canónico actual del hito registrado; `altamed_fecha` auxiliar; sin API/UI |
| URG-PEND-03 | Secuencias temporales completas | POR DEFINIR | VALIDADO CON FUENTE / NO IMPLEMENTADO | Análisis complementario de consistencia; no filtro ni KPI principal |
| URG-PEND-04 | Población | EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | Edad, sexo y residencia nativos; sin API/UI |
| URG-PEND-05 | Diagnósticos | EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | Ingreso y egreso codificados, texto de egreso no codificado y cobertura; sin API/UI |
| URG-PEND-06 | Motivo de urgencia | EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | Categoría nativa y texto libre complementario; sin API/UI |
| URG-PEND-07 | Localización / cama | DIFERIDO | NO IMPLEMENTADO | Fuera de fase |
| URG-CAL-01 | Calidad de datos | EN PROCESO | VALIDADO TÉCNICAMENTE | Conflictos, fan-out y Triage visibles |

## Resultado de reconciliación real 2026-09-09

Los 14 SQL se ejecutaron contra fuente. Nueve indicadores reconciliaron todas sus capas implementadas, tres reconciliaron las capas disponibles con proyecciones parciales y dos quedaron como SQL validado con fuente por ausencia de runtime. El contexto, resultados, diferencias cero y límites están en [evidencia de reconciliación](../evidencia/RECONCILIACION_14_SQL_2026-09-09.md).

## Validación AMED 2026-09-10

La evidencia de `fechamed`/`altamed_fecha` cubre cohortes cerradas de 12, 24 y 36 meses, centros y servicios. Confirma cobertura y anomalías temporales, pero no acepta Alta Médica ni secuencia completa como KPI. Ver [evidencia AMED](../evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.md).

## Validación Diagnósticos 2026-09-10

La evidencia de `cdiag_ing`/`diag_ing` y `cdiag_egr`/`diag_egr` cubre cohortes cerradas de 12, 24 y 36 meses. Confirma que ingreso y egreso son dimensiones independientes, que ingreso es prácticamente 1:1 código↔descripción y que egreso no lo es (507 códigos con 2–4 descripciones, verificado contra fuente), además de cuantificar el texto de egreso sin código. No acepta Diagnósticos como KPI ni autoriza API/UI. Ver [evidencia Diagnósticos](../evidencia/VALIDACION_DIAGNOSTICOS_2026-09-10.md).

## Validación Motivo de Urgencia 2026-09-10

La evidencia de `motivo_urgencia` y `motivo_urg_libre` cubre cohortes cerradas de 12, 24 y 36 meses. Define categoría nativa y texto complementario sensible con coberturas independientes; no acepta un KPI ni autoriza API/UI. Ver [evidencia Motivo](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md).
