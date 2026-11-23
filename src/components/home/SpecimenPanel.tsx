import { Fragment } from 'react';

const NODES = [
  { id: 1, label: 'v1', x: 60, y: 70 },
  { id: 2, label: 'v2', x: 160, y: 40 },
  { id: 3, label: 'v3', x: 260, y: 70 },
  { id: 4, label: 'v4', x: 250, y: 170 },
  { id: 5, label: 'v5', x: 160, y: 190 },
  { id: 6, label: 'v6', x: 70, y: 165 },
];

const EDGES: Array<[number, number]> = [
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 1],
  [2, 5],
];

const MATRIX_SIZE = 6;

export function SpecimenPanel() {
  const matrix: boolean[][] = Array.from({ length: MATRIX_SIZE }, () =>
    Array.from({ length: MATRIX_SIZE }, () => false),
  );

  for (const [u, v] of EDGES) {
    const uIndex = u - 1;
    const vIndex = v - 1;
    matrix[uIndex][vIndex] = true;
    matrix[vIndex][uIndex] = true;
  }

  return (
    <section className="panel specimen" aria-label="Muestra técnica del laboratorio">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">00 / ESPÉCIMEN</span>
          <h2 className="panel__title">Grafo de muestra</h2>
        </div>
        <span className="panel__meta">ACTIVO</span>
      </div>

      <div className="panel__body specimen__body">
        <svg
          className="specimen__graph"
          viewBox="0 0 320 220"
          role="img"
          aria-label="Grafo de muestra con seis vértices y siete aristas"
        >
          {EDGES.map(([u, v]) => {
            const a = NODES.find((node) => node.id === u);
            const b = NODES.find((node) => node.id === v);
            if (!a || !b) return null;

            const isVertical = a.x === b.x;
            const path = isVertical
              ? `M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2}, ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`
              : `M ${a.x} ${a.y} L ${b.x} ${b.y}`;

            return (
              <path
                key={`${u}-${v}`}
                className="specimen__edge"
                d={path}
                strokeWidth={1.4}
              />
            );
          })}

          {NODES.map((node) => (
            <g key={node.id} className="specimen__node">
              <circle cx={node.x} cy={node.y} r="10" />
              <text x={node.x} y={node.y + 3.5} textAnchor="middle">
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="specimen__metrics">
          <div className="specimen__metric">
            <span className="specimen__metric-value">6</span>
            <span className="specimen__metric-label">VÉRTICES</span>
          </div>
          <div className="specimen__metric">
            <span className="specimen__metric-value">7</span>
            <span className="specimen__metric-label">ARISTAS</span>
          </div>
          <div className="specimen__metric">
            <span className="specimen__metric-value">14</span>
            <span className="specimen__metric-label">Σ DEG</span>
          </div>
        </div>

        <div className="specimen__matrix">
          <span className="specimen__matrix-label">A · ADYACENCIA</span>
          <div className="specimen__matrix-grid">
            <span className="specimen__matrix-cell specimen__matrix-cell--head">
              v
            </span>
            {Array.from({ length: MATRIX_SIZE }, (_, i) => (
              <span key={`col-${i}`} className="specimen__matrix-cell specimen__matrix-cell--head">
                {i + 1}
              </span>
            ))}
            {matrix.map((row, rowIndex) => (
              <Fragment key={`matrix-row-${rowIndex}`}>
                <span
                  className="specimen__matrix-cell specimen__matrix-cell--head"
                >
                  {rowIndex + 1}
                </span>
                {row.map((value, columnIndex) => (
                  <span
                    key={`cell-${rowIndex}-${columnIndex}`}
                    className={`specimen__matrix-cell ${value ? 'specimen__matrix-cell--on' : ''}`}
                  >
                    {value ? '1' : '0'}
                  </span>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
