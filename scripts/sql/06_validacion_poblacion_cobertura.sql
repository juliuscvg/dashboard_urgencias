/* Complemento Población: cobertura por centro/servicio y categorías nativas. SOLO LECTURA. */
DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;
IF @Desde IS NULL OR @HastaExclusivo IS NULL SELECT N'POB05_CONFIGURAR_PERIODO' resultado,N'Asigne periodo' estado;
ELSE
BEGIN
;WITH RawScope AS
(
 SELECT V.id_urgencia,V.Fechaing,V.fecha_nac,V.sexo,V.estado_residencia,V.nombre_municipio_residencia,V.nombre_localidad_residencia,S.codigo_servicio,S.servicio,C.centro_siglas centro
 FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1 INNER JOIN dbo.centros C ON C.cod_centro=S.cod_centro
 WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), E AS
(
 SELECT id_urgencia,MIN(Fechaing) Fechaing,MIN(fecha_nac) fecha_nac,MIN(NULLIF(LTRIM(RTRIM(sexo)),'')) sexo,MIN(NULLIF(LTRIM(RTRIM(estado_residencia)),'')) estado,MIN(NULLIF(LTRIM(RTRIM(nombre_municipio_residencia)),'')) municipio,MIN(NULLIF(LTRIM(RTRIM(nombre_localidad_residencia)),'')) localidad,MIN(codigo_servicio) codigo_servicio,MIN(CONVERT(varchar(4000),servicio)) servicio,MIN(CONVERT(varchar(40),centro)) centro FROM RawScope GROUP BY id_urgencia
), C AS (SELECT *,CASE WHEN fecha_nac IS NOT NULL AND fecha_nac<=Fechaing THEN 1 ELSE 0 END edad_evaluable FROM E)
SELECT N'POB05_COBERTURA' resultado,N'CENTRO' nivel,centro,CAST(NULL AS varchar(40)) codigo_servicio,CAST(NULL AS varchar(4000)) servicio,COUNT_BIG(*) universo,SUM(CASE WHEN sexo IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_sexo,SUM(CASE WHEN edad_evaluable=1 THEN CONVERT(bigint,1) ELSE 0 END) edad_evaluable,SUM(CASE WHEN estado IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_estado,SUM(CASE WHEN municipio IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_municipio,SUM(CASE WHEN localidad IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_localidad FROM C GROUP BY centro
UNION ALL
SELECT N'POB05_COBERTURA',N'SERVICIO',centro,CONVERT(varchar(40),codigo_servicio),servicio,COUNT_BIG(*),SUM(CASE WHEN sexo IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END),SUM(CASE WHEN edad_evaluable=1 THEN CONVERT(bigint,1) ELSE 0 END),SUM(CASE WHEN estado IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END),SUM(CASE WHEN municipio IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END),SUM(CASE WHEN localidad IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) FROM C GROUP BY centro,codigo_servicio,servicio;

;WITH RawScope AS
(
 SELECT V.id_urgencia,V.Fechaing,V.fecha_nac,V.sexo,V.estado_residencia,V.nombre_municipio_residencia,V.nombre_localidad_residencia,S.codigo_servicio,S.servicio,C.centro_siglas centro FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1 INNER JOIN dbo.centros C ON C.cod_centro=S.cod_centro WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), E AS
(
 SELECT id_urgencia,MIN(NULLIF(LTRIM(RTRIM(estado_residencia)),'')) estado,MIN(NULLIF(LTRIM(RTRIM(nombre_municipio_residencia)),'')) municipio,MIN(NULLIF(LTRIM(RTRIM(nombre_localidad_residencia)),'')) localidad FROM RawScope GROUP BY id_urgencia
), Geo AS
(
 SELECT N'ESTADO' tipo,ISNULL(estado,N'<SIN_DATO>') valor FROM E UNION ALL SELECT N'MUNICIPIO',ISNULL(municipio,N'<SIN_DATO>') FROM E UNION ALL SELECT N'LOCALIDAD',ISNULL(localidad,N'<SIN_DATO>') FROM E
), Conteo AS (SELECT tipo,valor,COUNT_BIG(*) eventos FROM Geo GROUP BY tipo,valor), Rango AS (SELECT *,ROW_NUMBER() OVER(PARTITION BY tipo ORDER BY eventos DESC,valor) posicion FROM Conteo)
SELECT N'POB06_GEOGRAFIA_NATIVA' resultado,tipo,valor,eventos FROM Rango WHERE tipo=N'ESTADO' OR posicion<=30 ORDER BY tipo,posicion;
END;