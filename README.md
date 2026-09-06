# Dashboard Urgencias

Dashboard institucional del dominio Urgencias del Hospital Civil de Guadalajara.

## Propósito

Preparar el análisis de operación, población y desempeño con reglas propias, fuentes explícitas y resultados auditables.

## Alcance y límites

- Baseline documental independiente en `juliuscvg/dashboard_urgencias`.
- Entidad esperada: episodio de Urgencias; clave funcional candidata `episodio_pk`.
- Fuente principal inicial: `dbo.vUrgencias`; casing, esquema efectivo y granularidad POR VALIDAR.
- No existe frontend, backend, conexión SQL ni indicador implementado. No se trasladan fórmulas, estados, capacidad ni indicadores D01–D05 de CEX.

## Estado y documentación

[Inicio documental](docs/00_LEEME_PRIMERO.md) · [Estado](docs/gobierno/ESTADO_PROYECTO.md) · [Adopción de 71 principios HCG](docs/gobierno/ADOPCION_HCG.md).

Las [referencias y plantillas](docs/gobierno/PROCEDENCIA.md) están fijadas a commits. La adopción es documental; no equivale a validación multidominio.

## Ejecución

Node.js, sin instalar paquetes: `node scripts/check-markdown-links.mjs`.
Comprobación estructural: `node scripts/check-baseline.mjs`.
No hay aplicación que ejecutar. Git conserva un único commit inicial; no se realiza push.
