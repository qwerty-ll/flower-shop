// избранное для всего сайта
import { createContext, useContext } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = usePersistentState('cvetochki_favorites', []);

  // добавить или убрать
  const toggleFavorite = (id) => setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite: (id) => favorites.includes(id), toggleFavorite, clearFavorites: () => setFavorites([]) }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
