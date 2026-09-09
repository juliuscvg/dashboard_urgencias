# Contrato UX funcional — Urgencias

Contrato vigente, implementado parcialmente en la primera fase y pendiente de validación visual con datos reales. Definido por [contexto vigente](historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). [Evolución del baseline](gobierno/RECONCILIACION_BASELINE_717f681.md).

## Portada y navegación

Seis KPI aceptados: Atenciones, Promedio diario, Permanencia promedio, Hospitalización, Reingresos <72 h y Pacientes únicos. Situación actual separada con corte explícito, total activo probable y >24/>48/>72 h, énfasis >48/>72 sin ocultar varios días. Triage/población secundarios frente a registro/egreso. No metas ni semáforos.

Secciones futuras: Resumen, Demanda, Permanencia, Reingresos, Triage, Resolución, Población, Clínica, Detalle. Click sobre visual aplica filtro/contexto como acción explícita con chips; Ver detalle abre episodios del mismo contexto. Persistir filtros entre secciones, recarga, Back/Forward y enlaces no sensibles. Exploración sin acción de filtrado no cambia globales silenciosamente. Advertencias interpretativas visibles, no sólo tooltip.

## Filtros

Visibles periodo, centro, servicio, turno. Centro→Servicio jerárquico; cambiar padre limpia/revalida descendiente incompatible, conserva compatibles. Catálogo dinámico, incluido HCO sin hardcode. Drill-down actual Centro→Servicio→Antigüedad→Localización→Episodio; periodo/turno históricos no limitan silenciosamente stock actual.

Rápidos: Hoy, Ayer, Últimos 7 días, Últimos 30 días, Este mes, Mes anterior, Este año, Personalizado. Ventana inicial configurable tres años móviles; anteriores consultables con aviso discreto de captura histórica diferente.

Avanzados: sexo, grupo edad, estado, municipio, triage, nivel triage, motivo urgencia, diagnóstico, destino, motivo alta, reingreso, permanencia, médico, seguridad social, pagador, origen. Diagnóstico/médico mediante búsqueda dinámica, no catálogos gigantes. Compatibilidad avanzada con situación actual pendiente de contrato, no aplicación tácita. [Reglas](REGLAS_NEGOCIO.md).

## Estados y semántica

loading/error con reintento/empty/success por módulo; fallo aislado conserva otros resultados.

| Estado funcional | Significado |
|---|---|
| SIN ACTIVIDAD EN EL PERIODO | Servicio aplicable con cero eventos; esperado para HCO en el corte validado |
| SIN DATOS | Información esperada no disponible o no capturada |
| NO APLICA | Métrica conceptualmente no aplicable; no equivale a cero actividad |
| DATOS INSUFICIENTES | Existe información, pero no alcanza para cálculo o interpretación |

SIN DATO describe atributo ausente; DATO INVÁLIDO requiere semántica validada. No confundir con error ni fabricar cero. No hay umbral cuantitativo de suficiencia autorizado. Denominador cero no calculable con motivo pertinente. Etiquetas humanas/fallback para clave sin descripción, variantes contradictorias auditables. Sin identificación personal en URL compartible.

## Tooltips y comparación

Explican qué mide, fórmula, periodo/evento, numerador, denominador, cobertura, exclusiones, comparación y advertencias. Límites esenciales también visibles fuera. Triage siempre muestra cobertura por fecha/nivel/responsable; localidad muestra calidad. Destino separado de motivo.

Comparación principal equivalente anterior, opcional año anterior. Conteos variación porcentual, porcentajes puntos porcentuales, tiempos minutos/horas; base cero y cortes parciales explícitos. No saturar ni inferir calidad, gravedad o causalidad.

## Detalle y exportación

Mismo predicado agregado/detalle/count: entidad, deduplicación, filtros, evento, categoría/drill-down. Paginación servidor, orden determinista, total exacto requerido. Discrepancias visibles impiden PASS. Carga bajo demanda y cierre accesible; count fallido conserva filas; mecanismo page/count y snapshot pendientes.

Columnas base candidatas: ingreso, centro, servicio, registro, paciente, edad, sexo, triage, atención, alta médica, egreso, permanencia, destino, motivo alta, diagnóstico, médico. Añadir sólo contexto necesario, no todas las columnas de vUrgencias. Exportación agregada/por episodio separadas, ambas respetan filtros, categoría/drill-down y permisos. Todos usa servidor, no descarga completa en navegador.

Datos personales sólo para auditoría autorizada; roles/exportación identificable pendientes. Sin logs con nombres, CURP, teléfonos, direcciones o datos personales innecesarios. Médico: Atenciones asociadas / Actividad registrada, no productividad ni mejor/peor; staff triage separado y registro/egreso en auditoría.

[Adopción HCG](gobierno/ADOPCION_HCG.md) · [Arquitectura](ARQUITECTURA_FUTURA.md) · [Casos](evidencia/CASOS_PATRON_VIGENTES.md).
