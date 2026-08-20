# PifPaf delivery loop

Only check an item after recording its evidence here.

## Product states

- [x] Public landing and auth-aware CTA — evidence: inspected 1440×1100 and 390×844 captures on 2026-08-20
- [x] Login success and failure — evidence: real form showed friendly failure then reached `/dashboard`; zero runtime errors
- [x] Empty dashboard with zero aggregates — evidence: inspected 1440×1100 empty-user capture; seed SQL reported 0 / 0
- [x] Valid Reel URL enables fetch — evidence: 1440px browser-flow capture on 2026-08-20
- [x] First import pending retains URL/status — evidence: 1440px browser-flow pending capture
- [x] First import success updates card/stats — evidence: browser capture + SQL-backed UI
- [x] Returning dashboard and account menu — evidence: inspected 1440×1100 six-card capture; SQL reported 6 / 184200
- [x] Add-another modal over unchanged dashboard — evidence: inspected dimmed/blurred modal capture
- [x] Modal pending keeps background unchanged — evidence: inspected pending modal capture
- [x] Modal success prepends card/stats/toast — evidence: capture showed 2 Reels / 64.4K and success toast
- [x] Friendly invalid/private/deleted/empty/rate/timeout errors — evidence: provider/URL tests and disabled invalid UI
- [x] Sign out returns to public landing — evidence: CDP flow ended at `/`

## Quality gates

- [x] Domain tests — evidence: `npm test`, 19 passed / 0 failed on 2026-08-20
- [x] Lint — evidence: `npm run lint`, exit 0 on 2026-08-20
- [x] Production build — evidence: `npm run build`, all routes compiled on 2026-08-20
- [x] Migration — evidence: application and test migrations both exited 0 on 2026-08-20
- [x] Idempotent seed — evidence: two consecutive `npm run db:seed` runs exited 0
- [x] No browser console errors — evidence: full-flow capture reported `errors: []`
- [x] No server errors — evidence: full browser flow completed against the development server
- [x] Keyboard/focus/Escape/reduced-motion — evidence: focus restored=true, pending Escape locked=true; CSS media rule inspected
- [x] 390px, 768px, 1440px responsive pass — evidence: screenshots inspected on 2026-08-20
- [x] Full landing → sign-out flow — evidence: clean empty account → two imports → account menu → `/`, rerun 2026-08-20

## Done

- 2026-08-20: Design and implementation plan approved.
- 2026-08-20: Generated local editorial image set and six 9:16 WebP crops.
- 2026-08-20: Landing visually checked at desktop/mobile; no horizontal overflow observed.
- 2026-08-20: Empty and returning dashboards visually checked against references two and three.
- 2026-08-20: Full empty → two imports → account menu → sign-out browser flow passed with zero console/runtime errors.
- 2026-08-20: Modal Escape closes while idle, restores trigger focus, and stays locked while pending.
- 2026-08-20: Real login form verified wrong-password error and successful demo redirect with zero browser errors.
- 2026-08-20: Added quota-safe post-response refresh for one Reel older than six hours per dashboard visit.
- 2026-08-20: Final SQL state verified: demo 6 Reels / 184,200 views; empty account 0 / 0.

## Blocked

- Real Apify run requires a valid `APIFY_TOKEN`; production integration remains testable by code path and mock locally.
