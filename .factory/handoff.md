# Adversarial review 2 handoff — FAIL

**Candidate:** `23d6f893063f7deb2a1f644fd471ea6e8741a359`

**Reviewed URL:** <https://speak-page-actions.sociobot.in>

**Date:** 2026-08-29

## What was done

No product code was changed. `.factory/review-2.md` records a full cold phone
and desktop review, complete landing/README copy audit, one-click demo and
storage checks, all claim commands, prior-finding verification, route/link/
metadata/accessibility checks, missed-leverage review, and verdict.

Result: **FAIL — 8 blocking, 1 major, and 1 minor finding.** The principal
gaps are incomplete desktop installation guidance on a phone-facing page,
lost scroll position after browser Back, and claim tests that bypass actual
packaged-extension behavior or use source-string checks instead of request
logs. Five review-1 findings are reopened as half-fixed.

## How it was verified

From a clean clone at `/tmp/speak-page-actions-review-2.zWFerP`:

```sh
npm ci
# Every exact test command in .factory/claims.json, run separately with CI=1
CI=1 npm test
npm run typecheck
npm run lint
npm run build
npm run test:package
npm audit --audit-level=low
```

All 15 exact claim commands exited zero. The complete suite passed 5 Vitest
and 26 Playwright tests; typecheck, lint, build, package check, and audit also
passed. The live root HTML, JS, CSS, hero art, and service worker match the
candidate by SHA-256.

Live checks used fresh 390×844 and 1440×900 Chromium contexts. The demo showed
four controls and a seeded result on its first phone screen; normal action,
Reset, Start for real, separate storage, same-origin demo requests, and offline
reload were confirmed. `/opt/fleet/lib/verify-url.sh` passed and
`npx @axe-core/cli` reported zero violations. Every public destination link
resolved, and an unknown route returned the designed HTTP 404.

## Evidence

- Full findings and all command results: `.factory/review-2.md`
- Cold phone: `.factory/cold-live-phone-review-2.png`
- Cold desktop: `.factory/cold-live-desktop-review-2.png`
- Phone demo first screen: `.factory/live-demo-390-review-2.png`

## Known gaps and next steps

Resolve every finding in `.factory/review-2.md`, especially F-2-1 through
F-2-8. Add real MV3 popup-to-page claim tests with request recording; do not
count direct storage writes or bundle-string inspection as observable proof.
Then deploy and rerun the complete review from fresh browser contexts. PASS
requires zero findings and no untested claim.
