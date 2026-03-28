import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';

export default function AddPersonModal({ open, onClose, onAdd, editCard, onEdit, onDelete }) {
  const [name, setName] = useState(editCard?.name || '');
  const [note, setNote] = useState(editCard?.note || '');

  const isEdit = !!editCard;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isEdit) {
      onEdit(editCard.id, { name: name.trim(), note: note.trim() });
    } else {
      onAdd({ name: name.trim(), note: note.trim() });
    }
    setName(''); setNote('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Card' : 'Add Person'}>
      <form onSubmit={handleSubmit}>
        <label className="lbl">Name</label>
        <input
          className="inp"
          placeholder="Person's name"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />

        <label className="lbl">Note</label>
        <textarea
          className="inp"
          placeholder="Short note..."
          rows={3}
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          {isEdit && (
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: 'var(--red-dim)', borderColor: 'var(--red-border)', color: 'var(--red)' }}
              onClick={() => { onDelete(editCard.id); onClose(); }}
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className="btn-full"
            style={{ background: 'var(--orange-dim)', borderColor: 'var(--orange-border)', color: 'var(--orange)' }}
          >
            {isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
