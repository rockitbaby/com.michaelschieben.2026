// Default Section - Fallback renderer using MarkdownRenderer
import { Section } from '@/content/sections';
import { MarkdownRenderer } from '../MarkdownRenderer';

interface DefaultSectionProps {
  section: Section;
}

export function DefaultSection({ section }: DefaultSectionProps) {
  return (
    <div className="max-w-3xl">
      <MarkdownRenderer content={section.content} />
    </div>
  );
}


