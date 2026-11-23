import { Icon } from './ui/Icon';
import { Toggle } from './ui/Toggle';

interface HeaderProps {
  directed: boolean;
  showDegrees: boolean;
  complementActive: boolean;
  canComplement: boolean;
  onToggleDirected: () => void;
  onToggleDegrees: () => void;
  onToggleComplement: () => void;
}

export function Header({
  directed,
  showDegrees,
  complementActive,
  canComplement,
  onToggleDirected,
  onToggleDegrees,
  onToggleComplement,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="brand">
          <div className="brand__text">
            <h1 className="brand__title">
              GRAFO<span>/</span>LAB
            </h1>
            <h2 className='brand__subtitle'>BY: Gasdcoder07</h2>
            <p className="brand__subtitle">
              Laboratorio de teoría de grafos · análisis en tiempo real
            </p>
          </div>
        </div>

        <div className="header__controls">
          <button
            type="button"
            className={`btn btn--complement ${
              complementActive ? 'btn--active' : ''
            }`}
            onClick={onToggleComplement}
            disabled={!canComplement}
            title="Alternar entre el grafo G y su complemento Ḡ"
          >
            <Icon name="complement" size={15} />
            {complementActive ? 'Volver a G' : 'Complemento Ḡ'}
          </button>

          <Toggle
            checked={directed}
            onChange={onToggleDirected}
            label="Dirigido"
            disabled={complementActive}
            title={
              complementActive
                ? 'Desactiva el complemento para cambiar la dirección'
                : 'Interpretar las aristas como pares ordenados'
            }
          />

          <Toggle
            checked={showDegrees}
            onChange={onToggleDegrees}
            label="Grados"
            title="Mostrar la valencia de cada vértice"
          />

          <span className="header__tag" aria-hidden="true">
            MONO / 1-BIT
          </span>
        </div>
      </div>
      <div className="header__dither" aria-hidden="true" />
    </header>
  );
}
