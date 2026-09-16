import { 
  Download, 
  Trash2, 
  Eye, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ProcessedFileItem, ToolId } from '../../types';
import { formatBytes, downloadFile } from '../../utils/imageProcessor';
import { useI18n } from '../../i18n/context';

interface FileItemProps {
  key?: string;
  item: ProcessedFileItem;
  toolId: ToolId;
  onRemove: (id: string) => void;
  onInspect: (item: ProcessedFileItem) => void;
}

export function FileItem({ item, toolId, onRemove, onInspect }: FileItemProps) {
  const { t } = useI18n();
  const isDone = item.status === 'done';
  const isProcessing = item.status === 'processing' || item.status === 'reading';
  const isError = item.status === 'error';

  // Format labels
  const getFormatLabel = (mime: string | null) => {
    if (!mime) return '';
    if (mime.includes('webp')) return 'WebP';
    if (mime.includes('jpeg') || mime.includes('jpg')) return 'JPG';
    if (mime.includes('png')) return 'PNG';
    if (mime.includes('avif')) return 'AVIF';
    return mime.split('/')[1]?.toUpperCase() || '';
  };

  const originalFormat = getFormatLabel(item.originalType);
  const resultFormat = getFormatLabel(item.resultType);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3.5 sm:p-4 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-colors">
      
      {/* Left: Thumbnail and file metadata */}
      <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
        {/* Thumbnail with overlay status */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800">
          <img
            src={item.previewUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Text details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100" title={item.name}>
              {item.name}
            </p>
            {isDone && (
              <span className="hidden sm:inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                {t('fileItem.done')}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            {/* Dimensions */}
            <span>
              {item.originalWidth}×{item.originalHeight}
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            
            {/* Tool specific format or size display */}
            {toolId === 'convert' ? (
              <span className="font-mono text-stone-700 dark:text-stone-300 font-medium">
                {originalFormat} → {resultFormat || '...'}
              </span>
            ) : (
              <span>{formatBytes(item.originalSize)}</span>
            )}

            {/* Error message */}
            {isError && (
              <span className="text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3" />
                {t('fileItem.processingFailed')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle/Right: Result Metrics & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100 dark:border-stone-800">
        
        {/* Processing Badge */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 font-medium animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-700 dark:text-stone-300" />
            <span>{t('fileItem.processingInBrowser')}</span>
          </div>
        )}

        {/* Completed Metrics */}
        {isDone && (
          <div className="flex items-center gap-3">
            {/* Size comparison */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-stone-400 dark:text-stone-500 line-through">
                  {formatBytes(item.originalSize)}
                </span>
                <ArrowRight className="h-3 w-3 text-stone-400 dark:text-stone-500" />
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {item.resultSize ? formatBytes(item.resultSize) : '—'}
                </span>
              </div>

              {/* Savings % */}
              {item.savedPercentage !== null && (
                <div className="text-[11px] font-semibold">
                  {item.savedPercentage > 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800">
                      {t('fileItem.percentSmaller', { percent: item.savedPercentage })}
                    </span>
                  ) : (
                    <span className="text-stone-500 dark:text-stone-400">{t('fileItem.originalQuality')}</span>
                  )}
                </div>
              )}
            </div>

            {/* Inspect / Preview Button */}
            <button
              type="button"
              onClick={() => onInspect(item)}
              title={t('fileItem.inspectTitle')}
              className="rounded-lg border border-stone-200 dark:border-stone-700 p-2 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={() => downloadFile(item)}
              title={t('fileItem.downloadTitle')}
              className="flex items-center gap-1 rounded-lg bg-stone-900 dark:bg-stone-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('fileItem.saveBtn')}</span>
            </button>
          </div>
        )}

        {/* Remove file button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          title={t('fileItem.removeTitle')}
          className="rounded-lg p-2 text-stone-400 dark:text-stone-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
}

