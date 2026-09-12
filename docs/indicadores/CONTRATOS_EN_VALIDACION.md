# Contratos en validación — hitos temporales

- Dominio: Urgencias HCG.
- Fuente primaria: `dbo.vUrgencias`.
- Universo general: U-ING, un evento por `id_urgencia` con `Fechaing` en el periodo y servicio canónico aplicable.
- Jerarquía: Ingreso, Triage y Egreso son hitos principales; Atención médica y Alta Médica son complementarios.
- Regla común: la ausencia de Triage, Atención, Alta Médica o Egreso no invalida ni excluye U-ING. Cada análisis declara su población evaluable y cobertura.
- Estado: estos contratos cierran la interpretación funcional disponible, pero no son indicadores ACEPTADOS ni autorizan API/UI o SQL productivo.

## URG-ATE-01 — Atención médica registrada

- Estado funcional: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no ACEPTADO como KPI.
- Estado técnico: VALIDADO CON FUENTE / NO IMPLEMENTADO.
- Timestamp canónico actual del hito registrado: `fechaate` (`datetime`, nullable).
- Población evaluable: eventos U-ING con `fechaate` canónico no nulo. Cobertura 12/24/36 meses: 94.1141% / 92.7560% / 88.0736%.
- Cobertura: población evaluable / U-ING del mismo periodo, centro y servicio. La ausencia no excluye el evento.
- Cronología primaria: `Fechaing→fechaate`; sólo pares no negativos son interpretables para duración. En 12/24/36 meses no se observaron inversiones, pero sí mismo instante y extremos de hasta 643,525 minutos.
- Relaciones: Triage, Atención, Alta Médica y Egreso son hitos independientes. Sus faltantes o inversiones se conservan; no se exige la secuencia completa. La alta proporción de `fechatri→fechaate` invertidos impide usar ese par como regla de orden o espera.
- Limitaciones: acredita un timestamp registrado, no inicio clínico real, oportunidad, presencia física ni causalidad. `atencion_fecha` no completa ni sustituye `fechaate`; su equivalencia permanece POR DEFINIR.
- Implementación: sin SQL productivo, API ni UI.
- Evidencia: [validación Atención médica](../evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.md).

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
## URG-POB-01 — Edad al evento

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no KPI aceptado.
- Fuente canónica: `fecha_nac` respecto de `Fechaing`; evaluable sólo con ambas fechas y nacimiento no posterior al ingreso.
- `edadaños` es contraste, no precedencia; `EdadMeses`/`EdadDias` no se combinan sin regla institucional.
- Cobertura: edad evaluable / U-ING por periodo, centro y servicio. Nulos, fechas posteriores y extremos se cuantifican y preservan.

## URG-POB-02 — Grupos etarios descriptivos

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no población clínica ni KPI aceptado.
- Grupos: `<1`, `1–5`, `6–12`, `13–17`, `18–29`, `30–44`, `45–59`, `60–74`, `75+`; aplican sólo a edad evaluable.
- La ausencia de edad queda `SIN_EDAD_EVALUABLE`; no se infiere por servicio, sexo ni otros campos.

## URG-POB-03 — Sexo nativo

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN.
- Fuente: `sexo` nativo; conservar categorías, incluidos INDETERMINADO, NO ESPECIFICADO y SIN_DATO.
- Cobertura: sexo presente / U-ING. No se reclasifica ni se deduce sexo.

## URG-POB-04 — Residencia nativa

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN.
- Fuentes: `estado_residencia`, `nombre_municipio_residencia`, `nombre_localidad_residencia`.
- Cobertura y categorías nativas por periodo, centro y servicio; faltantes y variantes se conservan. No normalizar ni inferir residencia.

## URG-DIAG-01 — Diagnóstico de ingreso codificado

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no KPI aceptado.
- Fuente: `cdiag_ing`/`diag_ing`. Prácticamente 1:1 código↔descripción (6163 códigos, 6164 pares en la cohorte cerrada de 36 meses).
- No se infiere CIE, familia clínica ni severidad; se conserva el código/descripción nativo.

## URG-DIAG-02 — Diagnóstico de egreso codificado

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no KPI aceptado.
- Fuente: `cdiag_egr`/`diag_egr`. No es 1:1: 6250 códigos y 9613 pares en 36 meses; 507 códigos tienen entre 2 y 4 descripciones distintas (verificado contra fuente).
- La multiplicidad descripción↔código es cardinalidad nativa observada, no se corrige ni se elige una descripción canónica.

## URG-DIAG-03 — Texto de egreso no codificado

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; complementario, no KPI.
- Población: eventos con `diag_egr` no nulo y `cdiag_egr` nulo. En 36 meses: 6257 eventos, 2842 valores de texto distintos.
- El texto mezcla contenido clínico, variantes de captura y mensajes operativos; se preserva tal cual, sin inferir código CIE ni limpiar el texto.

## URG-DIAG-04 — Cobertura y comparación ingreso/egreso

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no KPI aceptado.
- Cruce por evento U-ING: ambos códigos, mismo código, código diferente, sólo ingreso, sólo egreso, ninguno; ventanas 12/24/36 meses.
- Ingreso y egreso son dimensiones independientes: no se asume relación, transición ni causalidad entre ambos valores.
- Limitación: es comparación descriptiva de cobertura y correspondencia, no interpretación clínica.

La evidencia y las ventanas 12/24/36 meses están en [validación Diagnósticos](../evidencia/VALIDACION_DIAGNOSTICOS_2026-09-10.md).

## URG-MOT-01 — Motivo de Urgencia categórico

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no KPI aceptado.
- Fuente: motivo_urgencia sobre U-ING, conservado como categoría nativa.
- Población evaluable: eventos U-ING con valor no vacío; la ausencia no excluye el evento del universo.
- Cobertura: eventos con categoría / U-ING del mismo periodo, centro y servicio. Fue 100% en las cohortes cerradas de 12/24/36 meses.
- Salida descriptiva: categoría nativa, eventos, porcentaje y faltantes; no se crean agrupaciones clínicas.
- Limitación: la categoría registrada no acredita gravedad, diagnóstico, causalidad ni calidad.

## URG-MOT-02 — Motivo de Urgencia en texto libre

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; información complementaria sensible, no KPI.
- Fuente: motivo_urg_libre, preservado sin normalizar ni inferir categoría.
- Población evaluable: eventos U-ING con texto no vacío. Cobertura 12/24/36 meses: 13.61% / 12.30% / 13.46%.
- Uso permitido propuesto: búsqueda o detalle autorizado en una fase futura; no ranking ejecutivo, catálogo ni sustituto de motivo_urgencia.
- Resguardo: no exponer valores en evidencia, logs o agregados. La política de acceso permanece pendiente antes de implementar.

## URG-MOT-03 — Cobertura y relación de Motivo

- Estado: DEFINIDO FUNCIONALMENTE / EN VALIDACIÓN; no KPI aceptado.
- Denominador: U-ING explícito del mismo periodo, centro y servicio.
- Salida mínima: universo, con categoría, con texto, ambos, sólo categoría, sólo texto, ninguno, vacíos y conflictos por evento.
- Regla: reportar cada campo por separado; no completar uno desde el otro. La variación de texto por centro o servicio es señal de cobertura, no diferencia clínica.
- Evidencia: [validación Motivo de Urgencia](../evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.md).
