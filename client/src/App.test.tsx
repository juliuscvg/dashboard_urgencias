// @vitest-environment jsdom
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

const evidence = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../docs/evidencia/RECONCILIACION_ITER004_2026-09-10.json'), 'utf8'));
const bandEvidence = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../docs/evidencia/RECONCILIACION_ITER005_2026-09-10.json'), 'utf8'));
const permanence = bandEvidence.results['URG-EJ-03'].api;
const active = bandEvidence.results['URG-ACT-01'].api;
const triageTime = bandEvidence.results['URG-TRI-03'].api;

const queryData: Record<string, unknown> = {
  catalogs: { centros: [], servicios: [] },
  summary: {
    atenciones: 354, pacientesUnicos: 338, atencionesPorPaciente: 1.05, diasCompletos: 1,
    atencionesDiasCompletos: 354, promedioDiario: 354, periodoParcial: false,
    eventosCompletados: permanence.evaluables, permanenciaPromedioHoras: permanence.promedioHoras,
    permanenciaInvertidos: permanence.invertidos, permanenciaSinEgreso: permanence.sinEgreso,
    permanenciaMenor12h: permanence.menor12h, permanencia12a24h: permanence.de12a24h,
    permanencia24a48h: permanence.de24a48h, permanencia48a72h: permanence.de48a72h,
    permanenciaMayor72h: permanence.mayor72h,
    hospitalizaciones: 96, hospitalizacionPct: 32, reingresosMenor48: 2,
    reingresosMenor72: 3, reingresoPct: 0.8, eventosEvaluablesReingreso: 354,
    activosProbables: active.activosProbables, activosAntiguedadNoEvaluable: active.antiguedadNoEvaluable,
    activosFechaIngresoFutura: active.fechaIngresoFutura, activosMayor24h: active.mayor24h,
    activosMayor48h: active.mayor48h, activosMayor72h: active.mayor72h,
    eventosConConflicto: 0, filasMultiplicadas: 0, observadoEn: '2026-09-10T22:52:10.000Z',
  },
  demand: { tendencia: [{ fecha: '2026-08-01', atenciones: 354 }], servicios: [] },
  triage: {
    resumen: {
      universoTotal: triageTime.universoTotal, eventosConTriage: triageTime.conTriage, coberturaPct: 14.41,
      eventosEvaluablesTiempo: triageTime.evaluables, tiempoPromedioMinutos: triageTime.promedioMinutos,
      secuenciasInvertidas: triageTime.invertidos, tiemposMayorIgual24h: triageTime.mayorIgual24h,
      tiemposMayorIgual7d: triageTime.mayorIgual7d, mismoMinuto: triageTime.mismoMinuto,
      de1a10: triageTime.de1a10, de11a30: triageTime.de11a30, de31a60: triageTime.de31a60,
      de61a120: triageTime.de61a120, de121a240: triageTime.de121a240, mayor240: triageTime.mayor240,
    },
    servicios: [],
    clasificacion: evidence.results['URG-TRI-02'].apiRows,
  },
  resolution: { categorias: evidence.results['URG-MOD-05'].apiRows },
  frequentation: { bandas: evidence.results['URG-MOD-09'].apiRows },
  episodes: { total: 0, page: 1, pageSize: 20, rows: [] },
};

vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }: { queryKey: string[] }) => ({
    data: queryData[queryKey[0]], isLoading: false, isError: false, error: null,
  }),
}));

describe('accepted modules UI', () => {
  it('renders accepted categorical modules and all three band structures', () => {
    const html = renderToStaticMarkup(<App />);
    for (const expected of [
      'Destino de los eventos', 'HOSP. PISO', 'Eventos por paciente', '322',
      'Clasificación nativa', 'Urgencia', 'Porcentaje sobre eventos clasificados',
      'Bandas de estancia registrada', '12–&lt;24 h', 'Antigüedad al corte',
      'Señales acumulativas al corte', 'Bandas de tiempo Ingreso → Triage', '121–240 min', '204', '21', '18',
    ]) expect(html).toContain(expected);
    expect(html).not.toContain('Destinos y altas');
  });
});
