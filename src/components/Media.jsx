// логотип и фото из папки src/assets файлы подхватываются сами
import { Flower2 } from 'lucide-react';

// все картинки папки в виде имя файла -> ссылка
const collect = (files) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop().replace(/\.\w+$/, ''), url]));

// src/assets/products/<id товара>.jpg
const PHOTOS = collect(import.meta.glob('/src/assets/products/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }));
// src/assets/logo.png
const SITE = collect(import.meta.glob('/src/assets/*.{jpg,jpeg,png,webp,svg}', { eager: true, import: 'default' }));

// фото товара а без фото светлый фон с цветком
export function ProductImage({ product }) {
  if (PHOTOS[product.id]) {
    return <img src={PHOTOS[product.id]} alt={product.title} loading="lazy" className="block w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full bg-blush-50 flex items-center justify-center" role="img" aria-label={product.title}>
      <Flower2 className="w-1/4 h-1/4 text-blush-400" />
    </div>
  );
}

// логотип если файла нет пишем название
export function Logo({ light = false }) {
  if (SITE.logo) return <img src={SITE.logo} alt="Цветочки" className="h-9 sm:h-11 w-auto" />;
  return (
    <span className={`flex items-center gap-2 font-serif text-2xl sm:text-3xl ${light ? 'text-cream' : 'text-brand-800'}`}>
      <Flower2 className="w-6 h-6 text-blush-500" />
      Цветочки
    </span>
  );
}
