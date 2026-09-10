# Checkpoint actual

## Proyecto
Dashboard Urgencias HCG

## Última actualización
2026-09-10, America/Mexico_City

## Rama
main

## HEAD base de la iteración
bd49403a1ed324946b7db7aa6b7f62a99feadc9f

## HEAD actual
El commit que contiene este checkpoint se resuelve con `git log -1 --format=%H -- docs/gobierno/CHECKPOINT_ACTUAL.md`.

## Iteración actual
Adenda de configuración local: API de Urgencias en puerto 3002.

## Objetivo
Asegurar que backend y proxy Vite respeten `API_PORT=3002`, sin versionar `.env`, exponer secretos ni ampliar el alcance funcional.

## Estado de la iteración
COMPLETADA

## Fase actual
Configuración versionada, verificación local y documentación consolidadas; no se realizó push.

## Completado
- [x] Cierre funcional AMED versionado en `bd49403`; U-ING no exige hitos posteriores.
- [x] `.env` confirmado ignorado y no tracked, sin lectura ni exposición de su contenido.
- [x] Valor predeterminado versionado de `API_PORT` ajustado a 3002 y ejemplo local alineado.
- [x] Vite carga sólo variables `API_*` del `.env` raíz, evita `DB_*` y permite `API_PROXY_TARGET` explícito.
- [x] API verificada en 3002 mediante `/api/health`.
- [x] Proxy Vite verificado contra la API en 3002 mediante `/api/health`.
- [x] CEX no fue modificado.

## Última acción completada
Verificación efímera de API y proxy en el puerto 3002; ambos procesos se detuvieron al terminar.

## Próxima acción exacta
No realizar acciones adicionales en esta iteración. Toda continuación parte de esta configuración versionada; no hacer push sin instrucción explícita.

## Decisiones vigentes
- Urgencias usa 3002 como valor versionado predeterminado; la configuración local puede cambiarlo con `API_PORT`.
- El proxy toma `API_PROXY_TARGET` si se define; de lo contrario usa `API_PORT` con valor 3002.
- `.env` no se agrega al repositorio ni se documentan secretos o valores sensibles.
- La adenda no cambia contratos funcionales ni implementación de indicadores.

## Pendientes
- Aceptación institucional de cualquier indicador de Alta Médica.
- Semántica clínica u operativa que relacione Alta Médica registrada y egreso administrativo.
- Decisión posterior sobre si la secuencia completa merece un KPI independiente.
- API/UI de Alta Médica, fuera de alcance.

## Bloqueadores
Ninguno para esta adenda local.

## NO REPETIR
- Auditoría transversal y descubrimiento de `vUrgencias`.
- Reconciliación de los 14 indicadores implementados.
- Medición AMED de cobertura, diferencias y secuencia en cohortes 12/24/36 meses ya registrada.
- Investigación exhaustiva de inversiones que no cambie el contrato vigente.
- Verificación de API 3002 y proxy Vite ya registrada, salvo cambio posterior de configuración.

## Contexto mínimo para reanudación
Urgencias está configurado localmente para API 3002 y Vite resuelve el proxy desde variables `API_*` del entorno. Alta Médica no es KPI aceptado ni tiene API/UI; la secuencia completa es análisis complementario y U-ING no exige hitos posteriores.

## Commit de cierre
Consolidado localmente en el commit que contiene este checkpoint; sin push.