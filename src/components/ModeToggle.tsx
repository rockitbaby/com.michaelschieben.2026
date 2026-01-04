import { useState, useEffect } from 'react';

export type ViewMode = 'page' | 'reader' | 'raw' | 'source';

interface ModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const modes: { id: ViewMode; label: string; shortcut: string; mobileLabel: string }[] = [
  { id: 'page', label: 'PAGE', shortcut: '1', mobileLabel: 'P' },
  { id: 'reader', label: 'READER', shortcut: '2', mobileLabel: 'R' },
  { id: 'raw', label: 'RAW', shortcut: '3', mobileLabel: 'Ra' },
  { id: 'source', label: 'SOURCE', shortcut: 'U', mobileLabel: 'S' },
];

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        setShowHints(true);
        
        switch (e.key) {
          case '1':
            e.preventDefault();
            onModeChange('page');
            break;
          case '2':
            e.preventDefault();
            onModeChange('reader');
            break;
          case '3':
            e.preventDefault();
            onModeChange('raw');
            break;
          case 'u':
          case 'U':
            e.preventDefault();
            onModeChange('source');
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) {
        setShowHints(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onModeChange]);

  const handleModeClick = (modeId: ViewMode) => {
    if (modeId === 'source') {
      // Open GitHub source folder
      window.open('https://github.com/rockitbaby/com.michaelschieben.2026/tree/main/content/sections', '_blank');
    } else {
      onModeChange(modeId);
    }
  };

  const [showYearDropdown, setShowYearDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container max-w-6xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo / Name with Easter Egg */}
          <div className="font-mono text-sm text-muted-foreground">
            <span className="text-foreground font-medium">michaelschieben.com</span>
            <span 
              className="relative inline-block"
              onMouseEnter={() => setShowYearDropdown(true)}
              onMouseLeave={() => setShowYearDropdown(false)}
            >
              <span className="text-foreground font-medium cursor-default hover:text-primary transition-colors">/2026</span>
              
              {/* Year Dropdown Easter Egg */}
              <div 
                className={`
                  absolute left-0 top-full pt-1 z-50
                  transition-all duration-200 origin-top
                  ${showYearDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                `}
              >
                <div className="bg-popover border border-border rounded-md shadow-lg py-1 min-w-[80px]">
                  <a 
                    href="https://michaelschieben.com/2025.html"
                    className="block px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    /2025
                  </a>
                  <a 
                    href="https://michaelschieben.com/2024.html"
                    className="block px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    /2024
                  </a>
                </div>
              </div>
            </span>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-1">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModeClick(m.id)}
                className={`
                  relative px-3 py-1.5 text-xs font-mono uppercase tracking-wider
                  transition-all duration-200 rounded-sm
                  ${mode === m.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                {/* Desktop label */}
                <span className="hidden sm:inline">{m.label}</span>
                {/* Mobile label */}
                <span className="sm:hidden">{m.mobileLabel}</span>
                
                {/* Keyboard hint - below menu */}
                {showHints && (
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 kbd-hint animate-fade-in">
                    ⌘{m.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
