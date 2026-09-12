# Diccionario semántico — dbo.vUrgencias

Versión: 2026-09-11.1. Fuente física principal: `dbo.vUrgencias`. Los tipos no incluidos en evidencia versionada se declaran `NO DOCUMENTADO`; deben verificarse con el script estructural antes de asumir conversiones.

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
| fechaate | datetime, nullable | vUrgencias; origen base POR DEFINIR | Hito registrado de Atención médica | Cobertura y tiempo registrado desde Ingreso | CANÓNICO | Sí; ausencia no excluye U-ING | No equivale ni se completa desde atencion_fecha | 88.0736% 36m; extremos e inversiones con otros hitos se preservan | URG-ATE-01 |
| atencion_fecha | NO DOCUMENTADO | vUrgencias | Fuente/equivalente comunicado de atención | Auditoría | AUXILIAR | Sí | Equivalencia con fechaate POR DEFINIR | No sustituir automáticamente | URG-ATE-01 |
| fechamed | datetime, nullable | vUrgencias | Hito registrado de Alta Médica | Hito independiente | CANÓNICO PROPUESTO CON EVIDENCIA | Sí | No equivale a altamed_fecha; no sustituye fechaegr | EN VALIDACIÓN; no implementar | PEND-02 |
| altamed_fecha | datetime, nullable | vUrgencias | Fecha auxiliar de Alta Médica observada a medianoche | Auditoría | AUXILIAR | Sí | No equivale a fechamed; no sustituir | No completa ni normaliza fechamed | PEND-02 |
| destino_urg_pk | NO DOCUMENTADO | vUrgencias | Clave destino institucional | Resolución y hospitalización | CANÓNICO | Sí | 5=HOSP. PISO; 99=N.E. | No reagrupar irreversiblemente | EJ-04, MOD-05 |
| destino_urgencias | NO DOCUMENTADO | vUrgencias | Descripción nativa de destino | Etiqueta/categoría | CANÓNICO | Sí | Depende de destino_urg_pk | Variantes auditables | MOD-05, detalle |
| motivo_alta_pk | NO DOCUMENTADO | vUrgencias | Clave de motivo de alta | Activo probable/resolución separada | CANÓNICO | Sí | Distinto de destino | No fusionar | ACT-01 |
| motivo_alta | NO DOCUMENTADO | vUrgencias / motivos_alta_ing | Descripción de motivo | Detalle/resolución separada | AUXILIAR | Sí | motivo_alta_desc expuesto por vista | No inferir destino | Detalle |
| codigo_servicio_ingreso | NO DOCUMENTADO | vUrgencias | Servicio del ingreso | Universo, filtros y reingreso | CANÓNICO | Posible | une con servicios.codigo_servicio y cod_centro | Validar fan-out | Todos |
| cod_centro | NO DOCUMENTADO | vUrgencias | Clave de centro | Unión de catálogo | CANÓNICO | Posible | une con servicios/centros | No hardcodear | Todos |
| fecha_modif | NO DOCUMENTADO | vUrgencias | Modificación técnica | Auditoría | AUXILIAR | Posible | NO APLICA como fecha clínica | Nunca eje de KPI | Calidad |
| fecha_nac | datetime, nullable | vUrgencias | Nacimiento | Edad al evento | CANÓNICO PROPUESTO CON EVIDENCIA | Sí | Calcular respecto de Fechaing | Posterior a ingreso no evaluable | PEND-04 |
| edadaños | int, nullable | vUrgencias | Edad comunicada en años | Contraste de edad | AUXILIAR | Sí | No precede fecha_nac/Fechaing | Discordancias auditables | PEND-04 |
| EdadMeses | NO DOCUMENTADO | vUrgencias | Edad comunicada en meses | Pediatría futura | AUXILIAR | Sí | Unidad/componente por validar | No sumar sin semántica | PEND-04 |
| EdadDias | NO DOCUMENTADO | vUrgencias | Edad comunicada en días | Pediatría futura | AUXILIAR | Sí | Unidad/componente por validar | No sumar sin semántica | PEND-04 |
| motivo_urgencia | varchar(60), nullable | vUrgencias; origen base POR DEFINIR | Categoría nativa del motivo registrado | Distribución descriptiva | CANÓNICO PROPUESTO CON EVIDENCIA | Sí; vacío = sin dato | Coexiste con motivo_urg_libre; no equivalente | 100% 12/24/36m; 15 categorías; no inferir gravedad/diagnóstico | URG-MOT-01/03 |
| motivo_urg_libre | varchar(60), nullable | vUrgencias; origen base POR DEFINIR | Texto complementario del motivo registrado | Búsqueda/detalle autorizado futuro | AUXILIAR SENSIBLE | Sí; vacío = ausente | No equivale ni completa motivo_urgencia | Cobertura 13.46% 36m; alta cardinalidad; privacidad | URG-MOT-02/03 |
| cdiag_ing / diag_ing | NO DOCUMENTADO | vUrgencias | Diagnóstico de ingreso, código y descripción nativos | Clínica futura | CANÓNICO PROPUESTO CON EVIDENCIA | Sí | Prácticamente 1:1 código↔descripción; independiente de egreso | EN VALIDACIÓN; no implementar; no inferir CIE/familia/severidad | PEND-05 |
| cdiag_egr / diag_egr | NO DOCUMENTADO | vUrgencias | Diagnóstico de egreso, código y descripción nativos | Clínica futura | CANÓNICO PROPUESTO CON EVIDENCIA | Sí | No 1:1 (507 códigos con 2–4 descripciones); `diag_egr` puede existir sin `cdiag_egr` (texto no codificado) | EN VALIDACIÓN; no implementar; no normalizar texto ni inferir CIE | PEND-05 |

## Campos no identificados inequívocamente

Sexo, estado, municipio, localidad, médico, localización, cama, usuarios de registro/egreso, seguridad social, pagador y origen siguen sin nombre físico inequívoco versionado. No inventar columnas ni reutilizar campos de Triage.

## Campo validado en ITER-006 — Atención médica

### fechaate

- Metadato físico: `datetime`, nullable, expuesto por `dbo.vUrgencias`.
- Origen: campo expuesto por la vista; tabla/campo base y derivación previa, POR DEFINIR.
- Semántica validada: timestamp canónico actual del hito registrado de Atención médica.
- Concepto/rol: hito temporal complementario; CANÓNICO PROPUESTO CON EVIDENCIA.
- NULL/conflictos: ausencia o conflicto no excluye U-ING; cero conflictos entre filas físicas del mismo evento en 12/24/36 meses.
- Población/cobertura: U-ING con valor canónico no nulo; 94.1141% / 92.7560% / 88.0736% en 12/24/36 meses.
- Cronología: `Fechaing→fechaate` tuvo cero inversiones; sólo pares no negativos son interpretables. Mismo instante y extremos se preservan.
- Relaciones: independiente de Triage, Alta Médica y Egreso; no equivale ni se completa desde `atencion_fecha`.
- Anomalías/limitaciones: predominan inversiones `fechatri→fechaate`; existen pocas inversiones hacia Alta Médica/Egreso y extremos de hasta 643,525 minutos desde Ingreso. No acredita inicio clínico real, espera, oportunidad ni presencia.
- Consumidor: URG-ATE-01; sin SQL productivo, API o UI.
- Estado/evidencia: DEFINIDO FUNCIONALMENTE / VALIDADO CON FUENTE / NO IMPLEMENTADO; [evidencia ITER-006](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.md).

## Campos validados en ITER-002 — Motivo de Urgencia

### motivo_urgencia

- Metadato físico: varchar(60), nullable, expuesto por dbo.vUrgencias.
- Origen: campo directo de la vista; tabla y campo base anteriores a la vista, POR DEFINIR.
- Semántica validada: categoría nativa del motivo registrado para el evento de Urgencias.
- Concepto/rol: caracterización categórica descriptiva; CANÓNICO PROPUESTO CON EVIDENCIA.
- NULL/vacíos: valor nulo o sólo espacios se reporta sin dato y no excluye U-ING.
- Relaciones: puede coexistir con motivo_urg_libre; no son equivalentes y ninguno completa al otro.
- Cobertura/calidad: 100% en U-ING 12/24/36 meses; 15 categorías nativas; cero conflictos por evento.
- Restricciones/anomalías: no normalizar ni agrupar; no inferir gravedad, diagnóstico, causalidad o calidad.
- Consumidores: URG-MOT-01 y URG-MOT-03; sin implementación.
- Estado/evidencia: EN VALIDACIÓN / VALIDADO CON FUENTE; [evidencia ITER-002](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md).

### motivo_urg_libre

- Metadato físico: varchar(60), nullable, expuesto por dbo.vUrgencias.
- Origen: campo directo de la vista; tabla y campo base anteriores a la vista, POR DEFINIR.
- Semántica validada: información textual complementaria del motivo registrado.
- Concepto/rol: AUXILIAR SENSIBLE; búsqueda o detalle autorizado futuro, no dimensión categórica.
- NULL/vacíos: valor nulo o sólo espacios se reporta ausente; no excluye U-ING.
- Relaciones: coexistió siempre con motivo_urgencia en las cohortes; no equivale a esa categoría ni permite inferirla.
- Cobertura/calidad: 13.61% / 12.30% / 13.46% en 12/24/36 meses; 21,443 valores distintos y 18,009 singletons en 36 meses; cero conflictos por evento. La cobertura varía por centro y servicio.
- Restricciones/anomalías: no versionar valores, normalizar, clasificar, usar en rankings ni inferir contenido clínico. Longitud máxima observada y física: 60.
- Consumidores: URG-MOT-02 y URG-MOT-03; sin implementación.
- Estado/evidencia: EN VALIDACIÓN / VALIDADO CON FUENTE; [evidencia ITER-002](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md).

Pendiente gobernado: reconciliar progresivamente el diccionario completo de vUrgencias conforme cada bloque funcional valide nuevos campos. diccionario_datos_vUrgencias.xlsx es antecedente documental y no sustituye evidencia canónica posterior.
