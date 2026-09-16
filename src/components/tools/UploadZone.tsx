import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Image as ImageIcon, ShieldCheck, Sparkles, FolderUp } from 'lucide-react';
import { createSamplePhoto } from '../../utils/imageProcessor';
import { useI18n } from '../../i18n/context';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string;
  isCompact?: boolean;
}

export function UploadZone({
  onFilesSelected,
  acceptedFormats = 'image/jpeg,image/png,image/webp,image/avif',
  isCompact = false
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  // Support clipboard paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        onFilesSelected(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFilesSelected]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const rawFiles: File[] = Array.from(e.dataTransfer.files);
    const files = rawFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      onFilesSelected(files);
      // Reset input value so same files can be re-selected if cleared
      e.target.value = '';
    }
  };

  const handleLoadSample = async (theme: 'mountain' | 'sunset') => {
    try {
      setIsLoadingSample(true);
      const sampleFile = await createSamplePhoto(theme);
      onFilesSelected([sampleFile]);
    } catch (err) {
      console.error('Error generating sample photo:', err);
    } finally {
      setIsLoadingSample(false);
    }
  };

  if (isCompact) {
    return (
      <div
        id="compact-upload-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-center transition-all ${
          isDragging
            ? 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
            : 'border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/70 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-100/50 dark:hover:bg-stone-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats}
          onChange={handleFileInputChange}
          className="hidden"
        />
        <FolderUp className="h-4 w-4 text-stone-500 dark:text-stone-400" />
        <span className="text-xs font-medium">{t('upload.compactDrop')}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        id="upload-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragging
            ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md scale-[1.005]'
            : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 hover:bg-stone-50/60 dark:hover:bg-stone-800/50 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Center Icon */}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-200 ${
            isDragging
              ? 'scale-110 bg-emerald-600 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 group-hover:scale-105 group-hover:bg-stone-200 dark:group-hover:bg-stone-700'
          }`}
        >
          {isDragging ? (
            <UploadCloud className="h-8 w-8 animate-bounce" />
          ) : (
            <ImageIcon className="h-8 w-8 text-stone-700 dark:text-stone-300" />
          )}
        </div>

        {/* Main Text */}
        <div className="mt-5 space-y-1">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 sm:text-xl">
            {isDragging ? t('upload.dragOver') : t('upload.defaultTitle')}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 sm:text-sm">
            {t('upload.subText')}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-stone-900 dark:bg-stone-100 px-5 py-2.5 text-xs font-semibold text-white dark:text-stone-900 shadow-xs group-hover:bg-stone-800 dark:group-hover:bg-white transition-colors pointer-events-none"
          >
            {t('upload.selectBtn')}
          </button>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400 dark:text-stone-500 border-t border-stone-100 dark:border-stone-800 pt-5 w-full max-w-md">
          <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {t('upload.processedLocally')}
          </span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-stone-500 dark:text-stone-400">{t('upload.pasteTip')}</span>
        </div>
      </div>

      {/* Instant Demo / Sample Photo Launcher */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/60 p-3.5 text-xs text-stone-600 dark:text-stone-400 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
          <span>{t('upload.sampleHeader')}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="btn-sample-mountain"
            disabled={isLoadingSample}
            onClick={(e) => {
              e.stopPropagation();
              handleLoadSample('mountain');
            }}
            className="rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1 font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors disabled:opacity-50"
          >
            {isLoadingSample ? t('upload.generating') : t('upload.sampleMountain')}
          </button>
          <button
            type="button"
            id="btn-sample-sunset"
            disabled={isLoadingSample}
            onClick={(e) => {
              e.stopPropagation();
              handleLoadSample('sunset');
            }}
            className="rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1 font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors disabled:opacity-50"
          >
            {isLoadingSample ? t('upload.generating') : t('upload.sampleSunset')}
          </button>
        </div>
      </div>
    </div>
  );
}

