# Estado vigente de indicadores

Corte: 2026-09-11. Fuente canónica de estados; las fórmulas residen en [contratos](../indicadores/CONTRATOS_ACEPTADOS.md).

| ID | Indicador | Estado funcional | Estado técnico | Alcance técnico |
|---|---|---|---|---|
| URG-EJ-01 | Atenciones | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API, UI y detalle exactos |
| URG-EJ-02 | Promedio diario | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y UI exactos |
| URG-EJ-03 | Permanencia registrada | ACEPTADO CON OBSERVACIONES | RECONCILIADO CON FUENTE | SQL, promedio, faltantes, inversiones y bandas API/UI exactos |
| URG-EJ-04 | Hospitalización | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API, UI y destino de detalle exactos |
| URG-EJ-05 | Reingresos <72 h / <48 h | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y UI exactos |
| URG-EJ-06 | Pacientes únicos | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y UI exactos |
| URG-EJ-07 | Atenciones por paciente | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y contexto UI exactos antes de formato |
| URG-ACT-01 | Activos probables | ACEPTADO | RECONCILIADO CON FUENTE CON LIMITACIÓN | Conteo, corte, anomalías y señales acumulativas SQL/API/UI exactos; fuente viva sin snapshot |
| URG-MOD-01 | Demanda diaria | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API, tendencia UI y total de detalle exactos |
| URG-MOD-05 | Resolución / destino | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API, UI y detalle exactos |
| URG-MOD-09 | Frecuentación | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y UI exactos |
| URG-TRI-01 | Cobertura de Triage | ACEPTADO | RECONCILIADO CON FUENTE | SQL, servicios API y UI exactos |
| URG-TRI-02 | Clasificación de Triage | ACEPTADO | RECONCILIADO CON FUENTE | SQL, API y UI exactos; cobertura conjunta |
| URG-TRI-03 | Tiempo registrado a Triage | ACEPTADO CON OBSERVACIONES | RECONCILIADO CON FUENTE | Resumen, anomalías, extremos y bandas SQL/API/UI exactos |
| URG-PEND-01 | Atención médica | DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | `fechaate` canónico actual del hito registrado; URG-ATE-01; sin API/UI |
| URG-PEND-02 | Alta médica | EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | `fechamed` canónico actual del hito registrado; `altamed_fecha` auxiliar; sin API/UI |
| URG-PEND-03 | Secuencias temporales completas | POR DEFINIR | VALIDADO CON FUENTE / NO IMPLEMENTADO | Análisis complementario de consistencia; no filtro ni KPI principal |
| URG-PEND-04 | Población | EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | Edad, sexo y residencia nativos; sin API/UI |
| URG-PEND-05 | Diagnósticos | EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | Ingreso y egreso codificados, texto de egreso no codificado y cobertura; sin API/UI |
| URG-PEND-06 | Motivo de urgencia | EN VALIDACIÓN | VALIDADO CON FUENTE / NO IMPLEMENTADO | Categoría nativa y texto libre complementario; sin API/UI |
| URG-PEND-07 | Localización / cama | DIFERIDO | NO IMPLEMENTADO | Fuera de fase |
| URG-CAL-01 | Calidad de datos | DEFINIDO FUNCIONALMENTE | RECONCILIADO CON FUENTE | Señales asociadas a EJ-01/EJ-03/ACT-01/TRI-03, todas visibles en UI |

## Resultado de reconciliación real 2026-09-09

Los 14 SQL se ejecutaron contra fuente. Nueve indicadores reconciliaron todas sus capas implementadas, tres reconciliaron las capas disponibles con proyecciones parciales y dos quedaron como SQL validado con fuente por ausencia de runtime. El contexto, resultados, diferencias cero y límites están en [evidencia de reconciliación](../evidencia/RECONCILIACION_14_SQL_2026-09-09.md).

## Validación AMED 2026-09-10

La evidencia de `fechamed`/`altamed_fecha` cubre cohortes cerradas de 12, 24 y 36 meses, centros y servicios. Confirma cobertura y anomalías temporales, pero no acepta Alta Médica ni secuencia completa como KPI. Ver [evidencia AMED](../evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.md).

## Validación Diagnósticos 2026-09-10

La evidencia de `cdiag_ing`/`diag_ing` y `cdiag_egr`/`diag_egr` cubre cohortes cerradas de 12, 24 y 36 meses. Confirma que ingreso y egreso son dimensiones independientes, que ingreso es prácticamente 1:1 código↔descripción y que egreso no lo es (507 códigos con 2–4 descripciones, verificado contra fuente), además de cuantificar el texto de egreso sin código. No acepta Diagnósticos como KPI ni autoriza API/UI. Ver [evidencia Diagnósticos](../evidencia/VALIDACION_DIAGNOSTICOS_2026-09-10.md).

## Validación Motivo de Urgencia 2026-09-10

La evidencia de `motivo_urgencia` y `motivo_urg_libre` cubre cohortes cerradas de 12, 24 y 36 meses. Define categoría nativa y texto complementario sensible con coberturas independientes; no acepta un KPI ni autoriza API/UI. Ver [evidencia Motivo](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md).

## Reconciliación ITER-004 — 2026-09-10

MOD-05, MOD-09 y TRI-02 cerraron su brecha API/UI sin cambios funcionales. Las tres salidas coincidieron exactamente con sus SQL aceptados y la representación UI se validó con las filas API preservadas. Ver [evidencia ITER-004](../evidencia/RECONCILIACION_ITER004_2026-09-10.md).

## Reconciliación ITER-005 — 2026-09-10

EJ-03, ACT-01 y TRI-03 cerraron su brecha de bandas API/UI sin cambios funcionales. Las tres proyecciones coincidieron exactamente con sus SQL aceptados; la UI distingue bandas exclusivas de señales acumulativas y se validó con las proyecciones API preservadas. Ver [evidencia ITER-005](../evidencia/RECONCILIACION_ITER005_2026-09-10.md).

## Validación Atención médica 2026-09-11

La validación de `fechaate` cubre cohortes U-ING cerradas de 12, 24 y 36 meses. Confirma cobertura, cero inversiones respecto de Ingreso y heterogeneidad frente a Triage y por servicio. Cierra URG-PEND-01 como interpretación funcional mediante URG-ATE-01, sin aceptar KPI ni autorizar SQL productivo/API/UI. Ver [evidencia Atención médica](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.md).

## Definición funcional de Calidad de datos (URG-CAL-01) — 2026-09-11

Cada señal de calidad existente (conflicto de identidad, multiplicación física, inversión de permanencia, evento sin egreso, antigüedad no evaluable, ingreso futuro y anomalías de Triage) queda asociada a su indicador dueño (EJ-01, EJ-03, ACT-01, TRI-03) según [contrato URG-CAL-01](../indicadores/CONTRATOS_ACEPTADOS.md). Sólo son advertencia visible en UI las señales de indicadores `ACEPTADO`/`ACEPTADO CON OBSERVACIONES`; las de bloques EN VALIDACIÓN/POR DEFINIR/EN PROCESO/DIFERIDO permanecen como auditoría técnica en evidencia/SQL. Ver [ITER-007](../iteraciones/ITER-007.md).

## Cierre del gap UI de Triage (URG-TRI-03) — 2026-09-11

`tiemposMayorIgual24h`/`tiemposMayorIgual7d` quedan visibles como advertencia de calidad condicional (`notice quality`) en el panel de Triage, con el mismo tratamiento visual que la señal de EJ-01, sin campo, fórmula, umbral ni SQL nuevos. `URG-CAL-01` queda `RECONCILIADO CON FUENTE`: sus cuatro indicadores dueño (EJ-01, EJ-03, ACT-01, TRI-03) tienen ya todas sus señales visibles en UI. Ver [ITER-008](../iteraciones/ITER-008.md).
