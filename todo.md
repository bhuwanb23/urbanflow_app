# UrbanFlow — Implementation Plan & Todo

> Generated from comprehensive gap analysis (June 2026)
> ~150+ gaps identified across 10 categories, organized into 9 phases

---

## How to Use

Each task has a status marker:
- `[ ]` — Not started
- `[~]` — In progress
- `[x]` — Complete
- `[-]` — Cancelled/skipped

Tasks within a phase should be completed **in order** (earlier tasks are prerequisites for later ones).

---

## Phase 0 — 🚨 Immediate Critical Fixes

> **Goal:** Fix bugs that block functionality or are active security vulnerabilities.
> These must be done first — they are pre-requisites for everything else.

### 0.1 Fix JWT `decode()` → `verify()` in all route files

**Problem:** 4 route files use `jwt.decode()` (no signature verification), accepting any crafted token.

**Tasks:**

- [x] Create shared auth middleware at `backend/middleware/auth.js`:
  - Extract `Authorization: Bearer <token>` from request header
  - Use `jwt.verify(token, JWT_SECRET)` to verify signature
  - Attach decoded payload to `req.user`
  - Return 401 with consistent format on failure
  - Return 403 for expired tokens with `TokenExpiredError` handling
- [x] Update `backend/routes/user.js` — replace inline `getUserId()` with shared middleware; use `req.user.id`
- [x] Update `backend/routes/trips.js` — replace inline `getUserId()` with shared middleware; add ownership checks on PUT/DELETE
- [x] Update `backend/routes/ecostats.js` — replace inline `getUserId()` with shared middleware
- [x] Update `backend/routes/notifications.js` — replace inline `getUserId()` with shared middleware; add ownership checks on GET/:id, PUT/:id/read, DELETE/:id
- [x] Remove all inline `getUserId()` helper functions from route files
- [ ] **Verify:** Write a test that a forged JWT returns 401 on all protected routes

### 0.2 Fix missing `logger` import in `routes/livePredictions.js`

**Problem:** File references `logger.error()` but never imports it — will crash at runtime.

- [x] Add `const logger = require('../utils/logger');` at top of `backend/routes/livePredictions.js`
- [ ] **Verify:** Start server, hit any `/api/v1/live/predictions` endpoint — no `ReferenceError`

### 0.3 Fix login screen to actually authenticate

**Problem:** `handleAuth()` navigates directly to `MainTabs` without calling any API.

- [x] Update `pages/auth/LoginScreen.js`:
  - Import `useAuth` hook from `../../utils/hooks/useAPI`
  - In `handleAuth`: call `login(email, password)` from hook
  - On success: call `navigation.replace('MainTabs')`
  - On failure: show error message to user
  - Handle loading state (disable button, show spinner)
- [x] Ensure demo mode bypass is explicitly gated behind `__DEV__` flag
- [ ] **Verify:** Login with wrong creds shows error; login with correct creds navigates to tabs

### 0.4 Fix Docker healthcheck

**Problem:** Healthcheck uses `wget` which doesn't exist in `node:18-alpine`.

- [x] In `backend/Dockerfile`: Add `RUN apk add --no-cache wget` OR change to `HEALTHCHECK CMD node -e "..."`
- [x] Update `docker-compose.yml` healthcheck command if needed — already uses `wget`, no change needed
- [ ] **Verify:** `docker compose up` — healthcheck passes within 40s start period

### 0.5 Fix city switch to actually reload data

**Problem:** `POST /cities/switch` changes city name but DataLoader still uses old directory.

- [x] In `backend/utils/cityManager.js`:
  - Add `setDataLoader()` hook for DataLoader reload
  - `setActiveCity()` updates `process.env.DATA_DIR`, `SCHEDULE_DIR`, `SHAPES_DIR`
  - Triggers `DataLoader.loadAll()` with new paths
  - Resets schedule/shape caches
- [x] In `backend/routes/cities.js`:
  - `setActiveCity()` is now awaited (no separate `reinitialize()` needed)
- [ ] Add persistence — save active city selection to a file or env so it survives restart
- [ ] **Verify:** Switch city, then hit `/api/v1/stops` — get new city's stops

### 0.6 Fix JWT secret

**Problem:** Weak default fallback `urbanflow-secret-key-change-in-production` hardcoded in source.

- [x] Remove all hardcoded fallback strings in `routes/auth.js`
- [x] Add startup validation in `backend/server.js`:
  - Check `process.env.JWT_SECRET` is set and not the default value
  - Exit with error if missing or using default
- [x] Generate a strong random secret for `.env`
- [ ] **Verify:** Server refuses to start if `JWT_SECRET` is missing or default

---

## Phase 1 — 🔐 Backend Security Overhaul

> **Goal:** Fix remaining security issues, add auth middleware, rate limiting, ownership checks, HTTPS.

### 1.1 Rate limiting

- [x] Add per-route rate limiter for `POST /api/v1/auth/login` (5 attempts per minute per IP)
- [x] Adjust global rate limiter from 100/15min to appropriate value (kept as-is, auth login/register have stricter 5/min)
- [x] Add rate limiter for registration endpoint
- [ ] **Verify:** 6 rapid login attempts → 429 Too Many Requests

### 1.2 Password policy

- [x] Add password validation in `routes/auth.js`:
  - Minimum 8 characters
  - Require at least 1 number and 1 special character
- [x] Return specific validation error messages
- [x] **Verify:** Registration with `"a"` returns validation error

### 1.3 CORS hardening

- [x] Update `backend/server.js` — require explicit `CORS_ORIGIN` in production
- [x] Fail startup if `CORS_ORIGIN=*` in production (`NODE_ENV=production`)
- [x] Update `docker-compose.yml` CORS env to explicit origin
- [ ] **Verify:** Requests from non-allowed origin are rejected

### 1.4 HTTPS support

- [x] Add `https.createServer()` option in `server.js`
- [x] Read SSL cert/key paths from env vars (`SSL_CERT_PATH`, `SSL_KEY_PATH`)
- [x] Fall back to HTTP in development only
- [ ] **Verify:** Server starts with HTTPS when cert paths provided

### 1.5 Request validation

- [x] Install `joi` or `express-validator` (`npm install joi`)
- [x] Create validation schemas in `backend/validators/`:
  - `auth.js` — register, login schemas
  - `user.js` — profile update schema
  - `trip.js` — create/update schemas
  - `plan.js` — journey plan schema
- [x] Apply validation middleware to all POST/PUT endpoints
- [x] **Verify:** Invalid payloads return 400 with field-level error messages

### 1.6 Account lockout

- [x] Add failed login attempts tracking (in-memory Map)
- [x] Lock account after 10 failed attempts for 15 minutes
- [x] Log security events (failed logins, lockouts)
- [ ] **Verify:** 10 wrong passwords → account locked message

### 1.7 Request body size limit

- [x] Add `express.json({ limit: '1mb' })` in `server.js`
- [ ] **Verify:** Request with >1MB body returns 413

---

## Phase 2 — 🧠 Backend Quality & Missing Features

> **Goal:** Fill in missing backend features, fix code quality issues, add missing endpoints.

### 2.1 Password reset & email verification

- [x] Add `POST /api/v1/auth/forgot-password` — generate reset token, store in DB (add `passwordResetToken`, `passwordResetExpires` fields to User model)
- [x] Add `POST /api/v1/auth/reset-password` — verify token, update password
- [x] Add email verification flow (optional — stub if no email service configured)
- [x] **Verify:** Reset flow works end-to-end (even if email is logged not sent)

### 2.2 Token blacklisting

- [x] Add token blacklist (in-memory with TTL)
- [x] Check blacklist in auth middleware
- [x] Logout adds token to blacklist
- [x] **Verify:** Logged-out token returns 401

### 2.3 Input validation for all endpoints

- [x] Add `isNaN` check on `parseFloat(distance)` in `routes/plan.js` compare endpoint
- [x] Validate `limit`/`offset` as positive integers in `routes/trips.js`
- [x] Cap max `limit` on notifications (`routes/notifications.js`)
- [x] Validate coordinate format in `routes/plan.js`
- [x] **Verify:** Invalid inputs return 400

### 2.4 Fix notification settings persistence

- [x] Add `notificationSettings` JSON field to User model
- [x] `GET /settings` reads from database
- [x] `PUT /settings` persists to database
- [x] **Verify:** Settings survive server restart

### 2.5 Fix multi-city fare calculator

- [x] Refactor `utils/fareCalculator.js`:
  - Add `CITY_FARE_STRUCTURES` with Delhi (DTC bus, Delhi Metro) and Chennai (MTC bus) fares
  - Accept `city` parameter in fare calculation functions
- [x] **Verify:** Different cities return different fare amounts

### 2.6 Add missing transport modes

- [x] Update `utils/carbonCalculator.js`: add `electric_car`, `e_rickshaw`, `scooter`, `electric_scooter`, `shared_bicycle`, `cable_car`
- [x] Update `utils/modeMapper.js`: add same modes with appropriate Material Community Icons and colors
- [x] **Verify:** All new modes appear in `GET /api/v1/plan/modes`

### 2.7 Fix search performance

- [x] Move Fuse.js instantiation to module level (not per request) in `routes/search.js`
- [x] Rebuild index only when data changes (not on every request)
- [x] **Verify:** Search response time drops from ~200ms to <10ms

### 2.8 Add graceful shutdown

- [x] Add `process.on('SIGTERM')` and `SIGINT` handlers in `server.js`
- [x] Close Sequelize connection
- [x] Stop auto-refresh intervals in all services
- [x] Log shutdown event
- [x] **Verify:** `CTRL+C` logs clean shutdown messages

### 2.9 Fix service interval leaks

- [ ] Add `stopAutoRefresh()` method to `VehiclePositionService`, `TripUpdateService`, `AlertsService`
- [ ] Store interval IDs for cleanup
- [ ] Call cleanup in graceful shutdown handler
- [ ] **Verify:** No duplicate intervals after restart

### 2.10 Consistent logging

- [x] Replace all `console.log`/`console.error`/`console.warn` in services and routes with Winston logger
- [ ] Add HTTP request logging via `morgan` (installed, wired to Winston)
- [x] **Verify:** All log output goes through Winston (check `logs/combined.log`)

### 2.11 Index foreign keys

- [x] Add Sequelize index definitions on `userId` in Trip, Notification, EcoStat models
- [x] **Verify:** No performance regression on user-scoped queries

---

## Phase 3 — 📱 Frontend Real Data Integration

> **Goal:** Connect all screens to real API data, remove mock data fallbacks.

### 3.1 Fix API base URL

- [ ] Create `urbanflow_app/app.config.js` with `extra.apiUrl` from environment
- [ ] Update `app.json` to reference config
- [ ] In `utils/api.js`: read `BASE_URL` from `Constants.expoConfig.extra.apiUrl` instead of hardcoded `localhost:3000`
- [ ] In `utils/auth.js`: remove hardcoded IP `192.168.31.67:3000`, import from same config
- [ ] Remove `utils/auth.js` duplication — consolidate into `utils/api.js`
- [ ] **Verify:** App connects to configurable backend URL

### 3.2 Wire up Live screen widgets

- [ ] **`TransitStatus.js`**: Replace mock `upcomingDepartures` with `useLiveVehicles().vehicles` filtered to relevant route
- [ ] **`TrafficConditions.js`**: Replace mock `trafficData` with `useTraffic().getTrafficConditions()`
- [ ] **`RecentUpdates.js`**: Replace mock `recentUpdates` with `useNotifications().fetchNotifications()`
- [ ] **`PopularRoutes.js`**: Replace mock `popularRoutes` with `useRoutes().getPopularRoutes()`
- [ ] **`SearchAutocomplete.js`**: Replace mock `recentSearches`/`popularDestinations` with `useRoutes().searchRoutes()`
- [ ] **Verify:** Live screen shows real data when backend is running

### 3.3 Fix RouteContext to fetch real data

- [ ] In `pages/route/context/RouteContext.js`:
  - Remove `MOCK_ROUTE_DATA` as default state
  - Add `useEffect` on mount to fetch route by ID from route params
  - Call `useRoutes().getRoute(routeId)` via context provider
  - Show loading state while fetching
  - Show error state if fetch fails
- [ ] **Verify:** Route detail screen shows real route data from API

### 3.4 Add app-level ErrorBoundary

- [ ] Install `react-error-boundary` or create custom error boundary component
- [ ] Wrap `NavigationContainer` in `App.js` with `ErrorBoundary`
- [ ] Create fallback UI component with "Something went wrong" + "Retry" button
- [ ] Log errors to console (future: Sentry)
- [ ] **Verify:** Crashed screen shows fallback UI, not white screen

### 3.5 Add loading states to all screens

- [ ] Audit every screen for missing loading/empty/error states:
  - [ ] PlannerScreen
  - [ ] LiveDashboard
  - [ ] EcoStatsScreen
  - [ ] TripsScreen
  - [ ] NotificationsScreen
  - [ ] ProfileScreen
  - [ ] RouteDetailsScreen
- [ ] Use existing skeleton components (MapSkeleton, FeedSkeleton, RouteSkeleton) where applicable
- [ ] **Verify:** Each screen shows loading indicator during API calls

---

## Phase 4 — 🧹 Dead Code Removal & Frontend Quality

> **Goal:** Remove dead code, fix navigation, improve frontend architecture.

### 4.1 Delete dead mock files

- [ ] Delete `pages/notifications/hooks/useNotifications.js` (uses mock data)
- [ ] Delete `pages/notifications/data/mockNotifications.js` (unused)
- [ ] Delete `pages/trips/data/tripsData.js` (unused)
- [ ] Delete local font files in `assets/fonts/` (~15MB, unused — loaded via Google Fonts)

### 4.2 Fix HomeScreen dead tab nav

- [ ] Remove inline `navTabs` array, `bottomBar`, and `activeTab` state from `HomeScreen.js`
- [ ] Rely on parent `TabNavigator` from App.js
- [ ] Or: if HomeScreen is meant to be standalone, integrate it properly into navigation

### 4.3 Consolidate API utilities

- [ ] Merge `utils/auth.js` functionality into `utils/api.js`:
  - Port `tokenManager` (AsyncStorage wrapper) to `api.js`
  - Port `authFlow` (login/register/logout orchestration)
  - Delete `utils/auth.js` after migration
  - Update all imports across the app to use `utils/api.js`

### 4.4 App-wide i18n

- [ ] Move i18n from route-specific `pages/route/i18n/` to `utils/i18n/`
- [ ] Initialize i18next in `App.js` (not inside route module)
- [ ] Add English and Spanish as app-wide locales
- [ ] **Verify:** Route screen still shows translated strings

### 4.5 Fix Expo config

- [ ] Add `ios.bundleIdentifier` to `app.json`
- [ ] Add `android.package` if not set
- [ ] Add Expo plugins for notifications, splash screen, etc.
- [ ] Add deep linking scheme
- [ ] Add `expo.extra` with API URL
- [ ] **Verify:** EAS build succeeds

### 4.6 Fix test setup

- [ ] Add `"test": "jest"` script to `urbanflow_app/package.json`
- [ ] Add `moduleNameMapper` in `jest.config.js` for asset/file stubs
- [ ] Add `clearMocks: true` to jest config
- [ ] **Verify:** `npm test` runs existing test files successfully

### 4.7 Add offline support

- [ ] Install `@react-native-community/netinfo`
- [ ] Create `utils/OfflineBanner.js` component
- [ ] Add network listener in `App.js`
- [ ] Cache critical API responses in AsyncStorage
- [ ] Show offline banner when network drops
- [ ] **Verify:** Toggle airplane mode → banner appears; reconnect → banner disappears

### 4.8 Guards on mock fallbacks

- [ ] Gate all mock data fallbacks behind `__DEV__` flag in production code
- [ ] In production, show empty/error state instead of mock data
- [ ] **Verify:** Production build shows no mock data

---

## Phase 5 — 🧪 Testing

> **Goal:** Add meaningful test coverage for both backend and frontend.

### 5.1 Backend unit tests

- [ ] Create `backend/tests/unit/` directory structure
- [ ] **Auth tests** (`auth.test.js`):
  - Registration with valid/invalid data
  - Login with correct/incorrect credentials
  - Token verification
  - Token refresh
  - Rate limiting behavior
- [ ] **User tests** (`user.test.js`):
  - Profile CRUD
  - Preferences update
  - Unauthorized access
- [ ] **Trip tests** (`trip.test.js`):
  - Create/read/update/delete
  - Ownership enforcement
  - Stats computation
- [ ] **EcoStat tests** (`ecostats.test.js`):
  - CO2 calculation accuracy
  - Achievement computation
  - Period filtering
- [ ] **Utility tests**:
  - Carbon calculator (verify emission factors, eco scores)
  - Fare calculator (verify fare brackets)
  - Mode mapper (verify all modes return valid icons)
  - DataLoader (mock file system)

### 5.2 Backend integration tests

- [ ] Create `backend/tests/integration/` directory
- [ ] Test all GET endpoints return 200 with correct structure
- [ ] Test all POST endpoints with valid/invalid payloads
- [ ] Test all auth-protected endpoints with/without token
- [ ] Test city switching flow
- [ ] Test Phase 4 realtime endpoints

### 5.3 Frontend tests

- [ ] **AuthScreen tests**: login flow, form validation, error states
- [ ] **PlannerScreen tests**: search, route list, filters
- [ ] **EcoStatsScreen tests**: stats display, chart rendering, achievements
- [ ] **TripsScreen tests**: list rendering, filters, saved routes
- [ ] **ProfileScreen tests**: profile display, logout, settings navigation
- [ ] **NotificationsScreen tests**: list, mark read, delete, filters
- [ ] **API utility tests**: `api.js` — mock network, test all API modules
- [ ] **Hook tests**: `useAuth`, `useTrips`, `useRoutes`, `useEcoStats`, `useTraffic`, `useNotifications`

### 5.4 Fix existing backend test

- [ ] Update `backend/tests/test-phase4.js`:
  - Remove `process.exit(0)` on failure
  - Convert to proper Jest format (`.test.js`)
  - Add to Jest configuration

### 5.5 Test configuration

- [ ] Add `jest.config.js` to `backend/` with proper settings
- [ ] Add `npm run test:coverage` script to both package.json files
- [ ] Configure coverage thresholds (target: 60% line coverage)

---

## Phase 6 — 🐳 Infrastructure & CI/CD

> **Goal:** Fix Docker, CI/CD, and deployment pipeline.

### 6.1 Docker fixes

- [ ] **Backend Dockerfile**:
  - Convert to multi-stage build (build deps in stage 1, runtime in stage 2)
  - Add `USER node` directive
  - Use `CMD ["node", "server.js"]` instead of `npm start`
  - Set `NODE_ENV=production` in production build
  - Add `npm cache clean --force` after `npm ci`
- [ ] **Frontend Dockerfile**:
  - Convert to multi-stage build
  - Add build-time arg for `EXPO_PUBLIC_API_URL`
  - Add production web export step
  - Add `USER node` directive
- [ ] **docker-compose.yml**:
  - Add healthcheck for frontend service
  - Add `restart: unless-stopped` for frontend
  - Add `condition: service_healthy` to frontend's `depends_on`
- [ ] **dockerignore files**:
  - Add `.env` to both `.dockerignore` files
  - Add `tests/`, `coverage/`, `.vscode/`, `.idea/`
- [ ] **Verify:** `docker compose up` — all services healthy, app reachable

### 6.2 CI/CD pipeline fixes

- [ ] Remove `continue-on-error: true` from critical steps (backend test, Docker build)
- [ ] Add backend lint job (`npm run lint`)
- [ ] Add frontend lint job (`npm run lint`)
- [ ] Add backend unit test job (`npm test`)
- [ ] Add frontend test job (`npm test`)
- [ ] Add `npm audit` security scanning step
- [ ] Fix Docker cache-from references (remove non-existent registry)
- [ ] Add artifact retention for build outputs
- [ ] Replace `sleep 30` with proper healthcheck loop in Docker Compose test
- [ ] Add Dependabot config (`.github/dependabot.yml`)
- [ ] Pin GitHub Actions to SHA digests instead of version tags
- [ ] **Verify:** Pipeline passes with real test failures detected

### 6.3 Deployment stubs → real

- [ ] Implement `deploy-staging` job (e.g., deploy to VPS, Railway, or Fly.io)
- [ ] Implement `deploy-production` job
- [ ] Add environment variables configuration per environment
- [ ] Add deployment documentation

---

## Phase 7 — 🗺️ Data & Multi-City

> **Goal:** Complete GTFS data for all cities, fix city switching, configure real API keys.

### 7.1 GTFS data completeness

- [ ] Download Bengaluru metro GTFS (`bmrcl.zip`) and add to `data/raw/`
- [ ] Run `preprocess.py` to regenerate Bengaluru output (with both bus + metro)
- [ ] Move Bengaluru output from `data/output/` to `data/bengaluru/output/`
- [ ] Download real Chennai MTC GTFS data and add to `data/chennai/raw/`
- [ ] Run `preprocess_chennai.py` to regenerate Chennai output
- [ ] Regenerate schedule and shape files for all cities:
  - Run `split_shapes.py` for each city
  - Generate per-route schedule JSONs
- [ ] Fix empty `transfers.json` files
- [ ] **Verify:** Each city has: `stops.json`, `routes.json`, `search_index.json`, `summary.json`, `transfers.json`, `schedule/*.json`, `shapes/*.json`

### 7.2 API key configuration

- [ ] Register at `otd.delhi.gov.in` and obtain Delhi API key
- [ ] Add real `DELHI_API_KEY` to `.env`
- [ ] Register for TomTom API key (or alternative traffic API)
- [ ] Add real `TOMTOM_API_KEY` to `.env`
- [ ] Research CPCB AQI API access, add real `CPCB_API_KEY`
- [ ] If no free AQI/Traffic APIs available, document sources and mark as "requires subscription"
- [ ] **Verify:** Realtime endpoints return live data, not mock data

### 7.3 City switch fixes

- [ ] Implement persistent city storage (file-based or DB)
- [ ] Fix OTP to be multi-city aware:
  - Update `otp/build-config.json` to include all cities' OSM data
  - Or: create per-city graph directories
- [ ] Update router config to support per-city alert URLs
- [ ] Add city-specific GTFS-RT API URLs to cityManager
- [ ] **Verify:** Full flow: switch city → DataLoader reloads → stops/routes for new city

### 7.4 Chennai setup script

- [ ] Update `scripts/setup-chennai.js` to download real GTFS data (not just sample)
- [ ] Add automated download from MTC Chennai portal
- [ ] **Verify:** Script produces valid GTFS output

---

## Phase 8 — 📚 Documentation & Open Source Readiness

> **Goal:** Make the project ready for public contribution.

### 8.1 Essential community files

- [ ] Create `CONTRIBUTING.md`:
  - How to set up dev environment
  - Code style guide
  - PR workflow
  - Testing requirements
- [ ] Create `CODE_OF_CONDUCT.md` (use Contributor Covenant template)
- [ ] Create `LICENSE` (MIT)
- [ ] Create `SECURITY.md`:
  - How to report vulnerabilities
  - Expected response time
- [ ] Add GitHub issue templates:
  - Bug report (`ISSUE_TEMPLATE/bug_report.md`)
  - Feature request (`ISSUE_TEMPLATE/feature_request.md`)
  - Config (`ISSUE_TEMPLATE/config.yml`)
- [ ] Add GitHub PR template (`PULL_REQUEST_TEMPLATE.md`)

### 8.2 Fix README

- [ ] Fix directory paths: `server/` → `backend/`, fix mobile app path
- [ ] Fix `npm run init` references → document actual setup steps
- [ ] Fix project structure diagram to match actual layout
- [ ] Remove placeholder images (via.placeholder.com)
- [ ] Remove hardcoded demo credentials (or mark them clearly)
- [ ] Add real screenshots
- [ ] Add environment setup section
- [ ] Add troubleshooting section for common Docker issues

### 8.3 Fix DOCKER.md

- [ ] Remove references to non-existent `docker-compose.prod.yml`
- [ ] Fix `npm run init` → correct commands
- [ ] Fix database filename: `urbanflow.db` → `urbanflow.sqlite`
- [ ] Remove SQLite scaling advice (`--scale backend=3`)
- [ ] Add Docker troubleshooting for permission errors
- [ ] Document all required environment variables

### 8.4 API documentation

- [ ] Add comprehensive API docs (consider Swagger/OpenAPI)
- [ ] Include request/response examples for every endpoint
- [ ] Document auth requirements per endpoint
- [ ] Document error codes and formats

---

## Phase 9 — ✨ Polish & Roadmap Features

> **Goal:** Add planned features from roadmap and polish the app.

### 9.1 Splash screen

- [ ] Install `expo-splash-screen`
- [ ] Configure splash image/color in `app.json`
- [ ] Auto-hide when fonts and data are loaded
- [ ] **Verify:** App shows native splash on cold start

### 9.2 Dark mode & theming

- [ ] Create `utils/theme/index.js` with light/dark color palettes
- [ ] Use `PaperProvider` theme with dynamic theme switching
- [ ] Add theme toggle in Profile screen
- [ ] Persist theme preference in AsyncStorage
- [ ] Respect system appearance settings
- [ ] **Verify:** Toggle theme → all screens update immediately

### 9.3 Push notifications

- [ ] Install `expo-notifications`
- [ ] Register push token on login
- [ ] Send push token to backend (`POST /api/v1/user/push-token`)
- [ ] Handle incoming notifications (foreground, background, quit)
- [ ] Navigate to relevant screen on notification tap
- [ ] **Verify:** Send test push → notification appears on device

### 9.4 Landing page (Phase 5 roadmap item)

- [ ] Scaffold React + Vite project in `landing/` directory
- [ ] Build marketing page: hero, features, screenshots, download links
- [ ] Deploy to Vercel/Netlify
- [ ] **Verify:** Landing page is live at project URL

### 9.5 Maps integration

- [ ] Install `react-native-maps` (Expo-compatible)
- [ ] Add map view to Live screen showing bus positions
- [ ] Add route polyline visualization in Planner
- [ ] Add map to Trip details showing journey path
- [ ] **Verify:** Map renders with correct markers and polylines

### 9.6 AI Recommendations (stub)

- [ ] Create `POST /api/v1/recommendations` endpoint on backend
- [ ] Start with simple rule-based: most frequent routes, time-of-day patterns
- [ ] Add frontend card section in HomeScreen or Planner
- [ ] Document as "experimental" until ML model is integrated
- [ ] **Verify:** Recommendation endpoint returns plausible suggestions

### 9.7 Crash reporting

- [ ] Install `@sentry/react-native`
- [ ] Configure DSN from env
- [ ] Replace all `console.error` with `Sentry.captureException`
- [ ] Add breadcrumbs for navigation and API calls
- [ ] **Verify:** Test crash appears in Sentry dashboard

### 9.8 Pre-commit hooks

- [ ] Install `husky` and `lint-staged`
- [ ] Configure pre-commit hook: lint staged files + run relevant tests
- [ ] Add `eslint.config.js` or `.eslintrc.js`
- [ ] Add `.prettierrc` configuration
- [ ] **Verify:** Commit with lint error → hook blocks commit

---

## Summary

| Phase | Focus | Tasks | Priority | Dependencies |
|-------|-------|-------|----------|--------------|
| **0** | Critical fixes | ~15 tasks | 🔴 NOW | None |
| **1** | Security overhaul | ~15 tasks | 🔴 NOW | Phase 0 (auth middleware) |
| **2** | Backend quality | ~20 tasks | 🟠 NEXT | Phase 1 |
| **3** | Frontend real data | ~12 tasks | 🟠 NEXT | Phase 0 (login fix) |
| **4** | Dead code & quality | ~15 tasks | 🟡 | Phase 3 |
| **5** | Testing | ~20 tasks | 🟡 | Phase 2, 3 |
| **6** | Infrastructure | ~18 tasks | 🟠 | Phase 0 (Docker fix) |
| **7** | Data & multi-city | ~12 tasks | 🟡 | None |
| **8** | Docs & OSS | ~15 tasks | 🟢 | None |
| **9** | Polish & roadmap | ~20 tasks | 🟢 | Phase 3, 4 |
| | **Total** | **~162 tasks** | | |

---

## Verification Methodology

Each task includes a **Verify** step. Standard verification approaches:

1. **Backend**: Start server → hit endpoint → check response code + body structure
2. **Frontend**: Run `npm test` → check test passes → manual UI check
3. **Infrastructure**: `docker compose up` → `docker ps` → healthcheck status
4. **Data**: Run data scripts → check output files exist → query API endpoints
5. **Security**: Attempt exploit → verify it's blocked

---

*Last updated: June 2, 2026*
