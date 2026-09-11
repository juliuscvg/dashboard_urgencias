# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-10, America/Mexico_City

## Rama

main

## HEAD base de la iteración

9260b969ad401b8fd8b89f3c8de24507fb28afd4

## Iteración actual

Auditoría de estado funcional y hoja de ruta priorizada. Ver [ITER-003](../iteraciones/ITER-003.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] Clasificación funcional de los 17 indicadores/bloques de `ESTADO_INDICADORES.md` en completo, parcial, sólo validado con fuente y pendiente/diferido.
- [x] Contraste del estado declarado contra el código real (`server/src/http/routes.ts`, `server/src/service/urgencias.service.ts`, `client/src/App.tsx`) para distinguir aceptado-en-papel de expuesto-por-API/UI.
- [x] Hallazgo transversal: `docs/BACKLOG_FUNCIONAL.md` desactualizado frente a Diagnósticos y Motivo de Urgencia (ya EN VALIDACIÓN, no "Por definir").
- [x] Hoja de ruta priorizada en 6 puntos, sin ampliar alcance.
- [x] Sin código, SQL, API, UI ni fuentes nuevas.

## Evidencia preservada

- [Auditoría y hoja de ruta](../iteraciones/ITER-003.md).
- Basada únicamente en `docs/gobierno/ESTADO_INDICADORES.md`, `docs/indicadores/CONTRATOS_ACEPTADOS.md`, `docs/indicadores/CONTRATOS_EN_VALIDACION.md` y código versionado; sin evidencia nueva generada.

## Pendientes gobernados

- Decisión institucional de promoción a KPI de AMED, Población, Diagnósticos y Motivo de Urgencia (bloquea SQL productivo y API/UI de los cuatro).
- Cierre de contrato de `fechaate` (URG-PEND-01, Atención médica), único bloque EN PROCESO sin contrato final.
- Implementación API/UI de MOD-05, MOD-09 y TRI-02 (SQL ya validado con fuente) y de las bandas pendientes de EJ-03/TRI-03/ACT-01.
- Actualización de `docs/BACKLOG_FUNCIONAL.md` para reflejar el estado real post ITER-001/002 (no ejecutada en esta iteración por alcance).
- Definición de consumidor/alcance visible de URG-CAL-01 (Calidad de datos).

## NO REPETIR

- Auditoría de estado funcional 2026-09-10: clasificación completa de los 17 indicadores/bloques y hoja de ruta ya preservadas en ITER-003.
- Validación 12/24/36 de Motivo, Diagnósticos, Población y AMED ya registradas en sus iteraciones respectivas.

## Próxima acción exacta

Ninguna acción adicional en ITER-003. La siguiente iteración sustantiva depende de una decisión institucional (punto 2 de la hoja de ruta) o, si no llega, puede avanzar directamente el punto 1 (exponer en API/UI lo ya aceptado: MOD-05, MOD-09, TRI-02 y bandas pendientes).

## Commit de cierre

Consolidado en el commit `[URG][GOV] Auditar estado funcional y hoja de ruta` (ver `git log`).
