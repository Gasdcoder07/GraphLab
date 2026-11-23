import type { GraphMode } from '../types';
import { Icon, type IconName } from './ui/Icon';

interface ToolbarProps {
  mode: GraphMode;
  locked: boolean;
  onMode: (mode: GraphMode) => void;
  onClear: () => void;
}

const TOOLS: Array<{
  mode: GraphMode;
  label: string;
  icon: IconName;
  structural: boolean;
}> = [
  { mode: 'move', label: 'Mover', icon: 'move', structural: false },
  { mode: 'addNode', label: 'Vértice', icon: 'node', structural: true },
  { mode: 'addEdge', label: 'Arista', icon: 'edge', structural: true },
  { mode: 'delete', label: 'Eliminar', icon: 'trash', structural: true },
];

export function Toolbar({
  mode,
  locked,
  onMode,
  onClear,
}: ToolbarProps) {
  return (
    <div className="toolbar panel" role="toolbar" aria-label="Herramientas del lienzo">
      <div className="toolbar__tools">
        {TOOLS.map((tool) => {
          const disabled = locked && tool.structural;
          const active = mode === tool.mode;
          return (
            <button
              key={tool.mode}
              type="button"
              className={`tool ${active ? 'tool--active' : ''}`}
              onClick={() => onMode(tool.mode)}
              disabled={disabled}
              aria-pressed={active}
              title={
                disabled
                  ? 'Vuelve al grafo original para editar la estructura'
                  : tool.label
              }
            >
              <Icon name={tool.icon} size={15} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      <div className="toolbar__actions">
        {locked && (
          <span className="toolbar__lock">
            <Icon name="info" size={12} />
            Vista Ḡ
          </span>
        )}
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onClear}
          title="Vaciar el lienzo"
        >
          <Icon name="clear" size={15} />
          Limpiar
        </button>
      </div>
    </div>
  );
}
