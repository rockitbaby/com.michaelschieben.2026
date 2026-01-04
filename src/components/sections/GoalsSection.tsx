// Goals Section - 3-column layout with heading above
import { Section } from '@/content/sections';
import { parseMarkdown, getInlineText } from '@/lib/parseMarkdown';
import { parseInline } from './parseUtils.tsx';

interface GoalsSectionProps {
  section: Section;
}

interface ContentBlock {
  elements: React.ReactNode[];
}

export function GoalsSection({ section }: GoalsSectionProps) {
  const ast = parseMarkdown(section.content);
  const parts = ast.splitBy('hr');
  const blocks: ContentBlock[] = [];
  let sectionHeading = '';
  let key = 0;
  let foundFirstH2 = false;

  // Collect all nodes from all parts
  const allNodes = parts.flatMap(part => part.nodes);
  
  let currentBlock: ContentBlock = { elements: [] };

  for (const node of allNodes) {
    switch (node.type) {
      case 'heading': {
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
          currentBlock.elements.push(
            <h2 key={key++} className="text-xl md:text-2xl font-semibold tracking-tight mb-4">
              {text}
            </h2>
          );
        } else if (node.level === 3) {
          // H3 starts a new block - save previous block and start new one
          if (currentBlock.elements.length > 0) {
            blocks.push(currentBlock);
          }
          currentBlock = { elements: [] };
          currentBlock.elements.push(
            <h3 key={key++} className="text-base font-semibold text-muted-foreground mb-2">
              {text}
            </h3>
          );
        }
        break;
      }

      case 'list': {
        if (node.items) {
          currentBlock.elements.push(
            <ul key={key++} className="space-y-2">
              {node.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 shrink-0">→</span>
                  <span className="text-foreground/80">{parseInline(item)}</span>
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
          // Check if it's a bold line (starts and ends with **)
          if (text.startsWith('**') && text.endsWith('**') && text.split('**').length === 3) {
            currentBlock.elements.push(
              <p key={key++} className="font-semibold text-foreground mb-2">
                {parseInline(text)}
              </p>
            );
          } else {
            currentBlock.elements.push(
              <p key={key++} className="text-sm text-foreground/70 leading-relaxed">
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

  // Don't forget the last block
  if (currentBlock.elements.length > 0) {
    blocks.push(currentBlock);
  }

  return (
    <div className="space-y-8">
      {/* Section Heading - full width above columns */}
      {sectionHeading && (
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
          {sectionHeading}
        </h2>
      )}

      {/* Three column layout */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {blocks.map((block, idx) => (
          <div 
            key={idx} 
            className={`
              space-y-3
              ${idx === blocks.length - 1 && blocks.length % 3 === 1 ? 'md:col-span-3' : ''}
              ${idx === blocks.length - 1 && blocks.length % 3 === 2 ? 'md:col-span-2' : ''}
            `}
          >
            {block.elements}
          </div>
        ))}
      </div>
    </div>
  );
}
