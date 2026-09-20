import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { AddressBook } from '@/features/customer/components/AddressBook';
import { CustomerProfile } from '@/features/customer/components/CustomerProfile';
import { OrderHistory } from '@/features/customer/components/OrderHistory';
import { useCustomer } from '@/features/customer/hooks/useCustomer';

type AccountTab = 'profile' | 'orders' | 'addresses';

export function AccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { customer, isLoading, logout } = useCustomer();
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  // Wait for auth check before redirecting — avoids flash redirect on refresh
  if (isLoading) {
    return null;
  }

  if (customer == null) {
    return <Navigate to={"/login"} replace/>
    return null;
  }

  const tabs: { key: AccountTab; label: string }[] = [
    { key: 'profile', label: t('customer.profile') },
    { key: 'orders', label: t('customer.orders') },
    { key: 'addresses', label: t('customer.addresses') },
  ];

  const handleLogout = async () => {
    await logout();
    void navigate('/');
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#7a5900] uppercase">
            {t('customer.account')}
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-[#1c1c15] sm:text-3xl">
            {t('customer.greeting', {
              name: customer.firstName ?? customer.displayName,
            })}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded border border-[#d4c4ac] px-4 py-2 text-sm font-medium text-[#504533] transition hover:bg-[#f7f4e9]"
        >
          {t('auth.logout')}
        </button>
      </div>

      {/* Tab navigation */}
      <nav className="mt-8 flex gap-1 border-b border-[#e5e2d8]" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'border-b-2 border-[#f4b400] text-[#1c1c15]'
                : 'text-[#504533] hover:text-[#1c1c15]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="mt-8">
        {activeTab === 'profile' && <CustomerProfile />}
        {activeTab === 'orders' && <OrderHistory />}
        {activeTab === 'addresses' && <AddressBook />}
      </div>
    </section>
  );
}
