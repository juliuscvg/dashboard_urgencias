# ITER-008 — Cerrar el gap UI de URG-TRI-03 (tiempos ≥24h/≥7d)

## Estado

COMPLETADA el 2026-09-11.

## Objetivo

Cerrar exclusivamente el gap UI documentado en [ITER-007](ITER-007.md) para
`URG-TRI-03`: mostrar `tiemposMayorIgual24h` y `tiemposMayorIgual7d` como
advertencia de calidad conforme al contrato `URG-CAL-01`, usando los valores
que ya entrega `/api/urgencias/triage`.

## Autoridad y alcance

- Sólo cliente (`client/src/App.tsx`, `client/src/App.test.tsx`); sin tocar
  `server/src`, SQL, contratos, universos, fórmulas ni umbrales.
- Sin fuentes nuevas ni otros indicadores.
- El endpoint `/api/urgencias/triage` ya entregaba ambos campos sin cambio
  alguno de esta iteración.

## Corrección a ITER-007

Al inspeccionar el código antes de implementar, se encontró que
`tiemposMayorIgual24h`/`tiemposMayorIgual7d` **ya se mostraban como texto**
dentro de un párrafo contextual del panel de Triage (añadido en el commit
`2fdae1c`, anterior a ITER-007). El "gap" declarado en ITER-007 fue una
lectura incompleta del código en ese momento (no se detectó ese texto en la
búsqueda usada entonces). El gap real, cerrado aquí, es distinto: los valores
estaban en texto plano dentro de una oración descriptiva, sin el tratamiento
visual de advertencia de calidad (`notice quality`) que sí reciben
`eventosConConflicto`/`filasMultiplicadas` de EJ-01 desde antes, y se
mostraban siempre (incluso en cero), lo que no comunica una anomalía. Se deja
esta nota para no repetir la afirmación errónea de "sin renderizar".

## Cambio implementado

- `client/src/App.tsx`: se separó el párrafo contextual (sin cifras) de una
  nueva advertencia condicional `<div className="notice quality">`, visible
  sólo cuando `tiemposMayorIgual24h > 0` o `tiemposMayorIgual7d > 0`, con el
  mismo estilo ya usado para la señal de conflicto/fan-out de EJ-01. No se
  agregó campo, fórmula, umbral ni SQL nuevos: reutiliza los mismos dos
  campos que ya entregaba `/urgencias/triage`.
- `client/src/App.test.tsx`: se sustituyeron los valores de evidencia (ambos
  en 0 en la ventana fijada) por valores sintéticos (`7` y `3`) sólo para
  ejercer la rama de advertencia en la prueba, con comentario explícito; se
  añadió una prueba dedicada que verifica el texto exacto de la advertencia.

## Validaciones

- [x] Client: 4 pruebas PASS (incluye la nueva prueba de advertencia URG-CAL-01).
- [x] Server: 9 pruebas PASS (sin cambios; se ejecutan para confirmar que no se tocó nada ahí).
- [x] Build client: `tsc --noEmit && vite build` PASS.
- [x] Build server: `tsc -p tsconfig.build.json` PASS.
- [x] `git diff` acotado a `client/src/App.tsx` y `client/src/App.test.tsx`.

## Restricciones cumplidas

- [x] Sin cambios de SQL, API, contratos, universos, fórmulas ni umbrales.
- [x] Sin fuentes nuevas ni otros indicadores tocados.
- [x] Sin meta ni semáforo institucional: la advertencia es binaria
      (aparece/no aparece) sobre los mismos dos campos ya aceptados en
      `URG-TRI-03`, sin clasificar severidad ni fijar objetivo.
- [x] Presentación reutiliza el patrón visual de advertencia de calidad ya
      existente para EJ-01 (`notice quality`), consistente con `URG-CAL-01`.

## Cierre

- [x] Contrato `URG-CAL-01`, estado, trazabilidad, decisión y checkpoint actualizados.
- [x] Commit y push a `main`.
- [x] Working tree limpio.
