// Definiciones de tooltip (HCG-UX-016): toda métrica o ficha agregada explica,
// en lenguaje sencillo para un perfil directivo, qué mide, sobre qué universo y
// cómo se interpreta. No introducen reglas, fórmulas, metas ni umbrales nuevos
// (HCG-UX-008): cada texto parafrasea el contrato ya aceptado del indicador.

export const METRIC_HELP = {
  atenciones:
    'Cuántos eventos de urgencias se registraron en el periodo, centro y servicio seleccionados. Cada evento cuenta una sola vez, aunque el sistema guarde varias filas para él.',
  promedioDiario:
    'Atenciones por día, considerando sólo los días completos del periodo. El día en curso no se incluye porque todavía no termina.',
  pacientesUnicos:
    'Cuántas personas distintas generaron esas atenciones. Una misma persona atendida varias veces cuenta una vez aquí.',
  atencionesPorPaciente:
    'En promedio, cuántas veces acudió cada persona en el periodo. Es una descripción del uso registrado, no un juicio sobre él.',
  permanencia:
    'Tiempo promedio entre el ingreso y el egreso registrados, sobre los eventos que ya tienen egreso y cuya secuencia de fechas es interpretable. El registro no garantiza presencia física continua.',
  permanenciaBandas:
    'Reparto de los eventos evaluables por duración registrada. Las bandas son excluyentes: cada evento cae en una sola.',
  hospitalizacion:
    'De los eventos que ya concluyeron, qué proporción tuvo como destino registrado HOSP. PISO. No agrupa otros destinos.',
  reingreso72:
    'Personas que volvieron al mismo servicio antes de 72 horas desde su egreso anterior. Se mide sobre los eventos que tienen la información necesaria para evaluarlo.',
  reingreso48:
    'Misma lectura que el reingreso menor a 72 horas, con un corte más estrecho de 48 horas. Se presenta como referencia secundaria.',
  activos:
    'Eventos que al momento de la consulta siguen sin egreso registrado. Es una foto del momento actual y no depende del periodo filtrado.',
  activosAntiguedad:
    'De esos eventos aún abiertos, cuántos llevan más de 24, 48 o 72 horas desde su ingreso. Son señales acumulativas: un mismo evento puede aparecer en varias.',
  demanda:
    'Cómo se distribuyeron las atenciones a lo largo de los días del periodo seleccionado.',
  servicios:
    'Cuántas atenciones registró cada servicio de urgencias dentro del periodo y centro filtrados.',
  resolucion:
    'Cómo terminaron los eventos según el destino registrado en el sistema. Se muestran las categorías tal como vienen en la fuente, sin agruparlas.',
  frecuentacion:
    'Cuántas personas acudieron una vez, dos veces, y así sucesivamente. Describe el patrón de repetición sin calificarlo.',
  triageCobertura:
    'De todos los eventos del periodo, en cuántos quedó registrada la clasificación de Triage. Que falte el registro no excluye la atención.',
  triageTiempo:
    'Tiempo promedio registrado entre el ingreso y la clasificación de Triage, sobre las secuencias con fechas interpretables. Los valores extremos se conservan.',
  triageClasificacion:
    'Distribución de los eventos según la categoría de Triage registrada, sobre los eventos que sí fueron clasificados.',
  atencionCobertura:
    'En cuántos eventos quedó registrado el hito de Atención médica. Es una medida de registro: su ausencia no significa que la persona no fuera atendida.',
  atencionTiempo:
    'Tiempo promedio registrado entre el ingreso y el hito de Atención médica. Es un intervalo entre registros, no un tiempo de espera ni una medida de oportunidad.',
  calidad:
    'Situaciones del propio registro que conviene revisar: identidades en conflicto, filas duplicadas o secuencias de fechas inconsistentes. Se muestran para que la cifra pueda auditarse, no como resultado del servicio.',
  detalle:
    'Listado evento por evento del recorte seleccionado. Se carga sólo cuando se abre y se recorre por páginas desde el servidor.',
} as const;

export type MetricHelpKey = keyof typeof METRIC_HELP;
