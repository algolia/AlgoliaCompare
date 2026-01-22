import { useHits } from 'react-instantsearch';
import { ProductCard } from '../ProductCard';
import { CardMapping } from '@/types/config';

interface SearchPanelHitsGridProps {
  cardMapping: CardMapping;
}

export function SearchPanelHitsGrid({ cardMapping }: SearchPanelHitsGridProps) {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        No results
      </div>
    );
  }

  const cols = cardMapping.columns ?? 4;

  const colsClass =
    cols === 2 ? "grid-cols-2" :
    cols === 3 ? "grid-cols-3" :
    "grid-cols-4";

  return (
    <div className={`grid ${colsClass} gap-3`}>
      {hits.map((hit) => (
        <ProductCard
          key={hit.objectID}
          hit={hit as Record<string, unknown>}
          cardMapping={cardMapping}
        />
      ))}
    </div>
  );
}
