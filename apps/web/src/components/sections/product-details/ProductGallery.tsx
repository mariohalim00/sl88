import { useTranslation } from 'react-i18next';

import type { MockProduct } from '@/features/catalog/model/schemas';

type ProductGalleryProps = {
  product: MockProduct;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-3">
      <div className="aspect-4/5 overflow-hidden rounded border border-[#d4c4ac] bg-[#f1eee3]">
        <img
          className="h-full w-full object-cover"
          src={product.imageUrl}
          alt={product.name}
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {product.gallery.map((image, index) => (
          <div
            key={`${product.id}-${index}`}
            className={[
              'aspect-square overflow-hidden rounded border bg-[#f1eee3]',
              index === 0 ? 'border-[#f4b400]' : 'border-[#d4c4ac] opacity-80',
            ].join(' ')}
          >
            <img
              className="h-full w-full object-cover"
              src={image}
              alt={t('productDetails.galleryView', {
                name: product.name,
                index: index + 1,
              })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
