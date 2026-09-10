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
const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : path.join(root, '.tmp', 'amed-validation.json');
const windows = [
  { id: '12m', desde: '2025-09-01', hastaExclusivo: '2026-09-01' },
  { id: '24m', desde: '2024-09-01', hastaExclusivo: '2026-09-01' },
  { id: '36m', desde: '2023-09-01', hastaExclusivo: '2026-09-01' },
];
const config = {
  server: process.env.DB_SERVER, database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT ?? 1433), options: { encrypt: ['true', '1'].includes(String(process.env.DB_ENCRYPT).toLowerCase()), trustServerCertificate: !['false', '0'].includes(String(process.env.DB_TRUST_SERVER_CERTIFICATE).toLowerCase()), enableArithAbort: true },
  requestTimeout: 300_000,
};
const template = fs.readFileSync(path.join(root, 'scripts/sql/03_validacion_amed_secuencia.sql'), 'utf8');
const supplementalTemplate = fs.readFileSync(path.join(root, 'scripts/sql/04_validacion_amed_precision.sql'), 'utf8');
const pool = await new sql.ConnectionPool(config).connect();
const types = await pool.request().query(`SELECT COLUMN_NAME AS columna, DATA_TYPE AS tipo, IS_NULLABLE AS permite_null
  FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='vUrgencias'
  AND COLUMN_NAME IN ('Fechaing','fechatri','fechaate','fechamed','altamed_fecha','fechaegr') ORDER BY COLUMN_NAME;`);
const results = {};
try {
  for (const window of windows) {
    const query = template.replace('DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;', `DECLARE @Desde date = '${window.desde}', @HastaExclusivo date = '${window.hastaExclusivo}';`);
    const start = performance.now();
    const result = await pool.request().query(query);
    results[window.id] = { ...window, elapsedMs: Math.round(performance.now() - start), recordsets: result.recordsets };
  }
  const supplementalWindow = windows.at(-1);
  const supplementalQuery = supplementalTemplate.replace('DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;', `DECLARE @Desde date = '${supplementalWindow.desde}', @HastaExclusivo date = '${supplementalWindow.hastaExclusivo}';`);
  const supplementalStart = performance.now();
  const supplementalResult = await pool.request().query(supplementalQuery);
  results.supplemental = { window: supplementalWindow.id, elapsedMs: Math.round(performance.now() - supplementalStart), recordsets: supplementalResult.recordsets };
} finally { await pool.close(); }
const artifact = { schemaVersion: '1.0.0', generatedAt: new Date().toISOString(), context: { cutoff: '2026-09-01', periodSemantics: 'Fechaing >= desde AND Fechaing < hastaExclusivo', gitHead: process.argv.includes('--head') ? process.argv[process.argv.indexOf('--head') + 1] : null, secretsIncluded: false }, columnTypes: types.recordset, windows: results };
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ output, types: types.recordset.length, windows: Object.fromEntries(Object.entries(results).map(([id, value]) => [id, { elapsedMs: value.elapsedMs, recordsets: value.recordsets.map((set) => set.length) }])) }, null, 2));
