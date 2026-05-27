import { useMemo, useSyncExternalStore } from 'react';
import {
  addCartLines,
  createCart,
  removeCartLines,
  updateCartLines,
} from '../api/cart';

import type { StorefrontCart } from '../types/storefront';

const CART_STORAGE_KEY = 'sl88.storefront.cart';

type CartStoreSnapshot = {
  cart: StorefrontCart | null;
  isMutating: boolean;
};

const cartStoreListeners = new Set<() => void>();

let hasInitializedCartStore = false;
let cartStoreSnapshot: CartStoreSnapshot = {
  cart: null,
  isMutating: false,
};

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

function subscribeToCartStore(listener: () => void) {
  cartStoreListeners.add(listener);

  return () => {
    cartStoreListeners.delete(listener);
  };
}

function getCartStoreSnapshot() {
  return cartStoreSnapshot;
}

function emitCartStoreChange() {
  cartStoreListeners.forEach((listener) => {
    listener();
  });
}

function updateCartStoreSnapshot(nextSnapshot: Partial<CartStoreSnapshot>) {
  cartStoreSnapshot = {
    ...cartStoreSnapshot,
    ...nextSnapshot,
  };

  emitCartStoreChange();
}

function normalizeCart(cart: StorefrontCart | null) {
  if (cart == null || cart.lines.length === 0) {
    return null;
  }

  return cart;
}

function commitCart(nextCart: StorefrontCart | null) {
  const normalizedCart = normalizeCart(nextCart);

  updateCartStoreSnapshot({ cart: normalizedCart });
  persistCart(normalizedCart);
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== CART_STORAGE_KEY) {
    return;
  }

  updateCartStoreSnapshot({ cart: readPersistedCart() });
}

function initializeCartStore() {
  if (hasInitializedCartStore) {
    return;
  }

  hasInitializedCartStore = true;
  cartStoreSnapshot = {
    cart: readPersistedCart(),
    isMutating: false,
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
  }
}

export function useCart() {
  initializeCartStore();

  const { cart, isMutating } = useSyncExternalStore(
    subscribeToCartStore,
    getCartStoreSnapshot,
    getCartStoreSnapshot,
  );

  async function addVariant(merchandiseId: string, quantity = 1) {
    updateCartStoreSnapshot({ isMutating: true });
    try {
      const currentCart = getCartStoreSnapshot().cart;
      const nextCart =
        currentCart == null
          ? await createCart([{ merchandiseId, quantity }])
          : await addCartLines(currentCart.id, [{ merchandiseId, quantity }]);

      commitCart(nextCart);
    } finally {
      updateCartStoreSnapshot({ isMutating: false });
    }
  }

  async function updateLine(lineId: string, quantity: number) {
    const currentCart = getCartStoreSnapshot().cart;

    if (currentCart == null) {
      return;
    }

    updateCartStoreSnapshot({ isMutating: true });
    try {
      const nextCart =
        quantity <= 0
          ? await removeCartLines(currentCart.id, [lineId])
          : await updateCartLines(currentCart.id, [{ id: lineId, quantity }]);

      commitCart(nextCart);
    } finally {
      updateCartStoreSnapshot({ isMutating: false });
    }
  }

  async function removeLine(lineId: string) {
    const currentCart = getCartStoreSnapshot().cart;

    if (currentCart == null) {
      return;
    }

    updateCartStoreSnapshot({ isMutating: true });
    try {
      const nextCart = await removeCartLines(currentCart.id, [lineId]);
      commitCart(nextCart);
    } finally {
      updateCartStoreSnapshot({ isMutating: false });
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
