import { useState, useEffect, useCallback } from 'react';
import { 
  Download, 
  Trash2, 
  Sparkles, 
  Archive, 
  CheckCircle2, 
  FolderPlus,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import {
  ProcessedFileItem,
  ToolDefinition
} from '../../types';
import {
  readImageFile,
  formatBytes,
  downloadAllAsZip
} from '../../utils/imageProcessor';
import { getToolModule } from '../../modules';
import { useI18n } from '../../i18n/context';
import { ToolHeader } from './ToolHeader';
import { UploadZone } from './UploadZone';
import { FileList } from './FileList';
import { ComparisonModal } from './ComparisonModal';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  onBack: () => void;
  initialFiles?: File[];
}

export function ToolWorkspace({ tool, onBack, initialFiles = [] }: ToolWorkspaceProps) {
  const [items, setItems] = useState<ProcessedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inspectingItem, setInspectingItem] = useState<ProcessedFileItem | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const { t } = useI18n();

  // Resolve the registered module for the current tool
  const toolModule = getToolModule(tool.id) ?? getToolModule('compress')!;

  // Tool options, initialized from the module's defaults
  const [options, setOptions] = useState(toolModule.defaultOptions);

  // Process a batch of items
  const processItems = useCallback(
    async (itemsToProcess: ProcessedFileItem[]) => {
      setIsProcessing(true);

      for (const item of itemsToProcess) {
        // Mark as processing
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'processing' } : it))
        );

        try {
          const res = await toolModule.processor(item, options);
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? {
                    ...it,
                    status: 'done',
                    resultBlob: res.blob,
                    resultUrl: res.url,
                    resultSize: res.size,
                    resultWidth: res.width,
                    resultHeight: res.height,
                    resultType: res.format,
                    savedPercentage: res.savedPercentage,
                  }
                : it
            )
          );
        } catch (err: any) {
          console.error('Processing error on file:', item.name, err);
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? {
                    ...it,
                    status: 'error',
                    errorMessage: err.message || 'Processing failed',
                  }
                : it
            )
          );
        }
      }

      setIsProcessing(false);
    },
    [toolModule, options]
  );

  // Handle incoming new files
  const handleFilesSelected = async (files: File[]) => {
    const newItems: ProcessedFileItem[] = [];

    for (const file of files) {
      try {
        const { previewUrl, width, height } = await readImageFile(file);
        const item: ProcessedFileItem = {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          originalSize: file.size,
          originalWidth: width,
          originalHeight: height,
          originalType: file.type || 'image/jpeg',
          previewUrl,
          status: 'idle',
          progress: 0,
          resultBlob: null,
          resultUrl: null,
          resultSize: null,
          resultWidth: null,
          resultHeight: null,
          resultType: null,
          savedPercentage: null,
        };
        newItems.push(item);
      } catch (err) {
        console.error('Failed reading file:', file.name, err);
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      // Auto-trigger processing
      processItems(newItems);
    }
  };

  // Process initial files passed from Home
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0 && items.length === 0) {
      handleFilesSelected(initialFiles);
    }
  }, [initialFiles]);

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.resultUrl) URL.revokeObjectURL(target.resultUrl);
      return prev.filter((it) => it.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((it) => {
      if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
      if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
    });
    setItems([]);
  };

  const handleReprocessAll = () => {
    processItems(items);
  };

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      await downloadAllAsZip(items, `${tool.id}-optimized-images.zip`);
    } catch (err) {
      console.error('Failed creating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Stats calculation
  const totalOriginalSize = items.reduce((sum, it) => sum + it.originalSize, 0);
  const completedItems = items.filter((it) => it.status === 'done' && it.resultSize !== null);
  const totalResultSize = completedItems.reduce((sum, it) => sum + (it.resultSize || 0), 0);
  const totalSavedBytes = totalOriginalSize - totalResultSize;
  const overallSavedPercentage =
    totalOriginalSize > 0 && completedItems.length === items.length
      ? Math.round((totalSavedBytes / totalOriginalSize) * 100)
      : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-stone-50/50 dark:bg-stone-950/50 transition-colors">
      {/* Tool Header */}
      <ToolHeader tool={tool} onBack={onBack} fileCount={items.length} />

      {/* Main Workspace Area */}
      <div className="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full">
        {items.length === 0 ? (
          /* Empty State: Centered DropZone */
          <div className="max-w-2xl mx-auto my-8">
            <UploadZone
              onFilesSelected={handleFilesSelected}
              acceptedFormats={tool.acceptedFormats}
            />
          </div>
        ) : (
          /* Active Workspace: Two column layout on Desktop, stacked on Mobile */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (8 cols): File List & Upload more */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Batch Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-xs">
                <div className="flex items-center gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-stone-400 dark:text-stone-500">{t('workspace.totalOriginal')}</span>{' '}
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{formatBytes(totalOriginalSize)}</span>
                  </div>

                  {completedItems.length > 0 && (
                    <>
                      <span className="text-stone-400 dark:text-stone-600">→</span>
                      <div>
                        <span className="text-stone-400 dark:text-stone-500">{t('workspace.totalResult')}</span>{' '}
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400">{formatBytes(totalResultSize)}</span>
                      </div>
                    </>
                  )}

                  {overallSavedPercentage !== null && overallSavedPercentage > 0 && (
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      {t('workspace.percentSmaller', { percent: overallSavedPercentage })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex items-center gap-1 rounded-lg border border-stone-200 dark:border-stone-700 px-2.5 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('workspace.clearAll')}</span>
                  </button>
                </div>
              </div>

              {/* Render File List */}
              <FileList
                items={items}
                toolId={tool.id}
                onRemove={handleRemoveItem}
                onInspect={(item) => setInspectingItem(item)}
              />

              {/* Compact DropZone to add more files */}
              <UploadZone
                isCompact
                onFilesSelected={handleFilesSelected}
                acceptedFormats={tool.acceptedFormats}
              />
            </div>

            {/* Right Column (4 cols): Settings & Action Panel */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              {/* Settings panel resolved from the tool module registry */}
              <toolModule.SettingsPanel
                options={options}
                onChange={setOptions}
                onApply={handleReprocessAll}
                isProcessing={isProcessing}
                itemCount={items.length}
                representativeItem={items[0]}
              />

              {/* Bulk Download Panel */}
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {t('workspace.batchOperations')}
                </h4>

                <button
                  type="button"
                  id="btn-download-all-zip"
                  disabled={completedItems.length === 0 || isZipping}
                  onClick={handleDownloadAllZip}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 dark:bg-stone-100 py-3 text-xs font-bold text-white dark:text-stone-900 shadow-xs hover:bg-stone-800 dark:hover:bg-white disabled:opacity-40 transition-colors"
                >
                  <Archive className="h-4 w-4" />
                  <span>
                    {isZipping 
                      ? t('workspace.generatingZip') 
                      : t('workspace.downloadZip', { count: completedItems.length })}
                  </span>
                </button>

                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    {t('workspace.archiveBuiltOnDevice')}
                  </span>
                  <span>
                    {t('workspace.readyCount', { ready: completedItems.length, total: items.length })}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* Before / After Inspection Modal */}
      {inspectingItem && (
        <ComparisonModal
          item={inspectingItem}
          onClose={() => setInspectingItem(null)}
        />
      )}
    </div>
  );
}

