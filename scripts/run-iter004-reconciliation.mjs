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
const output = outputIndex >= 0 ? path.resolve(root, process.argv[outputIndex + 1]) : path.join(root, '.tmp', 'iter004-reconciliation.json');
const apiIndex = process.argv.indexOf('--api');
const apiBase = apiIndex >= 0 ? process.argv[apiIndex + 1] : 'http://localhost:3002/api';
const filters = { desde: '2026-08-01', hasta: '2026-08-01' };
const queryString = new URLSearchParams(filters).toString();
const files = {
  resolution: 'URG-MOD-05_RESOLUCION.sql',
  frequentation: 'URG-MOD-09_FRECUENTACION.sql',
  triage: 'URG-TRI-02_CLASIFICACION.sql',
};
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
  for (const [key, file] of Object.entries(files)) {
    const request = pool.request()
      .input('Desde', sql.Date, filters.desde)
      .input('Hasta', sql.Date, filters.hasta)
      .input('Centro', sql.VarChar(20), null)
      .input('CodigoServicio', sql.Int, null);
    const started = performance.now();
    const result = await request.query(fs.readFileSync(path.join(root, 'scripts/sql/indicadores', file), 'utf8'));
    sqlResults[key] = { elapsedMs: Math.round(performance.now() - started), rows: result.recordset };
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
const apiResults = {
  resolution: await getApi('resolution'),
  frequentation: await getApi('frequentation'),
  triage: await getApi('triage'),
};

const numberOrNull = (value) => value === null || value === undefined ? null : Number(value);
const resolutionSql = sqlResults.resolution.rows.map((row) => ({
  destinoUrgPk: numberOrNull(row.destino_urg_pk), destino: row.destino_urgencias ?? null,
  eventos: Number(row.eventos), porcentaje: numberOrNull(row.porcentaje),
}));
const frequentationSql = sqlResults.frequentation.rows.map((row) => ({ banda: String(row.banda), pacientes: Number(row.pacientes) }));
const triageSql = sqlResults.triage.rows.map((row) => ({
  triageCodigo: numberOrNull(row.triage_codigo), triageDescripcion: row.triage_desc ?? null,
  eventos: Number(row.eventos), porcentajeSobreClasificados: numberOrNull(row.porcentaje_sobre_clasificados),
}));
const comparisons = {
  'URG-MOD-05': JSON.stringify(resolutionSql) === JSON.stringify(apiResults.resolution.data.categorias),
  'URG-MOD-09': JSON.stringify(frequentationSql) === JSON.stringify(apiResults.frequentation.data.bandas),
  'URG-TRI-02': JSON.stringify(triageSql) === JSON.stringify(apiResults.triage.data.clasificacion),
};
const artifact = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  context: { ...filters, centro: null, codigoServicio: null, source: 'dbo.vUrgencias', apiBase, secretsIncluded: false, directIdentifiersIncluded: false },
  results: {
    'URG-MOD-05': { sqlRows: resolutionSql, apiRows: apiResults.resolution.data.categorias, sqlElapsedMs: sqlResults.resolution.elapsedMs, apiElapsedMs: apiResults.resolution.elapsedMs, exact: comparisons['URG-MOD-05'] },
    'URG-MOD-09': { sqlRows: frequentationSql, apiRows: apiResults.frequentation.data.bandas, sqlElapsedMs: sqlResults.frequentation.elapsedMs, apiElapsedMs: apiResults.frequentation.elapsedMs, exact: comparisons['URG-MOD-09'] },
    'URG-TRI-02': { sqlRows: triageSql, apiRows: apiResults.triage.data.clasificacion, coberturaApi: apiResults.triage.data.resumen.coberturaPct, sqlElapsedMs: sqlResults.triage.elapsedMs, apiElapsedMs: apiResults.triage.elapsedMs, exact: comparisons['URG-TRI-02'] },
  },
  summary: { exactComparisons: Object.values(comparisons).filter(Boolean).length, totalComparisons: 3, allExact: Object.values(comparisons).every(Boolean) },
};
if (!artifact.summary.allExact) throw new Error(`Reconciliación no exacta: ${JSON.stringify(comparisons)}`);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ output, comparisons, rows: {
  resolution: resolutionSql.length, frequentation: frequentationSql.length, triage: triageSql.length,
}, timings: Object.fromEntries(Object.entries(artifact.results).map(([id, result]) => [id, { sqlMs: result.sqlElapsedMs, apiMs: result.apiElapsedMs }])) }, null, 2));
