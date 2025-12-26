import { useState, useEffect } from 'react';
import { CardMapping } from '@/types/config';

interface ProductCardProps {
  hit: Record<string, unknown>;
  cardMapping: CardMapping;
}

export function ProductCard({
  hit,
  cardMapping,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const getValue = (path: string): string => {
    // Resolve nested attribute: "sku._id" -> hit.sku._id
    const raw = path
      .split('.')
      .reduce<any>((obj, key) => (obj != null ? obj[key] : undefined), hit);
  
    const value = Array.isArray(raw) ? raw[0] : raw;
  
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
  };

  const imageUrl = (cardMapping.imagePrefix || '') + getValue(cardMapping.image) + (cardMapping.imageSuffix || '');
  const title = getValue(cardMapping.title);
  const subtitle = getValue(cardMapping.subtitle);

  useEffect(() => {
    // Whenever imageUrl changes, reset error so we try loading again
    setImageError(false);
  }, [imageUrl]);

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-xs text-muted-foreground">No image</span>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm text-foreground truncate">
              {title || 'No title'}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {subtitle || 'No subtitle'}
            </p>
          </div>
    </div>
  );
}
