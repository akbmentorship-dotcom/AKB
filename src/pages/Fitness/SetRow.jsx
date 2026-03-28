export default function SetRow({ index, set, onChange, onRemove }) {
  return (
    <div className="set-row">
      <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textAlign: 'center' }}>{index + 1}</span>
      <input
        className="set-inp"
        type="number"
        inputMode="decimal"
        placeholder="lbs"
        value={set.w}
        onChange={e => onChange({ ...set, w: e.target.value })}
        aria-label="Weight"
      />
      <input
        className="set-inp"
        type="number"
        inputMode="numeric"
        placeholder="reps"
        value={set.r}
        onChange={e => onChange({ ...set, r: e.target.value })}
        aria-label="Reps"
      />
    </div>
  );
}
