import { Elysia } from "elysia";
import { createProblemDetail } from "@sl88/shared/schemas";

/**
 * Placeholder bearer-token auth guard.
 *
 * In production this will verify a signed JWT; for the scaffold it just
 * confirms that an `Authorization: Bearer <token>` header is present.
 *
 * Usage: `.use(authGuard)` and pass `{ isAuthenticated: true }` on protected routes.
 */
export const authGuard = new Elysia({ name: "authGuard" }).macro({
  isAuthenticated: (enabled: boolean) => ({
    beforeHandle({ headers, set }): unknown {
      if (!enabled) return undefined;

      const auth = headers["authorization"];
      if (auth == null || !auth.startsWith("Bearer ")) {
        set.status = 401;
        set.headers["content-type"] = "application/problem+json";
        return createProblemDetail("https://example.dev/problems/unauthorized", "Unauthorized", 401, {
          detail: "A valid Bearer token is required.",
        });
      }
      return undefined;
    },
  }),
});
