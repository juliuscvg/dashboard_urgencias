import sql from 'mssql';
import type { DashboardFilters, DetailFilters, EpisodeRow, FilterOption } from '../domain/types.js';
import { getPool } from '../db/sql.js';
import { eventScopeSql, READMISSION_PRIOR_SQL } from './event-scope.sql.js';

function bindFilters(request: sql.Request, filters: Partial<DashboardFilters>, includePeriod = true): sql.Request {
  if (includePeriod) {
    request.input('Desde', sql.Date, filters.desde);
    request.input('Hasta', sql.Date, filters.hasta);
  }
  request.input('Centro', sql.VarChar(20), filters.centro ?? null);
  request.input('CodigoServicio', sql.Int, filters.codigoServicio ?? null);
  return request;
}

export async function fetchCatalogs(centro?: string): Promise<{ centros: FilterOption[]; servicios: FilterOption[] }> {
  const pool = await getPool();
  const result = await pool.request()
    .input('Centro', sql.VarChar(20), centro ?? null)
    .query(`
      SELECT C.centro_siglas AS value, C.centro_siglas AS label
      FROM dbo.centros AS C
      INNER JOIN dbo.servicios AS S ON S.cod_centro = C.cod_centro
      WHERE S.codigo_area = 2 AND S.serv_activo_sn = 1
      GROUP BY C.centro_siglas
      ORDER BY C.centro_siglas;

      SELECT S.codigo_servicio AS value, S.servicio AS label, C.centro_siglas AS centro
      FROM dbo.servicios AS S
      INNER JOIN dbo.centros AS C ON C.cod_centro = S.cod_centro
      WHERE S.codigo_area = 2
        AND S.serv_activo_sn = 1
        AND (@Centro IS NULL OR C.centro_siglas = @Centro)
      ORDER BY C.centro_siglas, S.servicio, S.codigo_servicio;
    `);
  const sets = result.recordsets as sql.IRecordSet<unknown>[];
  return {
    centros: (sets[0] ?? []) as unknown as FilterOption[],
    servicios: (sets[1] ?? []) as unknown as FilterOption[],
  };
}

export async function fetchSummaryBase(filters: DashboardFilters): Promise<Record<string, unknown>> {
  const pool = await getPool();
  const result = await bindFilters(pool.request(), filters).query(`
    DECLARE @Hoy date = CONVERT(date, GETDATE());
    DECLARE @FinExclusivo datetime = DATEADD(DAY, 1, @Hasta);
    DECLARE @FinCompleto datetime =
      CASE WHEN @FinExclusivo <= CONVERT(datetime, @Hoy) THEN @FinExclusivo ELSE CONVERT(datetime, @Hoy) END;
    DECLARE @DiasCompletos int =
      CASE WHEN @FinCompleto > CONVERT(datetime, @Desde)
        THEN DATEDIFF(DAY, @Desde, @FinCompleto) ELSE 0 END;

    ${eventScopeSql()}
    SELECT
      COUNT_BIG(*) AS atenciones,
      COUNT(DISTINCT codigo_cliente) AS pacientesUnicos,
      CAST(COUNT_BIG(*) * 1.0 / NULLIF(COUNT(DISTINCT codigo_cliente), 0) AS decimal(18, 2)) AS atencionesPorPaciente,
      @DiasCompletos AS diasCompletos,
      SUM(CASE WHEN Fechaing < @FinCompleto THEN CONVERT(bigint, 1) ELSE 0 END) AS atencionesDiasCompletos,
      CAST(SUM(CASE WHEN Fechaing < @FinCompleto THEN CONVERT(decimal(20, 4), 1) ELSE 0 END)
        / NULLIF(@DiasCompletos, 0) AS decimal(18, 2)) AS promedioDiario,
      CASE WHEN @FinExclusivo > CONVERT(datetime, @Hoy) THEN 1 ELSE 0 END AS periodoParcial,
      SUM(CASE WHEN Fechaing IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr >= Fechaing
        THEN CONVERT(bigint, 1) ELSE 0 END) AS eventosCompletados,
      CAST(AVG(CASE WHEN Fechaing IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr >= Fechaing
        THEN DATEDIFF(MINUTE, Fechaing, fechaegr) / 60.0 END) AS decimal(18, 2)) AS permanenciaPromedioHoras,
      SUM(CASE WHEN Fechaing IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr >= Fechaing
        AND destino_urg_pk = 5 THEN CONVERT(bigint, 1) ELSE 0 END) AS hospitalizaciones,
      CAST(100.0 * SUM(CASE WHEN Fechaing IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr >= Fechaing
        AND destino_urg_pk = 5 THEN CONVERT(decimal(20, 4), 1) ELSE 0 END)
        / NULLIF(SUM(CASE WHEN Fechaing IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr >= Fechaing
          THEN CONVERT(decimal(20, 4), 1) ELSE 0 END), 0) AS decimal(9, 4)) AS hospitalizacionPct,
      SUM(CASE WHEN conflicto_nucleo = 1 THEN CONVERT(bigint, 1) ELSE 0 END) AS eventosConConflicto,
      SUM(filas_fisicas - 1) AS filasMultiplicadas,
      GETDATE() AS observadoEn
    FROM EventScope;
  `);
  return result.recordset[0] ?? {};
}

export async function fetchReadmissions(filters: DashboardFilters): Promise<Record<string, unknown>> {
  const pool = await getPool();
  const result = await bindFilters(pool.request(), filters).query(`
    ${eventScopeSql()}
    SELECT
      SUM(CASE WHEN E.codigo_cliente IS NOT NULL AND E.codigo_servicio IS NOT NULL AND E.Fechaing IS NOT NULL
        THEN CONVERT(bigint, 1) ELSE 0 END) AS eventosEvaluables,
      SUM(CASE WHEN Prior.fechaegr IS NOT NULL AND E.Fechaing < DATEADD(HOUR, 48, Prior.fechaegr)
        THEN CONVERT(bigint, 1) ELSE 0 END) AS reingresosMenor48,
      SUM(CASE WHEN Prior.fechaegr IS NOT NULL AND E.Fechaing < DATEADD(HOUR, 72, Prior.fechaegr)
        THEN CONVERT(bigint, 1) ELSE 0 END) AS reingresosMenor72
    FROM EventScope AS E
    ${READMISSION_PRIOR_SQL};
  `);
  return result.recordset[0] ?? {};
}

export async function fetchCurrent(filters: Pick<DashboardFilters, 'centro' | 'codigoServicio'>): Promise<Record<string, unknown>> {
  const pool = await getPool();
  const result = await bindFilters(pool.request(), filters, false).query(`
    ${eventScopeSql({ includePeriod: false, activeOnly: true })}
    SELECT COUNT_BIG(*) AS activosProbables, GETDATE() AS observadoEn
    FROM EventScope;
  `);
  return result.recordset[0] ?? {};
}

export async function fetchDemand(filters: DashboardFilters): Promise<{ tendencia: unknown[]; servicios: unknown[] }> {
  const pool = await getPool();
  const trend = await bindFilters(pool.request(), filters).query(`
    ${eventScopeSql()}
    SELECT CONVERT(char(10), Fechaing, 23) AS fecha, COUNT_BIG(*) AS atenciones
    FROM EventScope
    GROUP BY CONVERT(char(10), Fechaing, 23)
    ORDER BY fecha;
  `);

  const services = await bindFilters(pool.request(), filters).query(`
    ${eventScopeSql()}
    , Activity AS
    (
      SELECT centro, codigo_servicio, COUNT_BIG(*) AS atenciones
      FROM EventScope
      GROUP BY centro, codigo_servicio
    )
    SELECT
      C.centro_siglas AS centro,
      S.codigo_servicio AS codigoServicio,
      S.servicio,
      COALESCE(A.atenciones, 0) AS atenciones,
      CASE WHEN A.atenciones IS NULL THEN 'SIN_ACTIVIDAD_EN_EL_PERIODO' ELSE 'CON_ACTIVIDAD' END AS estado
    FROM dbo.servicios AS S
    INNER JOIN dbo.centros AS C ON C.cod_centro = S.cod_centro
    LEFT JOIN Activity AS A
      ON A.codigo_servicio = S.codigo_servicio
     AND A.centro = C.centro_siglas
    WHERE S.codigo_area = 2
      AND S.serv_activo_sn = 1
      AND (@Centro IS NULL OR C.centro_siglas = @Centro)
      AND (@CodigoServicio IS NULL OR S.codigo_servicio = @CodigoServicio)
    ORDER BY C.centro_siglas, S.servicio, S.codigo_servicio;
  `);

  return { tendencia: trend.recordset, servicios: services.recordset };
}

export async function fetchResolution(filters: DashboardFilters): Promise<unknown[]> {
  const pool = await getPool();
  const result = await bindFilters(pool.request(), filters).query(`
    ${eventScopeSql()}
    , Distribucion AS
    (
      SELECT destino_urg_pk, destino_urgencias, COUNT_BIG(*) AS eventos
      FROM EventScope
      GROUP BY destino_urg_pk, destino_urgencias
    )
    SELECT destino_urg_pk AS destinoUrgPk, destino_urgencias AS destino, eventos,
      CAST(100.0 * eventos / NULLIF((SELECT SUM(eventos) FROM Distribucion), 0) AS decimal(9, 4)) AS porcentaje
    FROM Distribucion
    ORDER BY eventos DESC, destino_urg_pk, destino_urgencias;
  `);
  return result.recordset;
}

export async function fetchFrequentation(filters: DashboardFilters): Promise<unknown[]> {
  const pool = await getPool();
  const result = await bindFilters(pool.request(), filters).query(`
    ${eventScopeSql()}
    , Frecuencia AS
    (
      SELECT codigo_cliente, COUNT_BIG(*) AS eventos
      FROM EventScope
      WHERE codigo_cliente IS NOT NULL
      GROUP BY codigo_cliente
    )
    SELECT CASE WHEN eventos = 1 THEN '1' WHEN eventos = 2 THEN '2' WHEN eventos = 3 THEN '3'
        WHEN eventos BETWEEN 4 AND 5 THEN '4-5' WHEN eventos BETWEEN 6 AND 10 THEN '6-10' ELSE '11+' END AS banda,
      COUNT_BIG(*) AS pacientes
    FROM Frecuencia
    GROUP BY CASE WHEN eventos = 1 THEN '1' WHEN eventos = 2 THEN '2' WHEN eventos = 3 THEN '3'
        WHEN eventos BETWEEN 4 AND 5 THEN '4-5' WHEN eventos BETWEEN 6 AND 10 THEN '6-10' ELSE '11+' END
    ORDER BY MIN(eventos);
  `);
  return result.recordset;
}

export async function fetchEpisodes(filters: DetailFilters): Promise<{ total: number; rows: EpisodeRow[] }> {
  const pool = await getPool();
  const result = await bindFilters(pool.request(), filters)
    .input('Offset', sql.Int, (filters.page - 1) * filters.pageSize)
    .input('PageSize', sql.Int, filters.pageSize)
    .query(`
      ${eventScopeSql()}
      , Numbered AS
      (
        SELECT
          id_urgencia AS idUrgencia,
          Fechaing AS fechaIngreso,
          fechaegr AS fechaEgreso,
          centro,
          codigo_servicio AS codigoServicio,
          servicio,
          destino_urgencias AS destino,
          motivo_alta AS motivoAlta,
          CAST(CASE WHEN fechaegr >= Fechaing THEN DATEDIFF(MINUTE, Fechaing, fechaegr) / 60.0 END AS decimal(18, 2)) AS permanenciaHoras,
          filas_fisicas AS filasFisicas,
          CAST(conflicto_nucleo AS bit) AS conflicto,
          ROW_NUMBER() OVER (ORDER BY Fechaing DESC, id_urgencia DESC) AS rowNumber,
          COUNT_BIG(*) OVER() AS totalFilas
        FROM EventScope
      )
      SELECT idUrgencia, fechaIngreso, fechaEgreso, centro, codigoServicio, servicio, destino, motivoAlta,
        permanenciaHoras, filasFisicas, conflicto, totalFilas
      FROM Numbered
      WHERE rowNumber > @Offset AND rowNumber <= @Offset + @PageSize
      ORDER BY rowNumber;
    `);

  const rows = result.recordset as Array<EpisodeRow & { totalFilas: number }>;
  return {
    total: Number(rows[0]?.totalFilas ?? 0),
    rows: rows.map(({ totalFilas: _total, ...row }) => row),
  };
}

export async function fetchTriage(filters: DashboardFilters): Promise<{ resumen: Record<string, unknown>; servicios: unknown[]; clasificacion: unknown[] }> {
  const pool = await getPool();
  const result = await bindFilters(pool.request(), filters).query(`
    ${eventScopeSql()}
    SELECT
      COUNT_BIG(*) AS universoTotal,
      SUM(CASE WHEN fechatri IS NOT NULL THEN CONVERT(bigint, 1) ELSE 0 END) AS eventosConTriage,
      CAST(100.0 * SUM(CASE WHEN fechatri IS NOT NULL THEN CONVERT(decimal(20, 4), 1) ELSE 0 END)
        / NULLIF(COUNT_BIG(*), 0) AS decimal(9, 2)) AS coberturaPct,
      SUM(CASE WHEN fechatri >= Fechaing THEN CONVERT(bigint, 1) ELSE 0 END) AS eventosEvaluablesTiempo,
      CAST(AVG(CASE WHEN fechatri >= Fechaing THEN DATEDIFF(MINUTE, Fechaing, fechatri) * 1.0 END) AS decimal(18, 2)) AS tiempoPromedioMinutos,
      SUM(CASE WHEN fechatri < Fechaing THEN CONVERT(bigint, 1) ELSE 0 END) AS secuenciasInvertidas,
      SUM(CASE WHEN fechatri >= DATEADD(HOUR, 24, Fechaing) THEN CONVERT(bigint, 1) ELSE 0 END) AS tiemposMayorIgual24h,
      SUM(CASE WHEN fechatri >= DATEADD(DAY, 7, Fechaing) THEN CONVERT(bigint, 1) ELSE 0 END) AS tiemposMayorIgual7d
    FROM EventScope;

    ${eventScopeSql()}
    SELECT centro, codigo_servicio AS codigoServicio, servicio,
      COUNT_BIG(*) AS universoTotal,
      SUM(CASE WHEN fechatri IS NOT NULL THEN CONVERT(bigint, 1) ELSE 0 END) AS eventosConTriage,
      CAST(100.0 * SUM(CASE WHEN fechatri IS NOT NULL THEN CONVERT(decimal(20, 4), 1) ELSE 0 END)
        / NULLIF(COUNT_BIG(*), 0) AS decimal(9, 2)) AS coberturaPct
    FROM EventScope
    GROUP BY centro, codigo_servicio, servicio
    ORDER BY centro, servicio, codigo_servicio;

    ${eventScopeSql()}
    , Distribucion AS
    (
      SELECT triage_codigo, triage_desc, COUNT_BIG(*) AS eventos
      FROM EventScope
      WHERE triage_codigo IS NOT NULL OR triage_desc IS NOT NULL
      GROUP BY triage_codigo, triage_desc
    )
    SELECT triage_codigo AS triageCodigo, triage_desc AS triageDescripcion, eventos,
      CAST(100.0 * eventos / NULLIF((SELECT SUM(eventos) FROM Distribucion), 0) AS decimal(9, 2)) AS porcentajeSobreClasificados
    FROM Distribucion
    ORDER BY triage_codigo, triage_desc;
  `);
  const sets = result.recordsets as sql.IRecordSet<Record<string, unknown>>[];
  return { resumen: sets[0]?.[0] ?? {}, servicios: sets[1] ?? [], clasificacion: sets[2] ?? [] };
}
