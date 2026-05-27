import { useEffect, useMemo, useState } from 'react';
import { listProducts } from '../api/catalog';

import type { StorefrontProductSummary } from '../types/storefront';

type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error';

const CATEGORY_ALIASES: Record<string, string[]> = {
  kitchen: ['kitchen'],
  welcomeMats: ['welcome mat', 'welcome mats', 'doormat', 'door mat'],
  car: ['car', 'automotive', 'vehicle'],
  office: ['office', 'workspace'],
  outdoor: ['outdoor', 'patio', 'garden'],
};

const MATERIAL_ALIASES: Record<string, string[]> = {
  wool: ['wool'],
  silk: ['silk'],
  cotton: ['cotton'],
  jute: ['jute'],
};

const DEFAULT_MAX_PRICE = 5_000_000;

function getSearchableText(product: StorefrontProductSummary) {
  return [
    product.title,
    product.handle,
    product.productType,
    ...product.tags,
  ]
    .join(' ')
    .toLowerCase();
}

function matchesFilter(
  product: StorefrontProductSummary,
  filters: string[],
  aliases: Record<string, string[]>,
) {
  if (filters.length === 0) {
    return true;
  }

  const searchableText = getSearchableText(product);

  return filters.some((filterValue) => {
    const candidates = aliases[filterValue] ?? [filterValue];

    return candidates.some((candidate) => searchableText.includes(candidate));
  });
}

export function useCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [products, setProducts] = useState<StorefrontProductSummary[]>([]);
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

  const priceUpperBound = useMemo(() => {
    const highestProductPrice = products.reduce((highest, product) => {
      const numericPrice = Number.parseFloat(product.priceMax);

      return Number.isFinite(numericPrice)
        ? Math.max(highest, numericPrice)
        : highest;
    }, 0);

    return Math.max(DEFAULT_MAX_PRICE, Math.ceil(highestProductPrice));
  }, [products]);

  function toggleSelectedValue(
    value: string,
    current: string[],
    setCurrent: (next: string[]) => void,
  ) {
    setCurrent(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalized.length === 0 || getSearchableText(product).includes(normalized);
      const matchesCategory = matchesFilter(
        product,
        selectedCategories,
        CATEGORY_ALIASES,
      );
      const matchesMaterial = matchesFilter(
        product,
        selectedMaterials,
        MATERIAL_ALIASES,
      );
      const productPrice = Number.parseFloat(product.priceMin);
      const matchesPrice =
        !Number.isFinite(productPrice) || productPrice <= maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMaterial &&
        matchesPrice
      );
    });
  }, [maxPrice, products, searchTerm, selectedCategories, selectedMaterials]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    selectedMaterials,
    maxPrice,
    priceUpperBound,
    toggleCategory: (value: string) => {
      toggleSelectedValue(value, selectedCategories, setSelectedCategories);
    },
    toggleMaterial: (value: string) => {
      toggleSelectedValue(value, selectedMaterials, setSelectedMaterials);
    },
    setMaxPrice,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    products,
    filteredProducts,
  };
}
