// шапка поиск и меню на телефоне
import { useState } from 'react';
import { Menu, Search, Heart, ShoppingBag, X } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Logo } from './Media';
import { Overlay } from './Overlay';

const LINKS = CATEGORIES.filter((c) => c.id !== 'all');

// значок с числом
function IconButton({ label, onClick, children, count }) {
  return (
    <button onClick={onClick} className="icon-btn" aria-label={count ? `${label}, ${count}` : label}>
      {children}
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-blush-500 text-white text-[11px] font-bold leading-[18px] text-center">
          {count}
        </span>
      )}
    </button>
  );
}

export function Header({ currentPage, selectedCategory, onNavigate, onOpenCatalog, searchQuery, setSearchQuery }) {
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ввод в поиске сразу ведёт в каталог
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (currentPage !== 'catalog') onNavigate('catalog');
  };

  // пункт меню закрывает меню
  const pick = (fn) => () => {
    setMenuOpen(false);
    fn();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-stone-200">
        <div className="page h-16 lg:h-20 grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-6 text-sm">
            <button onClick={() => setMenuOpen(true)} className="icon-btn lg:hidden" aria-label="Открыть меню">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => onNavigate('home')} className="hidden lg:block text-stone-600 hover:text-stone-900">Главная</button>
            <button onClick={() => onOpenCatalog()} className="hidden lg:block text-stone-600 hover:text-stone-900">Каталог</button>
          </div>

          <button onClick={() => onNavigate('home')} aria-label="На главную">
            <Logo />
          </button>

          <div className="flex justify-end">
            <IconButton label="Поиск" onClick={() => setSearchOpen((v) => !v)}>
              <Search className="w-5 h-5" />
            </IconButton>
            <IconButton label="Избранное" onClick={() => onNavigate('favorites')} count={favorites.length}>
              <Heart className="w-5 h-5" />
            </IconButton>
            <IconButton label="Корзина" onClick={() => onNavigate('cart')} count={totalItems}>
              <ShoppingBag className="w-5 h-5" />
            </IconButton>
          </div>
        </div>

        {/* категории строкой на компьютере */}
        <nav className="hidden lg:flex justify-center gap-8 border-t border-stone-200 text-xs uppercase tracking-wider">
          {LINKS.map((c) => (
            <button
              key={c.id}
              onClick={() => onOpenCatalog(c.id)}
              className={`py-3 border-b-2 ${currentPage === 'catalog' && selectedCategory === c.id ? 'border-blush-500 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              {c.name}
            </button>
          ))}
        </nav>

        {/* строка поиска */}
        {searchOpen && (
          <div className="page py-3 flex items-center gap-2 border-t border-stone-200 bg-white">
            <Search className="w-5 h-5 text-stone-400" />
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Розы, пионы, букет на свадьбу…"
              aria-label="Поиск цветов"
              className="flex-1 bg-transparent outline-none text-base py-1"
            />
            <button onClick={() => setSearchOpen(false)} className="icon-btn" aria-label="Закрыть поиск">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </header>

      {/* меню на телефоне */}
      {menuOpen && (
        <Overlay side="left" label="Меню" onClose={() => setMenuOpen(false)} className="lg:hidden">
          <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200">
            <Logo />
            <button onClick={() => setMenuOpen(false)} className="icon-btn" aria-label="Закрыть меню">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-6">
            <div>
              {[
                ['Главная', () => onNavigate('home')],
                ['Весь каталог', () => onOpenCatalog()],
                ['Избранное', () => onNavigate('favorites')],
                ['Корзина', () => onNavigate('cart')],
              ].map(([label, fn]) => (
                <button key={label} onClick={pick(fn)} className="block w-full text-left font-serif text-xl py-2">{label}</button>
              ))}
            </div>
            <div>
              <div className="label">Категории</div>
              {LINKS.map((c) => (
                <button key={c.id} onClick={pick(() => onOpenCatalog(c.id))} className="flex w-full justify-between py-2 text-stone-700">
                  {c.name} <span className="text-stone-400">{c.count}</span>
                </button>
              ))}
            </div>
          </nav>
        </Overlay>
      )}
    </>
  );
}
