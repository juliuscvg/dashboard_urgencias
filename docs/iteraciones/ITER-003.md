# ITER-003 — Auditoría de estado funcional y hoja de ruta

## Objetivo

Auditar el estado funcional actual del Dashboard de Urgencias (qué está
completo, parcial, sólo validado o pendiente) y proponer una hoja de ruta
priorizada para continuar el desarrollo.

## Alcance y restricciones

- Sólo lectura de evidencia y contratos ya versionados: `ESTADO_INDICADORES.md`,
  `CONTRATOS_ACEPTADOS.md`, `CONTRATOS_EN_VALIDACION.md`, código de
  `server/src` y `client/src`, `BACKLOG_FUNCIONAL.md`.
- No se implementó código, SQL, API ni UI.
- No se abrió ninguna fuente ni se ejecutó consulta nueva.
- No se reabren decisiones ya cerradas (POB, AMED, DIAG, MOT); se citan como
  están documentadas.

## Método

1. Confirmar sincronía de `main` con `origin/main` (fast-forward, sin
   divergencia: `+0 -0`).
2. Leer `AGENTS.md` y `CHECKPOINT_ACTUAL.md` (iteración previa: ITER-002,
   Motivo de Urgencia, COMPLETADA).
3. Tomar `docs/gobierno/ESTADO_INDICADORES.md` como fuente canónica de
   estados por indicador (17 filas + 3 validaciones funcionales adicionales).
4. Contrastar contra el código real: rutas en `server/src/http/routes.ts`,
   servicio en `server/src/service/urgencias.service.ts` y secciones
   renderizadas en `client/src/App.tsx`, para distinguir "aceptado en papel"
   de "expuesto por API/UI".

## Auditoría — clasificación funcional

### Completo (SQL + API + UI reconciliados con fuente)

| ID | Indicador |
|---|---|
| URG-EJ-01 | Atenciones |
| URG-EJ-02 | Promedio diario |
| URG-EJ-04 | Hospitalización |
| URG-EJ-05 | Reingresos <72h/<48h |
| URG-EJ-06 | Pacientes únicos |
| URG-EJ-07 | Atenciones por paciente |
| URG-MOD-01 | Demanda diaria |
| URG-TRI-01 | Cobertura de Triage |

Verificado en código: `routes.ts` expone `/urgencias/summary`, `/urgencias/demand`
y `/urgencias/triage`; `App.tsx` renderiza KPIs, demanda y panel de Triage con
estos valores.

### Parcial (aceptado, con una capa pendiente)

| ID | Indicador | Capa pendiente |
|---|---|---|
| URG-EJ-03 | Permanencia registrada | Bandas de distribución en API (promedio ya expuesto) |
| URG-ACT-01 | Activos probables | Bandas de antigüedad en API; fuente viva sin snapshot |
| URG-MOD-05 | Resolución / destino | Agregado por API/UI (SQL y detalle ya exactos); sin ruta HTTP propia |
| URG-MOD-09 | Frecuentación | API/UI (SQL validado con fuente); sin ruta HTTP propia |
| URG-TRI-02 | Clasificación de Triage | API/UI (SQL validado con fuente); sin ruta HTTP propia |
| URG-TRI-03 | Tiempo registrado a Triage | Bandas en API/UI (resumen ya exacto en `/urgencias/triage`) |

`activosProbables` sí se expone dentro de `/urgencias/summary`, pero sin
bandas de antigüedad. `getEpisodes`/`/urgencias/episodes` cubre trazabilidad
de detalle, no reemplaza los agregados de MOD-05/MOD-09/TRI-02.

### Sólo validado con fuente (sin API/UI, sin promoción a KPI)

| ID | Bloque | Nota |
|---|---|---|
| URG-PEND-02 | Alta médica | `fechamed` canónico del hito; secuencia con AMED-01..04 |
| URG-PEND-03 | Secuencias temporales completas | Análisis complementario, no KPI |
| URG-PEND-04 | Población | Edad/sexo/residencia nativos; POB-01..04 |
| URG-PEND-05 | Diagnósticos | Ingreso/egreso codificados y texto no codificado; DIAG-01..04 |
| URG-PEND-06 | Motivo de urgencia | Categoría nativa y texto libre; MOT-01..03 |

Estos cinco bloques comparten patrón: evidencia read-only en 12/24/36 meses,
contrato "EN VALIDACIÓN", sin SQL productivo ni exposición. Ninguno está en
la lista de "próximos módulos" que la UI declara (`client/src/App.tsx`:
Permanencia avanzada, Destinos y altas, Población, Calidad de datos), es
decir, Diagnósticos y Motivo de Urgencia ni siquiera están anunciados ahí
todavía.

### Pendiente / diferido

| ID | Indicador | Estado |
|---|---|---|
| URG-PEND-01 | Atención médica (`fechaate`) | EN PROCESO, contrato aún no cerrado |
| URG-PEND-07 | Localización / cama | DIFERIDO, fuera de fase |
| URG-CAL-01 | Calidad de datos | EN PROCESO, validado técnicamente, sin cierre funcional |

## Hallazgo transversal

`docs/BACKLOG_FUNCIONAL.md` quedó desactualizado frente a `ESTADO_INDICADORES.md`:
sigue listando "Diagnósticos, motivo de urgencia" en la sección "Por definir",
cuando ambos ya están EN VALIDACIÓN con evidencia versionada (ITER-001,
ITER-002). No se corrige en esta iteración por alcance (auditoría, no
edición de backlog); se deja como primer punto de la hoja de ruta de
gobierno.

## Hoja de ruta priorizada

1. **Cerrar brecha API/UI de lo ya aceptado.** Exponer MOD-05, MOD-09 y
   TRI-02 en `routes.ts`/`urgencias.service.ts` y renderizarlos en `App.tsx`;
   son SQL ya validados con fuente, sin riesgo funcional nuevo. Completar
   bandas de EJ-03/TRI-03/ACT-01. Esto cierra la mayor parte de la columna
   "Parcial" con el menor riesgo (contratos ya aceptados, sólo falta
   implementación).
2. **Decidir promoción a KPI de los cuatro bloques EN VALIDACIÓN** (AMED,
   Población, Diagnósticos, Motivo de Urgencia) en orden de completitud de
   evidencia: Población y Diagnósticos tienen contratos de 4 puntos cada uno
   y cobertura 12/24/36m ya cerrada; Motivo de Urgencia tiene 3 contratos con
   100% de cobertura categórica; AMED tiene 4 contratos pero secuencia
   completa (PEND-03) sigue "POR DEFINIR" y depende de esta decisión. Esta
   es una decisión institucional, no técnica: sin ella no se autoriza SQL
   productivo ni API/UI para ninguno de los cuatro.
3. **Cerrar URG-PEND-01 (Atención médica, `fechaate`)**, el único bloque
   "EN PROCESO" sin contrato final. Bloquea declarar completa la jerarquía
   de hitos (Ingreso→Triage→Atención→Alta→Egreso) descrita en
   `CONTRATOS_EN_VALIDACION.md`.
4. **Actualizar `docs/BACKLOG_FUNCIONAL.md`** para reflejar el estado real
   post ITER-001/002 (mover Diagnósticos y Motivo de Urgencia de "Por
   definir" a "En proceso/validado"), en una iteración de gobierno dedicada.
5. **URG-CAL-01 (Calidad de datos):** definir a qué indicadores aceptados se
   asocia como advertencia visible en UI, ya que hoy está "validado
   técnicamente" pero sin cierre funcional ni consumidor declarado.
6. **Diferido, sin cambio de prioridad:** URG-PEND-07 (Localización/cama)
   permanece fuera de fase; no requiere acción hasta que se reabra la fase.

## Criterios de aceptación

- [x] `main` confirmado sincronizado con `origin/main` (fast-forward trivial,
      sin commits nuevos que traer).
- [x] Clasificación funcional de los 17 indicadores/bloques de
      `ESTADO_INDICADORES.md` en completo/parcial/sólo-validado/pendiente.
- [x] Contraste contra código real (`routes.ts`, `urgencias.service.ts`,
      `App.tsx`), no sólo contra el estado declarado en el documento.
- [x] Hoja de ruta priorizada con justificación y sin ampliar alcance
      (ninguna implementación, ninguna fuente nueva).
- [x] Sin SQL, API, UI ni fuentes nuevas.

## Commit de cierre

Ver `docs/gobierno/CHECKPOINT_ACTUAL.md`.
