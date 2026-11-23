import { Icon } from '../ui/Icon';

const STRUCTURES = [
  {
    glyph: '∪',
    name: 'Conjuntos',
    description: 'Operaciones de unión, intersección y complemento.',
    status: 'EN DISEÑO',
  },
  {
    glyph: '≺',
    name: 'Relaciones',
    description: 'Pruebas de reflexividad, simetría y transitividad.',
    status: 'EN DISEÑO',
  },
  {
    glyph: 'A',
    name: 'Matrices',
    description: 'Adyacencia e incidencia con semántica de estados.',
    status: 'PARCIAL',
  },
  {
    glyph: 'Σ',
    name: 'Combinatoria',
    description: 'Contadores de subgrafos, recorridos y configuraciones.',
    status: 'EN DISEÑO',
  },
];

export function MathPanel() {
  return (
    <section className="panel home-panel home-panel--math math-panel" id="matematicas">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">03 / MATEMÁTICAS</span>
          <h2 className="panel__title">Estructuras matemáticas</h2>
        </div>
        <span className="panel__meta">ROADMAP</span>
      </div>

      <div className="panel__body math-list">
        {STRUCTURES.map((item) => (
          <div className="math-item" key={item.name}>
            <span className="math-item__glyph">{item.glyph}</span>
            <div className="math-item__main">
              <span className="math-item__name">{item.name}</span>
              <span className="math-item__desc">{item.description}</span>
            </div>
            <span className="math-item__status">{item.status}</span>
          </div>
        ))}
      </div>

      <p className="math-note">
        Las matrices A y M ya operan en el módulo de grafos; el estudio formal de
        estas estructuras continúa en el roadmap.
      </p>
    </section>
  );
}

export function MethodPanel() {
  const steps = [
    {
      index: '01',
      title: 'Construir',
      description: 'Define la estructura con presets, parámetros y ediciones directas.',
    },
    {
      index: '02',
      title: 'Medir',
      description: 'Obtiene propiedades, grados, conectividad y métricas derivadas.',
    },
    {
      index: '03',
      title: 'Verificar',
      description: 'Consolida resultados con matrices, fórmulas y estados visuales.',
    },
  ];

  return (
    <section className="panel home-panel home-panel--method method-panel" id="metodo">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">04 / MÉTODO</span>
          <h2 className="panel__title">Método en tres pasos</h2>
        </div>
        <span className="panel__meta">03 PASOS</span>
      </div>

      <div className="panel__body method-list">
        {steps.map((step) => (
          <div className="method__step" key={step.index}>
            <span className="method__num">{step.index}</span>
            <div>
              <h3 className="method__title">{step.title}</h3>
              <p className="method__desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RepoPanel() {
  return (
    <section className="panel home-panel home-panel--repo repo-panel" id="repositorio">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">05 / REPOSITORIO</span>
          <h2 className="panel__title">Código abierto</h2>
        </div>
        <span className="panel__meta">GITHUB</span>
      </div>

      <div className="panel__body repo__body">
        <div className="repo__path">
          Gasdcoder07<span>/</span>GraphLab
        </div>
        <p className="repo__desc">
          Fuentes, tests y diseño monocromo bajo las reglas de GRAFO/LAB para
          nuevas implementaciones.
        </p>

        <div className="repo__stack" aria-label="Stack del proyecto">
          <span className="repo__tag">REACT</span>
          <span className="repo__tag">TYPESCRIPT</span>
          <span className="repo__tag">VITE</span>
          <span className="repo__tag">VITEST</span>
        </div>

        <a
          className="btn btn--ghost repo__link"
          href="https://github.com/Gasdcoder07/GraphLab"
          target="_blank"
          rel="noreferrer"
        >
          Ver repositorio
          <Icon name="external" size={14} />
        </a>
      </div>
    </section>
  );
}
