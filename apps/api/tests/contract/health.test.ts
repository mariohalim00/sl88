import { describe, expect, it } from "bun:test";
import { app } from "../../src/app/index.js";

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await app
      .handle(new Request("http://localhost/api/health"))
      .then((r) => r.json() as Promise<{ status: string; service: string; timestamp: string }>);

    expect(res.status).toBe("ok");
    expect(res.service).toBe("api");
    expect(typeof res.timestamp).toBe("string");
  });
});
