import { useState } from 'react';
import SectionHead from '../../components/ui/SectionHead.jsx';
import { useHabits } from '../../hooks/useHabits.js';

export default function DailyHabitChecks() {
  const { habits, getTodayLog, toggleHabit } = useHabits();
  const [, forceUpdate] = useState(0);

  const todayLog = getTodayLog();
  const doneCount = habits.filter(h => todayLog[h.id]).length;

  if (habits.length === 0) return null;

  const handleToggle = (habitId) => {
    toggleHabit(habitId);
    forceUpdate(n => n + 1);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionHead label={`Habits — ${doneCount}/${habits.length}`} color="var(--green)" />
      <div className="card">
        {habits.map((habit, i) => {
          const checked = !!todayLog[habit.id];
          return (
            <div
              key={habit.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderBottom: i < habits.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleToggle(habit.id)}
            >
              <div className="color-dot" style={{ background: habit.color }} />
              <span style={{ flex: 1, fontSize: 14, color: checked ? 'var(--muted)' : 'var(--white)', textDecoration: checked ? 'line-through' : 'none' }}>
                {habit.name}
              </span>
              <button
                className={`checkbox${checked ? ' checked' : ''}`}
                onClick={e => { e.stopPropagation(); handleToggle(habit.id); }}
                style={{ borderColor: checked ? habit.color : undefined, background: checked ? habit.color : undefined }}
              >
                {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
