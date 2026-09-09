export interface EventScopeOptions {
  includePeriod?: boolean;
  activeOnly?: boolean;
}

export function eventScopeSql(options: EventScopeOptions = {}): string {
  const period = options.includePeriod === false
    ? ''
    : 'AND V.Fechaing >= @Desde AND V.Fechaing < DATEADD(DAY, 1, @Hasta)';
  const active = options.activeOnly
    ? 'AND V.fechaegr IS NULL AND V.motivo_alta_pk IS NULL'
    : '';

  return `
WITH RawScope AS
(
  SELECT
    V.id_urgencia,
    V.codigo_cliente,
    V.Fechaing,
    V.fechaegr,
    V.fechatri,
    V.triage_codigo,
    V.triage_desc,
    V.destino_urg_pk,
    V.destino_urgencias,
    V.motivo_alta_pk,
    V.motivo_alta,
    S.codigo_servicio,
    S.servicio,
    C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S
    ON S.codigo_servicio = V.codigo_servicio_ingreso
   AND S.cod_centro = V.cod_centro
   AND S.codigo_area = 2
   AND S.serv_activo_sn = 1
  INNER JOIN dbo.centros AS C
    ON C.cod_centro = S.cod_centro
  WHERE V.id_urgencia IS NOT NULL
    ${period}
    ${active}
    AND (@Centro IS NULL OR C.centro_siglas = @Centro)
    AND (@CodigoServicio IS NULL OR S.codigo_servicio = @CodigoServicio)
),
EventScope AS
(
  SELECT
    id_urgencia,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40), codigo_cliente), '<NULL>')) = 1
      THEN MIN(codigo_cliente) END AS codigo_cliente,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40), codigo_servicio), '<NULL>')) = 1
      THEN MIN(codigo_servicio) END AS codigo_servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000), servicio), '<NULL>')) = 1
      THEN MIN(CONVERT(varchar(4000), servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40), centro), '<NULL>')) = 1
      THEN MIN(CONVERT(varchar(40), centro)) END AS centro,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33), Fechaing, 126), '<NULL>')) = 1
      THEN MIN(Fechaing) END AS Fechaing,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33), fechaegr, 126), '<NULL>')) = 1
      THEN MIN(fechaegr) END AS fechaegr,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33), fechatri, 126), '<NULL>')) = 1
      THEN MIN(fechatri) END AS fechatri,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40), triage_codigo), '<NULL>')) = 1
      THEN MIN(triage_codigo) END AS triage_codigo,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000), triage_desc), '<NULL>')) = 1
      THEN MIN(CONVERT(varchar(4000), triage_desc)) END AS triage_desc,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40), destino_urg_pk), '<NULL>')) = 1
      THEN MIN(destino_urg_pk) END AS destino_urg_pk,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000), destino_urgencias), '<NULL>')) = 1
      THEN MIN(CONVERT(varchar(4000), destino_urgencias)) END AS destino_urgencias,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40), motivo_alta_pk), '<NULL>')) = 1
      THEN MIN(motivo_alta_pk) END AS motivo_alta_pk,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000), motivo_alta), '<NULL>')) = 1
      THEN MIN(CONVERT(varchar(4000), motivo_alta)) END AS motivo_alta,
    COUNT_BIG(*) AS filas_fisicas,
    CASE WHEN
      COUNT(DISTINCT ISNULL(CONVERT(varchar(40), codigo_cliente), '<NULL>')) > 1 OR
      COUNT(DISTINCT ISNULL(CONVERT(varchar(40), codigo_servicio), '<NULL>')) > 1 OR
      COUNT(DISTINCT ISNULL(CONVERT(varchar(33), Fechaing, 126), '<NULL>')) > 1
      THEN 1 ELSE 0 END AS conflicto_nucleo
  FROM RawScope
  GROUP BY id_urgencia
)
`;
}

export const READMISSION_PRIOR_SQL = `
OUTER APPLY
(
  SELECT TOP (1)
    P.id_urgencia,
    P.Fechaing,
    P.fechaegr
  FROM dbo.vUrgencias AS P
  WHERE P.id_urgencia <> E.id_urgencia
    AND P.codigo_cliente = E.codigo_cliente
    AND P.codigo_servicio_ingreso = E.codigo_servicio
    AND P.Fechaing IS NOT NULL
    AND P.fechaegr IS NOT NULL
    AND P.fechaegr >= P.Fechaing
    AND P.fechaegr < E.Fechaing
  GROUP BY P.id_urgencia, P.Fechaing, P.fechaegr
  ORDER BY P.fechaegr DESC, P.Fechaing DESC, P.id_urgencia DESC
) AS Prior
`;