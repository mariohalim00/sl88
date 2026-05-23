import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from '@/components/ui/button';
import { companyInfo } from '@/config/company';
import { cn } from '@/lib/utils';

type ContactUsLinkProps = {
  onClick?: () => void;
  className?: string;
};

export function ContactUsLink({ onClick, className }: ContactUsLinkProps) {
  const { t } = useTranslation();

  return (
    <a
      href={companyInfo.contact.waLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'gap-2 border-[#1c1c15] text-[#1c1c15] uppercase hover:bg-[#f7f4e9]',
        className,
      )}
    >
      <MessageCircle className="size-4" />
      {t('common.actions.contactUs')}
    </a>
  );
}
