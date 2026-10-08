import { useState, useEffect } from 'react';

// состояние которое сохраняется в браузере
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // хранилище недоступно просто не сохраняем
    }
  }, [key, value]);

  return [value, setValue];
}
