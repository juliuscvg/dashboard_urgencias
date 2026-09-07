# Checkpoint funcional — 2026-09-07

- SHA base histórico publicado:717f681e6d979798a2b1d680dda64d765bb3b051.
- Alcance: reconciliación documental/funcional desde main; no nueva historia paralela ni reescritura.
- Commit de esta revisión: obtener con git log -1 --format=%H -- docs/gobierno/RECONCILIACION_BASELINE_717f681.md. Se registra evidencia de árbol antes del commit, no SHA autorreferente.
- Mensaje previsto: [URG][FUNC] Reconciliación funcional posterior al baseline. Sin push.

## Decisiones cerradas

epis_pk; semántica registro/egreso y etapas no obligatorias; ventana de 3 años móviles configurable con histórico accesible; universo servicios área 2/activos dinámico incluido HCO; activo doble nulo, deuda fuera actual y >24/>48/>72 sin recorte; promedio de permanencia y rangos nuevos; reingreso mismo paciente/servicio estricto<72; tres componentes triage; destino/motivo independientes; nueve grupos edad; horarios de turno; clínica/personal neutrales; filtros y navegación futura; detalle/exportación reconciliables y privacidad.

## Indicadores

Seis KPI de portada propuestos: Atenciones, Promedio diario, Permanencia promedio, Hospitalización, Reingresos<72h, Pacientes únicos. Bloque actual separado. Catálogo reorganizado en 20 elementos documentales;28 IDs antiguos conservan destino explícito. No oficiales ni implementados.

## Pendientes

Representación/unicidad, algoritmo antecedente, uniones y catálogos, edad/precedencia, localización/cobertura. Precisar atenciones, denominador diario, cohorte de permanencia, conteo/tasa Hospitalización/reingresos, referencia 48, fecha de jornada nocturna, filtros compatibles, permisos/responsables. Convenciones propuestas separadas de decisiones recibidas.

## Validación y próximos pasos

[Resultado documental](../../evidencia/VALIDACION_FUNCIONAL_DOCUMENTAL_2026-09-07.json); casos R2 sólo diseñados, SQL/API/UI/rendimiento NO EJECUTADOS. FAA conserva discrepancias históricas +2/+2. Próximo trabajo requerirá inventario SQL dirigido y cierre de subcontratos antes de implementar; no se inicia en esta iteración.

[Reconciliación](../../gobierno/RECONCILIACION_BASELINE_717f681.md) · [Estado vigente](../../gobierno/ESTADO_PROYECTO.md). Este checkpoint no prevalece sobre decisiones futuras.
