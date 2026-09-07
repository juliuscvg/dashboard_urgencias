# Procedencia y adaptación de plantillas

- Referencia transversal principal: [dashboard_hcg_specs](https://github.com/juliuscvg/dashboard_hcg_specs/tree/3c6ed9cf08aca4821138f8499255423a874898fa), commit `3c6ed9cf08aca4821138f8499255423a874898fa`. Lectura de las ocho tablas transversales y las 13 plantillas desde objetos Git locales inmutables.
- Referencia metodológica: [dashboard_cex](https://github.com/juliuscvg/dashboard_cex/tree/0ea66780893ef62ff328c92806a888e693d1c5fb), commit `0ea66780893ef62ff328c92806a888e693d1c5fb`. Revisados índice, decisiones GOV, manifiesto y comprobador de enlaces; sin importar frontend, backend o fórmulas.
- Requisitos del dominio: [solicitud conservada](../historico/prompts/SOLICITUD_BASELINE.txt).

## Plantillas usadas

Se conserva el propósito y las secciones/tablas aplicables; se sustituyen placeholders por contenido de Urgencias o vacíos explícitos.

| Plantilla fijada a commit | Documento local | Adaptación |
|---|---|---|
| [README_PROYECTO](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/README_PROYECTO.template.md) | [README.md](../../README.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [00_LEEME_PRIMERO](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/00_LEEME_PRIMERO.template.md) | [docs/00_LEEME_PRIMERO.md](../../docs/00_LEEME_PRIMERO.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [ESTADO_PROYECTO](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/ESTADO_PROYECTO.template.md) | [docs/gobierno/ESTADO_PROYECTO.md](../../docs/gobierno/ESTADO_PROYECTO.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [CATALOGO_FUNCIONAL](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/CATALOGO_FUNCIONAL.template.md) | [docs/gobierno/CATALOGO_FUNCIONAL.md](../../docs/gobierno/CATALOGO_FUNCIONAL.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [REGLAS_Y_CRITERIOS](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/REGLAS_Y_CRITERIOS.template.md) | [docs/gobierno/REGLAS_Y_CRITERIOS.md](../../docs/gobierno/REGLAS_Y_CRITERIOS.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [DECISIONES_Y_CAMBIOS](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/DECISIONES_Y_CAMBIOS.template.md) | [docs/gobierno/DECISIONES_Y_CAMBIOS.md](../../docs/gobierno/DECISIONES_Y_CAMBIOS.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [TRAZABILIDAD](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/TRAZABILIDAD.template.md) | [docs/gobierno/TRAZABILIDAD.md](../../docs/gobierno/TRAZABILIDAD.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [CONTRATO_UX_FUNCIONAL](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/CONTRATO_UX_FUNCIONAL.template.md) | [docs/CONTRATO_UX_FUNCIONAL.md](../../docs/CONTRATO_UX_FUNCIONAL.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [DESCUBRIMIENTOS_Y_LIMITACIONES](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/DESCUBRIMIENTOS_Y_LIMITACIONES.template.md) | [docs/DESCUBRIMIENTOS_Y_LIMITACIONES.md](../../docs/DESCUBRIMIENTOS_Y_LIMITACIONES.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [FUENTES_Y_GRANULARIDAD](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/FUENTES_Y_GRANULARIDAD.template.md) | [docs/diccionarios/FUENTES_Y_GRANULARIDAD.md](../../docs/diccionarios/FUENTES_Y_GRANULARIDAD.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [CASOS_PATRON](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/CASOS_PATRON.template.md) | [docs/evidencia/CASOS_PATRON_VIGENTES.md](../../docs/evidencia/CASOS_PATRON_VIGENTES.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [BENCHMARKS](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/BENCHMARKS.template.md) | [docs/evidencia/BENCHMARKS_VIGENTES.md](../../docs/evidencia/BENCHMARKS_VIGENTES.md) | Contenido propio; estados y evidencia limitados a baseline documental |
| [MANIFIESTO_VALIDACION](https://github.com/juliuscvg/dashboard_hcg_specs/blob/3c6ed9cf08aca4821138f8499255423a874898fa/templates/MANIFIESTO_VALIDACION.template.md) | [docs/evidencia/MANIFIESTO_VALIDACION.md](../../docs/evidencia/MANIFIESTO_VALIDACION.md) | Contenido propio; estados y evidencia limitados a baseline documental |

El comprobador de enlaces adapta el patrón CEX con recorrido de archivos de trabajo (incluidos nuevos), sin paquetes. Los enlaces remotos fijados se acreditan por lectura del objeto Git local; el comprobador no verifica disponibilidad HTTP ni anchors.


## Reconciliación posterior al baseline

Origen publicado 717f681e6d979798a2b1d680dda64d765bb3b051; [solicitud posterior](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). Las referencias HCG/CEX fijadas permanecen; nuevos campos son comunicados por contexto, no extraídos de SQL. [Matriz por tema/archivo/candidato](RECONCILIACION_BASELINE_717f681.md). No se editan repositorios de referencia.
