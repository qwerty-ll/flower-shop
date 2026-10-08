// главный файл страницы по адресу #catalog #cart и т.д.
import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { getProduct } from './data/products';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Catalog } from './components/Catalog/Catalog';
import { FavoritesPage } from './components/FavoritesPage';
import { CartPage } from './components/CartPage';
import { ProductModal } from './components/ProductModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

const PAGES = ['home', 'catalog', 'favorites', 'cart'];
const pageFromHash = () => (PAGES.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home');

function Shop() {
  const [page, setPage] = useState(pageFromHash);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [productId, setProductId] = useState(null);

  // кнопки назад и вперёд в браузере
  useEffect(() => {
    const onHash = () => {
      setPage(pageFromHash());
      setProductId(null);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // переход на страницу повторное нажатие поднимает наверх
  const navigate = (next) => {
    setProductId(null);
    if (next === page) window.scrollTo({ top: 0, behavior: 'smooth' });
    else location.hash = next;
  };
  const openCatalog = (cat = 'all') => {
    setCategory(cat);
    navigate('catalog');
  };
  const openCart = () => navigate('cart');
  const product = getProduct(productId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={page} selectedCategory={category} onNavigate={navigate} onOpenCatalog={openCatalog} searchQuery={search} setSearchQuery={setSearch} />

      <main className="flex-1">
        {page === 'home' && <HomePage onOpenCatalog={openCatalog} onOpenProduct={setProductId} />}
        {page === 'catalog' && (
          <Catalog selectedCategory={category} onSelectCategory={setCategory} searchQuery={search} onSearchChange={setSearch} onOpenProduct={setProductId} />
        )}
        {page === 'favorites' && <FavoritesPage onOpenCatalog={openCatalog} onOpenProduct={setProductId} />}
        {page === 'cart' && <CartPage onOpenCatalog={openCatalog} onOpenProduct={setProductId} />}
      </main>

      <Footer onOpenCatalog={openCatalog} />

      {product && <ProductModal key={product.id} product={product} onClose={() => setProductId(null)} onOpenCart={openCart} />}
      <Toast hidden={page === 'cart'} onOpenCart={openCart} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Shop />
      </FavoritesProvider>
    </CartProvider>
  );
}
