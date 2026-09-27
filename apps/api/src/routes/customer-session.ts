export const CUSTOMER_SESSION_COOKIE = 'sl88_customer_session';

export function parseSessionId(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader == null) return null;

  for (const pair of cookieHeader.split(';')) {
    const [name, ...rest] = pair.trim().split('=');
    if (name === CUSTOMER_SESSION_COOKIE) {
      const value = decodeURIComponent(rest.join('='));
      return value || null;
    }
  }
  return null;
}
