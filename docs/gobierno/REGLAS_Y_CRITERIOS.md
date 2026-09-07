# Reglas y criterios — Urgencias

Contrato en [reglas](../REGLAS_NEGOCIO.md), sustituciones en [decisiones](DECISIONES_Y_CAMBIOS.md). Decisiones del contexto DEFINIDAS FUNCIONALMENTE, subcontratos candidatos señalados; aplicación a datos PENDIENTE DE VALIDACIÓN SQL.

| ID | Alcance | Campos/fuente | Universo | Caso diseñado |
|---|---|---|---|---|
| URG-R01 | Entidad/representación | epis_pk; id_urgencia; codigo_cliente; registro; foliounico | U-ING/U-POB | URG-CP-01/R2 |
| URG-R02 | Eventos/ventana | Fechaing; fechaegr; fechatri; derivados | Por evento | URG-CP-02/R2 |
| URG-R03 | Activos/antigüedad | fechaegr; motivo_alta_pk; Fechaing; corte | U-ACT/U-ABI | URG-CP-04/R2 |
| URG-R04 | Flujo/calidad | Cinco hitos | Pares evaluables | URG-CP-05/R2 |
| URG-R05 | Permanencia/rangos | Fechaing; fechaegr; corte | Completados/abiertos separados | URG-CP-06/R2 |
| URG-R06 | Reingreso | codigo_cliente; servicio por mapear; fechas | U-RET | URG-CP-08/R2 |
| URG-R07 | Población | fecha_nac; edadaños; EdadMeses; EdadDias; sexo | U-POB | URG-CP-09/R2 |
| URG-R08 | Filtros/comparaciones | Evento/dimensiones | Contexto compatible | URG-CP-12/R2 |
| URG-R09 | Servicios | codigo_area; serv_activo_sn; centros | Catálogo canónico | URG-CP-13/R2 |
| URG-R10 | Triage | fechatri; triage y responsables | Componentes separados | URG-CP-15/R2 |
| URG-R11 | Resolución | destino_urg_pk/urgencias; motivo_alta_pk/desc | Independientes | URG-CP-14/R2 |
| URG-R12 | Demanda/clínica/personal | Fechaing; motivos; diagnósticos; médico | Episodios contexto | URG-CP-16/R2 |
| URG-R13 | Portada/UX/arquitectura | Campos mínimos/contextuales | Universo origen | URG-CP-10/R2 |

Primaria vUrgencias; complementarias servicios/centros por identificar/motivos sólo por carencia concreta. Periodo semiabierto, episodio unidad y representación determinista pendiente. Nulos/calidad visibles sin correcciones ni exclusiones silenciosas.
