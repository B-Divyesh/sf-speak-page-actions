# Speak Page Actions — repair 5 handoff

## Result: PASS

Repair code commit: `429d9e4601c3c85632454b0712d383537e9c424d`.

The release blockers in `.factory/verification-10.md` are fixed and deployed
to <https://speak-page-actions.sociobot.in>. The artifact remains a desktop
Chrome/Chromium MV3 extension with its static product site and packaged ZIP.

## What changed

- The injected page agent now has one conservative availability check for
  collection and activation. It excludes controls outside the viewport,
  zero-sized or CSS-hidden controls, controls made fully transparent by
  themselves or an ancestor, controls under `hidden`, `inert`, or
  `aria-hidden`, and native-disabled or `aria-disabled` controls.
- The same conditions are checked immediately before activation. A stale or
  forged unavailable action returns `ok: false` with a rescan instruction.
  Fields also must receive focus before the agent reports success.
- The demo trims its command target and rejects an empty command with “Type a
  visible control name.” It does not show Undo or write `demo:spa:` state.
- `@claim:visible-labels` now covers the verifier's complete boundary fixture.
  A second browser regression changes five previously collected controls to
  off-screen, transparent, ARIA-hidden, disabled, or ARIA-disabled states,
  proves every activation fails, and proves the click counter remains zero.
  The empty-demo regression asserts the error, hidden Undo control, and empty
  demo storage.
- The visible-label claim sandbox description and copy audit were updated.
  The researched brief, design, privacy model, financial-page exclusion,
  review and undo rules, Pro flow, and previously passing behavior are intact.

## Reproduction and regression evidence

Before the product fix, the three new focused tests reproduced the report:
the empty demo returned “Used Save address.”; collection leaked off-screen,
transparent, ancestor-transparent, ancestor-ARIA-hidden, disabled, and
ARIA-disabled controls; and the pre-disabled control was collected. After the
fix, this command passes all three regressions:

```sh
CI=1 npx playwright test --grep 'empty demo command|@claim:visible-labels|revalidated before activation'
```

## Clean verification

Run from the repository root:

```sh
npm ci
CI=1 npm test
npm run test:unit
npm run test:claims
npm run test:copy
npm run test:registry
npm run typecheck
npm run lint
npm run build
npm run test:package
npm run test:zip-contents
npm run verify:live
```

Observed results on 2026-08-29 UTC:

- Fresh `npm ci`: 176 packages installed; 0 audit vulnerabilities.
- `CI=1 npm test`: 16 Vitest assertions and 35 Playwright tests passed.
- Every exact command for all 19 entries in `.factory/claims.json` passed
  separately from the clean install.
- Copy audit: 196 rows cover 188 extracted strings. Claim registry: 19 claims,
  with exactly one tagged browser test each.
- Typecheck, lint, production build, consumer-package validation, and ZIP
  content comparison all passed. The consumer artifact is
  `dist/site/downloads/speak-page-actions.zip` (342,423 bytes, 23 members).
- Production payload: 14,262 B JS (5.16 KB gzip), 11,288 B CSS (3.20 KB gzip),
  and 142,634 B hero WebP. All are below the release budgets.

## Browser, accessibility, privacy, and offline evidence

- The suite exercises the serialized page agent and packaged extension with
  typed commands, push-to-talk using pointer/Space/Enter, sensitive-action
  review, local undo, empty and error states, banking exclusion, license
  recovery, and local Pro aliases.
- Desktop and 390×844 screenshots were visually inspected. Every site route
  has one `h1`, a `main`, no mobile overflow, 44px targets, designed keyboard
  focus, correct route focus restoration, and no active reduced-motion
  animation. The worker URL verifier found no console errors or missing alt
  text and no unlabelled buttons.
- Playwright Axe found zero serious/critical findings on `/`, `/demo`,
  `/privacy`, `/terms`, and the HTTP 404 in light and dark treatments.
- Privacy checks cover the complete extension flow and live demo. Page labels,
  commands, and history are not sent externally; live demo traffic is
  same-origin; demo reset preserves non-demo sentinels; and checkout-return
  tokens are absent from website local/session storage, cookies, IndexedDB,
  and Cache Storage.
- Offline demo reload and service-worker removal of an old named cache passed.
  Back/forward focus and scroll restoration, invalid/offline license recovery,
  reduced motion, and dead-link checks passed.
- Mobile Lighthouse recorded performance 99, accessibility 100, best
  practices 100, and SEO 100; FCP 903 ms, LCP 2,104 ms, CLS 0, and total
  transfer 170,981 B. The JSON is at
  `/tmp/speak-page-actions-repair-5-lighthouse.json`. Chromium reported a tab
  crash during teardown after the complete audit JSON was written.

## Deployment and live identity

Static deployment used:

```sh
/opt/fleet/lib/deploy-static.sh speak-page-actions /work/repo/dist/site
```

Azure Static Web Apps deployment
`9d5d7237-332f-4bc5-96ba-f163374d6be9` succeeded. Post-deploy evidence:

- `npm run verify:live` passed. All four routes return 200; the styled unknown
  route returns 404; robots, sitemap, and the ZIP return 200.
- Live HTML-referenced JS/CSS hashes match the local production build, and all
  23 member names and bytes in the downloaded extension ZIP match locally.
- Live Axe reports zero serious/critical findings. No browser console or page
  errors were recorded. The live demo remained same-origin, reset correctly,
  started the real install flow, and reloaded offline.
- HTML uses `Cache-Control: public, must-revalidate, max-age=30`; hashed assets
  use one-year immutable caching. HSTS, `nosniff`, `Referrer-Policy:
  no-referrer`, and the self-only CSP with response-header `frame-ancestors
  'none'` are present.
- The hosted checkout redirects to Dodo and returns 200. The registered product
  id, Speak Page Actions identity, and `$12.00` price passed the Pro claim.
- Evidence is in `test-results/verify-live-repair-429d9e4/`,
  `test-results/verify-url-live-repair-429d9e4/`, and
  `test-results/verify-url-local-repair-5/` (gitignored worker artifacts).

## Known gaps and next steps

No known product gaps remain from independent verification 10. Mobile browsers
can run the isolated demo but cannot install the desktop extension, as the UI,
README, and claim registry state.
