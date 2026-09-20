import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from '../api/customer';
import type { CustomerAddress } from '../types/customer';

type AddressFormData = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
};

const emptyForm: AddressFormData = {
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  zip: '',
  country: '',
  phone: '',
};

export function AddressBook() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [defaultAddress, setDefaultAddress] =
    useState<CustomerAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<AddressFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const result = await fetchCustomerAddresses();
      setAddresses(result.addresses);
      setDefaultAddress(result.defaultAddress);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load addresses',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsAdding(false);
    setError(null);
  };

  const fillForm = (addr: CustomerAddress) => {
    setForm({
      firstName: addr.firstName,
      lastName: addr.lastName,
      address1: addr.address1,
      address2: addr.address2 ?? '',
      city: addr.city,
      province: addr.province ?? '',
      zip: addr.zip,
      country: addr.country,
      phone: addr.phone ?? '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleEdit = (addr: CustomerAddress) => {
    resetForm();
    fillForm(addr);
    setEditingId(addr.id);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editingId != null) {
        await updateCustomerAddress(editingId, form);
      } else {
        await createCustomerAddress(form);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save address',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomerAddress(id);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete address',
      );
    }
  };

  const isEditing = editingId != null || isAdding;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded border border-[#e5e2d8] bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error != null && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Address list */}
      {addresses.length === 0 && !isEditing ? (
        <div className="rounded border border-dashed border-[#d4c4ac] bg-white px-6 py-12 text-center">
          <p className="text-[#504533]">
            {t('customer.noAddresses')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded border border-[#e5e2d8] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[#1c1c15]">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="mt-0.5 text-sm text-[#504533]">
                    {addr.address1}
                    {addr.address2 != null ? `, ${addr.address2}` : ''}
                  </p>
                  <p className="text-sm text-[#504533]">
                    {addr.city}
                    {addr.province != null ? `, ${addr.province}` : ''}{' '}
                    {addr.zip}
                  </p>
                  <p className="text-sm text-[#504533]">{addr.country}</p>
                  {addr.phone != null ? (
                    <p className="text-sm text-[#504533]">{addr.phone}</p>
                  ) : null}
                  {defaultAddress?.id === addr.id ? (
                    <span className="mt-1 inline-block rounded bg-[#f7f4e9] px-2 py-0.5 text-[10px] font-semibold text-[#7a5900] uppercase">
                      {t('customer.defaultAddress')}
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(addr)}
                    className="text-xs font-medium text-[#7a5900] hover:text-[#1c1c15]"
                  >
                    {t('common.edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-800"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {!isEditing && (
        <button
          type="button"
          onClick={handleAdd}
          className="rounded border border-[#d4c4ac] px-5 py-2.5 text-sm font-medium text-[#504533] transition hover:bg-[#f7f4e9]"
        >
          + {t('customer.addAddress')}
        </button>
      )}

      {/* Address form */}
      {isEditing && (
        <div className="rounded border border-[#e5e2d8] bg-white p-5">
          <h3 className="font-heading text-lg font-semibold text-[#1c1c15]">
            {editingId != null
              ? t('customer.editAddress')
              : t('customer.newAddress')}
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              placeholder={t('auth.firstName')}
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
            />
            <input
              placeholder={t('auth.lastName')}
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
            />
            <input
              placeholder={t('customer.address1')}
              value={form.address1}
              onChange={(e) =>
                setForm((f) => ({ ...f, address1: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400] sm:col-span-2"
            />
            <input
              placeholder={t('customer.address2')}
              value={form.address2}
              onChange={(e) =>
                setForm((f) => ({ ...f, address2: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400] sm:col-span-2"
            />
            <input
              placeholder={t('customer.city')}
              value={form.city}
              onChange={(e) =>
                setForm((f) => ({ ...f, city: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
            />
            <input
              placeholder={t('customer.province')}
              value={form.province}
              onChange={(e) =>
                setForm((f) => ({ ...f, province: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
            />
            <input
              placeholder={t('customer.zip')}
              value={form.zip}
              onChange={(e) =>
                setForm((f) => ({ ...f, zip: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
            />
            <input
              placeholder={t('customer.country')}
              value={form.country}
              onChange={(e) =>
                setForm((f) => ({ ...f, country: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
            />
            <input
              placeholder={t('customer.phone')}
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className="h-10 rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400] sm:col-span-2"
            />
          </div>

          <div className="mt-5 flex gap-3">
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
              onClick={resetForm}
              className="rounded border border-[#d4c4ac] px-5 py-2.5 text-sm font-medium text-[#504533] transition hover:bg-[#f7f4e9]"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
