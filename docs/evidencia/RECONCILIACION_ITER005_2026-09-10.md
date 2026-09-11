# Reconciliación ITER-005 — Bandas EJ-03, ACT-01 y TRI-03

Fecha: 2026-09-10 (America/Mexico_City).

## Alcance y método

Se ejecutaron en modo read-only los SQL canónicos aceptados de `URG-EJ-03`, `URG-ACT-01` y `URG-TRI-03` contra `dbo.vUrgencias`. Con los mismos filtros se consultaron `/api/urgencias/summary` y `/api/urgencias/triage`, y se compararon los campos numéricos antes de cualquier formato de presentación.

- Cohorte U-ING: `2026-08-01` a `2026-08-01`, sin filtro de centro o servicio.
- Corte reproducible de ACT-01: `2026-09-09T21:03:28.000Z`.
- Resultado: **3/3 comparaciones exactas**.
- El artefacto JSON no contiene secretos ni identificadores directos.

## Resultados

### URG-EJ-03 — Permanencia registrada

| Campo | SQL/API |
|---|---:|
| Universo | 354 |
| Evaluables | 354 |
| Invertidos | 0 |
| Sin egreso | 0 |
| Promedio | 61.33 h |
| <12 h | 204 |
| 12–<24 h | 40 |
| 24–<48 h | 42 |
| 48–72 h | 13 |
| >72 h | 55 |

Las cinco bandas exclusivas suman exactamente 354 evaluables. Los extremos válidos se preservan.

### URG-ACT-01 — Activos probables

| Campo | SQL/API |
|---|---:|
| Activos probables | 255 |
| Antigüedad no evaluable | 0 |
| Ingreso futuro al corte | 213 |
| >24 h | 21 |
| >48 h | 19 |
| >72 h | 17 |

Las señales de antigüedad son acumulativas y cumplen `>72 ≤ >48 ≤ >24`. Los 213 ingresos posteriores al corte fijo se conservan como señal de consistencia; no se excluyen ni corrigen. ACT-01 sigue sujeto a la limitación de fuente viva sin snapshot.

### URG-TRI-03 — Tiempo registrado a Triage

| Campo | SQL/API |
|---|---:|
| Universo | 354 |
| Con Triage | 51 |
| Evaluables | 51 |
| Invertidos | 0 |
| Promedio | 44.41 min |
| Mismo minuto | 0 |
| 1–10 min | 18 |
| 11–30 min | 14 |
| 31–60 min | 12 |
| 61–120 min | 2 |
| 121–240 min | 3 |
| >240 min | 2 |
| ≥24 h | 0 |
| ≥7 días | 0 |

Las siete bandas exclusivas suman exactamente 51 secuencias evaluables. No se renombra la métrica como tiempo de espera.

## Reproducción

1. Compilar: `npm run build`.
2. Iniciar la API con la configuración local autorizada.
3. Ejecutar `node scripts/run-iter005-reconciliation.mjs --api http://localhost:3002/api --output .tmp/iter005-reconciliation.json`.
4. Comparar o preservar el artefacto y ejecutar `node scripts/check-iter005-reconciliation.mjs`.

La prueba de UI renderiza las proyecciones API preservadas y verifica los tres conjuntos de bandas y su contexto semántico.
