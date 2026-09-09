# Fuentes y granularidad — Urgencias

| Fuente | Función autorizada | Rol | Granularidad | Claves | Temporalidad | Campos principales | Límites | Consumidores | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| dbo.vUrgencias | Eventos y atributos de Urgencias | PRIMARIA | Fila física; puede repetir evento | id_urgencia, codigo_cliente, codigo_servicio_ingreso, cod_centro | Fechaing, fechaegr y hitos | Ver diccionario | Contar evento, no fila; no modificar vista | Todos | Validación SQL 2026-09-08 |
| dbo.servicios | Delimitar y etiquetar servicios aplicables | COMPLEMENTARIA | Servicio | codigo_servicio + cod_centro | Vigencia actual por serv_activo_sn | servicio, codigo_area, serv_activo_sn | Área 2 y activo; serv_ing_urg_sn sólo informa | Universo/filtros/demanda | Corrida con control de fan-out |
| dbo.centros | Etiquetar centro | COMPLEMENTARIA | Centro | cod_centro | Vigencia no documentada | centro_siglas | No hardcodear; relación por catálogo | Universo/filtros | Definición física validada |
| dbo.motivos_alta_ing | Enriquecer motivo de alta | DEPENDENCIA DE VISTA | Motivo | motivo_alta_pk | NO APLICA | motivo_alta_desc | Distinto de destino | Detalle/resolución | Definición de vista |
| dbo.vsegpop | Enriquecimiento administrativo | DEPENDENCIA DE VISTA | Puede haber varias filas activas por paciente | codigo_cliente, registro | activa_sn | registro | Fan-out observado; no elegir fila arbitraria | Calidad | Validación SQL 2026-09-08 |

La entidad analítica es el evento `id_urgencia`. `codigo_cliente` es paciente longitudinal y `epis_pk` es episodio XHIS asociado. Una fuente nueva requiere carencia explícita, rol, claves, efecto de cardinalidad y decisión versionada. Ninguna fuente secundaria sustituye silenciosamente a `vUrgencias`.
