import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { closesMetricTooltip, resolveTooltipPosition, type MetricTooltipPosition } from './metricTooltipPosition';

// Componente de interacción transversal (HCG-VIS-007): tooltip obligatorio
// por métrica agregada (HCG-UX-016), en lenguaje sencillo para un perfil
// directivo. Comportamiento portado de dashboard_cex/client/src/MetricTooltip.tsx;
// sin reglas funcionales de otro dominio.
export default function MetricTooltip({ label, text }: { label: string; text: string }) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MetricTooltipPosition>({ left: 0, top: 0, placement: 'top' });

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const update = () => {
      if (!anchor.current || !tooltip.current) return;
      const box = tooltip.current.getBoundingClientRect();
      setPosition(resolveTooltipPosition(anchor.current.getBoundingClientRect(), box.width, box.height, window.innerWidth, window.innerHeight));
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (closesMetricTooltip(event.key)) setOpen(false); };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return <span className="metric-tooltip-anchor" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
    <span ref={anchor} role="button" tabIndex={0} aria-label={`Definición de ${label}`} aria-describedby={open ? id : undefined} onClick={(event) => event.stopPropagation()}>i</span>
    {open && typeof document !== 'undefined' && createPortal(<div ref={tooltip} id={id} role="tooltip" data-placement={position.placement} className="metric-tooltip-portal" style={{ left: position.left, top: position.top }}>{text}</div>, document.body)}
  </span>;
}
