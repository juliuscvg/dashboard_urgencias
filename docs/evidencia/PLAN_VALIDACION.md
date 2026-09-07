# Plan de validación — reconciliación funcional

Origen 717f681 preservado; [contexto vigente](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). Esta fase ejecuta sólo comprobadores documentales; no SQL/API/UI ni consultas de ejemplo.

## Orden dirigido

1. Documental: ambos scripts existentes, matriz de 23 temas / 28 candidatos/32 archivos, ausencia de reglas vigentes contradictorias, diff y cambios limitados a documentación/configuración. 0 enlaces locales rotos.
2. Cuando se autorice SQL: metadatos de dbo.vUrgencias; sólo catálogos complementarios identificados. Confirmar objeto de centros a partir de relación documentada, no enumerar base.
3. Perfil de claves: epis_pk, id_urgencia, codigo_cliente, registro, foliounico; nulos/duplicados/variantes/cardinalidad bidireccional y ámbito. Cerrar representación determinista antes de métricas.
4. Universo: dbo.servicios.codigo_area=2 AND serv_activo_sn=1; comprobar cobertura/joins sin fan-out, centros/códigos/descripciones dinámicos, HCO sin actividad y con actividad, serv_ing_urg_sn sólo informativo. Medir impacto histórico de vigencia actual sin cambiar criterio tácitamente.
5. Temporalidad: Fechaing/fechaegr, tres etapas complementarias, derivados/fechas fuente, precisión/zona; faltantes/invertidos/ceros/extremos. Perfil de activos doble nulo, deuda con motivo y antigüedad >24/>48/>72 sin recorte.
6. Resolución: catálogo destino y mapeo a 8 grupos sin adivinar códigos; motivo independiente, catálogo dbo.motivos_alta_ing y descripción futura en vista. No modificar vista.
7. Población/triage: semántica edad al evento, precedencia/discordancias, nueve grupos y meses/días pediátricos; cobertura geográfica; fecha/nivel/responsable triage independientes.
8. Reingreso: mismo paciente/servicio, egreso previo válido fuera del periodo/ventana inicial; pares múltiples, empates, solapamientos, identidad ambigua. Cerrar algoritmo sin falsos positivos; contar nuevos episodios una sola vez.
9. Resolver subcontratos del [catálogo](../indicadores/00_CATALOGO_INDICADORES.md) y [preguntas](../DESCUBRIMIENTOS_Y_LIMITACIONES.md). Materializar casos sintéticos con esperado independiente, luego revalidar FAA sólo con contexto recuperado.
10. Cuando exista implementación: contrastar SQL/API/UI, agregado/detalle/count/exportación, filtros/turnos/drill-down, permisos y estados. Medir rendimiento antes de caches/índices, registrar frío/caliente/concurrencia.

## Aceptación y evidencia

DEFINIDO FUNCIONALMENTE no implica PASS SQL. Casos R2 sólo diseñados; no reutilizar esperados históricos al cambiar definición. Reconciliar universo/evaluables/no evaluables, particiones disjuntas, pacientes no aditivos, rangos y bandas, subtotales sin fan-out, comparación con base cero y estados sin actividad.

Toda corrida futura: SHA completo, fecha/hora con zona, dataset no sensible, periodo/evento/corte, filtros, configuración, inclusiones/exclusiones/representación, esperado independiente, obtenido, diferencia, método y estado. SQL/API/UI no ejecutados se declaran. Ver [manifiesto](MANIFIESTO_VALIDACION.md).

No se escribe SQL de referencia en esta iteración: las expresiones de reglas son notación documental. Responsables datos/negocio/QA por asignar.
