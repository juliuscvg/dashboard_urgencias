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
  'URG-ATE-01_ATENCION_MEDICA.sql',
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

// --- Paquete portable (HCG-POR-001..008) ---------------------------------
// Detecta rutas rotas, referencias obsoletas y componentes esenciales ausentes
// sin necesitar base de datos. No valida cifras: eso exige acceso a la fuente.

// Handoff mínimo: debe existir y responder las siete preguntas exigidas.
const handoffPath = manifest.portability?.handoff;
if (!handoffPath) errors.push('Manifiesto sin handoff declarado');
else if (!fs.existsSync(path.join(root, handoffPath))) errors.push('Handoff inexistente: ' + handoffPath);
else {
  const handoff = fs.readFileSync(path.join(root, handoffPath), 'utf8');
  const questions = [
    'Qué archivos leer', 'En qué orden', 'Qué documentos son autoridad',
    'Qué reglas son transversales', 'Qué reglas son locales y NO deben transferirse',
    'Cómo continuar una nueva iteración', 'Cómo validar que una reconstrucción es semánticamente equivalente',
  ];
  for (const question of questions) {
    if (!handoff.toLowerCase().includes(question.toLowerCase())) errors.push('Handoff sin la pregunta: ' + question);
  }
  if (!manifest.portability.criterion?.includes('sin depender de memoria de chat')) {
    errors.push('Manifiesto sin el criterio de portabilidad vigente');
  }
}

// Referencia a dashboard_hcg_specs: vigente y con forma de commit completo.
const specsCommit = manifest.hcgSpecs?.commit ?? '';
if (!/^[0-9a-f]{40}$/.test(specsCommit)) errors.push('Referencia a dashboard_hcg_specs sin commit completo: ' + specsCommit);

// Componentes esenciales del paquete portable.
for (const component of manifest.ui?.essentialComponents ?? []) {
  if (!fs.existsSync(path.join(root, component))) errors.push('Componente esencial ausente: ' + component);
}
if (!manifest.ui?.architecture || !fs.existsSync(path.join(root, manifest.ui.architecture))) {
  errors.push('Arquitectura UI no declarada o inexistente');
}

// Las perspectivas declaradas deben existir en el código y en su documento.
// Un manifiesto mal formado se reporta como error, no revienta el verificador.
const viewModulePath = path.join(root, 'client/src/dashboardView.ts');
const viewModule = fs.existsSync(viewModulePath) ? fs.readFileSync(viewModulePath, 'utf8') : '';
if (!viewModule) errors.push('Componente esencial ausente: client/src/dashboardView.ts');
const uiArchitecturePath = manifest.ui?.architecture ? path.join(root, manifest.ui.architecture) : null;
const uiArchitecture = uiArchitecturePath && fs.existsSync(uiArchitecturePath) ? fs.readFileSync(uiArchitecturePath, 'utf8') : '';
const perspectives = manifest.ui?.perspectives ?? [];
if (perspectives.length !== 3) errors.push('Se esperaban tres perspectivas declaradas, hay ' + perspectives.length);
for (const perspective of perspectives) {
  if (!viewModule.includes(`'${perspective.id}'`)) errors.push('Perspectiva no implementada: ' + perspective.id);
  if (!uiArchitecture.includes(perspective.label)) errors.push('Perspectiva no documentada: ' + perspective.label);
}

// Todo indicador ubicado en una perspectiva debe existir en el estado vigente,
// y ninguno declarado como no implementado puede presentarse como implementado.
const indicatorStatesPath = path.join(root, manifest.paths.indicatorStates ?? '');
const indicatorStates = manifest.paths.indicatorStates && fs.existsSync(indicatorStatesPath) ? fs.readFileSync(indicatorStatesPath, 'utf8') : '';
for (const perspective of perspectives) {
  for (const indicator of perspective.indicators ?? []) {
    if (!indicatorStates.includes(indicator)) errors.push('Indicador sin estado vigente: ' + indicator);
  }
  for (const pending of perspective.declaredNotImplemented ?? []) {
    if (!indicatorStates.includes(pending)) errors.push('Pendiente declarado sin estado vigente: ' + pending);
  }
}

// Los recortes de detalle viven sólo en el servidor y paginan del lado servidor.
const scopeDefinition = manifest.ui?.detailScopes?.definition;
const scopePath = scopeDefinition ? path.join(root, scopeDefinition) : null;
const scopeModule = scopePath && fs.existsSync(scopePath) ? fs.readFileSync(scopePath, 'utf8') : '';
if (!scopeModule) errors.push('Definición de recortes de detalle ausente');
for (const required of ['DETAIL_SCOPES', 'detailScopeWhere']) {
  if (scopeModule && !scopeModule.includes(required)) errors.push('Definición de recortes incompleta: falta ' + required);
}
if (manifest.ui?.detailScopes?.preloaded !== false) errors.push('El detalle no puede declararse precargado');
const drawerPath = path.join(root, 'client/src/DetailDrawer.tsx');
const drawer = fs.existsSync(drawerPath) ? fs.readFileSync(drawerPath, 'utf8') : '';
if (!drawer.includes('hasReconciliationMismatch')) errors.push('El detalle no reconcilia contra el agregado');
if (!/pageSize/.test(drawer)) errors.push('El detalle no pagina del lado servidor');
if (errors.length) {
  console.error(JSON.stringify({ sqlFiles: sqlFiles.length, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  manifest: manifest.schemaVersion,
  handoff: manifest.portability?.handoff,
  hcgSpecsCommit: specsCommit.slice(0, 7),
  perspectives: perspectives.length,
  essentialComponents: (manifest.ui?.essentialComponents ?? []).length,
  sqlFiles: sqlFiles.length,
  readOnly: true,
  compatibility100: true,
  centerServiceHardcodes: 0,
  frontendRuleDuplicates: 0,
  operativeCheckpoints: operativeCheckpoints.length,
  errors: [],
}, null, 2));
