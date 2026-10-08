// подвал
import { CATEGORIES } from '../data/products';
import { Logo } from './Media';

export function Footer({ onOpenCatalog }) {
  return (
    <footer className="mt-20 bg-brand-900 text-brand-100 text-sm">
      <div className="page py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-2">
          <Logo light />
          <p className="text-brand-200 max-w-sm">Небольшая цветочная мастерская. Собираем букеты в день заказа из цветов, которые привезли утром.</p>
        </div>
        <div className="grid gap-2 justify-items-start">
          <div className="label text-brand-300">Каталог</div>
          {CATEGORIES.slice(1).map((c) => (
            <button key={c.id} onClick={() => onOpenCatalog(c.id)} className="hover:text-white">{c.name}</button>
          ))}
        </div>
        <div className="space-y-2">
          <div className="label text-brand-300">Контакты</div>
          <p>+7 (900) 000-00-00</p>
          <p>Ежедневно 8:00 — 22:00</p>
          <p>Москва, доставка по городу</p>
        </div>
      </div>
      <div className="page py-5 border-t border-brand-800 text-xs text-brand-300">© {new Date().getFullYear()} Цветочки</div>
    </footer>
  );
}
