# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-10, America/Mexico_City

## Rama

main

## HEAD base de la iteración

0a232b0442ea4aca2adb6594f9ff7b57f5c8f4bf

## Iteración actual

Implementación de las brechas API/UI de MOD-05, MOD-09 y TRI-02. Ver [ITER-004](../iteraciones/ITER-004.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] URG-MOD-05 expuesto por Repository, servicio, `/api/urgencias/resolution` y panel de destinos nativos.
- [x] URG-MOD-09 expuesto por Repository, servicio, `/api/urgencias/frequentation` y panel de bandas aceptadas.
- [x] URG-TRI-02 añadido a Repository/servicio/`/api/urgencias/triage` y panel de clasificación nativa.
- [x] Tres comparaciones SQL canónico→API exactas con los mismos filtros.
- [x] Renderizado UI validado con las filas API reales preservadas.
- [x] Contratos funcionales, universos, fórmulas, denominadores y SQL canónicos sin cambios.
- [x] Sin fuentes ni indicadores adicionales.

## Evidencia preservada

- [Reconciliación ITER-004](../evidencia/RECONCILIACION_ITER004_2026-09-10.md).
- [Resultado SQL/API agregado](../evidencia/RECONCILIACION_ITER004_2026-09-10.json).
- `scripts/run-iter004-reconciliation.mjs` y `scripts/check-iter004-reconciliation.mjs`.
- Pruebas de servicio y UI en `server/src/service/urgencias.service.test.ts` y `client/src/App.test.tsx`.

## Validaciones

- Server: 8 pruebas PASS.
- Client: 3 pruebas PASS.
- Build server/client PASS.
- SQL→API: 3/3 comparaciones exactas.
- Documentación, portabilidad, reconciliación estática y diff PASS.

## Limitación de entorno

El auxiliar interactivo del navegador falló con `helper_unknown_error`; Edge y Chrome headless no devolvieron DOM. La UI se validó de forma reproducible con React/jsdom y las filas API de la corrida real.

## Pendientes gobernados

- Bandas API/UI de URG-EJ-03, URG-ACT-01 y URG-TRI-03, fuera de ITER-004.
- Decisión institucional sobre AMED, Población, Diagnósticos y Motivo de Urgencia.
- Cierre funcional de URG-PEND-01 y definición de consumidor de URG-CAL-01.

## NO REPETIR

- Reconciliación SQL→API de MOD-05, MOD-09 y TRI-02 para la cohorte cerrada 2026-08-01.
- Auditoría ITER-003 y validaciones funcionales anteriores ya preservadas.

## Próxima acción exacta

Ninguna acción adicional en ITER-004. Los pendientes restantes requieren otra iteración con alcance explícito.

## Commit de cierre

Consolidado en el commit `[URG][API] Exponer resolución frecuentación y clasificación Triage` (ver `git log`).
