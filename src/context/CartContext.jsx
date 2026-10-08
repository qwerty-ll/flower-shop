// корзина для всего сайта
import { createContext, useContext } from 'react';
import { getProduct, FREE_DELIVERY_FROM, DELIVERY_PRICE } from '../data/products';
import { usePersistentState } from '../hooks/usePersistentState';
import { useTimedValue } from '../hooks/useTimedValue';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // в браузере храним только id размер и количество цены берутся из каталога
  const [items, setItems] = usePersistentState('cvetochki_cart', []);
  const [toast, setToast] = useTimedValue(2500);
  const showToast = (text) => setToast({ text, id: Date.now() });

  // позиции с товаром и ценой удалённые из каталога пропускаем
  const lines = items.flatMap((item) => {
    const product = getProduct(item.productId);
    if (!product) return [];
    const size = product.sizes?.find((s) => s.label === item.size);
    return [{ ...item, product, unitPrice: size?.price ?? product.price }];
  });

  // добавить товар без размера берём первый
  const addToCart = (product, quantity = 1, size = product.sizes?.[0].label ?? null, { silent = false } = {}) => {
    const key = `${product.id}:${size}`;
    setItems((prev) =>
      prev.some((i) => i.key === key)
        ? prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i))
        : [...prev, { key, productId: product.id, size, quantity }]
    );
    if (!silent) showToast(`«${product.title}» в корзине`);
  };

  // изменить количество при нуле позиция удаляется
  const updateQuantity = (key, delta) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0));

  const removeFromCart = (key) => setItems((prev) => prev.filter((i) => i.key !== key));

  // сколько штук товара в корзине и убрать одну
  const productQty = (id) => lines.reduce((sum, l) => sum + (l.productId === id ? l.quantity : 0), 0);
  const decrementProduct = (id) => {
    const line = lines.findLast((l) => l.productId === id);
    if (line) updateQuantity(line.key, -1);
  };

  // итоги
  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const deliveryCost = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;
  const freeDeliveryLeft = Math.max(0, FREE_DELIVERY_FROM - subtotal);

  // оформить заказ сохраняем в браузере и чистим корзину
  const createOrder = (customer, delivery) => {
    const order = {
      number: `CV-${Math.floor(100000 + Math.random() * 900000)}`,
      lines: lines.map((l) => ({ title: l.product.title, size: l.size, quantity: l.quantity, price: l.unitPrice })),
      total: subtotal + delivery,
      customer,
    };
    try {
      localStorage.setItem('cvetochki_orders', JSON.stringify([order, ...JSON.parse(localStorage.getItem('cvetochki_orders') || '[]')]));
    } catch {
      // заказ всё равно показываем
    }
    setItems([]);
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        lines, addToCart, updateQuantity, removeFromCart, productQty, decrementProduct,
        totalItems, subtotal, deliveryCost, freeDeliveryLeft, createOrder,
        toast, showToast, hideToast: () => setToast(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
