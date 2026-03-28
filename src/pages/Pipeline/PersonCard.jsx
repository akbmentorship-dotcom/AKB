import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate } from '../../lib/dates.js';

export default function PersonCard({ card, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="kanban-card"
      {...attributes}
      {...listeners}
      onClick={() => onEdit(card)}
    >
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{card.name}</div>
      {card.note && (
        <div style={{ fontSize: 12, color: 'var(--light)', marginBottom: 6, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {card.note}
        </div>
      )}
      <div className="badge" style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
        {formatDate(card.dateAdded)}
      </div>
    </div>
  );
}
