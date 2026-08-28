# Speak Page Actions handoff

## Delivered

- A Chromium MV3 extension built with WXT and TypeScript. It scans the active page for visible, labelled links, buttons, selects, and form fields; skips password fields; accepts a held push-to-talk command or a typed command; and matches words to the visible list.
- Risky labels such as delete, submit, publish, send, and pay open a review dialog before activation. The popup offers an undo request where the page remains available after the click.
- A $12 one-time Pro path through the Sociobot hosted checkout and license verifier. Pro enables saved local command aliases; core accessibility and safety behavior remains free.
- A static landing site with `/`, `/demo`, `/privacy`, `/terms`, and a styled in-app `/404`. `dist/site/index.html` is the deployment root. The demo uses only `demo:spa:` browser storage and includes reset/start-for-real controls.
- Original screen-print hero and social art in `assets/src/` and `public/art/`, generated through the factory image deployment. Prompt and provenance are recorded in `.factory/design.md`.

## Run and verify

```sh
npm install
npm run build        # dist/site and dist/extension
npm test             # 4 Playwright/Vitest checks, including all listed claims
```

`npm run build:site` is the exact static deploy build command. It writes `dist/site/index.html`. The extension zip is built at `dist/site/downloads/speak-page-actions.zip` and the unpacked build is `dist/extension`.

Verification completed on 2026-08-28:

- `npm run build` passed.
- `npm test` passed: 4 tests. Claims cover one-click sample entry, local demo storage/same-origin activity, and offline reload after first visit.
- `/opt/fleet/lib/verify-url.sh` against the local built site passed: title, `lang=en`, one h1, main landmark, image alt text, labelled buttons, and no console errors. Local page load measured 551 ms.
- Axe Playwright check at 390×844 reported no serious or critical violations.
- Built site payload: 11.70 KB JS (4.54 KB gzip), 8.75 KB CSS (2.69 KB gzip), 142 KB hero WebP, 116 KB social WebP.

## Known gaps

- Browser speech recognition depends on the browser/OS implementation and permission. The typed command path stays available when it is unavailable or denied.
- A page navigation can prevent a browser-side click from being undone. The extension offers undo where the original page remains available.
- The factory must register the paid product/return URL before the hosted checkout works in production.
