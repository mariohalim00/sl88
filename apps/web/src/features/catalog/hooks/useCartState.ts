import { useMemo, useState } from 'react';

import type { MockProduct } from '@/features/catalog/model/schemas';

type CartItem = {
  productId: string;
  quantity: number;
};

type CartLineItem = {
  product: MockProduct;
  quantity: number;
  subtotal: number;
};

export function useCartState(products: MockProduct[]) {
  const [items, setItems] = useState<CartItem[]>([]);

  const productById = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  function add(productId: string) {
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

  function remove(productId: string) {
    setItems((previous) =>
      previous.filter((item) => item.productId !== productId),
    );
  }

  const summary = useMemo(() => {
    const lineItems: CartLineItem[] = items.flatMap((item) => {
      const product = productById.get(item.productId);
      if (product == null) {
        return [];
      }

      return [
        {
          product,
          quantity: item.quantity,
          subtotal: item.quantity * product.price,
        },
      ];
    });

    const totalItems = lineItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const subtotal = lineItems.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    return {
      lineItems,
      totalItems,
      subtotal,
    };
  }, [items, productById]);

  return {
    summary,
    add,
    remove,
  };
}
