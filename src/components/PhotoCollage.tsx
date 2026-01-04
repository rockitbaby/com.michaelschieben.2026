interface PhotoCollageProps {
  images: {
    src: string;
    alt: string;
  }[];
  layout?: 'asymmetric' | 'grid' | 'stacked';
}

export function PhotoCollage({ images, layout = 'asymmetric' }: PhotoCollageProps) {
  if (images.length === 0) return null;

  const layoutClasses = {
    asymmetric: 'photo-collage asymmetric',
    grid: 'photo-collage grid-cols-2 md:grid-cols-3',
    stacked: 'photo-collage grid-cols-1',
  };

  return (
    <div className={layoutClasses[layout]}>
      {images.map((image, index) => (
        <div 
          key={index}
          className="relative overflow-hidden rounded-sm bg-muted aspect-[4/3]"
        >
          {/* Placeholder with abstract pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-muted to-accent flex items-center justify-center">
              <span className="font-mono text-xs text-muted-foreground">
                {image.alt || `image-${index + 1}`}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
