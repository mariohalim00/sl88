import { ProductCard } from './ProductCard';

type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  rating: number;
};

type ProductGridProps = {
  products: CatalogProduct[];
  onAddToCart: (productId: string) => void;
};

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="rounded border border-dashed border-[#d4c4ac] p-8 text-center">
        <h2 className="font-heading text-xl font-semibold text-[#1c1c15]">
          No matches found
        </h2>
        <p className="mt-2 text-sm text-[#504533]">
          Try searching by room type, style, or material.
        </p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
      {products.map((product) => {
        return (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        );
      })}
    </section>
  );
}
