import SearchParamsEditor from '../SearchParamsEditor';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchPanel } from '@/types/config';
import { CopySettingsDropdown } from './CopySettingsDropdown';

interface SearchPanelSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panel: SearchPanel;
  allPanels: SearchPanel[];
  editorTheme: string;
  onPanelChange: (panel: SearchPanel) => void;
  onCopySettings: (sourcePanelId: string) => void;
}

export function SearchPanelSettings({
  open,
  onOpenChange,
  panel,
  allPanels,
  editorTheme,
  onPanelChange,
  onCopySettings,
}: SearchPanelSettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Panel Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <CopySettingsDropdown
            currentPanelId={panel.id}
            currentPanelName={panel.name}
            allPanels={allPanels}
            onCopySettings={onCopySettings}
          />

          <div>
            <label className="text-sm font-medium">Panel Name</label>
            <Input
              value={panel.name}
              onChange={(e) =>
                onPanelChange({ ...panel, name: e.target.value })
              }
              placeholder="Production"
            />
          </div>
          <div>
            <label className="text-sm font-medium">App ID</label>
            <Input
              value={panel.appId}
              onChange={(e) =>
                onPanelChange({ ...panel, appId: e.target.value })
              }
              placeholder="Your Algolia App ID"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Search API Key</label>
            <Input
              value={panel.apiKey}
              onChange={(e) =>
                onPanelChange({ ...panel, apiKey: e.target.value })
              }
              placeholder="Search-only API Key"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Index Name</label>
            <Input
              value={panel.indexName}
              onChange={(e) =>
                onPanelChange({ ...panel, indexName: e.target.value })
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
                  value={panel.cardMapping.image}
                  onChange={(e) =>
                    onPanelChange({ ...panel, cardMapping: { ...panel.cardMapping, image: e.target.value } })
                  }
                  className="h-7 text-xs"
                  placeholder="e.g., image_url"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Image Prefix</label>
                <Input
                  value={panel.cardMapping.imagePrefix}
                  onChange={(e) =>
                    onPanelChange({ ...panel, cardMapping: { ...panel.cardMapping, imagePrefix: e.target.value } })
                  }
                  className="h-7 text-xs"
                  placeholder="e.g., https://..."
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Image Suffix</label>
                <Input
                  value={panel.cardMapping.imageSuffix}
                  onChange={(e) =>
                    onPanelChange({ ...panel, cardMapping: { ...panel.cardMapping, imageSuffix: e.target.value } })
                  }
                  className="h-7 text-xs"
                  placeholder="e.g., .png, .jpg..."
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Title field</label>
                <Input
                  value={panel.cardMapping.title ?? ''}
                  onChange={(e) =>
                    onPanelChange({ ...panel, cardMapping: { ...panel.cardMapping, title: e.target.value } })
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
                  value={panel.cardMapping.subtitle ?? ''}
                  onChange={(e) =>
                    onPanelChange({ ...panel, cardMapping: { ...panel.cardMapping, subtitle: e.target.value } })
                  }
                  className="h-7 text-xs"
                  placeholder="e.g., brand"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Columns
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">
                    {panel.cardMapping.columns || 4}
                  </span>
                  <Slider
                    value={[panel.cardMapping.columns || 4]}
                    onValueChange={(value) =>
                      onPanelChange({
                        ...panel,
                        cardMapping: {
                          ...panel.cardMapping,
                          columns: value[0]
                        }
                      })
                    }
                    min={2}
                    max={4}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Query Parameters (JSON)
            </label>
            <SearchParamsEditor panel={panel} onPanelChange={onPanelChange} editorTheme={editorTheme} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
