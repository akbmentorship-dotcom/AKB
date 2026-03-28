import { useLocalStorage } from './useLocalStorage.js';
import { getToday } from '../lib/dates.js';

export function usePipeline(board) {
  const [cards, setCards] = useLocalStorage(`pipeline:${board}`, []);

  const addCard = ({ name, note }) => {
    const today = getToday();
    const colCards = cards.filter(c => c.column === 'new');
    const maxOrder = colCards.reduce((m, c) => Math.max(m, c.order), -1);
    setCards(prev => [
      ...prev,
      {
        id: `p_${Date.now()}`,
        name,
        note: note || '',
        column: 'new',
        dateAdded: today,
        order: maxOrder + 1,
      },
    ]);
  };

  const editCard = (id, updates) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const moveCard = (id, column) => {
    const colCards = cards.filter(c => c.column === column);
    const maxOrder = colCards.reduce((m, c) => Math.max(m, c.order), -1);
    setCards(prev => prev.map(c => c.id === id ? { ...c, column, order: maxOrder + 1 } : c));
  };

  const reorderColumn = (column, orderedIds) => {
    setCards(prev => prev.map(c => {
      if (c.column !== column) return c;
      const idx = orderedIds.indexOf(c.id);
      return idx >= 0 ? { ...c, order: idx } : c;
    }));
  };

  const getColumn = (column) =>
    cards.filter(c => c.column === column).sort((a, b) => a.order - b.order);

  const todayCount = cards.filter(c => c.dateAdded === getToday()).length;

  return { cards, addCard, editCard, deleteCard, moveCard, reorderColumn, getColumn, todayCount };
}
