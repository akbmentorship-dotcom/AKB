import { useState } from 'react';
import SectionHead from '../../components/ui/SectionHead.jsx';
import ReachOutCounter from './ReachOutCounter.jsx';
import AdminChecklist from './AdminChecklist.jsx';
import DailyHabitChecks from './DailyHabitChecks.jsx';
import PriorityTasks from './PriorityTasks.jsx';
import AddReachOutModal from './AddReachOutModal.jsx';
import { usePipeline } from '../../hooks/usePipeline.js';
import { useTasks } from '../../hooks/useTasks.js';
import { getToday, formatDate } from '../../lib/dates.js';

export default function Dashboard({ onNav }) {
  const igPipeline   = usePipeline('ig');
  const bumblePipeline = usePipeline('bumble');
  const { getSection, addTask, completeTask, reorderTasks } = useTasks();

  const [showAddReachOut, setShowAddReachOut] = useState(false);
  const [reachOutBoard, setReachOutBoard] = useState('ig');

  const today = getToday();
  const todayTasks = getSection('today');

  const openAdd = (board) => {
    setReachOutBoard(board);
    setShowAddReachOut(true);
  };

  const handleAddReachOut = (board, data) => {
    if (board === 'ig') igPipeline.addCard(data);
    else bumblePipeline.addCard(data);
  };

  return (
    <>
      {/* Date greeting */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Good morning, Austin.</div>
      </div>

      {/* Reach-out counters */}
      <SectionHead label="Daily Reach-Outs" color="var(--orange)" />
      <ReachOutCounter
        board="ig"
        cards={igPipeline.cards}
        onAdd={() => openAdd('ig')}
        onOpenPipeline={() => onNav('pipeline')}
      />
      <ReachOutCounter
        board="bumble"
        cards={bumblePipeline.cards}
        onAdd={() => openAdd('bumble')}
        onOpenPipeline={() => onNav('pipeline')}
      />
      <button
        className="btn btn-sm"
        style={{ width: '100%', marginBottom: 24, background: 'none', borderColor: 'var(--border)', color: 'var(--muted)' }}
        onClick={() => onNav('pipeline')}
      >
        Open Full Pipeline Board →
      </button>

      {/* Admin checklist */}
      <AdminChecklist />

      {/* Daily habits */}
      <DailyHabitChecks />

      {/* Today's tasks */}
      <PriorityTasks
        tasks={todayTasks}
        onComplete={completeTask}
        onReorder={reorderTasks}
      />

      <AddReachOutModal
        open={showAddReachOut}
        onClose={() => setShowAddReachOut(false)}
        onAdd={handleAddReachOut}
        defaultBoard={reachOutBoard}
      />
    </>
  );
}
