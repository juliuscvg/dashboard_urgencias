/*
  SQL verificable de Dashboard Urgencias.
  Motor: SQL Server 2012; nivel de compatibilidad 100.
  Acceso: sólo lectura.
  Parámetros requeridos del llamador:
    @Desde date, @Hasta date, @Centro varchar(20)=NULL, @CodigoServicio int=NULL.
  Periodo: Fechaing >= @Desde AND Fechaing < DATEADD(DAY,1,@Hasta).
  
*/
WITH RawScope AS
(
  SELECT V.id_urgencia, V.codigo_cliente, V.Fechaing, V.fechaegr, V.fechatri,
    V.triage_codigo, V.triage_desc, V.destino_urg_pk, V.destino_urgencias,
    V.motivo_alta_pk, V.motivo_alta, S.codigo_servicio, S.servicio,
    C.centro_siglas AS centro
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
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechaegr,126),'<NULL>'))=1 THEN MIN(fechaegr) END AS fechaegr,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(33),fechatri,126),'<NULL>'))=1 THEN MIN(fechatri) END AS fechatri,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),triage_codigo),'<NULL>'))=1 THEN MIN(triage_codigo) END AS triage_codigo,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),triage_desc),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),triage_desc)) END AS triage_desc,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),destino_urg_pk),'<NULL>'))=1 THEN MIN(destino_urg_pk) END AS destino_urg_pk,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),destino_urgencias),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),destino_urgencias)) END AS destino_urgencias,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(4000),servicio),'<NULL>'))=1 THEN MIN(CONVERT(varchar(4000),servicio)) END AS servicio,
    CASE WHEN COUNT(DISTINCT ISNULL(CONVERT(varchar(40),centro),'<NULL>'))=1 THEN MIN(centro) END AS centro,
    COUNT_BIG(*) AS filas_fisicas
  FROM RawScope GROUP BY id_urgencia
)
, Frecuencia AS
(
  SELECT codigo_cliente, COUNT_BIG(*) AS eventos
  FROM EventScope WHERE codigo_cliente IS NOT NULL GROUP BY codigo_cliente
)
SELECT CASE WHEN eventos=1 THEN '1' WHEN eventos=2 THEN '2' WHEN eventos=3 THEN '3'
    WHEN eventos BETWEEN 4 AND 5 THEN '4-5' WHEN eventos BETWEEN 6 AND 10 THEN '6-10' ELSE '11+' END AS banda,
  COUNT_BIG(*) AS pacientes
FROM Frecuencia
GROUP BY CASE WHEN eventos=1 THEN '1' WHEN eventos=2 THEN '2' WHEN eventos=3 THEN '3'
    WHEN eventos BETWEEN 4 AND 5 THEN '4-5' WHEN eventos BETWEEN 6 AND 10 THEN '6-10' ELSE '11+' END
ORDER BY MIN(eventos);
