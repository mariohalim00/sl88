import { useMemo, useState } from 'react';
import {
  addCartLines,
  createCart,
  removeCartLines,
  updateCartLines,
} from '../api/cart';

import type { StorefrontCart } from '../types/storefront';

const CART_STORAGE_KEY = 'sl88.storefront.cart';

function readPersistedCart(): StorefrontCart | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (raw == null) {
    return null;
  }

  try {
    return JSON.parse(raw) as StorefrontCart;
  } catch {
    return null;
  }
}

function persistCart(cart: StorefrontCart | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (cart == null) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function useCart() {
  const [cart, setCart] = useState<StorefrontCart | null>(() =>
    readPersistedCart(),
  );
  const [isMutating, setIsMutating] = useState(false);

  async function addVariant(merchandiseId: string, quantity = 1) {
    setIsMutating(true);
    try {
      const nextCart =
        cart == null
          ? await createCart([{ merchandiseId, quantity }])
          : await addCartLines(cart.id, [{ merchandiseId, quantity }]);

      setCart(nextCart);
      persistCart(nextCart);
    } finally {
      setIsMutating(false);
    }
  }

  async function updateLine(lineId: string, quantity: number) {
    if (cart == null) {
      return;
    }

    setIsMutating(true);
    try {
      const nextCart =
        quantity <= 0
          ? await removeCartLines(cart.id, [lineId])
          : await updateCartLines(cart.id, [{ id: lineId, quantity }]);

      setCart(nextCart);
      persistCart(nextCart.lines.length === 0 ? null : nextCart);
    } finally {
      setIsMutating(false);
    }
  }

  async function removeLine(lineId: string) {
    if (cart == null) {
      return;
    }

    setIsMutating(true);
    try {
      const nextCart = await removeCartLines(cart.id, [lineId]);
      setCart(nextCart);
      persistCart(nextCart.lines.length === 0 ? null : nextCart);
    } finally {
      setIsMutating(false);
    }
  }

  const summary = useMemo(() => {
    const lineItems = (cart?.lines ?? []).map((line) => ({
      lineId: line.id,
      quantity: line.quantity,
      subtotal: Number.parseFloat(line.lineAmount),
      product: {
        id: line.merchandiseId,
        title: line.title,
      },
    }));

    const subtotal = Number.parseFloat(cart?.cost.subtotalAmount ?? '0');

    return {
      lineItems,
      totalItems: cart?.totalQuantity ?? 0,
      subtotal,
      cartId: cart?.id ?? null,
    };
  }, [cart]);

  return {
    cart,
    summary,
    isMutating,
    addVariant,
    updateLine,
    removeLine,
  };
}
