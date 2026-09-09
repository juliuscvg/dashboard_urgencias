# Catálogo analítico reconciliado — Urgencias

IDs documentales, no numeración institucional. Reorganiza 28 candidatos sin convertirlos automáticamente en oficiales. Portada de seis propuesta vigente. Estado funcional y evidencia separados: identidad, servicios, activos y reingresos tienen validación SQL documentada; los restantes conservan su estado. La primera fase implementa el vertical de Resumen/Demanda, cobertura de Triage y detalle.

| ID | Grupo | Elemento | Universo | Definición | Estado funcional | Regla |
|---|---|---|---|---|---|---|
| URG-EJ-01 | Ejecutivo | Atenciones | U-ING | COUNT(DISTINCT id_urgencia), no filas ni fechaate presente | ACEPTADO; IMPLEMENTADO | URG-R01/R02 |
| URG-EJ-02 | Ejecutivo | Promedio diario | U-ING / días | Atenciones / días, incluyendo días sin actividad con datos completos | ACEPTADO; IMPLEMENTADO | URG-R02/R08 |
| URG-EJ-03 | Ejecutivo | Permanencia promedio | Completados evaluables; U-ING heredado propuesto | Suma duraciones / episodios evaluables, extremos válidos incluidos | ACEPTADO CON OBSERVACIONES; IMPLEMENTADO BÁSICO | URG-R04/R05 |
| URG-EJ-04 | Ejecutivo | Hospitalización | Universo resolución por cerrar | Destino agrupado Hospitalización, no motivo alta | ACEPTADO; IMPLEMENTADO | URG-R11 |
| URG-EJ-05 | Ejecutivo | Reingresos <72 h | U-RET | Eventos evaluables con retorno al mismo servicio y antecedente más reciente; tasa sobre evaluables | ACEPTADO; IMPLEMENTADO | URG-R06 |
| URG-EJ-06 | Ejecutivo | Pacientes únicos | Identificables U-POB | COUNT(DISTINCT codigo_cliente) | ACEPTADO; IMPLEMENTADO | URG-R01/R07 |
| URG-ACT-01 | Situación actual | Activos probables | U-ACT | Doble nulo al corte; antigüedad no evaluable visible | PREDICADO SQL VALIDADO | URG-R03 |
| URG-ACT-02 | Situación actual | Activos >24/>48/>72 h | U-ACT evaluable | Acumulativos, énfasis >48/>72, sin recorte | DEFINIDO FUNCIONALMENTE | URG-R03 |
| URG-MOD-01 | Módulo | Demanda | U-ING; U-EGR separado | Volumen/tendencia/hora/día/turno/centro/servicio | DEFINIDO FUNCIONALMENTE | URG-R02/R09/R12 |
| URG-MOD-02 | Módulo | Permanencia | Completados/abiertos separados | Promedio y cinco rangos, transcurrido aparte | DEFINIDO FUNCIONALMENTE | URG-R04/R05 |
| URG-MOD-03 | Módulo | Reingresos | U-RET | <72 principal, <48 secundario, bandas e historia previa | ACEPTADO; IMPLEMENTADO | URG-R06 |
| URG-MOD-04 | Módulo | Triage | U-ING, cobertura por componente | Fecha/nivel/responsable, estandarización futura | DEFINIDO FUNCIONALMENTE | URG-R10 |
| URG-MOD-05 | Módulo | Resolución | U-ING o U-EGR explícito por cerrar | Destino/motivo independientes, agrupación configurable | DEFINIDO FUNCIONALMENTE dimensiones; mapeo CANDIDATO | URG-R11 |
| URG-MOD-06 | Módulo | Población | U-POB | Sexo, nueve grupos, geografía, pacientes separados | DEFINIDO FUNCIONALMENTE grupos; precedencia edad pendiente | URG-R07 |
| URG-MOD-07 | Módulo | Clínica y actividad asociada | Episodios del contexto | Top 5/10/20/Todos; libre detalle; médico no productividad | DEFINIDO FUNCIONALMENTE | URG-R12 |
| URG-MOD-08 | Módulo | Detalle/auditoría | Mismo universo/categoría | Paginación servidor y exportación agregada/episodio | DEFINIDO FUNCIONALMENTE | URG-R13 |
| URG-CAL-01 | Cobertura/calidad | Cobertura/no evaluables | Universo de cada componente | Fechas, triage triple, identidad, población, destino/motivo | DEFINIDO FUNCIONALMENTE | URG-R04/R07/R10/R11 |
| URG-CAL-02 | Cobertura/calidad | Inconsistencias/deuda | Universo correspondiente | Duplicados/inversiones/variantes/abiertos con motivo; flags no aditivos | DEFINIDO FUNCIONALMENTE | URG-R01/R03/R04 |
| URG-PEND-01 | Candidato | Tiempos complementarios | Pares evaluables U-ING | Registro→triage/atención; atención→alta; rangos atención heredados | CANDIDATO secundario | URG-R04/R05 |
| URG-PEND-02 | Candidato | Censo retrospectivo/tasas adicionales | POR DEFINIR | No inferir historia stock ni tasas >12/>24 o retorno<24 oficiales | CANDIDATO | URG-R03/R05/R06 |

## Cierres antes del cálculo

Atenciones cuenta id_urgencia únicos en U-ING sin exigir fechaate; la etiqueta no acredita atención clínica. Promedio diario requiere días completos/parciales, disponibilidad y denominador (nunca sólo días con actividad). Permanencia conserva U-ING completados como cohorte candidata heredada; U-EGR es análisis distinto, elegir explícitamente portada. Hospitalización requiere mapeo y decidir conteo/tasa/denominador. Reingreso tiene algoritmo, bandas, denominador y corte secundario <48 validado; la selección visual de conteo/tasa aún debe respetar ambos sin cambiar la fórmula.

Suficiencia, exclusiones adicionales y metas no definidas. SIN DATOS/NO APLICA/DATOS INSUFICIENTES no fabrican ceros. No mediana/percentiles principales. [Convenciones](01_CONVENCIONES_Y_REGLAS_COMUNES.md) · [Reglas](../REGLAS_NEGOCIO.md) · [Destino de los 28 candidatos](../gobierno/RECONCILIACION_BASELINE_717f681.md).
