# Speak Page Actions — repair handoff

## Result: PASS

Repair commit: `f9cf0a3f24acbba580a702307b1bd474d44ca200`.

The release-blocking financial-action bypass in `.factory/verification-9.md`
is fixed and deployed to <https://speak-page-actions.sociobot.in>.

## What changed

- The injected page agent now refuses to collect or activate controls on
  banking and financial pages. It uses clear financial host names, page title,
  description, headings, and money-moving control labels as conservative local
  signals. The policy is checked again immediately before activation.
- Money-moving labels (`transfer`, `wire`, `withdraw`, `deposit`, `pay bill`,
  `add payee`, and related terms) are also review-required as a second safety
  boundary if a page changes or does not identify itself as financial.
- The popup clears the action list and announces the financial-page boundary
  instead of offering a generic empty state. It cannot run a typed command
  after that boundary is returned.
- Added the explicit `financial-page-exclusion` claim and a financial fixture.
  Its exact test drives both the serialized injected agent and the packaged
  MV3 popup, proves **Transfer money** is neither listed nor clicked, and
  asserts its click count stays zero.
- Added the same plain-language limit to the landing page, Privacy, README,
  and copy audit. Existing ordinary-page behavior, demo data, privacy model,
  and Pro flow are unchanged.

## How to run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:package
npm run test:zip-contents
npm run verify:live
```

The new regression is:

```sh
npm test -- --grep @claim:financial-page-exclusion
```

## Verification evidence

- Fresh `npm ci` completed with 0 reported package vulnerabilities.
- `npm test` passed: 16 Vitest checks and 33 Playwright checks. All **19**
  exact commands in `.factory/claims.json` also passed individually from the
  clean install, including `@claim:financial-page-exclusion`.
- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:package`,
  and `npm run test:zip-contents` passed. The consumer artifact is the MV3 ZIP
  at `dist/site/downloads/speak-page-actions.zip`.
- Browser coverage includes extension popup flows, desktop Chromium, 390×844
  mobile layout, keyboard skip link plus Space/Enter push-to-talk, review
  dialog, reduced motion, 44px targets, no overflow, and no console errors.
- Accessibility: Playwright Axe found zero serious/critical findings on `/`,
  `/demo`, `/privacy`, `/terms`, and 404 in light and dark themes. The worker
  URL verifier passed locally and live: title, `lang`, one `h1`, `main`, image
  alt text, labelled buttons, and no browser errors.
- Privacy/offline/update coverage passed: same-origin demo requests, no page
  labels/spoken commands/history requests, browser-local extension storage,
  scrubbed website checkout tokens, offline demo reload, and old service-worker
  cache removal.
- A mobile Lighthouse artifact at
  `/tmp/speak-page-actions-repair-lighthouse.json` recorded 100/100/100/100
  for performance/accessibility/best-practices/SEO, 1,862 ms LCP, 0 CLS, and
  170,909 B transfer. Chrome reported a screenshot-teardown crash only after
  the audit results were written; the independent Playwright checks above
  completed cleanly.
- Production deployment used
  `/opt/fleet/lib/deploy-static.sh speak-page-actions /work/repo/dist/site`
  (Azure Static Web Apps deployment `541fa760-1146-4e6f-b5ed-c47415cf7300`).
  `npm run verify:live` passed after deployment; it found 200 responses and
  zero serious Axe findings on all four routes, offline demo reload, response
  CSP with `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, no console
  errors, and exact local/live hashes for site assets and all 23 ZIP members.
  Evidence: `test-results/verify-live-repair-f9cf0a3/cold-check.json` and
  `test-results/verify-url-live-f9cf0a3/verify.json`.

## Known gaps and next steps

No known product gaps. The product remains a desktop Chrome/Chromium MV3
extension; mobile browsers are supported only for the isolated demo, as
documented.
