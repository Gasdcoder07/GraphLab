import { getLab, STATUS_LABEL } from '../../data/labs';
import type { LabId } from '../../data/labs';
import { Icon } from '../ui/Icon';

interface LabDetailProps {
  labId: LabId;
  onOpenGraph: () => void;
}

export function LabDetail({ labId, onOpenGraph }: LabDetailProps) {
  const lab = getLab(labId);
  const active = lab.status === 'active';

  return (
    <section
      className="panel home-panel home-panel--detail lab-detail"
      id="lab-panel"
      role="tabpanel"
      aria-labelledby={`lab-tab-${lab.id}-button`}
    >
      <div className="panel__head">
        <div>
          <span className="panel__kicker">02 / FICHA</span>
          <h2 className="panel__title">Módulo seleccionado</h2>
        </div>
        <span className={`status ${active ? 'status--active' : 'status--design'}`}>
          <Icon name={active ? 'check' : 'info'} size={11} />
          {STATUS_LABEL[lab.status]}
        </span>
      </div>

      <div className="panel__body lab-detail__body">
        <div className="lab-detail__top">
          <span className="lab-detail__index">MÓDULO {lab.index}</span>
          <span className="lab-detail__domain">{lab.domain}</span>
        </div>

        <h3 className="lab-detail__title">{lab.name}</h3>
        <p className="lab-detail__desc">{lab.detail}</p>

        <ul className="lab-detail__features">
          {lab.features.map((feature) => (
            <li className="lab-detail__feature" key={feature}>
              {feature}
            </li>
          ))}
        </ul>

        {!active && (
          <div className="lab-detail__empty">
            <Icon name="info" size={26} />
            <p>
              Módulo en diseño. El laboratorio no está disponible todavía. Se
              habilitará cuando exista su implementación.
            </p>
          </div>
        )}

        {active ? (
          <div className="lab-detail__foot">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onOpenGraph}
              title="Abrir el lienzo interactivo del laboratorio de grafos"
            >
              <Icon name="arrow" size={15} />
              Abrir laboratorio
            </button>
            <span className="lab-detail__note">
              Sesión activa en <code>#/grafos</code>. Los datos se actualizan en
              tiempo real.
            </span>
          </div>
        ) : (
          <div className="lab-detail__foot">
            <button
              type="button"
              className="btn"
              disabled
              title={`El laboratorio de ${lab.name} estará disponible en una próxima iteración.`}
            >
              <Icon name="arrow" size={15} />
              Abrir laboratorio
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onOpenGraph}
            >
              Abrir el laboratorio de grafos
            </button>
            <span className="lab-detail__note">
              Módulo en diseño. Mientras tanto, el laboratorio de grafos está
              disponible.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
