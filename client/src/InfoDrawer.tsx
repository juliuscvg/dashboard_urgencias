import { useEffect } from 'react';

// Ficha de detalle secundario bajo demanda (ITER-011), reutilizando el mismo
// patrón visual e interactivo del drawer de auditoría (HCG-UX-007, HCG-DET-007):
// overlay, cierre con Escape/backdrop, aria-modal. A diferencia de
// DetailDrawer.tsx, no consulta al servidor ni pagina: sólo repliega contenido
// agregado que YA fue solicitado por la perspectiva (clasificación nativa,
// cobertura por servicio, distribución de destinos), sin precargar nada nuevo.
// No es el drawer de episodios: aquí nunca se lista un evento por paciente.
export default function InfoDrawer({ eyebrow, title, onClose, children }: {
  eyebrow: string; title: string; onClose: () => void; children: React.ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="drawer info-drawer" role="dialog" aria-modal="true" aria-label={`Detalle de ${title}`}>
      <div className="drawer-head">
        <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
        <button className="close-button" aria-label="Cerrar detalle" onClick={onClose}>×</button>
      </div>
      {children}
    </aside>
  </div>;
}
