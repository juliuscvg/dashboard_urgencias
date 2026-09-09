# Plan de validación — reconciliación funcional

Origen 717f681 preservado; [contexto vigente](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). La fase SQL dirigida fue ejecutada y consolidada; no se ejecutaron API/UI ni código de aplicación.

## Fase 1 — estructura física de dbo.vUrgencias

**Estado: EJECUTADA / VALIDADA CON ADVERTENCIAS.** Se ejecutó el [script dirigido](../../scripts/sql/01_validacion_estructura_vUrgencias.sql) y su [guía de evidencia](SQL_VALIDACION_01_ESTRUCTURA.md) sobre el checkpoint funcional `6bd730e911f350c1de57d15740c6d9c9f3102c7d`.

El alcance se limita a existencia y definición de la vista, metadatos de columnas, volumen, nulabilidad real, claves candidatas, granularidad, cardinalidad epis_pk/id_urgencia, perfil descriptivo de codigo_cliente y cobertura temporal básica. Los bloques A–H se pueden ejecutar por separado. D, E y F son perfiles exactos potencialmente costosos; G realiza el perfil temporal y H puede ordenar la vista.

La corrida cerró identidad de evento/paciente, universo de servicios, activo probable y contrato de reingreso. Conserva advertencias por multiplicación vsegpop, fechas extremas y mutabilidad operacional. La evidencia consolidada está en [validación SQL 2026-09-08](VALIDACION_SQL_FUNCIONAL_2026-09-08.md).

## Orden dirigido

1. Documental: ambos scripts existentes, matriz de 23 temas / 28 candidatos/32 archivos, ausencia de reglas vigentes contradictorias, diff y cambios limitados a documentación/configuración. 0 enlaces locales rotos.
2. VALIDADO: dbo.vUrgencias es VIEW y sus dependencias directas fueron perfiladas; mantener A03 compatible con SQL Server 2012.
3. VALIDADO CON ADVERTENCIA: id_urgencia es evento canónico, codigo_cliente identidad longitudinal, epis_pk vínculo XHIS; controlar multiplicación física sin selección arbitraria.
4. VALIDADO: dbo.servicios.codigo_area=2 AND serv_activo_sn=1; servicios/centros dinámicos, HCO con cero actividad y serv_ing_urg_sn sólo informativo. Mantener control de fan-out.
5. Temporalidad: Fechaing/fechaegr, tres etapas complementarias, derivados/fechas fuente, precisión/zona; faltantes/invertidos/ceros/extremos. Perfil de activos doble nulo, deuda con motivo y antigüedad >24/>48/>72 sin recorte.
6. Resolución: catálogo destino y mapeo a 8 grupos sin adivinar códigos; motivo independiente, motivo_alta ya expuesto desde dbo.motivos_alta_ing; mapeo a 8 grupos pendiente. No modificar vista.
7. Población/triage: semántica edad al evento, precedencia/discordancias, nueve grupos y meses/días pediátricos; cobertura geográfica; fecha/nivel/responsable triage independientes.
8. VALIDADO: mismo paciente/servicio y egreso previo válido más reciente, incluso fuera del periodo; contar el evento actual una vez y usar todos los evaluables como denominador.
9. Resolver subcontratos del [catálogo](../indicadores/00_CATALOGO_INDICADORES.md) y [preguntas](../DESCUBRIMIENTOS_Y_LIMITACIONES.md). Materializar casos sintéticos con esperado independiente, luego revalidar FAA sólo con contexto recuperado.
10. Cuando exista implementación: contrastar SQL/API/UI, agregado/detalle/count/exportación, filtros/turnos/drill-down, permisos y estados. Medir rendimiento antes de caches/índices, registrar frío/caliente/concurrencia.

## Aceptación y evidencia

DEFINIDO FUNCIONALMENTE no implica PASS SQL. Casos R2 sólo diseñados; no reutilizar esperados históricos al cambiar definición. Reconciliar universo/evaluables/no evaluables, particiones disjuntas, pacientes no aditivos, rangos y bandas, subtotales sin fan-out, comparación con base cero y estados sin actividad.

Toda corrida futura: SHA completo, fecha/hora con zona, dataset no sensible, periodo/evento/corte, filtros, configuración, inclusiones/exclusiones/representación, esperado independiente, obtenido, diferencia, método y estado. SQL/API/UI no ejecutados se declaran. Ver [manifiesto](MANIFIESTO_VALIDACION.md).

Los scripts de referencia son de solo lectura y se ejecutan por bloques. Responsables datos/negocio/QA por asignar.
