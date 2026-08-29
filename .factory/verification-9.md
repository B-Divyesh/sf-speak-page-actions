# Independent verification 9 — FAIL

**Candidate:** `a9cbe1d45ff7cea04fb59e85a19cfc5013b21eb3`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Verdict:** **FAIL** — one high-severity safety defect violates the researched
brief's banking-automation non-goal and lets a financial action run with no
review.

## Required first checks

`.factory/claims.json` exists and contains 18 claims. From this clean checkout
I ran `npm ci`, then ran **every exact `test` command** in the registry
individually (`npm test -- --grep @claim:<id>`). All 18 passed:

`sample-action`, `demo-local`, `demo-isolation`, `offline-reload`,
`active-tab-only`, `on-device-speech`, `typed-command`,
`destructive-review`, `undo-local-delete`, `visible-labels`,
`password-exclusion`, `push-to-talk`, `pro-aliases`, `core-free`,
`page-data-local`, `extension-local-storage`, `license-verification`, and
`desktop-chromium-only`.

The cold live first-read gate passes. The first viewport says that people with
limited vision or hand mobility can say or type a visible control name. Its
first action is **Try it with sample data**, with adjacent plain-language
result copy: “Opens four sample controls without changing a real page.” It
opens `/?demo=1` in one click.

## Clean build and automated checks

| Check | Result |
| --- | --- |
| `npm ci` | Pass; 0 reported package vulnerabilities |
| `npm test` | Pass; 11 Vitest and 32 Playwright tests |
| `npm run typecheck` and `npm run lint` | Pass |
| `npm run build` | Pass; creates `dist/extension` and `dist/site` |
| `npm run test:package` | Pass; checks the produced extension consumer ZIP |
| `npm run verify:live` | Pass; see deployment identity below |

The fresh release site is 14,053 B JS (5,133 B gzip) and 11,288 B CSS
(3,206 B gzip), below the 200 KB/50 KB budgets. The hero WebP is 142,634 B.
Hashed live assets use `Cache-Control: public, max-age=31536000, immutable`;
the HTML uses 30-second must-revalidate caching. A mobile Lighthouse run
generated 100/100/100/100 performance/accessibility/best-practices/SEO scores
(LCP 1,502 ms, CLS 0, 152,728 B transfer); the headless browser crashed during
its final screenshot teardown, after the audits completed, so the score is
supporting evidence rather than a passing command exit.

## Product exercise and accessibility

- On both desktop and 390×844 live `/demo`, keyboard input ran `click save
  address`, an invalid command recovered with “No visible action matched. Use
  a label from the list.”, and declining the review for `Delete saved draft`
  produced “The action was not used.”
- First Tab focus is the skip link and its computed focus treatment is
  `rgb(21, 91, 140) solid 3px`. There was no horizontal overflow or
  console/page error in either viewport.
- Live Axe checks in light and dark at phone width found zero serious/critical
  findings on `/`, `/demo`, `/privacy`, `/terms`, and the HTTP 404. The full
  suite separately checked 44px targets, reduced motion, service-worker cache
  update, route focus/scroll restoration, and offline demo reload.
- A fresh live `/demo` became service-worker controlled, then reloaded while
  offline. Reset and Start for real cleared only `demo:spa:` storage.

## Privacy, headers, rate allowance, and deployment identity

The live demo request log contained only
`https://speak-page-actions.sociobot.in` requests. It produced no console or
page errors. The home response includes HSTS, `X-Content-Type-Options:
nosniff`, `Referrer-Policy: no-referrer`, and a response-header CSP with
`frame-ancestors 'none'`; it loads no third-party font or script. The release
manifest has only `activeTab`, `scripting`, and `storage` permissions, and its
only host permission is `https://api.sociobot.in/*`.

The browser-local license handoff was also rechecked: the returned token is
scrubbed from the web URL, focused for copying, and absent from website local
storage, session storage, cookies, IndexedDB, and Cache Storage. There is no
sign-in flow.

The Sociobot license verification endpoint was probed from one client with
distinct invalid tokens. The first 30 requests returned 200/invalid; 50 of an
80-request burst then returned **429** with `Retry-After: 3` or `4` and
`X-RateLimit-After`. Observed allowance: **30 requests before rate limiting**.

After the fresh non-test production build, `npm run verify:live` passed. It
compared the live HTML-referenced asset SHA-256 values with local output and
compared every member name/content in the downloaded extension ZIP. The live
site and the 22-member extension package match candidate `a9cbe1d`.

## Findings by severity

### High — banking action is classified as safe and fires without review

The researched brief explicitly makes banking automation a non-goal and
requires review before destructive actions. A visible control labelled
**Transfer money** is not recognised as destructive:

1. I evaluated the candidate's real `isDestructive`, `commandTarget`, and
   `findAction` functions with that visible action. The result was
   `{ "transferDestructive": false, "commandTarget": "transfer money",
   "matched": "transfer" }`.
2. In the injected page agent, the only review decision is the regex at
   [page-agent.ts](/work/repo/src/lib/page-agent.ts:17), which omits
   `transfer`; collection therefore sets `destructive: false` at
   [page-agent.ts](/work/repo/src/lib/page-agent.ts:64).
3. The popup immediately calls `activate(action)` whenever that flag is false
   at [main.ts](/work/repo/src/entrypoints/popup/main.ts:46). The agent then
   calls `element.click()` without a review at
   [page-agent.ts](/work/repo/src/lib/page-agent.ts:86).

Thus saying or typing “click transfer money” can operate a banking control
without a review and the extension does not exclude banking pages. This is a
release blocker. Fix by excluding banking/financial pages entirely as the
brief requires, or at minimum classifying transfer/wire/withdrawal/deposit and
similar money-moving controls as review-required with coverage in
`.factory/claims.json`; the former is the honest fit for the stated non-goal.

- Critical: none.
- High: banking automation / missing review for `Transfer money` (above).
- Medium: none.
- Low: none.

## Evidence locations

- Exact individual claim-run log: `/tmp/speak-page-actions-claims-a9cbe1d.log`
- Live verifier report/screenshots: `test-results/verify-live-qa-a9cbe1d/`
- Lighthouse JSON: `/tmp/speak-page-actions-lighthouse-a9cbe1d.json`
- Cold live screenshot: `/tmp/speak-live-cold-desktop-a9cbe1d.png`

