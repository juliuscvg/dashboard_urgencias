# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-10, America/Mexico_City

## Rama

main

## HEAD base de la iteración

fdadeb39186772b4051228480b78dcd32a4745d8

## Iteración actual

Implementación de las bandas API/UI de URG-EJ-03, URG-ACT-01 y URG-TRI-03. Ver [ITER-005](../iteraciones/ITER-005.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] URG-EJ-03 expone faltantes, inversiones y cinco bandas exclusivas en `/api/urgencias/summary` y UI.
- [x] URG-ACT-01 expone corte reproducible, no evaluables, futuros y señales acumulativas >24/>48/>72 h en `/api/urgencias/summary` y UI.
- [x] URG-TRI-03 expone siete bandas exclusivas en `/api/urgencias/triage` y UI.
- [x] Tres comparaciones SQL canónico→API exactas con los mismos filtros y corte.
- [x] Renderizado UI validado con las proyecciones API reales preservadas.
- [x] Universos, fórmulas, cortes, límites y SQL canónicos sin cambios.
- [x] Sin fuentes ni indicadores adicionales.

## Evidencia preservada

- [Reconciliación ITER-005](../evidencia/RECONCILIACION_ITER005_2026-09-10.md).
- [Resultado SQL/API agregado](../evidencia/RECONCILIACION_ITER005_2026-09-10.json).
- `scripts/run-iter005-reconciliation.mjs` y `scripts/check-iter005-reconciliation.mjs`.
- Pruebas de servicio y UI en `server/src/service/urgencias.service.test.ts` y `client/src/App.test.tsx`.

## Validaciones

- Server: 9 pruebas PASS.
- Client: 3 pruebas PASS.
- Build server/client PASS.
- SQL→API: 3/3 comparaciones exactas.
- Bandas exclusivas y señales acumulativas: invariantes PASS.
- SQL canónico sin cambios.

## Limitaciones vigentes

- ACT-01 permanece limitado por fuente viva sin snapshot y no confirma presencia física.
- EJ-03 y TRI-03 conservan su interpretación como tiempos registrados, con anomalías y extremos visibles.

## Pendientes gobernados

- Decisión institucional sobre AMED, Población, Diagnósticos y Motivo de Urgencia.
- Cierre funcional de URG-PEND-01 y definición de consumidor de URG-CAL-01.

## NO REPETIR

- Reconciliación SQL→API de EJ-03, ACT-01 y TRI-03 para la cohorte 2026-08-01 y corte 2026-09-09T21:03:28.000Z.
- Reconciliaciones ITER-003/004 y validaciones funcionales anteriores ya preservadas.

## Próxima acción exacta

Ninguna acción adicional en ITER-005. Los pendientes restantes requieren otra iteración con alcance explícito.

## Commit de cierre

Consolidado en el commit `[URG][API] Exponer bandas de permanencia activos y Triage` (ver `git log`).
