import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/currency';

type CatalogProduct = {
  id: string;
  title: string;
};

type CartLineItem = {
  lineId: string;
  product: CatalogProduct;
  quantity: number;
  subtotal: number;
};

type CartSummaryProps = {
  items: CartLineItem[];
  subtotal: number;
  isMutating: boolean;
  isCheckingOut: boolean;
  canCheckout: boolean;
  onCheckout: () => Promise<void>;
  onUpdateQuantity: (lineId: string, quantity: number) => Promise<void>;
  onRemoveItem: (lineId: string) => Promise<void>;
};

export function CartSummary({
  items,
  subtotal,
  isMutating,
  isCheckingOut,
  canCheckout,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
}: CartSummaryProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded border border-[#d4c4ac] bg-white p-5">
      <header className="mb-4">
        <h2 className="font-heading text-2xl font-medium text-[#1c1c15]">
          {t('cartSummary.title')}
        </h2>
        <p className="text-sm text-[#504533]">{t('cartSummary.description')}</p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-[#504533]">{t('cartSummary.empty')}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            return (
              <li
                key={item.lineId}
                className="flex items-start justify-between gap-2 rounded border border-[#e5e2d8] p-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#1c1c15]">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-[#504533]">
                    {t('cartSummary.qtyLine', {
                      quantity: item.quantity,
                      amount: formatCurrency(item.subtotal),
                    })}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded border border-[#d4c4ac] px-2 py-0.5 text-xs text-[#1c1c15] disabled:opacity-60"
                      onClick={() => onUpdateQuantity(item.lineId, item.quantity - 1)}
                      disabled={isMutating}
                    >
                      -
                    </button>
                    <span className="text-xs text-[#504533]">{item.quantity}</span>
                    <button
                      type="button"
                      className="rounded border border-[#d4c4ac] px-2 py-0.5 text-xs text-[#1c1c15] disabled:opacity-60"
                      onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
                      disabled={isMutating}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded border border-[#d4c4ac] p-1.5 text-[#504533] transition hover:bg-[#f7f4e9]"
                  onClick={() => onRemoveItem(item.lineId)}
                  disabled={isMutating}
                  aria-label={t('cartSummary.removeAria', {
                    name: item.product.title,
                  })}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[#e5e2d8] pt-3 text-sm">
        <span className="text-[#504533]">{t('cartSummary.subtotal')}</span>
        <span className="font-semibold text-[#1c1c15]">
          {formatCurrency(subtotal)}
        </span>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded bg-[#1c1c15] px-4 py-2 text-sm font-semibold tracking-[0.08em] text-white uppercase disabled:opacity-60"
        onClick={() => {
          void onCheckout();
        }}
        disabled={!canCheckout || isCheckingOut || isMutating}
      >
        {isCheckingOut ? 'Redirecting...' : 'Checkout'}
      </button>

      {isMutating ? (
        <p className="mt-2 text-xs text-[#504533]">Updating cart...</p>
      ) : null}
    </section>
  );
}
