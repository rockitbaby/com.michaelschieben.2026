# Website 2026 — Design & Technical Briefing for Lovable

## Project Overview

Personal website for Michael Schieben — Facilitator, Strategist, Creative Technologist.

**Core Concept:** "Every decoding is another encoding"
The website demonstrates this principle through four different viewing modes of the same content, showing the transformations between markdown source and rendered output.

---

## Design Philosophy

**Nerdy + Meta + Warm**

- **Nerdy/Meta**: Expose the "machine" — show frontmatter, markdown syntax, source code
- **Warm**: Photography as collages, generous spacing, warm color palette
- **Minimal**: No excessive formatting, clean hierarchy, purposeful design

---

## Technical Architecture

### Content Structure

```
/content
  /sections
    01-hero.md
    02-versprechen.md
    03-beweis-kunsthalle.md
    04-spektrum.md
    05-haltung.md
    06-aktuell.md
    07-ziele-2026.md
    08-kontakt.md
```

**CRITICAL REQUIREMENT:** 
- Use REAL .md files stored in the `/content/sections` directory
- Each section is a separate markdown file with YAML frontmatter
- Files are read at build/runtime, NOT hardcoded content
- File naming convention: `[order]-[slug].md`

### Frontmatter Schema

Every .md file starts with YAML frontmatter:

```yaml
---
order: 3                    # Determines display order
title: "Section Title"      # Display title
purpose: "Internal note"    # For editor context, not displayed
layout: "full-width"        # Layout variant: full-width, sidebar-left, columns-3
sidebar_meta:               # Optional metadata for sidebar display
  - label: "Kunde"
    value: "Hamburger Kunsthalle"
  - label: "Jahr"
    value: "2025"
related_post: "https://push.michaelschieben.com/..."  # Optional
---

# Markdown content starts here...
```

### Custom Components in Markdown

Support custom React components within markdown:

- Quote
- PhotoCollage

---

## Four Viewing Modes

### 1. READER (Default)

**Layout:**
- Two-column grid: Sidebar (250px) + Content (flexible)
- Sidebar: Sticky, shows frontmatter metadata in code-style formatting
- Content: Fully rendered markdown with custom components

**Desktop:**
```
┌─────────────────────────────────────────────┐
│ [READER] [MD] [RAW] [SOURCE]                │
├──────────┬──────────────────────────────────┤
│ // meta  │                                  │
│ order: 3 │  ## Hamburger Kunsthalle        │
│ title:   │                                  │
│ "Wie..." │  Zwei Workshoptage...           │
│          │                                  │
│ kunde:   │  [Photo Collage]                │
│ "Kunst.."│                                  │
│          │  > Quote from...                │
│ (sticky) │                                  │
└──────────┴──────────────────────────────────┘
```

**Mobile:**
- Stack: Metadata becomes collapsible accordion at top
- Or: Bottom drawer (swipe up to reveal metadata)
- Content takes full width below

### 2. MARKDOWN (iA Writer Style)

**Layout:**
- Two panels: Frontmatter (300px) + Markdown content
- Shows markdown WITH syntax but formatted (monospace, syntax colors)
- NOT rendered — shows actual markdown code

**Desktop:**
```
┌──────────────┬──────────────────────────────┐
│ ---          │ ## Hamburger Kunsthalle      │
│ order: 3     │                              │
│ title: "..." │ Zwei Workshoptage im Januar. │
│ kunde: "..." │ **Partizipativer** Auftakt.  │
│ ---          │                              │
│              │ <PhotoCollage                │
│ (gray bg)    │   images={[...]}             │
│              │ />                           │
└──────────────┴──────────────────────────────┘
```

**Mobile:**
- Stack vertically: Frontmatter accordion + Markdown content below
- Or: Tabs to switch between Frontmatter / Content

### 3. RAW

**Layout:**
- Single column, centered (max 900px)
- Shows COMPLETE .md file exactly as stored on disk
- Dark code editor theme
- Download button to save .md file

**Desktop & Mobile:**
```
┌─────────────────────────────────────────────┐
│ 03-beweis-kunsthalle.md      [Download]    │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ ---                                     │ │
│ │ order: 3                                │ │
│ │ title: "Wie ich arbeite"                │ │
│ │ ---                                     │ │
│ │                                         │ │
│ │ ## Hamburger Kunsthalle                 │ │
│ │ ...                                     │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 4. SOURCE

**Implementation:**
- Button triggers: `window.location = 'view-source:' + window.location.href`
- Opens native browser view-source functionality
- Shows the actual HTML/React output

---

## Design System

### Colors

```css
--bg-primary: #faf8f5;      /* Warm beige background */
--bg-secondary: #f5f5f5;    /* Light gray for panels */
--bg-code: #1e1e1e;         /* Dark code background */

--text-primary: #2a2a2a;    /* Almost black */
--text-secondary: #666;     /* Medium gray */
--text-tertiary: #999;      /* Light gray */

--border: #d4d4d4;          /* Borders */
--accent: #2a2a2a;          /* Active state */
```

### Typography

```css
/* Code/Meta */
--font-mono: "JetBrains Mono", "SF Mono", Consolas, monospace;

/* Headings */
--font-sans: "Inter", system-ui, -apple-system, sans-serif;

/* Body Content */
--font-serif: Georgia, "Times New Roman", serif;

/* Sizes */
--text-sm: 0.875rem;   /* 14px - code, meta */
--text-base: 1rem;     /* 16px - UI */
--text-lg: 1.125rem;   /* 18px - body content */
--text-xl: 1.5rem;     /* 24px - headings */
```

### Spacing

```css
--space-xs: 0.5rem;    /* 8px */
--space-sm: 1rem;      /* 16px */
--space-md: 2rem;      /* 32px */
--space-lg: 3rem;      /* 48px */
--space-xl: 4rem;      /* 64px */
```

### Breakpoints

```css
--mobile: 640px
--tablet: 768px
--desktop: 1024px
--wide: 1280px
```

---

## Component Specifications

### Quote

**Apply**
markdown blockquote tag `>` followed by paragraph that starts with `:> Name (Role)`

**Style**

- Left border accent
- Serif font, slightly larger
- Author/role in smaller sans-serif

**Example:**
```md
> Begleitet hat den Prozess als Coach Michael Schieben, der uns geholfen hat, auch manchmal widerstrebende Vorstellungen kompromissfähig zu machen.

:> Dr. Jan Metzler (Leiter Marketing)
```


### PhotoCollage

**Apply**
n lines of markdown image tags (n > 2)

**Behavior:**
- Asymmetric: CSS Grid with custom areas)
- Grid: Standard 2-3 column grid
- Stacked: Vertical stack for mobile

**Example:**
```md
![](/images/kunsthalle-raum.jpg)
![](/images/gruppe-diskussion.jpg)
![](/images/leitbild-gedruckt.jpg)
```

---

## Interaction Details

### Mode Toggle

**Desktop:**
- Sticky header at top
- Four buttons: READER | MD | RAW | SOURCE
- Active state: Dark background, light text
- Hover: Border highlight

**Mobile:**
- Compact: R | M | Ra | S
- Or: Dropdown menu
- Still sticky

### Keyboard Shortcuts

```
⌘/Ctrl + 1  → Reader mode
⌘/Ctrl + 2  → Markdown mode
⌘/Ctrl + 3  → Raw mode
⌘/Ctrl + U  → Source mode
```

**Implementation:**
- Show hints when ⌘/Ctrl is held down
- Small labels appear above buttons

### URL State

Modes should be shareable via URL:
```
michaelschieben.com?mode=reader
michaelschieben.com?mode=md
michaelschieben.com?section=03-beweis-kunsthalle&mode=raw
```

### Persistence

Remember user's preferred mode in localStorage:
```javascript
localStorage.setItem('preferredMode', mode)
```

---

## Responsive Behavior

### Desktop (>1024px)
- Full two-column layouts
- Sidebar sticky
- Photo collages in asymmetric grids

### Tablet (768px - 1024px)
- Narrower sidebar (200px)
- Collages adapt to smaller grids

### Mobile (<768px)

**Reader Mode:**
- Stack layout
- Metadata becomes collapsible accordion OR bottom drawer
- Full-width content
- Photo collages become vertical stacks or carousel

**Markdown Mode:**
- Tabs instead of split: [Frontmatter] [Content]
- Or: Vertical stack with collapsible frontmatter

**Raw Mode:**
- Same as desktop but with appropriate text sizing
- Horizontal scroll for wide code

---

## Content Loading

### File System Structure

```
/content
  /sections
    01-hero.md
    02-versprechen.md
    03-beweis-kunsthalle.md
    ...
  /images
    kunsthalle-1.jpg
    workshop-2.jpg
    ...
```

### Reading .md Files

**Build Time (Recommended):**
```javascript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const sectionsDir = path.join(process.cwd(), 'content/sections')
const files = fs.readdirSync(sectionsDir)

const sections = files
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const filePath = path.join(sectionsDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    return {
      slug: file.replace('.md', ''),
      frontmatter: data,
      rawMarkdown: fileContent,
      content: content
    }
  })
  .sort((a, b) => a.frontmatter.order - b.frontmatter.order)
```

**Runtime (Alternative):**
```javascript
// API route to fetch .md files
app.get('/api/sections/:slug', (req, res) => {
  const filePath = `./content/sections/${req.params.slug}.md`
  const content = fs.readFileSync(filePath, 'utf-8')
  res.json({ content })
})
```

---

## Tech Stack Recommendations

### Framework
- **Next.js 14+** (App Router preferred)
- Or: **Vite + React**

### Markdown Processing
- **gray-matter** — Parse frontmatter
- **react-markdown** — Render markdown to React
- **remark/rehype plugins** — Syntax highlighting, etc.

### Styling
- **Tailwind CSS** — Utility-first (optional)
- Or: **CSS Modules**
- Or: **Styled Components**

### Syntax Highlighting
- **Prism** or **Shiki** — For code blocks
- Use dark theme for Raw mode

---

## Sample Content Files

### Example: 01-hero.md

```markdown
---
order: 1
title: "Ankommen"
purpose: "Sofort klarmachen: Wer ich bin, was ich ermögliche"
layout: "full-width"
---

# Michael Schieben

Nach meinen Workshops wissen 80 Menschen, wohin sie gehen.

**Workshop-Design und Facilitation & Strategieentwicklung**

Kreativer Mitdenker und Macher — Handwerk: Programmierung, Mindset: Design, Herz für Menschen.
```

### Example: 03-beweis-kunsthalle.md

```markdown
---
order: 3
title: "Wie ich arbeite"
purpose: "Zeigen statt behaupten - ein vollständiger Prozess"
kunde: "Hamburger Kunsthalle"
jahr: 2025
format: "2-Tage Partizipativ"
ergebnis: "Gedrucktes Leitbild"
layout: "sidebar-left"
sidebar_meta:
  - label: "Kunde"
    value: "Hamburger Kunsthalle"
  - label: "Jahr"
    value: "2025"
  - label: "Format"
    value: "2-Tage Partizipativ"
  - label: "Ergebnis"
    value: "Gedrucktes Leitbild"
related_post: "https://push.michaelschieben.com/2025/12/09/ein-highlight-zum-jahresende-gedruckt/"
---

## Hamburger Kunsthalle: Ein Leitbild für 200 Menschen

Zwei Workshoptage im Januar. **Partizipativer** Auftakt.

Nach gründlicher Auftragsklärung mit dem Führungskreis vorbereitet, konzipiert und von mir moderiert.

![](/images/kunsthalle-raum.jpg)
![](/images/gruppe-diskussion.jpg)
![](/images/leitbild-gedruckt.jpg)

### Das Problem

Viele Perspektiven. Unterschiedliche Vorstellungen. 200 Mitarbeitende.

### Der Ansatz

Strukturierter Dialog. Product Field als Kompass. Maximale Beteiligung.

> Begleitet hat den Prozess als Coach Michael Schieben, der uns geholfen hat, auch manchmal widerstrebende Vorstellungen kompromissfähig zu machen.

:> Dr. Jan Metzler (Leiter Marketing)

### Das Ergebnis

Gedrucktes Leitbild. Geteiltes Verständnis. Neue Energie zum Jahresende.
```

---

## Implementation Checklist

### Phase 1: Core Structure
- [ ] Set up project with Next.js/Vite
- [ ] Create `/content/sections` directory structure
- [ ] Install markdown processing (gray-matter, react-markdown)
- [ ] Build file reading logic (build-time or runtime)
- [ ] Create basic routing/navigation

### Phase 2: Viewing Modes
- [ ] Implement mode state management (useState + URL params)
- [ ] Build Reader mode (two-column, sidebar)
- [ ] Build Markdown mode (split view)
- [ ] Build Raw mode (code display)
- [ ] Build Source mode (view-source link)
- [ ] Add mode toggle UI (sticky header)

### Phase 3: Components

 Create PhotoCollage component
 Create Quote component
 Set up component mapping in markdown

### Phase 4: Styling & Polish
- [ ] Apply design system (colors, typography, spacing)
- [ ] Add keyboard shortcuts
- [ ] Implement localStorage persistence
- [ ] Add syntax highlighting for Raw/MD modes
- [ ] Smooth transitions between modes

### Phase 5: Responsive
- [ ] Adapt Reader mode for mobile (collapsible sidebar)
- [ ] Adapt Markdown mode for mobile (tabs or stack)
- [ ] Responsive photo collages
- [ ] Test on various devices

### Phase 6: Content
- [ ] Create all section .md files
- [ ] Add images to `/content/images`
- [ ] Test rendering in all modes
- [ ] Verify download functionality (Raw mode)

---

## Success Criteria

✅ Content lives in real .md files, not hardcoded
✅ All four viewing modes work seamlessly
✅ Keyboard shortcuts functional
✅ Responsive on mobile, tablet, desktop
✅ URL-shareable modes
✅ Clean, minimal, nerdy aesthetic achieved
✅ Warm photography integrated well
✅ Fast load times, smooth interactions

---

## Notes for Developer

**Philosophy:**
The website itself demonstrates the transformation between source and presentation. Each mode reveals a different "decoding" of the same content. This is not just a technical gimmick — it's a statement about how we create and consume information.

**Content First:**
Michael works in Markdown. The .md files are his primary authoring environment. The website must respect this workflow — files are the source of truth, not a database.

**Keep It Simple:**
Resist over-engineering. The power is in the concept and content, not complex animations or excessive features. Clean code, clear structure, purposeful design.

**Reference:**
Look at iA Writer for Markdown mode inspiration. The prototype (website-prototype.jsx) shows the basic structure — expand from there.

---

*Briefing Version 1.0 — December 2025*

---

# Installation

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS