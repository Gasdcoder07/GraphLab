interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderProps) {
  return (
    <label className="slider">
      <span className="slider__row">
        <span className="slider__label">{label}</span>
        <span className="slider__value">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="slider__range" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </label>
  );
}
