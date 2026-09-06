# Diccionario provisional — vUrgencias

Fuente: [solicitud original](../historico/prompts/SOLICITUD_BASELINE.txt). No se leyó esquema ni datos SQL. Todos los nombres siguientes son comunicados, no columnas verificadas. Tipo físico, longitud, nulabilidad declarada, catálogo y cobertura: NO DOCUMENTADO.

| Nombre comunicado | Semántica inicial | Validación requerida |
|---|---|---|
| episodio_pk | Clave candidata de episodio | Unicidad, nulos, ámbito por centro |
| id_urgencia | Identificador de registro de Urgencias | Existencia y cardinalidad con episodio |
| codigo_cliente | Identidad de paciente candidata | Estabilidad, nulos y alcance entre centros |
| nombre | Nombre de paciente comunicado | Existencia; no incorporar valores personales a evidencia |
| sexo | Sexo comunicado | Catálogo y códigos nulos/inválidos |
| edad | Edad expuesta | Unidad, referencia temporal y cálculo |
| centro | Centro comunicado | Nombre físico, códigos y alcance |
| servicio_ingreso | Servicio de ingreso comunicado | Código/descripción y semántica |
| tipo_ingreso | Tipo de ingreso comunicado | Catálogo y significado |
| fechaing | Ingreso a Urgencias | Tipo, precisión, zona, cobertura |
| fechatri | Triage | Tipo, precisión, zona, cobertura |
| fechaate | Atención | Tipo, precisión, zona, cobertura |
| fechamed | Alta médica | Tipo, precisión, zona, cobertura |
| fechaegr | Egreso | Tipo, precisión, zona, cobertura |
| fecha_modif | Modificación administrativa/técnica | No usar como evento clínico; semántica de actualización |
| motivo_alta_pk | Clave de motivo de alta | Nulos, catálogo y relación con egreso |
| destino_urg_pk | Clave de destino | Catálogo, nulos y temporalidad |

## Conceptos sin nombre físico inequívoco

No usar estos conceptos como nombres de columna en SQL.

| Concepto | Uso candidato | Columna física |
|---|---|---|
| Folio/registro | Identidad administrativa | NO DOCUMENTADO / REQUIERE CONSULTA SQL |
| Residencia: estado, municipio, localidad | Geografía del paciente | NO DOCUMENTADO / REQUIERE CONSULTA SQL |
| Médico | Profesional de ingreso/atención por distinguir | NO DOCUMENTADO / REQUIERE CONSULTA SQL |
| Localización | Ubicación actual o histórica por distinguir | NO DOCUMENTADO / REQUIERE CONSULTA SQL |
| Triage: nivel y responsable | Clasificación y autoría, si están disponibles | NO DOCUMENTADO / REQUIERE CONSULTA SQL |
| Motivo de alta: descripción | Etiqueta asociada a motivo_alta_pk | NO DOCUMENTADO / REQUIERE CONSULTA SQL |
| Destino: descripción | Etiqueta asociada a destino_urg_pk | NO DOCUMENTADO / REQUIERE CONSULTA SQL |
| Cama | Ubicación, no capacidad | NO DOCUMENTADO / REQUIERE CONSULTA SQL |

Edad no autoriza inferir fecha de nacimiento. No se han observado campos adicionales en referencias de Urgencias. Completar evidencia de esquema, tipos, nulos, catálogo y commit de la consulta antes de implementar.
