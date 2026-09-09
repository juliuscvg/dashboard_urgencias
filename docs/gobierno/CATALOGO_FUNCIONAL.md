# Catálogo funcional — Urgencias

Inventario vigente por papel futuro. Identidad, servicios, activos y reingresos cuentan con SQL validado; nada está implementado. Fórmulas en [reglas](../REGLAS_NEGOCIO.md); estados en [catálogo analítico](../indicadores/00_CATALOGO_INDICADORES.md).

| ID | Papel | Elemento | Universo | Regla | Estado |
|---|---|---|---|---|---|
| URG-EJ-01 | Ejecutivo | Atenciones | U-ING | URG-R01/R02 | CANDIDATO: confirmar etiqueta/unidad |
| URG-EJ-02 | Ejecutivo | Promedio diario | U-ING / días | URG-R02/R08 | CANDIDATO: días parciales y denominador |
| URG-EJ-03 | Ejecutivo | Permanencia promedio | Completados evaluables; U-ING heredado propuesto | URG-R04/R05 | DEFINIDO FUNCIONALMENTE promedio; cohorte CANDIDATO |
| URG-EJ-04 | Ejecutivo | Hospitalización | Universo resolución por cerrar | URG-R11 | CANDIDATO: conteo/tasa, cohorte y mapeo |
| URG-EJ-05 | Ejecutivo | Reingresos <72 h | U-RET | URG-R06 | CONTRATO Y SQL VALIDADOS |
| URG-EJ-06 | Ejecutivo | Pacientes únicos | Identificables U-POB | URG-R01/R07 | IDENTIDAD VALIDADA |
| URG-ACT-01 | Situación actual | Activos probables | U-ACT | URG-R03 | DEFINIDO FUNCIONALMENTE |
| URG-ACT-02 | Situación actual | Activos >24/>48/>72 h | U-ACT evaluable | URG-R03 | DEFINIDO FUNCIONALMENTE |
| URG-MOD-01 | Módulo | Demanda | U-ING; U-EGR separado | URG-R02/R09/R12 | DEFINIDO FUNCIONALMENTE |
| URG-MOD-02 | Módulo | Permanencia | Completados/abiertos separados | URG-R04/R05 | DEFINIDO FUNCIONALMENTE |
| URG-MOD-03 | Módulo | Reingresos | U-RET | URG-R06 | CONTRATO Y SQL VALIDADOS |
| URG-MOD-04 | Módulo | Triage | U-ING, cobertura por componente | URG-R10 | DEFINIDO FUNCIONALMENTE |
| URG-MOD-05 | Módulo | Resolución | U-ING o U-EGR explícito por cerrar | URG-R11 | DEFINIDO FUNCIONALMENTE dimensiones; mapeo CANDIDATO |
| URG-MOD-06 | Módulo | Población | U-POB | URG-R07 | DEFINIDO FUNCIONALMENTE grupos; precedencia edad pendiente |
| URG-MOD-07 | Módulo | Clínica y actividad asociada | Episodios del contexto | URG-R12 | DEFINIDO FUNCIONALMENTE |
| URG-MOD-08 | Módulo | Detalle/auditoría | Mismo universo/categoría | URG-R13 | DEFINIDO FUNCIONALMENTE |
| URG-CAL-01 | Cobertura/calidad | Cobertura/no evaluables | Universo de cada componente | URG-R04/R07/R10/R11 | DEFINIDO FUNCIONALMENTE |
| URG-CAL-02 | Cobertura/calidad | Inconsistencias/deuda | Universo correspondiente | URG-R01/R03/R04 | DEFINIDO FUNCIONALMENTE |
| URG-PEND-01 | Candidato | Tiempos complementarios | Pares evaluables U-ING | URG-R04/R05 | CANDIDATO secundario |
| URG-PEND-02 | Candidato | Censo retrospectivo/tasas adicionales | POR DEFINIR | URG-R03/R05/R06 | CANDIDATO |

## Límites

Sólo reconciliación documental/funcional. Sin frontend/backend/conexión SQL/consultas productivas/ETL/API/caché. Navegación, catálogos, filtros, privacidad y arquitectura son contratos futuros. [Origen de candidatos](RECONCILIACION_BASELINE_717f681.md).
