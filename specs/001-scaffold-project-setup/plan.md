# Implementation Plan: Scaffold Monorepo Foundation

**Branch**: `001-scaffold-project-setup` | **Date**: 2026-05-02 | **Spec**: [spec.md](specs/001-scaffold-project-setup/spec.md)
**Input**: Feature specification from `/specs/001-scaffold-project-setup/spec.md`

## Summary

Scaffold a Bun-first monorepo for a carpet-commerce platform with `apps/web`, `apps/api`, and `packages/shared`, enabling immediate feature development with strict typing, Zod 4 boundary validation, Elysia + Eden Treaty integration, and Drizzle-managed PostgreSQL migrations. This plan is intentionally limited to scaffolding foundations, local dev flow, and quality gates, excluding full business feature implementation.

## Technical Context

**Language/Version**: TypeScript (strict mode), Bun runtime  
**Primary Dependencies**: ElysiaJS, Eden Treaty, React, Vite, Vite Plus tooling, Rolldown, Zod 4, Drizzle ORM  
**Storage**: PostgreSQL (local Docker-first), Drizzle migrations  
**Testing**: Vitest for unit/integration checks, contract smoke tests for typed API usage  
**Target Platform**: Linux/macOS developer machines for local development  
**Project Type**: Full-stack web monorepo scaffold  
**Performance Goals**: Local dev startup to running web+api in under 2 minutes on a warm environment; scaffold setup to first successful full-stack request under 20 minutes for a new developer  
**Constraints**: No `any`; validate all external boundaries with Zod 4; Bun-native commands only; scaffold scope only (no full auth provider or payments)  
**Scale/Scope**: Initial repository skeleton plus baseline routes, contracts, data schema, and workflow scripts for one team

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate Review

- `PASS`: Strict typing strategy defined across `apps/api`, `apps/web`, and `packages/shared`; no `any` policy enforced by lint/typecheck gates.
- `PASS`: Zod 4 boundary-validation strategy defined for HTTP inputs, env parsing, and shared domain payloads.
- `PASS`: Stack alignment confirmed: Bun runtime, Elysia backend, React frontend, Eden Treaty client integration.
- `PASS`: Drizzle schema and migration ownership defined for PostgreSQL lifecycle.
- `PASS`: Required validation command set identified (`format`, `lint`, `typecheck`, contract/integration smoke checks).

### Post-Phase 1 Re-check

- `PASS`: `contracts/http-api.md` defines scaffold API surface and RFC 9457-style error contract.
- `PASS`: `data-model.md` defines typed entities and migration ownership boundaries.
- `PASS`: `quickstart.md` documents Bun-only setup, run, and validation workflow.
- `PASS`: No constitution violations introduced; `Complexity Tracking` remains empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-scaffold-project-setup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── http-api.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── api/
│   ├── src/
│   │   ├── app/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── db/
│   │   └── env/
│   └── tests/
└── web/
    ├── src/
    │   ├── app/
    │   ├── pages/
    │   ├── features/
    │   ├── lib/
    │   └── treaty/
    └── tests/

packages/
└── shared/
    ├── src/
    │   ├── domain/
    │   ├── schemas/
    │   └── contracts/
    └── tests/

drizzle/
├── schema/
└── migrations/

scripts/
└── dev/
```

**Structure Decision**: Use monorepo structure `apps/web` + `apps/api` + `packages/shared` to keep API ownership server-side while enabling shared Zod domain schemas and reusable types. `apps/api` owns transport contracts and HTTP behavior; `packages/shared` owns domain schemas and cross-layer validation primitives; `drizzle/` owns schema and migration lifecycle.

## Complexity Tracking

No constitution violations requiring justification.
