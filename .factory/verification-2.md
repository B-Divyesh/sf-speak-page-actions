# Independent verification — FAIL

**Candidate:** `eddeb93ca2cbf01bd4f4aeefe08bcee9da47a3fc`  
**Live URL:** https://speak-page-actions.sociobot.in  
**Verified:** 2026-08-29 from a clean checkout

## Verdict

**FAIL — do not release this candidate unchanged.** The product functions and
the prior deployment-only failure is repaired, but its mobile and extension
touch controls do not meet the mandatory 44 by 44 CSS-pixel accessibility
target for people with limited hand mobility.

## Cold first read

This page says it lets people with limited vision or hand mobility speak a
visible page action and review sensitive clicks. It is for people operating
ordinary browser pages. The first action is **Try it with sample data**, with
the adjacent explanation, “Opens a safe sample page in one click.” The link
opens `/demo`, immediately shows the sample actions and persistent demo banner.
This requirement passes.

## Required claim tests

After `npm ci`, I ran every exact command from `.factory/claims.json` through
the product test/demo entry point. All passed. The tagged browser tests each
started the local Vite demo server.

| Claim IDs | Result |
| --- | --- |
| `sample-action`, `demo-local`, `offline-reload` | PASS |
| `active-tab-only`, `on-device-speech`, `destructive-review`, `undo-local-delete` | PASS |
| `visible-labels`, `password-exclusion`, `push-to-talk`, `pro-aliases` | PASS |
| `core-free`, `page-data-local` | PASS |

The final Playwright result was `17 passed`; each individual command passed.

## Build and package evidence

- `npm ci`: PASS (npm reports 10 transitive dependency audit advisories: 1 low,
  2 moderate, 4 high, 3 critical).
- `npm test`: PASS — 5 unit tests and 17 Playwright tests.
- `npm run test:unit`: PASS — 5 tests.
- `npm run lint` / `npx tsc --noEmit`: PASS.
- `npm run build`: PASS — produces `dist/site/` and `dist/extension/`.
- `npm run test:package`: PASS — fresh consumer validation of
  `dist/site/downloads/speak-page-actions.zip`.
- Initial site assets: JavaScript 11,612 bytes (4,500 bytes gzip), CSS 8,930
  bytes (2,740 bytes gzip), hero WebP 142,630 bytes. All are within budget.

## Live deployment, privacy, and functional evidence

- The fresh live root returned 200 with one h1, title `Speak Page Actions —
  Speak visible page actions`, no console/page errors, and only four
  same-origin requests (HTML, JS, CSS, hero image). There are no trackers or
  third-party fonts/scripts.
- The freshly built `index-BPvIleWq.js` SHA-256 is
  `92796ae8997ed5bdf65f90b863e08939ddef9efea0ff1dbdd77e5adfe5bf28e6`;
  the live asset has the identical hash. The live downloadable ZIP returns 200
  (`application/zip`, 295,748 bytes).
- Live response headers include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive CSP.
  Hashed assets use `Cache-Control: public, max-age=31536000, immutable`.
- On the live demo at 390 px, keyboard focus started at the skip link and every
  sampled control had a visible `rgb(21, 91, 140) solid 3px` outline. An
  unknown command said “No visible action matched. Use a label from the list.”
  A normal command succeeded; a destructive command displayed and accepted its
  confirmation; undo said it restored the action; reset restored four actions.
- The full demo-flow request log contained only
  `https://speak-page-actions.sociobot.in`; its only storage key was
  `demo:spa:sample`. The service worker controlled the page and live `/demo`
  reloaded successfully offline after first load.
- Axe Playwright scans at desktop and 390 px, in light and dark schemes, found
  no serious or critical issues on `/`, `/demo`, `/privacy`, `/terms`, or the
  client-rendered not-found page. All had one h1 and no console/page errors.
- The product has no sign-in. The only server-side product call is optional
  license verification. With an invalid throwaway token, 30 rapid requests
  returned 200 and request 31 returned `429` with `Retry-After: 3` and
  `X-RateLimit-After: 3`. No allowance is documented in the repository; the
  observed allowance was 30 requests in that burst.

## Defects

### High — mobile and extension controls miss mandatory touch-target sizing

The acceptance contract requires every touch target to be at least 44 by 44
CSS pixels. On the live site at 390 px, the header controls measure: Demo
42x20, Download 72x20, and Privacy 54x20. Other actionable controls are Reset
demo 103x31, Start for real 113x26, Have a license? Paste it 198x32, and footer
Privacy/Terms links 51x21/41x21. The packaged extension also styles Scan page
as `min-height:32px`.

This is especially material for the product’s stated audience: people with
limited hand mobility. Increase the interactive hit areas (not merely visual
text) to 44x44 with adequate separation, then add a mobile regression check.

### Medium — unknown URLs return HTTP 200 rather than a real 404

`https://speak-page-actions.sociobot.in/no-such-route` renders the in-app
not-found screen, but returns HTTP 200 because `navigationFallback` rewrites
every unknown route to `index.html` and there is no static 404 response
override. This does not meet the site-structure requirement for a real 404
route/status. Add a styled `404.html` and the appropriate Static Web Apps
`responseOverrides` configuration without breaking SPA routes.

## Acceptance disposition

The candidate is buildable, deployed, private by default in demo use, and its
previous missing-download deployment failure is resolved. It remains **FAIL**
until the high-severity touch-target defect is fixed and independently
rechecked. The HTTP 404 status issue should be repaired in the same release.
