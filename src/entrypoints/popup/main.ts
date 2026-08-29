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
const talk = $('talk') as HTMLButtonElement, command = $('command') as HTMLInputElement, status = $('status'), list = $('action-list'), empty = $('empty'), count = $('count'), review = $('review') as HTMLDialogElement, reviewCopy = $('review-copy'), undo = $('undo') as HTMLButtonElement, aliasTarget = $('alias-target') as HTMLSelectElement, aliasName = $('alias-name') as HTMLInputElement, licenseToken = $('license-token') as HTMLInputElement, aliasStatus = $('alias-status');
let actions: PageAction[] = [], pending: PageAction | undefined, recognition: SpeechRecognitionLike | undefined, listening = false, ignoreTalkClick = false;

async function activeTab() { const [tab] = await browser.tabs.query({ active: true, currentWindow: true }); if (!tab.id) throw new Error('No active page was found.'); return tab.id; }
async function pageMessage(message: object) {
  const tabId = await activeTab();
  await browser.scripting.executeScript({ target: { tabId }, func: installPageAgent });
  return browser.tabs.sendMessage(tabId, message);
}
function setStatus(message: string) { status.textContent = message; }
function render() {
  count.textContent = String(actions.length); list.innerHTML = ''; empty.hidden = actions.length > 0;
  aliasTarget.innerHTML = actions.map((action) => `<option value="${escapeHtml(action.label)}">${escapeHtml(action.label)}</option>`).join('');
  for (const action of actions) { const li = document.createElement('li'), button = document.createElement('button'); button.className = 'action'; button.type = 'button'; button.innerHTML = `<span>${escapeHtml(action.label)} ${action.destructive ? '<span class="risk">review</span>' : ''}</span><span class="kind">${action.kind}</span>`; button.addEventListener('click', () => use(action)); li.append(button); list.append(li); }
}
function escapeHtml(value: string) { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
async function scan() { setStatus('Scanning visible actions…'); try { const result = await pageMessage({ type: 'SPA_COLLECT' }); actions = result.actions; render(); setStatus(actions.length ? `${actions.length} visible actions on ${result.title || 'this page'}.` : 'No labelled actions were found.'); } catch { actions=[]; render(); setStatus('This page cannot be scanned. Open a normal web page and try again.'); } }
async function activate(action: PageAction, confirmed = false) { try { const result = await pageMessage({ type: 'SPA_ACTIVATE', id: action.id, confirmed }); if (result.needsReview) { pending = action; reviewCopy.textContent = `“${action.label}” may change or send something on this page.`; review.showModal(); return; } setStatus(result.message); undo.hidden = !result.canUndo; if (result.ok) await scan(); } catch { setStatus('The page changed before that action could run. Scan the page again.'); } }
function use(action: PageAction) { if (action.destructive) { pending = action; reviewCopy.textContent = `“${action.label}” may change or send something on this page.`; review.showModal(); } else activate(action); }
async function runCommand() { const aliases = (await browser.storage.local.get('spa:aliases'))['spa:aliases'] as Record<string, string> | undefined; const savedTarget = aliases?.[normaliseWords(command.value)]; const action = savedTarget ? findAction(savedTarget, actions) : findAction(command.value, actions); if (!action) { setStatus('No visible action matched those words. Say or type the label shown below.'); return; } use(action); }
async function licenseIsActive(token: string) {
  const saved = await browser.storage.local.get('spa:license-verdict'); const cached = saved['spa:license-verdict'] as { valid?: boolean; checkedAt?: number } | undefined;
  if (cached?.valid && cached.checkedAt && Date.now() - cached.checkedAt < 86_400_000) return true;
  const response = await fetch(`https://api.sociobot.in/api/v1/products/speak-page-actions/verify?license=${encodeURIComponent(token)}`);
  const verdict = await response.json() as { valid: boolean }; await browser.storage.local.set({ 'spa:license-verdict': { ...verdict, checkedAt: Date.now() } }); return verdict.valid;
}
async function saveAlias() {
  const alias = normaliseWords(aliasName.value), target = aliasTarget.value, token = licenseToken.value.trim();
  if (!alias || !target || !token) { aliasStatus.textContent = 'Enter an alias, choose an action, and paste your pro license token.'; return; }
  aliasStatus.textContent = 'Checking license…';
  try { if (!await licenseIsActive(token)) { aliasStatus.textContent = 'This license is not active. You can buy or restore a license on the product site.'; return; } const current = (await browser.storage.local.get('spa:aliases'))['spa:aliases'] as Record<string, string> | undefined; await browser.storage.local.set({ 'spa:aliases': { ...current, [alias]: target }, 'sb_license:speak-page-actions': token }); aliasStatus.textContent = `Saved “${alias}” for ${target}.`; } catch { aliasStatus.textContent = 'The license could not be checked. Connect to the internet and try again.'; }
}
function makeRecognition() {
  const Constructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Constructor) { setStatus('Speech recognition is unavailable here. Type the command instead.'); return; }
  const candidate = new Constructor() as SpeechRecognitionLike;
  if (!('processLocally' in candidate)) { setStatus('On-device speech recognition is unavailable here. Type the command instead.'); return; }
  candidate.processLocally = true;
  candidate.lang = navigator.language || 'en-US'; candidate.interimResults = false; candidate.continuous = false;
  candidate.onresult = (event) => { command.value = event.results[event.results.length - 1][0].transcript; setStatus(`Heard “${command.value}”.`); void runCommand(); };
  candidate.onerror = (event) => { setStatus(event.error === 'not-allowed' ? 'Microphone access was denied. Allow it, or type the command.' : 'On-device speech was not available. Type the command instead.'); };
  candidate.onend = () => { listening = false; talk.setAttribute('aria-pressed', 'false'); talk.textContent = '● Hold to speak'; talk.setAttribute('aria-label', 'Hold to speak. Hold Space or Enter with the keyboard.'); };
  recognition = candidate;
}
function startListening() { if (listening) return; if (!recognition) makeRecognition(); if (!recognition) return; try { listening = true; talk.setAttribute('aria-pressed', 'true'); talk.textContent = '● Listening… release to stop'; talk.setAttribute('aria-label', 'Listening. Release to stop.'); setStatus('Listening. Release when you finish the action label.'); recognition.start(); } catch { listening = false; /* recognition already started */ } }
function stopListening() { if (!listening) return; recognition?.stop(); }
$('scan').addEventListener('click', scan); $('run').addEventListener('click', runCommand); command.addEventListener('keydown', (e) => { if (e.key === 'Enter') runCommand(); });
talk.addEventListener('pointerdown', () => { ignoreTalkClick = true; startListening(); }); talk.addEventListener('pointerup', stopListening); talk.addEventListener('pointercancel', stopListening); talk.addEventListener('pointerleave', stopListening); talk.addEventListener('click', () => { if (ignoreTalkClick) { ignoreTalkClick = false; return; } }); talk.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); startListening(); }}); talk.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); stopListening(); }});
$('cancel').addEventListener('click', () => review.close()); $('confirm').addEventListener('click', () => { review.close(); if (pending) activate(pending, true); pending = undefined; }); undo.addEventListener('click', async () => { const result = await pageMessage({ type: 'SPA_UNDO' }); setStatus(result.message); undo.hidden = true; await scan(); }); $('save-alias').addEventListener('click', saveAlias);
scan();
