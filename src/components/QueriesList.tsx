import { useState } from 'react';
import { Plus, X, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface QueriesListProps {
  queries: string[];
  currentSearchInput: string;
  onQuerySelect: (query: string) => void;
  onQueriesChange: (queries: string[]) => void;
}

export function QueriesList({
  queries,
  currentSearchInput,
  onQuerySelect,
  onQueriesChange,
}: QueriesListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newQuery, setNewQuery] = useState('');

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(queries[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updated = [...queries];
      updated[editingIndex] = editValue.trim();
      onQueriesChange(updated);
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const handleDelete = (index: number) => {
    const updated = queries.filter((_, i) => i !== index);
    onQueriesChange(updated);
  };

  const handleAddQuery = () => {
    if (newQuery.trim()) {
      onQueriesChange([...queries, newQuery.trim()]);
      setNewQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-border bg-muted/30">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-medium text-foreground">Queries to Try</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {queries.map((query, index) => (
          <div
            key={index}
            className={cn(
              'group flex items-center gap-1 rounded-md transition-colors',
              currentSearchInput === query
                ? 'bg-accent border border-primary/20'
                : 'hover:bg-accent'
            )}
          >
            {editingIndex === index ? (
              <div className="flex items-center gap-1 flex-1 p-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                  className="h-7 text-sm"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={handleSaveEdit}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <button
                  className="flex-1 text-left px-3 py-2 text-sm truncate"
                  onClick={() => onQuerySelect(query)}
                >
                  {query}
                </button>
                <div
                  className={cn(
                    'flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity',
                    currentSearchInput === query && 'opacity-100'
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-6 w-6',
                      currentSearchInput === query
                        ? 'hover:bg-accent-foreground/20'
                        : ''
                    )}
                    onClick={() => handleStartEdit(index)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-6 w-6',
                      currentSearchInput === query
                        ? 'hover:bg-accent-foreground/20'
                        : ''
                    )}
                    onClick={() => handleDelete(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-border">
        <div className="flex gap-1">
          <Input
            placeholder="Add query..."
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddQuery()}
            className="h-8 text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleAddQuery}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
