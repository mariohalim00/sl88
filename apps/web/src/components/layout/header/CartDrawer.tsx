import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CartSummary } from '@/features/catalog/components/CartSummary';
import { useCart } from '@/features/catalog/hooks/useCart';
import { useCheckout } from '@/features/catalog/hooks/useCheckout';
import { cn } from '@/lib/utils';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { t } = useTranslation();
  const { summary, isMutating, updateLine, removeLine } = useCart();
  const { isRedirecting, startCheckout } = useCheckout();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/35 transition-opacity',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="global-cart-drawer"
        className={cn(
          'fixed top-0 right-0 z-60 flex h-full w-full max-w-md flex-col border-l border-[#d4c4ac] bg-[#fcf9ee] p-4 shadow-2xl transition-transform duration-300 md:p-5',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-label={t('header.aria.bag')}
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-[#1c1c15]">
            {t('cartSummary.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('header.aria.closeCart')}
            className="text-[#1c1c15] transition-opacity hover:opacity-80"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <CartSummary
            items={summary.lineItems}
            subtotal={summary.subtotal}
            isMutating={isMutating}
            isCheckingOut={isRedirecting}
            canCheckout={summary.cartId != null && summary.lineItems.length > 0}
            onCheckout={async () => {
              if (summary.cartId == null) {
                return;
              }

              await startCheckout(summary.cartId);
            }}
            onUpdateQuantity={updateLine}
            onRemoveItem={removeLine}
          />
        </div>
      </aside>
    </>
  );
}
