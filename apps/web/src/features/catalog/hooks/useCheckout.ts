import { useState } from 'react';
import { createCheckoutRedirect } from '../api/checkout';

export type CheckoutResult = 'success' | 'cancel' | 'failed';

export function resolveCheckoutResult(value: string | null): CheckoutResult {
  if (value === 'success' || value === 'cancel' || value === 'failed') {
    return value;
  }

  return 'failed';
}

export function useCheckout() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function startCheckout(cartId: string) {
    setIsRedirecting(true);

    try {
      const response = await createCheckoutRedirect(cartId);

      if (typeof window !== 'undefined') {
        window.location.assign(response.checkoutUrl);
      }
    } finally {
      setIsRedirecting(false);
    }
  }

  return {
    isRedirecting,
    startCheckout,
  };
}
