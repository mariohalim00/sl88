import { describe, expect, it } from 'bun:test';
import { app } from '../../src/app/index.js';

describe('GET /api/scaffold/protected', () => {
  it('returns 401 when no Authorization header', async () => {
    const res = await app.handle(
      new Request('http://localhost/api/scaffold/protected'),
    );
    expect(res.status).toBe(401);
    expect(res.headers.get('content-type')).toContain(
      'application/problem+json',
    );
  });

  it('returns 401 when Authorization header is not Bearer', async () => {
    const res = await app.handle(
      new Request('http://localhost/api/scaffold/protected', {
        headers: { Authorization: 'Basic abc123' },
      }),
    );
    expect(res.status).toBe(401);
  });

  it('returns 200 when a Bearer token is present', async () => {
    const res = await app.handle(
      new Request('http://localhost/api/scaffold/protected', {
        headers: { Authorization: 'Bearer scaffold-token' },
      }),
    );
    expect(res.status).toBe(200);
  });
});
