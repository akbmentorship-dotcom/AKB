import { useState, useEffect, useRef, useCallback } from 'react';

export const BUSINESSES = [
  { id: 'luxe',    name: 'Studio Luxe',    category: 'Hair Salon',    color: 'pink',   icon: '💇' },
  { id: 'quickfix',name: 'QuickFix Pro',   category: 'Home Repairs',  color: 'orange', icon: '🔧' },
  { id: 'clearmind',name:'ClearMind',      category: 'Therapy',       color: 'purple', icon: '🧠' },
  { id: 'pawcare', name: 'PawCare Vet',    category: 'Veterinary',    color: 'green',  icon: '🐾' },
  { id: 'autopro', name: 'AutoPro',        category: 'Auto Service',  color: 'blue',   icon: '🚗' },
];

export const TIMES = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
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
  const h = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function slotKey(bizId, day, time) { return `${bizId}|${day}|${time}`; }

function buildSlots() {
  const slots = {};
  let seed = 137;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
  BUSINESSES.forEach(biz => {
    DAYS_AHEAD.forEach(day => {
      TIMES.forEach(time => {
        const key = slotKey(biz.id, day, time);
        slots[key] = { key, businessId: biz.id, dayOffset: day, time, status: rand() > 0.35 ? 'available' : 'booked', blocked: rand() > 0.92, flash: null };
      });
    });
  });
  return slots;
}

export function useScheduler() {
  const [slots, setSlots] = useState(buildSlots);
  const [activity, setActivity] = useState([]);
  const [simOn, setSimOn] = useState(true);
  const channelRef = useRef(null);
  const tickRef = useRef(null);

  const clearFlash = useCallback((key) => {
    setTimeout(() => setSlots(p => p[key] ? { ...p, [key]: { ...p[key], flash: null } } : p), 1400);
  }, []);

  const pushActivity = useCallback((key, status, bizName, time) => {
    setActivity(p => [{ key, status, bizName, time, ts: Date.now(), id: Math.random() }, ...p].slice(0, 10));
  }, []);

  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('slotsync-demo');
      channelRef.current.onmessage = ({ data }) => {
        if (data.type === 'UPDATE') {
          setSlots(p => p[data.key] ? { ...p, [data.key]: { ...p[data.key], status: data.status, flash: data.status === 'booked' ? 'booked' : 'freed' } } : p);
          clearFlash(data.key);
          pushActivity(data.key, data.status, data.bizName, data.time);
        }
      };
    } catch {}
    return () => { try { channelRef.current?.close(); } catch {} };
  }, [clearFlash, pushActivity]);

  useEffect(() => {
    if (!simOn) { clearTimeout(tickRef.current); return; }
    const tick = () => {
      const changed = [];
      setSlots(prev => {
        const next = { ...prev };
        const avail = Object.keys(prev).filter(k => prev[k].status === 'available' && !prev[k].blocked);
        const booked = Object.keys(prev).filter(k => prev[k].status === 'booked' && !prev[k].blocked);
        const toBook = avail.sort(() => Math.random() - 0.5).slice(0, Math.random() > 0.4 ? 2 : 1);
        toBook.forEach(k => { next[k] = { ...next[k], status: 'booked', flash: 'booked' }; changed.push({ k, status: 'booked' }); });
        if (booked.length > 0 && Math.random() > 0.6) {
          const k = booked.sort(() => Math.random() - 0.5)[0];
          next[k] = { ...next[k], status: 'available', flash: 'freed' };
          changed.push({ k, status: 'available' });
        }
        changed.forEach(({ k, status }) => {
          const slot = next[k];
          const biz = BUSINESSES.find(b => b.id === slot.businessId);
          try { channelRef.current?.postMessage({ type: 'UPDATE', key: k, status, bizName: biz?.name, time: slot.time }); } catch {}
          pushActivity(k, status, biz?.name, slot.time);
        });
        return next;
      });
      changed.forEach(({ k }) => clearFlash(k));
      tickRef.current = setTimeout(tick, 3000 + Math.random() * 5000);
    };
    tickRef.current = setTimeout(tick, 2000);
    return () => clearTimeout(tickRef.current);
  }, [simOn, clearFlash, pushActivity]);

  const bookSlot = useCallback((key) => {
    setSlots(prev => {
      if (!prev[key] || prev[key].status !== 'available') return prev;
      const next = { ...prev, [key]: { ...prev[key], status: 'booked', flash: 'booked' } };
      const slot = next[key];
      const biz = BUSINESSES.find(b => b.id === slot.businessId);
      try { channelRef.current?.postMessage({ type: 'UPDATE', key, status: 'booked', bizName: biz?.name, time: slot.time }); } catch {}
      pushActivity(key, 'booked', biz?.name, slot.time);
      return next;
    });
    clearFlash(key);
  }, [clearFlash, pushActivity]);

  const toggleSlot = useCallback((key) => {
    setSlots(prev => {
      if (!prev[key]) return prev;
      const blocked = !prev[key].blocked;
      return { ...prev, [key]: { ...prev[key], blocked, status: blocked ? 'booked' : 'available', flash: blocked ? 'booked' : 'freed' } };
    });
    clearFlash(key);
  }, [clearFlash]);

  const getBusinessSlots = useCallback((bizId, day) =>
    TIMES.map(t => slots[slotKey(bizId, day, t)]).filter(Boolean), [slots]);

  const stats = {
    available: Object.values(slots).filter(s => s.status === 'available' && !s.blocked).length,
    booked: Object.values(slots).filter(s => s.status === 'booked').length,
  };

  return { slots, activity, simOn, setSimOn, bookSlot, toggleSlot, getBusinessSlots, stats };
}
