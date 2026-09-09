# Diccionario semántico — dbo.vUrgencias

Versión: 2026-09-08.1. Fuente física principal: `dbo.vUrgencias`. Los tipos no incluidos en evidencia versionada se declaran `NO DOCUMENTADO`; deben verificarse con el script estructural antes de asumir conversiones.

| Campo físico | Tipo | Fuente | Semántica | Uso analítico | Rol | NULL | Relaciones/equivalencias | Limitaciones | Indicadores consumidores |
|---|---|---|---|---|---|---|---|---|---|
| id_urgencia | NO DOCUMENTADO | vUrgencias / urgencias | Atención de Urgencias | Identidad y conteo | CANÓNICO | No esperado | urgencias.id_urgencia_pk; alias folio | La vista puede repetirlo | Todos |
| codigo_cliente | NO DOCUMENTADO | vUrgencias | Identidad longitudinal del paciente | Distintos y reingresos | CANÓNICO | Posible | No equivale a registro | No fabricar identidad | EJ-05/06/07, MOD-09 |
| epis_pk | NO DOCUMENTADO | vUrgencias / episodios | Episodio XHIS asociado | Trazabilidad | AUXILIAR | Sí, observado | alias foliounico | No identifica el evento canónico | Auditoría |
| registro | NO DOCUMENTADO | vUrgencias / vsegpop | Identificador administrativo enriquecido | Auditoría | AUXILIAR | Posible | No equivale a codigo_cliente | Puede multiplicar filas | Calidad |
| Fechaing | NO DOCUMENTADO | vUrgencias | Registro de ingreso a Urgencias | Eje temporal y duraciones | CANÓNICO | Posible | casing fechaing no crea otro campo | Zona/precisión no documentadas | EJ-01..07, ACT-01, MOD-01/05/09, TRI-01..03 |
| fechaegr | NO DOCUMENTADO | vUrgencias | Egreso administrativo | Completados y permanencia | CANÓNICO | Sí | Fin registrado del evento | Nulo no basta para activo | EJ-03/04/05, ACT-01 |
| fechatri | NO DOCUMENTADO | vUrgencias | Timestamp de registro de Triage | Cobertura y tiempo registrado | CANÓNICO PARA TIEMPO TRIAGE | Sí | Diferente de triage_fecha | Captura heterogénea | TRI-01/03 |
| triage_fecha | NO DOCUMENTADO | vUrgencias | Fecha calendario de Triage a 00:00 | Cobertura descriptiva | AUXILIAR | Sí | No equivale a fechatri | No usar para intervalos | Auditoría Triage |
| triage_pk | NO DOCUMENTADO | vUrgencias / triage | Clave de registro/catálogo Triage | Relación y auditoría | AUXILIAR | Sí | Relación física por verificar | No asumir nivel | Triage |
| triage_codigo | NO DOCUMENTADO | vUrgencias | Código de clasificación 1–6 | Distribución nativa | CANÓNICO | Sí | Se acompaña de triage_desc | No homologar | TRI-02 |
| triage_desc | NO DOCUMENTADO | vUrgencias | Descripción nativa de Triage | Etiqueta humana | CANÓNICO | Sí | Depende de triage_codigo | Variantes auditables | TRI-02 |
| categoria_triage | NO DOCUMENTADO | vUrgencias | Categoría complementaria comunicada | Auditoría | AUXILIAR | Sí | No equiparar a nivel | Semántica pendiente | Triage |
| login_triage | NO DOCUMENTADO | vUrgencias | Login de captura Triage | Auditoría autorizada | AUXILIAR SENSIBLE | Sí | Puede relacionarse con usuario_triage | No exponer en agregado/logs | Auditoría |
| usuario_triage | NO DOCUMENTADO | vUrgencias | Usuario asociado a Triage | Auditoría autorizada | AUXILIAR SENSIBLE | Sí | No sustituye personal médico | Privacidad | Auditoría |
| fechaate | NO DOCUMENTADO | vUrgencias | Inicio registrado de atención médica | Tiempo complementario | CANÓNICO PROPUESTO | Sí | derivado preferido frente a atencion_fecha | Contrato EN PROCESO | PEND-01 |
| atencion_fecha | NO DOCUMENTADO | vUrgencias | Fuente/equivalente comunicado de atención | Auditoría | AUXILIAR | Sí | Equivalencia con fechaate pendiente | No sustituir automáticamente | PEND-01 |
| fechamed | NO DOCUMENTADO | vUrgencias | Alta médica registrada | Hito independiente | CANÓNICO PROPUESTO | Sí | derivado preferido frente a altamed_fecha | EN VALIDACIÓN; no implementar | PEND-02 |
| altamed_fecha | NO DOCUMENTADO | vUrgencias | Fuente/equivalente comunicado de alta | Auditoría | AUXILIAR | Sí | Equivalencia con fechamed pendiente | No sustituir automáticamente | PEND-02 |
| destino_urg_pk | NO DOCUMENTADO | vUrgencias | Clave destino institucional | Resolución y hospitalización | CANÓNICO | Sí | 5=HOSP. PISO; 99=N.E. | No reagrupar irreversiblemente | EJ-04, MOD-05 |
| destino_urgencias | NO DOCUMENTADO | vUrgencias | Descripción nativa de destino | Etiqueta/categoría | CANÓNICO | Sí | Depende de destino_urg_pk | Variantes auditables | MOD-05, detalle |
| motivo_alta_pk | NO DOCUMENTADO | vUrgencias | Clave de motivo de alta | Activo probable/resolución separada | CANÓNICO | Sí | Distinto de destino | No fusionar | ACT-01 |
| motivo_alta | NO DOCUMENTADO | vUrgencias / motivos_alta_ing | Descripción de motivo | Detalle/resolución separada | AUXILIAR | Sí | motivo_alta_desc expuesto por vista | No inferir destino | Detalle |
| codigo_servicio_ingreso | NO DOCUMENTADO | vUrgencias | Servicio del ingreso | Universo, filtros y reingreso | CANÓNICO | Posible | une con servicios.codigo_servicio y cod_centro | Validar fan-out | Todos |
| cod_centro | NO DOCUMENTADO | vUrgencias | Clave de centro | Unión de catálogo | CANÓNICO | Posible | une con servicios/centros | No hardcodear | Todos |
| fecha_modif | NO DOCUMENTADO | vUrgencias | Modificación técnica | Auditoría | AUXILIAR | Posible | NO APLICA como fecha clínica | Nunca eje de KPI | Calidad |
| fecha_nac | NO DOCUMENTADO | vUrgencias | Nacimiento | Edad al evento futura | AUXILIAR | Sí | Contrastar con edades expuestas | Fechas imposibles posibles | PEND-04 |
| edadaños | NO DOCUMENTADO | vUrgencias | Edad comunicada en años | Grupo etario futuro | AUXILIAR | Sí | Precisión/fecha de cálculo pendiente | No recalcular al presente | PEND-04 |
| EdadMeses | NO DOCUMENTADO | vUrgencias | Edad comunicada en meses | Pediatría futura | AUXILIAR | Sí | Unidad/componente por validar | No sumar sin semántica | PEND-04 |
| EdadDias | NO DOCUMENTADO | vUrgencias | Edad comunicada en días | Pediatría futura | AUXILIAR | Sí | Unidad/componente por validar | No sumar sin semántica | PEND-04 |
| motivo_urgencia | NO DOCUMENTADO | vUrgencias | Motivo categórico comunicado | Clínica futura | AUXILIAR | Sí | Catálogo pendiente | POR DEFINIR | PEND-06 |
| motivo_urg_libre | NO DOCUMENTADO | vUrgencias | Texto libre de motivo | Búsqueda/detalle autorizado | AUXILIAR SENSIBLE | Sí | NO APLICA para ranking ejecutivo | Privacidad | PEND-06 |
| cdiag_ing / diag_ing | NO DOCUMENTADO | vUrgencias | Diagnóstico de ingreso | Clínica futura | AUXILIAR | Sí | Código/descripción | POR DEFINIR | PEND-05 |
| cdiag_egr / diag_egr | NO DOCUMENTADO | vUrgencias | Diagnóstico de egreso | Clínica futura | AUXILIAR | Sí | Código/descripción | POR DEFINIR | PEND-05 |

## Campos no identificados inequívocamente

Sexo, estado, municipio, localidad, médico, localización, cama, usuarios de registro/egreso, seguridad social, pagador y origen siguen sin nombre físico inequívoco versionado. No inventar columnas ni reutilizar campos de Triage.
