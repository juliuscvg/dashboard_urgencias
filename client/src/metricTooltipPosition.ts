export type MetricTooltipPosition = { left: number; top: number; placement: 'top' | 'bottom' };

export const closesMetricTooltip = (key: string) => key === 'Escape';

export function resolveTooltipPosition(anchor: DOMRect, width: number, height: number, viewportWidth: number, viewportHeight: number): MetricTooltipPosition {
  const margin = 12;
  const gap = 8;
  const left = Math.min(Math.max(anchor.left + anchor.width / 2 - width / 2, margin), viewportWidth - width - margin);
  const fitsAbove = anchor.top >= height + gap + margin;
  const top = fitsAbove ? anchor.top - height - gap : Math.min(anchor.bottom + gap, viewportHeight - height - margin);
  return { left, top: Math.max(margin, top), placement: fitsAbove ? 'top' : 'bottom' };
}
