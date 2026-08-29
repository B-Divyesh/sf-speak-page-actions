# Speak Page Actions — polish 5 handoff

## Result

All 39 findings from adversarial reviews 1–5 are closed. The final two changes
make each sensitive-action confirmation name the exact control and make live
ZIP verification compare member contents instead of timestamp-sensitive
archive bytes. The direct `/?demo=1` path, first-screen copy, claim registry,
routing, metadata, legal pages, mobile layout, privacy boundary, offline path,
and original dithered-print identity were rechecked and remain intact.

Repair commit: `e47016144a46b39886c0dd805ec9756e26f4936d`<br>
Deployment: `b2ffc133-ff6f-491c-86d9-bb4caaa9202b`<br>
Live URL: <https://speak-page-actions.sociobot.in>

## Verification evidence

- Fresh clone `/tmp/speak-page-actions-polish-5-clean.et8TmZ` at the repair commit.
- `npm ci`: pass, 0 vulnerabilities.
- Every exact `.factory/claims.json` command: pass independently, 18/18.
- `CI=1 npm test`: pass, 11 Vitest and 32 Playwright tests.
- `npm run lint`, `npm run build`, `npm run test:package`, and `npm audit --audit-level=low`: pass.
- `npm run test:zip-contents`: timestamp-only archives compare equal; a changed member is rejected.
- Release output: `dist/extension/` and `dist/site/`; initial site JS 14.05 KB raw / 5.11 KB gzip and CSS 11.29 KB raw / 3.20 KB gzip.
- `BASE_URL=https://speak-page-actions.sociobot.in EVIDENCE_DIR=test-results/polish-5/verify-live npm run verify:live`: pass. It checked four 200 routes, metadata, phone layout, light/dark Axe, demo isolation, license privacy, history focus/scroll, HTTP 404, offline reload, CSP, and all 22 extension members.
- `/opt/fleet/lib/verify-url.sh`: pass in 590 ms with no console errors and valid title, language, h1, main, image alt, and button names.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 20 ms.

Primary evidence: `test-results/polish-5/clean-claims-summary.txt`,
`test-results/polish-5/clean-full-suite.log`,
`test-results/polish-5/extension-confirmation.png`,
`test-results/polish-5/verify-live/cold-check.json`, and
`test-results/polish-5/lighthouse-live.json`. The complete finding map is
`.factory/polish-5.md`.

## Run and verify

```sh
npm ci
CI=1 npm test
npm run lint
npm run build
npm run test:package
npm audit --audit-level=low
BASE_URL=https://speak-page-actions.sociobot.in EVIDENCE_DIR=test-results/verify-live npm run verify:live
```

Deploy the static artifact with:

```sh
/opt/fleet/lib/deploy-static.sh speak-page-actions dist/site
```

## Known gaps and next steps

None.
