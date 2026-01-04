// Semantic parsing utilities for section content
// Re-exported as .tsx for JSX support

export interface ParsedBlock {
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'code' | 'image' | 'hr' | 'bold-intro';
  level?: number;
  content: string;
  items?: string[];
  author?: string;
  language?: string;
}

// Split content by horizontal rules
export function splitByHR(content: string): string[] {
  return content.split(/\n---\n/).map(s => s.trim()).filter(Boolean);
}

// Extract quote with author
export function parseQuote(text: string): { text: string; author?: string } | null {
  const lines = text.split('\n').filter(l => l.trim().startsWith('>'));
  if (lines.length === 0) return null;
  
  const quoteText = lines.map(l => l.replace(/^>\s*/, '')).join(' ');
  const authorMatch = quoteText.match(/^(.+?)\s*[–—-]\s*(.+)$/);
  
  if (authorMatch) {
    return { text: authorMatch[1].trim(), author: authorMatch[2].trim() };
  }
  return { text: quoteText };
}

// Extract image
export function parseImage(line: string): { src: string; alt: string } | null {
  const match = line.match(/^!\[(.*?)\]\((.*?)\)$/);
  if (match) return { alt: match[1], src: match[2] };
  return null;
}

// Parse inline formatting
export function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

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
    
    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index));
    }

    if (first.type === 'bold') {
      parts.push(<strong key={key++}>{first.match![1]}</strong>);
      remaining = remaining.slice(first.index + first.match![0].length);
    } else if (first.type === 'link') {
      parts.push(
        <a 
          key={key++} 
          href={first.match![2]}
          className="underline underline-offset-2 hover:opacity-70 transition-opacity"
          target={first.match![2].startsWith('http') ? '_blank' : undefined}
          rel={first.match![2].startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {first.match![1]}
        </a>
      );
      remaining = remaining.slice(first.index + first.match![0].length);
    } else if (first.type === 'code') {
      parts.push(
        <code key={key++} className="font-mono bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm">
          {first.match![1]}
        </code>
      );
      remaining = remaining.slice(first.index + first.match![0].length);
    }
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

// Parse list items
export function parseList(content: string): string[] {
  return content
    .split('\n')
    .filter(line => line.trim().match(/^[-*]\s/))
    .map(line => line.replace(/^[-*]\s+/, '').trim());
}

// Extract code block
export function parseCodeBlock(content: string): { language?: string; code: string } | null {
  const match = content.match(/```(\w*)\n([\s\S]*?)```/);
  if (match) {
    return { language: match[1] || undefined, code: match[2] };
  }
  return null;
}

// Parse contact info (label: value pattern)
export function parseContactInfo(content: string): { label: string; value: string; href?: string }[] {
  const results: { label: string; value: string; href?: string }[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Match **Label:** value or **Label:** [link](url)
    const match = line.match(/\*\*(.+?):\*\*\s*(.+)/);
    if (match) {
      const label = match[1];
      const valueRaw = match[2];
      
      // Check if value contains a link
      const linkMatch = valueRaw.match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        results.push({ label, value: linkMatch[1], href: linkMatch[2] });
      } else {
        results.push({ label, value: valueRaw.trim() });
      }
    }
  }
  
  return results;
}

