import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { authenticateUser, getUserById } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const defaultSessionStore = new Map();

const tasks = [
  { id: 'task_1', label: 'Review pull requests', status: 'Today' },
  { id: 'task_2', label: 'Ship release notes', status: 'Next' },
  { id: 'task_3', label: 'Refresh onboarding docs', status: 'Queued' }
];

export function createApp(options = {}) {
  const sessionStore = options.sessionStore ?? defaultSessionStore;
  const cookieName = options.cookieName ?? 'auth_lab_session';

  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(publicDir));

  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/login', async (req, res) => {
    const user = await authenticateUser(req.body?.username, req.body?.password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const sessionId = randomUUID();
    sessionStore.set(sessionId, {
      userId: user.id,
      createdAt: Date.now()
    });

    res.cookie(cookieName, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60
    });

    return res.json({ user });
  });

  app.post('/api/logout', (req, res) => {
    const sessionId = req.cookies?.[cookieName];

    if (sessionId) {
      sessionStore.delete(sessionId);
    }

    res.clearCookie(cookieName);
    res.status(204).send();
  });

  app.get('/api/me', requireAuth(sessionStore, cookieName), (req, res) => {
    res.json({ user: req.user });
  });

  app.get('/api/tasks', requireAuth(sessionStore, cookieName), (req, res) => {
    res.json({ tasks });
  });

  app.use((req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  return app;
}

function requireAuth(sessionStore, cookieName) {
  return (req, res, next) => {
    const sessionId = req.cookies?.[cookieName];
    const session = sessionId ? sessionStore.get(sessionId) : null;
    const user = session ? getUserById(session.userId) : null;

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    req.user = user;
    return next();
  };
}
