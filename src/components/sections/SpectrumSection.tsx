// Spectrum Section - 3-column layout with disciplines
import { Section } from '@/content/sections';
import { parseMarkdown, getInlineText, type SemanticNode, type SemanticAST } from '@/lib/parseMarkdown';
import { parseInline } from './parseUtils.tsx';

interface SpectrumSectionProps {
  section: Section;
}

interface Column {
  title: string;
  subtitle?: string;
  content: string[];
  resources?: { text: string; href: string }[];
  image?: string;
}

export function SpectrumSection({ section }: SpectrumSectionProps) {
  const ast = parseMarkdown(section.content);
  const parts = ast.splitBy('hr');
  
  // First part contains intro and first column
  const firstPart = parts[0];
  if (!firstPart) return <div />;
  
  const h3 = firstPart.findFirst('heading', { level: 3 });
  
  let introNodes: SemanticNode[] = [];
  let firstColumnNodes: SemanticNode[] = [];
  
  if (h3) {
    // Split at first H3
    let foundH3 = false;
    
    for (const node of firstPart.nodes) {
      if (!foundH3 && node.type === 'heading' && node.level === 3) {
        foundH3 = true;
        firstColumnNodes.push(node);
      } else if (foundH3) {
        firstColumnNodes.push(node);
      } else {
        introNodes.push(node);
      }
    }
  } else {
    firstColumnNodes = firstPart.nodes;
  }

  // Parse columns - create temporary ASTs for column parts
  const columns: Column[] = [];
  const columnParts: SemanticAST[] = [];
  
  // Create a helper function to query nodes
  const queryNodes = (nodes: SemanticNode[], type: SemanticNode['type'], options?: { level?: number }): SemanticNode[] => {
    const results: SemanticNode[] = [];
    function traverse(ns: SemanticNode[]) {
      for (const node of ns) {
        if (node.type === type) {
          if (options?.level !== undefined) {
            if (node.level === options.level) results.push(node);
          } else {
            results.push(node);
          }
        }
        if (node.children) traverse(node.children);
      }
    }
    traverse(nodes);
    return results;
  };
  
  const getFirst = (nodes: SemanticNode[], type: SemanticNode['type'], options?: { level?: number }): SemanticNode | null => {
    const all = queryNodes(nodes, type, options);
    return all.length > 0 ? all[0] : null;
  };
  
  // Add first column if it has nodes
  if (firstColumnNodes.length > 0) {
    columnParts.push({ nodes: firstColumnNodes, findAll: (t, o) => queryNodes(firstColumnNodes, t, o), findFirst: (t, o) => getFirst(firstColumnNodes, t, o), splitBy: () => [], getText: () => '', hasType: (t, o) => queryNodes(firstColumnNodes, t, o).length > 0 });
  }
  
  columnParts.push(...parts.slice(1).filter(p => p.findFirst('heading', { level: 3 })));
  
  for (const colPart of columnParts) {
    const h3 = colPart.findFirst('heading', { level: 3 });
    const title = h3 ? getInlineText(h3) : '';
    
    // Find subtitle (first bold paragraph after title)
    const paragraphs = colPart.findAll('paragraph');
    const subtitlePara = paragraphs.find(p => {
      const text = getInlineText(p);
      return text.startsWith('**') && text.endsWith('**') && text.split('**').length === 3;
    });
    const subtitle = subtitlePara ? getInlineText(subtitlePara).slice(2, -2) : undefined;
    
    // Find image
    const image = colPart.findFirst('image');
    const imageSrc = image?.src;
    
    // Find resources (paragraphs with links after "Ressourcen:" or "Resources:")
    const resources: { text: string; href: string }[] = [];
    let foundResourcesLabel = false;
    
    for (const para of paragraphs) {
      const text = getInlineText(para);
      const textLower = text.toLowerCase();
      
      // Check if this paragraph contains the resources label
      if (textLower.includes('ressourcen') || textLower.includes('resources')) {
        foundResourcesLabel = true;
        // Also extract links from the same paragraph if they're there
        const linkMatches = text.matchAll(/\[(.+?)\]\((.+?)\)/g);
        for (const match of linkMatches) {
          resources.push({ text: match[1], href: match[2] });
        }
        continue;
      }
      
      if (foundResourcesLabel) {
        // Extract links from this paragraph
        const linkMatches = text.matchAll(/\[(.+?)\]\((.+?)\)/g);
        for (const match of linkMatches) {
          resources.push({ text: match[1], href: match[2] });
        }
      }
    }
    
    // Get content paragraphs (exclude title, subtitle, image, resources)
    const contentParagraphs = paragraphs.filter(p => {
      const text = getInlineText(p);
      const isSubtitle = text.startsWith('**') && text.endsWith('**') && text.split('**').length === 3;
      const hasResourcesLabel = text.toLowerCase().includes('ressourcen') || text.toLowerCase().includes('resources');
      const hasLinks = /\[(.+?)\]\((.+?)\)/.test(text);
      return !isSubtitle && !hasResourcesLabel && !hasLinks;
    });
    
    columns.push({
      title,
      subtitle,
      content: contentParagraphs.map(p => getInlineText(p)),
      resources: resources.length > 0 ? resources : undefined,
      image: imageSrc
    });
  }

  // Find conclusion (H2 section after columns, no H3)
  const conclusion = parts.find(p => {
    const h2 = p.findFirst('heading', { level: 2 });
    const h3 = p.findFirst('heading', { level: 3 });
    return h2 && !h3;
  });

  return (
    <div className="space-y-10">
      {/* Intro */}
      {introNodes.length > 0 && (
        <div className="max-w-2xl">
          {introNodes.map((node, idx) => {
            if (node.type === 'heading' && node.level === 2) {
              return (
                <h2 key={idx} className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  {getInlineText(node)}
                </h2>
              );
            }
            if (node.type === 'paragraph') {
              const text = getInlineText(node);
              if (text) {
                return (
                  <p key={idx} className="text-lg text-foreground/80">
                    {parseInline(text)}
                  </p>
                );
              }
            }
            return null;
          })}
        </div>
      )}

      {/* Three columns */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
        {columns.map((col, idx) => (
          <article 
            key={idx} 
            className="group space-y-4 p-5 -m-5 rounded-xl hover:bg-muted/30 transition-all duration-300"
          >
            {/* Image */}
            {col.image && (
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <img 
                  src={col.image} 
                  alt={col.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            )}
            
            {/* Title */}
            <h3 className="text-xl font-semibold group-hover:text-foreground transition-colors">
              {col.title}
            </h3>
            
            {/* Subtitle */}
            {col.subtitle && (
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {col.subtitle}
              </p>
            )}
            
            {/* Content */}
            <div className="space-y-3 text-sm text-foreground/70 leading-relaxed">
              {col.content.map((line, lineIdx) => (
                <p key={lineIdx}>{parseInline(line)}</p>
              ))}
            </div>
            
            {/* Resources */}
            {col.resources && col.resources.length > 0 && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs font-mono text-muted-foreground mb-2">Ressourcen:</p>
                <div className="flex flex-wrap gap-2">
                  {col.resources.map((res, resIdx) => (
                    <a
                      key={resIdx}
                      href={res.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 rounded bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {res.text}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Conclusion */}
      {conclusion && (
        <div className="pt-10 border-t border-border max-w-2xl">
          {conclusion.nodes.map((node, idx) => {
            if (node.type === 'heading' && node.level === 2) {
              return (
                <h2 key={idx} className="text-2xl font-semibold mb-4">
                  {getInlineText(node)}
                </h2>
              );
            }
            if (node.type === 'paragraph') {
              const text = getInlineText(node);
              if (text) {
                return (
                  <p key={idx} className="text-foreground/80">
                    {parseInline(text)}
                  </p>
                );
              }
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}


