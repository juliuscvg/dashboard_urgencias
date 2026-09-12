# Reconciliación ITER-009 — Atención médica (URG-ATE-01)

Fecha: 2026-09-11 (America/Mexico_City).

## Alcance y método

Se implementó `URG-ATE-01` como módulo aceptado: cobertura de `fechaate` sobre
U-ING, tiempo registrado `Fechaing→fechaate` con promedio y bandas, y señales
de calidad conforme a `URG-CAL-01`. Se ejecutó en modo read-only el SQL
canónico `URG-ATE-01_ATENCION_MEDICA.sql` contra `dbo.vUrgencias` y, con los
mismos filtros, se consultó `/api/urgencias/attention`; se compararon todos
los campos numéricos (resumen y cobertura por servicio) antes de cualquier
formato de presentación.

- Cohorte U-ING: `2026-08-01` a `2026-08-01`, sin filtro de centro o servicio.
- Resultado: **reconciliación exacta** (resumen y cobertura por servicio).
- El artefacto JSON no contiene secretos ni identificadores directos.
- Cruce adicional de cobertura: se consultó `/api/urgencias/attention` con la
  ventana cerrada de 12 meses (`2025-09-01` a `2026-08-31`) y reprodujo
  exactamente universo (159,822), eventos con `fechaate` (150,415), cobertura
  (94.11%), promedio (109.72 min), mismo instante (1,221) e invertidos (0) ya
  validados en [ITER-006](../iteraciones/ITER-006.md) mediante SQL
  independiente de sólo lectura.

## Resultados (ventana operativa 2026-08-01)

| Campo | SQL/API |
|---|---:|
| Universo | 354 |
| Con fechaate | 335 |
| Sin fechaate | 19 |
| Cobertura | 94.63 % |
| Evaluables | 335 |
| Invertidos | 0 |
| Promedio | 205.46 min |
| Mismo minuto | 1 |
| 0–30 min | 127 |
| 31–60 min | 45 |
| 61–120 min | 49 |
| 121–240 min | 69 |
| >240 min | 44 |
| ≥24 h | 10 |
| ≥7 días | 0 |

Las seis bandas (mismo minuto + 0–30/31–60/61–120/121–240/>240) suman
exactamente 335 evaluables. Los 8 servicios de cobertura por centro/servicio
reconciliaron exactamente contra el SQL canónico.

## Restricciones verificadas

- `fechaate` se agregó al `EventScope` canónico compartido de forma aditiva
  (mismo patrón que `fechatri`); no se alteró `conflicto_nucleo` ni ningún
  otro campo consumido por indicadores existentes.
- No se usó `atencion_fecha` para completar `fechaate`.
- La UI no denomina el intervalo "tiempo de espera" ni "oportunidad
  asistencial", y no afirma inicio clínico real (verificado por prueba
  automatizada y por `scripts/check-iter009-reconciliation.mjs`).
- Sin metas ni semáforos institucionales.
- Sin cambios en otros indicadores, universos, fórmulas ni fuentes.

## Reproducción

1. Compilar: `npm run build`.
2. Iniciar la API con la configuración local autorizada.
3. Ejecutar `node scripts/run-iter009-reconciliation.mjs --api http://localhost:3002/api --output docs/evidencia/RECONCILIACION_ITER009_2026-09-11.json`.
4. Verificar con `node scripts/check-iter009-reconciliation.mjs`.

## Evidencia visual (revisión, no especificación funcional)

Capturas de la aplicación real (ventana `2026-08-01`–`2026-08-01`, sin
filtros) en [docs/evidencia/capturas/ITER-009/](capturas/ITER-009/):

| Archivo | Contenido |
|---|---|
| `01-dashboard-completo.png` | Página completa, de arriba a abajo |
| `02-kpis-resumen.png` | KPIs de Resumen ejecutivo |
| `03-permanencia-activos.png` | Bandas de Permanencia y Activos probables |
| `04-demanda.png` | Demanda diaria y cobertura por servicio |
| `05-triage.png` | Panel de Triage |
| `06-atencion-medica.png` | Panel nuevo de Atención médica (URG-ATE-01) |
| `07-resolucion-frecuentacion.png` | Resolución y Frecuentación |
| `08-trazabilidad-detalle.png` | Detalle de eventos |

Estas capturas documentan cómo se ve la aplicación en este corte; son
evidencia de revisión visual, no una especificación funcional ni un
compromiso de diseño. Sin errores de consola durante la captura.
