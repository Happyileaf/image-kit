import { ProcessedFileItem, ToolId } from '../../types';
import { FileItem } from './FileItem';
import { useI18n } from '../../i18n/context';

interface FileListProps {
  items: ProcessedFileItem[];
  toolId: ToolId;
  onRemove: (id: string) => void;
  onInspect: (item: ProcessedFileItem) => void;
}

export function FileList({ items, toolId, onRemove, onInspect }: FileListProps) {
  const { t } = useI18n();
  if (items.length === 0) return null;

  const completedCount = items.filter((it) => it.status === 'done').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          {t('fileList.loadedImages', { count: items.length })}
        </h3>
        <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
          {t('fileList.optimizedCount', { completed: completedCount, total: items.length })}
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <FileItem
            key={item.id}
            item={item}
            toolId={toolId}
            onRemove={onRemove}
            onInspect={onInspect}
          />
        ))}
      </div>
    </div>
  );
}

