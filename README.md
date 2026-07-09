# Focus Desk

Focus Desk is a one-page Node.js/Express web app with cookie-based demo authentication and a small protected task dashboard.

The project is ready to run locally and publish through a regular GitHub workflow.

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

Both the normal and security test suites should pass. The security regression test verifies that the old universal debug password (`demo-debug`) cannot authenticate as a real user.

## CI/CD and deployment

This repo includes `.github/workflows/ci-cd.yml`.

The workflow:

1. Installs dependencies with `npm ci`.
2. Runs the passing test suite with `npm test`.
3. Runs `npm run test:security` to block deployment if the authentication bypass returns.
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
src/auth.js             Demo users and authentication logic
src/server.js           Local server entry point
test/app.test.js        Passing app/auth tests
test/security/          Security regression tests
.github/workflows/      GitHub Actions CI/CD workflow
```
