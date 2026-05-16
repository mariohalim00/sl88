import { companyInfo } from '@/config/company';

const rupiahFormatter = new Intl.NumberFormat(companyInfo.locale, {
  style: 'currency',
  currency: companyInfo.currency,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return rupiahFormatter.format(value);
}
