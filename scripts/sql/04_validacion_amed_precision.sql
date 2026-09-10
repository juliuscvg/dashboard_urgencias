/*
  Complemento AMED: precisión de altamed_fecha e inversiones temporales.
  SQL Server 2012 / compatibilidad 100. SOLO LECTURA.
  El llamador reemplaza @Desde y @HastaExclusivo por una cohorte cerrada.
*/
DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;
IF @Desde IS NULL OR @HastaExclusivo IS NULL
  SELECT N'AMED07_CONFIGURAR_PERIODO' AS resultado, N'Asigne @Desde y @HastaExclusivo' AS estado;
ELSE
BEGIN
;WITH RawScope AS
(
 SELECT V.id_urgencia,V.Fechaing,V.fechatri,V.fechaate,V.fechamed,V.altamed_fecha,V.fechaegr
 FROM dbo.vUrgencias V
 INNER JOIN dbo.servicios S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
 WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
 SELECT id_urgencia,MIN(Fechaing) Fechaing,MIN(fechatri) fechatri,MIN(fechaate) fechaate,
   MIN(fechamed) fechamed,MIN(altamed_fecha) altamed_fecha,MIN(fechaegr) fechaegr
 FROM RawScope GROUP BY id_urgencia
)
SELECT N'AMED07_PRECISION_Y_TRAMOS' resultado,
 SUM(CASE WHEN altamed_fecha IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) con_altamed,
 SUM(CASE WHEN altamed_fecha IS NOT NULL AND CONVERT(time,altamed_fecha)='00:00:00' THEN CONVERT(bigint,1) ELSE 0 END) altamed_medianoche,
 SUM(CASE WHEN altamed_fecha IS NOT NULL AND CONVERT(time,altamed_fecha)<>'00:00:00' THEN CONVERT(bigint,1) ELSE 0 END) altamed_con_hora,
 SUM(CASE WHEN Fechaing IS NOT NULL AND fechatri IS NOT NULL AND fechatri<Fechaing THEN CONVERT(bigint,1) ELSE 0 END) inv_ing_tri,
 SUM(CASE WHEN fechatri IS NOT NULL AND fechaate IS NOT NULL AND fechaate<fechatri THEN CONVERT(bigint,1) ELSE 0 END) inv_tri_ate,
 SUM(CASE WHEN fechaate IS NOT NULL AND fechamed IS NOT NULL AND fechamed<fechaate THEN CONVERT(bigint,1) ELSE 0 END) inv_ate_med,
 SUM(CASE WHEN fechamed IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr<fechamed THEN CONVERT(bigint,1) ELSE 0 END) inv_med_egr
FROM EventScope;

;WITH RawScope AS
(
 SELECT V.id_urgencia,V.Fechaing,V.fechaate,V.fechamed,V.fechaegr
 FROM dbo.vUrgencias V
 INNER JOIN dbo.servicios S ON S.codigo_servicio=V.codigo_servicio_ingreso AND S.cod_centro=V.cod_centro AND S.codigo_area=2 AND S.serv_activo_sn=1
 WHERE V.id_urgencia IS NOT NULL AND V.Fechaing>=@Desde AND V.Fechaing<@HastaExclusivo
), EventScope AS
(
 SELECT id_urgencia,MIN(Fechaing) Fechaing,MIN(fechaate) fechaate,MIN(fechamed) fechamed,MIN(fechaegr) fechaegr
 FROM RawScope GROUP BY id_urgencia
), Pares AS
(
 SELECT id_urgencia,N'fechaate→fechamed' par,fechaate inicio,fechamed fin FROM EventScope WHERE fechaate IS NOT NULL AND fechamed IS NOT NULL AND fechamed<fechaate
 UNION ALL SELECT id_urgencia,N'fechamed→fechaegr',fechamed,fechaegr FROM EventScope WHERE fechamed IS NOT NULL AND fechaegr IS NOT NULL AND fechaegr<fechamed
)
SELECT TOP (12) N'AMED08_EJEMPLOS_INVERSION' resultado,
 RIGHT(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(40),id_urgencia)),2),16) evento_hash,
 par,inicio,fin,DATEDIFF(MINUTE,inicio,fin) minutos
FROM Pares ORDER BY DATEDIFF(MINUTE,inicio,fin),evento_hash;
END;
