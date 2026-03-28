import { useState } from 'react';
import SetRow from './SetRow.jsx';
import { BLOCK_COLORS } from './workoutData.js';

export default function ExerciseBlock({ block, dayId, log, onLogChange }) {
  const [expanded, setExpanded] = useState(true);
  const color = BLOCK_COLORS[block.t] || 'var(--muted)';

  return (
    <div className="card" style={{ marginBottom: 12, padding: '12px 14px' }}>
      {/* Block header */}
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: expanded ? 12 : 0 }}
        onClick={() => setExpanded(v => !v)}
      >
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color, marginBottom: 2 }}>
            {block.lbl}
          </div>
          {block.note && (
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{block.note}</div>
          )}
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && block.exs.map(ex => {
        const exLog = log[ex.id] || { sets: Array.from({ length: ex.sets }, () => ({ w: '', r: '' })) };

        const updateSet = (setIdx, newSet) => {
          const newSets = exLog.sets.map((s, i) => i === setIdx ? newSet : s);
          onLogChange(ex.id, { sets: newSets });
        };

        const addSet = () => {
          onLogChange(ex.id, { sets: [...exLog.sets, { w: '', r: '' }] });
        };

        const removeLastSet = () => {
          if (exLog.sets.length <= 1) return;
          onLogChange(ex.id, { sets: exLog.sets.slice(0, -1) });
        };

        return (
          <div key={ex.id} style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{ex.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                {ex.sets}×{ex.reps}{ex.note ? ` · ${ex.note}` : ''}
              </div>
            </div>

            {/* Set header */}
            <div className="set-row" style={{ marginBottom: 6 }}>
              <span />
              <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weight</span>
              <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reps</span>
            </div>

            {exLog.sets.map((set, i) => (
              <SetRow key={i} index={i} set={set} onChange={(s) => updateSet(i, s)} />
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                className="btn btn-sm"
                style={{ fontSize: 10, padding: '5px 10px', background: 'var(--green-dim)', borderColor: 'var(--green-border)', color: 'var(--green)' }}
                onClick={addSet}
              >
                + Set
              </button>
              {exLog.sets.length > 1 && (
                <button
                  className="btn btn-sm"
                  style={{ fontSize: 10, padding: '5px 10px', background: 'none', borderColor: 'var(--border)', color: 'var(--muted)' }}
                  onClick={removeLastSet}
                >
                  − Set
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
