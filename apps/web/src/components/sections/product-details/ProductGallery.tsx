import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { StorefrontProductDetail } from '@/features/catalog/types/storefront';

type ProductGalleryProps = {
  product: StorefrontProductDetail;
  selectedVariantImageUrl?: string | null;
};

export function ProductGallery({ product, selectedVariantImageUrl }: ProductGalleryProps) {
  return (
    <ProductGalleryContent
      key={product.id}
      product={product}
      selectedVariantImageUrl={selectedVariantImageUrl ?? null}
    />
  );
}

function ProductGalleryContent({ product, selectedVariantImageUrl }: ProductGalleryProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const fallbackImage = useMemo(
    () => ({
      url: '/branding/logo.png',
      altText: product.title,
    }),
    [product.title],
  );
  const images = useMemo(() => {
    if (product.images.length === 0) {
      return [fallbackImage];
    }

    return product.images;
  }, [fallbackImage, product.images]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Switch main image when variant image changes
  useEffect(() => {
    if (selectedVariantImageUrl == null) return;
    const variantIndex = images.findIndex(
      (img) => img.url === selectedVariantImageUrl,
    );
    if (variantIndex !== -1) {
      setActiveImageIndex(variantIndex);
    }
  }, [images, selectedVariantImageUrl]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog == null) {
      return;
    }

    if (isViewerOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }

      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [isViewerOpen]);

  useEffect(() => {
    if (!isViewerOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsViewerOpen(false);
      }

      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((current) =>
          current === 0 ? images.length - 1 : current - 1,
        );
      }

      if (event.key === 'ArrowRight') {
        setActiveImageIndex((current) => (current + 1) % images.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [images.length, isViewerOpen]);

  const activeImage = images[activeImageIndex] ?? fallbackImage;

  const showPreviousImage = () => {
    setActiveImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % images.length);
  };

  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={() => setIsViewerOpen(true)}
        className="block aspect-4/5 w-full overflow-hidden rounded border border-[#d4c4ac] bg-[#f1eee3]"
        aria-label={t('productDetails.openImageViewer')}
      >
        <img
          className="h-full w-full object-contain"
          src={activeImage.url}
          alt={activeImage.altText ?? product.title}
        />
      </button>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            type="button"
            key={`${product.id}-${image.url}`}
            onClick={() => setActiveImageIndex(index)}
            aria-label={t('productDetails.galleryView', {
              name: product.title,
              index: index + 1,
            })}
            className={[
              'aspect-square w-16 shrink-0 overflow-hidden rounded border bg-[#f1eee3]',
              activeImageIndex === index
                ? 'border-[#f4b400]'
                : 'border-[#d4c4ac] opacity-80',
            ].join(' ')}
          >
            <img
              className="h-full w-full object-cover"
              src={image.url}
              alt={t('productDetails.galleryView', {
                name: product.title,
                index: index + 1,
              })}
            />
          </button>
        ))}
      </div>

      {isViewerOpen ? (
        <dialog
          ref={dialogRef}
          className="fixed inset-0 z-70 m-0 h-screen max-h-screen w-screen max-w-none border-0 bg-black/90 p-4 md:p-8"
          onCancel={(event) => {
            event.preventDefault();
            setIsViewerOpen(false);
          }}
          onClose={() => setIsViewerOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsViewerOpen(false);
            }
          }}
          aria-label={t('productDetails.openImageViewer')}
        >
          <button
            type="button"
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            onClick={() => setIsViewerOpen(false)}
            aria-label={t('productDetails.closeImageViewer')}
          >
            <X className="size-5" />
          </button>

          <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
            <button
              type="button"
              onClick={showPreviousImage}
              className="mr-3 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label={t('common.actions.prev')}
            >
              <ChevronLeft className="size-6" />
            </button>

            <img
              src={activeImage.url}
              alt={activeImage.altText ?? product.title}
              className="max-h-[90vh] max-w-[80vw] rounded object-contain"
            />

            <button
              type="button"
              onClick={showNextImage}
              className="ml-3 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label={t('common.actions.next')}
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </dialog>
      ) : null}
    </section>
  );
}
