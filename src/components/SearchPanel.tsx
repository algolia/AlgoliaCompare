import { useMemo, useState } from 'react';
import { InstantSearch, useHits, useSearchBox } from 'react-instantsearch';
import { Settings, X } from 'lucide-react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useTheme } from 'next-themes';
import SearchParamsEditor from './SearchParamsEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductCard } from './ProductCard';
import { SearchPanel as SearchPanelType, CardMapping } from '@/types/config';

interface SearchPanelProps {
  panel: SearchPanelType;
  query: string;
  onPanelChange: (panel: SearchPanelType) => void;
  onRemove?: () => void;
  canRemove: boolean;
}


function HitsGrid({
  cardMapping
}: {
  cardMapping: CardMapping;
}) {
  const { hits } = useHits();

  if (hits.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        No results
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
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

function SearchInput({ externalQuery }: { externalQuery: string }) {
  const { refine } = useSearchBox();

  useMemo(() => {
    refine(externalQuery);
  }, [externalQuery, refine]);

  return null;
}

export function SearchPanel({
  panel,
  query,
  onPanelChange,
  onRemove,
  canRemove,
}: SearchPanelProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editPanel, setEditPanel] = useState(panel);
  const { resolvedTheme } = useTheme();

  // Fallback to check document class if theme is not available
  const editorTheme = useMemo(() => {
    if (resolvedTheme === 'dark') return 'vs-dark';
    if (resolvedTheme === 'light') return 'vs-light';
    // Fallback: check document class
    return document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light';
  }, [resolvedTheme]);

  const searchClient = useMemo(() => {
    if (!panel.appId || !panel.apiKey) return null;
    return algoliasearch(panel.appId, panel.apiKey);
  }, [panel.appId, panel.apiKey]);

  const handleSaveSettings = () => {
    onPanelChange(editPanel);
    setSettingsOpen(false);
  };

  const isConfigured = panel.appId && panel.apiKey && panel.indexName;

  return (
    <div className="flex flex-col h-full border-r bg-card">
      <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b border-border bg-muted/90">
        <span className="text-sm font-medium text-foreground truncate">
          {panel.name}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              setEditPanel(panel);
              setSettingsOpen(true);
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
          {canRemove && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-3">
        {!isConfigured ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Configure Algolia connection
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditPanel(panel);
                setSettingsOpen(true);
              }}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        ) : searchClient ? (
          <InstantSearch
            searchClient={searchClient}
            indexName={panel.indexName}
            future={{ preserveSharedStateOnUnmount: true }}
          >
            <SearchInput externalQuery={query} />
            <HitsGrid
              cardMapping={panel.cardMapping}
            //onMappingChange={handleMappingChange}
            />
          </InstantSearch>
        ) : null}
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Panel Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Panel Name</label>
              <Input
                value={editPanel.name}
                onChange={(e) =>
                  setEditPanel({ ...editPanel, name: e.target.value })
                }
                placeholder="Production"
              />
            </div>
            <div>
              <label className="text-sm font-medium">App ID</label>
              <Input
                value={editPanel.appId}
                onChange={(e) =>
                  setEditPanel({ ...editPanel, appId: e.target.value })
                }
                placeholder="Your Algolia App ID"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Search API Key</label>
              <Input
                value={editPanel.apiKey}
                onChange={(e) =>
                  setEditPanel({ ...editPanel, apiKey: e.target.value })
                }
                placeholder="Search-only API Key"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Index Name</label>
              <Input
                value={editPanel.indexName}
                onChange={(e) =>
                  setEditPanel({ ...editPanel, indexName: e.target.value })
                }
                placeholder="products"
              />
            </div>
            <div>
              <label className="text-sm font-medium block">
                Card Display
              </label>


              <div className="pb-3 px-3">
                <div>
                  <label className="text-xs text-muted-foreground">Image field</label>
                  <Input
                    value={editPanel.cardMapping.image}
                    onChange={(e) =>
                      setEditPanel({ ...editPanel, cardMapping: { ...editPanel.cardMapping, image: e.target.value } })
                    }
                    className="h-7 text-xs"
                    placeholder="e.g., image_url"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Image Prefix</label>
                  <Input
                    value={editPanel.cardMapping.imagePrefix}
                    onChange={(e) =>
                      setEditPanel({ ...editPanel, cardMapping: { ...editPanel.cardMapping, imagePrefix: e.target.value } })
                    }
                    className="h-7 text-xs"
                    placeholder="e.g., https://..."
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Image Suffix</label>
                  <Input
                    value={editPanel.cardMapping.imageSuffix}
                    onChange={(e) =>
                      setEditPanel({ ...editPanel, cardMapping: { ...editPanel.cardMapping, imageSuffix: e.target.value } })
                    }
                    className="h-7 text-xs"
                    placeholder="e.g., .png, .jpg..."
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Title field</label>
                  <Input
                    value={editPanel.cardMapping.title ?? ''}
                    onChange={(e) =>
                      setEditPanel({ ...editPanel, cardMapping: { ...editPanel.cardMapping, title: e.target.value } })
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
                    value={editPanel.cardMapping.subtitle ?? ''}
                    onChange={(e) =>
                      setEditPanel({ ...editPanel, cardMapping: { ...editPanel.cardMapping, subtitle: e.target.value } })
                    }
                    className="h-7 text-xs"
                    placeholder="e.g., brand"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Query Parameters (JSON)
              </label>
              <SearchParamsEditor editPanel={editPanel} setEditPanel={setEditPanel} editorTheme={editorTheme} />
            </div>
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

