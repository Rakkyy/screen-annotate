# Screen Annotate

A modern screenshot annotation tool built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Image Upload**: Upload screenshots or any image to annotate
- **Drawing Tools**:
  - Arrow tool with enhanced visibility
  - Rectangle tool for highlighting areas
  - Text tool for adding labels
  - Selection tool for moving and editing annotations
- **Color Picker**: Choose from 10 preset colors or use custom colors
- **Undo Functionality**: Step back through your annotation history
- **Save & Share**: Generate unique URLs to share your annotated images
- **Download**: Export your annotated images as PNG files
- **Sticky Toolbar**: Polished, always-accessible toolbar interface
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Fabric.js**: Canvas manipulation library
- **nanoid**: Unique ID generation for sharing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Upload an Image**: Click "Upload Image" on the home page and select your screenshot
2. **Select a Tool**: Choose from arrow, rectangle, or text tools in the toolbar
3. **Choose a Color**: Pick a color from the preset palette or use the custom color picker
4. **Draw Annotations**: Click and drag to create arrows and rectangles, or click to add text
5. **Edit**: Use the selection tool to move, resize, or delete annotations
6. **Undo**: Click the undo button to revert changes
7. **Save & Share**: Click "Save & Share" to generate a unique URL (copied to clipboard)
8. **Download**: Export your annotated image as a PNG file

## Project Structure

```
screen-annotate/
├── app/
│   ├── editor/[id]/     # Editor page with canvas
│   ├── share/[id]/      # Shared image viewer
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page with upload
├── components/
│   ├── Canvas.tsx       # Main canvas component with Fabric.js
│   └── Toolbar.tsx      # Toolbar with tools and controls
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Features in Detail

### Arrow Tool
Arrows are styled with:
- 4px stroke width for visibility
- 20px arrow head length
- 15px arrow head width
- Smooth angle calculations

### Color Picker
- 10 preset colors (red, green, blue, yellow, magenta, cyan, orange, purple, black, white)
- Custom color picker for any color
- Visual feedback for selected color

### Undo System
- Complete history tracking
- Step backward through changes
- Preserves canvas state

### Share Functionality
- Generates unique 10-character IDs
- Stores images in localStorage
- Copies share URL to clipboard
- Shareable links work across sessions

## Browser Support

Works in all modern browsers that support:
- ES6+
- Canvas API
- localStorage
- FileReader API

## License

MIT
