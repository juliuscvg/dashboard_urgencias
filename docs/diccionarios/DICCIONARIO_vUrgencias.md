# Diccionario funcional — vUrgencias

Evidencia funcional inicial: [contexto 2026-09-07](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). Evidencia física posterior: [validación SQL 2026-09-08](../evidencia/VALIDACION_SQL_FUNCIONAL_2026-09-08.md). La vista existe con aproximadamente 101 columnas. Los tipos y detalles físicos no reproducidos en la evidencia consolidada se consultan con el instrumento estructural; no asignar tipos por nombre.

| Campo comunicado | Semántica/uso | Validación adicional |
|---|---|---|
| epis_pk | Episodio XHIS asociado; foliounico es alias | Vínculo observado 1:1 cuando existe; 19 ausentes históricos |
| id_urgencia | Identidad canónica del evento de Urgencias; alias folio | Único/no nulo en dbo.urgencias; deduplicar semánticamente la vista |
| codigo_cliente | Identidad longitudinal analítica del paciente | Validada; conservar auditoría de cobertura y outliers |
| registro | Identificador clínico/administrativo de enriquecimiento | No usar como identidad longitudinal |
| foliounico | Identificador adicional | Semántica/cardinalidad |
| Fechaing | Registro del paciente | Casing, precisión, zona |
| fechatri | Timestamp canónico de Triage y tiempo registrado | Cobertura, precisión y zona |
| triage_fecha | Fecha calendario de Triage a las 00:00 | No usar para medir tiempos |
| fechaate | Inicio atención, datetime derivado preferido | Transformación desde atencion_fecha |
| fechamed | Alta médica, datetime derivado preferido | Transformación desde altamed_fecha |
| fechaegr | Egreso administrativo y fin evento | Cobertura/secuencia/zona |
| fecha_modif | Modificación técnica | No clínica ni KPI operativo |
| atencion_fecha | Fuente/equivalente funcional fechaate | No asumir igualdad física |
| altamed_fecha | Fuente/equivalente funcional fechamed | No asumir igualdad física |
| fecha_nac | Nacimiento | Edad al evento y fechas imposibles |
| edadaños | Edad en años comunicada | Referencia y cálculo |
| EdadMeses | Edad en meses | Totales o componente NO DOCUMENTADO |
| EdadDias | Edad en días | Totales o componente NO DOCUMENTADO |
| triage_pk | Identificador triage | Catálogo/relación episodio |
| triage_codigo | Código clasificación | Dominio/significado |
| triage_desc | Descripción clasificación | Consistencia |
| area | Área de contexto triage | No equiparar a nivel ni codigo_area de servicios |
| desc_area | Descripción área | Correspondencia |
| tipo_urgencia | Tipo comunicado | No inferir gravedad |
| login_triage | Login responsable | Cobertura/privacidad |
| usuario_triage | Usuario triage | Relación con login |
| categoria_triage | Categoría triage | Relación con nivel |
| destino_urg_pk | Clave destino | Mapeo ejecutivo |
| destino_urgencias | Descripción destino | Consistencia |
| motivo_alta_pk | Clave motivo alta | vUrgencias incorpora motivos_alta_ing |
| motivo_alta | Descripción expuesta desde motivo_alta_desc | Presencia física validada |
| motivo_urgencia | Motivo urgencia | Catálogo/granularidad |
| motivo_urg_libre | Texto libre | Sólo búsqueda/detalle autorizado |
| cdiag_ing | Código diagnóstico ingreso | Catálogo/cardinalidad |
| diag_ing | Descripción diagnóstico ingreso | Consistencia |
| cdiag_egr | Código diagnóstico egreso | Catálogo/cardinalidad |
| diag_egr | Descripción diagnóstico egreso | Consistencia |

## Nombres del baseline y conceptos pendientes

nombre, sexo, edad, centro, servicio_ingreso y tipo_ingreso fueron comunicados en la [solicitud inicial](../historico/prompts/SOLICITUD_BASELINE.txt); permanecen provisionales sin verificación física. edad no sustituye automáticamente edadaños. Fechaing/fechaing es variación de casing comunicada, no dos columnas. episodio_pk REEMPLAZADO por epis_pk; sólo conserva procedencia histórica.

Estado, municipio, localidad, médico, localización, cama, usuarios registro/egreso, seguridad social, pagador y origen: conceptos requeridos sin nombre físico inequívoco documentado. No inventar columnas ni reutilizar usuarios triage.

## Fuentes complementarias

| Fuente | Campos comunicados | Límite |
|---|---|---|
| dbo.servicios | codigo_servicio, cod_centro, servicio, codigo_area, serv_activo_sn, serv_ing_urg_sn | Los dos filtros definen universo; clave de unión validada |
| dbo.centros | cod_centro, centro_siglas | Catálogo dinámico de centro |
| Centros, objeto por identificar | Centro/código/descripción como conceptos | No afirmar nombres físicos |
| dbo.motivos_alta_ing | motivo_alta_desc | Dependencia validada; se expone como motivo_alta en vUrgencias |

Destino y motivo permanecen separados. La exposición de motivo_alta ya existe; no se modifica la vista y el mapeo ejecutivo de códigos sigue pendiente. [Fuentes](FUENTES_Y_GRANULARIDAD.md) · [Reglas](../REGLAS_NEGOCIO.md).
