import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ProductGallery } from '@/components/sections/product-details/ProductGallery';
import { getProductDetail, listProducts } from '@/features/catalog/api/catalog';
import { useCart } from '@/features/catalog/hooks/useCart';
import { formatCurrency } from '@/lib/currency';
import { sanitizeHtml } from '@/lib/sanitize-html';

import type {
  StorefrontProductDetail,
  StorefrontProductSummary,
} from '@/features/catalog/types/storefront';

export function ProductDetailsPage() {
  const { t } = useTranslation();
  const { addVariant, isMutating } = useCart();
  const { handle } = useParams();
  const [product, setProduct] = useState<StorefrontProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<
    StorefrontProductSummary[]
  >([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (handle == null || handle.length === 0) {
        setStatus('error');
        return;
      }

      setStatus('loading');

      try {
        const [detail, products] = await Promise.all([
          getProductDetail(handle),
          listProducts({ limit: 8 }),
        ]);

        if (!isActive) {
          return;
        }

        setProduct(detail);
        setRelatedProducts(
          products.filter((item) => item.handle !== detail.handle).slice(0, 3),
        );
        setStatus('ready');
      } catch {
        if (!isActive) {
          return;
        }

        setProduct(null);
        setRelatedProducts([]);
        setStatus('error');
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [handle]);

  if (status === 'loading') {
    return (
      <section className="rounded border border-dashed border-[#d4c4ac] p-8 text-center">
        <p className="text-sm text-[#504533]">Loading product details...</p>
      </section>
    );
  }

  if (status === 'error' || product == null) {
    return (
      <section className="rounded border border-dashed border-[#d4c4ac] p-8 text-center">
        <h1 className="font-heading text-3xl font-semibold text-[#1c1c15]">
          {t('productDetails.notFoundTitle')}
        </h1>
        <p className="mt-2 text-sm text-[#504533]">
          {t('productDetails.notFoundDescription')}
        </p>
        <Link
          className="mt-4 inline-block text-sm font-semibold tracking-[0.08em] text-[#1c1c15] underline uppercase"
          to="/shop/all"
        >
          {t('productDetails.returnToShopAll')}
        </Link>
      </section>
    );
  }

  const primaryVariant =
    product.variants.find(
      (item) => item.id === product.selectedOrFirstAvailableVariantId,
    ) ??
    product.variants[0] ??
    null;
  const isPrimaryVariantAvailable = primaryVariant?.availableForSale ?? false;
  const descriptionHtml = sanitizeHtml(
    product.descriptionHtml.length > 0
      ? product.descriptionHtml
      : `<p>${t('productDetails.descriptionSuffix')}</p>`,
  );

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="grid gap-8 md:grid-cols-2 md:gap-10">
        <ProductGallery product={product} />

        <div className="pt-2 md:px-3 md:pt-6">
          <span className="inline-block rounded-full border border-[#d4c4ac] bg-[#f1eee3] px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#504533] uppercase">
            {t('productDetails.handcraftedCategory', {
              category: product.productType.length > 0 ? product.productType : product.title,
            })}
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">
            {product.title}
          </h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-semibold text-[#7a5900]">
              {formatCurrency(Number.parseFloat(primaryVariant?.price ?? '0'))}
            </p>
            <p className="pb-1 text-sm text-[#504533] line-through">
              {formatCurrency(
                Math.round(
                  Number.parseFloat(primaryVariant?.price ?? '0') * 1.2,
                ),
              )}
            </p>
          </div>

          {isPrimaryVariantAvailable ? (
            <div className="mt-5 flex items-center gap-2 text-[#7a5900]">
              <CheckCircle2 className="size-4" />
              <span className="text-sm font-semibold">
                {t('productDetails.inStockReadyToShip')}
              </span>
            </div>
          ) : null}

          <div
            className="mt-6 border-l-2 border-[#d4c4ac] pl-4 text-sm leading-relaxed text-[#504533] md:text-base"
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
          />

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => {
                if (primaryVariant == null) {
                  return;
                }

                void addVariant(primaryVariant.id, 1);
              }}
              disabled={
                primaryVariant == null ||
                !isPrimaryVariantAvailable ||
                isMutating
              }
              className="w-full rounded bg-[#f4b400] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95"
            >
              {t('common.actions.addToBag')}
            </button>
            <button
              type="button"
              className="w-full rounded border border-[#1c1c15] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:bg-[#f7f4e9]"
            >
              {t('productDetails.inquireNow')}
            </button>
          </div>

          <section className="mt-8 border-t border-[#d4c4ac] pt-6">
            <div className="grid grid-cols-2 gap-y-3 text-sm text-[#504533]">
              <span className="font-semibold text-[#1c1c15]">
                {t('productDetails.specs.origin')}
              </span>
              <span>{t('productDetails.specs.originValue')}</span>
              <span className="font-semibold text-[#1c1c15]">
                {t('productDetails.specs.material')}
              </span>
              <span>{primaryVariant?.title ?? 'Default'}</span>
              <span className="font-semibold text-[#1c1c15]">
                {t('productDetails.specs.stock')}
              </span>
              <span>
                {isPrimaryVariantAvailable ? 'Available' : 'Sold out'}
              </span>
              <span className="font-semibold text-[#1c1c15]">
                {t('productDetails.specs.rating')}
              </span>
              <span>{product.variants.length} variants</span>
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-[#d4c4ac] pt-10 md:pt-14">
        <h2 className="mb-8 text-center font-heading text-3xl font-semibold text-[#1c1c15]">
          {t('productDetails.relatedTitle')}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <article key={item.id} className="group">
              <div className="relative mb-4 aspect-3/4 overflow-hidden rounded border border-[#d4c4ac] bg-[#f1eee3]">
                <img
                  src={item.featuredImageUrl ?? '/branding/logo.png'}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-heading text-xl text-[#1c1c15]">
                {item.title}
              </h3>
              <p className="text-sm text-[#504533]">
                {formatCurrency(Number.parseFloat(item.priceMin))}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
