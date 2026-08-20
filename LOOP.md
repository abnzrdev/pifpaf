# PifPaf delivery loop

Only check an item after recording its evidence here.

## Product states

- [ ] Public landing and auth-aware CTA — evidence: desktop/mobile screenshots
- [ ] Login success and failure — evidence: manual flow + server log
- [ ] Empty dashboard with zero aggregates — evidence: empty-user screenshot + SQL
- [ ] Valid Reel URL enables fetch — evidence: screenshot
- [ ] First import pending retains URL/status — evidence: screenshot
- [ ] First import success updates card/stats — evidence: screenshot + SQL
- [ ] Returning dashboard and account menu — evidence: seeded screenshot
- [ ] Add-another modal over unchanged dashboard — evidence: screenshot
- [ ] Modal pending keeps background unchanged — evidence: screenshot
- [ ] Modal success prepends card/stats/toast — evidence: screenshot + SQL
- [ ] Friendly invalid/private/deleted/empty/rate/timeout errors — evidence: tests + UI
- [ ] Sign out returns to public landing — evidence: manual flow

## Quality gates

- [ ] Domain tests — `npm test`
- [ ] Lint — `npm run lint`
- [ ] Production build — `npm run build`
- [ ] Migration — `npm run db:migrate`
- [ ] Idempotent seed — `npm run db:seed && npm run db:seed`
- [ ] No browser console errors — evidence: browser console capture
- [ ] No server errors — evidence: dev server log
- [ ] Keyboard/focus/Escape/reduced-motion — evidence: manual accessibility pass
- [ ] 390px, 768px, 1440px responsive pass — evidence: screenshots
- [ ] Full landing → sign-out flow — evidence: dated manual run notes

## Done

- 2026-08-20: Design and implementation plan approved.
- 2026-08-20: Generated local editorial image set and six 9:16 WebP crops.

## Next

- Install dependencies and verify the scaffold.
- Implement URL, provider, and password domain logic test-first.

## Blocked

- Real Apify run requires a valid `APIFY_TOKEN`; production integration remains testable by code path and mock locally.
