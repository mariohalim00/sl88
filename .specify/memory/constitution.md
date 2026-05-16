<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- V. Enforced Quality Gates -> V. Enforced Quality Gates and Frontend Delivery Discipline
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- ✅ updated /home/mariolin/Documents/personal/sl88/.specify/templates/plan-template.md
- ✅ updated /home/mariolin/Documents/personal/sl88/.specify/templates/spec-template.md
- ✅ updated /home/mariolin/Documents/personal/sl88/.specify/templates/tasks-template.md
- ⚠ pending /home/mariolin/Documents/personal/sl88/.specify/templates/commands/*.md (directory not present)
Follow-up TODOs:
- None
-->

# SL88 Constitution

## Core Principles

### I. End-to-End Type Safety

All production code MUST compile under strict typing rules, and the codebase MUST not introduce `any` in application, shared, test, or tooling code without an explicit constitution amendment. Types shared across backend, frontend, and integration surfaces MUST be derived from authoritative sources instead of duplicated by hand. The system MUST preserve typed request and response contracts across the ElysiaJS backend, Eden Treaty client usage, and React frontend.

Rationale: This project is explicitly scoped as a strictly typed full-stack commerce system, so type drift is treated as a product risk rather than a style issue.

### II. Schema-Validated Boundaries

Every untrusted boundary MUST be validated with Zod 4 before domain logic runs. This includes HTTP inputs, environment configuration, persisted payload reconstruction, and any cross-layer data crossing between browser, server, and database workflows. Validation schemas MUST drive typed parsing and error handling, and invalid data MUST fail fast with explicit user-safe or operator-safe responses.

Rationale: Typed code without runtime validation still permits invalid production data; schema-first boundaries keep contracts enforceable under real traffic.

### III. Bun-Native Full-Stack Architecture

The runtime baseline for this project MUST be Bun. Backend services MUST use ElysiaJS, frontend delivery MUST use React with Vite and Rolldown-based tooling, and full-stack local development MUST follow the Bun-compatible Elysia full-stack pattern adopted for this repository. Cross-layer API consumption MUST prefer Eden Treaty so transport contracts remain aligned with server definitions.

Rationale: The selected stack is a project constraint, not an implementation preference, because the developer experience and contract-sharing model depend on it.

### IV. Drizzle-Managed Data Model

Persistent data structures MUST be defined and evolved through Drizzle-managed schema artifacts and migrations. Database changes MUST be reviewable, reversible where practical, and traceable to a documented feature or defect. Application queries MUST flow through typed schema definitions instead of raw, untyped access patterns.

Rationale: A commerce system depends on durable product and order data, so schema governance and migration discipline are required from the start.

### V. Enforced Quality Gates and Frontend Delivery Discipline

Every change MUST pass formatting, linting, and typechecking through the repository-standard Vite Plus toolchain before merge. Features MUST be delivered as independently testable slices, and plans/tasks MUST define the narrowest executable validation for each slice. Contract, integration, or workflow tests MUST be added whenever a change affects API boundaries, shared schemas, checkout flows, catalog behavior, or order-management behavior.

Frontend implementation MUST follow maintainable React composition practices: avoid monolithic TSX files, extract reusable UI and domain logic into focused components/modules, preserve strict typing with no `any`, and prefer TanStack-based solutions for advanced state management instead of Redux. UI work MUST prefer shadcn-based components when the required primitive exists, and design implementations MUST remain faithful to approved specifications unless a documented constraint requires deviation.

Rationale: Fast iteration is only sustainable when quality gates and frontend architecture discipline prevent type drift, state complexity regressions, and unmaintainable UI sprawl.

## Technical Standards

- The canonical stack is Bun, ElysiaJS, React, Vite, Vite Plus, Rolldown, Zod 4, Eden Treaty, and Drizzle.
- Advanced client-side state management MUST use the TanStack ecosystem; Redux-based state management is non-compliant unless explicitly approved by amendment.
- Frontend UI primitives MUST prefer shadcn components before introducing custom replacements for equivalent behavior.
- Specifications MUST stay implementation-agnostic except where repository governance requires naming fixed stack constraints; concrete tool selections belong in plans and tasks.
- Shared contracts, schema definitions, and validation logic SHOULD be organized so backend and frontend consume the same authoritative shapes.
- New dependencies MUST be justified in the implementation plan when existing stack primitives already solve the problem.
- Node-only runtime assumptions, duplicate client/server contract definitions, and raw unvalidated boundary access are non-compliant unless an amendment explicitly permits them.

## Delivery Workflow

- Each feature MUST start with a specification that defines independently testable user stories and measurable outcomes.
- Each implementation plan MUST include a Constitution Check that confirms strict typing, Zod boundary coverage, Bun-native stack alignment, Drizzle schema ownership, and required validation commands.
- Frontend plans and tasks MUST explicitly describe component decomposition strategy, shadcn reuse decisions, and TanStack state boundaries for non-trivial client state.
- Each task list MUST include work for schema changes, typed API surfaces, frontend/backend integration, and quality-gate execution whenever those concerns are affected by the feature.
- Code review and self-review MUST verify constitutional compliance before merge, including explicit confirmation that no `any` was introduced and that validation exists at changed boundaries.
- Code review for UI features MUST verify design-fidelity outcomes against the approved specification and record any intentional deviations with rationale.
- When a change cannot satisfy a principle, the deviation MUST be documented in the plan's Complexity Tracking section and approved as a constitution exception before implementation proceeds.

## Governance

This constitution supersedes conflicting local practice for this repository. Amendments require updating this document, recording the version impact in the Sync Impact Report, and synchronizing affected templates in the same change whenever possible. Versioning follows semantic rules: MAJOR for incompatible governance changes or principle removal, MINOR for new principles or materially expanded obligations, and PATCH for clarifications that do not alter required behavior. Compliance reviews occur during planning, task generation, implementation validation, and code review. Every pull request or equivalent review artifact MUST verify that constitutional gates were satisfied or that an approved exception was documented before merge.

**Version**: 1.1.0 | **Ratified**: 2026-05-02 | **Last Amended**: 2026-05-15
