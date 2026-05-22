import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ContactUsLink } from './ContactUsLink';
import { desktopLinkBaseClass, navLinks, scrollLinks } from './constants';

type HeaderDesktopNavProps = {
  isScrollLinkActive: (id: string) => boolean;
};

export function HeaderDesktopNav({ isScrollLinkActive }: HeaderDesktopNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {scrollLinks.map((item) => (
        <a
          key={item.id}
          href={`/#${item.id}`}
          className={cn(
            desktopLinkBaseClass,
            isScrollLinkActive(item.id)
              ? 'border-b-2 border-[#f4b400] text-[#1c1c15]'
              : 'border-transparent text-[#504533] hover:border-[#f4b400] hover:text-[#1c1c15]'
          )}
        >
          {t(item.labelKey)}
        </a>
      ))}
      {navLinks.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              desktopLinkBaseClass,
              isActive
                ? 'border-[#f4b400] text-[#1c1c15] border-b-2'
                : 'border-transparent text-[#504533] hover:border-[#f4b400] hover:text-[#1c1c15]'
            )
          }
        >
          {t(item.labelKey)}
        </NavLink>
      ))}
      <ContactUsLink className="h-9 px-3 tracking-[0.08em]" />
    </nav>
  );
}
