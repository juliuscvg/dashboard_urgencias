import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'config/dashboard-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const errors = [];

function checkPath(value) {
  if (Array.isArray(value)) return value.forEach(checkPath);
  if (typeof value !== 'string') return;
  if (!fs.existsSync(path.join(root, value))) errors.push('Ruta de manifiesto inexistente: ' + value);
}
Object.values(manifest.paths).forEach(checkPath);

const sqlDirectory = path.join(root, manifest.paths.verifiableSql);
const sqlFiles = fs.readdirSync(sqlDirectory).filter((name) => name.endsWith('.sql'));
const expectedSql = [
  'URG-EJ-01_ATENCIONES.sql','URG-EJ-02_PROMEDIO_DIARIO.sql','URG-EJ-03_PERMANENCIA_REGISTRADA.sql',
  'URG-EJ-04_HOSPITALIZACION.sql','URG-EJ-05_REINGRESOS.sql','URG-EJ-06_PACIENTES_UNICOS.sql',
  'URG-EJ-07_ATENCIONES_POR_PACIENTE.sql','URG-ACT-01_ACTIVOS_PROBABLES.sql','URG-MOD-01_DEMANDA.sql',
  'URG-MOD-05_RESOLUCION.sql','URG-MOD-09_FRECUENTACION.sql','URG-TRI-01_COBERTURA.sql',
  'URG-TRI-02_CLASIFICACION.sql','URG-TRI-03_TIEMPO_REGISTRADO.sql',
];
for (const expected of expectedSql) if (!sqlFiles.includes(expected)) errors.push('SQL faltante: ' + expected);

const writePattern = /\b(INSERT|UPDATE|DELETE|MERGE|TRUNCATE|DROP|ALTER|CREATE)\b/i;
const incompatiblePattern = /\b(OFFSET|FETCH\s+NEXT|IIF|FORMAT)\b/i;
const centerHardcodePattern = /\b(FAA|JIM|HCO)\b/i;
for (const name of sqlFiles) {
  const body = fs.readFileSync(path.join(sqlDirectory, name), 'utf8');
  if (writePattern.test(body)) errors.push(name + ': contiene escritura/DDL');
  if (incompatiblePattern.test(body)) errors.push(name + ': contiene sintaxis excluida para compatibilidad 100');
  if (centerHardcodePattern.test(body)) errors.push(name + ': contiene centro hardcodeado');
  for (const required of ['S.codigo_area = 2', 'S.serv_activo_sn = 1', 'GROUP BY id_urgencia']) {
    if (!body.includes(required)) errors.push(name + ': falta ' + required);
  }
  if (name !== 'URG-ACT-01_ACTIVOS_PROBABLES.sql' && !body.includes('DATEADD(DAY, 1, @Hasta)')) {
    errors.push(name + ': falta periodo semiabierto');
  }
}
const clientFiles = fs.readdirSync(path.join(root, 'client/src')).filter((name) => /\.(ts|tsx)$/.test(name));
const clientBody = clientFiles.map((name) => fs.readFileSync(path.join(root, 'client/src', name), 'utf8')).join('\n');
for (const forbidden of ['destino_urg_pk', 'codigo_area', 'serv_activo_sn', 'DATEADD(', 'codigo_cliente']) {
  if (clientBody.includes(forbidden)) errors.push('Regla física duplicada en frontend: ' + forbidden);
}
const operativeCheckpoints = fs.readdirSync(path.join(root, 'docs/gobierno')).filter((name) => /^CHECKPOINT.*\.md$/i.test(name));
if (operativeCheckpoints.length !== 1 || operativeCheckpoints[0] !== 'CHECKPOINT_ACTUAL.md') {
  errors.push('Checkpoint operativo no único: ' + operativeCheckpoints.join(', '));
}
const contracts = fs.readFileSync(path.join(root, 'docs/indicadores/CONTRATOS_ACEPTADOS.md'), 'utf8');
for (const expected of expectedSql) if (!contracts.includes(expected)) errors.push('Contrato sin asociación SQL: ' + expected);
if (errors.length) {
  console.error(JSON.stringify({ sqlFiles: sqlFiles.length, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  manifest: manifest.schemaVersion,
  sqlFiles: sqlFiles.length,
  readOnly: true,
  compatibility100: true,
  centerServiceHardcodes: 0,
  frontendRuleDuplicates: 0,
  operativeCheckpoints: operativeCheckpoints.length,
  errors: [],
}, null, 2));
