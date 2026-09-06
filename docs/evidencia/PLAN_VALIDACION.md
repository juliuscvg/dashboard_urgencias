# Plan de validación — Urgencias

## Secuencia y puertas de avance

1. Documental: comprobar estructura, 71 IDs únicos, clasificación de adopción y enlaces locales; conservar resultados antes del único commit.
2. Inventario SQL dirigido, pendiente: confirmar acceso de lectura autorizado y objeto exacto dbo.vUrgencias/dbo.vurgencias; consultar sólo metadatos de ese objeto (columnas/tipos/nulabilidad). No enumerar toda la base.
3. Perfilar esa vista: filas, claves nulas/distintas, multiplicidad episodio↔id_urgencia, ámbito por centro, identidad y servicio. Separar duplicados técnicos y variantes; guardar resultados agregados sin identificadores personales.
4. Verificar campos y semántica: cobertura/nulos, códigos/descripciones contradictorias, edad, residencia, localización, precisión temporal, zona y actualización. Registrar carencia concreta antes de proponer fuente adicional.
5. Perfilar tiempos: cinco hitos, pares presentes, faltantes, inversiones y ceros; abiertos por motivo y antigüedad con corte explícito. No ejecutar cambios de datos.
6. Resolver decisiones funcionales y cerrar universos, representación, límites y exclusiones. No implementar candidatos cuyo contrato continúe abierto.
7. Materializar casos sintéticos versionados con esperados independientes de la ejecución y probar fronteras, duplicados, reingresos e historia fuera del periodo. Revalidar cifras FAA únicamente con contexto recuperado y misma vista.
8. Cuando existan SQL/API/UI, contrastar las tres capas bajo el mismo contexto/snapshot o documentar mutabilidad. Ejecutar contexto persistente, detalle, paginación, estados y reintento. Capturar manifiesto por corrida y benchmark reproducible.

## Aceptación

Documentación: 0 enlaces locales rotos y 71 principios sin duplicación/omisión. Funcional: claves y fila representativa justificadas; denominadores cerrados; reconciliaciones exactas o tolerancia aprobada; anomalías visibles; 24 h subconjunto de 72 h cuando aplique; ningún histórico presentado como actual. Un PASS técnico no valida indicadores.

## Estado

Sólo la fase documental se ejecuta en esta tarea. SQL, API, UI, rendimiento y validación institucional: NO EJECUTADOS. Consultas concretas se escribirán tras confirmar esquema; no se inventan columnas. Responsables de negocio/datos/QA: NO DOCUMENTADO, por asignar.
