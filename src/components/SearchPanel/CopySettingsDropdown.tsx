import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchPanel } from '@/types/config';

interface CopySettingsDropdownProps {
  currentPanelId: string;
  currentPanelName: string;
  allPanels: SearchPanel[];
  onCopySettings: (sourcePanelId: string) => void;
}

export function CopySettingsDropdown({
  currentPanelId,
  currentPanelName,
  allPanels,
  onCopySettings,
}: CopySettingsDropdownProps) {
  const [selectedCopyFromId, setSelectedCopyFromId] = useState<string>('');

  const otherPanels = allPanels.filter(p => p.id !== currentPanelId);

  if (otherPanels.length === 0) {
    return null;
  }

  const handleCopy = (sourcePanelId: string) => {
    const sourcePanel = allPanels.find(p => p.id === sourcePanelId);
    if (!sourcePanel) return;

    const confirmed = window.confirm(
      `Copy all settings from "${sourcePanel.name}"? This will overwrite your current panel configuration (except the panel name).`
    );

    if (confirmed) {
      onCopySettings(sourcePanelId);
      setSelectedCopyFromId('');
    }
  };

  return (
    <div className="border border-border rounded-md p-3 bg-muted/30">
      <label className="text-sm font-medium mb-2 block">
        Copy Settings from Another Panel
      </label>

      {otherPanels.length === 1 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCopy(otherPanels[0].id)}
          className="w-full"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy from "{otherPanels[0].name}"
        </Button>
      ) : (
        <div className="flex gap-2">
          <Select
            value={selectedCopyFromId}
            onValueChange={setSelectedCopyFromId}
          >
            <SelectTrigger className="flex-1 h-9">
              <SelectValue placeholder="Select a panel..." />
            </SelectTrigger>
            <SelectContent>
              {otherPanels.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedCopyFromId) {
                handleCopy(selectedCopyFromId);
              }
            }}
            disabled={!selectedCopyFromId}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-2">
        This will copy all settings except the panel name
      </p>
    </div>
  );
}
