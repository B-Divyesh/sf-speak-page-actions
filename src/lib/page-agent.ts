/**
 * This whole function is deliberately self-contained. Chrome serializes it for
 * `scripting.executeScript`, so importing helpers here would leave the injected
 * function without those helpers on the active page.
 */
export function installPageAgent() {
  const page = globalThis as typeof globalThis & { __speakPageActionsInstalled?: boolean };
  if (page.__speakPageActionsInstalled) return;
  page.__speakPageActionsInstalled = true;

  const selector = 'a[href],button,input:not([type="hidden"]):not([type="password"]),textarea,select,[role="button"],[role="link"]';
  const destructiveWords = /\b(delete|remove|discard|destroy|publish|send|submit|pay|purchase|place order|sign out)\b/i;
  let undo: (() => boolean) | undefined;

  const labelFor = (element: HTMLElement) => {
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const named = labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').trim();
      if (named) return named;
    }
    const aria = element.getAttribute('aria-label');
    if (aria) return aria.trim();
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      const label = element.labels?.[0]?.textContent?.trim();
      if (label) return label;
      if ((element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) && element.placeholder) return element.placeholder.trim();
      if (element.name) return element.name.trim();
    }
    return (element.innerText || element.textContent || element.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
  };
  const isVisible = (element: HTMLElement) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
  };
  const nodeId = (element: Element, index: number) => {
    const previous = element.getAttribute('data-spa-id');
    if (previous) return previous;
    const id = `spa-${index}`;
    element.setAttribute('data-spa-id', id);
    return id;
  };
  const collect = () => [...document.querySelectorAll<HTMLElement>(selector)].flatMap((element, index) => {
    if (!isVisible(element) || element.getAttribute('aria-hidden') === 'true' || element instanceof HTMLInputElement && element.type === 'password') return [];
    const label = labelFor(element);
    if (!label) return [];
    const clickableInput = element instanceof HTMLInputElement && ['button', 'submit', 'reset', 'checkbox', 'radio', 'image'].includes(element.type);
    const kind = element instanceof HTMLSelectElement ? 'select' : element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? (clickableInput ? 'button' : 'field') : element instanceof HTMLAnchorElement || element.getAttribute('role') === 'link' ? 'link' : 'button';
    const separated = label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    return [{ id: nodeId(element, index), label, kind, destructive: destructiveWords.test(separated) || element.getAttribute('type') === 'submit' }];
  });
  const undoContainer = (element: HTMLElement) => element.closest<HTMLElement>('[data-spa-undoable], [role="listitem"], li, tr, article');
  const activate = (id: string) => {
    const element = document.querySelector<HTMLElement>(`[data-spa-id="${CSS.escape(id)}"]`);
    if (!element) return { ok: false, message: 'That action is no longer on this page. Scan the page again.' };
    const clickableInput = element instanceof HTMLInputElement && ['button', 'submit', 'reset', 'checkbox', 'radio', 'image'].includes(element.type);
    if ((element instanceof HTMLInputElement && !clickableInput) || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      element.focus();
      return { ok: true, message: `Focused ${labelFor(element)}.` };
    }
    // A browser extension cannot honestly reverse a submitted form or a server
    // mutation. Offer undo only when a complete local list/item container is
    // synchronously removed by the page and can be restored intact.
    const removable = undoContainer(element);
    const parent = removable?.parentNode;
    const next = removable?.nextSibling;
    const copy = removable?.cloneNode(true);
    undo = undefined;
    element.click();
    if (removable && parent && copy && !document.contains(removable)) {
      undo = () => {
        if (document.contains(copy)) return false;
        parent.insertBefore(copy, next || null);
        return true;
      };
    }
    return { ok: true, message: `Used ${labelFor(element)}.`, canUndo: Boolean(undo) };
  };

  chrome.runtime.onMessage.addListener((message: unknown) => {
    const typed = message as { type?: string; id?: string };
    if (typed?.type === 'SPA_COLLECT') return Promise.resolve({ actions: collect(), title: document.title });
    if (typed?.type === 'SPA_ACTIVATE' && typed.id) return Promise.resolve(activate(typed.id));
    if (typed?.type === 'SPA_UNDO') {
      if (!undo) return Promise.resolve({ ok: false, message: 'There is no page action that can be undone.' });
      const restored = undo();
      undo = undefined;
      return Promise.resolve(restored
        ? { ok: true, message: 'Restored the removed item on this page.' }
        : { ok: false, message: 'That item could not be restored. Scan the page again.' });
    }
    return undefined;
  });
}
