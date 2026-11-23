import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { GraphAnalysis } from '../lib/analysis';
import { GraphRenderer } from '../lib/canvasRenderer';
import type { GraphMode, GraphState, Size } from '../types';
import { Icon } from './ui/Icon';

interface GraphStageProps {
  state: GraphState;
  analysis: GraphAnalysis;
  onSize: (size: Size) => void;
  onAddNode: (x: number, y: number) => void;
  onMoveNode: (id: number, x: number, y: number) => void;
  onAddEdge: (u: number, v: number) => void;
  onDeleteNode: (id: number) => void;
  onDeleteEdge: (id: number) => void;
  onSetEdgeSource: (id: number | null) => void;
}

const HINTS: Record<GraphMode, string> = {
  move: 'Arrastra los vértices. Pasa el cursor para inspeccionar su vecindad.',
  addNode: 'Haz clic en una zona vacía para crear un vértice.',
  addEdge: 'Clic en el origen y luego en el destino. Repite el vértice para crear un bucle.',
  delete: 'Haz clic sobre un vértice o una arista para eliminarlo.',
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function GraphStage({
  state,
  analysis,
  onSize,
  onAddNode,
  onMoveNode,
  onAddEdge,
  onDeleteNode,
  onDeleteEdge,
  onSetEdgeSource,
}: GraphStageProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GraphRenderer | null>(null);

  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const next = {
        width: Math.max(1, Math.round(rect.width)),
        height: Math.max(1, Math.round(rect.height)),
      };
      setSize((previous) =>
        previous.width === next.width && previous.height === next.height
          ? previous
          : next,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (size.width > 0 && size.height > 0) onSize(size);
  }, [size, onSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    rendererRef.current = new GraphRenderer(canvas);
    return () => {
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || size.width <= 0 || size.height <= 0) return;
    renderer.resize(
      size.width,
      size.height,
      window.devicePixelRatio || 1,
    );
  }, [size]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || size.width <= 0 || size.height <= 0) return;
    renderer.draw({
      nodes: state.nodes,
      edges: state.edges,
      directed: state.directed,
      showDegrees: state.showDegrees,
      mode: state.mode,
      complementActive: state.complement.active,
      showBipartition: state.activePreset === 'bipartite',
      hoveredNodeId,
      hoveredEdgeId,
      edgeSource: state.edgeSource,
      pointer,
      analysis,
    });
  }, [
    size,
    state.nodes,
    state.edges,
    state.directed,
    state.showDegrees,
    state.mode,
    state.complement.active,
    state.activePreset,
    state.edgeSource,
    hoveredNodeId,
    hoveredEdgeId,
    pointer,
    analysis,
  ]);

  useEffect(() => {
    setHoveredNodeId(null);
    setHoveredEdgeId(null);
    setPointer(null);
  }, [state.activePreset, state.mode, state.complement.active]);

  useEffect(() => {
    setHoveredNodeId((current) =>
      current !== null &&
      state.nodes.some((node) => node.id === current)
        ? current
        : null,
    );
    setHoveredEdgeId((current) =>
      current !== null &&
      state.edges.some((edge) => edge.id === current)
        ? current
        : null,
    );
  }, [state.nodes, state.edges]);

  const getPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault();
    const point = getPoint(event);
    setPointer(point);
    const renderer = rendererRef.current;
    if (!renderer) return;

    const node = renderer.hitTestNode(point.x, point.y);

    if (state.mode === 'move') {
      if (node) {
        setDraggingId(node.id);
        setHoveredNodeId(node.id);
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      return;
    }

    if (state.complement.active) return;

    if (state.mode === 'addNode') {
      if (!node) onAddNode(point.x, point.y);
      return;
    }

    if (state.mode === 'addEdge') {
      if (!node) {
        onSetEdgeSource(null);
        return;
      }
      if (state.edgeSource === null) {
        onSetEdgeSource(node.id);
      } else {
        onAddEdge(state.edgeSource, node.id);
        setPointer(null);
      }
      return;
    }

    if (state.mode === 'delete') {
      if (node) {
        onDeleteNode(node.id);
        setHoveredNodeId(null);
        return;
      }
      const edge = renderer.hitTestEdge(point.x, point.y);
      if (edge) {
        onDeleteEdge(edge.id);
        setHoveredEdgeId(null);
      }
    }
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const point = getPoint(event);

    if (draggingId !== null) {
      const clamped = {
        x: clamp(point.x, 30, Math.max(30, size.width - 30)),
        y: clamp(point.y, 34, Math.max(34, size.height - 48)),
      };
      setPointer(clamped);
      setHoveredNodeId(draggingId);
      onMoveNode(draggingId, clamped.x, clamped.y);
      return;
    }

    if (state.edgeSource !== null) setPointer(point);

    const node = renderer.hitTestNode(point.x, point.y);
    setHoveredNodeId(node ? node.id : null);

    if (state.mode === 'delete' && !node) {
      const edge = renderer.hitTestEdge(point.x, point.y);
      setHoveredEdgeId(edge ? edge.id : null);
    } else {
      setHoveredEdgeId(null);
    }
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    setDraggingId(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerLeave = () => {
    if (draggingId === null) {
      setHoveredNodeId(null);
      setHoveredEdgeId(null);
      setPointer(null);
    }
  };

  const hoveredNode =
    hoveredNodeId !== null
      ? (state.nodes.find((node) => node.id === hoveredNodeId) ?? null)
      : null;
  const hoveredIndex =
    hoveredNode !== null
      ? analysis.idToIndex.get(hoveredNode.id)
      : undefined;

  let hoverStatus = 'Nodo: ninguno';
  if (hoveredNode && hoveredIndex !== undefined) {
    hoverStatus = state.directed
      ? `${hoveredNode.label} · in ${analysis.inDeg[hoveredIndex]} / out ${analysis.outDeg[hoveredIndex]}`
      : `${hoveredNode.label} · deg ${analysis.deg[hoveredIndex]}`;
  }

  const hint = state.complement.active
    ? 'Vista de complemento Ḡ. Vuelve a G para editar la estructura.'
    : HINTS[state.mode];

  const sourceLabel =
    state.edgeSource !== null
      ? state.nodes.find((node) => node.id === state.edgeSource)?.label
      : null;

  const cursorClass =
    draggingId !== null
      ? 'stage__canvas--grabbing'
      : state.mode === 'move'
        ? 'stage__canvas--grab'
        : state.mode === 'delete'
          ? 'stage__canvas--delete'
          : 'stage__canvas--crosshair';

  const bipartitePreset = state.activePreset === 'bipartite';
  const vertexLegend = state.directed
    ? 'vértice'
    : bipartitePreset
      ? 'V₁'
      : 'par / V₁';

  return (
    <section className="stage panel">
      <div className="stage__wrap" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className={`stage__canvas ${cursorClass}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          role="img"
          aria-label="Lienzo interactivo del grafo. Usa las herramientas para mover, añadir o eliminar vértices y aristas."
        />

        <div className="stage__hint">
          <span className="stage__chip">
            <Icon name="info" size={12} />
            {hint}
          </span>
          {sourceLabel && (
            <span className="stage__chip stage__chip--active">
              ORIGEN: {sourceLabel}
            </span>
          )}
          {state.complement.active && (
            <span className="stage__chip stage__chip--active">
              MOSTRANDO Ḡ
            </span>
          )}
        </div>
      </div>

      <div className="stage__legend">
        <div className="stage__legend-group">
          <span className="legend-item">
            <span className="legend-swatch legend-swatch--white" />
            {vertexLegend}
          </span>
          {!state.directed && !bipartitePreset && (
            <span className="legend-item">
              <span className="legend-swatch legend-swatch--dither" />
              impar / Euler
            </span>
          )}
          {bipartitePreset && (
            <span className="legend-item">
              <span className="legend-swatch legend-swatch--black" />
              V₂ / bipartido
            </span>
          )}
          <span className="legend-item">
            <span className="legend-line" />
            complemento
          </span>
          {state.directed && (
            <span className="legend-item">
              <Icon name="arrow" size={12} />
              digrafo
            </span>
          )}
        </div>
        <span className="stage__status">{hoverStatus}</span>
      </div>
    </section>
  );
}
