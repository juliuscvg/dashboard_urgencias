/* Validación funcional de Población. SQL Server 2012 / compatibilidad 100. SOLO LECTURA. */
DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;
IF @Desde IS NULL OR @HastaExclusivo IS NULL
  SELECT N'POB00_CONFIGURAR_PERIODO' AS resultado, N'Asigne @Desde y @HastaExclusivo' AS estado;
ELSE
BEGIN
;WITH RawScope AS
(
 SELECT V.id_urgencia,V.Fechaing,V.fecha_nac,V.edadaños,V.EdadMeses,V.EdadDias,V.sexo,
   V.estado_residencia,V.nombre_municipio_residencia,V.nombre_localidad_residencia,
   S.codigo_servicio,S.servicio,C.centro_siglas AS centro
 FROM dbo.vUrgencias V
 INNER JOIN dbo.servicios S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
 INNER JOIN dbo.centros C ON C.cod_centro=S.cod_centro
 WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
 SELECT id_urgencia,MIN(Fechaing) Fechaing,MIN(fecha_nac) fecha_nac,MIN(edadaños) edadaños,MIN(EdadMeses) EdadMeses,MIN(EdadDias) EdadDias,
   MIN(NULLIF(LTRIM(RTRIM(sexo)),'')) sexo,MIN(NULLIF(LTRIM(RTRIM(estado_residencia)),'')) estado_residencia,
   MIN(NULLIF(LTRIM(RTRIM(nombre_municipio_residencia)),'')) municipio,MIN(NULLIF(LTRIM(RTRIM(nombre_localidad_residencia)),'')) localidad,
   MIN(codigo_servicio) codigo_servicio,MIN(CONVERT(varchar(4000),servicio)) servicio,MIN(CONVERT(varchar(40),centro)) centro
 FROM RawScope GROUP BY id_urgencia
), Calculada AS
(
 SELECT *,CASE WHEN fecha_nac IS NOT NULL AND fecha_nac<=Fechaing THEN DATEDIFF(YEAR,fecha_nac,Fechaing)-CASE WHEN DATEADD(YEAR,DATEDIFF(YEAR,fecha_nac,Fechaing),fecha_nac)>Fechaing THEN 1 ELSE 0 END END edad_calculada
 FROM EventScope
)
SELECT N'POB01_RESUMEN' resultado,COUNT_BIG(*) universo,
 SUM(CASE WHEN sexo IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_sexo,
 SUM(CASE WHEN fecha_nac IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_fecha_nac,
 SUM(CASE WHEN edad_calculada IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) edad_evento_evaluable,
 SUM(CASE WHEN fecha_nac>Fechaing THEN CONVERT(bigint,1) ELSE 0 END) nacimiento_posterior_ingreso,
 SUM(CASE WHEN edadaños IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_edadanos,
 SUM(CASE WHEN EdadMeses IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_meses,
 SUM(CASE WHEN EdadDias IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_dias,
 SUM(CASE WHEN estado_residencia IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_estado,
 SUM(CASE WHEN municipio IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_municipio,
 SUM(CASE WHEN localidad IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_localidad
FROM Calculada;

;WITH RawScope AS
(
 SELECT V.id_urgencia,V.Fechaing,V.fecha_nac,V.edadaños,V.EdadMeses,V.EdadDias,V.sexo,V.estado_residencia,V.nombre_municipio_residencia,V.nombre_localidad_residencia,S.codigo_servicio,S.servicio,C.centro_siglas centro
 FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1 INNER JOIN dbo.centros C ON C.cod_centro=S.cod_centro
 WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
 SELECT id_urgencia,MIN(Fechaing) Fechaing,MIN(fecha_nac) fecha_nac,MIN(edadaños) edadaños,MIN(EdadMeses) EdadMeses,MIN(EdadDias) EdadDias,MIN(NULLIF(LTRIM(RTRIM(sexo)),'')) sexo,MIN(NULLIF(LTRIM(RTRIM(estado_residencia)),'')) estado_residencia,MIN(NULLIF(LTRIM(RTRIM(nombre_municipio_residencia)),'')) municipio,MIN(NULLIF(LTRIM(RTRIM(nombre_localidad_residencia)),'')) localidad,MIN(codigo_servicio) codigo_servicio,MIN(CONVERT(varchar(4000),servicio)) servicio,MIN(CONVERT(varchar(40),centro)) centro FROM RawScope GROUP BY id_urgencia
), Calculada AS
(
 SELECT *,CASE WHEN fecha_nac IS NOT NULL AND fecha_nac<=Fechaing THEN DATEDIFF(YEAR,fecha_nac,Fechaing)-CASE WHEN DATEADD(YEAR,DATEDIFF(YEAR,fecha_nac,Fechaing),fecha_nac)>Fechaing THEN 1 ELSE 0 END END edad_calculada FROM EventScope
)
SELECT N'POB02_SEXO_NATIVO' resultado,ISNULL(sexo,N'<SIN_DATO>') sexo_nativo,COUNT_BIG(*) eventos FROM Calculada GROUP BY sexo ORDER BY eventos DESC,sexo_nativo;

;WITH RawScope AS
(
 SELECT V.id_urgencia,V.Fechaing,V.fecha_nac,V.edadaños,V.EdadMeses,V.EdadDias,V.sexo,V.estado_residencia,V.nombre_municipio_residencia,V.nombre_localidad_residencia,S.codigo_servicio,S.servicio,C.centro_siglas centro FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1 INNER JOIN dbo.centros C ON C.cod_centro=S.cod_centro WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
 SELECT id_urgencia,MIN(Fechaing) Fechaing,MIN(fecha_nac) fecha_nac,MIN(edadaños) edadaños,MIN(EdadMeses) EdadMeses,MIN(EdadDias) EdadDias,MIN(NULLIF(LTRIM(RTRIM(sexo)),'')) sexo,MIN(NULLIF(LTRIM(RTRIM(estado_residencia)),'')) estado_residencia,MIN(NULLIF(LTRIM(RTRIM(nombre_municipio_residencia)),'')) municipio,MIN(NULLIF(LTRIM(RTRIM(nombre_localidad_residencia)),'')) localidad,MIN(codigo_servicio) codigo_servicio,MIN(CONVERT(varchar(4000),servicio)) servicio,MIN(CONVERT(varchar(40),centro)) centro FROM RawScope GROUP BY id_urgencia
), Calculada AS
(
 SELECT *,CASE WHEN fecha_nac IS NOT NULL AND fecha_nac<=Fechaing THEN DATEDIFF(YEAR,fecha_nac,Fechaing)-CASE WHEN DATEADD(YEAR,DATEDIFF(YEAR,fecha_nac,Fechaing),fecha_nac)>Fechaing THEN 1 ELSE 0 END END edad_calculada FROM EventScope
)
SELECT N'POB03_EDAD_CALIDAD' resultado,MIN(edad_calculada) min_edad_calculada,MAX(edad_calculada) max_edad_calculada,SUM(CASE WHEN edad_calculada>130 THEN CONVERT(bigint,1) ELSE 0 END) edad_calculada_mayor_130,
 MIN(edadaños) min_edadanos,MAX(edadaños) max_edadanos,SUM(CASE WHEN edadaños<0 THEN CONVERT(bigint,1) ELSE 0 END) edadanos_negativa,SUM(CASE WHEN edadaños>130 THEN CONVERT(bigint,1) ELSE 0 END) edadanos_mayor_130,
 SUM(CASE WHEN edad_calculada IS NOT NULL AND edadaños IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) ambas_edades,
 SUM(CASE WHEN edad_calculada IS NOT NULL AND edadaños IS NOT NULL AND edad_calculada=edadaños THEN CONVERT(bigint,1) ELSE 0 END) edades_iguales,
 SUM(CASE WHEN edad_calculada IS NOT NULL AND edadaños IS NOT NULL AND edad_calculada<>edadaños THEN CONVERT(bigint,1) ELSE 0 END) edades_distintas,
 MIN(EdadMeses) min_meses,MAX(EdadMeses) max_meses,SUM(CASE WHEN EdadMeses<0 OR EdadMeses>11 THEN CONVERT(bigint,1) ELSE 0 END) meses_fuera_0_11,
 MIN(EdadDias) min_dias,MAX(EdadDias) max_dias,SUM(CASE WHEN EdadDias<0 OR EdadDias>31 THEN CONVERT(bigint,1) ELSE 0 END) dias_fuera_0_31
FROM Calculada;

;WITH RawScope AS
(
 SELECT V.id_urgencia,V.Fechaing,V.fecha_nac FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1 WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS (SELECT id_urgencia,MIN(Fechaing) Fechaing,MIN(fecha_nac) fecha_nac FROM RawScope GROUP BY id_urgencia), Calculada AS
(
 SELECT *,CASE WHEN fecha_nac IS NOT NULL AND fecha_nac<=Fechaing THEN DATEDIFF(YEAR,fecha_nac,Fechaing)-CASE WHEN DATEADD(YEAR,DATEDIFF(YEAR,fecha_nac,Fechaing),fecha_nac)>Fechaing THEN 1 ELSE 0 END END edad_calculada FROM EventScope
)
SELECT N'POB04_GRUPOS_PROVISIONALES' resultado,CASE WHEN edad_calculada IS NULL THEN N'<SIN_EDAD_EVALUABLE>' WHEN edad_calculada<1 THEN N'<1' WHEN edad_calculada<=5 THEN N'1-5' WHEN edad_calculada<=12 THEN N'6-12' WHEN edad_calculada<=17 THEN N'13-17' WHEN edad_calculada<=29 THEN N'18-29' WHEN edad_calculada<=44 THEN N'30-44' WHEN edad_calculada<=59 THEN N'45-59' WHEN edad_calculada<=74 THEN N'60-74' ELSE N'75+' END grupo,COUNT_BIG(*) eventos FROM Calculada GROUP BY CASE WHEN edad_calculada IS NULL THEN N'<SIN_EDAD_EVALUABLE>' WHEN edad_calculada<1 THEN N'<1' WHEN edad_calculada<=5 THEN N'1-5' WHEN edad_calculada<=12 THEN N'6-12' WHEN edad_calculada<=17 THEN N'13-17' WHEN edad_calculada<=29 THEN N'18-29' WHEN edad_calculada<=44 THEN N'30-44' WHEN edad_calculada<=59 THEN N'45-59' WHEN edad_calculada<=74 THEN N'60-74' ELSE N'75+' END ORDER BY CASE WHEN CASE WHEN edad_calculada IS NULL THEN N'<SIN_EDAD_EVALUABLE>' WHEN edad_calculada<1 THEN N'<1' WHEN edad_calculada<=5 THEN N'1-5' WHEN edad_calculada<=12 THEN N'6-12' WHEN edad_calculada<=17 THEN N'13-17' WHEN edad_calculada<=29 THEN N'18-29' WHEN edad_calculada<=44 THEN N'30-44' WHEN edad_calculada<=59 THEN N'45-59' WHEN edad_calculada<=74 THEN N'60-74' ELSE N'75+' END=N'<SIN_EDAD_EVALUABLE>' THEN 99 ELSE 1 END,grupo;
END;