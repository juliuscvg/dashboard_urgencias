# Descubrimientos y limitaciones — reconciliación 2026-09-07

Evidencia funcional: [contexto nuevo](historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). [Registro original íntegro en 717f681](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/DESCUBRIMIENTOS_Y_LIMITACIONES.md). No se consultó SQL.

| ID histórico | Tratamiento vigente |
|---|---|
| URG-H01 | MODIFICAR: deuda histórica conservada; >5 años deja de recortar el bloque ejecutivo, ahora >24/>48/>72 |
| URG-H02 | PENDIENTE DE VALIDACIÓN SQL: granularidad, cardinalidad, representación; nombre epis_pk corregido funcionalmente |
| URG-H03 | AMPLIAR: campos edad conocidos y grupos cerrados; identidad, cálculo edad/localización aún pendientes |
| URG-H04 | REEMPLAZAR: 72 exclusivo cerrado; bandas incluyen24/48; algoritmo antecedente sigue pendiente |
| URG-H05 | REEMPLAZAR permanencia por cinco rangos nuevos con fronteras explícitas; atención sigue secundaria candidata |
| URG-H06 | CONSERVAR histórico: permanencia 12,358 vs 12,356, diferencia +2 sin reconciliación de datos |
| URG-H07 | CONSERVAR adaptación documental HCG sin promoción multidominio |
| URG-H08 | CONSERVAR histórico: atención 12,021 vs 12,019, diferencia +2 sin reconciliación de datos |

## Vacíos que requieren SQL, no preguntas humanas repetidas

- Objeto/casing efectivo dbo.vUrgencias y Fechaing, tipos/longitudes/nulabilidad/precisión/zona, definición de derivados.
- Nulos/duplicados/variantes, epis_pk↔id_urgencia, ámbito por centro, estabilidad codigo_cliente, equivalencias de registro/foliounico.
- Claves/mapeo de servicio en vista, catálogo dbo.servicios, objeto/relación de centros, cardinalidad y vigencia de catálogos. No inventar dbo.centros.
- Catálogo dbo.motivos_alta_ing, clave de unión y motivo_alta_desc; descripción aún futura en vista. Destinos y su cobertura/mapeo.
- Semántica de fecha_nac/edadaños/EdadMeses/EdadDias; referencia temporal y discordancias; nombres físicos de geografía, médico, localización y filtros restantes.
- Tres componentes triage, catálogos heterogéneos y cobertura por servicio/periodo.
- Secuencias, historia disponible y mutabilidad; múltiples egresos, empates, solapamientos/episodios intermedios para reingreso.
- Las fuentes adicionales quedan limitadas a carencias identificadas; no exploración indiscriminada ni modificación de vista/datos.

## PREGUNTAS PARA DEFINICIÓN FUNCIONAL

1. ¿La etiqueta Atenciones representará episodios registrados U-ING, independientemente de fechaate? El contexto no obliga a tener atención capturada.
2. ¿Cómo se computan días parciales y disponibilidad de datos en Promedio diario? Días con cero actividad no deben eliminarse del denominador arbitrariamente.
3. ¿Permanencia promedio de portada usa cohorte de ingresos completados (candidato heredado) o egresos del periodo?
4. ¿Hospitalización se muestra como conteo, tasa o ambos, y con qué cohorte/denominador? Validar mapeo de códigos cuando exista catálogo.
5. ¿Se adopta hasta 48 inclusivo para referencia secundaria (suma de bandas) o se requiere <48 separado? El principal <72 y 72 exclusivo ya están cerrados.
6. ¿Qué evento/precedencia debe representar edad cuando el cálculo expuesto difiera, y cómo representar edad/residencia de pacientes con múltiples episodios?
7. ¿La madrugada nocturna se atribuye a fecha calendario o jornada iniciada el día anterior? ¿Cómo concretar comparación de meses desiguales/cortes parciales?
8. ¿Qué filtros avanzados son compatibles con situación actual, qué roles acceden/exportan identificables y quién aprueba las definiciones? Responsables nominales NO DOCUMENTADO.

Estas preguntas precisan subcontratos, no reabren grupos etarios, turnos horarios, predicado activo, <72 ni promedio principal ya entregados. Anclaje móvil, últimos N días y redondeo más cercano son propuestas documentales identificadas, no hechos SQL. Efecto de servicios actualmente inactivos sobre histórico requiere primero evidencia de catálogo y luego decisión si procede.

## Límites

No definir umbrales de suficiencia, metas, exclusiones o reglas de antecedente sin evidencia. No inventar respuestas ni convertir hallazgos en correcciones de datos. Censo retrospectivo, tasas adicionales y rangos secundarios siguen candidatos. [Plan](evidencia/PLAN_VALIDACION.md).
