# Trazabilidad — Urgencias

Cadena exigida: principio HCG → regla local → contrato → fuente/campos → SQL → implementación → validación/evidencia. Un vacío se declara; no se infiere.

| Elemento | Principio/regla | Contrato y fuente | SQL verificable | API/UI | Validación/evidencia |
|---|---|---|---|---|---|
| URG-EJ-01 Atenciones | HCG-ANA-001/002/005; URG-R01/02 | Contratos; vUrgencias.id_urgencia/Fechaing | URG-EJ-01 | /summary; KPI/tendencia/detalle | Tests estructurales; evidencia SQL |
| URG-EJ-02 Promedio diario | HCG-TEM-001/007; URG-R02 | Contratos; Fechaing/cutoff | URG-EJ-02 | /summary; KPI/periodo parcial | Build/tests; DB aplicación pendiente |
| URG-EJ-03 Permanencia | HCG-CAL-005/006/009; URG-R04/05 | Contratos; Fechaing/fechaegr | URG-EJ-03 | /summary,/episodes | Casos patrón; DB aplicación pendiente |
| URG-EJ-04 Hospitalización | HCG-ANA-002/003; URG-R11 | Contratos; destino_urg_pk | URG-EJ-04 | /summary; KPI | Caso destino 5; DB aplicación pendiente |
| URG-EJ-05 Reingresos | HCG-ANA-003/009; URG-R06 | Contratos; evento/paciente/servicio/fechas | URG-EJ-05 | /summary; KPI <72/<48 | R07B v2 y fronteras |
| URG-EJ-06 Pacientes únicos | HCG-ANA-001/007; URG-R07 | Contratos; codigo_cliente | URG-EJ-06 | /summary; KPI | Evidencia de identidad |
| URG-EJ-07 Atenciones/paciente | HCG-ANA-002/003; URG-R01/07 | Contratos; evento/paciente | URG-EJ-07 | /summary; contexto KPI | Build/tests; DB aplicación pendiente |
| URG-ACT-01 Activos probables | HCG-TEM-002/005; URG-R03 | Contratos; Fechaing/fechaegr/motivo | URG-ACT-01 | /summary; indicador separado | Evidencia SQL mutable |
| URG-MOD-01 Demanda | HCG-ANA-005; URG-R02/09/12 | Contratos; Fechaing/servicios | URG-MOD-01 | /demand; tendencia/servicios | Suma debe reconciliar con EJ-01 |
| URG-MOD-05 Resolución | HCG-CAL-001/003; URG-R11 | Contratos; destino nativo | URG-MOD-05 | Destino en /episodes; módulo pendiente | SQL no ejecutado |
| URG-MOD-09 Frecuentación | HCG-ANA-011; URG-R07 | Contratos; paciente/evento | URG-MOD-09 | API/UI pendientes | SQL no ejecutado |
| URG-TRI-01 Cobertura | HCG-CAL-005/008; URG-R10 | Contratos; fechatri | URG-TRI-01 | /triage; cobertura | Benchmark 9.41% aproximado |
| URG-TRI-02 Clasificación | HCG-UX-012; URG-R10 | Contratos; triage_codigo/desc | URG-TRI-02 | API/UI pendientes | SQL no ejecutado |
| URG-TRI-03 Tiempo Triage | HCG-CAL-006/009; URG-R04/10 | Contratos; Fechaing/fechatri | URG-TRI-03 | /triage; resumen | DB aplicación pendiente |
| URG-CAL-01 Calidad | HCG-CAL-001..009; URG-R01/04 | Reglas; campos de cada universo | Asociada a cada SQL | Señales en summary/triage/detalle | Casos patrón y pruebas |
| URG-PEND-01 Atención médica | HCG-TRZ-001; URG-R04 | Fechaing/fechaate | NO APLICA: estado EN PROCESO | No implementado | Evidencia funcional pendiente |
| URG-PEND-02 Alta médica | HCG-TRZ-001; URG-R04 | fechamed | NO APLICA: estado EN VALIDACIÓN | No implementado | No autorizada |
| URG-PEND-03..07 | Reglas locales pendientes | Estado de indicadores | NO APLICA mientras no estén aceptados | No implementado | Pendiente/diferido |

Nombres completos y rutas están en [contratos](../indicadores/CONTRATOS_ACEPTADOS.md). Casos en [evidencia](../evidencia/CASOS_PATRON_VIGENTES.md), decisiones en [bitácora](DECISIONES_Y_CAMBIOS.md) y adopción en [HCG](ADOPCION_HCG.md).
