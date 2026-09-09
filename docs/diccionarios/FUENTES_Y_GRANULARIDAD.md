# Fuentes y granularidad — Urgencias

[Contexto vigente](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt) y [evidencia SQL](../evidencia/VALIDACION_SQL_FUNCIONAL_2026-09-08.md). PRIMARIA sostiene eventos; DEPENDENCIA identifica enriquecimientos observados; COMPLEMENTARIA cubre una carencia concreta.

| Fuente | Rol/carencia | Claves/granularidad | Temporalidad/campos | Consumidores/límites |
|---|---|---|---|---|
| dbo.vUrgencias | PRIMARIA | id_urgencia evento canónico; fila puede multiplicarse | Fechaing/fechaegr principales; [diccionario](DICCIONARIO_vUrgencias.md) | Todos los módulos; contar identidad, no filas |
| dbo.servicios | COMPLEMENTARIA: universo institucional | Cruce validado en la corrida; mantener control de fan-out | codigo_area=2 AND serv_activo_sn=1; serv_ing_urg_sn informativo | Centro→Servicio dinámico, incluidos ceros |
| dbo.centros | DEPENDENCIA DE LA VISTA | Relación observada en la definición; controlar cardinalidad | Centro/código/descripción | Catálogo dinámico incluido HCO |
| dbo.motivos_alta_ing | DEPENDENCIA DE LA VISTA | motivo_alta_pk; unión incorporada en definición observada | motivo_alta_desc se expone como motivo_alta | Resolución/detalle; no modificar vista |
| dbo.vsegpop | DEPENDENCIA DE ENRIQUECIMIENTO | codigo_cliente; puede aportar varias filas activas | registro, activa_sn | Anomalía de representación; no elegir registro arbitrario |

Las dependencias listadas se observaron mediante la vista o consultas dirigidas. HCG y CEX siguen siendo referencias documentales. No explorar toda la base.

Entidad evento de Urgencias, identidad canónica id_urgencia. epis_pk es episodio XHIS y foliounico su alias; codigo_cliente es identidad longitudinal. Un enriquecimiento vsegpop produjo la única multiplicación observada. Las métricas agrupan por id_urgencia y conservan controles de conflicto, sin selección arbitraria por registro o fecha_modif.

Validar joins sin fan-out ni pérdidas silenciosas; motivos/destino independientes. Nueva fuente exige carencia, rol, impacto y decisión. [Plan](../evidencia/PLAN_VALIDACION.md).
