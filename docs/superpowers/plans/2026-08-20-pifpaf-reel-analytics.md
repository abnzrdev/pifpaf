# PifPaf Reel Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the complete landing-to-import-to-sign-out Reel analytics flow represented by the supplied references.

**Architecture:** A single JavaScript Next.js App Router app renders the public and protected UI. Stable NextAuth v4 supplies credential/JWT sessions; server-only actions use Zod, parameterized `pg` queries, and an explicit mock-or-Apify provider before revalidating the dashboard.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, Tailwind CSS 4.3.3, next-auth 4.24.15, pg 8.23.0, Zod 4.4.3, Apify Client 2.25.0, Node test runner, PostgreSQL.

**Spec:** `docs/superpowers/specs/2026-08-20-pifpaf-reel-analytics-design.md`

## Global Constraints

- JavaScript/JSX and SQL only; do not add TypeScript.
- The landing page is public on every visit; authenticated CTAs route to `/dashboard`.
- Every database query derives `user_id` from the authenticated server session.
- Repository integration tests use `TEST_DATABASE_URL`, never an unverified production database.
- `APIFY_TOKEN` stays server-only; `APIFY_MOCK=true` is the only mock switch.
- Use maintained Actor `apify/instagram-reel-scraper` with input `{ username: [url], resultsLimit: 1, includeSharesCount: false, includeTranscript: false, includeDownloadedVideo: false }`.
- Never synthesize unavailable metrics; store `NULL` and render `—`.
- Do not implement sidebar, charts, pricing, subscriptions, analytics, monetization, messages, notifications, or settings.
- Keep screenshot states as transitions in `/dashboard`, not separate demo routes.

---

### Task 1: App foundation and verification ledger

**Files:**
- Create: `package.json`, `jsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `.env.example`
- Create: `app/layout.jsx`, `app/globals.css`, `LOOP.md`
- Create: `public/images/*`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `lint`, `test`, `db:migrate`, `db:seed`; global PifPaf design tokens and local lifestyle assets.

- [ ] **Step 1: Add the package manifest and framework configuration**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint .",
    "test": "node --test",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js"
  },
  "dependencies": {
    "apify-client": "2.25.0",
    "next": "16.3.1",
    "next-auth": "4.24.15",
    "pg": "8.23.0",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "zod": "4.4.3"
  }
}
```

Add only ESLint, Tailwind, and PostCSS as dev dependencies.

- [ ] **Step 2: Add global design tokens and accessible base styles**

Define navy `#0b1239`, blue `#315cff`, canvas `#eef2f8`, white surfaces, rounded corners, visible `:focus-visible`, reduced-motion behavior, and reusable `.shell`, `.button`, `.card`, and `.sr-only` classes in `app/globals.css`.

- [ ] **Step 3: Create local visual assets**

Generate or optimize six varied 9:16 lifestyle images and three landscape collage crops under `public/images`; add meaningful alt text where informative and empty alt text where decorative.

- [ ] **Step 4: Create `LOOP.md`**

Use checkbox rows for all 12 spec states plus `npm test`, `npm run lint`, `npm run build`, migration, seed, console/server errors, responsive checks, and full manual flow. Each row names its evidence command or screenshot.

- [ ] **Step 5: Install and smoke-check**

Run: `npm install && npm run lint`

Expected: dependencies install without peer errors; lint exits 0.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json jsconfig.json next.config.mjs postcss.config.mjs eslint.config.mjs .gitignore .env.example app public LOOP.md
git commit -m "chore: scaffold PifPaf app"
```

### Task 2: URL, password, and provider domain logic

**Files:**
- Create: `lib/reels.js`, `lib/password.js`, `lib/apify.js`
- Test: `test/reels.test.js`, `test/password.test.js`, `test/apify.test.js`

**Interfaces:**
- Produces: `normalizeReelUrl(value)`, `normalizeActorItem(item, canonicalUrl)`, `hashPassword(password)`, `verifyPassword(password, encoded)`, `fetchReel(canonicalUrl)`.

- [ ] **Step 1: Write failing URL and actor-normalization tests**

```js
test('canonicalizes supported Reel URLs', () => {
  assert.equal(normalizeReelUrl('https://www.instagram.com/reel/C9Ab_12/?igsh=x'), 'https://www.instagram.com/reel/C9Ab_12/')
})

test('keeps hidden likes and absent shares unavailable', () => {
  const reel = normalizeActorItem({ shortCode: 'C9Ab_12', likesCount: -1, videoViewCount: 42 }, canonicalUrl)
  assert.equal(reel.likes, null)
  assert.equal(reel.shares, null)
})
```

Also reject HTTP, non-Instagram hosts, `/p/`, missing shortcode, and trailing junk.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- test/reels.test.js test/apify.test.js`

Expected: FAIL because modules do not exist.

- [ ] **Step 3: Implement the minimum domain functions**

`normalizeActorItem` maps `shortCode`, `caption`, `displayUrl ?? images?.[0]`, `timestamp`, `videoDuration`, `videoViewCount ?? videoPlayCount`, `likesCount`, `commentsCount`, and `sharesCount`; negative/non-finite metrics become `null` and the untouched item becomes `rawJson`.

`fetchReel` returns deterministic fixtures only for `APIFY_MOCK=true`; otherwise it requires `APIFY_TOKEN`, calls `apify/instagram-reel-scraper`, waits at most 60 seconds, checks terminal run status, reads one dataset item, and maps provider/rate/empty/timeout failures to `ReelFetchError` codes.

- [ ] **Step 4: Write password tests and verify RED**

```js
test('verifies only the original password', async () => {
  const encoded = await hashPassword('demo-password')
  assert.equal(await verifyPassword('demo-password', encoded), true)
  assert.equal(await verifyPassword('wrong', encoded), false)
})
```

Run: `npm test -- test/password.test.js`

Expected: FAIL because password functions do not exist.

- [ ] **Step 5: Implement scrypt password storage and run GREEN**

Encode `scrypt$<salt-hex>$<hash-hex>`, use a random 16-byte salt, and compare with `timingSafeEqual`.

Run: `npm test`

Expected: all domain tests PASS.

- [ ] **Step 6: Commit**

```bash
git add lib test
git commit -m "feat: add Reel provider domain logic"
```

### Task 3: Database migrations, seed, and user-scoped repository

**Files:**
- Create: `db/001_initial.sql`, `scripts/migrate.js`, `scripts/seed.js`, `lib/db.js`, `lib/repository.js`
- Test: `test/repository.test.js`

**Interfaces:**
- Produces: `findUserByEmail(email)`, `getDashboard(userId)`, `upsertReel(userId, reel)`, `getStaleReels(userId, cutoff)`, `refreshReelForUser(userId, reelId)`.

- [ ] **Step 1: Write the migration**

Create UUID-keyed `users` and `reels`, `JSONB NOT NULL`, cascading FK, `UNIQUE (user_id, shortcode)`, non-negative metric checks that allow `NULL`, and indexes on `(user_id, created_at DESC)` and `(user_id, last_synced_at)`.

- [ ] **Step 2: Write a failing ownership integration test**

Using a dedicated `TEST_DATABASE_URL`, insert two synthetic users and one Reel
for each, then assert `getDashboard(firstUserId)` returns only the first Reel,
its own aggregates, and cannot refresh the second user's Reel. Clean up both
synthetic users in `after()`; refuse to run when `TEST_DATABASE_URL` equals
`DATABASE_URL` outside `NODE_ENV=test`.

Run: `npm test -- test/repository.test.js`

Expected: FAIL until repository queries exist.

- [ ] **Step 3: Implement parameterized repository queries**

`getDashboard` returns reels plus one SQL aggregate row containing `reel_count`, `total_views`, `best_reel_views`, and `best_reel_id`. `upsertReel` inserts every normalized field and updates the same fields plus `last_synced_at`/`updated_at` on user-scoped conflict.

- [ ] **Step 4: Add idempotent migration and seed runners**

Seed `demo@pifpaf.ai` / `PifPafDemo!2026` and six mock-provider Reels; use the same hash and upsert paths as production.

- [ ] **Step 5: Verify against PostgreSQL**

Run: `npm run db:migrate && npm run db:seed && npm run db:seed && npm test`

Expected: both seed runs succeed without duplicates; tests PASS.

- [ ] **Step 6: Commit**

```bash
git add db scripts lib test
git commit -m "feat: add user-scoped Reel persistence"
```

### Task 4: Credentials auth and route protection

**Files:**
- Create: `lib/auth.js`, `app/api/auth/[...nextauth]/route.js`, `app/login/page.jsx`, `app/login/login-form.jsx`, `app/login/actions.js`
- Test: `test/auth.test.js`

**Interfaces:**
- Produces: `authOptions`, `requireUser()`, credentials login UI, NextAuth GET/POST handlers.

- [ ] **Step 1: Write failing credential-validation tests**

Verify normalization of `demo@pifpaf.ai`, rejection of malformed email/missing password, and `null` for an incorrect password without revealing which credential failed.

- [ ] **Step 2: Run RED**

Run: `npm test -- test/auth.test.js`

Expected: FAIL because auth helpers do not exist.

- [ ] **Step 3: Implement stable NextAuth v4 config**

Use `CredentialsProvider`, `strategy: 'jwt'`, custom `/login`, `jwt` callback copying `user.id` to `token.sub`, and `session` callback copying `token.sub` to `session.user.id`. `requireUser()` calls `getServerSession(authOptions)` and redirects to `/login` if absent.

- [ ] **Step 4: Implement the login form**

Use labeled inputs, demo credentials copy, pending/error live states, `signIn('credentials', { redirect: false })`, and redirect to `/dashboard` only after success.

- [ ] **Step 5: Verify GREEN and commit**

Run: `npm test -- test/auth.test.js && npm run lint`

```bash
git add lib app/api app/login test
git commit -m "feat: add credentials authentication"
```

### Task 5: Landing and dashboard read states

**Files:**
- Create: `components/logo.jsx`, `components/icons.jsx`, `components/header.jsx`, `components/stat-card.jsx`, `components/reel-card.jsx`
- Create: `app/page.jsx`, `app/dashboard/page.jsx`, `app/dashboard/dashboard.jsx`

**Interfaces:**
- Consumes: `getServerSession(authOptions)`, `requireUser()`, `getDashboard(userId)`.
- Produces: public landing; empty and returning protected dashboards; account dropdown/sign out.

- [ ] **Step 1: Build the public landing from reference one**

Render the logo, auth-aware CTA, editorial collage, two floating metric pills, and three “How it works” cards. Use local imagery, semantic sections, one H1, and responsive layout.

- [ ] **Step 2: Build server-rendered dashboard data loading**

`page.jsx` calls `requireUser()` and `getDashboard(session.user.id)`, then passes serializable data to `dashboard.jsx`.

- [ ] **Step 3: Build empty and returning views from references two and three**

Render exactly three aggregate cards, a first-import form when empty, and 9:16 Reel cards plus obvious Add Another Reel control when returning. The account menu shows name/email and a working sign-out action.

- [ ] **Step 4: Verify static quality**

Run: `npm run lint && npm run build`

Expected: both exit 0; no remote-image configuration warnings.

- [ ] **Step 5: Visually inspect landing, empty, returning, mobile**

Record viewport screenshots/evidence in `LOOP.md`; fix spacing, overflow, focus order, image crop, and contrast before marking these states Done.

- [ ] **Step 6: Commit**

```bash
git add app components LOOP.md
git commit -m "feat: build landing and dashboard views"
```

### Task 6: Import, modal, refresh, and feedback transitions

**Files:**
- Create: `app/dashboard/actions.js`, `lib/import-reel.js`, `components/reel-form.jsx`, `components/reel-modal.jsx`, `components/import-status.jsx`, `components/toast.jsx`
- Modify: `app/dashboard/dashboard.jsx`, `components/reel-card.jsx`
- Test: `test/actions.test.js`

**Interfaces:**
- Produces: `importReelForUser({ userId, url, fetcher, repository })`, plus server actions `importReel(previousState, formData)` and `refreshReel(formData)` returning `{ ok, reel?, dashboard?, fieldError?, error? }`.

- [ ] **Step 1: Write failing action-boundary tests**

Test the pure import service with recording fakes: invalid URLs never call the
provider, provider errors map to friendly messages, and successful imports pass
only the supplied authenticated user ID to `upsertReel`. The thin server action
must obtain that ID exclusively from `getServerSession` before calling the
service.

- [ ] **Step 2: Run RED**

Run: `npm test -- test/actions.test.js`

Expected: FAIL because dashboard actions do not exist.

- [ ] **Step 3: Implement server actions**

Validate with Zod, require the server session, call `fetchReel`, user-scoped upsert, reload SQL aggregates, and `revalidatePath('/dashboard')`. Refresh rejects rows not owned by the session user and skips automatic provider calls for rows newer than six hours.

- [ ] **Step 4: Implement first-import transitions**

Enable Fetch only for a locally valid URL, keep it visible during pending, show staged accessible status, retain form/errors on failure, and replace the empty view with the returned Reel/stats on success.

- [ ] **Step 5: Implement accessible modal transitions**

Use native `<dialog>` where supported, focus the URL input on open, trap focus, close on Escape when idle, restore trigger focus, lock dismissal while pending, leave background stats/cards unchanged during fetch, then close/prepend/update/toast only after success.

- [ ] **Step 6: Add manual refresh**

Expose a compact per-card refresh control with pending and friendly error states; do not auto-refresh fresh rows.

- [ ] **Step 7: Verify GREEN and visual states**

Run: `npm test && npm run lint && npm run build`

Manually capture first pending/success, modal idle/pending/success, invalid, provider failure, Escape, focus return, and reduced-motion evidence in `LOOP.md`.

- [ ] **Step 8: Commit**

```bash
git add app components test LOOP.md
git commit -m "feat: complete Reel import workflow"
```

### Task 7: Delivery documentation and completion audit

**Files:**
- Create: `README.md`
- Modify: `.env.example`, `LOOP.md`

**Interfaces:**
- Produces: reproducible reviewer setup and requirement-by-requirement completion evidence.

- [ ] **Step 1: Write reviewer documentation**

Document prerequisites, PostgreSQL creation, migration/seed, demo login, environment variables, `APIFY_MOCK=true` flow, real Actor setup/cost caveat, run/test/lint/build commands, architecture, stale refresh policy, and known limitations.

- [ ] **Step 2: Run clean verification**

```bash
npm test
npm run lint
npm run build
npm run db:migrate
npm run db:seed
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 3: Exercise the exact core flow**

Landing → demo login → empty user dashboard → paste Reel → pending → success → returning dashboard → add-another modal → modal pending → new card and updated stats → account menu → sign out. Record viewport, database row/aggregate, console, and server-log evidence in `LOOP.md`.

- [ ] **Step 4: Audit every explicit brief requirement**

Cross-reference each route, state, field, constraint, failure, accessibility behavior, README item, and verification gate to authoritative evidence. Leave unchecked anything not proven and keep working until all required rows are checked.

- [ ] **Step 5: Commit**

```bash
git add README.md .env.example LOOP.md
git commit -m "docs: add reviewer setup and verification"
```
