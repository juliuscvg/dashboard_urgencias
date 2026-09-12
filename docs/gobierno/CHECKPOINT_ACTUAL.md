# Checkpoint actual

## Proyecto

Dashboard Urgencias HCG

## Última actualización

2026-09-11, America/Mexico_City

## Rama

main

## HEAD base de la iteración

bf44792609153615ed61bae9b096de85063fe58e

## Iteración actual

Cierre del gap UI de URG-TRI-03 (tiempos ≥24h/≥7d) bajo el contrato URG-CAL-01. Ver [ITER-008](../iteraciones/ITER-008.md).

## Estado de la iteración

COMPLETADA

## Completado

- [x] `tiemposMayorIgual24h`/`tiemposMayorIgual7d` presentados como advertencia de calidad condicional (`notice quality`) en el panel de Triage, con el mismo estilo visual que la señal de EJ-01.
- [x] Corrección documentada: el gap declarado en ITER-007 fue una lectura incompleta (ambos campos ya se mostraban como texto plano desde antes); el gap real cerrado aquí es de presentación, no de dato ausente.
- [x] Sin cambios en SQL, API, contratos, universos, fórmulas ni umbrales; sin fuentes nuevas ni otros indicadores tocados.
- [x] `URG-CAL-01` actualizado a `RECONCILIADO CON FUENTE`: sus cuatro indicadores dueño (EJ-01, EJ-03, ACT-01, TRI-03) tienen ya todas sus señales visibles en UI.
- [x] Prueba UI dedicada añadida (`App.test.tsx`) que verifica el texto exacto de la advertencia.
- [x] Estados, contrato, trazabilidad, decisión y checkpoint actualizados.

## Evidencia preservada

- [Cierre del gap UI de TRI-03](../iteraciones/ITER-008.md).
- Contrato [URG-CAL-01](../indicadores/CONTRATOS_ACEPTADOS.md).
- No se generó evidencia SQL nueva; se reutilizan los valores ya entregados por `/api/urgencias/triage`.

## Validaciones

- Client: 4 pruebas PASS (incluye la nueva prueba de advertencia URG-CAL-01).
- Server: 9 pruebas PASS (sin cambios; ejecutadas para confirmar que no se tocó nada ahí).
- Build client: `tsc --noEmit && vite build` PASS.
- Build server: `tsc -p tsconfig.build.json` PASS.
- Diff acotado a `client/src/App.tsx` y `client/src/App.test.tsx`.

## Pendientes gobernados

- Decisión institucional sobre AMED, Atención médica, Población, Diagnósticos y Motivo de Urgencia.
- Recomendación futura (no vinculante, de ITER-007): distinguir visualmente en el panel de Activos probables las bandas de anomalía frente a las acumulativas normales.

## NO REPETIR

- Cierre del gap UI de `tiemposMayorIgual24h`/`tiemposMayorIgual7d` de TRI-03 ya preservado en ITER-008.
- Inventario y clasificación de señales de calidad de URG-CAL-01 ya preservados en ITER-007.
- Validaciones y cierres de MOD-05/MOD-09/TRI-02 (ITER-004), bandas EJ-03/ACT-01/TRI-03 (ITER-005) y Atención médica (ITER-006) ya registrados.

## Próxima acción exacta

Ninguna acción adicional en ITER-008. La siguiente iteración sustantiva depende de una decisión institucional de KPI para los bloques EN VALIDACIÓN, o de la recomendación visual no vinculante sobre Activos probables si se autoriza.

## Commit de cierre

Consolidado en el commit `[URG][CAL] Cerrar gap UI de tiempos de Triage` (ver `git log`).
