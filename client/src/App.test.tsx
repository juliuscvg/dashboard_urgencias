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
const attentionEvidence = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../docs/evidencia/RECONCILIACION_ITER009_2026-09-11.json'), 'utf8'));
const attention = attentionEvidence.results['URG-ATE-01'].api;

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
    eventosConConflicto: 4, filasMultiplicadas: 6, observadoEn: '2026-09-10T22:52:10.000Z',
  },
  demand: { tendencia: [{ fecha: '2026-08-01', atenciones: 354 }], servicios: [] },
  triage: {
    resumen: {
      universoTotal: triageTime.universoTotal, eventosConTriage: triageTime.conTriage, coberturaPct: 14.41,
      eventosEvaluablesTiempo: triageTime.evaluables, tiempoPromedioMinutos: triageTime.promedioMinutos,
      secuenciasInvertidas: triageTime.invertidos,
      // Sintéticos (evidencia real trae 0/0): fuerzan la rama de advertencia URG-CAL-01.
      tiemposMayorIgual24h: 7, tiemposMayorIgual7d: 3, mismoMinuto: triageTime.mismoMinuto,
      de1a10: triageTime.de1a10, de11a30: triageTime.de11a30, de31a60: triageTime.de31a60,
      de61a120: triageTime.de61a120, de121a240: triageTime.de121a240, mayor240: triageTime.mayor240,
    },
    servicios: [],
    clasificacion: evidence.results['URG-TRI-02'].apiRows,
  },
  attention,
  resolution: { categorias: evidence.results['URG-MOD-05'].apiRows },
  frequentation: { bandas: evidence.results['URG-MOD-09'].apiRows },
};

vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }: { queryKey: string[] }) => ({
    data: queryData[queryKey[0]], isLoading: false, isError: false, isFetching: false, error: null,
  }),
}));

function render(view?: 'population' | 'performance') {
  window.history.replaceState(null, '', view ? `/?vista=${view}` : '/');
  return renderToStaticMarkup(<App />);
}

describe('arquitectura de perspectivas (HCG-VIS-001..003)', () => {
  it('expone las tres perspectivas y activa Operación por defecto', () => {
    const html = render();
    for (const label of ['Operación', 'Población', 'Indicadores de desempeño']) expect(html).toContain(label);
    expect(html).toContain('Perspectiva de análisis');
    expect(html).toContain('aria-current="page"');
  });

  it('cada perspectiva muestra sólo sus módulos y no la página vertical anterior', () => {
    const operation = render();
    expect(operation).toContain('Atenciones por día');
    expect(operation).toContain('Cobertura del hito registrado');
    // Desempeño y Población no se renderizan dentro de Operación.
    expect(operation).not.toContain('Eventos por paciente');
    expect(operation).not.toContain('Alcance de esta perspectiva');

    const population = render('population');
    expect(population).toContain('Eventos por paciente');
    expect(population).not.toContain('Atenciones por día');
    expect(population).not.toContain('Bandas de tiempo Ingreso → Triage');

    const performance = render('performance');
    expect(performance).toContain('Alcance de esta perspectiva');
    expect(performance).not.toContain('Atenciones por día');
  });
});

describe('módulos aceptados reubicados sin cambio funcional', () => {
  it('conserva bandas, resumen de destino y bandas de Triage en Operación (ITER-011: resumen ejecutivo)', () => {
    const html = render();
    for (const expected of [
      'Destino de los eventos', 'HOSP. PISO', 'Ver desglose completo',
      'Bandas de estancia registrada', '12–&lt;24 h', 'Antigüedad al corte',
      'Señales acumulativas al corte', 'Bandas de tiempo Ingreso → Triage', '121–240 min', '204', '21', '18',
    ]) expect(html).toContain(expected);
    expect(html).not.toContain('Destinos y altas');
    // Clasificación nativa y cobertura por servicio se compactaron a un
    // acceso bajo demanda (ITER-011, ajuste #2): no ocupan bloque permanente,
    // sólo el botón que abre el detalle.
    expect(html).not.toContain('<h3>Clasificación nativa');
    expect(html).not.toContain('<h3>Cobertura por servicio');
    expect(html).toContain('Clasificación y cobertura por servicio');
    expect(html).toContain('>Cobertura por servicio<');
  });

  it('diferencia visualmente Permanencia del periodo frente a Activos al corte (ITER-011, ajuste #3)', () => {
    const html = render();
    expect(html).toContain('Episodios del periodo');
    expect(html).toContain('Fotografía al corte');
  });

  it('presenta "Ingreso futuro" como señal de calidad separada, nunca como banda operativa (ITER-011, ajuste #4)', () => {
    const html = render();
    expect(html).not.toContain('Ingreso futuro');
    expect(html).toContain(`Calidad: ${active.fechaIngresoFutura} registros presentan fecha de ingreso futura respecto al corte`);
  });

  it('conserva frecuentación en Población', () => {
    const html = render('population');
    for (const expected of ['Eventos por paciente', '322', 'Pacientes únicos']) expect(html).toContain(expected);
  });

  it('muestra la advertencia URG-CAL-01 de Triage cuando hay casos ≥24 h o ≥7 d', () => {
    expect(render()).toContain('Calidad visible: 7 casos ≥24 h y 3 casos ≥7 días entre Ingreso y Triage.');
  });
});

describe('Atención médica (URG-ATE-01)', () => {
  it('conserva cobertura, bandas y advertencia sin denotar espera ni inicio clínico', () => {
    const html = render();
    for (const expected of [
      'Atención médica', 'Cobertura del hito registrado', 'con fechaate', 'sin fechaate',
      'Bandas de tiempo Ingreso → Atención médica', '0–30 min', '31–60 min', '61–120 min', '121–240 min',
      `${attention.resumen.eventosConAtencion}`, `${attention.resumen.mismoMinuto}`, `${attention.resumen.de0a30}`,
      `Calidad visible: ${attention.resumen.invertidos} secuencias a revisar, ${attention.resumen.mayorIgual24h} casos ≥24 h y ${attention.resumen.mayorIgual7d} casos ≥7 días entre Ingreso y Atención médica.`,
    ]) expect(html).toContain(expected);
    expect(html.toLowerCase()).not.toContain('tiempo de espera');
    expect(html.toLowerCase()).not.toContain('oportunidad');
    expect(html.toLowerCase()).not.toContain('inicio clínico real');
  });
});

describe('tooltip obligatorio y patrón clicable (HCG-UX-016/017)', () => {
  it('acompaña cada KPI y ficha agregada con un tooltip en lenguaje sencillo', () => {
    const html = render();
    for (const label of ['Atenciones', 'Promedio diario', 'Estancia promedio registrada', 'Activos al corte']) {
      expect(html).toContain(`aria-label="Definición de ${label}"`);
    }
    // El texto es para un perfil directivo: sin jerga SQL ni de código.
    for (const jargon of ['SELECT', 'JOIN', 'GROUP BY', 'NULL ']) expect(html).not.toContain(jargon);
  });

  it('hace clicable sólo la métrica que tiene detalle disponible', () => {
    const html = render();
    expect(html).toContain('kpi accent clickable');
    expect(html).toContain('Ver detalle');
    // Promedio diario y Activos probables no exponen detalle y no se presentan como clicables.
    expect(html).toContain('<article class="kpi">');
    const performance = render('performance');
    expect(performance).toContain('kpi accent clickable');
  });

  it('no precarga el detalle de pacientes: el drawer no está en el árbol inicial', () => {
    expect(render()).not.toContain('drawer-backdrop');
  });
});

describe('separación entre calidad de dato y desempeño (HCG-CAL-010)', () => {
  it('mantiene la cobertura de registro fuera de la perspectiva de desempeño', () => {
    const html = render('performance');
    expect(html).toContain('Hospitalización');
    expect(html).toContain('Reingreso &lt;72 h');
    expect(html).not.toContain('Cobertura de registro');
    expect(html).not.toContain('Cobertura del hito registrado');
    expect(html).toContain('se presenta como desempeño');
  });

  it('no introduce metas ni semáforos institucionales', () => {
    const html = render('performance');
    // La única mención admitida es la declaración de que NO existen.
    expect(html).toContain('No existen metas ni semáforos institucionales aprobados');
    // Ninguna cifra se califica con meta, umbral o semáforo.
    for (const forbidden of ['Meta:', 'Objetivo:', 'Cumple', 'No cumple', 'semaforo', 'class="target"', 'Umbral']) {
      expect(html).not.toContain(forbidden);
    }
  });
});

describe('perspectiva sin contrato aceptado (HCG-VIS-004)', () => {
  it('declara Población demográfica como no implementada en lugar de aproximarla', () => {
    const html = render('population');
    expect(html).toContain('Perfil demográfico');
    expect(html).toContain('No implementado');
    expect(html).toContain('URG-PEND-04');
    for (const forbidden of ['Sexo', 'Edad promedio', 'Procedencia']) expect(html).not.toContain(forbidden);
  });
});
