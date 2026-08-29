import './style.css';
import './pro.css';
import './touch.css';
import { findAction, normaliseWords, type PageAction } from '../../lib/actions';
import { installPageAgent } from '../../lib/page-agent';
import { browser } from 'wxt/browser';

type SpeechRecognitionLike = { start(): void; stop(): void; lang: string; interimResults: boolean; continuous: boolean; processLocally?: boolean; onresult: ((event: SpeechRecognitionEventLike) => void) | null; onerror: ((event: SpeechRecognitionErrorLike) => void) | null; onend: (() => void) | null; };
type SpeechRecognitionEventLike = { results: { length: number; [index: number]: { [index: number]: { transcript: string } } } };
type SpeechRecognitionErrorLike = { error: string };
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const talk = $('talk') as HTMLButtonElement, command = $('command') as HTMLInputElement, status = $('status'), list = $('action-list'), empty = $('empty'), count = $('count'), review = $('review') as HTMLDialogElement, reviewCopy = $('review-copy'), confirmAction = $('confirm') as HTMLButtonElement, undo = $('undo') as HTMLButtonElement, aliasTarget = $('alias-target') as HTMLSelectElement, aliasName = $('alias-name') as HTMLInputElement, licenseToken = $('license-token') as HTMLInputElement, licenseStatus = $('license-status'), aliasStatus = $('alias-status');
const defaultConfirmLabel = 'Confirm action';
const financialPageMessage = 'A finance or sign-in safety signal was found. This page cannot be scanned.';
let actions: PageAction[] = [], pending: PageAction | undefined, recognition: SpeechRecognitionLike | undefined, listening = false, ignoreTalkClick = false, pageBlocked = false;

async function activeTab() {
  const active = await browser.tabs.query({ active: true, currentWindow: true });
  // A real action popup is not a browser tab. This fallback also avoids trying
  // to inject into an extension tab when the popup is opened for inspection.
  const tab = active.find((item) => /^https?:/.test(item.url || ''))
    || (await browser.tabs.query({})).find((item) => /^https?:/.test(item.url || ''));
  if (!tab?.id) throw new Error('No active web page was found.');
  return tab.id;
}
async function pageMessage(message: object) {
  const tabId = await activeTab();
  await browser.scripting.executeScript({ target: { tabId }, func: installPageAgent });
  return browser.tabs.sendMessage(tabId, message);
}
function setStatus(message: string) { status.textContent = message; }
function render() {
  count.textContent = String(actions.length); list.innerHTML = ''; empty.hidden = actions.length > 0 || pageBlocked;
  aliasTarget.innerHTML = actions.map((action) => `<option value="${escapeHtml(action.label)}">${escapeHtml(action.label)}</option>`).join('');
  for (const action of actions) { const li = document.createElement('li'), button = document.createElement('button'); button.className = 'action'; button.type = 'button'; button.innerHTML = `<span>${escapeHtml(action.label)} ${action.destructive ? '<span class="risk">review</span>' : ''}</span><span class="kind">${action.kind}</span>`; button.addEventListener('click', () => use(action)); li.append(button); list.append(li); }
}
function escapeHtml(value: string) { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
async function scan() { setStatus('Scanning visible actions…'); try { const result = await pageMessage({ type: 'SPA_COLLECT' }); pageBlocked = result.blocked === true; actions = result.actions; render(); setStatus(pageBlocked ? result.message || financialPageMessage : actions.length ? `${actions.length} visible actions on ${result.title || 'this page'}.` : 'No labelled actions were found.'); } catch { pageBlocked = false; actions=[]; render(); setStatus('This page cannot be scanned. Open a normal web page and try again.'); } }
function openReview(action: PageAction) {
  pending = action;
  reviewCopy.textContent = `“${action.label}” may change or send something on this page.`;
  confirmAction.textContent = action.label;
  review.showModal();
}
function resetReview() { pending = undefined; confirmAction.textContent = defaultConfirmLabel; }
async function activate(action: PageAction, confirmed = false) { try { const result = await pageMessage({ type: 'SPA_ACTIVATE', id: action.id, expected: { label: action.label, kind: action.kind, destructive: action.destructive }, confirmed }); if (result.blocked) { pageBlocked = true; actions = []; render(); setStatus(result.message || financialPageMessage); return; } if (result.needsReview) { openReview(action); return; } setStatus(result.message); undo.hidden = !result.canUndo; if (result.ok) await scan(); } catch { setStatus('The page changed before that action could run. Scan the page again.'); } }
function use(action: PageAction) { if (action.destructive) openReview(action); else activate(action); }
async function runCommand() {
  if (pageBlocked) { setStatus(financialPageMessage); return; }
  const saved = await browser.storage.local.get(['spa:aliases', 'sb_license:speak-page-actions']);
  const aliases = saved['spa:aliases'] as Record<string, string> | undefined;
  const savedTarget = aliases?.[normaliseWords(command.value)];
  if (savedTarget) {
    const token = String(saved['sb_license:speak-page-actions'] || '');
    if (!token) { setStatus('Restore Pro to use saved command names.'); return; }
    try {
      if (!await licenseIsActive(token)) { setStatus('Restore Pro to use saved command names.'); return; }
    } catch {
      setStatus('The license could not be checked. Connect to the internet and try again.');
      return;
    }
  }
  const action = savedTarget ? findAction(savedTarget, actions) : findAction(command.value, actions);
  if (!action) { setStatus('No visible action matched those words. Say or type the label shown below.'); return; }
  use(action);
}
async function licenseIsActive(token: string) {
  const saved = await browser.storage.local.get('spa:license-verdict'); const cached = saved['spa:license-verdict'] as { valid?: boolean; checkedAt?: number; token?: string } | undefined;
  if (cached?.valid && cached.token === token && cached.checkedAt && Date.now() - cached.checkedAt < 86_400_000) return true;
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('License check failed.');
    const verdict = await response.json() as { valid: boolean }; await browser.storage.local.set({ 'spa:license-verdict': { ...verdict, token, checkedAt: Date.now() } }); return verdict.valid;
  } catch {
    if (cached?.valid && cached.token === token) return true;
    throw new Error('License check failed.');
  }
}
async function restoreLicense() {
  const token = licenseToken.value.trim();
  if (!token) { licenseStatus.textContent = 'Paste your Pro license token.'; return false; }
  licenseStatus.textContent = 'Checking license…';
  try {
    if (!await licenseIsActive(token)) { licenseStatus.textContent = 'This license is not active. Check the token or buy Pro on the product site.'; return false; }
    await browser.storage.local.set({ 'sb_license:speak-page-actions': token });
    licenseStatus.textContent = 'Pro is active in this extension.';
    return true;
  } catch {
    licenseStatus.textContent = 'The license could not be checked. Connect to the internet and try again.';
    return false;
  }
}
async function saveAlias() {
  const alias = normaliseWords(aliasName.value), target = aliasTarget.value;
  if (!alias || !target) { aliasStatus.textContent = 'Enter a command name and choose a visible control.'; return; }
  const savedLicense = await browser.storage.local.get('sb_license:speak-page-actions');
  const token = licenseToken.value.trim() || String(savedLicense['sb_license:speak-page-actions'] || '');
  if (!token) { aliasStatus.textContent = 'Restore Pro before saving a command name.'; return; }
  aliasStatus.textContent = 'Checking license…';
  try { if (!await licenseIsActive(token)) { aliasStatus.textContent = 'This license is not active. Check the token or buy Pro on the product site.'; return; } const current = (await browser.storage.local.get('spa:aliases'))['spa:aliases'] as Record<string, string> | undefined; await browser.storage.local.set({ 'spa:aliases': { ...current, [alias]: target }, 'sb_license:speak-page-actions': token }); licenseStatus.textContent = 'Pro is active in this extension.'; aliasStatus.textContent = `Saved “${alias}” for ${target}.`; } catch { aliasStatus.textContent = 'The license could not be checked. Connect to the internet and try again.'; }
}
async function loadSavedLicense() {
  const saved = await browser.storage.local.get(['sb_license:speak-page-actions', 'spa:license-verdict']);
  const token = String(saved['sb_license:speak-page-actions'] || '');
  const verdict = saved['spa:license-verdict'] as { valid?: boolean; token?: string; checkedAt?: number } | undefined;
  if (!token) return;
  licenseToken.value = token;
  if (verdict?.valid && verdict.token === token) {
    licenseStatus.textContent = 'Pro is active in this extension.';
    if (!verdict.checkedAt || Date.now() - verdict.checkedAt >= 86_400_000) void licenseIsActive(token).then((valid) => {
      if (!valid) licenseStatus.textContent = 'This license is not active. Check the token or buy Pro on the product site.';
    }).catch(() => undefined);
  }
}
function showListening(active: boolean) {
  listening = active;
  talk.setAttribute('aria-pressed', String(active));
  talk.textContent = active ? '● Listening… release to stop' : '● Hold to speak';
  talk.setAttribute('aria-label', active ? 'Listening. Release to stop.' : 'Hold to speak. Hold Space or Enter with the keyboard.');
}
function makeRecognition() {
  const Constructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Constructor) { setStatus('Speech recognition is unavailable here. Type the command instead.'); return; }
  const candidate = new Constructor() as SpeechRecognitionLike;
  if (!('processLocally' in candidate)) { setStatus('On-device speech recognition is unavailable here. Type the command instead.'); return; }
  candidate.processLocally = true;
  candidate.lang = navigator.language || 'en-US'; candidate.interimResults = false; candidate.continuous = false;
  candidate.onresult = (event) => { command.value = event.results[event.results.length - 1][0].transcript; setStatus(`Heard “${command.value}”.`); void runCommand(); };
  candidate.onerror = (event) => { showListening(false); setStatus(event.error === 'not-allowed' ? 'Microphone access was denied. Allow it, or type the command.' : 'On-device speech was not available. Type the command instead.'); };
  candidate.onend = () => { showListening(false); };
  recognition = candidate;
}
function startListening() { if (listening) return; if (!recognition) makeRecognition(); if (!recognition) return; try { showListening(true); setStatus('Listening. Release when you finish the action label.'); recognition.start(); } catch { showListening(false); setStatus('On-device speech was not available. Type the command instead.'); } }
function stopListening() { if (!listening) return; recognition?.stop(); }
$('scan').addEventListener('click', scan); $('run').addEventListener('click', runCommand); command.addEventListener('keydown', (e) => { if (e.key === 'Enter') runCommand(); });
talk.addEventListener('pointerdown', () => { ignoreTalkClick = true; startListening(); }); talk.addEventListener('pointerup', stopListening); talk.addEventListener('pointercancel', stopListening); talk.addEventListener('pointerleave', stopListening); talk.addEventListener('click', () => { if (ignoreTalkClick) { ignoreTalkClick = false; return; } }); talk.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); startListening(); }}); talk.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); stopListening(); }});
$('cancel').addEventListener('click', () => { review.close(); resetReview(); }); confirmAction.addEventListener('click', () => { const action = pending; review.close(); resetReview(); if (action) activate(action, true); }); review.addEventListener('close', resetReview); undo.addEventListener('click', async () => { const result = await pageMessage({ type: 'SPA_UNDO' }); setStatus(result.message); undo.hidden = true; await scan(); }); $('restore-license').addEventListener('click', restoreLicense); $('save-alias').addEventListener('click', saveAlias);
void loadSavedLicense(); void scan();
