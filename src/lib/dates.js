export const getToday = () => new Date().toISOString().split('T')[0];

export const getWeekKey = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
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

// Returns a status color based on percentage
export const statusColor = (pct) =>
  pct >= 100 ? 'var(--green)' : pct >= 60 ? 'var(--yellow)' : 'var(--red)';

// Returns progress percentage capped at 100
export const getPct = (val, target) => Math.min(100, Math.round((val / target) * 100));

// Get day-of-week abbreviation for a date string YYYY-MM-DD
export const getDayOfWeek = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00');
  return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][d.getDay()];
};

// Get today's day-of-week abbreviation
export const getTodayDow = () => getDayOfWeek(getToday());

// Offset a YYYY-MM-DD string by N days
export const addDays = (dateStr, n) => {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};
