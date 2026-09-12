# ITER-007 — Definir funcionalmente URG-CAL-01 (Calidad de datos)

## Estado

COMPLETADA el 2026-09-11.

## Objetivo

Definir funcionalmente `URG-CAL-01` como capa transversal: qué anomalías/señales
ya existentes (código, contratos, evidencia) se asocian a qué indicadores, cuáles
deben ser visibles como advertencia en UI y cuáles permanecen sólo como
auditoría técnica. No se promueve ningún nuevo KPI ni se crea meta o semáforo.

## Autoridad y alcance

- Sólo lectura de contratos, evidencia y código ya versionados: `ESTADO_INDICADORES.md`,
  `CONTRATOS_ACEPTADOS.md`, `CONTRATOS_EN_VALIDACION.md`, `TRAZABILIDAD.md`,
  `REGLAS_Y_CRITERIOS.md`, `server/src/domain/types.ts`,
  `server/src/service/urgencias.service.ts`, `server/src/repository/urgencias.repository.ts`,
  `client/src/App.tsx`.
- No se abrió ninguna fuente, no se ejecutó SQL nuevo, no se cambiaron universos,
  fórmulas ni reglas clínicas.
- No se implementó código, API ni UI en esta iteración.

## Principio rector

Una señal de calidad sólo puede ser advertencia visible en UI si el indicador al
que pertenece está `ACEPTADO` o `ACEPTADO CON OBSERVACIONES` en
`ESTADO_INDICADORES.md`. Las señales de bloques `EN VALIDACIÓN`, `EN PROCESO`,
`POR DEFINIR` o `DIFERIDO` permanecen exclusivamente como auditoría técnica en
evidencia/SQL hasta que exista decisión institucional de KPI para ese bloque.
Esto evita inventar metas o semáforos y no reabre ninguna decisión de universo.

## Inventario y clasificación de señales

| Señal | Campo(s) | Indicador | Regla | Estado del indicador | Visibilidad hoy | Decisión |
|---|---|---|---|---|---|---|
| Conflicto de identidad / multiplicación física | `eventosConConflicto`, `filasMultiplicadas` (Summary); `conflicto` (EpisodeRow) | Transversal (EventScope), reportada junto a URG-EJ-01 | URG-R01 | ACEPTADO | UI: aviso "Calidad visible" en Resumen; columna con pill Revisar/Consistente en detalle | Confirmada como ADVERTENCIA UI. Mantener; ya cumple el principio rector. |
| Inversión de permanencia (`fechaegr<Fechaing`) | `permanenciaInvertidos` | URG-EJ-03 | URG-R04/R05 | ACEPTADO CON OBSERVACIONES | UI: texto de contexto en panel Permanencia | Confirmada como ADVERTENCIA UI. Mantener. |
| Evento sin egreso (abierto) | `permanenciaSinEgreso` | URG-EJ-03 | URG-R04/R05 | ACEPTADO CON OBSERVACIONES | UI: texto de contexto en panel Permanencia | Confirmada como ADVERTENCIA UI. Mantener. |
| Antigüedad de activo no evaluable | `activosAntiguedadNoEvaluable` | URG-ACT-01 | URG-R03 | ACEPTADO | UI: banda en panel Activos probables | Confirmada como ADVERTENCIA UI. Mantener; se recomienda (implementación futura) distinguirla visualmente de las bandas normales `>24h/>48h/>72h`, sin cambiar el dato. |
| Ingreso futuro en activo probable | `activosFechaIngresoFutura` | URG-ACT-01 | URG-R03 | ACEPTADO | UI: banda en panel Activos probables | Confirmada como ADVERTENCIA UI. Mantener; misma recomendación de distinción visual futura. |
| Secuencia Triage invertida (`fechatri<Fechaing`) | `secuenciasInvertidas` | URG-TRI-03 (mostrada hoy en el panel de cobertura de URG-TRI-01) | URG-R04/R10 | ACEPTADO CON OBSERVACIONES | UI: "secuencias a revisar" en panel Triage | Confirmada como ADVERTENCIA UI. Mantener; se observa que su ubicación actual corresponde al panel de TRI-01 y no al de TRI-03 — no se reubica en esta iteración. |
| Tiempo de Triage ≥24 h / ≥7 días | `tiemposMayorIgual24h`, `tiemposMayorIgual7d` | URG-TRI-03 | URG-R04/R10 | ACEPTADO CON OBSERVACIONES | Sólo API (`/urgencias/triage`); no renderizada en `App.tsx` | GAP identificado: el contrato URG-TRI-03 ya declara estas señales como "visibles". Quedan pendientes de exposición en UI en una iteración de implementación futura; mientras tanto sirven como auditoría técnica vía API/evidencia. |
| Faltantes, inversiones y extremos de Alta Médica | Ver [evidencia AMED](../evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.md) | URG-PEND-02 | Reglas locales de hitos | EN VALIDACIÓN | Sólo evidencia/SQL | AUDITORÍA TÉCNICA ÚNICAMENTE. No se promueve a UI sin decisión institucional de KPI. |
| Faltantes y extremos de secuencia completa (5 hitos) | Ver [evidencia AMED](../evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.md) | URG-PEND-03 | URG-R04 | POR DEFINIR | Sólo evidencia/SQL | AUDITORÍA TÉCNICA ÚNICAMENTE. |
| Inversión Triage→Atención (36,289/44,983 en 36m) y extremos de `fechaate` | Ver [evidencia Atención médica](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.md) | URG-PEND-01 (URG-ATE-01) | HCG-TRZ-001; URG-R02/R04 | DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN | Sólo evidencia/SQL | AUDITORÍA TÉCNICA ÚNICAMENTE. |
| Fechas de nacimiento posteriores al ingreso, extremos de edad | Ver [evidencia Población](../evidencia/VALIDACION_POBLACION_2026-09-10.md) | URG-PEND-04 | URG-R07 | EN VALIDACIÓN | Sólo evidencia/SQL | AUDITORÍA TÉCNICA ÚNICAMENTE. |
| Códigos de egreso con 2–4 descripciones; texto de egreso sin código | Ver [evidencia Diagnósticos](../evidencia/VALIDACION_DIAGNOSTICOS_2026-09-10.md) | URG-PEND-05 | URG-R12 | EN VALIDACIÓN | Sólo evidencia/SQL | AUDITORÍA TÉCNICA ÚNICAMENTE. |
| Baja cobertura y alta cardinalidad de texto libre de motivo | Ver [evidencia Motivo](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md) | URG-PEND-06 | URG-R12 | EN VALIDACIÓN | Sólo evidencia/SQL | AUDITORÍA TÉCNICA ÚNICAMENTE. |

## Aclaración de alcance

- `periodoParcial` (aviso "El día actual es parcial...") es comportamiento
  contractual de URG-EJ-02, no una anomalía de calidad de datos; queda fuera
  del inventario de CAL-01 para no mezclar conceptos.
- Ningún indicador `ACEPTADO`/`ACEPTADO CON OBSERVACIONES` carece hoy de al
  menos una señal de calidad ya visible en UI, salvo el gap declarado
  (`tiemposMayorIgual24h`/`tiemposMayorIgual7d` de TRI-03).

## Resultado funcional

- `URG-CAL-01` queda definida como capa transversal cuyo contenido son las
  señales de calidad ya existentes en los indicadores `ACEPTADO`s, sin campos,
  fórmulas ni fuentes nuevas.
- Regla de promoción a UI: sólo indicadores `ACEPTADO`/`ACEPTADO CON
  OBSERVACIONES`; el resto permanece como auditoría técnica hasta su propia
  decisión de KPI.
- Único gap de implementación futura identificado: exponer
  `tiemposMayorIgual24h`/`tiemposMayorIgual7d` en `App.tsx` (URG-TRI-03).
- Recomendación de implementación futura (no ejecutada aquí): distinguir
  visualmente en el panel de Activos probables las bandas de anomalía
  (`activosAntiguedadNoEvaluable`, `activosFechaIngresoFutura`) de las bandas
  acumulativas normales (`>24h`, `>48h`, `>72h`).

## Evidencia

- Este documento consolida la clasificación; no genera evidencia SQL nueva.
- Fuentes citadas: `ESTADO_INDICADORES.md`, `CONTRATOS_ACEPTADOS.md`,
  `CONTRATOS_EN_VALIDACION.md`, `TRAZABILIDAD.md`, `REGLAS_Y_CRITERIOS.md` y
  el código vigente de `server/src` y `client/src/App.tsx`.

## Validaciones

- [x] Cada señal del inventario existe verificablemente en código o evidencia
      ya versionada (citada por archivo/campo).
- [x] Ninguna señal cambia de universo, fórmula, exclusión o regla clínica.
- [x] Ninguna señal EN VALIDACIÓN/POR DEFINIR se promovió a UI.
- [x] Sin SQL, API, UI ni fuentes nuevas.
- [x] Working tree limpio tras commit.

## Restricciones cumplidas

- [x] Sin metas ni semáforos institucionales.
- [x] Sin cambios de universo, fórmula o regla clínica.
- [x] Sin fuentes nuevas, sin código/API/UI implementados.

## Cierre

- [x] Contrato URG-CAL-01, estado, trazabilidad, decisión y checkpoint actualizados.
- [x] Commit y push a `main`.
- [x] Working tree limpio.
