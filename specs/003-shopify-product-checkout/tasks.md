# Tasks: Shopify Product Purchase Flow

**Input**: Design documents from `/specs/003-shopify-product-checkout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include the narrowest required validation tasks for each story. Formatting, linting, and typecheck tasks are mandatory when code changes are in scope; contract or integration tests are mandatory when API boundaries, shared schemas, checkout flows, catalog behavior, or order workflows change. Frontend stories include design-fidelity checks and typed state decisions.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare storefront feature scaffolding and local developer configuration.

- [X] T001 Add Shopify storefront environment variables to `.env.example`
- [X] T002 Create storefront API config module in `apps/api/src/config/storefront.ts`
- [X] T003 [P] Add feature-local type modules and TanStack state-boundary decision note in `apps/web/src/features/catalog/types/storefront.ts` and `specs/003-shopify-product-checkout/checklists/state-boundary.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the secure proxy and shared contracts required by all stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Implement Shopify env validation and safe accessors in `apps/api/src/env/index.ts`
- [X] T005 [P] Create Shopify Storefront GraphQL client helper in `apps/api/src/services/storefront/client.ts`
- [X] T006 [P] Define shared storefront Zod schemas in `apps/api/src/services/storefront/schemas.ts`
- [X] T007 Implement storefront error mapping to problem+json in `apps/api/src/services/storefront/errors.ts`
- [X] T008 Create storefront route module shell in `apps/api/src/routes/storefront.ts`
- [X] T009 Mount storefront routes in `apps/api/src/app/index.ts`
- [X] T010 [P] Add treaty storefront API surface in `apps/web/src/treaty/client.ts`

**Checkpoint**: Foundation ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Browse Real Catalog (Priority: P1) 🎯 MVP

**Goal**: Replace mock listing/detail data with live storefront product data.

**Independent Test**: Open `/shop/all`, select any product, and verify listing/detail data loads from live storefront responses with safe error fallback.

### Validation for User Story 1

- [X] T011 [P] [US1] Add contract tests for `GET /api/storefront/products` and `GET /api/storefront/products/:handle` in `apps/api/tests/contract/storefront.products.test.ts`
- [X] T012 [P] [US1] Add UI integration test for listing-to-detail shopper journey in `apps/web/src/features/catalog/__tests__/catalog-flow.test.tsx`
- [X] T013 [P] [US1] Run `bun run lint && bun run typecheck` and record US1 validation output in `specs/003-shopify-product-checkout/checklists/us1-validation.md`
- [X] T014 [P] [US1] Record UI fidelity verification notes for `/shop/all` and product detail in `specs/003-shopify-product-checkout/checklists/us1-ui-fidelity.md`

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement product listing query and mapper in `apps/api/src/services/storefront/queries/products.ts`
- [X] T016 [P] [US1] Implement product detail query and mapper in `apps/api/src/services/storefront/queries/product-detail.ts`
- [X] T017 [US1] Implement listing/detail handlers in `apps/api/src/routes/storefront.ts`
- [X] T018 [US1] Replace mock catalog API calls with treaty-backed calls in `apps/web/src/features/catalog/api/catalog.ts`
- [X] T019 [US1] Update catalog loading and error hooks for live data in `apps/web/src/features/catalog/hooks/useCatalog.ts`
- [X] T020 [US1] Update shop listing UI for live storefront fields in `apps/web/src/features/catalog/components/ProductGrid.tsx`
- [X] T021 [US1] Update product detail page for live variant/image data in `apps/web/src/pages/ProductDetailsPage.tsx`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Build Cart (Priority: P2)

**Goal**: Allow shoppers to create and manage cart lines using storefront cart operations.

**Independent Test**: Add an item from product detail, update quantity, remove line, and verify totals and cart state are synchronized.

### Validation for User Story 2

- [ ] T022 [P] [US2] Add contract tests for cart create/add/update/remove endpoints in `apps/api/tests/contract/storefront.cart.test.ts`
- [ ] T023 [P] [US2] Add UI integration test for add/update/remove cart flow in `apps/web/src/features/catalog/__tests__/cart-flow.test.tsx`
- [ ] T024 [P] [US2] Run `bun run lint && bun run typecheck` and record US2 validation output in `specs/003-shopify-product-checkout/checklists/us2-validation.md`

### Implementation for User Story 2

- [ ] T025 [P] [US2] Implement cart create/add/update/remove GraphQL operations in `apps/api/src/services/storefront/mutations/cart.ts`
- [ ] T026 [US2] Implement cart endpoints in `apps/api/src/routes/storefront.ts`
- [ ] T027 [US2] Implement frontend cart API client against proxy endpoints in `apps/web/src/features/catalog/api/cart.ts`
- [ ] T028 [US2] Update cart state hook for server-synchronized lines and totals in `apps/web/src/features/catalog/hooks/useCart.ts`
- [ ] T029 [US2] Update cart summary UI for line updates/removal and loading states in `apps/web/src/features/catalog/components/CartSummary.tsx`
- [ ] T030 [US2] Wire product detail add-to-cart to live cart API in `apps/web/src/pages/ProductDetailsPage.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Complete Checkout and Payment (Priority: P3)

**Goal**: Redirect shoppers to Shopify-hosted checkout and handle return outcomes with guest checkout.

**Independent Test**: From a valid cart, proceed to checkout, redirect to hosted checkout, and verify success/cancel return states without mandatory login.

### Validation for User Story 3

- [ ] T031 [P] [US3] Add contract test for checkout redirect endpoint in `apps/api/tests/contract/storefront.checkout.test.ts`
- [ ] T032 [P] [US3] Add UI integration test for guest checkout redirect and return handling in `apps/web/src/features/catalog/__tests__/checkout-flow.test.tsx`
- [ ] T033 [P] [US3] Run `bun run lint && bun run typecheck` and record US3 validation output in `specs/003-shopify-product-checkout/checklists/us3-validation.md`

### Implementation for User Story 3

- [ ] T034 [P] [US3] Implement checkout URL retrieval operation in `apps/api/src/services/storefront/mutations/checkout.ts`
- [ ] T035 [US3] Implement checkout redirect endpoint in `apps/api/src/routes/storefront.ts`
- [ ] T036 [US3] Add checkout API client helper in `apps/web/src/features/catalog/api/checkout.ts`
- [ ] T037 [US3] Implement checkout redirect action and guest flow handling in `apps/web/src/features/catalog/hooks/useCheckout.ts`
- [ ] T038 [US3] Create checkout result page for success/cancel/failure states in `apps/web/src/pages/CheckoutResultPage.tsx`
- [ ] T039 [US3] Connect cart UI checkout action to hosted redirect flow in `apps/web/src/features/catalog/components/CartSummary.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening across stories.

- [ ] T040 [P] Document storefront env setup and flow behavior in `README.md`
- [ ] T041 Refactor duplicated storefront mapper utilities into `apps/api/src/services/storefront/mappers.ts`
- [ ] T042 [P] Add focused shared unit tests for storefront mapping and schema parsing in `apps/api/tests/contract/storefront.schemas.test.ts`
- [ ] T043 Run full quickstart validation and record outcomes in `specs/003-shopify-product-checkout/quickstart.md`
- [ ] T044 Execute timed end-to-end shopper protocol (minimum 10 runs) and record SC-003 pass/fail metrics in `specs/003-shopify-product-checkout/checklists/sc003-timing.md`
- [ ] T045 Run `bun run check` and capture final quality-gate evidence in `specs/003-shopify-product-checkout/checklists/final-quality-gates.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on completion of desired stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2; no dependency on other stories.
- **User Story 2 (P2)**: Starts after Phase 2; depends functionally on US1 product detail/cart entry points.
- **User Story 3 (P3)**: Starts after Phase 2; depends on US2 cart state and checkout URL access.

### Within Each User Story

- Contract/integration and validation tasks run first or in parallel with implementation setup.
- Backend operation modules before route handlers.
- API client/hook changes before page/component wiring.
- Story is complete only after validation tasks and quality gates pass.

### Parallel Opportunities

- Setup tasks marked `[P]` can run in parallel.
- Foundational client/schema tasks marked `[P]` can run in parallel.
- For each story, contract tests and UI integration tests marked `[P]` can run in parallel.
- Backend query/mutation modules marked `[P]` can run in parallel with checklist/fidelity evidence tasks.

---

## Parallel Example: User Story 1

```bash
# Parallel validation tracks
Task: "T011 [US1] Contract tests in apps/api/tests/contract/storefront.products.test.ts"
Task: "T012 [US1] UI integration test in apps/web/src/features/catalog/__tests__/catalog-flow.test.tsx"

# Parallel backend query implementation
Task: "T015 [US1] Product listing query in apps/api/src/services/storefront/queries/products.ts"
Task: "T016 [US1] Product detail query in apps/api/src/services/storefront/queries/product-detail.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate listing/detail flow and error fallback behavior.
4. Demo live catalog/detail flow.

### Incremental Delivery

1. Ship US1 (live catalog + detail).
2. Add US2 (cart create/update/remove).
3. Add US3 (checkout redirect + return states).
4. Finish with Phase 6 hardening and documentation.

### Parallel Team Strategy

1. Developer A: API storefront operations and routes.
2. Developer B: Web hooks/API client wiring.
3. Developer C: UI integration tests + fidelity documentation.

---

## Notes

- `[P]` tasks indicate no dependency conflicts and can run concurrently.
- `[US1]`, `[US2]`, `[US3]` labels map each task to a specific story.
- Keep implementations simple: small modules, clear naming, minimal abstractions.
- Prefer adapting existing components/hooks before adding new layers.
