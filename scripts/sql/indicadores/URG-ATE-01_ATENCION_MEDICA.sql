/*
  SQL verificable de Dashboard Urgencias.
  Motor: SQL Server 2012; nivel de compatibilidad 100.
  Acceso: sólo lectura.
  Parámetros requeridos del llamador:
    @Desde date, @Hasta date, @Centro varchar(20)=NULL, @CodigoServicio int=NULL.
  Periodo: Fechaing >= @Desde AND Fechaing < DATEADD(DAY,1,@Hasta).
  fechaate es el timestamp canónico actual del hito registrado de Atención
  médica (URG-ATE-01). No acredita inicio clínico real, oportunidad ni
  presencia física; no se usa atencion_fecha para completar valores.
*/
WITH RawScope AS
(
  SELECT V.id_urgencia, V.codigo_cliente, V.Fechaing, V.fechaate,
    S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S
    ON S.codigo_servicio = V.codigo_servicio_ingreso
   AND S.cod_centro = V.cod_centro
   AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  INNER JOIN dbo.centros AS C ON C.cod_centro = S.cod_centro
  WHERE V.id_urgencia IS NOT NULL
    AND V.Fechaing >= @Desde AND V.Fechaing < DATEADD(DAY, 1, @Hasta)
    AND (@Centro IS NULL OR C.centro_siglas = @Centro)
    AND (@CodigoServicio IS NULL OR S.codigo_servicio = @CodigoServicio)
),
EventScope AS
(
  SELECT id_urgencia,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),codigo_cliente),'<NULL>'))=1 THEN MIN(codigo_cliente) END AS codigo_cliente,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),codigo_servicio),'<NULL>'))=1 THEN MIN(codigo_servicio) END AS codigo_servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),Fechaing,126),'<NULL>'))=1 THEN MIN(Fechaing) END AS Fechaing,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))=1 THEN MIN(fechaate) END AS fechaate,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),servicio),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),centro),'<NULL>'))=1 THEN MIN(centro) END AS centro,
    COUNT_BIG(*) AS filas_fisicas
  FROM RawScope GROUP BY id_urgencia
)
SELECT COUNT_BIG(*) AS universo_total,
  SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS eventos_con_atencion,
  SUM(CASE WHEN fechaate IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS eventos_sin_atencion,
  CAST(100.0 * SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(decimal(20,4),1) ELSE 0 END)
    / NULLIF(COUNT_BIG(*),0) AS decimal(9,2)) AS cobertura_pct,
  SUM(CASE WHEN fechaate >= Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS evaluables,
  SUM(CASE WHEN fechaate < Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS invertidos,
  CAST(AVG(CASE WHEN fechaate >= Fechaing THEN DATEDIFF(MINUTE,Fechaing,fechaate)*1.0 END) AS decimal(18,2)) AS promedio_minutos,
  SUM(CASE WHEN fechaate = Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS mismo_minuto,
  SUM(CASE WHEN fechaate > Fechaing AND fechaate <= DATEADD(MINUTE,30,Fechaing) THEN CONVERT(bigint,1) ELSE 0 END) AS de_0_a_30,
  SUM(CASE WHEN fechaate > DATEADD(MINUTE,30,Fechaing) AND fechaate <= DATEADD(MINUTE,60,Fechaing) THEN CONVERT(bigint,1) ELSE 0 END) AS de_31_a_60,
  SUM(CASE WHEN fechaate > DATEADD(MINUTE,60,Fechaing) AND fechaate <= DATEADD(MINUTE,120,Fechaing) THEN CONVERT(bigint,1) ELSE 0 END) AS de_61_a_120,
  SUM(CASE WHEN fechaate > DATEADD(MINUTE,120,Fechaing) AND fechaate <= DATEADD(MINUTE,240,Fechaing) THEN CONVERT(bigint,1) ELSE 0 END) AS de_121_a_240,
  SUM(CASE WHEN fechaate > DATEADD(MINUTE,240,Fechaing) THEN CONVERT(bigint,1) ELSE 0 END) AS mayor_240,
  SUM(CASE WHEN fechaate >= DATEADD(HOUR,24,Fechaing) THEN CONVERT(bigint,1) ELSE 0 END) AS mayor_igual_24h,
  SUM(CASE WHEN fechaate >= DATEADD(DAY,7,Fechaing) THEN CONVERT(bigint,1) ELSE 0 END) AS mayor_igual_7d
FROM EventScope;

WITH RawScope AS
(
  SELECT V.id_urgencia, V.codigo_cliente, V.Fechaing, V.fechaate,
    S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S
    ON S.codigo_servicio = V.codigo_servicio_ingreso
   AND S.cod_centro = V.cod_centro
   AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  INNER JOIN dbo.centros AS C ON C.cod_centro = S.cod_centro
  WHERE V.id_urgencia IS NOT NULL
    AND V.Fechaing >= @Desde AND V.Fechaing < DATEADD(DAY, 1, @Hasta)
    AND (@Centro IS NULL OR C.centro_siglas = @Centro)
    AND (@CodigoServicio IS NULL OR S.codigo_servicio = @CodigoServicio)
),
EventScope AS
(
  SELECT id_urgencia,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),codigo_servicio),'<NULL>'))=1 THEN MIN(codigo_servicio) END AS codigo_servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))=1 THEN MIN(fechaate) END AS fechaate,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),servicio),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),centro),'<NULL>'))=1 THEN MIN(centro) END AS centro
  FROM RawScope GROUP BY id_urgencia
)
SELECT centro, codigo_servicio, servicio,
  COUNT_BIG(*) AS universo_total,
  SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS eventos_con_atencion,
  CAST(100.0 * SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(decimal(20,4),1) ELSE 0 END)
    / NULLIF(COUNT_BIG(*),0) AS decimal(9,2)) AS cobertura_pct
FROM EventScope
GROUP BY centro, codigo_servicio, servicio
ORDER BY centro, servicio, codigo_servicio;
