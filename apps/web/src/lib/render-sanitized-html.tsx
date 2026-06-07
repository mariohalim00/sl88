import { Fragment, type ReactNode } from 'react';

function toPlainText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function renderNode(node: Node, keyPrefix: string): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();
  const children = Array.from(element.childNodes).map((childNode, index) =>
    renderNode(childNode, `${keyPrefix}-${index}`),
  );

  if (tagName === 'br') {
    return <br key={keyPrefix} />;
  }

  if (tagName === 'p') {
    return <p key={keyPrefix}>{children}</p>;
  }

  if (tagName === 'strong') {
    return <strong key={keyPrefix}>{children}</strong>;
  }

  if (tagName === 'em') {
    return <em key={keyPrefix}>{children}</em>;
  }

  if (tagName === 'ul') {
    return <ul key={keyPrefix}>{children}</ul>;
  }

  if (tagName === 'ol') {
    return <ol key={keyPrefix}>{children}</ol>;
  }

  if (tagName === 'li') {
    return <li key={keyPrefix}>{children}</li>;
  }

  if (tagName === 'a') {
    const href = element.getAttribute('href') ?? '#';

    return (
      <a key={keyPrefix} href={href} rel="noreferrer noopener" target="_blank">
        {children}
      </a>
    );
  }

  return <Fragment key={keyPrefix}>{children}</Fragment>;
}

export function renderSanitizedHtml(html: string): ReactNode {
  if (html.trim().length === 0) {
    return null;
  }

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return toPlainText(html);
  }

  const document = new DOMParser().parseFromString(html, 'text/html');

  return Array.from(document.body.childNodes).map((node, index) =>
    renderNode(node, `node-${index}`),
  );
}
