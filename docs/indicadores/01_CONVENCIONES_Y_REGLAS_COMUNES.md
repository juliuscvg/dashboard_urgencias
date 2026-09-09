# Convenciones y reglas comunes

Contexto vigente y SQL validado son estados distintos. Rigen [URG-R01 a R13](../REGLAS_NEGOCIO.md), pendientes en [catálogo](00_CATALOGO_INDICADORES.md). Antes de implementar cerrar unidad, fuente, universo, evento, periodo, filtros, representación/desempates, campos, nulos, numerador/denominador y reconciliación. No deduplicación arbitraria ni joins que multipliquen episodios.

- Universo = evaluables + no evaluables por cálculo; clases excluyentes. Atenciones cuenta id_urgencia. Reingreso usa todos los eventos evaluables como denominador, incluso sin antecedente.
- Distribución = categorías + SIN DATO + DATO INVÁLIDO/contradicción según partición explícita.
- Duraciones reales, no conteo de fronteras horarias; convertir sin redondear antes de clasificar. Ceros/extremos válidos incluidos; faltantes/negativos separados.
- Promedio aritmético completados y transcurrido abiertos separados; denominador cero no calculable.
- Reingreso 0<t<72; bandas (0,24], (24,48], (48,72). El corte secundario <=48 suma las dos primeras. Seleccionar el egreso válido más reciente del mismo paciente/servicio; redondeo 0.5 no determina pertenencia.
- Activos >24/>48/>72 acumulativos; stock no restringido al periodo histórico ni ventana móvil.
- Mismo predicado agregado/detalle/count/exportación y snapshot o discrepancia documentada.
- Pacientes únicos no aditivos entre servicios/periodos; conservar intersecciones.
- Comparación conteos %, proporciones pp, tiempos minutos/horas; base cero/periodo parcial explícitos.
- No extrapolar FAA ni usarlo como esperado actual. No metas, semáforos o tasas oficiales inventadas.

Fronteras de permanencia/grupos en reglas/configuración documental; contrato no acredita SQL.
