import { useLocalStorage } from './useLocalStorage.js';
import { storageGet, storageSet } from '../lib/storage.js';
import { getToday, addDays } from '../lib/dates.js';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage('habits', []);

  const addHabit = ({ name, color = 'var(--orange)' }) => {
    const maxOrder = habits.reduce((m, h) => Math.max(m, h.order), -1);
    setHabits(prev => [
      ...prev,
      { id: `h_${Date.now()}`, name, color, order: maxOrder + 1 },
    ]);
  };

  const editHabit = (id, updates) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const getTodayLog = () => {
    const today = getToday();
    return storageGet(`habits:log:${today}`, {});
  };

  const toggleHabit = (habitId) => {
    const today = getToday();
    const key = `habits:log:${today}`;
    const log = storageGet(key, {});
    storageSet(key, { ...log, [habitId]: !log[habitId] });
  };

  const getStreak = (habitId) => {
    let streak = 0;
    let date = getToday();
    // Check today first; if not done, start checking from yesterday
    const todayLog = storageGet(`habits:log:${date}`, {});
    if (!todayLog[habitId]) {
      date = addDays(date, -1);
    }
    for (let i = 0; i < 365; i++) {
      const log = storageGet(`habits:log:${date}`, {});
      if (log[habitId]) {
        streak++;
        date = addDays(date, -1);
      } else {
        break;
      }
    }
    return streak;
  };

  const activeHabits = habits.filter(h => !h.archivedAt).sort((a, b) => a.order - b.order);

  return { habits: activeHabits, allHabits: habits, addHabit, editHabit, deleteHabit, getTodayLog, toggleHabit, getStreak };
}
