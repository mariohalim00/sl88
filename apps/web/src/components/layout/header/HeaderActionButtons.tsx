import { Heart, ShoppingBag, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { iconButtonClass } from './constants';
import { cn } from '@/lib/utils';

export function HeaderActionButtons() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 text-[#1c1c15] md:gap-6">
      <LanguageSwitcher />
      <button
        type="button"
        aria-label={t('header.aria.bag')}
        className={iconButtonClass}
      >
        <ShoppingBag className="size-5" />
      </button>
      <button
        type="button"
        aria-label={t('header.aria.favorites')}
        className={cn(iconButtonClass, 'hidden sm:block')}
      >
        <Heart className="size-5" />
      </button>
      <button
        type="button"
        aria-label={t('header.aria.account')}
        className={cn(iconButtonClass, 'hidden sm:block')}
      >
        <User className="size-5" />
      </button>
    </div>
  );
}
