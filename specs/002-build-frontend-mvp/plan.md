# Implementation Plan: Frontend MVP (4 Canonical Pages)

**Branch**: `002-build-frontend-mvp` | **Date**: 2026-05-16 | **Spec**: [spec.md](specs/002-build-frontend-mvp/spec.md)
**Input**: Feature specification from `/specs/002-build-frontend-mvp/spec.md`

## Summary

Implement a frontend-only MVP with four canonical routes (`/`, `/shop/all`, `/products/:productId`, `/admin`) using mock data, responsive behavior from mobile-first source references, and Artisan Loom design tokens as the visual source of truth. Architecture remains strictly typed with modular React composition, shadcn-first UI primitives, and feature-flagged non-priority commerce actions.

## Technical Context

**Language/Version**: TypeScript 6, React 19, Bun runtime  
**Primary Dependencies**: React, react-router-dom, Vite Plus, shadcn/base-ui stack, Tailwind CSS v4, Zod 4  
**Storage**: N/A (mock in-memory client state only for this MVP)  
**Testing**: Repository quality gates (`bun run check`, `bun run lint`, `bun run typecheck`) plus manual route fidelity checks against stitch references  
**Target Platform**: Web browsers (mobile first, responsive tablet and desktop)  
**Project Type**: Frontend web application in monorepo (`apps/web`)  
**Performance Goals**: Initial route render under 2s on local dev hardware; responsive layout transitions without visible breakage between mobile/tablet/desktop breakpoints  
**Constraints**: No `any`; no production backend/database dependency; checkout/payment actions behind disabled-by-default feature flags; use Artisan Loom `DESIGN.md` tokens and style direction  
**Scale/Scope**: 4 canonical routes, shared UI primitives/layout system, typed mock product/admin data, and route-source mapping metadata

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- `PASS`: Strict typing strategy documented for all new frontend modules; no `any` allowed in app/tests/tooling touched by this feature.
- `PASS`: Zod validation planned for mock data boundaries and optional route-param parsing (product ID handling).
- `PASS`: Architecture remains Bun + React + Vite Plus; no backend runtime dependency required for primary user flows.
- `PASS`: Drizzle and database layers are unaffected in this frontend-only scope; no schema ownership violations introduced.
- `PASS`: Frontend design direction includes modular component decomposition, shadcn-first primitives, and explicit TanStack boundary (not required unless complexity increases).
- `PASS`: Validation commands are defined (`bun run lint`, `bun run typecheck`, `bun run check`) before implementation.

### Post-Phase 1 Re-check

- `PASS`: `research.md` documents route mapping, responsive strategy, design token application, and flagging policy decisions.
- `PASS`: `data-model.md` defines typed entities for mock product/cart/admin/flags and canonical route-source mapping.
- `PASS`: `contracts/ui-routes.md` defines user-visible route contract and feature-flag gating behavior.
- `PASS`: `quickstart.md` defines executable setup/validation steps for development and fidelity checks.
- `PASS`: No constitution exceptions required.

## Project Structure

### Documentation (this feature)

```text
specs/002-build-frontend-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-routes.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── web/
│   ├── src/
│   │   ├── app/                # app shell, global styles, bootstrap
│   │   ├── components/         # shared shadcn-based UI + composed blocks
│   │   ├── features/
│   │   │   └── catalog/        # mock data, hooks, feature components
│   │   ├── pages/              # route-level page components (4 canonical routes)
│   │   ├── lib/                # utils, feature flags, route-source mapping
│   │   └── types/              # shared frontend-only type declarations
│   └── package.json
├── api/                        # unchanged in this feature
└── shared/                     # unchanged in this feature

specs/002-build-frontend-mvp/stitch_universal_carpet_gallery/
└── artisan_loom/DESIGN.md      # visual source of truth
```

**Structure Decision**: Keep implementation concentrated in `apps/web` with route-level pages backed by reusable feature/components modules. Route contracts and mapping docs live under `specs/002-build-frontend-mvp/contracts`. This preserves constitutional compliance by keeping typed boundaries explicit, avoiding monolithic page files, and avoiding unnecessary new dependencies.

## Complexity Tracking

No constitution violations requiring exceptions.
