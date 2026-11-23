import { useMemo } from 'react';
import type { GraphAnalysis } from '../lib/analysis';
import {
  buildAdjacencyMatrix,
  buildIncidenceMatrix,
} from '../lib/matrices';
import type { GraphState, MatrixTab } from '../types';
import { Icon } from './ui/Icon';

interface MatrixPanelProps {
  state: GraphState;
  analysis: GraphAnalysis;
  onTab: (tab: MatrixTab) => void;
}

function cellClass(value: number, tab: MatrixTab): string {
  if (tab === 'adj') {
    if (value > 1) return 'matrix__cell matrix__cell--on matrix__cell--strong';
    return value > 0 ? 'matrix__cell matrix__cell--on' : 'matrix__cell';
  }

  if (value === 2) return 'matrix__cell matrix__cell--loop';
  if (value > 0) return 'matrix__cell matrix__cell--pos';
  if (value < 0) return 'matrix__cell matrix__cell--neg';
  return 'matrix__cell';
}

export function MatrixPanel({
  state,
  analysis,
  onTab,
}: MatrixPanelProps) {
  const { nodes, edges, directed, matrixTab } = state;
  const n = nodes.length;
  const m = edges.length;

  const matrix = useMemo(() => {
    if (matrixTab === 'adj') {
      return buildAdjacencyMatrix(
        nodes,
        edges,
        directed,
        analysis.idToIndex,
      );
    }
    return buildIncidenceMatrix(
      nodes,
      edges,
      directed,
      analysis.idToIndex,
    );
  }, [nodes, edges, directed, matrixTab, analysis.idToIndex]);

  const caption =
    matrixTab === 'adj'
      ? `Matriz de adyacencia A (${n}×${n}): número de aristas entre vᵢ y vⱼ.`
      : directed
        ? `Matriz de incidencia M (${n}×${m}): −1 sale de vᵢ, +1 entra en vᵢ.`
        : `Matriz de incidencia M (${n}×${m}): 1 si eⱼ incide en vᵢ; 2 si es bucle.`;

  const showEmpty = n === 0 || (matrixTab === 'inc' && m === 0);

  return (
    <section className="panel matrix-panel">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">03 / MATRICES</span>
          <h2 className="panel__title">Representación matricial</h2>
        </div>
        <span className="panel__meta">
          {matrixTab === 'adj' ? `${n}×${n}` : `${n}×${m}`}
        </span>
      </div>

      <div className="panel__body">
        <div className="matrix__tabs" role="tablist" aria-label="Tipo de matriz">
          <button
            type="button"
            role="tab"
            aria-selected={matrixTab === 'adj'}
            className={`matrix__tab ${
              matrixTab === 'adj' ? 'matrix__tab--active' : ''
            }`}
            onClick={() => onTab('adj')}
          >
            A · Adyacencia
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={matrixTab === 'inc'}
            className={`matrix__tab ${
              matrixTab === 'inc' ? 'matrix__tab--active' : ''
            }`}
            onClick={() => onTab('inc')}
          >
            M · Incidencia
          </button>
        </div>

        <p className="matrix__caption">{caption}</p>

        {showEmpty ? (
          <div className="matrix__empty">
            <Icon name="matrix" size={26} />
            <span>
              {n === 0
                ? 'Agrega vértices al lienzo para generar las matrices.'
                : 'Agrega aristas para visualizar las columnas de incidencia.'}
            </span>
          </div>
        ) : (
          <div className="matrix__scroll">
            <table className="matrix" aria-label={caption}>
              <thead>
                <tr>
                  <th className="matrix__corner" scope="col">
                    {matrixTab === 'adj' ? 'A' : 'M'}
                  </th>
                  {matrixTab === 'adj'
                    ? nodes.map((node) => (
                        <th key={node.id} scope="col">
                          {node.label}
                        </th>
                      ))
                    : edges.map((edge, index) => (
                        <th key={edge.id} scope="col">
                          e{index + 1}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, rowIndex) => (
                  <tr key={nodes[rowIndex]?.id ?? rowIndex}>
                    <th className="matrix__rowhead" scope="row">
                      {nodes[rowIndex]?.label}
                    </th>
                    {row.map((value, columnIndex) => {
                      const display =
                        matrixTab === 'inc' && directed && value > 0
                          ? `+${value}`
                          : String(value);
                      return (
                        <td
                          key={`${rowIndex}-${columnIndex}`}
                          className={cellClass(value, matrixTab)}
                          title={`${nodes[rowIndex]?.label} · ${
                            matrixTab === 'adj'
                              ? nodes[columnIndex]?.label
                              : `e${columnIndex + 1}`
                          } = ${display}`}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
