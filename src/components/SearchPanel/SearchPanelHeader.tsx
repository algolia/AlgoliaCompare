import { Settings, X } from 'lucide-react';
import { Stats } from 'react-instantsearch';
import { Button } from '@/components/ui/button';

interface SearchPanelHeaderProps {
  panelName: string;
  canRemove: boolean;
  onSettingsClick: () => void;
  onRemoveClick?: () => void;
  showStats?: boolean;
}

export function SearchPanelHeader({
  panelName,
  canRemove,
  onSettingsClick,
  onRemoveClick,
  showStats = false,
}: SearchPanelHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b border-border bg-muted/90">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground truncate">
          {panelName}
        </span>
        {showStats && (
          <Stats
            classNames={{
              root: 'text-xs text-muted-foreground',
            }}
            translations={{
              rootElementText({ nbHits }) {
                return `(${nbHits.toLocaleString()} ${nbHits === 1 ? 'result' : 'results'})`;
              },
            }}
          />
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4" />
        </Button>
        {canRemove && onRemoveClick && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onRemoveClick}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
