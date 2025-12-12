import { useState, useRef, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  const [editorHeights, setEditorHeights] = useState<Record<string, number>>({});
  const [importEditorHeight, setImportEditorHeight] = useState(100);
  const resizeRefs = useRef<Record<string, { startY: number; startHeight: number }>>({});
  const importResizeRef = useRef<{ startY: number; startHeight: number } | null>(null);

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

  // Extract and count characters after ?config=
  const getConfigParamLength = (): number => {
    try {
      const url = new URL(shareableUrl);
      const configParam = url.searchParams.get('config');
      return configParam ? configParam.length : 0;
    } catch {
      // If shareableUrl is not a valid URL, try to extract manually
      const match = shareableUrl.match(/[?&]config=([^&]*)/);
      return match ? match[1].length : 0;
    }
  };

  const configParamLength = getConfigParamLength();
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

  const handleImportResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = importEditorHeight;
    importResizeRef.current = { startY, startHeight };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(100, Math.min(800, startHeight + deltaY));
      setImportEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      importResizeRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
                      <div className="border border-border rounded-md overflow-hidden relative">
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Import Configuration
            </label>
            <div className="border border-border rounded-md overflow-hidden relative">
              <Editor
                height={`${importEditorHeight}px`}
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
                onMouseDown={handleImportResizeStart}
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
