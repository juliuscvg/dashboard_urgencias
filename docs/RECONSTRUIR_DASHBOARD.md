# Reconstruir Dashboard Urgencias

Índice para reconstrucción semántica; no duplica fórmulas.

- [Manifiesto machine-readable](../config/dashboard-manifest.json)
- [Checkpoint actual](gobierno/CHECKPOINT_ACTUAL.md) y [estado de proyecto](gobierno/ESTADO_PROYECTO.md)
- [Reglas de negocio](REGLAS_NEGOCIO.md) y [contratos de indicadores](indicadores/CONTRATOS_ACEPTADOS.md)
- [Estados funcionales/técnicos](gobierno/ESTADO_INDICADORES.md)
- [Fuentes y granularidad](diccionarios/FUENTES_Y_GRANULARIDAD.md) y [diccionario](diccionarios/DICCIONARIO_vUrgencias.md)
- [SQL verificable](../scripts/sql/indicadores/README.md)
- [Evidencia](evidencia/README.md) y [benchmarks](evidencia/BENCHMARKS_VIGENTES.md)
- [Decisiones](gobierno/DECISIONES_Y_CAMBIOS.md), [trazabilidad](gobierno/TRAZABILIDAD.md) y [adopción HCG](gobierno/ADOPCION_HCG.md)
- [Arquitectura](ARQUITECTURA_FUTURA.md) e [implementación fase 1](evidencia/IMPLEMENTACION_FASE_1.md)

## Orden mínimo de reconstrucción

1. Comparar checkpoint con Git y resolver sólo discrepancias.
2. Leer manifiesto, estado y reglas.
3. Reconstruir U-ING/U-ACT/U-RET, fuentes y granularidad.
4. Leer el contrato antes de cada SQL.
5. Ejecutar SQL únicamente con parámetros, cutoff y acceso read-only autorizados.
6. Reconciliar SQL, API, categorías y detalle; no declarar PASS por build o HTTP.
7. Conservar anomalías, NULL y categorías nativas.

El aspecto visual puede reconstruirse de otra forma si conserva semántica, contexto y auditabilidad.
