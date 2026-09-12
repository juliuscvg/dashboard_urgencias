# Arquitectura de interfaz vigente — Urgencias

Estado: vigente desde ITER-010, compactada en Operación por ITER-011. Esta es
la descripción canónica de **cómo está compuesta la interfaz**, para que una
reconstrucción no tenga que inferirla del código. No define indicadores ni
fórmulas: esas viven en [contratos aceptados](indicadores/CONTRATOS_ACEPTADOS.md)
y [reglas de negocio](REGLAS_NEGOCIO.md), que mandan sobre este documento.

## Decisión de homologación visual

Urgencias adopta el lenguaje visual de [`dashboard_cex`](https://github.com/juliuscvg/dashboard_cex)
— tipografía (`DM Sans` + `Space Grotesk`), escala tipográfica por tokens,
densidad, tarjetas, rejillas y navegación por perspectivas — bajo `HCG-VIS-005`.
Se adopta el **lenguaje visual**, no las reglas de negocio, fórmulas, universos,
códigos ni semántica clínica de CEX. La paleta conserva la identidad
institucional de Urgencias (`--navy`, `--teal`). Decisión registrada como
`URG-GOV-056` en [decisiones](gobierno/DECISIONES_Y_CAMBIOS.md).

## Perspectivas

La página vertical única fue sustituida por tres lentes analíticos sobre el
**mismo universo filtrado** (`HCG-VIS-001`). La perspectiva activa se persiste
en la URL como `vista=` junto a los filtros, de modo que recargar o compartir el
enlace reconstruye el contexto completo (`HCG-VIS-002`, `HCG-FIL-003`).

| Perspectiva | `vista=` | Pregunta que responde | Módulos |
|---|---|---|---|
| Operación | `operation` | Cómo funcionó Urgencias en el periodo | URG-EJ-01, URG-EJ-02, URG-EJ-03 (promedio y bandas), URG-ACT-01, URG-MOD-01, URG-TRI-01/02/03, URG-ATE-01, URG-MOD-05, señales de URG-CAL-01 |
| Población | `population` | A quién atendió | URG-EJ-06, URG-EJ-07, URG-MOD-09; perfil demográfico declarado **no implementado** |
| Indicadores de desempeño | `performance` | Resultados distintos de los conteos de actividad | URG-EJ-04, URG-EJ-05 |

Ningún indicador cambió de fórmula, universo, denominador ni contrato al
reubicarse; la iteración sólo redistribuyó módulos ya aceptados.

### Criterios de asignación

- **Operación** reúne actividad, proceso registrado y cobertura del registro.
- **Población** reúne lo que describe a las personas atendidas, no a los eventos.
- **Desempeño** reúne únicamente indicadores de resultado aceptados. La cobertura
  de Triage y de Atención médica **no** se presenta como desempeño: mide
  completitud del dato y permanece en Operación (`HCG-CAL-010`).
- El perfil demográfico (`URG-PEND-04`, `EN VALIDACIÓN`) se declara explícitamente
  como no implementado en lugar de aproximarse con otra fuente (`HCG-VIS-004`).
- No existen metas ni semáforos institucionales aprobados para Urgencias; las
  cifras se presentan sin calificación de sentido.

## Contratos visuales transversales adoptados

| Contrato | Regla | Implementación local |
|---|---|---|
| Tooltip obligatorio | `HCG-UX-016` | [`metricDefinitions.ts`](../client/src/metricDefinitions.ts) + [`MetricTooltip.tsx`](../client/src/MetricTooltip.tsx) |
| Métrica clicable → detalle | `HCG-UX-017` | `Kpi`/`BandGrid` en [`App.tsx`](../client/src/App.tsx); sólo son clicables las métricas con recorte de detalle disponible |
| Detalle bajo demanda | `HCG-UX-007`, `HCG-DET-007` | [`DetailDrawer.tsx`](../client/src/DetailDrawer.tsx); se monta al abrirse, nunca se precarga |
| Paginación server-side | `HCG-UX-015`, `HCG-DET-003` | `GET /api/urgencias/episodes` con `page`/`pageSize`; el navegador no materializa el universo |
| Reconciliación agregado ↔ detalle | `HCG-UX-006`, `HCG-DET-006` | [`detailReconciliation.ts`](../client/src/detailReconciliation.ts); la discrepancia se muestra, no se corrige |
| Preservación de contexto | `HCG-FIL-003`, `HCG-VIS-002` | [`dashboardView.ts`](../client/src/dashboardView.ts); el detalle hereda los filtros vigentes y los muestra |
| Estados independientes | `HCG-UX-003`, `HCG-UX-004` | Carga/error/vacío por módulo; el fallo de uno no borra los demás |
| Exportación de detalle | `HCG-DET-010` | CSV limitado a la página cargada del drawer |

## Ficha secundaria bajo demanda (ITER-011)

Operación se compactó reduciendo la información secundaria visible de forma
permanente, sin quitarle acceso (`HCG-UX-007`, `HCG-DET-007`). La clasificación
nativa de Triage, la cobertura de Triage y de Atención médica por servicio, y
el desglose con porcentaje del destino de los eventos ya no ocupan bloque fijo:
se abren bajo demanda en [`InfoDrawer.tsx`](../client/src/InfoDrawer.tsx), un
segundo componente de overlay que reutiliza el mismo patrón visual e
interactivo que `DetailDrawer.tsx` (backdrop, cierre con Escape, `aria-modal`),
pero **no** consulta al servidor ni pagina: sólo repliega agregados que la
perspectiva ya solicitó. No sustituye al drawer de episodios, que sigue siendo
el único punto donde se lista un evento por paciente.

La vista ejecutiva de Operación conserva sólo el resumen necesario de cada
módulo (cobertura, tiempo promedio registrado, bandas resumidas y señal de
calidad cuando existe); el resto queda a un clic. La banda "Ingreso futuro" de
Activos probables dejó de presentarse junto a las bandas acumulativas
operativas (`>24 h`, `>48 h`, `>72 h`): es una señal de `URG-CAL-01` y se
muestra como advertencia de calidad separada, nunca como KPI ni semáforo.
Permanencia (periodo filtrado) y Activos probables (fotografía al corte)
llevan una insignia visual (`scope-badge`) que distingue explícitamente su
semántica temporal.

## Recortes de detalle

El drawer es un único componente reutilizable parametrizado por recorte. Los
predicados viven exclusivamente en el servidor, en
[`detail-scopes.sql.ts`](../server/src/repository/detail-scopes.sql.ts), y son la
**misma constante** que consume el agregado correspondiente: el KPI y su detalle
no pueden divergir por edición parcial, y una prueba lo verifica.

| Recorte (`metrica=`) | Indicador dueño | Reconcilia contra |
|---|---|---|
| `atenciones` | URG-EJ-01 | Total de atenciones |
| `permanencia_evaluables` | URG-EJ-03 | Eventos completados evaluables |
| `permanencia_menor12h` … `permanencia_mayor72h` | URG-EJ-03 | Cada banda exclusiva |
| `hospitalizacion` | URG-EJ-04 | Numerador de hospitalización |
| `triage_registrado` | URG-TRI-01 | Eventos con Triage |
| `atencion_registrada` | URG-ATE-01 | Eventos con `fechaate` |
| `conflicto` | URG-CAL-01 | Eventos con conflicto de identidad |

Métricas deliberadamente **no** clicables por no tener detalle equivalente:
promedio diario y atenciones por paciente (razones, no conjuntos de eventos),
pacientes únicos (conteo distinto sobre otra unidad), reingresos (requieren el
antecedente fuera del recorte) y activos probables (universo al corte, sin
periodo). Presentarlas como clicables violaría `HCG-UX-017`.

## Límite

La apariencia no es especificación funcional. Una reconstrucción puede resolver
la capa visual de otra forma siempre que conserve semántica, contexto,
auditabilidad y las reglas de la tabla anterior. Las capturas en
[evidencia](evidencia/capturas/) son material de revisión humana, no contrato.
