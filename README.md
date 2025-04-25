# Clipdown

A browser extension that converts web pages to Markdown format.

## Features

- One-click HTML to Markdown conversion
- Automatic clipboard copy of converted content
- Visual feedback through badge status:
  - Processing: "..." (Blue)
  - Success: "✓" (Green)
  - Error: "!" (Red)

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

```bash
# Install dependencies
npm install

# Build for development (with source maps)
npm run build

# Build for production
npm run build:prod
```

### Loading the Extension

1. Open your browser
2. Navigate to extension page
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `public` directory

## Usage

1. Navigate to any web page
2. Click the extension icon
3. The page content will be converted to Markdown and copied to your clipboard
4. Watch the badge status for feedback:
   - Blue "..." indicates processing
   - Green "✓" indicates success
   - Red "!" indicates an error

## License

MIT
