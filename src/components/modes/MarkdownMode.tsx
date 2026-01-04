import { Section } from '@/content/sections';
import ReactMarkdown from 'react-markdown';
import './MarkdownMode.css';

interface MarkdownModeProps {
  sections: Section[];
}

function Frontmatter({ section }: { section: Section }) {
  const fm = section.frontmatter;
  
  const lines: string[] = ['---'];
  
  Object.entries(fm).forEach(([key, value]) => {
    if (key === 'sidebar_meta' && Array.isArray(value)) {
      lines.push(`${key}:`);
      value.forEach((item) => {
        lines.push(`  - label: "${item.label}"`);
        lines.push(`    value: "${item.value}"`);
      });
    } else {
      const displayValue = typeof value === 'string' ? `"${value}"` : String(value);
      lines.push(`${key}: ${displayValue}`);
    }
  });
  
  lines.push('---');
  
  return (
    <pre className="frontmatter">{lines.join('\n')}</pre>
  );
}

export function MarkdownMode({ sections }: MarkdownModeProps) {
  return (
    <main className="markdown-mode">
      {sections.map((section) => (
        <article key={section.slug} id={section.slug}>
          <Frontmatter section={section} />
          <section className="markdown">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </section>
        </article>
      ))}
    </main>
  );
}
