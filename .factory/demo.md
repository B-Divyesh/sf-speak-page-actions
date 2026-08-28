# Demo sandbox

Open `/demo` or use **Try it with sample data** on the landing page. The sample is a four-action checkout page: Save address, Shipping method, Review order, and Delete saved draft.

The demo banner stays visible. **Reset demo** removes `demo:spa:sample` and restores the sample. **Start for real** returns to the landing page. The demo does not read or write the extension’s `spa:` keys or a real license key.

The service worker caches the shell and the sample route after the first visit, so the demo can be reloaded offline.
