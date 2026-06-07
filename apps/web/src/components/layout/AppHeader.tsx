import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { iconButtonClass } from './header/constants';
import { CartDrawer } from './header/CartDrawer';
import { HeaderActionButtons } from './header/HeaderActionButtons';
import { HeaderBrand } from './header/HeaderBrand';
import { HeaderDesktopNav } from './header/HeaderDesktopNav';
import { MobileMenuDrawer } from './header/MobileMenuDrawer';
import { useCart } from '@/features/catalog/hooks/useCart';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const { pathname, hash } = location;
  const { summary } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isLandingRoute = pathname === '/';

  const isScrollLinkActive = (id: string) => {
    return isLandingRoute && hash === `#${id}`;
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
  }, [pathname, hash]);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleCart = () => setIsCartOpen((current) => !current);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#d4c4ac]/50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={cn(iconButtonClass, 'md:hidden')}
              aria-label={t('header.aria.openMenu')}
              aria-expanded={isMobileMenuOpen}
              onClick={openMobileMenu}
            >
              <Menu className="size-5" />
            </button>
            <HeaderBrand />
          </div>

          <HeaderDesktopNav isScrollLinkActive={isScrollLinkActive} />
          <HeaderActionButtons
            cartItemCount={summary.totalItems}
            isCartOpen={isCartOpen}
            onToggleCart={toggleCart}
          />
        </div>
      </header>

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        isScrollLinkActive={isScrollLinkActive}
      />

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
