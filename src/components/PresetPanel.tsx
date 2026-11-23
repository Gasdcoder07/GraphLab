import { PRESETS } from '../data/presets';
import type { PresetId, PresetParams } from '../types';
import { Slider } from './ui/Slider';

interface PresetPanelProps {
  activePreset: PresetId;
  params: PresetParams;
  onSelectPreset: (preset: PresetId) => void;
  onParamChange: (key: keyof PresetParams, value: number) => void;
}

export function PresetPanel({
  activePreset,
  params,
  onSelectPreset,
  onParamChange,
}: PresetPanelProps) {
  const showKn = activePreset === 'complete';
  const showKmn = activePreset === 'bipartite';

  return (
    <section className="panel">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">01 / FAMILIAS</span>
          <h2 className="panel__title">Tipos de grafo</h2>
        </div>
        <span className="panel__meta">{PRESETS.length}</span>
      </div>

      <div className="panel__body">
        <div className="preset-list">
          {PRESETS.map((preset) => {
            const active = preset.id === activePreset;
            return (
              <button
                key={preset.id}
                type="button"
                className={`preset ${active ? 'preset--active' : ''}`}
                onClick={() => onSelectPreset(preset.id)}
                aria-pressed={active}
                title={preset.title}
              >
                <span className="preset__name">{preset.name}</span>
                <span className="preset__badge">{preset.badge}</span>
              </button>
            );
          })}
        </div>

        {(showKn || showKmn) && (
          <div className="preset-params">
            <div className="preset-params__head">
              <span>PARÁMETROS</span>
              <span className="preset-params__hint">
                {showKn ? 'Kₙ' : 'Kₘ,ₙ'}
              </span>
            </div>

            {showKn && (
              <Slider
                label="Orden n de Kₙ"
                value={params.kn}
                min={3}
                max={7}
                onChange={(value) => onParamChange('kn', value)}
              />
            )}

            {showKmn && (
              <>
                <Slider
                  label="Partición |V₁| = m"
                  value={params.km}
                  min={1}
                  max={5}
                  onChange={(value) => onParamChange('km', value)}
                />
                <Slider
                  label="Partición |V₂| = n"
                  value={params.kn2}
                  min={1}
                  max={5}
                  onChange={(value) => onParamChange('kn2', value)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
