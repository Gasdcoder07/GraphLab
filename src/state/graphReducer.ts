import { buildPreset } from '../data/presets';
import type {
  GraphEdge,
  GraphMode,
  GraphState,
  MatrixTab,
  PresetId,
  PresetParams,
  Size,
} from '../types';

export type GraphAction =
  | { type: 'LOAD_PRESET'; presetId: PresetId; size: Size }
  | { type: 'CLEAR' }
  | { type: 'SET_MODE'; mode: GraphMode }
  | { type: 'ADD_NODE'; x: number; y: number }
  | { type: 'MOVE_NODE'; id: number; x: number; y: number }
  | { type: 'ADD_EDGE'; u: number; v: number }
  | { type: 'DELETE_NODE'; id: number }
  | { type: 'DELETE_EDGE'; id: number }
  | { type: 'SET_EDGE_SOURCE'; id: number | null }
  | { type: 'TOGGLE_DIRECTED' }
  | { type: 'TOGGLE_DEGREES' }
  | { type: 'TOGGLE_COMPLEMENT' }
  | { type: 'SET_PARAM'; key: keyof PresetParams; value: number; size: Size }
  | { type: 'SET_MATRIX_TAB'; tab: MatrixTab }
  | { type: 'RESIZE_GRAPH'; from: Size; to: Size };

export const initialGraphState: GraphState = {
  nodes: [],
  edges: [],
  directed: false,
  showDegrees: true,
  mode: 'move',
  activePreset: 'simple',
  params: {
    kn: 5,
    km: 3,
    kn2: 3,
  },
  matrixTab: 'adj',
  complement: {
    active: false,
    snapshot: null,
  },
  edgeSource: null,
  nextNodeId: 1,
  nextEdgeId: 1,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function graphFromPreset(
  presetId: PresetId,
  params: PresetParams,
  size: Size,
): Pick<
  GraphState,
  | 'nodes'
  | 'edges'
  | 'directed'
  | 'activePreset'
  | 'complement'
  | 'edgeSource'
  | 'nextNodeId'
  | 'nextEdgeId'
> {
  const built = buildPreset(presetId, params, size);
  return {
    nodes: built.nodes,
    edges: built.edges,
    directed: built.directed,
    activePreset: presetId,
    complement: { active: false, snapshot: null },
    edgeSource: null,
    nextNodeId:
      built.nodes.reduce((max, node) => Math.max(max, node.id), 0) + 1,
    nextEdgeId:
      built.edges.reduce((max, edge) => Math.max(max, edge.id), 0) + 1,
  };
}

export function graphReducer(
  state: GraphState,
  action: GraphAction,
): GraphState {
  switch (action.type) {
    case 'LOAD_PRESET':
      return {
        ...state,
        ...graphFromPreset(action.presetId, state.params, action.size),
      };

    case 'CLEAR':
      return {
        ...state,
        nodes: [],
        edges: [],
        mode: 'move',
        complement: { active: false, snapshot: null },
        edgeSource: null,
        nextNodeId: 1,
        nextEdgeId: 1,
      };

    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        edgeSource: null,
      };

    case 'ADD_NODE': {
      if (state.complement.active) return state;
      const id = state.nextNodeId;
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id,
            label: `v${id}`,
            x: action.x,
            y: action.y,
            partition: null,
          },
        ],
        nextNodeId: id + 1,
      };
    }

    case 'MOVE_NODE':
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.id
            ? { ...node, x: action.x, y: action.y }
            : node,
        ),
      };

    case 'ADD_EDGE': {
      if (state.complement.active) return state;
      const exists = state.nodes.some(
        (node) => node.id === action.u || node.id === action.v,
      );
      const uExists = state.nodes.some((node) => node.id === action.u);
      const vExists = state.nodes.some((node) => node.id === action.v);
      if (!exists || !uExists || !vExists) return state;
      const id = state.nextEdgeId;
      return {
        ...state,
        edges: [...state.edges, { id, u: action.u, v: action.v }],
        nextEdgeId: id + 1,
        edgeSource: null,
      };
    }

    case 'DELETE_NODE': {
      if (state.complement.active) return state;
      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.id),
        edges: state.edges.filter(
          (edge) => edge.u !== action.id && edge.v !== action.id,
        ),
        edgeSource:
          state.edgeSource === action.id ? null : state.edgeSource,
      };
    }

    case 'DELETE_EDGE': {
      if (state.complement.active) return state;
      return {
        ...state,
        edges: state.edges.filter((edge) => edge.id !== action.id),
      };
    }

    case 'SET_EDGE_SOURCE':
      return {
        ...state,
        edgeSource: action.id,
      };

    case 'TOGGLE_DIRECTED':
      if (state.complement.active) return state;
      return {
        ...state,
        directed: !state.directed,
      };

    case 'TOGGLE_DEGREES':
      return {
        ...state,
        showDegrees: !state.showDegrees,
      };

    case 'TOGGLE_COMPLEMENT': {
      if (state.nodes.length === 0) return state;

      if (state.complement.active) {
        const snapshot = state.complement.snapshot;
        if (!snapshot) {
          return {
            ...state,
            mode: 'move',
            complement: { active: false, snapshot: null },
            edgeSource: null,
          };
        }
        return {
          ...state,
          edges: snapshot.edges.map((edge) => ({ ...edge })),
          directed: snapshot.directed,
          mode: 'move',
          complement: { active: false, snapshot: null },
          edgeSource: null,
          nextEdgeId:
            snapshot.edges.reduce(
              (max, edge) => Math.max(max, edge.id),
              0,
            ) + 1,
        };
      }

      const snapshot: GraphState['complement']['snapshot'] = {
        edges: state.edges.map((edge) => ({ ...edge })),
        directed: state.directed,
      };
      const existing = new Set<string>();
      snapshot.edges.forEach((edge) => {
        const key = `${Math.min(edge.u, edge.v)}-${Math.max(edge.u, edge.v)}`;
        existing.add(key);
      });

      const complementEdges: GraphEdge[] = [];
      let edgeId = 1;
      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const u = state.nodes[i].id;
          const v = state.nodes[j].id;
          const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
          if (!existing.has(key)) {
            complementEdges.push({ id: edgeId++, u, v });
          }
        }
      }

      return {
        ...state,
        edges: complementEdges,
        directed: false,
        mode: 'move',
        complement: { active: true, snapshot },
        edgeSource: null,
        nextEdgeId: edgeId,
      };
    }

    case 'SET_PARAM': {
      const params: PresetParams = {
        ...state.params,
        [action.key]: action.value,
      };
      const shouldRebuild =
        (state.activePreset === 'complete' && action.key === 'kn') ||
        (state.activePreset === 'bipartite' &&
          (action.key === 'km' || action.key === 'kn2'));

      if (!shouldRebuild) {
        return { ...state, params };
      }

      return {
        ...state,
        params,
        ...graphFromPreset(state.activePreset, params, action.size),
      };
    }

    case 'SET_MATRIX_TAB':
      return {
        ...state,
        matrixTab: action.tab,
      };

    case 'RESIZE_GRAPH': {
      if (
        action.from.width <= 0 ||
        action.from.height <= 0 ||
        state.nodes.length === 0
      ) {
        return state;
      }
      const sx = action.to.width / action.from.width;
      const sy = action.to.height / action.from.height;
      return {
        ...state,
        nodes: state.nodes.map((node) => ({
          ...node,
          x: clamp(node.x * sx, 30, Math.max(30, action.to.width - 30)),
          y: clamp(node.y * sy, 34, Math.max(34, action.to.height - 48)),
        })),
      };
    }

    default:
      return state;
  }
}
