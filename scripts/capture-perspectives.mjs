// Capturas y medición de longitud vertical de las perspectivas (ITER-010).
//
// Uso:
//   node scripts/capture-perspectives.mjs <dist> <salida> [etiqueta=vista ...]
//
// Sirve el build real del cliente y responde la API con las cifras YA
// reconciliadas y versionadas en docs/evidencia/ (ITER-004, ITER-005,
// ITER-009). No inventa datos ni recalcula nada: son las mismas cifras que
// consumen las pruebas. Se usa porque la base de datos no es alcanzable desde
// este entorno; las capturas son evidencia de revisión humana, no
// especificación funcional.
//
// Requiere un Chrome/Edge instalado; no añade dependencias al repositorio.

import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [distArg, outArg, ...viewArgs] = process.argv.slice(2);
const dist = path.join(root, distArg ?? 'client/dist');
const out = path.join(root, outArg ?? 'docs/evidencia/capturas/ITER-010');
const views = (viewArgs.length ? viewArgs : ['operacion=operation', 'poblacion=population', 'desempeno=performance'])
  .map((entry) => { const [name, view] = entry.split('='); return { name, view }; });

const read = (file) => JSON.parse(fs.readFileSync(path.join(root, 'docs/evidencia', file), 'utf8'));
const iter004 = read('RECONCILIACION_ITER004_2026-09-10.json');
const iter005 = read('RECONCILIACION_ITER005_2026-09-10.json');
const iter009 = read('RECONCILIACION_ITER009_2026-09-11.json');
const permanence = iter005.results['URG-EJ-03'].api;
const active = iter005.results['URG-ACT-01'].api;
const triageTime = iter005.results['URG-TRI-03'].api;
const attention = iter009.results['URG-ATE-01'].api;

const services = [
  { centro: 'JIM', codigoServicio: 246, servicio: 'URGENCIAS ADULTOS' },
  { centro: 'JIM', codigoServicio: 247, servicio: 'URGENCIAS PEDIATRIA' },
  { centro: 'JIM', codigoServicio: 251, servicio: 'URGENCIAS GINECOOBSTETRICIA' },
];
const trend = Array.from({ length: 30 }, (_, index) => ({
  fecha: `2026-08-${String(index + 1).padStart(2, '0')}`,
  atenciones: 320 + ((index * 37) % 140),
}));

const fixtures = {
  filters: {
    centros: [{ value: 'JIM', label: 'JIM' }],
    servicios: services.map((item) => ({ value: item.codigoServicio, label: item.servicio, centro: item.centro })),
  },
  summary: {
    atenciones: 354, pacientesUnicos: 338, atencionesPorPaciente: 1.05, diasCompletos: 30,
    atencionesDiasCompletos: 354, promedioDiario: 11.8, periodoParcial: false,
    eventosCompletados: permanence.evaluables, permanenciaPromedioHoras: permanence.promedioHoras,
    permanenciaInvertidos: permanence.invertidos, permanenciaSinEgreso: permanence.sinEgreso,
    permanenciaMenor12h: permanence.menor12h, permanencia12a24h: permanence.de12a24h,
    permanencia24a48h: permanence.de24a48h, permanencia48a72h: permanence.de48a72h,
    permanenciaMayor72h: permanence.mayor72h,
    hospitalizaciones: 96, hospitalizacionPct: 32, reingresosMenor48: 2, reingresosMenor72: 3,
    reingresoPct: 0.8, eventosEvaluablesReingreso: 354,
    activosProbables: active.activosProbables, activosAntiguedadNoEvaluable: active.antiguedadNoEvaluable,
    activosFechaIngresoFutura: active.fechaIngresoFutura, activosMayor24h: active.mayor24h,
    activosMayor48h: active.mayor48h, activosMayor72h: active.mayor72h,
    eventosConConflicto: 4, filasMultiplicadas: 6, observadoEn: '2026-09-12T16:00:00.000Z',
  },
  demand: { tendencia: trend, servicios: services.map((item, index) => ({ ...item, atenciones: [214, 96, 44][index], estado: 'activo' })) },
  triage: {
    resumen: {
      universoTotal: triageTime.universoTotal, eventosConTriage: triageTime.conTriage, coberturaPct: 14.41,
      eventosEvaluablesTiempo: triageTime.evaluables, tiempoPromedioMinutos: triageTime.promedioMinutos,
      secuenciasInvertidas: triageTime.invertidos, tiemposMayorIgual24h: 7, tiemposMayorIgual7d: 3,
      mismoMinuto: triageTime.mismoMinuto, de1a10: triageTime.de1a10, de11a30: triageTime.de11a30,
      de31a60: triageTime.de31a60, de61a120: triageTime.de61a120, de121a240: triageTime.de121a240,
      mayor240: triageTime.mayor240,
    },
    servicios: services.map((item, index) => ({
      ...item, universoTotal: [214, 96, 44][index], eventosConTriage: [31, 14, 6][index],
      coberturaPct: [14.49, 14.58, 13.64][index],
    })),
    clasificacion: iter004.results['URG-TRI-02'].apiRows,
  },
  attention: {
    resumen: attention.resumen,
    servicios: services.map((item, index) => ({
      ...item, universoTotal: [214, 96, 44][index], eventosConAtencion: [201, 90, 40][index],
      coberturaPct: [93.93, 93.75, 90.91][index],
    })),
  },
  // Sólo lo consume la medición de la página vertical anterior (baseline), que
  // sí cargaba el listado con la página. La arquitectura vigente no lo precarga.
  episodes: {
    total: 354, page: 1, pageSize: 20,
    rows: Array.from({ length: 20 }, (_, index) => ({
      idUrgencia: 900100 + index,
      fechaIngreso: `2026-08-${String((index % 28) + 1).padStart(2, '0')}T08:${String(10 + index).padStart(2, '0')}:00.000Z`,
      fechaEgreso: `2026-08-${String((index % 28) + 1).padStart(2, '0')}T19:${String(10 + index).padStart(2, '0')}:00.000Z`,
      centro: 'JIM', codigoServicio: services[index % 3].codigoServicio, servicio: services[index % 3].servicio,
      destino: ['DOMICILIO', 'HOSP. PISO', 'CONSULTA EXTERNA'][index % 3], motivoAlta: null,
      permanenciaHoras: 6 + (index % 40), filasFisicas: 1, conflicto: index % 9 === 0,
    })),
  },
  resolution: { categorias: iter004.results['URG-MOD-05'].apiRows },
  frequentation: { bandas: iter004.results['URG-MOD-09'].apiRows },
};

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

// Marca la altura real de la página en el título para poder leerla con --dump-dom.
const probe = `<script>
addEventListener('load', () => setTimeout(() => {
  document.title = 'HEIGHT:' + document.documentElement.scrollHeight + ':' + document.documentElement.scrollWidth;
}, 1200));
</script>`;

const server = createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const apiMatch = url.pathname.match(/^\/api\/urgencias\/(\w+)$/u);
  if (apiMatch) {
    const data = fixtures[apiMatch[1]];
    response.writeHead(data ? 200 : 404, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify({ data: data ?? null }));
  }
  const file = url.pathname === '/' ? '/index.html' : url.pathname;
  const target = path.join(dist, file);
  if (!target.startsWith(dist) || !fs.existsSync(target)) {
    response.writeHead(404); return response.end('not found');
  }
  const body = file === '/index.html'
    ? fs.readFileSync(target, 'utf8').replace('</body>', `${probe}</body>`)
    : fs.readFileSync(target);
  response.writeHead(200, { 'Content-Type': types[path.extname(target)] ?? 'application/octet-stream' });
  response.end(body);
});

const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']
  .find((candidate) => fs.existsSync(candidate));
if (!chrome) { console.error('No se encontró Chrome ni Edge'); process.exit(1); }

const profile = path.join(process.env.TEMP ?? '/tmp', `urg-capture-${Date.now()}`);
const base = ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', `--user-data-dir=${profile}`];
// Asíncrono a propósito: el servidor de fixtures vive en este mismo proceso y
// una llamada síncrona bloquearía el bucle de eventos, dejando a Chrome sin
// respuesta hasta agotar su presupuesto de tiempo.
const execFileAsync = promisify(execFile);
const run = async (args) => {
  const { stdout } = await execFileAsync(chrome, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return stdout;
};

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
fs.mkdirSync(out, { recursive: true });
const results = [];

for (const { name, view } of views) {
  const target = `http://127.0.0.1:${port}/?desde=2026-08-01&hasta=2026-08-31&vista=${view}`;
  const dom = await run([...base, '--virtual-time-budget=9000', '--window-size=1440,1000', '--dump-dom', target]);
  const measured = dom.match(/HEIGHT:(\d+):(\d+)/u);
  const height = measured ? Number(measured[1]) : 1000;
  const file = path.join(out, `${name}.png`);
  await run([...base, '--virtual-time-budget=9000', `--window-size=1440,${Math.min(height, 16000)}`, `--screenshot=${file}`, target]);
  const bytes = fs.existsSync(file) ? fs.statSync(file).size : 0;
  results.push({ vista: name, view, alturaPx: height, viewports: Number((height / 1000).toFixed(2)), captura: path.relative(root, file), bytes });
  console.error(`${name}: ${height}px -> ${path.relative(root, file)} (${bytes} bytes)`);
}

server.close();
fs.rmSync(profile, { recursive: true, force: true });
console.log(JSON.stringify({ dist: distArg, viewport: '1440x1000', results }, null, 2));
