// Promise Section - "Was ich ermögliche" with services list
import { Section } from '@/content/sections';
import { parseMarkdown, getInlineText } from '@/lib/parseMarkdown';
import { parseInline } from './parseUtils.tsx';

interface PromiseSectionProps {
  section: Section;
}

interface Service {
  name: string;
  description: string;
}

export function PromiseSection({ section }: PromiseSectionProps) {
  const ast = parseMarkdown(section.content);
  const blocks = ast.splitBy('hr');
  
  return (
    <div className="space-y-12">
      {blocks.map((block, blockIdx) => {
        const elements: React.ReactNode[] = [];
        const services: Service[] = [];
        let key = 0;

        for (const node of block.nodes) {
          switch (node.type) {
            case 'heading': {
              const text = getInlineText(node);
              if (node.level === 2) {
                elements.push(
                  <h2 key={key++} className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                    {text}
                  </h2>
                );
              } else if (node.level === 3) {
                elements.push(
                  <h3 key={key++} className="text-xl font-semibold mt-8 mb-4">
                    {text}
                  </h3>
                );
              }
              break;
            }

            case 'list': {
              if (node.items) {
                for (const item of node.items) {
                  // Service list item: - **Name** — description
                  const match = item.match(/^\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
                  if (match) {
                    services.push({
                      name: match[1],
                      description: match[2]
                    });
                  }
                }
                // If we found services, don't render the list as a regular list
                if (services.length > 0) {
                  break;
                }
              }
              // If no services found, render as regular list
              if (node.items && services.length === 0) {
                elements.push(
                  <ul key={key++} className="space-y-2 my-4">
                    {node.items.map((item, idx) => (
                      <li key={idx} className="text-base md:text-lg leading-relaxed text-foreground/80">
                        {parseInline(item)}
                      </li>
                    ))}
                  </ul>
                );
              }
              break;
            }

            case 'paragraph': {
              const text = getInlineText(node);
              if (text) {
                // Bold tagline (starts and ends with **)
                if (text.startsWith('**') && text.endsWith('**') && text.split('**').length === 3) {
                  elements.push(
                    <p key={key++} className="text-lg md:text-xl font-semibold text-foreground mb-4">
                      {text.slice(2, -2)}
                    </p>
                  );
                } else {
                  elements.push(
                    <p key={key++} className="text-base md:text-lg leading-relaxed text-foreground/80">
                      {parseInline(text)}
                    </p>
                  );
                }
              }
              break;
            }

            default:
              break;
          }
        }

        // Render services as highlighted cards if we have them
        if (services.length > 0) {
          elements.push(
            <div key={key++} className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
              {services.map((service, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-lg border border-primary/30 bg-background text-center"
                >
                  <h4 className="font-semibold text-base mb-2 text-primary">
                    {service.name}
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {parseInline(service.description)}
                  </p>
                </div>
              ))}
            </div>
          );
        }

        return (
          <div key={blockIdx} className={blockIdx > 0 ? 'pt-8 border-t border-border' : ''}>
            {elements}
          </div>
        );
      })}
    </div>
  );
}
