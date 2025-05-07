import TurndownService from 'turndown';

class ContentScript {
  private turndown: TurndownService;

  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    });

    // Remove unwanted elements before conversion
    this.turndown.remove(['script', 'style', 'noscript']);
    console.log('debug: remove unwanted elements before conversion');

    // 画像URLを絶対パスに変換するルールを追加
    this.turndown.addRule('images', {
      filter: 'img',
      replacement: (content, node) => {
        const img = node as HTMLImageElement;
        const src = img.getAttribute('src');
        if (!src) return '';

        try {
          // 相対パスを絶対パスに変換
          const absoluteUrl = new URL(src, document.URL).href;
          const alt = img.getAttribute('alt') || '';
          return `![${alt}](${absoluteUrl})`;
        } catch (error) {
          // URLの変換に失敗した場合は元のsrcをそのまま使用
          const alt = img.getAttribute('alt') || '';
          return `![${alt}](${src})`;
        }
      }
    });
  }

  public getMarkdown(): string {
    // Priority: article > main > body
    const article = document.querySelector('article');
    const main = document.querySelector('main');
    const body = document.body;

    const content = article || main || body;

    if (!content) {
      throw new Error('No content found to convert');
    }

    const markdown = this.turndown.turndown(content);
    return markdown;
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'convert') {
    try {
      const contentScript = new ContentScript();
      const markdown = contentScript.getMarkdown();
      sendResponse({ success: true, markdown });
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
  return true; // Required to use sendResponse asynchronously
});
