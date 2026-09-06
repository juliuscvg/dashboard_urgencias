# Casos patrón — Urgencias

No hay casos ejecutados ni validados vigentes. Los siguientes son diseños sintéticos propios, no fixtures basados en conteos históricos.

## URG-CP-01 — Granularidad

- Propósito: Dos filas del mismo episodio, una idéntica y otra variante.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R01, explicitado al materializar el fixture.
- Esperado independiente: Detectar repetición/contradicción; no seleccionar arbitrariamente.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R01, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-02 — Fronteras del periodo

- Propósito: Ingreso en desde, inmediatamente antes de hasta y exactamente en hasta_exclusivo.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R02, explicitado al materializar el fixture.
- Esperado independiente: Incluye los dos primeros; excluye el último.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R02, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-03 — Estado

- Propósito: Las cuatro combinaciones nulo/no nulo de fechaegr y motivo_alta_pk.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R03, explicitado al materializar el fixture.
- Esperado independiente: Cuatro clases excluyentes según R03; no confundir abierto con activo.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R03, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-04 — Antigüedad

- Propósito: Abierto reciente, >5 años, exactamente 5 años, ingreso futuro y nulo.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R03, explicitado al materializar el fixture.
- Esperado independiente: Separar histórico >5 años; futuro/nulo no evaluables; no censo automático.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R03, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-05 — Secuencias

- Propósito: Eventos completos, ausente intermedio, invertido no adyacente y mismo minuto.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R04, explicitado al materializar el fixture.
- Esperado independiente: Flags separados y pares evaluables; cero no equivale a ausencia.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R04, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-06 — Rangos

- Propósito: 30, 30.5, 60, 120, 240 min; 2, 6, 12, 24, 24.1 h.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R05, explicitado al materializar el fixture.
- Esperado independiente: Según propuesta R05 cada evaluable pertenece a un único rango; decisión pendiente.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R05, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-07 — Reingresos

- Propósito: Mismo paciente/servicio, otros servicios, duplicados y antecedentes fuera del periodo.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R06, explicitado al materializar el fixture.
- Esperado independiente: Sólo enlace elegible inequívoco; no truncar historia al periodo.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R06, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-08 — Límites y redondeo

- Propósito: 0, 23.99, 24, 24.01, 71.99, 72 y 72.01 h.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R06, explicitado al materializar el fixture.
- Esperado independiente: 0 no es después; límites exactos pendientes; visual no cambia pertenencia.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R06, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-09 — Población

- Propósito: Paciente con varios episodios y edad/residencia contradictoria; identidad ausente.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R07, explicitado al materializar el fixture.
- Esperado independiente: Unidades separadas, SIN DATO/INVÁLIDO y conflicto visibles.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R07, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-10 — Reconciliación y UX

- Propósito: Mismo contexto en agregado, página y count; fuente mutable; módulo en error.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R08, explicitado al materializar el fixture.
- Esperado independiente: Cardinalidad estable o discrepancia explícita; reintento conserva otros módulos.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R08, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.

## URG-CP-11 — Permanencia abierta/cerrada

- Propósito: Alta médica sin egreso; egreso en periodo con ingreso previo.
- Fecha/periodo: POR DEFINIR en fixture antes de ejecutar; incluir fronteras explícitas.
- Filtros: POR DEFINIR; centro y servicio sintéticos, sin datos personales.
- Configuración/exclusiones: versión de [configuración documental](../../config/baseline.json); ninguna exclusión productiva.
- Entidad/unidad: episodio, salvo identidad poblacional y filas de granularidad.
- Universo: el de URG-R02/R04, explicitado al materializar el fixture.
- Esperado independiente: No imputar egreso; U-EGR separado de U-ING; transcurrido separado.
- Reconciliación: categorías excluyentes suman universo cuando corresponda; duración evaluable + no evaluable = universo; resumen = count = cardinalidad del detalle completo bajo la misma observación. No sumar flags solapados.
- Regla que prueba: URG-R02/R04, [contrato](../REGLAS_NEGOCIO.md).
- Fuente de evidencia: [solicitud](../historico/prompts/SOLICITUD_BASELINE.txt), diseño documental; datos de prueba NO DOCUMENTADO.
- Estado: DISEÑADO / NO EJECUTADO; los esperados sujetos a decisión no habilitan PASS.
- Commit probado: NO DOCUMENTADO; no existe ejecución funcional.
