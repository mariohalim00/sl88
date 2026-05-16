import { useEffect, useMemo, useState } from 'react';
import { listProducts } from '../api/catalog';

import type { Product } from '../types';

type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<CatalogStatus>('idle');

  useEffect(() => {
    let isSubscribed = true;

    async function loadProducts() {
      setStatus('loading');
      try {
        const payload = await listProducts();
        if (!isSubscribed) {
          return;
        }

        setProducts(payload);
        setStatus('ready');
      } catch {
        if (!isSubscribed) {
          return;
        }

        setProducts([]);
        setStatus('error');
      }
    }

    void loadProducts();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (normalized.length === 0) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized)
      );
    });
  }, [products, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    products,
    filteredProducts,
  };
}
