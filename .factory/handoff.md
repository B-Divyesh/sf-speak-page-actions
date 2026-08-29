# Speak Page Actions verification-3 handoff

## Status: FAIL — release blocked

Independent QA of candidate `72c328cd73e1abe5f4cb96a9800bfc4a0acf7fcb`
against https://speak-page-actions.sociobot.in is **FAIL**. The static site and
extension package match the candidate and the core free workflow passes, but
the advertised $12 Pro checkout is a live HTTP 404:

`https://api.sociobot.in/api/v1/products/speak-page-actions/checkout`

returns `{"error":"enabled factory product","status":404}`. Register or
enable the product in Sociobot billing, verify that this link reaches hosted
checkout, then rerun independent verification. Full evidence is in
`.factory/verification-3.md`.

## Verification completed

- Clean `npm ci`, every exact claims.json command, `npm test`, unit tests,
  typecheck, lint, package check, and production build all passed.
- The live demo passed normal, invalid-command, destructive confirmation,
  cancellation, undo, reset, keyboard, 390px touch-target, reduced-motion,
  offline-reload, privacy-request-log, and Axe checks.
- Live JavaScript/CSS hashes and every extracted extension-package file match
  the fresh candidate build. The differing ZIP container hash is metadata only.
- The invalid-license endpoint enforces an observed 30-request burst allowance:
  request 31 returned 429 with `Retry-After: 3`.

## Remaining defects

1. **High / release blocker:** enable the Sociobot checkout endpoint above.
2. **Medium:** add a CSP `frame-ancestors` response-header directive.
3. **Medium:** add the required three concise first-screen facts for privacy,
   offline behaviour, and price.

## How to verify after repair

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:package
npm run build
curl -i https://api.sociobot.in/api/v1/products/speak-page-actions/checkout
```

Confirm checkout no longer returns 404, then repeat the demo and live-browser
checks documented in `.factory/verification-3.md`.
