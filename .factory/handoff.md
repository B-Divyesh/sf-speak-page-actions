# Polish 1 handoff

## What changed

This repair closes all 23 findings from adversarial review 1 and rechecks the
earlier verification records. The extension now blocks form-owned implicit,
explicit, and image submits until review confirmation; keyboard push-to-talk
works with pointer, Space, and Enter holds; Pro and free claim tests exercise
the packaged MV3 extension storage and page-agent behavior; and privacy claims
are individually declared and tested.

The static site now has plain first-screen wording, a direct `?demo=1` route,
an isolated demo banner with reset and real-start continuation, phone-first
sample controls, route-specific social metadata, a 180px Apple touch icon,
and refreshed legal/copy audit documentation. The dithered instruction-card
visual system is preserved. WXT is updated to 0.21.4 and `npm audit` is clean.

## Run and verify

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run test:package
```

The static deployment artifact is `dist/site/`; its downloadable MV3 ZIP is
`dist/site/downloads/speak-page-actions.zip`. Demo entry points are `/demo`
and `/?demo=1`.

## Exact local evidence

- Clean dependency install: `npm ci`.
- Full test suite: `npm test` — 5 Vitest unit tests and 26 Playwright browser
  tests passed.
- All 15 exact commands in `.factory/claims.json` were run individually after
  the clean install and passed.
- `npm run typecheck`, `npm run build`, and `npm run test:package` passed.
- `npm audit --json` reports 0 low, moderate, high, or critical findings.
- Local static `verify-url.sh` passed at `http://127.0.0.1:4173`: 200, 541ms,
  one h1, main, title/lang/alt/button checks, and no console errors. Evidence:
  `test-results/verify-local/verify.json`.
- Playwright Axe checks report zero serious/critical issues on home, demo,
  Privacy, Terms, and 404 at phone size and in dark mode.
- Lighthouse static preview: Performance 100 and Accessibility 100. Evidence:
  `test-results/lighthouse-local.json`.
- Phone evidence: `test-results/polish-1-home-390.png` and
  `test-results/polish-1-demo-390.png`.

## Deployment and live recheck

Commit and deployment details, plus cold live URL verification, are appended
after the work-order push completes.

## Known gaps

None. The extension still honestly cannot undo server-side actions or actions
after page navigation; this is stated in Terms and is not advertised as an
undo capability.
