import { useSyncExternalStore } from 'react';
import { fetchCustomerMe, logoutCustomer } from '../api/customer';
import { startCustomerSignIn } from '../api/customer';

import type { Customer } from '../types/customer';

type CustomerStoreSnapshot = {
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
};

const listeners = new Set<() => void>();

let hasInitialized = false;
let snapshot: CustomerStoreSnapshot = {
  customer: null,
  isLoading: true,
  error: null,
};

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function update(next: Partial<CustomerStoreSnapshot>) {
  snapshot = { ...snapshot, ...next };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

async function init() {
  if (hasInitialized) return;
  hasInitialized = true;

  try {
    const customer = await fetchCustomerMe();
    update({ customer, isLoading: false });
  } catch (err) {
    update({
      customer: null,
      isLoading: false,
      error:
        err instanceof Error ? err.message : 'Failed to check authentication',
    });
  }
}

// Start initialization immediately
if (typeof window !== 'undefined') {
  init().catch(() => {});

  // Re-check auth when tab regains focus (in case login happened in another tab)
  window.addEventListener('focus', () => {
    init().catch(() => {});
  });
}

export function useCustomer() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Passwordless: hand off to Shopify's hosted email-code login.
  const signIn = (email?: string) => {
    startCustomerSignIn(email);
  };

  const logout = async () => {
    update({ isLoading: true, error: null });
    try {
      await logoutCustomer();
      hasInitialized = false;
      update({ customer: null, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      update({ isLoading: false, error: message });
    }
  };

  const refreshCustomer = async () => {
    try {
      const customer = await fetchCustomerMe();
      update({ customer, isLoading: false, error: null });
    } catch (err) {
      update({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to refresh',
      });
    }
  };

  return {
    customer: state.customer,
    isLoading: state.isLoading,
    error: state.error,
    signIn,
    logout,
    refreshCustomer,
  };
}
