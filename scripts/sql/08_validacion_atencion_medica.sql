/*
  ITER-006: validación funcional de fechaate sobre dbo.vUrgencias.
  SQL Server 2012 / compatibilidad 100. SOLO LECTURA.
  El llamador reemplaza los NULL por ventanas cerradas.
  U-ING conserva los joins canónicos a servicios/centros; no se abre otra fuente clínica.
*/
DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;
IF @Desde IS NULL OR @HastaExclusivo IS NULL
  SELECT N'ATE00_CONFIGURAR_PERIODO' AS resultado, N'Asigne @Desde y @HastaExclusivo' AS estado;
ELSE
BEGIN
;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechatri, V.fechaate, V.fechamed, V.fechaegr,
    S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S
    ON S.codigo_servicio=V.codigo_servicio_ingreso
   AND S.cod_centro=V.cod_centro
   AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL
    AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
),
EventScope AS
(
  SELECT id_urgencia,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),Fechaing,126),'<NULL>'))=1 THEN MIN(Fechaing) END AS Fechaing,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechatri,126),'<NULL>'))=1 THEN MIN(fechatri) END AS fechatri,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))=1 THEN MIN(fechaate) END AS fechaate,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechamed,126),'<NULL>'))=1 THEN MIN(fechamed) END AS fechamed,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaegr,126),'<NULL>'))=1 THEN MIN(fechaegr) END AS fechaegr,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),codigo_servicio),'<NULL>'))=1 THEN MIN(codigo_servicio) END AS codigo_servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),servicio),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),centro),'<NULL>'))=1 THEN MIN(CONVERT(varchar(40),centro)) END AS centro,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))>1 THEN 1 ELSE 0 END AS conflicto_fechaate
  FROM RawScope
  GROUP BY id_urgencia
)
SELECT N'ATE01_RESUMEN' AS resultado,
  COUNT_BIG(*) AS universo,
  SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_fechaate,
  SUM(CASE WHEN fechaate IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS sin_fechaate,
  SUM(CONVERT(bigint,conflicto_fechaate)) AS conflictos_fechaate,
  CAST(100.0*SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(decimal(20,4),1) ELSE 0 END)/NULLIF(COUNT_BIG(*),0) AS decimal(9,4)) AS cobertura_pct,

  SUM(CASE WHEN Fechaing IS NOT NULL AND fechaate IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS ing_ate_evaluables,
  SUM(CASE WHEN Fechaing IS NOT NULL AND fechaate IS NOT NULL AND fechaate>=Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS ing_ate_interpretables,
  SUM(CASE WHEN Fechaing IS NOT NULL AND fechaate IS NOT NULL AND fechaate<Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS ing_ate_invertidos,
  SUM(CASE WHEN Fechaing IS NOT NULL AND fechaate=Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS ing_ate_mismo_instante,
  MIN(CASE WHEN Fechaing IS NOT NULL AND fechaate IS NOT NULL THEN DATEDIFF(MINUTE,Fechaing,fechaate) END) AS ing_ate_min_minutos,
  MAX(CASE WHEN Fechaing IS NOT NULL AND fechaate IS NOT NULL THEN DATEDIFF(MINUTE,Fechaing,fechaate) END) AS ing_ate_max_minutos,
  CAST(AVG(CASE WHEN Fechaing IS NOT NULL AND fechaate>=Fechaing THEN DATEDIFF(MINUTE,Fechaing,fechaate)*1.0 END) AS decimal(18,2)) AS ing_ate_promedio_interpretable_min,

  SUM(CASE WHEN fechatri IS NOT NULL AND fechaate IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS tri_ate_evaluables,
  SUM(CASE WHEN fechatri IS NOT NULL AND fechaate IS NOT NULL AND fechaate>=fechatri THEN CONVERT(bigint,1) ELSE 0 END) AS tri_ate_interpretables,
  SUM(CASE WHEN fechatri IS NOT NULL AND fechaate IS NOT NULL AND fechaate<fechatri THEN CONVERT(bigint,1) ELSE 0 END) AS tri_ate_invertidos,
  SUM(CASE WHEN fechatri IS NOT NULL AND fechaate=fechatri THEN CONVERT(bigint,1) ELSE 0 END) AS tri_ate_mismo_instante,

  SUM(CASE WHEN fechaate IS NOT NULL AND fechaegr IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS ate_egr_evaluables,
  SUM(CASE WHEN fechaate IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr>=fechaate THEN CONVERT(bigint,1) ELSE 0 END) AS ate_egr_interpretables,
  SUM(CASE WHEN fechaate IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr<fechaate THEN CONVERT(bigint,1) ELSE 0 END) AS ate_egr_invertidos,
  SUM(CASE WHEN fechaate IS NOT NULL AND fechaegr=fechaate THEN CONVERT(bigint,1) ELSE 0 END) AS ate_egr_mismo_instante,
  MIN(CASE WHEN fechaate IS NOT NULL AND fechaegr IS NOT NULL THEN DATEDIFF(MINUTE,fechaate,fechaegr) END) AS ate_egr_min_minutos,
  MAX(CASE WHEN fechaate IS NOT NULL AND fechaegr IS NOT NULL THEN DATEDIFF(MINUTE,fechaate,fechaegr) END) AS ate_egr_max_minutos,
  CAST(AVG(CASE WHEN fechaate IS NOT NULL AND fechaegr>=fechaate THEN DATEDIFF(MINUTE,fechaate,fechaegr)*1.0 END) AS decimal(18,2)) AS ate_egr_promedio_interpretable_min
FROM EventScope;

;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechatri, V.fechaate, V.fechamed, V.fechaegr,
    S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S
    ON S.codigo_servicio=V.codigo_servicio_ingreso
   AND S.cod_centro=V.cod_centro
   AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL
    AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
),
EventScope AS
(
  SELECT id_urgencia,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),Fechaing,126),'<NULL>'))=1 THEN MIN(Fechaing) END AS Fechaing,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechatri,126),'<NULL>'))=1 THEN MIN(fechatri) END AS fechatri,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))=1 THEN MIN(fechaate) END AS fechaate,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechamed,126),'<NULL>'))=1 THEN MIN(fechamed) END AS fechamed,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaegr,126),'<NULL>'))=1 THEN MIN(fechaegr) END AS fechaegr,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),codigo_servicio),'<NULL>'))=1 THEN MIN(codigo_servicio) END AS codigo_servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),servicio),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),centro),'<NULL>'))=1 THEN MIN(CONVERT(varchar(40),centro)) END AS centro,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))>1 THEN 1 ELSE 0 END AS conflicto_fechaate
  FROM RawScope
  GROUP BY id_urgencia
)
SELECT N'ATE02_CENTRO' AS resultado, centro,
  COUNT_BIG(*) AS universo,
  SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_fechaate,
  CAST(100.0*SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(decimal(20,4),1) ELSE 0 END)/NULLIF(COUNT_BIG(*),0) AS decimal(9,4)) AS cobertura_pct,
  SUM(CONVERT(bigint,conflicto_fechaate)) AS conflictos_fechaate,
  SUM(CASE WHEN fechaate<Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS ing_ate_invertidos
FROM EventScope GROUP BY centro ORDER BY centro;

;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechatri, V.fechaate, V.fechamed, V.fechaegr,
    S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S
    ON S.codigo_servicio=V.codigo_servicio_ingreso
   AND S.cod_centro=V.cod_centro
   AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL
    AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
),
EventScope AS
(
  SELECT id_urgencia,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),Fechaing,126),'<NULL>'))=1 THEN MIN(Fechaing) END AS Fechaing,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechatri,126),'<NULL>'))=1 THEN MIN(fechatri) END AS fechatri,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))=1 THEN MIN(fechaate) END AS fechaate,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechamed,126),'<NULL>'))=1 THEN MIN(fechamed) END AS fechamed,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaegr,126),'<NULL>'))=1 THEN MIN(fechaegr) END AS fechaegr,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),codigo_servicio),'<NULL>'))=1 THEN MIN(codigo_servicio) END AS codigo_servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),servicio),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),centro),'<NULL>'))=1 THEN MIN(CONVERT(varchar(40),centro)) END AS centro,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))>1 THEN 1 ELSE 0 END AS conflicto_fechaate
  FROM RawScope
  GROUP BY id_urgencia
)
SELECT N'ATE03_SERVICIO' AS resultado, centro,codigo_servicio,servicio,
  COUNT_BIG(*) AS universo,
  SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_fechaate,
  CAST(100.0*SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(decimal(20,4),1) ELSE 0 END)/NULLIF(COUNT_BIG(*),0) AS decimal(9,4)) AS cobertura_pct,
  SUM(CONVERT(bigint,conflicto_fechaate)) AS conflictos_fechaate,
  SUM(CASE WHEN fechaate<Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS ing_ate_invertidos
FROM EventScope GROUP BY centro,codigo_servicio,servicio ORDER BY centro,servicio,codigo_servicio;

;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechatri, V.fechaate, V.fechamed, V.fechaegr,
    S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S
    ON S.codigo_servicio=V.codigo_servicio_ingreso
   AND S.cod_centro=V.cod_centro
   AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL
    AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
),
EventScope AS
(
  SELECT id_urgencia,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),Fechaing,126),'<NULL>'))=1 THEN MIN(Fechaing) END AS Fechaing,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechatri,126),'<NULL>'))=1 THEN MIN(fechatri) END AS fechatri,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))=1 THEN MIN(fechaate) END AS fechaate,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechamed,126),'<NULL>'))=1 THEN MIN(fechamed) END AS fechamed,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaegr,126),'<NULL>'))=1 THEN MIN(fechaegr) END AS fechaegr,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),codigo_servicio),'<NULL>'))=1 THEN MIN(codigo_servicio) END AS codigo_servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),servicio),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),centro),'<NULL>'))=1 THEN MIN(CONVERT(varchar(40),centro)) END AS centro,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))>1 THEN 1 ELSE 0 END AS conflicto_fechaate
  FROM RawScope
  GROUP BY id_urgencia
)
SELECT N'ATE04_ANIO' AS resultado, DATEPART(YEAR,Fechaing) AS anio,
  COUNT_BIG(*) AS universo,
  SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_fechaate,
  CAST(100.0*SUM(CASE WHEN fechaate IS NOT NULL THEN CONVERT(decimal(20,4),1) ELSE 0 END)/NULLIF(COUNT_BIG(*),0) AS decimal(9,4)) AS cobertura_pct,
  SUM(CONVERT(bigint,conflicto_fechaate)) AS conflictos_fechaate,
  SUM(CASE WHEN fechaate<Fechaing THEN CONVERT(bigint,1) ELSE 0 END) AS ing_ate_invertidos
FROM EventScope GROUP BY DATEPART(YEAR,Fechaing) ORDER BY anio;
END;
