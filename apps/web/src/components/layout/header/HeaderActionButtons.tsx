import { Heart, ShoppingBag, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { iconButtonClass } from './constants';
import { cn } from '@/lib/utils';

type HeaderActionButtonsProps = {
  cartItemCount: number;
  isCartOpen: boolean;
  onToggleCart: () => void;
};

export function HeaderActionButtons({
  cartItemCount,
  isCartOpen,
  onToggleCart,
}: HeaderActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 text-[#1c1c15] md:gap-6">
      <LanguageSwitcher />
      <button
        type="button"
        aria-label={t('header.aria.bag')}
        aria-controls="global-cart-drawer"
        aria-expanded={isCartOpen}
        onClick={onToggleCart}
        className={cn(iconButtonClass, 'relative')}
      >
        <ShoppingBag className="size-5" />
        {cartItemCount > 0 ? (
          <span className="absolute -top-1 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1c1c15] px-1 text-[10px] font-semibold text-white">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        ) : null}
      </button>
      <button
        type="button"
        aria-label={t('header.aria.favorites')}
        className={cn(iconButtonClass, 'sm:block')}
      >
        <Heart className="size-5" />
      </button>
      <button
        type="button"
        aria-label={t('header.aria.account')}
        className={cn(iconButtonClass, 'sm:block')}
      >
        <User className="size-5" />
      </button>
    </div>
  );
}
