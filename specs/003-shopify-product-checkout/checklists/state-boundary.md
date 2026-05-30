# State Boundary Decision

## Decision

- Keep catalog and cart in focused feature-local hooks with typed fetch helpers.
- Do not introduce TanStack Query in this iteration because the flow has limited server-state fanout and no cross-page cache invalidation complexity yet.
- Revisit TanStack Query if we add wishlist/account history or complex background refetch requirements.

## Consequences

- Simpler mental model and fewer moving parts for the MVP.
- State remains explicit per feature path with contract-validated payloads.
- We trade automatic stale-cache management for straightforward fetch-on-action semantics.
