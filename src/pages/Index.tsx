import { ModeToggle } from '@/components/ModeToggle';
import { PageMode } from '@/components/modes/PageMode';
import { MarkdownMode } from '@/components/modes/MarkdownMode';
import { RawMode } from '@/components/modes/RawMode';
import { useViewMode } from '@/hooks/useViewMode';
import { sections } from '@/content/sections';

const Index = () => {
  const { mode, setMode } = useViewMode();

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Mode Toggle Header */}
      <ModeToggle mode={mode} onModeChange={setMode} />

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        {mode === 'page' && <PageMode sections={sections} />}
        {mode === 'reader' && <MarkdownMode sections={sections} />}
        {mode === 'raw' && <RawMode sections={sections} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-mono">
            <div>
              <span className="text-foreground">// </span>
              every decoding is another encoding
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span className="kbd-hint">⌘1</span>
              <span className="kbd-hint">⌘2</span>
              <span className="kbd-hint">⌘3</span>
              <span className="kbd-hint">⌘U</span>
              <span className="text-xs">keyboard shortcuts</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
