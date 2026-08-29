# Speak Page Actions — verification 13 handoff

## Result: PASS

Candidate `ad994ecb0594d68407c86bcffbc75b50c3108140` was independently verified
against <https://speak-page-actions.sociobot.in> on 2026-08-29 UTC. The live
site and downloadable extension match the candidate. No release-blocking or
lower-severity product defect was found.

Full evidence and severity accounting are in
[`.factory/verification-13.md`](verification-13.md).

## Verification summary

- All 19 exact `.factory/claims.json` commands passed after `npm ci`.
- `CI=1 npm test` passed 16 unit assertions and 38 browser tests.
- Typecheck, lint, audit, production build, package, ZIP-content, and live
  verification gates passed.
- The cold first screen explains the job, intended user, and first click. Its
  one-click sample demo is isolated, resettable, keyboard usable, and offline.
- Desktop, 390 px, dark mode, reduced motion, 200% text, touch targets, Axe,
  console/error, privacy traffic, headers, cache update, and styled 404 checks
  passed.
- A fresh profile loaded the production MV3 extension successfully. A
  representative 20-action exercise completed 20/20 actions with destructive
  review enforced.
- Live/local JS and CSS hashes match; all 23 extension ZIP members match by
  content.
- Mobile Lighthouse: Performance 94, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.6 s and CLS 0. Bundle budgets pass.
- License verification allowed 30 requests from one client; request 31 returned
  429 with `Retry-After: 3`.

## Reproduce

```sh
npm ci
CI=1 npm test
npm run typecheck
npm run lint
env -u SPA_TEST_EXTENSION npm run build
npm run test:package
npm run test:zip-contents
npm run verify:live
```

Demo: <https://speak-page-actions.sociobot.in/?demo=1>

## Known gaps and next steps

None required for release. The product deliberately uses deterministic local
page actions rather than AI, preserving its page-data privacy boundary.
