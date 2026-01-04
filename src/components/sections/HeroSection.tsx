// Hero Section - Bold statements, ASCII art, contact links
import { Section } from '@/content/sections';
import { parseMarkdown, getInlineText } from '@/lib/parseMarkdown';
import { parseInline } from './parseUtils.tsx';

interface HeroSectionProps {
  section: Section;
}

export function HeroSection({ section }: HeroSectionProps) {
  const ast = parseMarkdown(section.content);

  // Extract components in order they appear
  let name = '';
  let photo = '';
  const statements: string[] = [];
  let skillsLine = '';
  let asciiArt = '';
  let ctaLine = '';
  const contactLinks: string[] = [];
  let quote: { text: string; author?: string } | null = null;

  let boldCount = 0;

  for (const node of ast.nodes) {
    switch (node.type) {
      case 'heading':
        if (node.level === 1) {
          name = getInlineText(node);
        }
        break;

      case 'image':
        if (!photo) {
          photo = node.src || '';
        }
        break;

      case 'code':
        if (node.code && !asciiArt) {
          asciiArt = node.code;
        }
        break;

      case 'blockquote': {
        const text = node.text || '';
        const authorMatch = text.match(/^(.+?)\s*[—–-]\s*(.+)$/);
        if (authorMatch) {
          quote = { text: authorMatch[1].trim(), author: authorMatch[2].trim() };
        } else {
          quote = { text: text.trim() };
        }
        break;
      }

      case 'paragraph': {
        const text = getInlineText(node);
        // Bold lines - first is skills, second is CTA
        if (text.startsWith('**') && text.endsWith('**') && text.split('**').length === 3) {
          const boldText = text.slice(2, -2);
          if (boldCount === 0) {
            skillsLine = boldText;
            boldCount++;
          } else if (boldCount === 1 && !ctaLine) {
            ctaLine = boldText;
            boldCount++;
          }
        } else if (text.startsWith('**') && text.includes('**') && !text.endsWith('**') && !ctaLine) {
          // Bold with trailing text (alternative CTA format)
          ctaLine = text;
        } else if (text && !text.startsWith('>')) {
          // Statement lines (non-empty, non-special)
          statements.push(text);
        }
        break;
      }

      case 'list': {
        if (node.items) {
          // Contact list items
          contactLinks.push(...node.items);
        }
        break;
      }

      default:
        break;
    }
  }

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-center">
      {/* Left Column - 2/3: Photo, Tagline, Name, Statements */}
      <div className="space-y-6">
        {/* Photo + Intro */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Photo */}
          {photo && (
            <div className="shrink-0">
              <img 
                src={photo} 
                alt={name} 
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          )}

          {/* Tagline + Name */}
          <div className="space-y-2">
            {skillsLine && (
              <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-muted-foreground">
                {skillsLine}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              {name}
            </h1>
          </div>
        </div>

        {/* Statements */}
        <div className="space-y-1 text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
          {statements.map((stmt, idx) => (
            <p key={idx} className="text-foreground/80">
              {stmt}
            </p>
          ))}
        </div>

        {/* CTA + Contact */}
        <div className="space-y-4 pt-2">
          {ctaLine && (
            <p className="text-base font-semibold">
              {ctaLine}
            </p>
          )}

          {contactLinks.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm font-mono">
              {contactLinks.map((link, idx) => {
                if (link === '—') {
                  return <span key={idx} className="text-muted-foreground/40">|</span>;
                }
                return (
                  <span key={idx} className="text-muted-foreground hover:text-foreground transition-colors">
                    {parseInline(link)}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Quote */}
        {quote && (
          <blockquote className="border-l-2 border-muted-foreground/30 pl-4 mt-8 italic text-muted-foreground text-sm max-w-xl">
            <p>„{quote.text}"</p>
            {quote.author && (
              <footer className="mt-1 text-xs not-italic">— {quote.author}</footer>
            )}
          </blockquote>
        )}
      </div>

      {/* Right Column - 1/3: ASCII Art */}
      {asciiArt && (
        <div className="hidden lg:flex justify-center">
          <pre 
            className="font-mono text-[0.6rem] xl:text-[0.7rem] leading-[1.15] text-muted-foreground select-none whitespace-pre"
            aria-hidden="true"
          >
            {asciiArt}
          </pre>
        </div>
      )}
    </div>
  );
}
