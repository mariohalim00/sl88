# Research: Frontend MVP (4 Canonical Pages)

## Decision 1: Canonical Route Mapping

- Decision: Implement exactly four canonical routes: `/`, `/shop/all`, `/products/:productId`, `/admin`.
- Rationale: This is the final clarified scope and keeps delivery focused while still covering shopper and admin experiences.
- Alternatives considered:
  - Implement all stitch directories as separate routes: rejected because duplicate variants (`_1`, `_2`) add route noise without MVP value.
  - Implement only shopper routes: rejected because admin page is explicitly in scope.

## Decision 2: Source Variant Selection

- Decision: Use only `*_mobile_view_2` references as source variants for the four canonical routes.
- Rationale: The specification explicitly fixed these variants as the visual baseline.
- Alternatives considered:
  - Mix `_1` and `_2` variants: rejected to avoid visual inconsistency and subjective selection churn.

## Decision 3: Responsive Strategy

- Decision: Implement mobile-first layouts and scale to tablet/desktop with progressive breakpoints.
- Rationale: Source references are mobile; desktop must preserve intent while improving readability and spacing.
- Alternatives considered:
  - Desktop-first reinterpretation: rejected because it drifts from source fidelity.
  - Pixel-perfect static mobile layout on desktop: rejected due to poor usability.

## Decision 4: Visual System Authority

- Decision: Use `stitch_universal_carpet_gallery/artisan_loom/DESIGN.md` as the design-token authority for palette, typography, spacing, and shape language.
- Rationale: The user explicitly requested this as the nitty-gritty design source.
- Alternatives considered:
  - Existing app defaults only: rejected because it fails design-fidelity requirements.

## Decision 5: State Management Boundary

- Decision: Use simple local React state for MVP interactions and reserve TanStack patterns for future advanced server-state complexity.
- Rationale: Current scope is mock-only, non-persistent, and route-local.
- Alternatives considered:
  - Introduce TanStack immediately: rejected as unnecessary complexity for current scope.

## Decision 6: Feature Flags for Non-Priority Flows

- Decision: Add typed frontend feature flags for checkout/payment entry points, default disabled.
- Rationale: This matches clarified constraints while keeping UI scaffolding evolvable.
- Alternatives considered:
  - Omit flags and hard-delete UI affordances: rejected due to poor forward compatibility.

## Decision 7: Mock Data Boundary Validation

- Decision: Use Zod schemas to validate mock datasets and guard route-param parsing for product details fallback behavior.
- Rationale: Constitution requires schema-validated boundaries even without backend calls.
- Alternatives considered:
  - Unvalidated static objects: rejected as brittle and non-compliant.
