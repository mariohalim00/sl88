---
description: "Task list for Scaffold Monorepo Foundation"
---

# Tasks: Scaffold Monorepo Foundation

**Input**: Design documents from `/specs/001-scaffold-project-setup/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/http-api.md ✅ quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story this task belongs to (US1, US2, US3)
- Exact file paths included in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo root initialization — configs, workspace definition, tooling baseline. No user story label; all stories depend on this.

- [ ] T001 Create root `package.json` with Bun workspace globs (`apps/*`, `packages/*`) in `package.json`
- [ ] T002 Create root `tsconfig.base.json` with `strict: true`, no-`any` enforcement, and path aliases in `tsconfig.base.json`
- [ ] T003 [P] Install and configure Vite Plus (`vite-plus`) at root — Vite Plus bundles oxlint (linting) and oxcfmt (formatting) as a single package; add `viteplus.config.ts` and wire `format` and `lint` scripts in root `package.json`
- [ ] T004 [P] Create root `.env.example` and document required env variables in `.env.example`
- [ ] T005 [P] Create `.gitignore` covering `node_modules`, `dist`, `.env`, `.env.local` — migration SQL files in `drizzle/migrations/` MUST be committed (they are version-controlled migration history) in `.gitignore`

**Checkpoint**: Root workspace installs cleanly with `bun install` from repo root.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared package, Drizzle schema, env validation, and error-contract foundations. MUST complete before any user story begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Create `packages/shared/package.json`, `packages/shared/tsconfig.json` extending `tsconfig.base.json` in `packages/shared/`
- [ ] T007 [P] Create `packages/shared/src/schemas/` directory and export barrel in `packages/shared/src/schemas/index.ts`
- [ ] T008 [P] Create RFC 9457 Problem Details Zod schema in `packages/shared/src/schemas/problem-detail.ts`
- [ ] T009 Create initial Drizzle schema baseline (empty `pgSchema` placeholder) in `drizzle/schema/index.ts`
- [ ] T010 Create `drizzle.config.ts` pointing to `drizzle/schema/index.ts`, outputting to `drizzle/migrations/`, using `pg` driver in `drizzle.config.ts`
- [ ] T011 [P] Create Zod-validated env schema for `apps/api` (DATABASE_URL, API_PORT) in `apps/api/src/env/index.ts`
- [ ] T011b [P] Create `docker-compose.yml` with a `postgres` service (image `postgres:16-alpine`), port binding matching `DATABASE_URL` default in `.env.example`, volume mount for data persistence, and a `pg_isready` health check in `docker-compose.yml`
- [ ] T012 [P] Create `scripts/dev/` directory with a `README.md` describing dev workflow conventions in `scripts/dev/README.md`
- [ ] T013 Add root-level `bun run` scripts: `dev`, `build`, `format`, `lint`, `typecheck`, `db:generate`, `db:migrate`, `test:contract` in root `package.json`

**Checkpoint**: Foundation ready — `bun install && bun run typecheck` passes; `docker compose up -d` starts Postgres; `bun run db:generate` generates initial migration artifact.

---

## Phase 3: User Story 1 — Generate Baseline Workspace Scaffold (Priority: P1) 🎯 MVP

**Goal**: All monorepo folders, configurations, startup commands, and base route handler exist and are structurally correct.

**Independent Test**: Run `bun install` then inspect that all required paths exist and `bun run typecheck` passes with no `any` errors.

### Validation for User Story 1

- [ ] T014 [P] [US1] Verify `apps/api`, `apps/web`, `packages/shared`, `drizzle/` all exist with correct `package.json` and `tsconfig.json` in their respective paths
- [ ] T015 [P] [US1] Run `bun run lint`, `bun run format`, `bun run typecheck` on all US1-touched files in `apps/api/`, `apps/web/`, `packages/shared/`

### Implementation for User Story 1

- [ ] T016 [US1] Create `apps/api/package.json` with `elysia`, `@elysiajs/eden`, `drizzle-orm`, `zod` dependencies in `apps/api/package.json`
- [ ] T017 [P] [US1] Create `apps/api/tsconfig.json` extending `../../tsconfig.base.json` in `apps/api/tsconfig.json`
- [ ] T018 [P] [US1] Create `apps/web/package.json` with `react`, `react-dom`, `@elysiajs/eden`, `vite`, `@vitejs/plugin-react`, `zod` dependencies in `apps/web/package.json`
- [ ] T019 [P] [US1] Create `apps/web/tsconfig.json` extending `../../tsconfig.base.json` in `apps/web/tsconfig.json`
- [ ] T020 [P] [US1] Create Vite config with Rolldown and React plugin in `apps/web/vite.config.ts`
- [ ] T021 [US1] Create base Elysia app instance with CORS and error plugin wired in `apps/api/src/app/index.ts` (depends on T016)
- [ ] T022 [US1] Create RFC 9457 error handler middleware returning `application/problem+json` in `apps/api/src/middleware/error.ts`
- [ ] T023 [US1] Implement `GET /api/health` route per contract in `apps/api/src/routes/health.ts`
- [ ] T024 [US1] Register health route on base Elysia app and export typed `App` type in `apps/api/src/app/index.ts` (depends on T021, T023)
- [ ] T025 [P] [US1] Create `apps/web/src/app/main.tsx` React entry point and `apps/web/index.html`

**Checkpoint**: `bun run typecheck` passes; folder structure matches plan.md source tree; `bun run lint` and `bun run format` succeed on all generated files.

---

## Phase 4: User Story 2 — Run Full-Stack Local Development Flow (Priority: P2)

**Goal**: One `bun run dev` command starts both web and api; Eden Treaty call from frontend to `/api/scaffold/ping` succeeds with typed response.

**Independent Test**: Launch `bun run dev`, open web in browser, confirm ping response arrives with correct shape and no runtime type errors.

### Validation for User Story 2

- [ ] T026 [P] [US2] Contract smoke: `GET /api/scaffold/ping?name=dev` returns `{ message: "pong", echo: { name: "dev" } }` with status 200 in `apps/api/tests/contract/scaffold.test.ts`
- [ ] T027 [P] [US2] Run `bun run typecheck` on `apps/web/src/treaty/` and `apps/api/src/routes/scaffold.ts`

### Implementation for User Story 2

- [ ] T028 [US2] Implement `GET /api/scaffold/ping` route with Zod query validation (`name?: string, max 60`) per contract in `apps/api/src/routes/scaffold.ts` (depends on T024)
- [ ] T029 [US2] Register scaffold route on Elysia app and re-export updated `App` type in `apps/api/src/app/index.ts` (depends on T028)
- [ ] T030 [US2] Set up Eden Treaty client typed from `App` in `apps/web/src/treaty/client.ts` (depends on T029)
- [ ] T031 [US2] Create `apps/web/src/pages/ScaffoldDemo.tsx` that calls `/api/scaffold/ping` via Eden Treaty and renders response (depends on T030)
- [ ] T032 [US2] Implement Elysia fullstack dev server pattern (serve web static in dev from api, single port) per https://elysiajs.com/patterns/fullstack-dev-server.html in `apps/api/src/app/index.ts` (depends on T029)
- [ ] T033 [US2] Wire root `bun run dev` script to start the fullstack dev server via `apps/api/src/app/index.ts` in root `package.json` (depends on T032)

**Checkpoint**: `bun run dev` starts without error; `curl http://localhost:$API_PORT/api/scaffold/ping?name=dev` returns correct JSON; Eden Treaty call in browser completes successfully.

---

## Phase 5: User Story 3 — Enforce Quality and Data Foundations (Priority: P3)

**Goal**: All quality-gate commands pass; Drizzle migration baseline executes; auth-ready guard rejects unauthorized requests with RFC 9457 error; invalid input at boundary is rejected.

**Independent Test**: `bun run format && bun run lint && bun run typecheck && bun run db:migrate && bun run test:contract` all exit 0 on a fresh clone.

### Validation for User Story 3

- [ ] T034 [P] [US3] Contract smoke: `GET /api/scaffold/protected` without auth header returns 401 `application/problem+json` per RFC 9457 in `apps/api/tests/contract/protected.test.ts`
- [ ] T035 [P] [US3] Contract smoke: `GET /api/health` returns 200 `{ status: "ok" }` in `apps/api/tests/contract/health.test.ts`
- [ ] T036 [US3] Run `bun run db:generate && bun run db:migrate` and confirm migration table created in local Docker Postgres

### Implementation for User Story 3

- [ ] T037 [P] [US3] Create auth-ready guard middleware (placeholder bearer-token check, returns RFC 9457 401 on missing/invalid header) in `apps/api/src/middleware/auth.ts`
- [ ] T038 [US3] Implement `GET /api/scaffold/protected` route using auth guard per contract in `apps/api/src/routes/scaffold.ts` (depends on T037)
- [ ] T039 [US3] Register protected route on Elysia app in `apps/api/src/app/index.ts` (depends on T038)
- [ ] T040 [P] [US3] Create React auth-ready hook stub (`useAuth`) in `apps/web/src/lib/auth.ts` for future provider wiring
- [ ] T041 [US3] Add `test:contract` script running Vitest on `apps/api/tests/contract/` in root `package.json` (depends on T034, T035)
- [ ] T042 [US3] Validate full quality-gate sequence: `bun run format && bun run lint && bun run typecheck && bun run test:contract` all exit 0

**Checkpoint**: All user stories independently functional; `bun run test:contract` passes; auth guard returns RFC 9457 401; migration artifact committed to `drizzle/migrations/`.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, final validation, and no-`any` audit.

- [ ] T043 [P] Write `README.md` documenting scaffold structure, prerequisite setup, workspace commands, and quickstart.md reference in `README.md`
- [ ] T044 Perform strict no-`any` audit: confirm `bun run typecheck` emits zero `any`-related errors across `apps/`, `packages/`, and `drizzle/`
- [ ] T045 Run quickstart.md end-to-end validation: `bun install` → env setup → `db:generate` → `db:migrate` → `bun run dev` → quality gates all pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup** → No dependencies; start immediately
- **Phase 2 Foundational** → Depends on Phase 1 completion; **BLOCKS all user stories**
- **Phase 3 US1** → Depends on Phase 2
- **Phase 4 US2** → Depends on Phase 3 (uses `App` type from T024/T029)
- **Phase 5 US3** → Depends on Phase 4 (extends scaffold routes and app)
- **Phase 6 Polish** → Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2. No dependency on US2 or US3.
- **US2 (P2)**: Depends on US1 (requires typed `App` from T024). Independently testable once T033 completes.
- **US3 (P3)**: Depends on US2 routes being registered (T039 uses T029). Independently testable once T042 completes.

### Within Each Story

- Package and config files (tsconfig, package.json) before implementation source files
- Shared/foundational files before consuming files
- Route implementation before route registration
- Route registration before Eden Treaty client typing
- Middleware before guarded routes
- Quality gate validation as final task in each story

---

## Parallel Opportunities

### Phase 1 — Run together

```bash
# T003, T004, T005 can run in parallel:
Task: "Configure Vite Plus format/lint tools at root"
Task: "Create root .env.example"
Task: "Create .gitignore"
```

### Phase 2 — Run together after T006

```bash
# T007, T008, T011, T012 can run in parallel after T006:
Task: "Create packages/shared/src/schemas/ barrel"
Task: "Create RFC 9457 Problem Details Zod schema"
Task: "Create apps/api Zod env schema"
Task: "Create scripts/dev/ README"
```

### Phase 3 US1 — Run together in two batches

```bash
# Batch A — parallel after T006, T013:
Task: "Create apps/api/package.json"          # T016
Task: "Create apps/api/tsconfig.json"         # T017
Task: "Create apps/web/package.json"          # T018
Task: "Create apps/web/tsconfig.json"         # T019
Task: "Create apps/web Vite config"           # T020
Task: "Create apps/web main.tsx entry"        # T025

# Batch B — after T016 (Elysia installed):
Task: "Create base Elysia app"                # T021
Task: "Create RFC 9457 error middleware"      # T022
Task: "Implement GET /api/health"             # T023
```

### Phase 5 US3 — Run together in parallel batches

```bash
# T034, T035, T037, T040 are independent and can all start together
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `bun install && bun run typecheck` passes; folder structure complete
5. Demo scaffold to client

### Incremental Delivery

1. Phase 1 + Phase 2 → Shared foundation ready
2. Phase 3 → US1 complete → Scaffold structure validated
3. Phase 4 → US2 complete → Full dev loop functional, Eden Treaty typed call works
4. Phase 5 → US3 complete → Quality gates, auth seam, DB migrations all validated
5. Phase 6 → Polish and documentation complete

---

## Summary

| Metric | Value |
|---|---|
| Total tasks | 46 |
| Phase 1 Setup | 5 tasks |
| Phase 2 Foundational | 9 tasks (incl. T011b docker-compose) |
| Phase 3 US1 (P1 — MVP) | 12 tasks |
| Phase 4 US2 (P2) | 8 tasks |
| Phase 5 US3 (P3) | 9 tasks |
| Phase 6 Polish | 3 tasks |
| Parallelizable tasks [P] | 24 tasks |
| Format: all checklist | ✅ |

**Suggested MVP scope**: Complete through Phase 3 (US1) for a validated scaffold baseline.
