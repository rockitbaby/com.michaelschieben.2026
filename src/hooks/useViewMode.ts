import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ViewMode } from '@/components/ModeToggle';

const STORAGE_KEY = 'preferred-view-mode';

export function useViewMode() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial mode from URL, localStorage, or default
  const getInitialMode = (): ViewMode => {
    const urlMode = searchParams.get('mode') as ViewMode;
    if (urlMode && ['page', 'reader', 'raw', 'source'].includes(urlMode)) {
      return urlMode;
    }
    
    const storedMode = localStorage.getItem(STORAGE_KEY) as ViewMode;
    if (storedMode && ['page', 'reader', 'raw', 'source'].includes(storedMode)) {
      return storedMode;
    }
    
    return 'page';
  };

  const [mode, setModeState] = useState<ViewMode>(getInitialMode);

  // Update URL and localStorage when mode changes
  const setMode = (newMode: ViewMode) => {
    if (newMode === 'source') {
      // Source mode opens browser view-source, don't store it
      return;
    }
    
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (newMode === 'page') {
      newParams.delete('mode');
    } else {
      newParams.set('mode', newMode);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const urlMode = searchParams.get('mode') as ViewMode;
    if (urlMode && ['page', 'reader', 'raw'].includes(urlMode) && urlMode !== mode) {
      setModeState(urlMode);
    }
  }, [searchParams, mode]);

  return { mode, setMode };
}
