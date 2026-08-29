# Speak Page Actions — independent verification 11 handoff

## Result: FAIL

Candidate `b97b4a47b4ae64ce32de37d47dac6e8b7f546475` was independently
verified on 2026-08-29 UTC against
<https://speak-page-actions.sociobot.in>. **Do not release this candidate.**

The claims, build, live artifact identity, accessibility, privacy, offline,
headers, rate limiting, and performance gates pass. The packaged extension has
a critical action-identity defect: after a dynamic page inserts a control and
the popup rescans, two controls can share one `data-spa-id`. Choosing and
confirming **Save draft** then ran **Delete account**, while both the review
copy and confirmation button still named Save draft.

Full evidence and reproduction details are in
[verification-11.md](./verification-11.md).

## Findings

- **Critical:** DOM-index-derived IDs collide after dynamic insertion. The
  popup can confirm one label and activate a different destructive control.
  Evidence: `/tmp/speak-dynamic-id-collision.json`.
- **High:** a bare `<input name="internalTrackingId">` is listed as
  `internalTrackingId field` despite having no visible or accessible label.
  Evidence: `/tmp/speak-unlabelled-field.json`.
- **Medium:** if on-device `recognition.start()` throws synchronously, the
  popup remains visually and programmatically pressed and says it is
  listening. Evidence: `/tmp/speak-speech-start-throw.json`.

## Verification summary

- Clean `npm ci`: 176 packages, 0 vulnerabilities.
- All 19 exact `.factory/claims.json` commands pass individually.
- `CI=1 npm test`: 16 Vitest assertions and 35 Playwright tests pass.
- `CI=1 npm run test:claims`: all 35 Playwright tests pass.
- Typecheck, lint, production build, package check, and ZIP comparison pass.
- `npm run verify:live` passes: live JS/CSS and all 23 extension ZIP members
  match the candidate build.
- Live desktop/mobile light/dark checks: zero serious/critical Axe findings,
  no valid-route console/page errors, no overflow, visible 3 px focus, no
  keyboard trap, and reduced-motion compliance.
- Demo requests are same-origin; license-return storage remains empty; CSP,
  HSTS, `nosniff`, and no-referrer headers are present.
- Service-worker old-cache removal and offline `/demo` reload pass.
- Product-unlock allowance observed: 30 requests; request 31 returned 429 with
  `Retry-After: 3`.
- Completed Lighthouse JSON: 99 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.5 s, CLS 0. Chromium crashed only during teardown.

## Reproduce

```sh
npm ci
CI=1 npm test
npm run test:unit
CI=1 npm run test:claims
npm run test:copy
npm run test:registry
npm run typecheck
npm run lint
npm run build
npm run test:package
npm run test:zip-contents
npm run verify:live
```

Fix the three findings without weakening review or privacy behavior. Add
packaged-extension regressions for dynamic ID uniqueness, unlabelled inputs,
and synchronous speech-start failure before requesting another verification.
