import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import PersonCard from './PersonCard.jsx';

const COLUMN_LABELS = {
  'new':          'New',
  'ongoing':      'Ongoing',
  'pre-vetting':  'Pre-Vetting',
  'vetting':      'Vetting',
  'closed':       'Closed',
};

export default function KanbanColumn({ column, cards, onEditCard, onAddCard }) {
  const { setNodeRef, isOver } = useDroppable({ id: column });

  return (
    <div
      className="kanban-col"
      style={{ borderColor: isOver ? 'var(--orange-border)' : undefined, background: isOver ? 'var(--orange-dim)' : undefined }}
    >
      <div className="kanban-col-header">
        <span>{COLUMN_LABELS[column]}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: 'var(--border)', fontSize: 12 }}>{cards.length}</span>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: 16, cursor: 'pointer', lineHeight: 1, padding: '0 2px' }}
            onClick={() => onAddCard(column)}
            aria-label={`Add card to ${COLUMN_LABELS[column]}`}
          >
            +
          </button>
        </div>
      </div>

      <div ref={setNodeRef} style={{ flex: 1, minHeight: 60 }}>
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map(card => (
            <PersonCard key={card.id} card={card} onEdit={onEditCard} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
