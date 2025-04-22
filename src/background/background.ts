console.log('[Background] Script loaded');

// Badge status configurations
type BadgeStatus = {
  text: string;
  backgroundColor: string;
};

const BADGE_STATES: Record<string, BadgeStatus> = {
  idle: { text: "", backgroundColor: "#666666" },
  processing: { text: "...", backgroundColor: "#2563eb" },
  success: { text: "✓", backgroundColor: "#22c55e" },
  error: { text: "!", backgroundColor: "#ef4444" }
};

// Update badge state
const updateBadge = async (state: keyof typeof BADGE_STATES) => {
  console.log(`[Background] Updating badge to ${state}`);
  const status = BADGE_STATES[state];
  await chrome.action.setBadgeText({ text: status.text });
  await chrome.action.setBadgeBackgroundColor({ color: status.backgroundColor });
};

// Clear badge after delay
const clearBadgeAfterDelay = (delay: number) => {
  setTimeout(async () => {
    console.log('[Background] Clearing badge');
    await updateBadge('idle');
  }, delay);
};

// Handle click on browser extension icon
chrome.action.onClicked.addListener(async (tab) => {
  console.log('[Background] Extension icon clicked', { tabId: tab.id });
  if (!tab.id) {
    return;
  }

  try {
    await updateBadge('processing');

    // Execute content script
    console.log('[Background] Sending convert message to content script');
    const result = await chrome.tabs.sendMessage(tab.id, { action: 'convert' });
    console.log('[Background] Received result from content script:', result);

    if (!result.success) {
      console.error('[Background] Conversion failed:', result.error);
      throw new Error(result.error);
    }

    // Copy markdown to clipboard using content script
    console.log('[Background] Executing clipboard write script');
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text: string) => {
        return navigator.clipboard.writeText(text);
      },
      args: [result.markdown]
    });
    console.log('[Background] Successfully copied to clipboard');

    await updateBadge('success');
    clearBadgeAfterDelay(3000); // Clear after 3 seconds
  } catch (error) {
    console.error('[Background] Error:', error);
    await updateBadge('error');
    clearBadgeAfterDelay(5000); // Clear after 5 seconds
  }
});
