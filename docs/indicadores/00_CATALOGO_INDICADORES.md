# Catálogo de candidatos analíticos — Urgencias

Los IDs URG-CAND son referencias documentales provisionales; no numeración institucional definitiva. Todos son CANDIDATO / POR VALIDAR, sin metas ni ficha oficial. Fuente prevista: vUrgencias.

| ID provisional | Candidato | Universo propuesto | Definición inicial / campos | Regla |
|---|---|---|---|---|
| URG-CAND-OP-01 | ingresos | U-ING | Conteo de episodios representados | URG-R01/R02 |
| URG-CAND-OP-02 | egresos | U-EGR | Conteo por fecha de egreso | URG-R02 |
| URG-CAND-OP-03 | abiertos y activos probables | U-ABI | Separar motivo de alta, antigüedad y no evaluables | URG-R03 |
| URG-CAND-OP-04 | abiertos por antigüedad | U-ABI | Corte explícito y >5 años histórico | URG-R03 |
| URG-CAND-OP-05 | localización, servicio, destino y motivo de alta | Universo declarado por módulo | Distribuciones con SIN DATO; semántica actual/ingreso pendiente | URG-R08 |
| URG-CAND-OP-06 | flujo y tiempos entre etapas | U-ING | Cobertura por etapa y duraciones por par | URG-R04 |
| URG-CAND-OP-07 | permanencia | U-ING | Completada separada del transcurrido de abiertos | URG-R04/R05 |
| URG-CAND-OP-08 | reingresos | U-RET | Vínculo con egreso previo elegible | URG-R06 |
| URG-CAND-OP-09 | inconsistencias | Universo correspondiente | Faltantes, inversiones, contradicciones y duplicados | URG-R01/R04 |
| URG-CAND-OP-10 | tendencias y comparación | U-ING o U-EGR explícito | Periodos equivalentes, sin juicio de calidad | URG-R08 |
| URG-CAND-POB-01 | pacientes únicos y episodios | U-POB | Dos unidades separadas; identidad validable | URG-R01/R07 |
| URG-CAND-POB-02 | sexo | U-POB por episodio; paciente pendiente | Categorías, SIN DATO y DATO INVÁLIDO | URG-R07 |
| URG-CAND-POB-03 | edad y grupos de edad | U-POB | Semántica de edad y grupos pendientes | URG-R07 |
| URG-CAND-POB-04 | estado, municipio y localidad | U-POB | Geografía con cobertura y catálogos por validar | URG-R07 |
| URG-CAND-POB-05 | cobertura de población | U-POB y pacientes según dimensión | Con dato, sin dato, inválido; universo explícito | URG-R07 |
| URG-CAND-DES-01 | ingreso → triage | U-ING | Campos: fechaing / fechatri | URG-R04/R05 |
| URG-CAND-DES-02 | ingreso → atención | U-ING | Campos: fechaing / fechaate | URG-R04/R05 |
| URG-CAND-DES-03 | atención → alta médica | U-ING | Campos: fechaate / fechamed | URG-R04/R05 |
| URG-CAND-DES-04 | ingreso → egreso / permanencia | U-ING | Campos: fechaing / fechaegr | URG-R04/R05 |
| URG-CAND-DES-05 | permanencia >12 h | Duraciones completadas evaluables en U-ING | Campos: fechaing / fechaegr | URG-R04/R05 |
| URG-CAND-DES-06 | permanencia >24 h | Duraciones completadas evaluables en U-ING | Campos: fechaing / fechaegr | URG-R04/R05 |
| URG-CAND-DES-07 | reingreso <24 h | U-RET evaluable | Campos: Identidad/servicio POR VALIDAR; fechaing / fechaegr previas | URG-R06 |
| URG-CAND-DES-08 | reingreso <72 h | U-RET evaluable | Campos: Identidad/servicio POR VALIDAR; fechaing / fechaegr previas | URG-R06 |
| URG-CAND-DES-09 | secuencias temporales inconsistentes | U-ING | Campos: Cinco hitos clínicos | URG-R04/R05 |
| URG-CAND-DES-10 | abiertos de antigüedad elevada | U-ABI evaluable | Campos: fechaing / corte / fechaegr | URG-R03 |
| URG-CAND-DES-11 | cobertura de triage | U-ING | Campos: fechatri | URG-R04/R05 |
| URG-CAND-DES-12 | cobertura de atención | U-ING | Campos: fechaate | URG-R04/R05 |
| URG-CAND-DES-13 | cobertura de egreso | U-ING | Campos: fechaegr | URG-R04/R05 |

## Condiciones de definición

Duraciones: describir distribución y proponer mediana/percentiles sólo tras cerrar evaluabilidad; no declarar estadístico oficial. Permanencias >12 y >24: numerador con duración estrictamente superior al límite, denominador de permanencias completadas evaluables; informar cobertura sobre U-ING. Coberturas: episodios con fecha de etapa presente / U-ING; presencia no equivale a secuencia válida. Reingresos requieren decisión de límites exactos y antecedente. Los demás conteos dependen de representación e identidad comprobadas.

[Convenciones](01_CONVENCIONES_Y_REGLAS_COMUNES.md) · [Reglas canónicas](../REGLAS_NEGOCIO.md).
