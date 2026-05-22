import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HeaderActionButtons } from './header/HeaderActionButtons';
import { HeaderBrand } from './header/HeaderBrand';
import { HeaderDesktopNav } from './header/HeaderDesktopNav';
import { iconButtonClass } from './header/constants';
import { MobileMenuDrawer } from './header/MobileMenuDrawer';

export function AppHeader() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLandingRoute = location.pathname === '/';

  const isScrollLinkActive = (id: string) => {
    return isLandingRoute && location.hash === `#${id}`;
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#d4c4ac]/50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={cn(iconButtonClass, 'md:hidden')}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              onClick={openMobileMenu}
            >
              <Menu className="size-5" />
            </button>
            <HeaderBrand />
          </div>

          <HeaderDesktopNav isScrollLinkActive={isScrollLinkActive} />
          <HeaderActionButtons />
        </div>
      </header>

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        isScrollLinkActive={isScrollLinkActive}
      />
    </>
  );
}
