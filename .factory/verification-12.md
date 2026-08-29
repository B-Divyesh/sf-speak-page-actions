# Independent verification 12 — PASS

**Candidate:** `7648ba8cb18037f7443ab5f46d4c78cf3abe7fb6`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Verified:** 2026-08-29 UTC from a clean checkout  
**Verdict:** **PASS — candidate is acceptable for release.**

## Mandatory first checks

`.factory/claims.json` is present and declares 19 claims. After `npm ci` (176
packages, 0 vulnerabilities), every exact `test` command in the registry was
run separately from the clean checkout. All passed: `sample-action`,
`demo-local`, `demo-isolation`, `offline-reload`, `active-tab-only`,
`on-device-speech`, `typed-command`, `destructive-review`,
`financial-page-exclusion`, `undo-local-delete`, `visible-labels`,
`password-exclusion`, `push-to-talk`, `pro-aliases`, `core-free`,
`page-data-local`, `extension-local-storage`, `license-verification`, and
`desktop-chromium-only`.

The cold live first read passes. The first viewport says it lets a person
“say or type a visible control’s name,” identifies people with limited vision
or hand mobility, and makes **Try it with sample data** the clear first click.
Its adjacent plain-language outcome says it opens four sample controls without
changing a real page. One click opens `/?demo=1`, showing the persistent
“Demo — sample data, nothing is saved” banner, four realistic seeded controls,
**Reset demo**, and **Start for real**.

No unlisted material product claim was found in the live landing page or
README: the privacy, offline, local speech, scope, safety, pricing, and demo
claims map to the registered claim tests.

## Repository and production build

| Check | Result |
| --- | --- |
| `npm ci` | Pass; 176 packages installed, 0 vulnerabilities |
| all 19 exact claim commands | Pass individually |
| `CI=1 npm test` | Pass; 16 Vitest assertions and 38 Playwright tests |
| `npm run test:unit` | Pass; 16/16 |
| `CI=1 npm run test:claims` | Pass; 38/38 |
| `npm run test:copy` | Pass; 198 rows cover 188 extracted strings |
| `npm run test:registry` | Pass; 19 claims, one tagged browser test each |
| `npm run typecheck` / `npm run lint` | Pass |
| `env -u SPA_TEST_EXTENSION npm run build` | Pass; emits `dist/site` and `dist/extension` |
| `npm run test:package` / `npm run test:zip-contents` | Pass |
| `npm run verify:live` | Pass |

The final production build uses only the `https://api.sociobot.in/*` host
permission. Its initial site payload is 14,262 B JavaScript (5,188 B gzip),
11,288 B CSS (3,212 B gzip), and a 142,634 B hero WebP: all within the stated
budgets. The downloadable extension has 23 ZIP members.

`npm run verify:live` confirmed the live hashed JavaScript/CSS and every ZIP
member byte-for-byte against that final production build. An earlier local
comparison failed only because Playwright deliberately rebuilt `dist/` with
its test-only `http://127.0.0.1:4173/*` permission; rebuilding production
after the test suite removed it and the live comparison passed. This was a
local test-artifact ordering issue, not live deployment drift.

## End-to-end, accessibility, and privacy evidence

- Normal live demo use returned **“Used Save address.”** at 1440×900 and
  390×844. A 1,024-character unmatched command returned **“No visible action
  matched. Use a label from the list.”**; Reset demo then left no `demo:spa:`
  keys. The complete demo request log remained same-origin.
- The packaged-extension suite exercised typed fallback when on-device speech
  is absent; pointer, Space, and Enter push-to-talk; review and confirmation
  for every documented sensitive action; financial-page and password
  exclusions; local delete undo; free core actions; Pro aliases; malformed and
  offline license recovery; stable action identity after DOM changes; labelled
  field filtering; and truthful recovery after a speech-start exception.
- Live `/`, `/demo`, `/privacy`, and `/terms` each returned 200 with one `h1`,
  one `main`, matching metadata, no serious/critical Axe findings, no console
  or page errors, and no horizontal overflow. The real unknown route returned
  the styled HTTP 404. Dark-mode scans and an offline `/demo` reload also
  passed.
- At desktop and 390 px, the first Tab reached **Skip to main content**. Its
  visible focus indicator was `3px solid rgb(21, 91, 140)`. Reduced-motion
  emulation had zero running animations and `scroll-behavior: auto`; all
  tested controls meet the 44 px target test. `/opt/fleet/lib/verify-url.sh`
  also passed (200 in 628 ms; `lang=en`, title, h1, main, alt text, and
  unlabelled-button checks clean).
- Live demo traffic was same-origin only. License-return testing removed the
  token from the URL and kept it out of the website’s local/session storage,
  cookies, IndexedDB, and Cache Storage. The complete packaged-extension
  privacy claim covers scanning, typed/speech commands, review, undo, and no
  external page-data requests.
- Headers include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, and the response-header CSP with
  `frame-ancestors 'none'`. HTML uses `max-age=30`; hashed JavaScript uses
  `public, max-age=31536000, immutable`. No third-party font or script loaded.
- The only server-side endpoint in scope is license verification. From one
  client, invalid verification requests 1–30 returned 200; request 31 and the
  immediate follow-up returned **429** with **`Retry-After: 3`**. Observed
  allowance: **30 requests**.

The CLI Lighthouse invocation could not launch Chromium as root in this
container despite an explicit `--no-sandbox` request (the launcher discarded
the flag). It is not recorded as a passing Lighthouse score. The actual
bundle-budget measurements, route-level Axe scans, responsive checks, and
browser performance smoke checks above all pass.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Evidence locations

- `test-results/verify-live-12/cold-check.json` and its 390 px screenshots
- `/tmp/speak-verify-url-12/verify.json`
- `/tmp/speak-live-12.zip` and `/tmp/speak-live-12-manifest.json`

