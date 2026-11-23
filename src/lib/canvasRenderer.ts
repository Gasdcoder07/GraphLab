import type { GraphAnalysis } from './analysis';
import type { GraphEdge, GraphMode, GraphNode } from '../types';
import { BAYER_8, makeDitherCanvas } from './dither';

const NODE_RADIUS = 20;
const NODE_HOVER_RADIUS = 22;
const NODE_HIT_RADIUS = 26;
const EDGE_CURVE_STEP = 34;
const DEGREE_GAP = 6;

export interface Scene {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
  showDegrees: boolean;
  mode: GraphMode;
  complementActive: boolean;
  showBipartition: boolean;
  hoveredNodeId: number | null;
  hoveredEdgeId: number | null;
  edgeSource: number | null;
  pointer: { x: number; y: number } | null;
  analysis: GraphAnalysis;
}

interface EdgeGeometry {
  edge: GraphEdge;
  uNode: GraphNode;
  vNode: GraphNode;
  loop: boolean;
  loopRadius: number;
  loopOffsetY: number;
  control: { x: number; y: number } | null;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string,
): void {
  const headLength = 10;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x - headLength * Math.cos(angle - Math.PI / 6),
    y - headLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    x - headLength * Math.cos(angle + Math.PI / 6),
    y - headLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function distanceToSegment(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(x - x1, y - y1);
  let t = ((x - x1) * dx + (y - y1) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function distanceToQuadratic(
  x: number,
  y: number,
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
): number {
  let best = Number.POSITIVE_INFINITY;
  let previous = start;
  for (let step = 1; step <= 24; step++) {
    const t = step / 24;
    const mt = 1 - t;
    const px = mt * mt * start.x + 2 * mt * t * control.x + t * t * end.x;
    const py = mt * mt * start.y + 2 * mt * t * control.y + t * t * end.y;
    best = Math.min(
      best,
      distanceToSegment(x, y, previous.x, previous.y, px, py),
    );
    previous = { x: px, y: py };
  }
  return best;
}

function buildEdgeGeometries(
  nodes: GraphNode[],
  edges: GraphEdge[],
): EdgeGeometry[] {
  const nodeMap = new Map<number, GraphNode>();
  nodes.forEach((node) => nodeMap.set(node.id, node));

  const groups = new Map<string, GraphEdge[]>();
  edges.forEach((edge) => {
    const key =
      edge.u === edge.v
        ? `loop-${edge.u}`
        : `${Math.min(edge.u, edge.v)}-${Math.max(edge.u, edge.v)}`;
    const group = groups.get(key);
    if (group) group.push(edge);
    else groups.set(key, [edge]);
  });

  const geometries: EdgeGeometry[] = [];

  groups.forEach((group) => {
    group.forEach((edge, index) => {
      const uNode = nodeMap.get(edge.u);
      const vNode = nodeMap.get(edge.v);
      if (!uNode || !vNode) return;

      if (uNode.id === vNode.id) {
        geometries.push({
          edge,
          uNode,
          vNode,
          loop: true,
          loopRadius: 18 + index * 7,
          loopOffsetY: -24 - index * 5,
          control: null,
        });
        return;
      }

      const total = group.length;
      const curveOffset =
        total === 1 ? 0 : (index - (total - 1) / 2) * EDGE_CURVE_STEP;
      const midX = (uNode.x + vNode.x) / 2;
      const midY = (uNode.y + vNode.y) / 2;
      const dx = vNode.x - uNode.x;
      const dy = vNode.y - uNode.y;
      const length = Math.hypot(dx, dy) || 1;
      const normalX = -dy / length;
      const normalY = dx / length;

      geometries.push({
        edge,
        uNode,
        vNode,
        loop: false,
        loopRadius: 0,
        loopOffsetY: 0,
        control:
          curveOffset === 0
            ? null
            : {
                x: midX + normalX * curveOffset,
                y: midY + normalY * curveOffset,
              },
      });
    });
  });

  return geometries;
}

export class GraphRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private background: HTMLCanvasElement | null = null;
  private patterns = new Map<string, CanvasPattern>();
  private geometries: EdgeGeometry[] = [];
  private nodes: GraphNode[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo obtener el contexto 2D del canvas.');
    this.ctx = ctx;
  }

  resize(width: number, height: number, dpr: number): void {
    if (width <= 0 || height <= 0) return;
    this.width = width;
    this.height = height;
    this.canvas.width = Math.max(1, Math.round(width * dpr));
    this.canvas.height = Math.max(1, Math.round(height * dpr));
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.background = this.buildBackground();
    this.patterns.clear();
  }

  draw(scene: Scene): void {
    if (this.width <= 0 || this.height <= 0) return;
    const { ctx } = this;

    ctx.clearRect(0, 0, this.width, this.height);
    if (this.background) {
      ctx.drawImage(this.background, 0, 0, this.width, this.height);
    }

    this.nodes = scene.nodes;
    this.geometries = buildEdgeGeometries(scene.nodes, scene.edges);
    this.drawEdges(scene);
    this.drawEdgeGuide(scene);
    this.drawNodes(scene);

    if (scene.nodes.length === 0) {
      this.drawEmptyState();
    }
  }

  hitTestNode(x: number, y: number): GraphNode | null {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      if (Math.hypot(node.x - x, node.y - y) <= NODE_HIT_RADIUS) {
        return node;
      }
    }
    return null;
  }

  hitTestEdge(x: number, y: number): GraphEdge | null {
    for (let i = this.geometries.length - 1; i >= 0; i--) {
      const geometry = this.geometries[i];
      if (geometry.loop) {
        const centerX = geometry.uNode.x;
        const centerY = geometry.uNode.y + geometry.loopOffsetY;
        const distance = Math.hypot(x - centerX, y - centerY);
        if (Math.abs(distance - geometry.loopRadius) <= 11) {
          return geometry.edge;
        }
        continue;
      }

      const distance = geometry.control
        ? distanceToQuadratic(
            x,
            y,
            geometry.uNode,
            geometry.control,
            geometry.vNode,
          )
        : distanceToSegment(
            x,
            y,
            geometry.uNode.x,
            geometry.uNode.y,
            geometry.vNode.x,
            geometry.vNode.y,
          );
      if (distance <= 9) return geometry.edge;
    }
    return null;
  }

  private pattern(
    foreground: string,
    background: string | null,
    density: number,
    cellSize = 1,
  ): CanvasPattern | null {
    const key = `${foreground}|${background ?? 'none'}|${density}|${cellSize}`;
    const cached = this.patterns.get(key);
    if (cached) return cached;
    const tile = makeDitherCanvas(
      foreground,
      background,
      density,
      8,
      cellSize,
    );
    const pattern = this.ctx.createPattern(tile, 'repeat');
    if (pattern) this.patterns.set(key, pattern);
    return pattern;
  }

  private buildBackground(): HTMLCanvasElement {
    const width = Math.max(1, Math.round(this.width));
    const height = Math.max(1, Math.round(this.height));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const image = ctx.createImageData(width, height);
    const data = image.data;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = x / width - 0.5;
        const ny = y / height - 0.32;
        const distance = Math.min(
          1,
          Math.hypot(nx * 1.15, ny * 1.35) / 0.78,
        );
        const brightness = 10 + 36 * Math.pow(1 - distance, 2.2);
        const threshold = (BAYER_8[y & 7][x & 7] + 0.5) / 64;
        const on = brightness / 255 > threshold;
        const value = on ? 40 : 8;
        const offset = (y * width + x) * 4;
        data[offset] = value;
        data[offset + 1] = value;
        data[offset + 2] = value;
        data[offset + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.075)';
    for (let x = 14; x < width; x += 24) {
      for (let y = 14; y < height; y += 24) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }

    return canvas;
  }

  private drawEdges(scene: Scene): void {
    const { ctx } = this;
    const hoveredNodeId = scene.hoveredNodeId;

    this.geometries.forEach((geometry) => {
      const incident =
        hoveredNodeId !== null &&
        (geometry.uNode.id === hoveredNodeId ||
          geometry.vNode.id === hoveredNodeId);
      const highlighted =
        incident || scene.hoveredEdgeId === geometry.edge.id;
      const dimmed =
        hoveredNodeId !== null &&
        !incident &&
        scene.hoveredEdgeId !== geometry.edge.id;

      const color = highlighted
        ? '#ffffff'
        : scene.complementActive
          ? 'rgba(235, 235, 235, 0.58)'
          : 'rgba(165, 165, 165, 0.7)';

      ctx.save();
      ctx.globalAlpha = dimmed ? 0.24 : 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = highlighted ? 2.4 : 1.4;
      ctx.setLineDash(scene.complementActive ? [5, 5] : []);

      if (geometry.loop) {
        const centerX = geometry.uNode.x;
        const centerY = geometry.uNode.y + geometry.loopOffsetY;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          geometry.loopRadius,
          0,
          Math.PI * 2,
        );
        ctx.stroke();

        if (scene.directed) {
          drawArrowHead(
            ctx,
            centerX + geometry.loopRadius - 2,
            centerY,
            Math.PI / 2,
            color,
          );
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(geometry.uNode.x, geometry.uNode.y);
        if (geometry.control) {
          ctx.quadraticCurveTo(
            geometry.control.x,
            geometry.control.y,
            geometry.vNode.x,
            geometry.vNode.y,
          );
        } else {
          ctx.lineTo(geometry.vNode.x, geometry.vNode.y);
        }
        ctx.stroke();

        if (scene.directed) {
          const angle = geometry.control
            ? Math.atan2(
                geometry.vNode.y - geometry.control.y,
                geometry.vNode.x - geometry.control.x,
              )
            : Math.atan2(
                geometry.vNode.y - geometry.uNode.y,
                geometry.vNode.x - geometry.uNode.x,
              );
          drawArrowHead(
            ctx,
            geometry.vNode.x - NODE_RADIUS * Math.cos(angle),
            geometry.vNode.y - NODE_RADIUS * Math.sin(angle),
            angle,
            color,
          );
        }
      }

      ctx.restore();
    });
  }

  private drawEdgeGuide(scene: Scene): void {
    if (
      scene.mode !== 'addEdge' ||
      scene.edgeSource === null ||
      !scene.pointer
    ) {
      return;
    }
    const source = scene.nodes.find((node) => node.id === scene.edgeSource);
    if (!source) return;

    const { ctx } = this;
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(scene.pointer.x, scene.pointer.y);
    ctx.stroke();

    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(source.x, source.y, NODE_RADIUS + 7, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(scene.pointer.x, scene.pointer.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawNodes(scene: Scene): void {
    const { ctx } = this;
    const hoveredNodeId = scene.hoveredNodeId;
    const neighborIds = new Set<number>();
    if (hoveredNodeId !== null) {
      scene.edges.forEach((edge) => {
        if (edge.u === hoveredNodeId) neighborIds.add(edge.v);
        if (edge.v === hoveredNodeId) neighborIds.add(edge.u);
      });
    }

    scene.nodes.forEach((node, index) => {
      const degree = scene.analysis.deg[index] ?? 0;
      const isHovered = hoveredNodeId === node.id;
      const isNeighbor = neighborIds.has(node.id);
      const isSource = scene.edgeSource === node.id;
      const isV2 =
        node.partition === 2 ||
        (scene.showBipartition &&
          scene.analysis.isBipartite &&
          scene.analysis.bipartiteColors[index] === 2);
      const isOdd =
        !scene.directed && degree > 0 && degree % 2 !== 0;
      const radius =
        isHovered || isSource ? NODE_HOVER_RADIUS : NODE_RADIUS;
      const inverted = isHovered || isSource;

      if (isHovered || isNeighbor || isSource) {
        ctx.save();
        ctx.globalAlpha = isHovered || isSource ? 0.55 : 0.24;
        const halo = this.pattern('#ffffff', null, 0.3);
        ctx.fillStyle = halo ?? 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      let fill: string | CanvasPattern = inverted
        ? '#0a0a0a'
        : '#f2f2f2';
      let labelColor = inverted ? '#ffffff' : '#000000';

      if (isV2) {
        fill = inverted ? '#f2f2f2' : '#0a0a0a';
        labelColor = inverted ? '#000000' : '#ffffff';
      } else if (isOdd && !inverted) {
        fill =
          this.pattern('#000000', '#f2f2f2', 0.26, 2) ??
          '#f2f2f2';
        labelColor = '#000000';
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();

      if (isOdd && !inverted) {
        // Núcleo sólido para mantener legible la etiqueta sobre el semitono.
        ctx.beginPath();
        ctx.arc(node.x, node.y, 11.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f2f2f2';
        ctx.fill();
      }

      const darkFill = inverted || (isV2 && !inverted);
      ctx.lineWidth = inverted ? 2.4 : 2;
      ctx.strokeStyle = darkFill ? '#ffffff' : '#000000';
      ctx.stroke();

      if (isOdd || isV2) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.setLineDash(isV2 ? [2, 4] : []);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (isSource) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = labelColor;
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y + 0.5);

      if (scene.showDegrees) {
        const inDegree = scene.analysis.inDeg[index] ?? 0;
        const outDegree = scene.analysis.outDeg[index] ?? 0;
        const text = scene.directed
          ? `−${inDegree} +${outDegree}`
          : `deg ${degree}`;
        ctx.font = '600 9px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(text).width;
        const badgeWidth = textWidth + 10;
        const badgeHeight = 16;
        const above = node.y + radius + badgeHeight + 12 > this.height;
        const badgeX = node.x - badgeWidth / 2;
        const badgeY = above
          ? node.y - radius - badgeHeight - DEGREE_GAP
          : node.y + radius + DEGREE_GAP;

        ctx.save();
        ctx.fillStyle = 'rgba(5, 5, 5, 0.94)';
        ctx.strokeStyle = isOdd
          ? '#ffffff'
          : 'rgba(125, 125, 125, 0.7)';
        ctx.lineWidth = 1;
        roundRect(
          ctx,
          badgeX,
          badgeY,
          badgeWidth,
          badgeHeight,
          2,
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isOdd ? '#ffffff' : '#d8d8d8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          text,
          node.x,
          badgeY + badgeHeight / 2 + 0.5,
        );
        ctx.restore();
      }
    });
  }

  private drawEmptyState(): void {
    const { ctx } = this;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    ctx.save();
    ctx.globalAlpha = 0.5;
    const tile = this.pattern('#ffffff', null, 0.32, 2);
    ctx.fillStyle = tile ?? 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(centerX - 44, centerY - 64, 88, 26);
    ctx.restore();

    ctx.fillStyle = '#e8e8e8';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SIN VÉRTICES', centerX, centerY - 16);

    ctx.fillStyle = '#8a8a8a';
    ctx.font = '400 10px "JetBrains Mono", monospace';
    ctx.fillText(
      'ELIGE UNA FAMILIA O USA + VÉRTICE',
      centerX,
      centerY + 8,
    );
  }
}
