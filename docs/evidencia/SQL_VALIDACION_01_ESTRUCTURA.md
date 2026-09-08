# Evidencia SQL 01 — estructura de dbo.vUrgencias

**Estado:** PREPARADA / NO EJECUTADA
**Script:** [01_validacion_estructura_vUrgencias.sql](../../scripts/sql/01_validacion_estructura_vUrgencias.sql)
**Compatibilidad:** SQL Server 2012, nivel de compatibilidad 100
**Naturaleza:** solo lectura

## Objetivo

Obtener evidencia física dirigida sobre la vista, sus columnas, la granularidad observada, las claves candidatas, la relación entre identificadores y la cobertura básica de campos críticos. Esta fase no calcula indicadores ni cambia reglas funcionales.

## Bloques y evidencia

| Bloque | Resultado | Alcance |
|---|---|---|
| A | A01–A03 | Existencia, object_id, tipo, definición accesible y dependencias directas accesibles |
| B | B01–B02 | Metadatos de todas las columnas e inventario explícito; ausencias como NO ENCONTRADO |
| C | C01 | Volumen y cobertura de epis_pk, id_urgencia, codigo_cliente, registro y foliounico en una pasada |
| D | D01–D02 | Unicidad y hasta 100 duplicados para epis_pk e id_urgencia, por separado |
| E | E01–E02 | Cardinalidad bidireccional y hasta 100 pares que no cumplen 1:1 |
| F | F01–F03 | Perfil longitudinal de codigo_cliente y cruces descriptivos con registro y foliounico |
| G | G01–G02 | Cobertura de cinco fechas, predicados de egreso abierto y distribución por año de Fechaing |
| H | H01 | Muestra controlada de 100 filas con campos técnicos y sin columnas personales |

D, E y F contienen agrupaciones exactas que pueden consumir tiempo y memoria. G recorre la vista para cobertura y vuelve a agrupar por año. H puede requerir un ordenamiento. C concentra las cinco claves en una sola lectura. Las líneas opcionales de `STATISTICS IO/TIME` quedan comentadas.

## Decisiones que la evidencia permitirá cerrar

Los resultados permitirán confirmar el objeto y el casing físicos; tipos, precisión y nulabilidad; cobertura observada; si una fila puede aproximarse a un episodio; comportamiento de epis_pk e id_urgencia como candidatos; dirección y excepciones de su cardinalidad; y si codigo_cliente muestra estabilidad suficiente para seguir evaluándolo como identificador longitudinal. También harán visible la deuda histórica básica de egresos abiertos.

La evidencia no designa automáticamente una clave oficial, no convierte filas abiertas en censo, no prueba equivalencia entre codigo_cliente, registro y foliounico, y no autoriza cambios en reingresos, permanencia, edades, triage, destino, indicadores o reglas.

## Ejecución y formato de entrega

1. Usar una conexión autorizada y de solo lectura a la base correcta.
2. Registrar fecha y hora con zona, versión de SQL Server, nivel de compatibilidad y SHA del script.
3. Ejecutar A y B primero. Si la vista o los campos críticos no existen, conservar ese resultado y detener los bloques dependientes.
4. Ejecutar C, D, E, F, G y H por separado. Para un bloqueo o timeout, registrar bloque, hora, duración y mensaje; no alterar la consulta para ocultar el caso.
5. Pegar resultados en formato texto o cuadrícula exportada, conservando encabezados y etiquetas A01–H01. Incluir la pestaña Messages cuando se habiliten IO/TIME.
6. Entregar como mínimo A01–A03, B01–B02, C01, D01–D02 para ambas claves, E01–E02, F01–F03, G01–G02 y H01.
7. Pseudonimizar de forma consistente las claves de los TOP 100 antes de compartirlas fuera del entorno autorizado. Omitir la definición de la vista si revela infraestructura sensible.
8. No incluir nombres de pacientes, CURP, teléfonos, domicilios, credenciales ni nombres internos de servidores.

No se ejecutó SQL durante la preparación de este documento.
