// Semantic Markdown Parser
// Uses marked to convert markdown to HTML, then interprets the DOM semantically

import { marked } from 'marked';

export interface SemanticNode {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'blockquote' | 'code' | 'hr' | 'text';
  level?: number;  // for headings (1-6)
  text?: string;   // text content
  children?: SemanticNode[];  // nested nodes (for blockquotes, paragraphs with inline formatting)
  items?: string[];  // for lists
  ordered?: boolean;  // for lists
  src?: string;  // for images
  alt?: string;  // for images
  language?: string;  // for code blocks
  code?: string;  // for code blocks
  raw?: string;  // original markdown line (for debugging)
}

export interface SemanticAST {
  nodes: SemanticNode[];
  
  // Query methods
  findAll: (type: SemanticNode['type'], options?: { level?: number }) => SemanticNode[];
  findFirst: (type: SemanticNode['type'], options?: { level?: number }) => SemanticNode | null;
  splitBy: (type: SemanticNode['type']) => SemanticAST[];
  getText: () => string;
  hasType: (type: SemanticNode['type'], options?: { level?: number }) => boolean;
}

// Parse markdown content to semantic AST
export function parseMarkdown(content: string): SemanticAST {
  // Use marked to convert markdown to HTML
  const html = marked.parse(content, {
    breaks: true,
    gfm: true,
  }) as string;
  
  // Parse HTML to DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Convert DOM to semantic AST
  const nodes = interpretDOM(doc.body);
  
  return createAST(nodes);
}

// Convert DOM element to semantic nodes
function interpretDOM(element: Element | DocumentFragment): SemanticNode[] {
  const nodes: SemanticNode[] = [];
  
  for (const child of Array.from(element.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        nodes.push({
          type: 'text',
          text,
        });
      }
      continue;
    }
    
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    
    const el = child as Element;
    const tagName = el.tagName.toLowerCase();
    
    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const level = parseInt(tagName[1]);
        const text = extractTextContent(el);
        nodes.push({
          type: 'heading',
          level,
          text,
          children: parseInlineContent(el.innerHTML),
        });
        break;
      }
      
      case 'p': {
        // Check if paragraph contains only an image
        const img = el.querySelector('img');
        if (img && el.childNodes.length === 1) {
          // Paragraph contains only an image - treat as image node
          nodes.push({
            type: 'image',
            src: img.getAttribute('src') || '',
            alt: img.getAttribute('alt') || '',
          });
        } else {
          // Regular paragraph
          const text = extractTextContent(el);
          nodes.push({
            type: 'paragraph',
            text,
            children: parseInlineContent(el.innerHTML),
          });
        }
        break;
      }
      
      case 'ul':
      case 'ol': {
        const items: string[] = [];
        const listItems = el.querySelectorAll('li');
        for (const li of Array.from(listItems)) {
          // Reconstruct markdown format from HTML, preserving bold, links, etc.
          let itemText = '';
          const childNodes = Array.from(li.childNodes);
          
          for (const child of childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
              const text = child.textContent || '';
              itemText += text;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              const childEl = child as Element;
              const tagName = childEl.tagName.toLowerCase();
              
              if (tagName === 'a') {
                const linkText = childEl.textContent?.trim() || '';
                const href = childEl.getAttribute('href') || '';
                if (linkText && href) {
                  itemText += `[${linkText}](${href})`;
                }
              } else if (tagName === 'strong' || tagName === 'b') {
                const text = childEl.textContent?.trim() || '';
                if (text) {
                  itemText += `**${text}**`;
                }
              } else if (tagName === 'em' || tagName === 'i') {
                const text = childEl.textContent?.trim() || '';
                if (text) {
                  itemText += `*${text}*`;
                }
              } else if (tagName === 'code') {
                const text = childEl.textContent?.trim() || '';
                if (text) {
                  itemText += `\`${text}\``;
                }
              } else {
                // Other elements - recursively process
                const nested = Array.from(childEl.childNodes);
                for (const nestedChild of nested) {
                  if (nestedChild.nodeType === Node.TEXT_NODE) {
                    itemText += nestedChild.textContent || '';
                  } else if (nestedChild.nodeType === Node.ELEMENT_NODE) {
                    const nestedEl = nestedChild as Element;
                    if (nestedEl.tagName.toLowerCase() === 'strong' || nestedEl.tagName.toLowerCase() === 'b') {
                      itemText += `**${nestedEl.textContent?.trim() || ''}**`;
                    } else if (nestedEl.tagName.toLowerCase() === 'a') {
                      const linkText = nestedEl.textContent?.trim() || '';
                      const href = nestedEl.getAttribute('href') || '';
                      if (linkText && href) {
                        itemText += `[${linkText}](${href})`;
                      }
                    } else {
                      itemText += nestedEl.textContent || '';
                    }
                  }
                }
              }
            }
          }
          
          items.push(itemText.trim() || extractTextContent(li));
        }
        nodes.push({
          type: 'list',
          items,
          ordered: tagName === 'ol',
        });
        break;
      }
      
      case 'img': {
        nodes.push({
          type: 'image',
          src: el.getAttribute('src') || '',
          alt: el.getAttribute('alt') || '',
        });
        break;
      }
      
      case 'blockquote': {
        const text = extractTextContent(el);
        nodes.push({
          type: 'blockquote',
          text,
          children: interpretDOM(el),
        });
        break;
      }
      
      case 'pre': {
        const codeEl = el.querySelector('code');
        const language = codeEl?.className.match(/language-(\w+)/)?.[1];
        // Preserve whitespace - use textContent instead of extractTextContent to keep all whitespace
        const code = codeEl ? (codeEl.textContent || '') : (el.textContent || '');
        nodes.push({
          type: 'code',
          code,
          language,
        });
        break;
      }
      
      case 'code': {
        // Inline code - handled in parseInlineContent
        break;
      }
      
      case 'hr': {
        nodes.push({
          type: 'hr',
        });
        break;
      }
      
      default: {
        // Recursively process unknown elements
        const nested = interpretDOM(el);
        nodes.push(...nested);
        break;
      }
    }
  }
  
  return nodes;
}

// Extract plain text content from element
function extractTextContent(el: Element): string {
  return el.textContent?.trim() || '';
}

// Parse inline content (bold, links, code) from HTML
function parseInlineContent(html: string): SemanticNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes: SemanticNode[] = [];
  
  function traverse(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Preserve whitespace - normalize multiple spaces to single space, but keep all spaces
      const text = node.textContent || '';
      // Replace multiple whitespace with single space, but preserve single spaces
      // Don't trim - we want to preserve spaces at the edges
      const normalized = text.replace(/[ \t\n\r]+/g, ' ');
      if (normalized.length > 0) {
        nodes.push({ type: 'text', text: normalized });
      }
      return;
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    
    const el = node as Element;
    const tagName = el.tagName.toLowerCase();
    
    switch (tagName) {
      case 'strong':
      case 'b': {
        // Get text content preserving whitespace
        const text = el.textContent?.replace(/[ \t\n\r]+/g, ' ') || '';
        if (text.trim()) {
          nodes.push({ type: 'text', text: `**${text.trim()}**` }); // Preserve bold marker
        }
        break;
      }
      
      case 'em':
      case 'i': {
        const text = el.textContent?.replace(/[ \t\n\r]+/g, ' ') || '';
        if (text.trim()) {
          nodes.push({ type: 'text', text: `*${text.trim()}*` }); // Preserve italic marker
        }
        break;
      }
      
      case 'a': {
        const text = el.textContent?.replace(/[ \t\n\r]+/g, ' ') || '';
        const href = el.getAttribute('href') || '';
        if (text.trim() && href) {
          nodes.push({ type: 'text', text: `[${text.trim()}](${href})` }); // Preserve link marker
        }
        break;
      }
      
      case 'code': {
        const text = el.textContent?.replace(/[ \t\n\r]+/g, ' ') || '';
        if (text.trim()) {
          nodes.push({ type: 'text', text: `\`${text.trim()}\`` }); // Preserve code marker
        }
        break;
      }
      
      case 'br': {
        // Line breaks should become spaces
        nodes.push({ type: 'text', text: ' ' });
        break;
      }
      
      default: {
        // Recursively process child nodes
        for (const child of Array.from(el.childNodes)) {
          traverse(child);
        }
        break;
      }
    }
  }
  
  for (const child of Array.from(doc.body.childNodes)) {
    traverse(child);
  }
  
  return nodes;
}

// Create AST wrapper with query methods
function createAST(nodes: SemanticNode[]): SemanticAST {
  return {
    nodes,
    
    findAll(type: SemanticNode['type'], options?: { level?: number }): SemanticNode[] {
      const results: SemanticNode[] = [];
      
      function traverse(nodes: SemanticNode[]) {
        for (const node of nodes) {
          if (node.type === type) {
            if (options?.level !== undefined) {
              if (node.level === options.level) {
                results.push(node);
              }
            } else {
              results.push(node);
            }
          }
          
          if (node.children) {
            traverse(node.children);
          }
        }
      }
      
      traverse(nodes);
      return results;
    },
    
    findFirst(type: SemanticNode['type'], options?: { level?: number }): SemanticNode | null {
      const all = this.findAll(type, options);
      return all.length > 0 ? all[0] : null;
    },
    
    splitBy(type: SemanticNode['type']): SemanticAST[] {
      const parts: SemanticNode[][] = [];
      let current: SemanticNode[] = [];
      
      for (const node of nodes) {
        if (node.type === type) {
          if (current.length > 0) {
            parts.push(current);
            current = [];
          }
        } else {
          current.push(node);
        }
      }
      
      if (current.length > 0) {
        parts.push(current);
      }
      
      return parts.map(part => createAST(part));
    },
    
    getText(): string {
      function extractText(nodes: SemanticNode[]): string {
        return nodes.map(node => {
          if (node.text) return node.text;
          if (node.items) return node.items.join('\n');
          if (node.code) return node.code;
          if (node.children) return extractText(node.children);
          return '';
        }).filter(Boolean).join('\n');
      }
      
      return extractText(nodes);
    },
    
    hasType(type: SemanticNode['type'], options?: { level?: number }): boolean {
      return this.findAll(type, options).length > 0;
    },
  };
}

// Helper to reconstruct markdown-like text from semantic nodes
export function getNodeText(node: SemanticNode): string {
  if (node.text) return node.text;
  if (node.items) return node.items.join('\n');
  if (node.code) return node.code;
  if (node.children) {
    return node.children.map(getNodeText).join('');
  }
  return '';
}

// Helper to get all text nodes from a semantic node (for inline formatting)
export function getInlineText(node: SemanticNode): string {
  if (node.children) {
    // Join children and normalize whitespace, but preserve spaces between words
    const result = node.children.map(child => {
      if (child.type === 'text' && child.text) {
        return child.text;
      }
      return getInlineText(child);
    }).join('');
    // Normalize multiple spaces to single space, but preserve word boundaries
    return result.replace(/\s+/g, ' ');
  }
  // Normalize multiple spaces to single space
  return (node.text || '').replace(/\s+/g, ' ');
}

