import { isDestructive, labelFor, visible, type PageAction } from '../lib/actions';

const selector = 'a[href],button,input:not([type="hidden"]):not([type="password"]),textarea,select,[role="button"],[role="link"]';
let undo: (() => void) | undefined;

function nodeId(element: Element, index: number) {
  const previous = element.getAttribute('data-spa-id');
  if (previous) return previous;
  const id = `spa-${index}`;
  element.setAttribute('data-spa-id', id);
  return id;
}

function collect(): PageAction[] {
  return [...document.querySelectorAll<HTMLElement>(selector)].flatMap((element, index) => {
    if (!visible(element) || element.getAttribute('aria-hidden') === 'true' || element instanceof HTMLInputElement && element.type === 'password') return [];
    const label = labelFor(element);
    if (!label) return [];
    const clickableInput = element instanceof HTMLInputElement && ['button', 'submit', 'reset', 'checkbox', 'radio', 'image'].includes(element.type);
    const kind: PageAction['kind'] = element instanceof HTMLSelectElement ? 'select' : element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? (clickableInput ? 'button' : 'field') : element instanceof HTMLAnchorElement || element.getAttribute('role') === 'link' ? 'link' : 'button';
    return [{ id: nodeId(element, index), label, kind, destructive: isDestructive(label, element) }];
  });
}

function activate(id: string) {
  const element = document.querySelector<HTMLElement>(`[data-spa-id="${CSS.escape(id)}"]`);
  if (!element) return { ok: false, message: 'That action is no longer on this page. Scan the page again.' };
  const clickableInput = element instanceof HTMLInputElement && ['button', 'submit', 'reset', 'checkbox', 'radio', 'image'].includes(element.type);
  if ((element instanceof HTMLInputElement && !clickableInput) || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    element.focus();
    return { ok: true, message: `Focused ${labelFor(element)}.` };
  }
  const parent = element.parentNode;
  const next = element.nextSibling;
  const copy = element.cloneNode(true);
  undo = parent ? () => { if (!document.contains(element)) parent.insertBefore(copy, next); } : undefined;
  element.click();
  return { ok: true, message: `Used ${labelFor(element)}.`, canUndo: Boolean(undo) };
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === 'SPA_COLLECT') return Promise.resolve({ actions: collect(), title: document.title });
      if (message?.type === 'SPA_ACTIVATE') return Promise.resolve(activate(message.id));
      if (message?.type === 'SPA_UNDO') {
        if (!undo) return Promise.resolve({ ok: false, message: 'There is no action to undo on this page.' });
        undo(); undo = undefined;
        return Promise.resolve({ ok: true, message: 'The page action was undone where the page allowed it.' });
      }
      return undefined;
    });
  },
});
