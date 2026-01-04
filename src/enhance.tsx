import { reconstructSection } from './lib/reconstruct';
import './components/modes/MarkdownMode.css';
import './index.css';

type ViewMode = 'page' | 'reader' | 'raw' | 'source';

// Get mode from URL or localStorage
function getInitialMode(): ViewMode {
  const params = new URLSearchParams(window.location.search);
  const urlMode = params.get('mode') as ViewMode;
  if (urlMode && ['page', 'reader', 'raw', 'source'].includes(urlMode)) {
    return urlMode;
  }
  const saved = localStorage.getItem('preferredMode') as ViewMode;
  if (saved && ['page', 'reader', 'raw', 'source'].includes(saved)) {
    return saved;
  }
  return 'reader';
}

// Save mode to URL and localStorage
function setMode(mode: ViewMode) {
  const url = new URL(window.location.href);
  url.searchParams.set('mode', mode);
  window.history.replaceState({}, '', url.toString());
  localStorage.setItem('preferredMode', mode);
}

// Store original HTML content
let originalMainHTML: string | null = null;

// Reconstruct all sections from HTML
function reconstructSections() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-slug]'));
  return sections.map(reconstructSection);
}

// Save original HTML content
function saveOriginalHTML() {
  const main = document.querySelector('main');
  if (main && !originalMainHTML) {
    originalMainHTML = main.innerHTML;
  }
}

// Create mode toggle (lightweight, no React)
function createModeToggle(currentMode: ViewMode, onModeChange: (mode: ViewMode) => void) {
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border';
  header.innerHTML = `
    <div class="container max-w-6xl mx-auto px-4 py-3">
      <nav class="flex items-center justify-between">
        <div class="font-mono text-sm text-muted-foreground">
          <span class="hidden sm:inline">// </span>
          <span class="text-foreground font-medium">michaelschieben.com 2026</span>
        </div>
        <div class="flex items-center gap-1" id="mode-toggle-buttons"></div>
      </nav>
    </div>
  `;

  const modes = [
    { id: 'page', label: 'PAGE', mobileLabel: 'P', shortcut: '1' },
    { id: 'reader', label: 'READER', mobileLabel: 'R', shortcut: '2' },
    { id: 'raw', label: 'RAW', mobileLabel: 'Ra', shortcut: '3' },
    { id: 'source', label: 'SOURCE', mobileLabel: 'S', shortcut: 'U' },
  ];

  const buttonsContainer = header.querySelector('#mode-toggle-buttons');
  if (!buttonsContainer) return;

  // Function to update button states
  const updateButtons = (activeMode: ViewMode) => {
    buttonsContainer.innerHTML = '';
    modes.forEach((mode) => {
      const button = document.createElement('button');
      button.className = `
        relative px-3 py-1.5 text-xs font-mono uppercase tracking-wider
        transition-all duration-200 rounded-sm
        ${activeMode === mode.id 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }
      `;
      button.innerHTML = `
        <span class="hidden sm:inline">${mode.label}</span>
        <span class="sm:hidden">${mode.mobileLabel}</span>
      `;
      button.addEventListener('click', () => {
        if (mode.id === 'source') {
          window.open('https://github.com/rockitbaby/com.michaelschieben.2026/tree/main/content/sections', '_blank');
        } else {
          onModeChange(mode.id as ViewMode);
        }
      });
      buttonsContainer.appendChild(button);
    });
  };

  // Initial render
  updateButtons(currentMode);

  // Store update function for later use
  (header as any).updateButtons = updateButtons;

  document.body.insertBefore(header, document.body.firstChild);
  
  return updateButtons;
}

// Lazy load page.js (PAGE mode)
async function loadPageMode(sections: ReturnType<typeof reconstructSections>) {
  const { renderReaderMode } = await import('./enhance-reader');
  renderReaderMode(sections);
}

// Lazy load raw.js (Raw mode)
async function loadRawMode(sections: ReturnType<typeof reconstructSections>) {
  const { renderRawMode } = await import('./enhance-raw');
  renderRawMode(sections);
}

// Create wrapper and footer structure (shared helper)
function createWrapperAndFooter() {
  const main = document.querySelector('main');
  if (!main) return null;

  // Check if wrapper already exists
  let wrapper = main.parentElement;
  if (!wrapper || !wrapper.classList.contains('min-h-screen')) {
    // Create wrapper div
    wrapper = document.createElement('div');
    wrapper.className = 'min-h-screen bg-background';
    
    // Insert wrapper before main and move main inside
    if (main.parentNode) {
      main.parentNode.insertBefore(wrapper, main);
      wrapper.appendChild(main);
    }
  }

  // Remove existing footer if present (direct child only, not nested footers in blockquotes)
  const existingFooter = wrapper.querySelector(':scope > footer');
  if (existingFooter) {
    existingFooter.remove();
  }

  // Create footer
  const footer = document.createElement('footer');
  footer.className = 'border-t border-border mt-16';
  footer.innerHTML = `
    <div class="container max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-mono">
        <div>
          <span class="text-foreground">// </span>
          every decoding is another encoding
        </div>
        <div class="hidden sm:flex items-center gap-4">
          <span class="kbd-hint">⌘1</span>
          <span class="kbd-hint">⌘2</span>
          <span class="kbd-hint">⌘3</span>
          <span class="kbd-hint">⌘U</span>
          <span class="text-xs">keyboard shortcuts</span>
        </div>
      </div>
    </div>
  `;
  wrapper.appendChild(footer);

  return { main, wrapper };
}

// Render READER mode (default - restore original HTML)
function renderReaderMode() {
  const result = createWrapperAndFooter();
  if (!result) return;

  const { main } = result;
  
  // Restore original HTML if we have it saved
  if (originalMainHTML) {
    main.innerHTML = originalMainHTML;
  }
  
  main.className = 'markdown-mode';
}

// Render SOURCE mode
function renderSourceMode() {
  window.location.href = 'view-source:' + window.location.href;
}

// Main enhancement function
function enhance() {
  // Save original HTML before any modifications
  saveOriginalHTML();
  
  const sections = reconstructSections();
  let currentMode = getInitialMode();

  // Create mode toggle and get update function
  const updateButtons = createModeToggle(currentMode, (mode) => {
    switchMode(mode);
  });

  const switchMode = async (mode: ViewMode) => {
    currentMode = mode;
    setMode(mode);
    
    // Update button highlights
    if (updateButtons) {
      updateButtons(mode);
    }

    switch (mode) {
      case 'page':
        await loadPageMode(sections);
        break;
      case 'reader':
        renderReaderMode();
        break;
      case 'raw':
        await loadRawMode(sections);
        break;
      case 'source':
        renderSourceMode();
        break;
    }
  };

  // Set initial mode
  switchMode(currentMode);

  // Keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case '1':
          e.preventDefault();
          switchMode('page');
          break;
        case '2':
          e.preventDefault();
          switchMode('reader');
          break;
        case '3':
          e.preventDefault();
          switchMode('raw');
          break;
        case 'u':
        case 'U':
          e.preventDefault();
          switchMode('source');
          break;
      }
    }
  });
}

// Run enhancement when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhance);
} else {
  enhance();
}
