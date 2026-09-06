import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const adoption = JSON.parse(readFileSync(resolve(root, 'config/adopcion-hcg.json'), 'utf8'));
const config = JSON.parse(readFileSync(resolve(root, 'config/baseline.json'), 'utf8'));
const expected = { ANA: 11, TEM: 7, CAL: 8, UX: 15, FIL: 6, DET: 9, VAL: 9, TRZ: 6 };
const ids = Object.entries(expected).flatMap(([group, count]) => Array.from({ length: count }, (_, i) => `HCG-${group}-${String(i + 1).padStart(3, '0')}`));
const errors = [];
if (adoption.principios.length !== 71 || new Set(adoption.principios.map(p => p.id)).size !== 71) errors.push('Cardinalidad incorrecta');
for (const id of ids) if (!adoption.principios.some(p => p.id === id)) errors.push(`Falta ${id}`);
const counts = { ADOPTADO: 0, ADAPTADO: 0, NO_APLICA: 0, PENDIENTE: 0 };
const matrix = readFileSync(resolve(root, 'docs/gobierno/ADOPCION_HCG.md'), 'utf8');
for (const p of adoption.principios) {
  if (!(p.estado in counts)) errors.push(`Estado inválido: ${p.id}`); else counts[p.estado]++;
  if (!p.motivo || !p.principio || !p.fuente.includes(config.specs_commit)) errors.push(`Procedencia incompleta: ${p.id}`);
  if (!matrix.includes(`| ${p.id} | ${p.principio} | ${p.estado_origen} | ${p.estado} | ${p.motivo} |`)) errors.push(`Matriz difiere: ${p.id}`);
}
for (const state in counts) if (counts[state] !== adoption.totales[state]) errors.push(`Total difiere: ${state}`);
if (config.specs_commit !== '3c6ed9cf08aca4821138f8499255423a874898fa' || config.cex_commit !== '0ea66780893ef62ff328c92806a888e693d1c5fb') errors.push('Referencias incorrectas');
const required = ['README.md','docs/00_LEEME_PRIMERO.md', ...['ESTADO_PROYECTO','CATALOGO_FUNCIONAL','REGLAS_Y_CRITERIOS','DECISIONES_Y_CAMBIOS','TRAZABILIDAD','ADOPCION_HCG','PROCEDENCIA'].map(n => `docs/gobierno/${n}.md`), ...['REGLAS_NEGOCIO','DESCUBRIMIENTOS_Y_LIMITACIONES','CONTRATO_UX_FUNCIONAL'].map(n => `docs/${n}.md`), ...['FUENTES_Y_GRANULARIDAD','DICCIONARIO_vUrgencias'].map(n => `docs/diccionarios/${n}.md`), ...['README','CASOS_PATRON_VIGENTES','BENCHMARKS_VIGENTES','MANIFIESTO_VALIDACION','PLAN_VALIDACION'].map(n => `docs/evidencia/${n}.md`), 'docs/indicadores/00_CATALOGO_INDICADORES.md','docs/indicadores/01_CONVENCIONES_Y_REGLAS_COMUNES.md','docs/historico/checkpoints/README.md','docs/historico/prompts/SOLICITUD_BASELINE.txt','config','scripts'];
for (const path of required) if (!existsSync(resolve(root, path))) errors.push(`Falta ${path}`);
console.log(JSON.stringify({ principios: adoption.principios.length, adopcion: counts, elementos_requeridos: required.length, errores: errors }, null, 2));
if (errors.length) process.exitCode = 1;
