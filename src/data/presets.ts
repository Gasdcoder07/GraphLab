import type {
  GraphEdge,
  GraphNode,
  PresetId,
  PresetParams,
  Size,
} from '../types';

export interface PresetDefinition {
  id: PresetId;
  name: string;
  badge: string;
  title: string;
  description: string;
  formula: string;
}

export const PRESETS: PresetDefinition[] = [
  {
    id: 'simple',
    name: 'Grafo simple',
    badge: 'G = (V, E)',
    title: 'Grafo simple no dirigido',
    description:
      'Estructura G = (V, E) sin bucles ni aristas múltiples entre el mismo par de vértices. Modela redes de comunicación estándar y relaciones simétricas.',
    formula: '|E| ≤ n(n − 1) / 2   ·   A es simétrica con diagonal de ceros',
  },
  {
    id: 'multigraph',
    name: 'Multigrafo',
    badge: 'paralelas + bucles',
    title: 'Multigrafo con bucles y aristas paralelas',
    description:
      'Permite varias aristas conectando el mismo par de vértices y bucles. En grafos no dirigidos, cada bucle aporta 2 al grado del vértice que lo contiene.',
    formula: 'deg(v) = aristas incidentes + 2 × (bucles en v)',
  },
  {
    id: 'digraph',
    name: 'Digrafo',
    badge: 'pares (u, v)',
    title: 'Grafo dirigido o digrafo',
    description:
      'Las aristas son pares ordenados (u, v) con dirección desde el origen u hacia el destino v. El grado se divide en grado de entrada y grado de salida.',
    formula: 'Σ deg⁻(v) = Σ deg⁺(v) = |E|',
  },
  {
    id: 'complete',
    name: 'Completo Kₙ',
    badge: '(n − 1)-regular',
    title: 'Grafo completo de n vértices (Kₙ)',
    description:
      'Grafo simple donde cada par de vértices distintos está conectado por una única arista. Representa una topología de malla completa.',
    formula: 'deg(v) = n − 1   ·   |E(Kₙ)| = n(n − 1) / 2',
  },
  {
    id: 'bipartite',
    name: 'Bipartido Kₘ,ₙ',
    badge: 'V₁ ∪ V₂',
    title: 'Grafo bipartido completo (Kₘ,ₙ)',
    description:
      'Los vértices se dividen en dos conjuntos disjuntos V₁ y V₂ sin aristas internas. Un grafo es bipartido si y sólo si no contiene ciclos de longitud impar.',
    formula: '|V| = m + n   ·   |E| = m · n   ·   sin ciclos impares',
  },
  {
    id: 'disconnected',
    name: 'Conexo vs. disconexo',
    badge: 'componentes',
    title: 'Grafo disconexo con múltiples componentes',
    description:
      'Existen pares de vértices sin ningún camino entre ellos. El grafo se descompone en subgrafos conexos maximales llamados componentes conexas.',
    formula: 'componentes ≥ 2  ⇒  no admite trayectoria de Euler global',
  },
  {
    id: 'euler_circuit',
    name: 'Circuito de Euler',
    badge: 'todos pares',
    title: 'Grafo euleriano: circuito de Euler',
    description:
      'Grafo conexo que admite un recorrido cerrado que pasa por todas las aristas exactamente una vez. Ocurre si y sólo si todos los vértices tienen grado par.',
    formula: 'conexo ∧ ∀v ∈ V, deg(v) es par  ⇔  existe circuito de Euler',
  },
  {
    id: 'euler_path',
    name: 'Camino de Euler',
    badge: '2 impares',
    title: 'Camino de Euler abierto: el sobre',
    description:
      'Recorre todas las aristas exactamente una vez empezando y terminando en vértices distintos. Existe si y sólo si es conexo y tiene exactamente dos vértices de grado impar.',
    formula: 'conexo ∧ exactamente 2 vértices con deg(v) impar',
  },
];

export function getPreset(id: PresetId): PresetDefinition {
  return PRESETS.find((preset) => preset.id === id) ?? PRESETS[0];
}

interface BuiltGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function buildPreset(
  id: PresetId,
  params: PresetParams,
  size: Size,
): BuiltGraph {
  const width = Math.max(size.width, 320);
  const height = Math.max(size.height, 380);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.31;

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  let nextNodeId = 1;
  let nextEdgeId = 1;

  const px = (value: number) => clamp(value, 30, width - 30);
  const py = (value: number) => clamp(value, 34, height - 48);

  const addNode = (
    x: number,
    y: number,
    partition: 1 | 2 | null = null,
  ): number => {
    const nodeId = nextNodeId++;
    nodes.push({
      id: nodeId,
      label: `v${nodeId}`,
      x: px(x),
      y: py(y),
      partition,
    });
    return nodeId;
  };

  const addEdge = (u: number, v: number) => {
    edges.push({ id: nextEdgeId++, u, v });
  };

  if (id === 'simple') {
    [
      [cx - radius * 0.8, cy - radius * 0.6],
      [cx + radius * 0.8, cy - radius * 0.6],
      [cx + radius * 0.9, cy + radius * 0.6],
      [cx - radius * 0.9, cy + radius * 0.6],
      [cx, cy],
    ].forEach(([x, y]) => addNode(x, y));
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [1, 5],
      [2, 5],
      [3, 5],
    ].forEach(([u, v]) => addEdge(u, v));
    return { nodes, edges, directed: false };
  }

  if (id === 'multigraph') {
    [
      [cx - radius * 0.75, cy - radius * 0.45],
      [cx + radius * 0.75, cy - radius * 0.45],
      [cx + radius * 0.65, cy + radius * 0.65],
      [cx - radius * 0.65, cy + radius * 0.65],
    ].forEach(([x, y]) => addNode(x, y));
    addEdge(1, 2);
    addEdge(1, 2);
    addEdge(2, 3);
    addEdge(3, 4);
    addEdge(3, 4);
    addEdge(4, 1);
    addEdge(1, 1);
    addEdge(3, 3);
    return { nodes, edges, directed: false };
  }

  if (id === 'digraph') {
    const n = 5;
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
      addNode(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 1],
      [1, 3],
      [4, 2],
    ].forEach(([u, v]) => addEdge(u, v));
    return { nodes, edges, directed: true };
  }

  if (id === 'complete') {
    const n = clamp(Math.round(params.kn), 3, 7);
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
      addNode(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
    for (let i = 1; i <= n; i++) {
      for (let j = i + 1; j <= n; j++) {
        addEdge(i, j);
      }
    }
    return { nodes, edges, directed: false };
  }

  if (id === 'bipartite') {
    const m = clamp(Math.round(params.km), 1, 5);
    const n = clamp(Math.round(params.kn2), 1, 5);
    const leftX = cx - radius * 0.85;
    const rightX = cx + radius * 0.85;
    const stepM = Math.min(72, (height * 0.62) / Math.max(m, 1));
    const stepN = Math.min(72, (height * 0.62) / Math.max(n, 1));
    const leftIds: number[] = [];
    const rightIds: number[] = [];

    for (let i = 0; i < m; i++) {
      const y = cy + (i - (m - 1) / 2) * stepM;
      leftIds.push(addNode(leftX, y, 1));
    }
    for (let j = 0; j < n; j++) {
      const y = cy + (j - (n - 1) / 2) * stepN;
      rightIds.push(addNode(rightX, y, 2));
    }
    leftIds.forEach((u) => rightIds.forEach((v) => addEdge(u, v)));
    return { nodes, edges, directed: false };
  }

  if (id === 'disconnected') {
    addNode(cx - radius * 0.85, cy - radius * 0.5);
    addNode(cx - radius * 0.35, cy + radius * 0.45);
    addNode(cx - radius * 1.15, cy + radius * 0.45);
    addEdge(1, 2);
    addEdge(2, 3);
    addEdge(3, 1);

    addNode(cx + radius * 0.45, cy - radius * 0.55);
    addNode(cx + radius * 1.05, cy - radius * 0.15);
    addEdge(4, 5);

    addNode(cx + radius * 0.65, cy + radius * 0.65);
    return { nodes, edges, directed: false };
  }

  if (id === 'euler_circuit') {
    // Octaedro: 6 vértices, 12 aristas, todos los grados iguales a 4.
    addNode(cx, cy - radius * 0.98); // v1
    addNode(cx + radius * 0.78, cy - radius * 0.4); // v2
    addNode(cx - radius * 0.78, cy - radius * 0.4); // v3
    addNode(cx - radius * 0.78, cy + radius * 0.4); // v4
    addNode(cx + radius * 0.78, cy + radius * 0.4); // v5
    addNode(cx, cy + radius * 0.98); // v6
    [
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [6, 2],
      [6, 3],
      [6, 4],
      [6, 5],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 2],
    ].forEach(([u, v]) => addEdge(u, v));
    return { nodes, edges, directed: false };
  }

  // Camino de Euler abierto: exactamente dos vértices de grado impar.
  addNode(cx, cy - radius * 0.95);
  addNode(cx - radius * 0.75, cy - radius * 0.25);
  addNode(cx + radius * 0.75, cy - radius * 0.25);
  addNode(cx - radius * 0.75, cy + radius * 0.8);
  addNode(cx + radius * 0.75, cy + radius * 0.8);
  [
    [1, 2],
    [1, 3],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
    [2, 5],
    [3, 4],
  ].forEach(([u, v]) => addEdge(u, v));
  return { nodes, edges, directed: false };
}
