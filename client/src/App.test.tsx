// @vitest-environment jsdom
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

const evidence = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../docs/evidencia/RECONCILIACION_ITER004_2026-09-10.json'), 'utf8'));

const queryData: Record<string, unknown> = {
  catalogs: { centros: [], servicios: [] },
  summary: {
    atenciones: 354, pacientesUnicos: 338, atencionesPorPaciente: 1.05, diasCompletos: 1,
    atencionesDiasCompletos: 354, promedioDiario: 354, periodoParcial: false,
    eventosCompletados: 300, permanenciaPromedioHoras: 4.2, hospitalizaciones: 96,
    hospitalizacionPct: 32, reingresosMenor48: 2, reingresosMenor72: 3, reingresoPct: 0.8,
    eventosEvaluablesReingreso: 354, activosProbables: 370, eventosConConflicto: 0,
    filasMultiplicadas: 0, observadoEn: '2026-09-10T22:52:10.000Z',
  },
  demand: { tendencia: [{ fecha: '2026-08-01', atenciones: 354 }], servicios: [] },
  triage: {
    resumen: { universoTotal: 354, eventosConTriage: 51, coberturaPct: 14.41,
      eventosEvaluablesTiempo: 51, tiempoPromedioMinutos: 44.41, secuenciasInvertidas: 0,
      tiemposMayorIgual24h: 0, tiemposMayorIgual7d: 0 },
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
  it('renders resolution, frequentation and native Triage classification', () => {
    const html = renderToStaticMarkup(<App />);
    for (const expected of ['Destino de los eventos', 'HOSP. PISO', 'Eventos por paciente', '322',
      'Clasificación nativa', 'Urgencia', 'Porcentaje sobre eventos clasificados']) {
      expect(html).toContain(expected);
    }
    expect(html).not.toContain('Destinos y altas');
  });
});
