import { useMemo, useState } from 'react';
import type { StorefrontProductSummary } from '../types/storefront';

type CartItem = {
  productId: string;
  quantity: number;
};

function getDefaultCart(): CartItem[] {
  return [];
}

export function useCart(products: StorefrontProductSummary[]) {
  const [items, setItems] = useState<CartItem[]>(() => getDefaultCart());

  const productById = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  function addToCart(productId: string) {
    setItems((previous) => {
      const existing = previous.find((item) => item.productId === productId);
      if (existing == null) {
        return [...previous, { productId, quantity: 1 }];
      }

      return previous.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      });
    });
  }

  function removeFromCart(productId: string) {
    setItems((previous) =>
      previous.filter((item) => item.productId !== productId),
    );
  }

  const summary = useMemo(() => {
    const lineItems = items.flatMap((item) => {
      const product = productById.get(item.productId);
      if (product == null) {
        return [];
      }

      return [
        {
          product,
          quantity: item.quantity,
          subtotal: Number.parseFloat(product.priceMin) * item.quantity,
        },
      ];
    });

    const totalItems = lineItems.reduce(
      (count, item) => count + item.quantity,
      0,
    );
    const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      lineItems,
      totalItems,
      subtotal,
    };
  }, [items, productById]);

  return {
    summary,
    addToCart,
    removeFromCart,
  };
}
