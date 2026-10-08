// каталог фильтры слева товары справа
import { useMemo, useState } from 'react';
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES, getCategory } from '../../data/products';
import { rub, plural } from '../../utils/format';
import { ProductList } from './ProductCard';
import { Overlay } from '../Overlay';

// границы ползунка цены по товарам
const MIN_PRICE = Math.min(...PRODUCTS.map((p) => p.price));
const MAX_PRICE = Math.max(...PRODUCTS.map((p) => p.price));
const STEP = 9;

const SORTS = {
  popular: ['Популярные', (a, b) => b.reviews - a.reviews],
  'price-asc': ['Сначала дешевле', (a, b) => a.price - b.price],
  'price-desc': ['Сначала дороже', (a, b) => b.price - a.price],
  rating: ['По рейтингу', (a, b) => b.rating - a.rating],
};

// подходит ли товар под поиск
const matches = (p, q) => [p.title, p.description, ...p.composition].some((f) => f.toLowerCase().includes(q));

export function Catalog({ selectedCategory, onSelectCategory, searchQuery, onSearchChange, onOpenProduct }) {
  const [sortBy, setSortBy] = useState('popular');
  const [priceLimit, setPriceLimit] = useState(MAX_PRICE);
  const [onlySale, setOnlySale] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [visible, setVisible] = useState(STEP);
  const [sheetOpen, setSheetOpen] = useState(false);

  // любой фильтр снова показывает первые товары
  const withReset = (fn) => (value) => {
    fn(value);
    setVisible(STEP);
  };

  const products = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(
      (p) => (!q || matches(p, q)) && (selectedCategory === 'all' || p.category === selectedCategory) && p.price <= priceLimit && (!onlySale || p.oldPrice)
    ).sort(SORTS[sortBy][1]);
  }, [selectedCategory, searchQuery, priceLimit, onlySale, sortBy]);

  const activeFilters = (selectedCategory !== 'all') + (priceLimit < MAX_PRICE) + onlySale;
  const resetFilters = () => {
    onSelectCategory('all');
    onSearchChange('');
    setPriceLimit(MAX_PRICE);
    setOnlySale(false);
    setVisible(STEP);
  };

  // фильтры одинаковые для колонки и шторки
  const filters = (
    <div className="space-y-8">
      <div>
        <div className="label">Категории</div>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => withReset(onSelectCategory)(c.id)}
            aria-pressed={selectedCategory === c.id}
            className={`w-full flex justify-between px-3 py-2 rounded-md text-sm ${selectedCategory === c.id ? 'bg-brand-700 text-white' : 'text-stone-700 hover:bg-stone-100'}`}
          >
            {c.name} <span className="opacity-60">{c.count}</span>
          </button>
        ))}
      </div>
      <label className="block">
        <span className="label">Цена до {rub(priceLimit)}</span>
        <input type="range" min={MIN_PRICE} max={MAX_PRICE} step={100} value={priceLimit} onChange={(e) => withReset(setPriceLimit)(Number(e.target.value))} className="w-full accent-brand-700" />
      </label>
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <input type="checkbox" checked={onlySale} onChange={(e) => withReset(setOnlySale)(e.target.checked)} className="w-4 h-4 accent-brand-700" />
        Только со скидкой
      </label>
      {activeFilters > 0 && <button onClick={resetFilters} className="btn-ghost px-0">Сбросить фильтры</button>}
    </div>
  );

  return (
    <div className="page py-8 lg:py-12">
      <div className="text-xs uppercase tracking-wider text-stone-400">Каталог</div>
      <h1 className="mt-1 mb-8 text-3xl sm:text-4xl text-stone-900">{getCategory(selectedCategory).name}</h1>

      <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-36">{filters}</div>
        </aside>

        <section>
          {/* панель над товарами */}
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-200">
            <button onClick={() => setSheetOpen(true)} className="btn-outline py-2 px-3 lg:hidden">
              <SlidersHorizontal className="w-4 h-4" />
              Фильтры{activeFilters > 0 && ` · ${activeFilters}`}
            </button>
            <span className="hidden lg:inline text-sm text-stone-500">{products.length} {plural(products.length, ['товар', 'товара', 'товаров'])}</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Сортировка" className="input w-auto py-2 ml-auto">
              {Object.entries(SORTS).map(([id, [label]]) => <option key={id} value={id}>{label}</option>)}
            </select>
            {[['grid', LayoutGrid, 'Сеткой'], ['list', List, 'Списком']].map(([id, Icon, label]) => (
              <button key={id} onClick={() => setViewMode(id)} aria-label={label} aria-pressed={viewMode === id} className={`hidden sm:block p-2 rounded-md ${viewMode === id ? 'bg-brand-700 text-white' : 'text-stone-500'}`}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {searchQuery && (
            <div className="mb-6 text-sm">
              Поиск:{' '}
              <button onClick={() => onSearchChange('')} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-800" aria-label="Очистить поиск">
                {searchQuery} <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {products.length > 0 ? (
            <>
              <ProductList products={products.slice(0, visible)} layout={viewMode} columns="grid-cols-2 xl:grid-cols-3" onOpenProduct={onOpenProduct} />
              {visible < products.length && (
                <div className="mt-12 text-center">
                  <button onClick={() => setVisible(visible + STEP)} className="btn-outline px-10">Показать ещё</button>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center space-y-4">
              <h2 className="text-2xl text-stone-900">Ничего не нашли</h2>
              <button onClick={resetFilters} className="btn-outline">Сбросить фильтры</button>
            </div>
          )}
        </section>
      </div>

      {/* шторка с фильтрами на телефоне */}
      {sheetOpen && (
        <Overlay side="bottom" label="Фильтры" onClose={() => setSheetOpen(false)} className="lg:hidden">
          <div className="p-5 space-y-6">
            {filters}
            <button onClick={() => setSheetOpen(false)} className="btn-primary w-full">Показать {products.length}</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}
