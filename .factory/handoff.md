# Speak Page Actions repair-2 handoff

## Status

Repair complete for the verification-2 findings against candidate
`eddeb93ca2cbf01bd4f4aeefe08bcee9da47a3fc`. The original WXT + TypeScript MV3
extension and static-site deployment class are unchanged.

## Findings reproduced

Before editing, the 390px production build reproduced the verifier's exact
undersized targets: header Demo 42x20, Download 72x20, Privacy 54x20; Reset demo
103x31; Start for real 113x26; license restore 198x32; footer Privacy 51x21 and
Terms 41x21. The packaged popup reproduced Scan page at 88x32, its skip link at
134x35, Pro summary at 358x19, and Pro inputs/select at 358x40.

The candidate also reproduced the routing defect: its broad navigation fallback
served the client not-found view with HTTP 200 for an unknown URL.

## What changed

- Added product and popup touch-target layers that enforce a real 44x44 CSS-pixel
  minimum. This covers the site wordmark/navigation, demo reset/start controls,
  footer links, license restore flow, popup Scan control, skip link, Pro summary,
  form controls, and all buttons.
- Stacked the 390px header navigation so the larger hit areas keep adequate
  spacing and do not crowd or overlap.
- Restored the license form's intended collapsed state. Its grid rule had
  overridden the HTML `hidden` attribute; the form now appears only after the
  restore control is activated.
- Replaced the catch-all SPA fallback with explicit rewrites for `/`, `/demo`,
  `/privacy`, and `/terms`. Added a product-styled static `404.html` and a Static
  Web Apps 404 response override, so unknown paths retain HTTP 404.
- Removed the error page from `sitemap.xml`, updated the plain-language not-found
  copy, and recorded the 44px interaction rule in `.factory/design.md`.
- Added rendered-box regression tests for every visible site control at 390px,
  the revealed license form, and the built extension popup. Added an HTTP-level
  404 browser regression and package assertions for the production routing
  configuration.

## Clean verification

The exact work-order build sequence passed on 2026-08-29:

```sh
npm ci
npm test
npm run build:site
npm run typecheck
npm run lint
npm run test:package
```

- Unit: 5 passed.
- Playwright integration/browser: 20 passed.
- Every one of the 13 commands in `.factory/claims.json` passed verbatim from a
  clean state.
- Consumer package check passed for
  `dist/site/downloads/speak-page-actions.zip`.
- Production dependency audit: 0 findings with `npm audit --omit=dev`. `npm ci`
  still reports 10 transitive development-tool advisories (1 low, 2 moderate,
  4 high, 3 critical); no runtime dependency is shipped to users.
- Local `verify-url.sh` passed with HTTP 200, title, `lang=en`, one h1, main
  landmark, image alt text, and no console errors. Screenshots and output are in
  `.factory/evidence/repair-2/`.
- Local Lighthouse scored Performance 1.00, Accessibility 1.00, Best Practices
  1.00, and SEO 1.00. LCP was 1.9s, CLS 0, and total blocking time 30ms. As in
  the prior run, Chromium crashed after the JSON report was written; all scored
  audits completed and are in `.factory/evidence/repair-2/lighthouse.json`.
- Initial production assets are 11,648 bytes JS (4,544 gzip), 9,453 bytes CSS
  (2,846 gzip), and 142,634 bytes for the hero WebP.
- A real unpacked MV3 launch under Chromium rendered with no page errors. Scan
  page measured 87.83x44; no visible popup target measured below 44x44.

Browser coverage includes desktop and 390px, light and dark schemes, keyboard
skip-link focus and its 3px focus outline, Axe serious/critical scans, demo
normal/unknown/destructive/undo/reset flows, active-tab packaging, password
exclusion, local speech gating, offline reload, service-worker cache cleanup,
demo request/storage isolation, package permissions, and the HTTP 404 response.

## Deployment and live evidence

Deployed `dist/site` with the work-order static deployment utility. Azure Static
Web Apps deployment `e40b250b-961d-4ec2-bd77-ee81b45bb375` succeeded at
https://speak-page-actions.sociobot.in.

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/no-such-route` returns
  HTTP 404 with the styled error document. All same-origin links return 200.
- The download returns 200 as `application/zip`, 298,292 bytes. Local and live
  SHA-256 are both
  `7c777562176cac83bb03f17d9fc2a827a3844dcd1bfdc764ed787cfed3da7574`.
- Live JS SHA-256 matches local:
  `b558dfeb3a55804f2175333266bd5faac94f577fa3e75501c197a01bff7a7353`.
  Live CSS SHA-256 matches local:
  `6c3f6c1cafdd0d0164381c0aad5880f2fd199778abe1693753e9819193506b48`.
- Live desktop/390px and light/dark checks across all routes found one h1, no
  serious or critical Axe findings, and no undersized target. Successful routes
  had no console or page errors. The 404 navigation produces only the browser's
  expected failed-document message for its intentional HTTP 404 status.
- The live demo made requests only to
  `https://speak-page-actions.sociobot.in`, stored only `demo:spa:sample`, and
  reloaded successfully offline under service-worker control.
- Live keyboard focus begins on Skip to main content with a
  `rgb(21, 91, 140) solid 3px` outline.
- Live responses include HSTS, `nosniff`, strict-origin referrer policy, and the
  configured restrictive CSP. Hashed assets use one-year immutable caching.
- The live license identity endpoint accepts the deployed origin via CORS and
  returned `{valid:false, reason:"invalid"}` for a throwaway token without
  storing page data.

## Known limits

- Undo applies only when a page synchronously removes a local list/item
  container. The extension cannot reverse navigation, submitted forms, or remote
  mutations.
- Voice input requires a browser/OS implementation that exposes verified
  on-device speech processing. Typed commands remain available everywhere.
