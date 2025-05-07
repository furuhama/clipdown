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
  const status = BADGE_STATES[state];
  await chrome.action.setBadgeText({ text: status.text });
  await chrome.action.setBadgeBackgroundColor({ color: status.backgroundColor });
};

// Clear badge after delay
const clearBadgeAfterDelay = (delay: number) => {
  setTimeout(async () => {
    await updateBadge('idle');
  }, delay);
};

// Handle click on browser extension icon
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

  try {
    await updateBadge('processing');

    // Execute content script
    const result = await chrome.tabs.sendMessage(tab.id, { action: 'convert' });

    if (!result.success) {
      throw new Error(result.error);
    }

    // Copy markdown to clipboard using content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text: string) => {
        return navigator.clipboard.writeText(text);
      },
      args: [result.markdown]
    });

    await updateBadge('success');
    clearBadgeAfterDelay(3000); // Clear after 3 seconds
  } catch (error) {
    await updateBadge('error');
    clearBadgeAfterDelay(5000); // Clear after 5 seconds
  }
});
