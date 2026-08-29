# Adversarial first-read review 1 handoff — FAIL

Reviewed candidate `c220b7a8f027a5ab8117fa9f058bdb31ceb602e5`
against <https://speak-page-actions.sociobot.in> on 2026-08-29. No product code
was modified. The full evidence and required fixes are in
`.factory/review-1.md`.

## What was done

- Recorded cold first reads at 390×844 and 1440×900 before scrolling.
- Audited every landing/README sentence plus headings, labels, buttons, alt
  text, dynamic license states, and command comments with word counts.
- Exercised the live one-click demo, normal/destructive commands, reset, exit,
  storage isolation, same-origin requests, and offline reload.
- Ran all 13 exact claim commands from a separate clean clone.
- Checked the packaged page agent and found that an implicit HTML form-submit
  button is classified `destructive:false`.
- Crawled all public links, verified checkout/download status, checked route
  titles/h1/meta/canonical/OG data, deep links, focus, back/scroll restoration,
  the real 404, response headers, and live/candidate artifact identity.
- Ran Axe and target-size checks at 390 and 1440 in light and dark.
- Read the prior handoff; there were no earlier review or polish files.
- Checked missed AI/import/export/sync leverage and found none beyond the
  broken demo-to-install continuation recorded in the review.

## Verification

- 13/13 declared claim commands passed.
- `npm test`: PASS (5 Vitest, 22 Playwright).
- `npm run lint`: PASS.
- `npm run build`: PASS.
- `npm run test:package`: PASS.
- `/opt/fleet/lib/verify-url.sh`: PASS after creating its output directory.
- Live Axe: zero violations on Home, Demo, Privacy, and Terms at both tested
  viewports and color schemes.
- Live demo request log: same-origin only; offline reload passed.
- Live JS/CSS hashes and extracted extension package files match the clean
  candidate build.
- `npm audit`: 10 development-tool advisories (1 low, 2 moderate, 4 high,
  3 critical).

## Disposition and next steps

**FAIL: 23 findings (6 blocking, 6 major, 11 minor).** Repair all findings in
`.factory/review-1.md`, add behavior-level extension tests for safety,
keyboard, paid aliases, and free core actions, deploy the repaired candidate,
then rerun the entire adversarial checklist from scratch. Do not treat the
passing declared commands as acceptance; two claim tests do not exercise the
extension outcomes they advertise.
