// Local-timezone date string YYYY-MM-DD
const localFmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getToday = () => localFmt(new Date());

export const getWeekKey = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return localFmt(d);
};

export const formatDate = (s) => {
  if (!s) return '—';
  try {
    return new Date(s + 'T12:00:00').toLocaleDateString('en-CA', {
      month: 'short', day: 'numeric',
    });
  } catch {
    return s;
  }
};

export const daysSince = (s) => {
  if (!s) return null;
  return Math.floor((Date.now() - new Date(s + 'T12:00:00')) / 864e5);
};

export const statusColor = (pct) =>
  pct >= 100 ? 'var(--green)' : pct >= 60 ? 'var(--yellow)' : 'var(--red)';

export const getPct = (val, target) => Math.min(100, Math.round((val / target) * 100));

export const getDayOfWeek = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00');
  return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][d.getDay()];
};

export const getTodayDow = () => getDayOfWeek(getToday());

export const addDays = (dateStr, n) => {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return localFmt(d);
};
