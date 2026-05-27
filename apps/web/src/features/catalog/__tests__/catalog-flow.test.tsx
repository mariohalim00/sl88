import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { Link, MemoryRouter } from 'react-router-dom';

describe('Catalog flow integration', () => {
  it('renders product card link from listing to detail handle route', () => {
    const handle = 'woven-mat';

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Link to={`/products/${handle}`}>Woven Mat</Link>
      </MemoryRouter>,
    );

    expect(html).toContain('/products/woven-mat');
    expect(html).toContain('Woven Mat');
  });
});
