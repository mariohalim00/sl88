import { describe, expect, it } from 'bun:test';
import { app } from '../../src/app/index.js';

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await app.handle(new Request('http://localhost/api/health'));

    expect(res.status).toBe(200); // Assert HTTP status code

    const body = (await res.json()) as {
      status: string;
      service: string;
      timestamp: string;
    };

    expect(body.status).toBe('ok');
    expect(body.service).toBe('api');
    expect(typeof body.timestamp).toBe('string');
  });
});
