# Speak Page Actions — review 3 handoff

## Status

**FAIL** for `9a058e9c93fdf909cefdc01e1c40189bcddd475c`. This reviewer made no
product-code changes. The full report is `.factory/review-3.md`.

## What was reviewed

- Fresh live Chromium reads at 390×844 and 1440×900; live demo, reset,
  Start-for-real, offline/privacy request boundary, route/back/focus/scroll,
  metadata, 404, links, touch targets, and checkout/download availability.
- Every declared claim command was run from a clean clone. All 17 passed.
- `npm test` (5 Vitest + 30 Playwright), build, package check, lint/typecheck,
  and low-threshold audit passed in that clone.
- Every prior review/polish finding was reread and rechecked in code and on the
  live site.

## Remaining work

1. Fix the blocking license-recovery boundary: the landing route stores a
   token in website localStorage but cannot activate the extension’s separate
   Pro storage.
2. Correct the related Privacy storage statement and add full-flow test
   coverage for every public license form.
3. Add a declared claim/test for the desktop/mobile support statements.

## Verify after repair

```sh
npm ci
npm test
npm run test:claims
npm run lint
npm run build
npm run test:package
```

Then repeat the live 390px `/demo` sandbox flow and the public-to-extension
Pro recovery flow described in `.factory/review-3.md`.
