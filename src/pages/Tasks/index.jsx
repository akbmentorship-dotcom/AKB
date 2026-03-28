import { useState } from 'react';
import SubTabs from '../../components/ui/SubTabs.jsx';
import SectionHead from '../../components/ui/SectionHead.jsx';
import TaskSection from './TaskSection.jsx';
import AddTaskModal from './AddTaskModal.jsx';
import { useTasks } from '../../hooks/useTasks.js';

const TABS = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tmrw' },
  { id: 'completed', label: 'Done' },
];

export default function Tasks() {
  const [tab, setTab] = useState('today');
  const [showAdd, setShowAdd] = useState(false);
  const { getSection, addTask, completeTask, uncompleteTask, deleteTask, moveTask, reorderTasks } = useTasks();

  const tasks = getSection(tab);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {getSection('inbox').length} in inbox · {getSection('today').length} today
        </div>
        <button
          className="btn btn-sm"
          style={{ background: 'var(--orange-dim)', borderColor: 'var(--orange-border)', color: 'var(--orange)' }}
          onClick={() => setShowAdd(true)}
        >
          + Add
        </button>
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={setTab} />

      <TaskSection
        tasks={tasks}
        section={tab}
        onComplete={completeTask}
        onUncomplete={uncompleteTask}
        onDelete={deleteTask}
        onMove={moveTask}
        onReorder={reorderTasks}
      />

      <AddTaskModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={addTask}
        defaultSection={tab === 'completed' ? 'inbox' : tab}
      />
    </>
  );
}
