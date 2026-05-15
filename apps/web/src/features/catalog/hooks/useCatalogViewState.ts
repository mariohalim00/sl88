import { useMemo, useState } from "react";
import type { MockProduct } from "@/features/catalog/model/schemas";

export function useCatalogViewState(products: MockProduct[]) {
  const [searchTerm, setSearchTerm] = useState("");

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
    filteredProducts,
  };
}
