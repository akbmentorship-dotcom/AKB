import { useState } from 'react';
import WorkoutDay from './WorkoutDay.jsx';
import BasketballDay from './BasketballDay.jsx';
import RestDay from './RestDay.jsx';
import { WD, SCHEDULE } from './workoutData.js';
import { getToday, getTodayDow, addDays, getDayOfWeek } from '../../lib/dates.js';

const DAYS = [
  { dow: 'mon', label: 'Mon' },
  { dow: 'tue', label: 'Tue' },
  { dow: 'wed', label: 'Wed' },
  { dow: 'thu', label: 'Thu' },
  { dow: 'fri', label: 'Fri' },
  { dow: 'sat', label: 'Sat' },
  { dow: 'sun', label: 'Sun' },
];

// Get the date string for a given dow in the current week (Mon-based)
function getDateForDow(dow) {
  const today = getToday();
  const todayDow = getTodayDow();
  const order = ['mon','tue','wed','thu','fri','sat','sun'];
  const todayIdx = order.indexOf(todayDow);
  const targetIdx = order.indexOf(dow);
  const diff = targetIdx - todayIdx;
  return addDays(today, diff);
}

export default function Fitness() {
  const todayDow = getTodayDow();
  const [selectedDow, setSelectedDow] = useState(todayDow);

  const selectedDate = getDateForDow(selectedDow);
  const dayType = SCHEDULE[selectedDow];
  const workoutDef = WD.find(w => w.id === selectedDow);

  return (
    <>
      {/* Day selector */}
      <div className="day-nav">
        {DAYS.map(d => {
          const type = SCHEDULE[d.dow];
          const isToday = d.dow === todayDow;
          const isSelected = d.dow === selectedDow;
          return (
            <button
              key={d.dow}
              className={`day-btn${isSelected ? ' active' : ''}`}
              style={isToday && !isSelected ? { color: 'var(--light)' } : {}}
              onClick={() => setSelectedDow(d.dow)}
            >
              {d.label}
              {isToday && <span style={{ display: 'block', fontSize: 8, color: isSelected ? 'var(--orange)' : 'var(--muted)', marginTop: 1 }}>TODAY</span>}
            </button>
          );
        })}
      </div>

      {dayType === 'workout' && workoutDef && (
        <WorkoutDay dayDef={workoutDef} date={selectedDate} />
      )}
      {dayType === 'basketball' && (
        <BasketballDay date={selectedDate} />
      )}
      {dayType === 'rest' && (
        <RestDay />
      )}
    </>
  );
}
