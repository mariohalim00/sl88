# Data Model: Scaffold Monorepo Foundation

## Overview

This model captures scaffold-time entities needed to bootstrap a commerce-ready codebase, not full business domain coverage.

## Entities

### ScaffoldProject

- Purpose: Represents initialized repository scaffolding state.
- Fields:
  - `id`: string (workspace-scoped identifier)
  - `name`: string
  - `createdAt`: datetime
  - `structureVersion`: string
  - `strictModeEnabled`: boolean
  - `qualityGatesConfigured`: boolean
- Relationships:
  - has many `WorkspacePackage`
  - has one `ApiContractProfile`
  - has one `DatabaseBootstrap`

### WorkspacePackage

- Purpose: Captures each monorepo package in scaffold.
- Fields:
  - `name`: enum (`apps/web`, `apps/api`, `packages/shared`)
  - `path`: string
  - `type`: enum (`frontend`, `backend`, `shared`)
  - `hasTypecheckScript`: boolean
  - `hasLintScript`: boolean
  - `hasFormatScript`: boolean
- Relationships:
  - belongs to `ScaffoldProject`

### ApiContractProfile

- Purpose: Defines transport contract conventions for scaffold APIs.
- Fields:
  - `basePath`: string (`/api`)
  - `healthEndpoint`: string (`/api/health`)
  - `exampleTypedEndpoint`: string (`/api/scaffold/ping`)
  - `errorStandard`: enum (`rfc9457`)
  - `contentTypeSuccess`: string (`application/json`)
  - `contentTypeError`: string (`application/problem+json`)
- Relationships:
  - belongs to `ScaffoldProject`

### ValidationSchemaProfile

- Purpose: Defines validation boundaries in scaffold.
- Fields:
  - `schemaLibrary`: enum (`zod4`)
  - `httpInputValidation`: boolean
  - `envValidation`: boolean
  - `crossLayerPayloadValidation`: boolean
  - `safeParseRequired`: boolean
- Relationships:
  - referenced by `ApiContractProfile`

### DatabaseBootstrap

- Purpose: Defines initial DB and migration foundation.
- Fields:
  - `provider`: enum (`postgres`)
  - `runtimeSource`: enum (`docker-local`)
  - `migrationTool`: enum (`drizzle`)
  - `migrationPath`: string (`drizzle/migrations`)
  - `schemaPath`: string (`drizzle/schema`)
- Relationships:
  - belongs to `ScaffoldProject`

## Validation Rules

- Package names are fixed to the three clarified workspace segments.
- `errorStandard` MUST remain `rfc9457` for scaffold-generated API errors.
- No generated type definition may include `any`.
- Every boundary payload in the scaffold must have a Zod schema.
- Migration artifacts must be generated from Drizzle schema sources only.

## State Transitions

### ScaffoldProject lifecycle

`draft` -> `generated` -> `validated`

- `draft` to `generated`: structure and config files created.
- `generated` to `validated`: setup, typecheck, lint, format, API smoke, and migration baseline commands succeed.
