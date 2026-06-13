import { Link } from 'react-router-dom';
import { companyInfo } from '@/config/company';
import { cn } from '@/lib/utils';

type HeaderBrandProps = {
  shortName?: boolean;
  onClick?: () => void;
};

export function HeaderBrand({ shortName = false, onClick }: HeaderBrandProps) {
  return (
    <Link to="/" className="flex items-center gap-3" onClick={onClick}>
      <span className="h-25 w-25 overflow-hidden rounded-md">
        <img
          src={companyInfo.branding.logoSrc}
          alt={`${companyInfo.name} logo`}
          className="h-full w-full object-cover object-top"
        />
      </span>
      <span
        className={cn(
          'font-serif tracking-tight text-[#1c1c15]',
          shortName ? 'text-base' : 'text-lg md:text-xl',
        )}
      >
        {shortName ? companyInfo.shortName : companyInfo.name}
      </span>
    </Link>
  );
}
