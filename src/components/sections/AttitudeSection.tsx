// Attitude Section - Principles (left 3/5) and Timeline (right 2/5)
import { Section } from '@/content/sections';
import { parseMarkdown, getInlineText } from '@/lib/parseMarkdown';
import { parseInline } from './parseUtils.tsx';

interface AttitudeSectionProps {
  section: Section;
}

export function AttitudeSection({ section }: AttitudeSectionProps) {
  const ast = parseMarkdown(section.content);
  const blocks = ast.splitBy('hr');
  
  // Separate principles (left) and timeline (right)
  const principles: React.ReactNode[] = [];
  let sectionHeading = '';
  let timeline: React.ReactNode | null = null;
  let quote: React.ReactNode | null = null;
  let key = 0;
  let foundFirstH2 = false;

  for (const block of blocks) {
    // Check if quote (all blockquotes)
    const blockquotes = block.findAll('blockquote');
    if (blockquotes.length > 0 && block.nodes.every(n => n.type === 'blockquote')) {
      const quoteNode = blockquotes[0];
      const text = quoteNode.text || '';
      const authorMatch = text.match(/^(.+?)\s*[—–-]\s*(.+)$/);
      if (authorMatch) {
        quote = (
          <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground">
            <p>„{authorMatch[1].trim()}"</p>
            <footer className="mt-2 text-sm not-italic">— {authorMatch[2].trim()}</footer>
          </blockquote>
        );
      } else {
        quote = (
          <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground">
            <p>„{text}"</p>
          </blockquote>
        );
      }
      continue;
    }

    // Check for timeline pattern (multiple paragraphs with **Year:** pattern)
    const paragraphs = block.findAll('paragraph');
    const timelineEntries = paragraphs.filter(p => {
      const text = getInlineText(p);
      return /^\*\*(.+?):\*\*\s*/.test(text);
    });
    
    if (timelineEntries.length >= 2) {
      const h2 = block.findFirst('heading', { level: 2 });
      const title = h2 ? getInlineText(h2) : '';
      
      timeline = (
        <div className="space-y-6">
          <div className="relative pl-6 border-l-2 border-muted space-y-6">
            {timelineEntries.map((entry, idx) => {
              const text = getInlineText(entry);
              const match = text.match(/^\*\*(.+?):\*\*\s*(.+)/);
              if (!match) return null;
              const [, period, description] = match;
              
              return (
                <div key={idx} className="relative">
                  <div className="absolute -left-[1.9375rem] top-1 w-3 h-3 rounded-full bg-background border-2 border-muted-foreground/30" />
                  <p className="font-semibold text-sm text-muted-foreground mb-1">
                    {period}
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    {parseInline(description.trim())}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
      continue;
    }

    // Regular principle blocks (H2/H3 + paragraphs) - go to left column
    const elements: React.ReactNode[] = [];
    let elementKey = 0;

    for (const node of block.nodes) {
      if (node.type === 'heading') {
        const text = getInlineText(node);
        if (node.level === 2) {
          // First H2 becomes the section heading (displayed above columns)
          if (!foundFirstH2) {
            sectionHeading = text;
            foundFirstH2 = true;
            // Don't add H2 to elements - it will be displayed above
            continue;
          }
          // Other H2s go into the content
          elements.push(
            <h2 key={elementKey++} className="text-3xl font-semibold tracking-tight mb-4">
              {text}
            </h2>
          );
        } else if (node.level === 3) {
          elements.push(
            <h3 key={elementKey++} className="text-xl font-semibold mt-8 first:mt-0 mb-3">
              {text}
            </h3>
          );
        }
      } else if (node.type === 'paragraph') {
        const text = getInlineText(node);
        if (text) {
          elements.push(
            <p key={elementKey++} className="text-foreground/80 leading-relaxed mb-3">
              {parseInline(text)}
            </p>
          );
        }
      }
    }

    if (elements.length > 0) {
      principles.push(
        <div key={key++} className={principles.length > 0 ? 'pt-8 border-t border-border/50' : ''}>
          {elements}
        </div>
      );
    }
  }

  return (
    <div className="space-y-12">
      {/* Section Heading - full width above columns */}
      {sectionHeading && (
        <h2 className="text-3xl font-semibold tracking-tight mb-6">
          {sectionHeading}
        </h2>
      )}

      {/* Two column layout: 3/5 principles, 2/5 timeline */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
        {/* Left: Principles */}
        <div className="space-y-0">
          {principles}
        </div>

        {/* Right: Timeline */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          {timeline}
        </div>
      </div>

      {/* Quote at bottom */}
      {quote && (
        <div className="max-w-3xl">
          {quote}
        </div>
      )}
    </div>
  );
}

