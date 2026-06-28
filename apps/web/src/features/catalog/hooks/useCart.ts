import { useMemo, useSyncExternalStore } from 'react';
import {
  addCartLines,
  createCart,
  removeCartLines,
  updateCartLines,
} from '../api/cart';
import { storefrontCartSchema, type StorefrontCart } from '../types/storefront';

const CART_STORAGE_KEY = 'sl88.storefront.cart';
const CHECKOUT_BACKUP_STORAGE_KEY = 'sl88.storefront.checkout.backup';

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
    const result = storefrontCartSchema.safeParse(JSON.parse(raw));

    if (result.success) {
      return result.data;
    }
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return null;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
  return null;
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

function clearCartStore() {
  commitCart(null);
}

function stageCartForCheckout() {
  const cart = getCartStoreSnapshot().cart;

  if (typeof window !== 'undefined' && cart != null) {
    window.sessionStorage.setItem(
      CHECKOUT_BACKUP_STORAGE_KEY,
      JSON.stringify(cart),
    );
  }

  clearCartStore();
}

function restoreCheckoutCartBackup() {
  if (typeof window === 'undefined') {
    return;
  }

  const raw = window.sessionStorage.getItem(CHECKOUT_BACKUP_STORAGE_KEY);

  if (raw == null) {
    return;
  }

  try {
    const parsed = storefrontCartSchema.safeParse(JSON.parse(raw));

    if (parsed.success) {
      commitCart(parsed.data);
    }
  } finally {
    window.sessionStorage.removeItem(CHECKOUT_BACKUP_STORAGE_KEY);
  }
}

function clearCheckoutCartBackup() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(CHECKOUT_BACKUP_STORAGE_KEY);
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

      let nextCart: StorefrontCart;

      if (currentCart == null) {
        nextCart = await createCart([{ merchandiseId, quantity }]);
      } else {
        try {
          nextCart = await addCartLines(currentCart.id, [
            { merchandiseId, quantity },
          ]);
        } catch {
          // If the server-side cart is gone, recover by creating a fresh cart.
          nextCart = await createCart([{ merchandiseId, quantity }]);
        }
      }

      commitCart(nextCart);
      return nextCart;
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
    } catch {
      clearCartStore();
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
    } catch {
      clearCartStore();
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
        thumbnailUrl: line.imageUrl,
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
    clearCart: clearCartStore,
    stageCartForCheckout,
    restoreCheckoutCartBackup,
    clearCheckoutCartBackup,
  };
}
