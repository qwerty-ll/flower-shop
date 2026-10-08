// страница корзины с оформлением заказа
import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { rub, plural } from '../utils/format';
import { ProductImage } from './Media';

const TIME_SLOTS = ['09:00–12:00', '12:00–15:00', '15:00–18:00', '18:00–21:00'];

// сегодняшняя дата для поля даты
const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// поле формы с подписью и ошибкой
function Field({ label, error, as: Tag = 'input', className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      <Tag {...props} className={`input ${error ? 'border-blush-500' : ''}`} aria-invalid={Boolean(error)} />
      {error && <span className="text-xs text-blush-600">{error}</span>}
    </label>
  );
}

// страница с заголовком и кнопкой для пустой корзины и спасибо
function Message({ title, text, action, onAction }) {
  return (
    <div className="page py-20 max-w-xl text-center space-y-4">
      <h1 className="text-3xl sm:text-4xl text-stone-900">{title}</h1>
      <p className="text-stone-600">{text}</p>
      <button onClick={onAction} className="btn-primary px-10">{action}</button>
    </div>
  );
}

export function CartPage({ onOpenProduct, onOpenCatalog }) {
  const { lines, updateQuantity, removeFromCart, totalItems, subtotal, deliveryCost, freeDeliveryLeft, createOrder } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', date: today(), time: TIME_SLOTS[1], card: '', method: 'courier' });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const delivery = form.method === 'pickup' ? 0 : deliveryCost;

  const field = (name) => ({ name, value: form[name], error: errors[name], onChange: (e) => setForm({ ...form, [name]: e.target.value }) });

  // проверка и отправка
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Укажите имя';
    if (form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Укажите телефон';
    if (form.method === 'courier' && !form.address.trim()) errs.address = 'Укажите адрес';
    if (form.date < today()) errs.date = 'Выберите дату';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setOrder(createOrder(form, delivery));
    window.scrollTo(0, 0);
  };

  if (order) {
    return <Message title="Спасибо за заказ!" text={`Номер заказа ${order.number} на ${rub(order.total)}. Мы позвоним по номеру ${order.customer.phone}, чтобы подтвердить детали.`} action="Продолжить покупки" onAction={() => onOpenCatalog()} />;
  }
  if (lines.length === 0) {
    return <Message title="Корзина пуста" text="Загляните в каталог — там много красивого." action="В каталог" onAction={() => onOpenCatalog()} />;
  }

  return (
    <div className="page py-8 lg:py-12">
      <h1 className="text-3xl sm:text-4xl text-stone-900 mb-8">
        Корзина <span className="text-stone-400 text-2xl">{totalItems} {plural(totalItems, ['товар', 'товара', 'товаров'])}</span>
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">
        <div className="space-y-12">
          {/* товары */}
          <ul className="divide-y divide-stone-200 border-y border-stone-200">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-4 py-4">
                <button onClick={() => onOpenProduct(line.productId)} className="w-20 sm:w-24 aspect-[4/5] rounded-md overflow-hidden shrink-0" aria-label={`Открыть ${line.product.title}`}>
                  <ProductImage product={line.product} />
                </button>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <div className="font-serif text-lg text-stone-900">{line.product.title}</div>
                      {line.size && <div className="text-sm text-stone-500">{line.size}</div>}
                    </div>
                    <button onClick={() => removeFromCart(line.key)} className="h-fit text-stone-400 hover:text-stone-800" aria-label="Удалить">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-stone-300 bg-white">
                      <button onClick={() => updateQuantity(line.key, -1)} className="p-2" aria-label="Меньше"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-7 text-center text-sm">{line.quantity}</span>
                      <button onClick={() => updateQuantity(line.key, 1)} className="p-2" aria-label="Больше"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <span className="font-semibold">{rub(line.unitPrice * line.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* данные доставки */}
          <form id="checkout" onSubmit={handleSubmit} noValidate className="space-y-5">
            <h2 className="text-2xl text-stone-900">Доставка</h2>
            <div className="grid grid-cols-2 gap-2">
              {[['courier', 'Курьером', deliveryCost ? rub(deliveryCost) : 'Бесплатно'], ['pickup', 'Самовывоз', 'Бесплатно']].map(([id, title, note]) => (
                <label key={id} className={`p-4 rounded-md border cursor-pointer text-sm ${form.method === id ? 'border-brand-700 bg-brand-50' : 'border-stone-300 bg-white'}`}>
                  <input type="radio" name="method" value={id} checked={form.method === id} onChange={field('method').onChange} className="sr-only" />
                  <div className="font-semibold">{title}</div>
                  <div className="text-stone-500">{note}</div>
                </label>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field {...field('name')} label="Ваше имя *" autoComplete="name" />
              <Field {...field('phone')} label="Телефон *" type="tel" autoComplete="tel" placeholder="+7 900 000-00-00" />
              {form.method === 'courier' && <Field {...field('address')} label="Адрес доставки *" placeholder="Улица, дом, квартира" className="sm:col-span-2" />}
              <Field {...field('date')} label="Дата *" type="date" min={today()} />
              <Field {...field('time')} label="Время" as="select">
                {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
              </Field>
              <Field {...field('card')} label="Текст открытки" as="textarea" rows={3} maxLength={200} placeholder="Необязательно" className="sm:col-span-2" />
            </div>
          </form>
        </div>

        {/* итог */}
        <aside className="lg:sticky lg:top-36 bg-white border border-stone-200 rounded-lg p-6 space-y-4 text-sm text-stone-600">
          <h2 className="text-2xl text-stone-900">Ваш заказ</h2>
          <p className={freeDeliveryLeft ? '' : 'text-brand-700'}>
            {freeDeliveryLeft ? `До бесплатной доставки ${rub(freeDeliveryLeft)}` : 'Доставка бесплатная'}
          </p>
          <div className="flex justify-between"><span>Товары</span><span>{rub(subtotal)}</span></div>
          <div className="flex justify-between"><span>Доставка</span><span>{delivery ? rub(delivery) : 'Бесплатно'}</span></div>
          <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-stone-900">
            <span>Итого</span>
            <span className="font-serif text-2xl">{rub(subtotal + delivery)}</span>
          </div>
          <button type="submit" form="checkout" className="btn-primary w-full py-4">Оформить заказ</button>
          <p className="text-xs text-stone-400 text-center">Оплата при получении. Мы позвоним для подтверждения.</p>
        </aside>
      </div>
    </div>
  );
}
