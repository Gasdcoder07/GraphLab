interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  title?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  title,
}: ToggleProps) {
  return (
    <label
      className={`toggle ${disabled ? 'toggle--disabled' : ''}`}
      title={title}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      <span className="toggle__label">{label}</span>
    </label>
  );
}
