interface QuoteProps {
  text: string;
  author: string;
  role?: string;
}

export function Quote({ text, author, role }: QuoteProps) {
  return (
    <blockquote className="quote-block">
      <p className="quote-text">{text}</p>
      <footer className="quote-author">
        — {author}{role && `, ${role}`}
      </footer>
    </blockquote>
  );
}
