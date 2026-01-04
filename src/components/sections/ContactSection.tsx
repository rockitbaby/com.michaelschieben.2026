// Contact Section - CTA block, contact info with labels, highlighted style
import { Section } from '@/content/sections';
import { parseMarkdown, getInlineText } from '@/lib/parseMarkdown';
import { parseInline } from './parseUtils.tsx';

interface ContactSectionProps {
  section: Section;
}

export function ContactSection({ section }: ContactSectionProps) {
  const ast = parseMarkdown(section.content);
  
  // Extract components
  let ctaTitle = '';
  let ctaSubtitle = '';
  const useCases: string[] = [];
  let closingLine = '';
  let contactTitle = '';
  const contactInfo: { label: string; value: string; href?: string }[] = [];
  let quote: { text: string; author?: string } | null = null;

  let section_type: 'cta' | 'contact' | 'quote' = 'cta';

  for (const node of ast.nodes) {
    switch (node.type) {
      case 'heading': {
        const text = getInlineText(node);
        if (node.level === 2) {
          ctaTitle = text;
          section_type = 'cta';
        } else if (node.level === 3) {
          contactTitle = text;
          section_type = 'contact';
        }
        break;
      }

      case 'paragraph': {
        const text = getInlineText(node);
        if (section_type === 'cta') {
          // Bold subtitle
          if (text.startsWith('**') && text.endsWith('**') && text.split('**').length === 3) {
            ctaSubtitle = text.slice(2, -2);
          } else if (text && !text.startsWith('>')) {
            // Closing line (not a list item, not bold, not heading, not quote)
            closingLine = text;
          }
        } else if (section_type === 'contact') {
          // Contact info: **Label:** value or **Label:** [link](url)
          // Handle multiple contact items in one paragraph (marked combines them)
          // Match all occurrences of **Label:** pattern in the text
          const contactPattern = /\*\*(.+?):\*\*\s*([^\*]+?)(?=\*\*|$)/g;
          let match;
          
          while ((match = contactPattern.exec(text)) !== null) {
            const [, label, valueRaw] = match;
            const trimmedValue = valueRaw.trim();
            
            // Check if value contains a link
            const linkMatch = trimmedValue.match(/\[(.+?)\]\((.+?)\)/);
            if (linkMatch) {
              contactInfo.push({ label, value: linkMatch[1], href: linkMatch[2] });
            } else {
              contactInfo.push({ label, value: trimmedValue });
            }
          }
        }
        break;
      }

      case 'list': {
        if (node.items && section_type === 'cta') {
          useCases.push(...node.items);
        }
        break;
      }

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

      case 'hr': {
        // Section divider - handled by structure
        break;
      }

      default:
        break;
    }
  }

  return (
    <div className="space-y-8">
      {/* CTA Section */}
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {ctaTitle}
        </h2>
        
        {ctaSubtitle && (
          <p className="text-lg font-medium opacity-90">
            {ctaSubtitle}
          </p>
        )}

        {useCases.length > 0 && (
          <ul className="space-y-2 my-6">
            {useCases.map((useCase, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-lg opacity-60">→</span>
                <span className="opacity-90">{parseInline(useCase)}</span>
              </li>
            ))}
          </ul>
        )}

        {closingLine && (
          <p className="text-lg opacity-80 italic">
            {closingLine}
          </p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-current opacity-20" />

      {/* Contact Info */}
      <div className="space-y-4">
        {contactTitle && (
          <h3 className="text-xl font-semibold">{contactTitle}</h3>
        )}
        
        <div className="grid sm:grid-cols-2 gap-4">
          {contactInfo.map((info, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-sm font-mono opacity-60 mb-1">{info.label}</span>
              {info.href ? (
                <a 
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="font-medium hover:opacity-70 transition-opacity underline underline-offset-2"
                >
                  {info.value}
                </a>
              ) : (
                <span className="font-medium">{info.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      {quote && (
        <blockquote className="pt-8 border-t border-current/20 italic opacity-70 text-sm">
          <p>„{quote.text}"</p>
          {quote.author && (
            <footer className="mt-1 not-italic opacity-80">— {quote.author}</footer>
          )}
        </blockquote>
      )}
    </div>
  );
}

