# Catálogo analítico reconciliado — Urgencias

IDs documentales, no numeración institucional. Reorganiza 28 candidatos sin convertirlos automáticamente en oficiales. Portada de seis propuesta vigente. Estado funcional y evidencia separados: **todos PENDIENTES DE VALIDACIÓN SQL**, ninguno implementado.

| ID | Grupo | Elemento | Universo | Definición | Estado funcional | Regla |
|---|---|---|---|---|---|---|
| URG-EJ-01 | Ejecutivo | Atenciones | U-ING | Conteo propuesto de episodios registrados, no filas ni fechaate presente | CANDIDATO: confirmar etiqueta/unidad | URG-R01/R02 |
| URG-EJ-02 | Ejecutivo | Promedio diario | U-ING / días | Atenciones / días, incluyendo días sin actividad con datos completos | CANDIDATO: días parciales y denominador | URG-R02/R08 |
| URG-EJ-03 | Ejecutivo | Permanencia promedio | Completados evaluables; U-ING heredado propuesto | Suma duraciones / episodios evaluables, extremos válidos incluidos | DEFINIDO FUNCIONALMENTE promedio; cohorte CANDIDATO | URG-R04/R05 |
| URG-EJ-04 | Ejecutivo | Hospitalización | Universo resolución por cerrar | Destino agrupado Hospitalización, no motivo alta | CANDIDATO: conteo/tasa, cohorte y mapeo | URG-R11 |
| URG-EJ-05 | Ejecutivo | Reingresos <72 h | U-RET | Nuevos episodios con vínculo elegible estricto, tasa no cerrada | DEFINIDO FUNCIONALMENTE predicado; presentación CANDIDATO | URG-R06 |
| URG-EJ-06 | Ejecutivo | Pacientes únicos | Identificables U-POB | Conteo distinto codigo_cliente validado | DEFINIDO FUNCIONALMENTE, identidad pendiente SQL | URG-R01/R07 |
| URG-ACT-01 | Situación actual | Activos probables | U-ACT | Doble nulo al corte; antigüedad no evaluable visible | DEFINIDO FUNCIONALMENTE | URG-R03 |
| URG-ACT-02 | Situación actual | Activos >24/>48/>72 h | U-ACT evaluable | Acumulativos, énfasis >48/>72, sin recorte | DEFINIDO FUNCIONALMENTE | URG-R03 |
| URG-MOD-01 | Módulo | Demanda | U-ING; U-EGR separado | Volumen/tendencia/hora/día/turno/centro/servicio | DEFINIDO FUNCIONALMENTE | URG-R02/R09/R12 |
| URG-MOD-02 | Módulo | Permanencia | Completados/abiertos separados | Promedio y cinco rangos, transcurrido aparte | DEFINIDO FUNCIONALMENTE | URG-R04/R05 |
| URG-MOD-03 | Módulo | Reingresos | U-RET | <72 principal, referencia 48 y bandas, historia previa | DEFINIDO FUNCIONALMENTE principal; referencia 48 propuesta | URG-R06 |
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

Atenciones se propone como episodios U-ING sin exigir fechaate; confirmar etiqueta para no presentar registro como atención clínica probada. Promedio diario requiere días completos/parciales, disponibilidad y denominador (nunca sólo días con actividad). Permanencia conserva U-ING completados como cohorte candidata heredada; U-EGR es análisis distinto, elegir explícitamente portada. Hospitalización requiere mapeo y decidir conteo/tasa/denominador. Reingreso tiene <72 cerrado pero antecedente y presentación conteo/tasa pendientes. Referencia 48 inclusiva propuesta se etiqueta hasta 48, no <48.

Suficiencia, exclusiones adicionales y metas no definidas. SIN DATOS/NO APLICA/DATOS INSUFICIENTES no fabrican ceros. No mediana/percentiles principales. [Convenciones](01_CONVENCIONES_Y_REGLAS_COMUNES.md) · [Reglas](../REGLAS_NEGOCIO.md) · [Destino de los 28 candidatos](../gobierno/RECONCILIACION_BASELINE_717f681.md).
