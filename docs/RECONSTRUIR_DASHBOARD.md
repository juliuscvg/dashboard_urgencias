# Reconstruir Dashboard Urgencias

Índice para reconstrucción semántica; no duplica fórmulas.

**Si eres otro agente sin historial de conversación, empieza por el
[handoff](HANDOFF_IA.md)**: indica qué leer, en qué orden, qué documento manda,
qué reglas son transversales, cuáles son locales y no transferibles, cómo
continuar una iteración y cómo validar equivalencia semántica (`HCG-POR-002`).

- [Handoff para otro agente](HANDOFF_IA.md)
- [Manifiesto machine-readable](../config/dashboard-manifest.json)
- [Checkpoint actual](gobierno/CHECKPOINT_ACTUAL.md) y [estado de proyecto](gobierno/ESTADO_PROYECTO.md)
- [Reglas de negocio](REGLAS_NEGOCIO.md) y [contratos de indicadores](indicadores/CONTRATOS_ACEPTADOS.md)
- [Estados funcionales/técnicos](gobierno/ESTADO_INDICADORES.md)
- [Fuentes y granularidad](diccionarios/FUENTES_Y_GRANULARIDAD.md) y [diccionario](diccionarios/DICCIONARIO_vUrgencias.md)
- [SQL verificable](../scripts/sql/indicadores/README.md)
- [Evidencia](evidencia/README.md) y [benchmarks](evidencia/BENCHMARKS_VIGENTES.md)
- [Decisiones](gobierno/DECISIONES_Y_CAMBIOS.md), [trazabilidad](gobierno/TRAZABILIDAD.md) y [adopción HCG](gobierno/ADOPCION_HCG.md)
- [Arquitectura de interfaz vigente](ARQUITECTURA_UI.md), [arquitectura futura](ARQUITECTURA_FUTURA.md) e [implementación fase 1](evidencia/IMPLEMENTACION_FASE_1.md)

## Orden mínimo de reconstrucción

1. Comparar checkpoint con Git y resolver sólo discrepancias.
2. Leer manifiesto, estado y reglas.
3. Reconstruir U-ING/U-ACT/U-RET, fuentes y granularidad.
4. Leer el contrato antes de cada SQL.
5. Ejecutar SQL únicamente con parámetros, cutoff y acceso read-only autorizados.
6. Reconciliar SQL, API, categorías y detalle; no declarar PASS por build o HTTP.
7. Conservar anomalías, NULL y categorías nativas.
8. Verificar el paquete portable con `npm run docs:check-portability` y `npm run docs:check-links`: rutas rotas, referencia obsoleta a `dashboard_hcg_specs` y componentes esenciales ausentes se detectan ahí, no a ojo.

El aspecto visual puede reconstruirse de otra forma si conserva semántica, contexto y auditabilidad. La arquitectura vigente (perspectivas Operación/Población/Desempeño y contratos visuales adoptados) está declarada en [ARQUITECTURA_UI.md](ARQUITECTURA_UI.md) para no tener que inferirla del código; las capturas son evidencia de revisión humana, no especificación.
