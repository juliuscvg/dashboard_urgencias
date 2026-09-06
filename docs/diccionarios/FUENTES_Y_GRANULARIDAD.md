# Fuentes y granularidad — Urgencias

## Roles

PRIMARIA: sostiene el universo principal. COMPLEMENTARIA: cubre una carencia demostrada sin sustituirla. CORROBORATIVA: contrasta resultados. EVALUADA_NO_USADA: investigada y descartada con motivo.

| Fuente | Función autorizada | Rol | Granularidad | Claves | Temporalidad | Campos | Límites | Consumidores | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| dbo.vUrgencias / dbo.vurgencias | Inventario y análisis inicial | PRIMARIA | POR VALIDAR; fila no equivale todavía a episodio | episodio_pk candidata; id_urgencia por confirmar | Cinco hitos clínicos y modificación técnica | [Diccionario](DICCIONARIO_vUrgencias.md) | Sin consulta SQL; casing, tipos, duplicados y mutabilidad no comprobados | Operación, población, desempeño candidatos | [Solicitud](../historico/prompts/SOLICITUD_BASELINE.txt) |

No hay fuentes adicionales incorporadas ni evaluadas en esta tarea. HCG specs es referencia normativa documental y CEX es referencia metodológica; ninguno es fuente de datos de Urgencias.

## Entidad y cardinalidad

La clave funcional esperada es episodio_pk. Debe comprobarse si es única globalmente o necesita centro, si admite nulos y cuántos id_urgencia corresponden a cada episodio y viceversa. No declarar clave primaria física de una vista. La representación requiere semántica y desempate estable, según [URG-R01](../REGLAS_NEGOCIO.md).

## Incorporación dirigida

Primero validar las columnas expuestas y sus catálogos. Si falta identidad fiable, semántica de edad, historia de localización o algún evento, registrar carencia, impacto, consulta dirigida propuesta, rol y decisión antes de incorporar otra fuente. No explorar tablas/vistas indiscriminadamente ni corregir datos.
