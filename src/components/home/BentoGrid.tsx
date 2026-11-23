import { LabDetail } from './LabDetail';
import { LabSelector } from './LabSelector';
import { MathPanel, MethodPanel, RepoPanel } from './HomePanels';
import type { LabId } from '../../data/labs';

interface BentoGridProps {
  selectedLabId: LabId;
  onSelect: (id: LabId) => void;
  onOpenGraph: () => void;
}

export function BentoGrid({
  selectedLabId,
  onSelect,
  onOpenGraph,
}: BentoGridProps) {
  return (
    <div className="home__bento" aria-label="Laboratorios, método y estructura matemática">
      <LabSelector selectedLabId={selectedLabId} onSelect={onSelect} />
      <LabDetail labId={selectedLabId} onOpenGraph={onOpenGraph} />
      <MathPanel />
      <MethodPanel />
      <RepoPanel />
    </div>
  );
}
