// карточка товара и список карточек
import { Heart, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getCategory } from '../../data/products';
import { rub, priceLabel } from '../../utils/format';
import { ProductImage } from '../Media';

export function ProductList({ products, layout = 'grid', columns = 'grid-cols-2 lg:grid-cols-4', onOpenProduct }) {
  return (
    <div className={layout === 'grid' ? `grid ${columns} gap-x-4 gap-y-8 sm:gap-x-6` : 'divide-y divide-stone-200 border-y border-stone-200'}>
      {products.map((p) => <ProductCard key={p.id} product={p} layout={layout} onOpenProduct={onOpenProduct} />)}
    </div>
  );
}

export function ProductCard({ product, layout = 'grid', onOpenProduct, className = '' }) {
  const { addToCart, productQty, decrementProduct } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);
  const inCart = productQty(product.id);
  const isList = layout === 'list';
  const open = () => onOpenProduct(product.id);

  return (
    <article className={`group ${isList ? 'flex gap-4 sm:gap-6 py-4' : 'flex flex-col'} ${className}`}>
      {/* фото открывает окно товара */}
      <div className={`relative shrink-0 aspect-[4/5] overflow-hidden rounded-lg ${isList ? 'w-28 sm:w-40' : ''}`}>
        <button onClick={open} className="block w-full h-full transition-transform duration-500 group-hover:scale-105" aria-label={`Подробнее: ${product.title}`}>
          <ProductImage product={product} />
        </button>
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-sm bg-blush-500 text-white text-[10px] font-semibold uppercase tracking-wider">{product.badge}</span>
        )}
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-cream/90 hover:bg-white"
          aria-label={favorited ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={favorited}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'text-blush-500 fill-blush-500' : 'text-stone-600'}`} />
        </button>
      </div>

      <div className={`flex-1 min-w-0 flex flex-col ${isList ? '' : 'pt-3'}`}>
        <div className="text-[11px] uppercase tracking-wider text-stone-400">{getCategory(product.category).name}</div>
        <button onClick={open} className="mt-1 text-left font-serif text-base sm:text-lg leading-snug text-stone-900 hover:text-brand-700 line-clamp-2">
          {product.title}
        </button>
        {isList && <p className="mt-1 text-sm text-stone-500 line-clamp-2 hidden sm:block">{product.description}</p>}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-semibold text-stone-900">{priceLabel(product)}</span>
          {product.oldPrice && <span className="text-xs text-stone-400 line-through">{rub(product.oldPrice)}</span>}
        </div>

        {/* в корзину или счётчик */}
        <div className={`mt-auto pt-3 ${isList ? 'sm:w-48' : ''}`}>
          {inCart === 0 ? (
            <button onClick={() => addToCart(product)} className="btn-outline w-full py-2.5">В корзину</button>
          ) : (
            <div className="flex items-center justify-between rounded-md bg-brand-700 text-white">
              <button onClick={() => decrementProduct(product.id)} className="p-2.5" aria-label="Убрать одну штуку">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium">{inCart} шт.</span>
              <button onClick={() => addToCart(product, 1, undefined, { silent: true })} className="p-2.5" aria-label="Добавить ещё одну">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
