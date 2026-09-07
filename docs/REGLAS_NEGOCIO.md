# Reglas de negocio — Urgencias

Vigencia funcional: 2026-09-07, según [contexto entregado](historico/prompts/SOLICITUD_RECONCILIACION_2026-09-07.txt). Origen inmutable: [reglas en 717f681](https://github.com/juliuscvg/dashboard_urgencias/blob/717f681e6d979798a2b1d680dda64d765bb3b051/docs/REGLAS_NEGOCIO.md). Ver [decisiones](gobierno/DECISIONES_Y_CAMBIOS.md) y [reconciliación](gobierno/RECONCILIACION_BASELINE_717f681.md).

DEFINIDO FUNCIONALMENTE acredita una decisión, no una consulta. PENDIENTE DE VALIDACIÓN SQL identifica evidencia física ausente. CANDIDATO identifica elecciones adicionales aún abiertas. Son ejes separados: una regla definida puede seguir pendiente de SQL. Sin implementación ni metas institucionales.

## URG-R01 — Fuente, entidad y representación

Fuente principal dbo.vUrgencias. Entidad: episodio/evento de Urgencias. epis_pk es el identificador expuesto comunicado, que reemplaza episodio_pk provisional del baseline. id_urgencia identifica registro de Urgencias; codigo_cliente es candidato longitudinal de paciente; registro es clínico/administrativo; foliounico es adicional. No intercambiarlos ni asumir cardinalidad 1:1.

Perfilar nulos, duplicados, variantes, relación epis_pk/id_urgencia, ámbito de claves por centro y estabilidad de codigo_cliente. Fila representativa y desempates pendientes; no usar MAX/MIN, DISTINCT o última fecha_modif para ocultar contradicciones. Separar filas crudas, episodios y pacientes; claves ausentes se mantienen auditables como no evaluables para conteo de episodios. No importar n_solic, estados, fórmulas de capacidad o D01–D05 CEX.

## URG-R02 — Eventos, universos y ventana móvil

Periodo semiabierto: evento >= Inicio AND evento < FinExclusivo. Días completos incluyen inicio y excluyen comienzo del día posterior al final solicitado. Tipos, precisión y zona PENDIENTES DE VALIDACIÓN SQL; no asumir UTC ni aplicar offsets.

| Campo comunicado | Semántica vigente | Prioridad |
|---|---|---|
| Fechaing | Registro del paciente en Urgencias | Ejecutivo principal |
| fechaegr | Salida/egreso administrativo y final del evento | Ejecutivo principal |
| fechatri | Registro de triage | Secundario |
| fechaate | Inicio de atención, datetime derivado preferido frente a atencion_fecha | Complementario |
| fechamed | Alta médica, datetime derivado preferido frente a altamed_fecha | Complementario |
| fecha_modif | Modificación técnica, nunca actividad clínica ni KPI operativo | Auditoría técnica |

Fechaing/fechaing es variación comunicada de casing, no dos columnas. Equivalencias atencion_fecha~fechaate y altamed_fecha~fechamed son funcionales aproximadas; transformaciones pendientes de SQL. No exigir triage, atención o alta médica para considerar válido un episodio ni para pertenecer al universo principal.

| Universo | Pertenencia funcional | Límite |
|---|---|---|
| U-ING | Episodios registrados por Fechaing en periodo/filtros, en servicios canónicos | Representación pendiente; no exige fechaate |
| U-EGR | Episodios finalizados por fechaegr en periodo/filtros | Incluye ingresos anteriores al periodo |
| U-ABI | fechaegr NULL al corte de observación | Incluye deuda; no equivale a activo probable |
| U-ACT | U-ABI con motivo_alta_pk NULL | Situación actual separada de periodo histórico |
| U-POB | Episodios U-ING; pacientes identificables por separado | No sumar pacientes únicos de grupos solapados |
| U-RET | Nuevos episodios U-ING con identidad, servicio e historia evaluables | Buscar antecedente fuera del periodo |

Convención heredada: permanencia por cohorte U-ING completada; análisis U-EGR separado. La cohorte definitiva del KPI ejecutivo sigue candidata hasta cierre funcional, sin mezclar ambas. SIN DATO de una dimensión no elimina una entidad que cumple el universo; filtros explícitos sí restringen el contexto y deben mostrarse.

Ventana inicial: últimos N años móviles, N=3 configurable en [criterios documentales](../config/criterios-funcionales.json). Convención de anclaje propuesta en esta reconciliación: aniversario N años anterior al corte de consulta hasta ese corte, registrado; ajuste de 29 de febrero a último día válido del mes. No hardcodear años calendario. Los selectores de días declaran corte parcial cuando corresponda. Los anteriores son HISTÓRICOS, consultables mediante periodo personalizado con aviso discreto de prácticas de captura distintas. La ventana no es retención ni exclusión permanente; no truncar U-ACT ni antecedentes de reingreso a tres años.

## URG-R03 — Activos y situación actual

Regla vigente: fechaegr IS NULL AND motivo_alta_pk IS NULL. Ausencia de egreso sola no basta.

| fechaegr | motivo_alta_pk | Tratamiento |
|---|---|---|
| NULL | NULL | Activo probable, no confirmación clínica de presencia |
| NULL | No NULL | Deuda histórica/cierre administrativo predominante; fuera del censo operativo actual |
| No NULL | NULL | Evento finalizado, motivo SIN DATO |
| No NULL | No NULL | Evento finalizado con motivo |

Mostrar total y subconjuntos acumulativos >24 h, >48 h, >72 h; énfasis >48/>72. Antigüedad = corte_actual − Fechaing. Límites estrictos: exactamente 24/48/72 no pertenece al subconjunto que exige superar ese valor. Son subconjuntos solapados, no se suman. Casos de varios días y extremos válidos siguen incluidos y auditables. >5 años permanece como referencia histórica, no filtro ejecutivo ni recorte.

Fechaing nula/futura: conservar pertenencia al predicado activo probable y mostrar antigüedad no evaluable/inconsistente, sin inventar duración. Total activos = antigüedad evaluable + no evaluable, tras representación validada. Bloque actual usa corte explícito y filtros compatibles; no arrastra automáticamente periodo o turno históricos. La compatibilidad de filtros avanzados queda pendiente y debe ser visible.

Drill-down: Centro → Servicio → Antigüedad → Localización → Episodio. Censo retrospectivo histórico sigue candidato por mutabilidad de la vista. No corregir ni cerrar datos de origen.

## URG-R04 — Flujo, calidad y cobertura

Registro → triage → inicio de atención → alta médica → egreso es secuencia esperada, no exigencia de completitud. Detectar faltantes, invertidos, secuencias imposibles y mismo minuto, también entre pares no adyacentes. Mismo minuto no demuestra simultaneidad exacta.

Por par temporal, clasificar primero faltantes; entre pares presentes separar invertidos de evaluables no negativos. Cero es evaluable, no reemplaza ausencia. Extremos positivos válidos siguen incluidos, sin recorte ni winsorización. U = evaluables + faltantes + invertidos, clases excluyentes por par. Flags entre pares pueden solaparse; no sumarlos como episodios únicos. Ausencia de etapas complementarias no reduce el universo principal.

Cobertura = episodios con componente presente / universo explícito del módulo. Presencia no implica validez temporal. SIN DATO distinto de DATO INVÁLIDO; catálogos y contradicciones descriptivas auditables, sin MAX/MIN arbitrarios. Denominador cero: no calculable con estado explicativo, nunca 0% fabricado. Cambiar exclusiones requiere decisión versionada.

## URG-R05 — Permanencia y rangos

Completado: fechaegr − Fechaing. Abierto: corte_actual − Fechaing, aclarando U-ABI o U-ACT. Presentar separados; nunca mezclar abiertos/completados en un promedio. Principal ejecutivo: PROMEDIO aritmético = suma de duraciones evaluables / número de episodios evaluables. No mediana/percentiles como principal. Extremos válidos incluidos y auditables; faltantes/invertidos se cuantifican según R04.

Convención de fronteras explícita de esta reconciliación:

| Etiqueta | Horas reales t |
|---|---|
| <12 h | 0 <= t < 12 |
| 12–24 h | 12 <= t < 24 |
| 24–48 h | 24 <= t < 48 |
| 48–72 h | 48 <= t <= 72 |
| >72 h | t > 72 |

Sin huecos ni solapamientos; exactamente 12 entra en segundo tramo, 24 en tercero, 48 y 72 en cuarto. Clasificar timestamps reales antes de redondear. Reemplaza distribución 0–2/2–6/6–12/12–24/>24 del baseline; no son metas. Rangos de atención del baseline se conservan sólo como candidato secundario: [0,30], (30,60], (60,120], (120,240], >240 min.

## URG-R06 — Reingresos

Principal <72 h: mismo paciente AND mismo servicio de Urgencias AND nuevo Fechaing > fechaegr previa válida AND nuevo Fechaing < DATEADD(HOUR,72,fechaegr previa). Esta expresión es regla documental, no SQL ejecutado. No requiere mismo diagnóstico, médico o motivo. Pediatría→Pediatría puede ser candidato; Pediatría→Ortopedia NO es reingreso. No añadir mismo centro sin validar ámbito de identidad del servicio.

Buscar egreso previo elegible de otro episodio aunque esté fuera del periodo seleccionado y de la ventana inicial. No basta LAG sobre filas crudas ni aplicar los filtros del nuevo episodio indiscriminadamente al antecedente. Validar egreso previo, identidad y secuencia; empates, solapamientos, múltiples egresos y episodios intermedios siguen pendientes técnicos. «Egreso más reciente» del baseline es propuesta no validada. Casos ambiguos no positivos automáticamente; informar no evaluables e historia incompleta. Contar cada nuevo episodio una vez, no cada par.

| Banda visual dentro de <72 h | Pertenencia exacta |
|---|---|
| 0–24 h | 0 < t <= 24 |
| >24–48 h | 24 < t <= 48 |
| >48–72 h | 48 < t < 72 |

Exactamente 0/72 excluidos; 24 pertenece a primera banda y 48 a segunda. La etiqueta final explica 72 exclusivo. Referencia secundaria 48 h: convención documental propuesta «hasta 48 h» inclusiva, suma de las dos primeras bandas; la definición de un indicador secundario estricto <48, si se desea, sigue CANDIDATO y no debe confundirse con esa suma.

Visualización permitida a múltiplos de 0.5 h, nunca para pertenencia. Convención candidata conservada: más cercano, empates hacia arriba en valores positivos; 71.99 puede mostrarse 72 sin ser el límite excluido. Tasa requiere cerrar denominador de nuevos episodios evaluables y cobertura; no confundir conteos con tasa ni pacientes únicos.

## URG-R07 — Población

Pacientes únicos requieren codigo_cliente validado; registro/foliounico no son sustitutos. Separar pacientes y episodios. Sexo, grupos etarios y geografía secundarios; localidad con cobertura/calidad por heterogeneidad. SIN DATO permanece y DATO INVÁLIDO requiere semántica/catálogo verificados.

Grupos vigentes: <1, 1–5, 6–12, 13–17, 18–29, 30–44, 45–59, 60–74, 75+. Sobre edad exacta no negativa equivalen a [0,1), [1,6), [6,13), [13,18), [18,30), [30,45), [45,60), [60,75), [75,+∞). Nulo/negativo no se clasifica <1.

Campos comunicados fecha_nac, edadaños, EdadMeses, EdadDias. Referencia temporal y forma de cálculo expuesta PENDIENTES DE VALIDACIÓN SQL; edad al registro sigue candidata hasta validar coherencia. Meses/días apoyan pediatría; no sumar unidades sin semántica ni recalcular a fecha actual. Precedencia ante discordancias y representación de paciente con múltiples episodios pendientes. Grupos cerrados no significan cálculo de edad validado.

## URG-R08 — Filtros y comparación

Visibles: periodo, centro, servicio, turno. Centro→Servicio jerárquico. Avanzados: sexo, grupo edad, estado, municipio, triage, nivel triage, motivo urgencia, diagnóstico, destino, motivo alta, reingreso, permanencia, médico, seguridad social, pagador, origen. Nombres físicos no entregados permanecen NO DOCUMENTADO.

Rápidos: Hoy, Ayer, Últimos 7 días, Últimos 30 días, Este mes, Mes anterior, Este año, Personalizado. Convención candidata: últimos N días incluye hoy y N−1 previos; cortes parciales explícitos. Comparación parcial requiere corte/duración equivalente, no día incompleto contra completo sin advertirlo.

Principal actual vs periodo equivalente anterior; opcional mismo periodo año anterior. Mantener evento, filtros y universo. Conteos: 100*(actual−previo)/previo si previo>0; previo=0 muestra sin base porcentual y valores absolutos. Porcentajes: puntos porcentuales. Tiempos: diferencias en minutos/horas. Calendario, bisiestos, cierres parciales y meses de distinta longitud requieren contrato concreto al implementar selectores. No saturar portada ni inferir calidad por volumen.

## URG-R09 — Servicios institucionales

Universo canónico: dbo.servicios.codigo_area = 2 AND dbo.servicios.serv_activo_sn = 1. Cruce con centros para centro/código/descripción; objeto físico y claves de unión NO DOCUMENTADO. No hardcodear FAA/JIM/HCO ni listas de servicios. serv_ing_urg_sn incompleto: sólo informativo/validación, nunca filtro principal.

dbo.servicios cubre carencia de universo institucional; centros, pertenencia/etiquetas. Validar uniones sin multiplicar episodios y mapeo del servicio de vista. HCO aparece por catálogo/actividad sin cambiar código; ausencia de actividad no es error ni NO APLICA automática. Vigencia de servicios actualmente inactivos y efecto sobre series históricas requiere validación y eventual decisión, no excepción silenciosa al criterio canónico.

## URG-R10 — Triage

Separar fecha/hora, nivel/clasificación y responsable. Campos: triage_pk, triage_codigo, triage_desc, area, desc_area, tipo_urgencia, login_triage, usuario_triage, categoria_triage, fechatri. No asumir que todos representan nivel ni equiparar catálogos.

Cada visualización muestra cobertura por componente/universo; contemplar nivel sin fecha, responsable sin nivel. Ausencia no invalida episodio ni constituye error automático. Menor peso que registro/egreso en portada. Preparar estandarización con catálogo, prácticas por servicio/periodo, completitud y responsables; sin normalización silenciosa.

## URG-R11 — Resolución

Destino: destino_urg_pk, destino_urgencias. Motivo: motivo_alta_pk, catálogo dbo.motivos_alta_ing con motivo_alta_desc. Son dimensiones independientes; no fusionar. Descripción de motivo en vUrgencias es futura: no afirmar presencia actual validada ni modificar vista. Clave física de unión pendiente.

Grupos ejecutivos configurables: Domicilio, Hospitalización, Consulta Externa, Salida no programada, Traslado, Defunción, No especificado, Otros. Mapeo de códigos pendiente de SQL/revisión funcional; no adivinar códigos ni inferir Hospitalización de motivo. Mostrar cobertura de mapeo; no usar Otros/No especificado para esconder códigos desconocidos. Tratamiento de nulos/códigos sin mapear debe cerrarse antes del cálculo.

## URG-R12 — Demanda, clínica y personal

Demanda por volumen, tendencia, hora, día, turno, centro, servicio; Fechaing mide registro, no acredita atención clínica. Turnos civiles: Matutino [08:00,14:00), Vespertino [14:00,20:00), Nocturno [20:00,24:00) unión [00:00,08:00). Parametrización futura prevista; atribución de madrugada a jornada previa sigue pendiente, sin cambiar fecha calendario silenciosamente.

Clínica secundaria: motivo_urgencia, motivo_urg_libre, cdiag_ing, diag_ing, cdiag_egr, diag_egr. Top 5/10/20/Todos; conservar resto reconciliable. Todos no implica cargar todo en navegador. motivo_urg_libre sólo búsqueda/detalle, no ranking ejecutivo. No inferir gravedad, calidad, desempeño o causalidad.

Personal: Atenciones asociadas a médico / Actividad registrada; no productividad automática ni rankings mejor/peor. Staff triage separado; usuarios registro/egreso para auditoría. Nombres físicos de médico/usuarios no entregados siguen pendientes; no sustituirlos por usuario_triage.

## URG-R13 — Portada, detalle y arquitectura

Seis KPI propuestos: Atenciones, Promedio diario, Permanencia promedio, Hospitalización, Reingresos <72 h, Pacientes únicos. Situación actual separada. No convierte 28 candidatos del origen en oficiales. Cierres adicionales de presentación/denominadores en [catálogo](indicadores/00_CATALOGO_INDICADORES.md).

[UX](CONTRATO_UX_FUNCIONAL.md) y [arquitectura futura](ARQUITECTURA_FUTURA.md): predicado agregado/detalle/count/exportación compartido, paginación servidor, filtros persistentes, advertencias interpretativas visibles y privacidad. Datos personales sólo para auditoría autorizada; no devolver toda la vista ni logs con nombres, CURP, teléfonos o direcciones. No se implementó frontend, backend, API, SQL, ETL ni caché.
