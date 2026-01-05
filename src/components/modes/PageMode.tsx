import { Section } from '@/content/sections';
import { getSectionRenderer } from '../sections';
import { useState } from 'react';

interface PageModeProps {
  sections: Section[];
}

// Critique indicator with hover tooltip
function CritiqueIndicator({ critique, isHighlight }: { critique: string; isHighlight?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative inline-block mr-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span 
        className={`
          cursor-help select-none
          text-red-500 hover:text-red-400
          transition-colors duration-200
          text-[10px] font-bold
        `}
        aria-label="Critique available"
      >
        ✕
      </span>
      
      {/* Critique Tooltip */}
      <div 
        role="tooltip"
        className={`
          absolute left-0 top-full mt-2 z-50
          px-4 py-2 rounded-md
          bg-red-950 text-red-200 border border-red-900/50
          font-mono text-xs
          min-w-[280px] max-w-md
          shadow-lg
          transition-all duration-200 origin-top-left
          ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
        `}
      >
        <span className="opacity-50">/* critique: </span>
        <span className="italic">{critique}</span>
        <span className="opacity-50"> */</span>
      </div>
    </div>
  );
}

// Playful section title with hover tooltip
function SectionTitle({ title, purpose, critique, isHighlight }: { title: string; purpose?: string; critique?: string; isHighlight?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="flex items-center mb-6">
      {/* Critique indicator */}
      {critique && critique.trim() && (
        <CritiqueIndicator critique={critique} isHighlight={isHighlight} />
      )}
      
      <div 
        className="relative inline-block group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button 
          type="button"
          className={`
            font-mono text-xs cursor-help
            ${isHighlight ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'}
            transition-all duration-200
            flex items-center gap-1
          `}
          aria-label={`Section: ${title}${purpose ? `. ${purpose}` : ''}`}
          aria-expanded={isHovered}
        >
          <span className="opacity-60">//</span>
          <span>{slug}</span>
          <span 
            className={`
              transition-all duration-300 ease-out
              ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
            `}
          >
            👀
          </span>
        </button>
        
        {/* Tooltip */}
        {purpose && (
          <div 
            role="tooltip"
            className={`
              absolute left-0 top-full mt-2 z-50
              px-4 py-2 rounded-md
              ${isHighlight ? 'bg-white/30 text-white' : 'bg-foreground text-background'}
              font-mono text-xs
              min-w-[280px] max-w-md
              shadow-lg
              transition-all duration-200 origin-top-left
              ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
            `}
          >
            <span className="opacity-50">/* </span>
            <span className="italic">{purpose}</span>
            <span className="opacity-50"> */</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Get style classes based on section style
function getSectionStyles(style?: string): { wrapper: string; content: string } {
  switch (style) {
    case 'highlight':
      return {
        wrapper: 'bg-[hsl(var(--highlight-bg))] text-[hsl(var(--highlight-foreground))] -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 rounded-xl py-12 md:py-16',
        content: ''
      };
    case 'inverted':
      return {
        wrapper: 'bg-foreground text-background -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 rounded-xl py-12 md:py-16',
        content: ''
      };
    default:
      return { wrapper: 'py-12 md:py-16', content: '' };
  }
}

export function PageMode({ sections }: PageModeProps) {
  return (
    <div className="animate-fade-in">
      {sections.map((section, index) => {
        const styles = getSectionStyles(section.frontmatter.style);
        const SectionRenderer = getSectionRenderer(section.slug);
        
        return (
          <section 
            key={section.slug}
            id={section.slug}
            className={`
              ${styles.wrapper}
              ${index > 0 && !section.frontmatter.style ? 'border-t border-border' : ''}
            `}
          >
            {/* Section Title */}
            <SectionTitle 
              title={section.frontmatter.title} 
              purpose={section.frontmatter.purpose}
              critique={section.frontmatter.critique}
              isHighlight={section.frontmatter.style === 'highlight'}
            />
            
            {/* Semantic Section Renderer */}
            <SectionRenderer section={section} />
          </section>
        );
      })}
    </div>
  );
}

