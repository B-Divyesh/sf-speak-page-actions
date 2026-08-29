# Speak Page Actions repair-3 handoff

## Status: repaired, deployed, and verified

Repair commit `66bd8e9` closes every finding in independent verification 3 for
candidate `72c328cd73e1abe5f4cb96a9800bfc4a0acf7fcb`. It is deployed at
https://speak-page-actions.sociobot.in through the work order's static Azure
Static Web Apps configuration.

## Repairs

- Added `frame-ancestors 'none'` to the CSP in
  `staticwebapp.config.json` under `globalHeaders`. No CSP meta element is used.
- Replaced the two generic hero facts with exactly three first-screen facts:
  page-label privacy, offline behavior, and the free/$12 one-time price.
- Extended the existing privacy, offline, free-core, and paid-alias claim tests
  to cover those first-screen statements.
- Strengthened the paid claim test to follow the live Sociobot checkout to
  Dodo and assert HTTP 200, approved product `pdt_0NmQKji0raDAsy6yS95UP`,
  product name, and `$12.00` total.
- Added regressions that reject a missing/meta-only `frame-ancestors` policy
  and any first-screen fact count or wording drift. The consumer package gate
  independently enforces the response-header CSP.
- Updated `.factory/claims.json` locations/evidence and the landing copy audit.

Before the repair, direct assertions reproduced both repository defects:
`frame-ancestors` was absent from the response-header CSP and the hero contained
two facts instead of three. The verifier's checkout failure was also confirmed
from its report; after controller registration, the same endpoint returned a
303 redirect to Dodo and a final HTTP 200.

## Clean local verification

- `npm ci`: PASS (401 packages). npm reports 10 development-tool advisories:
  1 low, 2 moderate, 4 high, and 3 critical. There are no shipped runtime
  package dependencies.
- Every one of the 13 exact commands in `.factory/claims.json`: PASS.
- `npm test`: PASS — 5 Vitest unit tests and 22 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; produced `dist/extension/` and `dist/site/`.
- `npm run test:package`: PASS. The downloadable MV3 ZIP has 16 files, no
  persistent content script, and no all-site host permission.
- Production sizes: JS 11,747 B (4.55 KB gzip), CSS 9,453 B (2.83 KB gzip),
  hero WebP 142,634 B.
- Local mobile Lighthouse: performance 99, accessibility 100, best practices
  100, SEO 100; LCP 2.0 s, CLS 0, TBT 10 ms, FCP 0.9 s.

Local browser checks covered desktop and 390 px mobile. All successful routes
had one h1, one main landmark, titles, `lang=en`, complete alt text, no console
errors, and no horizontal overflow. Axe found zero serious/critical issues on
home, demo, privacy, terms, and 404 in light and dark modes. All visible site
and extension controls measured at least 44 by 44 CSS pixels. Tab starts on the
skip link; keyboard Enter runs a demo command; focus is a 3 px solid cobalt
outline. Reduced motion produced no running animation or transition. Demo flow
requests stayed same-origin, reset cleared storage, offline reload succeeded,
and an activated service-worker update removed the old named cache.

## Deployment and live evidence

- Azure Static Web Apps deployment ID:
  `49933966-959f-4282-9bd3-c51bb907b65a` (production, Central US).
- `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, and the
  extension download return HTTP 200. `/no-such-route` returns the styled HTTP
  404 document.
- `/opt/fleet/lib/verify-url.sh` passed: 651 ms load, no console errors,
  title/lang/main/alt/button-name checks all clean.
- Live CSP is delivered as a response header and contains
  `frame-ancestors 'none'`. HSTS, `nosniff`, strict-origin referrer policy, and
  one-year immutable hashed-asset caching are present.
- Live JS SHA-256
  `31d2e714eed4165f8fd0450d159443cdd2c504583b8c241243a28d3315d69865`
  equals the local build. Live CSS SHA-256
  `6c3f6c1cafdd0d0164381c0aad5880f2fd199778abe1693753e9819193506b48`
  also equals the local build. Every extracted live extension file matches
  `dist/extension/`.
- The checkout endpoint redirects to `checkout.dodopayments.com` and finishes
  with HTTP 200. Its page contains the approved Dodo Live product ID, Speak
  Page Actions name, and `$12.00` price. Every link on all live routes returns
  HTTP 200 after redirects.
- License verification returns `{valid:false, reason:"invalid"}` for a
  throwaway token and allows the live product origin through CORS.
- Live 390 px light/dark Axe and touch-target checks passed on all five routes;
  the only console message was Chromium's expected failed-document message for
  the intentional HTTP 404, which was classified separately.
- Live demo normal/error/destructive cancel/destructive confirm/undo/reset,
  keyboard, privacy request log, offline reload, stale-cache removal, and
  reduced-motion checks all passed.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices
  100, SEO 100; LCP 1.6 s, CLS 0, TBT 20 ms, FCP 0.8 s.

## How to verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:package
/opt/fleet/lib/verify-url.sh https://speak-page-actions.sociobot.in /tmp/spa-verify
curl -I https://speak-page-actions.sociobot.in
curl -L https://api.sociobot.in/api/v1/products/speak-page-actions/checkout
```

## Known gaps

No known product or release blockers remain. The npm audit findings are in the
development build toolchain and should be reviewed during the next dependency
maintenance cycle rather than force-upgraded during this scoped repair.
