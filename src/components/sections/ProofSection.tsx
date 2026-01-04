// Proof Section - Project grid showcasing concrete work
import { Section } from '@/content/sections';
import { parseMarkdown, getInlineText } from '@/lib/parseMarkdown';

interface ProofSectionProps {
  section: Section;
}

interface Project {
  title: string;
  description: string;
}

export function ProofSection({ section }: ProofSectionProps) {
  const ast = parseMarkdown(section.content);
  const parts = ast.splitBy('hr');
  
  const projects: Project[] = [];
  let sectionHeading = '';
  let clientsHeading = '';
  let clientsList = '';
  let currentProject: Project | null = null;
  let inClientsSection = false;

  let quote: { text: string; author?: string } | null = null;

  for (const part of parts) {
    // Check for quote
    const blockquote = part.findFirst('blockquote');
    if (blockquote) {
      const text = blockquote.text || '';
      const authorMatch = text.match(/^(.+?)\s*[—–-]\s*(.+)$/);
      if (authorMatch) {
        quote = { text: authorMatch[1].trim(), author: authorMatch[2].trim() };
      } else {
        quote = { text: text.trim() };
      }
      continue;
    }

    // Check if this part is the clients section
    const h2 = part.findFirst('heading', { level: 2 });
    if (h2) {
      const headingText = getInlineText(h2);
      if (headingText.toLowerCase().includes('kunden')) {
        inClientsSection = true;
        clientsHeading = headingText;
        // Collect all text from this section
        const paragraphs = part.findAll('paragraph');
        clientsList = paragraphs.map(p => getInlineText(p)).join(' ');
        continue;
      } else if (!sectionHeading) {
        // First H2 that's not "Kunden" is the section heading
        sectionHeading = headingText;
      }
    }

    // Process projects in this part
    for (const node of part.nodes) {
      if (node.type === 'paragraph') {
        const text = getInlineText(node);
        // Handle line breaks in text (marked renders them as spaces or <br>)
        // First normalize all whitespace, but preserve the structure
        const normalizedText = text.replace(/\s+/g, ' ').trim();
        
        // Bold title line (project start) - check if text starts with **
        const titleMatch = normalizedText.match(/^\*\*(.+?)\*\*/);
        if (titleMatch) {
          // Save previous project
          if (currentProject) {
            projects.push(currentProject);
          }
          
          // Extract description - everything after the bold title
          const description = normalizedText.replace(/^\*\*(.+?)\*\*\s*/, '').trim();
          if (description) {
            currentProject = {
              title: titleMatch[1],
              description: description
            };
          } else {
            // If no description in same paragraph, create project with empty description
            currentProject = {
              title: titleMatch[1],
              description: ''
            };
          }
        } else if (currentProject && normalizedText) {
          // Description line (part of current project)
          currentProject.description += (currentProject.description ? ' ' : '') + normalizedText;
        }
      }
    }
    
    // Save the last project in this part if it's not the clients section
    if (currentProject && !inClientsSection) {
      projects.push(currentProject);
      currentProject = null;
    }
  }

  // Don't forget last project (fallback)
  if (currentProject && !inClientsSection) {
    projects.push(currentProject);
  }

  return (
    <div className="space-y-12">
      {/* Section Heading */}
      {sectionHeading && (
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
          {sectionHeading}
        </h2>
      )}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <article 
            key={idx}
            className="group p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-all duration-300"
          >
            <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </article>
        ))}
      </div>

      {/* Clients Section */}
      {clientsList && (
        <div className="pt-8 border-t border-border">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
            {clientsHeading || 'Kunden 2025'}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {clientsList}
          </p>
        </div>
      )}

      {/* Quote */}
      {quote && (
        <blockquote className="pt-8 border-t border-border italic text-muted-foreground text-sm">
          <p>„{quote.text}"</p>
          {quote.author && (
            <footer className="mt-1 text-xs not-italic">— {quote.author}</footer>
          )}
        </blockquote>
      )}
    </div>
  );
}

