import { CartSummary } from "@/features/catalog/components/CartSummary";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { StoreHeader } from "@/features/catalog/components/StoreHeader";
import { useCart } from "@/features/catalog/hooks/useCart";
import { useCatalog } from "@/features/catalog/hooks/useCatalog";

/**
 * @deprecated This is part of the original scaffolding, will be deleted soon
 */
export function StorefrontPage() {
  const { searchTerm, setSearchTerm, isLoading, isError, products, filteredProducts } = useCatalog();

  const { summary, addToCart, removeFromCart } = useCart(products);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading catalog...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <p className="text-sm text-destructive">Could not load catalog data.</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(24_95%_95%)_0%,hsl(42_45%_96%)_45%,hsl(0_0%_100%)_100%)]" />
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8 md:py-12">
        <StoreHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalItems={summary.totalItems}
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
          <CartSummary items={summary.lineItems} subtotal={summary.subtotal} onRemoveItem={removeFromCart} />
        </section>
      </div>
    </main>
  );
}
