# Contratos en validación — hitos temporales

- Dominio: Urgencias HCG.
- Fuente primaria: `dbo.vUrgencias`.
- Universo general: U-ING, un evento por `id_urgencia` con `Fechaing` en el periodo y servicio canónico aplicable.
- Jerarquía: Ingreso, Triage y Egreso son hitos principales; Atención médica y Alta Médica son complementarios.
- Regla común: la ausencia de Triage, Atención, Alta Médica o Egreso no invalida ni excluye U-ING. Cada análisis declara su población evaluable y cobertura.
- Estado: estos contratos cierran la interpretación funcional disponible, pero no son indicadores ACEPTADOS ni autorizan API/UI o SQL productivo.

## URG-AMED-01 — Alta Médica registrada

- Estado funcional: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no ACEPTADO como KPI.
- Estado técnico: VALIDADO CON FUENTE / NO IMPLEMENTADO.
- Timestamp canónico actual del hito registrado: `fechamed`.
- Población evaluable: eventos U-ING con `fechamed` no nulo. En la cohorte cerrada de 36 meses: 442,955 de 484,161 eventos (91.49%).
- Cobertura: eventos U-ING con `fechamed` no nulo / U-ING del mismo periodo, centro y servicio.
- Cronología: `Fechaing→fechamed` se clasifica por par; sólo los pares no negativos son cronológicamente interpretables. La ausencia o inversión nunca excluye U-ING.
- Limitaciones: registra un hito de Alta Médica y no sustituye ni infiere `fechaegr`; no acredita alta clínica institucional ni presencia física continua.

## URG-AMED-02 — Fecha auxiliar de Alta Médica

- Estado funcional: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no ACEPTADO como KPI.
- Estado técnico: VALIDADO CON FUENTE / NO IMPLEMENTADO.
- Campo: `altamed_fecha`, auxiliar de fecha observada a medianoche.
- Población y cobertura: eventos U-ING con `altamed_fecha` no nulo, reportados por periodo, centro y servicio.
- Regla: conservar el valor original como auxiliar; nunca completar, normalizar, redondear ni sustituir `fechamed`.
- Limitaciones: no equivale a `fechamed`: en 36 meses sólo 3 de 76,853 eventos con ambos valores coincidieron exactamente y 6,665 cayeron en fechas calendario distintas.

## URG-AMED-03 — Cobertura de Alta Médica

- Estado funcional: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no ACEPTADO como KPI.
- Estado técnico: VALIDADO CON FUENTE / NO IMPLEMENTADO.
- Denominador: U-ING explícito del mismo periodo, centro y servicio; no exige ningún hito complementario ni Egreso.
- Numeradores: eventos U-ING con `fechamed` no nulo y, por separado, con `altamed_fecha` no nulo.
- Salida mínima: universo, numeradores, porcentaje, ambos campos, sólo un campo y diferencias de fecha cuando ambos existen.
- Limitación: cobertura acredita presencia del registro, no su equivalencia semántica, orden temporal o validez clínica.

## URG-AMED-04 — Secuencia temporal como análisis complementario

- Estado funcional: DEFINIDO FUNCIONALMENTE / POR DEFINIR como KPI; no ACEPTADO.
- Estado técnico: VALIDADO CON FUENTE / NO IMPLEMENTADO.
- Secuencia observada: `Fechaing → fechatri → fechaate → fechamed → fechaegr`.
- Regla: cada par usa sólo eventos con ambos timestamps; la secuencia completa usa sólo eventos con los cinco valores. Es análisis de consistencia y cobertura, nunca requisito de validez del episodio, de U-ING ni de un KPI ajeno.
- Salida mínima: faltantes, evaluables, mismo instante, inversiones, extremos y cobertura de secuencia completa. Las señales por par pueden solaparse y no se suman como episodios únicos.
- Limitación: no inferir ni corregir timestamps faltantes, ni asignar causalidad clínica a inversiones. En 36 meses hubo 44,489 secuencias completas; 35,882 tuvieron al menos una inversión.

La evidencia, los ejemplos pseudonimizados y las ventanas 12/24/36 meses están en [validación AMED](../evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.md).