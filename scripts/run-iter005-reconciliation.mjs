import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import sql from 'mssql';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env') });
const needed = ['DB_SERVER', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD'];
if (needed.some((name) => !process.env[name])) throw new Error('Configuración DB incompleta');

const outputIndex = process.argv.indexOf('--output');
const output = outputIndex >= 0 ? path.resolve(root, process.argv[outputIndex + 1]) : path.join(root, '.tmp', 'iter005-reconciliation.json');
const apiIndex = process.argv.indexOf('--api');
const apiBase = apiIndex >= 0 ? process.argv[apiIndex + 1] : 'http://localhost:3002/api';
const filters = { desde: '2026-08-01', hasta: '2026-08-01' };
const corte = '2026-09-09T21:03:28.000Z';
const queryString = new URLSearchParams({ ...filters, corte }).toString();
const config = {
  server: process.env.DB_SERVER, database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT ?? 1433),
  options: {
    encrypt: ['true', '1'].includes(String(process.env.DB_ENCRYPT).toLowerCase()),
    trustServerCertificate: !['false', '0'].includes(String(process.env.DB_TRUST_SERVER_CERTIFICATE).toLowerCase()),
    enableArithAbort: true,
  },
  requestTimeout: 300000,
};
const pool = await new sql.ConnectionPool(config).connect();
const sqlResults = {};
try {
  for (const [id, file] of Object.entries({
    'URG-EJ-03': 'URG-EJ-03_PERMANENCIA_REGISTRADA.sql',
    'URG-ACT-01': 'URG-ACT-01_ACTIVOS_PROBABLES.sql',
    'URG-TRI-03': 'URG-TRI-03_TIEMPO_REGISTRADO.sql',
  })) {
    const request = pool.request()
      .input('Centro', sql.VarChar(20), null)
      .input('CodigoServicio', sql.Int, null);
    if (id === 'URG-ACT-01') request.input('Corte', sql.DateTime, new Date(corte));
    else request.input('Desde', sql.Date, filters.desde).input('Hasta', sql.Date, filters.hasta);
    const started = performance.now();
    const result = await request.query(fs.readFileSync(path.join(root, 'scripts/sql/indicadores', file), 'utf8'));
    sqlResults[id] = { elapsedMs: Math.round(performance.now() - started), row: result.recordset[0] };
  }
} finally {
  await pool.close();
}

async function getApi(route) {
  const started = performance.now();
  const response = await fetch(`${apiBase}/urgencias/${route}?${queryString}`);
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  const body = await response.json();
  return { elapsedMs: Math.round(performance.now() - started), data: body.data };
}
const summaryApi = await getApi('summary');
const triageApi = await getApi('triage');
const n = (value) => value === null || value === undefined ? null : Number(value);
const ej = sqlResults['URG-EJ-03'].row;
const act = sqlResults['URG-ACT-01'].row;
const tri = sqlResults['URG-TRI-03'].row;
const sqlProjection = {
  'URG-EJ-03': {
    universoTotal: n(ej.universo_total), evaluables: n(ej.evaluables), invertidos: n(ej.invertidos),
    sinEgreso: n(ej.sin_egreso), promedioHoras: n(ej.promedio_horas), menor12h: n(ej.menor_12h),
    de12a24h: n(ej.de_12_a_24h), de24a48h: n(ej.de_24_a_48h), de48a72h: n(ej.de_48_a_72h), mayor72h: n(ej.mayor_72h),
  },
  'URG-ACT-01': {
    activosProbables: n(act.activos_probables), antiguedadNoEvaluable: n(act.antiguedad_no_evaluable),
    fechaIngresoFutura: n(act.fecha_ingreso_futura), mayor24h: n(act.mayor_24h),
    mayor48h: n(act.mayor_48h), mayor72h: n(act.mayor_72h),
  },
  'URG-TRI-03': {
    universoTotal: n(tri.universo_total), conTriage: n(tri.con_triage), evaluables: n(tri.evaluables),
    invertidos: n(tri.invertidos), promedioMinutos: n(tri.promedio_minutos), mismoMinuto: n(tri.mismo_minuto),
    de1a10: n(tri.de_1_a_10), de11a30: n(tri.de_11_a_30), de31a60: n(tri.de_31_a_60),
    de61a120: n(tri.de_61_a_120), de121a240: n(tri.de_121_a_240), mayor240: n(tri.mayor_240),
    mayorIgual24h: n(tri.mayor_igual_24h), mayorIgual7d: n(tri.mayor_igual_7d),
  },
};
const s = summaryApi.data;
const t = triageApi.data.resumen;
const apiProjection = {
  'URG-EJ-03': {
    universoTotal: s.atenciones, evaluables: s.eventosCompletados, invertidos: s.permanenciaInvertidos,
    sinEgreso: s.permanenciaSinEgreso, promedioHoras: s.permanenciaPromedioHoras, menor12h: s.permanenciaMenor12h,
    de12a24h: s.permanencia12a24h, de24a48h: s.permanencia24a48h, de48a72h: s.permanencia48a72h, mayor72h: s.permanenciaMayor72h,
  },
  'URG-ACT-01': {
    activosProbables: s.activosProbables, antiguedadNoEvaluable: s.activosAntiguedadNoEvaluable,
    fechaIngresoFutura: s.activosFechaIngresoFutura, mayor24h: s.activosMayor24h,
    mayor48h: s.activosMayor48h, mayor72h: s.activosMayor72h,
  },
  'URG-TRI-03': {
    universoTotal: t.universoTotal, conTriage: t.eventosConTriage, evaluables: t.eventosEvaluablesTiempo,
    invertidos: t.secuenciasInvertidas, promedioMinutos: t.tiempoPromedioMinutos, mismoMinuto: t.mismoMinuto,
    de1a10: t.de1a10, de11a30: t.de11a30, de31a60: t.de31a60,
    de61a120: t.de61a120, de121a240: t.de121a240, mayor240: t.mayor240,
    mayorIgual24h: t.tiemposMayorIgual24h, mayorIgual7d: t.tiemposMayorIgual7d,
  },
};
const exact = Object.fromEntries(Object.keys(sqlProjection).map((id) => [id, JSON.stringify(sqlProjection[id]) === JSON.stringify(apiProjection[id])]));
const artifact = {
  schemaVersion: '1.0.0', generatedAt: new Date().toISOString(),
  context: { ...filters, corte, centro: null, codigoServicio: null, source: 'dbo.vUrgencias', apiBase, secretsIncluded: false, directIdentifiersIncluded: false },
  results: Object.fromEntries(Object.keys(sqlProjection).map((id) => [id, {
    sql: sqlProjection[id], api: apiProjection[id], sqlElapsedMs: sqlResults[id].elapsedMs,
    apiElapsedMs: id === 'URG-TRI-03' ? triageApi.elapsedMs : summaryApi.elapsedMs, exact: exact[id],
  }])),
  summary: { exactComparisons: Object.values(exact).filter(Boolean).length, totalComparisons: 3, allExact: Object.values(exact).every(Boolean) },
};
if (!artifact.summary.allExact) throw new Error(`Reconciliación no exacta: ${JSON.stringify(exact)}`);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ output, exact, values: apiProjection, timings: Object.fromEntries(Object.entries(artifact.results).map(([id, result]) => [id, { sqlMs: result.sqlElapsedMs, apiMs: result.apiElapsedMs }])) }, null, 2));
