# ITER-009 — Aceptar e implementar Atención médica registrada (URG-ATE-01)

## Estado

COMPLETADA el 2026-09-11.

## Objetivo

Registrar la decisión institucional de promover `URG-ATE-01` de `EN
VALIDACIÓN` a `ACEPTADO CON OBSERVACIONES` e implementar el módulo de
Atención médica registrada (SQL→API→UI), integrando sus señales de calidad
al contrato `URG-CAL-01`.

## Autoridad y alcance

- Fuente clínica exclusiva: `dbo.vUrgencias`; `dbo.servicios`/`dbo.centros`
  permanecen como dimensiones de soporte de U-ING.
- Universo: U-ING, un evento por `id_urgencia`, anclado en `Fechaing`.
- Se reutiliza la interpretación funcional ya cerrada en
  [ITER-006](ITER-006.md) (cobertura y cronología de `fechaate`); no se
  repite ese análisis ni se reabren sus decisiones.
- No se cambió ningún otro indicador, universo, fórmula, umbral o regla
  clínica; no se abrió ninguna fuente nueva.

## Decisión institucional

`URG-GOV-055` ([decisiones](../gobierno/DECISIONES_Y_CAMBIOS.md)): `URG-ATE-01`
pasa de `EN VALIDACIÓN` a KPI `ACEPTADO CON OBSERVACIONES`. El contrato
completo queda en
[CONTRATOS_ACEPTADOS.md](../indicadores/CONTRATOS_ACEPTADOS.md#urg-ate-01--atención-médica-registrada);
la entrada previa en `CONTRATOS_EN_VALIDACION.md` queda como referencia al
nuevo contrato.

## Implementación

- **SQL**: `scripts/sql/indicadores/URG-ATE-01_ATENCION_MEDICA.sql` (dos
  sentencias read-only: resumen y cobertura por centro/servicio), siguiendo
  el mismo patrón que `URG-TRI-03_TIEMPO_REGISTRADO.sql`.
- **EventScope compartido**: `fechaate` se agregó a
  `server/src/repository/event-scope.sql.ts` de forma aditiva (mismo patrón
  de nulificación en conflicto que `fechatri`), sin alterar
  `conflicto_nucleo` ni el resultado de ningún otro indicador (verificado
  con prueba dedicada y con que el resto de la suite siga en verde).
- **Repository/Service**: `fetchAttention` en `urgencias.repository.ts`,
  `getAttention` en `urgencias.service.ts`, tipos `AttentionSummary` y
  `AttentionServiceCoverage` en `domain/types.ts`.
- **API**: `GET /api/urgencias/attention`, mismos filtros que el resto
  (`dashboardQuerySchema`: periodo, centro, servicio).
- **UI**: nuevo panel "Atención médica" en `client/src/App.tsx`, con el
  mismo patrón visual del panel de Triage: KPIs de cobertura, texto de
  contexto sin denominar el intervalo "tiempo de espera" ni "oportunidad
  asistencial" y sin afirmar inicio clínico real, advertencia condicional
  `notice quality` (URG-CAL-01) para invertidos/≥24h/≥7d, bandas exclusivas
  de tiempo y cobertura por servicio.
- **Cliente**: tipo `Attention` y `api.attention` en `client/src/api.ts`.

## Contenido del módulo (según lo solicitado)

- [x] Cobertura de `fechaate` sobre U-ING.
- [x] Tiempo registrado `Fechaing → fechaate`.
- [x] Promedio del tiempo registrado.
- [x] Bandas 0–30, 31–60, 61–120, 121–240 y >240 minutos.
- [x] Mismo minuto, faltantes (`eventosSinAtencion`) y anomalías/extremos
      (`invertidos`, `mayorIgual24h`, `mayorIgual7d`) conforme a URG-CAL-01.
- [x] Filtros (periodo, centro, servicio) y drill-down (cobertura por
      servicio) compatibles con la arquitectura existente.

## Restricciones cumplidas

- [x] No se denomina el intervalo "tiempo de espera" ni "oportunidad", ni se
      afirma inicio clínico real (verificado por prueba automatizada y por
      `scripts/check-iter009-reconciliation.mjs`).
- [x] Sin metas ni semáforos institucionales.
- [x] No se usa `atencion_fecha` para completar `fechaate`.
- [x] Sin cambios en otros indicadores ni fuentes nuevas.

## Evidencia

- [Reconciliación e informe funcional](../evidencia/RECONCILIACION_ITER009_2026-09-11.md).
- [Artefacto de reconciliación SQL→API](../evidencia/RECONCILIACION_ITER009_2026-09-11.json).
- Capturas de revisión visual en [docs/evidencia/capturas/ITER-009/](../evidencia/capturas/ITER-009/).
- `scripts/run-iter009-reconciliation.mjs`, `scripts/check-iter009-reconciliation.mjs`.

## Validaciones

- [x] Reconciliación SQL→API exacta (resumen y cobertura por servicio).
- [x] Cruce con la ventana cerrada de 12 meses: reproduce exactamente las
      cifras ya validadas en ITER-006 (cobertura 94.11%, cero inversiones).
- [x] Server: 10 pruebas PASS (incluida la nueva prueba de `event-scope.sql.ts`).
- [x] Client: 5 pruebas PASS (incluida la nueva prueba del panel de Atención médica).
- [x] Build server: `tsc -p tsconfig.build.json` PASS.
- [x] Build client: `tsc --noEmit && vite build` PASS.
- [x] Revisión visual de la aplicación real levantada localmente (backend
      compilado + Vite dev server), sin errores de consola.

## Cierre

- [x] Contrato URG-ATE-01, estados, decisiones, trazabilidad, diccionario y
      checkpoint actualizados.
- [x] Commit y push a `main`.
- [x] Working tree limpio.
