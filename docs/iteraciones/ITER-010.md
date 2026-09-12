# ITER-010 — Homologación visual con CEX, perspectivas y portabilidad

## Estado

COMPLETADA el 2026-09-12.

## Objetivo

Dos objetivos acoplados, ambos sin tocar reglas clínicas ni funcionales:

1. **Homologación visual y arquitectura de perspectivas.** Sustituir la página
   vertical única por las perspectivas Operación, Población e Indicadores de
   desempeño, homologando el lenguaje visual con `dashboard_cex`, e implementar
   tooltip obligatorio, patrón clicable→drawer, detalle bajo demanda paginado
   del lado servidor y reconciliación agregado ↔ detalle.
2. **Portabilidad.** Auditar y cerrar si `dashboard_urgencias` puede ser
   comprendido, reconstruido y continuado por otra IA sin acceso a
   conversaciones previas, y dejar validación ejecutable de ello.

## Autoridad y alcance

- `dashboard_cex` se usó como **referencia visual y técnica**, nunca como fuente
  de reglas clínicas o de negocio de Urgencias. No fue modificado.
- Las reglas transversales nuevas pertenecen a `dashboard_hcg_specs`
  (commit `dab9a84`); lo específico de Urgencias vive en este repositorio.
- No se cambió ninguna fórmula, universo, denominador, ventana temporal,
  categoría nativa ni umbral. No se abrió ninguna fuente nueva. No se
  incorporó ningún indicador nuevo. No se inventaron metas ni semáforos.

## Decisiones institucionales

- `URG-GOV-056` — homologación visual y reubicación en tres perspectivas.
- `URG-GOV-057` — criterio de portabilidad y handoff explícito para otro agente.

Ver [decisiones](../gobierno/DECISIONES_Y_CAMBIOS.md).

## Reubicación de módulos (sin cambio funcional)

| Perspectiva | Módulos | Nota |
|---|---|---|
| Operación | URG-EJ-01, URG-EJ-02, URG-EJ-03 (promedio y bandas), URG-ACT-01, URG-MOD-01, URG-TRI-01/02/03, URG-ATE-01, URG-MOD-05, señales URG-CAL-01 | Actividad, proceso registrado y cobertura del registro |
| Población | URG-EJ-06, URG-EJ-07, URG-MOD-09 | Describe a las personas atendidas, no a los eventos |
| Indicadores de desempeño | URG-EJ-04, URG-EJ-05 | Sólo indicadores de resultado aceptados |

La perspectiva Población declara explícitamente el perfil demográfico
(`URG-PEND-04`, `EN VALIDACIÓN`) como **no implementado** en vez de aproximarlo
con otra fuente: primera aplicación real de `HCG-VIS-004`.

La cobertura de Triage y de Atención médica **no** se presenta como desempeño;
mide completitud del dato y permanece en Operación (`HCG-CAL-010`).

## Implementación

- **Perspectivas**: `client/src/dashboardView.ts`. La perspectiva activa se
  persiste en la URL (`vista=`) junto a los filtros; cambiar de lente no
  descarta el contexto.
- **Tooltips**: `client/src/metricDefinitions.ts` y `MetricTooltip.tsx`
  (componente recuperado de la iteración interrumpida y portado desde CEX
  conservando su contrato de comportamiento, `HCG-VIS-007`). Cada texto
  parafrasea el contrato ya aceptado, en lenguaje para perfil directivo, sin
  jerga SQL ni reglas nuevas.
- **Detalle**: `client/src/DetailDrawer.tsx`, un único componente reutilizable
  parametrizado por recorte. Se monta al abrirse, nunca se precarga, pagina del
  lado servidor, conserva y muestra los filtros vigentes, y expone exportación
  CSV de la página cargada (`HCG-DET-010`).
- **Recortes**: `server/src/repository/detail-scopes.sql.ts`. Cada predicado es
  la **misma constante** que consume el agregado; `fetchSummaryBase` se refactorizó
  para consumirla en lugar de repetir el texto SQL. El KPI y su detalle no pueden
  divergir por edición parcial, y una prueba lo verifica. El SQL resultante es
  textualmente equivalente al anterior: no cambia ninguna cifra.
- **Reconciliación**: `client/src/detailReconciliation.ts`. La discrepancia entre
  agregado y detalle se muestra; no se corrige ni se oculta.
- **No precarga**: los módulos exclusivos de una perspectiva sólo se consultan en
  ella, y el detalle de pacientes no se consulta hasta abrir el drawer. El
  listado de episodios dejó de cargarse con la página.
- **Estilo**: `client/src/styles.css` reescrito con el lenguaje visual de CEX
  (tipografía, escala por tokens, densidad, tarjetas, rejillas), conservando la
  paleta institucional de Urgencias.

Métricas deliberadamente **no** clicables, por no tener detalle equivalente:
promedio diario, atenciones por paciente, pacientes únicos, reingresos y activos
probables. Presentarlas como clicables violaría `HCG-UX-017`.

## Portabilidad

- Nuevo [handoff](../HANDOFF_IA.md): responde las siete preguntas exigidas por
  `HCG-POR-002` sin duplicar contenido versionado.
- Nueva [arquitectura de interfaz vigente](../ARQUITECTURA_UI.md), para que una
  reconstrucción no tenga que inferirla del código (`HCG-POR-006`).
- [Manifiesto](../../config/dashboard-manifest.json) `1.1.0`: criterio de
  portabilidad, handoff, perspectivas, contratos visuales adoptados, componentes
  esenciales, recortes de detalle y rutas de reglas, límites e iteraciones.
- Referencia a `dashboard_hcg_specs` actualizada de `ab245b2` (obsoleta) a
  `dab9a84` (`HCG-POR-005`).
- `scripts/check-portability.mjs` ampliado (`HCG-POR-007`): valida el handoff y
  sus siete preguntas, el criterio en el manifiesto, el commit completo de
  specs, la existencia de los componentes esenciales, que las perspectivas
  declaradas existan en código y documentación, que sus indicadores tengan estado
  vigente, y que el detalle reconcilie y pagine del lado servidor. Se añadió
  `URG-ATE-01_ATENCION_MEDICA.sql` al conjunto exigido, que faltaba desde ITER-009.

## Validaciones

- `npm test`: server 17 pruebas PASS, client 25 pruebas PASS.
- `npm run build`: server (`tsc -p tsconfig.build.json`) y client
  (`tsc --noEmit && vite build`) PASS.
- `npm run docs:check-portability`: sin errores. Verificado además en negativo:
  el verificador detecta commit de specs obsoleto, componente esencial ausente,
  perspectiva no implementada y manifiesto sin bloque de portabilidad.
- `npm run docs:check-links`: 0 enlaces rotos.
- Reconciliación estructural agregado ↔ detalle: probada por construcción
  (constante compartida) y por prueba unitaria.

## Evidencia visual

Capturas reales de las tres perspectivas en
[capturas/ITER-010/](../evidencia/capturas/ITER-010/), con la medición de
longitud vertical antes y después en
[MEDICION_VERTICAL_ITER010.md](../evidencia/MEDICION_VERTICAL_ITER010.md).

Las capturas son evidencia para revisión humana, no especificación funcional.

## Limitación declarada

La base de datos (`10.2.1.9:1433`) no fue alcanzable durante esta iteración, por
lo que **no** se ejecutó reconciliación SQL→API contra fuente. No era necesaria:
la iteración no cambió ninguna consulta ni cifra. Las capturas y la medición
vertical se produjeron sirviendo la aplicación construida contra las cifras ya
reconciliadas y versionadas en `docs/evidencia/` (ITER-004, ITER-005, ITER-009),
no contra datos inventados. Queda pendiente, cuando haya acceso a la fuente,
una corrida de confirmación de que los recortes de detalle reconcilian con sus
agregados en datos reales.

## NO REPETIR

- La interpretación funcional de `fechaate`, `fechatri`, permanencia, activos,
  destino y frecuentación ya está cerrada; esta iteración sólo los reubicó.
- El criterio de portabilidad y el handoff ya están formalizados; no se
  redefinen por iteración.
