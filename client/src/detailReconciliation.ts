// Reconciliación agregado ↔ detalle (HCG-UX-006, HCG-DET-*). La UI muestra la
// discrepancia; nunca la corrige ni la oculta localmente.
export const hasReconciliationMismatch = (expected: number | null | undefined, actual: number | null) =>
  expected !== null && expected !== undefined && actual !== null && expected !== actual;

export const pageRangeLabel = (page: number, pageSize: number, total: number) => {
  if (!total) return 'Sin registros';
  const start = (page - 1) * pageSize + 1;
  return `${start}–${Math.min(page * pageSize, total)} de ${total}`;
};

export const lastPage = (total: number, pageSize: number) => Math.max(1, Math.ceil(total / pageSize));
