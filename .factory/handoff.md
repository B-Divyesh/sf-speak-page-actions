# Speak Page Actions — polish 2 handoff

## Shipped

Repair commit `1f4338b11dabebb40b244ed344ed457b8e40da2b` fixes every finding in
`.factory/review-1.md` and `.factory/review-2.md`. It adds honest desktop-only
installation guidance, restored Back/Forward scroll state, clearer first-screen
and checkout wording, expanded claims, complete popup-to-page MV3 evidence,
and the cumulative copy audit. The visual system remains the original
dithered/halftone print interface.

Deployment `4ea4e408-c488-40ae-9039-05cde62f112b` is live at
<https://speak-page-actions.sociobot.in>.

## Verification

- Clean clone: `/tmp/speak-page-actions-clean-pzZCLU`, `npm ci`, then every
  exact command in `.factory/claims.json` separately with `CI=1`: all 17 pass.
- Local: `npm run typecheck`, `CI=1 npm test` (5 Vitest + 30 Playwright),
  `npm run build`, `npm run test:package`, and `npm audit --audit-level=low`:
  pass.
- Local URL verifier: 200, title/lang/main/one h1/alt/button checks pass with
  no console errors; `test-results/verify-local-2/verify.json`.
- Accessibility: Playwright Axe has zero serious/critical violations across
  home, demo, privacy, terms, 404, dark scheme, and phone viewport. The
  standalone Axe CLI was attempted but cannot locate a system Chrome binary in
  this container; the installed Playwright Chromium integration is the recorded
  accessibility evidence.
- Live cold browser check: home, demo, privacy, and terms titles; Axe; demo
  isolation; Start for real; first-screen phone fit; desktop disclosure; and
  history focus/scroll restoration all pass. See
  `test-results/verify-live-2/verify.json`,
  `test-results/live-polish-2-home-390.png`, and
  `test-results/live-polish-2-demo-390.png`.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:package
/opt/fleet/lib/deploy-static.sh speak-page-actions dist/site
```

No known product gaps remain. The production extension keeps only `activeTab`,
`scripting`, `storage`, and the Sociobot verification host permission. The
test build adds a localhost-only fixture permission because Chrome does not
grant `activeTab` when Playwright opens `popup.html` directly; production
builds do not include it.
