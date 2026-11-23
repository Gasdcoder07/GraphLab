import { describe, expect, it } from 'vitest';
import { analyzeGraph } from '../lib/analysis';
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

describe('analyzeGraph', () => {
  it('cumple el lema del apretón de manos en K5', () => {
    const nodes = makeNodes(5);
    const edges: GraphEdge[] = [];
    let id = 1;
    for (let i = 1; i <= 5; i++) {
      for (let j = i + 1; j <= 5; j++) {
        edges.push(makeEdge(id++, i, j));
      }
    }

    const analysis = analyzeGraph(nodes, edges, false);

    expect(analysis.n).toBe(5);
    expect(analysis.m).toBe(10);
    expect(analysis.degSum).toBe(20);
    expect(analysis.degSum).toBe(2 * analysis.m);
    expect(analysis.isComplete).toBe(true);
    expect(analysis.isSimple).toBe(true);
    expect(analysis.isConnected).toBe(true);
    expect(analysis.isBipartite).toBe(false);
    expect(analysis.eulerStatus).toBe('Circuito de Euler');
  });

  it('detecta un grafo disconexo y sus componentes', () => {
    const nodes = makeNodes(5);
    const edges = [
      makeEdge(1, 1, 2),
      makeEdge(2, 2, 3),
      makeEdge(3, 3, 1),
      makeEdge(4, 4, 5),
    ];

    const analysis = analyzeGraph(nodes, edges, false);

    expect(analysis.components).toBe(2);
    expect(analysis.isConnected).toBe(false);
  });

  it('reconoce K3,3 como bipartido y no completo', () => {
    const nodes = makeNodes(6);
    const edges: GraphEdge[] = [];
    let id = 1;
    for (let left = 1; left <= 3; left++) {
      for (let right = 4; right <= 6; right++) {
        edges.push(makeEdge(id++, left, right));
      }
    }

    const analysis = analyzeGraph(nodes, edges, false);

    expect(analysis.isBipartite).toBe(true);
    expect(analysis.isComplete).toBe(false);
    expect(analysis.m).toBe(9);
    expect(analysis.eulerStatus).toBe('No Euleriano');
  });

  it('detecta un camino de Euler con exactamente dos grados impares', () => {
    const nodes = makeNodes(5);
    const edges = [
      makeEdge(1, 1, 2),
      makeEdge(2, 1, 3),
      makeEdge(3, 2, 3),
      makeEdge(4, 2, 4),
      makeEdge(5, 3, 5),
      makeEdge(6, 4, 5),
      makeEdge(7, 2, 5),
      makeEdge(8, 3, 4),
    ];

    const analysis = analyzeGraph(nodes, edges, false);

    expect(analysis.oddDegreeCount).toBe(2);
    expect(analysis.eulerStatus).toBe('Camino de Euler');
  });

  it('trata los bucles como grado 2 y rompe la bipartición', () => {
    const nodes = makeNodes(2);
    const edges = [makeEdge(1, 1, 1), makeEdge(2, 1, 2)];

    const analysis = analyzeGraph(nodes, edges, false);

    expect(analysis.hasLoops).toBe(true);
    expect(analysis.isSimple).toBe(false);
    expect(analysis.deg[0]).toBe(3);
    expect(analysis.isBipartite).toBe(false);
    expect(analysis.degSum).toBe(4);
  });

  it('calcula grados de entrada y salida en un digrafo', () => {
    const nodes = makeNodes(3);
    const edges = [
      makeEdge(1, 1, 2),
      makeEdge(2, 2, 3),
      makeEdge(3, 3, 1),
    ];

    const analysis = analyzeGraph(nodes, edges, true);

    expect(analysis.inDeg).toEqual([1, 1, 1]);
    expect(analysis.outDeg).toEqual([1, 1, 1]);
    expect(analysis.eulerStatus).toBe('N/A (Digrafo)');
  });

  it('considera un vértice aislado como conexo y bipartido', () => {
    const analysis = analyzeGraph(makeNodes(1), [], false);

    expect(analysis.isConnected).toBe(true);
    expect(analysis.isBipartite).toBe(true);
    expect(analysis.isComplete).toBe(true);
    expect(analysis.eulerStatus).toBe('No Euleriano');
  });
});
