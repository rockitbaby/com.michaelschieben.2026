# Every Decoding Is Another Encoding

Personal website for Michael Schieben — Facilitator, Strategist, Creative Technologist.

---

## The Concept

This website is built on a deliberate paradox: **every decoding is another encoding**.

The same content transforms through multiple representations, each "decoding" creating a new "encoding":

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   MARKDOWN          BUILD           HTML           BROWSER              │
│   ─────────────────────────────────────────────────────────────────────│
│                                                                         │
│   content/      →   marked.js   →   build/      →   turndown.js        │
│   sections/         parses          index.html      converts back       │
│   *.md              to HTML         (pure HTML)     to Markdown         │
│                                                     ↓                   │
│                                                     DOM manipulation    │
│                                                     rebuilds into       │
│                                                     view modes          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Why This Matters

1. **Build outputs pure HTML** — No JavaScript required to read the content
2. **Browser reconstructs Markdown from HTML** — Using Turndown to reverse the transformation
3. **DOM manipulation creates view modes** — The reconstructed data feeds different presentations

This isn't a technical gimmick. It's a statement about how we create and consume information.

---

## Build Process

```sh
npm run build
```

This runs:

1. `clean` — Wipes the `build/` folder
2. `vite build` — Bundles the enhancement scripts
3. `build:html` — Converts Markdown → pure HTML
4. `build:copy-assets` — Copies images and static files
5. `build:clean` — Removes unused artifacts

### What `build:html` Does

```
content/sections/*.md
        ↓
   parse frontmatter (YAML)
        ↓
   convert body (marked.js → HTML)
        ↓
   write pure HTML with structured frontmatter
        ↓
build/index.html
```

The output is **pure HTML**. No React hydration. No JavaScript needed to read content.

```html
<section data-slug="01-hero">
  <aside class="frontmatter">
    <dl>
      <dt>order: </dt><dd>1</dd>
      <dt>title: </dt><dd>Ankommen</dd>
    </dl>
  </aside>
  <div class="markdown">
    <h1>Michael Schieben</h1>
    <p>Nach meinen Workshops wissen 80 Menschen, wohin sie gehen.</p>
  </div>
</section>
```

---

## Enhancement (Browser)

When `enhance.js` loads, it:

1. **Reads the HTML** already in the DOM
2. **Reconstructs Markdown** using Turndown (HTML → Markdown)
3. **Rebuilds the DOM** into different view modes

```typescript
// From enhance.tsx
const sections = reconstructSections();  // HTML → Markdown
switchMode(currentMode);                 // Markdown → DOM (view modes)
```

### reconstruct.ts

The heart of the reversal:

```typescript
import TurndownService from 'turndown';

// HTML → Markdown
export function htmlToMarkdown(htmlElement: HTMLElement): string {
  return turndown.turndown(htmlElement);
}

// Structured frontmatter from <dl> → Object
export function parseFrontmatterFromHTML(aside: HTMLElement): Record<string, unknown> {
  // Reads the definition list, rebuilds the frontmatter object
}
```

---

## View Modes

Each mode is a different "encoding" of the same content:

| Mode | What You See |
|------|--------------|
| **READER** | Original HTML as rendered by marked.js |
| **PAGE** | React-ified layout with sidebar metadata |
| **RAW** | Reconstructed Markdown source (from Turndown) |
| **SOURCE** | GitHub link to original `.md` files |

Toggle with `⌘1`, `⌘2`, `⌘3`, `⌘U`.

---

## Project Structure

```
content/
  sections/           ← Markdown source files
    01-hero.md
    02-versprechen.md
    ...
  images/             ← Content images → build/2026/images/

public/               ← Static assets → build/

scripts/
  build-html.js       ← Markdown → pure HTML
  copy-assets.js      ← Copy images & static files
  clean.js            ← Wipe build folder

src/
  enhance.tsx         ← Browser enhancement entry
  lib/
    reconstruct.ts    ← HTML → Markdown (Turndown)
  enhance-reader.tsx  ← PAGE mode rendering
  enhance-raw.tsx     ← RAW mode rendering

build/
  index.html          ← Pure HTML output
  2026/
    assets/           ← Bundled JS/CSS
    images/           ← Content images
```

---

## Development

```sh
npm install
npm run dev          # Vite dev server
npm run build        # Production build
npm run serve:build  # Serve build folder
```

---

## Tech Stack

- **Vite** — Build tooling
- **TypeScript** — Type safety
- **marked.js** — Markdown → HTML (build time)
- **Turndown** — HTML → Markdown (browser)
- **Tailwind CSS** — Styling

---

*Every decoding is another encoding.*
