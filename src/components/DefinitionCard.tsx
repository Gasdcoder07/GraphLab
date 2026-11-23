import type { PresetDefinition } from '../data/presets';

interface DefinitionCardProps {
  preset: PresetDefinition;
}

export function DefinitionCard({ preset }: DefinitionCardProps) {
  return (
    <section className="panel definition">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">DEFINICIÓN FORMAL</span>
          <h2 className="panel__title">Marco matemático</h2>
        </div>
        <span className="definition__index">§</span>
      </div>

      <div className="panel__body">
        <div className="definition__tag">{preset.badge}</div>
        <h3 className="definition__title">{preset.title}</h3>
        <p className="definition__desc">{preset.description}</p>
        <div className="definition__formula">
          <span className="definition__prompt">&gt;</span>
          <code>{preset.formula}</code>
          <span className="definition__cursor" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
