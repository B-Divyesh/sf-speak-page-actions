# Demo sandbox

Open `/?demo=1`, `/demo`, or use **Try it with sample data** on the landing page. The one-click landing action uses `/?demo=1`. The sample is a four-control checkout page: Save address, Shipping method, Review order, and Delete saved draft. The initial screen already shows all four controls and the result “Found four visible controls on Sample checkout.”

The demo banner stays visible. **Reset demo** removes every `demo:spa:` key and restores the sample. **Start for real** removes every `demo:spa:` key and opens the installation section. Sample actions use the separate `demo:spa:` namespace and do not change extension settings or a real license key.

The service worker caches the shell and the sample route after the first visit, so the demo can be reloaded offline.
