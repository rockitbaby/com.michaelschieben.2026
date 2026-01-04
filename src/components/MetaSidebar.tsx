import { Section } from '@/content/sections';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MetaSidebarProps {
  section: Section;
  className?: string;
}

export function MetaSidebar({ section, className = '' }: MetaSidebarProps) {
  const { frontmatter } = section;
  const [isExpanded, setIsExpanded] = useState(true);

  // Extract key-value pairs from frontmatter
  const metaItems = Object.entries(frontmatter).filter(
    ([key]) => !['purpose', 'layout', 'related_post'].includes(key) && 
               key !== 'sidebar_meta'
  );

  return (
    <aside className={`bg-meta rounded-sm ${className}`}>
      {/* Mobile: Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          // meta
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Desktop: Always visible header */}
      <div className="hidden lg:block p-4 pb-2">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          // meta
        </span>
      </div>

      {/* Content */}
      <div className={`
        font-mono text-sm space-y-3 px-4 pb-4
        ${isExpanded ? 'block' : 'hidden lg:block'}
      `}>
        {metaItems.map(([key, value]) => (
          <div key={key} className="leading-relaxed">
            <span className="text-muted-foreground">{key}:</span>{' '}
            <span className="text-foreground">
              {typeof value === 'string' ? `"${value}"` : String(value)}
            </span>
          </div>
        ))}

        {/* Sidebar meta items */}
        {frontmatter.sidebar_meta && frontmatter.sidebar_meta.length > 0 && (
          <div className="pt-3 mt-3 border-t border-border space-y-2">
            {frontmatter.sidebar_meta.map((item, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-muted-foreground">{item.label.toLowerCase()}:</span>{' '}
                <span className="text-foreground">"{item.value}"</span>
              </div>
            ))}
          </div>
        )}

        {/* Related post link */}
        {frontmatter.related_post && (
          <div className="pt-3 mt-3 border-t border-border">
            <a 
              href={frontmatter.related_post}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              → related_post
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
