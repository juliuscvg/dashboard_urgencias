# Reconciliación del baseline 717f681

Origen inmutable: 717f681e6d979798a2b1d680dda64d765bb3b051, [URG][BASE] Baseline funcional y transversal, publicado. Descendencia de main sin reescribir historia. Evidencia nueva: [solicitud](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). [Bitácora](DECISIONES_Y_CAMBIOS.md).

CONSERVAR mantiene; MODIFICAR cambia parte; AMPLIAR agrega; REEMPLAZAR sustituye; DESCARTAR retira vigencia sin borrar historia; PENDIENTE DE VALIDACIÓN mantiene incertidumbre. Ninguna acción equivale a SQL validado.

## Matriz por tema

| Decisión | Tema | Anterior | Acción | Nueva decisión | Archivo afectado | Motivo |
|---|---|---|---|---|---|---|
| URG-GOV-003 | Fuente principal | Sólo vista, complementarias no identificadas | CONSERVAR | dbo.vUrgencias primaria; sin exploración indiscriminada | [Documento](../../docs/diccionarios/FUENTES_Y_GRANULARIDAD.md) | Contexto 1 conserva fuente |
| URG-GOV-004 | Entidad y claves | episodio_pk provisional | REEMPLAZAR | epis_pk expuesto; id_urgencia/codigo_cliente/registro/foliounico distintos; cardinalidad pendiente | [Documento](../../docs/diccionarios/DICCIONARIO_vUrgencias.md) | Contexto 2 corrige nombre sin afirmar unicidad |
| URG-GOV-005 | Fechas | Hitos preliminares sin prioridad | MODIFICAR | Registro/egreso principales; triage secundario; derivados preferidos; no exigir etapas intermedias | [Documento](../../docs/REGLAS_NEGOCIO.md) | Contexto 3 precisa semántica |
| URG-GOV-006 | Historia | Sin ventana definida | AMPLIAR | 3 años móviles configurables; anterior consultable; no truncar stock/antecedente | [Documento](../../config/criterios-funcionales.json) | Contexto 4 no es retención |
| URG-GOV-007 | Servicios | Universo pendiente | AMPLIAR | codigo_area=2 y serv_activo_sn=1; centros dinámicos/HCO; serv_ing_urg_sn no filtra | [Documento](../../docs/diccionarios/FUENTES_Y_GRANULARIDAD.md) | Contexto 5 identifica catálogo |
| URG-GOV-008 | Situación actual | Doble nulo y >5 años separado del actual | MODIFICAR | Conservar doble nulo; excluir deuda con motivo; >24/>48/>72 sin recorte por edad | [Documento](../../docs/REGLAS_NEGOCIO.md) | Contexto 6 cambia prioridad |
| URG-GOV-009 | Permanencia | Rangos 0–2/2–6/6–12/12–24/>24; estadístico pendiente | REEMPLAZAR | Promedio, abiertos/completados separados; <12/12–24/24–48/48–72/>72 | [Documento](../../docs/REGLAS_NEGOCIO.md) | Contexto 7 conserva extremos válidos |
| URG-GOV-010 | Reingresos | 24/72 candidatos, límites pendientes | REEMPLAZAR | Principal <72, secundario 48, bandas disjuntas; algoritmo pendiente | [Documento](../../docs/REGLAS_NEGOCIO.md) | Contexto 8 cierra predicado |
| URG-GOV-011 | Triage | Cobertura genérica/campos incompletos | AMPLIAR | Fecha/nivel/responsable, cobertura siempre, ausencia no invalida | [Documento](../../docs/diccionarios/DICCIONARIO_vUrgencias.md) | Contexto 9 heterogeneidad |
| URG-GOV-012 | Resolución | Dimensiones sin mapeo | AMPLIAR | Destino/motivo independientes, catálogo motivo, 8 grupos destino configurables | [Documento](../../docs/REGLAS_NEGOCIO.md) | Contexto 10 no autoriza modificar vista |
| URG-GOV-013 | Población | Grupos/nacimiento no definidos | MODIFICAR | 9 grupos y campos edad conocidos; cálculo pendiente | [Documento](../../docs/REGLAS_NEGOCIO.md) | Contexto 11 mantiene calidad localidad |
| URG-GOV-014 | Demanda | Tendencia general | AMPLIAR | Hora/día/turno 08/14/20; parametrización futura | [Documento](../../docs/REGLAS_NEGOCIO.md) | Contexto 12 horarios |
| URG-GOV-015 | Clínica | Sin módulo específico | AMPLIAR | Motivos/diagnósticos Top 5/10/20/Todos; texto libre detalle | [Documento](../../docs/gobierno/CATALOGO_FUNCIONAL.md) | Contexto 13 sin inferencias |
| URG-GOV-016 | Personal | Médico provisional | AMPLIAR | Actividad asociada, no productividad/mejor/peor; triage separado | [Documento](../../docs/CONTRATO_UX_FUNCIONAL.md) | Contexto 14 lenguaje neutral |
| URG-GOV-017 | KPI ejecutivos | 28 candidatos/3 perspectivas | MODIFICAR | Seis propuestos, separar actual/módulos/calidad/candidatos; no oficializar | [Documento](../../docs/indicadores/00_CATALOGO_INDICADORES.md) | Contexto 15 prioridad |
| URG-GOV-018 | Comparaciones | Equivalencia genérica | AMPLIAR | Anterior equivalente principal, año anterior opcional; %, pp, minutos/horas | [Documento](../../docs/REGLAS_NEGOCIO.md) | Contexto 16 unidades |
| URG-GOV-019 | Filtros | Centro→Servicio→Localización→Paciente | REEMPLAZAR | Visibles periodo/centro/servicio/turno; avanzados/búsqueda dinámica | [Documento](../../docs/CONTRATO_UX_FUNCIONAL.md) | Contexto 17 separa drill-down |
| URG-GOV-020 | Navegación | Tres perspectivas/composición libre | AMPLIAR | Nueve secciones, click filtra, detalle abre, chips/persistencia | [Documento](../../docs/CONTRATO_UX_FUNCIONAL.md) | Contexto 18 no copia UI CEX |
| URG-GOV-021 | Detalle/exportación | Predicado/page/count/paginación | AMPLIAR | Columnas mínimas, exportación agregada/episodio con filtros exactos | [Documento](../../docs/CONTRATO_UX_FUNCIONAL.md) | Contexto 19 reconciliación |
| URG-GOV-022 | UX | Estados técnicos/NO CALCULABLE | AMPLIAR | SIN DATOS/NO APLICA/DATOS INSUFICIENTES, advertencias visibles | [Documento](../../docs/CONTRATO_UX_FUNCIONAL.md) | Contexto 20 ausencia no error |
| URG-GOV-023 | Arquitectura | Sin stack/endpoints | AMPLIAR | Capas y 11 endpoints previstos, no implementados | [Documento](../../docs/ARQUITECTURA_FUTURA.md) | Contexto 21 referencia transversal |
| URG-GOV-024 | Rendimiento | Medir antes de optimizar | AMPLIAR | Filtro temprano, servidor, TTL relativo/keys completas; sin ETL/cache | [Documento](../../docs/ARQUITECTURA_FUTURA.md) | Contexto 22 disciplina |
| URG-GOV-025 | Privacidad | Sin identidad en evidencia/URL | AMPLIAR | Agregados mínimos, detalle autorizado, logs sin datos personales | [Documento](../../docs/CONTRATO_UX_FUNCIONAL.md) | Contexto 23 contrato ampliado |

## Retirados y pendientes

| Tema | Anterior | Acción | Vigente/evidencia necesaria | Archivo |
|---|---|---|---|---|
| Cinco años como recorte ejecutivo | Separación >5 años | DESCARTAR | Conservar deuda; no ocultar activos por edad | [R03](../REGLAS_NEGOCIO.md) |
| Mediana/percentiles como posible principal | Estadístico pendiente | DESCARTAR | PROMEDIO principal, extremos incluidos | [R05](../REGLAS_NEGOCIO.md) |
| Unicidad, representación y antecedente | No comprobados | PENDIENTE DE VALIDACIÓN | Perfilar claves, joins, secuencias | [Plan](../evidencia/PLAN_VALIDACION.md) |
| Edad al evento/precedencia | Pendiente | PENDIENTE DE VALIDACIÓN | Grupos cerrados; cálculo/discordancias pendientes | [Diccionario](../diccionarios/DICCIONARIO_vUrgencias.md) |
| Mapeo destino | No definido | PENDIENTE DE VALIDACIÓN | Catálogo/revisión, no códigos inventados | [R11](../REGLAS_NEGOCIO.md) |

## Convenciones añadidas, distintas de decisiones recibidas

URG-GOV-026 registra permanencia [0,12), [12,24), [24,48), [48,72], >72; retorno (0,24], (24,48], (48,72), último límite impuesto por <72. Referencia hasta 48 inclusiva, anclaje móvil, últimos N días y redondeo más cercano son propuestas documentales explícitas, no evidencia SQL ni decisiones institucionales inferidas. Atenciones, denominador diario, cohorte permanencia y tasas/conteos permanecen candidatos.

## Destino de los 28 candidatos

| ID anterior | Nombre anterior | Acción | Destino | Estado |
|---|---|---|---|---|
| URG-CAND-OP-01 | ingresos | AMPLIAR | URG-EJ-01 / URG-MOD-01 | No oficializado; estado en destino |
| URG-CAND-OP-02 | egresos | AMPLIAR | URG-MOD-01 (U-EGR separado) | No oficializado; estado en destino |
| URG-CAND-OP-03 | abiertos y activos probables | AMPLIAR | URG-ACT-01 / URG-CAL-02 | No oficializado; estado en destino |
| URG-CAND-OP-04 | abiertos por antigüedad | MODIFICAR | URG-ACT-02 | No oficializado; estado en destino |
| URG-CAND-OP-05 | localización, servicio, destino y motivo de alta | AMPLIAR | URG-MOD-05 / URG-ACT-02 / URG-R09 | No oficializado; estado en destino |
| URG-CAND-OP-06 | flujo y tiempos entre etapas | AMPLIAR | URG-PEND-01 / URG-CAL-01 | No oficializado; estado en destino |
| URG-CAND-OP-07 | permanencia | MODIFICAR | URG-EJ-03 / URG-MOD-02 | No oficializado; estado en destino |
| URG-CAND-OP-08 | reingresos | MODIFICAR | URG-EJ-05 / URG-MOD-03 | No oficializado; estado en destino |
| URG-CAND-OP-09 | inconsistencias | CONSERVAR | URG-CAL-02 | No oficializado; estado en destino |
| URG-CAND-OP-10 | tendencias y comparación | AMPLIAR | URG-MOD-01 / URG-R08 | No oficializado; estado en destino |
| URG-CAND-POB-01 | pacientes únicos y episodios | AMPLIAR | URG-EJ-06 / URG-MOD-06 | No oficializado; estado en destino |
| URG-CAND-POB-02 | sexo | AMPLIAR | URG-MOD-06 | No oficializado; estado en destino |
| URG-CAND-POB-03 | edad y grupos de edad | MODIFICAR | URG-MOD-06 | No oficializado; estado en destino |
| URG-CAND-POB-04 | estado, municipio y localidad | AMPLIAR | URG-MOD-06 | No oficializado; estado en destino |
| URG-CAND-POB-05 | cobertura de población | CONSERVAR | URG-CAL-01 | No oficializado; estado en destino |
| URG-CAND-DES-01 | ingreso → triage | AMPLIAR | URG-PEND-01 | No oficializado; estado en destino |
| URG-CAND-DES-02 | ingreso → atención | AMPLIAR | URG-PEND-01 | No oficializado; estado en destino |
| URG-CAND-DES-03 | atención → alta médica | AMPLIAR | URG-PEND-01 | No oficializado; estado en destino |
| URG-CAND-DES-04 | ingreso → egreso / permanencia | MODIFICAR | URG-EJ-03 / URG-MOD-02 | No oficializado; estado en destino |
| URG-CAND-DES-05 | permanencia >12 h | AMPLIAR | URG-PEND-02 | No oficializado; estado en destino |
| URG-CAND-DES-06 | permanencia >24 h | AMPLIAR | URG-PEND-02 / URG-ACT-02 (otra unidad) | No oficializado; estado en destino |
| URG-CAND-DES-07 | reingreso <24 h | MODIFICAR | URG-MOD-03 (banda hasta24, no KPI principal) | No oficializado; estado en destino |
| URG-CAND-DES-08 | reingreso <72 h | MODIFICAR | URG-EJ-05 / URG-MOD-03 | No oficializado; estado en destino |
| URG-CAND-DES-09 | secuencias temporales inconsistentes | CONSERVAR | URG-CAL-02 | No oficializado; estado en destino |
| URG-CAND-DES-10 | abiertos de antigüedad elevada | MODIFICAR | URG-ACT-02 | No oficializado; estado en destino |
| URG-CAND-DES-11 | cobertura de triage | CONSERVAR | URG-CAL-01 / URG-MOD-04 | No oficializado; estado en destino |
| URG-CAND-DES-12 | cobertura de atención | CONSERVAR | URG-CAL-01 | No oficializado; estado en destino |
| URG-CAND-DES-13 | cobertura de egreso | CONSERVAR | URG-CAL-01 | No oficializado; estado en destino |

## Matriz de los 32 archivos originales

Versiones anteriores fijadas al SHA; no se borra silenciosamente una regla.

| Archivo/antecedente | Anterior | Acción documental | Nueva versión | Motivo |
|---|---|---|---|---|
| [.gitignore](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/.gitignore) | Baseline documental 717f681 | CONSERVAR | [Versión local](../../.gitignore) | Conservar evidencia/comprobador |
| [README.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/README.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../README.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [config/README.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/config/README.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../config/README.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [config/adopcion-hcg.json](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/config/adopcion-hcg.json) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../config/adopcion-hcg.json) | Actualizar vigencia/contexto, sin atribuir SQL |
| [config/baseline.json](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/config/baseline.json) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../config/baseline.json) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/00_LEEME_PRIMERO.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/00_LEEME_PRIMERO.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/00_LEEME_PRIMERO.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/CONTRATO_UX_FUNCIONAL.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/CONTRATO_UX_FUNCIONAL.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/CONTRATO_UX_FUNCIONAL.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/DESCUBRIMIENTOS_Y_LIMITACIONES.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/DESCUBRIMIENTOS_Y_LIMITACIONES.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/DESCUBRIMIENTOS_Y_LIMITACIONES.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/REGLAS_NEGOCIO.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/REGLAS_NEGOCIO.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/diccionarios/DICCIONARIO_vUrgencias.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/diccionarios/DICCIONARIO_vUrgencias.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/diccionarios/DICCIONARIO_vUrgencias.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/diccionarios/FUENTES_Y_GRANULARIDAD.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/diccionarios/FUENTES_Y_GRANULARIDAD.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/diccionarios/FUENTES_Y_GRANULARIDAD.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/evidencia/BENCHMARKS_VIGENTES.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/evidencia/BENCHMARKS_VIGENTES.md) | Baseline documental 717f681 | AMPLIAR | [Versión local](../../docs/evidencia/BENCHMARKS_VIGENTES.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/evidencia/CASOS_PATRON_VIGENTES.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/evidencia/CASOS_PATRON_VIGENTES.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/evidencia/CASOS_PATRON_VIGENTES.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/evidencia/MANIFIESTO_VALIDACION.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/evidencia/MANIFIESTO_VALIDACION.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/evidencia/MANIFIESTO_VALIDACION.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/evidencia/PLAN_VALIDACION.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/evidencia/PLAN_VALIDACION.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/evidencia/PLAN_VALIDACION.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/evidencia/README.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/evidencia/README.md) | Baseline documental 717f681 | AMPLIAR | [Versión local](../../docs/evidencia/README.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/evidencia/VALIDACION_DOCUMENTAL.json](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/evidencia/VALIDACION_DOCUMENTAL.json) | Baseline documental 717f681 | CONSERVAR | [Versión local](../../docs/evidencia/VALIDACION_DOCUMENTAL.json) | Conservar evidencia/comprobador |
| [docs/gobierno/ADOPCION_HCG.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/gobierno/ADOPCION_HCG.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/gobierno/ADOPCION_HCG.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/gobierno/CATALOGO_FUNCIONAL.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/gobierno/CATALOGO_FUNCIONAL.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/gobierno/CATALOGO_FUNCIONAL.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/gobierno/DECISIONES_Y_CAMBIOS.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/gobierno/DECISIONES_Y_CAMBIOS.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/gobierno/DECISIONES_Y_CAMBIOS.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/gobierno/ESTADO_PROYECTO.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/gobierno/ESTADO_PROYECTO.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/gobierno/ESTADO_PROYECTO.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/gobierno/PROCEDENCIA.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/gobierno/PROCEDENCIA.md) | Baseline documental 717f681 | AMPLIAR | [Versión local](../../docs/gobierno/PROCEDENCIA.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/gobierno/REGLAS_Y_CRITERIOS.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/gobierno/REGLAS_Y_CRITERIOS.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/gobierno/REGLAS_Y_CRITERIOS.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/gobierno/TRAZABILIDAD.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/gobierno/TRAZABILIDAD.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/gobierno/TRAZABILIDAD.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/historico/checkpoints/README.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/historico/checkpoints/README.md) | Baseline documental 717f681 | AMPLIAR | [Versión local](../../docs/historico/checkpoints/README.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/historico/prompts/README.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/historico/prompts/README.md) | Baseline documental 717f681 | AMPLIAR | [Versión local](../../docs/historico/prompts/README.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/historico/prompts/SOLICITUD_BASELINE.txt](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/historico/prompts/SOLICITUD_BASELINE.txt) | Baseline documental 717f681 | CONSERVAR | [Versión local](../../docs/historico/prompts/SOLICITUD_BASELINE.txt) | Conservar evidencia/comprobador |
| [docs/indicadores/00_CATALOGO_INDICADORES.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/indicadores/00_CATALOGO_INDICADORES.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/indicadores/00_CATALOGO_INDICADORES.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [docs/indicadores/01_CONVENCIONES_Y_REGLAS_COMUNES.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/indicadores/01_CONVENCIONES_Y_REGLAS_COMUNES.md) | Baseline documental 717f681 | MODIFICAR | [Versión local](../../docs/indicadores/01_CONVENCIONES_Y_REGLAS_COMUNES.md) | Actualizar vigencia/contexto, sin atribuir SQL |
| [scripts/README.md](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/scripts/README.md) | Baseline documental 717f681 | CONSERVAR | [Versión local](../../scripts/README.md) | Conservar evidencia/comprobador |
| [scripts/check-baseline.mjs](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/scripts/check-baseline.mjs) | Baseline documental 717f681 | CONSERVAR | [Versión local](../../scripts/check-baseline.mjs) | Conservar evidencia/comprobador |
| [scripts/check-markdown-links.mjs](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/scripts/check-markdown-links.mjs) | Baseline documental 717f681 | CONSERVAR | [Versión local](../../scripts/check-markdown-links.mjs) | Conservar evidencia/comprobador |

## No importar de CEX

No n_solic, estados/códigos de finalización, capacidad, D01–D05, jerarquía agendas, metas, filtros/exclusiones ni fórmulas clínicas. Arquitectura sólo como referencia transversal válida. HCG mantiene 71 principios sin promoción multidominio. Claves físicas, joins y antecedente requieren SQL. Responsables y preguntas en [limitaciones](../DESCUBRIMIENTOS_Y_LIMITACIONES.md).
