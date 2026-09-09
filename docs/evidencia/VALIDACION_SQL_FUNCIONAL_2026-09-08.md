# Validación SQL funcional — 2026-09-08

**Estado general:** VALIDADO CON ADVERTENCIA
**Fuente de resultados:** corrida real comunicada sobre dbo.vUrgencias y fuentes dirigidas
**Fecha de observación/consolidación comunicada:** 2026-09-08
**Hora, corte y periodo exactos:** NO DOCUMENTADOS en la entrega
**Instrumentos:** [estructura](../../scripts/sql/01_validacion_estructura_vUrgencias.sql) y [validación funcional](../../scripts/sql/02_validacion_funcional_vUrgencias.sql)

La base es operacional y cambió durante las pruebas. Las diferencias de ±1 observadas entre R06 y R07 corresponden a corridas en momentos distintos; la reproducibilidad exacta requiere timestamp de observación, snapshot consistente o periodo cerrado.

## Cobertura de instrumentos

| Bloque | Script | Validación reproducible |
|---|---|---|
| A | 01 | Existencia, estructura y dependencias de vUrgencias |
| B | 02 | Identidad id_urgencia, aliases y ausencia histórica de epis_pk |
| C | 02 | Multiplicación física y registros activos de vsegpop |
| D | 02 | Identidad longitudinal codigo_cliente y outliers |
| E | 02 | Catálogo dinámico codigo_area=2 / serv_activo_sn=1 |
| F | 02 | Cobertura temporal y activo probable |
| G | 02 | Selección del egreso previo válido más reciente |
| H | 02 | Fronteras sintéticas 24/48/72 |
| I | 02 | Benchmark agregado, incluidos servicios sin actividad |
| J | 02 | Reconciliación del denominador y cobertura |
| K | 02 | Conflictos de paciente/servicio/Fechaing por id_urgencia |

Los bloques G, I y J exigen asignar un periodo semiabierto. No contienen valores por defecto para impedir corridas accidentales con un corte distinto del benchmark.

## Matriz de evidencia y decisión

| Tema | Hecho observado | Regla funcional o decisión | Estado |
|---|---|---|---|
| Objeto | dbo.vUrgencias existe como VIEW, object_id 1369940848 y aproximadamente 101 columnas | Se conserva como fuente primaria | VALIDADO |
| Instrumento A03 | referenced_minor_name no existe en SQL Server 2012; referenced_minor_id y COL_NAME son compatibles | Corregir el instrumento, sin efecto funcional | VALIDADO |
| Evento | dbo.urgencias.id_urgencia_pk fue único/no nulo; en la vista id_urgencia y folio lo exponen | id_urgencia es identidad canónica del evento; Atenciones cuenta eventos únicos | VALIDADO |
| Episodio XHIS | foliounico es alias de epis_pk; 19 eventos históricos sin vínculo (18 en 2008 y 1 en 2011) | epis_pk no es identidad canónica de Urgencias | VALIDADO CON ADVERTENCIA |
| Representación | Un evento se multiplicó por dos filas debido a dos registros activos de vsegpop | Trabajar semánticamente por id_urgencia; auditar la anomalía sin elegir fila arbitraria | VALIDADO CON ADVERTENCIA |
| Consistencia | No hubo conflictos de codigo_cliente, codigo_servicio_ingreso o Fechaing dentro de un id_urgencia | Esos campos permiten representar el evento para los cálculos validados, con control continuo | VALIDADO |
| Paciente | codigo_cliente fue estable longitudinalmente; registro no lo fue | codigo_cliente es identidad longitudinal analítica | VALIDADO |
| Servicios | codigo_area=2 y serv_activo_sn=1 incluyó los servicios legítimos; serv_ing_urg_sn estaba incompleto | Catálogo dinámico, sin listas ni centros hardcodeados | VALIDADO |
| Activo probable | El doble nulo separó 349 casos de 190,588 registros con motivo y sin egreso | fechaegr IS NULL AND motivo_alta_pk IS NULL | VALIDADO CON ADVERTENCIA |
| Temporalidad | Coberturas aproximadas: Fechaing 100%, fechatri 81.79%, fechaate 82.87%, fechamed 55.98%, fechaegr 92.43% | Ingreso/egreso son ejes principales; etapas restantes son complementarias | VALIDADO CON ADVERTENCIA |
| Reingreso | OUTER APPLY TOP(1) con el egreso válido más reciente reconcilió casos múltiples y otros servicios | Contrato y algoritmo de antecedente validados | VALIDADO |
| Denominador | R07B v2: 159,822 eventos, todos evaluables, un evento multiplicado físicamente | Denominador: eventos evaluables del periodo, tengan o no antecedente | VALIDADO CON ADVERTENCIA |
| Benchmarks | Conteos por servicio reconciliaron; algunos totales cambiaron ±1 entre corridas | Evidencia de reconciliación, nunca meta ni semáforo | VALIDADO CON ADVERTENCIA |

## Dependencias directas observadas

dbo.camas, dbo.centros, dbo.co_ubicaciones, dbo.destino_urgencias, dbo.episodios, dbo.fpersona, dbo.garantes, dbo.icd, dbo.loc_pac_urg, dbo.motivos_alta_ing, dbo.motivos_urgencia, dbo.origen_urgencias, dbo.pagadores, dbo.servicios, dbo.sys_usu, dbo.tcategor, dbo.triage, dbo.unidadesenfermeria, dbo.urgencias y dbo.vsegpop. No se observaron dependencias externas de servidor o base.

motivos_alta_ing ya participa en la vista y motivo_alta_desc se expone como motivo_alta.

## Anomalía de representación

El evento id_urgencia 2675270, epis_pk 21048448 y codigo_cliente 312453 apareció dos veces. El origen fue vsegpop, donde coexistían los registros 25084418 y 25084420 con activa_sn=1. Fue el único codigo_cliente observado con más de un registro activo. No se elimina ninguna fila, no se usa TOP(1) o MAX(registro), y no se modifica la vista.

El outlier codigo_cliente 297762 tuvo 1,493 id_urgencia y 1,493 epis_pk entre 2009 y 2017, principalmente en URG PEDIATRIA JIM. Representa eventos distintos y permanece incluido.

## Servicios observados

| Centro | Código | Servicio |
|---|---:|---|
| JIM | 56 | URG. TOCO JIM |
| JIM | 153 | URG ADULTOS JIM |
| JIM | 154 | URG PEDIATRIA JIM |
| JIM | 339 | URG ORTOPEDIA Y TRAUMA |
| FAA | 61 | URG TOCO FAA |
| FAA | 118 | URG PEDIATRIA FAA |
| FAA | 152 | URG ADULTOS FAA |
| FAA | 417 | URG COVID19 FAA |
| FAA | 435 | URG GINE FAA |
| FAA | 445 | URGADUPROCE |
| FAA | 446 | URGPEDPROCE |
| HCO | 473 | CO URGENCIAS ADUL |
| HCO | 482 | CO URGENCIAS PEDIA |
| HCO | 483 | URGENCIAS TOCO HO |
| HCO | 576 | URG ADULTOS HO |
| HCO | 577 | URG PEDIATRIA HO |

HCO debe aparecer desde catálogo aunque su conteo sea cero. “Sin actividad en el periodo” significa servicio aplicable con cero eventos; “Sin datos”, captura esperada ausente; “No aplica”, imposibilidad conceptual; y “Datos insuficientes”, información existente que no permite cálculo o interpretación.

## Activos y temporalidad

Se observaron aproximadamente 190,937 eventos con fechaegr nula: 349 también tenían motivo_alta_pk nulo y 190,588 tenían motivo. De los 349 activos probables, 345 correspondían a 2026 y cuatro eran casos aislados de 2017, 2018, 2022 y 2023. La deuda con motivo se concentró en 2001, 2002 y 2009–2012. No se aplica un corte de cinco años.

Se observaron años/fechas anómalos como 1900, 1980, 2080 y 2122. Deben clasificarse y auditarse sin recorte silencioso. fecha_modif es técnica y no representa actividad clínica.

## Contrato de reingreso validado

Para cada id_urgencia actual se usa codigo_cliente, el mismo codigo_servicio_ingreso y el egreso previo válido más reciente. El antecedente debe tener fechaegr, ser anterior a la nueva Fechaing y puede estar fuera del periodo. El periodo restringe el evento actual. El orden de selección es fechaegr DESC, Fechaing DESC, id_urgencia DESC. El evento actual cuenta una vez.

Bandas sobre DATETIME real:

| Intervalo | Clasificación |
|---|---|
| 0 < t <= 24 h | 0–24 |
| 24 < t <= 48 h | >24–48 |
| 48 < t < 72 h | >48–72 |
| t >= 72 h | No reingreso <72 h |

La presentación puede redondear a 0.5 horas después de clasificar. Casos reales confirmaron 1439/1440/1442, 2878/2880/2881 y 4319/4321 minutos. El caso exacto 4320 no apareció y queda como prueba sintética obligatoria: 4319 sí; 4320 y 4321 no.

Casos de antecedente: id_actual 2820256 eligió 22.85 h sobre 39.98 h; 2820200 eligió 29.50 h entre múltiples antecedentes; 2820279 eligió 59.02 h del mismo servicio y excluyó otro servicio; 2820180 clasificó 0.68 h en 0–24.

## Denominador y benchmark

Tasa = eventos evaluables clasificados como reingreso <72 h / eventos evaluables de Urgencias del periodo × 100. Evaluabilidad requiere id_urgencia, codigo_cliente, codigo_servicio_ingreso y Fechaing. No exige antecedente.

| Centro / servicio | Eventos | 0–24 | >24–48 | >48–72 | <72 | Tasa |
|---|---:|---:|---:|---:|---:|---:|
| JIM 56 URG. TOCO JIM | 21,322 | 1,927 | 646 | 491 | 3,064 | 14.37% |
| JIM 153 URG ADULTOS JIM | 30,134 | 1,625 | 345 | 254 | 2,224 | 7.38% |
| JIM 154 URG PEDIATRIA JIM | 17,148 | 687 | 256 | 165 | 1,108 | 6.46% |
| JIM 339 URG ORTOPEDIA Y TRAUMA | 5,651 | 166 | 51 | 44 | 261 | 4.62% |
| FAA 61 URG TOCO FAA | 12,378 | 1,010 | 366 | 291 | 1,667 | 13.47% |
| FAA 118 URG PEDIATRIA FAA | 23,759 | 721 | 398 | 227 | 1,346 | 5.67% |
| FAA 152 URG ADULTOS FAA | 48,104 | 2,145 | 306 | 239 | 2,690 | 5.59% |
| FAA 417 URG COVID19 FAA | 8 | 0 | 0 | 0 | 0 | 0.00% |
| FAA 435 URG GINE FAA | 1,312 | — | — | — | 28 | 2.13% |
| FAA 445 URGADUPROCE | 6 | 0 | 0 | 0 | 0 | 0.00% |
| FAA 446 URGPEDPROCE | 2 | 0 | 0 | 0 | 0 | 0.00% |
| HCO 473/482/483/576/577 | 0 | 0 | 0 | 0 | 0 | NULL |

“—” indica que el desglose no fue entregado, no cero.

## Pendientes

Permanecen pendientes los tipos/zonas no comunicados en los resultados, transformación exacta de fechas derivadas, edad al evento y precedencias, mapeo ejecutivo de destinos, cohorte de permanencia de portada, contrato de días parciales del promedio diario, umbrales de suficiencia, snapshot de implementación y autorización institucional de KPI. No se implementó aplicación ni se modificó la base.
