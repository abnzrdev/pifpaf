# PifPaf AI

PifPaf is a small, production-shaped Next.js app for saving public Instagram Reel links and tracking their latest public metrics in one creator dashboard.

## Run locally

Requires Node.js 20.12+ and Docker.

```bash
cp .env.example .env.local
# Generate AUTH_SECRET with: openssl rand -base64 32
npm install
docker compose up -d --wait
npm run db:migrate
npm run db:migrate:test
npm run db:seed
npm run dev
```

Open <http://localhost:3000>. Seeded accounts use the password `PifPafDemo!2026`:

- `demo@pifpaf.ai` — six sample Reels
- `empty@pifpaf.ai` — first-run empty state

## Configuration

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Application PostgreSQL connection |
| `TEST_DATABASE_URL` | Isolated integration-test PostgreSQL connection |
| `AUTH_SECRET` | NextAuth signing secret |
| `NEXTAUTH_URL` | Public application URL |
| `APIFY_TOKEN` | Server-only Apify API token |
| `APIFY_ACTOR_ID` | Actor ID; defaults to `apify/instagram-reel-scraper` |
| `APIFY_MOCK` | `true` uses deterministic local Reel data; set `false` for Apify |

For live data, set `APIFY_MOCK=false` and supply `APIFY_TOKEN`. The integration sends one canonical public Reel URL to the [Apify-maintained Instagram Reel Scraper](https://apify.com/apify/instagram-reel-scraper). Public metrics can change with Instagram and unavailable values are displayed as a dash.

## Commands

```bash
npm test
npm run lint
npm run build
npm start
```

The app uses credentials authentication, PostgreSQL user-scoped Reel storage, and server actions for import and refresh. Dashboard visits refresh at most one Reel older than six hours after the response; each card also has a manual refresh action. Mock mode is explicit and never activates as a silent fallback for a failed live provider call.
