import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardMapping } from '@/types/config';

interface ProductCardProps {
  hit: Record<string, unknown>;
  cardMapping: CardMapping;
  onMappingChange?: (mapping: CardMapping) => void;
}

export function ProductCard({
  hit,
  cardMapping,
  onMappingChange,
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMapping, setEditMapping] = useState(cardMapping);

  const getValue = (key: string): string => {
    const value = hit[key];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value[0] || '';
    return '';
  };

  const imageUrl = (cardMapping.imagePrefix || '') + getValue(cardMapping.image) + (cardMapping.imageSuffix || '');
  const title = getValue(cardMapping.title);
  const subtitle = getValue(cardMapping.subtitle);

  const handleSave = () => {
    onMappingChange?.(editMapping);
    setIsEditing(false);
  };

  return (
    <div className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {onMappingChange && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm z-10"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <Check className="h-3 w-3" onClick={handleSave} />
          ) : (
            <Pencil className="h-3 w-3" />
          )}
        </Button>
      )}

      {isEditing ? (
        <div className="p-3 space-y-2">
          <div>
            <label className="text-xs text-muted-foreground">Image field</label>
            <Input
              value={editMapping.image}
              onChange={(e) =>
                setEditMapping({ ...editMapping, image: e.target.value })
              }
              className="h-7 text-xs"
              placeholder="e.g., image_url"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Image Prefix</label>
            <Input
              value={editMapping.imagePrefix}
              onChange={(e) =>
                setEditMapping({ ...editMapping, imagePrefix: e.target.value })
              }
              className="h-7 text-xs"
              placeholder="e.g., https://..."
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Image Suffix</label>
            <Input
              value={editMapping.imageSuffix}
              onChange={(e) =>
                setEditMapping({ ...editMapping, imageSuffix: e.target.value })
              }
              className="h-7 text-xs"
              placeholder="e.g., .png, .jpg..."
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Title field</label>
            <Input
              value={editMapping.title}
              onChange={(e) =>
                setEditMapping({ ...editMapping, title: e.target.value })
              }
              className="h-7 text-xs"
              placeholder="e.g., name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Subtitle field
            </label>
            <Input
              value={editMapping.subtitle}
              onChange={(e) =>
                setEditMapping({ ...editMapping, subtitle: e.target.value })
              }
              className="h-7 text-xs"
              placeholder="e.g., brand"
            />
          </div>
          <Button size="sm" className="w-full" onClick={handleSave}>
            Save Mapping
          </Button>
        </div>
      ) : (
        <>
          <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
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
        </>
      )}
    </div>
  );
}
