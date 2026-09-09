# Evidencia de implementación — fase 1

Fecha de corte: 2026-09-08, America/Mexico_City.

## Alcance verificable

La fase crea un monorepo TypeScript con API Express/MSSQL y frontend React/Vite. El acceso SQL es parametrizado y de lectura. `EventScope` concentra periodo, centro, servicio activo de área 2 y granularidad por `id_urgencia`; resumen, demanda, Triage y detalle lo reutilizan.

Pruebas automatizadas cubren periodo inclusivo, fecha inválida, granularidad canónica, catálogo dinámico, ausencia de códigos de centros conocidos en SQL y selección del antecedente válido. Compilación, pruebas, enlaces, `git diff --check` y búsquedas de sentencias de escritura forman el cierre técnico.

## Benchmark externo conservado

La evidencia comunicada para aproximadamente los últimos tres años registra 484,190 atenciones, 45,577 eventos con Triage y 9.41% de cobertura. JIM Pediatría mostró aproximadamente 90–96% en 2025 y 92–97% en 2026. FAA TOCO mostró frecuentemente 20–40% en 2024–2025 y valores de un dígito en varios meses de 2026. Son observaciones fechadas, no metas ni causa inferida.

Estos valores no se codifican en la aplicación. Se reconciliarán mediante el endpoint con el mismo periodo y filtros cuando exista configuración local autorizada. Cualquier diferencia se registrará sin cambiar fórmulas ni excluir anomalías.

## Límites

La validación de conexión y la reconciliación real dependen de variables `DB_*` locales. Si no están disponibles, el build y las pruebas estáticas demuestran coherencia estructural, pero no sustituyen una corrida contra SQL Server.

## Resultado técnico de esta corrida

No existía archivo `.env` ni estaban definidas `DB_SERVER`, `DB_DATABASE`, `DB_USER` o `DB_PASSWORD`. Por ello no se abrió conexión, no se ejecutaron consultas y los endpoints no pudieron reconciliarse contra la base en esta corrida. La desviación queda aislada a disponibilidad de configuración; no se modificó ninguna fórmula para compensarla.
