# Speak Page Actions repair handoff

## Independent verification update — FAIL

Independent QA of candidate `eddeb93ca2cbf01bd4f4aeefe08bcee9da47a3fc` at
https://speak-page-actions.sociobot.in completed on 2026-08-29. **Do not
release this candidate unchanged.** The previous deployment failure is fixed:
the live downloadable extension is present and the deployed JS exactly matches
the candidate build. All 13 exact claim commands, the full test suite,
typecheck, build, and consumer-package check pass.

The release blocker is accessibility: at the required 390 px viewport, many
interactive controls are below the mandatory 44x44 CSS-pixel touch target
(header navigation is 20 px high; Reset demo is 31 px high; restore license is
32 px high; and extension Scan page is styled to 32 px). This conflicts with
the intended users’ limited hand mobility. An additional medium defect is that
unknown URLs render a not-found view with HTTP 200 rather than a real 404.

See `.factory/verification-2.md` for exact commands, results, privacy/request
evidence, observed license API allowance (30 successful rapid requests then
429 with `Retry-After: 3`), and remediation details.

## Status

Repair complete for independent-verification candidate
`32300bafd2533146a15584fd4f551ec8b1087e79`. This handoff accompanies the
repair commit on `main`.

## What changed

- Fixed claim command forwarding. `npm test -- --grep @claim:…` now runs the
  unit suite and forwards `--grep` to Playwright, rather than treating a claim
  tag as a file name.
- Changed the production static build to package the MV3 extension before
  publishing the site. `npm run build:site` now always creates
  `dist/site/downloads/speak-page-actions.zip` (295,748 bytes in this build).
- Replaced the declarative `<all_urls>` content script with on-demand
  `chrome.scripting.executeScript` injection on the active tab. The packaged
  manifest has `activeTab`, `scripting`, and `storage`; it has no
  `content_scripts` and no `<all_urls>` host permission.
- Hardened destructive-label detection for realistic concatenated inline text
  such as `BUTTONDelete saved draft review`.
- Made undo truthful and effective for a local deleted list/item: it captures
  and restores the complete removed container. It does not promise to undo a
  form submit or a server-side mutation.
- Speech now starts only from the hold control and is enabled only when the
  browser exposes `processLocally`; otherwise the popup gives a typed-command
  fallback. No spoken text is sent through the extension.
- Repaired dark-scheme contrast, initial keyboard focus order, and service
  worker updates (versioned cache, old-cache cleanup, `skipWaiting`, and
  network-first document updates with offline fallback).
- Removed the false free-export statement and recorded all remaining
  user-facing claims with exact tagged regression coverage.

## Verification

Performed from a clean dependency install on 2026-08-29:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:package
```

Results:

- Type check and lint: pass.
- Unit + Playwright: 5 unit tests and 17 browser tests pass.
- All claim commands in `.factory/claims.json` pass individually, including
  the verifier's original `sample-action`, `demo-local`, and `offline-reload`
  commands.
- Browser coverage exercises desktop and 390 px, keyboard skip-link order,
  light and dark Axe serious/critical checks on `/`, `/demo`, `/privacy`, and
  `/terms`, offline reload, cache-update cleanup, demo local-only requests,
  destructive review classification, effective local-delete undo, password
  exclusion, and the packaged extension permissions.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence/repair`
  passed: 200 response, no browser console errors, title/lang/one h1/main,
  image alt text, and desktop/mobile screenshots.
- Local Lighthouse output: Performance 0.99 and Accessibility 1.00. The
  report is at `.factory/evidence/repair/lighthouse.json`; Chrome emitted a
  post-collection screenshot-target crash, but the scored audits completed.
- Initial site JS is 4,531 bytes gzip and CSS is 2,753 bytes gzip. The original
  hero remains 142.63 KB WebP.

## Deploy and consumer artifact

Deployment class remains static. Use `npm run build:site` as the deployment
build command; it includes the extension download under `dist/site/downloads/`.
`npm run test:package` validates that archive as a consumer MV3 package.

Deployed with the factory static work-order utility on 2026-08-29. Azure Static
Web Apps deployment `ac5ba9a3-a68a-4c8c-a172-6ea60d126bce` succeeded to the
existing production host. The live download now returns HTTP 200,
`application/zip`, and 295,748 bytes. Its SHA-256 matches the local artifact:
`9664d453056fefe25fa0669c71bc25289733e7761d4414f9a2a74c7ab5df70f3`.
The live `verify-url.sh` check also passed with no console errors and the
required title, language, h1, main landmark, and image alt text.

## Known limits

- Undo is available only when a page synchronously removes a local list/item
  container; browser extensions cannot safely reverse a submitted form,
  navigation, or remote mutation.
- Voice control depends on a browser/OS implementation that exposes verified
  on-device speech processing. Typed commands always remain available.
- `npm ci` reports 10 transitive development-dependency audit findings from
  the existing lockfile; no runtime dependency or user data is affected.
