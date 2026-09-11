import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchCurrent, fetchDemand, fetchEpisodes, fetchFrequentation, fetchReadmissions,
  fetchResolution, fetchSummaryBase, fetchTriage,
} from '../repository/urgencias.repository.js';
import { getFrequentation, getResolution, getTriage } from './urgencias.service.js';

vi.mock('../repository/urgencias.repository.js', () => ({
  fetchCurrent: vi.fn(), fetchDemand: vi.fn(), fetchEpisodes: vi.fn(),
  fetchFrequentation: vi.fn(), fetchReadmissions: vi.fn(), fetchResolution: vi.fn(),
  fetchSummaryBase: vi.fn(), fetchTriage: vi.fn(),
}));

const filters = { desde: '2026-08-01', hasta: '2026-08-01' };

describe('accepted module service projections', () => {
  beforeEach(() => vi.clearAllMocks());

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

  it('adds native Triage classification without altering coverage', async () => {
    vi.mocked(fetchTriage).mockResolvedValue({
      resumen: { universoTotal: '354', eventosConTriage: '51', coberturaPct: 14.41 },
      servicios: [],
      clasificacion: [{ triageCodigo: 3, triageDescripcion: 'URGENCIA', eventos: '19', porcentajeSobreClasificados: 37.25 }],
    });
    const result = await getTriage(filters);
    expect(result.resumen).toMatchObject({ universoTotal: 354, eventosConTriage: 51, coberturaPct: 14.41 });
    expect(result.clasificacion).toEqual([
      { triageCodigo: 3, triageDescripcion: 'URGENCIA', eventos: 19, porcentajeSobreClasificados: 37.25 },
    ]);
  });
});

void [fetchCurrent, fetchDemand, fetchEpisodes, fetchReadmissions, fetchSummaryBase];
