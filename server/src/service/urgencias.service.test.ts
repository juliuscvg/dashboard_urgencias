import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchCurrent, fetchDemand, fetchEpisodes, fetchFrequentation, fetchReadmissions,
  fetchResolution, fetchSummaryBase, fetchTriage,
} from '../repository/urgencias.repository.js';
import { getFrequentation, getResolution, getSummary, getTriage } from './urgencias.service.js';

vi.mock('../repository/urgencias.repository.js', () => ({
  fetchCurrent: vi.fn(), fetchDemand: vi.fn(), fetchEpisodes: vi.fn(),
  fetchFrequentation: vi.fn(), fetchReadmissions: vi.fn(), fetchResolution: vi.fn(),
  fetchSummaryBase: vi.fn(), fetchTriage: vi.fn(),
}));

const filters = { desde: '2026-08-01', hasta: '2026-08-01', corte: '2026-09-09T21:03:28.000Z' };

describe('accepted module service projections', () => {
  beforeEach(() => vi.clearAllMocks());

  it('preserves permanence bands and cumulative active signals', async () => {
    vi.mocked(fetchSummaryBase).mockResolvedValue({
      atenciones: '354', pacientesUnicos: '338', atencionesPorPaciente: 1.05, diasCompletos: 1,
      atencionesDiasCompletos: '354', promedioDiario: 354, periodoParcial: false,
      eventosCompletados: '342', permanenciaPromedioHoras: 10.5, permanenciaInvertidos: '2',
      permanenciaSinEgreso: '10', permanenciaMenor12h: '280', permanencia12a24h: '30',
      permanencia24a48h: '17', permanencia48a72h: '8', permanenciaMayor72h: '7',
      hospitalizaciones: '96', hospitalizacionPct: 28.07, eventosConConflicto: '0',
      filasMultiplicadas: '0', observadoEn: filters.corte,
    });
    vi.mocked(fetchReadmissions).mockResolvedValue({
      reingresosMenor48: '2', reingresosMenor72: '3', eventosEvaluablesReingreso: '354',
    });
    vi.mocked(fetchCurrent).mockResolvedValue({
      activosProbables: '370', activosAntiguedadNoEvaluable: '1', activosFechaIngresoFutura: '2',
      activosMayor24h: '360', activosMayor48h: '350', activosMayor72h: '340', observadoEn: filters.corte,
    });
    const result = await getSummary(filters);
    expect(result).toMatchObject({
      permanenciaInvertidos: 2, permanenciaSinEgreso: 10, permanenciaMenor12h: 280,
      permanencia12a24h: 30, permanencia24a48h: 17, permanencia48a72h: 8, permanenciaMayor72h: 7,
      activosProbables: 370, activosAntiguedadNoEvaluable: 1, activosFechaIngresoFutura: 2,
      activosMayor24h: 360, activosMayor48h: 350, activosMayor72h: 340,
    });
  });

  it('preserves native resolution categories, NULL, counts and precision', async () => {
    vi.mocked(fetchResolution).mockResolvedValue([
      { destinoUrgPk: 5, destino: 'HOSP. PISO', eventos: '96', porcentaje: 27.1186 },
      { destinoUrgPk: null, destino: null, eventos: '4', porcentaje: 1.1299 },
    ]);
    await expect(getResolution(filters)).resolves.toEqual({ categorias: [
      { destinoUrgPk: 5, destino: 'HOSP. PISO', eventos: 96, porcentaje: 27.1186 },
      { destinoUrgPk: null, destino: null, eventos: 4, porcentaje: 1.1299 },
    ] });
  });

  it('preserves the accepted frequentation bands and patient counts', async () => {
    vi.mocked(fetchFrequentation).mockResolvedValue([
      { banda: '1', pacientes: '322' }, { banda: '2', pacientes: '16' }, { banda: '11+', pacientes: '1' },
    ]);
    await expect(getFrequentation(filters)).resolves.toEqual({ bandas: [
      { banda: '1', pacientes: 322 }, { banda: '2', pacientes: 16 }, { banda: '11+', pacientes: 1 },
    ] });
  });

  it('adds exact Triage time bands without altering coverage or classification', async () => {
    vi.mocked(fetchTriage).mockResolvedValue({
      resumen: {
        universoTotal: '354', eventosConTriage: '51', coberturaPct: 14.41,
        eventosEvaluablesTiempo: '50', tiempoPromedioMinutos: 44.41, secuenciasInvertidas: '1',
        tiemposMayorIgual24h: '2', tiemposMayorIgual7d: '1', mismoMinuto: '4',
        de1a10: '8', de11a30: '12', de31a60: '10', de61a120: '7', de121a240: '5', mayor240: '4',
      },
      servicios: [],
      clasificacion: [{ triageCodigo: 3, triageDescripcion: 'URGENCIA', eventos: '19', porcentajeSobreClasificados: 37.25 }],
    });
    const result = await getTriage(filters);
    expect(result.resumen).toMatchObject({
      universoTotal: 354, eventosConTriage: 51, eventosEvaluablesTiempo: 50,
      mismoMinuto: 4, de1a10: 8, de11a30: 12, de31a60: 10, de61a120: 7, de121a240: 5, mayor240: 4,
    });
    expect(result.clasificacion).toEqual([
      { triageCodigo: 3, triageDescripcion: 'URGENCIA', eventos: 19, porcentajeSobreClasificados: 37.25 },
    ]);
  });
});

void [fetchDemand, fetchEpisodes];
