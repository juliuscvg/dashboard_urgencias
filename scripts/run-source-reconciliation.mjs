import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import sql from 'mssql';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env') });
const required = ['DB_SERVER', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD'];
if (required.some((name) => !process.env[name])) throw new Error('Configuración DB incompleta');

const arg = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
};
const desde = arg('desde', '2026-08-01');
const hasta = arg('hasta', desde);
const corte = arg('corte', new Date().toISOString());
const apiBase = arg('api', 'http://127.0.0.1:3002/api');
const output = arg('output', path.join(root, '.tmp', 'source-reconciliation.json'));
const centro = arg('centro', null);
const codigoServicioRaw = arg('codigo-servicio', null);
const codigoServicio = codigoServicioRaw === null ? null : Number(codigoServicioRaw);

const pool = await new sql.ConnectionPool({
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT ?? 1433),
  options: {
    encrypt: ['true', '1'].includes(String(process.env.DB_ENCRYPT).toLowerCase()),
    trustServerCertificate: !['false', '0'].includes(String(process.env.DB_TRUST_SERVER_CERTIFICATE).toLowerCase()),
    enableArithAbort: true,
  },
  pool: { max: 2, min: 0, idleTimeoutMillis: 30_000 },
  requestTimeout: 300_000,
}).connect();

const sqlDir = path.join(root, 'scripts', 'sql', 'indicadores');
const files = fs.readdirSync(sqlDir).filter((name) => name.endsWith('.sql')).sort();
const sqlResults = {};
try {
  for (const file of files) {
    const id = file.match(/^URG-(?:ACT|EJ|MOD|TRI)-\d{2}/)?.[0];
    const request = pool.request()
      .input('Desde', sql.Date, new Date(`${desde}T00:00:00Z`))
      .input('Hasta', sql.Date, new Date(`${hasta}T00:00:00Z`))
      .input('Centro', sql.VarChar(20), centro)
      .input('CodigoServicio', sql.Int, codigoServicio)
      .input('Corte', sql.DateTime, new Date(corte));
    const started = performance.now();
    try {
      const result = await request.query(fs.readFileSync(path.join(sqlDir, file), 'utf8'));
      sqlResults[id] = { file, status: 'OK', elapsedMs: Math.round(performance.now() - started), rows: result.recordset };
    } catch (error) {
      sqlResults[id] = { file, status: 'ERROR', elapsedMs: Math.round(performance.now() - started), errorType: error?.constructor?.name ?? 'Error', errorCode: error?.code ?? null, errorNumber: error?.number ?? null, errorLine: error?.lineNumber ?? null, errorMessage: String(error?.message ?? 'Error').replace(/(server|database|user|password)\s*[=:]\s*[^\s,;]+/gi, '$1=[REDACTED]') };
    }
  }
} finally {
  await pool.close();
}

const query = new URLSearchParams({ desde, hasta });
if (centro) query.set('centro', centro);
if (codigoServicio !== null) query.set('codigoServicio', String(codigoServicio));
const get = async (route) => {
  const started = performance.now();
  try {
    const response = await fetch(`${apiBase}${route}${route.includes('?') ? '&' : '?'}${query}`, { signal: AbortSignal.timeout(300_000) });
    const json = await response.json();
    return { status: response.ok ? 'OK' : 'ERROR', httpStatus: response.status, elapsedMs: Math.round(performance.now() - started), data: json.data ?? null };
  } catch (error) {
    return { status: 'ERROR', httpStatus: null, elapsedMs: Math.round(performance.now() - started), errorType: error?.constructor?.name ?? 'Error' };
  }
};
const [summary, demand, triage, episodes] = await Promise.all([
  get('/urgencias/summary'), get('/urgencias/demand'), get('/urgencias/triage'), get('/urgencias/episodes?page=1&pageSize=100'),
]);

const allEpisodeRows = [...(episodes.data?.rows ?? [])];
const episodePages = Math.ceil(Number(episodes.data?.total ?? 0) / 100);
for (let page = 2; page <= episodePages; page += 1) {
  const next = await get(`/urgencias/episodes?page=${page}&pageSize=100`);
  if (next.status !== 'OK') throw new Error(`Falló página de detalle ${page}`);
  allEpisodeRows.push(...(next.data?.rows ?? []));
}
const detailDestinations = Object.entries(allEpisodeRows.reduce((acc, row) => {
  const key = row.destino ?? '<NULL>';
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {})).sort(([a], [b]) => a.localeCompare(b));
const sqlDestinations = (sqlResults['URG-MOD-05']?.rows ?? [])
  .map((row) => [row.destino_urgencias ?? '<NULL>', Number(row.eventos)])
  .sort(([a], [b]) => String(a).localeCompare(String(b)));
const permanence = allEpisodeRows.reduce((acc, row) => {
  if (!row.fechaEgreso) { acc.sinEgreso += 1; return acc; }
  const minutes = (new Date(row.fechaEgreso).getTime() - new Date(row.fechaIngreso).getTime()) / 60000;
  if (minutes < 0) { acc.invertidos += 1; return acc; }
  acc.evaluables += 1;
  if (minutes < 720) acc.menor12h += 1;
  else if (minutes < 1440) acc.de12a24h += 1;
  else if (minutes < 2880) acc.de24a48h += 1;
  else if (minutes <= 4320) acc.de48a72h += 1;
  else acc.mayor72h += 1;
  return acc;
}, { evaluables: 0, invertidos: 0, sinEgreso: 0, menor12h: 0, de12a24h: 0, de24a48h: 0, de48a72h: 0, mayor72h: 0 });
const uniqueEpisodeIds = new Set(allEpisodeRows.map((row) => row.idUrgencia)).size;
const deterministicOrder = allEpisodeRows.every((row, index) => {
  if (index === 0) return true;
  const previous = allEpisodeRows[index - 1];
  const priorDate = String(previous.fechaIngreso ?? '');
  const date = String(row.fechaIngreso ?? '');
  return priorDate > date || (priorDate === date && Number(previous.idUrgencia) > Number(row.idUrgencia));
});
const detailAudit = {
  totalReported: Number(episodes.data?.total ?? 0), pagesFetched: episodePages, rowsFetched: allEpisodeRows.length,
  uniqueIds: uniqueEpisodeIds, duplicateIds: allEpisodeRows.length - uniqueEpisodeIds, deterministicOrder,
  destinations: detailDestinations.map(([categoria, eventos]) => ({ categoria, eventos })), permanence,
};
if (episodes.data) episodes.data = { total: episodes.data.total, page: episodes.data.page, pageSize: episodes.data.pageSize, rowsReturnedFirstPage: episodes.data.rows?.length ?? 0 };

const first = (id) => sqlResults[id]?.rows?.[0] ?? {};
const number = (value) => value === null || value === undefined ? null : Number(value);
const equalNumber = (left, right) => number(left) === number(right);
const comparisons = {
  'URG-EJ-01': { atenciones: equalNumber(first('URG-EJ-01').atenciones, summary.data?.atenciones), detalleTotal: equalNumber(first('URG-EJ-01').atenciones, episodes.data?.total) },
  'URG-EJ-02': {
    diasCompletos: equalNumber(first('URG-EJ-02').dias_completos, summary.data?.diasCompletos),
    atencionesDiasCompletos: equalNumber(first('URG-EJ-02').atenciones_dias_completos, summary.data?.atencionesDiasCompletos),
    promedioDiario: equalNumber(first('URG-EJ-02').promedio_diario, summary.data?.promedioDiario),
    periodoParcial: Boolean(first('URG-EJ-02').periodo_parcial) === Boolean(summary.data?.periodoParcial),
  },
  'URG-EJ-03': { evaluables: equalNumber(first('URG-EJ-03').evaluables, summary.data?.eventosCompletados), promedioHoras: equalNumber(first('URG-EJ-03').promedio_horas, summary.data?.permanenciaPromedioHoras) },
  'URG-EJ-04': { completados: equalNumber(first('URG-EJ-04').eventos_completados, summary.data?.eventosCompletados), hospitalizaciones: equalNumber(first('URG-EJ-04').hospitalizaciones, summary.data?.hospitalizaciones), porcentaje: equalNumber(first('URG-EJ-04').porcentaje_hospitalizacion, summary.data?.hospitalizacionPct) },
  'URG-EJ-05': { evaluables: equalNumber(first('URG-EJ-05').evaluables, summary.data?.eventosEvaluablesReingreso), menor48: equalNumber(first('URG-EJ-05').reingresos_menor_48h, summary.data?.reingresosMenor48), menor72: equalNumber(first('URG-EJ-05').reingresos_menor_72h, summary.data?.reingresosMenor72) },
  'URG-EJ-06': { pacientes: equalNumber(first('URG-EJ-06').pacientes_unicos, summary.data?.pacientesUnicos) },
  'URG-EJ-07': { atenciones: equalNumber(first('URG-EJ-07').atenciones, summary.data?.atenciones), pacientes: equalNumber(first('URG-EJ-07').pacientes_unicos, summary.data?.pacientesUnicos), razon: equalNumber(first('URG-EJ-07').atenciones_por_paciente, summary.data?.atencionesPorPaciente) },
  'URG-ACT-01': { activos: equalNumber(first('URG-ACT-01').activos_probables, summary.data?.activosProbables) },
  'URG-MOD-01': { total: equalNumber((sqlResults['URG-MOD-01']?.rows ?? []).reduce((sum, row) => sum + number(row.atenciones), 0), (demand.data?.tendencia ?? []).reduce((sum, row) => sum + number(row.atenciones), 0)) },
  'URG-TRI-01': { universo: equalNumber((sqlResults['URG-TRI-01']?.rows ?? []).reduce((sum, row) => sum + number(row.universo_total), 0), triage.data?.resumen?.universoTotal), conTriage: equalNumber((sqlResults['URG-TRI-01']?.rows ?? []).reduce((sum, row) => sum + number(row.con_triage), 0), triage.data?.resumen?.eventosConTriage) },
  'URG-TRI-03': { universo: equalNumber(first('URG-TRI-03').universo_total, triage.data?.resumen?.universoTotal), conTriage: equalNumber(first('URG-TRI-03').con_triage, triage.data?.resumen?.eventosConTriage), evaluables: equalNumber(first('URG-TRI-03').evaluables, triage.data?.resumen?.eventosEvaluablesTiempo), promedio: equalNumber(first('URG-TRI-03').promedio_minutos, triage.data?.resumen?.tiempoPromedioMinutos), invertidos: equalNumber(first('URG-TRI-03').invertidos, triage.data?.resumen?.secuenciasInvertidas), mayor24h: equalNumber(first('URG-TRI-03').mayor_igual_24h, triage.data?.resumen?.tiemposMayorIgual24h), mayor7d: equalNumber(first('URG-TRI-03').mayor_igual_7d, triage.data?.resumen?.tiemposMayorIgual7d) },
};
Object.assign(comparisons['URG-EJ-03'], {
  detalleEvaluables: permanence.evaluables === Number(first('URG-EJ-03').evaluables),
  detalleInvertidos: permanence.invertidos === Number(first('URG-EJ-03').invertidos),
  detalleSinEgreso: permanence.sinEgreso === Number(first('URG-EJ-03').sin_egreso),
  detalleBandas: permanence.menor12h === Number(first('URG-EJ-03').menor_12h)
    && permanence.de12a24h === Number(first('URG-EJ-03').de_12_a_24h)
    && permanence.de24a48h === Number(first('URG-EJ-03').de_24_a_48h)
    && permanence.de48a72h === Number(first('URG-EJ-03').de_48_a_72h)
    && permanence.mayor72h === Number(first('URG-EJ-03').mayor_72h),
});
comparisons['URG-MOD-05'] = { detalleDistribucion: JSON.stringify(detailDestinations) === JSON.stringify(sqlDestinations) };
for (const [id, checks] of Object.entries(comparisons)) comparisons[id].allExact = Object.values(checks).every(Boolean);

const artifact = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  context: { desde, hasta, finExclusivo: new Date(new Date(`${hasta}T00:00:00Z`).getTime() + 86_400_000).toISOString(), centro, codigoServicio, corte, timezone: 'marca de tiempo SQL serializada por mssql; evidencia JSON en UTC', apiBase: new URL(apiBase).origin, gitHead: arg('head', null) },
  security: { secretsIncluded: false },
  sql: sqlResults,
  api: { summary, demand, triage, episodes },
  detailAudit,
  comparisons,
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
const sqlOk = Object.values(sqlResults).filter((item) => item.status === 'OK').length;
const exact = Object.values(comparisons).filter((item) => item.allExact).length;
console.log(JSON.stringify({ output, sqlOk, sqlTotal: files.length, api: { summary: summary.status, demand: demand.status, triage: triage.status, episodes: episodes.status }, exactRuntimeComparisons: exact, runtimeComparisons: Object.keys(comparisons).length }, null, 2));
