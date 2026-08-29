# Copy audit — polish 5

Count rule: whitespace-delimited tokens. Punctuation, hyphenated forms, URLs,
paths, and `$12` count as one word. This audit covers rendered sentences,
headings, labels, buttons, links, facts, states, and README sentences. No
sentence exceeds 22 words or uses a banned plain-words term. `npm run test:copy`
checks every stored count and requires every extracted route, popup, 404, and
README string to appear in this file.

## Landing, demo, and routes

| Copy | Words | Evidence / claim |
| --- | ---: | --- |
| Skip to main content | 4 | keyboard |
| Speak Page Actions home | 4 | wordmark accessible name |
| Speak Page Actions | 3 | wordmark |
| Main navigation | 2 | nav label |
| Footer navigation | 2 | nav label |
| Demo | 1 | nav |
| Desktop download | 2 | nav |
| Privacy | 1 | nav |
| Terms | 1 | footer link |
| Built by Param Factory | 4 | footer |
| Speak visible page actions with review before sensitive clicks. | 9 | footer and metadata |
| v1.0.0 · Original generated illustration disclosed above. | 7 | footer |
| Browser controls you can use by voice | 7 | kicker |
| Speak the action you need | 5 | h1 |
| For people with limited vision or hand mobility, say or type a visible control’s name. | 15 | audience |
| Try it with sample data | 5 | demo action |
| Opens four sample controls without changing a real page. | 9 | `sample-action` |
| Desktop Chrome and Chromium only. | 5 | install disclosure |
| Mobile browsers can run the demo but cannot install this extension. | 11 | install disclosure |
| Page labels stay in your browser | 6 | `page-data-local` |
| Works offline after the first visit | 6 | `offline-reload` |
| Core actions are free; saved command names cost $12 once | 10 | `core-free`, `pro-aliases` |
| Product facts | 2 | list label |
| Original generated artwork, made for Speak Page Actions. | 8 | art disclosure |
| What the extension shows | 4 | section kicker |
| Visible controls listed by the extension | 6 | h2 |
| It lists buttons, links, and labelled fields already visible on the current page. | 13 | `visible-labels` |
| button Save address | 3 | preview |
| link Review order | 3 | preview |
| review Delete saved draft | 4 | preview |
| How Speak Page Actions works | 5 | h2 |
| Open the extension. | 3 | step |
| It scans the current page only. | 6 | `active-tab-only` |
| Hold to speak. | 3 | step |
| Speak when your browser can process speech on this device, or type the visible control name. | 16 | `on-device-speech`, `typed-command` |
| Review sensitive actions. | 3 | step |
| It asks before submitting, deleting, publishing, sending, paying, canceling subscriptions, unsubscribing, archiving, deactivating, closing accounts, or signing out. | 18 | `destructive-review` |
| What it does not do | 5 | h2 |
| It does not listen in the background. | 7 | limit |
| It never lists password fields. | 5 | `password-exclusion` |
| Install on desktop Chrome or Chromium | 6 | h2 |
| Mobile browsers cannot install this extension. | 6 | `desktop-chromium-only` |
| You can still use the demo on this device. | 9 | `desktop-chromium-only` |
| Download and unzip the extension ZIP. | 6 | install step |
| Open chrome://extensions on desktop Chrome or Chromium. | 7 | install step |
| Turn on Developer mode. | 4 | install step |
| Choose Load unpacked. | 3 | install step |
| Select the unzipped extension folder. | 5 | install step |
| Download the desktop extension ZIP | 5 | download |
| One-time Pro license | 3 | price kicker |
| Save your own command names | 5 | h2 |
| Pro costs $12 once. | 4 | price |
| Save a short name for a visible control. | 8 | price |
| Core page actions and safety checks are free. | 8 | `core-free` |
| Buy Pro in hosted checkout — $12 once | 8 | external checkout |
| Opens Dodo’s checkout in this tab. | 6 | external disclosure |
| Open the extension to restore Pro | 6 | recovery heading |
| The website cannot turn on Pro inside your installed extension. | 10 | recovery boundary |
| Open the extension on a normal page. | 7 | recovery step |
| Open Restore Pro and save command names. | 7 | recovery step |
| Paste your token and choose Restore Pro. | 7 | recovery step |
| Move your license to the extension | 6 | checkout return heading |
| License token returned by checkout | 5 | handoff label |
| Copy license token | 3 | handoff button |
| Copy this token, then paste it in the extension. | 9 | handoff status |
| License token copied. | 3 | handoff success |
| Paste it in the extension. | 5 | handoff success |
| Copy the selected token, then paste it in the extension. | 10 | handoff fallback |
| Demo — sample data, nothing is saved | 7 | `demo-local` |
| Reset demo | 2 | button |
| Start for real | 3 | button |
| Sample checkout page | 3 | kicker |
| Speak a visible control | 4 | demo h1 |
| Hold the mic in the extension, or test the same command below. | 12 | demo help |
| Visible controls on this page | 5 | demo h2 |
| Found four visible controls on Sample checkout. | 7 | `sample-action` |
| Type a command for the sample | 6 | label |
| click save address | 3 | demo placeholder |
| Run command | 2 | button |
| No visible action matched. | 4 | demo error |
| Use a label from the list. | 6 | demo error action |
| The action was not used. | 5 | demo cancelled state |
| Sample data stays separate | 4 | h2 |
| Reset restores four sample controls. | 5 | demo help |
| Sample changes use separate browser storage and do not change extension settings. | 12 | `demo-isolation` |
| Privacy for your current page | 5 | privacy h1 |
| Terms for Speak Page Actions | 5 | terms h1 |
| What the extension reads | 4 | privacy h2 |
| It does not read password fields. | 6 | `password-exclusion` |
| What stays on your device | 5 | privacy h2 |
| What the extension sends | 4 | privacy h2 |
| Sensitive action review | 3 | privacy h2 |
| Review is required for submitting, deleting, publishing, sending, paying, canceling subscriptions, unsubscribing, archiving, deactivating, closing accounts, and signing out. | 19 | `destructive-review` |
| Demo data | 2 | privacy h2 |
| Its sample changes use separate browser storage. | 7 | `demo-isolation` |
| Using the extension | 3 | terms h2 |
| Speak Page Actions helps operate ordinary pages. | 7 | terms |
| You remain responsible for reviewing and confirming each page action. | 10 | terms |
| License | 1 | terms h2 and README heading |
| No warranty | 2 | terms h2 |
| This page could not be found | 6 | 404 h1 |
| Page not found — Speak Page Actions | 7 | 404 title |
| The address may have changed. | 5 | 404 help |
| Return home to learn about visible page actions. | 8 | 404 help |
| Return home | 2 | 404 button |
| v1.0.0 · Original generated illustration disclosed on the home page. | 10 | 404 footer |

## Popup, legal states, and README

| Copy | Words | Evidence / claim |
| --- | ---: | --- |
| Speak Page Actions — Use visible controls by voice | 9 | popup title |
| Skip to actions | 3 | popup keyboard |
| Page-scoped voice control | 3 | popup kicker |
| Scan page | 2 | popup button |
| Say a visible action | 4 | popup h1 |
| Hold to speak | 3 | popup button |
| Hold Space or Enter with the keyboard. | 7 | `push-to-talk` |
| Hold to speak. Hold Space or Enter with the keyboard. | 10 | talk label |
| Or type the command | 4 | label |
| Run command | 2 | button |
| Visible actions | 2 | popup h2 |
| Undo last page action | 4 | button |
| Restore Pro and save command names | 6 | disclosure |
| Paste your license token to restore Pro in this extension. | 10 | recovery help |
| Your command name | 3 | label |
| Visible control | 2 | label |
| Pro license token | 3 | label |
| Restore Pro | 2 | button |
| Save command name | 3 | button |
| The name stays in this browser. | 6 | popup privacy note |
| Scanning visible actions… | 3 | popup loading state |
| No labelled actions were found. | 5 | popup empty state |
| Open a normal web page, then scan again. | 8 | popup empty-state action |
| This page cannot be scanned. | 5 | popup error |
| Open a normal web page and try again. | 8 | popup error action |
| The page changed before that action could run. | 8 | popup error |
| Scan the page again. | 4 | popup error action |
| No visible action matched those words. | 6 | popup command error |
| Say or type the label shown below. | 7 | popup command error action |
| Paste your Pro license token. | 5 | popup license error |
| Checking license… | 2 | popup license state |
| This license is not active. | 5 | popup license error |
| Check the token or buy Pro on the product site. | 10 | popup license error action |
| Pro is active in this extension. | 6 | popup license success |
| The license could not be checked. | 6 | popup license error |
| Connect to the internet and try again. | 7 | popup license error action |
| Enter a command name and choose a visible control. | 9 | popup form error |
| Restore Pro before saving a command name. | 7 | popup form error action |
| Restore Pro to use saved command names. | 7 | popup command error |
| Speech recognition is unavailable here. | 5 | popup speech error |
| On-device speech recognition is unavailable here. | 6 | popup speech error |
| Type the command instead. | 4 | popup speech error action |
| Listening. | 1 | popup speech state |
| Listening… release to stop | 4 | popup speak control state |
| Release when you finish the action label. | 7 | popup speech state |
| click publish | 2 | popup placeholder |
| checkout | 1 | popup placeholder |
| Review before action | 3 | dialog kicker |
| Use this action? | 3 | dialog h2 |
| Cancel | 1 | button |
| Confirm action | 2 | default confirmation button label |
| Push-to-talk only. | 2 | popup footer |
| Password fields are never listed. | 5 | popup footer, `password-exclusion` |
| The extension reads visible labels, roles, and control types on the current page after you open it. | 17 | privacy |
| Saved command names and license data are stored in browser-local extension storage. | 12 | `extension-local-storage` |
| The website does not store license tokens. | 7 | `extension-local-storage` |
| The extension does not send page labels, spoken commands, or browsing history. | 12 | `page-data-local` |
| When you restore Pro, it sends the license token to Sociobot for verification. | 13 | `license-verification` |
| The demo requests stay on this site. | 7 | `demo-local` |
| Pro is a one-time $12 license for saved command names. | 10 | `pro-aliases` |
| Browser pages change often. | 4 | terms |
| The extension may not identify every control or undo actions after a page navigates. | 14 | terms |
| Speak visible browser controls on an ordinary page. | 8 | README |
| It is for people with limited vision or hand mobility who want to say or type a control name. | 19 | README |
| The extension scans only the current page after you open it. | 11 | README, `active-tab-only` |
| Hold the speak button and say a visible control name, such as “click save address.” | 15 | README |
| Hold Space or Enter to speak; release the key to stop. | 11 | README |
| It asks before submitting, deleting, publishing, sending, paying, canceling subscriptions, unsubscribing, archiving, deactivating, closing accounts, or signing out. | 18 | README, `destructive-review` |
| Password fields are never listed. | 5 | README, `password-exclusion` |
| Try four sample controls at the one-click demo. | 8 | README |
| Sample changes use separate browser storage and do not change extension settings. | 12 | README, `demo-isolation` |
| Keys start with demo:spa: for verification. | 6 | README |
| Run locally | 2 | README heading |
| Install on desktop Chrome or Chromium only. | 7 | README |
| Download and unzip the packaged ZIP, open chrome://extensions, turn on Developer mode, choose Load unpacked, then select the unzipped folder. | 20 | README |
| Mobile browsers can use the demo but cannot install this extension. | 11 | README |
| npm run build:site is the static deployment command. | 8 | README |
| It writes the site to dist/site/ and includes the downloadable extension at dist/site/downloads/speak-page-actions.zip. | 13 | README |
| Privacy and limits | 3 | README heading |
| It does not capture background microphone audio. | 7 | README |
| Spoken commands work only when your browser can process speech on this device. | 13 | README |
| You can type the same command when speech is unavailable. | 10 | README |
| The public site works offline after its first visit. | 9 | README |
| See Privacy and Terms. | 4 | README |
| MIT. | 1 | README |
| The optional Pro license costs $12 once and saves your own command names. | 13 | README |
| Core accessibility actions and safety checks are free. | 8 | README |
| Restore Pro | 2 | README heading |
| Open the extension on a normal page. | 7 | README |
| Open Restore Pro and save command names. | 7 | README |
| Paste your license token, then choose Restore Pro. | 8 | README |
| The website does not store license tokens. | 7 | README, `extension-local-storage` |

## Terminology

| Concept | One term |
| --- | --- |
| Button, link, or field shown on a page | visible control |
| Spoken or typed instruction | command |
| Isolated try-out | demo |
| Question before a sensitive control | review |
| Browser add-on | extension |
| Personal shortcut for a control | command name |
