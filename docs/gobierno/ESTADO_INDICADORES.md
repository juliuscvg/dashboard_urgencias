# Estado vigente de indicadores

Corte: 2026-09-08. Fuente canónica de estados; las fórmulas residen en [contratos](../indicadores/CONTRATOS_ACEPTADOS.md).

| ID | Indicador | Estado funcional | Estado técnico | Alcance técnico |
|---|---|---|---|---|
| URG-EJ-01 | Atenciones | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL, API, UI y prueba estructural |
| URG-EJ-02 | Promedio diario | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL, API y UI |
| URG-EJ-03 | Permanencia registrada | ACEPTADO CON OBSERVACIONES | VALIDADO TÉCNICAMENTE | SQL, promedio/API y detalle |
| URG-EJ-04 | Hospitalización | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL, API y UI |
| URG-EJ-05 | Reingresos <72 h / <48 h | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL, API y UI |
| URG-EJ-06 | Pacientes únicos | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL, API y UI |
| URG-EJ-07 | Atenciones por paciente | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL, API y contexto UI |
| URG-ACT-01 | Activos probables | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL y contexto API/UI separado |
| URG-MOD-01 | Demanda diaria | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL, API, tendencia y servicios |
| URG-MOD-05 | Resolución / destino | ACEPTADO | IMPLEMENTADO NO VALIDADO | SQL y detalle; agregado pendiente |
| URG-MOD-09 | Frecuentación | ACEPTADO | IMPLEMENTADO NO VALIDADO | SQL; API/UI pendientes |
| URG-TRI-01 | Cobertura de Triage | ACEPTADO | VALIDADO TÉCNICAMENTE | SQL, API y UI |
| URG-TRI-02 | Clasificación de Triage | ACEPTADO | IMPLEMENTADO NO VALIDADO | SQL; API/UI pendientes |
| URG-TRI-03 | Tiempo registrado a Triage | ACEPTADO CON OBSERVACIONES | VALIDADO TÉCNICAMENTE | SQL y resumen API/UI |
| URG-PEND-01 | Atención médica | EN PROCESO | NO IMPLEMENTADO | `Fechaing→fechaate`; contrato final pendiente |
| URG-PEND-02 | Alta médica | EN VALIDACIÓN | NO IMPLEMENTADO | `fechamed`; no implementar |
| URG-PEND-03 | Secuencias temporales completas | POR DEFINIR | NO IMPLEMENTADO | Señales parciales de Triage |
| URG-PEND-04 | Población | EN PROCESO | NO IMPLEMENTADO | Edad al evento por validar |
| URG-PEND-05 | Diagnósticos | POR DEFINIR | NO IMPLEMENTADO | Sin contrato suficiente |
| URG-PEND-06 | Motivo de urgencia | POR DEFINIR | NO IMPLEMENTADO | Sin contrato suficiente |
| URG-PEND-07 | Localización / cama | DIFERIDO | NO IMPLEMENTADO | Fuera de fase |
| URG-CAL-01 | Calidad de datos | EN PROCESO | VALIDADO TÉCNICAMENTE | Conflictos, fan-out y Triage visibles |

Ningún indicador de aplicación está `RECONCILIADO CON FUENTE` en esta iteración porque falta configuración DB local. Un cambio de estado exige evidencia y decisión versionadas.
