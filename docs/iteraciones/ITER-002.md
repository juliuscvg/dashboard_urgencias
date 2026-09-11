# ITER-002 — Validar Motivo de Urgencia

## Estado

COMPLETADA el 2026-09-10. Commit y push forman parte del cierre operativo.

## Objetivo

Definir `URG-PEND-06` sólo desde `vUrgencias`, preservando categorías nativas y texto libre sin API/UI.

## Alcance ejecutado

- `motivo_urgencia` y `motivo_urg_libre` sobre U-ING, cohortes cerradas 12/24/36 por `Fechaing`.
- Cobertura, cardinalidad, categorías nativas, relación entre campos y variación por periodo, centro y servicio.
- Verificación de metadatos, valores vacíos y conflictos entre filas físicas del mismo evento.
- Exclusiones respetadas: ninguna fuente clínica adicional, agrupación propia, regla de CEX, SQL productivo, API o UI. dbo.servicios se usó sólo para aplicar el universo U-ING vigente.

## Protocolo

`AGENTS.md` referencia `dashboard_hcg_specs/transversal/PROTOCOLO_MULTIAGENTE.md`; el archivo no estuvo disponible en la ruta local esperada al iniciar. Se aplicaron las reglas locales, el checkpoint único, U-ING y los contratos vigentes. La ausencia del archivo se conserva como límite de trazabilidad y no se reemplaza con reglas inferidas.

## Evidencia y resultados

La [evidencia canónica](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md) documenta el método y el [artefacto agregado](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.json) preserva la corrida.

- U-ING: 159,822 / 327,400 / 484,161 eventos en 12/24/36 meses.
- `motivo_urgencia`: 100% de cobertura, 15 categorías nativas y cero conflictos por evento en las tres ventanas.
- `motivo_urg_libre`: 21,754 / 40,268 / 65,181 eventos, equivalentes a 13.61% / 12.30% / 13.46%.
- En 36 meses: 21,443 textos distintos, 18,009 singletons y longitud observada de 1 a 60.
- El texto libre siempre coexistió con categoría; su cobertura varió marcadamente por centro y servicio.
- Los valores libres no se incluyeron en evidencia versionada.

## Decisiones

- `motivo_urgencia` queda como dimensión categórica nativa de caracterización del motivo registrado.
- `motivo_urg_libre` queda como información textual complementaria sensible, sólo para búsqueda o detalle autorizado en una fase futura.
- Ningún campo permite inferir gravedad, diagnóstico, causalidad o calidad.
- No se normalizan categorías ni se deduce una categoría desde el texto.
- Se definieron `URG-MOT-01..03` EN VALIDACIÓN; no son KPI aceptados y no autorizan implementación.

## Criterios de cierre

- [x] Evidencia read-only 12/24/36.
- [x] Diccionario canónico actualizado sólo para los dos campos validados.
- [x] Contratos, estado, decisión, trazabilidad y checkpoint actualizados.
- [x] Texto libre e identificadores directos excluidos del artefacto.
- [x] Validaciones documentales y de consistencia ejecutadas.
- [x] Sin API/UI ni ampliación de fuentes.
