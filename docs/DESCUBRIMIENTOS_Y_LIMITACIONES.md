# Descubrimientos y limitaciones — consolidado 2026-09-09

Evidencia funcional: [contexto de reconciliación](historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). [Registro original íntegro en 717f681](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/DESCUBRIMIENTOS_Y_LIMITACIONES.md). Se consolidaron consultas SQL canónicas de solo lectura, pero no se ejecutaron contra la fuente porque no existe configuración DB disponible.

| ID histórico | Tratamiento vigente |
|---|---|
| URG-H01 | MODIFICAR: deuda histórica conservada; >5 años deja de recortar el bloque ejecutivo, ahora >24/>48/>72 |
| URG-H02 | VALIDADO CON ADVERTENCIA: id_urgencia es evento canónico; epis_pk es vínculo XHIS; una multiplicación por vsegpop exige contar identidad |
| URG-H03 | AMPLIAR: campos edad conocidos y grupos cerrados; identidad, cálculo edad/localización aún pendientes |
| URG-H04 | VALIDADO: 72 exclusivo, bandas incluyen 24/48 y antecedente válido más reciente |
| URG-H05 | REEMPLAZAR permanencia por cinco rangos nuevos con fronteras explícitas; atención sigue secundaria candidata |
| URG-H06 | CONSERVAR histórico: permanencia 12,358 vs 12,356, diferencia +2 sin reconciliación de datos |
| URG-H07 | CONSERVAR adaptación documental HCG sin promoción multidominio |
| URG-H08 | CONSERVAR histórico: atención 12,021 vs 12,019, diferencia +2 sin reconciliación de datos |

## Pendientes y controles que requieren evidencia

- Tipos, longitudes, precisión, zona y transformación exacta de fechas derivadas no están documentados por completo.
- Deben monitorearse multiplicaciones futuras y conflictos dentro de `id_urgencia`; el alcance institucional de `codigo_cliente` queda fuera del modelo analítico.
- Faltan evidencia versionada del catálogo de centros, cardinalidad y vigencia de catálogos, y mapeos descriptivos.
- Edad, residencia, geografía, médico, localización y filtros avanzados requieren contratos específicos.
- Los tres componentes de triage y sus catálogos heterogéneos deben reconciliarse por servicio y periodo.
- Los benchmarks sobre la base operacional requieren snapshot o corte reproducible.
- Las fuentes adicionales se limitan a carencias identificadas; no se autoriza exploración indiscriminada ni modificación de vista o datos.

## Decisiones cerradas en esta iteración

- Atenciones cuenta episodios U-ING por `id_urgencia`; `fechaate` no condiciona el universo.
- Promedio diario divide episodios entre días calendario del intervalo semiabierto solicitado.
- Permanencia registrada usa ingresos del periodo con egreso registrable y reporta evaluables/no evaluables.
- Hospitalización presenta conteo y proporción sobre episodios del periodo con destino hospitalario aceptado.
- Reingresos conserva las ventanas exclusivas `<72` y `<48` horas con antecedente válido más reciente.
- Alta Médica permanece **EN VALIDACIÓN / NO IMPLEMENTADO** y no forma parte de los SQL aceptados.

Los contratos completos, incluida la fórmula y la semántica de nulos, están en [Contratos aceptados](indicadores/CONTRATOS_ACEPTADOS.md).

## Preguntas todavía abiertas

1. ¿Qué evento o precedencia representa edad cuando los campos expuestos difieren, y cómo se presenta residencia en pacientes con múltiples episodios?
2. ¿La madrugada nocturna se atribuye a fecha calendario o a la jornada iniciada el día anterior?
3. ¿Qué filtros avanzados son compatibles con situación actual, qué roles acceden o exportan identificables y quién aprueba las definiciones? Los responsables nominales siguen **NO DOCUMENTADOS**.
4. ¿Cómo se versionará el snapshot o corte reproducible para reconciliar consultas canónicas y benchmarks sobre la base operacional?

Estas preguntas no reabren identidad, universo dinámico de servicios, predicado activo, ventanas de reingreso ni las fórmulas aceptadas. El efecto de servicios actualmente inactivos sobre el histórico requiere evidencia de catálogo antes de cualquier cambio.

## Límites

No definir umbrales de suficiencia, metas, exclusiones o reglas de antecedente sin evidencia. No inventar respuestas ni convertir hallazgos en correcciones de datos. Censo retrospectivo, tasas adicionales y rangos secundarios siguen candidatos. [Plan](evidencia/PLAN_VALIDACION.md).

## Hallazgos SQL consolidados

VALIDADO: `id_urgencia` como identidad del evento, `codigo_cliente` como identidad longitudinal, universo dinámico de servicios y algoritmo/denominador de reingresos. VALIDADO CON ADVERTENCIA: representación física multiplicable por `vsegpop`, deuda histórica de `fechaegr`, fechas extremas y benchmarks sobre datos vivos. [Detalle](evidencia/VALIDACION_SQL_FUNCIONAL_2026-09-08.md).
