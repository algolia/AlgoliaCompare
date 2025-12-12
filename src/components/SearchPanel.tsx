import { useMemo, useState } from 'react';
import { InstantSearch, useHits, useSearchBox } from 'react-instantsearch';
import { Settings, X } from 'lucide-react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useTheme } from 'next-themes';
//import Editor from '@monaco-editor/react';
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
  cardMapping,
  onMappingChange,
}: {
  cardMapping: CardMapping;
  onMappingChange: (mapping: CardMapping) => void;
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
          onMappingChange={onMappingChange}
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

  const handleMappingChange = (mapping: CardMapping) => {
    onPanelChange({ ...panel, cardMapping: mapping });
  };

  const isConfigured = panel.appId && panel.apiKey && panel.indexName;

  return (
    <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
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

      <div className="flex-1 overflow-y-auto p-3">
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
              onMappingChange={handleMappingChange}
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
              <label className="text-sm font-medium mb-2 block">
                Query Parameters (JSON)
              </label>
              {/* <div className="border border-border rounded-md overflow-hidden">
                <Editor
                  height="200px"
                  defaultLanguage="json"
                  value={JSON.stringify(editPanel.queryParams, null, 2)}
                  onChange={(value) => {
                    if (value !== undefined) {
                      try {
                        const parsed = JSON.parse(value);
                        setEditPanel({ ...editPanel, queryParams: parsed });
                      } catch {
                        // Invalid JSON - keep the text but don't update queryParams
                      }
                    }
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                    tabSize: 2,
                    automaticLayout: true,
                  }}
                  theme={editorTheme}
                />
              </div> */}

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

