import { Heart, ShoppingBag, User, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { iconButtonClass } from './constants';
import { useCustomer } from '@/features/customer/hooks/useCustomer';
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
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const isLoggedIn = customer != null;

  const handleAccountClick = async (): Promise<void> => {
    if (isLoggedIn) {
      await navigate('/account');
    } else {
      await navigate('/login');
    }
  };

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
        aria-label={
          isLoggedIn ? t('header.aria.account') : t('header.aria.login')
        }
        onClick={handleAccountClick}
        className={cn(iconButtonClass, 'sm:flex sm:items-center sm:gap-1.5')}
      >
        {isLoggedIn ? (
          <UserCheck className="size-5 text-[#7a5900]" />
        ) : (
          <User className="size-5" />
        )}
        {isLoggedIn && customer.firstName != null ? (
          <span className="hidden text-sm font-medium md:inline">
            {customer.firstName}
          </span>
        ) : null}
      </button>
    </div>
  );
}
