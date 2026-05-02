/**
 * Placeholder useAuth hook.
 *
 * In production this will read/store a real JWT and expose auth state;
 * for the scaffold it is a stub that always returns an unauthenticated state.
 */
export function useAuth() {
  return {
    isAuthenticated: false,
    bearerToken: null as string | null,
  };
}
