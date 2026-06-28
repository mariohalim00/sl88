import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CartSummary } from '@/features/catalog/components/CartSummary';
import { useCart } from '@/features/catalog/hooks/useCart';
import { useCheckout } from '@/features/catalog/hooks/useCheckout';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { t } = useTranslation();
  const { summary, isMutating, updateLine, removeLine, stageCartForCheckout } =
    useCart();
  const { isRedirecting, startCheckout } = useCheckout();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const handleCloseRequest = () => {
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog == null) {
      return;
    }

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }

      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        handleCloseRequest();
      }}
      onClose={handleCloseRequest}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleCloseRequest();
        }
      }}
      className="fixed top-0 right-0 z-60 m-0 h-full max-h-screen w-full max-w-md border-0 bg-transparent p-0 backdrop:bg-black/35"
      aria-label={t('header.aria.bag')}
    >
      <section
        id="global-cart-drawer"
        className="ml-auto flex h-full w-full max-w-md flex-col border-l border-[#d4c4ac] bg-[#fcf9ee] p-4 shadow-2xl md:p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-[#1c1c15]">
            {t('cartSummary.title')}
          </h2>
          <button
            type="button"
            onClick={handleCloseRequest}
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

              stageCartForCheckout();
              await startCheckout(summary.cartId);
            }}
            onUpdateQuantity={updateLine}
            onRemoveItem={removeLine}
          />
        </div>
      </section>
    </dialog>
  );
}
