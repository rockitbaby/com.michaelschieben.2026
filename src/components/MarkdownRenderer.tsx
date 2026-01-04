import { Quote } from './Quote';
import { PhotoCollage } from './PhotoCollage';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Simple markdown to React renderer
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  // Collect consecutive images for photo collage
  const collectImages = (startIndex: number): { images: { src: string; alt: string }[]; endIndex: number } => {
    const images: { src: string; alt: string }[] = [];
    let idx = startIndex;
    
    while (idx < lines.length) {
      const line = lines[idx].trim();
      const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      
      if (imgMatch) {
        images.push({ alt: imgMatch[1], src: imgMatch[2] });
        idx++;
      } else if (line === '') {
        idx++;
      } else {
        break;
      }
    }
    
    return { images, endIndex: idx };
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === '') {
      i++;
      continue;
    }

    // H1
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 mt-8 first:mt-0">
          {trimmed.slice(2)}
        </h1>
      );
      i++;
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 mt-12 first:mt-0">
          {trimmed.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-xl font-medium mb-3 mt-8">
          {trimmed.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Horizontal rule ---
    if (trimmed === '---') {
      elements.push(
        <hr key={key++} className="my-8 border-t border-border" />
      );
      i++;
      continue;
    }

    // Image - check for consecutive images (photo collage)
    if (trimmed.startsWith('![')) {
      const { images, endIndex } = collectImages(i);
      
      if (images.length >= 2) {
        elements.push(
          <PhotoCollage key={key++} images={images} layout="asymmetric" />
        );
      } else if (images.length === 1) {
        elements.push(
          <figure key={key++} className="my-6">
            <img 
              src={images[0].src} 
              alt={images[0].alt || ''} 
              className="w-full h-auto rounded-sm object-cover"
              loading="lazy"
            />
            {images[0].alt && (
              <figcaption className="mt-2 text-sm text-muted-foreground font-mono">
                {images[0].alt}
              </figcaption>
            )}
          </figure>
        );
      }
      
      i = endIndex;
      continue;
    }

    // Blockquote with author
    if (trimmed.startsWith('> ')) {
      let quoteText = trimmed.slice(2);
      let author = '';
      let role = '';
      i++;

      // Collect multi-line quote
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteText += ' ' + lines[i].trim().slice(2);
        i++;
      }

      // Check for author line (:> Author (Role))
      if (i < lines.length && lines[i].trim().startsWith(':> ')) {
        const authorLine = lines[i].trim().slice(3);
        const match = authorLine.match(/^(.+?)\s*\((.+?)\)$/);
        if (match) {
          author = match[1];
          role = match[2];
        } else {
          author = authorLine;
        }
        i++;
      }

      if (author) {
        elements.push(
          <Quote key={key++} text={quoteText} author={author} role={role} />
        );
      } else {
        elements.push(
          <blockquote key={key++} className="quote-block">
            <p className="quote-text">{quoteText}</p>
          </blockquote>
        );
      }
      continue;
    }

    // Paragraph with inline formatting
    const renderInline = (text: string): React.ReactNode => {
      // Process bold, italic, links, and code
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let partKey = 0;

      while (remaining.length > 0) {
        // Bold **text**
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Link [text](url)
        const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
        // Inline code `code`
        const codeMatch = remaining.match(/`(.+?)`/);

        const matches = [
          boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
          linkMatch ? { type: 'link', match: linkMatch, index: linkMatch.index! } : null,
          codeMatch ? { type: 'code', match: codeMatch, index: codeMatch.index! } : null,
        ].filter(Boolean).sort((a, b) => a!.index - b!.index);

        if (matches.length === 0) {
          parts.push(remaining);
          break;
        }

        const first = matches[0]!;
        
        // Add text before match
        if (first.index > 0) {
          parts.push(remaining.slice(0, first.index));
        }

        // Add formatted element
        if (first.type === 'bold') {
          parts.push(<strong key={partKey++}>{first.match![1]}</strong>);
          remaining = remaining.slice(first.index + first.match![0].length);
        } else if (first.type === 'link') {
          parts.push(
            <a 
              key={partKey++} 
              href={first.match![2]}
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
              target={first.match![2].startsWith('http') ? '_blank' : undefined}
              rel={first.match![2].startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {first.match![1]}
            </a>
          );
          remaining = remaining.slice(first.index + first.match![0].length);
        } else if (first.type === 'code') {
          parts.push(
            <code key={partKey++} className="md-code font-mono">
              {first.match![1]}
            </code>
          );
          remaining = remaining.slice(first.index + first.match![0].length);
        }
      }

      return parts;
    };

    // Regular paragraph
    elements.push(
      <p key={key++} className="mb-4 leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return <div className={`prose ${className}`}>{elements}</div>;
}
