export type NodePartition = 1 | 2 | null;

export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
  partition: NodePartition;
}

export interface GraphEdge {
  id: number;
  u: number;
  v: number;
}

export type GraphMode = 'move' | 'addNode' | 'addEdge' | 'delete';

export type MatrixTab = 'adj' | 'inc';

export type PresetId =
  | 'simple'
  | 'multigraph'
  | 'digraph'
  | 'complete'
  | 'bipartite'
  | 'disconnected'
  | 'euler_circuit'
  | 'euler_path';

export interface PresetParams {
  kn: number;
  km: number;
  kn2: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ComplementSnapshot {
  edges: GraphEdge[];
  directed: boolean;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
  showDegrees: boolean;
  mode: GraphMode;
  activePreset: PresetId;
  params: PresetParams;
  matrixTab: MatrixTab;
  complement: {
    active: boolean;
    snapshot: ComplementSnapshot | null;
  };
  edgeSource: number | null;
  nextNodeId: number;
  nextEdgeId: number;
}
