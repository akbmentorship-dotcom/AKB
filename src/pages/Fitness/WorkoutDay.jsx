import { useState } from 'react';
import SubTabs from '../../components/ui/SubTabs.jsx';
import ExerciseBlock from './ExerciseBlock.jsx';
import { storageGet, storageSet } from '../../lib/storage.js';
import { PLANE_COLORS, WU } from './workoutData.js';

const TABS = [
  { id: 'log', label: 'Log Session' },
  { id: 'warmup', label: 'Warm-Up' },
];

export default function WorkoutDay({ dayDef, date }) {
  const [tab, setTab] = useState('log');
  const logKey = `fitness:log:${date}`;
  const [log, setLog] = useState(() => storageGet(logKey, {}));

  const handleLogChange = (exId, data) => {
    const next = { ...log, [exId]: data };
    setLog(next);
    storageSet(logKey, next);
  };

  const wu = WU[dayDef.id];

  return (
    <>
      {/* Day header */}
      <div className="card" style={{ borderColor: dayDef.brd, background: dayDef.dim, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: dayDef.cv, marginBottom: 4 }}>
          {dayDef.type}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{dayDef.title}</div>
        <div style={{ fontSize: 12, color: 'var(--light)', marginTop: 2 }}>{dayDef.sub}</div>
      </div>

      <SubTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'log' && (
        <div>
          {dayDef.structure.map((block, i) => (
            <ExerciseBlock
              key={i}
              block={block}
              dayId={dayDef.id}
              log={log}
              onLogChange={handleLogChange}
            />
          ))}
        </div>
      )}

      {tab === 'warmup' && wu && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Complete before lifting</span>
            <span className="badge" style={{ background: dayDef.dim, color: dayDef.cv, border: `1px solid ${dayDef.brd}` }}>
              {wu.dur}
            </span>
          </div>
          {wu.phases.map((phase, pi) => (
            <div key={pi} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: wu.color, marginBottom: 10 }}>
                {phase.lbl}
              </div>
              {phase.moves.map((move, mi) => (
                <div key={mi} className="card" style={{ padding: '12px 14px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{move.name}</div>
                    <span className="badge" style={{ background: 'var(--surface)', color: 'var(--orange)', border: '1px solid var(--orange-border)', marginLeft: 8, flexShrink: 0 }}>
                      {move.dose}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--light)', marginBottom: 6, lineHeight: 1.5 }}>{move.desc}</div>
                  <div style={{ fontSize: 11, color: wu.color, fontStyle: 'italic' }}>"{move.cue}"</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                    {move.planes.map(p => (
                      <span key={p} className="badge" style={{ background: `${PLANE_COLORS[p]}22`, color: PLANE_COLORS[p], border: `1px solid ${PLANE_COLORS[p]}44` }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
