# Diccionario funcional — vUrgencias

Evidencia: [contexto 2026-09-07](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). Existencia comunicada; no inspección física. Para TODOS los campos: tipo físico, longitud, nulabilidad, cardinalidad y unicidad **PENDIENTES DE VALIDACIÓN SQL**. No asignar tipos por nombre.

| Campo comunicado | Semántica/uso | Validación adicional |
|---|---|---|
| epis_pk | Episodio expuesto | Unicidad y relación id_urgencia |
| id_urgencia | Registro de Urgencias | Cardinalidad y ámbito |
| codigo_cliente | Paciente longitudinal candidato | Estabilidad y ámbito entre centros |
| registro | Identificador clínico/administrativo | Formato y alcance |
| foliounico | Identificador adicional | Semántica/cardinalidad |
| Fechaing | Registro del paciente | Casing, precisión, zona |
| fechatri | Registro de triage | Cobertura/precisión/zona |
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
| motivo_alta_pk | Clave motivo alta | Unión catálogo pendiente |
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
| dbo.servicios | codigo_area, serv_activo_sn, serv_ing_urg_sn | Primeros dos definen universo; tercero sólo informa; clave de unión pendiente |
| Centros, objeto por identificar | Centro/código/descripción como conceptos | No afirmar nombres físicos |
| dbo.motivos_alta_ing | motivo_alta_desc | Descripción de catálogo; futura exposición en vUrgencias, no presencia actual validada |

Clave de unión de motivos no demostrada por el nombre motivo_alta_pk de la vista. Destino y motivo separados. No se modifica la vista. [Fuentes](FUENTES_Y_GRANULARIDAD.md) · [Reglas](../REGLAS_NEGOCIO.md).
