import { Button } from "@/components/ui/button";
import { featureFlags } from "@/lib/feature-flags";

export function AdminActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" disabled={!featureFlags.adminActionsEnabled}>
        Publish Inventory Update
      </Button>
      <Button variant="outline" disabled={!featureFlags.checkoutEnabled || !featureFlags.paymentEnabled}>
        Trigger Checkout Smoke Test
      </Button>
    </div>
  );
}
