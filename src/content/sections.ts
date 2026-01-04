// Simple browser-compatible frontmatter parser
function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: content.trim() };
  }
  
  const yamlContent = match[1];
  const markdownContent = match[2];
  
  // Simple YAML parser for our specific frontmatter structure
  const data: Record<string, unknown> = {};
  const lines = yamlContent.split('\n');
  let currentKey = '';
  let currentArray: { label: string; value: string }[] | null = null;
  
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;
    
    // Check for array item (sidebar_meta entries)
    const arrayItemMatch = line.match(/^\s+-\s+label:\s*"?([^"]*)"?$/);
    if (arrayItemMatch && currentArray) {
      currentArray.push({ label: arrayItemMatch[1], value: '' });
      continue;
    }
    
    const arrayValueMatch = line.match(/^\s+value:\s*"?([^"]*)"?$/);
    if (arrayValueMatch && currentArray && currentArray.length > 0) {
      currentArray[currentArray.length - 1].value = arrayValueMatch[1];
      continue;
    }
    
    // Check for key: value pair
    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyValueMatch) {
      const [, key, value] = keyValueMatch;
      currentKey = key;
      
      // Check if starting an array
      if (!value.trim()) {
        currentArray = [];
        data[key] = currentArray;
      } else {
        currentArray = null;
        // Remove quotes and parse value
        let parsedValue: string | number = value.trim().replace(/^["']|["']$/g, '');
        // Try to parse as number
        if (/^\d+$/.test(parsedValue)) {
          data[key] = parseInt(parsedValue, 10);
        } else {
          data[key] = parsedValue;
        }
      }
    }
  }
  
  return { data, content: markdownContent.trim() };
}

// Import raw markdown files at build time
import hero from '../../content/sections/01-hero.md?raw';
import versprechen from '../../content/sections/02-versprechen.md?raw';
import beweis from '../../content/sections/03-beweis.md?raw';
import spektrum from '../../content/sections/04-spektrum.md?raw';
import haltung from '../../content/sections/05-haltung.md?raw';
import aktuell from '../../content/sections/06-aktuell.md?raw';
import ziele2026 from '../../content/sections/07-ziele-2026.md?raw';
import kontakt from '../../content/sections/08-kontakt.md?raw';

export interface SectionMeta {
  label: string;
  value: string;
}

export interface Section {
  slug: string;
  frontmatter: {
    order: number;
    title: string;
    purpose?: string;
    critique?: string;
    layout?: 'full-width' | 'sidebar-left' | 'columns-3';
    style?: 'default' | 'highlight' | 'inverted';
    sidebar_meta?: SectionMeta[];
    related_post?: string;
    feed_source?: string;
    feed_limit?: number;
  };
  content: string;
  rawMarkdown: string;
}

// Raw markdown file contents
const rawFiles: Record<string, string> = {
  '01-hero': hero,
  '02-versprechen': versprechen,
  '03-beweis': beweis,
  '04-spektrum': spektrum,
  '05-haltung': haltung,
  '06-aktuell': aktuell,
  '07-ziele-2026': ziele2026,
  '08-kontakt': kontakt,
};

// Parse markdown files with our browser-compatible parser
export const sections: Section[] = Object.entries(rawFiles)
  .map(([slug, rawMarkdown]) => {
    const { data, content } = parseFrontmatter(rawMarkdown);
    return {
      slug,
      frontmatter: data as Section['frontmatter'],
      content,
      rawMarkdown,
    };
  })
  .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
