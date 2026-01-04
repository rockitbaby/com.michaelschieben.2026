import { Section } from '@/content/sections';

interface RawModeProps {
  sections: Section[];
}

export function RawMode({ sections }: RawModeProps) {

  // Syntax highlight raw markdown with line numbers
  const highlightRaw = (content: string): React.ReactNode => {
    const lines = content.split('\n');
    const lineNumberWidth = String(lines.length).length;
    
    return lines.map((line, i) => {
      const lineNum = String(i + 1).padStart(lineNumberWidth, ' ');
      let highlighted: React.ReactNode = line;
      
      // YAML frontmatter delimiter
      if (line === '---') {
        highlighted = <span className="text-code-comment">{line}</span>;
      }
      // YAML key-value
      else if (line.match(/^[a-z_]+:/i) && !line.startsWith('#')) {
        const [key, ...rest] = line.split(':');
        const value = rest.join(':');
        highlighted = (
          <>
            <span className="text-code-property">{key}</span>
            <span className="text-code-comment">:</span>
            <span className="text-code-string">{value}</span>
          </>
        );
      }
      // Headings
      else if (line.startsWith('#')) {
        highlighted = <span className="text-code-keyword font-semibold">{line}</span>;
      }
      // Blockquote
      else if (line.startsWith('>') || line.startsWith(':>')) {
        highlighted = <span className="text-code-comment italic">{line}</span>;
      }
      // Image
      else if (line.trim().startsWith('![')) {
        highlighted = <span className="text-code-string">{line}</span>;
      }
      
      return (
        <div key={i} className="flex">
          <span className="select-none text-code-comment/50 pr-6 text-right w-12">
            {lineNum}
          </span>
          <span className="flex-1 whitespace-pre">{highlighted || '\u00A0'}</span>
        </div>
      );
    });
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      {sections.map((section) => (
        <section 
          key={section.slug}
          id={section.slug}
          className="border border-border rounded-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-muted border-b border-border">
            <span className="font-mono text-sm text-foreground">
              {section.slug}.md
            </span>
          </div>
          
          {/* Code content */}
          <div className="bg-code text-code-foreground p-6 font-mono text-sm leading-relaxed overflow-x-auto">
            {highlightRaw(section.rawMarkdown)}
          </div>
        </section>
      ))}
    </div>
  );
}
