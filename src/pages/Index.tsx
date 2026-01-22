import { useState } from 'react';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/SettingsModal';
import { QueriesList } from '@/components/QueriesList';
import { SearchArea } from '@/components/SearchArea';
import { useConfigStore } from '@/hooks/useConfigStore';
import { createDefaultPanel } from '@/types/config';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState('');
  const [currentSearchInput, setCurrentSearchInput] = useState('');
  const [queryToSetAndSubmit, setQueryToSetAndSubmit] = useState<{ query: string; trigger: number } | null>(null);
  
  const {
    configs,
    activeConfig,
    activeConfigId,
    setActiveConfigId,
    updateActiveConfig,
    addConfig,
    deleteConfig,
    importConfig,
    getShareableUrl,
    updateConfig,
  } = useConfigStore();

  // Ensure we have at least 2 panels
  const panels = activeConfig?.panels?.length >= 2 
    ? activeConfig.panels 
    : [createDefaultPanel(), createDefaultPanel()];

  const handleQueriesChange = (queries: string[]) => {
    updateActiveConfig({ queries });
  };

  const handlePanelsChange = (panels: typeof activeConfig.panels) => {
    updateActiveConfig({ panels });
  };

  const handleQuerySelect = (query: string) => {
    // Set the query to be submitted (one-way, not locked)
    // Use a trigger counter to ensure each click is unique
    setQueryToSetAndSubmit({ query, trigger: Date.now() });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onSettingsClick={() => setSettingsOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane - Queries */}
        <div className="w-96 shrink-0">
          <QueriesList
            queries={activeConfig?.queries || []}
            currentSearchInput={currentSearchInput}
            onQuerySelect={handleQuerySelect}
            onQueriesChange={handleQueriesChange}
          />
        </div>

        {/* Right Pane - Search */}
        <div className="flex-1 overflow-hidden">
          <SearchArea
            panels={panels}
            onPanelsChange={handlePanelsChange}
            externalQuery={activeQuery}
            onQueryChange={setActiveQuery}
            onCurrentInputChange={setCurrentSearchInput}
            queryToSetAndSubmit={queryToSetAndSubmit}
          />
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        configs={configs}
        activeConfigId={activeConfigId}
        onSelectConfig={setActiveConfigId}
        onUpdateConfig={updateConfig}
        onAddConfig={addConfig}
        onDeleteConfig={deleteConfig}
        onImportConfig={importConfig}
        shareableUrl={getShareableUrl()}
      />
    </div>
  );
};

export default Index;
