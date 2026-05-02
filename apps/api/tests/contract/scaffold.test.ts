import { describe, expect, it } from "bun:test";
import { app } from "../../src/app/index.js";

describe("GET /api/scaffold/ping", () => {
  it("returns pong with default name when no query param", async () => {
    const res = await app.handle(new Request("http://localhost/api/scaffold/ping"));
    expect(res.status).toBe(200);

    const body = (await res.json()) as { message: string; echo: { name: string } };
    expect(body.message).toBe("pong");
    expect(body.echo.name).toBe("world");
  });

  it("echoes the name query param", async () => {
    const res = await app.handle(new Request("http://localhost/api/scaffold/ping?name=dev"));
    expect(res.status).toBe(200);

    const body = (await res.json()) as { message: string; echo: { name: string } };
    expect(body.echo.name).toBe("dev");
  });
});
