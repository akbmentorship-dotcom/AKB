import { getPct, statusColor } from '../../lib/dates.js';

export default function ProgressBar({ value, total, color }) {
  const pct = getPct(value, total);
  const fill = color || statusColor(pct);
  return (
    <div className="bar">
      <div className="fill" style={{ width: `${pct}%`, background: fill }} />
    </div>
  );
}
