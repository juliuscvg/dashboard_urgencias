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
const output = outputIndex >= 0 ? path.resolve(root, process.argv[outputIndex + 1]) : path.join(root, '.tmp', 'atencion-medica-validation.json');
const windows = [
  { id: '12m', desde: '2025-09-01', hastaExclusivo: '2026-09-01' },
  { id: '24m', desde: '2024-09-01', hastaExclusivo: '2026-09-01' },
  { id: '36m', desde: '2023-09-01', hastaExclusivo: '2026-09-01' },
];
const config = {
  server: process.env.DB_SERVER, database: process.env.DB_DATABASE, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT ?? 1433),
  options: {
    encrypt: ['true','1'].includes(String(process.env.DB_ENCRYPT).toLowerCase()),
    trustServerCertificate: !['false','0'].includes(String(process.env.DB_TRUST_SERVER_CERTIFICATE).toLowerCase()),
    enableArithAbort: true,
  },
  requestTimeout: 300000,
};
const template = fs.readFileSync(path.join(root, 'scripts/sql/08_validacion_atencion_medica.sql'), 'utf8');
const prior = JSON.parse(fs.readFileSync(path.join(root, 'docs/evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.json'), 'utf8'));
const pool = await new sql.ConnectionPool(config).connect();
const results = {};
let metadata;
try {
  metadata = (await pool.request().query(`SELECT COLUMN_NAME AS columna, DATA_TYPE AS tipo,
    CHARACTER_MAXIMUM_LENGTH AS longitud, IS_NULLABLE AS permite_null
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='vUrgencias' AND COLUMN_NAME='fechaate';`)).recordset[0];
  for (const window of windows) {
    const query = template.replace(
      'DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;',
      `DECLARE @Desde date = '${window.desde}', @HastaExclusivo date = '${window.hastaExclusivo}';`,
    );
    const started = performance.now();
    const response = await pool.request().query(query);
    const sets = response.recordsets;
    results[window.id] = {
      ...window, elapsedMs: Math.round(performance.now() - started),
      resumen: sets[0][0], centros: sets[1], servicios: sets[2], anios: sets[3],
      fechaateAFechamed: prior.resultados[window.id].pares.find((row) => row.par === 'fechaate→fechamed'),
    };
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify({
      schemaVersion: '1.0.0', generatedAt: new Date().toISOString(),
      context: { source: 'dbo.vUrgencias', supportDimensions: ['dbo.servicios','dbo.centros'], cutoff: '2026-09-01', periodSemantics: 'Fechaing >= desde AND Fechaing < hastaExclusivo', readOnly: true, secretsIncluded: false, directIdentifiersIncluded: false },
      metadata, windows: results,
      priorEvidence: { source: 'VALIDACION_AMED_SECUENCIA_2026-09-10.json', triageAFechaateInvertidos36m: prior.precision_y_tramos_36m.resumen.inv_tri_ate },
    }, null, 2) + '\n', 'utf8');
  }
} finally {
  await pool.close();
}
console.log(JSON.stringify({ output, metadata, windows: Object.fromEntries(Object.entries(results).map(([id,value]) => [id, { elapsedMs: value.elapsedMs, resumen: value.resumen, centros: value.centros.length, servicios: value.servicios.length, anios: value.anios.length }])) }, null, 2));
