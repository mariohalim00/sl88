import { CheckCircle2, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ProductGallery } from '@/components/sections/product-details/ProductGallery';
import { getProductDetail, listProducts } from '@/features/catalog/api/catalog';
import { useCart } from '@/features/catalog/hooks/useCart';
import { useCheckout } from '@/features/catalog/hooks/useCheckout';
import { formatCurrency } from '@/lib/currency';
import { renderSanitizedHtml } from '@/lib/render-sanitized-html';
import { sanitizeHtml } from '@/lib/sanitize-html';

import type {
  StorefrontProductDetail,
  StorefrontProductSummary,
} from '@/features/catalog/types/storefront';

export function ProductDetailsPage() {
  const { t } = useTranslation();
  const { addVariant, summary, isMutating, stageCartForCheckout } = useCart();
  const { isRedirecting, startCheckout } = useCheckout();
  const { handle } = useParams();
  const [product, setProduct] = useState<StorefrontProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
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

  // --- Derived state (all hooks must live above early returns) ---

  // Group variant options by name and collect unique values
  const variantOptionGroups = useMemo(() => {
    const optionMap = new Map<string, Set<string>>();
    for (const variant of product?.variants ?? []) {
      for (const opt of variant.selectedOptions) {
        if (!optionMap.has(opt.name)) {
          optionMap.set(opt.name, new Set());
        }
        optionMap.get(opt.name)!.add(opt.value);
      }
    }
    return Array.from(optionMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [product?.variants]);

  // Initialize selected options from the default variant
  const initialVariant = useMemo(() => {
    if (product == null) return null;
    const defaultVariant =
      product.variants.find(
        (v) => v.id === product.selectedOrFirstAvailableVariantId,
      ) ?? product.variants[0];
    if (defaultVariant == null) return null;
    const opts: Record<string, string> = {};
    for (const o of defaultVariant.selectedOptions) {
      opts[o.name] = o.value;
    }
    return { id: defaultVariant.id, options: opts };
  }, [product?.selectedOrFirstAvailableVariantId, product?.variants]);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(initialVariant?.options ?? {});

  // Sync selectedOptions when product data arrives
  useEffect(() => {
    if (initialVariant) {
      setSelectedOptions(initialVariant.options);
    }
  }, [initialVariant]);

  // Find the variant matching the currently selected options
  const selectedVariant = useMemo(() => {
    if (product == null) return null;
    const match = product.variants.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value),
    );
    return match ?? product.variants[0] ?? null;
  }, [product?.variants, selectedOptions]);

  const handleOptionChange = (optionName: string, optionValue: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: optionValue }));
  };

  const isSelectedVariantAvailable = selectedVariant?.availableForSale ?? false;

  const descriptionHtml = sanitizeHtml(
    product != null && product.descriptionHtml.length > 0
      ? product.descriptionHtml
      : `<p>${t('productDetails.descriptionSuffix')}</p>`,
  );

  const addToCart = async () => {
    if (selectedVariant == null) {
      return;
    }

    await addVariant(selectedVariant.id, quantity);
  };

  const buyNow = async () => {
    if (selectedVariant == null) {
      return;
    }

    const nextCart = await addVariant(selectedVariant.id, quantity);
    const nextCartId = nextCart?.id ?? summary.cartId;

    if (nextCartId == null) {
      return;
    }

    stageCartForCheckout();
    await startCheckout(nextCartId);
  };

  // --- Early returns for loading / error states ---

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

  return (
    <div className="space-y-8 md:space-y-16">
      <section className="min-w-0 grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="min-w-0">
          <ProductGallery
            product={product}
            selectedVariantImageUrl={selectedVariant?.imageUrl ?? null}
          />
        </div>

        <div className="min-w-0 pt-2 md:px-3 md:pt-6">
          <span className="inline-block max-w-full truncate rounded-full border border-[#d4c4ac] bg-[#f1eee3] px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#504533] uppercase">
            {t('productDetails.category', {
              category:
                product.productType.length > 0
                  ? product.productType
                  : product.title,
            })}
          </span>
          <h1 className="mt-4 break-words font-heading text-2xl font-semibold text-[#1c1c15] md:text-4xl">
            {product.title}
          </h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-2xl font-semibold text-[#7a5900] md:text-3xl">
              {formatCurrency(Number.parseFloat(selectedVariant?.price ?? '0'))}
            </p>
            <p className="pb-1 text-xs text-[#504533] line-through sm:text-sm">
              {formatCurrency(
                Math.round(
                  Number.parseFloat(selectedVariant?.price ?? '0') * 1.2,
                ),
              )}
            </p>
          </div>

          {isSelectedVariantAvailable ? (
            <div className="mt-4 flex items-center gap-2 text-[#7a5900]">
              <CheckCircle2 className="size-4 shrink-0" />
              <span className="text-xs font-semibold sm:text-sm">
                {t('productDetails.inStockReadyToShip')}
              </span>
            </div>
          ) : null}

          <div className="mt-5 border-l-2 border-[#d4c4ac] pl-4 break-words text-xs leading-relaxed text-[#504533] sm:text-sm md:text-base">
            {renderSanitizedHtml(descriptionHtml)}
          </div>

          {/* Variant selector */}
          {variantOptionGroups.length > 0 ? (
            <div className="mt-6 space-y-4">
              {variantOptionGroups.map((group) => (
                <fieldset key={group.name}>
                  <legend className="mb-2 text-sm font-semibold text-[#1c1c15]">
                    {group.name}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map((val) => {
                      const isSelected = selectedOptions[group.name] === val;
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => handleOptionChange(group.name, val)}
                          className={[
                            'rounded-full border px-2.5 py-1 text-xs font-medium transition sm:px-4 sm:py-1.5 sm:text-sm',
                            isSelected
                              ? 'border-[#f4b400] bg-[#f4b400]/10 text-[#1c1c15]'
                              : 'border-[#d4c4ac] text-[#504533] hover:border-[#c4b49a] hover:bg-[#f7f4e9]',
                          ].join(' ')}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          ) : null}

          {!isSelectedVariantAvailable ? (
            <p className="mt-4 text-sm font-medium text-red-600">
              {t('productDetails.outOfStock')}
            </p>
          ) : null}

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-28 items-center justify-between rounded-md border border-[#d4c4ac] bg-[#f7f4e9] px-3 text-lg text-[#1c1c15] sm:w-48 sm:px-4">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  aria-label={t('productDetails.decreaseQuantity')}
                >
                  -
                </button>
                <span className="text-base">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  aria-label={t('productDetails.increaseQuantity')}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  void addToCart();
                }}
                disabled={
                  selectedVariant == null ||
                  !isSelectedVariantAvailable ||
                  isMutating ||
                  isRedirecting
                }
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-[#f4b400] px-5 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95 disabled:opacity-60"
              >
                <ShoppingCart className="size-4" />
                {t('common.actions.addToCart')}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                void buyNow();
              }}
              disabled={
                selectedVariant == null ||
                !isSelectedVariantAvailable ||
                isMutating ||
                isRedirecting
              }
              className="h-12 w-full rounded-md border border-[#1c1c15] px-5 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:bg-[#f7f4e9] disabled:opacity-60"
            >
              {t('common.actions.buyNow')}
            </button>
          </div>

          <section className="mt-6 border-t border-[#d4c4ac] pt-5 sm:mt-8 sm:pt-6">
            <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs text-[#504533] sm:text-sm">
              <span className="font-semibold text-[#1c1c15]">
                {t('productDetails.specs.origin')}
              </span>
              <span>{t('productDetails.specs.originValue')}</span>
              <span className="font-semibold text-[#1c1c15]">
                {t('productDetails.specs.material')}
              </span>
              <span>
                {product.productType.length > 0
                  ? product.productType
                  : 'Default'}
              </span>
              <span className="font-semibold text-[#1c1c15]">
                {t('productDetails.specs.stock')}
              </span>
              <span>
                {isSelectedVariantAvailable ? 'Available' : 'Sold out'}
              </span>
              <span className="font-semibold text-[#1c1c15]">
                {t('productDetails.specs.variants')}
              </span>
              <span>{product.variants.length}</span>
            </div>
          </section>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="border-t border-[#d4c4ac] pt-10 md:pt-14">
          <h2 className="mb-8 text-center font-heading text-3xl font-semibold text-[#1c1c15]">
            {t('productDetails.relatedTitle')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {relatedProducts.map((item) => (
              <Link
                to={`/products/${item.handle}`}
                key={item.id}
                className="group block"
              >
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
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
