import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SectionHead from '../../components/ui/SectionHead.jsx';

function SortableTaskRow({ task, onComplete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="task-row">
      <span className="drag-handle" {...attributes} {...listeners} style={{ fontSize: 16, color: 'var(--muted)', cursor: 'grab', flexShrink: 0 }}>
        ⠿
      </span>
      <div style={{ flex: 1, fontSize: 14 }}>{task.title}</div>
      <button
        className="checkbox"
        onClick={() => onComplete(task.id)}
        aria-label="Complete task"
      />
    </div>
  );
}

export default function PriorityTasks({ tasks, onComplete, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    onReorder('today', reordered.map(t => t.id));
  };

  if (tasks.length === 0) {
    return (
      <div style={{ marginBottom: 24 }}>
        <SectionHead label="Today's Tasks" color="var(--yellow)" />
        <div className="empty">No tasks for today. Add some from the Tasks tab.</div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionHead label={`Today's Tasks — ${tasks.length}`} color="var(--yellow)" />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskRow key={task.id} task={task} onComplete={onComplete} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
