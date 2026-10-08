// страница избранного
import { PRODUCTS } from '../data/products';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { plural } from '../utils/format';
import { ProductList } from './Catalog/ProductCard';

export function FavoritesPage({ onOpenCatalog, onOpenProduct }) {
  const { favorites, clearFavorites } = useFavorites();
  const { addToCart, showToast } = useCart();
  const products = PRODUCTS.filter((p) => favorites.includes(p.id));

  // всё избранное в корзину
  const addAll = () => {
    products.forEach((p) => addToCart(p, 1, undefined, { silent: true }));
    showToast(`${products.length} ${plural(products.length, ['товар добавлен', 'товара добавлено', 'товаров добавлено'])} в корзину`);
  };

  return (
    <div className="page py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <h1 className="text-3xl sm:text-4xl text-stone-900">Избранное <span className="text-stone-400 text-2xl">{products.length}</span></h1>
        {products.length > 0 && (
          <div className="flex gap-2">
            <button onClick={clearFavorites} className="btn-ghost">Очистить</button>
            <button onClick={addAll} className="btn-primary flex-1">Всё в корзину</button>
          </div>
        )}
      </div>
      {products.length > 0 ? (
        <ProductList products={products} onOpenProduct={onOpenProduct} />
      ) : (
        <div className="py-12 text-center space-y-4">
          <p className="text-stone-500">Нажимайте на сердечко на фото, чтобы сохранить понравившиеся букеты.</p>
          <button onClick={() => onOpenCatalog()} className="btn-primary px-10">В каталог</button>
        </div>
      )}
    </div>
  );
}
