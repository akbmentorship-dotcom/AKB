import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate } from '../../lib/dates.js';

export default function TaskRow({ task, onComplete, onUncomplete, onDelete, onMove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const done = task.section === 'completed';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-row${done ? ' done' : ''}`}
    >
      {/* Drag handle (not shown for completed) */}
      {!done && (
        <span
          className="drag-handle"
          {...attributes}
          {...listeners}
          style={{ fontSize: 16, color: 'var(--muted)', cursor: 'grab', flexShrink: 0 }}
        >
          ⠿
        </span>
      )}

      {/* Checkbox */}
      <button
        className={`checkbox${done ? ' checked' : ''}`}
        onClick={() => done ? onUncomplete(task.id) : onComplete(task.id)}
        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
      >
        {done && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
      </button>

      {/* Title + metadata */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className={`task-title${done ? ' done' : ''}`}>{task.title}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          {task.dueDate && (
            <span className="badge" style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid var(--blue-border)' }}>
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.recurring && (
            <span className="badge" style={{ background: 'var(--purple-dim)', color: 'var(--purple)', border: '1px solid var(--purple-border)' }}>
              ↻ daily
            </span>
          )}
        </div>
      </div>

      {/* Context menu: move to / delete */}
      {!done && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {task.section === 'inbox' && (
            <button
              style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
              onClick={() => onMove(task.id, 'today')}
            >
              → Today
            </button>
          )}
          {task.section === 'today' && (
            <button
              style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
              onClick={() => onMove(task.id, 'tomorrow')}
            >
              → Tmrw
            </button>
          )}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
            onClick={() => onDelete(task.id)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
