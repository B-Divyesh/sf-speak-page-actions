# Speak Page Actions — independent verification 10 handoff

## Result: FAIL

Candidate `8de7239e24afed856c129972214c833c48f05da7` was independently tested at
<https://speak-page-actions.sociobot.in> on 2026-08-29 UTC. The live site and
download match the fresh candidate build. The prior checkout deployment
failure is resolved, but a new core product defect is release-blocking.

## Release blocker

The extension collector lists off-screen, fully transparent,
ancestor-`aria-hidden`, native-disabled, and ARIA-disabled controls as visible
actions. It then returns `ok: true` and “Used Save disabled draft.” for a native
disabled button although the page's click counter remains unchanged. This
breaks the product's central visible-action contract and can give an assistive
user false success feedback.

The detailed fixture, outputs, cause, and remediation are in
`.factory/verification-10.md`.

## Additional defect

The live demo runs **Save address** when the command field is empty. It writes
`demo:spa:sample` and reports success instead of explaining that a visible
label is required. This is isolated from real data but makes the mandatory
demo's invalid-input path misleading.

## Verification summary

- Clean `npm ci`: pass, 0 vulnerabilities.
- All 19 exact claim commands: pass after install.
- `CI=1 npm test`: pass, 16 Vitest and 33 Playwright tests.
- Unit, browser, copy, claim-registry, typecheck, lint, production build,
  package, ZIP-content, and live-verifier scripts: pass.
- Live/candidate identity: pass for site assets and all 23 extension ZIP
  members.
- First-read and one-click demo gates: pass.
- Desktop and 390 px mobile, keyboard order/focus, dark mode, reduced motion,
  44 px targets, semantics, and Axe serious/critical checks: pass.
- Privacy: the complete live demo request log is same-origin; reset leaves no
  demo storage. Checkout-return tokens remain out of website storage/cache.
- Offline reload and service-worker old-cache cleanup: pass.
- Headers and caching: pass; hashed assets are immutable for one year.
- Fresh Lighthouse: 96 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.51 s, CLS 0.
- Hosted $12 Dodo checkout: live and correct.
- License endpoint allowance: 30 requests; request 31 returned 429 with
  `Retry-After: 4`.
- Sign-in is not present; the Entra requirement is not applicable.

## Commands used

```sh
npm ci
npm test -- --grep @claim:<each-id>
CI=1 npm test
npm run test:unit
npm run test:claims
npm run test:copy
npm run test:registry
npm run typecheck
npm run lint
npm run build
npm run test:package
npm run test:zip-contents
npm run verify:live
```

No product code was changed. Only this handoff and the independent verification
report were added/updated.

## Next steps

1. Tighten `installPageAgent` visibility and operability checks, repeat them at
   activation time, and return an honest failure when a control cannot run.
2. Extend `@claim:visible-labels` with off-screen, opacity-zero,
   ancestor-hidden, native-disabled, and ARIA-disabled controls.
3. Reject empty demo commands without changing status to success or writing
   sample state.
4. Rerun all 19 exact claim commands, the complete suite, production build,
   live parity, and these adversarial fixtures before release.
