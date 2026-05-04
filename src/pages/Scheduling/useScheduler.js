import { useState, useEffect, useRef, useCallback } from 'react';

export const BUSINESSES = [
  { id: 'apex',    name: 'Apex Cuts',      category: 'Barbershop', color: 'orange', icon: '✂️' },
  { id: 'bloom',   name: 'Bloom Wellness', category: 'Spa',        color: 'purple', icon: '🌸' },
  { id: 'peak',    name: 'Peak PT',        category: 'Training',   color: 'green',  icon: '🏋️' },
  { id: 'clarity', name: 'Clarity Dental', category: 'Dental',     color: 'blue',   icon: '🦷' },
  { id: 'glow',    name: 'Glow Studio',    category: 'Nails',      color: 'yellow', icon: '💅' },
];

export const TIMES = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM',
];

export const DAYS_AHEAD = [0, 1, 2];

export function getDayLabel(offset) {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getTimePeriod(time) {
  const hour = parseInt(time);
  const isPM = time.includes('PM');
  const h24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
  if (h24 < 12) return 'morning';
  if (h24 < 17) return 'afternoon';
  return 'evening';
}

function slotKey(bizId, dayOffset, time) {
  return `${bizId}|${dayOffset}|${time}`;
}

function buildInitialSlots() {
  const slots = {};
  // Use seeded randomness for consistent initial state
  let seed = 42;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  BUSINESSES.forEach(biz => {
    DAYS_AHEAD.forEach(day => {
      TIMES.forEach(time => {
        const key = slotKey(biz.id, day, time);
        slots[key] = {
          key,
          businessId: biz.id,
          dayOffset: day,
          time,
          status: rand() > 0.38 ? 'available' : 'booked',
          blocked: rand() > 0.9, // ~10% admin-blocked
          flash: null, // 'booked' | 'freed' | null
        };
      });
    });
  });
  return slots;
}

const CHANNEL_NAME = 'akb-scheduling-demo';

export function useScheduler() {
  const [slots, setSlots] = useState(buildInitialSlots);
  const [recentActivity, setRecentActivity] = useState([]); // [{key, action, biz, time}]
  const [simulationActive, setSimulationActive] = useState(true);
  const channelRef = useRef(null);
  const tickRef = useRef(null);

  // BroadcastChannel for cross-tab sync
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current.onmessage = (e) => {
        const { type, key, status } = e.data;
        if (type === 'SLOT_UPDATE') {
          setSlots(prev => {
            if (!prev[key]) return prev;
            return { ...prev, [key]: { ...prev[key], status, flash: status === 'booked' ? 'booked' : 'freed' } };
          });
          clearFlash(key);
          pushActivity(key, status, e.data.bizName, e.data.time);
        }
      };
    } catch {
      // BroadcastChannel not supported
    }
    return () => { try { channelRef.current?.close(); } catch {} };
  }, []);

  const clearFlash = useCallback((key) => {
    setTimeout(() => {
      setSlots(prev => prev[key] ? { ...prev, [key]: { ...prev[key], flash: null } } : prev);
    }, 1400);
  }, []);

  const pushActivity = useCallback((key, status, bizName, time) => {
    const entry = { key, status, bizName, time, ts: Date.now(), id: Math.random() };
    setRecentActivity(prev => [entry, ...prev].slice(0, 8));
  }, []);

  // Simulation: randomly book/release slots
  useEffect(() => {
    if (!simulationActive) {
      clearTimeout(tickRef.current);
      return;
    }

    const tick = () => {
      setSlots(prev => {
        const keys = Object.keys(prev);
        // Pick 1-3 available slots to book
        const available = keys.filter(k => prev[k].status === 'available' && !prev[k].blocked);
        const booked = keys.filter(k => prev[k].status === 'booked' && !prev[k].blocked);

        const next = { ...prev };
        const changed = [];

        // Book 1-2 available slots
        if (available.length > 0) {
          const pick = available.sort(() => Math.random() - 0.5).slice(0, Math.random() > 0.5 ? 2 : 1);
          pick.forEach(k => {
            next[k] = { ...next[k], status: 'booked', flash: 'booked' };
            changed.push({ k, status: 'booked' });
          });
        }

        // Occasionally release a booked slot (cancellation)
        if (booked.length > 0 && Math.random() > 0.55) {
          const pick = booked.sort(() => Math.random() - 0.5).slice(0, 1);
          pick.forEach(k => {
            next[k] = { ...next[k], status: 'available', flash: 'freed' };
            changed.push({ k, status: 'available' });
          });
        }

        // Broadcast to other tabs
        changed.forEach(({ k, status }) => {
          const slot = next[k];
          const biz = BUSINESSES.find(b => b.id === slot.businessId);
          try {
            channelRef.current?.postMessage({
              type: 'SLOT_UPDATE', key: k, status,
              bizName: biz?.name, time: slot.time,
            });
          } catch {}
        });

        // Push to activity feed
        changed.forEach(({ k, status }) => {
          const slot = next[k];
          const biz = BUSINESSES.find(b => b.id === slot.businessId);
          pushActivity(k, status, biz?.name, slot.time);
        });

        return next;
      });

      changed_keys_ref.current.forEach(k => clearFlash(k));
      changed_keys_ref.current = [];

      tickRef.current = setTimeout(tick, 3500 + Math.random() * 4500);
    };

    const changed_keys_ref = { current: [] };
    tickRef.current = setTimeout(tick, 2000 + Math.random() * 2000);
    return () => clearTimeout(tickRef.current);
  }, [simulationActive, clearFlash, pushActivity]);

  const bookSlot = useCallback((key) => {
    setSlots(prev => {
      if (!prev[key] || prev[key].status !== 'available') return prev;
      const next = { ...prev, [key]: { ...prev[key], status: 'booked', flash: 'booked' } };
      const slot = next[key];
      const biz = BUSINESSES.find(b => b.id === slot.businessId);
      try {
        channelRef.current?.postMessage({
          type: 'SLOT_UPDATE', key, status: 'booked',
          bizName: biz?.name, time: slot.time,
        });
      } catch {}
      pushActivity(key, 'booked', biz?.name, slot.time);
      return next;
    });
    clearFlash(key);
  }, [clearFlash, pushActivity]);

  const toggleAdminSlot = useCallback((key) => {
    setSlots(prev => {
      if (!prev[key]) return prev;
      const cur = prev[key];
      const blocked = !cur.blocked;
      return { ...prev, [key]: { ...cur, blocked, status: blocked ? 'booked' : 'available', flash: blocked ? 'booked' : 'freed' } };
    });
    clearFlash(key);
  }, [clearFlash]);

  const getSlot = useCallback((bizId, dayOffset, time) => {
    return slots[slotKey(bizId, dayOffset, time)];
  }, [slots]);

  const getBusinessSlots = useCallback((bizId, dayOffset) => {
    return TIMES.map(t => slots[slotKey(bizId, dayOffset, t)]).filter(Boolean);
  }, [slots]);

  const stats = {
    total: Object.values(slots).length,
    available: Object.values(slots).filter(s => s.status === 'available' && !s.blocked).length,
    booked: Object.values(slots).filter(s => s.status === 'booked').length,
  };

  return {
    slots,
    recentActivity,
    simulationActive,
    setSimulationActive,
    bookSlot,
    toggleAdminSlot,
    getSlot,
    getBusinessSlots,
    stats,
  };
}
