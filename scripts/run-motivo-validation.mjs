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
const output = outputIndex >= 0 ? path.resolve(root, process.argv[outputIndex + 1]) : path.join(root, '.tmp', 'motivo-validation.json');
const windows = [
  { id: '12m', desde: '2025-09-01', hastaExclusivo: '2026-09-01' },
  { id: '24m', desde: '2024-09-01', hastaExclusivo: '2026-09-01' },
  { id: '36m', desde: '2023-09-01', hastaExclusivo: '2026-09-01' }
];
const template = fs.readFileSync(path.join(root, 'scripts/sql/07_validacion_motivo_urgencia.sql'), 'utf8');
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT ?? 1433),
  options: {
    encrypt: ['true', '1'].includes(String(process.env.DB_ENCRYPT).toLowerCase()),
    trustServerCertificate: !['false', '0'].includes(String(process.env.DB_TRUST_SERVER_CERTIFICATE).toLowerCase()),
    enableArithAbort: true
  },
  requestTimeout: 300000
};
const artifact = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  context: {
    cutoff: '2026-09-01',
    periodSemantics: 'Fechaing >= desde AND Fechaing < hastaExclusivo',
    universe: 'U-ING, un evento por id_urgencia',
    source: 'dbo.vUrgencias',
    freeTextValuesIncluded: false,
    secretsIncluded: false,
    directIdentifiersIncluded: false
  },
  columnTypes: [],
  windows: {}
};
const pool = await new sql.ConnectionPool(config).connect();
try {
  const types = await pool.request().query(`
    SELECT c.name AS campo, t.name AS tipo, c.max_length, c.is_nullable
    FROM sys.views v
    JOIN sys.schemas s ON s.schema_id = v.schema_id
    JOIN sys.columns c ON c.object_id = v.object_id
    JOIN sys.types t ON t.user_type_id = c.user_type_id
    WHERE s.name = N'dbo' AND v.name = N'vUrgencias'
      AND c.name IN (N'motivo_urgencia', N'motivo_urg_libre')
    ORDER BY c.name;`);
  artifact.columnTypes = types.recordset;
  for (const window of windows) {
    const declaration = `DECLARE @Desde date = '${window.desde}', @HastaExclusivo date = '${window.hastaExclusivo}';`;
    const query = template.replace('DECLARE @Desde date = NULL, @HastaExclusivo date = NULL;', declaration);
    const start = performance.now();
    const result = await pool.request().query(query);
    artifact.windows[window.id] = {
      ...window,
      elapsedMs: Math.round(performance.now() - start),
      recordsets: result.recordsets
    };
  }
} finally {
  await pool.close();
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  output,
  metadata: artifact.columnTypes,
  windows: Object.fromEntries(Object.entries(artifact.windows).map(([id, value]) => [
    id,
    { elapsedMs: value.elapsedMs, recordsets: value.recordsets.map((set) => set.length) }
  ]))
}, null, 2));
