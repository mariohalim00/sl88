import { Heart, ShoppingBag, User } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { cn } from '@/lib/utils';
import { iconButtonClass } from './constants';

export function HeaderActionButtons() {
  return (
    <div className="flex items-center gap-4 text-[#1c1c15] md:gap-6">
      <LanguageSwitcher />
      <button type="button" aria-label="Bag" className={iconButtonClass}>
        <ShoppingBag className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Favorites"
        className={cn(iconButtonClass, 'hidden sm:block')}
      >
        <Heart className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Account"
        className={cn(iconButtonClass, 'hidden sm:block')}
      >
        <User className="size-5" />
      </button>
    </div>
  );
}
