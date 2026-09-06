# Descubrimientos y limitaciones — Urgencias

| ID | Hallazgo | Evidencia | Impacto | Regla asociada | Estado | Alcance |
|---|---|---|---|---|---|---|
| URG-H01 | Hay referencia aportada a abiertos históricos >5 años | Solicitud, sin extracción nueva | No inferir censo actual | URG-R03 | HISTÓRICO / REQUIERE REVALIDACIÓN | Urgencias |
| URG-H02 | No hay esquema ni cardinalidad comprobados | Esta tarea no ejecutó SQL | No contar filas como episodios | URG-R01 | REQUIERE CONSULTA SQL | Urgencias |
| URG-H03 | Semántica de edad, identidad y localización no descrita | Solicitud incompleta en esos puntos | Candidatos poblacionales/localización pendientes | URG-R07/R08 | NO DOCUMENTADO | Urgencias |
| URG-H04 | «dentro de» y «<» dejan abiertos límites 24/72 h | Solicitud | No oficializar reingresos | URG-R06 | REQUIERE DECISIÓN FUNCIONAL | Urgencias |
| URG-H05 | Rangos escritos no resuelven fracciones y extremos compartidos | Solicitud | Propuesta de intervalos sin huecos | URG-R05 | POR VALIDAR | Urgencias |
| URG-H06 | Permanencia histórica suma 12,358 frente a 12,356 con egreso | Aritmética de cifras aportadas | Diferencia +2 sin explicación; no ajustar cifras | URG-R04 | HISTÓRICO / REQUIERE REVALIDACIÓN | FAA adultos |
| URG-H07 | HCG permite RECHAZADO y espera validación; solicitud usa PENDIENTE | Specs fijada y solicitud | Registrar PENDIENTE local sin modificar HCG | URG-GOV-002 | Adaptación documental | Transversal candidata |
| URG-H08 | Atención histórica suma 12,021 frente a 12,019 con atención | Aritmética de cifras aportadas | Diferencia +2; contexto de extracción desconocido | URG-R04 | HISTÓRICO / REQUIERE REVALIDACIÓN | FAA adultos |

## Vacíos de datos y evidencia

REQUIERE CONSULTA SQL: casing real, tipos, precisión, nulos, claves, duplicados, vínculos episodio/registro/paciente, códigos de servicio, catálogos, cobertura de hitos y residencia, origen de edad, temporalidad de localización, profundidad de historia y mutabilidad. Consulta limitada a vUrgencias; carencias adicionales se justifican antes de ampliar fuentes.

NO DOCUMENTADO: entorno autorizado de extracción, periodo/filtros exactos y fecha de observación histórica, SQL original, semántica de zona, desempates, exclusiones institucionales, responsables funcionales y política de acceso al detalle. No se han buscado credenciales ni datos personales.

## PREGUNTAS PARA DEFINICIÓN FUNCIONAL

1. ¿Qué ventana operativa y tramos de antigüedad deben distinguir activos probables recientes de abiertos antiguos, además del resguardo >5 años?
2. ¿Reingreso incluye exactamente 24 y 72 horas? ¿Qué tratamiento corresponde a transferencias, retornos planificados y episodios intermedios de otro servicio?
3. ¿Se aprueba seleccionar el egreso elegible más reciente y considerar no evaluables los antecedentes ambiguos o sin historia suficiente?
4. ¿Se aprueban los intervalos continuos propuestos para atención/permanencia y el redondeo sólo visual a 0.5 h?
5. ¿Cuál es el evento de referencia para edad, qué grupos etarios se necesitan y cómo representar edad/residencia de pacientes con varios episodios?
6. ¿Se requiere censo histórico, stock al corte actual o cohorte de ingresos abiertos? ¿Qué comparación de periodos y tratamiento de cierres parciales necesita el usuario institucional?
7. ¿Quién aprobará universos, exclusiones, acceso al detalle identificable y definiciones finales de candidatos?

Las comprobaciones de esquema no son preguntas humanas: pertenecen al [plan SQL dirigido](evidencia/PLAN_VALIDACION.md).

## Criterio de uso

Un hallazgo sólo cambia una regla por decisión explícita. Datos históricos no son benchmark vigente. Ninguna limitación autoriza imputar, corregir o eliminar datos silenciosamente.
