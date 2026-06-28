const BLOCKED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'template',
]);

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'a',
]);
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeHref(href: string | null) {
  if (href == null || href.trim().length === 0) {
    return null;
  }

  if (href.startsWith('/') || href.startsWith('#')) {
    return href;
  }

  try {
    const url = new URL(href, window.location.origin);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function sanitizeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml(node.textContent ?? '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();

  if (BLOCKED_TAGS.has(tagName)) {
    return '';
  }

  const children = Array.from(element.childNodes)
    .map((childNode) => sanitizeNode(childNode))
    .join('');

  if (!ALLOWED_TAGS.has(tagName)) {
    return children;
  }

  if (tagName === 'br') {
    return '<br />';
  }

  if (tagName === 'a') {
    const href = sanitizeHref(element.getAttribute('href'));
    if (href == null) {
      return children;
    }

    return `<a href="${escapeHtml(href)}" rel="noreferrer noopener" target="_blank">${children}</a>`;
  }

  return `<${tagName}>${children}</${tagName}>`;
}

export function sanitizeHtml(html: string): string {
  if (html.trim().length === 0) {
    return '';
  }

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    const text = stripHtml(html);
    return text.length > 0 ? `<p>${escapeHtml(text)}</p>` : '';
  }

  const document = new DOMParser().parseFromString(html, 'text/html');

  return Array.from(document.body.childNodes)
    .map((node) => sanitizeNode(node))
    .join('');
}
