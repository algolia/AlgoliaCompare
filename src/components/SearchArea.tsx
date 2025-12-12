import { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchPanel } from './SearchPanel';
import { SearchPanel as SearchPanelType, createDefaultPanel } from '@/types/config';

interface SearchAreaProps {
  panels: SearchPanelType[];
  onPanelsChange: (panels: SearchPanelType[]) => void;
  externalQuery: string;
  onQueryChange: (query: string) => void;
  onCurrentInputChange?: (input: string) => void;
  queryToSetAndSubmit?: { query: string; trigger: number } | null;
}

export function SearchArea({
  panels,
  onPanelsChange,
  externalQuery,
  onQueryChange,
  onCurrentInputChange,
  queryToSetAndSubmit,
}: SearchAreaProps) {
  const [localQuery, setLocalQuery] = useState(externalQuery);
  const prevQueryToSetRef = useRef<number | null>(null);

  const handleAddPanel = () => {
    if (panels.length < 4) {
      onPanelsChange([...panels, createDefaultPanel()]);
    }
  };

  const handleRemovePanel = (index: number) => {
    if (panels.length > 2) {
      onPanelsChange(panels.filter((_, i) => i !== index));
    }
  };

  const handlePanelChange = (index: number, updatedPanel: SearchPanelType) => {
    const updated = [...panels];
    updated[index] = updatedPanel;
    onPanelsChange(updated);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onQueryChange(localQuery);
  };

  // Expose current input value to parent for highlighting
  useEffect(() => {
    if (onCurrentInputChange) {
      onCurrentInputChange(localQuery);
    }
  }, [localQuery, onCurrentInputChange]);

  // Handle programmatic query set and submit (from QueriesList)
  useEffect(() => {
    if (queryToSetAndSubmit !== undefined && queryToSetAndSubmit !== null && queryToSetAndSubmit.trigger !== prevQueryToSetRef.current) {
      prevQueryToSetRef.current = queryToSetAndSubmit.trigger;
      setLocalQuery(queryToSetAndSubmit.query);
      onQueryChange(queryToSetAndSubmit.query);
    }
  }, [queryToSetAndSubmit, onQueryChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search..."
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
          {panels.length < 4 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddPanel}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Panel
            </Button>
          )}
        </form>
      </div>

      {/* Panels Grid */}
      <div className="flex-1 overflow-hidden p-4">
        <div
          className="grid h-full gap-4"
          style={{
            gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))`,
          }}
        >
          {panels.map((panel, index) => (
            <SearchPanel
              key={panel.id}
              panel={panel}
              query={externalQuery}
              onPanelChange={(updated) => handlePanelChange(index, updated)}
              onRemove={() => handleRemovePanel(index)}
              canRemove={panels.length > 2}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
