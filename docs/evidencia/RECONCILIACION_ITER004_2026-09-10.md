# Reconciliación ITER-004 — 2026-09-10

**Alcance:** capas API/UI de URG-MOD-05, URG-MOD-09 y URG-TRI-02. No se modificaron contratos, universos, fórmulas ni SQL canónicos.

## Contexto

La corrida usa la cohorte cerrada `2026-08-01` a `2026-08-01`, sin filtro de centro o servicio, con U-ING como universo. Cada SQL aceptado se ejecutó directamente contra la fuente y se comparó con su respuesta HTTP usando los mismos parámetros.

| Indicador | SQL | API | Filas | Resultado |
|---|---|---|---:|---|
| URG-MOD-05 | `URG-MOD-05_RESOLUCION.sql` | `/api/urgencias/resolution` | 8 | EXACTO |
| URG-MOD-09 | `URG-MOD-09_FRECUENTACION.sql` | `/api/urgencias/frequentation` | 2 | EXACTO |
| URG-TRI-02 | `URG-TRI-02_CLASIFICACION.sql` | `/api/urgencias/triage` | 5 | EXACTO |

Las tres comparaciones fueron exactas, sin diferencias numéricas ni de orden.

## URG-MOD-05

La distribución de destino conserva las ocho combinaciones nativas de clave/descripción y suma 354 eventos. La API mantiene cuatro decimales, separa N.E. clave 99 y preserva la posibilidad de NULL. La UI muestra todas las categorías recibidas y no fusiona destino con motivo de alta.

## URG-MOD-09

La distribución conserva las bandas aceptadas `1`, `2`, `3`, `4-5`, `6-10`, `11+`. En la cohorte sólo tuvieron población las bandas 1 (322 pacientes) y 2 (16 pacientes); las bandas sin pacientes no se fabrican. La UI describe frecuentación sin juicio de uso.

## URG-TRI-02

La distribución nativa contiene 51 eventos clasificados: códigos 1 a 5 en la cohorte; el código 6 no tuvo eventos y no se fabrica. Los porcentajes usan como denominador los clasificados. La misma respuesta conserva la cobertura vigente de 14.41% sobre U-ING; ausencia de clasificación no se elimina del universo de cobertura.

## UI y validaciones

La prueba `client/src/App.test.tsx` toma las filas API del artefacto de esta corrida y verifica el renderizado de Destino, Frecuentación y Clasificación nativa. La compilación cliente valida los tipos y rutas. La automatización interactiva del navegador no estuvo disponible por fallo del auxiliar local; Edge y Chrome headless tampoco devolvieron DOM, por lo que la comprobación reproducible se realizó con React + jsdom.

El [artefacto JSON](RECONCILIACION_ITER004_2026-09-10.json) no contiene secretos ni identificadores directos. Runner: `scripts/run-iter004-reconciliation.mjs`; control: `scripts/check-iter004-reconciliation.mjs`.
