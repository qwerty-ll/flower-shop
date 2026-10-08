// уведомление о добавлении в корзину
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Toast({ hidden, onOpenCart }) {
  const { toast, hideToast } = useCart();
  if (!toast || hidden) return null;

  return (
    <div key={toast.id} role="status" className="fixed z-[60] inset-x-4 bottom-4 flex justify-center animate-sheet-up pointer-events-none">
      <div className="w-full max-w-md flex items-center gap-3 pl-4 pr-2 py-2.5 bg-brand-900 text-cream rounded-md shadow-xl pointer-events-auto">
        <span className="flex-1 min-w-0 text-sm truncate">✓ {toast.text}</span>
        <button onClick={() => { hideToast(); onOpenCart(); }} className="text-xs font-semibold uppercase tracking-wider text-blush-400 px-2 py-1">
          В корзину
        </button>
        <button onClick={hideToast} className="p-1.5 text-brand-300" aria-label="Закрыть уведомление">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
