# Fuentes y granularidad — Urgencias

[Contexto vigente](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt), no consulta SQL. PRIMARIA sostiene episodios; COMPLEMENTARIA cubre carencia concreta; CORROBORATIVA contrasta sin sustituir; EVALUADA_NO_USADA documenta evaluación descartada.

| Fuente | Rol/carencia | Claves/granularidad | Temporalidad/campos | Consumidores/límites |
|---|---|---|---|---|
| dbo.vUrgencias | PRIMARIA | epis_pk/id_urgencia, representación pendiente | Fechaing/fechaegr principales; [diccionario](DICCIONARIO_vUrgencias.md) | Todos los módulos; no asumir fila=episodio |
| dbo.servicios | COMPLEMENTARIA: universo institucional | Clave de servicio y unión NO DOCUMENTADO | codigo_area=2 AND serv_activo_sn=1; serv_ing_urg_sn informativo | Centro→Servicio; vigencia histórica pendiente |
| Centros (objeto físico NO DOCUMENTADO) | COMPLEMENTARIA prevista: pertenencia, código/descripción | Claves y cardinalidad pendientes | Vigencia NO DOCUMENTADO | Catálogo dinámico incluido HCO; no inventar dbo.centros |
| dbo.motivos_alta_ing | COMPLEMENTARIA identificada: descripción motivo | Clave de unión NO DOCUMENTADO | motivo_alta_desc comunicado | Resolución/detalle; exposición futura en vista, no modificación actual |

Complementarias autorizadas documentalmente por carencias expresas, ninguna integrada/consultada. HCG y CEX son referencias documentales. No explorar toda la base.

Entidad episodio/evento, identificador expuesto epis_pk sustituye episodio_pk provisional. id_urgencia registro; codigo_cliente longitudinal candidato; registro y foliounico adicionales. Perfilar nulos, duplicados, variantes, cardinalidad bidireccional, ámbito por centro y estabilidad paciente. Fila determinista antes de derivados, sin selección arbitraria por fecha_modif.

Validar joins sin fan-out ni pérdidas silenciosas; motivos/destino independientes. Nueva fuente exige carencia, rol, impacto y decisión. [Plan](../evidencia/PLAN_VALIDACION.md).
