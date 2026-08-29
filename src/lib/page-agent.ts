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
  // Be deliberately conservative here. These labels describe actions that can
  // change an account, money, a subscription, or a record. A false positive
  // costs one explicit confirmation; a false negative can be irreversible.
  // Keep this policy mirrored in the landing page, Privacy page, README, and
  // the destructive-review claim test.
  const destructiveWords = /\b(?:delete|remove|discard|destroy|publish|send|submit|pay|purchase|place order|sign out|unsubscribe|archive|deactivate|close(?:\s+(?:my|your|the))?\s+account|cancel(?:\s+(?:my|your|the))?\s+(?:subscription|plan|membership)|end(?:\s+(?:my|your|the))?\s+(?:subscription|plan|membership)|terminate(?:\s+(?:my|your|the))?\s+account|transfer|wire|withdraw(?:al)?|deposit|cash out|send money|move money|pay bill|add payee|beneficiary)\b/i;
  const financialContextWords = /\b(?:bank(?:ing)?|credit union|financial(?:\s+services)?|checking|savings|credit card|debit card|bank account|account balance|routing number|account number|investment(?:s)?|brokerage|trading account|loan|mortgage|insurance policy|wallet|cryptocurrency|crypto)\b/i;
  const financialHost = /(?:^|[.-])(?:bank|banking|creditunion|credit-union|financial|finance|finserv|brokerage|invest|trading|payments?|wallet)(?:[.-]|$)/i;
  const financialActionWords = /\b(?:transfer|wire|withdraw(?:al)?|deposit|cash out|send money|move money|pay bill|add payee|beneficiary)\b/i;
  const financialPageMessage = 'A finance or sign-in safety signal was found. This page cannot be scanned.';
  const unavailableActionMessage = 'That action is no longer visible or available. Scan the page again.';
  const changedActionMessage = 'That action changed since the last scan. Scan the page again.';
  const actionIdByElement = new WeakMap<HTMLElement, string>();
  const elementByActionId = new Map<string, HTMLElement>();
  let nextActionId = 0;
  let undo: (() => boolean) | undefined;

  const cleanLabel = (value: string) => value.replace(/\s+/g, ' ').trim();
  const labelFor = (element: HTMLElement) => {
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const named = cleanLabel(labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' '));
      if (named) return named;
    }
    const aria = element.getAttribute('aria-label');
    if (aria?.trim()) return cleanLabel(aria);
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      const label = cleanLabel([...element.labels || []].map((item) => item.textContent || '').join(' '));
      if (label) return label;
      if (element instanceof HTMLInputElement && ['button', 'submit', 'reset'].includes(element.type) && element.value) return cleanLabel(element.value);
      if (element instanceof HTMLInputElement && element.type === 'image' && element.alt) return cleanLabel(element.alt);
      return '';
    }
    return cleanLabel(element.innerText || element.textContent || element.getAttribute('title') || '');
  };
  const isAvailable = (element: HTMLElement) => {
    if (element.closest('[hidden], [inert], [aria-hidden="true"], [aria-disabled="true"]') || element.matches(':disabled')) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (style.visibility === 'hidden' || style.display === 'none' || style.contentVisibility === 'hidden' || rect.width <= 0 || rect.height <= 0) return false;
    if (rect.bottom <= 0 || rect.right <= 0 || rect.top >= innerHeight || rect.left >= innerWidth) return false;
    for (let current: HTMLElement | null = element; current; current = current.parentElement) {
      if (Number.parseFloat(getComputedStyle(current).opacity) === 0) return false;
    }
    return typeof element.checkVisibility !== 'function' || element.checkVisibility({
      checkOpacity: true,
      checkVisibilityCSS: true,
      opacityProperty: true,
      visibilityProperty: true,
    });
  };
  const separatedWords = (label: string) => label
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  // Finance and sign-in pages are deliberately outside this product's job. A
  // familiar finance signal or a visible password field stops scanning. This
  // is a conservative, testable boundary rather than a claim to identify every
  // financial page. It runs again immediately before activation so a stale
  // action cannot bypass the policy after a page changes.
  const isFinancialPage = () => {
    if (financialHost.test(location.hostname)
      || [...document.querySelectorAll<HTMLInputElement>('input[type="password"]')].some(isAvailable)) return true;
    const controls = [...document.querySelectorAll<HTMLElement>(selector)]
      .filter(isAvailable)
      .map(labelFor);
    if (controls.some((label) => financialActionWords.test(separatedWords(label)))) return true;
    const headings = [...document.querySelectorAll<HTMLElement>('h1,h2,h3,[role="heading"]')]
      .filter(isAvailable)
      .map((heading) => heading.innerText || heading.textContent || '');
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    return financialContextWords.test(separatedWords([document.title, description, ...headings, ...controls].join(' ')));
  };
  const submitsForm = (element: HTMLElement) =>
    (element instanceof HTMLButtonElement && element.type === 'submit' && Boolean(element.form))
    || (element instanceof HTMLInputElement && ['submit', 'image'].includes(element.type) && Boolean(element.form));
  const needsReview = (element: HTMLElement, label: string) => destructiveWords.test(separatedWords(label)) || submitsForm(element);
  const nodeId = (element: HTMLElement) => {
    const previous = actionIdByElement.get(element);
    if (previous) {
      elementByActionId.set(previous, element);
      return previous;
    }
    const id = `spa-${nextActionId++}`;
    actionIdByElement.set(element, id);
    elementByActionId.set(id, element);
    return id;
  };
  const describe = (element: HTMLElement) => {
    if (!isAvailable(element) || element instanceof HTMLInputElement && element.type === 'password') return [];
    const label = labelFor(element);
    if (!label) return [];
    const clickableInput = element instanceof HTMLInputElement && ['button', 'submit', 'reset', 'checkbox', 'radio', 'image'].includes(element.type);
    const kind = element instanceof HTMLSelectElement ? 'select' : element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? (clickableInput ? 'button' : 'field') : element instanceof HTMLAnchorElement || element.getAttribute('role') === 'link' ? 'link' : 'button';
    // HTML buttons submit their owner form by default, even with no `type`
    // attribute. Treat that browser behaviour (and image inputs) as sensitive,
    // rather than relying on the author having written type="submit".
    return [{ id: nodeId(element), label, kind, destructive: needsReview(element, label) }];
  };
  const collect = () => {
    const actions = [...document.querySelectorAll<HTMLElement>(selector)].flatMap(describe);
    const activeIds = new Set(actions.map((action) => action.id));
    for (const id of elementByActionId.keys()) if (!activeIds.has(id)) elementByActionId.delete(id);
    return actions;
  };
  const undoContainer = (element: HTMLElement) => element.closest<HTMLElement>('[data-spa-undoable], [role="listitem"], li, tr, article');
  const activate = (id: string, expected: { label?: unknown; kind?: unknown; destructive?: unknown } | undefined, confirmed = false) => {
    const element = elementByActionId.get(id);
    if (!element || !document.contains(element)) return { ok: false, message: 'That action is no longer on this page. Scan the page again.' };
    if (!isAvailable(element)) return { ok: false, message: unavailableActionMessage };
    const [current] = describe(element);
    if (!current
      || expected?.label !== current.label
      || expected?.kind !== current.kind
      || expected?.destructive !== current.destructive) return { ok: false, message: changedActionMessage };
    const { label, destructive: sensitive } = current;
    if (sensitive && !confirmed) return { ok: false, needsReview: true, message: `Review ${label} before using it.` };
    const clickableInput = element instanceof HTMLInputElement && ['button', 'submit', 'reset', 'checkbox', 'radio', 'image'].includes(element.type);
    if ((element instanceof HTMLInputElement && !clickableInput) || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      element.focus();
      if (document.activeElement !== element) return { ok: false, message: unavailableActionMessage };
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
    return { ok: true, message: `Used ${label}.`, canUndo: Boolean(undo) };
  };

  chrome.runtime.onMessage.addListener((message: unknown) => {
    const typed = message as { type?: string; id?: string; expected?: { label?: unknown; kind?: unknown; destructive?: unknown }; confirmed?: boolean };
    if (typed?.type === 'SPA_COLLECT') {
      return Promise.resolve(isFinancialPage()
        ? { actions: [], title: document.title, blocked: true, message: financialPageMessage }
        : { actions: collect(), title: document.title });
    }
    if (typed?.type === 'SPA_ACTIVATE' && typed.id) {
      if (isFinancialPage()) return Promise.resolve({ ok: false, blocked: true, message: financialPageMessage });
      return Promise.resolve(activate(typed.id, typed.expected, typed.confirmed === true));
    }
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
