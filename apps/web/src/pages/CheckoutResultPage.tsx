import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '@/features/catalog/hooks/useCart';
import {
  resolveCheckoutResult,
  type CheckoutResult,
} from '@/features/catalog/hooks/useCheckout';

const resultContent: Record<
  CheckoutResult,
  {
    title: string;
    description: string;
  }
> = {
  success: {
    title: 'Checkout completed',
    description:
      'Your hosted checkout was completed successfully. You can continue browsing the catalog.',
  },
  cancel: {
    title: 'Checkout canceled',
    description:
      'The hosted checkout was canceled. Your cart is still available for another attempt.',
  },
  failed: {
    title: 'Checkout failed',
    description:
      'We could not confirm the checkout outcome. Please return to the cart and try again.',
  },
};

export function CheckoutResultPage() {
  const [searchParams] = useSearchParams();
  const result = resolveCheckoutResult(searchParams.get('status'));
  const content = resultContent[result];
  const { clearCart } = useCart();

  useEffect(() => {
    if (result === 'success') {
      clearCart();
    }
  }, [clearCart, result]);

  return (
    <section className="mx-auto max-w-2xl rounded border border-[#d4c4ac] bg-white p-8 text-center">
      <h1 className="font-heading text-3xl font-semibold text-[#1c1c15]">
        {content.title}
      </h1>
      <p className="mt-3 text-sm text-[#504533]">{content.description}</p>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/shop/all"
          className="rounded border border-[#1c1c15] px-4 py-2 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase"
        >
          Back to catalog
        </Link>
      </div>
    </section>
  );
}
