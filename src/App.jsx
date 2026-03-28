import { useState } from 'react';
import BottomNav from './components/ui/BottomNav.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import Pipeline from './pages/Pipeline/index.jsx';
import Tasks from './pages/Tasks/index.jsx';
import Habits from './pages/Habits/index.jsx';
import Fitness from './pages/Fitness/index.jsx';

const PAGE_TITLES = {
  dashboard: 'Align Living',
  pipeline:  'Pipeline',
  tasks:     'Tasks',
  habits:    'Habits',
  fitness:   'Fitness',
};

export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div id="root" style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 680, margin: '0 auto' }}>
      <header className="header">
        <div className="header-inner">
          <div className="header-top">
            <div>
              <div className="eyebrow">Align Living</div>
              <div className="page-title">{PAGE_TITLES[page]}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="content">
        {page === 'dashboard' && <Dashboard onNav={setPage} />}
        {page === 'pipeline'  && <Pipeline />}
        {page === 'tasks'     && <Tasks />}
        {page === 'habits'    && <Habits />}
        {page === 'fitness'   && <Fitness />}
      </main>

      <BottomNav active={page} onNav={setPage} />
    </div>
  );
}
