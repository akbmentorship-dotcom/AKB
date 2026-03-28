import { useState } from 'react';
import { storageGet, storageSet } from '../../lib/storage.js';
import { getToday } from '../../lib/dates.js';
import SectionHead from '../../components/ui/SectionHead.jsx';

const ITEMS = [
  { id: 'responded', label: 'Responded to all messages' },
  { id: 'resources', label: 'Requested resources' },
  { id: 'calendar',  label: 'Checked calendar' },
  { id: 'meetings',  label: 'Sent meeting links' },
];

export default function AdminChecklist() {
  const today = getToday();
  const key = `admin:${today}`;
  const [checks, setChecks] = useState(() => storageGet(key, {}));

  const toggle = (id) => {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    storageSet(key, next);
  };

  const doneCount = ITEMS.filter(i => checks[i.id]).length;

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionHead label={`Admin — ${doneCount}/${ITEMS.length}`} color="var(--blue)" />
      <div className="card">
        {ITEMS.map((item, i) => (
          <div key={item.id} className="check-item" style={i === 0 ? { paddingTop: 4 } : {}}>
            <button
              className={`checkbox${checks[item.id] ? ' checked' : ''}`}
              onClick={() => toggle(item.id)}
              aria-label={item.label}
              style={{ borderColor: checks[item.id] ? 'var(--blue)' : undefined, background: checks[item.id] ? 'var(--blue)' : undefined }}
            >
              {checks[item.id] && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
            </button>
            <span
              className={`check-label${checks[item.id] ? ' done' : ''}`}
              onClick={() => toggle(item.id)}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
