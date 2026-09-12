# Decisiones y cambios — Urgencias

Vigente: reconciliación 2026-09-08. La sección posterior de validación SQL sustituye los pendientes que identifica expresamente. Entradas iniciales conservadas como antecedente, no reabren preguntas ya resueltas.

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


## Decisiones posteriores a validación SQL — 2026-09-08

Evidencia común: [validación SQL funcional](../evidencia/VALIDACION_SQL_FUNCIONAL_2026-09-08.md). Autoridad de las conclusiones: resultados comunicados por el usuario. No implica implementación, aprobación institucional ni modificación de la base.

### URG-GOV-028 — Identidad del evento y representación

- Estado: VALIDADA CON ADVERTENCIA.
- Sustituye URG-GOV-004 en lo relativo a identidad/cardinalidad pendientes.
- Decisión: id_urgencia, exposición de dbo.urgencias.id_urgencia_pk y alias folio, es la identidad canónica. epis_pk es el episodio XHIS y foliounico su alias.
- Evidencia: id_urgencia único/no nulo en la tabla base; vínculo epis_pk↔id_urgencia 1:1 cuando existe; 19 eventos históricos sin epis_pk.
- Advertencia: vUrgencias puede multiplicar filas por enriquecimientos. Atenciones cuenta identidades id_urgencia, nunca COUNT(*) semántico.

### URG-GOV-029 — Identidad longitudinal

- Estado: VALIDADA.
- Decisión: codigo_cliente es la identidad longitudinal analítica del paciente. registro no la sustituye.
- Evidencia: aproximadamente 1,272,239 pacientes y 2.52 millones de eventos; outlier real de 1,493 eventos conservado.

### URG-GOV-030 — Universo de servicios y estados UX

- Estado: VALIDADA.
- Confirma URG-GOV-007.
- Decisión: codigo_area=2 AND serv_activo_sn=1; serv_ing_urg_sn sólo informa. Catálogo/centros dinámicos y servicios con cero actividad incluidos.
- Diseño: “Sin actividad en el periodo”, “Sin datos”, “No aplica” y “Datos insuficientes” conservan significados distintos.

### URG-GOV-031 — Activo probable y deuda histórica

- Estado: VALIDADA CON ADVERTENCIA.
- Confirma URG-GOV-008.
- Decisión: fechaegr IS NULL AND motivo_alta_pk IS NULL. La ausencia de egreso sola incluye deuda histórica y no define el estado actual.
- Evidencia: 349 activos probables y aproximadamente 190,588 casos con motivo/sin egreso en la corrida.

### URG-GOV-032 — Reingresos y denominador

- Estado: VALIDADA.
- Sustituye URG-GOV-010 en algoritmo, referencia 48 y denominador.
- Decisión: seleccionar por paciente/servicio el egreso previo válido más reciente, aun fuera del periodo; ordenar fechaegr, Fechaing e id_urgencia descendentes. Bandas (0,24], (24,48], (48,72); 72 h queda fuera.
- Denominador: todos los eventos evaluables del periodo, con o sin antecedente. Evaluabilidad requiere id_urgencia, codigo_cliente, codigo_servicio_ingreso y Fechaing.
- Presentación: <48 h es corte secundario; el redondeo a 0.5 h nunca clasifica.

### URG-GOV-033 — Motivo de alta ya expuesto

- Estado: VALIDADA.
- Corrige URG-GOV-012 sólo en la disponibilidad física.
- Decisión: dbo.vUrgencias ya incorpora dbo.motivos_alta_ing y expone motivo_alta_desc como motivo_alta. Destino y motivo siguen separados; el mapeo ejecutivo permanece pendiente.

### URG-GOV-034 — Benchmarks sobre fuente operacional

- Estado: VALIDADA CON ADVERTENCIA.
- Decisión: los resultados de reingreso son evidencia de reconciliación, no metas o umbrales. Comparaciones exactas entre corridas requieren timestamp, snapshot consistente o periodo cerrado.

### URG-GOV-035 — Contratos aceptados para primera implementación

- Estado: ACEPTADO.
- Atenciones usa eventos únicos por `id_urgencia`; promedio diario usa días calendario completos y conserva días con cero actividad.
- Pacientes únicos usa `codigo_cliente`; atenciones por paciente comparte el mismo universo.
- Permanencia registrada conserva todos los extremos cronológicamente interpretables.
- Hospitalización es exclusivamente `destino_urg_pk = 5` sobre eventos completados.
- Reingreso secundario se ajusta al contrato vigente estricto `<48 h`; exactamente 48 horas queda fuera del corte, sin alterar las bandas descriptivas.

### URG-GOV-036 — Triage y madurez de captura

- Estado: ACEPTADO CON OBSERVACIONES.
- Cobertura muestra eventos con `fechatri`, universo y porcentaje por centro, servicio y periodo.
- `fechatri` es el timestamp para tiempo registrado; `triage_fecha` es fecha calendario y no mide intervalos.
- Clasificación nativa 1–6, extremos y variaciones temporales permanecen visibles sin explicación causal automática.

### URG-GOV-037 — Primera fase técnica

- Estado: IMPLEMENTADA, pendiente de reconciliación en entorno SQL configurado.
- Se adopta separación Repository→servicio→API→frontend y paginación server-side como patrones transversales.
- CEX no aporta reglas de Urgencias. No se crean ETL, escrituras, listas fijas ni datos identificables en endpoints.


### URG-GOV-038 — Autoridad y adopción transversal

- Estado: ACEPTADO.
- `dashboard_hcg_specs@ab245b2` es la referencia transversal para contrato de indicador, estados separados, anomalías, portabilidad y checkpoint.
- Las fórmulas de Urgencias permanecen locales. CEX no fue modificado y sólo conserva deuda registrada en HCG Specs.

### URG-GOV-039 — SQL verificable por indicador

- Estado: VALIDADO TÉCNICAMENTE / pendiente de fuente.
- Los indicadores aceptados se asocian a SQL individual en `scripts/sql/indicadores/`, separado de descubrimiento.
- Cada consulta es read-only, parametrizable, compatible con nivel 100 y explícita en universo, NULL y anomalías.
- La duplicación del CTE en artefactos independientes se controla estáticamente; el runtime mantiene una única construcción en `event-scope.sql.ts`.

### URG-GOV-040 — Portabilidad y continuidad

- Estado: ACEPTADO.
- `docs/RECONSTRUIR_DASHBOARD.md` es índice, `config/dashboard-manifest.json` sólo apunta a fuentes y `CHECKPOINT_ACTUAL.md` es el único checkpoint operativo mutable.
- Git preserva historia; no se crean checkpoints por iteración.

### URG-GOV-041 — Hitos no cerrados

- Estado: ACEPTADO.
- Atención Médica permanece EN PROCESO. Alta Médica permanece EN VALIDACIÓN y NO IMPLEMENTADA.
- No se crea SQL productivo para hitos EN VALIDACIÓN o POR DEFINIR.

### URG-GOV-042 — Reconciliación bloqueada por acceso DB

- Estado: VALIDADA CON ADVERTENCIA.
- No existe `.env` ni están presentes `DB_SERVER`, `DB_DATABASE`, `DB_USER` o `DB_PASSWORD`; por ello no se ejecutaron SQL Server, `/api/health/db`, API con datos, UI con datos ni detalle.
- Los 14 indicadores tienen evidencia explícita `NO EJECUTADO`; ninguno se promueve a `RECONCILIADO CON FUENTE`.
- La comparación estática no sustituye resultados, tiempos, anomalías ni diferencias numéricas.

### URG-GOV-043 — Alineaciones técnicas previas a reconciliación

- Estado: VALIDADO TÉCNICAMENTE.
- Hospitalización conserva precisión `decimal(9,4)` entre SQL canónico y Repository.
- La UI incorpora fallos de Triage/catálogos y no muestra ceros o vacío cuando faltan respuestas; el detalle deja de llamarse reconciliado.
- No cambian universo, fórmula, exclusiones, categorías ni estados funcionales.

### URG-GOV-044 — Alta Médica registrada y secuencia temporal

- Estado: VALIDADA CON ADVERTENCIA; no aceptada como KPI.
- Decisión: `fechamed` queda como timestamp candidato del hito registrado de Alta Médica, únicamente en su población con valor no nulo y sin sustituir `fechaegr`. `altamed_fecha` queda como campo auxiliar a medianoche, no equivalente ni sustituto de `fechamed`.
- Alcance: cobertura y secuencia son diagnósticos de calidad. Faltantes, inversiones, mismo instante y extremos se conservan y no restringen U-ING.
- Límite: sigue POR DEFINIR la semántica clínica u operativa que relacione el hito registrado con el egreso administrativo. No se implementa SQL productivo, API, UI ni indicador.
- Evidencia: [validación AMED](../evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.md).

### URG-GOV-045 — Jerarquía de hitos y cierre interpretativo AMED

- Estado: DEFINIDA FUNCIONALMENTE; Alta Médica permanece EN VALIDACIÓN y la secuencia completa sigue POR DEFINIR como KPI.
- Decisión: U-ING se ancla en `Fechaing`. Ingreso, Triage y Egreso son hitos principales; Atención Médica y Alta Médica son complementarios. La ausencia de un hito posterior al ingreso no invalida ni excluye un evento.
- Alta Médica: `fechamed` queda como timestamp canónico actual del hito registrado, con población evaluable propia y cobertura explícita. No sustituye `fechaegr`; `altamed_fecha` permanece auxiliar y no se infieren valores entre campos.
- Secuencia: la secuencia de cinco hitos es análisis complementario de consistencia y cobertura. Sus faltantes, inversiones y extremos no son filtros de U-ING ni de KPIs existentes.
- Límite: no se aceptan indicadores, no se modifica ningún contrato aceptado y no se implementa API/UI.
- Contratos: [URG-AMED-01..04](../indicadores/CONTRATOS_EN_VALIDACION.md). Evidencia: [validación AMED](../evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.md).
### URG-GOV-046 — Puerto local de Urgencias

- Estado: IMPLEMENTADA Y VERIFICADA LOCALMENTE.
- Decisión: Urgencias usa `API_PORT=3002` como valor predeterminado versionado. La configuración local prevalece mediante `.env`, que permanece ignorado y no tracked.
- Proxy: Vite carga sólo variables `API_*` del `.env` raíz; usa `API_PROXY_TARGET` cuando exista y, de otro modo, construye el destino con `API_PORT` o 3002. No carga ni documenta credenciales `DB_*`.
- Verificación: `/api/health` respondió en 3002 y a través del proxy Vite local.
- Alcance: configuración local de Urgencias; CEX no fue modificado.
### URG-GOV-047 — Caracterización poblacional

- Estado: DEFINIDA FUNCIONALMENTE / VALIDADA CON FUENTE; no KPI ni API/UI.
- Decisión: Población se caracteriza sobre U-ING. Edad canónica propuesta: `fecha_nac` respecto de `Fechaing`; sexo y residencia conservan valores nativos. Servicio nunca sustituye población.
- Limitaciones: no combinar `EdadMeses`/`EdadDias`; no inferir pediatría, adultez u obstetricia por edad, sexo o servicio. Nulos, extremos y variantes geográficas se conservan.
- Evidencia: [validación Población](../evidencia/VALIDACION_POBLACION_2026-09-10.md).

### URG-GOV-048 — Diagnósticos de Urgencias

- Estado: DEFINIDA FUNCIONALMENTE / VALIDADA CON FUENTE; no KPI ni API/UI.
- Decisión: Diagnóstico de ingreso (`cdiag_ing`/`diag_ing`) y de egreso (`cdiag_egr`/`diag_egr`) son dimensiones independientes; código y descripción nativos se conservan sin inferir CIE, familia clínica, severidad ni concordancia.
- Hallazgos: ingreso es prácticamente 1:1 código↔descripción (6163 códigos, 6164 pares en 36m); egreso no lo es (6250 códigos, 9613 pares en 36m; 507 códigos con 2–4 descripciones, verificado contra fuente). 6257 eventos en 36m tienen `diag_egr` sin `cdiag_egr` (2842 valores de texto distintos), preservados como texto no codificado.
- Limitaciones: no se normaliza ni clasifica el texto de egreso sin código; no se implementa SQL productivo, API, UI ni indicador.
- Contratos: [URG-DIAG-01..04](../indicadores/CONTRATOS_EN_VALIDACION.md). Evidencia: [validación Diagnósticos](../evidencia/VALIDACION_DIAGNOSTICOS_2026-09-10.md).

### URG-GOV-049 — Motivo de Urgencia

- Estado: DEFINIDA FUNCIONALMENTE / VALIDADA CON FUENTE; no KPI ni API/UI.
- Decisión: motivo_urgencia es la dimensión categórica nativa del motivo registrado; motivo_urg_libre es texto complementario sensible y no equivale ni sustituye a la categoría.
- Hallazgos: la categoría tuvo 100% de cobertura y 15 valores nativos en 12/24/36 meses. El texto cubrió 13.61% / 12.30% / 13.46%; en 36 meses presentó 21,443 valores distintos y una variación marcada por centro y servicio.
- Reglas: preservar valores originales; no inferir categorías, diagnóstico, gravedad, causalidad o calidad; no exponer texto en evidencia ni rankings.
- Limitaciones: autoridad institucional del catálogo, procedencia anterior a la vista y política de acceso al texto quedan pendientes. No se implementa SQL productivo, API, UI ni indicador.
- Contratos: [URG-MOT-01..03](../indicadores/CONTRATOS_EN_VALIDACION.md). Evidencia: [validación Motivo](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md).

### URG-GOV-050 — Cierre técnico MOD-05, MOD-09 y TRI-02

- Estado: IMPLEMENTADO Y RECONCILIADO CON FUENTE.
- Alcance: se añadieron únicamente las capas Repository, servicio, HTTP y UI de Resolución/destino, Frecuentación y Clasificación nativa de Triage.
- Autoridad preservada: U-ING, filtros, categorías, bandas, denominadores, NULL y SQL aceptados no cambiaron.
- Reconciliación: tres comparaciones SQL→API exactas en cohorte cerrada; la UI renderiza las filas API preservadas mediante prueba automatizada.
- Rutas: `/api/urgencias/resolution`, `/api/urgencias/frequentation` y clasificación añadida a `/api/urgencias/triage`.
- Evidencia: [reconciliación ITER-004](../evidencia/RECONCILIACION_ITER004_2026-09-10.md).

### URG-GOV-051 — Cierre técnico de bandas EJ-03, ACT-01 y TRI-03

- Estado: IMPLEMENTADO Y RECONCILIADO CON FUENTE; ACT-01 conserva limitación de fuente viva.
- Alcance: se añadieron únicamente las bandas y señales ya aceptadas a Repository, servicio, HTTP y UI.
- Autoridad preservada: U-ING, universo activo, evaluabilidad, cortes, límites, fórmulas, anomalías y SQL canónicos no cambiaron.
- Presentación: Permanencia y Triage muestran bandas exclusivas; Activos probables muestra umbrales acumulativos a un corte explícito.
- Reconciliación: tres comparaciones SQL→API exactas; la UI renderiza las proyecciones API preservadas mediante prueba automatizada.
- Evidencia: [reconciliación ITER-005](../evidencia/RECONCILIACION_ITER005_2026-09-10.md).

### URG-GOV-052 — Atención médica registrada

- Estado: DEFINIDA FUNCIONALMENTE / VALIDADA CON FUENTE; no KPI ni API/UI.
- Decisión: `fechaate` queda como timestamp canónico actual del hito registrado de Atención médica, con población evaluable y cobertura propias sobre U-ING.
- Cronología: `Fechaing→fechaate` usa sólo pares no negativos para duración; la ausencia y las anomalías de pares con otros hitos no excluyen eventos.
- Hallazgos: cobertura 94.1141% / 92.7560% / 88.0736% en 12/24/36 meses, cero conflictos y cero inversiones respecto de Ingreso; las inversiones Triage→Atención impiden imponer esa secuencia como regla.
- Límite: el registro no acredita inicio clínico real, oportunidad ni presencia. `atencion_fecha` permanece auxiliar con equivalencia POR DEFINIR.
- Contrato: [URG-ATE-01](../indicadores/CONTRATOS_EN_VALIDACION.md). Evidencia: [validación Atención médica](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.md).

### URG-GOV-053 — Definición funcional de Calidad de datos (URG-CAL-01)

- Estado: DEFINIDA FUNCIONALMENTE; capa transversal, sin campo, fuente ni fórmula propios.
- Decisión: cada señal de calidad ya existente en código (`eventosConConflicto`, `filasMultiplicadas`, `conflicto`, `permanenciaInvertidos`, `permanenciaSinEgreso`, `activosAntiguedadNoEvaluable`, `activosFechaIngresoFutura`, `secuenciasInvertidas`, `tiemposMayorIgual24h`, `tiemposMayorIgual7d`) queda asociada a su indicador dueño (EJ-01, EJ-03, ACT-01, TRI-03).
- Regla de promoción a UI: una señal sólo es advertencia visible si su indicador es `ACEPTADO`/`ACEPTADO CON OBSERVACIONES`. Las señales de AMED, secuencia completa, Atención médica, Población, Diagnósticos y Motivo de Urgencia permanecen como auditoría técnica en evidencia/SQL hasta decisión institucional de KPI de cada bloque.
- Gap declarado: `tiemposMayorIgual24h`/`tiemposMayorIgual7d` de TRI-03 se calculan y exponen por `/urgencias/triage`, pero no se renderizan en `App.tsx`; queda pendiente de una iteración de implementación futura.
- Límite: no se crean metas, semáforos ni umbrales institucionales; no cambia ningún universo, fórmula o regla clínica; no se implementó código, API ni UI en esta iteración.
- Contrato: [URG-CAL-01](../indicadores/CONTRATOS_ACEPTADOS.md). Evidencia: [ITER-007](../iteraciones/ITER-007.md).

### URG-GOV-054 — Cierre del gap UI de tiempos de Triage (URG-TRI-03)

- Estado: IMPLEMENTADO Y RECONCILIADO CON FUENTE.
- Corrección a URG-GOV-053: al revisar el código se encontró que `tiemposMayorIgual24h`/`tiemposMayorIgual7d` ya se mostraban como texto contextual en el panel de Triage desde el commit `2fdae1c`, anterior a ITER-007; el "gap" declarado entonces fue una lectura incompleta, no una ausencia real de dato. El gap real cerrado aquí es de presentación: faltaba el tratamiento de advertencia de calidad (`notice quality`) que ya reciben las señales de EJ-01, y el texto aparecía siempre, incluso en cero.
- Decisión: ambos campos se presentan como advertencia condicional en el panel de Triage, visible sólo cuando alguno es mayor a cero, con el mismo estilo visual usado para `eventosConConflicto`/`filasMultiplicadas` de EJ-01.
- Alcance: sólo `client/src/App.tsx` y `client/src/App.test.tsx`. Sin cambios en SQL, API, contratos, universos, fórmulas ni umbrales; sin fuentes nuevas ni otros indicadores.
- `URG-CAL-01` queda `RECONCILIADO CON FUENTE`: sus cuatro indicadores dueño (EJ-01, EJ-03, ACT-01, TRI-03) tienen ya todas sus señales visibles en UI.
- Contrato: [URG-CAL-01](../indicadores/CONTRATOS_ACEPTADOS.md). Evidencia: [ITER-008](../iteraciones/ITER-008.md).

### URG-GOV-055 — Aceptación de Atención médica registrada (URG-ATE-01)

- Estado: ACEPTADO CON OBSERVACIONES (decisión institucional); IMPLEMENTADO Y RECONCILIADO CON FUENTE.
- Decisión: `URG-ATE-01` se promueve de `EN VALIDACIÓN` a KPI aceptado. Se implementa el módulo de Atención médica registrada: cobertura de `fechaate` sobre U-ING, tiempo registrado `Fechaing→fechaate` con promedio y bandas (mismo minuto, 0–30, 31–60, 61–120, 121–240, >240 min), y señales de calidad (invertidos, ≥24h, ≥7d) integradas a `URG-CAL-01`.
- Alcance técnico: `fechaate` se incorpora al `EventScope` canónico compartido (`event-scope.sql.ts`) de forma aditiva, sin alterar `conflicto_nucleo` ni el resultado de ningún otro indicador. Nuevo SQL `URG-ATE-01_ATENCION_MEDICA.sql`, `fetchAttention`/`getAttention`, ruta `/api/urgencias/attention` y panel "Atención médica" en UI.
- Límites respetados: no se usa `atencion_fecha` para completar `fechaate` (su equivalencia sigue POR DEFINIR); no se denomina el intervalo "tiempo de espera" ni "oportunidad asistencial", ni se afirma inicio clínico real; no se crean metas ni semáforos institucionales; no se modificó ningún otro indicador, universo, fórmula o regla clínica; no se abrió ninguna fuente adicional.
- Verificación: reconciliación SQL→API exacta (resumen y cobertura por servicio) sobre ventana operativa; cobertura de la ventana cerrada de 12 meses (94.11%) reproduce la cifra ya validada en ITER-006. Server 10 pruebas, client 5 pruebas, builds server/client PASS.
- Contrato: [URG-ATE-01](../indicadores/CONTRATOS_ACEPTADOS.md#urg-ate-01--atención-médica-registrada). Evidencia: [ITER-009](../iteraciones/ITER-009.md).
