# Speak Page Actions

Speak visible browser controls on an ordinary page. It is for people with limited vision or hand mobility who want to say or type a control name.

The extension scans only the current page after you open it. Hold the speak button and say a visible control name, such as “click save address.” Hold Space or Enter to speak; release the key to stop. It asks before submitting, deleting, publishing, sending, paying, canceling subscriptions, unsubscribing, archiving, deactivating, closing accounts, or signing out. Password fields are never listed. It blocks pages when the address, headings, or visible controls contain familiar finance words, or a sign-in form is present. Do not use it on other banking or financial pages.

Try four sample controls at [the one-click demo](https://speak-page-actions.sociobot.in/?demo=1). Sample changes use separate browser storage and do not change extension settings. Keys start with `demo:spa:` for verification.

## Run locally

```sh
npm ci
npm run dev              # Chromium extension development mode
npm run dev:site         # static site at the shown local URL
npm test
npm run lint
npm run build            # extension in dist/extension and site in dist/site
npm run test:package     # check the downloadable Chrome extension ZIP
```

Install on desktop Chrome or Chromium only. Download and unzip the packaged ZIP, open `chrome://extensions`, turn on Developer mode, choose Load unpacked, then select the unzipped folder. Mobile browsers can use the demo but cannot install this extension.

`npm run build:site` is the static deployment command. It writes the site to `dist/site/` and includes the downloadable extension at `dist/site/downloads/speak-page-actions.zip`.

## Privacy and limits

The extension scans only the current page after you open it. It does not capture background microphone audio. Spoken commands work only when your browser can process speech on this device. You can type the same command when speech is unavailable. The public site works offline after its first visit. See [Privacy](https://speak-page-actions.sociobot.in/privacy) and [Terms](https://speak-page-actions.sociobot.in/terms).

## Restore Pro

Open the extension on a normal page. Open **Restore Pro and save command names**. Paste your license token, then choose **Restore Pro**. A checkout return can put a token in the address bar. The page removes it without saving it in browser storage.

## License

MIT. The optional Pro license costs $12 once and saves your own command names. Core accessibility actions and safety checks are free.
