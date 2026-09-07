# Decisiones y cambios — Urgencias

Vigente: reconciliación 2026-09-07. Entradas iniciales conservadas como antecedente, no reabren preguntas ya resueltas.

## Decisiones históricas del baseline (alcance inicial completado)

### URG-GOV-001 — Baseline independiente y documental

- Fecha: 2026-09-06. Estado: APROBADA en alcance por solicitud del usuario, no aprobación institucional de indicadores.
- Contexto: iniciar Urgencias con referencia transversal HCG y metodología CEX.
- Decisión: fuente inicial vUrgencias, episodio candidato, gobierno propio; documentar antes de programar. Crear un commit inicial sin push y detenerse.
- Alternativas descartadas: clonar aplicación, fórmulas, estados, capacidad o D01–D05 CEX; no demuestran equivalencia del dominio.
- Impacto: reglas, candidatos, diccionarios, evidencia y UX provisionales.
- Evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt) y [procedencia](PROCEDENCIA.md).
- Sustituye / es sustituida por: NO APLICA.

### URG-GOV-002 — Adopción documental y vacíos explícitos

- Fecha: 2026-09-06. Estado: adoptada para preparar el baseline solicitado.
- Contexto: HCG enumera RECHAZADO entre estados posteriores; la solicitud exige PENDIENTE.
- Decisión: usar ADOPTADO, ADAPTADO, NO_APLICA y PENDIENTE localmente; no modificar specs ni promover a VALIDADO_MULTIDOMINIO. Referencias históricas no son benchmarks vigentes.
- Alternativas descartadas: declarar validación clínica o multidominio sin ejecutar casos.
- Impacto: [adopción](ADOPCION_HCG.md), [manifiesto](../evidencia/MANIFIESTO_VALIDACION.md) y limitaciones.
- Evidencia: solicitud y commit HCG fijado. Responsable de preparación: Codex; responsable institucional POR ASIGNAR.
- Sustituye / es sustituida por: NO APLICA.

## Deuda histórica del baseline — sustituida por decisiones siguientes

Los intervalos continuos, antecedente de reingreso, redondeo visual y evaluabilidad son propuestas documentadas, no decisiones institucionales cerradas. Ver [preguntas funcionales](../DESCUBRIMIENTOS_Y_LIMITACIONES.md). Futuras decisiones registrarán responsable, evidencia y sustitución; el histórico nunca prevalece sobre el contrato vigente.


## Decisiones de reconciliación

Fecha común 2026-09-07. Autoridad funcional: contexto del usuario; preparación: Codex; responsables institucionales nominales NO DOCUMENTADO. Estado: DEFINIDO FUNCIONALMENTE en alcance comunicado, candidatos señalados; SQL NO EJECUTADO. Evidencia común [solicitud](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). No promoción a oficial ni VALIDADO_MULTIDOMINIO.

### URG-GOV-003 — Fuente principal

- Anterior: Sólo vista, complementarias no identificadas; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/diccionarios/FUENTES_Y_GRANULARIDAD.md).
- Acción: CONSERVAR. Decisión: dbo.vUrgencias primaria; sin exploración indiscriminada.
- Motivo: Contexto 1 conserva fuente.
- Impacto: [docs/diccionarios/FUENTES_Y_GRANULARIDAD.md](../../docs/diccionarios/FUENTES_Y_GRANULARIDAD.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-004 — Entidad y claves

- Anterior: episodio_pk provisional; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/diccionarios/DICCIONARIO_vUrgencias.md).
- Acción: REEMPLAZAR. Decisión: epis_pk expuesto; id_urgencia/codigo_cliente/registro/foliounico distintos; cardinalidad pendiente.
- Motivo: Contexto 2 corrige nombre sin afirmar unicidad.
- Impacto: [docs/diccionarios/DICCIONARIO_vUrgencias.md](../../docs/diccionarios/DICCIONARIO_vUrgencias.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-005 — Fechas

- Anterior: Hitos preliminares sin prioridad; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md).
- Acción: MODIFICAR. Decisión: Registro/egreso principales; triage secundario; derivados preferidos; no exigir etapas intermedias.
- Motivo: Contexto 3 precisa semántica.
- Impacto: [docs/REGLAS_NEGOCIO.md](../../docs/REGLAS_NEGOCIO.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-006 — Historia

- Anterior: Sin ventana definida; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/README.md).
- Acción: AMPLIAR. Decisión: 3 años móviles configurables; anterior consultable; no truncar stock/antecedente.
- Motivo: Contexto 4 no es retención.
- Impacto: [config/criterios-funcionales.json](../../config/criterios-funcionales.json) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-007 — Servicios

- Anterior: Universo pendiente; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/diccionarios/FUENTES_Y_GRANULARIDAD.md).
- Acción: AMPLIAR. Decisión: codigo_area=2 y serv_activo_sn=1; centros dinámicos/HCO; serv_ing_urg_sn no filtra.
- Motivo: Contexto 5 identifica catálogo.
- Impacto: [docs/diccionarios/FUENTES_Y_GRANULARIDAD.md](../../docs/diccionarios/FUENTES_Y_GRANULARIDAD.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-008 — Situación actual

- Anterior: Doble nulo y >5 años separado del actual; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md).
- Acción: MODIFICAR. Decisión: Conservar doble nulo; excluir deuda con motivo; >24/>48/>72 sin recorte por edad.
- Motivo: Contexto 6 cambia prioridad.
- Impacto: [docs/REGLAS_NEGOCIO.md](../../docs/REGLAS_NEGOCIO.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-009 — Permanencia

- Anterior: Rangos 0–2/2–6/6–12/12–24/>24; estadístico pendiente; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md).
- Acción: REEMPLAZAR. Decisión: Promedio, abiertos/completados separados; <12/12–24/24–48/48–72/>72.
- Motivo: Contexto 7 conserva extremos válidos.
- Impacto: [docs/REGLAS_NEGOCIO.md](../../docs/REGLAS_NEGOCIO.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-010 — Reingresos

- Anterior: 24/72 candidatos, límites pendientes; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md).
- Acción: REEMPLAZAR. Decisión: Principal <72, secundario 48, bandas disjuntas; algoritmo pendiente.
- Motivo: Contexto 8 cierra predicado.
- Impacto: [docs/REGLAS_NEGOCIO.md](../../docs/REGLAS_NEGOCIO.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-011 — Triage

- Anterior: Cobertura genérica/campos incompletos; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/diccionarios/DICCIONARIO_vUrgencias.md).
- Acción: AMPLIAR. Decisión: Fecha/nivel/responsable, cobertura siempre, ausencia no invalida.
- Motivo: Contexto 9 heterogeneidad.
- Impacto: [docs/diccionarios/DICCIONARIO_vUrgencias.md](../../docs/diccionarios/DICCIONARIO_vUrgencias.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-012 — Resolución

- Anterior: Dimensiones sin mapeo; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md).
- Acción: AMPLIAR. Decisión: Destino/motivo independientes, catálogo motivo, 8 grupos destino configurables.
- Motivo: Contexto 10 no autoriza modificar vista.
- Impacto: [docs/REGLAS_NEGOCIO.md](../../docs/REGLAS_NEGOCIO.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-013 — Población

- Anterior: Grupos/nacimiento no definidos; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md).
- Acción: MODIFICAR. Decisión: 9 grupos y campos edad conocidos; cálculo pendiente.
- Motivo: Contexto 11 mantiene calidad localidad.
- Impacto: [docs/REGLAS_NEGOCIO.md](../../docs/REGLAS_NEGOCIO.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-014 — Demanda

- Anterior: Tendencia general; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md).
- Acción: AMPLIAR. Decisión: Hora/día/turno 08/14/20; parametrización futura.
- Motivo: Contexto 12 horarios.
- Impacto: [docs/REGLAS_NEGOCIO.md](../../docs/REGLAS_NEGOCIO.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-015 — Clínica

- Anterior: Sin módulo específico; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/gobierno/CATALOGO_FUNCIONAL.md).
- Acción: AMPLIAR. Decisión: Motivos/diagnósticos Top 5/10/20/Todos; texto libre detalle.
- Motivo: Contexto 13 sin inferencias.
- Impacto: [docs/gobierno/CATALOGO_FUNCIONAL.md](../../docs/gobierno/CATALOGO_FUNCIONAL.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-016 — Personal

- Anterior: Médico provisional; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/CONTRATO_UX_FUNCIONAL.md).
- Acción: AMPLIAR. Decisión: Actividad asociada, no productividad/mejor/peor; triage separado.
- Motivo: Contexto 14 lenguaje neutral.
- Impacto: [docs/CONTRATO_UX_FUNCIONAL.md](../../docs/CONTRATO_UX_FUNCIONAL.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-017 — KPI ejecutivos

- Anterior: 28 candidatos/3 perspectivas; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/indicadores/00_CATALOGO_INDICADORES.md).
- Acción: MODIFICAR. Decisión: Seis propuestos, separar actual/módulos/calidad/candidatos; no oficializar.
- Motivo: Contexto 15 prioridad.
- Impacto: [docs/indicadores/00_CATALOGO_INDICADORES.md](../../docs/indicadores/00_CATALOGO_INDICADORES.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-018 — Comparaciones

- Anterior: Equivalencia genérica; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md).
- Acción: AMPLIAR. Decisión: Anterior equivalente principal, año anterior opcional; %, pp, minutos/horas.
- Motivo: Contexto 16 unidades.
- Impacto: [docs/REGLAS_NEGOCIO.md](../../docs/REGLAS_NEGOCIO.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-019 — Filtros

- Anterior: Centro→Servicio→Localización→Paciente; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/CONTRATO_UX_FUNCIONAL.md).
- Acción: REEMPLAZAR. Decisión: Visibles periodo/centro/servicio/turno; avanzados/búsqueda dinámica.
- Motivo: Contexto 17 separa drill-down.
- Impacto: [docs/CONTRATO_UX_FUNCIONAL.md](../../docs/CONTRATO_UX_FUNCIONAL.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-020 — Navegación

- Anterior: Tres perspectivas/composición libre; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/CONTRATO_UX_FUNCIONAL.md).
- Acción: AMPLIAR. Decisión: Nueve secciones, click filtra, detalle abre, chips/persistencia.
- Motivo: Contexto 18 no copia UI CEX.
- Impacto: [docs/CONTRATO_UX_FUNCIONAL.md](../../docs/CONTRATO_UX_FUNCIONAL.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-021 — Detalle/exportación

- Anterior: Predicado/page/count/paginación; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/CONTRATO_UX_FUNCIONAL.md).
- Acción: AMPLIAR. Decisión: Columnas mínimas, exportación agregada/episodio con filtros exactos.
- Motivo: Contexto 19 reconciliación.
- Impacto: [docs/CONTRATO_UX_FUNCIONAL.md](../../docs/CONTRATO_UX_FUNCIONAL.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-022 — UX

- Anterior: Estados técnicos/NO CALCULABLE; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/CONTRATO_UX_FUNCIONAL.md).
- Acción: AMPLIAR. Decisión: SIN DATOS/NO APLICA/DATOS INSUFICIENTES, advertencias visibles.
- Motivo: Contexto 20 ausencia no error.
- Impacto: [docs/CONTRATO_UX_FUNCIONAL.md](../../docs/CONTRATO_UX_FUNCIONAL.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-023 — Arquitectura

- Anterior: Sin stack/endpoints; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/README.md).
- Acción: AMPLIAR. Decisión: Capas y 11 endpoints previstos, no implementados.
- Motivo: Contexto 21 referencia transversal.
- Impacto: [docs/ARQUITECTURA_FUTURA.md](../../docs/ARQUITECTURA_FUTURA.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-024 — Rendimiento

- Anterior: Medir antes de optimizar; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/README.md).
- Acción: AMPLIAR. Decisión: Filtro temprano, servidor, TTL relativo/keys completas; sin ETL/cache.
- Motivo: Contexto 22 disciplina.
- Impacto: [docs/ARQUITECTURA_FUTURA.md](../../docs/ARQUITECTURA_FUTURA.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-025 — Privacidad

- Anterior: Sin identidad en evidencia/URL; [origen](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/CONTRATO_UX_FUNCIONAL.md).
- Acción: AMPLIAR. Decisión: Agregados mínimos, detalle autorizado, logs sin datos personales.
- Motivo: Contexto 23 contrato ampliado.
- Impacto: [docs/CONTRATO_UX_FUNCIONAL.md](../../docs/CONTRATO_UX_FUNCIONAL.md) y [matriz](RECONCILIACION_BASELINE_717f681.md).
- Sustituye/amplía definición del tema en baseline, sin modificar commit original. Vigente hasta decisión explícita posterior.

### URG-GOV-026 — Fronteras y precisiones documentales

- AMPLIAR, 2026-09-07; preparación Codex dentro del mandato de documentar fronteras.
- Permanencia [0,12), [12,24), [24,48), [48,72], >72 conserva <12 y >72 sin huecos/solapamientos. Retorno (0,24], (24,48], (48,72), 72 excluido por decisión recibida.
- Propuestas separadas: referencia visual hasta 48 inclusiva, aniversario móvil al corte, últimos N días incluyendo hoy, redondeo más cercano. No atribuirlas como decisiones expresas del usuario ni SQL probado.
- Atenciones, denominador diario, cohorte permanencia y hospitalización/reingresos conteo/tasa conservan preguntas. No exigir fechaate ni inventar denominadores.
- Impacto/evidencia: [reglas](../REGLAS_NEGOCIO.md), [catálogo](../indicadores/00_CATALOGO_INDICADORES.md), [configuración](../../config/criterios-funcionales.json). Sustituye sólo convenciones históricas señaladas, sin SQL.

### URG-GOV-027 — Evidencia histórica y HCG

- CONSERVAR historia y AMPLIAR procedencia. FAA histórico con +2 atención y +2 permanencia, nunca tests actuales.
- HCG mantiene 64/5/0/2; actualiza motivo FIL-001 a Centro→Servicio y drill-down operativo separado.
- Casos R2 tienen nuevos esperados documentales sin ejecución; resultado original preservado y nuevo resultado separado.
- Impacto: evidencia, adopción, config, checkpoint y trazabilidad. [Matriz](RECONCILIACION_BASELINE_717f681.md). Enlaces PASS no prueban SQL/API/UI.
