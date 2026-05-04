import { useState, useMemo } from 'react';
import { useScheduler, BUSINESSES, TIMES, DAYS_AHEAD, getDayLabel, getTimePeriod } from './useScheduler.js';
import './app.css';

// ── Color maps ────────────────────────────────────────────────────────────────
const C = {
  pink:   { accent: '#e85d9a', dim: 'var(--pink-dim)',   border: 'var(--pink-border)'   },
  orange: { accent: '#f06a1a', dim: 'var(--orange-dim)', border: 'var(--orange-border)' },
  purple: { accent: '#9d6ef5', dim: 'var(--purple-dim)', border: 'var(--purple-border)' },
  green:  { accent: '#3ecf82', dim: 'var(--green-dim)',  border: 'var(--green-border)'  },
  blue:   { accent: '#3a9de8', dim: 'var(--blue-dim)',   border: 'var(--blue-border)'   },
};

// ── Slot card (list view) ─────────────────────────────────────────────────────
function SlotCard({ slot, biz }) {
  return null; // rendered inline in App for book callback access
}

// ── Compact chip (grid view) ──────────────────────────────────────────────────
function SlotChip({ slot, biz, onBook }) {
  if (!slot) return <div className="chip chip-empty" />;
  const avail = slot.status === 'available' && !slot.blocked;
  const flash = slot.flash === 'booked' ? ' flash-red' : slot.flash === 'freed' ? ' flash-green' : '';
  const c = C[biz.color];
  return (
    <div className={`chip${avail ? ' chip-avail' : ' chip-taken'}${flash}`} style={avail ? { '--cc': c.accent, '--cd': c.dim } : {}}>
      {avail
        ? <button className="chip-btn" onClick={() => onBook(slot.key)}>{slot.time}</button>
        : <span className="chip-off">{slot.time}</span>}
    </div>
  );
}

// ── Activity feed ─────────────────────────────────────────────────────────────
function Feed({ items }) {
  if (items.length === 0) return <p className="feed-empty">Waiting for activity…</p>;
  return (
    <div className="feed">
      {items.map(item => {
        const biz = BUSINESSES.find(b => b.name === item.bizName);
        const c = C[biz?.color];
        return (
          <div key={item.id} className={`feed-row ${item.status === 'booked' ? 'feed-booked' : 'feed-freed'}`}>
            <span className="feed-dot" style={{ background: c?.accent }} />
            <span className="feed-text"><strong>{item.bizName}</strong> · {item.time} <span className="feed-action">{item.status === 'booked' ? 'booked' : 'opened up'}</span></span>
            <span className="feed-age">{Math.round((Date.now() - item.ts) / 1000)}s</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Admin panel ───────────────────────────────────────────────────────────────
function Admin({ getBusinessSlots, toggleSlot, simOn, setSimOn }) {
  const [biz, setBiz] = useState(BUSINESSES[0].id);
  const [day, setDay] = useState(0);
  const activeBiz = BUSINESSES.find(b => b.id === biz);
  const bizSlots = getBusinessSlots(biz, day);
  const c = C[activeBiz?.color];

  return (
    <div className="admin">
      <div className="admin-top">
        <span className="admin-title">Admin Panel</span>
        <button className={`sim-btn ${simOn ? 'sim-on' : 'sim-off'}`} onClick={() => setSimOn(v => !v)}>
          <span className="sim-dot" style={simOn ? { background: 'var(--green)' } : {}} />
          {simOn ? 'Simulation ON' : 'Simulation OFF'}
        </button>
      </div>

      <div className="sec-label">Business</div>
      <div className="biz-pills">
        {BUSINESSES.map(b => {
          const bc = C[b.color];
          return (
            <button key={b.id} className={`biz-pill${biz === b.id ? ' biz-pill-on' : ''}`}
              style={biz === b.id ? { background: bc.dim, borderColor: bc.border, color: bc.accent } : {}}
              onClick={() => setBiz(b.id)}>
              {b.icon} {b.name}
            </button>
          );
        })}
      </div>

      <div className="day-tabs">
        {DAYS_AHEAD.map(d => (
          <button key={d} className={`day-tab${day === d ? ' day-tab-on' : ''}`} onClick={() => setDay(d)}>
            {getDayLabel(d)}
          </button>
        ))}
      </div>

      <div className="sec-label">{activeBiz?.icon} {activeBiz?.name} — {getDayLabel(day)}</div>
      <div className="admin-grid">
        {bizSlots.map(slot => {
          const open = slot.status === 'available' && !slot.blocked;
          const flash = slot.flash === 'booked' ? ' flash-red' : slot.flash === 'freed' ? ' flash-green' : '';
          return (
            <button key={slot.key}
              className={`admin-slot${open ? ' aslot-open' : ' aslot-closed'}${flash}`}
              style={open ? { background: c?.dim, borderColor: c?.border, color: c?.accent } : {}}
              onClick={() => toggleSlot(slot.key)}>
              <span className="aslot-time">{slot.time}</span>
              <span className="aslot-status">{open ? 'Open' : slot.blocked ? 'Blocked' : 'Booked'}</span>
              <span>{open ? '✓' : '✕'}</span>
            </button>
          );
        })}
      </div>
      <p className="admin-hint">Click any slot to toggle open / blocked</p>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const { slots, activity, simOn, setSimOn, bookSlot, toggleSlot, getBusinessSlots, stats } = useScheduler();
  const [tab, setTab] = useState('book');
  const [day, setDay] = useState(0);
  const [period, setPeriod] = useState('all');
  const [bizFilter, setBizFilter] = useState(new Set());
  const [layout, setLayout] = useState('list');
  const [showFeed, setShowFeed] = useState(false);

  const filteredTimes = useMemo(() =>
    period === 'all' ? TIMES : TIMES.filter(t => getTimePeriod(t) === period), [period]);

  const filteredBiz = useMemo(() =>
    bizFilter.size === 0 ? BUSINESSES : BUSINESSES.filter(b => bizFilter.has(b.id)), [bizFilter]);

  const visibleSlots = useMemo(() => {
    const out = [];
    filteredTimes.forEach(time => filteredBiz.forEach(biz => {
      const slot = slots[`${biz.id}|${day}|${time}`];
      if (slot) out.push({ slot, biz });
    }));
    return out;
  }, [slots, filteredBiz, filteredTimes, day]);

  const availCount = visibleSlots.filter(({ slot }) => slot.status === 'available' && !slot.blocked).length;

  const toggleBiz = (id) => setBizFilter(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">S</span>
            <span className="logo-text">SlotSync</span>
          </div>
          <p className="tagline">Live availability across every business, in one view.</p>
        </div>
      </header>

      <main className="main">
        {/* Tabs */}
        <div className="tabs">
          <button className={`tab${tab === 'book' ? ' tab-on' : ''}`} onClick={() => setTab('book')}>Book a Slot</button>
          <button className={`tab${tab === 'admin' ? ' tab-on' : ''}`} onClick={() => setTab('admin')}>Admin</button>
        </div>

        {tab === 'admin' ? (
          <Admin getBusinessSlots={getBusinessSlots} toggleSlot={toggleSlot} simOn={simOn} setSimOn={setSimOn} />
        ) : (
          <>
            {/* Live bar */}
            <div className="live-bar">
              <div className="live-left">
                <span className={`live-dot${simOn ? ' live-pulse' : ''}`} />
                <span className="live-word">LIVE</span>
                <span className="live-counts"><span className="c-green">{stats.available} open</span> · <span className="c-muted">{stats.booked} booked</span></span>
              </div>
              <button className="feed-btn" onClick={() => setShowFeed(v => !v)}>
                {showFeed ? 'Hide feed' : 'Activity'}
                {activity.length > 0 && !showFeed && <span className="feed-badge">{Math.min(activity.length, 9)}</span>}
              </button>
            </div>

            {showFeed && (
              <div className="feed-wrap">
                <div className="sec-label">Live activity</div>
                <Feed items={activity} />
              </div>
            )}

            {/* Day tabs */}
            <div className="day-tabs">
              {DAYS_AHEAD.map(d => (
                <button key={d} className={`day-tab${day === d ? ' day-tab-on' : ''}`} onClick={() => setDay(d)}>
                  {getDayLabel(d)}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="filters">
              <div className="filter-row">
                <span className="filter-lbl">Time</span>
                <div className="pills">
                  {['all','morning','afternoon','evening'].map(p => (
                    <button key={p} className={`pill${period === p ? ' pill-on' : ''}`} onClick={() => setPeriod(p)}>
                      {p === 'all' ? 'All day' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-row" style={{ marginTop: 10 }}>
                <span className="filter-lbl">Business</span>
                <div className="pills">
                  {BUSINESSES.map(b => {
                    const bc = C[b.color];
                    const on = bizFilter.has(b.id);
                    return (
                      <button key={b.id} className={`pill pill-biz${on ? ' pill-biz-on' : ''}`}
                        style={on ? { background: bc.dim, borderColor: bc.border, color: bc.accent } : {}}
                        onClick={() => toggleBiz(b.id)}>
                        {b.icon} {b.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Results header */}
            <div className="results-bar">
              <div className="results-count">
                <span className="count-n">{availCount}</span>
                <span className="count-l"> slot{availCount !== 1 ? 's' : ''} available</span>
              </div>
              <div className="layout-btns">
                <button className={`layout-btn${layout === 'list' ? ' layout-on' : ''}`} onClick={() => setLayout('list')} title="List">☰</button>
                <button className={`layout-btn${layout === 'grid' ? ' layout-on' : ''}`} onClick={() => setLayout('grid')} title="Grid">⊞</button>
              </div>
            </div>

            {/* Slot grid layout */}
            {layout === 'grid' ? (
              <div className="grid-wrap">
                <div className="grid-head" style={{ gridTemplateColumns: `72px repeat(${filteredBiz.length}, 1fr)` }}>
                  <div className="grid-corner" />
                  {filteredBiz.map(biz => (
                    <div key={biz.id} className="grid-col-hd" style={{ color: C[biz.color].accent }}>
                      <div>{biz.icon}</div>
                      <div className="grid-col-name">{biz.name}</div>
                    </div>
                  ))}
                </div>
                {filteredTimes.map(time => (
                  <div key={time} className="grid-row" style={{ gridTemplateColumns: `72px repeat(${filteredBiz.length}, 1fr)` }}>
                    <div className="grid-time">{time}</div>
                    {filteredBiz.map(biz => (
                      <div key={biz.id} className="grid-cell">
                        <SlotChip slot={slots[`${biz.id}|${day}|${time}`]} biz={biz} onBook={bookSlot} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              /* List layout */
              <div className="slot-list">
                {visibleSlots.length === 0 && <p className="empty">No slots match your filters.</p>}
                {visibleSlots.map(({ slot, biz }) => {
                  const avail = slot.status === 'available' && !slot.blocked;
                  const c = C[biz.color];
                  const flash = slot.flash === 'booked' ? ' flash-red' : slot.flash === 'freed' ? ' flash-green' : '';
                  return (
                    <div key={slot.key} className={`scard${avail ? '' : ' scard-taken'}${flash}`}>
                      <div className="scard-accent" style={{ background: c.accent }} />
                      <div className="scard-body">
                        <div className="scard-top">
                          <span className="scard-badge" style={{ background: c.dim, border: `1px solid ${c.border}`, color: c.accent }}>{biz.icon} {biz.name}</span>
                          <span className="scard-cat">{biz.category}</span>
                        </div>
                        <div className="scard-mid">
                          <span className="scard-time">{slot.time}</span>
                          {slot.flash === 'booked' && <span className="tag-booked">just booked</span>}
                          {slot.flash === 'freed'  && <span className="tag-freed">opened up</span>}
                        </div>
                        {avail
                          ? <button className="book-btn" style={{ background: c.dim, borderColor: c.border, color: c.accent }} onClick={() => bookSlot(slot.key)}>Book Slot</button>
                          : <div className="taken-lbl">{slot.blocked ? 'Unavailable' : 'Taken'}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <span>SlotSync</span> · Live multi-business scheduling · Demo
      </footer>
    </div>
  );
}
