// категории
const BASE_CATEGORIES = [
  { id: 'all', name: 'Все букеты' },
  { id: 'roses', name: 'Розы' },
  { id: 'tender', name: 'Нежные букеты' },
  { id: 'bright', name: 'Яркие букеты' },
];

// товары цена берётся из первого размера
// фото лежат в src/assets/products/<id>.jpg
const RAW_PRODUCTS = [
  { id: 'b-english', category: 'tender', title: 'Букет «Английский сад»', rating: 5.0, reviews: 64, badge: 'Хит',
    description: 'Пышный букет из пионовидных и кустовых роз нежно-розовых оттенков с белой сиренью и зеленью. Выглядит как только что срезанный в саду.',
    composition: ['Пионовидная роза', 'Кустовая роза', 'Сирень', 'Зелень', 'Белая плёнка'],
    sizes: [['M · 25 цветков', 6990], ['L · 41 цветок', 9490]] },
  { id: 'b-morning', category: 'tender', title: 'Букет «Нежное утро»', rating: 4.9, reviews: 128,
    description: 'Розовые и кремовые розы, тюльпаны, гипсофила и эвкалипт в пудровой упаковке с атласной лентой.',
    composition: ['Роза', 'Кустовая роза', 'Тюльпан', 'Гипсофила', 'Эвкалипт'],
    sizes: [['S · 15 цветков', 4490], ['M · 25 цветков', 5990], ['L · 35 цветков', 7990]] },
  { id: 'b-lavender', category: 'tender', title: 'Букет «Лавандовый вечер»', oldPrice: 4490, rating: 4.8, reviews: 52,
    description: 'Пудровые розы с сиреневым лимониумом и сочной зеленью в крафтовой бумаге. Спокойный и благородный.',
    composition: ['Роза', 'Лимониум', 'Писташ', 'Крафтовая бумага'],
    sizes: [['S · 9 роз', 3990], ['M · 15 роз', 5490]] },
  { id: 'b-marshmallow', category: 'tender', title: 'Букет «Розовый зефир»', oldPrice: 3690, rating: 4.7, reviews: 77,
    description: 'Розовые герберы, розы, ромашковые хризантемы и эустома в белой упаковке. Лёгкий и весёлый букет на любой повод.',
    composition: ['Гербера', 'Роза', 'Хризантема', 'Эустома', 'Зелень'],
    sizes: [['S · 11 цветков', 3290], ['M · 19 цветков', 4590]] },
  { id: 'r-101', category: 'roses', title: '101 розовая роза', rating: 5.0, reviews: 143, badge: 'Хит',
    description: 'Огромный букет из розовых роз — для предложения, юбилея или когда нужно сказать очень много без слов.',
    composition: ['Роза Pink Mondial', 'Упаковка из плёнки', 'Лента'],
    sizes: [['51 роза', 8990], ['101 роза', 15990]] },
  { id: 'r-pearl', category: 'roses', title: 'Розы «Жемчужные»', oldPrice: 6490, rating: 4.9, reviews: 88,
    description: 'Розовые розы в обрамлении гипсофилы с нитью жемчужных бусин. Нежно и празднично.',
    composition: ['Роза', 'Гипсофила', 'Декоративные бусины'],
    sizes: [['25 роз', 5990], ['51 роза', 10990]] },
  { id: 'r-white', category: 'roses', title: 'Белые розы с гипсофилой', rating: 4.9, reviews: 96,
    description: 'Белые розы в облаке гипсофилы — классика для свадьбы, выписки или важного события.',
    composition: ['Белая роза', 'Гипсофила', 'Зелень', 'Тишью'],
    sizes: [['15 роз', 4990], ['25 роз', 7490]] },
  { id: 'b-garden', category: 'bright', title: 'Букет «Летний сад»', rating: 4.8, reviews: 41, badge: 'Новинка',
    description: 'Подсолнухи, пионы, лилия, дельфиниум, лаванда и ромашки. Яркий букет с настроением тёплого июля.',
    composition: ['Подсолнух', 'Пион', 'Лилия', 'Дельфиниум', 'Лаванда', 'Ромашка', 'Роза'],
    sizes: [['M · 21 цветок', 5490], ['L · 35 цветков', 7490]] },
  { id: 'b-sunny', category: 'bright', title: 'Букет «Солнечный зайчик»', rating: 4.8, reviews: 59,
    description: 'Розовые розы и подсолнухи с гипсофилой. Тёплый и солнечный — поднимает настроение с первого взгляда.',
    composition: ['Роза', 'Подсолнух', 'Гипсофила', 'Белая плёнка'],
    sizes: [['S · 11 цветков', 3490], ['M · 19 цветков', 4990]] },
];

// размеры в объекты и минимальная цена
export const PRODUCTS = RAW_PRODUCTS.map((p) => {
  const sizes = p.sizes?.map(([label, price]) => ({ label, price }));
  return { ...p, sizes, price: sizes?.[0].price ?? p.price };
});

// категории со счётчиками
export const CATEGORIES = BASE_CATEGORIES.map((c) => ({
  ...c,
  count: c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length,
}));

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);

// условия доставки
export const FREE_DELIVERY_FROM = 5000;
export const DELIVERY_PRICE = 390;
