# Independent verification 8 — PASS

**Candidate:** `3ca8320cd001f2bfe04dee4ed03cd0c67450d8c3`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Verdict:** **PASS** — the deployed extension/site payload matches the candidate and no release-blocking defect was found.

## Required first checks

`.factory/claims.json` exists with 18 claims. From this clean checkout, after
`npm ci`, I executed every listed command individually via the product demo
entry point. All exited 0:

`sample-action`, `demo-local`, `demo-isolation`, `offline-reload`,
`active-tab-only`, `on-device-speech`, `typed-command`,
`destructive-review`, `undo-local-delete`, `visible-labels`,
`password-exclusion`, `push-to-talk`, `pro-aliases`, `core-free`,
`page-data-local`, `extension-local-storage`, `license-verification`, and
`desktop-chromium-only`.

Evidence: `/tmp/speak-claim-exact-results.log` ends `OVERALL 0`. The registry
gate confirms exactly one tagged browser test per claim.

Cold first-read of the live home page passes. In plain words it says it lets
people with limited vision or hand mobility say or type a visible control
name, and its first action is **Try it with sample data**. The adjacent copy
says it opens four sample controls without changing a real page. The action
goes directly to `/?demo=1`.

## Clean build and automated checks

| Check | Result |
| --- | --- |
| `npm ci` | Pass; 0 package vulnerabilities reported |
| `npm test` | Pass; 5 unit and 32 Playwright tests; `test-results/.last-run.json` is `passed` |
| `npm run typecheck` and `npm run lint` | Pass |
| `npm run test:unit`, `npm run test:copy`, `npm run test:registry` | Pass |
| `npm run build` | Pass; creates `dist/extension` and `dist/site` |
| `npm run test:package` | Pass; unpacked MV3 consumer archive verified |

Final production output is 14,053 B JavaScript (5,110 B gzip), 11,288 B CSS
(3,200 B gzip), and a 142,634 B hero WebP. These are within the stated static
product budgets. Hashed JS/CSS are `Cache-Control: public, max-age=31536000,
immutable`; HTML, service worker, artwork, and ZIP use a 30-second
must-revalidate policy.

## Live product exercise

- The 390×844 and desktop `/demo` loads had no console/page errors, horizontal
  overflow, undersized interactive controls, or non-same-origin demo request.
- Normal typed input returned `Used Save address.`; an unknown command returned
  `No visible action matched. Use a label from the list.` The destructive
  sample action presented review; cancellation reported `The action was not
  used.` Reset and Start for real cleared only `demo:spa:` storage.
- A first-visit live `/demo` reload succeeded offline after service-worker
  control. The automated suite also passed its named-cache update/cleanup
  check.
- Keyboard first focus reaches the skip link. A live focus check found the
  designed `rgb(21, 91, 140) solid 3px` focus outline. Reduced motion had no
  active animations/transitions.
- Playwright Axe on live `/`, `/demo`, `/privacy`, `/terms`, and the HTTP 404,
  in light and dark at 390px, found zero serious/critical issues. Each page
  has one `h1` and one `main`.
- `/opt/fleet/lib/verify-url.sh` passed against the live home page: HTTP 200,
  title/lang/main/alt/button checks clear, and zero console errors (806 ms).

## Privacy, security, and deployment identity

The demo request log contained only `https://speak-page-actions.sociobot.in`.
The live responses send HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: no-referrer`, and CSP including `frame-ancestors 'none'`.
There are no remote fonts/scripts. Extension claim coverage verifies local
page-data flow, password exclusion, active-tab packaging, local extension
storage, typed fallback, local-recognition failure recovery, review, and undo.
There is no sign-in flow.

The product verification endpoint was tested from one client with an invalid
token: requests 1–30 returned 200/invalid; request 31 returned **429** with
`Retry-After: 2` (request 32 remained 429). Observed allowance: **30 requests
before rate limiting**.

After the final production build, live JS and CSS SHA-256 values matched the
local candidate output exactly. The downloadable live ZIP has timestamp-
dependent archive bytes, but after extraction its file list and every member
SHA-256 matched the fresh candidate ZIP exactly. This confirms deployment
matches candidate `3ca8320`.

## Findings by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Evidence

- `/tmp/speak-claim-exact-results.log`
- `/tmp/speak-verify-url-2zcGU1/verify.json`
- `/tmp/speak-live-cold.png`
- `/tmp/speak-live-desktop-demo.png`
- `/tmp/speak-live-mobile-demo.png`
- `/tmp/speak-final-local-*` and `/tmp/speak-final-live-*` (extracted ZIP comparison)
