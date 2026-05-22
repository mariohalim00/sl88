import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/currency';

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

type ProductCardProps = {
  product: CatalogProduct;
  onAddToCart: (productId: string) => void;
};

function formatCategoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <article className="group overflow-hidden rounded border border-[#e5e2d8] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50">
      <div className="relative aspect-4/5 overflow-hidden bg-[#f1eee3]">
        <img
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
        />
        <button
          type="button"
          aria-label={t('productCard.saveAria', { name: product.name })}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#1c1c15] opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="space-y-2 p-4 md:p-5">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-[#504533] uppercase md:text-xs">
          {formatCategoryLabel(product.category)}
        </p>
        <h2 className="line-clamp-1 font-heading text-lg leading-tight text-[#1c1c15]">
          {product.name}
        </h2>
        <p className="line-clamp-2 text-sm text-[#504533]">
          {product.description}
        </p>
        <div className="flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-xs text-[#504533]">
              {t('productCard.inStock', { count: product.stock })}
            </p>
            <p className="text-xs text-[#504533]">
              {t('productCard.rating', { value: product.rating.toFixed(1) })}
            </p>
          </div>
          <p className="text-lg font-semibold text-[#1c1c15]">
            {formatCurrency(product.price)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAddToCart(product.id)}
          className="mt-2 w-full rounded border border-[#1c1c15] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:bg-[#f7f4e9]"
        >
          {t('common.actions.addToBag')}
        </button>
      </div>
    </article>
  );
}
