# Handoff para otro agente / otra IA

Este documento existe para satisfacer el criterio transversal `HCG-POR-001`:

> Un dashboard se considera portable sólo si puede ser reconstruido, auditado y
> continuado por otro agente a partir exclusivamente del repositorio, sin
> depender de memoria de chat, prompts históricos ni conocimiento tácito del
> desarrollador.

Si eres un agente que llega sin historial de conversación: **este archivo es tu
punto de entrada**. No necesitas nada más que este repositorio. No infieras
decisiones: si algo no está escrito aquí o en los documentos enlazados, no está
decidido, y proponerlo requiere decisión institucional.

No se duplica contenido: todo lo sustantivo vive en los documentos enlazados y
en [`config/dashboard-manifest.json`](../config/dashboard-manifest.json).

---

## 1. Qué archivos leer

| # | Archivo | Para qué |
|---|---|---|
| 1 | [`config/dashboard-manifest.json`](../config/dashboard-manifest.json) | Índice machine-readable: versiones, rutas canónicas, perspectivas, contratos visuales, referencia a `dashboard_hcg_specs` |
| 2 | [`docs/gobierno/CHECKPOINT_ACTUAL.md`](gobierno/CHECKPOINT_ACTUAL.md) | Dónde quedó la última iteración y cuál es la próxima acción exacta |
| 3 | [`AGENTS.md`](../AGENTS.md) | Cómo se trabaja aquí: fuente de verdad, failover, cierre |
| 4 | [`docs/RECONSTRUIR_DASHBOARD.md`](RECONSTRUIR_DASHBOARD.md) | Índice de reconstrucción semántica |
| 5 | [`docs/gobierno/ESTADO_INDICADORES.md`](gobierno/ESTADO_INDICADORES.md) | Qué está ACEPTADO, EN VALIDACIÓN, POR DEFINIR o DIFERIDO |
| 6 | [`docs/indicadores/CONTRATOS_ACEPTADOS.md`](indicadores/CONTRATOS_ACEPTADOS.md) | Definición, universo, numerador/denominador, NULL y SQL de cada indicador |
| 7 | [`docs/REGLAS_NEGOCIO.md`](REGLAS_NEGOCIO.md) | Reglas de dominio: universos U-ING/U-ACT/U-RET, ventanas, exclusiones |
| 8 | [`docs/diccionarios/FUENTES_Y_GRANULARIDAD.md`](diccionarios/FUENTES_Y_GRANULARIDAD.md) y [`DICCIONARIO_vUrgencias.md`](diccionarios/DICCIONARIO_vUrgencias.md) | Fuentes, roles, granularidad y campos |
| 9 | [`scripts/sql/indicadores/`](../scripts/sql/indicadores/README.md) | SQL canónico verificable, read-only, por indicador |
| 10 | [`docs/ARQUITECTURA_UI.md`](ARQUITECTURA_UI.md) | Arquitectura de interfaz vigente: perspectivas y contratos visuales |
| 11 | [`docs/gobierno/DECISIONES_Y_CAMBIOS.md`](gobierno/DECISIONES_Y_CAMBIOS.md) y [`TRAZABILIDAD.md`](gobierno/TRAZABILIDAD.md) | Por qué las cosas son como son, y el recorrido regla→SQL→API→UI→evidencia |
| 12 | [`docs/evidencia/`](evidencia/README.md) y [`BENCHMARKS_VIGENTES.md`](evidencia/BENCHMARKS_VIGENTES.md) | Cifras reconciliadas contra fuente; base de la equivalencia semántica |
| 13 | [`docs/DESCUBRIMIENTOS_Y_LIMITACIONES.md`](DESCUBRIMIENTOS_Y_LIMITACIONES.md) | Qué NO se puede concluir con esta fuente |

## 2. En qué orden

1. Manifiesto → checkpoint → `AGENTS.md`. Con esto sabes estado y método.
2. `git log --oneline -10`, `git status`, `git diff`. **Git manda sobre cualquier
   documento**; si el checkpoint y Git discrepan, resuelve sólo esa discrepancia.
3. Estado de indicadores → contratos → reglas de negocio. Nunca al revés: el
   estado dice qué está vivo, el contrato dice qué significa.
4. Fuentes y diccionario, antes de tocar cualquier SQL.
5. El SQL canónico del indicador concreto que vas a tocar, y sólo ese.
6. Arquitectura UI, sólo si vas a tocar la interfaz.
7. Evidencia y benchmarks, al validar.

No leas `docs/` completo. Usa búsquedas dirigidas por indicador, símbolo o ruta.

## 3. Qué documentos son autoridad

Orden de precedencia; el de arriba gana ante cualquier conflicto:

1. **Git / GitHub** — historia y working tree son la fuente de verdad.
2. **`docs/indicadores/CONTRATOS_ACEPTADOS.md`** — autoridad semántica de cada
   indicador (universo, fórmula, NULL, exclusiones).
3. **`docs/gobierno/ESTADO_INDICADORES.md`** — autoridad sobre qué está aceptado.
4. **`docs/gobierno/DECISIONES_Y_CAMBIOS.md`** — autoridad sobre el porqué.
5. **`docs/REGLAS_NEGOCIO.md`** y diccionarios — autoridad sobre dominio y fuente.
6. **`scripts/sql/indicadores/*.sql`** — implementación canónica verificable.
7. **`docs/gobierno/CHECKPOINT_ACTUAL.md`** — autoridad sobre el estado operativo
   de la iteración, no sobre semántica.

Lo que **no** es autoridad: las capturas de pantalla, el código de presentación,
los nombres de clases CSS, este handoff y cualquier resumen. Son índices o
evidencia de revisión humana.

## 4. Qué reglas son transversales (reutilizables en otros dominios)

Provienen de [`dashboard_hcg_specs`](https://github.com/juliuscvg/dashboard_hcg_specs)
y **no** son propiedad de Urgencias. La referencia versionada vigente está en el
manifiesto (`hcgSpecs.commit`). El registro de qué adoptó Urgencias, con qué
límite y con qué evidencia, está en
[`docs/gobierno/ADOPCION_HCG.md`](gobierno/ADOPCION_HCG.md) y
[`config/adopcion-hcg.json`](../config/adopcion-hcg.json).

Familias transversales: `HCG-ANA-*` (principios analíticos), `HCG-TEM-*`
(temporalidad), `HCG-CAL-*` (calidad y anomalías), `HCG-UX-*` (UX funcional),
`HCG-FIL-*` (filtros y navegación), `HCG-DET-*` (detalle y auditoría),
`HCG-VAL-*` (validación y benchmarks), `HCG-TRZ-*` (trazabilidad),
`HCG-VIS-*` (perspectivas y homologación visual) y `HCG-POR-*` (portabilidad).

Estas sí puedes trasladarlas a otro dashboard HCG, registrando la adopción en el
repositorio de especificaciones.

## 5. Qué reglas son locales y NO deben transferirse

Son decisiones de dominio de Urgencias. **No las generalices, no las copies a
otro dashboard y no asumas que valen fuera de aquí.** Tampoco provienen de CEX:
de CEX se tomó lenguaje visual, nunca reglas de negocio.

- Universo `U-ING`: evento con `id_urgencia` y `Fechaing` en el periodo
  semiabierto, sobre servicios con `codigo_area = 2` y `serv_activo_sn = 1`.
- Granularidad: un evento por `id_urgencia`, con conflicto de identidad y
  multiplicación física visibles.
- `codigo_cliente` como identidad de paciente y `codigo_servicio_ingreso` como
  servicio de pertenencia.
- Destino `destino_urg_pk = 5` (`HOSP. PISO`) como definición de hospitalización.
- Activo probable: sin `fechaegr` y sin `motivo_alta_pk` al corte, sin periodo.
- Ventanas de reingreso estrictas `<72 h` y `<48 h` sobre el egreso previo válido
  más reciente del mismo paciente y servicio.
- Triage, `fechatri`, `fechaate` y sus bandas: son hitos **registrados**. El
  intervalo desde el ingreso no es "tiempo de espera" ni "oportunidad", y no
  acredita inicio clínico real.
- Señales de `URG-CAL-01`: son calidad del dato, nunca desempeño.

Cualquier dashboard que copie estas reglas estará produciendo cifras incorrectas
para su propio dominio.

## 6. Cómo continuar una nueva iteración

1. `git status`, `git diff`, `git diff --cached`, `git log --oneline -5`. Si hay
   trabajo local sin terminar, **consérvalo**: no ejecutes `reset`, `restore`,
   `clean`, `checkout .`, `stash`, `rebase` ni `pull` antes de inspeccionarlo.
2. Lee el checkpoint y la iteración vigente en [`docs/iteraciones/`](iteraciones/README.md).
3. Determina qué quedó terminado y continúa **sólo desde lo faltante**. No
   reinicies ni redescubras decisiones ya documentadas.
4. Especifica la iteración nueva en `docs/iteraciones/ITER-XXX.md`.
5. Implementa sin cambiar reglas clínicas, universos, fórmulas ni denominadores,
   sin abrir fuentes nuevas y sin inventar metas ni semáforos. Un indicador nuevo
   requiere decisión institucional registrada como `URG-GOV-0XX`.
6. Valida (sección 7) y actualiza contratos, estados, decisiones, trazabilidad,
   evidencia y checkpoint.
7. Cierra con commit y push, y deja el working tree limpio o declara el bloqueo.

Lo transversal va a `dashboard_hcg_specs` en un commit separado; lo específico de
Urgencias se queda aquí. `dashboard_cex` es referencia y no se modifica.

## 7. Cómo validar que una reconstrucción es semánticamente equivalente

Compilar, responder HTTP o parecerse visualmente **no** acredita equivalencia
(`HCG-POR-008`). Una reconstrucción es equivalente si:

1. `npm run docs:check-portability` y `npm run docs:check-links` pasan sin errores.
2. `npm test` y `npm run build` pasan (servidor y cliente).
3. Para cada indicador `ACEPTADO`, el SQL canónico de
   `scripts/sql/indicadores/` ejecutado con los mismos parámetros reproduce las
   cifras versionadas en [`docs/evidencia/`](evidencia/README.md) —
   especialmente las reconciliaciones ITER-004, ITER-005 y ITER-009, que
   conservan sus artefactos JSON.
4. La API devuelve exactamente esas cifras (reconciliación SQL→API), y la UI
   muestra exactamente las de la API (reconciliación API→UI).
5. El total de cada recorte de detalle coincide con el agregado que lo abre; si
   no coincide, la interfaz debe **mostrar** la discrepancia, no corregirla.
6. Las anomalías, NULL, extremos y categorías nativas se conservan sin recorte,
   fusión ni sustitución por cero.
7. Ningún indicador `EN VALIDACIÓN`, `POR DEFINIR` o `DIFERIDO` aparece como
   implementado, y ninguna perspectiva sin contrato aceptado se rellena con datos
   aproximados.

Una diferencia numérica frente a la evidencia versionada es un fallo de
equivalencia, no una mejora, salvo que exista una decisión que la explique.

## 8. Límite conocido de este paquete

`scripts/check-portability.mjs` verifica estructura, rutas, componentes
esenciales y coherencia del manifiesto; **no** puede verificar cifras sin acceso
a la base de datos. Los puntos 3 y 4 de la sección anterior requieren un entorno
con acceso read-only autorizado a la fuente.
