# PifPaf Reel Analytics Design

## Goal

Build a review-ready internal creator dashboard that imports public Instagram
Reel data, stores it per authenticated user, and presents the complete flow in
the five supplied visual references.

## Scope

The product has three routes:

- `/` is always the public creator landing page.
- `/login` provides email/password login and displays the demo credentials.
- `/dashboard` is protected and contains every empty, importing, success,
  returning, modal, toast, and account-menu state.

There is no sidebar, charting, billing, analytics, monetization, messaging,
notification, or settings product area. The navigation and extra metrics in
references four and five are not part of the product; those references inform
only the modal treatment.

## Technical Architecture

Use a single Next.js 16 App Router application written in JavaScript/JSX with
Tailwind CSS 4. Auth.js provides credentials authentication and encrypted JWT
sessions. Node's `crypto.scrypt` hashes passwords, avoiding another security
dependency. Zod 4 validates form data and external data at server boundaries.

Use `pg` directly with parameterized SQL. Checked-in SQL files provide forward
migrations, and small Node scripts run migrations and seed development data.
This keeps the database contract visible and satisfies the JavaScript + SQL
requirement without generated ORM layers.

Server Actions handle login-adjacent mutations and Reel operations. Every
dashboard read and mutation derives `user_id` from the authenticated session;
the browser never supplies a trusted user identifier. Apify calls and its token
remain in server-only modules.

## Data Model

`users` contains `id`, normalized unique `email`, `password_hash`, and
`created_at`.

`reels` contains the requested normalized fields: `id`, `user_id`, `url`,
`shortcode`, `caption`, `cover_url`, `published_at`, `duration_seconds`,
`views`, `likes`, `comments`, `shares`, `raw_json`, `last_synced_at`,
`created_at`, and `updated_at`.

The database enforces a foreign key to users and uniqueness on
`(user_id, shortcode)`. Indexes cover per-user creation order and stale-sync
queries. Aggregate cards are calculated in SQL with count, coalesced total
views, and the highest-view Reel. Unknown source metrics remain `NULL` and
render as an em dash.

## Reel Import Flow

The server accepts HTTPS Instagram `/reel/{shortcode}` URLs on supported
Instagram hosts, removes query/fragment noise, and stores a canonical URL.
Invalid URLs receive a field-level error before any provider call.

The provider contract accepts a canonical URL and returns one normalized Reel.
Production uses the official Apify client with an actor identifier supplied by
`APIFY_ACTOR_ID`; the chosen actor input and output mapping will be based on its
current official marketplace schema before implementation. `APIFY_TOKEN` is
never exposed to client code. Development uses a deterministic mock provider
only when `APIFY_MOCK=true`; production never silently falls back to fake data.

The server maps actor failures, timeouts, empty datasets, private/deleted Reels,
and rate limits to friendly errors. Successful imports upsert the normalized
row and raw JSON in one user-scoped query. Duplicate imports refresh the same
row. The first import updates the inline dashboard after completion; subsequent
imports run inside the modal, leave background data unchanged while pending,
then close, prepend the Reel, refresh SQL aggregates, and announce success.

A refresh action uses the same provider and upsert path. Automatic refresh only
selects rows whose `last_synced_at` is older than six hours. Manual refresh is
available per Reel and is disabled while pending.

## Interface and Visual System

References one through three are the primary visual source. Use a narrow,
centered white product canvas on a soft blue-gray page, dark navy typography,
electric PifPaf blue, rounded white cards, subtle shadows, generous spacing,
and restrained doodle accents. The landing hero uses an editorial collage of
varied travel, cafe, fashion, interior, nature, and portrait imagery.

Reel cards preserve a true `9 / 16` media ratio, show available date, duration,
views, likes, comments, and shares without inventing values, and prioritize the
cover image. The returning desktop view presents the first clean row and lets
additional cards continue below naturally. Mobile collapses stats and cards to
a single readable column without horizontal page overflow.

References four and five define the compact modal: a dimmed, lightly blurred
dashboard remains visible behind a centered dialog. The dialog traps focus,
has a labeled close button, closes on Escape when idle, restores trigger focus,
and cannot be dismissed during a mutation that would otherwise lose status.
Loading motion respects `prefers-reduced-motion`. All controls have labels,
keyboard focus indicators, disabled states, and live regions for status/errors.

Remote fetched covers render through a constrained HTTPS image path or ordinary
`img` fallback so arbitrary actor domains do not require unsafe wildcard image
configuration. Local reference/demo assets are optimized and checked in.

## States

The implementation must represent these as real transitions:

1. Public landing; CTA routes by authentication state.
2. Login success and failure.
3. Empty dashboard with zero aggregates and a first-URL form.
4. Valid URL with enabled fetch action.
5. First import pending with the URL retained and staged status.
6. First import success with a 9:16 Reel and updated aggregates.
7. Returning dashboard with seeded Reels and account dropdown.
8. Add-another modal over unchanged background data.
9. Modal import pending with read-only URL and status.
10. Successful modal close, prepended card, refreshed aggregates, and toast.
11. Friendly invalid/private/deleted/empty/rate-limit/timeout failures.
12. Sign out returning to the public landing page.

## Testing and Verification

Use Node's built-in test runner for URL normalization, provider normalization,
password hashing, aggregation/query behavior where practical, and error mapping.
Use the existing Next.js lint/build commands for static verification. Add one
small browser-flow suite only if an installed browser test dependency is
already present after scaffolding; otherwise perform and document the requested
manual flow in `LOOP.md` rather than add a large test dependency.

Completion requires:

- migrations and seed succeed against PostgreSQL;
- demo login works and all data remains user-scoped;
- test, lint, and production build commands pass without console/server errors;
- every listed interface state is visually inspected against its reference;
- the full landing-to-sign-out flow is manually exercised; and
- README documents setup, commands, environment, Apify actor configuration,
  architecture, mock behavior, and honest limitations.

`LOOP.md` is the machine-checkable progress ledger. An item moves to Done only
after its named command or manual evidence exists.

## Environment

`.env.example` documents:

- `DATABASE_URL`
- `AUTH_SECRET`
- `APIFY_TOKEN`
- `APIFY_ACTOR_ID`
- `APIFY_MOCK`
- `NEXT_PUBLIC_APP_URL`

No secrets are committed. The seed creates the documented demo account from
fixed non-production credentials and hashes its password at seed time.

## Tradeoffs

Direct SQL is less abstract than an ORM and makes ownership filters and
aggregates reviewable. JWT sessions avoid an Auth.js adapter and extra session
tables for this small internal tool. Server Actions avoid a duplicate REST
layer. The mock provider is explicit rather than automatic, preventing a broken
production integration from appearing successful.
