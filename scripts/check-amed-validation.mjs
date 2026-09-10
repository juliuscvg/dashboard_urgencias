import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifactPath = path.join(root, 'docs/evidencia/VALIDACION_AMED_SECUENCIA_2026-09-10.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const fail = (message) => { throw new Error(message); };
const number = (value) => Number(value);

if (artifact.schema_version !== '1.0.0') fail('Versión de esquema AMED inesperada');
if (artifact.contexto?.secretos_registrados !== false || artifact.contexto?.identificadores_directos_registrados !== false) fail('El artefacto no declara el resguardo esperado');
const expectedColumns = ['Fechaing', 'altamed_fecha', 'fechaate', 'fechaegr', 'fechamed', 'fechatri'];
if (artifact.tipos?.length !== expectedColumns.length) fail('Tipos de columna incompletos');
for (const column of artifact.tipos) {
  if (!expectedColumns.includes(column.columna) || column.tipo !== 'datetime' || column.permite_null !== 'YES') fail(`Tipo AMED inesperado: ${column.columna}`);
}
const result36m = artifact.resultados?.['36m'] ?? fail('Falta resultado de 36m');
const summary = result36m.resumen ?? fail('Falta resumen de 36m');
if (number(summary.universo) !== 484161 || number(summary.con_fechamed) !== 442955 || number(summary.con_altamed_fecha) !== 76914) fail('Resumen de 36m inesperado');
if (!(number(summary.dia_distinto) > 0 && number(summary.iguales_exactos) < number(summary.ambos) && number(summary.diferencia_minima_min) < 0 && number(summary.diferencia_maxima_min) === 0)) fail('No se conserva la diferencia entre fechamed y altamed_fecha');
const pair = (name) => result36m.pares?.find((row) => row.par === name) ?? fail(`Falta par ${name}`);
const ingresoMed = pair('Fechaing→fechamed');
const atencionMed = pair('fechaate→fechamed');
const medEgreso = pair('fechamed→fechaegr');
if (number(ingresoMed.invertidos) !== 0 || number(atencionMed.invertidos) <= 0 || number(medEgreso.invertidos) <= 0) fail('Inversiones AMED inesperadas');
const sequence = result36m.secuencia_completa ?? fail('Falta secuencia completa');
if (!(number(sequence.completa) > 0 && number(sequence.ordenada) > 0 && number(sequence.con_inversion) > 0 && number(sequence.completa) === number(sequence.ordenada) + number(sequence.con_inversion))) fail('Secuencia completa inconsistente');
const precision = artifact.precision_y_tramos_36m?.resumen ?? fail('Falta complemento de precisión');
if (number(precision.con_altamed) !== number(precision.altamed_medianoche) || number(precision.altamed_con_hora) !== 0) fail('Precisión de altamed_fecha inesperada');
for (const proposal of artifact.propuestas_contrato ?? []) if (proposal.estado !== 'PROPUESTO CON EVIDENCIA; NO ACEPTADO') fail(`Estado de propuesta inesperado: ${proposal.id}`);
if (artifact.propuestas_contrato?.length !== 4) fail('Propuestas AMED incompletas');
for (const file of ['scripts/sql/03_validacion_amed_secuencia.sql', 'scripts/sql/04_validacion_amed_precision.sql', 'scripts/run-amed-validation.mjs']) if (!fs.existsSync(path.join(root, file))) fail(`Falta artefacto reproducible: ${file}`);
console.log(JSON.stringify({ ok: true, universe36m: number(summary.universo), fechamed36m: number(summary.con_fechamed), altamed36m: number(summary.con_altamed_fecha), distinctCalendarDays36m: number(summary.dia_distinto), sequenceComplete36m: number(sequence.completa) }, null, 2));
