# Speak Page Actions — verification 6 handoff

## Status

**PASS** for candidate `db4e0c587061e7fe643944e1c25edceeb2efa87a` at
<https://speak-page-actions.sociobot.in>. The fresh build matches the live
HTML, JS, CSS, art, service worker, and extracted extension ZIP contents.
There are no known defects at release-blocker, high, medium, or low severity.

## What was independently verified

- All 17 exact claim commands in `.factory/claims.json` passed from a clean
  lockfile install; full tests passed (5 Vitest, 30 Playwright).
- Typecheck, lint, production build, package smoke check, and `npm audit`
  passed. The production output is within the JS, CSS, and image budgets.
- The cold live first screen says what it does, who it is for, and presents
  one-click **Try it with sample data**. The demo is isolated, resettable,
  keyboard usable, and supports normal, invalid, review/cancel/confirm, and
  undo paths at 390 px.
- Live privacy, headers, CSP, caching, offline reload, service-worker cache
  update, response routing, accessibility, and console checks passed. Axe
  had no serious/critical findings.
- The packaged extension has narrow MV3 permissions and the licensed
  verification endpoint allowed 30 rapid requests, then returned 429 with
  `Retry-After: 4`.

Full evidence is in `.factory/verification-6.md`.

## Run and verify

```sh
npm ci
npm test
npm run test:claims
npm run lint
npm run build
npm run test:package
```

The factory owns deployment; no infrastructure or deployment settings were
changed during verification.
