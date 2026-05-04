import { useState, useMemo } from 'react';
import { useScheduler, BUSINESSES, TIMES, DAYS_AHEAD, getDayLabel, getTimePeriod } from './useScheduler.js';
import './scheduling.css';

// ── Slot card ─────────────────────────────────────────────────────────────────
function SlotCard({ slot, biz, onBook, compact }) {
  if (!slot) return null;
  const isAvail = slot.status === 'available' && !slot.blocked;
  const flashClass = slot.flash === 'booked' ? ' flash-book' : slot.flash === 'freed' ? ' flash-free' : '';

  if (compact) {
    return (
      <div className={`slot-chip${isAvail ? ' slot-avail' : ' slot-taken'}${flashClass} biz-${biz.color}`}>
        {isAvail ? (
          <button className="slot-chip-btn" onClick={() => onBook(slot.key)} title={`Book ${slot.time} at ${biz.name}`}>
            {slot.time}
          </button>
        ) : (
          <span className="slot-chip-text">{slot.time}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`slot-card${isAvail ? ' slot-avail' : ' slot-taken'}${flashClass}`}>
      <div className={`slot-card-accent biz-accent-${biz.color}`} />
      <div className="slot-card-body">
        <div className="slot-card-top">
          <span className={`slot-biz-badge biz-badge-${biz.color}`}>{biz.icon} {biz.name}</span>
          <span className="slot-cat">{biz.category}</span>
        </div>
        <div className="slot-card-mid">
          <span className="slot-time">{slot.time}</span>
          {slot.flash === 'booked' && <span className="slot-just-booked">just booked</span>}
          {slot.flash === 'freed' && <span className="slot-just-freed">opened up</span>}
        </div>
        {isAvail ? (
          <button className={`slot-book-btn biz-btn-${biz.color}`} onClick={() => onBook(slot.key)}>
            Book Slot
          </button>
        ) : (
          <div className="slot-taken-label">{slot.blocked ? 'Unavailable' : 'Taken'}</div>
        )}
      </div>
    </div>
  );
}

// ── Activity feed ─────────────────────────────────────────────────────────────
function ActivityFeed({ items }) {
  return (
    <div className="activity-feed">
      <div className="sh">Live activity</div>
      {items.length === 0 && <div className="activity-empty">Waiting for activity…</div>}
      {items.map(item => {
        const biz = BUSINESSES.find(b => b.name === item.bizName);
        return (
          <div key={item.id} className={`activity-item ${item.status === 'booked' ? 'act-booked' : 'act-freed'}`}>
            <span className={`act-dot biz-dot-${biz?.color}`} />
            <span className="act-text">
              <strong>{item.bizName}</strong> — {item.time}
              <span className="act-label">{item.status === 'booked' ? ' booked' : ' opened up'}</span>
            </span>
            <span className="act-ago">{Math.round((Date.now() - item.ts) / 1000)}s ago</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Admin panel ───────────────────────────────────────────────────────────────
function AdminPanel({ getBusinessSlots, toggleAdminSlot, simulationActive, setSimulationActive }) {
  const [activeBiz, setActiveBiz] = useState(BUSINESSES[0].id);
  const [activeDay, setActiveDay] = useState(0);
  const biz = BUSINESSES.find(b => b.id === activeBiz);
  const bizSlots = getBusinessSlots(activeBiz, activeDay);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title">Business Admin</div>
        <button
          className={`sim-toggle ${simulationActive ? 'sim-on' : 'sim-off'}`}
          onClick={() => setSimulationActive(v => !v)}
        >
          <span className={`sim-dot ${simulationActive ? 'dot-on' : ''}`} />
          {simulationActive ? 'Simulation ON' : 'Simulation OFF'}
        </button>
      </div>

      <div className="sh" style={{ marginTop: 16 }}>Select business</div>
      <div className="admin-biz-pills">
        {BUSINESSES.map(b => (
          <button
            key={b.id}
            className={`admin-biz-pill biz-pill-${b.color}${activeBiz === b.id ? ' active' : ''}`}
            onClick={() => setActiveBiz(b.id)}
          >
            {b.icon} {b.name}
          </button>
        ))}
      </div>

      <div className="subtabs" style={{ marginTop: 16 }}>
        {DAYS_AHEAD.map(d => (
          <button key={d} className={`stab${activeDay === d ? ' active' : ''}`} onClick={() => setActiveDay(d)}>
            {getDayLabel(d)}
          </button>
        ))}
      </div>

      <div className="sh">Manage slots — {biz?.name}</div>
      <div className="admin-slots-grid">
        {bizSlots.map(slot => {
          const isOpen = slot.status === 'available' && !slot.blocked;
          const flashClass = slot.flash === 'booked' ? ' flash-book' : slot.flash === 'freed' ? ' flash-free' : '';
          return (
            <button
              key={slot.key}
              className={`admin-slot${isOpen ? ' admin-slot-open' : ' admin-slot-closed'}${flashClass} biz-admin-${biz?.color}`}
              onClick={() => toggleAdminSlot(slot.key)}
            >
              <span className="admin-slot-time">{slot.time}</span>
              <span className="admin-slot-status">{isOpen ? 'Open' : slot.blocked ? 'Blocked' : 'Booked'}</span>
              <span className="admin-slot-toggle">{isOpen ? '✓' : '✕'}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-legend">
        <span className="legend-item"><span className="legend-dot dot-open" />Open — click to block</span>
        <span className="legend-item"><span className="legend-dot dot-closed" />Closed — click to open</span>
      </div>
    </div>
  );
}

// ── Main Scheduling page ──────────────────────────────────────────────────────
export default function Scheduling() {
  const {
    slots,
    recentActivity,
    simulationActive,
    setSimulationActive,
    bookSlot,
    toggleAdminSlot,
    getSlot,
    getBusinessSlots,
    stats,
  } = useScheduler();

  const [view, setView] = useState('book'); // 'book' | 'admin'
  const [selectedDay, setSelectedDay] = useState(0);
  const [timePeriod, setTimePeriod] = useState('all'); // 'all' | 'morning' | 'afternoon' | 'evening'
  const [selectedBiz, setSelectedBiz] = useState(new Set()); // empty = all
  const [layout, setLayout] = useState('list'); // 'list' | 'grid'
  const [showActivity, setShowActivity] = useState(false);

  const filteredTimes = useMemo(() => {
    if (timePeriod === 'all') return TIMES;
    return TIMES.filter(t => getTimePeriod(t) === timePeriod);
  }, [timePeriod]);

  const filteredBiz = useMemo(() => {
    if (selectedBiz.size === 0) return BUSINESSES;
    return BUSINESSES.filter(b => selectedBiz.has(b.id));
  }, [selectedBiz]);

  const visibleSlots = useMemo(() => {
    const out = [];
    filteredTimes.forEach(time => {
      filteredBiz.forEach(biz => {
        const slot = slots[`${biz.id}|${selectedDay}|${time}`];
        if (slot) out.push({ slot, biz });
      });
    });
    return out;
  }, [slots, filteredBiz, filteredTimes, selectedDay]);

  const availableCount = visibleSlots.filter(({ slot }) => slot.status === 'available' && !slot.blocked).length;

  const toggleBizFilter = (bizId) => {
    setSelectedBiz(prev => {
      const next = new Set(prev);
      if (next.has(bizId)) next.delete(bizId);
      else next.add(bizId);
      return next;
    });
  };

  return (
    <div className="scheduling-page">

      {/* Subtabs */}
      <div className="subtabs">
        <button className={`stab${view === 'book' ? ' active' : ''}`} onClick={() => setView('book')}>Book</button>
        <button className={`stab${view === 'admin' ? ' active' : ''}`} onClick={() => setView('admin')}>Admin</button>
      </div>

      {view === 'admin' ? (
        <AdminPanel
          getBusinessSlots={getBusinessSlots}
          toggleAdminSlot={toggleAdminSlot}
          simulationActive={simulationActive}
          setSimulationActive={setSimulationActive}
        />
      ) : (
        <>
          {/* Live status bar */}
          <div className="live-bar">
            <div className="live-indicator">
              <span className={`live-dot ${simulationActive ? 'dot-pulse' : ''}`} />
              <span className="live-label">LIVE</span>
            </div>
            <div className="live-stats">
              <span className="stat-avail">{stats.available} open</span>
              <span className="stat-sep">·</span>
              <span className="stat-booked">{stats.booked} booked</span>
            </div>
            <button className="activity-toggle" onClick={() => setShowActivity(v => !v)}>
              {showActivity ? 'Hide feed' : 'Activity'}
              {recentActivity.length > 0 && !showActivity && (
                <span className="act-badge">{Math.min(recentActivity.length, 9)}</span>
              )}
            </button>
          </div>

          {showActivity && <ActivityFeed items={recentActivity} />}

          {/* Day selector */}
          <div className="day-nav">
            {DAYS_AHEAD.map(d => (
              <button
                key={d}
                className={`day-btn${selectedDay === d ? ' active' : ''}`}
                onClick={() => setSelectedDay(d)}
              >
                {getDayLabel(d)}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="filter-section">
            <div className="filter-row">
              <div className="filter-label">Time</div>
              <div className="pills">
                {['all', 'morning', 'afternoon', 'evening'].map(p => (
                  <button
                    key={p}
                    className={`pill${timePeriod === p ? ' pill-active' : ''}`}
                    onClick={() => setTimePeriod(p)}
                  >
                    {p === 'all' ? 'All day' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-row" style={{ marginTop: 10 }}>
              <div className="filter-label">Business</div>
              <div className="pills">
                {BUSINESSES.map(b => (
                  <button
                    key={b.id}
                    className={`pill pill-biz biz-pill-sm-${b.color}${selectedBiz.has(b.id) ? ' pill-active-biz' : ''}`}
                    onClick={() => toggleBizFilter(b.id)}
                  >
                    {b.icon} {b.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results header */}
          <div className="results-header">
            <div className="results-count">
              <span className="count-num">{availableCount}</span>
              <span className="count-label"> slot{availableCount !== 1 ? 's' : ''} available</span>
            </div>
            <div className="layout-toggles">
              <button
                className={`layout-btn${layout === 'list' ? ' layout-active' : ''}`}
                onClick={() => setLayout('list')}
                title="List view"
              >
                ☰
              </button>
              <button
                className={`layout-btn${layout === 'grid' ? ' layout-active' : ''}`}
                onClick={() => setLayout('grid')}
                title="Grid view"
              >
                ⊞
              </button>
            </div>
          </div>

          {/* Grid layout: businesses as columns */}
          {layout === 'grid' ? (
            <div className="grid-layout">
              {/* Column headers */}
              <div className="grid-header-row">
                <div className="grid-time-label" />
                {filteredBiz.map(biz => (
                  <div key={biz.id} className={`grid-col-header biz-col-${biz.color}`}>
                    <div className="grid-col-icon">{biz.icon}</div>
                    <div className="grid-col-name">{biz.name}</div>
                  </div>
                ))}
              </div>
              {/* Time rows */}
              {filteredTimes.map(time => (
                <div key={time} className="grid-time-row">
                  <div className="grid-time-label">{time}</div>
                  {filteredBiz.map(biz => {
                    const slot = slots[`${biz.id}|${selectedDay}|${time}`];
                    return (
                      <div key={biz.id} className="grid-cell">
                        <SlotCard slot={slot} biz={biz} onBook={bookSlot} compact />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            /* List layout */
            <div className="slot-list">
              {visibleSlots.length === 0 && (
                <div className="empty-state">No slots match your filters.</div>
              )}
              {visibleSlots.map(({ slot, biz }) => (
                <SlotCard key={slot.key} slot={slot} biz={biz} onBook={bookSlot} compact={false} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
