# Tasks: Frontend MVP (4 Canonical Pages)

**Input**: Design documents from `/specs/002-build-frontend-mvp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-routes.md, quickstart.md

**Tests**: Use repeatable manual validation scripts plus mandatory lint/typecheck/format checks for touched files.

**Organization**: Tasks are grouped by user story so each route/page can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare page-map scope, styling authority, and route scaffolding inputs.

- [ ] T001 Create canonical route-source map in apps/web/src/lib/route-variant-map.ts
- [ ] T002 Create typed feature flags with default-disabled commerce toggles in apps/web/src/lib/feature-flags.ts
- [ ] T003 [P] Add Artisan Loom token variables and typography foundations in apps/web/src/app/styles.css
- [ ] T004 [P] Add page-level manual validation checklist scaffold in specs/002-build-frontend-mvp/checklists/ui-fidelity.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core app foundations needed before route-specific story work.

**⚠️ CRITICAL**: No user story implementation should begin before this phase is complete.

- [ ] T005 Add `react-router-dom` dependency in apps/web/package.json
- [ ] T006 Add route contract mapping and exports in apps/web/src/types/routes.ts
- [ ] T007 Wire React Router route shell for `/`, `/shop/all`, `/products/:productId`, and `/admin` in apps/web/src/app/App.tsx
- [ ] T008 Create app-level responsive layout shell and shared navigation frame in apps/web/src/components/layout/AppShell.tsx
- [ ] T009 [P] Create typed mock product/collection schemas and parsers in apps/web/src/features/catalog/model/schemas.ts
- [ ] T010 [P] Create typed mock catalog/admin datasets in apps/web/src/features/catalog/data/mock-catalog.ts
- [ ] T011 Add catalog selectors and route-param-safe lookup helpers in apps/web/src/features/catalog/model/selectors.ts
- [ ] T012 Create reusable visual primitives wrappers (hero section, metric card, product tile) in apps/web/src/components/sections/shared/SectionFrame.tsx
- [ ] T050 Add no-backend-dependency guard utility for primary routes in apps/web/src/lib/runtime-guards.ts

**Checkpoint**: Foundation ready; route stories can now be developed independently.

---

## Phase 3: User Story 1 - Landing Page (Priority: P1) 🎯 MVP

**Goal**: Deliver `/` aligned to `luxeweave_landing_mobile_view_2` with responsive fidelity.

**Independent Test**: Load `/` and verify mobile-to-desktop adaptation and design-token compliance.

### Validation for User Story 1

- [ ] T013 [P] [US1] Add landing route fidelity checklist entries in specs/002-build-frontend-mvp/checklists/ui-fidelity.md
- [ ] T014 [P] [US1] Record landing responsive checkpoints and expected outcomes in specs/002-build-frontend-mvp/quickstart.md
- [ ] T015 [P] [US1] Run lint/typecheck/format validation for landing touched files via package scripts in package.json

### Implementation for User Story 1

- [ ] T016 [P] [US1] Create landing hero and CTA section components in apps/web/src/components/sections/landing/LandingHero.tsx
- [ ] T017 [US1] Implement LandingPage route component in apps/web/src/pages/LandingPage.tsx
- [ ] T018 [US1] Connect LandingPage to app routing in apps/web/src/app/App.tsx
- [ ] T019 [US1] Apply Artisan Loom spacing/typography tokens to landing layout in apps/web/src/app/styles.css

**Checkpoint**: Landing page is independently functional and reviewable.

---

## Phase 4: User Story 2 - Collections / Shop All Page (Priority: P1)

**Goal**: Deliver `/shop/all` with mock product listing, interactions, and responsive behavior.

**Independent Test**: Load `/shop/all`, verify product list from mock data, and validate interactions without backend dependency.

### Validation for User Story 2

- [ ] T020 [P] [US2] Add shop-all route fidelity checklist entries in specs/002-build-frontend-mvp/checklists/ui-fidelity.md
- [ ] T021 [P] [US2] Add repeatable interaction script (filter/sort/cart updates) in specs/002-build-frontend-mvp/quickstart.md
- [ ] T022 [P] [US2] Run lint/typecheck/format validation for shop-all touched files via package scripts in package.json

### Implementation for User Story 2

- [ ] T023 [P] [US2] Create shop-all filter bar and collection header components in apps/web/src/components/sections/shop-all/ShopAllFilterBar.tsx
- [ ] T024 [P] [US2] Create responsive product grid and card composition in apps/web/src/features/catalog/components/ProductGrid.tsx
- [ ] T025 [US2] Implement local cart interaction hook with reset-on-reload behavior in apps/web/src/features/catalog/hooks/useCartState.ts
- [ ] T026 [US2] Implement ShopAllPage route component in apps/web/src/pages/ShopAllPage.tsx
- [ ] T027 [US2] Connect ShopAllPage route and mock data selectors in apps/web/src/app/App.tsx
- [ ] T051 [US2] Add explicit mock-mode disclosure UI for catalog/cart flows in apps/web/src/components/sections/shop-all/MockModeNotice.tsx

**Checkpoint**: Shop-all page is independently functional and testable.

---

## Phase 5: User Story 3 - Product Details Page (Priority: P1)

**Goal**: Deliver `/products/:productId` with detail storytelling, gallery, and typed fallback behavior.

**Independent Test**: Open valid and invalid product IDs and verify visual fidelity and fallback states.

### Validation for User Story 3

- [ ] T028 [P] [US3] Add product-details fidelity checklist entries in specs/002-build-frontend-mvp/checklists/ui-fidelity.md
- [ ] T029 [P] [US3] Add valid/invalid product route manual test script in specs/002-build-frontend-mvp/quickstart.md
- [ ] T030 [P] [US3] Run lint/typecheck/format validation for product-details touched files via package scripts in package.json

### Implementation for User Story 3

- [ ] T031 [P] [US3] Create product gallery and detail info modules in apps/web/src/components/sections/product-details/ProductGallery.tsx
- [ ] T032 [US3] Add typed route-param parser and fallback resolver in apps/web/src/features/catalog/model/route-params.ts
- [ ] T033 [US3] Implement ProductDetailsPage route component in apps/web/src/pages/ProductDetailsPage.tsx
- [ ] T034 [US3] Connect ProductDetailsPage route in apps/web/src/app/App.tsx

**Checkpoint**: Product details page is independently functional and testable.

---

## Phase 6: User Story 4 - Admin Panel Page (Priority: P2)

**Goal**: Deliver `/admin` visual panel with mock inventory data and disabled-by-default non-priority actions.

**Independent Test**: Load `/admin`, confirm layout fidelity and feature-flag-controlled actions.

### Validation for User Story 4

- [ ] T035 [P] [US4] Add admin-page fidelity checklist entries in specs/002-build-frontend-mvp/checklists/ui-fidelity.md
- [ ] T036 [P] [US4] Add admin action-flag verification script in specs/002-build-frontend-mvp/quickstart.md
- [ ] T037 [P] [US4] Run lint/typecheck/format validation for admin touched files via package scripts in package.json

### Implementation for User Story 4

- [ ] T038 [P] [US4] Create admin inventory table and status badge modules in apps/web/src/components/sections/admin/AdminInventoryTable.tsx
- [ ] T039 [US4] Implement AdminPage route component in apps/web/src/pages/AdminPage.tsx
- [ ] T040 [US4] Wire feature-flag-gated non-priority actions in apps/web/src/components/sections/admin/AdminActions.tsx
- [ ] T041 [US4] Connect AdminPage route in apps/web/src/app/App.tsx

**Checkpoint**: Admin page is independently functional and testable.

---

## Phase 7: User Story 5 - Maintainable Frontend Architecture (Priority: P3)

**Goal**: Enforce modularity, strict typing, and reusable composition across all 4 routes.

**Independent Test**: Verify no monolithic route files, no `any`, and reusable component boundaries across pages.

### Validation for User Story 5

- [ ] T042 [P] [US5] Add architecture quality checklist (component boundaries/no-any/shadcn usage) in specs/002-build-frontend-mvp/checklists/ui-fidelity.md
- [ ] T043 [P] [US5] Run full repository quality gate (`bun run check`) and record result in specs/002-build-frontend-mvp/quickstart.md
- [ ] T052 [P] [US5] Add component size threshold checks (250-line route pages, 180-line shared components) to specs/002-build-frontend-mvp/checklists/ui-fidelity.md
- [ ] T053 [P] [US5] Add acceptance-scenario coverage matrix and pass-rate log (>=95%) in specs/002-build-frontend-mvp/checklists/ui-fidelity.md

### Implementation for User Story 5

- [ ] T044 [P] [US5] Consolidate shared route UI modules in apps/web/src/components/sections/shared/PageHeader.tsx
- [ ] T045 [US5] Refactor repeated page logic into typed hooks in apps/web/src/features/catalog/hooks/useCatalogViewState.ts
- [ ] T046 [US5] Add route-level source mapping notes for documented deviations in apps/web/src/lib/route-variant-map.ts

**Checkpoint**: Architecture constraints are satisfied across the full page scope.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, docs sync, and full-scope validation.

- [ ] T047 [P] Update final route-to-source mapping notes in specs/002-build-frontend-mvp/contracts/ui-routes.md
- [ ] T048 [P] Run end-to-end manual quickstart verification for all 4 routes in specs/002-build-frontend-mvp/quickstart.md
- [ ] T049 Perform final code cleanup and remove dead scaffolding in apps/web/src/pages/ScaffoldDemo.tsx
- [ ] T054 [P] Verify primary route runtime does not require production API endpoints and record evidence in specs/002-build-frontend-mvp/quickstart.md
- [ ] T055 [P] Verify runtime i18n infrastructure is not introduced in this MVP scope and record evidence in specs/002-build-frontend-mvp/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1; blocks user stories.
- **User Story Phases (3-7)**: Depend on Phase 2; can run in parallel by story after foundational completion.
- **Polish (Phase 8)**: Depends on completion of all selected user stories.

### User Story Dependencies

- **US1 (Landing)**: Depends on Phase 2 only.
- **US2 (Shop All)**: Depends on Phase 2; can proceed in parallel with US1.
- **US3 (Product Details)**: Depends on Phase 2 and benefits from shared catalog selectors from US2 but remains independently testable.
- **US4 (Admin)**: Depends on Phase 2 only.
- **US5 (Architecture)**: Depends on completion of US1-US4 implementations.

### Within Each User Story

- Validation checklist/script tasks should be completed before marking story done.
- Shared component creation should precede page assembly.
- Page route wiring follows page component completion.

### Parallel Opportunities

- `T003`, `T004` in setup can run in parallel.
- `T008`, `T009` in foundational can run in parallel.
- `T016`, `T023`, `T031`, and `T038` section-component tasks can be parallelized across stories.
- Story phases US1/US2/US4 can be developed concurrently once foundational tasks complete.

---

## Parallel Example: Story Execution

```bash
# After foundational completion, parallel story starts:
Task: "Implement LandingPage route component in apps/web/src/pages/LandingPage.tsx"
Task: "Implement ShopAllPage route component in apps/web/src/pages/ShopAllPage.tsx"
Task: "Implement AdminPage route component in apps/web/src/pages/AdminPage.tsx"
```

---

## Implementation Strategy

### MVP First (P1 Stories)

1. Complete Phase 1 and Phase 2 foundations.
2. Implement US1 (Landing), US2 (Shop All), and US3 (Product Details).
3. Validate P1 stories via checklist and quickstart scripts.

### Incremental Delivery

1. Deliver shopper-facing routes (`/`, `/shop/all`, `/products/:productId`).
2. Add admin route (`/admin`) with feature-flag-safe actions.
3. Perform architecture hardening and cross-cutting polish.

### Quality Gates

1. Run `bun run lint` per story slice.
2. Run `bun run typecheck` per story slice.
3. Run `bun run check` before marking feature complete.
