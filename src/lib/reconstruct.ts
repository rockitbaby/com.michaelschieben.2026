import TurndownService from 'turndown';

// Configure Turndown to preserve markdown structure
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '*',
  emDelimiter: '*',
  strongDelimiter: '**',
});

// Custom rules for better markdown reconstruction
turndown.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => '~~' + content + '~~'
});

// Reconstruct frontmatter from <aside><dl> structure
export function parseFrontmatterFromHTML(asideElement: HTMLElement | null): Record<string, unknown> {
  if (!asideElement) return {};
  
  const frontmatter: Record<string, unknown> = {};
  const dl = asideElement.querySelector('dl');
  if (!dl) return frontmatter;
  
  // Only get top-level dt/dd pairs (direct children of dl, ignoring nested dl and separators)
  const terms: Element[] = [];
  const definitions: Element[] = [];
  
  // Iterate through direct children of dl, skipping separator divs
  Array.from(dl.children).forEach((child) => {
    // Skip separator divs
    if (child.classList.contains('frontmatter-separator')) {
      return;
    }
    if (child.tagName === 'DT') {
      terms.push(child);
    } else if (child.tagName === 'DD') {
      definitions.push(child);
    }
    // Ignore nested dl elements
  });
  
  // Match dt/dd pairs by index
  for (let i = 0; i < terms.length; i++) {
    // Remove ": " suffix from key (e.g., "order: " -> "order")
    const rawKey = terms[i].textContent?.trim() || '';
    const key = rawKey.replace(/: $/, '').replace(/:$/, ''); // Handle both ": " and ":"
    
    // Find the corresponding dd (should be at the same index)
    const dd = definitions[i];
    
    if (!dd) continue;
    
    // Check if this is a nested dl (sidebar_meta)
    const nestedDl = dd.querySelector('dl');
    if (nestedDl) {
      const nestedTerms = nestedDl.querySelectorAll('dt');
      const nestedDefs = nestedDl.querySelectorAll('dd');
      const items: { label: string; value: string }[] = [];
      
      // Each item has two dt/dd pairs: label and value
      for (let j = 0; j < nestedTerms.length; j += 2) {
        if (j + 1 < nestedTerms.length) {
          const labelTerm = nestedTerms[j];
          const valueTerm = nestedTerms[j + 1];
          const labelDef = nestedDefs[j];
          const valueDef = nestedDefs[j + 1];
          
          // Remove ": " suffix from nested keys too
          const labelKey = labelTerm?.textContent?.trim()?.replace(/: $/, '') || '';
          const valueKey = valueTerm?.textContent?.trim()?.replace(/: $/, '') || '';
          
          if (labelKey === 'label' && valueKey === 'value') {
            items.push({
              label: labelDef?.textContent?.trim() || '',
              value: valueDef?.textContent?.trim() || '',
            });
          }
        }
      }
      
      if (items.length > 0) {
        frontmatter[key] = items;
      }
    } else {
      const value = dd.textContent?.trim() || '';
      // Try to parse as number
      if (/^\d+$/.test(value)) {
        frontmatter[key] = parseInt(value, 10);
      } else {
        frontmatter[key] = value;
      }
    }
  }
  
  return frontmatter;
}

// Reconstruct markdown content from HTML
export function htmlToMarkdown(htmlElement: HTMLElement | null): string {
  if (!htmlElement) return '';
  
  // Clone to avoid modifying the original
  const clone = htmlElement.cloneNode(true) as HTMLElement;
  
  // Convert to markdown
  const markdown = turndown.turndown(clone);
  
  return markdown.trim();
}

// Extract raw markdown from a section (combines frontmatter + content)
export function reconstructSection(sectionElement: HTMLElement): {
  slug: string;
  frontmatter: {
    order: number;
    title: string;
    purpose?: string;
    layout?: 'full-width' | 'sidebar-left' | 'columns-3';
    sidebar_meta?: { label: string; value: string }[];
    related_post?: string;
    [key: string]: unknown;
  };
  content: string;
  rawMarkdown: string;
} {
  const slug = sectionElement.dataset.slug || '';
  const aside = sectionElement.querySelector('aside.frontmatter') as HTMLElement | null;
  const markdownDiv = sectionElement.querySelector('.markdown') as HTMLElement | null;
  
  const parsedFrontmatter = parseFrontmatterFromHTML(aside);
  const content = htmlToMarkdown(markdownDiv);
  
  // Build frontmatter with required fields
  const frontmatter = {
    order: typeof parsedFrontmatter.order === 'number' ? parsedFrontmatter.order : 0,
    title: typeof parsedFrontmatter.title === 'string' ? parsedFrontmatter.title : '',
    ...parsedFrontmatter,
  } as {
    order: number;
    title: string;
    purpose?: string;
    layout?: 'full-width' | 'sidebar-left' | 'columns-3';
    sidebar_meta?: { label: string; value: string }[];
    related_post?: string;
    [key: string]: unknown;
  };
  
  // Reconstruct raw markdown (frontmatter + content)
  const frontmatterLines: string[] = ['---'];
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (key === 'sidebar_meta' && Array.isArray(value)) {
      frontmatterLines.push(`${key}:`);
      value.forEach((item: { label: string; value: string }) => {
        frontmatterLines.push(`  - label: "${item.label}"`);
        frontmatterLines.push(`    value: "${item.value}"`);
      });
    } else {
      const displayValue = typeof value === 'string' ? `"${value}"` : String(value);
      frontmatterLines.push(`${key}: ${displayValue}`);
    }
  });
  frontmatterLines.push('---');
  frontmatterLines.push('');
  
  const rawMarkdown = frontmatterLines.join('\n') + '\n' + content;
  
  return {
    slug,
    frontmatter,
    content,
    rawMarkdown,
  };
}

