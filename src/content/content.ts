import TurndownService from 'turndown';

class ContentScript {
  private turndown: TurndownService;

  constructor() {
    console.log('[Content] Initializing TurndownService');
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    });

    // Remove unwanted elements before conversion
    this.turndown.remove(['script', 'style', 'noscript']);
  }

  public getMarkdown(): string {
    console.log('[Content] Starting getMarkdown');
    // Priority: article > main > body
    const article = document.querySelector('article');
    const main = document.querySelector('main');
    const body = document.body;

    console.log('[Content] DOM elements found:', {
      hasArticle: !!article,
      hasMain: !!main,
      hasBody: !!body
    });

    const content = article || main || body;

    if (!content) {
      console.error('No content found to convert');
      throw new Error('No content found to convert');
    }

    const markdown = this.turndown.turndown(content);
    console.log('Converted to markdown, length:', markdown.length);
    console.log('[Content] Conversion completed, markdown length:', markdown.length);
    console.log('[Content] First 100 characters:', markdown.substring(0, 100));
    return markdown;
  }
}

// Listen for messages from the background script
console.log('[Content] Setting up message listener');

// Check for last error
if (chrome.runtime.lastError) {
  console.error('[Content] Last error:', chrome.runtime.lastError);
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Content] Received message:', request);
  if (request.action === 'convert') {
    try {
      console.log('[Content] Creating new instance');
      const contentScript = new ContentScript();
      const markdown = contentScript.getMarkdown();
      console.log('[Content] Conversion successful, sending response');
      sendResponse({ success: true, markdown });
    } catch (error) {
      console.error('[Content] Conversion failed:', error);
      if (chrome.runtime.lastError) {
        console.error('[Content] Runtime error:', chrome.runtime.lastError);
      }
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
  return true; // Required to use sendResponse asynchronously
});
