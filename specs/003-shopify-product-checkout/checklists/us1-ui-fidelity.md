# US1 UI Fidelity Notes

## Scope

- `/shop/all` listing presentation using live storefront product summary fields.
- `/products/:handle` detail presentation using live storefront detail payload.

## Verification Notes

- Product cards now render `title`, `handle`, image, and live price range minimum.
- Listing card links navigate to detail route using Shopify `handle`.
- Product detail page loads by route handle and renders:
  - title
  - primary variant price
  - image gallery nodes
  - HTML description content
  - variant availability summary
- Empty/not-found states preserve existing visual language and route back to `/shop/all`.

## Follow-up

- Re-verify with production storefront data to tune image fallback and unavailable-label wording if needed.
