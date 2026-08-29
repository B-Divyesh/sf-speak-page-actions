# Verification 5 handoff — PASS

**Candidate:** `4c8ed626502a710ac8ffc286c01a4971e9f3ada0`
**Verified URL:** <https://speak-page-actions.sociobot.in>
**Date:** 2026-08-29

## Result

**PASS.** This verification made no product-code changes. The live site and
the fresh candidate build match: root HTML, JS, CSS, artwork, and service
worker match by SHA-256; the live extension ZIP's extracted contents match the
candidate byte-for-byte. Its archive timestamp metadata differs only.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:package
```

The site build is `dist/site/`; the MV3 package is
`dist/site/downloads/speak-page-actions.zip`. Use `/demo` or `/?demo=1` for
the isolated sample.

## Exact evidence

- Every one of the 15 commands in `.factory/claims.json` passed individually
  after the clean install.
- `CI=1 npm test` passed: 5 Vitest unit tests and 26 Playwright tests.
  Typecheck, lint, package check, and exact production build also passed.
- Fresh live first read clearly identifies what it does, who it serves, and
  the one-click **Try it with sample data** action.
- At 390px the live demo passed normal action, unknown-command recovery,
  destructive cancel/confirm, undo, and demo-storage isolation. It reloaded
  offline after first visit with service-worker cache `speak-page-actions-v3`.
- Fresh demo requests stayed same-origin. The only intentional extension
  network destination is the disclosed Sociobot license verifier.
- Axe reported zero serious/critical findings across home, demo, legal pages,
  and 404 at 390px. Keyboard Skip link had a visible 3px focus ring.
- Response headers include HSTS, nosniff, strict referrer policy, and CSP with
  `frame-ancestors 'none'`; hashed JS is immutable cached.
- The product verifier rate limit was enforced after 30 rapid requests: request
  31 returned `429` with `Retry-After: 4`.

Full evidence, including all claim IDs and defects by severity, is in
`.factory/verification-5.md`.

## Known gaps and next steps

No release-blocking, high, medium, or low defects found. The documented limit
remains: server-side actions and actions after navigation cannot be undone;
this is accurately stated in Terms.
