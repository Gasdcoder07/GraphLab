import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { AnalysisPanel } from './components/AnalysisPanel';
import { DefinitionCard } from './components/DefinitionCard';
import { GraphStage } from './components/GraphStage';
import { Header } from './components/Header';
import { MatrixPanel } from './components/MatrixPanel';
import { PresetPanel } from './components/PresetPanel';
import { Toolbar } from './components/Toolbar';
import { getPreset } from './data/presets';
import { analyzeGraph } from './lib/analysis';
import { graphReducer, initialGraphState } from './state/graphReducer';
import type {
  GraphMode,
  MatrixTab,
  PresetId,
  PresetParams,
  Size,
} from './types';

export default function App() {
  const [state, dispatch] = useReducer(
    graphReducer,
    initialGraphState,
  );
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

  return (
    <div className="app">
      <Header
        directed={state.directed}
        showDegrees={state.showDegrees}
        complementActive={state.complement.active}
        canComplement={state.nodes.length > 0}
        onToggleDirected={handleToggleDirected}
        onToggleDegrees={handleToggleDegrees}
        onToggleComplement={handleToggleComplement}
      />

      <main className="app__main">
        <aside className="app__left">
          <PresetPanel
            activePreset={state.activePreset}
            params={state.params}
            onSelectPreset={handlePreset}
            onParamChange={handleParam}
          />
          <DefinitionCard preset={preset} />
        </aside>

        <section className="app__center">
          <Toolbar
            mode={state.mode}
            locked={state.complement.active}
            onMode={handleMode}
            onClear={handleClear}
          />
          <GraphStage
            state={state}
            analysis={analysis}
            onSize={handleSize}
            onAddNode={handleAddNode}
            onMoveNode={handleMoveNode}
            onAddEdge={handleAddEdge}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
            onSetEdgeSource={handleSetEdgeSource}
          />
        </section>

        <aside className="app__right">
          <AnalysisPanel
            analysis={analysis}
            directed={state.directed}
          />
          <MatrixPanel
            state={state}
            analysis={analysis}
            onTab={handleMatrixTab}
          />
        </aside>
      </main>

      <footer className="app__footer">
        <span>GRAFO/LAB · {state.nodes.length}V / {state.edges.length}E</span>
        <span>MODO {state.mode.toUpperCase()}</span>
        <span>{state.directed ? 'DIGRAFO' : 'NO DIRIGIDO'}</span>
        {state.complement.active && <span>VISTA Ḡ</span>}
      </footer>
    </div>
  );
}
