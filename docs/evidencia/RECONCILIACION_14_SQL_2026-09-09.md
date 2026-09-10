# Reconciliación de los 14 SQL canónicos — 2026-09-09

## Alcance y bloqueo

- Commit base: `ba1e695b2201837db01deba7c5082312f90cdf3d`.
- Configuración DB: ausente; no existe `.env` y faltan `DB_SERVER`, `DB_DATABASE`, `DB_USER` y `DB_PASSWORD`.
- `/api/health/db`: **NO EJECUTADO** porque el backend exige esas variables al iniciar.
- SQL Server, API con datos, UI con datos y detalle con datos: **BLOQUEADOS POR ACCESO DB**.
- Repository, EventScope, Service, rutas API y consumidores UI: revisados estáticamente.
- Parámetros, periodo, cutoff, resultados, tiempos, diferencias y anomalías: **NO APLICADOS/NO OBSERVABLES** para los 14 SQL.
- Ningún indicador se promueve a **RECONCILIADO CON FUENTE**. No se alteraron benchmarks.

## Inventario operativo

| ID | SQL | Contrato | Repository / Service | API | UI | Detalle | Estado |
|---|---|---|---|---|---|---|---|
| URG-EJ-01 | URG-EJ-01_ATENCIONES.sql | Atenciones | fetchSummaryBase/getSummary | summary | KPI Atenciones | episodes.total | Coherencia estática |
| URG-EJ-02 | URG-EJ-02_PROMEDIO_DIARIO.sql | Promedio diario | fetchSummaryBase/getSummary | summary | KPI y periodo parcial | Sin filtro dedicado | Parcial: cutoff |
| URG-EJ-03 | URG-EJ-03_PERMANENCIA_REGISTRADA.sql | Permanencia registrada | fetchSummaryBase/fetchEpisodes | summary; episodes | KPI y duración/evento | Sin filtro evaluable | Parcial: faltan bandas/calidad |
| URG-EJ-04 | URG-EJ-04_HOSPITALIZACION.sql | Hospitalización | fetchSummaryBase/getSummary | summary | KPI Hospitalización | Destino sin filtro | Coherencia tras corrección |
| URG-EJ-05 | URG-EJ-05_REINGRESOS.sql | Reingresos <72/<48 | READMISSION_PRIOR_SQL/fetchReadmissions | summary | KPI <72 y referencia <48 | No implementado | Coherencia estática |
| URG-EJ-06 | URG-EJ-06_PACIENTES_UNICOS.sql | Pacientes únicos | fetchSummaryBase/getSummary | summary | KPI Pacientes únicos | Identificable no autorizado | Coherencia estática |
| URG-EJ-07 | URG-EJ-07_ATENCIONES_POR_PACIENTE.sql | Atenciones por paciente | fetchSummaryBase/getSummary | summary | Contexto pacientes | No aplica | Coherencia estática |
| URG-ACT-01 | URG-ACT-01_ACTIVOS_PROBABLES.sql | Activos probables | EventScope activeOnly/fetchCurrent | summary | KPI operacional | No implementado | Parcial: cutoff/bandas |
| URG-MOD-01 | URG-MOD-01_DEMANDA.sql | Demanda diaria | fetchDemand/getDemand | demand | Tendencia y servicios | episodes.total | Coherencia estática |
| URG-MOD-05 | URG-MOD-05_RESOLUCION.sql | Resolución/destino | fetchEpisodes/getEpisodes | episodes | Destino en detalle | Sin agregado filtrable | Capa parcial |
| URG-MOD-09 | URG-MOD-09_FRECUENTACION.sql | Frecuentación | No implementado | No implementado | No implementado | No implementado | Sin capa runtime |
| URG-TRI-01 | URG-TRI-01_COBERTURA.sql | Cobertura Triage | fetchTriage/getTriage | triage | Resumen y servicios | No implementado | Coherencia estática |
| URG-TRI-02 | URG-TRI-02_CLASIFICACION.sql | Clasificación Triage | No implementado | No implementado | No implementado | No implementado | Sin capa runtime |
| URG-TRI-03 | URG-TRI-03_TIEMPO_REGISTRADO.sql | Tiempo a Triage | fetchTriage/getTriage | triage | Promedio y anomalías | Sin bandas | Parcial: bandas no expuestas |

Los contratos relacionados están en [Contratos aceptados](../indicadores/CONTRATOS_ACEPTADOS.md). Los campos de evidencia por indicador están en [JSON](RECONCILIACION_14_SQL_2026-09-09.json).

## Repository / EventScope

Los 14 SQL y EventScope runtime comparten `id_urgencia`, servicios dinámicos `codigo_area=2 AND serv_activo_sn=1`, periodo con fin exclusivo técnico, filtros centro/servicio y agrupación por evento. Reingreso conserva paciente, mismo servicio, antecedente completado más reciente y fronteras estrictas.

Diferencias:

- **D — parámetros/cutoff:** Promedio diario acepta `@Corte`; runtime usa `GETDATE()`. Activos no recibe cutoff ni expone bandas.
- **F — comportamiento documentado:** Permanencia y Tiempo Triage implementan promedio y señales principales, pero no todas las bandas canónicas.
- **G — pendiente técnico:** Resolución agregada, Frecuentación y Clasificación Triage carecen de endpoint/módulo agregado.

## API, UI y detalle

Sin DB no hubo respuestas numéricas. Las rutas de datos existentes son `summary`, `demand`, `triage` y `episodes`; `filters`, `health` y `health/db` son rutas de soporte.

Correcciones técnicas sin cambio funcional:

1. Hospitalización conserva `decimal(9,4)` en Repository, igual que el SQL canónico.
2. La UI incorpora errores de Triage/catálogos y no representa resultados ausentes como ceros o vacío.
3. “Detalle reconciliado” cambió a “Detalle de eventos” hasta contar con evidencia numérica.

La UI distingue actividad cero y detalle vacío; NULL aparece como `—`. “Sin datos”, “No aplica” y “Datos insuficientes” requieren señales explícitas de API y quedan pendientes; no se infieren desde cero o NULL.

## Agregado y detalle

`episodes` pagina server-side con `ROW_NUMBER`, orden determinista `Fechaing DESC, id_urgencia DESC` y `COUNT_BIG(*) OVER()` sobre EventScope. Atenciones y Demanda pueden reconciliar contra `episodes.total`; Permanencia y Destino exponen valores por evento. No existen filtros de detalle específicos para Hospitalización, Reingreso, Activos, Triage o bandas, por lo que no se declara igualdad ejecutada.

## Próxima ejecución exacta

Proveer las cuatro variables DB mediante el mecanismo local autorizado, iniciar backend, validar `/api/health/db` y fijar un periodo, filtros y cutoff únicos. Ejecutar los 14 archivos y las cuatro rutas con esos parámetros, capturar tiempos/resultados sin secretos y completar los campos nulos del JSON.
