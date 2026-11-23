import { SpecimenPanel } from './SpecimenPanel';

interface HeroProps {
  onOpenGraph: () => void;
}

export function Hero({ onOpenGraph }: HeroProps) {
  return (
    <section className="home__hero">
      <div className="home__hero-copy">
        <span className="home__hero-kicker">LABORATORIO DE ESTRUCTURAS · 001</span>
        <h1 className="home__hero-title">
          Construye estructuras.
          <br />
          <span>Mide sus propiedades.</span>
        </h1>
        <p className="home__hero-desc">
          Un instrumento para construir estructuras de datos, analizar sus
          propiedades matemáticas y verificar los resultados sobre la marcha.
        </p>

        <div className="home__hero-actions">
          <button type="button" className="btn" onClick={onOpenGraph}>
            Abrir laboratorio de grafos
          </button>
          <a
            className="btn btn--ghost"
            href="https://github.com/Gasdcoder07/GraphLab"
            target="_blank"
            rel="noreferrer"
          >
            Ver repositorio
          </a>
        </div>

        <p className="home__hero-note">
          Módulo 01 implementado · 03 módulos en diseño · stack React + TypeScript +
          Vite
        </p>
      </div>

      <SpecimenPanel />
    </section>
  );
}

export function HeroStats() {
  const stats = [
    { label: 'MÓDULOS', value: '04' },
    { label: 'ACTIVOS', value: '01' },
    { label: 'EN DISEÑO', value: '03' },
    { label: 'ENFASIS', value: '1-BIT' },
  ];

  return (
    <div className="home__hero-stats">
      {stats.map((stat) => (
        <div className="home__stat" key={stat.label}>
          <span className="home__stat-label">{stat.label}</span>
          <span className="home__stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
