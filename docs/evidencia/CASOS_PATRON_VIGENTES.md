# Casos patrón — revisión R2 (2026-09-07)

DISEÑADOS / NO EJECUTADOS. No fixtures reales ni tests clínicos ejecutados. Diseños R1 íntegros en [baseline](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/evidencia/CASOS_PATRON_VIGENTES.md). IDs /R2 distinguen cambios de esperado. Evidencia de regla: [contexto](../historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt), no ejecución SQL.

Contrato común: dataset sintético sin identificadores reales; entidades distintas salvo duplicado explícito; centro/servicio sintéticos sin hardcode productivo; configuración [criterios vigentes](../../config/criterios-funcionales.json), sin exclusiones adicionales. Periodo/corte concretos indicados por caso o por fijar antes de materializar. Universo por regla citada. Esperados derivan de reglas/diseño, no de resultados de la corrida. Obtenido y commit probado: NO DOCUMENTADO; ejecuciones0. Tolerancia para conteos0; precisión de tiempos por validar antes de ejecución.

## URG-CP-01/R2 — Granularidad

- Regla/universo: URG-R01, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Dos filas del mismo epis_pk y mismo id_urgencia, una repetición idéntica; variante contradictoria adicional.
- Esperado independiente/reconciliación: Detectar repetición/variante; no afirmar 3 episodios ni seleccionar fila arbitraria; pendiente esperado numérico hasta regla de representación.
- Relación histórica: Conserva objetivo 01; reemplaza episodio_pk.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-02/R2 — Periodo y ventana

- Regla/universo: URG-R02, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Periodo [2026-09-01,2026-09-08); eventos exactamente en inicio, antes de fin y en fin; corte 2026-09-07T12:00.
- Esperado independiente/reconciliación: Primeros dos dentro, tercero fuera; ventana propuesta inicia 2023-09-07T12:00; anterior consultable con aviso, no eliminado.
- Relación histórica: Amplía 02 con ventana móvil.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-03/R2 — Estados

- Regla/universo: URG-R03, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Cuatro episodios únicos con las cuatro combinaciones nulo/no nulo de fechaegr y motivo_alta_pk.
- Esperado independiente/reconciliación: Activos1; deuda1 fuera del actual; finalizados2. Abiertos2=activo1+deuda1.
- Relación histórica: Conserva 03.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-04/R2 — Antigüedad actual

- Regla/universo: URG-R03, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Cuatro activos evaluables con24,48,72,96 horas; dos activos con Fechaing nula/futura.
- Esperado independiente/reconciliación: Total 6; evaluables 4 / no evaluables 2; >24=3, >48=2, >72=1. Un extremo válido adicional de años se conserva; no truncar por 3/5 años.
- Relación histórica: Reemplaza 04 histórico >5 años ejecutivo.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-05/R2 — Flujo/cobertura

- Regla/universo: URG-R04/R10, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Tres episodios: triage ausente, nivel sin fecha, fecha con responsable ausente; par invertido y cero en conjunto aparte.
- Esperado independiente/reconciliación: Los 3 episodios permanecen en universo; coberturas por componente distintas; invertido no evaluable para duración, cero evaluable; no sumar flags como episodios.
- Relación histórica: Amplía 05.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-06/R2 — Permanencia

- Regla/universo: URG-R05, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Seis completados evaluables de 0,12,24,48,72,73 horas; un abierto de96 horas aparte.
- Esperado independiente/reconciliación: Rangos 1/1/1/2/1; suma 229 h; promedio 229/6 h. El abierto no participa. Extremo73 incluido; no redondeo previo.
- Relación histórica: Reemplaza 06 y parte 11.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-07/R2 — Antecedente

- Regla/universo: URG-R06, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Egreso 2026-08-31T23:00 y nuevo registro 2026-09-01T01:00, mismo paciente/servicio; otro retorno a distinto servicio.
- Esperado independiente/reconciliación: El primero es candidato2 h aunque antecedente fuera del periodo iniciado septiembre; distinto servicio no. Múltiples egresos/empates quedan no evaluables hasta resolver algoritmo.
- Relación histórica: Modifica 07; no algoritmo inventado.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-08/R2 — Fronteras retorno

- Regla/universo: URG-R06, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Pares inequívocos con t=0,0.01,24,24.01,48,48.01,71.99,72,-1 horas.
- Esperado independiente/reconciliación: Seis dentro <72; bandas 2/2/2;0/72/-1 excluidos. Referencia hasta 48 propuesta 4.71.99 puede mostrarse72 pero clasificación permanece.
- Relación histórica: Reemplaza 08:72 ya resuelto.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-09/R2 — Grupos/identidad

- Regla/universo: URG-R07, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Edades exactas0,1,6,13,18,30,45,60,75; nula y negativa; paciente repetido.
- Esperado independiente/reconciliación: Una por cada 9 grupos, dos no evaluables; paciente repetido no duplica únicos; edad fuente discordante pendiente de precedencia.
- Relación histórica: Amplía 09.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-10/R2 — Contexto/detalle/exportación

- Regla/universo: URG-R13, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Filtro centro/servicio, categoría48–72 y página; exportar agregado/episodios con mismo contexto; count falla.
- Esperado independiente/reconciliación: Mismo predicado/categoría en todas las salidas; filas visibles se conservan; no PASS reconciliado si difieren; datos personales sólo autorizados.
- Relación histórica: Amplía 10.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-11/R2 — Stock vs periodo

- Regla/universo: URG-R02/R03/R05, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Activo anterior a tres años sin motivo; egreso en periodo con registro anterior; alta médica sin egreso.
- Esperado independiente/reconciliación: Stock no truncado; egreso U-EGR puede no pertenecer U-ING; alta médica no imputa egreso; censo retrospectivo no se declara reconstruible.
- Relación histórica: Amplía 11.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-12/R2 — Promedio diario/comparación

- Regla/universo: URG-R08, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Periodo hipotético completo de 2 días con 10 y 0 registros; previo0; proporciones20%/10%; tiempos3h/2h.
- Esperado independiente/reconciliación: Bajo candidato diario 10/2=5, nunca 10/1; variación relativa de conteos con base0 no calculable; +10 pp y +1 h. Día parcial pendiente.
- Relación histórica: Nuevo; esperado condicional explícito.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-13/R2 — Servicios y turnos

- Regla/universo: URG-R09/R12, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Servicio activo área 2 con flag serv_ing_urg_sn=0; otro área distinta; HCO sin/con actividad;07:59:59,08:00,14:00,20:00.
- Esperado independiente/reconciliación: Primero elegible aunque flag 0; otro fuera; HCO dinámico sin hardcode, sin actividad SIN DATOS. Turnos N/M/V/N.
- Relación histórica: Nuevo.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-14/R2 — Destino/motivo

- Regla/universo: URG-R11, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Mismo destino con dos motivos; motivo presente sin egreso; código destino sin mapear.
- Esperado independiente/reconciliación: Destino no se divide por motivo salvo cruce explícito; deuda fuera actual; sin mapear no inferir Hospitalización/Otros. Esperados por código pendientes de catálogo.
- Relación histórica: Nuevo.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-15/R2 — Triage/estados

- Regla/universo: URG-R10/R13, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Actividad sin triage; HCO sin actividad; contexto donde una métrica no aplica por definición.
- Esperado independiente/reconciliación: Actividad conserva universo y cobertura triage0; métrica que necesite triage DATOS INSUFICIENTES. HCO SIN DATOS; tercero NO APLICA sólo con contrato.
- Relación histórica: Nuevo.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.

## URG-CP-16/R2 — Clínica/personal

- Regla/universo: URG-R12, [contrato](../REGLAS_NEGOCIO.md).
- Entrada/escenario: Top5 de 6 categorías, texto libre, médico y usuarios triage/registro distintos.
- Esperado independiente/reconciliación: Top5 + resto reconcilia universo; libre sólo detalle/búsqueda; actividad asociada sin ranking mejor/peor; staff/usuarios separados.
- Relación histórica: Nuevo.
- Estado: DISEÑADO / NO EJECUTADO; condiciones pendientes no habilitan PASS.
