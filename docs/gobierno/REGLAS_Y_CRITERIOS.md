# Reglas y criterios — Urgencias

El contrato reproducible reside en [Reglas de negocio](../REGLAS_NEGOCIO.md). Evidencia inicial: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), no consulta SQL.

| ID | Alcance | Unidad/universo | Fuente/campos | Nulos/calidad | Clasificación | Evidencia |
|---|---|---|---|---|---|---|
| URG-R01 | Entidad y representación | Episodio / filas | vUrgencias: episodio_pk; id_urgencia | Conservar y cuantificar; ver regla | ESPECÍFICA / inicial, POR VALIDAR | [Contrato](../REGLAS_NEGOCIO.md) |
| URG-R02 | Universos y periodo | U-ING/U-EGR/U-ABI/U-POB/U-RET | vUrgencias: fechaing; fechaegr | Conservar y cuantificar; ver regla | ESPECÍFICA / inicial, POR VALIDAR | [Contrato](../REGLAS_NEGOCIO.md) |
| URG-R03 | Estado y antigüedad | Abiertos observados | vUrgencias: fechaegr; motivo_alta_pk; fechaing | Conservar y cuantificar; ver regla | ESPECÍFICA / inicial, POR VALIDAR | [Contrato](../REGLAS_NEGOCIO.md) |
| URG-R04 | Flujo y calidad | Pares de eventos en U-ING | vUrgencias: fechaing; fechatri; fechaate; fechamed; fechaegr | Conservar y cuantificar; ver regla | ESPECÍFICA / inicial, POR VALIDAR | [Contrato](../REGLAS_NEGOCIO.md) |
| URG-R05 | Rangos descriptivos | Duraciones evaluables | vUrgencias: fechaing; fechaate; fechaegr | Conservar y cuantificar; ver regla | ESPECÍFICA / inicial, POR VALIDAR | [Contrato](../REGLAS_NEGOCIO.md) |
| URG-R06 | Reingreso | U-RET | vUrgencias: Identidad/servicio POR VALIDAR; fechaing; fechaegr | Conservar y cuantificar; ver regla | ESPECÍFICA / inicial, POR VALIDAR | [Contrato](../REGLAS_NEGOCIO.md) |
| URG-R07 | Población | U-POB / pacientes identificables | vUrgencias: codigo_cliente; sexo; edad; residencia POR VALIDAR | Conservar y cuantificar; ver regla | ESPECÍFICA / inicial, POR VALIDAR | [Contrato](../REGLAS_NEGOCIO.md) |
| URG-R08 | Filtros y comparación | Universo correspondiente | vUrgencias: Centro/servicio/localización POR VALIDAR | Conservar y cuantificar; ver regla | ESPECÍFICA / inicial, POR VALIDAR | [Contrato](../REGLAS_NEGOCIO.md) |

## Periodo y deduplicación

Evento según universo; periodo semiabierto. Episodio como entidad esperada. Fila representativa y desempates POR VALIDAR mediante inventario dirigido. No promover reglas específicas a transversales.
