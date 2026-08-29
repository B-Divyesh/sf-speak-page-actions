export type PageAction = {
  id: string;
  label: string;
  kind: 'button' | 'link' | 'field' | 'select';
  destructive: boolean;
  selector?: string;
};

const destructiveWords = /\b(?:delete|remove|discard|destroy|publish|send|submit|pay|purchase|place order|sign out|unsubscribe|archive|deactivate|close(?:\s+(?:my|your|the))?\s+account|cancel(?:\s+(?:my|your|the))?\s+(?:subscription|plan|membership)|end(?:\s+(?:my|your|the))?\s+(?:subscription|plan|membership)|terminate(?:\s+(?:my|your|the))?\s+account|transfer|wire|withdraw(?:al)?|deposit|cash out|send money|move money|pay bill|add payee|beneficiary)\b/i;

export function normaliseWords(value: string) {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function commandTarget(command: string) {
  return normaliseWords(command).replace(/^(click|press|open|choose|select|focus|type)\s+/, '');
}

export function findAction(command: string, actions: PageAction[]) {
  const target = commandTarget(command);
  if (!target) return undefined;
  return actions.find((action) => normaliseWords(action.label) === target)
    ?? actions.find((action) => normaliseWords(action.label).includes(target) || target.includes(normaliseWords(action.label)));
}

export function isDestructive(label: string, element?: Element) {
  // Inline icon/status text can run into the visible label ("BUTTONDelete").
  // Insert a word break at lower-to-upper transitions before checking it.
  const submitsForm = (typeof HTMLButtonElement !== 'undefined' && element instanceof HTMLButtonElement && element.type === 'submit' && Boolean(element.form))
    || (typeof HTMLInputElement !== 'undefined' && element instanceof HTMLInputElement && ['submit', 'image'].includes(element.type) && Boolean(element.form));
  return destructiveWords.test(label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')) || submitsForm;
}

export function visible(element: HTMLElement) {
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
}

export function labelFor(element: HTMLElement) {
  const cleanLabel = (value: string) => value.replace(/\s+/g, ' ').trim();
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
}
