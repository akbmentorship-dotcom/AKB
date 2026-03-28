import { useState } from 'react';

export default function HabitRow({ habit, checked, streak, onToggle, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="habit-row">
      {/* Color dot */}
      <div className="color-dot" style={{ background: habit.color }} />

      {/* Name + streak */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{habit.name}</div>
        {streak > 0 && (
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
            🔥 {streak} day streak
          </div>
        )}
      </div>

      {/* Actions */}
      {!confirmDelete ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}
            onClick={() => onEdit(habit)}
          >
            ✎
          </button>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}
            onClick={() => setConfirmDelete(true)}
          >
            ✕
          </button>

          {/* Checkbox */}
          <button
            className={`checkbox${checked ? ' checked' : ''}`}
            onClick={() => onToggle(habit.id)}
            aria-label={checked ? 'Uncheck habit' : 'Check habit'}
            style={{ borderColor: checked ? habit.color : undefined, background: checked ? habit.color : undefined }}
          >
            {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, cursor: 'pointer' }}
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </button>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            onClick={() => onDelete(habit.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
