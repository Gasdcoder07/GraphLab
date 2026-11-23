import { Icon } from './Icon';

interface BadgeProps {
  label: string;
  value: string;
  ok: boolean;
  wide?: boolean;
}

export function Badge({ label, value, ok, wide = false }: BadgeProps) {
  return (
    <div
      className={`badge ${ok ? 'badge--ok' : 'badge--no'} ${
        wide ? 'badge--wide' : ''
      }`}
    >
      <span className="badge__label">{label}</span>
      <span className="badge__value">
        <Icon name={ok ? 'check' : 'x'} size={11} />
        {value}
      </span>
    </div>
  );
}
