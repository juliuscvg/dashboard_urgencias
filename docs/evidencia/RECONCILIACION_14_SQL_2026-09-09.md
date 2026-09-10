# Reconciliación de los 14 SQL canónicos — 2026-09-09

## Fase estática — alcance y bloqueo histórico

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

## Fase con fuente real — 2026-09-09

### Conectividad y contexto

- Archivo `.env`: presente, variables requeridas configuradas, ignorado por Git y no tracked. No se registraron valores ni nombres de servidor/base.
- Backend aislado de Urgencias en puerto 3002: `/api/health` HTTP 200 en 2248 ms; `/api/health/db` HTTP 200 en 1016 ms; `/api/urgencias/filters` HTTP 200 en 316 ms.
- El proceso preexistente en 3001 fue descartado porque no exponía rutas de Urgencias; no se detuvo ni se usó como evidencia.
- Periodo: día cerrado 2026-08-01. Semántica: `Fechaing >= 2026-08-01` y `Fechaing < 2026-08-02`.
- Filtros: todos los centros y servicios; turno no aplica.
- Corte canónico: `2026-09-09T21:03:28Z`, observado por SQL y serializado en UTC por `mssql`.
- Commit base: `98aac20eed57002fe3a377c3f6239788bd7beff4`.
- Ejecutor reproducible: `node scripts/run-source-reconciliation.mjs --desde 2026-08-01 --hasta 2026-08-01 --corte 2026-09-09T21:03:28.000Z --api http://127.0.0.1:3002/api --head 98aac20eed57002fe3a377c3f6239788bd7beff4 --output .tmp/source-reconciliation.json`.

### Resultado por indicador

| ID | Resultado SQL principal | ms | Repository / Service / API | UI / detalle | Estado |
|---|---|---:|---|---|---|
| URG-EJ-01 | 354 atenciones; 0 filas físicas adicionales | 752 | 354; diferencia 0 | UI 354; detalle 354/354 | RECONCILIADO CON FUENTE |
| URG-EJ-02 | 1 día; 354; promedio 354; no parcial | 862 | Coincidencia exacta en cuatro campos | UI 354.0 y 1 día | RECONCILIADO CON FUENTE |
| URG-EJ-03 | 354 evaluables; 61.33 h; bandas 204/40/42/13/55 | 818 | Promedio y evaluables exactos; bandas no proyectadas | UI 61.3 h; detalle reproduce todas las bandas | RECONCILIADO EN CAPAS DISPONIBLES |
| URG-EJ-04 | 354 completados; 96 hospitalizaciones; 27.1186 % | 1001 | Coincidencia exacta | UI 27.1 % y 96; detalle destino 96 | RECONCILIADO CON FUENTE |
| URG-EJ-05 | 354 evaluables; 13 <48 h; 18 <72 h | 853 | Coincidencia exacta; API 5.08 % <72 h | UI 5.1 %, 18/354 y 13 | RECONCILIADO CON FUENTE |
| URG-EJ-06 | 338 pacientes; 0 eventos sin identidad | 704 | 338; diferencia 0 | UI 338; detalle identificable no aplica | RECONCILIADO CON FUENTE |
| URG-EJ-07 | 354/338 = 1.05 | 826 | Coincidencia exacta | UI contextual 1.1 | RECONCILIADO CON FUENTE |
| URG-ACT-01 | 370 activos; 0 no evaluables; 3 futuros; >24/48/72 h: 144/52/26 | 535 | Conteo exacto en corrida coordinada | UI 370; bandas/corte no proyectados | RECONCILIADO CON FUENTE, LIMITACIÓN DE SNAPSHOT |
| URG-MOD-01 | 354 el 2026-08-01 | 886 | Serie y total exactos | Tendencia UI; detalle total 354 | RECONCILIADO CON FUENTE |
| URG-MOD-05 | 8 destinos; 354 eventos; hospitalización 96 | 1585 | Sin agregado API | Distribución exacta reconstruida de 354 filas | RECONCILIADO EN CAPAS DISPONIBLES |
| URG-MOD-09 | 322 pacientes con 1 evento; 16 con 2 | 1353 | Sin capa runtime | Sin UI/detalle dedicado | SQL VALIDADO CON FUENTE |
| URG-TRI-01 | 8 servicios; 354 universo; 51 con Triage; 14.41 % | 1698 | Totales y servicios exactos | UI 14.4 %, 51/354 | RECONCILIADO CON FUENTE |
| URG-TRI-02 | 5 categorías; eventos 1/6/19/22/3 | 2329 | Sin capa runtime | Sin UI/detalle dedicado | SQL VALIDADO CON FUENTE |
| URG-TRI-03 | 354 universo; 51 evaluables; 44.41 min; 0 invertidos | 843 | Siete campos exactos; bandas intermedias no proyectadas | UI 44.4 min y señales; detalle no expone Triage | RECONCILIADO EN CAPAS DISPONIBLES |

Los porcentajes y categorías completos, junto con parámetros, tiempos y resultados por archivo, permanecen en el [JSON de evidencia](RECONCILIACION_14_SQL_2026-09-09.json). Los valores base se compararon antes del formato UI; todos los campos comparables tuvieron diferencia absoluta y relativa cero.

### Repository, Service y API

Los 14 SQL ejecutados y EventScope conservaron el mismo universo: servicio activo del área 2, identidad `id_urgencia`, agrupación por evento, periodo semiabierto y filtros nulos. Las cuatro rutas de datos devolvieron HTTP 200. Las 12 comparaciones con capa runtime disponible fueron exactas; Frecuentación y Clasificación Triage sólo cuentan con SQL.

### UI

La UI se ejecutó en 5174 contra el backend aislado mediante `API_PROXY_TARGET`. Chrome headless/CDP confirmó ausencia de error/carga pendiente, ocho KPI, resumen Triage y 20 filas de la primera página. Los valores renderizados coinciden con el API, aplicando únicamente formato de presentación a una decimal. Computer Use no pudo inicializarse tras tres intentos; se usó el navegador local headless como mecanismo alternativo.

La UI conserva `NULL` como guion en los formateadores y no presenta fallos de consulta como cero. Los estados “Sin datos”, “No aplica” y “Datos insuficientes” siguen sin señales API completas y no se infirieron.

### Agregado y detalle

Se recorrieron las cuatro páginas: total reportado 354, filas recuperadas 354, identificadores únicos 354, duplicados 0 y orden `Fechaing DESC, id_urgencia DESC` válido. El detalle reprodujo exactamente el total, las cinco bandas de Permanencia y los ocho destinos de Resolución. No se versionaron identificadores individuales.

### Discrepancias y correcciones

- La fuente viva cambió 368→370 activos durante pruebas preliminares. La corrida final coordinada SQL/API y la UI contemporánea coincidieron en 370. `@Corte` permite calcular antigüedad, pero no crea un snapshot de filas; la limitación queda clasificada como E/H.
- MOD-05 y TRI-02 fallaron inicialmente con error SQL 174 por `SUM(COUNT_BIG(*)) OVER()` en compatibilidad 100. Se sustituyó por una CTE que calcula los mismos eventos y el mismo denominador con `SUM(eventos)`; ambos ejecutaron después sin cambiar fórmula.
- Vite conserva 3001 como destino predeterminado y acepta `API_PROXY_TARGET` sólo para aislar ejecuciones locales.
- No se añadieron agregados runtime para Resolución, Frecuentación o Clasificación Triage, ni bandas nuevas. Esa deuda no impidió validar sus SQL y, en Resolución, el detalle existente.

### Benchmarks

Los benchmarks históricos no son comparables con esta corrida: carecen de periodo/corte exactos equivalentes y varios se limitan a FAA, mientras esta ejecución cubre todos los centros/servicios en 2026-08-01. Se conservaron como evidencia, sin usarlos como objetivo y sin ajustar fórmulas.

### Resultado

Los 14 SQL quedaron validados con fuente real. Nueve indicadores reconciliaron todas sus capas implementadas, tres reconciliaron las capas disponibles con proyecciones parciales y dos quedaron como SQL validado con fuente porque no existe runtime. La evidencia no declara capas inexistentes como reconciliadas.
