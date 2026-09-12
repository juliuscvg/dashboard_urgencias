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
const output = outputIndex >= 0 ? path.resolve(root, process.argv[outputIndex + 1]) : path.join(root, '.tmp', 'iter009-reconciliation.json');
const apiIndex = process.argv.indexOf('--api');
const apiBase = apiIndex >= 0 ? process.argv[apiIndex + 1] : 'http://localhost:3002/api';
const filters = { desde: '2026-08-01', hasta: '2026-08-01' };
const queryString = new URLSearchParams(filters).toString();
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
let sqlElapsedMs;
let sqlResumen;
let sqlServicios;
try {
  const request = pool.request()
    .input('Desde', sql.Date, filters.desde).input('Hasta', sql.Date, filters.hasta)
    .input('Centro', sql.VarChar(20), null).input('CodigoServicio', sql.Int, null);
  const started = performance.now();
  const result = await request.query(fs.readFileSync(path.join(root, 'scripts/sql/indicadores/URG-ATE-01_ATENCION_MEDICA.sql'), 'utf8'));
  sqlElapsedMs = Math.round(performance.now() - started);
  sqlResumen = result.recordsets[0][0];
  sqlServicios = result.recordsets[1];
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
const attentionApi = await getApi('attention');

const n = (value) => value === null || value === undefined ? null : Number(value);
const sqlProjection = {
  resumen: {
    universoTotal: n(sqlResumen.universo_total), eventosConAtencion: n(sqlResumen.eventos_con_atencion),
    eventosSinAtencion: n(sqlResumen.eventos_sin_atencion), coberturaPct: n(sqlResumen.cobertura_pct),
    evaluables: n(sqlResumen.evaluables), invertidos: n(sqlResumen.invertidos),
    promedioMinutos: n(sqlResumen.promedio_minutos), mismoMinuto: n(sqlResumen.mismo_minuto),
    de0a30: n(sqlResumen.de_0_a_30), de31a60: n(sqlResumen.de_31_a_60),
    de61a120: n(sqlResumen.de_61_a_120), de121a240: n(sqlResumen.de_121_a_240), mayor240: n(sqlResumen.mayor_240),
    mayorIgual24h: n(sqlResumen.mayor_igual_24h), mayorIgual7d: n(sqlResumen.mayor_igual_7d),
  },
  servicios: sqlServicios.map((row) => ({
    centro: row.centro, codigoServicio: n(row.codigo_servicio), servicio: row.servicio,
    universoTotal: n(row.universo_total), eventosConAtencion: n(row.eventos_con_atencion), coberturaPct: n(row.cobertura_pct),
  })),
};
const apiProjection = {
  resumen: attentionApi.data.resumen,
  servicios: attentionApi.data.servicios,
};
const exactResumen = JSON.stringify(sqlProjection.resumen) === JSON.stringify(apiProjection.resumen);
const exactServicios = JSON.stringify(sqlProjection.servicios) === JSON.stringify(apiProjection.servicios);
const allExact = exactResumen && exactServicios;

const artifact = {
  schemaVersion: '1.0.0', generatedAt: new Date().toISOString(),
  context: { ...filters, centro: null, codigoServicio: null, source: 'dbo.vUrgencias', apiBase, secretsIncluded: false, directIdentifiersIncluded: false },
  results: {
    'URG-ATE-01': {
      sql: sqlProjection, api: apiProjection,
      sqlElapsedMs, apiElapsedMs: attentionApi.elapsedMs,
      exactResumen, exactServicios, exact: allExact,
    },
  },
  summary: { allExact },
};
if (!artifact.summary.allExact) throw new Error(`Reconciliación no exacta: resumen=${exactResumen} servicios=${exactServicios}`);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ output, exact: allExact, resumen: apiProjection.resumen, sqlMs: sqlElapsedMs, apiMs: attentionApi.elapsedMs }, null, 2));
