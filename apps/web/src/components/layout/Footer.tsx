import { useTranslation } from 'react-i18next';
import { companyInfo } from '@/config/company';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 border-t border-[#d4c4ac] bg-white py-12 md:mt-20 md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center md:px-16">
        {/* Left Side: Logo & Copyright */}
        <div className="flex flex-col space-y-3">
          <span className="font-serif text-lg font-semibold text-[#1c1c15] md:text-xl">
            {companyInfo.name}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#504533]">
            © 2018 {companyInfo.name}. {t('footer.rightsReserved')}
          </span>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8">
          {/* <a
            href="#"
            className="text-xs font-semibold uppercase tracking-widest text-[#504533] transition-colors hover:text-[#f4b400]"
          >
            Privacy Policy
          </a> */}
          {/* <a
            href="#"
            className="text-xs font-semibold uppercase tracking-widest text-[#504533] transition-colors hover:text-[#f4b400]"
          >
            Terms of Service
          </a> */}
          <a
            href={companyInfo.contact.waLink}
            target="_blank"
            className="text-xs font-semibold uppercase tracking-widest text-[#504533] transition-colors hover:text-[#f4b400]"
          >
            {t('common.actions.contactUs')}
          </a>
          <a
            href="#"
            className="text-xs font-semibold uppercase tracking-widest text-[#504533] transition-colors hover:text-[#f4b400]"
          >
            {t('footer.shippingReturns')}
          </a>
          <a
            href="#"
            className="text-xs font-semibold uppercase tracking-widest text-[#504533] transition-colors hover:text-[#f4b400]"
          >
            {t('footer.carpetCareGuide')}
          </a>
        </div>
      </div>
    </footer>
  );
}
