import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { getPreset } from '../data/presets';
import { analyzeGraph } from '../lib/analysis';
import { graphReducer, initialGraphState } from './graphReducer';
import type {
  GraphMode,
  MatrixTab,
  PresetId,
  PresetParams,
  Size,
} from '../types';

export function useGraphSession() {
  const [state, dispatch] = useReducer(graphReducer, initialGraphState);
  const [canvasSize, setCanvasSize] = useState<Size | null>(null);
  const initializedRef = useRef(false);
  const previousSizeRef = useRef<Size | null>(null);

  const handleSize = useCallback((size: Size) => {
    setCanvasSize(size);
  }, []);

  useEffect(() => {
    if (!canvasSize) return;
    const previous = previousSizeRef.current;

    if (!initializedRef.current) {
      initializedRef.current = true;
      previousSizeRef.current = canvasSize;
      dispatch({
        type: 'LOAD_PRESET',
        presetId: 'simple',
        size: canvasSize,
      });
      return;
    }

    if (
      previous &&
      (previous.width !== canvasSize.width ||
        previous.height !== canvasSize.height)
    ) {
      dispatch({
        type: 'RESIZE_GRAPH',
        from: previous,
        to: canvasSize,
      });
    }
    previousSizeRef.current = canvasSize;
  }, [canvasSize]);

  const analysis = useMemo(
    () => analyzeGraph(state.nodes, state.edges, state.directed),
    [state.nodes, state.edges, state.directed],
  );

  const preset = useMemo(
    () => getPreset(state.activePreset),
    [state.activePreset],
  );

  const handlePreset = useCallback(
    (presetId: PresetId) => {
      if (!canvasSize) return;
      dispatch({ type: 'LOAD_PRESET', presetId, size: canvasSize });
    },
    [canvasSize],
  );

  const handleParam = useCallback(
    (key: keyof PresetParams, value: number) => {
      if (!canvasSize) return;
      dispatch({ type: 'SET_PARAM', key, value, size: canvasSize });
    },
    [canvasSize],
  );

  const handleAddNode = useCallback((x: number, y: number) => {
    dispatch({ type: 'ADD_NODE', x, y });
  }, []);

  const handleMoveNode = useCallback(
    (id: number, x: number, y: number) => {
      dispatch({ type: 'MOVE_NODE', id, x, y });
    },
    [],
  );

  const handleAddEdge = useCallback((u: number, v: number) => {
    dispatch({ type: 'ADD_EDGE', u, v });
  }, []);

  const handleDeleteNode = useCallback((id: number) => {
    dispatch({ type: 'DELETE_NODE', id });
  }, []);

  const handleDeleteEdge = useCallback((id: number) => {
    dispatch({ type: 'DELETE_EDGE', id });
  }, []);

  const handleSetEdgeSource = useCallback((id: number | null) => {
    dispatch({ type: 'SET_EDGE_SOURCE', id });
  }, []);

  const handleMode = useCallback((mode: GraphMode) => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const handleToggleDirected = useCallback(() => {
    dispatch({ type: 'TOGGLE_DIRECTED' });
  }, []);

  const handleToggleDegrees = useCallback(() => {
    dispatch({ type: 'TOGGLE_DEGREES' });
  }, []);

  const handleToggleComplement = useCallback(() => {
    dispatch({ type: 'TOGGLE_COMPLEMENT' });
  }, []);

  const handleMatrixTab = useCallback((tab: MatrixTab) => {
    dispatch({ type: 'SET_MATRIX_TAB', tab });
  }, []);

  return {
    state,
    analysis,
    preset,
    canvasSize,
    handleSize,
    handlePreset,
    handleParam,
    handleAddNode,
    handleMoveNode,
    handleAddEdge,
    handleDeleteNode,
    handleDeleteEdge,
    handleSetEdgeSource,
    handleMode,
    handleClear,
    handleToggleDirected,
    handleToggleDegrees,
    handleToggleComplement,
    handleMatrixTab,
  };
}

export type GraphSession = ReturnType<typeof useGraphSession>;
