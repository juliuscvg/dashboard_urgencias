# Manifiesto de validación — Urgencias

## Validación documental del baseline

- Proyecto: juliuscvg/dashboard_urgencias.
- Fecha: 2026-09-06; fecha/hora efectiva registrada en [resultado documental](VALIDACION_DOCUMENTAL.json).
- Commit probado: NO DOCUMENTADO durante preparación. El resultado contiene el árbol staged exacto previo a añadir ese resultado, evitando la autorreferencia de un SHA dentro de su propio commit. El único commit final contiene ambos; el SHA definitivo se entrega al usuario y se obtiene con `git rev-parse HEAD`.
- Dataset: archivos locales del baseline y referencias Git inmutables; sin datos de pacientes.
- Periodo/filtros clínicos: NO APLICA. Configuración: [baseline.json](../../config/baseline.json).
- Universo: Markdown de trabajo (comprobador de enlaces) y 71 principios extraídos de la specs fijada.
- Esperado: 0 enlaces locales rotos, 71 IDs únicos y estructura mínima completa.
- Obtenido, diferencia, comandos y versiones: [resultado](VALIDACION_DOCUMENTAL.json).
- Capas: documentación; SQL/API/UI NO EJECUTADAS. Rendimiento clínico: NO APLICA.
- Estado: ver resultado documental; no implica PASS funcional.

## Esquema para futuras corridas funcionales

```yaml
id: POR_ASIGNAR
proyecto: juliuscvg/dashboard_urgencias
commit_probado: NO_DOCUMENTADO
fecha_hora_observacion: NO_DOCUMENTADO
base_o_dataset: NO_DOCUMENTADO
periodo:
  desde: NO_DOCUMENTADO
  hasta_exclusivo: NO_DOCUMENTADO
  mutable: NO_DETERMINADO
filtros: NO_DOCUMENTADO
configuracion: NO_DOCUMENTADO
indicador: CANDIDATO_POR_DEFINIR
universo:
  unidad: episodio_POR_VALIDAR
  inclusion: NO_DOCUMENTADO
  deduplicacion: NO_DOCUMENTADO
esperado: NO_DOCUMENTADO
obtenido: NO_DOCUMENTADO
reconciliacion:
  ecuacion: NO_DOCUMENTADO
  diferencia: NO_DOCUMENTADO
metodo:
  capas: NO_EJECUTADAS
  ejecuciones: 0
rendimiento: NO_DOCUMENTADO
estado: OBSERVACION
evidencia: NO_DOCUMENTADO
observaciones: Sin ejecución funcional en baseline
```

PASS requiere reconciliación y esperado independiente; HTTP o build exitoso no bastan. Registrar campos faltantes explícitos, frío/caliente y concurrencia cuando corresponda; omitir datos sensibles. Cualquier discrepancia entre agregado/detalle/count impide PASS reconciliado.
