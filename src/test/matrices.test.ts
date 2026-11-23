import { describe, expect, it } from 'vitest';
import { analyzeGraph } from '../lib/analysis';
import {
  buildAdjacencyMatrix,
  buildIncidenceMatrix,
} from '../lib/matrices';
import type { GraphEdge, GraphNode } from '../types';

function makeNodes(count: number): GraphNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    label: `v${index + 1}`,
    x: 0,
    y: 0,
    partition: null,
  }));
}

function makeEdge(id: number, u: number, v: number): GraphEdge {
  return { id, u, v };
}

describe('matrices', () => {
  it('construye una matriz de adyacencia simétrica para un grafo no dirigido', () => {
    const nodes = makeNodes(3);
    const edges = [makeEdge(1, 1, 2), makeEdge(2, 2, 3)];
    const analysis = analyzeGraph(nodes, edges, false);

    const matrix = buildAdjacencyMatrix(
      nodes,
      edges,
      false,
      analysis.idToIndex,
    );

    expect(matrix).toEqual([
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ]);
  });

  it('cuenta aristas paralelas en la matriz de adyacencia', () => {
    const nodes = makeNodes(2);
    const edges = [makeEdge(1, 1, 2), makeEdge(2, 1, 2)];
    const analysis = analyzeGraph(nodes, edges, false);

    const matrix = buildAdjacencyMatrix(
      nodes,
      edges,
      false,
      analysis.idToIndex,
    );

    expect(matrix[0][1]).toBe(2);
    expect(matrix[1][0]).toBe(2);
  });

  it('representa un bucle con 2 en la matriz de incidencia', () => {
    const nodes = makeNodes(2);
    const edges = [makeEdge(1, 1, 1)];
    const analysis = analyzeGraph(nodes, edges, false);

    const matrix = buildIncidenceMatrix(
      nodes,
      edges,
      false,
      analysis.idToIndex,
    );

    expect(matrix).toEqual([
      [2],
      [0],
    ]);
  });

  it('usa −1 y +1 en la incidencia de un digrafo', () => {
    const nodes = makeNodes(2);
    const edges = [makeEdge(1, 1, 2)];
    const analysis = analyzeGraph(nodes, edges, true);

    const matrix = buildIncidenceMatrix(
      nodes,
      edges,
      true,
      analysis.idToIndex,
    );

    expect(matrix).toEqual([
      [-1],
      [1],
    ]);
  });

  it('mantiene la asimetría en la adyacencia dirigida', () => {
    const nodes = makeNodes(2);
    const edges = [makeEdge(1, 1, 2)];
    const analysis = analyzeGraph(nodes, edges, true);

    const matrix = buildAdjacencyMatrix(
      nodes,
      edges,
      true,
      analysis.idToIndex,
    );

    expect(matrix).toEqual([
      [0, 1],
      [0, 0],
    ]);
  });
});
