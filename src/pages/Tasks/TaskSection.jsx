import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import TaskRow from './TaskRow.jsx';

export default function TaskSection({ tasks, section, onComplete, onUncomplete, onDelete, onMove, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    onReorder(section, reordered.map(t => t.id));
  };

  if (tasks.length === 0) {
    const msg = {
      inbox: 'Inbox is empty',
      today: 'Nothing scheduled for today',
      tomorrow: 'Nothing scheduled for tomorrow',
      completed: 'No completed tasks',
    }[section];
    return <div className="empty">{msg}</div>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            onComplete={onComplete}
            onUncomplete={onUncomplete}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
