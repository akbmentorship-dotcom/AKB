import { useState } from 'react';
import { storageGet, storageSet } from '../../lib/storage.js';

export default function BasketballDay({ date }) {
  const key = `fitness:basketball:${date}`;
  const [log, setLog] = useState(() => storageGet(key, { logged: false, notes: '' }));

  const toggle = () => {
    const next = { ...log, logged: !log.logged };
    setLog(next);
    storageSet(key, next);
  };

  const updateNotes = (notes) => {
    const next = { ...log, notes };
    setLog(next);
    storageSet(key, next);
  };

  return (
    <div>
      <div className="card" style={{ borderColor: 'var(--green-border)', background: 'var(--green-dim)', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 4 }}>
          Active Recovery
        </div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Basketball</div>
        <div style={{ fontSize: 12, color: 'var(--light)', marginTop: 2 }}>Cardio + agility + competitive fun</div>
      </div>

      <button
        className="card tap"
        style={{
          width: '100%', textAlign: 'center', padding: 24, cursor: 'pointer',
          borderColor: log.logged ? 'var(--green-border)' : 'var(--border)',
          background: log.logged ? 'var(--green-dim)' : 'var(--card)',
        }}
        onClick={toggle}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>{log.logged ? '🏀' : '⭕'}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: log.logged ? 'var(--green)' : 'var(--muted)' }}>
          {log.logged ? 'Session Logged ✓' : 'Tap to Log Session'}
        </div>
      </button>

      {log.logged && (
        <div style={{ marginTop: 12 }}>
          <label className="lbl">Notes (optional)</label>
          <textarea
            className="inp"
            placeholder="How'd it go?"
            rows={3}
            value={log.notes}
            onChange={e => updateNotes(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
