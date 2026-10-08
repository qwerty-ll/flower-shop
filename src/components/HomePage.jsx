// главная страница
import { Star, Phone, Camera } from 'lucide-react';
import { CATEGORIES, PRODUCTS, getProduct } from '../data/products';
import { ProductImage } from './Media';
import { ProductCard } from './Catalog/ProductCard';
import { plural } from '../utils/format';

const STATS = [['2 часа', 'доставка по городу'], ['7 дней', 'гарантия свежести'], ['4.9', 'средняя оценка']];

const STEPS = [
  ['Выбираете букет', 'В каталоге или звоните — подберём по бюджету и поводу.'],
  ['Собираем утром', 'Только цветы, которые привезли сегодня.'],
  ['Присылаем фото', 'Покажем готовый букет до отправки.'],
  ['Доставляем', 'От 2 часов по городу, бесплатно от 5 000 ₽.'],
];

const REVIEWS = [
  ['Анна', 'Заказывала маме на юбилей «Английский сад». Букет даже пышнее, чем на фото, простоял почти две недели!'],
  ['Дмитрий', 'Привезли 101 розу за полтора часа, прислали фото до отправки. Девушка в восторге, спасибо!'],
  ['Мария', 'Флорист помогла выбрать букет на свадьбу подруги и подобрала ленты в цвет платья. Очень душевно.'],
];

const BESTSELLERS = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews);

// заголовок секции
function Title({ kicker, children, center }) {
  return (
    <div className={`mb-8 sm:mb-10 ${center ? 'text-center' : ''}`}>
      <div className="text-xs uppercase tracking-[0.2em] text-blush-600">{kicker}</div>
      <h2 className="mt-2 text-3xl sm:text-4xl text-stone-900">{children}</h2>
    </div>
  );
}

export function HomePage({ onOpenCatalog, onOpenProduct }) {
  return (
    <div className="space-y-20 sm:space-y-28">
      {/* первый экран текст и фото аркой */}
      <section className="bg-gradient-to-b from-blush-50 to-cream">
        <div className="page py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="text-xs uppercase tracking-[0.25em] text-blush-600">Цветочная мастерская · Москва</div>
            <h1 className="text-5xl sm:text-6xl leading-[1.05] text-stone-900">
              Цветы, которые <em className="text-blush-600">хочется</em> дарить
            </h1>
            <p className="text-lg text-stone-600 max-w-md mx-auto lg:mx-0">
              Собираем букеты вручную из свежих цветов и привозим за 2 часа. Перед отправкой пришлём фото.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button onClick={() => onOpenCatalog()} className="btn-primary px-8">Выбрать букет</button>
              <button onClick={() => onOpenCatalog('roses')} className="btn-outline px-8">Розы</button>
            </div>
            <dl className="flex justify-center lg:justify-start gap-8 pt-4">
              {STATS.map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-3xl text-brand-800">{value}</dt>
                  <dd className="text-xs text-stone-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative max-w-md w-full mx-auto">
            <button onClick={() => onOpenProduct('b-english')} className="block w-4/5 ml-auto aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden shadow-xl" aria-label="Букет «Английский сад»">
              <ProductImage product={getProduct('b-english')} />
            </button>
            <button onClick={() => onOpenProduct('b-garden')} className="absolute bottom-6 left-0 w-32 sm:w-44 aspect-square rounded-full overflow-hidden border-[6px] border-cream shadow-lg" aria-label="Букет «Летний сад»">
              <ProductImage product={getProduct('b-garden')} />
            </button>
            <div className="absolute top-10 left-2 sm:left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-sm text-stone-700">
              <Camera className="w-4 h-4 text-blush-500" /> Фото до отправки
            </div>
          </div>
        </div>
      </section>

      {/* категории арками */}
      <section className="page">
        <Title kicker="Каталог" center>Выберите настроение</Title>
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {CATEGORIES.slice(1).map((cat) => (
            <button key={cat.id} onClick={() => onOpenCatalog(cat.id)} className="group text-center">
              <span className="block aspect-[3/4] rounded-t-full overflow-hidden">
                <span className="block w-full h-full transition-transform duration-500 group-hover:scale-105">
                  <ProductImage product={PRODUCTS.find((p) => p.category === cat.id)} />
                </span>
              </span>
              <span className="block mt-3 font-serif text-lg sm:text-2xl text-stone-900">{cat.name}</span>
              <span className="text-xs text-stone-400">{cat.count} {plural(cat.count, ['букет', 'букета', 'букетов'])}</span>
            </button>
          ))}
        </div>
      </section>

      {/* хиты лентой */}
      <section className="page">
        <div className="flex items-end justify-between">
          <Title kicker="Любимое у покупателей">Хиты недели</Title>
          <button onClick={() => onOpenCatalog()} className="mb-10 text-xs font-semibold uppercase tracking-wider text-brand-700">Все букеты →</button>
        </div>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x pb-2">
          {BESTSELLERS.map((p) => (
            <ProductCard key={p.id} product={p} onOpenProduct={onOpenProduct} className="snap-start shrink-0 w-[46%] sm:w-[30%] lg:w-[23%]" />
          ))}
        </div>
      </section>

      {/* букет под событие */}
      <section className="page">
        <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden bg-brand-800 text-cream">
          <div className="aspect-[4/3] md:aspect-auto md:min-h-[380px]">
            <ProductImage product={getProduct('r-white')} />
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-center gap-5">
            <div className="text-xs uppercase tracking-[0.2em] text-blush-400">Свадьбы и события</div>
            <h2 className="text-3xl sm:text-4xl">Соберём букет <em>под ваш стиль</em></h2>
            <p className="text-brand-100">Подберём цветы и ленты в цвет платья или интерьера. Расскажите о поводе — флорист предложит варианты под ваш бюджет.</p>
            <a href="tel:+79000000000" className="btn bg-cream text-brand-900 self-start px-8">
              <Phone className="w-4 h-4" /> Позвонить флористу
            </a>
          </div>
        </div>
      </section>

      {/* как мы работаем */}
      <section className="bg-blush-50 py-16 sm:py-20">
        <div className="page">
          <Title kicker="Просто и быстро" center>Как мы работаем</Title>
          <ol className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 text-center">
            {STEPS.map(([title, text], i) => (
              <li key={title}>
                <div className="mx-auto w-16 h-16 rounded-full bg-cream flex items-center justify-center font-serif text-2xl text-blush-600">{i + 1}</div>
                <div className="mt-4 font-semibold text-stone-900">{title}</div>
                <p className="mt-1 text-sm text-stone-600 max-w-[220px] mx-auto">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* отзывы */}
      <section className="page">
        <Title kicker="Отзывы" center>Нам пишут</Title>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map(([name, text]) => (
            <figure key={name} className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200">
              <div className="flex gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 font-serif text-lg leading-relaxed text-stone-700">«{text}»</blockquote>
              <figcaption className="mt-4 text-sm text-stone-500">— {name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
