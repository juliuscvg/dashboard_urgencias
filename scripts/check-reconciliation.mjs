import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/evidencia/RECONCILIACION_14_SQL_2026-09-09.json'), 'utf8'));
const contracts = fs.readFileSync(path.join(root, 'docs/indicadores/CONTRATOS_ACEPTADOS.md'), 'utf8');
const scope = fs.readFileSync(path.join(root, 'server/src/repository/event-scope.sql.ts'), 'utf8');
const repository = fs.readFileSync(path.join(root, 'server/src/repository/urgencias.repository.ts'), 'utf8');
const routes = fs.readFileSync(path.join(root, 'server/src/http/routes.ts'), 'utf8');
const service = fs.readFileSync(path.join(root, 'server/src/service/urgencias.service.ts'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'client/src/App.tsx'), 'utf8');
const errors = [];
const expected = ['URG-ACT-01','URG-EJ-01','URG-EJ-02','URG-EJ-03','URG-EJ-04','URG-EJ-05','URG-EJ-06','URG-EJ-07','URG-MOD-01','URG-MOD-05','URG-MOD-09','URG-TRI-01','URG-TRI-02','URG-TRI-03'];
if (evidence.indicadores.length !== 14 || new Set(evidence.indicadores.map(x => x.id)).size !== 14) errors.push('Inventario no contiene 14 IDs únicos');
for (const id of expected) if (!evidence.indicadores.some(x => x.id === id)) errors.push('Falta ' + id);
for (const item of evidence.indicadores) {
  if (!fs.existsSync(path.join(root, 'scripts/sql/indicadores', item.archivo))) errors.push('SQL inexistente: ' + item.archivo);
  if (!contracts.includes(item.id) || !contracts.includes(item.archivo)) errors.push('Contrato sin vínculo: ' + item.id);
  if (item.estado_reconciliacion === 'RECONCILIADO CON FUENTE') errors.push('Promoción sin fuente: ' + item.id);
  if (item.resultado_sql !== 'NO EJECUTADO' || item.diferencia_numerica !== null) errors.push('Resultado DB fabricado: ' + item.id);
}
for (const token of ['GROUP BY id_urgencia','S.codigo_area = 2','S.serv_activo_sn = 1','@Centro IS NULL','@CodigoServicio IS NULL']) if (!scope.includes(token)) errors.push('EventScope sin ' + token);
for (const endpoint of ['/health/db','/urgencias/summary','/urgencias/demand','/urgencias/triage','/urgencias/episodes']) if (!routes.includes(endpoint)) errors.push('Ruta ausente: ' + endpoint);
for (const token of ['fetchSummaryBase','fetchReadmissions','fetchCurrent','fetchDemand','fetchTriage','fetchEpisodes']) if (!repository.includes(token)) errors.push('Repository ausente: ' + token);
for (const token of ['getSummary','getDemand','getTriage','getEpisodes']) if (!service.includes(token)) errors.push('Service ausente: ' + token);
for (const token of ['triage.error','catalogs.error','Detalle de eventos']) if (!ui.includes(token)) errors.push('Corrección UI ausente: ' + token);
if (!repository.includes('decimal(9, 4)) AS hospitalizacionPct')) errors.push('Precisión Hospitalización no alineada');
console.log(JSON.stringify({ indicadores: evidence.indicadores.length, reconciliadosConFuente: 0, resumen: evidence.resumen, errors }, null, 2));
if (errors.length) process.exitCode = 1;
