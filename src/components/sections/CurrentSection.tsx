// Current Section - Blog-like, current activities
import { useState, useEffect } from 'react';
import { Section } from '@/content/sections';
import { parseMarkdown, getInlineText } from '@/lib/parseMarkdown';
import { parseInline } from './parseUtils.tsx';

interface FeedItem {
  id: string;
  content_html: string;
  date_published: string;
  url: string;
  tags?: string[];
}

interface JsonFeed {
  version: string;
  title: string;
  items: FeedItem[];
}

interface CurrentSectionProps {
  section: Section;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function FeedCard({ item }: { item: FeedItem }) {
  // Extract first image from content_html if exists
  const imgMatch = item.content_html.match(/<img[^>]+src="([^"]+)"[^>]*>/);
  const imageUrl = imgMatch ? imgMatch[1] : null;
  
  // Strip HTML and get plain text excerpt
  const textContent = item.content_html
    .replace(/<img[^>]*>/g, '') // Remove images
    .replace(/<[^>]+>/g, ' ')   // Remove other HTML tags
    .replace(/\s+/g, ' ')       // Normalize whitespace
    .trim();
  
  const excerpt = textContent.length > 100 
    ? textContent.slice(0, 100).trim() + '…' 
    : textContent;

  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-72 aspect-video bg-muted/30 rounded-lg overflow-hidden relative hover:bg-muted/50 transition-colors"
    >
      {/* Thumbnail */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <time className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide">
          {formatDate(item.date_published)}
        </time>
        <p className="text-foreground/90 text-sm leading-snug mt-1 line-clamp-2">
          {excerpt}
        </p>
      </div>
    </a>
  );
}

function MoreCard({ feedUrl }: { feedUrl: string }) {
  // Extract base URL from feed URL
  const blogUrl = feedUrl.replace('/feed.json', '');
  
  return (
    <a 
      href={blogUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-72 aspect-video bg-muted/20 rounded-lg overflow-hidden relative hover:bg-muted/40 transition-colors flex items-center justify-center border border-muted-foreground/10 hover:border-muted-foreground/30"
    >
      <div className="text-center">
        <span className="text-3xl group-hover:scale-110 transition-transform inline-block">→</span>
        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors mt-2">
          Mehr im Micro-Blog
        </p>
      </div>
    </a>
  );
}

export function CurrentSection({ section }: CurrentSectionProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const feedSource = section.frontmatter.feed_source;
  const feedLimit = section.frontmatter.feed_limit ?? 2;

  useEffect(() => {
    if (!feedSource) return;

    setLoading(true);
    setError(null);

    fetch(feedSource)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<JsonFeed>;
      })
      .then((feed) => {
        setFeedItems(feed.items.slice(0, feedLimit));
      })
      .catch((err) => {
        console.error('Feed fetch error:', err);
        setError('Feed konnte nicht geladen werden');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [feedSource, feedLimit]);

  const ast = parseMarkdown(section.content);
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const node of ast.nodes) {
    switch (node.type) {
      case 'heading': {
        const text = getInlineText(node);
        if (node.level === 2) {
          elements.push(
            <h2 key={key++} className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
              {text}
            </h2>
          );
        } else if (node.level === 3) {
          elements.push(
            <h3 key={key++} className="text-lg font-semibold mt-6 mb-2 text-muted-foreground">
              {text}
            </h3>
          );
        }
        break;
      }

      case 'blockquote': {
        const text = node.text || '';
        const authorMatch = text.match(/^(.+?)\s*[—–-]\s*(.+)$/);
        if (authorMatch) {
          elements.push(
            <blockquote key={key++} className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground my-6">
              <p>„{authorMatch[1].trim()}"</p>
              <footer className="mt-2 text-sm not-italic">— {authorMatch[2].trim()}</footer>
            </blockquote>
          );
        } else {
          elements.push(
            <blockquote key={key++} className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground my-6">
              <p>„{text}"</p>
            </blockquote>
          );
        }
        break;
      }

      case 'image': {
        elements.push(
          <figure key={key++} className="my-6">
            <img 
              src={node.src || ''} 
              alt={node.alt || ''} 
              className="w-full rounded-lg"
              loading="lazy"
            />
            {node.alt && (
              <figcaption className="mt-2 text-sm text-muted-foreground font-mono">
                {node.alt}
              </figcaption>
            )}
          </figure>
        );
        break;
      }

      case 'paragraph': {
        const text = getInlineText(node);
        if (text) {
          elements.push(
            <p key={key++} className="text-foreground/80 leading-relaxed mb-4">
              {parseInline(text)}
            </p>
          );
        }
        break;
      }

      case 'hr': {
        // Skip horizontal rules in this section
        break;
      }

      default:
        break;
    }
  }

  return (
    <div className="space-y-2">
      <div className="max-w-2xl">
        {elements}
      </div>
      
      {/* Feed Cards - horizontal scroll */}
      {feedSource && (
        <div className="mt-6 -mx-4 md:-mx-8">
          {loading && (
            <p className="text-sm text-muted-foreground animate-pulse px-4 md:px-8">
              Lade aktuelle Posts…
            </p>
          )}
          
          {error && (
            <p className="text-sm text-destructive px-4 md:px-8">
              {error}
            </p>
          )}
          
          {feedItems.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-4 px-4 md:px-8 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
              {feedItems.map((item) => (
                <FeedCard key={item.id} item={item} />
              ))}
              <MoreCard feedUrl={feedSource} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

