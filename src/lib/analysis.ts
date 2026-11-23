import type { GraphEdge, GraphNode } from '../types';

export type EulerStatus =
  | 'Circuito de Euler'
  | 'Camino de Euler'
  | 'No Euleriano'
  | 'N/A (Digrafo)';

export interface GraphAnalysis {
  n: number;
  m: number;
  idToIndex: Map<number, number>;
  deg: number[];
  inDeg: number[];
  outDeg: number[];
  degSum: number;
  isSimple: boolean;
  hasLoops: boolean;
  hasParallel: boolean;
  components: number;
  isConnected: boolean;
  isBipartite: boolean;
  bipartiteColors: number[];
  isComplete: boolean;
  oddDegreeCount: number;
  eulerStatus: EulerStatus;
  nonIsolatedConnected: boolean;
}

/**
 * Analiza la estructura del grafo en una sola pasada de grados y una BFS
 * posterior para componentes y 2-coloreado.
 */
export function analyzeGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  directed: boolean,
): GraphAnalysis {
  const n = nodes.length;
  const m = edges.length;
  const idToIndex = new Map<number, number>();
  nodes.forEach((node, index) => idToIndex.set(node.id, index));

  const deg = new Array<number>(n).fill(0);
  const inDeg = new Array<number>(n).fill(0);
  const outDeg = new Array<number>(n).fill(0);
  const adj: number[][] = Array.from({ length: n }, () => []);

  let hasLoops = false;
  let hasParallel = false;
  const pairCounts = new Map<string, number>();

  edges.forEach((edge) => {
    const ui = idToIndex.get(edge.u);
    const vi = idToIndex.get(edge.v);
    if (ui === undefined || vi === undefined) return;

    if (ui === vi) {
      hasLoops = true;
      deg[ui] += 2;
      inDeg[ui] += 1;
      outDeg[ui] += 1;
    } else {
      deg[ui] += 1;
      deg[vi] += 1;
      outDeg[ui] += 1;
      inDeg[vi] += 1;
      adj[ui].push(vi);
      adj[vi].push(ui);
    }

    const key = directed
      ? `${ui}->${vi}`
      : `${Math.min(ui, vi)}-${Math.max(ui, vi)}`;
    const count = (pairCounts.get(key) ?? 0) + 1;
    pairCounts.set(key, count);
    if (count > 1) hasParallel = true;
  });

  const isSimple = !hasLoops && !hasParallel;

  // Componentes conexas sobre la adyacencia subyacente no dirigida.
  const visited = new Array<boolean>(n).fill(false);
  let components = 0;
  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    components++;
    visited[start] = true;
    const queue: number[] = [start];
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head];
      for (const next of adj[current]) {
        if (!visited[next]) {
          visited[next] = true;
          queue.push(next);
        }
      }
    }
  }
  const isConnected = n > 0 && components === 1;

  // 2-coloreado BFS. Un bucle hace imposible la bipartición.
  const bipartiteColors = new Array<number>(n).fill(0);
  let isBipartite = !hasLoops;
  if (isBipartite) {
    for (let start = 0; start < n; start++) {
      if (bipartiteColors[start] !== 0) continue;
      bipartiteColors[start] = 1;
      const queue: number[] = [start];
      for (let head = 0; head < queue.length; head++) {
        const current = queue[head];
        for (const next of adj[current]) {
          if (bipartiteColors[next] === 0) {
            bipartiteColors[next] =
              bipartiteColors[current] === 1 ? 2 : 1;
            queue.push(next);
          } else if (bipartiteColors[next] === bipartiteColors[current]) {
            isBipartite = false;
          }
        }
      }
    }
  }

  const isComplete =
    !directed &&
    isSimple &&
    n >= 1 &&
    m === (n * (n - 1)) / 2;

  const nonIsolated = deg
    .map((degree, index) => ({ degree, index }))
    .filter((item) => item.degree > 0)
    .map((item) => item.index);

  let nonIsolatedConnected = false;
  if (nonIsolated.length > 0) {
    const seen = new Set<number>([nonIsolated[0]]);
    const queue: number[] = [nonIsolated[0]];
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head];
      for (const next of adj[current]) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    nonIsolatedConnected = nonIsolated.every((index) => seen.has(index));
  }

  const oddDegreeCount = deg.filter((degree) => degree % 2 !== 0).length;

  let eulerStatus: EulerStatus = 'No Euleriano';
  if (directed) {
    eulerStatus = 'N/A (Digrafo)';
  } else if (m > 0 && nonIsolatedConnected) {
    if (oddDegreeCount === 0) eulerStatus = 'Circuito de Euler';
    else if (oddDegreeCount === 2) eulerStatus = 'Camino de Euler';
  }

  const degSum = deg.reduce((total, degree) => total + degree, 0);

  return {
    n,
    m,
    idToIndex,
    deg,
    inDeg,
    outDeg,
    degSum,
    isSimple,
    hasLoops,
    hasParallel,
    components,
    isConnected,
    isBipartite,
    bipartiteColors,
    isComplete,
    oddDegreeCount,
    eulerStatus,
    nonIsolatedConnected,
  };
}
