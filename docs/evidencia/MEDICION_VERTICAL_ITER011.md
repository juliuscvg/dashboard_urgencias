# Medición de longitud vertical — ITER-011

Objetivo: verificar que la compactación visual/UX de Operación redujo su
altura respecto de ITER-010, en las mismas condiciones de medición, sin quitar
acceso a la información reubicada.

## Método

Idéntico al de [ITER-010](MEDICION_VERTICAL_ITER010.md), para que la
comparación sea válida:

- Se sirvió el **build real** del cliente (`vite build`) del estado actual del
  repositorio.
- Viewport de referencia: **1440 × 1000 px**, sin barras de desplazamiento.
- La altura es `document.documentElement.scrollHeight` medida en el navegador
  tras la carga completa, no una estimación.
- Mismas cifras que ITER-010: las reconciliaciones ya versionadas (ITER-004,
  ITER-005, ITER-009), servidas por el mismo script.
- Script reproducible: [`scripts/capture-perspectives.mjs`](../../scripts/capture-perspectives.mjs),
  sin cambios respecto de ITER-010.
- Comando: `node scripts/capture-perspectives.mjs client/dist docs/evidencia/capturas/ITER-011 operacion=operation`.

## Resultado

| Vista | Altura | Viewports de 1000 px | Diferencia vs. ITER-010 | Diferencia vs. baseline |
|---|---|---|---|---|
| Baseline — página vertical única (ITER-009) | 5 066 px | 5.07 | — | — |
| Operación — ITER-010 | 2 320 px | 2.32 | — | −54.2 % |
| **Operación — ITER-011** | **1 705 px** | **1.71** | **−26.5 %** | **−66.3 %** |

## Qué produjo la reducción

- La clasificación nativa de Triage, la cobertura de Triage y de Atención
  médica por servicio, y el desglose con porcentaje del destino de los
  eventos dejaron de ocupar bloques permanentes: se muestran como resumen
  compacto (chips, cobertura, tiempo promedio) con acceso a ficha completa
  bajo demanda (`InfoDrawer.tsx`), reutilizando el mismo patrón visual e
  interactivo del drawer de episodios.
- La banda "Ingreso futuro" se retiró de la rejilla de Activos probables y se
  presenta como una única línea de advertencia condicional en vez de una
  tarjeta más en la cuadrícula.
- El gráfico "Atenciones por día" redujo su altura de 190 px a 138 px.
- Ninguna cifra, categoría, banda ni advertencia se eliminó: todo lo retirado
  del bloque permanente sigue siendo accesible con un clic, y las capturas del
  drawer no fueron necesarias para esta medición porque `InfoDrawer` no
  cambia la altura de la página base (se monta en overlay, sin desplazar el
  documento).

## Capturas

Real, del build servido, en [capturas/ITER-011/](capturas/ITER-011/):

| Archivo | Contenido |
|---|---|
| `operacion.png` | Perspectiva Operación completa, compactada (ITER-011) |

Población y Desempeño no se tocaron en esta iteración; sus capturas y
mediciones vigentes siguen siendo las de
[ITER-010](capturas/ITER-010/) (849 px cada una).

Las capturas son **evidencia para revisión humana, no especificación
funcional**.

## Limitación declarada

La base de datos (`10.2.1.9:1433`) no fue alcanzable desde este entorno. La
captura y la medición se produjeron sirviendo el build real con las cifras ya
reconciliadas y versionadas usadas desde ITER-010, no con datos inventados ni
con conexión a fuente. Es suficiente para medir longitud vertical y revisar la
composición visual, y no sustituye una reconciliación SQL→API contra fuente,
que esta iteración no requería por no haber cambiado ninguna consulta ni
cifra.
