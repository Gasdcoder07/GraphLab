import { AnalysisPanel } from '../components/AnalysisPanel';
import { DefinitionCard } from '../components/DefinitionCard';
import { GraphStage } from '../components/GraphStage';
import { Header } from '../components/Header';
import { MatrixPanel } from '../components/MatrixPanel';
import { PresetPanel } from '../components/PresetPanel';
import { Toolbar } from '../components/Toolbar';
import type { GraphSession } from '../state/useGraphSession';

interface GraphLabProps {
  session: GraphSession;
}

export function GraphLab({ session }: GraphLabProps) {
  const {
    state,
    analysis,
    preset,
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
  } = session;

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
          <AnalysisPanel analysis={analysis} directed={state.directed} />
          <MatrixPanel
            state={state}
            analysis={analysis}
            onTab={handleMatrixTab}
          />
        </aside>
      </main>

      <footer className="app__footer">
        <span>
          GRAFO/LAB · {state.nodes.length}V / {state.edges.length}E
        </span>
        <span>MODO {state.mode.toUpperCase()}</span>
        <span>{state.directed ? 'DIGRAFO' : 'NO DIRIGIDO'}</span>
        {state.complement.active && <span>VISTA Ḡ</span>}
      </footer>
    </div>
  );
}
