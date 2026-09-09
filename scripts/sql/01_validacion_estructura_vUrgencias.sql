/*
 Fase 1: estructura de dbo.vUrgencias. SQL Server 2012 / compatibilidad 100.
 SOLO LECTURA. Ejecutar por bloques. COSTOSA identifica agrupaciones exactas.
 -- SET STATISTICS IO ON;
 -- SET STATISTICS TIME ON;
*/
SET NOCOUNT ON;
GO

/* A. Existencia, definición y dependencias directas */
DECLARE @oid int;
SELECT @oid=o.object_id FROM sys.objects o JOIN sys.schemas s ON s.schema_id=o.schema_id
WHERE s.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'dbo'
  AND o.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'vUrgencias';

SELECT N'A01_OBJETO' resultado,
 CASE WHEN @oid IS NULL THEN N'NO ENCONTRADO' ELSE N'ENCONTRADO' END estado,
 @oid object_id,o.type tipo,o.type_desc
FROM (SELECT 1 x) b LEFT JOIN sys.objects o ON o.object_id=@oid;

SELECT N'A02_DEFINICION' resultado,@oid object_id,OBJECT_DEFINITION(@oid) definicion;

BEGIN TRY
 SELECT N'A03_DEPENDENCIAS_DIRECTAS' resultado,d.referenced_server_name,d.referenced_database_name,
  d.referenced_schema_name,d.referenced_entity_name,d.referenced_minor_id,
  COL_NAME(d.referenced_id,d.referenced_minor_id) referenced_minor_name,
  d.is_schema_bound_reference,d.is_ambiguous
 FROM sys.sql_expression_dependencies d WHERE d.referencing_id=@oid
 ORDER BY d.referenced_schema_name,d.referenced_entity_name,d.referenced_minor_id;
END TRY
BEGIN CATCH
 SELECT N'A03_DEPENDENCIAS_DIRECTAS' resultado,N'NO DISPONIBLE: '+ERROR_MESSAGE() estado;
END CATCH;
GO

/* B. Metadatos de todas las columnas e inventario prioritario */
DECLARE @oid int=OBJECT_ID(N'dbo.vUrgencias');
SELECT N'B01_COLUMNAS_FISICAS' resultado,c.column_id ordinal,c.name,t.name tipo,
 c.max_length longitud_bytes,c.precision,c.scale,c.is_nullable nullable,c.collation_name collation
FROM sys.columns c JOIN sys.types t ON t.user_type_id=c.user_type_id
WHERE c.object_id=@oid ORDER BY c.column_id;

;WITH e(orden,nombre) AS (SELECT * FROM (VALUES
 (1,N'epis_pk'),(2,N'id_urgencia'),(3,N'codigo_cliente'),(4,N'registro'),(5,N'foliounico'),
 (6,N'Fechaing'),(7,N'fechatri'),(8,N'fechaate'),(9,N'fechamed'),(10,N'fechaegr'),
 (11,N'fecha_modif'),(12,N'atencion_fecha'),(13,N'altamed_fecha'),
 (14,N'cod_centro'),(15,N'centro'),(16,N'codigo_servicio_ingreso'),(17,N'servicio_ingreso'),
 (18,N'triage_pk'),(19,N'triage_codigo'),(20,N'triage_desc'),(21,N'area'),(22,N'desc_area'),
 (23,N'tipo_urgencia'),(24,N'login_triage'),(25,N'usuario_triage'),(26,N'categoria_triage'),
 (27,N'destino_urg_pk'),(28,N'destino_urgencias'),(29,N'motivo_alta_pk'),(30,N'motivo_alta'),
 (31,N'fecha_nac'),(32,N'edadaños'),(33,N'EdadMeses'),(34,N'EdadDias'),(35,N'sexo'),
 (36,N'localizacion_pk'),(37,N'localizacion'),(38,N'cod_cama'),
 (39,N'codigo_personal'),(40,N'NombreMedico')) v(orden,nombre))
SELECT N'B02_INVENTARIO_PRIORITARIO' resultado,e.orden,e.nombre nombre_esperado,
 CASE WHEN c.column_id IS NULL THEN N'NO ENCONTRADO' ELSE N'ENCONTRADO' END estado,
 c.name nombre_fisico,t.name tipo,c.max_length longitud_bytes,c.precision,c.scale,
 c.is_nullable nullable,c.collation_name collation
FROM e LEFT JOIN sys.columns c ON c.object_id=@oid
 AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=e.nombre COLLATE SQL_Latin1_General_CP1_CI_AS
LEFT JOIN sys.types t ON t.user_type_id=c.user_type_id ORDER BY e.orden;
GO

/* C. Volumen y cobertura de claves. Una pasada. */
DECLARE @oid int=OBJECT_ID(N'dbo.vUrgencias'),@sql nvarchar(max),@f sysname,@esperado sysname,@i int=1;
IF @oid IS NULL SELECT N'C01_COBERTURA_CLAVES' resultado,N'NO ENCONTRADO: dbo.vUrgencias' estado;
ELSE
BEGIN
 SET @sql=N'SELECT N''C01_COBERTURA_CLAVES'' resultado,COUNT_BIG(*) total_filas';
 WHILE @i<=5
 BEGIN
  SET @esperado=CASE @i WHEN 1 THEN N'epis_pk' WHEN 2 THEN N'id_urgencia'
   WHEN 3 THEN N'codigo_cliente' WHEN 4 THEN N'registro' ELSE N'foliounico' END;
  SET @f=NULL;
  SELECT @f=c.name FROM sys.columns c WHERE c.object_id=@oid
   AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=@esperado COLLATE SQL_Latin1_General_CP1_CI_AS;
  IF @f IS NULL SET @sql+=N',CAST(NULL AS bigint) '+QUOTENAME(@esperado+N'_NO_ENCONTRADO');
  ELSE SET @sql+=N',SUM(CASE WHEN '+QUOTENAME(@f)+N' IS NULL THEN CONVERT(bigint,1) ELSE 0 END) '+QUOTENAME(@esperado+N'_nulos')
   +N',SUM(CASE WHEN '+QUOTENAME(@f)+N' IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) '+QUOTENAME(@esperado+N'_no_nulos')
   +N',CAST(100.0*SUM(CASE WHEN '+QUOTENAME(@f)+N' IS NOT NULL THEN CONVERT(decimal(38,4),1) ELSE 0 END)/NULLIF(COUNT_BIG(*),0) AS decimal(9,4)) '+QUOTENAME(@esperado+N'_cobertura_pct');
  SET @i+=1;
 END
 SET @sql+=N' FROM dbo.vUrgencias;'; EXEC sp_executesql @sql;
END;
GO

/* D. Unicidad y duplicados. COSTOSA: dos perfiles exactos por cada clave. */
DECLARE @oid int=OBJECT_ID(N'dbo.vUrgencias'),@logica sysname,@clave sysname,
 @fi sysname,@fe sysname,@sql nvarchar(max),@i int=1;
SELECT @fi=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'Fechaing';
SELECT @fe=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'fechaegr';
WHILE @i<=2
BEGIN
 SET @logica=CASE @i WHEN 1 THEN N'epis_pk' ELSE N'id_urgencia' END; SET @clave=NULL;
 SELECT @clave=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=@logica;
 IF @clave IS NULL SELECT N'D01_RESUMEN' resultado,@logica clave,N'NO ENCONTRADO' estado;
 ELSE BEGIN TRY
  SET @sql=N';WITH g AS (SELECT '+QUOTENAME(@clave)+N' clave,COUNT_BIG(*) filas FROM dbo.vUrgencias
   WHERE '+QUOTENAME(@clave)+N' IS NOT NULL GROUP BY '+QUOTENAME(@clave)+N')
   SELECT N''D01_RESUMEN'' resultado,N'''+@logica+N''' clave,
   (SELECT COUNT_BIG(*) FROM dbo.vUrgencias) total_filas,
   (SELECT COUNT_BIG(*) FROM dbo.vUrgencias WHERE '+QUOTENAME(@clave)+N' IS NOT NULL) total_no_nulos,
   COUNT_BIG(*) claves_distintas,
   SUM(CASE WHEN filas>1 THEN CONVERT(bigint,1) ELSE 0 END) claves_duplicadas,
   MAX(filas) max_filas_por_clave FROM g;';
  EXEC sp_executesql @sql;
  SET @sql=N'SELECT TOP (100) N''D02_DUPLICADOS'' resultado,N'''+@logica+N''' tipo_clave,'
   +QUOTENAME(@clave)+N' clave,COUNT_BIG(*) conteo_filas,'
   +CASE WHEN @fi IS NULL THEN N'CAST(NULL AS datetime) min_Fechaing,CAST(NULL AS datetime) max_Fechaing,'
    ELSE N'MIN('+QUOTENAME(@fi)+N') min_Fechaing,MAX('+QUOTENAME(@fi)+N') max_Fechaing,' END
   +CASE WHEN @fe IS NULL THEN N'CAST(NULL AS datetime) min_fechaegr,CAST(NULL AS datetime) max_fechaegr '
    ELSE N'MIN('+QUOTENAME(@fe)+N') min_fechaegr,MAX('+QUOTENAME(@fe)+N') max_fechaegr ' END
   +N'FROM dbo.vUrgencias WHERE '+QUOTENAME(@clave)+N' IS NOT NULL GROUP BY '+QUOTENAME(@clave)
   +N' HAVING COUNT_BIG(*)>1 ORDER BY conteo_filas DESC,clave;';
  EXEC sp_executesql @sql;
 END TRY BEGIN CATCH SELECT N'D_ERROR' resultado,@logica clave,ERROR_MESSAGE() estado; END CATCH;
 SET @i+=1;
END;
GO

/* E. Cardinalidad epis_pk/id_urgencia. COSTOSA: dos perfiles exactos de pares. */
DECLARE @oid int=OBJECT_ID(N'dbo.vUrgencias'),@ep sysname,@ur sysname,@sql nvarchar(max);
SELECT @ep=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'epis_pk';
SELECT @ur=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'id_urgencia';
IF @ep IS NULL OR @ur IS NULL SELECT N'E01_CARDINALIDAD' resultado,N'epis_pk o id_urgencia NO ENCONTRADO' estado;
ELSE BEGIN TRY
 SET @sql=N';WITH p AS (
  SELECT '+QUOTENAME(@ep)+N' epis_pk,'+QUOTENAME(@ur)+N' id_urgencia,COUNT_BIG(*) filas_par
  FROM dbo.vUrgencias WHERE '+QUOTENAME(@ep)+N' IS NOT NULL AND '+QUOTENAME(@ur)+N' IS NOT NULL
  GROUP BY '+QUOTENAME(@ep)+N','+QUOTENAME(@ur)+N'),
 ed AS (SELECT epis_pk,COUNT_BIG(*) ids_por_epis FROM p GROUP BY epis_pk),
 ud AS (SELECT id_urgencia,COUNT_BIG(*) epis_por_id FROM p GROUP BY id_urgencia),
 r AS (SELECT p.*,ed.ids_por_epis,ud.epis_por_id FROM p JOIN ed ON ed.epis_pk=p.epis_pk JOIN ud ON ud.id_urgencia=p.id_urgencia)
 SELECT N''E01_CARDINALIDAD'' resultado,COUNT_BIG(*) pares_distintos,
 (SELECT COUNT_BIG(*) FROM ed) epis_distintos,(SELECT COUNT_BIG(*) FROM ud) ids_distintos,
 (SELECT COUNT_BIG(*) FROM ed WHERE ids_por_epis>1) epis_con_varios_ids,
 (SELECT MAX(ids_por_epis) FROM ed) max_ids_por_epis,
 (SELECT COUNT_BIG(*) FROM ud WHERE epis_por_id>1) ids_con_varios_epis,
 (SELECT MAX(epis_por_id) FROM ud) max_epis_por_id,
 SUM(CASE WHEN ids_por_epis=1 AND epis_por_id=1 THEN CONVERT(bigint,1) ELSE 0 END) pares_1_a_1,
 SUM(CASE WHEN ids_por_epis>1 AND epis_por_id=1 THEN CONVERT(bigint,1) ELSE 0 END) pares_1_a_N,
 SUM(CASE WHEN ids_por_epis=1 AND epis_por_id>1 THEN CONVERT(bigint,1) ELSE 0 END) pares_N_a_1,
 SUM(CASE WHEN ids_por_epis>1 AND epis_por_id>1 THEN CONVERT(bigint,1) ELSE 0 END) pares_N_a_N_potencial FROM r;
 ;WITH p AS (
  SELECT '+QUOTENAME(@ep)+N' epis_pk,'+QUOTENAME(@ur)+N' id_urgencia,COUNT_BIG(*) filas_par
  FROM dbo.vUrgencias WHERE '+QUOTENAME(@ep)+N' IS NOT NULL AND '+QUOTENAME(@ur)+N' IS NOT NULL
  GROUP BY '+QUOTENAME(@ep)+N','+QUOTENAME(@ur)+N'),
 ed AS (SELECT epis_pk,COUNT_BIG(*) ids_por_epis FROM p GROUP BY epis_pk),
 ud AS (SELECT id_urgencia,COUNT_BIG(*) epis_por_id FROM p GROUP BY id_urgencia)
 SELECT TOP (100) N''E02_NO_1_A_1'' resultado,p.epis_pk,p.id_urgencia,p.filas_par,
  ed.ids_por_epis,ud.epis_por_id,
  CASE WHEN ed.ids_por_epis>1 AND ud.epis_por_id>1 THEN N''N:N potencial''
   WHEN ed.ids_por_epis>1 THEN N''1:N'' ELSE N''N:1'' END clasificacion
 FROM p JOIN ed ON ed.epis_pk=p.epis_pk JOIN ud ON ud.id_urgencia=p.id_urgencia
 WHERE ed.ids_por_epis>1 OR ud.epis_por_id>1
 ORDER BY CASE WHEN ed.ids_por_epis>ud.epis_por_id THEN ed.ids_por_epis ELSE ud.epis_por_id END DESC,
  p.epis_pk,p.id_urgencia;';
 EXEC sp_executesql @sql;
END TRY BEGIN CATCH SELECT N'E_ERROR' resultado,ERROR_MESSAGE() estado; END CATCH;
GO

/* F. codigo_cliente y cruces descriptivos. COSTOSA: tres perfiles exactos. */
DECLARE @oid int=OBJECT_ID(N'dbo.vUrgencias'),@cl sysname,@ep sysname,@re sysname,@fo sysname,@sql nvarchar(max);
SELECT @cl=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'codigo_cliente';
SELECT @ep=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'epis_pk';
SELECT @re=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'registro';
SELECT @fo=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'foliounico';
IF @cl IS NULL OR @ep IS NULL SELECT N'F01_CLIENTES' resultado,N'codigo_cliente o epis_pk NO ENCONTRADO' estado;
ELSE BEGIN TRY
 SET @sql=N';WITH p AS (SELECT '+QUOTENAME(@cl)+N' cliente,COUNT(DISTINCT '+QUOTENAME(@ep)+N') episodios
 FROM dbo.vUrgencias WHERE '+QUOTENAME(@cl)+N' IS NOT NULL GROUP BY '+QUOTENAME(@cl)+N')
 SELECT N''F01_CLIENTES'' resultado,
 (SELECT COUNT_BIG(*) FROM dbo.vUrgencias WHERE '+QUOTENAME(@cl)+N' IS NULL) nulos,
 COUNT_BIG(*) clientes_distintos,SUM(episodios) episodios_identificados,
 CAST(AVG(CONVERT(decimal(38,4),episodios)) AS decimal(18,4)) promedio_episodios_por_paciente,
 SUM(CASE WHEN episodios>1 THEN CONVERT(bigint,1) ELSE 0 END) pacientes_mas_de_un_episodio,
 MAX(episodios) max_episodios_por_paciente FROM p;';
 EXEC sp_executesql @sql;
 IF @re IS NULL SELECT N'F02_CLIENTE_REGISTRO' resultado,N'registro NO ENCONTRADO' estado;
 ELSE BEGIN
  SET @sql=N'SELECT TOP (100) N''F02_CLIENTE_REGISTRO'' resultado,'+QUOTENAME(@cl)+N' codigo_cliente,
  COUNT(DISTINCT '+QUOTENAME(@ep)+N') episodios,COUNT(DISTINCT '+QUOTENAME(@re)+N') registros
  FROM dbo.vUrgencias WHERE '+QUOTENAME(@cl)+N' IS NOT NULL GROUP BY '+QUOTENAME(@cl)+N'
  HAVING COUNT(DISTINCT '+QUOTENAME(@re)+N')>1 ORDER BY registros DESC,episodios DESC,codigo_cliente;';
  EXEC sp_executesql @sql;
 END;
 IF @fo IS NULL SELECT N'F03_CLIENTE_FOLIO' resultado,N'foliounico NO ENCONTRADO' estado;
 ELSE BEGIN
  SET @sql=N'SELECT TOP (100) N''F03_CLIENTE_FOLIO'' resultado,'+QUOTENAME(@cl)+N' codigo_cliente,
  COUNT(DISTINCT '+QUOTENAME(@ep)+N') episodios,COUNT(DISTINCT '+QUOTENAME(@fo)+N') folios
  FROM dbo.vUrgencias WHERE '+QUOTENAME(@cl)+N' IS NOT NULL GROUP BY '+QUOTENAME(@cl)+N'
  HAVING COUNT(DISTINCT '+QUOTENAME(@fo)+N')>1 ORDER BY folios DESC,episodios DESC,codigo_cliente;';
  EXEC sp_executesql @sql;
 END;
END TRY BEGIN CATCH SELECT N'F_ERROR' resultado,ERROR_MESSAGE() estado; END CATCH;
GO

/* G. Cobertura temporal y deuda por año. No interpreta censo. */
DECLARE @oid int=OBJECT_ID(N'dbo.vUrgencias'),@sql nvarchar(max),@f sysname,@logica sysname,
 @i int=1,@ing sysname,@egr sysname,@mot sysname;
IF @oid IS NULL SELECT N'G01_FECHAS' resultado,N'dbo.vUrgencias NO ENCONTRADO' estado;
ELSE
BEGIN
 SET @sql=N'SELECT N''G01_FECHAS'' resultado,COUNT_BIG(*) total_filas';
 WHILE @i<=5
 BEGIN
  SET @logica=CASE @i WHEN 1 THEN N'Fechaing' WHEN 2 THEN N'fechatri'
   WHEN 3 THEN N'fechaate' WHEN 4 THEN N'fechamed' ELSE N'fechaegr' END;
  SET @f=NULL; SELECT @f=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=@logica;
  IF @f IS NULL SET @sql+=N',CAST(NULL AS bigint) '+QUOTENAME(@logica+N'_NO_ENCONTRADO');
  ELSE SET @sql+=N',SUM(CASE WHEN '+QUOTENAME(@f)+N' IS NULL THEN CONVERT(bigint,1) ELSE 0 END) '+QUOTENAME(@logica+N'_nulos')
   +N',SUM(CASE WHEN '+QUOTENAME(@f)+N' IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) '+QUOTENAME(@logica+N'_no_nulos')
   +N',MIN('+QUOTENAME(@f)+N') '+QUOTENAME(@logica+N'_min')
   +N',MAX('+QUOTENAME(@f)+N') '+QUOTENAME(@logica+N'_max')
   +N',CAST(100.0*SUM(CASE WHEN '+QUOTENAME(@f)+N' IS NOT NULL THEN CONVERT(decimal(38,4),1) ELSE 0 END)/NULLIF(COUNT_BIG(*),0) AS decimal(9,4)) '+QUOTENAME(@logica+N'_cobertura_pct');
  SET @i+=1;
 END;
 SELECT @egr=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'fechaegr';
 SELECT @mot=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'motivo_alta_pk';
 IF @egr IS NOT NULL
 BEGIN
  SET @sql+=N',SUM(CASE WHEN '+QUOTENAME(@egr)+N' IS NULL THEN CONVERT(bigint,1) ELSE 0 END) fechaegr_nula';
  IF @mot IS NOT NULL SET @sql+=N',SUM(CASE WHEN '+QUOTENAME(@egr)+N' IS NULL AND '+QUOTENAME(@mot)+N' IS NULL THEN CONVERT(bigint,1) ELSE 0 END) egr_nulo_motivo_nulo'
   +N',SUM(CASE WHEN '+QUOTENAME(@egr)+N' IS NULL AND '+QUOTENAME(@mot)+N' IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) egr_nulo_motivo_no_nulo';
 END;
 SET @sql+=N' FROM dbo.vUrgencias;'; EXEC sp_executesql @sql;
 SELECT @ing=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'Fechaing';
 IF @ing IS NULL SELECT N'G02_DEUDA_POR_ANIO' resultado,N'Fechaing NO ENCONTRADO' estado;
 ELSE BEGIN
  SET @sql=N'SELECT N''G02_DEUDA_POR_ANIO'' resultado,YEAR('+QUOTENAME(@ing)+N') anio_Fechaing,COUNT_BIG(*) total_filas'
   +CASE WHEN @egr IS NULL THEN N',CAST(NULL AS bigint) fechaegr_nula' ELSE N',SUM(CASE WHEN '+QUOTENAME(@egr)+N' IS NULL THEN CONVERT(bigint,1) ELSE 0 END) fechaegr_nula' END
   +CASE WHEN @egr IS NULL OR @mot IS NULL THEN N',CAST(NULL AS bigint) egr_nulo_motivo_nulo,CAST(NULL AS bigint) egr_nulo_motivo_no_nulo'
    ELSE N',SUM(CASE WHEN '+QUOTENAME(@egr)+N' IS NULL AND '+QUOTENAME(@mot)+N' IS NULL THEN CONVERT(bigint,1) ELSE 0 END) egr_nulo_motivo_nulo,
 SUM(CASE WHEN '+QUOTENAME(@egr)+N' IS NULL AND '+QUOTENAME(@mot)+N' IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) egr_nulo_motivo_no_nulo' END
   +N' FROM dbo.vUrgencias GROUP BY YEAR('+QUOTENAME(@ing)+N') ORDER BY anio_Fechaing;';
  EXEC sp_executesql @sql;
 END;
END;
GO

/* H. Muestra controlada de campos técnicos/no personales. */
DECLARE @oid int=OBJECT_ID(N'dbo.vUrgencias'),@lista nvarchar(max)=N'',@orden nvarchar(max)=N'',
 @sql nvarchar(max),@n sysname,@f sysname,@i int=1;
WHILE @i<=12
BEGIN
 SET @n=CASE @i WHEN 1 THEN N'epis_pk' WHEN 2 THEN N'id_urgencia' WHEN 3 THEN N'codigo_cliente'
  WHEN 4 THEN N'registro' WHEN 5 THEN N'foliounico' WHEN 6 THEN N'Fechaing' WHEN 7 THEN N'fechaegr'
  WHEN 8 THEN N'motivo_alta_pk' WHEN 9 THEN N'cod_centro' WHEN 10 THEN N'centro'
  WHEN 11 THEN N'codigo_servicio_ingreso' ELSE N'servicio_ingreso' END;
 SET @f=NULL; SELECT @f=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=@n;
 IF @f IS NOT NULL SET @lista+=CASE WHEN LEN(@lista)>0 THEN N',' ELSE N'' END+QUOTENAME(@f);
 SET @i+=1;
END;
SELECT @f=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'Fechaing';
IF @f IS NOT NULL SET @orden=QUOTENAME(@f)+N' DESC';
SELECT @f=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'epis_pk';
IF @f IS NOT NULL SET @orden+=CASE WHEN LEN(@orden)>0 THEN N',' ELSE N'' END+QUOTENAME(@f);
SELECT @f=c.name FROM sys.columns c WHERE c.object_id=@oid AND c.name COLLATE SQL_Latin1_General_CP1_CI_AS=N'id_urgencia';
IF @f IS NOT NULL SET @orden+=CASE WHEN LEN(@orden)>0 THEN N',' ELSE N'' END+QUOTENAME(@f);
IF @oid IS NULL SELECT N'H01_MUESTRA' resultado,N'dbo.vUrgencias NO ENCONTRADO' estado;
ELSE IF LEN(@lista)=0 SELECT N'H01_MUESTRA' resultado,N'COLUMNAS SOLICITADAS NO ENCONTRADAS' estado;
ELSE BEGIN
 SET @sql=N'SELECT TOP (100) N''H01_MUESTRA'' resultado,'+@lista+N' FROM dbo.vUrgencias'
  +CASE WHEN LEN(@orden)>0 THEN N' ORDER BY '+@orden ELSE N'' END+N';';
 EXEC sp_executesql @sql;
END;
GO
/* La muestra excluye nombre, CURP, teléfono y dirección. */
