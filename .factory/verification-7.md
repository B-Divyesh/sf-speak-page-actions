# Independent verification 7 — PASS

**Candidate:** `26d45f65c665f64b25686d44c82ca13e73a6fddc` (`main`)  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Verdict:** **PASS** — no release-blocking product defect found.

## Required first checks

`.factory/claims.json` exists and contains 18 distinct claims. After `npm ci`,
I ran every listed `test` command separately, in order, from this clean
checkout: `sample-action`, `demo-local`, `demo-isolation`, `offline-reload`,
`active-tab-only`, `on-device-speech`, `typed-command`, `destructive-review`,
`undo-local-delete`, `visible-labels`, `password-exclusion`, `push-to-talk`,
`pro-aliases`, `core-free`, `page-data-local`, `extension-local-storage`,
`license-verification`, and `desktop-chromium-only`. All 18 passed. The
registry gate also passed: exactly one tagged browser test per claim.

Cold first-read of the live landing page passes. It says what it does (“Speak
the action you need”), names the intended users (“people with limited vision or
hand mobility”), and supplies a visible first action, **Try it with sample
data**, with the stated result “Opens four sample controls without changing a
real page.” It is one click into `?demo=1`.

## Build and automated verification

| Check | Fresh result |
| --- | --- |
| `npm ci` | Pass; 0 reported vulnerabilities |
| `npm test` | Pass; 5 Vitest and 32 Playwright tests; `test-results/.last-run.json` says `passed` |
| `npm run typecheck` / `npm run lint` | Pass |
| `npm run build` | Pass; fresh `dist/extension` and `dist/site` |
| `npm run test:package` | Pass; packaged extension consumer check |
| `/opt/fleet/lib/verify-url.sh` live | Pass in 791 ms; no console errors; title/lang/h1/main/alt/button checks clear |

The fresh build emitted 13,743 B JavaScript (5,030 B gzip), 11,288 B CSS
(3,200 B gzip), and a 142,634 B hero WebP. Initial JS is below the 200 KB
budget; the hero is below 300 KB. The JS asset is immutable-cached for one year
and the service worker precaches the shell, demo route, hero, and referenced
assets. Its old-cache cleanup test passed.

## Independent live exercise

- Desktop cold load: HTTP 200, zero console/page errors, only same-origin
  document/script/style/image requests.
- At 390×844, `/`, `/demo`, `/privacy`, and `/terms` had no horizontal
  overflow. The demo controls, seeded state, reset, and Start for real worked.
- Demo normal path: `CLICK   SAVE ADDRESS` produced `Used Save address.`
  Invalid `click missing control` produced `No visible action matched. Use a
  label from the list.` Reset removed demo keys.
- The demo request log was same-origin only. Active demo storage was confined
  to `demo:spa:` and Reset left no demo keys.
- After first visit, an offline `/demo` reload displayed “Speak a visible
  control.”
- Keyboard: first Tab focuses “Skip to main content”; its computed focus ring
  is `rgb(21, 91, 140) solid 3px`. Full packaged-extension tests also exercised
  Space/Enter hold-to-talk, review dialog, undo, and route Back/Forward focus.
- Reduced motion computes `scroll-behavior: auto` with zero running animations.
- Axe returned zero serious/critical findings in light and dark at 390px across
  `/`, `/demo`, `/privacy`, and `/terms`; each has one `h1` and one `main`.
- Passed packaged-extension claim tests cover active-tab scope, visible label
  collection, hidden/password exclusion, typed fallback, unavailable-local
  speech recovery, destructive review, undo, local page-data flow, free core,
  and Pro alias restore. Real microphone recognition cannot be asserted in
  headless Chromium; its safe unavailable path and lifecycle were fixture-tested.

## Privacy, headers, and endpoint allowance

Live responses include CSP with `frame-ancestors 'none'`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and HSTS.
There are no third-party fonts or scripts. The live demo emits no third-party
requests. The complete extension page-data claim flow made no external request;
license restore is the explicit exception and sends an encoded token only to
`https://api.sociobot.in/api/v1/products/speak-page-actions/verify`.

With an invalid test token from one client, that verify endpoint returned
200/`valid:false` for requests 1–30. Request 31 returned **429** with
`Retry-After: 4` and `Too Many Requests! Wait for 4s`. Observed allowance:
**30 requests before rate limiting**. There is no sign-in flow.

## Live candidate identity

The live JS and CSS match the fresh candidate build byte-for-byte:

- JS `665a18501b1661255d58413f0e707129e065f7cd71a1416d988a6e6f65b0398e`
- CSS `213d73634c98a70aed786b9484087294547123becc2f7956604fafed26a4b6b9`

Both downloadable ZIPs are 340,922 bytes. Their raw archive hashes differ only
because ZIP entries carry the live deploy time (11:10 UTC) versus the fresh
build time (14:34 UTC). After unpacking, all 22 paths and every file-content
SHA-256 are identical, including manifest, popup/background code, service
worker, icons, and art. The live deployment matches the candidate payload.

## Findings by severity

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low (non-blocking verification tooling):** `npm run verify:live` compares
  raw ZIP SHA-256 values and fails with valid differing timestamp metadata at
  `scripts/verify-live.mjs:170` (live `e375cb…f604e`; fresh `59bc70…6209`).
  Extracted content proves this is not deployment drift. No product code was
  changed under this verifier work order. A future maintenance change should
  compare ZIP member names/contents or create reproducible ZIP timestamps.

## Evidence locations

- `/tmp/speak-verification-7/verify.json`
- `/tmp/speak-live-cold-desktop.png`
- `/tmp/speak-live-focus-7.png`
- `/tmp/speak-live-demo-desktop-7.png`
- `/tmp/speak-live-demo-mobile-7.png`
- `/tmp/speak-live.yQ4Dxw/` (extracted ZIP comparison)
