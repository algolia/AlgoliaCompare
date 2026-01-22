import { useMemo, useState } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch';
import { Settings } from 'lucide-react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SearchPanel as SearchPanelType } from '@/types/config';
import { SearchPanelHeader } from './SearchPanel/SearchPanelHeader';
import { SearchPanelSettings } from './SearchPanel/SearchPanelSettings';
import { SearchPanelHitsGrid } from './SearchPanel/SearchPanelHitsGrid';
import { SearchInput } from './SearchPanel/SearchInput';

interface SearchPanelProps {
  panel: SearchPanelType;
  allPanels: SearchPanelType[];
  query: string;
  onPanelChange: (panel: SearchPanelType) => void;
  onRemove?: () => void;
  canRemove: boolean;
}

export function SearchPanel({
  panel,
  allPanels,
  query,
  onPanelChange,
  onRemove,
  canRemove,
}: SearchPanelProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
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

  const handleCopySettings = (sourcePanelId: string) => {
    const sourcePanel = allPanels.find(p => p.id === sourcePanelId);
    if (!sourcePanel) return;

    onPanelChange({
      ...panel,
      appId: sourcePanel.appId,
      apiKey: sourcePanel.apiKey,
      indexName: sourcePanel.indexName,
      queryParams: { ...sourcePanel.queryParams },
      cardMapping: { ...sourcePanel.cardMapping },
    });
  };

  const isConfigured = panel.appId && panel.apiKey && panel.indexName;

  return (
    <div className="flex flex-col h-full border-r bg-card">
      <SearchPanelHeader
        panelName={panel.name}
        canRemove={canRemove}
        onSettingsClick={() => setSettingsOpen(true)}
        onRemoveClick={onRemove}
      />

      <div className="flex-1 p-3 px-[10%]">
        {!isConfigured ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Configure Algolia connection
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(true)}
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
            <Configure {...panel.queryParams}></Configure>
            <SearchInput externalQuery={query} />
            <SearchPanelHitsGrid cardMapping={panel.cardMapping} />
          </InstantSearch>
        ) : null}
      </div>

      <SearchPanelSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        panel={panel}
        allPanels={allPanels}
        editorTheme={editorTheme}
        onPanelChange={onPanelChange}
        onCopySettings={handleCopySettings}
      />
    </div>
  );
}