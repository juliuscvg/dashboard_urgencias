# ITER-001 — Cerrar validación funcional de Diagnósticos de Urgencias

## Objetivo

Cerrar la iteración de Diagnósticos ya iniciada: conservar el trabajo correcto
existente, completar decisiones/estados/checkpoint/validaciones pendientes,
incorporar el diccionario canónico y no repetir análisis ni consultas ya
resueltas.

## Alcance

- Sólo Diagnósticos (`cdiag_ing`/`diag_ing`, `cdiag_egr`/`diag_egr`) sobre
  U-ING, cohortes cerradas 12/24/36 meses por `Fechaing`.
- No API, no UI, no SQL productivo, no cambios CEX.
- No se reabre Población ni AMED.

## Trabajo preexistente conservado (no repetido)

- `.tmp/diag.json`: cobertura, cruce ingreso/egreso y cardinalidad 12/24/36m.
- `.tmp/diag-detail.json`: detalle de códigos de egreso con 2–4 descripciones.
- `.tmp/diag-egr-disponibilidad.json`: disponibilidad código/descripción de
  egreso (COD_DESC/COD_SIN_DESC/DESC_SIN_COD/NINGUNO) 12/24/36m.
- `.tmp/diag-egr-texto-valores.json`: 6257 eventos con `diag_egr` sin
  `cdiag_egr`, 2842 valores de texto distintos en 36m.
- `docs/evidencia/VALIDACION_DIAGNOSTICOS_2026-09-10.md`: síntesis funcional
  ya redactada con las cifras anteriores.

## Validación pendiente ejecutada en esta iteración

- Única consulta faltante: `codigos_multiples` de egreso (`.tmp/diag-egr-multi.mjs`,
  read-only, mismo pool/config que el resto de scripts de Diagnósticos).
- Resultado confirmado contra fuente: `{"codigos_multiples":507,"min_desc":2,"max_desc":4}`,
  consistente con la cifra ya citada en la evidencia ("507 códigos tienen 2–4
  descripciones").
- No se ejecutó ninguna otra consulta: el resto de cifras de la evidencia ya
  estaba respaldado por los JSON preservados y se verificó por lectura
  cruzada, no por reconsulta a la fuente.

## Decisiones cerradas

- Diagnóstico de ingreso y de egreso son dimensiones independientes; no se
  fusionan ni se deriva uno del otro.
- Código y descripción nativos se conservan tal cual; no se infiere CIE,
  familia clínica, severidad ni concordancia.
- Egreso sin código (`diag_egr` con `cdiag_egr` nulo) se preserva como texto
  no codificado, sin normalizar ni clasificar.
- Un código de egreso puede tener 2–4 descripciones distintas (507 códigos);
  esto es cardinalidad nativa observada, no un defecto a corregir aquí.

## Artefactos de gobierno actualizados en esta iteración

- `docs/gobierno/CHECKPOINT_ACTUAL.md`: iteración marcada COMPLETADA, texto
  corrupto de "Decisiones de inicio" reparado, commit de cierre registrado.
- `docs/gobierno/ESTADO_INDICADORES.md`: `URG-PEND-05` actualizado de
  "Sin contrato suficiente" a estado EN VALIDACIÓN con evidencia, y sección
  de validación 2026-09-10 añadida.
- `docs/gobierno/DECISIONES_Y_CAMBIOS.md`: `URG-GOV-048` documenta el cierre
  funcional de Diagnósticos.
- `docs/indicadores/CONTRATOS_EN_VALIDACION.md`: `URG-DIAG-01..04` añadidos
  (ingreso codificado, egreso codificado, texto de egreso no codificado,
  cobertura/comparación), todos EN VALIDACIÓN, sin KPI ni API/UI.
- `docs/diccionarios/DICCIONARIO_vUrgencias.md`: filas de `cdiag_ing/diag_ing`
  y `cdiag_egr/diag_egr` actualizadas de `NO DOCUMENTADO`/`POR DEFINIR` a su
  semántica validada, con referencia a `URG-PEND-05`/`URG-DIAG-01..04`.

## Criterios de aceptación

- [x] Fast-forward de `main` a `origin/main` sin pérdida de trabajo local.
- [x] Cifra pendiente (507 códigos multi-descripción) verificada contra fuente.
- [x] Checkpoint reparado (sin literales `` `r`n ``) y coherente con el resto
      de la documentación.
- [x] Diccionario canónico incorpora Diagnósticos.
- [x] Estado de indicadores y decisiones reflejan el cierre.
- [x] Working tree limpio tras commit; push realizado.

## Commit de cierre

Ver `docs/gobierno/CHECKPOINT_ACTUAL.md`.
