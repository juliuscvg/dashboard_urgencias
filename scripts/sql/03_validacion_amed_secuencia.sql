/*
  Validación funcional AMED y secuencia temporal para dbo.vUrgencias.
  SQL Server 2012 / compatibilidad 100. SOLO LECTURA.
  El llamador reemplaza los dos NULL por un periodo semiabierto cerrado.
  No expone identificadores directos: los ejemplos usan hash SHA2-256 truncado.
*/
DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;
IF @Desde IS NULL OR @HastaExclusivo IS NULL
  SELECT N'AMED00_CONFIGURAR_PERIODO' AS resultado, N'Asigne @Desde y @HastaExclusivo' AS estado;
ELSE
BEGIN
;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechatri, V.fechaate, V.fechamed, V.altamed_fecha, V.fechaegr,
    S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S ON S.codigo_servicio=V.codigo_servicio_ingreso
    AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
),
EventScope AS
(
  SELECT id_urgencia,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),Fechaing,126),'<NULL>'))=1 THEN MIN(Fechaing) END AS Fechaing,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechatri,126),'<NULL>'))=1 THEN MIN(fechatri) END AS fechatri,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaate,126),'<NULL>'))=1 THEN MIN(fechaate) END AS fechaate,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechamed,126),'<NULL>'))=1 THEN MIN(fechamed) END AS fechamed,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),altamed_fecha,126),'<NULL>'))=1 THEN MIN(altamed_fecha) END AS altamed_fecha,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaegr,126),'<NULL>'))=1 THEN MIN(fechaegr) END AS fechaegr,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),codigo_servicio),'<NULL>'))=1 THEN MIN(codigo_servicio) END AS codigo_servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),servicio),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),centro),'<NULL>'))=1 THEN MIN(CONVERT(varchar(40),centro)) END AS centro
  FROM RawScope GROUP BY id_urgencia
)
SELECT N'AMED01_RESUMEN' AS resultado,
  COUNT_BIG(*) AS universo,
  SUM(CASE WHEN fechamed IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_fechamed,
  SUM(CASE WHEN altamed_fecha IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_altamed_fecha,
  SUM(CASE WHEN fechamed IS NOT NULL AND altamed_fecha IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS ambos,
  SUM(CASE WHEN fechamed IS NOT NULL AND altamed_fecha IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS solo_fechamed,
  SUM(CASE WHEN fechamed IS NULL AND altamed_fecha IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS solo_altamed_fecha,
  SUM(CASE WHEN fechamed=altamed_fecha THEN CONVERT(bigint,1) ELSE 0 END) AS iguales_exactos,
  SUM(CASE WHEN fechamed IS NOT NULL AND altamed_fecha IS NOT NULL AND CONVERT(date,fechamed)=CONVERT(date,altamed_fecha) THEN CONVERT(bigint,1) ELSE 0 END) AS mismo_dia,
  SUM(CASE WHEN fechamed IS NOT NULL AND altamed_fecha IS NOT NULL AND CONVERT(date,fechamed)<>CONVERT(date,altamed_fecha) THEN CONVERT(bigint,1) ELSE 0 END) AS dia_distinto,
  MIN(CASE WHEN fechamed IS NOT NULL AND altamed_fecha IS NOT NULL THEN DATEDIFF(MINUTE,fechamed,altamed_fecha) END) AS diferencia_minima_min,
  MAX(CASE WHEN fechamed IS NOT NULL AND altamed_fecha IS NOT NULL THEN DATEDIFF(MINUTE,fechamed,altamed_fecha) END) AS diferencia_maxima_min,
  MAX(CASE WHEN Fechaing IS NOT NULL AND fechamed IS NOT NULL THEN DATEDIFF(MINUTE,Fechaing,fechamed) END) AS max_ingreso_a_alta_min,
  MAX(CASE WHEN fechamed IS NOT NULL AND fechaegr IS NOT NULL THEN DATEDIFF(MINUTE,fechamed,fechaegr) END) AS max_alta_a_egreso_min
FROM EventScope;

;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechamed, V.altamed_fecha, S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
  SELECT id_urgencia, MIN(Fechaing) AS Fechaing, MIN(fechamed) AS fechamed, MIN(altamed_fecha) AS altamed_fecha,
    MIN(codigo_servicio) AS codigo_servicio, MIN(CONVERT(varchar(4000),servicio)) AS servicio, MIN(CONVERT(varchar(40),centro)) AS centro
  FROM RawScope GROUP BY id_urgencia
)
SELECT N'AMED02_COBERTURA_SERVICIO' AS resultado, centro, codigo_servicio, servicio,
  COUNT_BIG(*) AS universo, SUM(CASE WHEN fechamed IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_fechamed,
  SUM(CASE WHEN altamed_fecha IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_altamed_fecha,
  SUM(CASE WHEN fechamed IS NOT NULL AND altamed_fecha IS NOT NULL AND CONVERT(date,fechamed)<>CONVERT(date,altamed_fecha) THEN CONVERT(bigint,1) ELSE 0 END) AS dia_distinto
FROM EventScope GROUP BY centro,codigo_servicio,servicio ORDER BY centro,servicio,codigo_servicio;

;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechatri, V.fechaate, V.fechamed, V.altamed_fecha, V.fechaegr,
    S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
  SELECT id_urgencia, MIN(Fechaing) AS Fechaing, MIN(fechatri) AS fechatri, MIN(fechaate) AS fechaate,
    MIN(fechamed) AS fechamed, MIN(altamed_fecha) AS altamed_fecha, MIN(fechaegr) AS fechaegr,
    MIN(codigo_servicio) AS codigo_servicio, MIN(CONVERT(varchar(4000),servicio)) AS servicio, MIN(CONVERT(varchar(40),centro)) AS centro
  FROM RawScope GROUP BY id_urgencia
), Pares AS
(
  SELECT N'Fechaing→fechamed' AS par, Fechaing AS inicio, fechamed AS fin FROM EventScope
  UNION ALL SELECT N'fechaate→fechamed',fechaate,fechamed FROM EventScope
  UNION ALL SELECT N'fechamed→fechaegr',fechamed,fechaegr FROM EventScope
)
SELECT N'AMED03_PARES' AS resultado, par,
  SUM(CASE WHEN inicio IS NOT NULL AND fin IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS evaluables,
  SUM(CASE WHEN inicio IS NOT NULL AND fin IS NOT NULL AND fin<inicio THEN CONVERT(bigint,1) ELSE 0 END) AS invertidos,
  SUM(CASE WHEN inicio IS NOT NULL AND fin IS NOT NULL AND fin=inicio THEN CONVERT(bigint,1) ELSE 0 END) AS mismo_instante,
  MIN(CASE WHEN inicio IS NOT NULL AND fin IS NOT NULL THEN DATEDIFF(MINUTE,inicio,fin) END) AS min_minutos,
  MAX(CASE WHEN inicio IS NOT NULL AND fin IS NOT NULL THEN DATEDIFF(MINUTE,inicio,fin) END) AS max_minutos,
  CAST(AVG(CASE WHEN inicio IS NOT NULL AND fin IS NOT NULL THEN DATEDIFF(MINUTE,inicio,fin)*1.0 END) AS decimal(18,2)) AS promedio_minutos
FROM Pares GROUP BY par ORDER BY par;

;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechatri, V.fechaate, V.fechamed, V.fechaegr
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
  SELECT id_urgencia, MIN(Fechaing) AS Fechaing, MIN(fechatri) AS fechatri, MIN(fechaate) AS fechaate, MIN(fechamed) AS fechamed, MIN(fechaegr) AS fechaegr
  FROM RawScope GROUP BY id_urgencia
)
SELECT N'AMED04_SECUENCIA_COMPLETA' AS resultado,
  SUM(CASE WHEN Fechaing IS NOT NULL AND fechatri IS NOT NULL AND fechaate IS NOT NULL AND fechamed IS NOT NULL AND fechaegr IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS completa,
  SUM(CASE WHEN Fechaing IS NOT NULL AND fechatri IS NOT NULL AND fechaate IS NOT NULL AND fechamed IS NOT NULL AND fechaegr IS NOT NULL
    AND Fechaing<=fechatri AND fechatri<=fechaate AND fechaate<=fechamed AND fechamed<=fechaegr THEN CONVERT(bigint,1) ELSE 0 END) AS ordenada,
  SUM(CASE WHEN Fechaing IS NOT NULL AND fechatri IS NOT NULL AND fechaate IS NOT NULL AND fechamed IS NOT NULL AND fechaegr IS NOT NULL
    AND NOT(Fechaing<=fechatri AND fechatri<=fechaate AND fechaate<=fechamed AND fechamed<=fechaegr) THEN CONVERT(bigint,1) ELSE 0 END) AS con_inversion
FROM EventScope;

;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechamed, V.altamed_fecha, V.fechaegr, S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
  SELECT id_urgencia, MIN(Fechaing) AS Fechaing, MIN(fechamed) AS fechamed, MIN(altamed_fecha) AS altamed_fecha, MIN(fechaegr) AS fechaegr,
    MIN(codigo_servicio) AS codigo_servicio, MIN(CONVERT(varchar(4000),servicio)) AS servicio, MIN(CONVERT(varchar(40),centro)) AS centro
  FROM RawScope GROUP BY id_urgencia
)
SELECT TOP (10) N'AMED05_EJEMPLOS_DIA_DISTINTO' AS resultado,
  RIGHT(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(40),id_urgencia)),2),16) AS evento_hash,
  centro,codigo_servicio,servicio,Fechaing,fechamed,altamed_fecha,
  DATEDIFF(MINUTE,fechamed,altamed_fecha) AS diferencia_minutos
FROM EventScope
WHERE fechamed IS NOT NULL AND altamed_fecha IS NOT NULL AND CONVERT(date,fechamed)<>CONVERT(date,altamed_fecha)
ORDER BY ABS(DATEDIFF(MINUTE,fechamed,altamed_fecha)) DESC,evento_hash;

;WITH RawScope AS
(
  SELECT V.id_urgencia, V.Fechaing, V.fechaate, V.fechamed, V.fechaegr, S.codigo_servicio, S.servicio, C.centro_siglas AS centro
  FROM dbo.vUrgencias AS V
  INNER JOIN dbo.servicios AS S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
  INNER JOIN dbo.centros AS C ON C.cod_centro=S.cod_centro
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
  SELECT id_urgencia, MIN(Fechaing) AS Fechaing, MIN(fechaate) AS fechaate, MIN(fechamed) AS fechamed, MIN(fechaegr) AS fechaegr,
    MIN(codigo_servicio) AS codigo_servicio, MIN(CONVERT(varchar(4000),servicio)) AS servicio, MIN(CONVERT(varchar(40),centro)) AS centro
  FROM RawScope GROUP BY id_urgencia
), Pares AS
(
  SELECT id_urgencia,centro,codigo_servicio,servicio,N'Fechaing→fechamed' AS par,Fechaing AS inicio,fechamed AS fin FROM EventScope WHERE Fechaing IS NOT NULL AND fechamed IS NOT NULL
  UNION ALL SELECT id_urgencia,centro,codigo_servicio,servicio,N'fechaate→fechamed',fechaate,fechamed FROM EventScope WHERE fechaate IS NOT NULL AND fechamed IS NOT NULL
  UNION ALL SELECT id_urgencia,centro,codigo_servicio,servicio,N'fechamed→fechaegr',fechamed,fechaegr FROM EventScope WHERE fechamed IS NOT NULL AND fechaegr IS NOT NULL
)
SELECT TOP (15) N'AMED06_EXTREMOS_PARES' AS resultado,
  RIGHT(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(40),id_urgencia)),2),16) AS evento_hash,
  centro,codigo_servicio,servicio,par,inicio,fin,DATEDIFF(MINUTE,inicio,fin) AS minutos
FROM Pares ORDER BY ABS(DATEDIFF(MINUTE,inicio,fin)) DESC,evento_hash;
END;
