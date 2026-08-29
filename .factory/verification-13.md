# Independent verification 13 — PASS

**Candidate:** `ad994ecb0594d68407c86bcffbc75b50c3108140`  
**Live URL:** <https://speak-page-actions.sociobot.in>  
**Verified:** 2026-08-29 UTC from the clean candidate checkout  
**Verdict:** **PASS — candidate is acceptable for release.**

## Mandatory gates

`.factory/claims.json` is present with 19 entries. After the clean install,
every exact `test` command was run separately. All 19 passed:
`sample-action`, `demo-local`, `demo-isolation`, `offline-reload`,
`active-tab-only`, `on-device-speech`, `typed-command`, `destructive-review`,
`financial-signal-block`, `undo-local-delete`, `visible-labels`,
`password-exclusion`, `push-to-talk`, `pro-aliases`, `core-free`,
`page-data-local`, `extension-local-storage`, `license-verification`, and
`desktop-chromium-only`.

The cold first-read gate passes. The first viewport says **“Speak the action
you need,”** identifies people with limited vision or hand mobility, and makes
**Try it with sample data** the clear first action. The adjacent sentence says
that it opens four sample controls without changing a real page. One click
opened `/?demo=1`, displayed **“Demo — sample data, nothing is saved,”** four
seeded controls, **Reset demo**, and **Start for real**. No unlisted material
claim was found in the live copy or README.

## Clean checkout and build evidence

| Check | Fresh result |
| --- | --- |
| `git rev-parse HEAD` | `ad994ecb0594d68407c86bcffbc75b50c3108140` |
| `npm ci` | Pass; 176 packages, 0 vulnerabilities |
| 19 exact claim commands | Pass individually |
| `CI=1 npm test` | Pass; 16 Vitest assertions and 38 Playwright tests |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm audit --audit-level=low` | Pass; 0 vulnerabilities |
| `env -u SPA_TEST_EXTENSION npm run build` | Pass; emits `dist/site` and `dist/extension` |
| `npm run test:package` | Pass; downloadable ZIP is consumable |
| `npm run test:zip-contents` | Pass |
| `npm run verify:live` | Pass |
| `/opt/fleet/lib/verify-url.sh` | Pass; 200 in 653 ms, no console errors |

The production extension is MV3 and requests only `activeTab`, `scripting`,
`storage`, and the Sociobot license-verification host. Loading that release
package in a fresh Chromium profile produced the expected popup title and h1,
a useful no-page recovery message, no serious/critical Axe findings, no
undersized controls, and no console or page errors. The full packaged-extension
suite additionally exercised real popup-to-page messaging, typing, push-to-talk
with pointer/Space/Enter, destructive confirmation, stale targets, local undo,
financial/sign-in blocking, aliases, and license recovery.

An independent 20-action fixture included buttons, links, labelled fields,
selects, checkbox/radio controls, custom roles, and a destructive action. The
agent enumerated all 20 and invoked 20/20 (100%); the destructive action required
confirmation. This exceeds the brief's 85% success target for the representative
set.

## Live deployment and end-to-end evidence

- `npm run verify:live` reports `liveBuildMatchesLocal: true` and
  `downloadContentsMatchLocal: true`. Independent SHA-256 checks also matched
  live and local JS (`33eb5de2…`) and CSS (`213d7363…`). The live and local ZIP
  archives have different container hashes because timestamps differ, while
  all 23 member contents match exactly.
- Desktop 1440×900 and mobile 390×844 checks covered `/`, `/demo`, `/privacy`,
  and `/terms`. Every route returned 200, had `lang=en`, one h1, one main,
  correct route title, no horizontal overflow, no serious/critical Axe finding,
  and no console/page error. An unknown route returned the styled HTTP 404.
- Keyboard-only use reached the skip link first, then the one-click demo CTA.
  Tab reached the command field and Enter ran **Save address**. The visible
  focus ring measured `3px solid rgb(21, 91, 140)`. Popup keyboard behavior is
  covered by the packaged Space/Enter push-to-talk tests.
- At 390 px all tested controls were at least 44×44 CSS pixels. Light and dark
  Axe scans passed. At 200% text sizing on a 390 px viewport there was no
  horizontal overflow or missing first-screen content. Reduced-motion
  emulation produced `scroll-behavior: auto` and zero running animations.
- Demo cases covered empty input, a 1,024-character unmatched command, normal
  use, destructive cancel, destructive confirm, undo, reset, and recovery to a
  valid action. Reset removed all `demo:spa:` data. Offline reload returned the
  complete demo. A forced service-worker reinstall deleted an old named cache
  and retained only `speak-page-actions-v4`.
- The whole live demo flow made only same-origin requests. The site loaded no
  third-party scripts or fonts. The packaged-extension privacy test covered
  scan, typed and spoken commands, confirmation, and undo without an external
  page-data request. License-return tests keep query/fragment tokens out of
  website storage and caches.

## Headers, caching, limits, and performance

The live HTML sends HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: no-referrer`, and a response-header CSP containing
`frame-ancestors 'none'`. HTML uses `public, must-revalidate, max-age=30`.
Hashed JS/CSS use `public, max-age=31536000, immutable`. The extension ZIP is
served as `application/zip`; robots, sitemap, icons, art, and download all
returned 200.

Initial assets are 14,920 B JS (5,370 B gzip), 11,288 B CSS (3,212 B gzip),
and 142,634 B hero WebP. There are no font files. These are below the 200 KB JS,
50 KB CSS, 120 KB font, and 300 KB hero budgets. Fresh mobile Lighthouse scored
Performance 94, Accessibility 100, Best Practices 100, and SEO 100; LCP was
1.6 s, CLS 0, FCP 0.8 s, and Speed Index 0.9 s. A 4× CPU-throttled demo action
updated and painted in 5.8 ms, below the 200 ms interaction budget.

The only server-side product call is the Sociobot license endpoint. From one
client, invalid verification calls 1–30 returned 200. Calls 31–35 returned
429 with `Retry-After` (3 seconds on the first limited response). Observed
allowance: **30 requests**. A later invalid request returned the documented
`{valid:false, reason:"invalid"}` shape with `Cache-Control: no-store`; checkout
returned 303 to the hosted Dodo checkout. The product has no sign-in flow, so
the Entra requirement is not applicable.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Result

**PASS.** Fresh evidence shows the candidate works end to end, meets the brief,
passes all claim and repository gates, and is the build currently deployed.
