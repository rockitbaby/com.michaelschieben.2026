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
  const modes = [
    { id: 'page', label: 'PAGE', icon: '●', shortcut: '1' },
    { id: 'reader', label: 'READER', icon: '☰', shortcut: '2' },
    { id: 'raw', label: 'RAW', icon: '{}', shortcut: '3' },
    { id: 'source', label: 'SOURCE', icon: '↗', shortcut: 'U' },
  ];

  // Desktop Header
  const desktopHeader = document.createElement('header');
  desktopHeader.className = 'sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border hidden sm:block';
  desktopHeader.innerHTML = `
    <div class="container max-w-6xl mx-auto px-4 py-3">
      <nav class="flex items-center justify-between">
        <div class="font-mono text-sm text-muted-foreground">
          <span class="text-foreground font-medium">michaelschieben.com</span><span class="text-foreground font-medium">/2026</span>
        </div>
        <div class="flex items-center gap-1" id="mode-toggle-buttons"></div>
      </nav>
    </div>
  `;

  // Mobile Header
  const mobileHeader = document.createElement('header');
  mobileHeader.className = 'sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border sm:hidden';
  mobileHeader.innerHTML = `
    <div class="px-4 py-3">
      <div class="font-mono text-sm text-muted-foreground">
        <span class="text-foreground font-medium">michaelschieben.com</span><span class="text-foreground font-medium">/2026</span>
      </div>
    </div>
  `;

  // Mobile FAB Container
  const fabContainer = document.createElement('div');
  fabContainer.className = 'fixed bottom-6 right-6 z-50 sm:hidden';
  fabContainer.id = 'mobile-fab-container';

  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200 opacity-0 pointer-events-none';
  backdrop.id = 'fab-backdrop';

  // Menu Options Container
  const menuContainer = document.createElement('div');
  menuContainer.className = 'absolute bottom-16 right-0 flex flex-col gap-2 transition-all duration-300 ease-out opacity-0 translate-y-4 pointer-events-none';
  menuContainer.id = 'fab-menu';

  // FAB Button
  const fabButton = document.createElement('button');
  fabButton.className = 'relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center font-mono text-lg font-bold transition-all duration-300 ease-out active:scale-95';
  fabButton.id = 'fab-button';
  fabButton.setAttribute('aria-label', 'Toggle view mode menu');
  fabButton.setAttribute('aria-expanded', 'false');

  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    backdrop.className = `fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;
    menuContainer.className = `absolute bottom-16 right-0 flex flex-col gap-2 transition-all duration-300 ease-out ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`;
    fabButton.className = `relative w-14 h-14 rounded-full flex items-center justify-center font-mono text-lg font-bold transition-all duration-300 ease-out active:scale-95 ${menuOpen ? 'rotate-45 bg-muted text-foreground shadow-md' : 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'}`;
    fabButton.setAttribute('aria-expanded', String(menuOpen));
    updateFabIcon(currentMode);
  };

  const updateFabIcon = (activeMode: ViewMode) => {
    const currentIcon = modes.find(m => m.id === activeMode)?.icon || '●';
    fabButton.innerHTML = menuOpen ? '<span class="text-2xl">+</span>' : `<span class="text-base whitespace-nowrap">${currentIcon}</span>`;
  };

  fabButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  backdrop.addEventListener('click', () => {
    if (menuOpen) toggleMenu();
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (menuOpen && !fabContainer.contains(e.target as Node)) {
      toggleMenu();
    }
  });

  fabContainer.appendChild(backdrop);
  fabContainer.appendChild(menuContainer);
  fabContainer.appendChild(fabButton);

  const buttonsContainer = desktopHeader.querySelector('#mode-toggle-buttons');
  if (!buttonsContainer) return;

  // Function to update button states
  const updateButtons = (activeMode: ViewMode) => {
    // Update desktop buttons
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
      button.textContent = mode.label;
      button.addEventListener('click', () => {
        if (mode.id === 'source') {
          window.open('https://github.com/rockitbaby/com.michaelschieben.2026/tree/main/content/sections', '_blank');
        } else {
          onModeChange(mode.id as ViewMode);
        }
      });
      buttonsContainer.appendChild(button);
    });

    // Update mobile menu
    menuContainer.innerHTML = '';
    modes.forEach((mode, index) => {
      const menuItem = document.createElement('button');
      menuItem.className = `
        flex items-center gap-3 px-4 py-3
        rounded-full shadow-lg
        font-mono text-sm
        transition-all duration-200
        ${activeMode === mode.id 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-background text-foreground border border-border hover:bg-muted'
        }
      `;
      menuItem.style.transitionDelay = menuOpen ? `${index * 50}ms` : '0ms';
      menuItem.innerHTML = `
        <span class="w-6 text-center opacity-60 whitespace-nowrap">${mode.icon}</span>
        <span class="uppercase tracking-wider">${mode.label}</span>
      `;
      menuItem.addEventListener('click', () => {
        if (mode.id === 'source') {
          window.open('https://github.com/rockitbaby/com.michaelschieben.2026/tree/main/content/sections', '_blank');
        } else {
          onModeChange(mode.id as ViewMode);
        }
        if (menuOpen) toggleMenu();
      });
      menuContainer.appendChild(menuItem);
    });

    // Update FAB icon
    updateFabIcon(activeMode);
    currentMode = activeMode;
  };

  // Initial render
  updateButtons(currentMode);

  // Store update function for later use
  (desktopHeader as any).updateButtons = updateButtons;

  document.body.insertBefore(desktopHeader, document.body.firstChild);
  document.body.insertBefore(mobileHeader, document.body.firstChild);
  document.body.appendChild(fabContainer);
  
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
          <a href="https://push.michaelschieben.com/2026/01/05/hello-hallo-neue-webseite/" target="_blank" rel="noopener noreferrer" class="hover:text-foreground transition-colors">every decoding is another encoding</a>
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
