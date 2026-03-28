import { useState } from 'react';
import SubTabs from '../../components/ui/SubTabs.jsx';
import KanbanBoard from './KanbanBoard.jsx';
import { usePipeline } from '../../hooks/usePipeline.js';
import { getToday } from '../../lib/dates.js';

const BOARDS = [
  { id: 'ig',     label: 'Instagram' },
  { id: 'bumble', label: 'Bumble' },
];

export default function Pipeline() {
  const [board, setBoard] = useState('ig');
  const igPipeline     = usePipeline('ig');
  const bumblePipeline = usePipeline('bumble');

  const pipeline = board === 'ig' ? igPipeline : bumblePipeline;
  const today = getToday();
  const todayCount = pipeline.cards.filter(c => c.dateAdded === today).length;
  const totalCount = pipeline.cards.length;

  return (
    <>
      <SubTabs tabs={BOARDS} active={board} onChange={setBoard} />

      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '10px 12px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--orange)' }}>{todayCount}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>Added Today</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '10px 12px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--white)' }}>{totalCount}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>Total Active</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '10px 12px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>
            {pipeline.getColumn('vetting').length + pipeline.getColumn('closed').length}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>Vetting+</div>
        </div>
      </div>

      <KanbanBoard pipeline={pipeline} />
    </>
  );
}
