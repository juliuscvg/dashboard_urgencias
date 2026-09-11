/* ITER-002: validación funcional de Motivo de Urgencia. SOLO LECTURA.
   Cada bloque es autocontenido; U-ING cuenta un evento por id_urgencia. */
DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;
IF @Desde IS NULL OR @HastaExclusivo IS NULL
  SELECT N'MOT_CONFIGURAR_PERIODO' AS resultado, N'Asigne @Desde y @HastaExclusivo' AS estado;
ELSE
BEGIN
;WITH RawScope AS (
  SELECT V.id_urgencia, V.Fechaing, V.cod_centro, V.codigo_servicio_ingreso,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urgencia))), '') AS motivo_categoria,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urg_libre))), '') AS motivo_libre,
    CASE WHEN V.motivo_urgencia IS NOT NULL AND LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urgencia))) = '' THEN 1 ELSE 0 END AS categoria_vacia,
    CASE WHEN V.motivo_urg_libre IS NOT NULL AND LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urg_libre))) = '' THEN 1 ELSE 0 END AS libre_vacio
  FROM dbo.vUrgencias V
  INNER JOIN dbo.servicios S ON S.codigo_servicio = V.codigo_servicio_ingreso
    AND S.cod_centro = V.cod_centro AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing >= @Desde AND V.Fechaing < @HastaExclusivo
), EventScope AS (
  SELECT id_urgencia, MIN(Fechaing) AS Fechaing, MIN(cod_centro) AS cod_centro,
    MIN(codigo_servicio_ingreso) AS codigo_servicio_ingreso,
    MIN(motivo_categoria) AS motivo_categoria, MIN(motivo_libre) AS motivo_libre,
    COUNT(DISTINCT motivo_categoria) AS variantes_categoria,
    COUNT(DISTINCT motivo_libre) AS variantes_libre,
    MAX(categoria_vacia) AS categoria_vacia, MAX(libre_vacio) AS libre_vacio
  FROM RawScope GROUP BY id_urgencia
)
SELECT N'MOT01_RESUMEN' AS resultado, COUNT_BIG(*) AS universo,
  SUM(CASE WHEN motivo_categoria IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_categoria,
  SUM(CASE WHEN motivo_libre IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_texto_libre,
  SUM(CASE WHEN motivo_categoria IS NOT NULL AND motivo_libre IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS ambos,
  SUM(CASE WHEN motivo_categoria IS NOT NULL AND motivo_libre IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS solo_categoria,
  SUM(CASE WHEN motivo_categoria IS NULL AND motivo_libre IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS solo_texto_libre,
  SUM(CASE WHEN motivo_categoria IS NULL AND motivo_libre IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS ninguno,
  SUM(CONVERT(bigint,categoria_vacia)) AS eventos_categoria_vacia,
  SUM(CONVERT(bigint,libre_vacio)) AS eventos_texto_vacio,
  SUM(CASE WHEN variantes_categoria > 1 THEN CONVERT(bigint,1) ELSE 0 END) AS conflictos_categoria,
  SUM(CASE WHEN variantes_libre > 1 THEN CONVERT(bigint,1) ELSE 0 END) AS conflictos_texto_libre
FROM EventScope;

;WITH RawScope AS (
  SELECT V.id_urgencia, NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urgencia))), '') AS motivo_categoria
  FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio = V.codigo_servicio_ingreso
    AND S.cod_centro = V.cod_centro AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing >= @Desde AND V.Fechaing < @HastaExclusivo
), EventScope AS (
  SELECT id_urgencia, MIN(motivo_categoria) AS motivo_categoria FROM RawScope GROUP BY id_urgencia
)
SELECT N'MOT02_CATEGORIAS_NATIVAS' AS resultado,
  ISNULL(motivo_categoria, '<SIN_DATO>') AS motivo_categoria, COUNT_BIG(*) AS eventos
FROM EventScope GROUP BY motivo_categoria ORDER BY eventos DESC, motivo_categoria;

;WITH RawScope AS (
  SELECT V.id_urgencia, NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urg_libre))), '') AS motivo_libre
  FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio = V.codigo_servicio_ingreso
    AND S.cod_centro = V.cod_centro AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing >= @Desde AND V.Fechaing < @HastaExclusivo
), EventScope AS (
  SELECT id_urgencia, MIN(motivo_libre) AS motivo_libre FROM RawScope GROUP BY id_urgencia
), Frecuencias AS (
  SELECT motivo_libre, COUNT_BIG(*) AS eventos FROM EventScope WHERE motivo_libre IS NOT NULL GROUP BY motivo_libre
)
SELECT N'MOT03_TEXTO_LIBRE_AGREGADO' AS resultado,
  COUNT_BIG(*) AS valores_distintos,
  SUM(CASE WHEN eventos = 1 THEN CONVERT(bigint,1) ELSE 0 END) AS valores_singleton,
  SUM(eventos) AS eventos_con_texto,
  MIN(LEN(motivo_libre)) AS longitud_minima,
  MAX(LEN(motivo_libre)) AS longitud_maxima,
  CAST(AVG(CONVERT(decimal(19,4), LEN(motivo_libre))) AS decimal(19,2)) AS longitud_media_no_ponderada,
  MAX(eventos) AS frecuencia_maxima
FROM Frecuencias;

;WITH RawScope AS (
  SELECT V.id_urgencia, V.Fechaing,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urgencia))), '') AS motivo_categoria,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urg_libre))), '') AS motivo_libre
  FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio = V.codigo_servicio_ingreso
    AND S.cod_centro = V.cod_centro AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing >= @Desde AND V.Fechaing < @HastaExclusivo
), EventScope AS (
  SELECT id_urgencia, MIN(Fechaing) AS Fechaing, MIN(motivo_categoria) AS motivo_categoria,
    MIN(motivo_libre) AS motivo_libre FROM RawScope GROUP BY id_urgencia
)
SELECT N'MOT04_POR_ANIO' AS resultado, YEAR(Fechaing) AS anio, COUNT_BIG(*) AS universo,
  SUM(CASE WHEN motivo_categoria IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_categoria,
  SUM(CASE WHEN motivo_libre IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_texto_libre,
  SUM(CASE WHEN motivo_categoria IS NULL AND motivo_libre IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS ninguno
FROM EventScope GROUP BY YEAR(Fechaing) ORDER BY anio;

;WITH RawScope AS (
  SELECT V.id_urgencia, V.cod_centro,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urgencia))), '') AS motivo_categoria,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urg_libre))), '') AS motivo_libre
  FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio = V.codigo_servicio_ingreso
    AND S.cod_centro = V.cod_centro AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing >= @Desde AND V.Fechaing < @HastaExclusivo
), EventScope AS (
  SELECT id_urgencia, MIN(cod_centro) AS cod_centro, MIN(motivo_categoria) AS motivo_categoria,
    MIN(motivo_libre) AS motivo_libre FROM RawScope GROUP BY id_urgencia
)
SELECT N'MOT05_POR_CENTRO' AS resultado, cod_centro, COUNT_BIG(*) AS universo,
  SUM(CASE WHEN motivo_categoria IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_categoria,
  SUM(CASE WHEN motivo_libre IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_texto_libre,
  SUM(CASE WHEN motivo_categoria IS NULL AND motivo_libre IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS ninguno
FROM EventScope GROUP BY cod_centro ORDER BY cod_centro;

;WITH RawScope AS (
  SELECT V.id_urgencia, V.cod_centro, V.codigo_servicio_ingreso,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urgencia))), '') AS motivo_categoria,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urg_libre))), '') AS motivo_libre
  FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio = V.codigo_servicio_ingreso
    AND S.cod_centro = V.cod_centro AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing >= @Desde AND V.Fechaing < @HastaExclusivo
), EventScope AS (
  SELECT id_urgencia, MIN(cod_centro) AS cod_centro, MIN(codigo_servicio_ingreso) AS codigo_servicio_ingreso,
    MIN(motivo_categoria) AS motivo_categoria, MIN(motivo_libre) AS motivo_libre
  FROM RawScope GROUP BY id_urgencia
)
SELECT N'MOT06_POR_SERVICIO' AS resultado, cod_centro, codigo_servicio_ingreso, COUNT_BIG(*) AS universo,
  SUM(CASE WHEN motivo_categoria IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_categoria,
  SUM(CASE WHEN motivo_libre IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_texto_libre,
  SUM(CASE WHEN motivo_categoria IS NULL AND motivo_libre IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS ninguno
FROM EventScope GROUP BY cod_centro, codigo_servicio_ingreso ORDER BY cod_centro, codigo_servicio_ingreso;

;WITH RawScope AS (
  SELECT V.id_urgencia,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urgencia))), '') AS motivo_categoria,
    NULLIF(LTRIM(RTRIM(CONVERT(varchar(60), V.motivo_urg_libre))), '') AS motivo_libre
  FROM dbo.vUrgencias V INNER JOIN dbo.servicios S ON S.codigo_servicio = V.codigo_servicio_ingreso
    AND S.cod_centro = V.cod_centro AND S.codigo_area = 2 AND S.serv_activo_sn = 1
  WHERE V.id_urgencia IS NOT NULL AND V.Fechaing >= @Desde AND V.Fechaing < @HastaExclusivo
), EventScope AS (
  SELECT id_urgencia, MIN(motivo_categoria) AS motivo_categoria, MIN(motivo_libre) AS motivo_libre
  FROM RawScope GROUP BY id_urgencia
)
SELECT N'MOT07_RELACION_CATEGORIA_TEXTO' AS resultado,
  ISNULL(motivo_categoria, '<SIN_DATO>') AS motivo_categoria, COUNT_BIG(*) AS universo_categoria,
  SUM(CASE WHEN motivo_libre IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) AS con_texto_libre,
  SUM(CASE WHEN motivo_libre IS NULL THEN CONVERT(bigint,1) ELSE 0 END) AS sin_texto_libre
FROM EventScope GROUP BY motivo_categoria ORDER BY universo_categoria DESC, motivo_categoria;
END;
