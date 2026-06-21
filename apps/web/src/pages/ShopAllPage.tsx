import { useTranslation } from 'react-i18next';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { useCart } from '@/features/catalog/hooks/useCart';
import { useCatalog } from '@/features/catalog/hooks/useCatalog';
import { formatCurrency } from '@/lib/currency';

export function ShopAllPage() {
  const { t } = useTranslation();
  const {
    categoryOptions,
    materialOptions,
    selectedCategories,
    selectedMaterials,
    maxPrice,
    priceUpperBound,
    toggleCategory,
    toggleMaterial,
    setMaxPrice,
    filteredProducts,
  } = useCatalog();
  const { addVariant } = useCart();

  return (
    <div className="space-y-6 px-3 sm:px-0">
      <div className="flex gap-8">
        <aside className="sticky top-28 hidden h-fit w-64 shrink-0 flex-col gap-8 self-start border-r border-[#d4c4ac]/40 pr-6 lg:flex">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-widest text-[#1c1c15] uppercase">
              {t('shopAll.categoriesTitle')}
            </h2>
            <div className="space-y-3">
              {categoryOptions.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-3 text-sm text-[#504533]"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.value)}
                    onChange={() => {
                      toggleCategory(category.value);
                    }}
                    className="h-4 w-4 rounded border-[#d4c4ac] accent-[#f4b400]"
                  />
                  {category.label}
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
              max={priceUpperBound}
              value={maxPrice}
              onChange={(event) => {
                setMaxPrice(Number.parseInt(event.currentTarget.value, 10));
              }}
              className="w-full accent-[#f4b400]"
            />
            <div className="flex justify-between text-xs text-[#504533]">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(maxPrice)}</span>
            </div>
          </section>

          <section className="space-y-4 border-t border-[#d4c4ac]/40 pt-7">
            <h2 className="text-sm font-semibold tracking-widest text-[#1c1c15] uppercase">
              {t('shopAll.materialTitle')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {materialOptions.map((material) => (
                <button
                  key={material.value}
                  type="button"
                  onClick={() => {
                    toggleMaterial(material.value);
                  }}
                  aria-pressed={selectedMaterials.includes(material.value)}
                  className={[
                    'rounded border px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase',
                    selectedMaterials.includes(material.value)
                      ? 'border-[#f4b400] bg-[#f4b400]/10 text-[#7a5900]'
                      : 'border-[#d4c4ac] text-[#504533]',
                  ].join(' ')}
                >
                  {material.label}
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
          </header>

          <ProductGrid
            products={filteredProducts}
            onAddToCart={(product) => {
              if (product.selectedOrFirstAvailableVariantId == null) {
                return;
              }

              void addVariant(product.selectedOrFirstAvailableVariantId, 1);
            }}
          />

          <button
            type="button"
            className="mx-auto block rounded border border-[#1c1c15] px-8 py-3 text-xs font-semibold tracking-widest text-[#1c1c15] uppercase transition hover:bg-[#1c1c15] hover:text-white"
          >
            {t('shopAll.loadMoreArtifacts')}
          </button>
        </main>
      </div>
    </div>
  );
}
