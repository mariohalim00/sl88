import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppHeader } from './AppHeader';
import { Button } from '@/components/ui/button';
import { companyInfo } from '@/config/company';

import type { PropsWithChildren } from 'react';

export function AppShell({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-[#1c1c15]">
      <AppHeader />

      <main className="mx-auto w-full max-w-7xl px-3 pt-24 pb-10 sm:px-4 md:px-16 md:pt-32 md:pb-20">
        {children}
      </main>

      <Button
        type="button"
        aria-label={t('common.actions.contactUs')}
        onClick={() => {
          window.open(
            companyInfo.contact.waLink,
            '_blank',
            'noopener,noreferrer',
          );
        }}
        className="fixed right-5 bottom-5 z-50 size-14 rounded-full border-transparent bg-[#25d366] text-white shadow-lg hover:bg-[#22c55e] focus-visible:ring-[#1c1c15]"
      >
        <MessageCircle className="size-8" />
      </Button>
    </div>
  );
}
