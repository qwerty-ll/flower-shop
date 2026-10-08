// окно товара поверх страницы
import { useState } from 'react';
import { X, Heart, Minus, Plus, Star } from 'lucide-react';
import { getCategory } from '../data/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTimedValue } from '../hooks/useTimedValue';
import { rub, plural } from '../utils/format';
import { ProductImage } from './Media';
import { Overlay } from './Overlay';

export function ProductModal({ product, onClose, onOpenCart }) {
  const { addToCart, productQty } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [size, setSize] = useState(product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, flashAdded] = useTimedValue(1800);
  const price = size?.price ?? product.price;
  const inCart = productQty(product.id);

  // добавить окно не закрываем
  const handleAdd = () => {
    addToCart(product, quantity, size?.label ?? null, { silent: true });
    flashAdded();
  };

  return (
    <Overlay label={product.title} onClose={onClose}>
      <button onClick={onClose} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-cream/90 shadow-sm" aria-label="Закрыть">
        <X className="w-5 h-5" />
      </button>

      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5]">
          <ProductImage product={product} />
          {product.badge && (
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-sm bg-blush-500 text-white text-[11px] font-semibold uppercase tracking-wider">{product.badge}</span>
          )}
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-400">{getCategory(product.category).name}</div>
            <h2 className="mt-1 text-2xl sm:text-3xl text-stone-900 pr-8">{product.title}</h2>
            <div className="mt-2 flex items-center gap-1 text-sm text-stone-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)} · {product.reviews} {plural(product.reviews, ['отзыв', 'отзыва', 'отзывов'])}
            </div>
            <p className="mt-4 text-stone-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl text-stone-900">{rub(price)}</span>
            {product.oldPrice && size === product.sizes?.[0] && <span className="text-stone-400 line-through">{rub(product.oldPrice)}</span>}
          </div>

          {/* размер */}
          {product.sizes && (
            <div>
              <div className="label">Размер</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`px-4 py-2 rounded-md border text-sm ${size === s ? 'border-brand-700 bg-brand-700 text-white' : 'border-stone-300 bg-white'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* количество в корзину избранное */}
          <div className="flex gap-2">
            <div className="flex items-center rounded-md border border-stone-300 bg-white">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="p-3 disabled:opacity-30" aria-label="Меньше">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-5 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-3" aria-label="Больше">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button onClick={handleAdd} className={`btn flex-1 text-white ${justAdded ? 'bg-brand-500' : 'bg-brand-700 hover:bg-brand-800'}`}>
              {justAdded ? 'Добавлено ✓' : 'В корзину'}
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFavorite(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}
              aria-pressed={isFavorite(product.id)}
              className="px-3.5 rounded-md border border-stone-300 bg-white"
            >
              <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-blush-500 text-blush-500' : 'text-stone-600'}`} />
            </button>
          </div>

          {inCart > 0 && (
            <button onClick={onOpenCart} className="w-full flex justify-between p-3 rounded-md bg-brand-50 text-sm text-brand-800">
              В корзине {inCart} шт. <span className="font-semibold">Перейти в корзину →</span>
            </button>
          )}

          <div className="text-sm text-stone-600 border-t border-stone-200 pt-5 space-y-3">
            <p><span className="label inline">Состав: </span>{product.composition.join(', ')}</p>
            <p>Доставка от 2 часов. Бесплатно от 5 000 ₽, иначе 390 ₽. Самовывоз бесплатно.</p>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
