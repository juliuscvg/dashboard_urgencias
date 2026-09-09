# Arquitectura técnica vigente

Primera fase implementada el 2026-09-08. Dashboard CEX se usó sólo como referencia transversal para separar capas, paginar en servidor y manejar estados de interfaz. Ninguna regla clínica u operativa de CEX forma parte de Urgencias.

```text
SQL Server 2012 / compatibilidad 100 (lectura)
        ↓
Repository + EventScope canónico
        ↓
Servicio de dominio
        ↓
Express API
        ↓
React + React Query
```

## Componentes

- `server/src/repository/event-scope.sql.ts`: única construcción del universo. Une `vUrgencias` con catálogos, filtra servicios activos del área 2 y reduce filas físicas a un evento por `id_urgencia`.
- `server/src/repository/urgencias.repository.ts`: consultas parametrizadas read-only. Conserva los extremos, expone conflictos y usa `ROW_NUMBER()` para paginar con compatibilidad 100.
- `server/src/service/urgencias.service.ts`: normaliza tipos y compone resultados; no redefine predicados SQL.
- `server/src/http`: valida entradas y publica contratos sin PII.
- `client/src`: presenta resultados del API, filtros dinámicos, estados de carga/error/sin datos y periodo parcial; no calcula indicadores funcionales.
- Configuración SQL sólo mediante variables de entorno. No se versionan credenciales.

## Endpoints implementados

| Endpoint | Responsabilidad |
|---|---|
| `GET /api/health` | Salud del proceso |
| `GET /api/health/db` | Conectividad read-only y hora de base |
| `GET /api/urgencias/filters` | Centros y servicios activos dinámicos |
| `GET /api/urgencias/summary` | KPI aceptados y activos probables separados |
| `GET /api/urgencias/demand` | Tendencia diaria y servicios, incluso sin actividad |
| `GET /api/urgencias/triage` | Cobertura, tiempo registrado y señales por servicio |
| `GET /api/urgencias/episodes` | Detalle mínimo paginado y reconciliable |

Todos los endpoints analíticos aceptan `desde`, `hasta`, `centro` y `codigoServicio`; el final del periodo es inclusivo en UI y exclusivo en SQL mediante `DATEADD(DAY, 1, @Hasta)`.

## Evolución

Permanencia, reingresos, resolución, Triage, población y atención conservan módulos de dominio separados. Se añadirá caché sólo con medición; sus claves deberán incluir todos los filtros, corte y versión de universo. No se prevén escrituras, ETL ni cambios a la base productiva.
