# Reglas y criterios — Urgencias

Contrato general en [reglas](../REGLAS_NEGOCIO.md), contratos completos por indicador en [contratos aceptados](../indicadores/CONTRATOS_ACEPTADOS.md), estado funcional/técnico en [estado de indicadores](ESTADO_INDICADORES.md) y sustituciones en [decisiones](DECISIONES_Y_CAMBIOS.md). Las consultas canónicas son verificables y de solo lectura; su reconciliación contra la fuente permanece pendiente de conexión DB.

| ID | Alcance | Campos/fuente | Universo | Caso diseñado |
|---|---|---|---|---|
| URG-R01 | Entidad/representación | id_urgencia evento; epis_pk XHIS; codigo_cliente paciente | U-ING/U-POB | URG-CP-01/R2 |
| URG-R02 | Eventos/ventana | Fechaing; fechaegr; fechatri; derivados | Por evento | URG-CP-02/R2 |
| URG-R03 | Activos/antigüedad | fechaegr; motivo_alta_pk; Fechaing; corte | U-ACT/U-ABI | URG-CP-04/R2 |
| URG-R04 | Flujo/calidad | Cinco hitos | Pares evaluables | URG-CP-05/R2 |
| URG-R05 | Permanencia/rangos | Fechaing; fechaegr; corte | Completados/abiertos separados | URG-CP-06/R2 |
| URG-R06 | Reingreso | codigo_cliente; codigo_servicio_ingreso; fechas; antecedente más reciente | U-RET | URG-CP-08/R2 |
| URG-R07 | Población | fecha_nac; edadaños; EdadMeses; EdadDias; sexo | U-POB | URG-CP-09/R2 |
| URG-R08 | Filtros/comparaciones | Evento/dimensiones | Contexto compatible | URG-CP-12/R2 |
| URG-R09 | Servicios | codigo_area; serv_activo_sn; centros | Catálogo canónico | URG-CP-13/R2 |
| URG-R10 | Triage | fechatri; triage y responsables | Componentes separados | URG-CP-15/R2 |
| URG-R11 | Resolución | destino_urg_pk/urgencias; motivo_alta_pk/desc | Independientes | URG-CP-14/R2 |
| URG-R12 | Demanda/clínica/personal | Fechaing; motivos; diagnósticos; médico | Episodios contexto | URG-CP-16/R2 |
| URG-R13 | Portada/UX/arquitectura | Campos mínimos/contextuales | Universo origen | URG-CP-10/R2 |

Primaria vUrgencias; servicios/centros y motivos como dependencias dirigidas. Periodo semiabierto, id_urgencia unidad canónica y multiplicaciones físicas auditables. Nulos/calidad visibles sin correcciones ni exclusiones silenciosas.
