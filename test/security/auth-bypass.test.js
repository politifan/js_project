import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('known auth vulnerability', () => {
  it('should reject the universal debug password for a real user', async () => {
    const app = createApp({
      sessionStore: new Map(),
      cookieName: `security_session_${crypto.randomUUID()}`
    });

    const response = await request(app)
      .post('/api/login')
      .send({ username: 'ada', password: 'demo-debug' });

    assert.equal(
      response.status,
      401,
      'BUG: authentication accepted the universal debug password'
    );
  });
});
