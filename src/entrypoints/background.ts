import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => browser.storage.local.set({ 'spa:version': '1.0.0' }));
});
