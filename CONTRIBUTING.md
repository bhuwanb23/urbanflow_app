# Contributing to UrbanFlow

Thanks for your interest! Here's how to get started.

## Development Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- Expo CLI (`npm install -g expo-cli`)
- Docker (for OTP and containerized dev)

### One-time setup

```bash
# Clone & install
git clone https://github.com/your-org/urbanflow-app.git
cd urbanflow-app

# Backend
cd backend
cp .env.example .env   # fill in your keys
npm install
npm run lint            # verify lint passes

# Frontend
cd ../urbanflow_app
cp .env.example .env
npm install --legacy-peer-deps

# (Optional) Data preprocessing
cd ../data
pip install -r requirements.txt
python preprocess_delhi.py   # generates stops.json, routes.json, etc.
```

### Running locally

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — mobile app
cd urbanflow_app
npx expo start
```

## Code Style

- **ESLint** is configured per package (`backend/.eslintrc.cjs`, `urbanflow_app/.eslintrc.cjs`)
- Run `npm run lint` before committing — must pass with zero warnings
- Use `npm run lint:fix` to auto-fix where possible
- Prefer `const` over `let`, avoid `var`
- 2-space indentation
- Use explicit imports — no default exports for modules

## Testing

- **Backend:** `cd backend && npm test` — 170+ tests using Jest + supertest
- **Frontend:** `cd urbanflow_app && npx jest --forceExit` — 100+ tests
- New features must include tests
- Bug fixes must include a regression test
- Run the full suite before opening a PR

## Pull Request Workflow

1. Fork the repo and create a feature branch from `main`
2. Make your changes (one logical change per commit)
3. Run `npm test` and `npm run lint` — both must pass
4. Update docs if changing public API or behavior
5. Open a PR with a clear title and description
6. Reference any related issues (e.g. `Closes #123`)
7. Wait for CI — all checks must pass

### PR Title Convention

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`

Examples:
- `feat(api): add route search endpoint`
- `fix(planner): handle missing shape_id gracefully`
- `docs(readme): fix installation paths`

## Project Structure

```
urbanflow-app/
├── backend/           # Express API server
├── urbanflow_app/     # React Native (Expo) mobile app
├── data/              # GTFS data, scripts, pipelines
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── .github/           # CI/CD, issue templates
├── docker-compose.yml
└── Dockerfile
```

## Questions?

Open a [Discussion](https://github.com/your-org/urbanflow-app/discussions) or file an issue.
