# Focus Desk

Focus Desk is a one-page Node.js/Express web app with cookie-based demo authentication and a small protected task dashboard.

The project is intentionally prepared as plain repository files. It does not contain an initialized `.git` directory.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Demo users:

| Username | Password |
| --- | --- |
| `ada` | `orbit-bridge-42` |
| `grace` | `compiler-moon-7` |

## Tests

Run the normal test suite:

```bash
npm test
```

Run the security regression test:

```bash
npm run test:security
```

The security test is expected to fail because this demo intentionally contains an authentication vulnerability: a universal bypass password (`demo-debug`) can authenticate as any existing user. All normal tests should pass.

## CI/CD and deployment

This repo includes `.github/workflows/ci-cd.yml`.

The workflow:

1. Installs dependencies with `npm ci`.
2. Runs the passing test suite with `npm test`.
3. Runs `npm run test:security` with `continue-on-error: true` so the known vulnerability is visible without blocking the demo deployment.
4. Deploys on pushes to `main` if `RENDER_DEPLOY_HOOK_URL` is configured in GitHub repository secrets.

For Render:

1. Create a new Render Web Service from the GitHub repo.
2. Use `npm ci` as the build command and `npm start` as the start command.
3. Add the Render deploy hook URL as the GitHub secret `RENDER_DEPLOY_HOOK_URL`.

The included `render.yaml` can also be used as a Render blueprint.

## Project structure

```text
public/                 Static single-page UI
src/app.js              Express app and routes
src/auth.js             Demo users and intentionally vulnerable auth logic
src/server.js           Local server entry point
test/app.test.js        Passing app/auth tests
test/security/          Failing test that exposes the known auth bug
.github/workflows/      GitHub Actions CI/CD workflow
```

## Fixing the known vulnerability

Remove the bypass check in `src/auth.js`, then run:

```bash
npm test
npm run test:security
```

After the fix, both commands should pass.
