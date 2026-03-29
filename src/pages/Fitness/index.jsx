import { useState } from 'react';
import WorkoutDay from './WorkoutDay.jsx';
import BasketballDay from './BasketballDay.jsx';
import RestDay from './RestDay.jsx';
import { WD, SCHEDULE } from './workoutData.js';
import { getToday, getTodayDow, addDays, getDayOfWeek, formatDate } from '../../lib/dates.js';
import { storageGet, storageSet } from '../../lib/storage.js';

const DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
const DAY_LABELS = { mon:'Mon', tue:'Tue', wed:'Wed', thu:'Thu', fri:'Fri', sat:'Sat', sun:'Sun' };

const WORKOUT_OPTIONS = [
  { id: 'basketball', label: 'Basketball',      icon: '🏀', sub: 'Cardio + agility' },
  { id: 'rest',       label: 'Rest Day',        icon: '😴', sub: 'Recovery' },
  { id: 'tue',        label: 'Upper A',         icon: '💪', sub: 'Horizontal push & pull' },
  { id: 'thu',        label: 'Lower A',         icon: '🦵', sub: 'Quad & posterior chain' },
  { id: 'sat',        label: 'Lower B + Plyo',  icon: '⚡', sub: 'Athletic development' },
  { id: 'sun',        label: 'Upper B (Home)',  icon: '🏠', sub: 'Vertical push & pull' },
];

// Get the date for a given dow in the current week (Mon-based)
function getDateForDow(dow) {
  const today = getToday();
  const todayDow = getTodayDow();
  const todayIdx = DAYS.indexOf(todayDow);
  const targetIdx = DAYS.indexOf(dow);
  return addDays(today, targetIdx - todayIdx);
}

// Get the effective workout type for a date (custom override or default schedule)
function getWorkoutType(date) {
  const override = storageGet(`fitness:schedule:${date}`, null);
  if (override) return override;
  const dow = getDayOfWeek(date);
  return SCHEDULE[dow] === 'workout' ? dow : SCHEDULE[dow];
}

function setWorkoutType(date, type) {
  storageSet(`fitness:schedule:${date}`, type);
}

export default function Fitness() {
  const todayDow = getTodayDow();
  const [selectedDow, setSelectedDow] = useState(todayDow);
  const [showPicker, setShowPicker] = useState(false);
  const [, forceUpdate] = useState(0);

  const selectedDate = getDateForDow(selectedDow);
  const dayType = getWorkoutType(selectedDate);
  const workoutDef = WD.find(w => w.id === dayType);

  const handleChangeWorkout = (type) => {
    setWorkoutType(selectedDate, type);
    setShowPicker(false);
    forceUpdate(n => n + 1);
  };

  const currentOption = WORKOUT_OPTIONS.find(o => o.id === dayType);

  return (
    <>
      {/* Day selector */}
      <div className="day-nav">
        {DAYS.map(dow => {
          const date = getDateForDow(dow);
          const type = getWorkoutType(date);
          const isToday = dow === todayDow;
          const isSelected = dow === selectedDow;
          const dateNum = new Date(date + 'T12:00:00').getDate();
          return (
            <button
              key={dow}
              className={`day-btn${isSelected ? ' active' : ''}`}
              onClick={() => { setSelectedDow(dow); setShowPicker(false); }}
            >
              {DAY_LABELS[dow]}
              <span style={{ display: 'block', fontSize: 11, marginTop: 1, color: isSelected ? 'var(--orange)' : isToday ? 'var(--light)' : '#333' }}>
                {dateNum}
              </span>
              {isToday && (
                <span style={{ display: 'block', fontSize: 7, color: isSelected ? 'var(--orange)' : 'var(--muted)', marginTop: 1, letterSpacing: '0.05em' }}>
                  TODAY
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current day header + change button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {formatDate(selectedDate)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
            {currentOption?.icon} {currentOption?.label}
          </div>
        </div>
        <button
          className="btn btn-sm"
          style={{ background: 'none', borderColor: 'var(--border)', color: 'var(--muted)' }}
          onClick={() => setShowPicker(v => !v)}
        >
          {showPicker ? 'Cancel' : 'Change'}
        </button>
      </div>

      {/* Workout type picker */}
      {showPicker && (
        <div className="card" style={{ marginBottom: 16, padding: '8px 0' }}>
          {WORKOUT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleChangeWorkout(opt.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', background: opt.id === dayType ? 'var(--orange-dim)' : 'none',
                border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                textAlign: 'left', color: opt.id === dayType ? 'var(--orange)' : 'var(--white)',
              }}
            >
              <span style={{ fontSize: 20 }}>{opt.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{opt.sub}</div>
              </div>
              {opt.id === dayType && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--orange)' }}>✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Workout content */}
      {(dayType === 'tue' || dayType === 'thu' || dayType === 'sat' || dayType === 'sun') && workoutDef && (
        <WorkoutDay dayDef={workoutDef} date={selectedDate} />
      )}
      {dayType === 'basketball' && <BasketballDay date={selectedDate} />}
      {dayType === 'rest' && <RestDay />}
    </>
  );
}
