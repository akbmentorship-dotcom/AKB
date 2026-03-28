import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn.jsx';
import PersonCard from './PersonCard.jsx';
import AddPersonModal from './AddPersonModal.jsx';

const COLUMNS = ['new', 'ongoing', 'pre-vetting', 'vetting', 'closed'];

export default function KanbanBoard({ pipeline }) {
  const { cards, addCard, editCard, deleteCard, moveCard, reorderColumn, getColumn } = pipeline;
  const [activeCard, setActiveCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalColumn, setModalColumn] = useState('new');
  const [editingCard, setEditingCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const handleDragStart = ({ active }) => {
    setActiveCard(cards.find(c => c.id === active.id) || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null);
    if (!over) return;

    const overId = over.id;
    const activeCard = cards.find(c => c.id === active.id);
    if (!activeCard) return;

    // Is overId a column id?
    if (COLUMNS.includes(overId)) {
      if (activeCard.column !== overId) {
        moveCard(active.id, overId);
      }
      return;
    }

    // overId is a card id
    const overCard = cards.find(c => c.id === overId);
    if (!overCard) return;

    if (activeCard.column !== overCard.column) {
      // Move to different column, place at over card's position
      moveCard(active.id, overCard.column);
    } else {
      // Reorder within column
      const colCards = getColumn(activeCard.column);
      const oldIndex = colCards.findIndex(c => c.id === active.id);
      const newIndex = colCards.findIndex(c => c.id === overId);
      if (oldIndex !== newIndex) {
        const reordered = arrayMove(colCards, oldIndex, newIndex);
        reorderColumn(activeCard.column, reordered.map(c => c.id));
      }
    }
  };

  const openAdd = (column) => {
    setModalColumn(column);
    setEditingCard(null);
    setShowModal(true);
  };

  const openEdit = (card) => {
    setEditingCard(card);
    setModalColumn(card.column);
    setShowModal(true);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col}
              column={col}
              cards={getColumn(col)}
              onEditCard={openEdit}
              onAddCard={openAdd}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard && (
            <div style={{ transform: 'rotate(2deg)', pointerEvents: 'none' }}>
              <PersonCard card={activeCard} onEdit={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <AddPersonModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingCard(null); }}
        onAdd={(data) => addCard(data)}
        editCard={editingCard}
        onEdit={editCard}
        onDelete={deleteCard}
      />
    </>
  );
}
