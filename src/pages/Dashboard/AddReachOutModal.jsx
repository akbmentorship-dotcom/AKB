import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';

export default function AddReachOutModal({ open, onClose, onAdd, defaultBoard = 'ig' }) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [board, setBoard] = useState(defaultBoard);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(board, { name: name.trim(), note: note.trim() });
    setName(''); setNote('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Reach-Out">
      <form onSubmit={handleSubmit}>
        <label className="lbl">Platform</label>
        <div className="pills" style={{ marginBottom: 14 }}>
          {[{ id: 'ig', label: 'Instagram' }, { id: 'bumble', label: 'Bumble' }].map(b => (
            <button
              key={b.id}
              type="button"
              className="pill"
              style={{
                background: board === b.id ? 'var(--orange-dim)' : 'transparent',
                borderColor: board === b.id ? 'var(--orange-border)' : 'var(--border)',
                color: board === b.id ? 'var(--orange)' : 'var(--muted)',
              }}
              onClick={() => setBoard(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>

        <label className="lbl">Name</label>
        <input
          className="inp"
          placeholder="Person's name"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />

        <label className="lbl">Note (optional)</label>
        <input
          className="inp"
          placeholder="Short note..."
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <button
          type="submit"
          className="btn-full"
          style={{ background: 'var(--orange-dim)', borderColor: 'var(--orange-border)', color: 'var(--orange)' }}
        >
          Add to Pipeline
        </button>
      </form>
    </Modal>
  );
}
