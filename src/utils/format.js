// цена в рублях
export const rub = (n) => `${n.toLocaleString('ru-RU')} ₽`;

// цена на карточке с от если есть размеры
export const priceLabel = (product) => (product.sizes?.length > 1 ? `от ${rub(product.price)}` : rub(product.price));

// слово в нужной форме 1 товар 2 товара 5 товаров
export const plural = (n, [one, few, many]) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};
