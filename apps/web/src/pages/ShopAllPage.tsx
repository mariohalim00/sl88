import { useTranslation } from 'react-i18next';
import { ShopAllFilterBar } from '@/components/sections/shop-all/ShopAllFilterBar';
import { CartSummary } from '@/features/catalog/components/CartSummary';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { useCart } from '@/features/catalog/hooks/useCart';
import { useCatalog } from '@/features/catalog/hooks/useCatalog';
import { formatCurrency } from '@/lib/currency';

const categories = [
  { key: 'shopAll.categories.kitchen', value: 'kitchen' },
  { key: 'shopAll.categories.welcomeMats', value: 'welcomeMats' },
  { key: 'shopAll.categories.car', value: 'car' },
  { key: 'shopAll.categories.office', value: 'office' },
  { key: 'shopAll.categories.outdoor', value: 'outdoor' },
];

const materials = [
  { key: 'shopAll.materials.wool', value: 'wool' },
  { key: 'shopAll.materials.silk', value: 'silk' },
  { key: 'shopAll.materials.cotton', value: 'cotton' },
  { key: 'shopAll.materials.jute', value: 'jute' },
];

export function ShopAllPage() {
  const { t } = useTranslation();
  const { searchTerm, setSearchTerm, filteredProducts } = useCatalog();
  const { summary, isMutating, updateLine, removeLine } = useCart();

  return (
    <div className="space-y-6">
      <div className="flex gap-8">
        <aside className="sticky top-28 hidden h-fit w-64 shrink-0 flex-col gap-8 self-start border-r border-[#d4c4ac]/40 pr-6 lg:flex">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-widest text-[#1c1c15] uppercase">
              {t('shopAll.categoriesTitle')}
            </h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-3 text-sm text-[#504533]"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#d4c4ac] accent-[#f4b400]"
                  />
                  {t(category.key)}
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-[#d4c4ac]/40 pt-7">
            <h2 className="text-sm font-semibold tracking-widest text-[#1c1c15] uppercase">
              {t('shopAll.priceRangeTitle')}
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
              {t('shopAll.materialTitle')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <button
                  key={material.value}
                  type="button"
                  className={[
                    'rounded border px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase',
                    material.value === 'silk'
                      ? 'border-[#f4b400] bg-[#f4b400]/10 text-[#7a5900]'
                      : 'border-[#d4c4ac] text-[#504533]',
                  ].join(' ')}
                >
                  {t(material.key)}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <main className="w-full space-y-6 pb-10 md:pb-16">
          <header className="space-y-4">
            <h1 className="font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">
              {t('shopAll.title')}
            </h1>
            <ShopAllFilterBar
              searchTerm={searchTerm}
              totalItems={summary.totalItems}
              onSearchChange={setSearchTerm}
            />
          </header>

          <ProductGrid products={filteredProducts} onAddToCart={() => {}} />

          <button
            type="button"
            className="mx-auto block rounded border border-[#1c1c15] px-8 py-3 text-xs font-semibold tracking-widest text-[#1c1c15] uppercase transition hover:bg-[#1c1c15] hover:text-white"
          >
            {t('shopAll.loadMoreArtifacts')}
          </button>

          <CartSummary
            items={summary.lineItems}
            subtotal={summary.subtotal}
            isMutating={isMutating}
            onUpdateQuantity={updateLine}
            onRemoveItem={removeLine}
          />
        </main>
      </div>
    </div>
  );
}
