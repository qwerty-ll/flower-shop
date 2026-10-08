// окно поверх страницы для меню фильтров и товара
import { useEffect, useRef } from 'react';

// где появляется окно
const SIDES = {
  center: ['items-end sm:items-center justify-center sm:p-6', 'w-full max-w-4xl max-h-[95dvh] sm:max-h-[90dvh] rounded-t-2xl sm:rounded-xl animate-sheet-up'],
  bottom: ['items-end', 'w-full max-h-[85dvh] rounded-t-2xl animate-sheet-up'],
  left: ['items-stretch', 'w-[85%] max-w-xs animate-slide-in'],
};

export function Overlay({ onClose, side = 'center', label, className = '', children }) {
  // свежая функция закрытия без перезапуска эффекта
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  // закрытие по esc и запрет прокрутки страницы под окном
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  const [wrap, panel] = SIDES[side];
  return (
    <div className={`fixed inset-0 z-50 flex ${wrap} ${className}`}>
      <div className="absolute inset-0 bg-stone-900/50 animate-fade-in" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={label} className={`relative bg-cream overflow-y-auto shadow-2xl ${panel}`}>
        {children}
      </div>
    </div>
  );
}
