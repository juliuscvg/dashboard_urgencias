# Dashboard Urgencias

Proyecto institucional del Hospital Civil de Guadalajara. Fase vigente: consolidación documental/SQL 2026-09-08; no aplicación implementada.

Fuente principal dbo.vUrgencias; evento canónico identificado por id_urgencia y paciente longitudinal por codigo_cliente. epis_pk identifica el episodio XHIS asociado. La vista puede multiplicar filas durante enriquecimientos, por lo que las métricas cuentan eventos únicos. [Evidencia SQL validada](docs/evidencia/VALIDACION_SQL_FUNCIONAL_2026-09-08.md).

Origen histórico publicado e inmutable: 717f681e6d979798a2b1d680dda64d765bb3b051, [URG][BASE] Baseline funcional y transversal. Esta iteración conserva su historia y registra decisiones posteriores, sin squash/rebase.

[Inicio documental](docs/00_LEEME_PRIMERO.md) · [Estado](docs/gobierno/ESTADO_PROYECTO.md) · [Matriz de reconciliación](docs/gobierno/RECONCILIACION_BASELINE_717f681.md) · [Checkpoint](docs/historico/checkpoints/CHECKPOINT_FUNCIONAL_2026-09-07.md).

Portada propuesta de seis KPI, situación actual separada, ventana de tres años móviles configurable, promedio de permanencia, reingreso <72 h y catálogos dinámicos. La validación SQL documentada no convierte benchmarks en metas ni implica implementación u oficialización institucional. [Candidatos/estados](docs/indicadores/00_CATALOGO_INDICADORES.md).

## Comprobación documental

Con Node.js, sin instalar dependencias:

- node scripts/check-markdown-links.mjs
- node scripts/check-baseline.mjs

No hay frontend, backend, API, conexión SQL, consulta productiva, ETL ni caché. [Arquitectura futura](docs/ARQUITECTURA_FUTURA.md) sólo referencia. No reglas de negocio CEX importadas. La iteración genera un commit local sin push; HCG no se modifica ni se promueve automáticamente a multidominio.
