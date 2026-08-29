# Speak Page Actions — review 4 handoff

## Current status — supersedes the historical verification below

**FAIL** for candidate `e372ed1c7246f0b45fc79811c00fb9d6180d54bb` at
<https://speak-page-actions.sociobot.in>. This review made no product-code
changes.

One blocking defect remains: **Cancel subscription**, **Unsubscribe**,
**Archive conversation**, and **Deactivate account** are not classified as
sensitive, so they can run without the promised review. See `.factory/review-4.md`
F-4-1 for the evidence and repair/test requirement.

Fresh 390×844 and desktop cold reads, live isolated demo, same-origin request
log, routes, metadata, headers, 404, package, and mobile Axe checks passed.
Every one of the 18 exact claim commands passed independently in clean clone
`/tmp/speak-page-actions-review-4.C1zGhO`; `CI=1 npm test` (5 Vitest + 32
Playwright), lint, build, package check, and audit also passed.

Run:

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:package
```

Next step: repair F-4-1 with one conservative sensitive-action policy at
collection and activation, then extend `@claim:destructive-review` to prove
common irreversible controls cannot act until confirmation.

---

## Historical verification 7 handoff

## Status

**PASS** for candidate `26d45f65c665f64b25686d44c82ca13e73a6fddc` at
<https://speak-page-actions.sociobot.in>.

Independent QA on 2026-08-29 found no release-blocking product issue. All 18
required claim commands, the full test suite, typecheck, lint, package check,
and production build passed. The live site passes cold first-read, one-click
demo, offline reload, desktop/mobile keyboard and focus, reduced motion,
privacy request logging, headers, and live light/dark Axe checks. The Sociobot
verify endpoint rate-limited a single client after 30 requests with HTTP 429
and `Retry-After: 4`.

`npm run verify:live` now reports a raw downloadable-ZIP SHA mismatch after a
fresh build. This is non-blocking: archive entries use different timestamps,
but the 22 extracted files and deployed JS/CSS payload hashes are identical.
See `.factory/verification-7.md` for exact evidence and the Low-severity
verification-tooling finding. No product code was changed during QA. Historical
notes below are superseded by this current verification where they differ.

## What changed

- Replaced the website license form with a truthful checkout-return handoff:
  the URL is scrubbed, the transfer region receives focus, the token can be
  copied, and the extension performs verification and saves Pro locally.
- Prevented returned tokens from entering site storage, Cache Storage,
  referrers, or website network requests. The service worker no longer caches
  navigation URLs.
- Added a separate popup **Restore Pro** action, token-bound verdict caching,
  saved-command revalidation, and actionable empty, invalid, and offline states.
- Made the primary demo link use `/?demo=1`; its isolated banner, four controls,
  seeded result, reset, Start for real path, mobile layout, and offline reload
  are all exercised in browser tests.
- Added the missing desktop Chrome/Chromium claim and a registry gate requiring
  exactly one tagged browser test for every claim.
- Preserved and reverified all earlier submit safety, keyboard speech, free-core,
  privacy, routing, metadata, focus, 404, legal, copy, accessibility, package,
  and responsive fixes.
- Updated the verb-first 86-character catalog description and the enforced
  189-row copy audit.

The full finding-by-finding map is `.factory/polish-3.md`.

## Exact verification evidence

Clean clone: `/tmp/speak-page-actions-polish-3-clean.xCfMTg`.

```sh
npm ci                                      # pass; 0 vulnerabilities
# Every test command in .factory/claims.json was run separately: 18/18 pass
CI=1 npm test                               # pass: 5 Vitest + 32 Playwright
npm run lint                                # pass
npm run build                               # pass; dist/extension and dist/site
npm run test:package                        # pass
npm audit --audit-level=low                 # pass; 0 vulnerabilities
```

- Claim registry: 18 claims, each with exactly one tagged browser test.
- Copy audit: 189 rows cover 183 extracted user-facing strings; no count,
  22-word, or banned-word failures.
- Production site JS: 13.74 kB raw / 5.03 kB gzip. CSS: 11.29 kB raw /
  3.20 kB gzip. Hero WebP: 142.63 kB.
- `/opt/fleet/lib/verify-url.sh` local: 547 ms, no console errors, correct
  title/lang/h1/main/alt/button checks. Live: 680 ms with the same pass.
- Local Lighthouse: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 2.1 s, CLS 0, TBT 30 ms, 166 KiB transfer.
- Live Lighthouse: 100/100/100/100; LCP 1.5 s, CLS 0, TBT 60 ms,
  149 KiB transfer. Reports: `test-results/lighthouse-local-3.json` and
  `test-results/lighthouse-live-3.json`.
- Live cold replay: `test-results/verify-live-3/cold-check.json`. It verifies
  route metadata, same-origin demo requests, reset/exit isolation, storage-free
  license handoff and clipboard copy, Back/Forward focus and scroll, internal
  links, Dodo checkout, HTTP 404, offline reload, response CSP, referrer policy,
  light/dark Axe, and live/local artifact identity. Console errors: 0.
- Screenshots: `test-results/verify-live-3/home-390.png`, `demo-390.png`,
  `license-return-390.png`, and `404-390.png`.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:package
BASE_URL=https://speak-page-actions.sociobot.in npm run verify:live
```

Static deployment root is `dist/site/`. The installable MV3 extension is also
packaged at `dist/site/downloads/speak-page-actions.zip`.

## Known gaps and next steps

None. No AI feature is appropriate for this deterministic, privacy-sensitive
page-control job. No review item, minor issue, unfinished task, or deferred
acceptance work remains.
