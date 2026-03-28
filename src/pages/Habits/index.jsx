import { useState } from 'react';
import SectionHead from '../../components/ui/SectionHead.jsx';
import HabitRow from './HabitRow.jsx';
import HabitForm from './HabitForm.jsx';
import { useHabits } from '../../hooks/useHabits.js';
import { getToday } from '../../lib/dates.js';

export default function Habits() {
  const { habits, addHabit, editHabit, deleteHabit, getTodayLog, toggleHabit, getStreak } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [, forceUpdate] = useState(0);

  const todayLog = getTodayLog();
  const today = getToday();

  const handleToggle = (habitId) => {
    toggleHabit(habitId);
    forceUpdate(n => n + 1); // re-render to reflect log change
  };

  const handleAdd = ({ name, color }) => {
    addHabit({ name, color });
    setShowForm(false);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(false);
  };

  const handleSaveEdit = ({ name, color }) => {
    editHabit(editingHabit.id, { name, color });
    setEditingHabit(null);
  };

  const doneCount = habits.filter(h => todayLog[h.id]).length;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {doneCount}/{habits.length} done today
        </div>
        <button
          className="btn btn-sm"
          style={{ background: 'var(--orange-dim)', borderColor: 'var(--orange-border)', color: 'var(--orange)' }}
          onClick={() => { setShowForm(v => !v); setEditingHabit(null); }}
        >
          {showForm ? 'Cancel' : '+ New Habit'}
        </button>
      </div>

      {showForm && !editingHabit && (
        <HabitForm
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      <SectionHead label={`Today — ${today}`} color="var(--orange)" />

      {habits.length === 0 && (
        <div className="empty">No habits yet. Create your first one above.</div>
      )}

      {habits.map(habit => (
        <div key={habit.id}>
          <HabitRow
            habit={habit}
            checked={!!todayLog[habit.id]}
            streak={getStreak(habit.id)}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={deleteHabit}
          />
          {editingHabit?.id === habit.id && (
            <HabitForm
              initial={editingHabit}
              onSave={handleSaveEdit}
              onCancel={() => setEditingHabit(null)}
            />
          )}
        </div>
      ))}
    </>
  );
}
