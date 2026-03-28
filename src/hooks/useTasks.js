import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { storageGet, storageSet } from '../lib/storage.js';
import { getToday, addDays } from '../lib/dates.js';

function rolloverTasks(tasks, today) {
  return tasks.flatMap(task => {
    if (task.section === 'today' && !task.completedAt) {
      // Unfinished today tasks move to tomorrow
      if (task.recurring) {
        // Recurring: keep original as new today, mark old as completed
        return [{ ...task, id: Date.now() + Math.random(), createdAt: today }];
      }
      return [{ ...task, section: 'tomorrow' }];
    }
    if (task.section === 'tomorrow') {
      // Tomorrow tasks become today
      return [{ ...task, section: 'today' }];
    }
    return [task];
  });
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);

  useEffect(() => {
    const today = getToday();
    const lastOpen = storageGet('tasks:lastOpen', '');
    if (lastOpen !== today) {
      setTasks(prev => rolloverTasks(prev, today));
      storageSet('tasks:lastOpen', today);
    }
  }, []);

  const addTask = ({ title, notes, dueDate, section = 'inbox', recurring = false }) => {
    const today = getToday();
    const maxOrder = tasks.filter(t => t.section === section).reduce((m, t) => Math.max(m, t.order), -1);
    setTasks(prev => [
      ...prev,
      {
        id: `t_${Date.now()}`,
        title,
        notes: notes || '',
        dueDate: dueDate || null,
        section,
        recurring,
        order: maxOrder + 1,
        createdAt: today,
        completedAt: null,
      },
    ]);
  };

  const completeTask = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, section: 'completed', completedAt: getToday() } : t
    ));
  };

  const uncompleteTask = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, section: 'today', completedAt: null } : t
    ));
  };

  const moveTask = (id, section) => {
    const maxOrder = tasks.filter(t => t.section === section).reduce((m, t) => Math.max(m, t.order), -1);
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, section, order: maxOrder + 1 } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const reorderTasks = (section, orderedIds) => {
    setTasks(prev => prev.map(t => {
      if (t.section !== section) return t;
      const idx = orderedIds.indexOf(t.id);
      return idx >= 0 ? { ...t, order: idx } : t;
    }));
  };

  const getSection = (section) =>
    tasks.filter(t => t.section === section).sort((a, b) => a.order - b.order);

  return { tasks, addTask, completeTask, uncompleteTask, moveTask, deleteTask, reorderTasks, getSection };
}
