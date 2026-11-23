import type { LabId } from '../../data/labs';
import { LABS, STATUS_LABEL } from '../../data/labs';
import type { LabModule } from '../../data/labs';
import { Icon } from '../ui/Icon';

interface LabSelectorProps {
  selectedLabId: LabId;
  onSelect: (id: LabId) => void;
}

function LabTab({
  lab,
  selected,
  onSelect,
}: {
  lab: LabModule;
  selected: boolean;
  onSelect: (id: LabId) => void;
}) {
  const buttonId = `lab-tab-${lab.id}-button`;

  return (
    <button
      type="button"
      id={buttonId}
      role="tab"
      aria-selected={selected}
      aria-controls="lab-panel"
      tabIndex={selected ? 0 : -1}
      className={`lab-tab ${selected ? 'lab-tab--selected' : ''}`}
      onClick={() => onSelect(lab.id)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const currentIndex = LABS.findIndex((item) => item.id === lab.id);
          const next = (currentIndex + 1) % LABS.length;
          const nextLab = LABS[next];
          const nextButton = document.getElementById(
            `lab-tab-${nextLab.id}-button`,
          ) as HTMLButtonElement | null;
          nextButton?.focus();
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          const currentIndex = LABS.findIndex((item) => item.id === lab.id);
          const next = (currentIndex - 1 + LABS.length) % LABS.length;
          const nextLab = LABS[next];
          const nextButton = document.getElementById(
            `lab-tab-${nextLab.id}-button`,
          ) as HTMLButtonElement | null;
          nextButton?.focus();
        }
      }}
    >
      <span className="lab-tab__index">{lab.index}</span>
      <span className="lab-tab__main">
        <span className="lab-tab__name">{lab.name}</span>
        <span className="lab-tab__summary">{lab.summary}</span>
      </span>
      <span className="lab-tab__status">{STATUS_LABEL[lab.status]}</span>
      <Icon name="arrow" size={14} />
    </button>
  );
}

export function LabSelector({ selectedLabId, onSelect }: LabSelectorProps) {
  return (
    <section className="panel home-panel home-panel--selector lab-selector" id="laboratorios">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">01 / LABORATORIOS</span>
          <h2 className="panel__title">Selector de laboratorio</h2>
        </div>
        <span className="panel__meta">{LABS.length}</span>
      </div>

      <div className="panel__body lab-tabs">
        <div
          className="lab-tabs__list"
          role="tablist"
          aria-label="Laboratorios del proyecto"
        >
          {LABS.map((lab) => (
            <LabTab
              key={lab.id}
              lab={lab}
              selected={lab.id === selectedLabId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
