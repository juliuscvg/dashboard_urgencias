/*
 Validación funcional dirigida de dbo.vUrgencias.
 SQL Server 2012 / compatibilidad 100. SOLO LECTURA.
 Ejecutar por bloques. Definir @Inicio y @FinExclusivo en G, I y J.
 No crea objetos, no modifica datos y no corrige outliers.
 Los identificadores técnicos de detalle deben pseudonimizarse antes de compartirse.
*/
SET NOCOUNT ON;
GO

/* B. Identidad canónica y aliases validados. COSTOSA: perfiles exactos. */
SELECT N'B01_URGENCIAS_ID' resultado,
 COUNT_BIG(*) filas,
 SUM(CASE WHEN id_urgencia_pk IS NULL THEN CONVERT(bigint,1) ELSE 0 END) id_nulo,
 COUNT(DISTINCT id_urgencia_pk) ids_distintos
FROM dbo.urgencias;

SELECT N'B02_ALIASES_VISTA' resultado,
 COUNT_BIG(*) filas_vista,
 COUNT(DISTINCT id_urgencia) eventos_id_urgencia,
 SUM(CASE WHEN id_urgencia IS NULL THEN CONVERT(bigint,1) ELSE 0 END) id_nulo,
 SUM(CASE WHEN folio<>id_urgencia OR (folio IS NULL AND id_urgencia IS NOT NULL)
               OR (folio IS NOT NULL AND id_urgencia IS NULL) THEN CONVERT(bigint,1) ELSE 0 END) conflictos_folio_id,
 SUM(CASE WHEN foliounico<>epis_pk OR (foliounico IS NULL AND epis_pk IS NOT NULL)
               OR (foliounico IS NOT NULL AND epis_pk IS NULL) THEN CONVERT(bigint,1) ELSE 0 END) conflictos_foliounico_epis,
 SUM(CASE WHEN epis_pk IS NULL THEN CONVERT(bigint,1) ELSE 0 END) eventos_sin_epis_pk
FROM dbo.vUrgencias;

SELECT N'B03_SIN_EPIS_POR_ANIO' resultado,YEAR(Fechaing) anio,COUNT(DISTINCT id_urgencia) eventos
FROM dbo.vUrgencias WHERE epis_pk IS NULL
GROUP BY YEAR(Fechaing) ORDER BY anio;
GO

/* C. Multiplicación física y origen vsegpop. No elige una fila representativa. */
SELECT TOP (100) N'C01_EVENTOS_MULTIPLICADOS' resultado,id_urgencia,COUNT_BIG(*) filas,
 COUNT(DISTINCT codigo_cliente) clientes,
 COUNT(DISTINCT codigo_servicio_ingreso) servicios,
 COUNT(DISTINCT CONVERT(varchar(33),Fechaing,126)) fechas_ingreso
FROM dbo.vUrgencias
GROUP BY id_urgencia
HAVING COUNT_BIG(*)>1
ORDER BY filas DESC,id_urgencia;

SELECT TOP (100) N'C02_VSEGPOP_ACTIVOS_MULTIPLES' resultado,codigo_cliente,COUNT_BIG(*) registros_activos
FROM dbo.vsegpop
WHERE activa_sn=1
GROUP BY codigo_cliente
HAVING COUNT_BIG(*)>1
ORDER BY registros_activos DESC,codigo_cliente;
SELECT TOP (100) N'C03_VSEGPOP_DETALLE_ACTIVO' resultado,v.codigo_cliente,v.registro,v.activa_sn
FROM dbo.vsegpop v
WHERE v.activa_sn=1
 AND EXISTS
 (
  SELECT 1 FROM dbo.vsegpop x
  WHERE x.codigo_cliente=v.codigo_cliente AND x.activa_sn=1
  GROUP BY x.codigo_cliente HAVING COUNT_BIG(*)>1
 )
ORDER BY v.codigo_cliente,v.registro;
GO

/* D. Identidad longitudinal. Outliers se conservan. COSTOSA. */
;WITH eventos AS
(
 SELECT id_urgencia,codigo_cliente,epis_pk,Fechaing
 FROM dbo.vUrgencias
 GROUP BY id_urgencia,codigo_cliente,epis_pk,Fechaing
),
pacientes AS
(
 SELECT codigo_cliente,COUNT_BIG(*) eventos,COUNT(DISTINCT epis_pk) episodios_xhis,
  MIN(Fechaing) primera_Fechaing,MAX(Fechaing) ultima_Fechaing
 FROM eventos WHERE codigo_cliente IS NOT NULL GROUP BY codigo_cliente
)
SELECT N'D01_RESUMEN_PACIENTES' resultado,COUNT_BIG(*) pacientes_distintos,
 SUM(eventos) eventos_identificados,MAX(eventos) max_eventos_por_paciente
FROM pacientes;

;WITH eventos AS
(
 SELECT id_urgencia,codigo_cliente,epis_pk,Fechaing,codigo_servicio_ingreso,servicio_ingreso
 FROM dbo.vUrgencias
 GROUP BY id_urgencia,codigo_cliente,epis_pk,Fechaing,codigo_servicio_ingreso,servicio_ingreso
)
SELECT TOP (100) N'D02_OUTLIERS_DESCRIPTIVOS' resultado,codigo_cliente,
 COUNT_BIG(*) eventos,COUNT(DISTINCT epis_pk) episodios_xhis,
 MIN(Fechaing) primera_Fechaing,MAX(Fechaing) ultima_Fechaing
FROM eventos WHERE codigo_cliente IS NOT NULL
GROUP BY codigo_cliente ORDER BY eventos DESC,codigo_cliente;
GO

/* E. Catálogo canónico dinámico. serv_ing_urg_sn se muestra, no filtra. */
SELECT N'E01_SERVICIOS_CANONICOS' resultado,s.*
FROM dbo.servicios s
WHERE s.codigo_area=2 AND s.serv_activo_sn=1
ORDER BY s.codigo_servicio;
GO

/* F. Cobertura temporal y activo probable. COUNT DISTINCT evita multiplicación física. */
SELECT N'F01_COBERTURA_Y_ACTIVOS' resultado,
 COUNT(DISTINCT id_urgencia) eventos,
 COUNT(DISTINCT CASE WHEN Fechaing IS NOT NULL THEN id_urgencia END) con_Fechaing,
 COUNT(DISTINCT CASE WHEN fechatri IS NOT NULL THEN id_urgencia END) con_fechatri,
 COUNT(DISTINCT CASE WHEN fechaate IS NOT NULL THEN id_urgencia END) con_fechaate,
 COUNT(DISTINCT CASE WHEN fechamed IS NOT NULL THEN id_urgencia END) con_fechamed,
 COUNT(DISTINCT CASE WHEN fechaegr IS NOT NULL THEN id_urgencia END) con_fechaegr,
 COUNT(DISTINCT CASE WHEN fechaegr IS NULL THEN id_urgencia END) fechaegr_nula,
 COUNT(DISTINCT CASE WHEN fechaegr IS NULL AND motivo_alta_pk IS NULL THEN id_urgencia END) activos_probables,
 COUNT(DISTINCT CASE WHEN fechaegr IS NULL AND motivo_alta_pk IS NOT NULL THEN id_urgencia END) deuda_cierre
FROM dbo.vUrgencias;

SELECT N'F02_ACTIVOS_POR_ANIO' resultado,YEAR(Fechaing) anio,
 COUNT(DISTINCT CASE WHEN fechaegr IS NULL THEN id_urgencia END) fechaegr_nula,
 COUNT(DISTINCT CASE WHEN fechaegr IS NULL AND motivo_alta_pk IS NULL THEN id_urgencia END) activos_probables,
 COUNT(DISTINCT CASE WHEN fechaegr IS NULL AND motivo_alta_pk IS NOT NULL THEN id_urgencia END) deuda_cierre
FROM dbo.vUrgencias
GROUP BY YEAR(Fechaing) ORDER BY anio;

SELECT N'F03_EXTREMOS_TEMPORALES' resultado,
 MIN(Fechaing) min_Fechaing,MAX(Fechaing) max_Fechaing,
 MIN(fechaegr) min_fechaegr,MAX(fechaegr) max_fechaegr,
 MIN(fecha_modif) min_fecha_modif,MAX(fecha_modif) max_fecha_modif
FROM dbo.vUrgencias;
GO

/* G. Selección del antecedente más reciente. COSTOSA.
   Configure un periodo semiabierto cerrado o un corte explícito. */
DECLARE @Inicio datetime=NULL,@FinExclusivo datetime=NULL;
IF @Inicio IS NULL OR @FinExclusivo IS NULL
 SELECT N'G00_CONFIGURAR_PERIODO' resultado,N'Asigne @Inicio y @FinExclusivo antes de ejecutar G' estado;
ELSE
BEGIN
 ;WITH eventos AS
 (
  SELECT id_urgencia,codigo_cliente,codigo_servicio_ingreso,Fechaing,fechaegr
  FROM dbo.vUrgencias
  GROUP BY id_urgencia,codigo_cliente,codigo_servicio_ingreso,Fechaing,fechaegr
 ),
 actuales AS
 (
  SELECT * FROM eventos WHERE Fechaing>=@Inicio AND Fechaing<@FinExclusivo
 )
 SELECT TOP (100) N'G01_ANTECEDENTE_ELEGIDO' resultado,a.id_urgencia id_actual,
  a.codigo_cliente,a.codigo_servicio_ingreso,a.Fechaing Fechaing_actual,
  p.id_urgencia id_previo,p.Fechaing Fechaing_previa,p.fechaegr fechaegr_previa,
  DATEDIFF(MINUTE,p.fechaegr,a.Fechaing) minutos_retorno
 FROM actuales a
 OUTER APPLY
 (
  SELECT TOP (1) e.id_urgencia,e.Fechaing,e.fechaegr
  FROM eventos e
  WHERE e.codigo_cliente=a.codigo_cliente
    AND e.codigo_servicio_ingreso=a.codigo_servicio_ingreso
    AND e.id_urgencia<>a.id_urgencia
    AND e.fechaegr IS NOT NULL
    AND e.fechaegr<a.Fechaing
  ORDER BY e.fechaegr DESC,e.Fechaing DESC,e.id_urgencia DESC
 ) p
 ORDER BY a.Fechaing DESC,a.id_urgencia DESC;
END;
GO

/* H. Fronteras sintéticas obligatorias; clasificación con minutos reales. */
;WITH casos(etiqueta,minutos) AS
(
 SELECT * FROM (VALUES
 (N'23:59',1439),(N'24:00',1440),(N'24:01',1441),
 (N'47:59',2879),(N'48:00',2880),(N'48:01',2881),
 (N'71:59',4319),(N'72:00',4320),(N'72:01',4321)
 ) v(etiqueta,minutos)
)
SELECT N'H01_FRONTERAS' resultado,etiqueta,minutos,
 CASE WHEN minutos>0 AND minutos<=1440 THEN N'0-24'
      WHEN minutos>1440 AND minutos<=2880 THEN N'>24-48'
      WHEN minutos>2880 AND minutos<4320 THEN N'>48-72'
      ELSE N'NO reingreso' END clasificacion
FROM casos ORDER BY minutos;
GO

/* I. Benchmark agregado de reingresos. COSTOSA.
   El periodo restringe el evento actual; el antecedente usa toda la historia. */
DECLARE @Inicio datetime=NULL,@FinExclusivo datetime=NULL;
IF @Inicio IS NULL OR @FinExclusivo IS NULL
 SELECT N'I00_CONFIGURAR_PERIODO' resultado,N'Asigne @Inicio y @FinExclusivo antes de ejecutar I' estado;
ELSE
BEGIN
 ;WITH eventos AS
 (
  SELECT id_urgencia,codigo_cliente,codigo_servicio_ingreso,centro,servicio_ingreso,Fechaing,fechaegr
  FROM dbo.vUrgencias
  GROUP BY id_urgencia,codigo_cliente,codigo_servicio_ingreso,centro,servicio_ingreso,Fechaing,fechaegr
 ),
 actuales AS
 (
  SELECT * FROM eventos WHERE Fechaing>=@Inicio AND Fechaing<@FinExclusivo
   AND id_urgencia IS NOT NULL AND codigo_cliente IS NOT NULL
   AND codigo_servicio_ingreso IS NOT NULL AND Fechaing IS NOT NULL
 ),
 clasificados AS
 (
  SELECT a.*,
   CASE WHEN x.fechaegr_previa IS NOT NULL
          AND a.Fechaing<=DATEADD(HOUR,24,x.fechaegr_previa) THEN 1 ELSE 0 END b_0_24,
   CASE WHEN a.Fechaing>DATEADD(HOUR,24,x.fechaegr_previa)
          AND a.Fechaing<=DATEADD(HOUR,48,x.fechaegr_previa) THEN 1 ELSE 0 END b_24_48,
   CASE WHEN a.Fechaing>DATEADD(HOUR,48,x.fechaegr_previa)
          AND a.Fechaing<DATEADD(HOUR,72,x.fechaegr_previa) THEN 1 ELSE 0 END b_48_72
  FROM actuales a
  OUTER APPLY
  (
   SELECT TOP (1) e.fechaegr fechaegr_previa, DATEDIFF(MINUTE,e.fechaegr,a.Fechaing) minutos
   FROM eventos e
   WHERE e.codigo_cliente=a.codigo_cliente
    AND e.codigo_servicio_ingreso=a.codigo_servicio_ingreso
    AND e.id_urgencia<>a.id_urgencia
    AND e.fechaegr IS NOT NULL AND e.fechaegr<a.Fechaing
   ORDER BY e.fechaegr DESC,e.Fechaing DESC,e.id_urgencia DESC
  ) x
 )
 SELECT N'I01_BENCHMARK_REINGRESOS' resultado,s.codigo_servicio codigo_servicio_ingreso,
  MAX(c.centro) centro,MAX(c.servicio_ingreso) servicio_ingreso,
  COUNT_BIG(c.id_urgencia) eventos,
  COALESCE(SUM(c.b_0_24),0) [0-24],COALESCE(SUM(c.b_24_48),0) [24-48],
  COALESCE(SUM(c.b_48_72),0) [48-72],
  COALESCE(SUM(c.b_0_24+c.b_24_48+c.b_48_72),0) [menor_72],
  CAST(100.0*SUM(c.b_0_24+c.b_24_48+c.b_48_72)/NULLIF(COUNT_BIG(c.id_urgencia),0) AS decimal(9,2)) tasa_pct
 FROM dbo.servicios s
 LEFT JOIN clasificados c ON c.codigo_servicio_ingreso=s.codigo_servicio
 WHERE s.codigo_area=2 AND s.serv_activo_sn=1
 GROUP BY s.codigo_servicio
 ORDER BY s.codigo_servicio;
END;
GO

/* J. Reconciliación del denominador. Requiere periodo.
   La ausencia de antecedente NO excluye un evento evaluable. */
DECLARE @Inicio datetime=NULL,@FinExclusivo datetime=NULL;
IF @Inicio IS NULL OR @FinExclusivo IS NULL
 SELECT N'J00_CONFIGURAR_PERIODO' resultado,N'Asigne @Inicio y @FinExclusivo antes de ejecutar J' estado;
ELSE
BEGIN
 ;WITH filas AS
 (
  SELECT id_urgencia,codigo_cliente,codigo_servicio_ingreso,Fechaing
  FROM dbo.vUrgencias WHERE Fechaing>=@Inicio AND Fechaing<@FinExclusivo
 ),
 eventos AS
 (
  SELECT id_urgencia,codigo_cliente,codigo_servicio_ingreso,Fechaing
  FROM filas GROUP BY id_urgencia,codigo_cliente,codigo_servicio_ingreso,Fechaing
 )
 SELECT N'J01_DENOMINADOR' resultado,
  COUNT_BIG(*) eventos_periodo,
  SUM(CASE WHEN id_urgencia IS NOT NULL AND codigo_cliente IS NOT NULL
            AND codigo_servicio_ingreso IS NOT NULL AND Fechaing IS NOT NULL THEN CONVERT(bigint,1) ELSE 0 END) eventos_evaluables,
  SUM(CASE WHEN codigo_cliente IS NULL THEN CONVERT(bigint,1) ELSE 0 END) sin_codigo_cliente,
  SUM(CASE WHEN codigo_servicio_ingreso IS NULL THEN CONVERT(bigint,1) ELSE 0 END) sin_codigo_servicio,
  SUM(CASE WHEN codigo_servicio_ingreso IS NOT NULL AND NOT EXISTS
   (SELECT 1 FROM dbo.servicios s WHERE s.codigo_servicio=eventos.codigo_servicio_ingreso
     AND s.codigo_area=2 AND s.serv_activo_sn=1) THEN CONVERT(bigint,1) ELSE 0 END) eventos_fuera_catalogo_urgencias,
  (SELECT COUNT_BIG(*)-COUNT(DISTINCT id_urgencia) FROM filas) filas_multiplicadas_vista
 FROM eventos;
END;
GO

/* K. Conflictos dentro de una identidad canónica. Debe devolver cero filas si se conserva el hallazgo. */
SELECT TOP (100) N'K01_CONFLICTOS_ID_URGENCIA' resultado,id_urgencia,
 COUNT_BIG(*) filas,
 COUNT(DISTINCT codigo_cliente) clientes,
 COUNT(DISTINCT codigo_servicio_ingreso) servicios,
 COUNT(DISTINCT CONVERT(varchar(33),Fechaing,126)) fechas_ingreso
FROM dbo.vUrgencias
WHERE id_urgencia IS NOT NULL
GROUP BY id_urgencia
HAVING COUNT(DISTINCT codigo_cliente)>1
 OR COUNT(DISTINCT codigo_servicio_ingreso)>1
 OR COUNT(DISTINCT CONVERT(varchar(33),Fechaing,126))>1
ORDER BY id_urgencia;
GO
