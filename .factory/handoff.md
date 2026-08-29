# Speak Page Actions — polish 6 handoff

## Result: PASS

The final repair is `fdce4ce29e1a88494a883a6e6e263de8c450d769` on `main`, following the primary safety-boundary repair `8f6f714a33c960f9051526471f5b3b1a82bf2bcd`. Both commits are pushed to `origin/main`.

The static site was deployed through the work-order static deployment configuration to <https://speak-page-actions.sociobot.in>. Final Azure Static Web Apps deployment: `6a8d18c2-0674-45fa-8f91-c732b1904fce`.

## What changed

- Replaced the untrue absolute financial-page exclusion with a precise safety boundary. The extension blocks familiar finance signals in the address, headings, or visible controls, and every visible sign-in form. The UI clearly says not to use it on other banking or financial pages.
- Added realistic boundary coverage: finance heading/control, finance-like host, generic branded sign-in, conservative password-form blocking, `Riverbank` false-positive resistance, and a generic branded post-login page that is not falsely claimed as blocked.
- Replaced the unprovable “website does not store license tokens” statement with the truthful browser-storage boundary. Checkout returns may place a token in the address; the page scrubs it and does not save it in browser storage.
- Added client-only `#license=` support, including an in-place `hashchange` path, alongside the checkout-compatible query return. Both handoffs focus the copy region and preserve empty website storage.
- Updated the claim registry, exact claim tests, README, Privacy copy, copy audit, catalog description, and this handoff. The dithered instruction-card identity and MV3 extension/static-site artifact class are unchanged.

## Verification

Final clean clone: `/tmp/speak-page-actions-polish-6-final-clean.aYMUxi/repo` at `fdce4ce29e1a88494a883a6e6e263de8c450d769`.

- `npm ci`: installed 176 packages; audit reported zero vulnerabilities.
- `CI=1 npm test`: passed 16 Vitest assertions and 38 Playwright tests.
- Every exact command from `.factory/claims.json` was run separately in that final clean clone: `ALL_CLAIMS_PASS 19`. Logs: `/tmp/speak-page-actions-polish-6-final-claims.VmLpc7/`.
- `npm run lint`, `npm run build`, `npm run test:package`, `npm run test:zip-contents`, and `npm audit --audit-level=low`: passed.
- `npm run verify:live`: passed on the final deployment. It checked real routes, title/metadata, first viewport, one-click demo/reset/start, offline reload, focus/history, HTTP 404, security headers, light/dark Axe sweeps, console errors, and exact 23-member live ZIP contents.
- `/opt/fleet/lib/verify-url.sh https://speak-page-actions.sociobot.in ...`: passed with `lang=en`, title, one h1, main, all image alt attributes, no unlabelled buttons, and no console errors.
- Final live token check exercised query, cold fragment, and same-page fragment handoffs. It proved query scrubbing, client-only fragments, no browser-storage writes, and exact financial-boundary copy.
- Lighthouse against the production build: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1.86 s, CLS 0, TBT 134 ms.

Evidence is under `test-results/polish-6/`, including:

- `verify-live-final/cold-check.json`
- `verify-live-final/home-390.png`, `demo-390.png`, `license-return-390.png`, and `404-390.png`
- `verify-url-final/verify.json`
- `live-license-handoff-final-390.png` and `live-privacy-final-390.png`
- `lighthouse/report.json`

## How to run

```sh
npm ci
npm test
npm run build
npm run test:package
```

Try the isolated sample at <https://speak-page-actions.sociobot.in/?demo=1>. On desktop Chrome or Chromium, download the ZIP, unzip it, enable Developer mode at `chrome://extensions`, and use **Load unpacked**.

## Known gaps / next steps

None. AI is intentionally not part of this product: the core job is deterministic and local; sending labels or speech off-device would weaken the privacy boundary.
