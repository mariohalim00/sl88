import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ContactUsLink } from './ContactUsLink';
import { HeaderBrand } from './HeaderBrand';
import { iconButtonClass, mobileLinkBaseClass, navLinks, scrollLinks } from './constants';

type MobileMenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  isScrollLinkActive: (id: string) => boolean;
};

export function MobileMenuDrawer({
  isOpen,
  onClose,
  isScrollLinkActive,
}: MobileMenuDrawerProps) {
  const { t } = useTranslation();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[82vw] max-w-xs border-r border-[#d4c4ac] bg-[#fcf9ee] p-5 shadow-2xl transition-transform duration-300 md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!isOpen}
      >
        <div className="mb-8 flex items-center justify-between">
          <HeaderBrand shortName onClick={onClose} />
          <button
            type="button"
            aria-label={t('header.aria.closeMenu')}
            className={iconButtonClass}
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {scrollLinks.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              onClick={onClose}
              className={cn(
                mobileLinkBaseClass,
                isScrollLinkActive(item.id)
                  ? 'bg-[#f4b400]/15 text-[#1c1c15]'
                  : 'text-[#504533] hover:bg-[#f4b400]/10 hover:text-[#1c1c15]'
              )}
            >
              {t(item.labelKey)}
            </a>
          ))}

          {navLinks.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  mobileLinkBaseClass,
                  isActive
                    ? 'bg-[#f4b400]/15 text-[#1c1c15]'
                    : 'text-[#504533] hover:bg-[#f4b400]/10 hover:text-[#1c1c15]'
                )
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <ContactUsLink onClick={onClose} className="mt-6 flex w-full justify-center" />
      </aside>
    </>
  );
}
