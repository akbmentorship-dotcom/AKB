import { useState, useEffect } from 'react';

const COLORS = [
  { label: 'Orange', value: 'var(--orange)' },
  { label: 'Blue',   value: 'var(--blue)' },
  { label: 'Green',  value: 'var(--green)' },
  { label: 'Purple', value: 'var(--purple)' },
  { label: 'Yellow', value: 'var(--yellow)' },
  { label: 'Red',    value: 'var(--red)' },
];

export default function HabitForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [color, setColor] = useState(initial?.color || 'var(--orange)');

  useEffect(() => {
    setName(initial?.name || '');
    setColor(initial?.color || 'var(--orange)');
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), color });
  };

  return (
    <div className="card" style={{ marginTop: 12, border: '1px solid var(--orange-border)', background: 'var(--orange-dim)' }}>
      <form onSubmit={handleSubmit}>
        <label className="lbl">Habit Name</label>
        <input
          className="inp"
          placeholder="e.g. Read 10 pages"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />

        <label className="lbl">Color</label>
        <div className="pills" style={{ marginBottom: 16 }}>
          {COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              style={{
                width: 28, height: 28, borderRadius: '50%', border: `3px solid ${color === c.value ? '#fff' : 'transparent'}`,
                background: c.value, cursor: 'pointer', padding: 0,
              }}
              aria-label={c.label}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-sm" style={{ background: 'none', borderColor: 'var(--border)', color: 'var(--muted)' }} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-sm"
            style={{ flex: 1, background: 'var(--orange-dim)', borderColor: 'var(--orange-border)', color: 'var(--orange)' }}
          >
            {initial ? 'Save' : 'Add Habit'}
          </button>
        </div>
      </form>
    </div>
  );
}
