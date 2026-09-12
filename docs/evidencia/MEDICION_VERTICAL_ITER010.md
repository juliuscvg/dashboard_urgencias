# Medición de longitud vertical — ITER-010

Objetivo: verificar que la arquitectura de perspectivas redujo significativamente
la longitud vertical respecto de la página vertical única anterior.

## Método

- Se sirvió el **build real** del cliente (`vite build`) en ambos casos.
- Viewport de referencia: **1440 × 1000 px**, sin barras de desplazamiento.
- La altura es `document.documentElement.scrollHeight` medida en el navegador
  tras la carga completa, no una estimación.
- Ambas versiones se midieron con **las mismas cifras**, servidas desde las
  reconciliaciones ya versionadas (ITER-004, ITER-005, ITER-009). El baseline
  recibió además el listado de 20 episodios que sí precargaba, para no
  exagerar la reducción.
- Script reproducible: [`scripts/capture-perspectives.mjs`](../../scripts/capture-perspectives.mjs).
  El baseline se construyó desde `HEAD~1` (`267e7c4`, previo a ITER-010).

## Resultado

| Vista | Altura | Viewports de 1000 px | Diferencia vs. baseline |
|---|---|---|---|
| Baseline — página vertical única (ITER-009) | **5 066 px** | 5.07 | — |
| Operación | **2 320 px** | 2.32 | **−54.2 %** |
| Población | **849 px** | 0.85 | **−83.2 %** |
| Indicadores de desempeño | **849 px** | 0.85 | **−83.2 %** |

La perspectiva más larga (Operación) mide **menos de la mitad** que la página
anterior, y las otras dos caben en un solo viewport sin desplazamiento. La
reducción es real y no proviene de eliminar información: los mismos módulos
siguen presentes, repartidos entre las tres perspectivas.

Contribuyen a la reducción, además del reparto en perspectivas, la densidad del
lenguaje visual homologado con CEX (rejillas de dos columnas donde antes había
una sola) y el hecho de que el listado de eventos dejó de precargarse: ahora vive
en el drawer de detalle, que se carga bajo demanda.

## Capturas

Reales, del build servido, en [capturas/ITER-010/](capturas/ITER-010/):

| Archivo | Contenido |
|---|---|
| `operacion.png` | Perspectiva Operación completa |
| `poblacion.png` | Perspectiva Población, con el perfil demográfico declarado no implementado |
| `desempeno.png` | Perspectiva Indicadores de desempeño |
| `baseline-pagina-vertical.png` | Página vertical única anterior, para comparación |

Las capturas son **evidencia para revisión humana, no especificación funcional**.

## Limitación declarada

La base de datos (`10.2.1.9:1433`) no fue alcanzable desde este entorno durante
la iteración. Las capturas y la medición se produjeron sirviendo la API con las
cifras ya reconciliadas y versionadas en este directorio, no con datos
inventados ni con una conexión a fuente. Esto es suficiente para medir longitud
vertical y revisar la composición visual, y **no** sustituye una reconciliación
SQL→API contra fuente, que esta iteración no requería por no haber cambiado
ninguna consulta ni cifra.
