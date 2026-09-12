# ITER-011 — Compactación visual/UX de Operación

## Estado

COMPLETADA el 2026-09-12.

## Objetivo

Segunda pasada, exclusivamente visual/UX, sobre la perspectiva Operación,
partiendo de [ITER-010](ITER-010.md). Reducir su altura sin perder
auditabilidad ni acceso al detalle. Sin cambiar universos, fórmulas, SQL de
indicadores, denominadores, contratos funcionales, fuentes ni semántica
clínica; sin agregar indicadores; sin modificar Población ni Indicadores de
desempeño.

## Autoridad y alcance

- Presentación únicamente, sobre `URG-GOV-056` (que no se reabre).
- Ningún indicador cambió de fórmula, universo, denominador, ventana temporal,
  categoría nativa ni contrato. No se abrió ninguna fuente nueva. No se
  incorporó ningún indicador nuevo. No se inventaron metas ni semáforos.
- Ninguna categoría se fusionó ni se recortó: todas las que antes se veían de
  forma permanente siguen existiendo, repartidas entre el resumen ejecutivo y
  el detalle bajo demanda.

## Decisión institucional

- `URG-GOV-058` — compactación visual/UX de Operación. Ver
  [decisiones](../gobierno/DECISIONES_Y_CAMBIOS.md#urg-gov-058--compactación-visual-ux-de-la-perspectiva-operación).

## Ajustes implementados

1. **Estructura principal conservada**: KPIs ejecutivos (Atenciones, Promedio
   diario, Estancia promedio registrada, Activos al corte), Demanda temporal +
   Servicios, Permanencia + Activos probables, Triage + Atención médica,
   Resolución resumida + Calidad del dato.
2. **Información secundaria movida a ficha bajo demanda**: la clasificación
   nativa de Triage, la cobertura de Triage y de Atención médica por servicio,
   y el desglose con porcentaje del destino de los eventos ya no ocupan
   bloque permanente. Se abren en [`InfoDrawer.tsx`](../../client/src/InfoDrawer.tsx),
   nuevo componente que reutiliza el patrón visual e interactivo del drawer de
   episodios (`HCG-UX-007`, `HCG-DET-007`: overlay, cierre con Escape/backdrop,
   `aria-modal`) pero sin consultar al servidor ni paginar — sólo repliega
   agregados que la perspectiva ya había solicitado. La vista ejecutiva
   conserva un resumen compacto (chips con todas las categorías nativas, sin
   fusionar) y un botón visible "Ver desglose completo" / "Clasificación y
   cobertura por servicio" / "Cobertura por servicio".
3. **Permanencia vs. Activos diferenciados visualmente**: el panel de
   Permanencia lleva la insignia "Episodios del periodo" y el de Activos
   probables la insignia "Fotografía al corte", para que sea evidente que
   describen unidades de análisis distintas (episodios del periodo vs. foto al
   corte).
4. **"Ingreso futuro" tratado como anomalía de calidad**: se retira de la
   rejilla de bandas de Activos probables (donde competía visualmente con
   `>24 h`, `>48 h`, `>72 h` como si fuera una banda operativa más) y se
   presenta como advertencia condicional independiente: "Calidad: N registros
   presentan fecha de ingreso futura respecto al corte (URG-CAL-01)". No es
   KPI, no tiene semáforo, no se muestra cuando el conteo es cero.
5. **Triage y Atención médica compactados**: la vista ejecutiva conserva
   cobertura, tiempo promedio registrado, bandas resumidas y señal de calidad
   condicional; se retiró "universo total" de la ficha visible de Triage
   (queda en el detalle bajo demanda) y se conservó "sin fechaate" en Atención
   médica por ser parte directa de su lectura de cobertura. Se mantienen
   íntegras las advertencias semánticas ya aceptadas: `fechaate` no acredita
   presencia física continua ni que la atención ocurriera en ese momento, y su
   ausencia no excluye el evento; los tiempos registrados no se renombran como
   espera ni oportunidad.
6. **KPIs superiores renombrados**: "Estancia registrada" → "Estancia
   promedio registrada"; "Activos probables" → "Activos al corte". Mismo
   cálculo, mismo tooltip, misma condición de ser o no clicable.
7. **Servicios**: el código técnico del servicio deja de mostrarse siempre en
   texto visible; queda disponible por `title` (tooltip nativo) al pasar el
   cursor sobre la fila.
8. **Demanda**: la gráfica "Atenciones por día" reduce su altura de 190 px a
   138 px (SVG), sin perder legibilidad de la serie ni de los ejes.
9. **Drill-down y rendimiento**: sin cambios respecto de ITER-010. El detalle
   de episodios sigue siendo bajo demanda, sin precarga de pacientes, con
   paginación server-side, filtros persistentes, reconciliación agregado ↔
   detalle y exportación autorizada de la página cargada. `InfoDrawer` no es
   el drawer de episodios: nunca lista un evento por paciente ni consulta al
   servidor.
10. **Portabilidad**: `InfoDrawer.tsx` se agrega a `essentialComponents` del
    manifiesto (`uiVersion` 2026-09-12.2); [ARQUITECTURA_UI.md](../ARQUITECTURA_UI.md)
    documenta el patrón de ficha secundaria bajo demanda. No se duplicó
    contenido ya gobernado por `dashboard_hcg_specs`.

## Validaciones

- `npm test`: server 17 pruebas PASS, client 27 pruebas PASS (2 pruebas
  nuevas sobre la diferenciación Permanencia/Activos y sobre "Ingreso futuro"
  como señal de calidad separada; pruebas existentes actualizadas para los
  nuevos rótulos y para la reubicación de clasificación nativa y cobertura por
  servicio al detalle bajo demanda).
- `npm run build`: server (`tsc -p tsconfig.build.json`) y client
  (`tsc --noEmit && vite build`) PASS.
- `npm run docs:check-portability`: sin errores.
- `npm run docs:check-links`: 0 enlaces rotos sobre 566 enlaces locales.
- Cifras y contratos funcionales: sin cambios. El refactor es exclusivamente
  de `client/src/App.tsx`, `client/src/App.test.tsx`, `client/src/styles.css`
  y el nuevo `client/src/InfoDrawer.tsx`; no se tocó ningún archivo de
  `server/`, ningún SQL ni ningún tipo de `api.ts`.
- Reconciliación agregado ↔ detalle: sin cambio (misma implementación de
  ITER-010, `detail-scopes.sql.ts` y `detailReconciliation.ts` intactos).

## Evidencia visual

Captura real de Operación en
[capturas/ITER-011/operacion.png](../evidencia/capturas/ITER-011/operacion.png),
con la medición de longitud vertical antes/después en
[MEDICION_VERTICAL_ITER011.md](../evidencia/MEDICION_VERTICAL_ITER011.md).

| Referencia | Altura |
|---|---|
| Baseline — página vertical única (ITER-009) | 5 066 px |
| Operación — ITER-010 | 2 320 px |
| Operación — ITER-011 | **1 705 px** |

Reducción de **−26.5 %** respecto de ITER-010 y **−66.3 %** respecto del
baseline. La reducción proviene de repartir información entre resumen
ejecutivo y detalle bajo demanda, y de reducir la altura del gráfico de
demanda; ninguna categoría, banda ni advertencia se eliminó.

Las capturas son evidencia para revisión humana, no especificación funcional.

## Limitación declarada

La base de datos (`10.2.1.9:1433`) no fue alcanzable desde este entorno. No se
ejecutó reconciliación SQL→API contra fuente; no era necesaria porque esta
iteración no cambió ninguna consulta, tipo de dato ni cifra. La captura y la
medición vertical se generaron sirviendo el build real del cliente con las
mismas cifras ya reconciliadas y versionadas usadas en
[`scripts/capture-perspectives.mjs`](../../scripts/capture-perspectives.mjs)
desde ITER-010.

## NO REPETIR

- La interpretación funcional de `fechaate`, `fechatri`, permanencia, activos,
  destino y frecuentación sigue cerrada (ITER-004 a ITER-009); esta iteración
  sólo reorganizó su presentación dentro de Operación.
- La homologación visual con CEX y la arquitectura de tres perspectivas siguen
  decididas y versionadas (`URG-GOV-056`); no se reabren.
- El criterio de portabilidad y el handoff siguen formalizados; no se
  redefinen por iteración.
