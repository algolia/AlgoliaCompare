import { useState, useRef } from 'react';
import { Plus, Trash2, Check, Copy, Upload, HelpCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
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
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AppConfig } from '@/types/config';
import { useResizableEditor } from '@/hooks/useResizableEditor';
import { copyUrlToClipboard, getConfigParamLength } from '@/utils/shareableUrl';

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
  const [editorHeights, setEditorHeights] = useState<Record<string, number>>({});
  const resizeRefs = useRef<Record<string, { startY: number; startHeight: number }>>({});

  // Use custom hook for import editor resize
  const importEditor = useResizableEditor(250);

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
    await copyUrlToClipboard(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const configParamLength = getConfigParamLength(shareableUrl);
  const maxLength = 2000;

  const getCountColor = (): string => {
    if (configParamLength < 1500) return 'text-green-600';
    if (configParamLength < 1800) return 'text-yellow-600';
    if (configParamLength < maxLength) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleJsonChange = (configId: string, json: string) => {
    try {
      const parsed = JSON.parse(json);
      onUpdateConfig(configId, parsed);
    } catch {
      // Invalid JSON, don't update
    }
  };

  const getEditorHeight = (configId: string): number => {
    return editorHeights[configId] || 200;
  };

  const handleResizeStart = (configId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = getEditorHeight(configId);
    resizeRefs.current[configId] = { startY, startHeight };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(100, Math.min(800, startHeight + deltaY));
      setEditorHeights((prev) => ({ ...prev, [configId]: newHeight }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      delete resizeRefs.current[configId];
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
          {/* Share URL */}
          <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-foreground">
                Shareable URL
              </label>
            </div>
            <div className="flex gap-2">
              <Input
                value={shareableUrl}
                readOnly
                className="flex-1 text-xs font-mono bg-background"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${getCountColor()}`}>
                {configParamLength}/{maxLength}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" align="start" sideOffset={6} className="max-w-xs">
                    <p>Shareable URLs can't exceed 2000 characters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Configurations */}
          <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Configurations
              </label>
              <Button variant="outline" size="sm" onClick={() => onAddConfig()} className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Configuration
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {configs.map((config) => (
                <AccordionItem 
                  key={config.id} 
                  value={config.id}
                  className="border rounded-lg px-3 mb-2 bg-background/50"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span
                        className={
                          config.id === activeConfigId
                            ? 'font-semibold text-primary'
                            : 'font-medium'
                        }
                      >
                        {config.name}
                      </span>
                      {config.id === activeConfigId && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-3">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectConfig(config.id)}
                          disabled={config.id === activeConfigId}
                          className="flex-1"
                        >
                          Set Active
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${config.name}"? This action cannot be undone.`)) {
                              onDeleteConfig(config.id);
                            }
                          }}
                          className="gap-1.5"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                      <div className="border border-border rounded-md overflow-hidden relative bg-background">
                        <Editor
                          height={`${getEditorHeight(config.id)}px`}
                          defaultLanguage="json"
                          value={JSON.stringify(config, null, 2)}
                          onChange={(value) => {
                            if (value !== undefined) {
                              handleJsonChange(config.id, value);
                            }
                          }}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                            formatOnPaste: true,
                            formatOnType: true,
                            tabSize: 2,
                            automaticLayout: true,
                          }}
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-border/50 transition-colors group"
                          onMouseDown={(e) => handleResizeStart(config.id, e)}
                          style={{
                            background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0,0,0,0.1) 50%, transparent 60%, transparent 100%)',
                          }}
                        >
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                            <div className="h-0.5 w-12 bg-border group-hover:bg-border/80 transition-colors rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Import */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem 
              value="import"
              className="border rounded-lg px-3 bg-background/50"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <label className="text-sm font-semibold text-foreground">
                  Import Configuration
                </label>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-3">
                <div className="space-y-3">
                  <div className="border border-border rounded-md overflow-hidden relative bg-background">
                    <Editor
                      height={`${importEditor.height}px`}
                      defaultLanguage="json"
                      value={importJson}
                      onChange={(value) => {
                        setImportJson(value || '');
                        setImportError('');
                      }}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 12,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        formatOnPaste: true,
                        formatOnType: true,
                        tabSize: 2,
                        automaticLayout: true,
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-border/50 transition-colors group"
                      onMouseDown={importEditor.handleMouseDown}
                      style={{
                        background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0,0,0,0.1) 50%, transparent 60%, transparent 100%)',
                      }}
                    >
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                        <div className="h-0.5 w-12 bg-border group-hover:bg-border/80 transition-colors rounded" />
                      </div>
                    </div>
                  </div>
                  {importError && (
                    <p className="text-sm text-destructive font-medium bg-destructive/10 px-3 py-2 rounded-md border border-destructive/20">
                      {importError}
                    </p>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleImport}
                    disabled={!importJson}
                    className="w-full gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    Import Configuration
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
