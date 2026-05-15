# HTTP API Contract: Scaffold Baseline

## Scope

Contract for scaffold-only endpoints used to validate full-stack integration and baseline API conventions.

## Protocol Rules

- Base path: `/api`
- Success content type: `application/json`
- Error content type: `application/problem+json`
- Error envelope standard: RFC 9457 Problem Details

## Endpoints

### GET `/api/health`

- Purpose: Health check for scaffold availability.
- Auth: Public
- Response `200 application/json`:

```json
{
  "status": "ok",
  "service": "api",
  "timestamp": "2026-05-02T00:00:00.000Z"
}
```

### GET `/api/scaffold/ping`

- Purpose: Typed contract smoke endpoint for frontend Eden Treaty integration.
- Auth: Public
- Query params:
  - `name` (optional, string, max 60)
- Response `200 application/json`:

```json
{
  "message": "pong",
  "echo": {
    "name": "developer"
  }
}
```

### GET `/api/scaffold/protected`

- Purpose: Validate auth-ready middleware seam.
- Auth: Required (placeholder guard)
- Response `200 application/json`:

```json
{
  "message": "authorized scaffold route"
}
```

- Response `401 application/problem+json`:

```json
{
  "type": "https://example.dev/problems/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Authentication is required to access this resource",
  "instance": "/api/scaffold/protected"
}
```

## Problem Details Contract (RFC 9457)

All non-2xx responses MUST include:

- `type` (URI string)
- `title` (string)
- `status` (number)
- `detail` (string, optional but recommended)
- `instance` (URI-reference string, optional but recommended)

Allowed extension members for scaffold:

- `traceId` (string)
- `errors` (array of field-level validation details)
