# Convenciones y reglas comunes — Urgencias

Antes de implementar, cada candidato debe cerrar unidad, fuente, periodo, inclusiones, exclusiones, deduplicación, campos, nulos, evaluabilidad, numerador, denominador y reconciliación. No hay fórmulas institucionales definitivas en este baseline.

Rigen [URG-R01 a URG-R08](../REGLAS_NEGOCIO.md). Calcular diferencias con precisión validada, convertir a minutos/horas y clasificar antes de redondear presentación. Evitar contar fronteras de minuto/hora como si fueran duración exacta. No convertir fecha_modif en tiempo clínico.

- Total de episodios representados = evaluables + no evaluables por candidato; particiones excluyentes declaradas.
- Distribución de dimensión = categorías conocidas + SIN DATO + DATO INVÁLIDO, con regla para contradicciones y sin doble conteo.
- Distribución de duraciones = suma de rangos entre evaluables; calidad se reconcilia aparte.
- Resumen de categoría = total exacto de detalle con mismo predicado; cada página mantiene pertenencia y orden estable.
- Denominador cero: NO CALCULABLE; no fabricar 0%.
- Pacientes únicos no son aditivos entre servicios/periodos; documentar intersecciones antes de reconciliar subtotales.
- No extrapolar conteos históricos ni usarlos como esperados actuales.

Rangos y ventanas son descriptivos. La pertenencia exacta a 24/72 h en reingreso está pendiente de decisión. No existen metas, semáforos de cumplimiento ni fichas definitivas.
