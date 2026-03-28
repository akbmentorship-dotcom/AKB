import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';

const SECTIONS = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
];

export default function AddTaskModal({ open, onClose, onAdd, defaultSection = 'inbox' }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [section, setSection] = useState(defaultSection);
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), notes: notes.trim(), dueDate: dueDate || null, section, recurring });
    setTitle(''); setNotes(''); setDueDate(''); setSection(defaultSection); setRecurring(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit}>
        <label className="lbl">Task</label>
        <input
          className="inp"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />

        <label className="lbl">Notes (optional)</label>
        <textarea
          className="inp"
          placeholder="Details..."
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <label className="lbl">Due Date (optional)</label>
        <input
          className="inp"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          style={{ colorScheme: 'dark' }}
        />

        <label className="lbl">Add To</label>
        <div className="pills" style={{ marginBottom: 12 }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              type="button"
              className="pill"
              style={{
                background: section === s.id ? 'var(--orange-dim)' : 'transparent',
                borderColor: section === s.id ? 'var(--orange-border)' : 'var(--border)',
                color: section === s.id ? 'var(--orange)' : 'var(--muted)',
              }}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
          <input
            type="checkbox"
            checked={recurring}
            onChange={e => setRecurring(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--orange)' }}
          />
          <span style={{ fontSize: 14 }}>Recurring daily</span>
        </label>

        <button
          type="submit"
          className="btn-full"
          style={{ background: 'var(--orange-dim)', borderColor: 'var(--orange-border)', color: 'var(--orange)' }}
        >
          Add Task
        </button>
      </form>
    </Modal>
  );
}
