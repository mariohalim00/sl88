# Research: Shopify Product Purchase Flow

## Decision 1: Integration Boundary

- Decision: Use ElysiaJS as an application-mediated proxy for all Shopify Storefront GraphQL product and cart operations.
- Rationale: Keeps storefront secrets and privileged request shaping off the browser, centralizes policy/error mapping, and aligns with clean architecture and maintainability goals.
- Alternatives considered:
  - Direct browser calls to Shopify Storefront API: rejected due to credential exposure risk and fragmented error handling.
  - Hybrid direct/proxy split: rejected to avoid complexity and inconsistent observability.

## Decision 2: Payment Completion Mode

- Decision: Use Shopify-hosted checkout redirect for payment completion.
- Rationale: Avoids PCI-heavy custom card handling, is realistic for current team constraints, and still satisfies full checkout-and-pay outcome.
- Alternatives considered:
  - Custom in-app payment form: rejected because PCI-DSS and payment-risk burden is out of scope.
  - Support both hosted and custom flows now: rejected as unnecessary complexity for MVP.

## Decision 3: Checkout Authentication

- Decision: Allow guest checkout with no mandatory in-app authentication gate.
- Rationale: Reduces friction and delivery scope while matching clarified requirements.
- Alternatives considered:
  - Require login before checkout: rejected as extra auth scope not needed for MVP.
  - Dual mode guest/login with account linking now: rejected as future enhancement.

## Decision 4: GraphQL Contract Strategy

- Decision: Follow `shopify-storefront-graphql` skill and define explicit typed operation modules for product listing, product detail, cart create/update/remove, and checkout URL retrieval.
- Rationale: Maintains end-to-end type safety and keeps operation scope explicit and testable.
- Alternatives considered:
  - Single generic GraphQL passthrough endpoint: rejected because it weakens contract clarity and validation.

## Decision 5: Validation and Error Policy

- Decision: Validate inbound API params and mapped Shopify payloads using Zod at boundary points, then return shopper-safe RFC 9457-style errors.
- Rationale: Constitution compliance plus predictable frontend behavior under failures.
- Alternatives considered:
  - Trust Shopify payloads without mapping validation: rejected as brittle.
  - Propagate raw upstream errors directly: rejected due to poor UX and leaked implementation details.

## Decision 6: Frontend State and UI Simplicity

- Decision: Keep cart/catalog state in focused hooks and lightweight local state; add TanStack only where asynchronous server-state complexity requires it.
- Rationale: Keeps implementation clean and readable while honoring architecture constraints.
- Alternatives considered:
  - Introduce broad state tooling immediately: rejected as overengineering.

## Decision 7: Styling Approach

- Decision: Use existing Tailwind-first patterns and current component composition style for all new UI changes.
- Rationale: Matches repository conventions and user request for maintainable, simple code.
- Alternatives considered:
  - Add a parallel styling layer: rejected due to unnecessary complexity.
