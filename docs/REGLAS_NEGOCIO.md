# Reglas de negocio — Urgencias

Contrato local inicial, basado en la [solicitud original](historico/prompts/SOLICITUD_BASELINE.txt). Las hipótesis no son definiciones institucionales aprobadas.

## URG-R01 — Entidad y representación

La unidad esperada es el episodio. `episodio_pk` es clave funcional candidata, no unicidad comprobada. `id_urgencia` identifica un registro propio de Urgencias cuando exista; no se ha probado su relación 1:1, 1:N o N:1 con episodio. Una fila de la vista no equivale automáticamente a episodio ni a paciente.

Antes de contar episodios: medir filas, claves nulas, duplicados idénticos y variantes contradictorias; validar ámbito de unicidad por centro; distinguir repeticiones técnicas de múltiples registros legítimos. La fila representativa requiere orden determinista, semántica documentada y desempate estable antes de derivar atributos. NO DOCUMENTADO el criterio concreto. No usar MAX/MIN/DISTINCT ni la última `fecha_modif` para resolverlo silenciosamente. Los registros sin clave se reportan en calidad; no se inventa episodio.

## URG-R02 — Universos y periodo

Contrato temporal: `evento >= desde AND evento < hasta_exclusivo`. Para días completos, hasta_exclusivo es el comienzo del día posterior al último solicitado. La semántica de zona y precisión requiere validación; no asumir UTC ni aplicar offsets.

| Universo candidato | Pertenencia | Unidad y límites |
|---|---|---|
| U-ING | fechaing en el periodo y filtros compatibles | Episodio representado, deduplicación POR VALIDAR |
| U-EGR | fechaegr en el periodo y filtros compatibles | Episodio con egreso; puede haber ingresado antes del periodo |
| U-ABI | fechaegr nula en extracción, fechaing no futura respecto al corte | Abiertos observados; ingresos nulos/futuros separados como no evaluables |
| U-POB | Episodios U-ING; pacientes identificables por separado | No confundir distribuciones de episodios con pacientes únicos |
| U-RET | Nuevos ingresos U-ING con identidad y servicio validables | Historia previa debe buscarse fuera del inicio del periodo en la misma vista |

El filtro de periodo de ingresos no se aplica silenciosamente al egreso ni al stock de abiertos. Un censo histórico a un corte anterior requiere historia y semántica de actualización; la vista actual podría no reconstruirlo. U-ABI no es censo clínico validado. Exclusiones institucionales: NO DOCUMENTADO; no hay exclusiones configuradas.

## URG-R03 — Estado y antigüedad

| fechaegr | motivo_alta_pk | Clasificación inicial |
|---|---|---|
| NULL | NULL | ACTIVO PROBABLE, condicionado por antigüedad; no confirma presencia actual |
| NULL | No NULL | Abierto con motivo de alta: caso antiguo/inconsistente, no activo probable |
| No NULL | NULL | Egreso registrado sin motivo; calidad de motivo separada |
| No NULL | No NULL | Egreso registrado con motivo |

Abierto describe ausencia de fechaegr; cerrado provisional describe egreso registrado, no equivalencia con códigos CEX. Ambos estados requieren revisión de semántica real.
Antigüedad: intervalo entre fechaing y corte de observación explícito. Nulos y fechas futuras son no evaluables/inconsistentes. Más de cinco años se interpreta por aniversario calendario anterior al corte menos cinco años, no por conteo de cambios de año. Exactamente cinco años no pertenece a «más de cinco». Los abiertos mayores de cinco años se separan como históricos/inconsistentes y no se presentan como censo actual, incluso si cumplen el predicado de activo probable. Otros tramos de antigüedad y la ventana operativa requieren decisión funcional. No corregir ni cerrar datos en origen.

## URG-R04 — Flujo, tiempos y calidad

Ingreso `fechaing` → triage `fechatri` → atención `fechaate` → alta médica `fechamed` → egreso `fechaegr`.
`fecha_modif` es administrativa/técnica y no sustituye eventos clínicos.
Conservar ausencias por etapa, pares invertidos, secuencias imposibles, mismo minuto y registros parciales. Comprobar también pares presentes no adyacentes si faltan etapas intermedias. Dos eventos en el mismo minuto no prueban simultaneidad exacta cuando la fuente carece de segundos.

Propuesta descriptiva, POR VALIDAR: para cada par, U = evaluables con fechas presentes y duración no negativa + faltantes + invertidos, con categorías excluyentes (primero faltantes, luego invertidos). Un cero es evaluable; no reemplaza ausencia. Extremos positivos permanecen auditables y no se recortan. El número de episodios U no cambia por anomalías; la distribución de duraciones declara su subconjunto evaluable. Flags de calidad por etapa pueden solaparse y no se suman como episodios únicos.

Permanencia completada: fechaegr − fechaing. Tiempo transcurrido de un abierto: corte − fechaing, presentado por separado; no imputar egreso ni mezclarlo en permanencia completada. Alta médica no equivale a egreso.

## URG-R05 — Rangos descriptivos

Rangos aportados: atención 0–30, 31–60, 61–120, 121–240 y >240 min; permanencia 0–2, 2–6, 6–12, 12–24 y >24 h. No son metas institucionales.
Para evitar huecos en fracciones, propuesta explícita POR VALIDAR: atención [0,30], (30,60], (60,120], (120,240], (240,+∞) minutos, con etiquetas precisas «>30–60» etc. No redondear antes de clasificar. Si se exige mantener las etiquetas 31–60, se deberá decidir la conversión a minutos enteros.
Permanencia propuesta: [0,2], (2,6], (6,12], (12,24], (24,+∞) horas. Exactamente 2, 6, 12 y 24 se asigna al tramo que termina ahí; >12 y >24 son estrictos. El rango >12 incluye los dos últimos tramos y no se suma con >24 como categorías disjuntas. Resolver convenciones antes de implementar.

## URG-R06 — Reingresos candidatos

Mismo paciente validado y mismo servicio validado; nuevo ingreso posterior a un egreso previo. Diferencia positiva en horas sin redondear. La solicitud combina «dentro de» con candidatos «<24/<72»; límite exacto de 24/72 h REQUIERE DECISIÓN FUNCIONAL. Hasta resolverlo no existe indicador oficial.

Ordenar episodios tras resolver granularidad, por ingreso y desempate estable. Buscar episodios anteriores distintos con egreso anterior al nuevo ingreso y mismo servicio; propuesta: egreso elegible más reciente. Verificar transferencias, solapamientos y episodios intermedios antes de aceptar un enlace. No basta un LAG sobre filas crudas ni filtrar historia al periodo del nuevo ingreso. Un paciente sin identidad o servicio válido es no evaluable. Duplicados, empate de egresos sin desempate o identidad contradictoria deben impedir clasificación positiva automática.

24 h será subconjunto de 72 h si comparten universo y límites; no sumar ambos conteos. Tasa candidata: nuevos episodios reingresados / nuevos episodios evaluables, con cobertura de historia explicitada; no declararla vigente hasta validar antecedente y denominador. Presentación trabajada en múltiplos de 0.5 h: propuesta redondeo al más cercano, empates hacia arriba para duraciones positivas. Nunca usar ese redondeo para decidir pertenencia. Ventanas exactas, tratamiento de transferencias e historia incompleta pendientes.

## URG-R07 — Población

Pacientes únicos necesitan identificador validado y alcance entre centros; folio/registro y codigo_cliente no se asumen equivalentes. Contar episodios y pacientes por separado. Sexo, edad y residencia faltantes permanecen como SIN DATO; valores presentes fuera de dominios validados como DATO INVÁLIDO. No inventar catálogos válidos.
Si existe edad, documentar unidad, fecha de referencia y forma de cálculo antes de recalcular. Edad al ingreso es candidata; fecha de nacimiento y su columna no están demostradas. Grupos etarios y representación de residencia de un paciente con varios episodios requieren decisión. La distribución de pacientes no debe duplicar al mismo paciente entre categorías sin explicarlo.

## URG-R08 — Dimensiones y comparaciones

Jerarquía candidata: Centro → Servicio → Localización → Paciente/episodio. Validar si localización es actual o al ingreso y si depende realmente de servicio. Servicio de ingreso no se sustituye por servicio actual. Inventariar destino, motivo de alta, médico y cama sin asumir capacidad ni ocupación institucional. Filtros adicionales: periodo, sexo, grupo de edad, motivo de alta, destino, estado, permanencia y reingreso; activación condicionada a campos/universos validados.
Tendencias y comparación requieren el mismo evento, unidad, filtros, longitud de periodo y calendario declarados; periodo incompleto y referencia no disponible deben ser visibles. Más volumen no implica mejor desempeño.
