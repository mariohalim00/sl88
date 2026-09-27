export const CUSTOMER_SESSION_COOKIE = 'sl88_customer_session';

export function hasCustomerSession(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader == null) return false;

  for (const pair of cookieHeader.split(';')) {
    const [name, ...rest] = pair.trim().split('=');
    if (name === CUSTOMER_SESSION_COOKIE) {
      return (decodeURIComponent(rest.join('=')) || '') !== '';
    }
  }
  return false;
}
