# Speak Page Actions — polish 4 handoff

## Status

**PASS.** The cumulative review findings F-1-1 through F-4-1 are closed in
repair commit `5ea528baf9ed14ecee0665c11301fc5c5acc3f26` and deployed to
<https://speak-page-actions.sociobot.in>.

The final defect was a safety boundary: account-ending controls could bypass
review. The injected page agent now applies one conservative label policy at
both collection and activation. It covers cancellation of subscriptions/plans,
unsubscribe, archive, deactivate, close account, terminate account, plus the
existing submit/delete/publish/send/pay controls. The public home, Privacy,
README, claims registry, and test now describe the same policy.

## What changed

- Added the conservative review matcher in `src/lib/page-agent.ts`, shared by
  action collection and activation.
- Expanded the real packaged-popup fixture and `@claim:destructive-review`.
  It proves implicit/explicit submit plus delete, send, pay, cancel
  subscription, unsubscribe, archive, deactivate account, close account, and
  sign out do not fire before confirmation and do fire after it.
- Documented the policy in landing, Privacy, README, the copy audit, and the
  claim registry without changing the dithered print visual system.
- Preserved/rechecked the direct `?demo=1` sandbox, reset/exit isolation,
  titles/metadata/routing/focus/404/legal pages, mobile first screens, local
  storage/privacy boundaries, the extension ZIP, and accessibility behavior.
- Updated the catalog description to the verb-first sentence: “Review visible
  browser controls by voice or typing before sensitive actions.”

## Exact verification evidence

Clean clone: `/tmp/speak-page-actions-polish-4-clean.YQ8KAD`.

```sh
npm ci                                      # pass; 0 vulnerabilities
# 18 exact .factory/claims.json commands, each run independently
# result: ALL_CLAIMS_PASS 18
CI=1 npm test                               # pass: 5 Vitest + 32 Playwright
npm run lint                                # pass
npm run build                               # pass; dist/extension and dist/site
npm run test:package                        # pass
npm audit --audit-level=low                 # pass; 0 vulnerabilities
```

- Claim registry: 18 claims, one tagged browser test per claim.
- Copy audit: 190 rows cover 184 extracted user-facing strings; every count,
  banned-term, and 22-word check passes.
- Local verifier: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/`
  passed in 555 ms with no console errors, `lang=en`, one h1, main, image alt,
  and button-name checks.
- Local Lighthouse: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 2.105 s, CLS 0, TBT 29 ms, 170,772 B transfer.
  Report: `test-results/polish-4/lighthouse-local.json`.
- Phone screenshots: `test-results/polish-4/home-390-first-screen.png` and
  `test-results/polish-4/demo-390-first-screen.png`.
- Static deployment: Azure Static Web Apps deployment
  `af632617-33d0-4a9a-84be-e3fc97d46e32` completed successfully to
  `blue-island-0407bcf10.7.azurestaticapps.net`, then custom-domain TLS
  returned 200.
- Live verifier:
  `BASE_URL=https://speak-page-actions.sociobot.in EVIDENCE_DIR=test-results/polish-4/verify-live npm run verify:live`
  passed. It confirms all four routes/metadata, light/dark Axe, no console
  errors, one-click demo, same-origin demo requests, reset/exit isolation,
  history focus/scroll, storage-free license handoff, offline reload, HTTP
  404, response headers, and byte-identical deployed JS/CSS/ZIP artifacts.
- Live URL verifier:
  `/opt/fleet/lib/verify-url.sh https://speak-page-actions.sociobot.in/`
  passed in 614 ms with no console errors. Evidence:
  `test-results/polish-4/verify-url-live/verify.json`.
- Fresh live policy recheck: `test-results/polish-4/live-cold-recheck.json`;
  home policy text, direct demo banner/four controls, Privacy policy, and
  styled HTTP 404 all pass in a new browser context.
- Full finding map: `.factory/polish-4.md`.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:package
/opt/fleet/lib/deploy-static.sh speak-page-actions dist/site
```

The static deployment root is `dist/site/`. The installable MV3 extension ZIP
is `dist/site/downloads/speak-page-actions.zip`.

## Known gaps and next steps

None. No AI feature is appropriate for this deterministic, privacy-sensitive,
local-first page-control tool.
