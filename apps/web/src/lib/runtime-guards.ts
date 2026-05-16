const unsafeProductionApiPattern = /https?:\/\/(api\.|prod\.|production\.)/i;

/**
 * Fail fast if an explicit production API URL leaks into MVP route runtime.
 */
export function assertMockOnlyRuntime(target?: string): void {
  if (target == null || target.trim().length === 0) {
    return;
  }

  if (unsafeProductionApiPattern.test(target)) {
    throw new Error(
      `[web] Production API target is not allowed in MVP mock mode: ${target}`,
    );
  }
}
