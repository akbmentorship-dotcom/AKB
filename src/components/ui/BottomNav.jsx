const TABS = [
  { id: 'dashboard', icon: '⚡', label: 'Home' },
  { id: 'pipeline',  icon: '🔥', label: 'Pipeline' },
  { id: 'tasks',     icon: '📝', label: 'Tasks' },
  { id: 'habits',    icon: '✓',  label: 'Habits' },
  { id: 'fitness',   icon: '💪', label: 'Fitness' },
];

export default function BottomNav({ active, onNav }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab${active === tab.id ? ' active' : ''}`}
          onClick={() => onNav(tab.id)}
        >
          <span className="nav-tab-icon">{tab.icon}</span>
          <span className="nav-tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
