import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';

function buildApp() {
  return createApp({
    sessionStore: new Map(),
    cookieName: `test_session_${randomUUID()}`
  });
}

describe('Focus Desk app', () => {
  it('serves the health endpoint', async () => {
    const response = await request(buildApp()).get('/health');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { ok: true });
  });

  it('rejects bad login credentials', async () => {
    const response = await request(buildApp())
      .post('/api/login')
      .send({ username: 'ada', password: 'wrong-password' });

    assert.equal(response.status, 401);
    assert.equal(response.body.error, 'Invalid username or password');
  });

  it('authenticates with valid credentials and returns the current user', async () => {
    const agent = request.agent(buildApp());

    const loginResponse = await agent
      .post('/api/login')
      .send({ username: 'ada', password: 'orbit-bridge-42' });

    assert.equal(loginResponse.status, 200);
    assert.equal(loginResponse.body.user.username, 'ada');

    const meResponse = await agent.get('/api/me');

    assert.equal(meResponse.status, 200);
    assert.equal(meResponse.body.user.name, 'Ada Lovelace');
  });

  it('blocks protected data without a session', async () => {
    const response = await request(buildApp()).get('/api/tasks');

    assert.equal(response.status, 401);
    assert.equal(response.body.error, 'Authentication required');
  });

  it('clears the session on logout', async () => {
    const agent = request.agent(buildApp());

    await agent
      .post('/api/login')
      .send({ username: 'grace', password: 'compiler-moon-7' })
      .expect(200);

    await agent.post('/api/logout').expect(204);

    const response = await agent.get('/api/me');

    assert.equal(response.status, 401);
  });
});
