# Research: Scaffold Monorepo Foundation

## Decision 1: Monorepo layout with `apps/web`, `apps/api`, `packages/shared`

- Decision: Adopt monorepo package layout exactly as clarified by the user.
- Rationale: Enables clear bounded ownership (web, api, shared), supports Eden Treaty typing flow, and keeps scaffolding small while avoiding cross-repo coordination overhead.
- Alternatives considered:
  - Dual top-level `frontend/backend` without package workspace: rejected due to weaker reuse boundaries.
  - Single mixed app folder: rejected due to ownership ambiguity and harder scaling.

## Decision 2: Postgres-first local foundation via Docker

- Decision: Scaffold with PostgreSQL as local default and Docker-friendly configuration.
- Rationale: User already has local Docker DB, and Drizzle migration flow is more representative for commerce workloads than temporary local-only stores.
- Alternatives considered:
  - SQLite-first: rejected because it diverges from production-like query/path assumptions.
  - Optional DB backends at scaffold stage: rejected to avoid unnecessary complexity.

## Decision 3: Hybrid contract model (server-authoritative API + shared domain schemas)

- Decision: Keep API contract authoritative at `apps/api`, and keep domain Zod schemas in `packages/shared` for reuse.
- Rationale: Matches Elysia + Eden Treaty strengths while avoiding duplication between transport and domain layers.
- Alternatives considered:
  - Server-only contracts: rejected due to weaker reusable domain modeling.
  - Shared-only contracts: rejected due to potential drift from actual route behavior.

## Decision 4: API error standard for scaffold endpoints

- Decision: Yes, adopt RFC 9457 Problem Details format for non-2xx API responses from the scaffold onward.
- Rationale: Standardized error envelopes reduce ad-hoc client parsing and provide a stable baseline before business features grow. It also aligns with schema-first validation and typed frontend handling.
- Alternatives considered:
  - Custom `{ error: string }` envelopes: rejected because they are inconsistent and hard to evolve.
  - Delay error standardization until later: rejected because retrofit cost rises once consumers are implemented.

## Decision 5: Auth scope limited to auth-ready seams

- Decision: Scaffold route-guard and authorization middleware interfaces only; do not build login UI or provider integration.
- Rationale: Preserves scaffold-only scope while preparing secure extension points.
- Alternatives considered:
  - Local username/password implementation: rejected as out of current scope.
  - OAuth integration now: rejected as out of current scope.

## Decision 6: Quality gate baseline

- Decision: Require scaffold commands for format, lint, typecheck, migration check, and API contract smoke validation.
- Rationale: Constitution requires no-`any`, strict typing, and validation at boundaries.
- Alternatives considered:
  - Lint and typecheck only: rejected because it misses migration and API-contract regressions.
