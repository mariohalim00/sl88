import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { featureFlags } from '@/lib/feature-flags';

export function AdminActions() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" disabled={!featureFlags.adminActionsEnabled}>
        {t('admin.actions.publishInventoryUpdate')}
      </Button>
      <Button
        variant="outline"
        disabled={!featureFlags.checkoutEnabled || !featureFlags.paymentEnabled}
      >
        {t('admin.actions.triggerCheckoutSmokeTest')}
      </Button>
    </div>
  );
}
