# Catálogo funcional — Urgencias

Inventario breve. [Estados](ESTADO_INDICADORES.md) y [contratos completos](../indicadores/CONTRATOS_ACEPTADOS.md) son las fuentes canónicas; este archivo no repite fórmulas.

| ID | Elemento | Papel | Regla principal |
|---|---|---|---|
| URG-EJ-01 | Atenciones | Ejecutivo | URG-R01/R02 |
| URG-EJ-02 | Promedio diario | Ejecutivo | URG-R02 |
| URG-EJ-03 | Permanencia registrada | Ejecutivo | URG-R04/R05 |
| URG-EJ-04 | Hospitalización | Ejecutivo | URG-R11 |
| URG-EJ-05 | Reingresos <72 h / <48 h | Ejecutivo | URG-R06 |
| URG-EJ-06 | Pacientes únicos | Ejecutivo | URG-R07 |
| URG-EJ-07 | Atenciones por paciente | Ejecutivo contextual | URG-R01/R07 |
| URG-ACT-01 | Activos probables | Situación actual | URG-R03 |
| URG-MOD-01 | Demanda | Módulo | URG-R02/R09/R12 |
| URG-MOD-05 | Resolución | Módulo | URG-R11 |
| URG-MOD-09 | Frecuentación | Módulo | URG-R07 |
| URG-TRI-01 | Cobertura de Triage | Módulo | URG-R10 |
| URG-TRI-02 | Clasificación de Triage | Módulo | URG-R10 |
| URG-TRI-03 | Tiempo registrado a Triage | Módulo | URG-R04/R10 |
| URG-CAL-01 | Calidad y anomalías | Capa transversal | URG-R01/R04 |
| URG-PEND-01..07 | Atención, alta, secuencias, población, clínica y localización | Pendientes | Ver matriz de estados |

Los SQL canónicos están en `scripts/sql/indicadores/`; descubrimiento y validación exploratoria permanecen en `scripts/sql/01_*` y `02_*`.
