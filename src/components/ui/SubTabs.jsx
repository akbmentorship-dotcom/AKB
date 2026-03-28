export default function SubTabs({ tabs, active, onChange }) {
  return (
    <div className="subtabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`stab${active === tab.id ? ' active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
