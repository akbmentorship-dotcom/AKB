import ProgressBar from '../../components/ui/ProgressBar.jsx';
import { getToday } from '../../lib/dates.js';

const TARGET = 3;

export default function ReachOutCounter({ board, cards, onAdd, onOpenPipeline }) {
  const today = getToday();
  const count = cards.filter(c => c.dateAdded === today).length;

  const labels = { ig: 'Instagram', bumble: 'Bumble' };
  const color = board === 'ig' ? 'var(--orange)' : 'var(--yellow)';
  const dimColor = board === 'ig' ? 'var(--orange-dim)' : 'var(--yellow-dim)';
  const borderColor = board === 'ig' ? 'var(--orange-border)' : 'var(--yellow-border)';

  return (
    <div className="card" style={{ borderColor, background: dimColor, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            {labels[board]} Reach-Outs
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{count}</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>/ {TARGET} today</span>
          </div>
        </div>
        <button
          className="btn btn-sm"
          style={{ background: 'transparent', borderColor, color }}
          onClick={onAdd}
        >
          + Add
        </button>
      </div>
      <ProgressBar value={count} total={TARGET} color={color} />
    </div>
  );
}
