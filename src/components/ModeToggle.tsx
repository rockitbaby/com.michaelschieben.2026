import { useState, useEffect } from 'react';

export type ViewMode = 'page' | 'reader' | 'raw' | 'source';

interface ModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const modes: { id: ViewMode; label: string; shortcut: string; icon: string }[] = [
  { id: 'page', label: 'PAGE', shortcut: '1', icon: '●' },
  { id: 'reader', label: 'READER', shortcut: '2', icon: '☰' },
  { id: 'raw', label: 'RAW', shortcut: '3', icon: '{}' },
  { id: 'source', label: 'SOURCE', shortcut: 'U', icon: '↗' },
];

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const [showHints, setShowHints] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    
    const handleClickOutside = () => setMobileMenuOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const handleModeClick = (modeId: ViewMode) => {
    if (modeId === 'source') {
      window.open('https://github.com/rockitbaby/com.michaelschieben.2026/tree/main/content/sections', '_blank');
    } else {
      onModeChange(modeId);
    }
    setMobileMenuOpen(false);
  };

  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const currentModeIcon = modes.find(m => m.id === mode)?.icon || '●';

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border hidden sm:block">
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
                  {m.label}
                  
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

      {/* Mobile Header (simplified) */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border sm:hidden">
        <div className="px-4 py-3">
          <div className="font-mono text-sm text-muted-foreground">
            <span className="text-foreground font-medium">michaelschieben.com</span>
            <span className="text-foreground font-medium">/2026</span>
          </div>
        </div>
      </header>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        {/* Backdrop when menu is open */}
        <div 
          className={`
            fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200
            ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Options */}
        <div 
          className={`
            absolute bottom-16 right-0
            flex flex-col gap-2
            transition-all duration-300 ease-out
            ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {modes.map((m, index) => (
            <button
              key={m.id}
              onClick={() => handleModeClick(m.id)}
              className={`
                flex items-center gap-3 px-4 py-3
                rounded-full shadow-lg
                font-mono text-sm
                transition-all duration-200
                ${mode === m.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background text-foreground border border-border hover:bg-muted'
                }
              `}
              style={{
                transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                transform: mobileMenuOpen ? 'scale(1)' : 'scale(0.8)',
              }}
            >
              <span className="w-6 text-center opacity-60 whitespace-nowrap">{m.icon}</span>
              <span className="uppercase tracking-wider">{m.label}</span>
            </button>
          ))}
        </div>

        {/* FAB Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className={`
            relative w-14 h-14 rounded-full
            bg-primary text-primary-foreground
            shadow-lg shadow-primary/25
            flex items-center justify-center
            font-mono text-lg font-bold
            transition-all duration-300 ease-out
            active:scale-95
            ${mobileMenuOpen ? 'rotate-45 bg-muted text-foreground shadow-md' : ''}
          `}
          aria-label="Toggle view mode menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <span className="text-2xl">+</span>
          ) : (
            <span className="text-base whitespace-nowrap">{currentModeIcon}</span>
          )}
        </button>

      </div>
    </>
  );
}
