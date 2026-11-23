import type { GraphEdge, GraphNode } from '../types';

export function buildAdjacencyMatrix(
  nodes: GraphNode[],
  edges: GraphEdge[],
  directed: boolean,
  idToIndex: Map<number, number>,
): number[][] {
  const n = nodes.length;
  const matrix = Array.from({ length: n }, () =>
    new Array<number>(n).fill(0),
  );

  edges.forEach((edge) => {
    const ui = idToIndex.get(edge.u);
    const vi = idToIndex.get(edge.v);
    if (ui === undefined || vi === undefined) return;

    if (directed) {
      matrix[ui][vi] += 1;
    } else {
      matrix[ui][vi] += 1;
      if (ui !== vi) matrix[vi][ui] += 1;
    }
  });

  return matrix;
}

export function buildIncidenceMatrix(
  nodes: GraphNode[],
  edges: GraphEdge[],
  directed: boolean,
  idToIndex: Map<number, number>,
): number[][] {
  const n = nodes.length;
  const m = edges.length;
  const matrix = Array.from({ length: n }, () =>
    new Array<number>(m).fill(0),
  );

  edges.forEach((edge, column) => {
    const ui = idToIndex.get(edge.u);
    const vi = idToIndex.get(edge.v);
    if (ui === undefined || vi === undefined) return;

    if (directed) {
      if (ui !== vi) {
        matrix[ui][column] = -1;
        matrix[vi][column] = 1;
      }
    } else if (ui === vi) {
      matrix[ui][column] = 2;
    } else {
      matrix[ui][column] = 1;
      matrix[vi][column] = 1;
    }
  });

  return matrix;
}
