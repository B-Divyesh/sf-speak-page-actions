# Demo sandbox

Open `/demo`, `/?demo=1`, or use **Try it with sample data** on the landing page. The sample is a four-control checkout page: Save address, Shipping method, Review order, and Delete saved draft. The initial screen already shows all four controls and the result “Found four visible controls on Sample checkout.”

The demo banner stays visible. **Reset demo** removes every `demo:spa:` key and restores the sample. **Start for real** removes every `demo:spa:` key and opens the installation section. The demo does not read or write the extension’s `spa:` keys or a real license key.

The service worker caches the shell and the sample route after the first visit, so the demo can be reloaded offline.
