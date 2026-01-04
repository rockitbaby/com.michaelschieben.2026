import { createRoot } from 'react-dom/client';
import React from 'react';
import { RawMode } from './components/modes/RawMode';

// Create wrapper and footer structure
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

export function renderRawMode(sections: ReturnType<typeof import('./lib/reconstruct').reconstructSection>[]) {
  const result = createWrapperAndFooter();
  if (!result) return;

  const { main } = result;

  main.className = 'container max-w-6xl mx-auto px-4 py-8 md:py-12';
  main.innerHTML = '<div id="raw-root"></div>';

  const rootDiv = main.querySelector('#raw-root');
  if (rootDiv) {
    const root = createRoot(rootDiv);
    root.render(<RawMode sections={sections} />);
  }
}

