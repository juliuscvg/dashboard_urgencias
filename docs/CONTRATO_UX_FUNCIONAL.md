# Contrato UX funcional — Urgencias

Contrato de comportamiento candidato, no apariencia ni framework. Sin UI implementada ni validada.

| ID | Comportamiento que debe conservarse | Estado | Evidencia |
|---|---|---|---|
| URG-UX-CONTEXTO | Contexto reproducible, filtros compatibles persistentes en recarga e historial | CANDIDATO | Adopción HCG-UX-001 y FIL |
| URG-UX-ESTADOS | loading, error con reintento, empty y success por módulo; fallo aislado conserva resultados válidos | CANDIDATO | HCG-UX-003/004 |
| URG-UX-DETALLE | KPI → detalle con misma métrica/universo; discrepancias visibles | CANDIDATO | HCG-DET y UX-005/006 |
| URG-UX-SEMANTICA | Tooltips explican regla, evento, universo, denominador, calidad y límites | CANDIDATO | HCG-UX-008/009/010/011 |

## Contexto y navegación

Centro → Servicio → Localización → Paciente/episodio es jerarquía candidata, pendiente de relaciones reales. Cambiar padre revalida o limpia descendientes incompatibles y conserva filtros compatibles. Filtros adicionales y semántica: [URG-R08](REGLAS_NEGOCIO.md). Explorar detalle no cambia globales sin acción explícita. Seleccionar intervalos conserva contexto y evita recarga completa si la plataforma lo permite.
IDs técnicos en contratos; etiquetas humanas en pantalla: SIN DATO para ausencia, descripción no disponible para clave sin etiqueta, DATO INVÁLIDO sólo tras validación de catálogo, inconsistencia para variantes contradictorias. No exponer nombres o identificadores personales en URLs compartibles; el contexto de paciente se resolverá con control de acceso y referencias adecuadas. Diseño de permisos pendiente.

## Estados

Empty significa universo vacío; falta de dato o denominador cero significa NO CALCULABLE. Error ofrece reintento y no borra resultados independientes. Datos recientes deben informar corte y mutabilidad; no presentar una carga pendiente como cero.

## Detalle y auditoría

Mismo predicado conceptual para agregado/page/count, misma representación de episodio, filtros y evento. Detalle expone campos necesarios para reconstruir inclusión y valor con acceso autorizado. Paginación servidor para conjuntos incompletos, orden determinista y desempates validados. Total exacto cuando se requiera, sin sustitución por aproximaciones. Carga bajo demanda, cierre accesible y retorno al contexto; conservar filas si falla count. Estrategia técnica de page/count y consistencia de snapshot pendiente. Discrepancias impiden declarar reconciliación PASS.

## Libertad visual

Operación, población y desempeño son perspectivas conceptuales. Composición y tecnología libres. Presentar magnitud con lenguaje neutral; no confundir abierto/activo probable con censo actual ni alta médica con egreso. La simplificación ejecutiva conserva información en auditoría. No existen metas institucionales ni UI CEX copiada.

[Matriz de adopción](gobierno/ADOPCION_HCG.md) · [Plan de validación](evidencia/PLAN_VALIDACION.md).
