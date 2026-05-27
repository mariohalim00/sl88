import { useTranslation } from 'react-i18next';
import { CartSummary } from '@/features/catalog/components/CartSummary';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { StoreHeader } from '@/features/catalog/components/StoreHeader';
import { useCart } from '@/features/catalog/hooks/useCart';
import { useCatalog } from '@/features/catalog/hooks/useCatalog';
import { useCheckout } from '@/features/catalog/hooks/useCheckout';

/**
 * @deprecated This is part of the original scaffolding, will be deleted soon
 */
export function StorefrontPage() {
  const { t } = useTranslation();
  const { searchTerm, setSearchTerm, isLoading, isError, filteredProducts } =
    useCatalog();

  const { summary, isMutating, updateLine, removeLine } = useCart();
  const { isRedirecting, startCheckout } = useCheckout();

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <p className="text-sm text-muted-foreground">
          {t('storefront.loadingCatalog')}
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <p className="text-sm text-destructive">{t('storefront.loadError')}</p>
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
          <ProductGrid products={filteredProducts} onAddToCart={() => {}} />
          <CartSummary
            items={summary.lineItems}
            subtotal={summary.subtotal}
            isMutating={isMutating}
            isCheckingOut={isRedirecting}
            canCheckout={summary.cartId != null && summary.lineItems.length > 0}
            onCheckout={async () => {
              if (summary.cartId == null) {
                return;
              }

              await startCheckout(summary.cartId);
            }}
            onUpdateQuantity={updateLine}
            onRemoveItem={removeLine}
          />
        </section>
      </div>
    </main>
  );
}
