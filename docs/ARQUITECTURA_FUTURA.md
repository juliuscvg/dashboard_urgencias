# Arquitectura futura — referencia documental

Propuesta vigente sin implementación. Reutilizar arquitectura CEX sólo donde sea transversalmente válida, nunca sus reglas.

SQL Server → Repository → Urgencias Domain Rules → Services → Cache → API → Frontend.

Centralizar activo probable, permanencia, reingreso, resolución, grupos etarios y comparaciones. Repository identifica fuentes/uniones; reglas mantienen universos; servicios coordinan; caché futura no cambia semántica. Framework y contratos técnicos precisos pendientes.

| Endpoint semántico previsto, NO implementado | Responsabilidad |
|---|---|
| /api/urgencias/summary | Seis KPI de periodo |
| /api/urgencias/current | Situación actual al corte |
| /api/urgencias/demand | Volumen/tendencia/tiempo |
| /api/urgencias/stay | Permanencia y transcurrido separados |
| /api/urgencias/readmissions | <72 h y referencia 48 h |
| /api/urgencias/triage | Tres componentes/coberturas |
| /api/urgencias/resolution | Destino/motivo independientes |
| /api/urgencias/population | Pacientes/demografía/cobertura |
| /api/urgencias/clinical | Motivos/diagnósticos/Top/búsqueda |
| /api/urgencias/services | Centro→Servicio dinámico |
| /api/urgencias/episodes | Detalle contextual paginado |

## Rendimiento y consistencia

Filtro temprano evento >= @Inicio AND evento < @FinExclusivo; agregaciones y detalle paginado server-side. No todas las filas/columnas al navegador. No ETL, tablas resumen ni infraestructura adicional: primero medir frío/caliente, concurrencia, lecturas y planes.

Caché futura: TTL corto actual, medio reciente, largo histórico; valores numéricos pendientes de medición. Keys con todos los filtros relevantes, métrica/categoría, universo/configuración, periodo, corte/política de frescura y ámbito de autorización pertinente. Snapshot, invalidación y entrega página/count pendientes; mutabilidad/discrepancia visible.

Agregados sin datos personales innecesarios, detalle mínimo autorizado, exportaciones separadas y sin logs identificables. No se implementa conexión SQL, API, ETL, caché ni UI. [Contrato UX](CONTRATO_UX_FUNCIONAL.md) · [Reglas](REGLAS_NEGOCIO.md).
