import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateCustomerMe } from '../api/customer';
import { useCustomer } from '../hooks/useCustomer';

export function CustomerProfile() {
  const { t } = useTranslation();
  const { customer, refreshCustomer } = useCustomer();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(customer?.firstName ?? '');
  const [lastName, setLastName] = useState(customer?.lastName ?? '');
  const [email, setEmail] = useState(customer?.email ?? '');
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (customer == null) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateCustomerMe({ firstName, lastName, email, phone });
      await refreshCustomer();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFirstName(customer.firstName ?? '');
    setLastName(customer.lastName ?? '');
    setEmail(customer.email ?? '');
    setPhone(customer.phone ?? '');
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {error != null && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="text-xs font-semibold text-[#7a5900] uppercase">
              {t('auth.firstName')}
            </span>
            {isEditing ? (
              <input
                aria-label="first name field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              />
            ) : (
              <p className="mt-1 text-[#1c1c15]">{customer.firstName || '-'}</p>
            )}
          </div>
          <div>
            <span className="text-xs font-semibold text-[#7a5900] uppercase">
              {t('auth.lastName')}
            </span>
            {isEditing ? (
              <input
                aria-label="last name field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              />
            ) : (
              <p className="mt-1 text-[#1c1c15]">{customer.lastName || '-'}</p>
            )}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-[#7a5900] uppercase">
            {t('auth.email')}
          </span>
          {isEditing ? (
            <input
              aria-label="email field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
            />
          ) : (
            <p className="mt-1 text-[#1c1c15]">{customer.email}</p>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-[#7a5900] uppercase">
            {t('customer.phone')}
          </span>
          {isEditing ? (
            <input
              aria-label="phone field"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
            />
          ) : (
            <p className="mt-1 text-[#1c1c15]">{customer.phone || '-'}</p>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-[#7a5900] uppercase">
            {t('customer.memberSince')}
          </span>
          <p className="mt-1 text-[#1c1c15]">
            {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded bg-[#f4b400] px-5 py-2.5 text-sm font-semibold text-[#1c1c15] transition hover:brightness-95 disabled:opacity-50"
            >
              {saving ? '...' : t('common.save')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded border border-[#d4c4ac] px-5 py-2.5 text-sm font-medium text-[#504533] transition hover:bg-[#f7f4e9]"
            >
              {t('common.cancel')}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded bg-[#f4b400] px-5 py-2.5 text-sm font-semibold text-[#1c1c15] transition hover:brightness-95"
          >
            {t('customer.editProfile')}
          </button>
        )}
      </div>
    </div>
  );
}
