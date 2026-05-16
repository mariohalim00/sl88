import { MockModeNotice } from '@/components/sections/shop-all/MockModeNotice';
import { ShopAllFilterBar } from '@/components/sections/shop-all/ShopAllFilterBar';
import { CartSummary } from '@/features/catalog/components/CartSummary';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { useCartState } from '@/features/catalog/hooks/useCartState';
import { useCatalogViewState } from '@/features/catalog/hooks/useCatalogViewState';
import { getCatalogProducts } from '@/features/catalog/model/selectors';
import { formatCurrency } from '@/lib/currency';

const categories = ['Kitchen', 'Welcome Mats', 'Car', 'Office', 'Outdoor'];
const materials = ['Wool', 'Silk', 'Cotton', 'Jute'];

export function ShopAllPage() {
  const products = getCatalogProducts();
  const { searchTerm, setSearchTerm, filteredProducts } =
    useCatalogViewState(products);
  const { summary, add, remove } = useCartState(products);

  return (
    <div className="space-y-6">
      <MockModeNotice />

      <div className="flex gap-8">
        <aside className="sticky top-28 hidden h-fit w-64 shrink-0 flex-col gap-8 self-start border-r border-[#d4c4ac]/40 pr-6 lg:flex">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-widest text-[#1c1c15] uppercase">
              Categories
            </h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 text-sm text-[#504533]"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#d4c4ac] accent-[#f4b400]"
                  />
                  {category}
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-[#d4c4ac]/40 pt-7">
            <h2 className="text-sm font-semibold tracking-widest text-[#1c1c15] uppercase">
              Price Range
            </h2>
            <input
              type="range"
              min={0}
              max={5000000}
              className="w-full accent-[#f4b400]"
            />
            <div className="flex justify-between text-xs text-[#504533]">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(5000000)}+</span>
            </div>
          </section>

          <section className="space-y-4 border-t border-[#d4c4ac]/40 pt-7">
            <h2 className="text-sm font-semibold tracking-widest text-[#1c1c15] uppercase">
              Material
            </h2>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <button
                  key={material}
                  type="button"
                  className={[
                    'rounded border px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase',
                    material === 'Silk'
                      ? 'border-[#f4b400] bg-[#f4b400]/10 text-[#7a5900]'
                      : 'border-[#d4c4ac] text-[#504533]',
                  ].join(' ')}
                >
                  {material}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <main className="w-full space-y-6 pb-10 md:pb-16">
          <header className="space-y-4">
            <h1 className="font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">
              Shop All
            </h1>
            <ShopAllFilterBar
              searchTerm={searchTerm}
              totalItems={summary.totalItems}
              onSearchChange={setSearchTerm}
            />
          </header>

          <ProductGrid products={filteredProducts} onAddToCart={add} />

          <button
            type="button"
            className="mx-auto block rounded border border-[#1c1c15] px-8 py-3 text-xs font-semibold tracking-widest text-[#1c1c15] uppercase transition hover:bg-[#1c1c15] hover:text-white"
          >
            Load More Artifacts
          </button>

          <CartSummary
            items={summary.lineItems}
            subtotal={summary.subtotal}
            onRemoveItem={remove}
          />
        </main>
      </div>
    </div>
  );
}
