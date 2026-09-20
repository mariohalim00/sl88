import { useEffect, useMemo, useState } from 'react';
import { listProducts } from '../api/catalog';

import type { StorefrontProductSummary } from '../types/storefront';

type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error';

type CatalogFilterOption = {
  value: string;
  label: string;
};

const DEFAULT_MAX_PRICE = 5_000_000;

function normalizeFacetValue(value: string) {
  return value.trim().toLowerCase().replace(/[_-]+/g, ' ');
}

function sortFacetValues(values: string[]) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function buildFacetOptionsWithLabels(
  entries: Array<{ value: string; label: string }>,
) {
  return sortFacetValues(entries.map((e) => e.value)).map((value) => {
    const match = entries.find((e) => e.value === value);
    return { value, label: match?.label ?? value };
  });
}

function getSearchableText(product: StorefrontProductSummary) {
  return [product.title, product.handle, product.productType, ...product.tags]
    .join(' ')
    .toLowerCase();
}

function matchesCategoryFilter(
  product: StorefrontProductSummary,
  filters: string[],
) {
  if (filters.length === 0) {
    return true;
  }

  const normalizedProductType = normalizeFacetValue(product.productType);

  return filters.includes(normalizedProductType);
}

function matchesMaterialFilter(
  product: StorefrontProductSummary,
  filters: string[],
) {
  if (filters.length === 0) {
    return true;
  }

  const normalizedTags = product.tags.map(normalizeFacetValue);

  return filters.some((value) => normalizedTags.includes(value));
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

    return highestProductPrice > 0
      ? Math.max(1, Math.ceil(highestProductPrice))
      : DEFAULT_MAX_PRICE;
  }, [products]);

  useEffect(() => {
    setMaxPrice((current) => Math.min(current, priceUpperBound));
  }, [priceUpperBound]);

  const categoryOptions = useMemo<CatalogFilterOption[]>(() => {
    const seen = new Set<string>();
    const entries: Array<{ value: string; label: string }> = [];

    products.forEach((product) => {
      const normalized = normalizeFacetValue(product.productType);

      if (normalized.length > 0 && !seen.has(normalized)) {
        seen.add(normalized);
        entries.push({ value: normalized, label: product.productType });
      }
    });

    return buildFacetOptionsWithLabels(entries);
  }, [products]);

  const materialOptions = useMemo<CatalogFilterOption[]>(() => {
    const seen = new Set<string>();
    const entries: Array<{ value: string; label: string }> = [];

    products.forEach((product) => {
      product.tags.forEach((tag) => {
        const normalized = normalizeFacetValue(tag);

        if (
          normalized.length > 0 &&
          normalized.length <= 30 &&
          !seen.has(normalized)
        ) {
          seen.add(normalized);
          entries.push({ value: normalized, label: tag });
        }
      });
    });

    return buildFacetOptionsWithLabels(entries);
  }, [products]);

  useEffect(() => {
    const categoryValues = new Set(
      categoryOptions.map((option) => option.value),
    );

    setSelectedCategories((current) =>
      current.filter((value) => categoryValues.has(value)),
    );
  }, [categoryOptions]);

  useEffect(() => {
    const materialValues = new Set(
      materialOptions.map((option) => option.value),
    );

    setSelectedMaterials((current) =>
      current.filter((value) => materialValues.has(value)),
    );
  }, [materialOptions]);

  function toggleSelectedValue(
    value: string,
    setCurrent: (next: string[] | ((previous: string[]) => string[])) => void,
  ) {
    setCurrent((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  }

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalized.length === 0 ||
        getSearchableText(product).includes(normalized);
      const matchesCategory = matchesCategoryFilter(
        product,
        selectedCategories,
      );
      const matchesMaterial = matchesMaterialFilter(product, selectedMaterials);
      const productPrice = Number.parseFloat(product.priceMin);
      const matchesPrice =
        !Number.isFinite(productPrice) || productPrice <= maxPrice;

      return (
        matchesSearch && matchesCategory && matchesMaterial && matchesPrice
      );
    });
  }, [maxPrice, products, searchTerm, selectedCategories, selectedMaterials]);

  return {
    searchTerm,
    setSearchTerm,
    categoryOptions,
    materialOptions,
    selectedCategories,
    selectedMaterials,
    maxPrice,
    priceUpperBound,
    toggleCategory: (value: string) => {
      toggleSelectedValue(value, setSelectedCategories);
    },
    toggleMaterial: (value: string) => {
      toggleSelectedValue(value, setSelectedMaterials);
    },
    setMaxPrice,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    products,
    filteredProducts,
  };
}
