import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomer';
import { formatCurrency } from '@/lib/currency';

export function OrderHistory() {
  const { t } = useTranslation();
  const { customer } = useCustomer();
  const orders = customer?.orders ?? [];

  if (orders.length === 0) {
    return (
      <div className="rounded border border-dashed border-[#d4c4ac] bg-white px-6 py-12 text-center">
        <p className="text-[#504533]">{t('customer.noOrders')}</p>
        <Link
          to="/shop/all"
          className="mt-4 inline-block rounded bg-[#f4b400] px-5 py-2.5 text-sm font-semibold text-[#1c1c15] transition hover:brightness-95"
        >
          {t('customer.browseShop')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded border border-[#e5e2d8] bg-white p-5 transition hover:border-[#d4c4ac]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1c1c15]">
                {t('customer.orderNumber')} #{order.orderNumber}
              </p>
              <p className="mt-1 text-xs text-[#504533]">
                {order.processedAt != null
                  ? new Date(order.processedAt).toLocaleDateString()
                  : '-'}
              </p>
              <p className="mt-1 text-sm font-medium text-[#1c1c15]">
                {formatCurrency(Number(order.totalPrice))}
              </p>
              <p className="text-xs text-[#504533]">
                {order.lineItems.length}{' '}
                {order.lineItems.length === 1
                  ? t('customer.item')
                  : t('customer.items')}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${
                order.fulfillmentStatus === 'FULFILLED'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {order.fulfillmentStatus === 'FULFILLED'
                ? t('customer.fulfilled')
                : t('customer.unfulfilled')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
