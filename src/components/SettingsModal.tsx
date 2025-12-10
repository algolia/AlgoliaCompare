import { useState } from 'react';
import { Plus, Trash2, Check, Copy, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AppConfig } from '@/types/config';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configs: AppConfig[];
  activeConfigId: string | null;
  onSelectConfig: (id: string) => void;
  onUpdateConfig: (id: string, config: Partial<AppConfig>) => void;
  onAddConfig: () => void;
  onDeleteConfig: (id: string) => void;
  onImportConfig: (json: string) => { success: boolean; error?: string };
  shareableUrl: string;
}

export function SettingsModal({
  open,
  onOpenChange,
  configs,
  activeConfigId,
  onSelectConfig,
  onUpdateConfig,
  onAddConfig,
  onDeleteConfig,
  onImportConfig,
  shareableUrl,
}: SettingsModalProps) {
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleImport = () => {
    const result = onImportConfig(importJson);
    if (result.success) {
      setImportJson('');
      setImportError('');
    } else {
      setImportError(result.error || 'Import failed');
    }
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonChange = (configId: string, json: string) => {
    try {
      const parsed = JSON.parse(json);
      onUpdateConfig(configId, parsed);
    } catch {
      // Invalid JSON, don't update
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuration Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Shareable URL
            </label>
            <div className="flex gap-2">
              <Input
                value={shareableUrl}
                readOnly
                className="flex-1 text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Configurations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Configurations
              </label>
              <Button variant="outline" size="sm" onClick={onAddConfig}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {configs.map((config) => (
                <AccordionItem key={config.id} value={config.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          config.id === activeConfigId
                            ? 'font-semibold text-primary'
                            : ''
                        }
                      >
                        {config.name}
                      </span>
                      {config.id === activeConfigId && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectConfig(config.id)}
                          disabled={config.id === activeConfigId}
                        >
                          Set Active
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteConfig(config.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        className="font-mono text-xs min-h-[200px]"
                        value={JSON.stringify(config, null, 2)}
                        onChange={(e) =>
                          handleJsonChange(config.id, e.target.value)
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Import */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Import Configuration
            </label>
            <Textarea
              placeholder="Paste JSON configuration here..."
              className="font-mono text-xs min-h-[100px]"
              value={importJson}
              onChange={(e) => {
                setImportJson(e.target.value);
                setImportError('');
              }}
            />
            {importError && (
              <p className="text-sm text-destructive">{importError}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              disabled={!importJson}
            >
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
