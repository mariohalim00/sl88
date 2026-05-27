# Implementation Plan: Shopify Product Purchase Flow

**Branch**: `003-create-feature-branch` | **Date**: 2026-05-27 | **Spec**: [spec.md](specs/003-shopify-product-checkout/spec.md)
**Input**: Feature specification from `/specs/003-shopify-product-checkout/spec.md`

## Summary

Replace mock catalog and product detail data with Shopify Storefront-backed data, implement cart operations via a secure ElysiaJS proxy boundary, and finalize payment through Shopify-hosted checkout redirect (guest checkout allowed). Implementation keeps modules simple and maintainable, using typed contracts, Zod validation at boundaries, and Tailwind-based UI updates in existing React pages/components.

## Technical Context

**Language/Version**: TypeScript 6, Bun runtime  
**Primary Dependencies**: ElysiaJS, React 19, @elysiajs/eden, Zod 4, Tailwind CSS v4, react-router-dom  
**Storage**: N/A for this feature (Shopify-hosted catalog/cart/checkout as system of record)  
**Testing**: `bun run lint`, `bun run typecheck`, `bun run check`, `bun run test:contract`, targeted integration/manual checkout flow verification  
**Target Platform**: Web storefront (mobile-first responsive UI) + Bun-hosted API on Linux/macOS local dev
**Project Type**: Monorepo web application (`apps/api` + `apps/web`)  
**Performance Goals**: Product list and detail responses visible in under 2s p95 on local dev; cart updates reflected in UI in under 500ms p95 under normal network conditions  
**Constraints**: No `any`; no browser exposure of privileged storefront secrets; use Shopify-hosted checkout (no custom payment collection); keep implementation clean/simple with focused modules; Tailwind styling for any new UI work  
**Scale/Scope**: Shopper flows for product listing, product details, cart add/update/remove, checkout redirect, and post-checkout success/cancel handling

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- `PASS`: Strict typing is retained across API proxy, treaty client usage, and React modules; no `any` will be introduced.
- `PASS`: Zod boundary validation is planned for API request params/body, environment inputs for storefront config, and proxied Shopify payload parsing.
- `PASS`: Architecture remains Bun + ElysiaJS backend + React frontend + Eden Treaty typed integration.
- `PASS`: No database schema changes required; Drizzle ownership remains unaffected.
- `PASS`: Frontend delivery will keep modular component composition, Tailwind utility styling, and reuse existing project UI primitives before adding custom abstractions.
- `PASS`: `shopify-storefront-graphql` skill will guide query/mutation contracts and typed boundary design for product/cart operations.
- `PASS`: Validation commands are defined (`bun run lint`, `bun run typecheck`, `bun run check`, `bun run test:contract`) before implementation.

### Post-Phase 1 Re-check

- `PASS`: `research.md` resolves approach choices for proxy boundary, checkout mode, error handling, and maintainability constraints.
- `PASS`: `data-model.md` defines typed entities and state transitions for storefront and checkout flow.
- `PASS`: `contracts/storefront-proxy-api.md` defines frontend-facing API contract and checkout redirect semantics.
- `PASS`: `quickstart.md` defines executable setup, env, and validation workflow for the feature.
- `PASS`: No constitution exceptions required.

## Project Structure

### Documentation (this feature)

```text
specs/003-shopify-product-checkout/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── storefront-proxy-api.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── api/
│   ├── src/
│   │   ├── app/index.ts
│   │   ├── env/index.ts
│   │   ├── routes/
│   │   │   ├── health.ts
│   │   │   ├── scaffold.ts
│   │   │   └── storefront.ts               # new storefront proxy routes
│   │   └── services/
│   │       └── storefront/                 # new Shopify GraphQL client + mappers
│   └── tests/contract/
│       ├── storefront.products.test.ts     # contract tests: product listing/detail
│       ├── storefront.cart.test.ts         # contract tests: cart operations
│       └── storefront.checkout.test.ts     # contract tests: checkout redirect
└── web/
    └── src/
        ├── features/catalog/
        │   ├── api/                        # switch from mock APIs to treaty-backed calls
        │   ├── hooks/                      # modular cart/catalog hooks
        │   ├── components/                 # product + cart UI pieces
        │   └── types/                      # local typed view models
        ├── pages/
        │   ├── ShopAllPage.tsx
        │   ├── ProductDetailsPage.tsx
        │   └── CheckoutResultPage.tsx      # success/cancel handling
        ├── treaty/client.ts
        └── lib/                            # simple URL/state helpers
```

**Structure Decision**: Keep a clean BFF-style split: `apps/api` owns Shopify communication and secret-bearing operations; `apps/web` remains a typed UI client consuming only internal `/api/storefront/*` contracts through Eden Treaty. Validation schemas sit at API boundaries and response mapping points. This avoids leaking Shopify concerns across the frontend while preserving maintainable, focused modules.

## Complexity Tracking

No constitution violations requiring exceptions.
